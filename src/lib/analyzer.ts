import { AnalysisResult, KeywordMatch } from "./types";
import {
  VI_HIGH_SEVERITY,
  VI_MID_SEVERITY,
  VI_LOW_SEVERITY,
  VI_ARMAMENTS,
  VI_HIGH_RISK_LOCATIONS,
} from "@/data/vi-terms";
import {
  BH_SEXUALIZED,
  BH_CALLS_DEATH,
  BH_CALLS_SSI,
  BH_TARGETED_CURSING,
  BH_NEGATIVE_CHARACTER,
  BH_NEGATIVE_PHYSICAL,
  BH_DEHUMANIZING,
} from "@/data/bh-terms";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function hasWord(text: string, word: string): boolean {
  const norm = normalize(text);
  const w = normalize(word);
  return new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(norm);
}

function findKeywords(text: string): KeywordMatch[] {
  const found: KeywordMatch[] = [];

  // V&I
  VI_HIGH_SEVERITY.forEach((t) => {
    if (hasWord(text, t))
      found.push({ term: t, policy: "vi", category: "High-Severity", severity: "high" });
  });
  VI_MID_SEVERITY.forEach((t) => {
    if (hasWord(text, t))
      found.push({ term: t, policy: "vi", category: "Mid-Severity", severity: "mid" });
  });
  VI_LOW_SEVERITY.forEach((t) => {
    if (hasWord(text, t))
      found.push({ term: t, policy: "vi", category: "Low-Severity", severity: "low" });
  });
  VI_ARMAMENTS.forEach((t) => {
    if (hasWord(text, t))
      found.push({ term: t, policy: "vi", category: "Armament" });
  });

  // B&H
  BH_SEXUALIZED.forEach((t) => {
    if (hasWord(text, t))
      found.push({ term: t, policy: "bh", category: "Sexualized Harassment" });
  });
  BH_CALLS_DEATH.forEach((t) => {
    if (hasWord(text, t))
      found.push({ term: t, policy: "bh", category: "Calls for Death" });
  });
  BH_CALLS_SSI.forEach((t) => {
    if (hasWord(text, t))
      found.push({ term: t, policy: "bh", category: "Calls for SSI" });
  });
  BH_TARGETED_CURSING.forEach((t) => {
    if (hasWord(text, t))
      found.push({ term: t, policy: "bh", category: "Targeted Cursing" });
  });
  BH_NEGATIVE_CHARACTER.forEach((t) => {
    if (hasWord(text, t))
      found.push({ term: t, policy: "bh", category: "Negative Character" });
  });
  BH_NEGATIVE_PHYSICAL.forEach((t) => {
    if (hasWord(text, t))
      found.push({ term: t, policy: "bh", category: "Negative Physical" });
  });
  BH_DEHUMANIZING.forEach((t) => {
    if (hasWord(text, t))
      found.push({ term: t, policy: "bh", category: "Dehumanizing" });
  });

  return found;
}

function detectExceptions(text: string) {
  const lower = text.toLowerCase();
  
  const hasSelfDefense = /\b(defesa|defender|proteger|atacou-me|atacou primeiro)\b/i.test(lower);
  const hasRedemption = /\b(arrependo|desculpa|perdão|não devia|erro meu)\b/i.test(lower);
  const hasCondemning = /\b(é errado|não se deve|condenamos|repudiamos|contra a violência)\b/i.test(lower);
  const hasHypothetical = /\b(se eu fosse|imagine|hipótese|ficção|personagem|filme|série|jogo)\b/i.test(lower);

  const detected: string[] = [];
  if (hasSelfDefense) detected.push("Self-defense");
  if (hasRedemption) detected.push("Redemption");
  if (hasCondemning) detected.push("Condemning");
  if (hasHypothetical) detected.push("Hypothetical/Fiction");

  return {
    hasSelfDefense,
    hasRedemption,
    hasCondemning,
    hasHypothetical,
    detected,
  };
}

export function analyzeContent(text: string): Omit<AnalysisResult, "id" | "text" | "timestamp"> {
  const keywords = findKeywords(text);
  const exceptions = detectExceptions(text);

  // Checks
  const hasIntent = /\bvou\s+(te\s+)?/i.test(text) || /\bvamos\s+/i.test(text);
  const hasTiming = /\b(amanhã|hoje|às?\s*\d|daqui\s+a|esta\s+noite)\b/i.test(text);
  const hasTarget = /\b(te|você|tu|voce)\b/i.test(text) || /[A-Z][a-záàâãéèêíïóôõöúç]{2,}/.test(text);
  const hasArmament = keywords.some((k) => k.category === "Armament");
  const hasLocation = VI_HIGH_RISK_LOCATIONS.some((loc) => hasWord(text, loc));

  const checks = { hasTarget, hasIntent, hasTiming, hasArmament, hasLocation };

  // Determine policy and label
  const viKeywords = keywords.filter((k) => k.policy === "vi");
  const bhKeywords = keywords.filter((k) => k.policy === "bh");
  const hasHighSeverity = keywords.some((k) => k.severity === "high");
  const hasMidSeverity = keywords.some((k) => k.severity === "mid");

  let policy: "vi" | "bh" | null = null;
  let policyName: string | null = null;
  let label: string | null = null;
  let labelPath: string[] = [];
  let shouldEscalate = false;

  // Check if exceptions apply
  const hasException = exceptions.detected.length > 0;

  if (viKeywords.length > 0 && !hasException) {
    policy = "vi";
    policyName = "Violence and Incitement";

    if (hasHighSeverity && hasIntent && hasTarget && (hasTiming || hasArmament || hasLocation)) {
      shouldEscalate = true;
      label = "Escalate > Threatening - Other";
      labelPath = ["Escalate", "Threatening - Other"];
    } else if (hasHighSeverity) {
      label = "Label > V&I > High-severity violence > Threats";
      labelPath = ["Label", "V&I", "High-severity violence", "Threats"];
    } else if (hasMidSeverity) {
      label = "Label > V&I > Mid-severity violence > Threats";
      labelPath = ["Label", "V&I", "Mid-severity violence", "Threats"];
    } else {
      label = "Label > V&I > Low-severity violence";
      labelPath = ["Label", "V&I", "Low-severity violence"];
    }
  } else if (bhKeywords.length > 0 && !hasException) {
    policy = "bh";
    policyName = "Bullying and Harassment";
    const category = bhKeywords[0].category;
    label = `Label > B&H > ${category}`;
    labelPath = ["Label", "B&H", category];
  }

  // Reduce confidence if exceptions detected
  let confidence = 0;
  if (keywords.length > 0) confidence += 40;
  if (hasTarget) confidence += 20;
  if (hasIntent) confidence += 20;
  if (hasHighSeverity) confidence += 20;
  if (hasException) confidence -= 30;
  confidence = Math.max(0, Math.min(confidence, 100));

  return {
    keywords,
    policy,
    policyName,
    label,
    labelPath,
    shouldEscalate,
    confidence,
    checks,
    exceptions,
  };
}