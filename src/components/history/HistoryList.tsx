"use client";

import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Trash2, Clock, ChevronRight, AlertTriangle } from "lucide-react";

export function HistoryList() {
  const { history, removeFromHistory, clearHistory, setCurrentResult, setActiveTab } = useAppStore();

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateText = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  if (history.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Clock className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Sem Histórico</h3>
          <p className="text-zinc-500 text-sm">
            As tuas análises aparecerão aqui automaticamente.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Histórico de Análises</h2>
          <p className="text-sm text-zinc-500">{history.length} análises guardadas</p>
        </div>
        <Button variant="ghost" size="sm" onClick={clearHistory}>
          <Trash2 className="w-4 h-4 mr-1" />
          Limpar Tudo
        </Button>
      </div>

      {/* List */}
      <div className="space-y-2">
        {history.map((item) => (
          <Card
            key={item.id}
            variant={item.shouldEscalate ? "danger" : item.policy ? "warning" : "default"}
            className="cursor-pointer hover:bg-zinc-800/50 transition-colors"
          >
            <CardContent className="py-3">
              <div className="flex items-start gap-4">
                {/* Status indicator */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  item.shouldEscalate
                    ? "bg-red-500/20"
                    : item.policy === "vi"
                    ? "bg-red-500/10"
                    : item.policy === "bh"
                    ? "bg-purple-500/10"
                    : "bg-zinc-800"
                }`}>
                  {item.shouldEscalate ? (
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  ) : (
                    <span className="text-xs font-bold text-zinc-400">
                      {item.policy?.toUpperCase() || "—"}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant={
                        item.shouldEscalate
                          ? "danger"
                          : item.policy === "vi"
                          ? "danger"
                          : item.policy === "bh"
                          ? "purple"
                          : "default"
                      }
                      size="sm"
                    >
                      {item.shouldEscalate ? "ESCALATE" : item.policyName || "Sem Violação"}
                    </Badge>
                    <span className="text-xs text-zinc-500">{item.confidence}%</span>
                  </div>
                  <p className="text-sm text-zinc-300 truncate">{truncateText(item.text)}</p>
                  <p className="text-xs text-zinc-600 mt-1">{formatDate(item.timestamp)}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentResult(item);
                      setActiveTab("analyzer");
                    }}
                    className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromHistory(item.id);
                    }}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-zinc-500 hover:text-red-400" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}