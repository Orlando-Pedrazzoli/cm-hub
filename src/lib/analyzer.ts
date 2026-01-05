// ============================================
// CM POLICY HUB - ANALYZER (v4.0 REFATORADO)
// 
// MUDANÇAS v4.0:
// - Usa policy-checks.ts para funções compartilhadas
// - Elimina ~300 linhas de código duplicado
// - Mantém compatibilidade com API existente
// ============================================

import {
  AnalysisResult,
  KeywordMatch,
  PolicyId,
  Severity,
  ActionType,
  PolicyChecks,
  AdultSexualChecks,
  CSEANChecks,
} from "./types";

// ⭐ NOVO: Importar funções compartilhadas de policy-checks.ts
import {
  detectExceptions,
  performVIChecks,
  performSSIEDChecks,
  performBHChecks,
  performWAEChecks,
  performVGCChecks,
  performTAChecks,
  SSIEDChecks,
  BHChecks,
  WAEChecks,
  VGCChecks,
  TAChecks,
} from "./policy-checks";

// INTEGRAÇÃO COM KEYWORD-LOADER
import { findKeywordsInText } from "./keyword-loader";

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
// RE-EXPORT TYPES FROM POLICY-CHECKS
// Para manter compatibilidade com código existente
// ============================================

export type { SSIEDChecks, BHChecks, WAEChecks, VGCChecks, TAChecks };

// Re-exported from types.ts: CSEANChecks, AdultSexualChecks

// ============================================
// POLICY-SPECIFIC CHECKS (não duplicadas)
// ============================================

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
    ["csam", "pedophilia", "pedo"].some(cat => k.category.toLowerCase().includes(cat))
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
  return {
    hasExplicitNudity: /\b(nu|nua|naked|nude|genitais|penis|vagina)\b/i.test(text),
    hasImplicitNudity: /\b(sem roupa|topless|underwear)\b/i.test(text),
    hasSexualActivity: /\b(sexo|sex|oral|anal|penetração)\b/i.test(text),
    hasExploitationIndicators: keywords.some((k) => k.policy === "ase"),
    hasSolicitationSignals: keywords.some((k) => k.policy === "sspx"),
    hasConsentIndicators: /\b(consensual|consent)\b/i.test(text),
    isCommercialContent: /\b(vendo|selling|€|\$|onlyfans)\b/i.test(text),
    contextType: "unknown" as const,
  };
}

// ============================================
// EXTENDED POLICY CHECKS TYPE
// ============================================

export interface ExtendedPolicyChecks extends PolicyChecks {
  wae?: WAEChecks;
  vgc?: VGCChecks;
  ta?: TAChecks;
  ssied?: SSIEDChecks;
}

// ============================================
// MAP POLICY FROM DECISION PATH
// ============================================

function mapPolicyFromPath(decisionPath: string[]): PolicyId | null {
  if (decisionPath.length < 2) return null;
  
  const category = decisionPath[1]?.toLowerCase() || "";
  
  const categoryMap: Record<string, PolicyId> = {
    "child exploitation": "csean",
    "human trafficking": "he",
    "human smuggling": "he",
    "threatening": "vi",
    "suicide": "ssied",
    "suicide, self-injury & eating disorders": "ssied",
    "self-injury": "ssied",
    "eating disorder": "ssied",
    "human exploitation": "he",
    "rgs - drugs and pharmaceuticals": "dp",
    "dangerous orgs and individuals": "doi",
    "adult sexual exploitation": "ase",
    "prostitution": "sspx",
    "child nudity": "csean",
    "violent and graphic content": "vgc",
    "adult nudity and sexual activity": "ansa",
    "rgs - weapons": "wae",
    "rgs - tobacco and alcohol": "ta",
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
// POLICY NAMES CONSTANT
// ============================================

const POLICY_NAMES: Record<string, string> = {
  vi: "Violence and Incitement",
  bh: "Bullying and Harassment",
  ssied: "Suicide, Self-Injury, and Eating Disorders",
  hc: "Hateful Conduct",
  csean: "Child Sexual Exploitation, Abuse, and Nudity",
  ase: "Adult Sexual Exploitation",
  ansa: "Adult Nudity and Sexual Activity",
  sspx: "Adult Sexual Solicitation",
  vgc: "Violent and Graphic Content",
  doi: "Dangerous Organizations and Individuals",
  he: "Human Exploitation",
  dp: "Drugs and Pharmaceuticals",
  ta: "Tobacco and Alcohol",
  wae: "Weapons, Ammunition, and Explosives",
  fsdp: "Fraud, Scam, and Deceptive Practices",
  chpc: "Coordinating Harm and Promoting Crime",
  pv: "Privacy Violations",
  cs: "Cybersecurity",
  spam: "Spam",
  ogg: "Online Gambling and Games",
  hw: "Health and Wellness",
  rp: "Recalled Products",
  psl: "Profane and Sexualized Language",
  orgs: "Other RGS",
  cis: "Credible Intent of Suicide",
};

// ============================================
// MAIN ANALYSIS FUNCTION (Local Only)
// ⭐ Agora usa funções de policy-checks.ts
// ============================================

export function analyzeContent(text: string): Omit<AnalysisResult, "id" | "text" | "timestamp" | "aiAnalysis" | "language" | "processingTime"> {
  // INTEGRAÇÃO: Usar keyword-loader para encontrar keywords
  const keywords = findKeywordsInText(text);
  
  // ⭐ Usar funções de policy-checks.ts (elimina duplicação)
  const exceptions = detectExceptions(text);
  
  // ⭐ Usar funções de policy-checks.ts
  const checks: ExtendedPolicyChecks = {
    vi: performVIChecks(text, keywords),
    bh: performBHChecks(text, keywords),
    csean: performCSEANChecks(text, keywords),
    adultSexual: performAdultSexualChecks(text, keywords),
    wae: performWAEChecks(text, keywords),
    vgc: performVGCChecks(text, keywords),
    ta: performTAChecks(text, keywords),
    ssied: performSSIEDChecks(text, keywords),
  };
  
  // Calculate confidence based on keyword matches and exceptions
  const keywordConfidence = keywords.length > 0 ? Math.min(40 + keywords.length * 10, 80) : 0;
  const exceptionPenalty = exceptions.detected.length > 0 ? -15 * exceptions.detected.length : 0;
  const contextBonus = (checks.vi?.isCredibleThreat || checks.ssied?.isCIS) ? 20 : 0;
  
  const baseConfidence = Math.max(0, Math.min(100, keywordConfidence + exceptionPenalty + contextBonus));
  
  // Determine primary policy from keywords
  let primaryPolicy: PolicyId | null = null;
  let primaryPolicyName: string | null = null;
  const detectedPolicies: AnalysisResult["detectedPolicies"] = [];
  
  if (keywords.length > 0) {
    // Group keywords by policy and find the most relevant
    const policyScores = new Map<PolicyId, { count: number; maxSeverity: number }>();
    const severityValues: Record<Severity, number> = {
      critical: 5,
      high: 4,
      mid: 3,
      low: 2,
      info: 1,
    };
    
    keywords.forEach((kw) => {
      const existing = policyScores.get(kw.policy) || { count: 0, maxSeverity: 0 };
      existing.count++;
      existing.maxSeverity = Math.max(existing.maxSeverity, severityValues[kw.severity]);
      policyScores.set(kw.policy, existing);
    });
    
    // Sort by severity then by count
    const sortedPolicies = Array.from(policyScores.entries())
      .sort((a, b) => {
        if (b[1].maxSeverity !== a[1].maxSeverity) {
          return b[1].maxSeverity - a[1].maxSeverity;
        }
        return b[1].count - a[1].count;
      });
    
    if (sortedPolicies.length > 0) {
      primaryPolicy = sortedPolicies[0][0];
      primaryPolicyName = POLICY_NAMES[primaryPolicy] || primaryPolicy.toUpperCase();
      
      // Build detected policies list
      sortedPolicies.forEach(([policy, scores]) => {
        const policyKeywords = keywords.filter((k) => k.policy === policy);
        const categories = [...new Set(policyKeywords.map((k) => k.category))];
        
        detectedPolicies.push({
          policy,
          policyName: POLICY_NAMES[policy] || policy.toUpperCase(),
          confidence: Math.min(100, 50 + scores.count * 10 + scores.maxSeverity * 5),
          categories,
        });
      });
    }
  }
  
  // Default response
  return {
    keywords,
    primaryPolicy,
    primaryPolicyName,
    detectedPolicies,
    action: "no_action" as ActionType,
    label: "No Action > No - No Action, Benign",
    labelPath: ["No Action", "No - No Action, Benign"],
    shouldEscalate: false,
    confidence: baseConfidence || 50,
    confidenceBreakdown: {
      keywordMatch: keywordConfidence,
      contextAnalysis: exceptionPenalty + contextBonus,
      aiAdjustment: 0,
    },
    checks,
    exceptions,
  };
}

// ============================================
// MERGE WITH AI ANALYSIS
// ============================================

export function mergeWithAIAnalysis(
  baseAnalysis: Omit<AnalysisResult, "id" | "text" | "timestamp" | "language" | "processingTime">,
  aiResponse: DecisionTreeResponse
): Omit<AnalysisResult, "id" | "text" | "timestamp" | "language" | "processingTime"> {
  
  const action: ActionType = aiResponse.action;
  const primaryPolicy = mapPolicyFromPath(aiResponse.decisionPath);
  const primaryPolicyName = aiResponse.decisionPath[1] || null;
  
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
// LEGACY SUPPORT
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