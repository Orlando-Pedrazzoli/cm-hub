// ============================================
// CM POLICY HUB - ENHANCED PROMPT BUILDER v4.0
// MELHORIAS v4:
// 1. Integração com sistema de clarificações
// 2. Few-shot learning com decisões oficiais
// 3. Todas as melhorias v3 mantidas
// ============================================

import { KeywordMatch, PolicyId, DetectedExceptions, VIChecks } from "./types";
import {
  getPolicyData,
  extractGlossaryForPrompt,
  extractLabelHierarchyForPrompt,
  extractExceptionsForPrompt,
  extractEscalationCriteriaForPrompt,
  extractViolenceSeverityForPrompt,
  extractBHTiersForPrompt,
  extractUserCategoriesForPrompt,
  PolicyData,
} from "./policy-loader";
import { detectThreatPatterns, getExcludedTerms } from "./keyword-loader";

// NOVO v4: Import clarification system
import {
  findRelevantClarifications,
  formatClarificationsForPrompt,
  checkNoActionPatterns,
  MatchContext,
  MatchResult,
} from "./clarification-matcher";

// ============================================
// TYPES
// ============================================

export interface PreAnalysisContext {
  text: string;
  detectedKeywords: KeywordMatch[];
  candidatePolicies: PolicyId[];
  primaryCandidate: PolicyId | null;
  exceptions: DetectedExceptions;
  viChecks?: VIChecks;
  ssiedChecks?: SSIEDPreChecks;
  bhChecks?: BHPreChecks;
  language: "pt" | "en" | "multi";
  // v3: Threat patterns detectados
  threatPatterns?: { pattern: string; type: string }[];
  // NOVO v4: Clarifications matched
  matchedClarifications?: MatchResult[];
}

export interface SSIEDPreChecks {
  hasSuicideContent: boolean;
  hasSelfInjuryContent: boolean;
  hasEDContent: boolean;
  cisHasExplicitIntent: boolean;
  cisHasCapability: boolean;
  cisHasImminence: boolean;
  isCIS: boolean;
  hasPromotionSignals: boolean;
  hasViralEvent: boolean;
  edSignalType: "promotion" | "context" | "benign" | "none";
}

export interface BHPreChecks {
  hasTarget: boolean;
  targetType: "public_figure" | "lspf" | "private_adult" | "private_minor" | "unknown";
  hasPurposefulExposure: boolean;
  attackType: string | null;
  tier: 1 | 2 | 3 | 4 | null;
}

// ============================================
// POLICY-SPECIFIC DATA EXTRACTORS
// ============================================

function extractThreatSignalsForPrompt(policy: PolicyData): string {
  const signals = policy.threatSignals as {
    content_level_signals?: string[];
    military_language_excluded?: string[];
  } | undefined;

  if (!signals) return "";

  let text = `### THREAT SIGNALS\n`;

  if (signals.content_level_signals) {
    text += `**Content-Level Signals** (increase credibility):\n`;
    signals.content_level_signals.forEach((s) => {
      text += `- ${s}\n`;
    });
    text += "\n";
  }

  if (signals.military_language_excluded) {
    text += `**Excluded Military Language** (NOT threat signals):\n`;
    text += `${signals.military_language_excluded.join(", ")}\n\n`;
  }

  return text;
}

function extractHighRiskDataForPrompt(policy: PolicyData): string {
  let text = "";

  // Try to get highRiskPersons from glossary or dedicated field
  if (policy.glossary?.high_risk_person) {
    text += `### HIGH-RISK PERSONS\n`;
    text += `${policy.glossary.high_risk_person}\n\n`;
  }

  if (policy.glossary?.high_risk_location) {
    text += `### HIGH-RISK LOCATIONS\n`;
    text += `${policy.glossary.high_risk_location}\n\n`;
  }

  if (policy.glossary?.temporary_high_risk_location) {
    text += `### TEMPORARY HIGH-RISK LOCATIONS (THRL)\n`;
    text += `${policy.glossary.temporary_high_risk_location}\n\n`;
  }

  return text;
}

function extractExamplesFromCategories(policy: PolicyData): string {
  if (!policy.categories) return "";

  let text = `### EXAMPLES BY CATEGORY\n`;
  let hasExamples = false;

  policy.categories.forEach((cat) => {
    if (cat.subcategories) {
      cat.subcategories.forEach((sub) => {
        if (sub.examples && sub.examples.length > 0) {
          hasExamples = true;
          text += `**${sub.name}**:\n`;
          sub.examples.slice(0, 2).forEach((ex) => {
            text += `  - "${ex}"\n`;
          });
        }
      });
    }
  });

  return hasExamples ? text + "\n" : "";
}

// ============================================
// BUILD SYSTEM INSTRUCTION (Mais conciso)
// ============================================

function buildSystemInstruction(language: string, primaryPolicy: PolicyId | null): string {
  const policyFocus = primaryPolicy ? primaryPolicy.toUpperCase() : "GENERAL";

  return `You are an EXPERT Meta content moderator analyzing for ${policyFocus} policy violations.

CRITICAL RULES:
1. Use EXACT definitions from GLOSSARY - never paraphrase
2. Follow LABEL HIERARCHY in strict order
3. Check ALL EXCEPTIONS before deciding violation
4. Default to HIGHER severity when uncertain
5. Default to VALID target when uncertain
6. APPLY CLARIFICATIONS when content matches known patterns

LANGUAGE: ${language === "pt" ? "PORTUGUESE" : language === "en" ? "ENGLISH" : "MULTILINGUAL"}

`;
}

// ============================================
// BUILD PRE-ANALYSIS SECTION (Otimizado)
// ============================================

function buildPreAnalysisSection(context: PreAnalysisContext): string {
  const { detectedKeywords, exceptions, viChecks, ssiedChecks, bhChecks, candidatePolicies, threatPatterns } = context;

  let section = `## PRE-ANALYSIS RESULTS\n\n`;

  // Candidate policies (apenas top 3)
  if (candidatePolicies.length > 0) {
    section += `**Primary Policy**: ${candidatePolicies[0]?.toUpperCase() || "UNKNOWN"}\n`;
    if (candidatePolicies.length > 1) {
      section += `**Also Consider**: ${candidatePolicies.slice(1, 3).map(p => p.toUpperCase()).join(", ")}\n`;
    }
    section += "\n";
  }

  // Keywords - apenas os mais relevantes
  if (detectedKeywords.length > 0) {
    section += `### Detected Keywords (${detectedKeywords.length})\n`;

    const critical = detectedKeywords.filter(k => k.severity === "critical");
    const high = detectedKeywords.filter(k => k.severity === "high");

    if (critical.length > 0) {
      section += `🔴 CRITICAL: ${critical.slice(0, 5).map(k => `"${k.term}" [${k.category}]`).join(", ")}\n`;
    }
    if (high.length > 0) {
      section += `🟠 HIGH: ${high.slice(0, 5).map(k => `"${k.term}" [${k.category}]`).join(", ")}\n`;
    }

    // Incluir caveats se existirem
    const withCaveats = detectedKeywords.filter(k => k.contextNotes);
    if (withCaveats.length > 0) {
      section += `\n⚠️ **Context Notes**:\n`;
      withCaveats.slice(0, 3).forEach(k => {
        section += `- "${k.term}": ${k.contextNotes}\n`;
      });
    }
    section += "\n";
  }

  // Threat patterns detectados
  if (threatPatterns && threatPatterns.length > 0) {
    section += `### Threat Patterns Detected\n`;
    threatPatterns.forEach(p => {
      section += `- "${p.pattern}" (${p.type})\n`;
    });
    section += "\n";
  }

  // Exceptions (compacto)
  if (exceptions.detected.length > 0) {
    section += `### Potential Exceptions\n`;
    section += `${exceptions.detected.join(", ")}\n\n`;
  }

  // VI Checks (tabela compacta)
  if (viChecks) {
    section += `### VI Credibility Check\n`;
    const checks = [
      viChecks.hasTarget ? "✓Target" : "✗Target",
      viChecks.hasIntent ? "✓Intent" : "✗Intent",
      viChecks.hasMethod ? "✓Method" : "✗Method",
      viChecks.hasTiming ? "✓Timing" : "✗Timing",
      viChecks.hasArmament ? "✓Armament" : "✗Armament",
      viChecks.hasLocation ? "✓Location" : "✗Location",
    ];
    section += `${checks.join(" | ")}\n`;
    section += `**Formula**: Target + Intent + Method + (Timing OR Armament OR Location)\n`;
    section += `**Result**: ${viChecks.isCredibleThreat ? "⚠️ CREDIBLE - EVALUATE ESCALATION" : "Not credible"}\n\n`;
  }

  // SSIED/CIS Checks
  if (ssiedChecks?.isCIS) {
    section += `### 🚨 CIS DETECTED\n`;
    section += `Intent: ${ssiedChecks.cisHasExplicitIntent ? "✓" : "✗"} | `;
    section += `Capability: ${ssiedChecks.cisHasCapability ? "✓" : "✗"} | `;
    section += `Imminence: ${ssiedChecks.cisHasImminence ? "✓" : "✗"}\n`;
    section += `**ALL THREE PRESENT = MUST ESCALATE**\n\n`;
  }

  // BH Checks
  if (bhChecks && bhChecks.hasTarget) {
    section += `### BH Assessment\n`;
    section += `Target: ${bhChecks.targetType.replace(/_/g, " ")} | `;
    section += `Attack: ${bhChecks.attackType || "TBD"} | `;
    section += `Tier: ${bhChecks.tier || "TBD"}\n\n`;
  }

  return section;
}

// ============================================
// NOVO v4: BUILD CLARIFICATIONS SECTION
// ============================================

function buildClarificationsSection(context: PreAnalysisContext): string {
  // Build match context from pre-analysis
  const matchContext: MatchContext = {
    content: context.text,
    detectedKeywords: context.detectedKeywords.map(k => k.term),
    candidatePolicies: context.candidatePolicies,
    contentLanguage: context.language,
  };

  // Find relevant clarifications
  const matches = findRelevantClarifications(matchContext, {
    maxResults: 3,
    minScore: 2,
  });

  // Store matches in context for later use
  context.matchedClarifications = matches;

  if (matches.length === 0) {
    return "";
  }

  // Format for prompt injection
  return formatClarificationsForPrompt(matches);
}

// ============================================
// BUILD POLICY DATA SECTION (Otimizado)
// ============================================

function buildPolicyDataSection(primaryPolicy: PolicyId, allCandidates: PolicyId[]): string {
  const primaryData = getPolicyData(primaryPolicy);
  if (!primaryData) return "";

  let section = `## POLICY: ${primaryData.name} (${primaryData.shortName})\n`;
  section += `${primaryData.description}\n\n`;

  // GLOSSÁRIO (crítico - sempre incluir)
  const glossary = extractGlossaryForPrompt(primaryData);
  if (glossary) section += glossary;

  // LABEL HIERARCHY (para labeling correto)
  const hierarchy = extractLabelHierarchyForPrompt(primaryData);
  if (hierarchy) section += hierarchy;

  // EXCEPTIONS (evitar falsos positivos)
  const exceptions = extractExceptionsForPrompt(primaryData);
  if (exceptions) section += exceptions;

  // ESCALATION CRITERIA
  const escalation = extractEscalationCriteriaForPrompt(primaryData);
  if (escalation) section += escalation;

  // POLICY-SPECIFIC DATA
  if (primaryPolicy === "vi") {
    // Violence severity levels
    const severity = extractViolenceSeverityForPrompt(primaryData);
    if (severity) section += severity;

    // Threat signals
    const signals = extractThreatSignalsForPrompt(primaryData);
    if (signals) section += signals;

    // High-risk data
    const highRisk = extractHighRiskDataForPrompt(primaryData);
    if (highRisk) section += highRisk;
  }

  if (primaryPolicy === "bh") {
    const tiers = extractBHTiersForPrompt(primaryData);
    if (tiers) section += tiers;

    const userCats = extractUserCategoriesForPrompt(primaryData);
    if (userCats) section += userCats;
  }

  // EXAMPLES (se disponíveis)
  const examples = extractExamplesFromCategories(primaryData);
  if (examples) section += examples;

  return section;
}

// ============================================
// BUILD CHAIN-OF-THOUGHT (Policy-Specific)
// ============================================

function buildChainOfThoughtSection(primaryPolicy: PolicyId | null, context: PreAnalysisContext): string {
  let cot = `## ANALYSIS STEPS\n\n`;

  // Steps específicos para a policy
  if (primaryPolicy === "vi") {
    cot += `1. **Identify Violence Type**: High/Mid/Low severity based on method
2. **Verify Target**: Is there a valid target (person, group, place)?
3. **Check Intent**: Statement of intent, call for action, or aspirational?
4. **Assess Credibility**: Does it meet escalation formula?
5. **Check Exceptions**: Self-defense, satire, contact sports, fiction?
6. **Check Clarifications**: Does content match any known No Action patterns?
7. **Select Label**: Use hierarchy - first match wins

`;
    if (context.viChecks?.isCredibleThreat) {
      cot += `⚠️ **CREDIBILITY MET** - Strongly consider ESCALATION\n\n`;
    }
  } else if (primaryPolicy === "ssied" || primaryPolicy === "cis") {
    cot += `1. **Identify Content Type**: Suicide, Self-Injury, or Eating Disorder?
2. **Check CIS Criteria**: Explicit Intent + Capability + Imminence (<24h)
3. **Assess Context**: Promotion vs Recovery vs Awareness
4. **Check ED Signals**: Promotion (violating) vs Benign (no action)
5. **Check Exceptions**: Recovery context, awareness raising?
6. **Check Clarifications**: Match against known SSI patterns
7. **Select Label**: Use hierarchy

`;
    if (context.ssiedChecks?.isCIS) {
      cot += `🚨 **CIS CRITERIA MET** - MUST ESCALATE\n\n`;
    }
  } else if (primaryPolicy === "bh") {
    cot += `1. **Identify Target**: Public figure, LSPF, Private adult, or Private minor?
2. **Determine Attack Type**: Calls for death, Sexualized, Dehumanizing, etc.
3. **Apply Correct Tier**: Based on target type
4. **Check Requirements**: Purposeful exposure? Self-report needed?
5. **Check Exceptions**: Endearing context, criminal allegation, business review?
6. **Check Clarifications**: Match against known BH patterns (CRITICAL!)
7. **Select Label**: Match attack type to tier rules

**BH CLARIFICATION REMINDERS**:
- "Porco" = negative physical description (NOT animal comparison)
- "Palhaço" = negative character claim
- "Rabolho" = sexual orientation claim
- Attacks on reporter's FAMILY ≠ attack on reporter (different target)
- Indirect attacks do NOT violate even with self-report
- Endearing context cancels attack
- Physical bullying vs adults REQUIRES further degrading
- When uncertain adult/minor → DEFAULT TO MINOR

`;
  } else if (primaryPolicy === "hc") {
    cot += `1. **Identify Target**: Based on protected characteristic (PC)?
2. **Determine Tier**: T1 (dehumanizing) or T2 (insults/exclusion)?
3. **Check if Slur**: Context of slur use matters
4. **Check Exceptions**: Self-reference, condemning, educational?
5. **Check Clarifications**: "viado" is proxy/codeword (NOT slur)
6. **Select Label**: Match to hierarchy

`;
  } else if (primaryPolicy === "ansa") {
    cot += `1. **Identify Content Type**: Nudity, sexual activity, or suggestive?
2. **Apply HIERARCHY** (apply highest matching):
   - Near nudity > Focus > Sex-related activity > Revealing
3. **Check for Multiple Violations**: Use highest label
4. **Check Clarifications**: Match known ANSA patterns
5. **Select Label**: First match in hierarchy wins

**ANSA HIERARCHY REMINDER**:
Near nudity > Focus (crotch/buttocks/breasts) > Sex-related activity > Revealing clothing

`;
  } else if (primaryPolicy === "spam") {
    cot += `1. **Identify Spam Type**: Engagement Gating, Giveaways, or other?
2. **Check Engagement Gating Requirements**:
   - Specific existing content offered?
   - Clearly in exchange for engagement?
3. **Check Clarifications**: "Grupo" ≠ content, money for engagement = Spam (not Fraud)
4. **Select Label**: Match to spam category

`;
  } else {
    // Generic CoT
    cot += `1. **Understand Content**: What is being said/shown?
2. **Match Policy**: Which categories apply?
3. **Check Severity**: Critical > High > Mid > Low
4. **Check Exceptions**: Any context that negates violation?
5. **Check Clarifications**: Match against known patterns
6. **Select Label**: First matching label in hierarchy
7. **Determine Action**: Escalate > Label > No Action

`;
  }

  return cot;
}

// ============================================
// BUILD RESPONSE FORMAT
// ============================================

function buildResponseFormatSection(): string {
  return `## RESPONSE FORMAT
Output ONLY valid JSON (no markdown, no explanation outside JSON):

{
  "action": "no_action" | "escalate" | "label",
  "primaryPolicy": "policy_id",
  "primaryPolicyName": "Full Policy Name",
  "decisionPath": ["Action", "Policy", "Category", "..."],
  "terminalNodeId": "label_id",
  "fullLabel": "Action > Policy > Category > ...",
  "confidence": 0-100,
  "reasoning": "Brief explanation referencing specific policy criteria and why exceptions do/don't apply",
  "shouldEscalate": true | false,
  "escalationReason": "If escalating: which criteria met",
  "appliedClarification": "ID of clarification used, if any"
}

`;
}

// ============================================
// BUILD CRITICAL REMINDERS (Compacto + Clarifications)
// ============================================

function buildCriticalReminders(context: PreAnalysisContext): string {
  let reminders = `## CRITICAL REMINDERS\n\n`;

  // Escalation conditions
  reminders += `**MUST ESCALATE**:\n`;
  reminders += `- CIS: Intent + Capability + Imminence (ALL THREE)\n`;
  reminders += `- CSAM: Any child sexual abuse material\n`;
  reminders += `- Credible Violence: Target + Intent + Method + (Timing/Armament/Location)\n\n`;

  reminders += `**DO NOT ESCALATE**:\n`;
  reminders += `- Content >1 month old\n`;
  reminders += `- Fiction without real-world indicators\n`;
  reminders += `- Impossible methods ("when pigs fly")\n\n`;

  // Context-specific warnings
  if (context.viChecks?.isCredibleThreat) {
    reminders += `⚠️ **ALERT**: Credibility criteria appear to be met - verify before deciding\n\n`;
  }

  if (context.ssiedChecks?.isCIS) {
    reminders += `🚨 **ALERT**: CIS criteria detected - escalation likely required\n\n`;
  }

  // Excluded terms warning
  const excluded = getExcludedTerms();
  if (excluded.length > 0) {
    const relevantExcluded = excluded.slice(0, 5).map((e: { term: string; reason: string }) => e.term);
    reminders += `**Common False Positives**: ${relevantExcluded.join(", ")}\n`;
    reminders += `(These phrases are NOT violations even if they contain keywords)\n\n`;
  }

  // NOVO v4: Clarification reminders by policy
  if (context.primaryCandidate === "bh") {
    reminders += `**BH KEY CLARIFICATIONS**:\n`;
    reminders += `- Self-report required for most attacks on private individuals\n`;
    reminders += `- Indirect attacks NEVER violate (even with self-report)\n`;
    reminders += `- Endearing context cancels attack\n`;
    reminders += `- "Atira-te ao mar" = idiomatic expression (No Action)\n`;
    reminders += `- Attack on reporter's family ≠ attack on reporter\n\n`;
  }

  if (context.primaryCandidate === "ssied") {
    reminders += `**SSIED KEY CLARIFICATIONS**:\n`;
    reminders += `- SSI with specific target → BH (not SSIED)\n`;
    reminders += `- SSI without target → SSIED Promotion\n`;
    reminders += `- CIS requires ALL THREE: Intent + Capability + Imminence\n`;
    reminders += `- "Compulsão alimentar" alone is NOT automatically ED\n\n`;
  }

  if (context.primaryCandidate === "vi") {
    reminders += `**VI KEY CLARIFICATIONS**:\n`;
    reminders += `- HSV requires valid statement (intent/call/advocacy)\n`;
    reminders += `- Criminal status alone = No Action\n`;
    reminders += `- "Traficante" is NOT criminal status (only HSV or sexual predator)\n`;
    reminders += `- Neutral reference/warning = No Action\n`;
    reminders += `- Ambiguous terms require additional context\n\n`;
  }

  // NOVO v4: Log matched clarifications
  if (context.matchedClarifications && context.matchedClarifications.length > 0) {
    reminders += `**MATCHED CLARIFICATIONS** (apply these decisions):\n`;
    context.matchedClarifications.forEach((m, i) => {
      reminders += `${i + 1}. [${m.clarification.id}] ${m.clarification.decision}\n`;
    });
    reminders += `\n`;
  }

  return reminders;
}

// ============================================
// MAIN FUNCTION: BUILD ENHANCED PROMPT v4
// ============================================

export function buildEnhancedPrompt(context: PreAnalysisContext): string {
  const {
    text,
    candidatePolicies,
    primaryCandidate,
    language,
  } = context;

  // Detect threat patterns
  const threatPatterns = detectThreatPatterns(text);
  const enrichedContext: PreAnalysisContext = {
    ...context,
    threatPatterns,
  };

  let prompt = "";

  // 1. System instruction (concisa)
  prompt += buildSystemInstruction(language, primaryCandidate);

  // 2. Pre-analysis results
  prompt += buildPreAnalysisSection(enrichedContext);

  // 3. Policy data (se há candidato)
  if (primaryCandidate) {
    prompt += buildPolicyDataSection(primaryCandidate, candidatePolicies);
  } else if (candidatePolicies.length > 0) {
    prompt += buildPolicyDataSection(candidatePolicies[0], candidatePolicies);
  }

  // 4. NOVO v4: Clarifications section (few-shot examples)
  const clarificationsSection = buildClarificationsSection(enrichedContext);
  if (clarificationsSection) {
    prompt += clarificationsSection;
  }

  // 5. Chain-of-thought (específico para policy)
  prompt += buildChainOfThoughtSection(primaryCandidate || candidatePolicies[0], enrichedContext);

  // 6. Text to analyze
  prompt += `## TEXT TO ANALYZE\n\`\`\`\n${text}\n\`\`\`\n\n`;

  // 7. Response format
  prompt += buildResponseFormatSection();

  // 8. Critical reminders (includes clarification hints)
  prompt += buildCriticalReminders(enrichedContext);

  return prompt;
}

// ============================================
// NOVO v4: QUICK CHECK FOR NO ACTION PATTERNS
// ============================================

/**
 * Quick check if content matches known No Action clarifications
 * Can be used before full AI analysis for quick decisions
 * 
 * v1.1 FIX: Now respects safety blocks from clarification-matcher
 */
export function quickNoActionCheck(
  text: string, 
  candidatePolicy: PolicyId
): { shouldSkipAI: boolean; reason?: string; clarificationId?: string; blockedReason?: string } {
  const result = checkNoActionPatterns(text, candidatePolicy);
  
  // If blocked due to threat indicators, NEVER skip AI
  if (result.blockedReason) {
    console.log(`[QuickCheck] 🚫 Blocked: ${result.blockedReason}`);
    return { 
      shouldSkipAI: false,
      blockedReason: result.blockedReason
    };
  }
  
  // Only skip AI for confirmed safe idioms
  if (result.isNoAction && result.matchedClarification) {
    console.log(`[QuickCheck] ✅ Safe idiom matched: ${result.matchedClarification.id}`);
    return {
      shouldSkipAI: true,
      reason: result.matchedClarification.rationale,
      clarificationId: result.matchedClarification.id,
    };
  }
  
  return { shouldSkipAI: false };
}

// ============================================
// EXPORT
// ============================================

export default buildEnhancedPrompt;