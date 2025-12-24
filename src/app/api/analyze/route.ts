// ============================================
// CM POLICY HUB - ANALYZE API ROUTE
// Endpoint de análise com Gemini AI
// Segue EXATAMENTE a Decision Tree
// v3.1.0 - Fixed truncation issues
// ============================================

import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

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

// Response that follows decision tree exactly
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
// BUILD DECISION TREE PROMPT
// ============================================

function buildDecisionTreePrompt(text: string): string {
  return `You are an expert content moderator. Analyze the text and follow the decision tree to determine the correct action.

## DECISION TREE

### PHASE 1: MAIN ACTION
1. No Action - Content does not violate any policy
2. Escalate - Content requires immediate escalation
3. Label - Content violates a policy

---

### IF "No Action":
- No - No Action, Benign
- No Action, Implicit Sexualization of Children
- No - DOI Social & Political Discourse Context
- No - No Action, Missing Self-Reporting

---

### IF "Escalate":

**Child Exploitation:** Sextortion | CSAM | CSAM Links | Soliciting Imagery | IIC | Imminent Threat | Non-Sexual Abuse

**Human Trafficking:** Imminent Threat | Minor Sex Trafficking | Sex Trafficking | Organ Trafficking | Other

**Threatening:** Dangerous Individuals/Orgs | Other | Potentially Credible Rape

**Suicide:** Graphic/Promotion | Admission (CIS - Credible Intent of Suicide)

---

### IF "Label":

**SSIED (Suicide, Self-Injury, Eating Disorders)**
- Suicide: Promotion | Graphic | Mocking | Admission | Narratives
- Self-Injury: Promotion | Graphic | Mocking | Admission | Narratives  
- Eating Disorder: Promotion | Graphic | Mocking | Admission | Recovery

**VGC (Violent and Graphic Content)**
- Sadistic Remarks
- Mutilated Humans: Dismemberment | Burned | Throat Slitting | Visible Innards
- Violence/Brutality: Capital Punishment | Violent Death | Brutality
- Human Gore: Objects piercing | Bleeding | Bodily Fluids | Dead body
- Animal: Mutilated | Brutality | Suffering

**VI (Violence and Incitement)**
- Election Violence
- High-severity: Threats | Admissions | Calls for death
- Mid-severity: Threats | Admissions
- Low-severity
- Weapons to HRL
- Other: Services | Weapon instructions | Explosive instructions

**WAE (Weapons, Ammunition, Explosives)**
- Commercial: Machine gun/3D | Firearms | Explosives | Bladed | Non-lethal
- Non-Commercial (P2P sale)

**TA (Tobacco and Alcohol)**
- Tobacco: Sale P2P | Promotion | Consumption
- Alcohol: Sale P2P | Promotion | Consumption
- ENDS/Vape: Sale P2P | Promotion

**BH (Bullying and Harassment)**
- Sexualized | Calls for death | Physical description | Character attacks

**HC (Hateful Conduct)**
- Dehumanizing | Harm statements | Slurs | Exclusion

**Other:** CSEAN | ASE | FSDP | SPAM | CYBER | PV | DP | HW | OGG

---

## ESCALATION CRITERIA

ALWAYS ESCALATE for:
- CSAM (any)
- Credible threats: Target + Intent + Method + (Timing OR Armament OR Location)
- Sextortion
- Suicide CIS: Explicit intent + Capability (method) + Imminence (<24h)

---

## TEXT TO ANALYZE
"""
${text}
"""

## RESPONSE FORMAT
Respond with ONLY valid JSON:

{
  "action": "no_action" | "escalate" | "label",
  "decisionPath": ["Action", "Category", "Subcategory"],
  "terminalNodeId": "unique_node_id",
  "fullLabel": "Action > Category > Subcategory",
  "confidence": 85,
  "reasoning": "Brief explanation (1-2 sentences).",
  "shouldEscalate": false,
  "escalationReason": "Only if escalating"
}`;
}

// ============================================
// VALIDATE JSON COMPLETENESS
// ============================================

function isJSONComplete(jsonStr: string): boolean {
  try {
    const parsed = JSON.parse(jsonStr);
    // Check required fields exist and are complete
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

    // Initialize Gemini
    const ai = new GoogleGenAI({ apiKey });

    // Build prompt
    const prompt = buildDecisionTreePrompt(text);

    // Call Gemini with increased token limit
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.1,
        maxOutputTokens: 4096, // Increased from 2048
      },
    });

    let responseText = response.text || "";

    // Remove markdown code blocks if present
    responseText = responseText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    // Extract JSON
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      console.error("Invalid Gemini response - no JSON found:", responseText.substring(0, 200));
      return NextResponse.json(
        {
          error: "Resposta inválida da IA - não foi possível extrair JSON",
          raw: options.includeDebugInfo ? responseText.substring(0, 500) : undefined,
        },
        { status: 500 }
      );
    }

    const jsonStr = jsonMatch[0];

    // Validate JSON is complete
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

    // Validate and sanitize response
    const validatedAnalysis: DecisionTreeResponse = {
      action: validateAction(analysis.action),
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
// HELPER FUNCTIONS
// ============================================

function validateAction(action: string): "no_action" | "escalate" | "label" {
  if (action === "escalate" || action === "label" || action === "no_action") {
    return action;
  }
  return "no_action";
}

// ============================================
// GET - Health check
// ============================================

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "CM Policy Hub Analysis API",
    version: "3.1.0",
    features: {
      decisionTree: true,
      aiModel: "gemini-2.5-flash",
      maxTokens: 4096,
    },
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
}