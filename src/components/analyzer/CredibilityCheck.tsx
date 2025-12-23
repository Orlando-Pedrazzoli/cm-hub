"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { AnalysisResult } from "@/lib/types";
import { AlertTriangle, Check, X } from "lucide-react";

interface CredibilityCheckProps {
  result: AnalysisResult;
}

export function CredibilityCheck({ result }: CredibilityCheckProps) {
  const { checks, shouldEscalate } = result;

  // Aceder aos checks de VI (Violence and Incitement)
  const viChecks = checks.vi;

  const items = [
    { label: "Target", value: viChecks?.hasTarget ?? false },
    { label: "Statement of Intent", value: viChecks?.hasIntent ?? false },
    { label: "Timing", value: viChecks?.hasTiming ?? false },
    { label: "Armament", value: viChecks?.hasArmament ?? false },
    { label: "Location", value: viChecks?.hasLocation ?? false },
  ];

  return (
    <Card variant={shouldEscalate ? "danger" : "default"}>
      <CardContent>
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              shouldEscalate ? "bg-red-500/20" : "bg-zinc-100 dark:bg-zinc-800"
            }`}
          >
            <AlertTriangle
              className={`w-6 h-6 ${
                shouldEscalate
                  ? "text-red-500 dark:text-red-400"
                  : "text-zinc-400 dark:text-zinc-500"
              }`}
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="font-semibold">Escalation Check</h3>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  shouldEscalate
                    ? "bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                }`}
              >
                {shouldEscalate ? "ESCALATE" : "NO ESCALATION"}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
              {items.map((item) => (
                <div
                  key={item.label}
                  className={`p-3 rounded-lg text-center text-sm ${
                    item.value
                      ? "bg-green-500/20 text-green-600 dark:text-green-400"
                      : "bg-zinc-100 dark:bg-zinc-800/50 text-zinc-400 dark:text-zinc-500"
                  }`}
                >
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {item.value ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <X className="w-3 h-3" />
                    )}
                  </div>
                  <span className="text-xs">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800/50 text-xs text-zinc-500">
              <strong className="text-zinc-700 dark:text-zinc-400">Formula:</strong> Target +
              Intent + High-Severity + (Timing OR Armament OR Location)
            </div>

            {shouldEscalate && (
              <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">
                    Accao: Escalate - Threatening - Other
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}