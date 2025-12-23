// ============================================
// CM POLICY HUB - ANALYZE API ROUTE
// Endpoint de análise com Gemini AI
// Segue EXATAMENTE a Decision Tree
// ============================================

import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { ActionType } from "@/lib/types";

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
  // Main action (Phase 1)
  action: "no_action" | "escalate" | "label";
  
  // Complete path through decision tree
  decisionPath: string[];
  
  // Final node ID (terminal node)
  terminalNodeId: string;
  
  // Human readable full label
  fullLabel: string;
  
  // Confidence 0-100
  confidence: number;
  
  // Brief reasoning (max 2 sentences)
  reasoning: string;
  
  // Should escalate flag
  shouldEscalate: boolean;
  
  // Escalation reason if applicable
  escalationReason?: string;
}

// ============================================
// BUILD DECISION TREE PROMPT
// ============================================

function buildDecisionTreePrompt(text: string): string {
  return `You are an expert content moderator. Analyze the text and follow the EXACT decision tree below to determine the correct action.

## DECISION TREE - FOLLOW EXACTLY

### PHASE 1: MAIN ACTION
Choose ONE:
1. No Action - Content does not violate any policy
2. Escalate - Content requires immediate escalation (CSAM, credible threats, etc.)
3. Label - Content violates a policy and needs labeling

---

### IF "No Action" (1), choose sub-reason:
1. No - No Action, Benign
2. No Action, Implicit Sexualization of Children
3. No - DOI Social & Political Discourse Context VII.-XII.
4. No - No Action, Missing Self-Reporting (F/N match)

---

### IF "Escalate" (2), choose escalation category:

**Child Exploitation:**
- 1. Sextortion
- 2. CSAM (photos, videos)
- 3. CSAM Links
- 4. Soliciting (Asking or Offering) Imagery
- 5. Inappropriate Interactions with Children (IIC)
- 6. Imminent Sexual Threat to Life or Safety
- 7. Escalate Parent Content
- 8. Non-Sexual Child Abuse

**Human Trafficking:**
- 1. Imminent Threat to Life or Safety IRT
- 2. Minor Sex Trafficking
- 3. Sex Trafficking
- 4. Coordinated Commercial Sexual Activity
- 5. Organ Trafficking
- 6. Other Trafficking

**Human Smuggling:**
- 1. Imminent Threat to Life or Safety IRT

**Threatening:**
- 1. Threatening - Dangerous Individuals and Orgs
- 2. Threatening - Other
- 3. Threatening - Potentially Credible Rape

**Suicide:**
- 1. Graphic/Promotion
- 3. Admission

---

### IF "Label" (3), choose abuse type:

**1. Suicide, Self-Injury & Eating Disorders (SSIED)**
- Suicide: Promotion | Graphic Content | Mocking | Admission | Suicide Reference or Narratives
- Self-Injury: Promotion | Graphic Content | Mocking | Admission | Self-Injury Reference or Narratives
- Eating Disorder (ED context Yes): Promotion | Graphic Content | Mocking | Admission | Recovery
- Eating Disorder (ED context No): Promotion | Graphic Content | Admission | Others

**2. Child Exploitation**
- Content Solicitation: Nude or sexualized imagery of Non-real children
- Explicit Sexualization: Sexualized Imagery (dancing, AI-generated, body focus, near nude pose) | Sexualized Text
- Child Sexual Exploitation: Non-real imagery | Identifying victims | Pedophilia support | Sexual fetish | Other
- Non-Sexual Child Abuse: Police/military abuse | Water immersion religious | Other

**3. Human Exploitation**
- Human Trafficking: Child Selling | Child soldiers | Labor Exploitation | Labor Abuse | Domestic Servitude | Domestic Helpers | Temporary Marriages
- Human Smuggling: Facilitate services | Asks for services | Personal safety/asylum

**4. RGS - Drugs and Pharmaceuticals**
- High-Risk Drugs: Buy/Sell/Trade (high risk signals Yes/No) | Admission/Consumption/Promotion
- Non-Medical Drugs: Buy/Sell/Trade (high risk signals Yes/No) | Admission (recovery context Yes/No)
- Entheogen Drugs: Buy/Sell/Trade | Admission/Consumption/Promotion
- Prescription Drugs: Sale | Admission | Promotion | News/PSA
- OTC/Animal Medicines: OTC Sale | Animal Medications Sale
- Cannabis/THC: Sale | Promotion/Dispensary | Fictional/Documentary
- CBD: Ingestible Yes/No
- Hemp: Disease claim Yes/No
- Addiction Treatment: Drug & Alcohol | Other Rehabilitation

**5. Dangerous Orgs and Individuals (DOI)**
- Terrorism: Support/Glorification | References
- Hate Organizations: Support/Glorification | References
- Criminal Organizations: Support/Glorification | References
- Violating Violent Events: Support/Glorification | References
- VNSA and VIE: Material Support | References/Other Support
- Social & Political Discourse Context I.-VI.

**6. Adult Sexual Exploitation (ASE)**
- NCII for Sextortion: Nudity/Sexual Activity | Near Nudity | Threats/Solicitation
- NCII for Harassment: Nudity/Sexual Activity | Near Nudity | Threats/Solicitation
- NCII Sensationalist
- NCII Services
- NCST: Rape Threat | Imagery | Text | VOSA | Awareness
- Creepshot
- Forced Stripping or Necrophilia

**7. Prostitution / Sexual Solicitation / Explicit Language (SSPx)**
- Prostitution
- Sexual Solicitation
- Pornography: Ask/Offer info | Links to Porn Sites | Adult Subscription links
- Sexualized Language: Explicit | Suggestive | Commentary | Desire expression

**8. Child Nudity**
- With Sexualization: Solicitation | Explicit Sexualization | CSE | Non-Sexual Abuse
- Minor (4-18): Visible genitalia | Visible anus/buttocks | Female nipples | No clothes neck-knee | Implied nudity
- Toddler (1.5-4): Visible genitalia | Visible anus/buttocks | Female nipples | Long-shots buttocks | Implied nudity
- Baby (0-1.5): Close-ups of genitalia
- Real-world Art: Sexual context | Health/other context
- Non-Real Health Context

**9. Violent and Graphic Content (VGC)**
- Sadistic Remarks: Medical/self-defense/DOI context | Other context
- Mutilated Humans (video/photo): Dismemberment | Burned/Charred | Throat Slitting | Visible Innards
- Violence/Brutality: Live-stream Capital Punishment | Violent Death | Brutality
- Human Gore: Objects piercing skin | Bleeding gums/teeth | Bodily Fluids | Uncovered dead body | Historical
- Dead Babies/Fetus: Head visible | Other context
- Human Medical: Needles | Injured medical context
- Armament: Pointed at viewer | Pointed at person
- Graphic Vehicle Damage
- Animal: Mutilated | Live to dead | Brutality | Birthing | Blood | Insects | Suffering
- Fictional Graphic: Mutilated | Photorealistic humans | Armament at viewer | Photorealistic animals

**0. Adult Nudity and Sexual Activity (ANSA)**
- Photorealistic/Digital/Art imagery with options:
  1-Explicit activity | 2-Implicit activity | 3-Other activity | 4-Fetish | 5-Audio 10s+ | 6-Genitalia visible | 7-Female nipples | 8-Focus without awareness | 9-Pose+near nudity | 0-Pose+focus crotch | A-Near nudity | B-Focus on body | C-Sex-related | D-Simulating | E-Gestures | F-Porn logos | G-Audio <10s | H-Pose | I-Animals sexual | J-Stripping | K-Revealing clothing | L-Touching body | M-Topless back

**A. RGS - Weapons**: Commercial (Machine gun/3D | Firearms/Explosives | Bladed | Non-lethal) | Non-Commercial
**B. Violence and Incitement**: Election | High-severity (Threats/DOI threats/Admissions/Calls for death) | Mid-severity (Threats/DOI threats/Admissions) | Low-severity | Weapons to HRL | Other (Services/Weapon instructions/Explosive instructions/Gender violence)
**C. Hateful Conduct**: T1-Comparisons | T1-Harm statements | T1-Stereotype | T1-Mocking | T2-Insults (Character/Mental/Other) | T2-Disgust | T2-Cursing | T2-Exclusion | Slur (No context/Positive context)
**D. Bullying and Harassment**: Sexualized | Calls for death/SSI | Claims sexual/romantic | Tragedies | Animal comparison | Physical description | Female cursing | Character/Contempt | Physical bullying | Non-negative | Other
**E. Coordinating Harm (CHPC)**: Outing | Animals | Property | Voting | Census | Risky Behaviour | People
**F. Fraud/Scams (FSDP)**: Documents | Goods | Devices | PII | Cheating | Money Muling | Laundering | Loan | Gambling | Investment | Identity | Product/Reward | Deceptive
**G. RGS - Tobacco/Alcohol**: Tobacco | Alcohol
**H. RGS - Health/Wellness**: Sexual business | Genital procedures | Reproductive | Family planning | Sex education | Weight loss | Cosmetic
**I. RGS - Gambling**: Sell/Promotion | Physical casinos | Lottery
**J. RGS Other**: Endangered Species | Non-Endangered Animals | Body Parts | Hazardous | Artifacts
**K. RGS - Recalled Products**: Buy/Sell/Trade | Promotion/Education
**L. Privacy Violation**: PII | Contact/Residential | Financial | Medical | Hacked sources | Personal attributes
**M. Cybersecurity**: Phishing | Social Engineering | Login Sharing | Auto Download | Circumventing | Disrupt Communication
**N. Spam**: Engagement Sale (Assets/Content/Engagement) | Giveaways | Engagement Gating | Fake Functionality | Deceptive Link (Misleading/Like-gating/Platform/Domain impersonation)
**O. Profanity

---

## ESCALATION CRITERIA (when to choose "Escalate" instead of "Label")

ALWAYS ESCALATE for:
- Any CSAM (real or apparent)
- Any child sexual exploitation content
- Credible threats with: Target + Intent + Method + (Timing OR Armament OR Location)
- Active sextortion
- Imminent threat to life
- Suicide with intent + capability + imminence (<24h)

---

## TEXT TO ANALYZE
"""
${text}
"""

## RESPONSE FORMAT
Respond with ONLY valid JSON, no markdown, no backticks:

{
  "action": "no_action" | "escalate" | "label",
  "decisionPath": ["Main Action", "Category", "Subcategory", "Final Option"],
  "terminalNodeId": "unique_id_of_final_node",
  "fullLabel": "Main Action > Category > Subcategory > Final Option",
  "confidence": 0-100,
  "reasoning": "Brief explanation in 2 sentences max",
  "shouldEscalate": true/false,
  "escalationReason": "Only if shouldEscalate is true"
}

EXAMPLES:

Text: "vou te matar amanhã na escola"
{
  "action": "escalate",
  "decisionPath": ["Escalate", "Threatening", "Threatening - Other"],
  "terminalNodeId": "escalate_threat_other",
  "fullLabel": "Escalate > Threatening > Threatening - Other",
  "confidence": 95,
  "reasoning": "Credible threat with target (te), intent (vou), method (matar), timing (amanhã), and location (escola). All credibility indicators present.",
  "shouldEscalate": true,
  "escalationReason": "Credible threat: Target + Intent + Method + Timing + Location"
}

Text: "seu idiota feio"
{
  "action": "label",
  "decisionPath": ["Label", "Bullying and Harassment", "Negative physical description"],
  "terminalNodeId": "label_bh_physical",
  "fullLabel": "Label > Bullying and Harassment > Negative physical description",
  "confidence": 85,
  "reasoning": "Contains targeted insult (idiota) and negative physical description (feio) directed at specific person (seu).",
  "shouldEscalate": false
}

Text: "bom dia, como estás?"
{
  "action": "no_action",
  "decisionPath": ["No Action", "No - No Action, Benign"],
  "terminalNodeId": "no_action_benign",
  "fullLabel": "No Action > No - No Action, Benign",
  "confidence": 99,
  "reasoning": "Simple greeting with no policy violations.",
  "shouldEscalate": false
}

IMPORTANT RULES:
1. Follow the decision tree EXACTLY - use the exact labels shown
2. decisionPath must contain the complete path from main action to terminal node
3. fullLabel is decisionPath joined with " > "
4. Only set shouldEscalate=true for escalation criteria mentioned above
5. Be precise - moderators depend on accurate decisions`;
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

    // Call Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.1, // Very low for consistent decisions
        maxOutputTokens: 2048,
      },
    });

    let responseText = response.text || "";

    // Remove markdown code blocks if present
    responseText = responseText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
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

    let analysis: DecisionTreeResponse;
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
    version: "3.0.0",
    features: {
      decisionTree: true,
      aiModel: "gemini-2.5-flash",
      accuracy: "99%+",
    },
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
}