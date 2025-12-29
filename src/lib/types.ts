// ============================================
// CM POLICY HUB - TYPES
// Suporta 27 policies de moderação de conteúdo
// ============================================

// Policy IDs - todas as 27 policies
export type PolicyId = 
  | "ansa"   // Adult Nudity and Sexual Activity
  | "ase"    // Adult Sexual Exploitation
  | "sspx"   // Adult Sexual Solicitation & Sexually Explicit Language
  | "bh"     // Bullying and Harassment
  | "csean"  // Child Sexual Exploitation, Abuse, and Nudity
  | "vi"     // Violence and Incitement
  | "vgc"    // Violent and Graphic Content
  | "doi"    // Dangerous Organizations and Individuals
  | "hc"     // Hateful Conduct
  | "ssied"  // Suicide, Self-Injury, and Eating Disorders
  | "he"     // Human Exploitation
  | "pv"     // Privacy Violations
  | "fsdp"   // Fraud, Scam, and Deceptive Practices
  | "cyber"  // Cybersecurity
  | "chpc"   // Coordinating Harm and Promoting Crime
  | "dp"     // Drugs and Pharmaceuticals
  | "ta"     // Tobacco and Alcohol
  | "wae"    // Weapons, Ammunition, and Explosives
  | "ogg"    // Online Gambling and Games
  | "hw"     // Health and Wellness
  | "spam"   // Spam
  | "rp"     // Recalled Products
  | "bcp"    // Branded Content Prohibited
  | "bcr"    // Branded Content Restricted
  | "psl"    // Profane and Sexualized Language
  | "orgs"   // Other RGS
  | "cis";   // Credible Intent of Suicide

// Severity levels
export type Severity = "critical" | "high" | "mid" | "low" | "info";

// Action types - includes "information" for PSL
export type ActionType = "escalate" | "label" | "no_action" | "mute" | "information";

// ============================================
// KEYWORD MATCH
// ============================================
export interface KeywordMatch {
  term: string;
  policy: PolicyId;
  category: string;
  subcategory?: string;
  severity: Severity;
  isAmbiguous?: boolean;
  requiresContext?: boolean;
  contextNotes?: string;
}

// ============================================
// POLICY-SPECIFIC CHECKS
// ============================================

// Violence and Incitement checks
export interface VIChecks {
  hasTarget: boolean;
  hasIntent: boolean;
  hasTiming: boolean;
  hasArmament: boolean;
  hasLocation: boolean;
  hasMethod: boolean;
  isCredibleThreat: boolean;
}

// Bullying and Harassment checks
export interface BHChecks {
  hasIdentifiableTarget: boolean;
  targetType: "public_figure" | "private_adult" | "private_minor" | "lspf" | "unknown";
  hasNameFaceMatch: boolean;
  hasPurposefulExposure: boolean;
  hasSelfReport: boolean;
  isEndearingContext: boolean;
  isCriminalAllegation: boolean;
  isBusinessReview: boolean;
}

// Child Safety checks (CSEAN)
export interface CSEANChecks {
  hasMinorPresent: boolean;
  ageCategory: "baby" | "toddler" | "minor" | "unknown";
  isRealOrNonReal: "real" | "non_real" | "unknown";
  hasCSAMIndicators: boolean;
  hasSolicitationSignals: boolean;
  hasIICElements: boolean;
  hasSexualizationSignals: boolean;
  isExploitativeContent: boolean;
}

// Adult Sexual Content checks (ANSA, ASE, SSPx)
export interface AdultSexualChecks {
  hasExplicitNudity: boolean;
  hasImplicitNudity: boolean;
  hasSexualActivity: boolean;
  hasExploitationIndicators: boolean;
  hasSolicitationSignals: boolean;
  hasConsentIndicators: boolean;
  isCommercialContent: boolean;
  contextType: "artistic" | "educational" | "medical" | "news" | "commercial" | "personal" | "unknown";
}

// Combined checks object
export interface PolicyChecks {
  vi?: VIChecks;
  bh?: BHChecks;
  csean?: CSEANChecks;
  adultSexual?: AdultSexualChecks;
}

// ============================================
// EXCEPTIONS / CONTEXT
// ============================================
export interface DetectedExceptions {
  // General exceptions
  hasSelfDefense: boolean;
  hasRedemption: boolean;
  hasCondemning: boolean;
  hasHypothetical: boolean;
  hasEducational: boolean;
  hasNewsReporting: boolean;
  hasArtisticContext: boolean;
  hasSatire: boolean;
  
  // B&H specific
  hasEndearingContext: boolean;
  hasCriminalAllegation: boolean;
  hasBusinessReview: boolean;
  hasFightSportContext: boolean;
  
  // CSEAN specific
  hasMedicalContext: boolean;
  hasFamilyContext: boolean;
  
  // SSIED / ED specific
  hasRecoveryContext: boolean;
  hasAwarenessContext: boolean;
  
  // RGS / Commercial specific
  hasBrickAndMortar: boolean;
  
  // DOI / HC specific
  hasReligiousContext: boolean;
  hasFictionalContext: boolean;
  
  // List of all detected
  detected: string[];
}

// ============================================
// CONFIDENCE BREAKDOWN
// ============================================
export interface ConfidenceBreakdown {
  keywordMatch: number;
  contextAnalysis: number;
  aiAdjustment: number;
  exceptionPenalty?: number;
}

// ============================================
// ANALYSIS RESULT
// ============================================
export interface AnalysisResult {
  id: string;
  text: string;
  timestamp: number;
  
  // Keyword detection
  keywords: KeywordMatch[];
  
  // Primary policy determination
  primaryPolicy: PolicyId | null;
  primaryPolicyName: string | null;
  
  // All policies that may apply
  detectedPolicies: {
    policy: PolicyId;
    policyName: string;
    confidence: number;
    categories: string[];
  }[];
  
  // Action recommendation
  action: ActionType;
  label: string | null;
  labelPath: string[];
  shouldEscalate: boolean;
  escalationReason?: string;
  
  // Confidence score
  confidence: number;
  confidenceBreakdown: ConfidenceBreakdown;
  
  // Policy-specific checks
  checks: PolicyChecks;
  
  // Exceptions detected
  exceptions: DetectedExceptions;
  
  // AI Analysis (if enabled)
  aiAnalysis?: AIAnalysisResult;
  
  // Hierarchy position (for multiple violations)
  hierarchyRank?: number;
  
  // Additional metadata
  language: string;
  processingTime: number;
}

// ============================================
// AI ANALYSIS
// ============================================
export interface AIAnalysisResult {
  used: boolean;
  model: string;
  reasoning: string[];
  
  suggestedPolicy: PolicyId | null;
  suggestedLabel: string | null;
  suggestedAction: ActionType;
  
  adjustedConfidence: number;
  
  additionalContext?: string;
  ambiguityNotes?: string[];
  
  // Raw response for debugging
  rawResponse?: string;
}

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

// ============================================
// POLICY DEFINITION
// ============================================

// Policy Exception interface - examples is OPTIONAL
export interface PolicyException {
  id: string;
  name: string;
  description: string;
  appliesTo: string[];
  examples?: string[];
}

// Variation Rules interface (for PSL, etc.)
export interface VariationRules {
  qualifies: string[];
  doesNotQualify: string[];
}

// Policy Subcategory interface - action is OPTIONAL (inherits from parent category)
export interface PolicySubcategory {
  id: string;
  name: string;
  description?: string;
  action?: ActionType;
  examples?: string[];
  conditions?: string[];
}

// Policy Category with optional subcategories
export interface PolicyCategory {
  id: string;
  name: string;
  description?: string;
  severity: Severity;
  requiresEscalation?: boolean;
  requiresChecks?: string[];
  subcategories?: PolicySubcategory[];
}

// Label Hierarchy Item
export interface LabelHierarchyItem {
  id: string;
  label: string;
  path: string[];
  action: ActionType;
  severity: Severity;
  conditions?: string[];
}

// ============================================
// POLICY-SPECIFIC TYPES
// ============================================

// CHPC - Outing Risk Groups
export interface OutingRiskGroup {
  group: string;
  countries: string[];
  terms: string[];
}

// HC - Protected Characteristic
export interface ProtectedCharacteristic {
  id: string;
  name: string;
  description: string;
}

// HC - Harmful Stereotype
export interface HarmfulStereotype {
  name: string;
  criteria: string[];
  exception?: string;
}

// HC - Proxy
export interface ProxyDefinition {
  term: string;
  proxy: string;
  context: string;
}

// HC - Subsets
export interface SubsetDefinition {
  description: string;
  examples: string[];
}

export interface HCSubsets {
  fullyProtected: SubsetDefinition;
  quasiProtected: SubsetDefinition;
  otherCriminal: SubsetDefinition;
  nonProtected: SubsetDefinition;
}

// HC - Proxies
export interface HCProxies {
  description: string;
  examples: ProxyDefinition[];
}

// SSIED - Escalation Criteria
export interface EscalationRequirement {
  name: string;
  description: string;
  examples: string[];
}

export interface SSIEDEscalationCriteria {
  name: string;
  description: string;
  requirements: {
    allRequired: EscalationRequirement[];
  };
  action: string;
}

// SSIED - Viral Event
export interface ViralEvent {
  name: string;
  status: string;
  type: string;
}

// SSIED - ED Signals
export interface EDSignals {
  promotional: string[];
  contextual: string[];
  benign: string[];
}

// SPAM - Monetary Value
export interface MonetaryValueDefinition {
  hasMoney: string[];
  noMoney: string[];
}

// FSDP - Secondary Indicators
export interface FSDPSecondaryIndicators {
  general: string[];
  loan: string[];
  gambling: string[];
  investment: string[];
  romance: string[];
  job: string[];
}

// ============================================
// POLICY DEFINITION WITH ALL PROPERTIES
// ============================================
export interface PolicyDefinition {
  id: PolicyId;
  name: string;
  shortName: string;
  description: string;
  color: string;
  icon?: string;
  ready: boolean;
  
  // Categories within the policy
  categories: PolicyCategory[];
  
  // Label hierarchy (optional for simpler policies)
  labelHierarchy?: LabelHierarchyItem[];
  
  // Exceptions (No Action contexts)
  exceptions?: PolicyException[];
  
  // Variation rules (for PSL, etc.)
  variationRules?: VariationRules;
  
  // Glossary definitions
  glossary?: Record<string, string>;
  
  // Operational guidelines
  operationalGuidelines?: Record<string, string>;
  
  // Keywords (loaded separately for performance)
  keywordsLoaded?: boolean;

  // ============================================
  // CHPC - Coordinating Harm and Promoting Crime
  // ============================================
  outingRiskGroups?: OutingRiskGroup[];
  highRiskChallenges?: string[];
  midRiskStunts?: string[];
  communicableDiseases?: string[];

  // ============================================
  // CYBER - Cybersecurity
  // ============================================
  sensitiveUserInfo?: string[];
  legitimateMetaDomains?: string[];
  securityQuestions?: string[];
  dangerousFileExtensions?: string[];

  // ============================================
  // FSDP - Fraud, Scam, and Deceptive Practices
  // ============================================
  solicitationSignals?: string[];
  secondaryIndicators?: FSDPSecondaryIndicators | Record<string, string[]>;
  cardingKeywords?: string[];
  unauthorizedStreamingBrands?: string[];
  jailbrokenDeviceTerms?: string[];
  lifeThreatening?: string[];
  nonLifeThreatening?: string[];

  // ============================================
  // HC - Hateful Conduct
  // ============================================
  protectedCharacteristics?: ProtectedCharacteristic[];
  quasiProtectedCharacteristics?: ProtectedCharacteristic[];
  subsets?: HCSubsets;
  harmfulStereotypes?: HarmfulStereotype[];
  proxies?: HCProxies;

  // ============================================
  // SPAM - Spam
  // ============================================
  sitePrivileges?: string[];
  fakeFunctionalities?: string[];
  realFunctionalities?: Record<string, string[]>;
  monetaryValue?: MonetaryValueDefinition;

  // ============================================
  // SSIED - Suicide, Self-Injury, Eating Disorders
  // ============================================
  escalationCriteria?: SSIEDEscalationCriteria;
  viralEvents?: ViralEvent[];
  edSignals?: EDSignals;
  bodyPartsForIdealisation?: string[];
  extremeWeightLossCriteria?: string[];
  restrictiveDietingCriteria?: string[];
}

// ============================================
// APP SETTINGS
// ============================================
export interface AppSettings {
  // API Configuration
  geminiApiKey: string;
  useAI: boolean;
  aiModel: "gemini-2.5-flash" | "gemini-2.0-flash" | "gemini-1.5-pro";
  
  // UI Settings
  theme: "dark" | "light" | "system";
  language: "pt" | "en";
  
  // Analysis Settings
  autoSaveHistory: boolean;
  showConfidenceBreakdown: boolean;
  showKeywordHighlights: boolean;
  enableDebugMode: boolean;
  
  // Policy Settings
  enabledPolicies: PolicyId[];
  defaultMarket: string;
}

// ============================================
// HISTORY & STORAGE
// ============================================
export interface AnalysisHistoryItem {
  id: string;
  text: string;
  textPreview: string;
  timestamp: number;
  result: AnalysisResult;
  starred: boolean;
  notes?: string;
  tags?: string[];
}

// ============================================
// UI TYPES
// ============================================
export type TabType = "analyzer" | "history" | "policies" | "settings" | "help";

export interface TabConfig {
  id: TabType;
  label: string;
  icon: string;
  description: string;
}

// ============================================
// API TYPES
// ============================================
export interface AnalyzeRequest {
  text: string;
  options?: {
    useAI?: boolean;
    enabledPolicies?: PolicyId[];
    market?: string;
    includeDebugInfo?: boolean;
  };
}

export interface AnalyzeResponse {
  success: boolean;
  result?: AnalysisResult;
  error?: string;
  processingTime: number;
}

// ============================================
// CONSTANTS
// ============================================
export const POLICY_NAMES: Record<PolicyId, string> = {
  ansa: "Adult Nudity and Sexual Activity",
  ase: "Adult Sexual Exploitation",
  sspx: "Adult Sexual Solicitation & Sexually Explicit Language",
  bh: "Bullying and Harassment",
  csean: "Child Sexual Exploitation, Abuse, and Nudity",
  vi: "Violence and Incitement",
  vgc: "Violent and Graphic Content",
  doi: "Dangerous Organizations and Individuals",
  hc: "Hateful Conduct",
  ssied: "Suicide, Self-Injury, and Eating Disorders",
  he: "Human Exploitation",
  pv: "Privacy Violations",
  fsdp: "Fraud, Scam, and Deceptive Practices",
  cyber: "Cybersecurity",
  chpc: "Coordinating Harm and Promoting Crime",
  dp: "Drugs and Pharmaceuticals",
  ta: "Tobacco and Alcohol",
  wae: "Weapons, Ammunition, and Explosives",
  ogg: "Online Gambling and Games",
  hw: "Health and Wellness",
  spam: "Spam",
  rp: "Recalled Products",
  bcp: "Branded Content Prohibited",
  bcr: "Branded Content Restricted",
  psl: "Profane and Sexualized Language",
  orgs: "Other RGS",
  cis: "Credible Intent of Suicide",
};

export const POLICY_COLORS: Record<PolicyId, string> = {
  ansa: "#e91e63",
  ase: "#9c27b0",
  sspx: "#673ab7",
  bh: "#ff9800",
  csean: "#f44336",
  vi: "#d32f2f",
  vgc: "#c62828",
  doi: "#b71c1c",
  hc: "#e65100",
  ssied: "#7b1fa2",
  he: "#ad1457",
  pv: "#1565c0",
  fsdp: "#00838f",
  cyber: "#0277bd",
  chpc: "#bf360c",
  dp: "#4a148c",
  ta: "#6a1b9a",
  wae: "#880e4f",
  ogg: "#00695c",
  hw: "#2e7d32",
  spam: "#757575",
  rp: "#5d4037",
  bcp: "#3949ab",
  bcr: "#303f9f",
  psl: "#f06292",
  orgs: "#78909c",
  cis: "#6a1b9a",
};

export const SEVERITY_COLORS: Record<Severity, string> = {
  critical: "#d32f2f",
  high: "#f44336",
  mid: "#ff9800",
  low: "#ffc107",
  info: "#2196f3",
};

// Includes "information" action
export const ACTION_LABELS: Record<ActionType, string> = {
  escalate: "ESCALATE",
  label: "LABEL",
  no_action: "NO ACTION",
  mute: "MUTE",
  information: "INFORMATION",
};