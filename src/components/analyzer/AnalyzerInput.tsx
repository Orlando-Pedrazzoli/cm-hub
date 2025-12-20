"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MessageSquare, Zap, X } from "lucide-react";

interface AnalyzerInputProps {
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
}

export function AnalyzerInput({ onAnalyze, isAnalyzing }: AnalyzerInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim()) {
      onAnalyze(text);
    }
  };

  const handleClear = () => {
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSubmit();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-zinc-500" />
            <span className="font-medium">Conteúdo do JOB</span>
          </div>
          <span className="text-xs text-zinc-500">{text.length} caracteres</span>
        </div>
      </CardHeader>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder='Cola aqui o texto do JOB para análise...

Exemplo: "Vou te matar amanhã, Maria. Você vai ver só."

Ctrl+Enter para analisar'
        className="w-full h-40 px-5 py-4 bg-transparent text-zinc-100 placeholder:text-zinc-600 resize-none focus:outline-none"
      />

      <div className="px-5 py-4 border-t border-zinc-800 flex items-center justify-between">
        <p className="text-xs text-zinc-600">
          Policies: V&I + B&H • Market: PT/BR
        </p>

        <div className="flex items-center gap-3">
          {text && (
            <Button variant="ghost" size="sm" onClick={handleClear}>
              <X className="w-4 h-4 mr-1" />
              Limpar
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            disabled={!text.trim() || isAnalyzing}
            size="md"
          >
            <Zap className="w-4 h-4 mr-2" />
            {isAnalyzing ? "Analisando..." : "Analisar"}
          </Button>
        </div>
      </div>
    </Card>
  );
}