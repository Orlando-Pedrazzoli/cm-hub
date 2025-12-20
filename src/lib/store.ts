import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AnalysisResult, AppSettings, TabType } from "./types";

interface AppState {
  // Navigation
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  
  // Sidebar
  selectedPolicy: string | null;
  setSelectedPolicy: (id: string | null) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  
  // Analysis
  currentResult: AnalysisResult | null;
  setCurrentResult: (result: AnalysisResult | null) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
  
  // History
  history: AnalysisResult[];
  addToHistory: (result: AnalysisResult) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
  
  // Settings
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Navigation
      activeTab: "analyzer",
      setActiveTab: (tab) => set({ activeTab: tab }),
      
      // Sidebar
      selectedPolicy: null,
      setSelectedPolicy: (id) => set({ selectedPolicy: id }),
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      // Analysis
      currentResult: null,
      setCurrentResult: (result) => set({ currentResult: result }),
      isAnalyzing: false,
      setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
      
      // History
      history: [],
      addToHistory: (result) => set((state) => ({
        history: [result, ...state.history].slice(0, 50) // Keep last 50
      })),
      removeFromHistory: (id) => set((state) => ({
        history: state.history.filter((h) => h.id !== id)
      })),
      clearHistory: () => set({ history: [] }),
      
      // Settings
      settings: {
        geminiApiKey: "",
        useAI: false,
        theme: "dark",
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