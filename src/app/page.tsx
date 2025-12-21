"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { AnalyzerInput } from "@/components/analyzer/AnalyzerInput";
import { AnalysisResult } from "@/components/analyzer/AnalysisResult";
import { HistoryList } from "@/components/history/HistoryList";
import { PolicyList } from "@/components/policies/PolicyList";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { analyzeContent, mergeWithAIAnalysis } from "@/lib/analyzer";
import { analyzeWithGemini } from "@/lib/gemini";
import { AnalysisResult as AnalysisResultType } from "@/lib/types";
import { Brain } from "lucide-react";

export default function Home() {
  const { activeTab, settings, addToHistory } = useAppStore();
  const [result, setResult] = useState<AnalysisResultType | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (text: string) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      let analysis = analyzeContent(text);

      if (settings.useAI) {
        try {
          const aiAnalysis = await analyzeWithGemini(text);
          analysis = mergeWithAIAnalysis(analysis, aiAnalysis);
        } catch (aiError) {
          console.error("Erro na análise AI:", aiError);
        }
      }

      const fullResult: AnalysisResultType = {
        ...analysis,
        id: crypto.randomUUID(),
        text,
        timestamp: Date.now(),
      };

      setResult(fullResult);

      if (settings.autoSaveHistory) {
        addToHistory(fullResult);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro na análise");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "history":
        return <HistoryList />;
      case "policies":
        return <PolicyList />;
      case "settings":
        return <SettingsPanel />;
      case "analyzer":
      default:
        return (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                <Brain className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {settings.useAI ? "AI-Powered Analysis" : "Algorithm Analysis"}
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Policy Analyzer</h2>
              <p className="text-zinc-500">
                Cola o texto do JOB e recebe uma análise instantânea da possível violação
              </p>
            </div>

            <div className="mb-6">
              <AnalyzerInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {result && <AnalysisResult result={result} />}

            {!result && !isAnalyzing && (
              <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-zinc-400 dark:text-zinc-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Pronto para Analisar</h3>
                <p className="text-zinc-500 max-w-md mx-auto mb-4">
                  Cola o texto do JOB acima e clica em &quot;Analisar&quot; para receber uma análise detalhada.
                </p>
                <div className="inline-flex gap-2">
                  <span className="px-3 py-1 bg-red-500/20 text-red-600 dark:text-red-400 rounded-full text-xs">
                    V&I: 70+ termos
                  </span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-full text-xs">
                    B&H: 80+ termos
                  </span>
                  {settings.useAI && (
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full text-xs">
                      Gemini AI
                    </span>
                  )}
                </div>
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Header />
      <Sidebar />

      <main className="ml-64 pt-[73px]">
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}