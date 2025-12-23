"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MessageSquare, Zap, X } from "lucide-react";

interface AnalyzerInputProps {
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
  shouldClear?: boolean;
  onCleared?: () => void;
}

export interface AnalyzerInputRef {
  clear: () => void;
  getText: () => string;
}

export const AnalyzerInput = forwardRef<AnalyzerInputRef, AnalyzerInputProps>(
  function AnalyzerInput({ onAnalyze, isAnalyzing, shouldClear, onCleared }, ref) {
    const [text, setText] = useState("");

    // Expose clear method to parent
    useImperativeHandle(ref, () => ({
      clear: () => {
        setText("");
      },
      getText: () => text,
    }));

    // Clear when shouldClear prop changes to true
    useEffect(() => {
      if (shouldClear) {
        setText("");
        onCleared?.();
      }
    }, [shouldClear, onCleared]);

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
              <MessageSquare className="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
              <span className="font-medium">Conteudo do JOB</span>
            </div>
            <span className="text-xs text-zinc-500">{text.length} caracteres</span>
          </div>
        </CardHeader>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Cola aqui o texto do JOB para analise...\n\nExemplo: "Vou te matar amanha, Maria. Voce vai ver so."\n\nCtrl+Enter para analisar`}
          className="w-full h-40 px-5 py-4 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 resize-none focus:outline-none"
          disabled={isAnalyzing}
        />

        <div className="px-5 py-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <p className="text-xs text-zinc-500 dark:text-zinc-600">
            27 Policies disponiveis | Market: PT/BR/EN
          </p>
          <div className="flex items-center gap-3">
            {text && !isAnalyzing && (
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
              {isAnalyzing ? "A analisar..." : "Analisar"}
            </Button>
          </div>
        </div>
      </Card>
    );
  }
);