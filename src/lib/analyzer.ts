// ============================================
// CM POLICY HUB - ANALYZER
// Sistema de análise que segue a Decision Tree
// ============================================

import {
  AnalysisResult,
  KeywordMatch,
  PolicyId,
  Severity,
  ActionType,
  PolicyChecks,
  DetectedExceptions,
  VIChecks,
  BHChecks,
  CSEANChecks,
  AdultSexualChecks,
} from "./types";

// ============================================
// DECISION TREE RESPONSE (from AI)
// ============================================

export interface DecisionTreeResponse {
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
// KEYWORD DATABASE
// ============================================

interface KeywordEntry {
  term: string;
  category: string;
  subcategory?: string;
  severity: Severity;
  requiresContext?: boolean;
}

type PolicyKeywords = Record<PolicyId, KeywordEntry[]>;

// Core keywords for initial detection (simplified for performance)
const KEYWORDS: Partial<PolicyKeywords> = {
  // CSEAN - Child Safety (highest priority)
  csean: [
    { term: "cheese pizza", category: "CSAM", severity: "critical" },
    { term: "cp", category: "CSAM", severity: "critical", requiresContext: true },
    { term: "csam", category: "CSAM", severity: "critical" },
    { term: "child porn", category: "CSAM", severity: "critical" },
    { term: "pedo", category: "Pedophilia", severity: "critical" },
    { term: "map pride", category: "Pedophilia", severity: "critical" },
    { term: "novinha", category: "Minor Reference", severity: "high", requiresContext: true },
    { term: "menor", category: "Minor Reference", severity: "mid", requiresContext: true },
  ],

  // Violence & Incitement
  vi: [
    { term: "vou te matar", category: "Death Threat", severity: "critical" },
    { term: "vou matar", category: "Death Threat", severity: "critical" },
    { term: "kill you", category: "Death Threat", severity: "critical" },
    { term: "gonna kill", category: "Death Threat", severity: "critical" },
    { term: "matar", category: "Violence", severity: "high", requiresContext: true },
    { term: "assassinar", category: "Violence", severity: "high" },
    { term: "esfaquear", category: "Violence", severity: "high" },
    { term: "atirar", category: "Violence", severity: "high", requiresContext: true },
  ],

  // Bullying & Harassment
  bh: [
    { term: "mata-te", category: "Calls for Death", severity: "critical" },
    { term: "kys", category: "Calls for Death", severity: "critical" },
    { term: "kill yourself", category: "Calls for Death", severity: "critical" },
    { term: "idiota", category: "Insult", severity: "mid" },
    { term: "imbecil", category: "Insult", severity: "mid" },
    { term: "retardado", category: "Insult", severity: "high" },
    { term: "puta", category: "Sexual Harassment", severity: "high" },
    { term: "feio", category: "Physical Description", severity: "low" },
    { term: "gordo", category: "Physical Description", severity: "low", requiresContext: true },
  ],

  // SSIED - Suicide, Self-Injury, Eating Disorders
  ssied: [
    { term: "vou me matar", category: "Suicide Intent", severity: "critical" },
    { term: "quero morrer", category: "Suicide Ideation", severity: "high" },
    { term: "me cortar", category: "Self-Injury", severity: "high" },
    { term: "proana", category: "ED Promotion", severity: "high" },
    { term: "thinspo", category: "ED Promotion", severity: "high" },
  ],

  // Hateful Conduct
  hc: [
    { term: "são ratos", category: "Dehumanizing", severity: "critical" },
    { term: "são baratas", category: "Dehumanizing", severity: "critical" },
    { term: "deviam morrer", category: "Harm Statement", severity: "critical" },
    { term: "holocaust didn't happen", category: "Holocaust Denial", severity: "critical" },
  ],

  // Adult Sexual Exploitation
  ase: [
    { term: "revenge porn", category: "NCII", severity: "high" },
    { term: "nudes vazados", category: "NCII", severity: "high" },
    { term: "sextortion", category: "Sextortion", severity: "critical" },
  ],

  // Fraud & Scams
  fsdp: [
    { term: "documentos falsos", category: "Fake Documents", severity: "critical" },
    { term: "fake id", category: "Fake Documents", severity: "critical" },
    { term: "money flip", category: "Investment Scam", severity: "critical" },
    { term: "guaranteed returns", category: "Investment Scam", severity: "high" },
  ],

  // Spam
  spam: [
    { term: "comprar seguidores", category: "Buy Engagement", severity: "high" },
    { term: "buy followers", category: "Buy Engagement", severity: "high" },
    { term: "curtir para ver", category: "Engagement Gating", severity: "high" },
  ],

  // Cybersecurity
  cyber: [
    { term: "hackear conta", category: "Hacking", severity: "high" },
    { term: "senha vazada", category: "Login Sharing", severity: "high" },
    { term: "phishing", category: "Phishing", severity: "high" },
  ],
};

// ============================================
// TEXT UTILITIES
// ============================================

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function hasWord(text: string, word: string): boolean {
  const norm = normalize(text);
  const w = normalize(word);
  if (w.includes(" ")) {
    return norm.includes(w);
  }
  return new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(norm);
}

// ============================================
// KEYWORD DETECTION
// ============================================

function findKeywords(text: string): KeywordMatch[] {
  const found: KeywordMatch[] = [];
  const processedTerms = new Set<string>();

  Object.entries(KEYWORDS).forEach(([policyId, keywords]) => {
    if (!keywords) return;
    
    keywords.forEach((kw) => {
      if (processedTerms.has(kw.term)) return;
      
      if (hasWord(text, kw.term)) {
        found.push({
          term: kw.term,
          policy: policyId as PolicyId,
          category: kw.category,
          subcategory: kw.subcategory,
          severity: kw.severity,
          requiresContext: kw.requiresContext,
        });
        processedTerms.add(kw.term);
      }
    });
  });

  // Sort by severity
  const severityOrder: Record<Severity, number> = {
    critical: 0,
    high: 1,
    mid: 2,
    low: 3,
    info: 4,
  };

  return found.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
}

// ============================================
// EXCEPTION DETECTION
// ============================================

function detectExceptions(text: string): DetectedExceptions {
  const lower = text.toLowerCase();
  const detected: string[] = [];

  const checks = {
    hasSelfDefense: /\b(defesa|defender|proteger|self.?defense)\b/i.test(lower),
    hasRedemption: /\b(arrependo|desculpa|perdão|sorry|regret)\b/i.test(lower),
    hasCondemning: /\b(é errado|não se deve|condenamos|wrong|condemn)\b/i.test(lower),
    hasHypothetical: /\b(se eu fosse|imagine|ficção|filme|série|jogo|game|movie|fiction)\b/i.test(lower),
    hasEducational: /\b(educação|ensino|academic|education|study)\b/i.test(lower),
    hasNewsReporting: /\b(notícia|reportagem|news|report|journalism)\b/i.test(lower),
    hasArtisticContext: /\b(arte|artístico|música|letra|artistic|lyrics)\b/i.test(lower),
    hasSatire: /\b(sátira|ironia|piada|satire|joke|parody)\b/i.test(lower),
    hasEndearingContext: /\b(meu amor|querido|amigo|brincadeira|friend|dear)\b/i.test(lower),
    hasCriminalAllegation: /\b(polícia|tribunal|police|court|lawsuit)\b/i.test(lower),
    hasBusinessReview: /\b(review|avaliação|estrelas|stars|serviço)\b/i.test(lower),
    hasFightSportContext: /\b(mma|ufc|boxe|boxing|luta|fight)\b/i.test(lower),
    hasMedicalContext: /\b(médico|medicina|doctor|medical|health)\b/i.test(lower),
    hasFamilyContext: /\b(filho|filha|bebé|família|son|daughter|baby|family)\b/i.test(lower),
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

  return { ...checks, detected };
}

// ============================================
// POLICY-SPECIFIC CHECKS
// ============================================

function performVIChecks(text: string, keywords: KeywordMatch[]): VIChecks {
  const hasTarget = /\b(te|você|tu|you|him|her|them)\b/i.test(text) || 
                   /[A-Z][a-záàâãéèêíïóôõöúç]{2,}/.test(text);
  const hasIntent = /\b(vou|vamos|gonna|will|going to)\b/i.test(text);
  const hasTiming = /\b(amanhã|hoje|às?\s*\d|daqui\s+a|tomorrow|today|tonight)\b/i.test(text);
  const hasArmament = keywords.some((k) => k.category === "Armament") ||
                      /\b(arma|faca|pistola|gun|knife|weapon)\b/i.test(text);
  const hasLocation = /\b(escola|trabalho|casa|escritório|school|work|home|office)\b/i.test(text);
  const hasMethod = keywords.some((k) => 
    ["Violence", "Death Threat", "Physical Violence"].includes(k.category)
  );
  
  const isCredibleThreat = hasTarget && hasIntent && hasMethod && 
                          (hasTiming || hasArmament || hasLocation);

  return { hasTarget, hasIntent, hasTiming, hasArmament, hasLocation, hasMethod, isCredibleThreat };
}

function performBHChecks(text: string): BHChecks {
  const hasIdentifiableTarget = /\b(te|você|@\w+|tu|seu|sua)\b/i.test(text);
  
  let targetType: BHChecks["targetType"] = "unknown";
  if (/\b(presidente|ministro|celebridade|president|celebrity)\b/i.test(text)) {
    targetType = "public_figure";
  } else if (/\b(criança|menor|filho|kid|child|minor)\b/i.test(text)) {
    targetType = "private_minor";
  } else if (hasIdentifiableTarget) {
    targetType = "private_adult";
  }

  return {
    hasIdentifiableTarget,
    targetType,
    hasNameFaceMatch: false,
    hasPurposefulExposure: /@\w+/.test(text),
    hasSelfReport: false,
    isEndearingContext: /\b(meu amor|querido|amigo|friend|dear)\b/i.test(text),
    isCriminalAllegation: /\b(polícia|tribunal|police|court)\b/i.test(text),
    isBusinessReview: /\b(review|avaliação|estrelas)\b/i.test(text),
  };
}

function performCSEANChecks(text: string, keywords: KeywordMatch[]): CSEANChecks {
  const hasMinorPresent = /\b(criança|menor|miúdo|kid|child|minor|teen|novinha)\b/i.test(text);
  
  let ageCategory: CSEANChecks["ageCategory"] = "unknown";
  if (/\b(bebé|baby|infant)\b/i.test(text)) ageCategory = "baby";
  else if (/\b(criança pequena|toddler)\b/i.test(text)) ageCategory = "toddler";
  else if (hasMinorPresent) ageCategory = "minor";

  const isRealOrNonReal: CSEANChecks["isRealOrNonReal"] = 
    /\b(cartoon|anime|desenho|ai.?generated|fictional)\b/i.test(text) ? "non_real" : "unknown";

  const cseanKeywords = keywords.filter((k) => k.policy === "csean");
  const hasCSAMIndicators = cseanKeywords.some((k) => 
    ["CSAM", "Pedophilia"].includes(k.category)
  );

  return {
    hasMinorPresent,
    ageCategory,
    isRealOrNonReal,
    hasCSAMIndicators,
    hasSolicitationSignals: hasMinorPresent && /\b(dm|telegram|wickr)\b/i.test(text),
    hasIICElements: hasMinorPresent && /\b(encontrar|meet|dm)\b/i.test(text),
    hasSexualizationSignals: hasMinorPresent && /\b(sexy|hot|gostosa)\b/i.test(text),
    isExploitativeContent: hasCSAMIndicators,
  };
}

function performAdultSexualChecks(text: string, keywords: KeywordMatch[]): AdultSexualChecks {
  const sexualKeywords = keywords.filter((k) => 
    ["ansa", "ase", "sspx"].includes(k.policy)
  );

  return {
    hasExplicitNudity: /\b(nu|nua|naked|nude|genitais|penis|vagina)\b/i.test(text),
    hasImplicitNudity: /\b(sem roupa|topless|underwear)\b/i.test(text),
    hasSexualActivity: /\b(sexo|sex|oral|anal|penetração)\b/i.test(text),
    hasExploitationIndicators: keywords.some((k) => k.policy === "ase"),
    hasSolicitationSignals: keywords.some((k) => k.policy === "sspx"),
    hasConsentIndicators: /\b(consensual|consent)\b/i.test(text),
    isCommercialContent: /\b(vendo|selling|€|\$|onlyfans)\b/i.test(text),
    contextType: "unknown",
  };
}

// ============================================
// MAP POLICY FROM DECISION PATH
// ============================================

function mapPolicyFromPath(decisionPath: string[]): PolicyId | null {
  if (decisionPath.length < 2) return null;
  
  const category = decisionPath[1]?.toLowerCase() || "";
  
  // Map category to PolicyId
  const categoryMap: Record<string, PolicyId> = {
    "child exploitation": "csean",
    "human trafficking": "he",
    "human smuggling": "he",
    "threatening": "vi",
    "suicide": "ssied",
    "suicide, self-injury & eating disorders": "ssied",
    "human exploitation": "he",
    "rgs - drugs and pharmaceuticals": "dp",
    "dangerous orgs and individuals": "doi",
    "adult sexual exploitation": "ase",
    "prostitution": "sspx",
    "child nudity": "csean",
    "violent and graphic content": "vgc",
    "adult nudity and sexual activity": "ansa",
    "rgs - weapons": "wae",
    "violence and incitement": "vi",
    "hateful conduct": "hc",
    "bullying and harassment": "bh",
    "coordinating harm": "chpc",
    "fraud": "fsdp",
    "rgs - tobacco": "ta",
    "rgs - health": "hw",
    "rgs - gambling": "ogg",
    "rgs other": "orgs",
    "rgs - recalled": "rp",
    "privacy violation": "pv",
    "cybersecurity": "cyber",
    "spam": "spam",
    "profanity": "psl",
  };

  for (const [key, value] of Object.entries(categoryMap)) {
    if (category.includes(key)) {
      return value;
    }
  }

  return null;
}

// ============================================
// MAIN ANALYSIS FUNCTION (Local Only)
// ============================================

export function analyzeContent(text: string): Omit<AnalysisResult, "id" | "text" | "timestamp" | "aiAnalysis" | "language" | "processingTime"> {
  // Find keywords
  const keywords = findKeywords(text);
  
  // Detect exceptions
  const exceptions = detectExceptions(text);
  
  // Perform policy-specific checks
  const checks: PolicyChecks = {
    vi: performVIChecks(text, keywords),
    bh: performBHChecks(text),
    csean: performCSEANChecks(text, keywords),
    adultSexual: performAdultSexualChecks(text, keywords),
  };
  
  // Default response (no violation)
  return {
    keywords,
    primaryPolicy: null,
    primaryPolicyName: null,
    detectedPolicies: [],
    action: "no_action" as ActionType,
    label: "No Action > No - No Action, Benign",
    labelPath: ["No Action", "No - No Action, Benign"],
    shouldEscalate: false,
    confidence: 50,
    confidenceBreakdown: {
      keywordMatch: keywords.length > 0 ? Math.min(40 + keywords.length * 10, 60) : 0,
      contextAnalysis: exceptions.detected.length > 0 ? -20 : 20,
      aiAdjustment: 0,
    },
    checks,
    exceptions,
  };
}

// ============================================
// MERGE WITH AI ANALYSIS (Decision Tree Response)
// ============================================

export function mergeWithAIAnalysis(
  baseAnalysis: Omit<AnalysisResult, "id" | "text" | "timestamp" | "language" | "processingTime">,
  aiResponse: DecisionTreeResponse
): Omit<AnalysisResult, "id" | "text" | "timestamp" | "language" | "processingTime"> {
  
  // Map action to ActionType
  const action: ActionType = aiResponse.action;
  
  // Get policy from decision path
  const primaryPolicy = mapPolicyFromPath(aiResponse.decisionPath);
  
  // Get policy name from path
  const primaryPolicyName = aiResponse.decisionPath[1] || null;
  
  // Build detected policies array
  const detectedPolicies: AnalysisResult["detectedPolicies"] = [];
  if (primaryPolicy && primaryPolicyName) {
    detectedPolicies.push({
      policy: primaryPolicy,
      policyName: primaryPolicyName,
      confidence: aiResponse.confidence,
      categories: aiResponse.decisionPath.slice(2),
    });
  }

  return {
    ...baseAnalysis,
    primaryPolicy,
    primaryPolicyName,
    detectedPolicies,
    action,
    label: aiResponse.fullLabel,
    labelPath: aiResponse.decisionPath,
    shouldEscalate: aiResponse.shouldEscalate,
    escalationReason: aiResponse.escalationReason,
    confidence: aiResponse.confidence,
    confidenceBreakdown: {
      ...baseAnalysis.confidenceBreakdown,
      aiAdjustment: aiResponse.confidence - baseAnalysis.confidence,
    },
    aiAnalysis: {
      used: true,
      model: "gemini-2.5-flash",
      reasoning: [aiResponse.reasoning],
      suggestedPolicy: primaryPolicy,
      suggestedLabel: aiResponse.fullLabel,
      suggestedAction: action,
      adjustedConfidence: aiResponse.confidence,
    },
  };
}

// ============================================
// LEGACY SUPPORT - GeminiAnalysis type
// ============================================

export interface GeminiAnalysis {
  hasViolation: boolean;
  policy: PolicyId | null;
  policyName: string | null;
  category: string | null;
  subcategory?: string | null;
  severity: Severity | null;
  shouldEscalate: boolean;
  confidence: number;
  reasoning: string;
  suggestedLabel: string | null;
  suggestedAction: ActionType;
  exceptionsDetected?: string[];
  ambiguityNotes?: string;
}

export default analyzeContent;