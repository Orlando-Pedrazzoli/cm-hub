// ============================================
// CM POLICY HUB - ZUSTAND STORE
// Estado global da aplicação
// ============================================

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  AnalysisResult,
  AppSettings,
  TabType,
  PolicyId,
  AnalysisHistoryItem,
} from "./types";
import { analyzeContent, mergeWithAIAnalysis, GeminiAnalysis } from "./analyzer";

// ============================================
// STORE INTERFACE
// ============================================

interface AppState {
  // Current tab
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;

  // Analysis
  currentText: string;
  setCurrentText: (text: string) => void;
  currentResult: AnalysisResult | null;
  isAnalyzing: boolean;
  analysisError: string | null;
  
  // Analysis actions
  analyze: (text: string) => Promise<AnalysisResult>;
  clearResult: () => void;

  // History
  history: AnalysisHistoryItem[];
  addToHistory: (result: AnalysisResult) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
  toggleStarred: (id: string) => void;
  addNoteToHistory: (id: string, note: string) => void;

  // Settings
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  resetSettings: () => void;

  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  showKeywordHighlights: boolean;
  setShowKeywordHighlights: (show: boolean) => void;
}

// ============================================
// DEFAULT SETTINGS
// ============================================

const defaultSettings: AppSettings = {
  geminiApiKey: "",
  useAI: true,
  aiModel: "gemini-2.5-flash",
  theme: "dark",
  language: "pt",
  autoSaveHistory: true,
  showConfidenceBreakdown: true,
  showKeywordHighlights: true,
  enableDebugMode: false,
  enabledPolicies: ["csean", "vi", "bh", "ase", "sspx", "ansa"],
  defaultMarket: "PT",
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

// ============================================
// STORE IMPLEMENTATION
// ============================================

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ============================================
      // TAB STATE
      // ============================================
      activeTab: "analyzer",
      setActiveTab: (tab) => set({ activeTab: tab }),

      // ============================================
      // ANALYSIS STATE
      // ============================================
      currentText: "",
      setCurrentText: (text) => set({ currentText: text }),
      currentResult: null,
      isAnalyzing: false,
      analysisError: null,

      // ============================================
      // ANALYSIS ACTIONS
      // ============================================
      analyze: async (text: string): Promise<AnalysisResult> => {
        const startTime = performance.now();
        
        set({
          isAnalyzing: true,
          analysisError: null,
          currentText: text,
        });

        try {
          // Step 1: Local keyword analysis
          const localAnalysis = analyzeContent(text);

          // Step 2: AI analysis (if enabled)
          const { settings } = get();
          let finalAnalysis = localAnalysis;

          if (settings.useAI) {
            try {
              const response = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  text,
                  options: {
                    useAI: true,
                    enabledPolicies: settings.enabledPolicies,
                    includeDebugInfo: settings.enableDebugMode,
                  },
                }),
              });

              if (response.ok) {
                const data = await response.json();
                if (data.success && data.analysis) {
                  finalAnalysis = mergeWithAIAnalysis(
                    localAnalysis,
                    data.analysis as GeminiAnalysis
                  );
                }
              } else {
                const errorData = await response.json();
                console.warn("AI analysis failed:", errorData.error);
                // Continue with local analysis only
              }
            } catch (aiError) {
              console.warn("AI analysis error:", aiError);
              // Continue with local analysis only
            }
          }

          // Build complete result
          const processingTime = performance.now() - startTime;
          const result: AnalysisResult = {
            id: generateId(),
            text,
            timestamp: Date.now(),
            ...finalAnalysis,
            language: detectLanguage(text),
            processingTime,
          };

          // Update state
          set({
            currentResult: result,
            isAnalyzing: false,
          });

          // Auto-save to history
          if (settings.autoSaveHistory) {
            get().addToHistory(result);
          }

          return result;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Erro desconhecido";
          
          set({
            isAnalyzing: false,
            analysisError: errorMessage,
          });

          throw error;
        }
      },

      clearResult: () =>
        set({
          currentResult: null,
          currentText: "",
          analysisError: null,
        }),

      // ============================================
      // HISTORY ACTIONS
      // ============================================
      history: [],

      addToHistory: (result) =>
        set((state) => {
          const historyItem: AnalysisHistoryItem = {
            id: result.id,
            text: result.text,
            textPreview: truncateText(result.text),
            timestamp: result.timestamp,
            result,
            starred: false,
          };

          // Limit history to 100 items
          const newHistory = [historyItem, ...state.history].slice(0, 100);
          
          return { history: newHistory };
        }),

      removeFromHistory: (id) =>
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        })),

      clearHistory: () => set({ history: [] }),

      toggleStarred: (id) =>
        set((state) => ({
          history: state.history.map((item) =>
            item.id === id ? { ...item, starred: !item.starred } : item
          ),
        })),

      addNoteToHistory: (id, note) =>
        set((state) => ({
          history: state.history.map((item) =>
            item.id === id ? { ...item, notes: note } : item
          ),
        })),

      // ============================================
      // SETTINGS
      // ============================================
      settings: defaultSettings,

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      resetSettings: () => set({ settings: defaultSettings }),

      // ============================================
      // UI STATE
      // ============================================
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      showKeywordHighlights: true,
      setShowKeywordHighlights: (show) => set({ showKeywordHighlights: show }),
    }),
    {
      name: "cm-policy-hub-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        history: state.history,
        settings: state.settings,
        sidebarOpen: state.sidebarOpen,
        showKeywordHighlights: state.showKeywordHighlights,
      }),
    }
  )
);

// ============================================
// HELPER: Language Detection
// ============================================

function detectLanguage(text: string): string {
  const portugueseIndicators = [
    /\b(você|voce|não|nao|está|esta|são|sao|também|tambem|porque|já|ja)\b/i,
    /\b(obrigado|obrigada|olá|ola|bom dia|boa tarde|boa noite)\b/i,
    /[áàâãéèêíïóôõöúç]/i,
  ];

  const englishIndicators = [
    /\b(the|is|are|was|were|have|has|had|will|would|could|should)\b/i,
    /\b(hello|hi|thanks|thank you|please|sorry)\b/i,
  ];

  let ptScore = 0;
  let enScore = 0;

  portugueseIndicators.forEach((regex) => {
    if (regex.test(text)) ptScore++;
  });

  englishIndicators.forEach((regex) => {
    if (regex.test(text)) enScore++;
  });

  if (ptScore > enScore) return "pt";
  if (enScore > ptScore) return "en";
  return "pt"; // Default to Portuguese
}

// ============================================
// SELECTORS
// ============================================

export const selectIsReady = (state: AppState): boolean =>
  !state.isAnalyzing && state.analysisError === null;

export const selectHasResult = (state: AppState): boolean =>
  state.currentResult !== null;

export const selectStarredHistory = (state: AppState): AnalysisHistoryItem[] =>
  state.history.filter((item) => item.starred);

export const selectRecentHistory = (
  state: AppState,
  limit: number = 10
): AnalysisHistoryItem[] => state.history.slice(0, limit);

export const selectHistoryByPolicy = (
  state: AppState,
  policy: PolicyId
): AnalysisHistoryItem[] =>
  state.history.filter((item) => item.result.primaryPolicy === policy);

export default useAppStore;