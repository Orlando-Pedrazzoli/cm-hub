"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AnalysisResult as AnalysisResultType, PolicyId } from "@/lib/types";
import { getPolicyById, POLICIES, PolicyConfig } from "@/data/policies/";
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
  Bomb,
  Cigarette,
} from "lucide-react";

interface AnalysisResultProps {
  result: AnalysisResultType;
  onNewAnalysis: () => void;
}

// Policy icons using Lucide
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
  wae: <Bomb className="w-5 h-5" />,
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

// Map short names to full names for Decision Path
const POLICY_FULL_NAMES: Record<string, string> = {
  // From POLICIES array
  "WAE": "Weapons, Ammunition, Explosives",
  "VGC": "Violent and Graphic Content",
  "VI": "Violence and Incitement",
  "TA": "Tobacco and Alcohol",
  "SSIED": "Suicide, Self-Injury, and Eating Disorders",
  "CSEAN": "Child Safety - CSAM/Exploitation",
  "HE": "Human Exploitation",
  "DOI": "Dangerous Organizations and Individuals",
  "HC": "Hateful Conduct",
  "BH": "Bullying and Harassment",
  "ASE": "Adult Sexual Exploitation",
  "ANSA": "Adult Nudity and Sexual Activity",
  "SSPX": "Sexual Solicitation",
  "CHPC": "Coordinating Harm and Publicizing Crime",
  "FSDP": "Fraud, Scams, Deceptive Practices",
  "CYBER": "Cybersecurity",
  "PV": "Privacy Violations",
  "DP": "Drugs and Pharmaceuticals",
  "HW": "Health and Wellness",
  "OGG": "Online Gambling and Gaming",
  "SPAM": "Spam",
  "RP": "Recalled Products",
  "BCP": "Branded Content - Prohibited",
  "BCR": "Branded Content - Restricted",
  "PSL": "Profanity and Sensitive Language",
};

// Function to expand policy abbreviations in decision path
function expandPolicyName(part: string): string {
  // Check if it's just an abbreviation (all uppercase, 2-5 chars)
  const upperPart = part.toUpperCase();
  if (POLICY_FULL_NAMES[upperPart]) {
    return POLICY_FULL_NAMES[upperPart];
  }
  // Check if the part contains an abbreviation
  for (const [abbr, full] of Object.entries(POLICY_FULL_NAMES)) {
    if (part === abbr || part.toUpperCase() === abbr) {
      return full;
    }
  }
  return part;
}

export function AnalysisResult({ result, onNewAnalysis }: AnalysisResultProps) {
  const [copied, setCopied] = useState(false);
  const [showAllKeywords, setShowAllKeywords] = useState(false);
  const [showExceptions, setShowExceptions] = useState(false);
  const [showChecks, setShowChecks] = useState(false);
  const [showConfidence, setShowConfidence] = useState(false);

  const handleCopy = () => {
    if (result.label) {
      navigator.clipboard.writeText(result.label);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Determine violation status based on ACTION, not just primaryPolicy
  const isEscalate = result.action === "escalate" || result.shouldEscalate;
  const isLabel = result.action === "label";
  const isNoAction = result.action === "no_action";
  const hasViolation = isEscalate || isLabel;

  const policy = result.primaryPolicy ? getPolicyById(result.primaryPolicy) : null;

  // Get the full policy name for display
  const getFullPolicyName = (): string => {
    if (result.primaryPolicyName) {
      // Try to find in POLICIES array first
      const foundPolicy = POLICIES.find(
        (p: PolicyConfig) => p.shortName === result.primaryPolicyName || 
             p.name === result.primaryPolicyName ||
             p.id === result.primaryPolicy
      );
      if (foundPolicy) return foundPolicy.name;
      
      // Try to expand abbreviation
      const expanded = expandPolicyName(result.primaryPolicyName);
      if (expanded !== result.primaryPolicyName) return expanded;
      
      return result.primaryPolicyName;
    }
    if (policy) return policy.name;
    return "Nenhuma policy violada";
  };

  // Get severity badge variant
  const getSeverityVariant = (confidence: number) => {
    if (confidence >= 80) return "danger";
    if (confidence >= 60) return "warning";
    if (confidence >= 40) return "primary";
    return "default";
  };

  // Get action badge variant and text
  const getActionInfo = () => {
    if (isEscalate) return { variant: "danger" as const, text: "ESCALATE", color: "red" };
    if (isLabel) return { variant: "warning" as const, text: "LABEL", color: "amber" };
    return { variant: "success" as const, text: "NO ACTION", color: "green" };
  };

  const actionInfo = getActionInfo();

  // Expand decision path parts
  const expandedLabelPath = result.labelPath.map(expandPolicyName);

  return (
    <div className="space-y-4">
      {/* Main Result Card */}
      <Card variant={isEscalate ? "danger" : isLabel ? "warning" : "default"}>
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Policy Icon - FIXED: Now based on action */}
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  isEscalate
                    ? "bg-gradient-to-br from-red-500 to-red-700 text-white"
                    : isLabel
                    ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white"
                    : "bg-gradient-to-br from-green-500 to-teal-600 text-white"
                }`}
              >
                {isEscalate ? (
                  <ShieldAlert className="w-7 h-7" />
                ) : isLabel ? (
                  policy ? POLICY_ICONS[policy.id as PolicyId] : <ShieldX className="w-7 h-7" />
                ) : (
                  <ShieldCheck className="w-7 h-7" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  {/* Main Status - FIXED: Based on action */}
                  <h2 className="text-lg font-semibold">
                    {isEscalate
                      ? "ESCALATE"
                      : isLabel
                      ? "Violação Detectada"
                      : "Sem Violação"}
                  </h2>

                  {/* Confidence Badge */}
                  <Badge variant={getSeverityVariant(result.confidence)} size="sm">
                    {result.confidence}% confiança
                  </Badge>

                  {/* AI Badge */}
                  {result.aiAnalysis?.used && (
                    <Badge variant="info" size="sm">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI
                    </Badge>
                  )}

                  {/* Action Badge */}
                  <Badge variant={actionInfo.variant} size="sm">
                    {actionInfo.text}
                  </Badge>
                </div>

                {/* Policy Name - FIXED: Full name */}
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {getFullPolicyName()}
                </p>

                {/* Processing Time */}
                <div className="flex items-center gap-1 mt-1 text-xs text-zinc-400">
                  <Clock className="w-3 h-3" />
                  <span>{result.processingTime.toFixed(0)}ms</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
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
          </div>

          {/* Escalation Reason */}
          {isEscalate && result.escalationReason && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">
                    Razão para Escalação
                  </p>
                  <p className="text-sm text-red-500 dark:text-red-300">
                    {result.escalationReason}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Decision Path - FIXED: Full names */}
          {expandedLabelPath.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
                Decision Path
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {expandedLabelPath.map((part, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                        i === 0 && isEscalate
                          ? "bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30"
                          : i === 0 && isLabel
                          ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                          : i === expandedLabelPath.length - 1
                          ? "bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      {part}
                    </span>
                    {i < expandedLabelPath.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-zinc-400 dark:text-zinc-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Analysis Button - MOVED UP */}
          <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
            <Button
              onClick={onNewAnalysis}
              variant="secondary"
              size="md"
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Nova Análise
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis Section - Compact */}
      {result.aiAnalysis?.used && result.aiAnalysis.reasoning && result.aiAnalysis.reasoning.length > 0 && (
        <Card>
          <CardContent className="py-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    Análise Gemini AI
                  </p>
                  {result.aiAnalysis.adjustedConfidence !== undefined && (
                    <Badge variant="info" size="sm">
                      {result.aiAnalysis.adjustedConfidence}%
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {result.aiAnalysis.reasoning[0]}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Keywords Section - Compact */}
      {result.keywords.length > 0 && (
        <Card>
          <CardContent className="py-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Keywords ({result.keywords.length})
              </p>
              {result.keywords.length > 6 && (
                <button
                  onClick={() => setShowAllKeywords(!showAllKeywords)}
                  className="text-xs text-blue-500 hover:underline"
                >
                  {showAllKeywords ? "Menos" : "Todas"}
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
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
                        : "default"
                    }
                    size="sm"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full mr-1"
                      style={{ backgroundColor: p?.color }}
                    />
                    {kw.term}
                    <span className="ml-1 opacity-50 text-xs">({kw.category})</span>
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Collapsible Sections */}
      <div className="space-y-2">
        {/* Exceptions - Collapsible */}
        {result.exceptions.detected.length > 0 && (
          <Card>
            <CardContent className="py-2">
              <button
                onClick={() => setShowExceptions(!showExceptions)}
                className="w-full flex items-center justify-between py-1"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">
                    Exceções ({result.exceptions.detected.length})
                  </span>
                </div>
                {showExceptions ? (
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                )}
              </button>
              {showExceptions && (
                <div className="mt-2 pt-2 border-t border-zinc-200 dark:border-zinc-700">
                  <div className="flex flex-wrap gap-1.5">
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

        {/* Escalation Checks - Collapsible */}
        {hasViolation && result.checks.vi && (
          <Card variant={isEscalate ? "danger" : "default"}>
            <CardContent className="py-2">
              <button
                onClick={() => setShowChecks(!showChecks)}
                className="w-full flex items-center justify-between py-1"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`w-4 h-4 ${isEscalate ? "text-red-500" : "text-zinc-500"}`} />
                  <span className="text-sm font-medium">
                    Escalation Check
                  </span>
                  <Badge variant={isEscalate ? "danger" : "default"} size="sm">
                    {isEscalate ? "ESCALATE" : "NO"}
                  </Badge>
                </div>
                {showChecks ? (
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                )}
              </button>
              {showChecks && (
                <div className="mt-2 pt-2 border-t border-zinc-200 dark:border-zinc-700">
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5 mb-2">
                    {[
                      { label: "Target", value: result.checks.vi.hasTarget },
                      { label: "Intent", value: result.checks.vi.hasIntent },
                      { label: "Method", value: result.checks.vi.hasMethod },
                      { label: "Timing", value: result.checks.vi.hasTiming },
                      { label: "Armament", value: result.checks.vi.hasArmament },
                      { label: "Location", value: result.checks.vi.hasLocation },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className={`p-1.5 rounded text-center text-xs ${
                          item.value
                            ? "bg-green-500/20 text-green-600 dark:text-green-400"
                            : "bg-zinc-100 dark:bg-zinc-800/50 text-zinc-400"
                        }`}
                      >
                        {item.value ? "✓" : "✗"} {item.label}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-zinc-500 bg-zinc-100 dark:bg-zinc-800/50 p-2 rounded">
                    <strong>Formula:</strong> Target + Intent + Method + (Timing OR Armament OR Location)
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Confidence Breakdown - Collapsible */}
        {result.confidenceBreakdown && (
          <Card>
            <CardContent className="py-2">
              <button
                onClick={() => setShowConfidence(!showConfidence)}
                className="w-full flex items-center justify-between py-1"
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-zinc-500" />
                  <span className="text-sm font-medium">Confiança</span>
                  <Badge variant="default" size="sm">{result.confidence}%</Badge>
                </div>
                {showConfidence ? (
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                )}
              </button>
              {showConfidence && (
                <div className="mt-2 pt-2 border-t border-zinc-200 dark:border-zinc-700 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Keywords</span>
                    <span className="font-medium">+{result.confidenceBreakdown.keywordMatch}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Context</span>
                    <span className={`font-medium ${result.confidenceBreakdown.contextAnalysis < 0 ? "text-red-500" : "text-green-500"}`}>
                      {result.confidenceBreakdown.contextAnalysis > 0 ? "+" : ""}{result.confidenceBreakdown.contextAnalysis}%
                    </span>
                  </div>
                  {result.aiAnalysis?.used && (
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">AI</span>
                      <span className={`font-medium ${result.confidenceBreakdown.aiAdjustment < 0 ? "text-red-500" : "text-green-500"}`}>
                        {result.confidenceBreakdown.aiAdjustment > 0 ? "+" : ""}{result.confidenceBreakdown.aiAdjustment}%
                      </span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-zinc-400 dark:text-zinc-600 text-center">
        Análise automática. Decisão final é responsabilidade do analista.
      </p>
    </div>
  );
}