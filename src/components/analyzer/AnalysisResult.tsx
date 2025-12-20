"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AnalysisResult as AnalysisResultType } from "@/lib/types";
import { CredibilityCheck } from "./CredibilityCheck";
import { Target, Copy, Check, ChevronRight } from "lucide-react";

interface AnalysisResultProps {
  result: AnalysisResultType;
}

export function AnalysisResult({ result }: AnalysisResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (result.label) {
      navigator.clipboard.writeText(result.label);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const hasViolation = result.policy !== null;

  return (
    <div className="space-y-4">
      {/* Main Result Card */}
      <Card variant={result.shouldEscalate ? "danger" : hasViolation ? "warning" : "default"}>
        <CardContent>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                result.shouldEscalate
                  ? "bg-gradient-to-br from-red-500 to-orange-600"
                  : hasViolation
                  ? "bg-gradient-to-br from-amber-500 to-orange-600"
                  : "bg-gradient-to-br from-green-500 to-teal-600"
              }`}>
                <Target className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-lg font-semibold">
                    {result.shouldEscalate
                      ? "⚠️ ESCALATE"
                      : hasViolation
                      ? "Violação Detectada"
                      : "Sem Violação"}
                  </h2>
                  <Badge
                    variant={
                      result.confidence >= 80
                        ? "success"
                        : result.confidence >= 50
                        ? "warning"
                        : "default"
                    }
                    size="sm"
                  >
                    {result.confidence}% confiança
                  </Badge>
                </div>
                <p className="text-sm text-zinc-500">{result.policyName || "N/A"}</p>
              </div>
            </div>

            {result.label && (
              <Button variant="secondary" size="sm" onClick={handleCopy}>
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copiar
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Decision Path */}
          {result.labelPath.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
                Decision Path
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {result.labelPath.map((part, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                        i === result.labelPath.length - 1
                          ? result.shouldEscalate
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : "bg-zinc-800"
                      }`}
                    >
                      {part}
                    </span>
                    {i < result.labelPath.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-zinc-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Keywords Found */}
      {result.keywords.length > 0 && (
        <Card>
          <CardContent>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
              Keywords Detectadas
            </p>
            <div className="flex flex-wrap gap-2">
              {result.keywords.map((kw, i) => (
                <Badge
                  key={i}
                  variant={kw.policy === "vi" ? "danger" : "purple"}
                >
                  {kw.term}
                  <span className="ml-1 opacity-60">({kw.category})</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Credibility Check for V&I */}
      {result.policy === "vi" && <CredibilityCheck result={result} />}

      {/* Disclaimer */}
      <p className="text-xs text-zinc-600 text-center py-2">
        ⚠️ Esta análise é uma sugestão automática. A decisão final é responsabilidade do analista.
      </p>
    </div>
  );
}