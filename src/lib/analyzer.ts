// ============================================
// CM POLICY HUB - ANALYZER (v2.0)
// Sistema de análise integrado com Policy Data
// 5/25 Policies Ready: WAE, VGC, VI, TA, SSIED
// ============================================
// 
// CHANGELOG v2.0:
// - Integrated 300+ keywords from 5 policy data files
// - Added WAE, VGC, TA, SSIED specific checks
// - Enhanced CIS (Credible Intent of Suicide) detection
// - B2B vs P2P sale detection for WAE/TA
// - Viral event detection for SSIED
// - Improved exception detection with 19 categories
// - Better confidence calculation based on context
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
// KEYWORD DATABASE (Integrated with Policy Data)
// ============================================

interface KeywordEntry {
  term: string;
  category: string;
  subcategory?: string;
  severity: Severity;
  requiresContext?: boolean;
  language?: string;
}

type PolicyKeywords = Record<PolicyId, KeywordEntry[]>;

// Comprehensive keywords from policy data files
const KEYWORDS: Partial<PolicyKeywords> = {
  // ============================================
  // WAE - Weapons, Ammunition, Explosives
  // ============================================
  wae: [
    // Firearms - Critical
    { term: "comprar arma", category: "Firearm Sale", severity: "critical" },
    { term: "vendo arma", category: "Firearm Sale", severity: "critical" },
    { term: "buy gun", category: "Firearm Sale", severity: "critical" },
    { term: "selling gun", category: "Firearm Sale", severity: "critical" },
    { term: "pistola", category: "Firearm", severity: "high", requiresContext: true },
    { term: "revólver", category: "Firearm", severity: "high", requiresContext: true },
    { term: "espingarda", category: "Firearm", severity: "high", requiresContext: true },
    { term: "metralhadora", category: "Firearm", severity: "high" },
    { term: "fuzil", category: "Firearm", severity: "high", requiresContext: true },
    { term: "rifle", category: "Firearm", severity: "high", requiresContext: true },
    { term: "shotgun", category: "Firearm", severity: "high", requiresContext: true },
    { term: "handgun", category: "Firearm", severity: "high", requiresContext: true },
    { term: "assault rifle", category: "Firearm", severity: "critical" },
    { term: "ak-47", category: "Firearm", severity: "high" },
    { term: "ar-15", category: "Firearm", severity: "high" },
    { term: "glock", category: "Firearm", severity: "high" },
    { term: "3oitão", category: "Firearm Slang BR", severity: "high" },
    { term: "38tão", category: "Firearm Slang BR", severity: "high" },
    { term: "trezoitão", category: "Firearm Slang BR", severity: "high" },
    
    // Ammunition
    { term: "munição", category: "Ammunition", severity: "high", requiresContext: true },
    { term: "balas", category: "Ammunition", severity: "mid", requiresContext: true },
    { term: "cartuchos", category: "Ammunition", severity: "mid", requiresContext: true },
    { term: "ammunition", category: "Ammunition", severity: "high", requiresContext: true },
    { term: "bullets", category: "Ammunition", severity: "mid", requiresContext: true },
    
    // Explosives - Critical
    { term: "bomba", category: "Explosive", severity: "critical", requiresContext: true },
    { term: "explosivo", category: "Explosive", severity: "critical" },
    { term: "dinamite", category: "Explosive", severity: "critical" },
    { term: "c4", category: "Explosive", severity: "critical" },
    { term: "molotov", category: "Explosive", severity: "critical" },
    { term: "granada", category: "Explosive", severity: "critical" },
    { term: "grenade", category: "Explosive", severity: "critical" },
    { term: "ied", category: "Explosive", severity: "critical" },
    { term: "pipe bomb", category: "Explosive", severity: "critical" },
    
    // Bladed Weapons
    { term: "faca de combate", category: "Bladed Weapon", severity: "high" },
    { term: "facão", category: "Bladed Weapon", severity: "high" },
    { term: "machete", category: "Bladed Weapon", severity: "high" },
    { term: "switchblade", category: "Bladed Weapon", severity: "high" },
    { term: "butterfly knife", category: "Bladed Weapon", severity: "high" },
    
    // 3D Printing
    { term: "ghost gun", category: "3D Printed", severity: "critical" },
    { term: "arma fantasma", category: "3D Printed", severity: "critical" },
    { term: "imprimir arma", category: "3D Printed", severity: "critical" },
    { term: "3d printed gun", category: "3D Printed", severity: "critical" },
    { term: "liberator", category: "3D Printed", severity: "critical" },
    
    // Instructions
    { term: "como fazer bomba", category: "Instructions", severity: "critical" },
    { term: "how to make bomb", category: "Instructions", severity: "critical" },
    { term: "converter arma", category: "Instructions", severity: "critical" },
    { term: "full auto conversion", category: "Instructions", severity: "critical" },
  ],

  // ============================================
  // VGC - Violent and Graphic Content
  // ============================================
  vgc: [
    // Human Victims - Critical/High
    { term: "decapitação", category: "Dismemberment", severity: "critical" },
    { term: "decapitation", category: "Dismemberment", severity: "critical" },
    { term: "desmembramento", category: "Dismemberment", severity: "critical" },
    { term: "dismemberment", category: "Dismemberment", severity: "critical" },
    { term: "evisceração", category: "Dismemberment", severity: "critical" },
    { term: "evisceration", category: "Dismemberment", severity: "critical" },
    { term: "queimado vivo", category: "Burning", severity: "critical" },
    { term: "burned alive", category: "Burning", severity: "critical" },
    { term: "afogamento", category: "Drowning", severity: "high" },
    { term: "drowning", category: "Drowning", severity: "high" },
    { term: "electrocução", category: "Electrocution", severity: "high" },
    { term: "electrocution", category: "Electrocution", severity: "high" },
    
    // Gore/Graphic
    { term: "gore", category: "Graphic Content", severity: "high" },
    { term: "sangue", category: "Blood", severity: "mid", requiresContext: true },
    { term: "blood", category: "Blood", severity: "mid", requiresContext: true },
    { term: "tripas", category: "Internal Organs", severity: "high" },
    { term: "intestines", category: "Internal Organs", severity: "high" },
    { term: "vísceras", category: "Internal Organs", severity: "high" },
    { term: "viscera", category: "Internal Organs", severity: "high" },
    { term: "cadáver", category: "Dead Body", severity: "high" },
    { term: "corpse", category: "Dead Body", severity: "high" },
    { term: "corpo morto", category: "Dead Body", severity: "high" },
    { term: "dead body", category: "Dead Body", severity: "high" },
    
    // Sadistic Indicators
    { term: "merece sofrer", category: "Sadistic", severity: "critical" },
    { term: "deserves to suffer", category: "Sadistic", severity: "critical" },
    { term: "tortura", category: "Torture", severity: "critical" },
    { term: "torture", category: "Torture", severity: "critical" },
    { term: "crucificação", category: "Torture", severity: "critical" },
    { term: "crucifixion", category: "Torture", severity: "critical" },
    
    // Animal Cruelty
    { term: "maus tratos animais", category: "Animal Cruelty", severity: "high" },
    { term: "animal cruelty", category: "Animal Cruelty", severity: "high" },
    { term: "animal abuse", category: "Animal Cruelty", severity: "high" },
    { term: "briga de galos", category: "Animal Fighting", severity: "high" },
    { term: "cockfighting", category: "Animal Fighting", severity: "high" },
    { term: "dog fighting", category: "Animal Fighting", severity: "high" },
    { term: "rinha", category: "Animal Fighting", severity: "high" },
  ],

  // ============================================
  // VI - Violence and Incitement
  // ============================================
  vi: [
    // High-Severity Violence (Lethal)
    { term: "vou te matar", category: "Death Threat", severity: "critical" },
    { term: "vou matar", category: "Death Threat", severity: "critical" },
    { term: "kill you", category: "Death Threat", severity: "critical" },
    { term: "gonna kill", category: "Death Threat", severity: "critical" },
    { term: "i will kill", category: "Death Threat", severity: "critical" },
    { term: "matar", category: "HSV", severity: "high", requiresContext: true },
    { term: "assassinar", category: "HSV", severity: "high" },
    { term: "esfaquear", category: "HSV", severity: "high" },
    { term: "stab", category: "HSV", severity: "high", requiresContext: true },
    { term: "atirar", category: "HSV", severity: "high", requiresContext: true },
    { term: "shoot", category: "HSV", severity: "high", requiresContext: true },
    { term: "enforcar", category: "HSV", severity: "critical" },
    { term: "hang", category: "HSV", severity: "high", requiresContext: true },
    { term: "envenenar", category: "HSV", severity: "high" },
    { term: "poison", category: "HSV", severity: "high", requiresContext: true },
    { term: "decapitar", category: "HSV", severity: "critical" },
    { term: "decapitate", category: "HSV", severity: "critical" },
    { term: "queimar vivo", category: "HSV", severity: "critical" },
    { term: "burn alive", category: "HSV", severity: "critical" },
    { term: "atropelar", category: "HSV", severity: "high" },
    { term: "run over", category: "HSV", severity: "high" },
    { term: "linchar", category: "HSV", severity: "critical" },
    { term: "lynch", category: "HSV", severity: "critical" },
    { term: "massacrar", category: "HSV", severity: "critical" },
    { term: "massacre", category: "HSV", severity: "critical" },
    
    // Proxy Language (BR)
    { term: "cpf cancelado", category: "HSV Proxy BR", severity: "critical" },
    { term: "dar um fim", category: "HSV Proxy BR", severity: "high" },
    { term: "eliminar", category: "HSV Proxy", severity: "high", requiresContext: true },
    { term: "mandar pro caixão", category: "HSV Proxy BR", severity: "critical" },
    
    // Mid-Severity Violence
    { term: "socar", category: "MSV", severity: "mid" },
    { term: "punch", category: "MSV", severity: "mid", requiresContext: true },
    { term: "chutar", category: "MSV", severity: "mid" },
    { term: "kick", category: "MSV", severity: "mid", requiresContext: true },
    { term: "bater", category: "MSV", severity: "mid", requiresContext: true },
    { term: "beat", category: "MSV", severity: "mid", requiresContext: true },
    { term: "espancar", category: "MSV", severity: "high" },
    { term: "surrar", category: "MSV", severity: "mid" },
    { term: "arrebentar", category: "MSV", severity: "mid" },
    { term: "partir a cara", category: "MSV", severity: "mid" },
    
    // Low-Severity Violence
    { term: "dar um tapa", category: "LSV", severity: "low" },
    { term: "slap", category: "LSV", severity: "low" },
    { term: "empurrar", category: "LSV", severity: "low" },
    { term: "push", category: "LSV", severity: "low", requiresContext: true },
    { term: "cuspir", category: "LSV", severity: "low" },
    { term: "spit on", category: "LSV", severity: "low" },
    
    // Calls for Death
    { term: "morte a", category: "Calls for Death", severity: "critical" },
    { term: "death to", category: "Calls for Death", severity: "critical" },
    
    // Armaments
    { term: "com uma faca", category: "Armament", severity: "high" },
    { term: "with a knife", category: "Armament", severity: "high" },
    { term: "com uma arma", category: "Armament", severity: "high" },
    { term: "with a gun", category: "Armament", severity: "high" },
    
    // High-Risk Persons
    { term: "jornalista", category: "HRP", severity: "mid", requiresContext: true },
    { term: "journalist", category: "HRP", severity: "mid", requiresContext: true },
    { term: "policial", category: "HRP", severity: "mid", requiresContext: true },
    { term: "police officer", category: "HRP", severity: "mid", requiresContext: true },
    { term: "presidente", category: "HRP", severity: "mid", requiresContext: true },
    { term: "president", category: "HRP", severity: "mid", requiresContext: true },
    
    // High-Risk Locations
    { term: "escola", category: "HRL", severity: "mid", requiresContext: true },
    { term: "school", category: "HRL", severity: "mid", requiresContext: true },
    { term: "igreja", category: "HRL", severity: "mid", requiresContext: true },
    { term: "church", category: "HRL", severity: "mid", requiresContext: true },
    { term: "hospital", category: "HRL", severity: "mid", requiresContext: true },
    { term: "mesquita", category: "HRL", severity: "mid", requiresContext: true },
    { term: "mosque", category: "HRL", severity: "mid", requiresContext: true },
    { term: "sinagoga", category: "HRL", severity: "mid", requiresContext: true },
    { term: "synagogue", category: "HRL", severity: "mid", requiresContext: true },
    
    // Election Violence
    { term: "stop the steal", category: "Election Violence", severity: "high" },
    { term: "eleição fraudada", category: "Election Violence", severity: "mid", requiresContext: true },
  ],

  // ============================================
  // TA - Tobacco and Alcohol
  // ============================================
  ta: [
    // Tobacco Products
    { term: "cigarro", category: "Tobacco Product", severity: "mid", requiresContext: true },
    { term: "cigarette", category: "Tobacco Product", severity: "mid", requiresContext: true },
    { term: "charuto", category: "Tobacco Product", severity: "mid", requiresContext: true },
    { term: "cigar", category: "Tobacco Product", severity: "mid", requiresContext: true },
    { term: "narguilé", category: "Tobacco Product", severity: "mid" },
    { term: "hookah", category: "Tobacco Product", severity: "mid" },
    { term: "shisha", category: "Tobacco Product", severity: "mid" },
    
    // ENDS/Vaping
    { term: "vape", category: "ENDS", severity: "mid" },
    { term: "vaporizador", category: "ENDS", severity: "mid" },
    { term: "e-cigarette", category: "ENDS", severity: "mid" },
    { term: "cigarro eletrônico", category: "ENDS", severity: "mid" },
    { term: "juul", category: "ENDS Brand", severity: "mid" },
    { term: "pod", category: "ENDS", severity: "mid", requiresContext: true },
    { term: "puff bar", category: "ENDS", severity: "mid" },
    
    // Tobacco Sale Signals
    { term: "vendo cigarro", category: "Tobacco Sale", severity: "high" },
    { term: "selling cigarettes", category: "Tobacco Sale", severity: "high" },
    { term: "vendo vape", category: "ENDS Sale", severity: "high" },
    { term: "selling vape", category: "ENDS Sale", severity: "high" },
    
    // Alcohol Products
    { term: "cerveja", category: "Alcohol Product", severity: "mid", requiresContext: true },
    { term: "beer", category: "Alcohol Product", severity: "mid", requiresContext: true },
    { term: "vinho", category: "Alcohol Product", severity: "mid", requiresContext: true },
    { term: "wine", category: "Alcohol Product", severity: "mid", requiresContext: true },
    { term: "vodka", category: "Alcohol Product", severity: "mid", requiresContext: true },
    { term: "whisky", category: "Alcohol Product", severity: "mid", requiresContext: true },
    { term: "whiskey", category: "Alcohol Product", severity: "mid", requiresContext: true },
    { term: "cachaça", category: "Alcohol Product", severity: "mid", requiresContext: true },
    { term: "tequila", category: "Alcohol Product", severity: "mid", requiresContext: true },
    { term: "rum", category: "Alcohol Product", severity: "mid", requiresContext: true },
    { term: "gin", category: "Alcohol Product", severity: "mid", requiresContext: true },
    
    // Alcohol Sale Signals
    { term: "vendo bebida", category: "Alcohol Sale", severity: "high" },
    { term: "selling alcohol", category: "Alcohol Sale", severity: "high" },
    { term: "delivery de bebidas", category: "Alcohol Sale", severity: "mid" },
    
    // Alcohol Venues/Events
    { term: "happy hour", category: "Alcohol Event", severity: "mid" },
    { term: "open bar", category: "Alcohol Event", severity: "mid" },
    { term: "wine tasting", category: "Alcohol Event", severity: "mid" },
    { term: "degustação", category: "Alcohol Event", severity: "mid", requiresContext: true },
    
    // Consumption Signals
    { term: "beber", category: "Consumption", severity: "low", requiresContext: true },
    { term: "drink", category: "Consumption", severity: "low", requiresContext: true },
    { term: "fumar", category: "Consumption", severity: "low", requiresContext: true },
    { term: "smoke", category: "Consumption", severity: "low", requiresContext: true },
    { term: "vaping", category: "Consumption", severity: "low" },
    
    // Brand Depiction (sample)
    { term: "marlboro", category: "Tobacco Brand", severity: "mid" },
    { term: "heineken", category: "Alcohol Brand", severity: "mid" },
    { term: "budweiser", category: "Alcohol Brand", severity: "mid" },
    { term: "jack daniels", category: "Alcohol Brand", severity: "mid" },
  ],

  // ============================================
  // SSIED - Suicide, Self-Injury, Eating Disorders
  // ============================================
  ssied: [
    // Suicide - Critical (CIS indicators)
    { term: "vou me matar", category: "Suicide Intent", severity: "critical" },
    { term: "going to kill myself", category: "Suicide Intent", severity: "critical" },
    { term: "i will kill myself", category: "Suicide Intent", severity: "critical" },
    { term: "i'm going to end it", category: "Suicide Intent", severity: "critical" },
    { term: "vou acabar com tudo", category: "Suicide Intent", severity: "critical" },
    { term: "suicide note", category: "Suicide Note", severity: "critical" },
    { term: "carta de suicídio", category: "Suicide Note", severity: "critical" },
    { term: "this is goodbye", category: "Suicide Signal", severity: "high" },
    { term: "adeus para sempre", category: "Suicide Signal", severity: "high" },
    
    // Suicide - High
    { term: "quero morrer", category: "Suicide Ideation", severity: "high" },
    { term: "want to die", category: "Suicide Ideation", severity: "high" },
    { term: "wanna die", category: "Suicide Ideation", severity: "high" },
    { term: "suicídio", category: "Suicide", severity: "high", requiresContext: true },
    { term: "suicide", category: "Suicide", severity: "high", requiresContext: true },
    { term: "me enforcar", category: "Suicide Method", severity: "critical" },
    { term: "hang myself", category: "Suicide Method", severity: "critical" },
    { term: "tomar pílulas", category: "Suicide Method", severity: "high" },
    { term: "overdose", category: "Suicide Method", severity: "high" },
    { term: "pular da ponte", category: "Suicide Method", severity: "critical" },
    { term: "jump off bridge", category: "Suicide Method", severity: "critical" },
    { term: "kms", category: "Suicide Slang", severity: "high" },
    { term: "kys", category: "Suicide Incitement", severity: "critical" },
    { term: "kill yourself", category: "Suicide Incitement", severity: "critical" },
    { term: "mata-te", category: "Suicide Incitement", severity: "critical" },
    
    // Self-Injury
    { term: "me cortar", category: "Self-Injury", severity: "high" },
    { term: "cutting myself", category: "Self-Injury", severity: "high" },
    { term: "self-harm", category: "Self-Injury", severity: "high" },
    { term: "autolesão", category: "Self-Injury", severity: "high" },
    { term: "automutilação", category: "Self-Injury", severity: "high" },
    { term: "razor", category: "SI Means", severity: "mid", requiresContext: true },
    { term: "gilete", category: "SI Means", severity: "mid", requiresContext: true },
    { term: "lâmina", category: "SI Means", severity: "mid", requiresContext: true },
    { term: "cortes no braço", category: "Self-Injury", severity: "high" },
    { term: "cuts on arm", category: "Self-Injury", severity: "high" },
    
    // Eating Disorders - Promotion Signals (Critical)
    { term: "thinspo", category: "ED Promotion", severity: "critical" },
    { term: "thinspiration", category: "ED Promotion", severity: "critical" },
    { term: "bonespo", category: "ED Promotion", severity: "critical" },
    { term: "meanspo", category: "ED Promotion", severity: "critical" },
    { term: "proana", category: "ED Promotion", severity: "critical" },
    { term: "pro-ana", category: "ED Promotion", severity: "critical" },
    { term: "promia", category: "ED Promotion", severity: "critical" },
    { term: "pro-mia", category: "ED Promotion", severity: "critical" },
    { term: "edtips", category: "ED Promotion", severity: "critical" },
    { term: "anatips", category: "ED Promotion", severity: "critical" },
    { term: "anabuddy", category: "ED Coordination", severity: "critical" },
    { term: "anagoals", category: "ED Promotion", severity: "critical" },
    
    // Eating Disorders - Context Signals
    { term: "anorexia", category: "ED Type", severity: "high", requiresContext: true },
    { term: "bulimia", category: "ED Type", severity: "high", requiresContext: true },
    { term: "pica", category: "ED Type", severity: "high", requiresContext: true },
    { term: "binge", category: "ED Behavior", severity: "mid", requiresContext: true },
    { term: "purge", category: "ED Behavior", severity: "high" },
    { term: "purgar", category: "ED Behavior", severity: "high" },
    { term: "vomitar", category: "ED Behavior", severity: "mid", requiresContext: true },
    { term: "passar fome", category: "ED Behavior", severity: "mid", requiresContext: true },
    { term: "starving myself", category: "ED Behavior", severity: "high" },
    { term: "thigh gap", category: "ED Signal", severity: "mid" },
    { term: "goal weight", category: "ED Signal", severity: "mid" },
    { term: "gw", category: "ED Signal", severity: "mid", requiresContext: true },
    { term: "ugw", category: "ED Signal", severity: "mid" },
    
    // Extreme Weight Loss
    { term: "menos de 1200 calorias", category: "Extreme Weight Loss", severity: "mid" },
    { term: "under 1200 calories", category: "Extreme Weight Loss", severity: "mid" },
    { term: "jejum de 24 horas", category: "Extreme Weight Loss", severity: "mid" },
    { term: "water fasting", category: "Extreme Weight Loss", severity: "mid" },
    { term: "jejum de água", category: "Extreme Weight Loss", severity: "mid" },
    
    // Viral Events
    { term: "blue whale", category: "Viral Event", severity: "critical" },
    { term: "baleia azul", category: "Viral Event", severity: "critical" },
    { term: "momo challenge", category: "Viral Event", severity: "critical" },
    { term: "jonathan galindo", category: "Viral Event", severity: "critical" },
  ],

  // ============================================
  // OTHER POLICIES (from original)
  // ============================================
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

  hc: [
    { term: "são ratos", category: "Dehumanizing", severity: "critical" },
    { term: "são baratas", category: "Dehumanizing", severity: "critical" },
    { term: "deviam morrer", category: "Harm Statement", severity: "critical" },
    { term: "holocaust didn't happen", category: "Holocaust Denial", severity: "critical" },
  ],

  ase: [
    { term: "revenge porn", category: "NCII", severity: "high" },
    { term: "nudes vazados", category: "NCII", severity: "high" },
    { term: "sextortion", category: "Sextortion", severity: "critical" },
  ],

  fsdp: [
    { term: "documentos falsos", category: "Fake Documents", severity: "critical" },
    { term: "fake id", category: "Fake Documents", severity: "critical" },
    { term: "money flip", category: "Investment Scam", severity: "critical" },
    { term: "guaranteed returns", category: "Investment Scam", severity: "high" },
  ],

  spam: [
    { term: "comprar seguidores", category: "Buy Engagement", severity: "high" },
    { term: "buy followers", category: "Buy Engagement", severity: "high" },
    { term: "curtir para ver", category: "Engagement Gating", severity: "high" },
  ],

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
    ["Firearm", "Firearm Slang BR", "Bladed Weapon"].includes(k.category)
  );
  const hasAmmunitionMention = waeKeywords.some((k) => k.category === "Ammunition");
  const hasExplosiveMention = waeKeywords.some((k) => k.category === "Explosive");
  const has3DPrintingContext = waeKeywords.some((k) => k.category === "3D Printed");
  const hasInstructions = waeKeywords.some((k) => k.category === "Instructions");
  
  const hasSaleIntent = /\b(vendo|compro|vender|comprar|sell|buy|sale|à venda|for sale)\b/i.test(text);
  const hasBrickAndMortar = /\b(loja|store|site oficial|official|retail|armasltda|taurus)\b/i.test(text);
  const hasPeerToPeer = /\b(dm|inbox|whatsapp|telegram|particular|privado)\b/i.test(text) && hasSaleIntent;
  
  const hasCircumventionSignals = /\b(emoji|código|code|foto inbox|pic in dm)\b/i.test(text) ||
    /[🔫💣🗡️🔪]/u.test(text);

  let weaponType: WAEChecks["weaponType"] = "unknown";
  if (has3DPrintingContext) weaponType = "3d_printed";
  else if (hasExplosiveMention) weaponType = "explosive";
  else if (hasAmmunitionMention) weaponType = "ammunition";
  else if (waeKeywords.some((k) => k.category === "Bladed Weapon")) weaponType = "bladed";
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
    ["Dismemberment", "Burning", "Internal Organs", "Dead Body", "Graphic Content"].includes(k.category)
  );
  const hasHumanVictim = /\b(pessoa|human|homem|mulher|man|woman|child|criança)\b/i.test(text);
  const hasAnimalVictim = vgcKeywords.some((k) => 
    ["Animal Cruelty", "Animal Fighting"].includes(k.category)
  );
  const hasFictionalContext = /\b(filme|movie|jogo|game|série|series|animação|animation)\b/i.test(text);
  const hasSadisticIndicators = vgcKeywords.some((k) => 
    ["Sadistic", "Torture"].includes(k.category)
  );
  const hasNewsContext = /\b(notícia|news|reportagem|report|jornal|g1)\b/i.test(text);

  // Calculate severity level (1-10)
  let severityLevel: VGCChecks["severityLevel"] = 10;
  if (vgcKeywords.some((k) => k.severity === "critical")) severityLevel = 1;
  else if (hasSadisticIndicators) severityLevel = 2;
  else if (vgcKeywords.some((k) => k.category === "Dismemberment")) severityLevel = 3;
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
  const hasArmament = viKeywords.some((k) => k.category === "Armament") ||
                      /\b(arma|faca|pistola|gun|knife|weapon|espingarda|rifle)\b/i.test(text);
  const hasLocation = /\b(escola|trabalho|casa|escritório|school|work|home|office|igreja|church)\b/i.test(text);
  const hasMethod = viKeywords.some((k) => 
    ["HSV", "HSV Proxy BR", "HSV Proxy", "MSV", "Death Threat", "Calls for Death"].includes(k.category)
  );
  
  const hasHRP = viKeywords.some((k) => k.category === "HRP");
  const hasHRL = viKeywords.some((k) => k.category === "HRL");
  
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
    ["Tobacco Product", "Tobacco Brand"].includes(k.category)
  );
  const hasAlcoholProduct = taKeywords.some((k) => 
    ["Alcohol Product", "Alcohol Brand", "Alcohol Event"].includes(k.category)
  );
  const hasENDSProduct = taKeywords.some((k) => 
    ["ENDS", "ENDS Brand", "ENDS Sale"].includes(k.category)
  );
  
  const hasSaleIntent = /\b(vendo|compro|vender|comprar|sell|buy|sale|à venda|for sale|delivery)\b/i.test(text);
  const hasBrickAndMortar = /\b(loja|store|restaurante|bar|pub|brewery|cervejaria|vinícola)\b/i.test(text);
  const hasPeerToPeer = /\b(dm|inbox|whatsapp|particular|privado|hmu|hit me up)\b/i.test(text) && hasSaleIntent;
  
  const hasConsumptionDepiction = /\b(bebendo|drinking|fumando|smoking|vaping|tomando)\b/i.test(text);
  const hasBrandDepiction = taKeywords.some((k) => 
    ["Tobacco Brand", "Alcohol Brand", "ENDS Brand"].includes(k.category)
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
  const ssiedKeywords = keywords.filter((k) => k.policy === "ssied");
  
  // Suicide detection
  const hasSuicideContent = ssiedKeywords.some((k) => 
    ["Suicide Intent", "Suicide Ideation", "Suicide Method", "Suicide Slang", "Suicide Note", "Suicide Signal", "Suicide", "Suicide Incitement"].includes(k.category)
  );
  
  // Self-Injury detection
  const hasSelfInjuryContent = ssiedKeywords.some((k) => 
    ["Self-Injury", "SI Means"].includes(k.category)
  );
  
  // Eating Disorder detection
  const hasEatingDisorderContent = ssiedKeywords.some((k) => 
    ["ED Promotion", "ED Coordination", "ED Type", "ED Behavior", "ED Signal", "Extreme Weight Loss"].includes(k.category)
  );
  
  // Promotion signals (critical)
  const hasPromotionSignals = ssiedKeywords.some((k) => 
    ["ED Promotion", "ED Coordination", "Suicide Incitement"].includes(k.category)
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
  const hasViralEventReference = ssiedKeywords.some((k) => k.category === "Viral Event");
  
  // CIS (Credible Intent of Suicide) detection
  const cisHasExplicitIntent = ssiedKeywords.some((k) => 
    ["Suicide Intent", "Suicide Note"].includes(k.category)
  ) || /\b(vou me matar|i will kill myself|going to end it|this is goodbye)\b/i.test(text);
  
  const cisHasCapability = ssiedKeywords.some((k) => 
    ["Suicide Method"].includes(k.category)
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
// ============================================

export function analyzeContent(text: string): Omit<AnalysisResult, "id" | "text" | "timestamp" | "aiAnalysis" | "language" | "processingTime"> {
  // Find keywords
  const keywords = findKeywords(text);
  
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