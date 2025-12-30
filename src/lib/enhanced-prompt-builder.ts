// ============================================
// CM POLICY HUB - ENHANCED PROMPT BUILDER v2.0
// Sistema de geração de prompts dinâmicos para Gemini AI
// AGORA COM INJEÇÃO DE DADOS REAIS DOS JSONs
// ============================================

import { KeywordMatch, PolicyId, DetectedExceptions, VIChecks } from "./types";
import { 
  buildCompletePolicyContext, 
  getPolicyData,
  extractGlossaryForPrompt,
  extractLabelHierarchyForPrompt,
  extractExceptionsForPrompt,
  extractOperationalGuidelinesForPrompt,
  extractEscalationCriteriaForPrompt,
  extractViolenceSeverityForPrompt,
  extractBHTiersForPrompt,
  extractUserCategoriesForPrompt,
  extractEDSignalsForPrompt,
} from "./policy-loader";

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
// EXCEPTION DESCRIPTIONS (fallback)
// ============================================

const EXCEPTION_DESCRIPTIONS: Record<string, string> = {
  self_defense: "Violence in defense of self or another with proportional response",
  redemption: "Content shared in redemption or regret context",
  condemnation: "Content shared to condemn or raise awareness",
  news_reporting: "Neutral reporting by news organizations",
  educational: "Educational or academic context",
  satire: "Satire, parody, or clearly humorous context",
  artistic: "Artistic expression (lyrics, poetry, fiction)",
  hypothetical: "Hypothetical scenarios, fiction, video games",
  contact_sports: "Contact sports context (boxing, MMA, rugby)",
  fight_sport: "Martial arts with pads, uniforms, referees",
  medical: "Medical or healthcare context",
  family: "Family context (parent-child interactions)",
  recovery: "Recovery from suicide/self-harm/ED with no graphic imagery",
  religious_fasting: "Religious fasting (Ramadan, Lent)",
  business_review: "Business/service reviews",
  criminal_allegation: "Criminal allegations against adults",
  endearing: "Endearing context between friends",
  brick_and_mortar: "Licensed retail store context",
  fictional: "Recognized fictional content",
};

// ============================================
// BUILD ENHANCED PROMPT - MAIN FUNCTION
// ============================================

export function buildEnhancedPrompt(context: PreAnalysisContext): string {
  const { 
    text, 
    detectedKeywords, 
    candidatePolicies, 
    primaryCandidate, 
    exceptions, 
    viChecks, 
    ssiedChecks, 
    bhChecks, 
    language 
  } = context;

  // Start with system instruction
  let prompt = buildSystemInstruction(language);

  // Add pre-analysis results
  prompt += buildPreAnalysisSection(context);

  // ====== CRITICAL: INJECT REAL POLICY DATA ======
  if (primaryCandidate) {
    prompt += buildRealPolicyDataSection(primaryCandidate, candidatePolicies);
  } else if (candidatePolicies.length > 0) {
    // If no primary, inject data for top 2 candidates
    prompt += buildRealPolicyDataSection(candidatePolicies[0], candidatePolicies.slice(0, 2));
  }

  // Add Chain-of-Thought instructions
  prompt += buildChainOfThoughtSection();

  // Add the text to analyze
  prompt += buildTextSection(text);

  // Add response format
  prompt += buildResponseFormatSection();

  // Add critical rules
  prompt += buildCriticalRulesSection(context);

  return prompt;
}

// ============================================
// BUILD SYSTEM INSTRUCTION
// ============================================

function buildSystemInstruction(language: string): string {
  return `You are an EXPERT content moderator for Meta platforms (Facebook, Instagram, WhatsApp).

## YOUR ROLE
You must analyze content and determine the EXACT moderation action based on Meta's Community Standards.
You have access to COMPLETE policy definitions below. Use them EXACTLY as written.

## LANGUAGE DETECTED
Content appears to be in: ${language === "pt" ? "PORTUGUESE" : language === "en" ? "ENGLISH" : "MULTIPLE LANGUAGES"}

## ANALYSIS APPROACH
1. Read the PRE-ANALYSIS section (keywords already detected)
2. Study the COMPLETE POLICY DATA section carefully
3. Follow CHAIN-OF-THOUGHT reasoning
4. Apply the LABEL HIERARCHY in order
5. Check ALL EXCEPTIONS before deciding
6. Output your decision in the specified JSON format

`;
}

// ============================================
// BUILD PRE-ANALYSIS SECTION
// ============================================

function buildPreAnalysisSection(context: PreAnalysisContext): string {
  const { detectedKeywords, exceptions, viChecks, ssiedChecks, bhChecks, candidatePolicies } = context;

  let section = `## PRE-ANALYSIS RESULTS
These keywords and checks have been verified. Use this information in your analysis.

`;

  // Candidate policies
  if (candidatePolicies.length > 0) {
    section += `### Candidate Policies (by keyword match)\n`;
    section += `${candidatePolicies.map(p => p.toUpperCase()).join(", ")}\n\n`;
  }

  // Keywords found - grouped by severity
  if (detectedKeywords.length > 0) {
    section += `### Detected Keywords (${detectedKeywords.length} total)\n`;
    
    const critical = detectedKeywords.filter(k => k.severity === "critical");
    const high = detectedKeywords.filter(k => k.severity === "high");
    const mid = detectedKeywords.filter(k => k.severity === "mid");
    const low = detectedKeywords.filter(k => k.severity === "low" || k.severity === "info");

    if (critical.length > 0) {
      section += `🔴 **CRITICAL**: ${critical.map(k => `"${k.term}" [${k.policy.toUpperCase()}/${k.category}]`).join(", ")}\n`;
    }
    if (high.length > 0) {
      section += `🟠 **HIGH**: ${high.map(k => `"${k.term}" [${k.policy.toUpperCase()}/${k.category}]`).join(", ")}\n`;
    }
    if (mid.length > 0) {
      section += `🟡 **MID**: ${mid.map(k => `"${k.term}" [${k.policy.toUpperCase()}/${k.category}]`).join(", ")}\n`;
    }
    if (low.length > 0) {
      section += `🟢 **LOW**: ${low.map(k => `"${k.term}" [${k.policy.toUpperCase()}]`).join(", ")}\n`;
    }
    section += "\n";
  } else {
    section += `### Detected Keywords: None found\n\n`;
  }

  // Potential exceptions
  if (exceptions.detected.length > 0) {
    section += `### Potential Exceptions Detected\n`;
    section += `⚠️ These contexts MAY negate a violation - verify against policy exceptions:\n`;
    exceptions.detected.forEach(exc => {
      const desc = EXCEPTION_DESCRIPTIONS[exc.toLowerCase().replace(/[^a-z]/g, "_")] || exc;
      section += `- **${exc}**: ${desc}\n`;
    });
    section += "\n";
  }

  // VI-specific checks
  if (viChecks) {
    section += `### Violence Credibility Assessment\n`;
    section += `| Element | Present |\n`;
    section += `|---------|--------|\n`;
    section += `| Target | ${viChecks.hasTarget ? "✅ YES" : "❌ NO"} |\n`;
    section += `| Statement of Intent | ${viChecks.hasIntent ? "✅ YES" : "❌ NO"} |\n`;
    section += `| Method | ${viChecks.hasMethod ? "✅ YES" : "❌ NO"} |\n`;
    section += `| Timing (<24h) | ${viChecks.hasTiming ? "✅ YES" : "❌ NO"} |\n`;
    section += `| Armament | ${viChecks.hasArmament ? "✅ YES" : "❌ NO"} |\n`;
    section += `| Location (HRL) | ${viChecks.hasLocation ? "✅ YES" : "❌ NO"} |\n\n`;
    
    section += `**Escalation Formula**: Target + Intent + Method + (Timing OR Armament OR Location)\n`;
    section += `**Assessment**: ${viChecks.isCredibleThreat ? "⚠️ CREDIBLE THREAT - EVALUATE FOR ESCALATION" : "Does not meet credibility threshold"}\n\n`;
  }

  // SSIED/CIS-specific checks
  if (ssiedChecks) {
    section += `### SSIED / CIS Assessment\n`;
    section += `| Element | Present |\n`;
    section += `|---------|--------|\n`;
    section += `| Suicide Content | ${ssiedChecks.hasSuicideContent ? "✅ YES" : "❌ NO"} |\n`;
    section += `| Self-Injury Content | ${ssiedChecks.hasSelfInjuryContent ? "✅ YES" : "❌ NO"} |\n`;
    section += `| ED Content | ${ssiedChecks.hasEDContent ? "✅ YES" : "❌ NO"} |\n`;
    section += `| CIS: Explicit Intent | ${ssiedChecks.cisHasExplicitIntent ? "✅ YES" : "❌ NO"} |\n`;
    section += `| CIS: Capability/Method | ${ssiedChecks.cisHasCapability ? "✅ YES" : "❌ NO"} |\n`;
    section += `| CIS: Imminence (<24h) | ${ssiedChecks.cisHasImminence ? "✅ YES" : "❌ NO"} |\n`;
    section += `| Promotion Signals | ${ssiedChecks.hasPromotionSignals ? "✅ YES" : "❌ NO"} |\n\n`;
    
    section += `**CIS Formula**: Explicit Intent + Capability + Imminence (ALL THREE required)\n`;
    section += `**CIS Assessment**: ${ssiedChecks.isCIS ? "🚨 CIS DETECTED - MUST ESCALATE" : "Not CIS"}\n`;
    section += `**ED Signal Type**: ${ssiedChecks.edSignalType.toUpperCase()}\n\n`;
  }

  // BH-specific checks
  if (bhChecks) {
    section += `### Bullying & Harassment Assessment\n`;
    section += `| Element | Value |\n`;
    section += `|---------|-------|\n`;
    section += `| Target Identified | ${bhChecks.hasTarget ? "✅ YES" : "❌ NO"} |\n`;
    section += `| Target Type | ${bhChecks.targetType.replace(/_/g, " ").toUpperCase()} |\n`;
    section += `| Purposeful Exposure | ${bhChecks.hasPurposefulExposure ? "✅ YES" : "❌ NO"} |\n`;
    section += `| Attack Type | ${bhChecks.attackType || "Unknown"} |\n`;
    section += `| Applicable Tier | ${bhChecks.tier || "TBD"} |\n\n`;
  }

  return section;
}

// ============================================
// BUILD REAL POLICY DATA SECTION
// This is the CRITICAL fix - injects actual JSON data
// ============================================

function buildRealPolicyDataSection(primaryPolicy: PolicyId, allCandidates: PolicyId[]): string {
  let section = `## COMPLETE POLICY DATA
⚠️ USE THESE EXACT DEFINITIONS AND CRITERIA FOR YOUR ANALYSIS ⚠️

`;

  // Always include primary policy with full context
  const primaryData = getPolicyData(primaryPolicy);
  if (primaryData) {
    section += `### PRIMARY POLICY: ${primaryData.name} (${primaryData.shortName})\n`;
    section += `${primaryData.description}\n\n`;

    // Inject glossary (CRITICAL for accurate analysis)
    const glossary = extractGlossaryForPrompt(primaryData);
    if (glossary) {
      section += glossary;
    }

    // Inject label hierarchy (for correct labeling)
    const hierarchy = extractLabelHierarchyForPrompt(primaryData);
    if (hierarchy) {
      section += hierarchy;
    }

    // Inject exceptions (to avoid false positives)
    const exceptions = extractExceptionsForPrompt(primaryData);
    if (exceptions) {
      section += exceptions;
    }

    // Inject operational guidelines
    const guidelines = extractOperationalGuidelinesForPrompt(primaryData);
    if (guidelines) {
      section += guidelines;
    }

    // Inject escalation criteria
    const escalation = extractEscalationCriteriaForPrompt(primaryData);
    if (escalation) {
      section += escalation;
    }

    // Policy-specific data
    if (primaryPolicy === "vi") {
      const severity = extractViolenceSeverityForPrompt(primaryData);
      if (severity) {
        section += severity;
      }
    }

    if (primaryPolicy === "bh") {
      const tiers = extractBHTiersForPrompt(primaryData);
      if (tiers) {
        section += tiers;
      }
      const userCats = extractUserCategoriesForPrompt(primaryData);
      if (userCats) {
        section += userCats;
      }
    }

    if (primaryPolicy === "ssied" || primaryPolicy === "cis") {
      const edSignals = extractEDSignalsForPrompt(primaryData);
      if (edSignals) {
        section += edSignals;
      }
    }
  }

  // Add secondary candidates (abbreviated)
  const secondaryCandidates = allCandidates.filter(c => c !== primaryPolicy).slice(0, 2);
  if (secondaryCandidates.length > 0) {
    section += `\n### SECONDARY POLICIES (may also apply)\n\n`;
    
    secondaryCandidates.forEach(policyId => {
      const policyData = getPolicyData(policyId);
      if (policyData) {
        section += `**${policyData.name} (${policyData.shortName})**\n`;
        section += `${policyData.description}\n`;
        
        // Just add glossary for secondary policies
        const glossary = extractGlossaryForPrompt(policyData);
        if (glossary) {
          section += glossary;
        }
        section += "\n";
      }
    });
  }

  return section;
}

// ============================================
// BUILD CHAIN-OF-THOUGHT SECTION
// ============================================

function buildChainOfThoughtSection(): string {
  return `## CHAIN-OF-THOUGHT ANALYSIS
Follow these steps IN ORDER:

### STEP 1: Content Understanding
- What is the content saying/showing?
- Who is the target (if any)?
- What is the intent?

### STEP 2: Keyword Verification
- Review the detected keywords
- Do they match the content context?
- Are there false positives (medical, news, satire)?

### STEP 3: Policy Match
- Which policy best matches the violation?
- Check the GLOSSARY definitions
- Verify against CATEGORIES

### STEP 4: Severity Assessment
- What severity level applies?
- Use the definitions from the policy data
- When unsure, default to HIGHER severity

### STEP 5: Exception Check
- Does ANY exception apply?
- Check EVERY exception listed
- If exception applies → likely No Action

### STEP 6: Label Selection
- Follow the LABEL HIERARCHY in order
- Select the FIRST matching label
- Include the full decision path

### STEP 7: Escalation Check
- Does this meet ESCALATION criteria?
- CIS, CSAM, Credible Threats → ALWAYS escalate
- Check the specific escalation rules

### STEP 8: Final Decision
- Synthesize all steps
- State your action: escalate, label, or no_action
- Provide reasoning

`;
}

// ============================================
// BUILD TEXT SECTION
// ============================================

function buildTextSection(text: string): string {
  return `## TEXT TO ANALYZE
\`\`\`
${text}
\`\`\`

`;
}

// ============================================
// BUILD RESPONSE FORMAT SECTION
// ============================================

function buildResponseFormatSection(): string {
  return `## RESPONSE FORMAT
Respond with ONLY valid JSON. No markdown code blocks. No explanation outside JSON.

{
  "action": "no_action" | "escalate" | "label",
  "primaryPolicy": "policy_id",
  "primaryPolicyName": "Full Policy Name",
  "decisionPath": ["Action", "Policy", "Category", "Subcategory", "..."],
  "terminalNodeId": "unique_id_from_label_hierarchy",
  "fullLabel": "Action > Policy > Category > ...",
  "confidence": 0-100,
  "reasoning": "2-3 sentences explaining your Chain-of-Thought reasoning. Reference specific policy criteria, glossary definitions, and why exceptions do or do not apply.",
  "shouldEscalate": true | false,
  "escalationReason": "If escalating: explain EXACTLY which criteria were met (e.g., 'CIS: Intent + Method + Imminence all present')",
  "exceptionsConsidered": ["exception1", "exception2"],
  "exceptionApplied": "exception_name or null"
}

`;
}

// ============================================
// BUILD CRITICAL RULES SECTION
// ============================================

function buildCriticalRulesSection(context: PreAnalysisContext): string {
  let rules = `## CRITICAL RULES

### ALWAYS DO:
1. Use EXACT definitions from the GLOSSARY - do not paraphrase
2. Follow LABEL HIERARCHY in order - select FIRST matching label
3. Check ALL exceptions before deciding
4. Default to HIGHER severity when unsure
5. Default to VALID target when unsure
6. Recognize proxy language (e.g., "CPF cancelado" = death threat)

### NEVER DO:
1. Skip exception checking
2. Use labels not in the hierarchy
3. Escalate without meeting ALL criteria
4. Ignore detected keywords
5. Make assumptions not supported by policy data

### ESCALATION RULES:
`;

  // Add context-specific escalation reminders
  if (context.viChecks?.isCredibleThreat) {
    rules += `⚠️ **CREDIBLE THREAT DETECTED**: Verify Target + Intent + Method + (Timing/Armament/Location)\n`;
  }

  if (context.ssiedChecks?.isCIS) {
    rules += `🚨 **CIS DETECTED**: If Intent + Capability + Imminence are confirmed → MUST ESCALATE\n`;
  }

  rules += `
### MUST ESCALATE:
- CIS (Credible Intent of Suicide): Intent + Capability + Imminence (<24h)
- CSAM: Any child sexual abuse material
- Credible Violence: Target + Intent + Method + (Timing OR Armament OR Location)
- Sextortion involving minors

### DO NOT ESCALATE:
- Content >1 month old
- Fictional content without real-world indicators
- Calls for action against adult public figures (even high-risk)
- Threats with impossible methods ("when pigs fly")

`;

  return rules;
}

// ============================================
// EXPORT
// ============================================

export default buildEnhancedPrompt;