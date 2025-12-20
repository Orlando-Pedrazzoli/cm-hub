import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AnalysisResult, AppSettings, TabType } from "./types";

interface AppState {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedPolicy: string | null;
  setSelectedPolicy: (id: string | null) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  currentResult: AnalysisResult | null;
  setCurrentResult: (result: AnalysisResult | null) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
  history: AnalysisResult[];
  addToHistory: (result: AnalysisResult) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activeTab: "analyzer",
      setActiveTab: (tab) => set({ activeTab: tab }),
      selectedPolicy: null,
      setSelectedPolicy: (id) => set({ selectedPolicy: id }),
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      currentResult: null,
      setCurrentResult: (result) => set({ currentResult: result }),
      isAnalyzing: false,
      setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
      history: [],
      addToHistory: (result) => set((state) => ({
        history: [result, ...state.history].slice(0, 50)
      })),
      removeFromHistory: (id) => set((state) => ({
        history: state.history.filter((h) => h.id !== id)
      })),
      clearHistory: () => set({ history: [] }),
      settings: {
        geminiApiKey: "",
        useAI: false,
        theme: "light",
        autoSaveHistory: true,
      },
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
    }),
    {
      name: "cm-hub-storage",
      partialize: (state) => ({
        history: state.history,
        settings: state.settings,
      }),
    }
  )
);