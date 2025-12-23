"use client";

import { useRef, useState, useCallback } from "react";
import { useAppStore } from "@/lib/store";
import { POLICIES, POLICY_STATS } from "@/data/policies";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { AnalyzerInput, AnalyzerInputRef } from "@/components/analyzer/AnalyzerInput";
import { AnalysisResult } from "@/components/analyzer/AnalysisResult";
import { HistoryList } from "@/components/history/HistoryList";
import { PolicyList } from "@/components/policies/PolicyList";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { Brain, Shield, Sparkles, Zap, CheckCircle, AlertTriangle } from "lucide-react";

export default function Home() {
  const {
    activeTab,
    settings,
    currentResult,
    isAnalyzing,
    analysisError,
    analyze,
    clearResult,
  } = useAppStore();

  const inputRef = useRef<AnalyzerInputRef>(null);
  const [shouldClearInput, setShouldClearInput] = useState(false);

  const handleAnalyze = async (text: string) => {
    try {
      await analyze(text);
    } catch (error) {
      console.error("Analysis error:", error);
    }
  };

  const handleNewAnalysis = useCallback(() => {
    // Clear the result
    clearResult();
    // Trigger input clear
    setShouldClearInput(true);
  }, [clearResult]);

  const handleInputCleared = useCallback(() => {
    setShouldClearInput(false);
  }, []);

  const readyPolicies = POLICIES.filter((p) => p.ready);

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
            {/* Header section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-4">
                {settings.useAI ? (
                  <>
                    <Sparkles className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      AI-Powered Analysis
                    </span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                    <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      Algorithm Analysis
                    </span>
                  </>
                )}
              </div>
              <h2 className="text-2xl font-bold mb-2">Policy Analyzer</h2>
              <p className="text-zinc-500 max-w-md mx-auto">
                Cola o texto do JOB e recebe uma analise instantanea baseada em{" "}
                <strong>{POLICY_STATS.ready} policies</strong> prontas
              </p>
            </div>

            {/* Input section */}
            <div className="mb-6">
              <AnalyzerInput
                ref={inputRef}
                onAnalyze={handleAnalyze}
                isAnalyzing={isAnalyzing}
                shouldClear={shouldClearInput}
                onCleared={handleInputCleared}
              />
            </div>

            {/* Error display */}
            {analysisError && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    {analysisError}
                  </p>
                </div>
              </div>
            )}

            {/* Results */}
            {currentResult && (
              <AnalysisResult
                result={currentResult}
                onNewAnalysis={handleNewAnalysis}
              />
            )}

            {/* Empty state */}
            {!currentResult && !isAnalyzing && (
              <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Pronto para Analisar</h3>
                <p className="text-zinc-500 max-w-md mx-auto mb-6">
                  Cola o texto do JOB acima e clica em &quot;Analisar&quot; para receber
                  uma analise detalhada com sugestao de label.
                </p>

                {/* Ready policies grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-lg mx-auto mb-6">
                  {readyPolicies.map((policy) => (
                    <div
                      key={policy.id}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg"
                      style={{ backgroundColor: `${policy.color}10` }}
                    >
                      <Shield
                        className="w-4 h-4"
                        style={{ color: policy.color }}
                      />
                      <div className="text-left">
                        <p
                          className="text-xs font-semibold"
                          style={{ color: policy.color }}
                        >
                          {policy.shortName}
                        </p>
                        <p className="text-xs text-zinc-500 truncate w-20">
                          {policy.name.split(" ").slice(0, 2).join(" ")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-600 dark:text-green-400 rounded-full text-xs">
                    <CheckCircle className="w-3 h-3" />
                    {POLICY_STATS.ready} Policies Prontas
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full text-xs">
                    <CheckCircle className="w-3 h-3" />
                    ~300+ Keywords PT/EN
                  </span>
                  {settings.useAI && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-full text-xs">
                      <CheckCircle className="w-3 h-3" />
                      Gemini AI Enabled
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-full text-xs">
                    <CheckCircle className="w-3 h-3" />
                    Deteccao de Excecoes
                  </span>
                </div>
              </div>
            )}

            {/* Loading state */}
            {isAnalyzing && (
              <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                </div>
                <h3 className="text-lg font-semibold mb-2">A Analisar...</h3>
                <p className="text-zinc-500 max-w-md mx-auto">
                  {settings.useAI
                    ? "A processar com analise local + Gemini AI..."
                    : "A processar analise local..."}
                </p>
                <div className="flex justify-center gap-2 mt-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
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

      <main className="ml-0 lg:ml-64 pt-[120px] md:pt-[73px]">
        <div className="p-4 md:p-6">
          <div className="max-w-4xl mx-auto">{renderContent()}</div>
        </div>
      </main>
    </div>
  );
}