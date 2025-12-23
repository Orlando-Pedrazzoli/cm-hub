"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AnalysisResult as AnalysisResultType, PolicyId } from "@/lib/types";
import { getPolicyById } from "@/data/policies";
import {
  Copy,
  Check,
  ChevronRight,
  ChevronDown,
  Sparkles,
  AlertTriangle,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Clock,
  RefreshCw,
  FileText,
  Users,
  Skull,
  Heart,
  Ban,
  Eye,
  Lock,
  Link,
  Pill,
  Wine,
  Target,
  Gamepad2,
  Activity,
  Mail,
  Package,
  Tag,
  MessageCircle,
  Scale,
  Flame,
  Siren,
} from "lucide-react";

interface AnalysisResultProps {
  result: AnalysisResultType;
  onNewAnalysis: () => void;
}

// Policy icons using Lucide (no emojis)
const POLICY_ICONS: Record<PolicyId, React.ReactNode> = {
  csean: <ShieldAlert className="w-5 h-5" />,
  vi: <Flame className="w-5 h-5" />,
  bh: <Target className="w-5 h-5" />,
  ase: <Ban className="w-5 h-5" />,
  sspx: <MessageCircle className="w-5 h-5" />,
  ansa: <Eye className="w-5 h-5" />,
  vgc: <Skull className="w-5 h-5" />,
  doi: <Siren className="w-5 h-5" />,
  hc: <Users className="w-5 h-5" />,
  ssied: <Heart className="w-5 h-5" />,
  he: <Link className="w-5 h-5" />,
  pv: <Eye className="w-5 h-5" />,
  fsdp: <Scale className="w-5 h-5" />,
  cyber: <Lock className="w-5 h-5" />,
  chpc: <Link className="w-5 h-5" />,
  dp: <Pill className="w-5 h-5" />,
  ta: <Wine className="w-5 h-5" />,
  wae: <Target className="w-5 h-5" />,
  ogg: <Gamepad2 className="w-5 h-5" />,
  hw: <Activity className="w-5 h-5" />,
  spam: <Mail className="w-5 h-5" />,
  rp: <Package className="w-5 h-5" />,
  bcp: <Tag className="w-5 h-5" />,
  bcr: <Tag className="w-5 h-5" />,
  psl: <MessageCircle className="w-5 h-5" />,
  orgs: <FileText className="w-5 h-5" />,
  cis: <Siren className="w-5 h-5" />,
};

export function AnalysisResult({ result, onNewAnalysis }: AnalysisResultProps) {
  const [copied, setCopied] = useState(false);
  const [showAllKeywords, setShowAllKeywords] = useState(false);
  const [showExceptions, setShowExceptions] = useState(false);
  const [showChecks, setShowChecks] = useState(false);

  const handleCopy = () => {
    if (result.label) {
      navigator.clipboard.writeText(result.label);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const hasViolation = result.primaryPolicy !== null;
  const policy = result.primaryPolicy ? getPolicyById(result.primaryPolicy) : null;

  // Get severity badge variant
  const getSeverityVariant = (confidence: number) => {
    if (confidence >= 80) return "danger";
    if (confidence >= 60) return "warning";
    if (confidence >= 40) return "primary";
    return "default";
  };

  // Get action badge variant
  const getActionVariant = () => {
    if (result.shouldEscalate) return "danger";
    if (result.action === "label") return "warning";
    return "success";
  };

  return (
    <div className="space-y-4">
      {/* Main Result Card */}
      <Card variant={result.shouldEscalate ? "danger" : hasViolation ? "warning" : "default"}>
        <CardContent>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              {/* Policy Icon */}
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  result.shouldEscalate
                    ? "bg-gradient-to-br from-red-500 to-orange-600 text-white"
                    : hasViolation
                    ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white"
                    : "bg-gradient-to-br from-green-500 to-teal-600 text-white"
                }`}
              >
                {result.shouldEscalate ? (
                  <ShieldAlert className="w-7 h-7" />
                ) : hasViolation ? (
                  policy ? POLICY_ICONS[policy.id] : <ShieldX className="w-7 h-7" />
                ) : (
                  <ShieldCheck className="w-7 h-7" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  {/* Main Status */}
                  <h2 className="text-lg font-semibold">
                    {result.shouldEscalate
                      ? "ESCALATE"
                      : hasViolation
                      ? "Violacao Detectada"
                      : "Sem Violacao"}
                  </h2>

                  {/* Confidence Badge */}
                  <Badge variant={getSeverityVariant(result.confidence)} size="sm">
                    {result.confidence}% confianca
                  </Badge>

                  {/* AI Badge */}
                  {result.aiAnalysis?.used && (
                    <Badge variant="info" size="sm">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI
                    </Badge>
                  )}

                  {/* Action Badge */}
                  <Badge variant={getActionVariant()} size="sm">
                    {result.action.toUpperCase()}
                  </Badge>
                </div>

                {/* Policy Name */}
                <p className="text-sm text-zinc-500">
                  {result.primaryPolicyName || "Nenhuma policy violada"}
                </p>

                {/* Processing Time */}
                <div className="flex items-center gap-1 mt-1 text-xs text-zinc-400">
                  <Clock className="w-3 h-3" />
                  <span>{result.processingTime.toFixed(0)}ms</span>
                </div>
              </div>
            </div>

            {/* Copy Button */}
            {result.label && (
              <Button variant="secondary" size="sm" onClick={handleCopy}>
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Copiado
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

          {/* Escalation Reason */}
          {result.shouldEscalate && result.escalationReason && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">
                    Razao para Escalacao
                  </p>
                  <p className="text-sm text-red-500 dark:text-red-300">
                    {result.escalationReason}
                  </p>
                </div>
              </div>
            </div>
          )}

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
                        i === 0 && result.shouldEscalate
                          ? "bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30"
                          : i === result.labelPath.length - 1
                          ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      {part}
                    </span>
                    {i < result.labelPath.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-zinc-400 dark:text-zinc-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Multiple Policies Detected */}
          {result.detectedPolicies.length > 1 && (
            <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                Outras Policies Detectadas
              </p>
              <div className="flex flex-wrap gap-2">
                {result.detectedPolicies.slice(1).map((dp) => {
                  const p = getPolicyById(dp.policy);
                  return (
                    <span
                      key={dp.policy}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium"
                      style={{
                        backgroundColor: p ? `${p.color}15` : undefined,
                        color: p?.color,
                      }}
                    >
                      {POLICY_ICONS[dp.policy]}
                      {dp.policyName} ({dp.confidence}%)
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Analysis Section */}
      {result.aiAnalysis?.used && (
        <Card>
          <CardContent>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  Analise Gemini AI
                </p>
                {result.aiAnalysis.adjustedConfidence !== undefined && (
                  <p className="text-xs text-zinc-500">
                    Confianca AI: {result.aiAnalysis.adjustedConfidence}%
                  </p>
                )}
              </div>
            </div>

            {result.aiAnalysis.reasoning && result.aiAnalysis.reasoning.length > 0 && (
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-3">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {result.aiAnalysis.reasoning[0]}
                </p>
              </div>
            )}

            {result.aiAnalysis.ambiguityNotes && result.aiAnalysis.ambiguityNotes.length > 0 && (
              <div className="mt-3 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-1">
                  Notas de Ambiguidade
                </p>
                <p className="text-xs text-amber-500">
                  {result.aiAnalysis.ambiguityNotes.join("; ")}
                </p>
              </div>
            )}

            {result.aiAnalysis.suggestedLabel && (
              <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
                <p className="text-xs text-zinc-500 mb-1">Label sugerida pela AI:</p>
                <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                  {result.aiAnalysis.suggestedLabel}
                </code>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Keywords Section */}
      {result.keywords.length > 0 && (
        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Keywords Detectadas ({result.keywords.length})
              </p>
              {result.keywords.length > 6 && (
                <button
                  onClick={() => setShowAllKeywords(!showAllKeywords)}
                  className="text-xs text-blue-500 hover:underline"
                >
                  {showAllKeywords ? "Ver menos" : "Ver todas"}
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {(showAllKeywords ? result.keywords : result.keywords.slice(0, 6)).map((kw, i) => {
                const p = getPolicyById(kw.policy);
                return (
                  <Badge
                    key={i}
                    variant={
                      kw.severity === "critical"
                        ? "danger"
                        : kw.severity === "high"
                        ? "warning"
                        : kw.policy === "csean"
                        ? "danger"
                        : kw.policy === "vi"
                        ? "danger"
                        : kw.policy === "bh"
                        ? "purple"
                        : "default"
                    }
                  >
                    <span
                      className="w-2 h-2 rounded-full mr-1.5"
                      style={{ backgroundColor: p?.color }}
                    />
                    {kw.term}
                    <span className="ml-1 opacity-60">({kw.category})</span>
                    {kw.requiresContext && (
                      <span className="ml-1 opacity-40" title="Requer contexto">
                        ?
                      </span>
                    )}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exceptions Section */}
      {result.exceptions.detected.length > 0 && (
        <Card>
          <CardContent>
            <button
              onClick={() => setShowExceptions(!showExceptions)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-green-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                    Excecoes Detectadas ({result.exceptions.detected.length})
                  </p>
                  <p className="text-xs text-zinc-500">
                    Contextos que podem reduzir severidade
                  </p>
                </div>
              </div>
              {showExceptions ? (
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              )}
            </button>

            {showExceptions && (
              <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
                <div className="flex flex-wrap gap-2">
                  {result.exceptions.detected.map((exc, i) => (
                    <Badge key={i} variant="success" size="sm">
                      {exc}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Policy-Specific Checks */}
      {hasViolation && (
        <Card variant={result.shouldEscalate ? "danger" : "default"}>
          <CardContent>
            <button
              onClick={() => setShowChecks(!showChecks)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    result.shouldEscalate ? "bg-red-500/20" : "bg-zinc-100 dark:bg-zinc-800"
                  }`}
                >
                  <AlertTriangle
                    className={`w-4 h-4 ${
                      result.shouldEscalate ? "text-red-500" : "text-zinc-500"
                    }`}
                  />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold">Escalation Check</p>
                  <p className="text-xs text-zinc-500">
                    {result.shouldEscalate ? "ESCALATE REQUIRED" : "NO ESCALATION"}
                  </p>
                </div>
              </div>
              {showChecks ? (
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              )}
            </button>

            {showChecks && (
              <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                {/* V&I Checks */}
                {result.checks.vi && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-zinc-500 mb-2">
                      Violence and Incitement Checks
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {[
                        { label: "Target", value: result.checks.vi.hasTarget },
                        { label: "Intent", value: result.checks.vi.hasIntent },
                        { label: "Timing", value: result.checks.vi.hasTiming },
                        { label: "Armament", value: result.checks.vi.hasArmament },
                        { label: "Location", value: result.checks.vi.hasLocation },
                        { label: "Method", value: result.checks.vi.hasMethod },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className={`p-2 rounded-lg text-center text-xs ${
                            item.value
                              ? "bg-green-500/20 text-green-600 dark:text-green-400"
                              : "bg-zinc-100 dark:bg-zinc-800/50 text-zinc-400"
                          }`}
                        >
                          {item.value ? "YES" : "NO"} - {item.label}
                        </div>
                      ))}
                    </div>
                    {result.checks.vi.isCredibleThreat && (
                      <div className="mt-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400">
                        CREDIBLE THREAT DETECTED
                      </div>
                    )}
                  </div>
                )}

                {/* CSEAN Checks */}
                {result.checks.csean && result.primaryPolicy === "csean" && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-zinc-500 mb-2">
                      Child Safety Checks (CSEAN)
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {[
                        { label: "Minor Present", value: result.checks.csean.hasMinorPresent },
                        { label: "CSAM Indicators", value: result.checks.csean.hasCSAMIndicators },
                        { label: "Solicitation", value: result.checks.csean.hasSolicitationSignals },
                        { label: "IIC Elements", value: result.checks.csean.hasIICElements },
                        { label: "Sexualization", value: result.checks.csean.hasSexualizationSignals },
                        { label: "Exploitative", value: result.checks.csean.isExploitativeContent },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className={`p-2 rounded-lg text-center text-xs ${
                            item.value
                              ? "bg-red-500/20 text-red-600 dark:text-red-400"
                              : "bg-zinc-100 dark:bg-zinc-800/50 text-zinc-400"
                          }`}
                        >
                          {item.value ? "ALERT" : "OK"} - {item.label}
                        </div>
                      ))}
                    </div>
                    {result.checks.csean.ageCategory !== "unknown" && (
                      <div className="mt-2 text-xs text-zinc-500">
                        Age Category: <strong>{result.checks.csean.ageCategory}</strong>
                      </div>
                    )}
                  </div>
                )}

                {/* B&H Checks */}
                {result.checks.bh && result.primaryPolicy === "bh" && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-zinc-500 mb-2">
                      Bullying and Harassment Checks
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {[
                        { label: "Target ID", value: result.checks.bh.hasIdentifiableTarget },
                        { label: "Purposeful Exp.", value: result.checks.bh.hasPurposefulExposure },
                        { label: "Endearing", value: result.checks.bh.isEndearingContext, invert: true },
                        { label: "Business Review", value: result.checks.bh.isBusinessReview, invert: true },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className={`p-2 rounded-lg text-center text-xs ${
                            item.invert
                              ? item.value
                                ? "bg-green-500/20 text-green-600 dark:text-green-400"
                                : "bg-zinc-100 dark:bg-zinc-800/50 text-zinc-400"
                              : item.value
                              ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                              : "bg-zinc-100 dark:bg-zinc-800/50 text-zinc-400"
                          }`}
                        >
                          {item.value ? "YES" : "NO"} - {item.label}
                        </div>
                      ))}
                    </div>
                    {result.checks.bh.targetType !== "unknown" && (
                      <div className="mt-2 text-xs text-zinc-500">
                        Target Type: <strong>{result.checks.bh.targetType.replace("_", " ")}</strong>
                      </div>
                    )}
                  </div>
                )}

                {/* Formula reminder */}
                <div className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800/50 text-xs text-zinc-500">
                  <strong className="text-zinc-700 dark:text-zinc-400">Formula V&I:</strong> Target
                  + Intent + High-Severity + (Timing OR Armament OR Location)
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Confidence Breakdown */}
      {result.confidenceBreakdown && (
        <Card>
          <CardContent>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
              Breakdown de Confianca
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Keywords Match</span>
                <span className="text-sm font-medium">
                  +{result.confidenceBreakdown.keywordMatch}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Context Analysis</span>
                <span
                  className={`text-sm font-medium ${
                    result.confidenceBreakdown.contextAnalysis < 0
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {result.confidenceBreakdown.contextAnalysis > 0 ? "+" : ""}
                  {result.confidenceBreakdown.contextAnalysis}%
                </span>
              </div>
              {result.aiAnalysis?.used && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">AI Adjustment</span>
                  <span
                    className={`text-sm font-medium ${
                      result.confidenceBreakdown.aiAdjustment < 0
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {result.confidenceBreakdown.aiAdjustment > 0 ? "+" : ""}
                    {result.confidenceBreakdown.aiAdjustment}%
                  </span>
                </div>
              )}
              <div className="pt-2 mt-2 border-t border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                <span className="text-sm font-semibold">Total</span>
                <span className="text-sm font-bold">{result.confidence}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* New Analysis Button */}
      <div className="pt-4">
        <Button
          onClick={onNewAnalysis}
          variant="primary"
          size="lg"
          className="w-full"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Nova Analise
        </Button>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-zinc-500 dark:text-zinc-600 text-center py-2">
        Esta analise e uma sugestao automatica. A decisao final e responsabilidade do analista.
      </p>
    </div>
  );
}