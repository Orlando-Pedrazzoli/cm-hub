// ============================================
// CM POLICY HUB - ENHANCED ANALYZE API ROUTE
// Endpoint de análise com Gemini AI
// Usa keyword-loader para carregar keywords dinamicamente
// v4.1.0
// ============================================

import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import buildEnhancedPrompt, {
  PreAnalysisContext,
  SSIEDPreChecks,
  BHPreChecks,
} from "@/lib/enhanced-prompt-builder";
import {
  PolicyId,
  Severity,
  KeywordMatch,
  VIChecks,
  DetectedExceptions,
} from "@/lib/types";
import { findKeywordsInText, getKeywordStats } from "@/lib/keyword-loader";

// ============================================
// TYPES
// ============================================

interface AnalyzeRequestBody {
  text: string;
  options?: {
    useAI?: boolean;
    includeDebugInfo?: boolean;
  };
}

interface DecisionTreeResponse {
  action: "no_action" | "escalate" | "label";
  decisionPath: string[];
  terminalNodeId: string;
  fullLabel: string;
  confidence: number;
  reasoning: string;
  shouldEscalate: boolean;
  escalationReason?: string;
}

// ============================================
// TEXT UTILITIES
// ============================================

function detectLanguage(text: string): "pt" | "en" | "multi" {
  const ptPatterns = /\b(você|voce|não|nao|está|são|também|porque|já|obrigado|olá|boa|bom)\b/i;
  const enPatterns = /\b(the|is|are|was|have|has|will|would|could|hello|thank|please)\b/i;
  
  const hasPt = ptPatterns.test(text);
  const hasEn = enPatterns.test(text);
  
  if (hasPt && hasEn) return "multi";
  if (hasPt) return "pt";
  return "en";
}

// ============================================
// EXCEPTION DETECTION
// ============================================

function detectExceptions(text: string): DetectedExceptions {
  const lower = text.toLowerCase();
  const detected: string[] = [];

  const checks = {
    hasSelfDefense: /\b(defesa|defender|proteger|self.?defense|legítima defesa)\b/i.test(lower),
    hasRedemption: /\b(arrependo|desculpa|perdão|sorry|regret|me arrependo)\b/i.test(lower),
    hasCondemning: /\b(é errado|não se deve|condenamos|wrong|condemn|vergonha)\b/i.test(lower),
    hasHypothetical: /\b(se eu fosse|imagine|ficção|filme|série|jogo|game|movie|fiction|hipotético)\b/i.test(lower),
    hasEducational: /\b(educação|ensino|academic|education|study|universidade|escola)\b/i.test(lower),
    hasNewsReporting: /\b(notícia|reportagem|news|report|journalism|jornal|g1|folha)\b/i.test(lower),
    hasArtisticContext: /\b(arte|artístico|música|letra|artistic|lyrics|poesia|poema)\b/i.test(lower),
    hasSatire: /\b(sátira|ironia|piada|satire|joke|parody|meme|comédia)\b/i.test(lower),
    hasEndearingContext: /\b(meu amor|querido|amigo|brincadeira|friend|dear|carinho)\b/i.test(lower),
    hasCriminalAllegation: /\b(polícia|tribunal|police|court|lawsuit|processo|crime)\b/i.test(lower),
    hasBusinessReview: /\b(review|avaliação|estrelas|stars|serviço|atendimento)\b/i.test(lower),
    hasFightSportContext: /\b(mma|ufc|boxe|boxing|luta|fight|wrestling|jiu.?jitsu)\b/i.test(lower),
    hasMedicalContext: /\b(médico|medicina|doctor|medical|health|hospital|tratamento)\b/i.test(lower),
    hasFamilyContext: /\b(filho|filha|bebé|família|son|daughter|baby|family|mãe|pai)\b/i.test(lower),
    hasRecoveryContext: /\b(recuperação|recovery|superando|overcame|em tratamento|sobriety)\b/i.test(lower),
    hasAwarenessContext: /\b(conscientização|awareness|prevenção|prevention|ajuda|help)\b/i.test(lower),
    hasBrickAndMortar: /\b(loja|store|shop|site oficial|official|retail)\b/i.test(lower),
    hasReligiousContext: /\b(ramadan|quaresma|jejum religioso|religious|oração|prayer)\b/i.test(lower),
    hasFictionalContext: /\b(filme|movie|série|series|tv show|novela|livro|book|jogo|game)\b/i.test(lower),
  };

  // Collect detected exceptions
  if (checks.hasSelfDefense) detected.push("Self-defense");
  if (checks.hasRedemption) detected.push("Redemption");
  if (checks.hasCondemning) detected.push("Condemning");
  if (checks.hasHypothetical) detected.push("Hypothetical/Fiction");
  if (checks.hasEducational) detected.push("Educational");
  if (checks.hasNewsReporting) detected.push("News Reporting");
  if (checks.hasArtisticContext) detected.push("Artistic Context");
  if (checks.hasSatire) detected.push("Satire/Humor");
  if (checks.hasEndearingContext) detected.push("Endearing Context");
  if (checks.hasCriminalAllegation) detected.push("Criminal Allegation");
  if (checks.hasBusinessReview) detected.push("Business Review");
  if (checks.hasFightSportContext) detected.push("Fight/Sport Context");
  if (checks.hasMedicalContext) detected.push("Medical Context");
  if (checks.hasFamilyContext) detected.push("Family Context");
  if (checks.hasRecoveryContext) detected.push("Recovery Context");
  if (checks.hasAwarenessContext) detected.push("Awareness/Prevention");
  if (checks.hasBrickAndMortar) detected.push("Brick-and-Mortar");
  if (checks.hasReligiousContext) detected.push("Religious Context");
  if (checks.hasFictionalContext) detected.push("Fictional Context");

  return { ...checks, detected };
}

// ============================================
// POLICY-SPECIFIC CHECKS
// ============================================

function performVIChecks(text: string, keywords: KeywordMatch[]): VIChecks {
  const viKeywords = keywords.filter((k) => k.policy === "vi");
  const lower = text.toLowerCase();
  
  const hasTarget = /\b(te|você|tu|you|him|her|them|ele|ela|eles)\b/i.test(lower) || 
                   /[A-Z][a-záàâãéèêíïóôõöúç]{2,}/.test(text) ||
                   /@\w+/.test(text);
  const hasIntent = /\b(vou|vamos|gonna|will|going to|irei|farei)\b/i.test(lower);
  const hasTiming = /\b(amanhã|hoje|às?\s*\d|daqui\s+a|tomorrow|today|tonight|agora|now)\b/i.test(lower);
  const hasArmament = viKeywords.some((k) => 
    k.category.toLowerCase().includes("armament") ||
    k.category.toLowerCase().includes("weapon")
  ) || /\b(arma|faca|pistola|gun|knife|weapon|espingarda|rifle)\b/i.test(lower);
  const hasLocation = /\b(escola|trabalho|casa|escritório|school|work|home|office|igreja|church)\b/i.test(lower);
  const hasMethod = viKeywords.some((k) => 
    k.category.toLowerCase().includes("hsv") ||
    k.category.toLowerCase().includes("threat") ||
    k.category.toLowerCase().includes("death") ||
    k.severity === "critical"
  );
  
  const isCredibleThreat = hasTarget && hasIntent && hasMethod && 
                          (hasTiming || hasArmament || hasLocation);

  return { 
    hasTarget, 
    hasIntent, 
    hasTiming, 
    hasArmament, 
    hasLocation, 
    hasMethod, 
    isCredibleThreat,
  };
}

function performSSIEDChecks(text: string, keywords: KeywordMatch[]): SSIEDPreChecks {
  const ssiedKeywords = keywords.filter((k) => k.policy === "ssied" || k.policy === "cis");
  const lower = text.toLowerCase();
  
  const hasSuicideContent = ssiedKeywords.some((k) => 
    k.category.toLowerCase().includes("suicide") ||
    k.category.toLowerCase().includes("suicídio")
  );
  const hasSelfInjuryContent = ssiedKeywords.some((k) => 
    k.category.toLowerCase().includes("self") ||
    k.category.toLowerCase().includes("injury") ||
    k.category.toLowerCase().includes("cutting")
  );
  const hasEDContent = ssiedKeywords.some((k) => 
    k.category.toLowerCase().includes("eating") ||
    k.category.toLowerCase().includes("ed") ||
    k.category.toLowerCase().includes("anorex") ||
    k.category.toLowerCase().includes("bulim")
  );
  
  const hasPromotionSignals = ssiedKeywords.some((k) => 
    k.category.toLowerCase().includes("promotion") ||
    k.category.toLowerCase().includes("incitement")
  ) || /\b(thinspo|bonespo|proana|promia|edtips|anabuddy)\b/i.test(lower);
  
  const hasViralEvent = /\b(blue whale|baleia azul|momo challenge|jonathan galindo)\b/i.test(lower);
  
  // CIS Detection
  const cisHasExplicitIntent = ssiedKeywords.some((k) => 
    k.category.toLowerCase().includes("intent") ||
    k.category.toLowerCase().includes("note")
  ) || /\b(vou me matar|i will kill myself|going to end it|this is goodbye|carta de suicídio|suicide note)\b/i.test(lower);
  
  const cisHasCapability = ssiedKeywords.some((k) => 
    k.category.toLowerCase().includes("method")
  ) || /\b(pílulas|pills|arma|gun|corda|rope|ponte|bridge|prédio|building|veneno|poison)\b/i.test(lower);
  
  const cisHasImminence = /\b(agora|now|hoje|today|tonight|esta noite|amanhã|tomorrow|daqui a pouco|soon)\b/i.test(lower);
  
  const isCIS = cisHasExplicitIntent && cisHasCapability && cisHasImminence;
  
  // ED Signal Type
  let edSignalType: SSIEDPreChecks["edSignalType"] = "none";
  if (hasPromotionSignals) edSignalType = "promotion";
  else if (hasEDContent) edSignalType = "context";
  else if (/\b(dieta|diet|emagrecer|weight loss|fitness)\b/i.test(lower)) edSignalType = "benign";

  return {
    hasSuicideContent,
    hasSelfInjuryContent,
    hasEDContent,
    cisHasExplicitIntent,
    cisHasCapability,
    cisHasImminence,
    isCIS,
    hasPromotionSignals,
    hasViralEvent,
    edSignalType,
  };
}

function performBHChecks(text: string, keywords: KeywordMatch[]): BHPreChecks {
  const lower = text.toLowerCase();
  const hasTarget = /\b(te|você|@\w+|tu|seu|sua|you|your)\b/i.test(lower);
  
  let targetType: BHPreChecks["targetType"] = "unknown";
  if (/\b(presidente|ministro|celebridade|president|celebrity|famoso|1M|milhão de seguidores)\b/i.test(lower)) {
    targetType = "public_figure";
  } else if (/\b(ativista|jornalista|activist|journalist)\b/i.test(lower)) {
    targetType = "lspf";
  } else if (/\b(criança|menor|filho|kid|child|minor)\b/i.test(lower)) {
    targetType = "private_minor";
  } else if (hasTarget) {
    targetType = "private_adult";
  }

  const hasPurposefulExposure = /@\w+/.test(text);
  
  // Determine attack type and tier
  const bhKeywords = keywords.filter((k) => k.policy === "bh");
  let attackType: string | null = null;
  let tier: BHPreChecks["tier"] = null;
  
  if (bhKeywords.some(k => k.category.toLowerCase().includes("death") || k.category.toLowerCase().includes("calls"))) {
    attackType = "Calls for death";
    tier = 1;
  } else if (bhKeywords.some(k => k.category.toLowerCase().includes("sexual"))) {
    attackType = "Sexualized harassment";
    tier = 1;
  } else if (bhKeywords.some(k => k.category.toLowerCase().includes("dehumaniz"))) {
    attackType = "Dehumanizing comparison";
    tier = 2;
  } else if (bhKeywords.some(k => k.category.toLowerCase().includes("physical"))) {
    attackType = "Negative physical description";
    tier = 2;
  } else if (bhKeywords.some(k => k.category.toLowerCase().includes("character") || k.category.toLowerCase().includes("insult"))) {
    attackType = "Negative character claim";
    tier = 3;
  }

  return {
    hasTarget,
    targetType,
    hasPurposefulExposure,
    attackType,
    tier,
  };
}

// ============================================
// BUILD PRE-ANALYSIS CONTEXT
// Uses keyword-loader for keyword detection
// ============================================

function buildPreAnalysisContext(text: string): PreAnalysisContext {
  // Use keyword-loader to find keywords (loads from JSON files)
  const detectedKeywords = findKeywordsInText(text);
  const exceptions = detectExceptions(text);
  const language = detectLanguage(text);
  
  // Log keyword stats on first run
  const stats = getKeywordStats();
  console.log(`📊 Pre-analysis using ${stats.total} keywords from ${Object.keys(stats).length - 5} policies`);
  
  // Determine candidate policies from keywords
  const policyCounts: Record<PolicyId, number> = {} as Record<PolicyId, number>;
  detectedKeywords.forEach(kw => {
    policyCounts[kw.policy] = (policyCounts[kw.policy] || 0) + 1;
    // Weight critical keywords more
    if (kw.severity === "critical") {
      policyCounts[kw.policy] += 2;
    } else if (kw.severity === "high") {
      policyCounts[kw.policy] += 1;
    }
  });
  
  const candidatePolicies = Object.entries(policyCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([policy]) => policy as PolicyId);
  
  const primaryCandidate = candidatePolicies[0] || null;
  
  // Perform policy-specific checks
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
      Array.isArray(parsed.decisionPath) &&
      typeof parsed.fullLabel === "string" &&
      typeof parsed.confidence === "number" &&
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

    // PHASE 1: Pre-Analysis (uses keyword-loader)
    const preAnalysis = buildPreAnalysisContext(text);
    
    console.log(`🔍 Pre-analysis found ${preAnalysis.detectedKeywords.length} keywords`);
    console.log(`📋 Candidate policies: ${preAnalysis.candidatePolicies.join(", ") || "none"}`);
    
    // Check for immediate escalations (CIS)
    if (preAnalysis.ssiedChecks?.isCIS) {
      console.log("⚠️ CIS detected in pre-analysis - will likely escalate");
    }
    
    // PHASE 2: Build Enhanced Prompt
    const prompt = buildEnhancedPrompt(preAnalysis);

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
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
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
      decisionPath: Array.isArray(analysis.decisionPath) ? analysis.decisionPath : [],
      terminalNodeId: String(analysis.terminalNodeId || "unknown"),
      fullLabel: String(analysis.fullLabel || "Unknown"),
      confidence: Math.max(0, Math.min(100, Number(analysis.confidence) || 0)),
      reasoning: String(analysis.reasoning || "Sem análise disponível"),
      shouldEscalate: Boolean(analysis.shouldEscalate),
      escalationReason: analysis.escalationReason ? String(analysis.escalationReason) : undefined,
    };

    // Calculate processing time
    const processingTime = Date.now() - startTime;

    // Return enhanced response
    return NextResponse.json({
      success: true,
      analysis: validatedAnalysis,
      preAnalysis: {
        keywords: preAnalysis.detectedKeywords,
        candidatePolicies: preAnalysis.candidatePolicies,
        primaryCandidate: preAnalysis.primaryCandidate,
        exceptions: preAnalysis.exceptions.detected,
        viChecks: preAnalysis.viChecks,
        ssiedChecks: preAnalysis.ssiedChecks,
        bhChecks: preAnalysis.bhChecks,
        language: preAnalysis.language,
      },
      processingTime,
      debug: options.includeDebugInfo
        ? {
            promptLength: prompt.length,
            responseLength: responseText?.length || 0,
            model: "gemini-2.5-flash",
            keywordStats: getKeywordStats(),
          }
        : undefined,
    });
  } catch (error: unknown) {
    console.error("Analysis error:", error);
    
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido na análise";
    
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
  const stats = getKeywordStats();
  
  return NextResponse.json({
    status: "ok",
    service: "CM Policy Hub Analysis API",
    version: "4.1.0",
    features: {
      enhancedPrompt: true,
      preAnalysis: true,
      contextInjection: true,
      dynamicKeywordLoading: true,
      aiModel: "gemini-2.5-flash",
      maxTokens: 4096,
    },
    keywordStats: stats,
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
}