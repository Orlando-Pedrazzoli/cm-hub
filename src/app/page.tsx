"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { AnalyzerInput } from "@/components/analyzer/AnalyzerInput";
import { AnalysisResult } from "@/components/analyzer/AnalysisResult";
import { analyzeContent } from "@/lib/analyzer";
import { AnalysisResult as AnalysisResultType } from "@/lib/types";
import { Brain } from "lucide-react";

export default function Home() {
  const [result, setResult] = useState<AnalysisResultType | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = (text: string) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const analysisResult = analyzeContent(text);
      setResult({
        ...analysisResult,
        id: crypto.randomUUID(),
        text,
        timestamp: Date.now(),
      });
      setIsAnalyzing(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Header />
      <Sidebar />

      <main className="ml-64 pt-[73px]">
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                <Brain className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Algorithm Analysis</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Policy Analyzer</h2>
              <p className="text-zinc-500">
                Cola o texto do JOB e recebe uma análise instantânea da possível violação
              </p>
            </div>

            <div className="mb-6">
              <AnalyzerInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
            </div>

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
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}