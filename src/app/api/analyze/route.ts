// ============================================
// CM POLICY HUB - ANALYZE API ROUTE
// Endpoint de análise com Gemini AI
// ============================================

import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { PolicyId, ActionType, Severity } from "@/lib/types";
import { getReadyPolicies, getAllReadyPolicyContent } from "@/data/policies";

// ============================================
// TYPES
// ============================================

interface AnalyzeRequestBody {
  text: string;
  options?: {
    useAI?: boolean;
    enabledPolicies?: PolicyId[];
    market?: string;
    includeDebugInfo?: boolean;
    includePolicyContext?: boolean;
  };
}

interface GeminiResponse {
  hasViolation: boolean;
  policy: PolicyId | null;
  policyName: string | null;
  category: string | null;
  subcategory: string | null;
  severity: Severity | null;
  shouldEscalate: boolean;
  confidence: number;
  reasoning: string;
  suggestedLabel: string | null;
  suggestedAction: ActionType;
  exceptionsDetected: string[];
  ambiguityNotes: string | null;
  hierarchyPosition?: number;
}

// ============================================
// BUILD COMPREHENSIVE PROMPT
// ============================================

function buildAnalysisPrompt(text: string, includePolicyContext: boolean): string {
  const readyPolicies = getReadyPolicies();
  const policyList = readyPolicies.map((p) => `${p.id}: ${p.name}`).join("\n");
  
  // Base prompt
  let prompt = `Você é um especialista em moderação de conteúdo. Analise o seguinte texto para identificar violações das políticas de moderação.

## POLÍTICAS ATIVAS (${readyPolicies.length} de 27)
${policyList}

## HIERARQUIA DE PRIORIDADE (da mais alta para a mais baixa)
1. CSEAN - Child Sexual Exploitation, Abuse, and Nudity (SEMPRE prioridade máxima)
2. V&I - Violence and Incitement (ameaças credíveis)
3. ASE - Adult Sexual Exploitation
4. B&H - Bullying and Harassment
5. SSPx - Sexual Solicitation
6. ANSA - Adult Nudity

## CRITÉRIOS DE ESCALAÇÃO
ESCALATE (requer ação imediata) quando:

### CSEAN - SEMPRE ESCALAR:
- CSAM (Material de Abuso Sexual Infantil) real ou aparente
- Solicitação de CSAM ou conteúdo sexual de menores
- Interações Inapropriadas com Crianças (IIC)
- Sextortion envolvendo menores
- Qualquer sexualização de crianças

### V&I - ESCALAR quando TODOS presentes:
- Target identificável (pessoa: "te", "você", nome; grupo; local)
- Intent declarada ("vou", "vamos", "gonna", "I will")
- Method HIGH-SEVERITY (matar, assassinar, esfaquear, atirar, etc.)
- MAIS pelo menos 1 de: Timing ("amanhã", "hoje"), Armament ("com faca"), Location ("na tua casa")

EXEMPLOS V&I - ESCALATE:
- "Vou te matar amanhã" → Target(te) + Intent(vou) + Method(matar) + Timing(amanhã) = ESCALATE
- "Vou te matar com uma faca" → Target + Intent + Method + Armament = ESCALATE
- "Vou te matar na escola" → Target + Intent + Method + Location = ESCALATE

EXEMPLOS V&I - LABEL (não escalate):
- "Vou te matar" → Falta Timing/Armament/Location = LABEL (não escalate)
- "Quero que morras" → Aspirational, não Intent = LABEL

### ASE - ESCALAR quando:
- Sextortion ativa
- NCII (Non-Consensual Intimate Imagery) com ameaça
- Ameaças de violação credíveis

### B&H - ESCALAR quando:
- Calls for death (incitamento ao suicídio/morte)
- Calls for SSI (self-harm)
- Ameaças credíveis a pessoas privadas

## EXCEÇÕES (reduzem severidade ou anulam violação)
- Contexto de auto-defesa
- Arrependimento/redenção no texto
- Condenação explícita da violência
- Contexto hipotético/ficcional (filmes, jogos, livros)
- Contexto educacional/jornalístico
- Contexto artístico
- Sátira/humor evidente
- Contexto de review de negócio/serviço (B&H)
- Contexto de endearment/carinho (B&H)
- Contexto médico (ANSA, CSEAN)
- Contexto familiar apropriado (CSEAN)

## REGRAS ESPECÍFICAS

### CSEAN - Segurança Infantil:
- Qualquer pessoa <18 anos é considerada menor
- "Real ou não-real" - arte, desenhos, IA, cartoons também violam
- Age buckets: Baby (0-1.5), Toddler (1.5-4), Minor (4-18)
- Se incerto se adulto/menor → assumir MENOR
- Códigos CSAM: cheese pizza, CP, 🍕, MAP, pedobait, teen packs
- IIC requer "purposeful exposure" em superfícies públicas
- Sextortion inclui ameaças com conteúdo real OU gerado por IA

### V&I - Violência:
- HIGH-SEVERITY: matar, assassinar, esfaquear, decapitar, esquartejar, atirar, enforcar
- MID-SEVERITY: bater, espancar, agredir, partir a cara
- "matar" É o method - não precisa de mais especificação
- Fórmula ESCALATE: Target + Intent + Method(high) + (Timing OU Armament OU Location)
- Se faltar Timing/Armament/Location = LABEL, não escalate

### B&H - Bullying:
- 4 tiers de proteção: Public Figure, LSPF, Private Adult, Private Minor
- Name/Face Match necessário para certas violações
- Menores têm proteção extra (sem cursing feminino, alegações criminais)
- Contexto de endearment entre amigos = exceção
- Business reviews legítimos = exceção

### ASE/SSPx/ANSA - Conteúdo Sexual Adulto:
- ASE: não-consensual, exploração, coerção
- SSPx: solicitação, prostituição, linguagem explícita
- ANSA: nudez e atividade sexual (com contextos permitidos)
- Contextos permitidos: médico, artístico, educacional, amamentação
`;

  // Add full policy context if requested (for complex cases)
  if (includePolicyContext) {
    const policyContent = getAllReadyPolicyContent();
    if (policyContent) {
      prompt += `\n\n## DOCUMENTAÇÃO COMPLETA DAS POLÍTICAS\n${policyContent.substring(0, 15000)}...`;
    }
  }

  // Add the text to analyze and response format
  prompt += `

## TEXTO PARA ANÁLISE
"""
${text}
"""

## FORMATO DE RESPOSTA
Responda APENAS com JSON puro. NÃO use markdown, NÃO use backticks (\`\`\`).

{
  "hasViolation": boolean,
  "policy": "${readyPolicies.map((p) => p.id).join('" | "')}" | null,
  "policyName": string | null,
  "category": string | null,
  "subcategory": string | null,
  "severity": "critical" | "high" | "mid" | "low" | null,
  "shouldEscalate": boolean,
  "confidence": number (0-100),
  "reasoning": string (máximo 100 palavras),
  "suggestedLabel": string | null,
  "suggestedAction": "escalate" | "label" | "no_action",
  "exceptionsDetected": [],
  "ambiguityNotes": null
}

REGRAS:
- Se não houver violação: hasViolation=false, action="no_action"
- CSEAN tem SEMPRE prioridade
- reasoning: máximo 2 frases curtas
- exceptionsDetected: array vazio se nenhuma
- Responda SOMENTE o JSON, nada mais`;

  return prompt;
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

    // Initialize Gemini
    const ai = new GoogleGenAI({ apiKey });

    // Build prompt
    const includePolicyContext = options.includePolicyContext ?? false;
    const prompt = buildAnalysisPrompt(text, includePolicyContext);

    // Call Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.1, // Low temperature for consistent analysis
        maxOutputTokens: 4096, // Increased for complete JSON responses
      },
    });

    let responseText = response.text || "";

    // Remove markdown code blocks if present
    responseText = responseText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    // Parse JSON response - handle potential truncation
    let jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    // If JSON seems truncated, try to fix common issues
    if (jsonMatch) {
      let jsonStr = jsonMatch[0];
      
      // Check if JSON is complete (ends with })
      const openBraces = (jsonStr.match(/\{/g) || []).length;
      const closeBraces = (jsonStr.match(/\}/g) || []).length;
      
      if (openBraces > closeBraces) {
        // JSON is truncated, try to complete it
        console.warn("Truncated JSON detected, attempting to fix...");
        
        // Remove incomplete array at the end
        jsonStr = jsonStr.replace(/,\s*\[[^\]]*$/, ', []');
        // Remove incomplete key-value
        jsonStr = jsonStr.replace(/,\s*"[^"]*"?\s*:?\s*"?[^"]*$/, '');
        // Fix incomplete string value
        jsonStr = jsonStr.replace(/:\s*"[^"]*$/, ': ""');
        // Fix missing value after colon
        jsonStr = jsonStr.replace(/:\s*$/, ': null');
        
        // Add missing closing braces
        const newOpenBraces = (jsonStr.match(/\{/g) || []).length;
        const newCloseBraces = (jsonStr.match(/\}/g) || []).length;
        for (let i = 0; i < newOpenBraces - newCloseBraces; i++) {
          jsonStr += '}';
        }
      }
      
      jsonMatch[0] = jsonStr;
    }
    
    if (!jsonMatch) {
      console.error("Invalid Gemini response:", responseText);
      return NextResponse.json(
        {
          error: "Resposta inválida da IA - não foi possível extrair JSON",
          raw: options.includeDebugInfo ? responseText : undefined,
        },
        { status: 500 }
      );
    }

    let analysis: GeminiResponse;
    try {
      analysis = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return NextResponse.json(
        {
          error: "Erro ao processar resposta da IA",
          raw: options.includeDebugInfo ? jsonMatch[0] : undefined,
        },
        { status: 500 }
      );
    }

    // Validate and sanitize response
    const validatedAnalysis: GeminiResponse = {
      hasViolation: Boolean(analysis.hasViolation),
      policy: analysis.policy || null,
      policyName: analysis.policyName || null,
      category: analysis.category || null,
      subcategory: analysis.subcategory || null,
      severity: analysis.severity || null,
      shouldEscalate: Boolean(analysis.shouldEscalate),
      confidence: Math.max(0, Math.min(100, Number(analysis.confidence) || 0)),
      reasoning: String(analysis.reasoning || "Sem análise disponível"),
      suggestedLabel: analysis.suggestedLabel || null,
      suggestedAction: analysis.suggestedAction || "no_action",
      exceptionsDetected: Array.isArray(analysis.exceptionsDetected)
        ? analysis.exceptionsDetected
        : [],
      ambiguityNotes: analysis.ambiguityNotes || null,
    };

    // Calculate processing time
    const processingTime = Date.now() - startTime;

    // Return response
    return NextResponse.json({
      success: true,
      analysis: validatedAnalysis,
      processingTime,
      debug: options.includeDebugInfo
        ? {
            promptLength: prompt.length,
            responseLength: responseText?.length || 0,
            model: "gemini-2.5-flash",
          }
        : undefined,
    });
  } catch (error: unknown) {
    console.error("Analysis error:", error);
    
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido na análise";
    
    // Check for specific Gemini errors
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
  const readyPolicies = getReadyPolicies();
  
  return NextResponse.json({
    status: "ok",
    service: "CM Policy Hub Analysis API",
    version: "2.0.0",
    policies: {
      total: 27,
      ready: readyPolicies.length,
      list: readyPolicies.map((p) => ({
        id: p.id,
        name: p.shortName,
      })),
    },
    model: "gemini-2.5-flash",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
}