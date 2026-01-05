// ============================================
// CM POLICY HUB - ENHANCED ANALYZE API ROUTE
// v4.4.0 - REFATORADO
// 
// MUDANÇAS v4.4.0:
// - Usa policy-checks.ts para funções compartilhadas
// - Elimina código duplicado com analyzer.ts
// - Usa clarifications-unified.json (159 clarificações)
// ============================================

import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import buildEnhancedPrompt, {
  PreAnalysisContext,
  quickNoActionCheck,
} from "@/lib/enhanced-prompt-builder";
import {
  PolicyId,
  KeywordMatch,
} from "@/lib/types";
import { 
  findKeywordsInText, 
  getKeywordStats, 
  detectThreatPatterns,
} from "@/lib/keyword-loader";
import {
  getClarificationStats,
} from "@/lib/clarification-loader";

// ⭐ NOVO: Importar funções compartilhadas
import {
  detectLanguage,
  detectExceptions,
  performVIChecks,
  performSSIEDChecks,
  performBHChecks,
} from "@/lib/policy-checks";

// ============================================
// TYPES
// ============================================

interface AnalyzeRequestBody {
  text: string;
  options?: {
    useAI?: boolean;
    includeDebugInfo?: boolean;
    skipQuickCheck?: boolean;
  };
}

interface DecisionTreeResponse {
  action: "no_action" | "escalate" | "label";
  primaryPolicy?: string;
  primaryPolicyName?: string;
  decisionPath: string[];
  terminalNodeId: string;
  fullLabel: string;
  confidence: number;
  reasoning: string;
  shouldEscalate: boolean;
  escalationReason?: string;
  appliedClarification?: string;
}

// ============================================
// BUILD PRE-ANALYSIS CONTEXT
// ⭐ Agora usa funções de policy-checks.ts
// ============================================

function buildPreAnalysisContext(text: string): PreAnalysisContext {
  // Use keyword-loader v2 (com aliases)
  const detectedKeywords = findKeywordsInText(text) || [];
  
  // ⭐ Usar funções de policy-checks.ts
  const exceptions = detectExceptions(text);
  const language = detectLanguage(text);
  
  // detectThreatPatterns retorna { pattern: string; type: string; }[]
  let threatPatterns: { pattern: string; type: string; }[] = [];
  try {
    if (typeof detectThreatPatterns === 'function') {
      threatPatterns = detectThreatPatterns(text) || [];
    }
  } catch {
    threatPatterns = [];
  }

  // Log stats
  try {
    const keywordStats = getKeywordStats();
    console.log(`📊 Pre-analysis using ${keywordStats.total} keywords (${keywordStats.aliases} aliases)`);
    console.log(`📊 Excluded terms: ${keywordStats.excludedTerms}, Threat patterns: ${keywordStats.threatPatterns}`);
  } catch {
    console.log(`📊 Keyword stats not available`);
  }

  // Log clarification stats
  try {
    const clarificationStats = getClarificationStats();
    console.log(`📚 Clarifications loaded: ${clarificationStats.total} across ${Object.keys(clarificationStats.byPolicy).length} policies`);
  } catch (e) {
    console.log(`📚 Clarifications: Not loaded (${e})`);
  }

  // Determine candidate policies from keywords
  const policyCounts: Record<PolicyId, number> = {} as Record<PolicyId, number>;
  detectedKeywords.forEach((kw) => {
    policyCounts[kw.policy] = (policyCounts[kw.policy] || 0) + 1;
    // Weight by severity
    if (kw.severity === "critical") {
      policyCounts[kw.policy] += 3;
    } else if (kw.severity === "high") {
      policyCounts[kw.policy] += 2;
    } else if (kw.severity === "mid") {
      policyCounts[kw.policy] += 1;
    }
  });

  const candidatePolicies = Object.entries(policyCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([policy]) => policy as PolicyId);

  const primaryCandidate = candidatePolicies[0] || null;

  // ⭐ Usar funções de policy-checks.ts
  const viChecks = performVIChecks(text, detectedKeywords);
  const ssiedChecks = performSSIEDChecks(text, detectedKeywords);
  const bhChecks = performBHChecks(text, detectedKeywords);

  return {
    text,
    detectedKeywords,
    candidatePolicies,
    primaryCandidate,
    exceptions,
    viChecks,
    ssiedChecks,
    bhChecks,
    language,
    threatPatterns,
  };
}

// ============================================
// VALIDATE JSON COMPLETENESS
// ============================================

function isJSONComplete(jsonStr: string): boolean {
  try {
    const parsed = JSON.parse(jsonStr);
    return (
      typeof parsed.action === "string" &&
      ["no_action", "escalate", "label"].includes(parsed.action) &&
      Array.isArray(parsed.decisionPath) &&
      typeof parsed.fullLabel === "string" &&
      typeof parsed.confidence === "number" &&
      parsed.confidence >= 0 &&
      parsed.confidence <= 100 &&
      typeof parsed.reasoning === "string" &&
      parsed.reasoning.length > 5 &&
      typeof parsed.shouldEscalate === "boolean"
    );
  } catch {
    return false;
  }
}

// ============================================
// API HANDLER
// ============================================

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body: AnalyzeRequestBody = await request.json();
    const { text, options = {} } = body;

    // Validate input
    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Texto é obrigatório e deve ser uma string" },
        { status: 400 }
      );
    }

    if (text.length > 10000) {
      return NextResponse.json(
        { error: "Texto excede o limite de 10.000 caracteres" },
        { status: 400 }
      );
    }

    // Get API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key do Gemini não configurada no servidor" },
        { status: 500 }
      );
    }

    // PHASE 1: Pre-Analysis
    const preAnalysis = buildPreAnalysisContext(text);

    console.log(`🔍 Pre-analysis found ${preAnalysis.detectedKeywords?.length || 0} keywords`);
    console.log(`📋 Candidate policies: ${preAnalysis.candidatePolicies?.join(", ") || "none"}`);
    console.log(`🎯 Threat patterns: ${preAnalysis.threatPatterns?.length || 0}`);

    // Quick clarification check for No Action
    if (!options.skipQuickCheck && preAnalysis.primaryCandidate) {
      const quickCheck = quickNoActionCheck(text, preAnalysis.primaryCandidate);
      
      if (quickCheck.blockedReason) {
        console.log(`🚫 Quick check BLOCKED: ${quickCheck.blockedReason}`);
      }
      
      if (quickCheck.shouldSkipAI) {
        console.log(`⚡ Quick check matched clarification: ${quickCheck.clarificationId}`);
        console.log(`⚡ Skipping AI - returning No Action based on clarification`);
        
        const processingTime = Date.now() - startTime;
        
        return NextResponse.json({
          success: true,
          analysis: {
            action: "no_action" as const,
            primaryPolicy: preAnalysis.primaryCandidate,
            primaryPolicyName: preAnalysis.primaryCandidate.toUpperCase(),
            decisionPath: ["No Action", "Clarification Match"],
            terminalNodeId: "clarification_no_action",
            fullLabel: "No Action > Clarification Match",
            confidence: 95,
            reasoning: quickCheck.reason || "Content matches known No Action clarification pattern",
            shouldEscalate: false,
            appliedClarification: quickCheck.clarificationId,
          },
          preAnalysis: {
            keywords: preAnalysis.detectedKeywords || [],
            candidatePolicies: preAnalysis.candidatePolicies || [],
            primaryCandidate: preAnalysis.primaryCandidate,
            exceptions: preAnalysis.exceptions?.detected || [],
            language: preAnalysis.language,
          },
          processingTime,
          quickCheckApplied: true,
          debug: options.includeDebugInfo
            ? {
                quickCheckReason: quickCheck.reason,
                clarificationId: quickCheck.clarificationId,
                keywordStats: getKeywordStats(),
              }
            : undefined,
        });
      }
    }

    // Check for immediate escalations
    if (preAnalysis.ssiedChecks?.isCIS) {
      console.log("🚨 CIS detected in pre-analysis - will likely escalate");
    }
    if (preAnalysis.viChecks?.isCredibleThreat) {
      console.log("⚠️ Credible threat detected in pre-analysis");
    }

    // PHASE 2: Build Enhanced Prompt
    const prompt = buildEnhancedPrompt(preAnalysis);

    console.log(`📝 Prompt length: ${prompt.length} chars`);

    // Initialize Gemini
    const ai = new GoogleGenAI({ apiKey });

    // Call Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.1,
        maxOutputTokens: 4096,
      },
    });

    let responseText = response.text || "";

    // Remove markdown code blocks
    responseText = responseText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    // Extract JSON
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.error("Invalid Gemini response - no JSON found:", responseText.substring(0, 300));
      return NextResponse.json(
        {
          error: "Resposta inválida da IA - não foi possível extrair JSON",
          raw: options.includeDebugInfo ? responseText.substring(0, 500) : undefined,
        },
        { status: 500 }
      );
    }

    const jsonStr = jsonMatch[0];

    // Validate JSON completeness
    if (!isJSONComplete(jsonStr)) {
      console.error("Invalid Gemini response - JSON incomplete:", jsonStr.substring(0, 300));
      return NextResponse.json(
        {
          error: "Resposta da IA foi truncada. Tente novamente.",
          code: "TRUNCATED_RESPONSE",
          raw: options.includeDebugInfo ? jsonStr.substring(0, 500) : undefined,
        },
        { status: 500 }
      );
    }

    let analysis: DecisionTreeResponse;
    try {
      analysis = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return NextResponse.json(
        {
          error: "Erro ao processar resposta da IA",
          raw: options.includeDebugInfo ? jsonStr.substring(0, 500) : undefined,
        },
        { status: 500 }
      );
    }

    // Validate action
    const validatedAction = ["escalate", "label", "no_action"].includes(analysis.action)
      ? analysis.action
      : "no_action";

    // Build validated response
    const validatedAnalysis: DecisionTreeResponse = {
      action: validatedAction as "no_action" | "escalate" | "label",
      primaryPolicy: analysis.primaryPolicy || preAnalysis.primaryCandidate || undefined,
      primaryPolicyName: analysis.primaryPolicyName || undefined,
      decisionPath: Array.isArray(analysis.decisionPath) ? analysis.decisionPath : [],
      terminalNodeId: String(analysis.terminalNodeId || "unknown"),
      fullLabel: String(analysis.fullLabel || "Unknown"),
      confidence: Math.max(0, Math.min(100, Number(analysis.confidence) || 0)),
      reasoning: String(analysis.reasoning || "Sem análise disponível"),
      shouldEscalate: Boolean(analysis.shouldEscalate),
      escalationReason: analysis.escalationReason ? String(analysis.escalationReason) : undefined,
      appliedClarification: analysis.appliedClarification ? String(analysis.appliedClarification) : undefined,
    };

    // Calculate processing time
    const processingTime = Date.now() - startTime;

    // Return enhanced response
    return NextResponse.json({
      success: true,
      analysis: validatedAnalysis,
      preAnalysis: {
        keywords: preAnalysis.detectedKeywords || [],
        candidatePolicies: preAnalysis.candidatePolicies || [],
        primaryCandidate: preAnalysis.primaryCandidate,
        exceptions: preAnalysis.exceptions?.detected || [],
        viChecks: preAnalysis.viChecks,
        ssiedChecks: preAnalysis.ssiedChecks,
        bhChecks: preAnalysis.bhChecks,
        language: preAnalysis.language,
        threatPatterns: preAnalysis.threatPatterns || [],
      },
      processingTime,
      quickCheckApplied: false,
      debug: options.includeDebugInfo
        ? {
            promptLength: prompt.length,
            responseLength: responseText?.length || 0,
            model: "gemini-2.5-flash",
            keywordStats: getKeywordStats(),
            clarificationStats: (() => {
              try {
                return getClarificationStats();
              } catch {
                return null;
              }
            })(),
          }
        : undefined,
    });
  } catch (error: unknown) {
    console.error("Analysis error:", error);

    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido na análise";

    // Handle specific Gemini errors
    if (errorMessage.includes("SAFETY")) {
      return NextResponse.json(
        {
          error: "O conteúdo foi bloqueado pelos filtros de segurança do Gemini",
          code: "SAFETY_BLOCK",
        },
        { status: 400 }
      );
    }

    if (errorMessage.includes("quota") || errorMessage.includes("rate")) {
      return NextResponse.json(
        {
          error: "Limite de requisições da API excedido. Tente novamente em alguns minutos.",
          code: "RATE_LIMIT",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: errorMessage,
        code: "UNKNOWN_ERROR",
      },
      { status: 500 }
    );
  }
}

// ============================================
// GET - Health check
// ============================================

export async function GET() {
  const keywordStats = getKeywordStats();
  
  let clarificationStats = null;
  try {
    clarificationStats = getClarificationStats();
  } catch {
    clarificationStats = { error: "Not loaded" };
  }

  return NextResponse.json({
    status: "ok",
    service: "CM Policy Hub Analysis API",
    version: "4.4.0", // ⭐ Versão atualizada
    features: {
      enhancedPrompt: true,
      preAnalysis: true,
      contextInjection: true,
      dynamicKeywordLoading: true,
      aliasSupport: true,
      excludedTermsFiltering: true,
      threatPatternDetection: true,
      clarificationIntegration: true,
      quickNoActionCheck: true,
      sharedPolicyChecks: true, // ⭐ NOVO
      unifiedClarifications: true, // ⭐ NOVO
      aiModel: "gemini-2.5-flash",
      maxTokens: 4096,
    },
    keywordStats,
    clarificationStats,
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
}