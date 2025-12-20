export interface KeywordMatch {
  term: string;
  policy: "vi" | "bh";
  category: string;
  severity?: "high" | "mid" | "low";
}

export interface AnalysisResult {
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
}

export interface Policy {
  id: string;
  name: string;
  shortName: string;
  color: string;
  ready: boolean;
}