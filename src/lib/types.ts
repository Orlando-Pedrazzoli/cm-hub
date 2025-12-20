export interface KeywordMatch {
  term: string;
  policy: "vi" | "bh";
  category: string;
  severity?: "high" | "mid" | "low";
  isAmbiguous?: boolean;
}

export interface AnalysisResult {
  id: string;
  text: string;
  timestamp: number;
  keywords: KeywordMatch[];
  policy: "vi" | "bh" | null;
  policyName: string | null;
  label: string | null;
  labelPath: string[];
  shouldEscalate: boolean;
  confidence: number;
  checks: {
    hasTarget: boolean;
    hasIntent: boolean;
    hasTiming: boolean;
    hasArmament: boolean;
    hasLocation: boolean;
  };
  exceptions: {
    hasSelfDefense: boolean;
    hasRedemption: boolean;
    hasCondemning: boolean;
    hasHypothetical: boolean;
    detected: string[];
  };
  aiAnalysis?: {
    used: boolean;
    reasoning: string[];
    adjustedLabel?: string;
    adjustedConfidence?: number;
  };
}

export interface Policy {
  id: string;
  name: string;
  shortName: string;
  color: string;
  ready: boolean;
  description?: string;
}

export interface AppSettings {
  geminiApiKey: string;
  useAI: boolean;
  theme: "dark" | "light";
  autoSaveHistory: boolean;
}

export type TabType = "analyzer" | "history" | "policies" | "settings";