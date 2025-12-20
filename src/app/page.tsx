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
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResultType | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = (text: string) => {
    setIsAnalyzing(true);
    
    // Simular pequeno delay para UX
    setTimeout(() => {
      const analysisResult = analyzeContent(text);
      setResult(analysisResult);
      setIsAnalyzing(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Header />
      <Sidebar selectedPolicy={selectedPolicy} onSelectPolicy={setSelectedPolicy} />

      <main className="ml-64 pt-[73px]">
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            {/* Hero */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                <Brain className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-400">Algorithm Analysis</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Policy Analyzer</h2>
              <p className="text-zinc-500">
                Cola o texto do JOB e recebe uma análise instantânea da possível violação
              </p>
            </div>

            {/* Analyzer Input */}
            <div className="mb-6">
              <AnalyzerInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
            </div>

            {/* Results */}
            {result && <AnalysisResult result={result} />}

            {/* Empty State */}
            {!result && !isAnalyzing && (
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-zinc-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Pronto para Analisar</h3>
                <p className="text-zinc-500 max-w-md mx-auto mb-4">
                  Cola o texto do JOB acima e clica em "Analisar" para receber uma análise detalhada.
                </p>
                <div className="inline-flex gap-2">
                  <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">
                    V&I: 70+ termos
                  </span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
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