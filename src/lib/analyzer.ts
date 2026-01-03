// ============================================
// CM POLICY HUB - ANALYZER (v3.0)
// Sistema de análise integrado com keyword-loader
// Refatorado para usar dados dinâmicos dos JSONs
// ============================================
// 
// CHANGELOG v3.0:
// - Removido keywords hardcoded (usava ~400 linhas redundantes)
// - Integração com keyword-loader.ts para keywords dinâmicas
// - Mantidos todos os checks específicos por policy
// - Mantida lógica de merge com AI analysis
// - Código mais limpo e manutenível
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
// EXTENDED POLICY CHECKS
// ============================================

export interface WAEChecks {
  hasWeaponMention: boolean;
  hasAmmunitionMention: boolean;
  hasExplosiveMention: boolean;
  hasSaleIntent: boolean;
  hasBrickAndMortar: boolean;
  hasPeerToPeer: boolean;
  hasInstructions: boolean;
  has3DPrintingContext: boolean;
  hasCircumventionSignals: boolean;
  weaponType: "firearm" | "bladed" | "explosive" | "ammunition" | "3d_printed" | "unknown";
}

export interface VGCChecks {
  hasGraphicImagerySignals: boolean;
  hasHumanVictim: boolean;
  hasAnimalVictim: boolean;
  hasFictionalContext: boolean;
  hasSadisticIndicators: boolean;
  hasNewsContext: boolean;
  severityLevel: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  isDesignatedEvent: boolean;
}

export interface TAChecks {
  hasTobaccoProduct: boolean;
  hasAlcoholProduct: boolean;
  hasENDSProduct: boolean;
  hasSaleIntent: boolean;
  hasBrickAndMortar: boolean;
  hasPeerToPeer: boolean;
  hasConsumptionDepiction: boolean;
  hasBrandDepiction: boolean;
  hasPromotion: boolean;
  isFictionalContext: boolean;
  productType: "tobacco" | "alcohol" | "ends" | "cessation" | "unknown";
}

export interface SSIEDChecks {
  hasSuicideContent: boolean;
  hasSelfInjuryContent: boolean;
  hasEatingDisorderContent: boolean;
  hasPromotionSignals: boolean;
  hasAdmissionSignals: boolean;
  hasGraphicImagery: boolean;
  hasMockingContent: boolean;
  hasRecoveryContext: boolean;
  hasViralEventReference: boolean;
  isCIS: boolean; // Credible Intent of Suicide
  cisHasExplicitIntent: boolean;
  cisHasCapability: boolean;
  cisHasImminence: boolean;
  edSignalType: "promotion" | "context" | "benign" | "none";
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
    hasCondemning: /\b(é errado|não se deve|condenamos|wrong|condemn|é uma vergonha)\b/i.test(lower),
    hasHypothetical: /\b(se eu fosse|imagine|ficção|filme|série|jogo|game|movie|fiction|hipotético)\b/i.test(lower),
    hasEducational: /\b(educação|ensino|academic|education|study|universidade|escola)\b/i.test(lower),
    hasNewsReporting: /\b(notícia|reportagem|news|report|journalism|jornal|g1|folha|estadão)\b/i.test(lower),
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
    hasBrickAndMortar: /\b(loja|store|shop|site oficial|official|retail|atacado|varejo)\b/i.test(lower),
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

function performWAEChecks(text: string, keywords: KeywordMatch[]): WAEChecks {
  const waeKeywords = keywords.filter((k) => k.policy === "wae");
  
  const hasWeaponMention = waeKeywords.some((k) => 
    ["Firearm", "Firearm Slang BR", "Bladed Weapon", "firearm", "firearms", "bladed_weapons"].some(cat => 
      k.category.toLowerCase().includes(cat.toLowerCase())
    )
  );
  const hasAmmunitionMention = waeKeywords.some((k) => 
    k.category.toLowerCase().includes("ammunition")
  );
  const hasExplosiveMention = waeKeywords.some((k) => 
    k.category.toLowerCase().includes("explosive")
  );
  const has3DPrintingContext = waeKeywords.some((k) => 
    k.category.toLowerCase().includes("3d") || k.category.toLowerCase().includes("printed")
  );
  const hasInstructions = waeKeywords.some((k) => 
    k.category.toLowerCase().includes("instruction")
  );
  
  const hasSaleIntent = /\b(vendo|compro|vender|comprar|sell|buy|sale|à venda|for sale)\b/i.test(text);
  const hasBrickAndMortar = /\b(loja|store|site oficial|official|retail|armasltda|taurus)\b/i.test(text);
  const hasPeerToPeer = /\b(dm|inbox|whatsapp|telegram|particular|privado)\b/i.test(text) && hasSaleIntent;
  
  const hasCircumventionSignals = /\b(emoji|código|code|foto inbox|pic in dm)\b/i.test(text) ||
    /[🔫💣🗡️🔪]/u.test(text);

  let weaponType: WAEChecks["weaponType"] = "unknown";
  if (has3DPrintingContext) weaponType = "3d_printed";
  else if (hasExplosiveMention) weaponType = "explosive";
  else if (hasAmmunitionMention) weaponType = "ammunition";
  else if (waeKeywords.some((k) => k.category.toLowerCase().includes("bladed"))) weaponType = "bladed";
  else if (hasWeaponMention) weaponType = "firearm";

  return {
    hasWeaponMention,
    hasAmmunitionMention,
    hasExplosiveMention,
    hasSaleIntent,
    hasBrickAndMortar,
    hasPeerToPeer,
    hasInstructions,
    has3DPrintingContext,
    hasCircumventionSignals,
    weaponType,
  };
}

function performVGCChecks(text: string, keywords: KeywordMatch[]): VGCChecks {
  const vgcKeywords = keywords.filter((k) => k.policy === "vgc");
  
  const hasGraphicImagerySignals = vgcKeywords.some((k) => 
    ["dismemberment", "burning", "internal_organs", "dead_body", "graphic", "gore", "mutilation"].some(cat =>
      k.category.toLowerCase().includes(cat)
    )
  );
  const hasHumanVictim = /\b(pessoa|human|homem|mulher|man|woman|child|criança)\b/i.test(text);
  const hasAnimalVictim = vgcKeywords.some((k) => 
    k.category.toLowerCase().includes("animal")
  );
  const hasFictionalContext = /\b(filme|movie|jogo|game|série|series|animação|animation)\b/i.test(text);
  const hasSadisticIndicators = vgcKeywords.some((k) => 
    ["sadistic", "torture"].some(cat => k.category.toLowerCase().includes(cat))
  );
  const hasNewsContext = /\b(notícia|news|reportagem|report|jornal|g1)\b/i.test(text);

  // Calculate severity level (1-10)
  let severityLevel: VGCChecks["severityLevel"] = 10;
  if (vgcKeywords.some((k) => k.severity === "critical")) severityLevel = 1;
  else if (hasSadisticIndicators) severityLevel = 2;
  else if (vgcKeywords.some((k) => k.category.toLowerCase().includes("dismemberment"))) severityLevel = 3;
  else if (vgcKeywords.some((k) => k.severity === "high")) severityLevel = 4;
  else if (hasGraphicImagerySignals) severityLevel = 5;
  else if (vgcKeywords.length > 0) severityLevel = 7;

  // Check for designated events
  const isDesignatedEvent = /\b(holocaust|holocausto|rwanda|tiananmen|columbine|christchurch)\b/i.test(text);

  return {
    hasGraphicImagerySignals,
    hasHumanVictim,
    hasAnimalVictim,
    hasFictionalContext,
    hasSadisticIndicators,
    hasNewsContext,
    severityLevel,
    isDesignatedEvent,
  };
}

function performVIChecks(text: string, keywords: KeywordMatch[]): VIChecks {
  const viKeywords = keywords.filter((k) => k.policy === "vi");
  
  const hasTarget = /\b(te|você|tu|you|him|her|them|ele|ela|eles)\b/i.test(text) || 
                   /[A-Z][a-záàâãéèêíïóôõöúç]{2,}/.test(text) ||
                   /@\w+/.test(text);
  const hasIntent = /\b(vou|vamos|gonna|will|going to|irei|farei)\b/i.test(text);
  const hasTiming = /\b(amanhã|hoje|às?\s*\d|daqui\s+a|tomorrow|today|tonight|agora|now)\b/i.test(text);
  const hasArmament = viKeywords.some((k) => k.category.toLowerCase().includes("armament")) ||
                      /\b(arma|faca|pistola|gun|knife|weapon|espingarda|rifle)\b/i.test(text);
  const hasLocation = /\b(escola|trabalho|casa|escritório|school|work|home|office|igreja|church)\b/i.test(text);
  const hasMethod = viKeywords.some((k) => 
    ["hsv", "high_severity", "lethal", "death_threat", "calls_for_death", "proxy_lethal"].some(cat =>
      k.category.toLowerCase().includes(cat)
    )
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

function performTAChecks(text: string, keywords: KeywordMatch[]): TAChecks {
  const taKeywords = keywords.filter((k) => k.policy === "ta");
  
  const hasTobaccoProduct = taKeywords.some((k) => 
    k.category.toLowerCase().includes("tobacco")
  );
  const hasAlcoholProduct = taKeywords.some((k) => 
    k.category.toLowerCase().includes("alcohol")
  );
  const hasENDSProduct = taKeywords.some((k) => 
    ["ends", "vape", "vaping", "e-cigarette"].some(cat => k.category.toLowerCase().includes(cat))
  );
  
  const hasSaleIntent = /\b(vendo|compro|vender|comprar|sell|buy|sale|à venda|for sale|delivery)\b/i.test(text);
  const hasBrickAndMortar = /\b(loja|store|restaurante|bar|pub|brewery|cervejaria|vinícola)\b/i.test(text);
  const hasPeerToPeer = /\b(dm|inbox|whatsapp|particular|privado|hmu|hit me up)\b/i.test(text) && hasSaleIntent;
  
  const hasConsumptionDepiction = /\b(bebendo|drinking|fumando|smoking|vaping|tomando)\b/i.test(text);
  const hasBrandDepiction = taKeywords.some((k) => 
    k.category.toLowerCase().includes("brand")
  );
  const hasPromotion = /\b(promoção|promotion|desconto|discount|grátis|free|oferta|offer)\b/i.test(text);
  
  const isFictionalContext = /\b(filme|movie|série|series|novela|tv show)\b/i.test(text);

  let productType: TAChecks["productType"] = "unknown";
  if (hasENDSProduct) productType = "ends";
  else if (hasTobaccoProduct) productType = "tobacco";
  else if (hasAlcoholProduct) productType = "alcohol";

  return {
    hasTobaccoProduct,
    hasAlcoholProduct,
    hasENDSProduct,
    hasSaleIntent,
    hasBrickAndMortar,
    hasPeerToPeer,
    hasConsumptionDepiction,
    hasBrandDepiction,
    hasPromotion,
    isFictionalContext,
    productType,
  };
}

function performSSIEDChecks(text: string, keywords: KeywordMatch[]): SSIEDChecks {
  const ssiedKeywords = keywords.filter((k) => k.policy === "ssied" || k.policy === "cis");
  
  // Suicide detection
  const hasSuicideContent = ssiedKeywords.some((k) => 
    ["suicide", "suicídio", "suicidio", "intent", "ideation", "method", "note", "signal", "incitement"].some(cat =>
      k.category.toLowerCase().includes(cat)
    )
  );
  
  // Self-Injury detection
  const hasSelfInjuryContent = ssiedKeywords.some((k) => 
    ["self-injury", "self_injury", "si_means", "cutting", "autolesão", "automutilação"].some(cat =>
      k.category.toLowerCase().includes(cat)
    )
  );
  
  // Eating Disorder detection
  const hasEatingDisorderContent = ssiedKeywords.some((k) => 
    ["ed_promotion", "ed_coordination", "ed_type", "ed_behavior", "ed_signal", "eating", "anorexia", "bulimia"].some(cat =>
      k.category.toLowerCase().includes(cat)
    )
  );
  
  // Promotion signals (critical)
  const hasPromotionSignals = ssiedKeywords.some((k) => 
    k.category.toLowerCase().includes("promotion") || k.category.toLowerCase().includes("incitement")
  );
  
  // Admission signals
  const hasAdmissionSignals = /\b(eu tenho|i have|sofro de|i suffer|minha anorexia|my anorexia|me corto|i cut myself)\b/i.test(text);
  
  // Graphic imagery
  const hasGraphicImagery = /\b(sangue|blood|corte|cut|cicatriz|scar|vômito|vomit)\b/i.test(text) && 
    (hasSuicideContent || hasSelfInjuryContent || hasEatingDisorderContent);
  
  // Mocking content
  const hasMockingContent = /\b(lol|lmao|kkk|😂|🤣|meme|piada|joke)\b/i.test(text) && 
    (hasSuicideContent || hasSelfInjuryContent || hasEatingDisorderContent);
  
  // Recovery context
  const hasRecoveryContext = /\b(recuperação|recovery|superando|overcame|em tratamento|sober|clean)\b/i.test(text);
  
  // Viral events
  const hasViralEventReference = ssiedKeywords.some((k) => 
    k.category.toLowerCase().includes("viral")
  ) || /\b(blue whale|baleia azul|momo challenge|jonathan galindo)\b/i.test(text);
  
  // CIS (Credible Intent of Suicide) detection
  const cisHasExplicitIntent = ssiedKeywords.some((k) => 
    k.category.toLowerCase().includes("intent") || k.category.toLowerCase().includes("note")
  ) || /\b(vou me matar|i will kill myself|going to end it|this is goodbye)\b/i.test(text);
  
  const cisHasCapability = ssiedKeywords.some((k) => 
    k.category.toLowerCase().includes("method")
  ) || /\b(pílulas|pills|arma|gun|corda|rope|ponte|bridge|prédio|building)\b/i.test(text);
  
  const cisHasImminence = /\b(agora|now|hoje|today|tonight|esta noite|amanhã|tomorrow)\b/i.test(text);
  
  const isCIS = cisHasExplicitIntent && cisHasCapability && cisHasImminence;
  
  // ED Signal type
  let edSignalType: SSIEDChecks["edSignalType"] = "none";
  if (hasPromotionSignals) edSignalType = "promotion";
  else if (hasEatingDisorderContent) edSignalType = "context";
  else if (/\b(dieta|diet|emagrecer|weight loss)\b/i.test(text)) edSignalType = "benign";

  return {
    hasSuicideContent,
    hasSelfInjuryContent,
    hasEatingDisorderContent,
    hasPromotionSignals,
    hasAdmissionSignals,
    hasGraphicImagery,
    hasMockingContent,
    hasRecoveryContext,
    hasViralEventReference,
    isCIS,
    cisHasExplicitIntent,
    cisHasCapability,
    cisHasImminence,
    edSignalType,
  };
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
    contextType: "unknown",
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
// MAIN ANALYSIS FUNCTION (Local Only)
// Agora usa keyword-loader.ts em vez de keywords hardcoded
// ============================================

export function analyzeContent(text: string): Omit<AnalysisResult, "id" | "text" | "timestamp" | "aiAnalysis" | "language" | "processingTime"> {
  // INTEGRAÇÃO: Usar keyword-loader para encontrar keywords
  const keywords = findKeywordsInText(text);
  
  // Detect exceptions
  const exceptions = detectExceptions(text);
  
  // Perform policy-specific checks
  const checks: ExtendedPolicyChecks = {
    vi: performVIChecks(text, keywords),
    bh: performBHChecks(text),
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
      
      // Get policy name from constants or use ID
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
        cyber: "Cybersecurity",
        spam: "Spam",
        ogg: "Online Gambling and Games",
        hw: "Health and Wellness",
        rp: "Recalled Products",
        psl: "Profane and Sexualized Language",
        orgs: "Other RGS",
        cis: "Credible Intent of Suicide",
      };
      
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