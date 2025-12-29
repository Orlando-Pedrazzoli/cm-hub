// ============================================
// CM POLICY HUB - ZUSTAND STORE
// State management completo com suporte para Enhanced AI Analysis
// v3.0.3 - Fixed TabType
// ============================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  AnalysisResult,
  PolicyId,
  ActionType,
  Severity,
  KeywordMatch,
  DetectedExceptions,
  VIChecks,
  ConfidenceBreakdown,
  TabType,  // ← IMPORTAR TabType
} from "./types";
import { analyzeContent, mergeWithAIAnalysis } from "./analyzer";

// ============================================
// TYPES
// ============================================

export interface AppSettings {
  // API
  geminiApiKey: string;
  useAI: boolean;
  aiModel: "gemini-2.5-flash" | "gemini-2.0-flash" | "gemini-1.5-pro";
  
  // Features
  enabledPolicies: PolicyId[];
  enableDebugMode: boolean;
  autoSaveHistory: boolean;
  
  // UI
  darkMode: boolean;
  sidebarCollapsed: boolean;
  showAlgorithmDetails: boolean;
  showConfidenceBreakdown: boolean;
}

export interface PreAnalysisData {
  keywords: KeywordMatch[];
  candidatePolicies: PolicyId[];
  primaryCandidate: PolicyId | null;
  exceptions: string[];
  viChecks?: VIChecks;
  ssiedChecks?: {
    hasSuicideContent: boolean;
    hasSelfInjuryContent: boolean;
    hasEDContent: boolean;
    cisHasExplicitIntent: boolean;
    cisHasCapability: boolean;
    cisHasImminence: boolean;
    isCIS: boolean;
    hasPromotionSignals: boolean;
    hasViralEvent: boolean;
    edSignalType: "promotion" | "context" | "benign" | "none";
  };
  bhChecks?: {
    hasTarget: boolean;
    targetType: string;
    hasPurposefulExposure: boolean;
    attackType: string | null;
    tier: number | null;
  };
  language: "pt" | "en" | "multi";
}

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

export interface EnhancedAPIResponse {
  success: boolean;
  analysis: DecisionTreeResponse;
  preAnalysis: PreAnalysisData;
  processingTime: number;
  debug?: {
    promptLength: number;
    responseLength: number;
    model: string;
  };
}

interface HistoryItem extends AnalysisResult {
  id: string;
  timestamp: number;
}

interface AppState {
  // Settings
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  
  // Current Analysis
  currentText: string;
  setCurrentText: (text: string) => void;
  currentResult: AnalysisResult | null;
  isAnalyzing: boolean;
  analysisError: string | null;
  
  // Pre-analysis data (from enhanced API)
  preAnalysisData: PreAnalysisData | null;
  
  // History
  history: HistoryItem[];
  addToHistory: (result: AnalysisResult) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
  
  // Active UI state - USAR TabType
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedPolicy: PolicyId | null;
  setSelectedPolicy: (policy: PolicyId | null) => void;
  
  // Actions
  analyze: (text: string) => Promise<AnalysisResult>;
  resetAnalysis: () => void;
}

// ============================================
// HELPERS
// ============================================

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function detectLanguage(text: string): "pt" | "en" | "multi" {
  const ptPatterns = /\b(você|voce|não|nao|está|são|também|porque|já|obrigado|olá|boa|bom)\b/i;
  const enPatterns = /\b(the|is|are|was|have|has|will|would|could|hello|thank|please)\b/i;
  
  const hasPt = ptPatterns.test(text);
  const hasEn = enPatterns.test(text);
  
  if (hasPt && hasEn) return "multi";
  if (hasPt) return "pt";
  return "en";
}

// Policy name mapping for decision path
const POLICY_MAP: Record<string, PolicyId> = {
  "ssied": "ssied",
  "suicide": "ssied",
  "self-injury": "ssied",
  "eating disorder": "ssied",
  "vi": "vi",
  "violence": "vi",
  "violence and incitement": "vi",
  "threatening": "vi",
  "bh": "bh",
  "bullying": "bh",
  "harassment": "bh",
  "bullying and harassment": "bh",
  "hc": "hc",
  "hate": "hc",
  "hateful conduct": "hc",
  "csean": "csean",
  "child exploitation": "csean",
  "he": "he",
  "human exploitation": "he",
  "human trafficking": "he",
  "ase": "ase",
  "adult sexual exploitation": "ase",
  "ansa": "ansa",
  "adult nudity": "ansa",
  "sspx": "sspx",
  "sexual solicitation": "sspx",
  "vgc": "vgc",
  "violent and graphic content": "vgc",
  "doi": "doi",
  "dangerous organizations": "doi",
  "chpc": "chpc",
  "coordinating harm": "chpc",
  "fsdp": "fsdp",
  "fraud": "fsdp",
  "dp": "dp",
  "drugs": "dp",
  "ta": "ta",
  "tobacco": "ta",
  "wae": "wae",
  "weapons": "wae",
  "pv": "pv",
  "privacy": "pv",
  "cyber": "cyber",
  "spam": "spam",
  "ogg": "ogg",
  "gambling": "ogg",
  "hw": "hw",
  "health": "hw",
  "rp": "rp",
  "psl": "psl",
};

function mapPolicyFromPath(decisionPath: string[]): PolicyId | null {
  if (decisionPath.length < 2) return null;
  
  const category = decisionPath[1]?.toLowerCase().trim() || "";
  
  // Direct match
  if (POLICY_MAP[category]) {
    return POLICY_MAP[category];
  }
  
  // Partial match
  for (const [key, value] of Object.entries(POLICY_MAP)) {
    if (category.includes(key) || key.includes(category)) {
      return value;
    }
  }
  
  // Escalation mapping
  if (decisionPath[0]?.toLowerCase() === "escalate") {
    const escalateCategory = decisionPath[1]?.toLowerCase() || "";
    if (escalateCategory.includes("suicide")) return "ssied";
    if (escalateCategory.includes("child")) return "csean";
    if (escalateCategory.includes("threat")) return "vi";
    if (escalateCategory.includes("trafficking")) return "he";
  }
  
  return null;
}

// ============================================
// TYPE FOR LOCAL ANALYSIS (without language and aiAnalysis)
// ============================================
type LocalAnalysisResult = Omit<AnalysisResult, "id" | "text" | "timestamp" | "processingTime" | "language" | "aiAnalysis">;

// ============================================
// MERGE FUNCTION - Updated for Enhanced API
// ============================================

function mergeWithEnhancedAIAnalysis(
  baseAnalysis: LocalAnalysisResult,
  aiResponse: DecisionTreeResponse,
  preAnalysis?: PreAnalysisData
): Omit<AnalysisResult, "id" | "text" | "timestamp" | "processingTime"> {
  
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

  // Calculate adjusted confidence
  const aiConfidence = aiResponse.confidence;
  const localConfidence = baseAnalysis.confidence;
  
  const finalConfidence = aiConfidence >= 80 
    ? aiConfidence 
    : aiConfidence >= 60 
      ? Math.round((aiConfidence * 0.7) + (localConfidence * 0.3))
      : Math.round((aiConfidence * 0.5) + (localConfidence * 0.5));

  // Merge keywords from pre-analysis if richer
  let finalKeywords = baseAnalysis.keywords;
  if (preAnalysis?.keywords && preAnalysis.keywords.length > baseAnalysis.keywords.length) {
    finalKeywords = preAnalysis.keywords;
  }

  // Merge exceptions
  let finalExceptions = baseAnalysis.exceptions;
  if (preAnalysis?.exceptions && preAnalysis.exceptions.length > 0) {
    finalExceptions = {
      ...baseAnalysis.exceptions,
      detected: [...new Set([
        ...baseAnalysis.exceptions.detected,
        ...preAnalysis.exceptions
      ])],
    };
  }

  // Merge VI checks
  let finalChecks = baseAnalysis.checks;
  if (preAnalysis?.viChecks) {
    finalChecks = {
      ...baseAnalysis.checks,
      vi: preAnalysis.viChecks,
    };
  }

  // Get language from pre-analysis or default to pt
  const language = preAnalysis?.language || "pt";

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
    confidence: finalConfidence,
    keywords: finalKeywords,
    exceptions: finalExceptions,
    checks: finalChecks,
    language,
    confidenceBreakdown: {
      ...baseAnalysis.confidenceBreakdown,
      aiAdjustment: finalConfidence - localConfidence,
    },
    aiAnalysis: {
      used: true,
      model: "gemini-2.5-flash",
      reasoning: [aiResponse.reasoning],
      suggestedPolicy: primaryPolicy,
      suggestedLabel: aiResponse.fullLabel,
      suggestedAction: action,
      adjustedConfidence: aiConfidence,
    },
  };
}

// ============================================
// DEFAULT VALUES
// ============================================

const DEFAULT_SETTINGS: AppSettings = {
  geminiApiKey: "",
  useAI: true,
  aiModel: "gemini-2.5-flash",
  enabledPolicies: [
    "vi", "bh", "ssied", "hc", "csean", "he", "ase", "ansa", 
    "sspx", "vgc", "doi", "chpc", "fsdp", "dp", "ta", "wae",
    "pv", "cyber", "spam", "ogg", "hw", "rp", "psl"
  ],
  enableDebugMode: false,
  autoSaveHistory: true,
  darkMode: true,
  sidebarCollapsed: false,
  showAlgorithmDetails: false,
  showConfidenceBreakdown: false,
};

const DEFAULT_ANALYSIS_RESULT: Omit<AnalysisResult, "id" | "text" | "timestamp" | "processingTime"> = {
  primaryPolicy: null,
  primaryPolicyName: null,
  detectedPolicies: [],
  action: "no_action",
  label: null,
  labelPath: [],
  shouldEscalate: false,
  escalationReason: undefined,
  confidence: 0,
  keywords: [],
  exceptions: {
    hasSelfDefense: false,
    hasRedemption: false,
    hasCondemning: false,
    hasHypothetical: false,
    hasEducational: false,
    hasNewsReporting: false,
    hasArtisticContext: false,
    hasSatire: false,
    hasEndearingContext: false,
    hasCriminalAllegation: false,
    hasBusinessReview: false,
    hasFightSportContext: false,
    hasMedicalContext: false,
    hasFamilyContext: false,
    hasRecoveryContext: false,
    hasAwarenessContext: false,
    hasBrickAndMortar: false,
    hasReligiousContext: false,
    hasFictionalContext: false,
    detected: [],
  },
  checks: {},
  confidenceBreakdown: {
    keywordMatch: 0,
    contextAnalysis: 0,
    aiAdjustment: 0,
    exceptionPenalty: 0,
  },
  language: "pt",
  aiAnalysis: undefined,
};

// ============================================
// STORE
// ============================================

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Settings
      settings: DEFAULT_SETTINGS,
      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),

      // Current Analysis
      currentText: "",
      setCurrentText: (text) => set({ currentText: text }),
      currentResult: null,
      isAnalyzing: false,
      analysisError: null,
      preAnalysisData: null,

      // History
      history: [],
      addToHistory: (result) =>
        set((state) => {
          const historyItem: HistoryItem = {
            ...result,
            id: result.id || generateId(),
            timestamp: result.timestamp || Date.now(),
          };
          // Keep max 100 items
          const newHistory = [historyItem, ...state.history].slice(0, 100);
          return { history: newHistory };
        }),
      removeFromHistory: (id) =>
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        })),
      clearHistory: () => set({ history: [] }),

      // Active UI state - AGORA USA TabType
      activeTab: "analyzer",
      setActiveTab: (tab: TabType) => set({ activeTab: tab }),
      selectedPolicy: null,
      setSelectedPolicy: (policy) => set({ selectedPolicy: policy }),

      // Reset analysis
      resetAnalysis: () =>
        set({
          currentText: "",
          currentResult: null,
          isAnalyzing: false,
          analysisError: null,
          preAnalysisData: null,
        }),

      // ============================================
      // MAIN ANALYZE FUNCTION
      // ============================================
      analyze: async (text: string): Promise<AnalysisResult> => {
        const startTime = performance.now();

        set({
          isAnalyzing: true,
          analysisError: null,
          currentText: text,
          preAnalysisData: null,
        });

        try {
          // Step 1: Local keyword analysis (backup/base)
          const localAnalysis = analyzeContent(text);

          const { settings } = get();
          
          // Initialize finalAnalysis with language added
          let finalAnalysis: Omit<AnalysisResult, "id" | "text" | "timestamp" | "processingTime"> = {
            ...localAnalysis,
            language: detectLanguage(text),
            aiAnalysis: undefined,
          };
          
          let preAnalysisData: PreAnalysisData | null = null;

          // Step 2: Enhanced AI analysis (if enabled)
          if (settings.useAI) {
            try {
              const response = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  text,
                  options: {
                    useAI: true,
                    includeDebugInfo: settings.enableDebugMode,
                  },
                }),
              });

              if (response.ok) {
                const data: EnhancedAPIResponse = await response.json();

                if (data.success && data.analysis) {
                  // Store pre-analysis data for UI display
                  preAnalysisData = data.preAnalysis;

                  // Merge AI analysis with local analysis
                  finalAnalysis = mergeWithEnhancedAIAnalysis(
                    localAnalysis,
                    data.analysis,
                    data.preAnalysis
                  );

                  console.log("✅ AI analysis successful", {
                    action: data.analysis.action,
                    confidence: data.analysis.confidence,
                    preAnalysisKeywords: data.preAnalysis?.keywords?.length || 0,
                  });
                }
              } else {
                const errorData = await response.json();
                console.warn("⚠️ AI analysis failed:", errorData.error);

                // Handle specific error codes
                if (errorData.code === "SAFETY_BLOCK") {
                  set({ analysisError: "Conteúdo bloqueado pelos filtros de segurança" });
                } else if (errorData.code === "RATE_LIMIT") {
                  set({ analysisError: "Limite de requisições excedido. Aguarde alguns minutos." });
                } else if (errorData.code === "TRUNCATED_RESPONSE") {
                  set({ analysisError: "Resposta da IA foi truncada. Tente novamente." });
                }
                // Continue with local analysis
              }
            } catch (aiError) {
              console.warn("⚠️ AI analysis error:", aiError);
              // Continue with local analysis
            }
          }

          // Calculate processing time
          const processingTime = performance.now() - startTime;

          // Build complete result
          const result: AnalysisResult = {
            id: generateId(),
            text,
            timestamp: Date.now(),
            ...finalAnalysis,
            processingTime,
          };

          // Update state
          set({
            currentResult: result,
            isAnalyzing: false,
            preAnalysisData,
          });

          // Auto-save to history
          if (settings.autoSaveHistory) {
            get().addToHistory(result);
          }

          return result;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
          console.error("❌ Analysis error:", error);
          
          set({
            isAnalyzing: false,
            analysisError: errorMessage,
          });
          
          throw error;
        }
      },
    }),
    {
      name: "cm-policy-hub-storage-v3",
      partialize: (state) => ({
        settings: state.settings,
        history: state.history.slice(0, 50), // Only persist last 50 items
      }),
    }
  )
);

// ============================================
// SELECTORS (for optimized re-renders)
// ============================================

export const useSettings = () => useAppStore((state) => state.settings);
export const useCurrentResult = () => useAppStore((state) => state.currentResult);
export const useIsAnalyzing = () => useAppStore((state) => state.isAnalyzing);
export const useAnalysisError = () => useAppStore((state) => state.analysisError);
export const useHistory = () => useAppStore((state) => state.history);
export const usePreAnalysisData = () => useAppStore((state) => state.preAnalysisData);
export const useActiveTab = () => useAppStore((state) => state.activeTab);

// ============================================
// ACTIONS (for cleaner component code)
// ============================================

export const appActions = {
  analyze: (text: string) => useAppStore.getState().analyze(text),
  resetAnalysis: () => useAppStore.getState().resetAnalysis(),
  updateSettings: (updates: Partial<AppSettings>) => 
    useAppStore.getState().updateSettings(updates),
  addToHistory: (result: AnalysisResult) => 
    useAppStore.getState().addToHistory(result),
  clearHistory: () => useAppStore.getState().clearHistory(),
  setActiveTab: (tab: TabType) => 
    useAppStore.getState().setActiveTab(tab),
};

export default useAppStore;