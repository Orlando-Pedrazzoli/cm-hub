// ============================================
// CM POLICY HUB - ENHANCED PROMPT BUILDER
// Sistema de geração de prompts dinâmicos para Gemini AI
// Com context injection baseado em pre-analysis
// v1.0.0
// ============================================

import { KeywordMatch, PolicyId, DetectedExceptions, VIChecks } from "./types";

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
// POLICY-SPECIFIC GLOSSARIES (from JSON files)
// ============================================

const VI_GLOSSARY = {
  high_severity_violence: `Violence likely to be LETHAL. Includes: stab, shoot, kill, hang, poison, stone, hit+weapon, choke, dismember, whip/cane, burn, drown, FGM, run over, strangle, suffocate, decapitate, lynch, massacre. Proxy language: "CPF cancelado", "send to morgue", "won't breathe again", "JFK him".`,
  mid_severity_violence: `Violence likely to cause SERIOUS INJURY (punch equivalent or higher). Includes: punch, kick, gag, hit, beat, headbutt, bite, stomp.`,
  low_severity_violence: `Violence likely to cause MINOR HARM (lower than punch). Includes: pinch, push, shove, drag, slap, spit, trip, pull/yank hair.`,
  credibility_signals: `Makes threat credible: bounty/payment demand, spelled-out address, OR 2+ of: location, specific timing, method.`,
  target: `Person, animal, object, or place that is aim of attack. Valid: living persons, deceased (if violence victim or PC-based), groups based on PC, places (city or smaller).`,
  high_risk_person: `Heads of state, candidates, ambassadors, law enforcement, witnesses, journalists, activists, homeless, healthcare workers, Zionists, foreigners.`,
  high_risk_location: `Places of worship, educational facilities, workplaces of HRP, election sites, locations affiliated with PC groups.`,
};

const SSIED_GLOSSARY = {
  cis_criteria: `Credible Intent of Suicide requires ALL THREE: (1) Explicit Intent - statement of intent, attempt in progress, or suicide note; (2) Specific Capability - method/means mentioned or depicted; (3) Imminence - plans <24 hours.`,
  ssi_context: `Determined by visual, written, or verbal indicators: cuts on inner wrist, tied noose, statements like 'kms', ED hashtags.`,
  ed_context: `Established by ED signals (thinspo, proana), focused body part imagery, or promotional signals with weight loss content.`,
  graphic_self_injury: `Unhealed cuts as primary subject, skin not covering wound, blood/scabs visible, active self-injury, means depicted.`,
  ed_promotion_signals: `thinspo, bonespo, meanspo, proana, promia, edtips, anabuddy, anagoals - these are CRITICAL violations.`,
  recovery_context: `Clear statement that user has or is healing from past attempt/injury/disorder - this is an EXCEPTION.`,
  extreme_weight_loss: `<1200 cal/day, fasting 24+ hours, rapid loss >2 lbs/week, calling for children <13 to engage in unsupervised weight loss.`,
};

const BH_GLOSSARY = {
  public_figure: `Someone with established public credentials: heads of state, members of executive/legislative branches, candidates (up to 30 days after election), 1M+ followers, mentioned in 5+ news articles in 2 years.`,
  limited_scope_pf: `Public figure whose fame is limited to activism, journalism, or involuntary means only.`,
  purposeful_exposure: `Poster tags the public figure OR posts comment directly on their post/page.`,
  name_face_match: `3 features match: 3 primary OR 2 primary + 1 secondary. Primary: nose, lips, hairline, mole, ears, jawline, eye shape, forehead, face-cut, eyebrows (men), teeth.`,
  tier1_attacks: `Universal: unwanted contact, calls for SSI, attacks based on sexual assault, statements of sexual intent, severe sexualized commentary, doxxing threats.`,
  tier2_attacks: `For minors/private/LSPF: claims about sexual activity, sexualizing adults, dehumanizing comparisons.`,
  tier3_attacks: `For private (self-report): targeted cursing, romantic/gender claims, exclusion, negative character.`,
  tier4_attacks: `For private minors only: criminal allegations, physical bullying videos, female-gendered cursing.`,
};

// ============================================
// EXCEPTION DESCRIPTIONS
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
// BUILD ENHANCED PROMPT
// ============================================

export function buildEnhancedPrompt(context: PreAnalysisContext): string {
  const { text, detectedKeywords, candidatePolicies, primaryCandidate, exceptions, viChecks, ssiedChecks, bhChecks, language } = context;

  // Start with base instruction
  let prompt = `You are an expert content moderator for Meta platforms. Analyze the following text and determine the correct moderation action.

## YOUR TASK
Follow the decision tree EXACTLY. Do not skip steps. Consider ALL context.

## LANGUAGE
The content appears to be in ${language === "pt" ? "Portuguese" : language === "en" ? "English" : "multiple languages"}.

`;

  // Add pre-analysis results
  prompt += buildPreAnalysisSection(context);

  // Add policy-specific section based on candidate
  if (primaryCandidate) {
    prompt += buildPolicySpecificSection(primaryCandidate, context);
  }

  // Add decision tree
  prompt += buildDecisionTreeSection(primaryCandidate);

  // Add escalation criteria
  prompt += buildEscalationSection(primaryCandidate, context);

  // Add the text to analyze
  prompt += `
## TEXT TO ANALYZE
"""
${text}
"""

## RESPONSE FORMAT
Respond with ONLY valid JSON (no markdown, no explanation):

{
  "action": "no_action" | "escalate" | "label",
  "decisionPath": ["Action", "Category", "Subcategory", "..."],
  "terminalNodeId": "unique_node_id",
  "fullLabel": "Action > Category > Subcategory > ...",
  "confidence": 0-100,
  "reasoning": "2-3 sentences explaining your decision, referencing specific policy criteria.",
  "shouldEscalate": true | false,
  "escalationReason": "Only if escalating - explain which criteria were met"
}

## CRITICAL RULES
1. If CIS criteria are met (Intent + Capability + Imminence <24h), ALWAYS escalate
2. If exception applies, action is "no_action" UNLESS severity is critical
3. Consider the PRE-ANALYSIS keywords and checks - they are accurate
4. When unsure between severities, default to HIGHER severity
5. When unsure if target is valid, default to VALID target
6. Proxy language (like "CPF cancelado") counts as high-severity violence
`;

  return prompt;
}

// ============================================
// BUILD PRE-ANALYSIS SECTION
// ============================================

function buildPreAnalysisSection(context: PreAnalysisContext): string {
  const { detectedKeywords, exceptions, viChecks, ssiedChecks, bhChecks } = context;

  let section = `## PRE-ANALYSIS RESULTS (Already verified - use this information)

`;

  // Keywords found
  if (detectedKeywords.length > 0) {
    section += `### Detected Keywords (${detectedKeywords.length} found)
`;
    const criticalKw = detectedKeywords.filter(k => k.severity === "critical");
    const highKw = detectedKeywords.filter(k => k.severity === "high");
    const otherKw = detectedKeywords.filter(k => k.severity !== "critical" && k.severity !== "high");

    if (criticalKw.length > 0) {
      section += `⚠️ CRITICAL: ${criticalKw.map(k => `"${k.term}" (${k.category})`).join(", ")}\n`;
    }
    if (highKw.length > 0) {
      section += `🔴 HIGH: ${highKw.map(k => `"${k.term}" (${k.category})`).join(", ")}\n`;
    }
    if (otherKw.length > 0) {
      section += `🟡 OTHER: ${otherKw.map(k => `"${k.term}" (${k.category})`).join(", ")}\n`;
    }
    section += "\n";
  } else {
    section += `### Detected Keywords: None found\n\n`;
  }

  // Exceptions detected
  if (exceptions.detected.length > 0) {
    section += `### Potential Exceptions Detected
`;
    exceptions.detected.forEach(exc => {
      const desc = EXCEPTION_DESCRIPTIONS[exc.toLowerCase().replace(/[^a-z]/g, "_")] || exc;
      section += `- ${exc}: ${desc}\n`;
    });
    section += "\n";
  }

  // VI-specific checks
  if (viChecks) {
    section += `### Violence Escalation Check
| Criterion | Status |
|-----------|--------|
| Target Identified | ${viChecks.hasTarget ? "✅ YES" : "❌ NO"} |
| Intent/Statement | ${viChecks.hasIntent ? "✅ YES" : "❌ NO"} |
| Method Specified | ${viChecks.hasMethod ? "✅ YES" : "❌ NO"} |
| Timing (<24h) | ${viChecks.hasTiming ? "✅ YES" : "❌ NO"} |
| Armament Present | ${viChecks.hasArmament ? "✅ YES" : "❌ NO"} |
| Location (HRL) | ${viChecks.hasLocation ? "✅ YES" : "❌ NO"} |

**Credible Threat Formula**: Target + Intent + Method + (Timing OR Armament OR Location)
**Result**: ${viChecks.isCredibleThreat ? "⚠️ CREDIBLE THREAT - CONSIDER ESCALATION" : "Not credible"}

`;
  }

  // SSIED-specific checks
  if (ssiedChecks) {
    section += `### SSIED / CIS Check
| Criterion | Status |
|-----------|--------|
| Suicide Content | ${ssiedChecks.hasSuicideContent ? "✅ YES" : "❌ NO"} |
| Self-Injury Content | ${ssiedChecks.hasSelfInjuryContent ? "✅ YES" : "❌ NO"} |
| ED Content | ${ssiedChecks.hasEDContent ? "✅ YES" : "❌ NO"} |
| CIS: Explicit Intent | ${ssiedChecks.cisHasExplicitIntent ? "✅ YES" : "❌ NO"} |
| CIS: Capability/Method | ${ssiedChecks.cisHasCapability ? "✅ YES" : "❌ NO"} |
| CIS: Imminence (<24h) | ${ssiedChecks.cisHasImminence ? "✅ YES" : "❌ NO"} |
| Promotion Signals | ${ssiedChecks.hasPromotionSignals ? "✅ YES" : "❌ NO"} |
| Viral Event Reference | ${ssiedChecks.hasViralEvent ? "✅ YES" : "❌ NO"} |

**CIS Formula**: Explicit Intent + Capability + Imminence (all 3 required)
**CIS Result**: ${ssiedChecks.isCIS ? "⚠️ CIS DETECTED - MUST ESCALATE" : "Not CIS"}
**ED Signal Type**: ${ssiedChecks.edSignalType}

`;
  }

  // BH-specific checks
  if (bhChecks) {
    section += `### Bullying & Harassment Check
| Criterion | Status |
|-----------|--------|
| Target Identified | ${bhChecks.hasTarget ? "✅ YES" : "❌ NO"} |
| Target Type | ${bhChecks.targetType} |
| Purposeful Exposure | ${bhChecks.hasPurposefulExposure ? "✅ YES" : "❌ NO"} |
| Attack Type | ${bhChecks.attackType || "Unknown"} |
| Applicable Tier | ${bhChecks.tier || "Unknown"} |

`;
  }

  return section;
}

// ============================================
// BUILD POLICY-SPECIFIC SECTION
// ============================================

function buildPolicySpecificSection(policy: PolicyId, context: PreAnalysisContext): string {
  let section = `## POLICY-SPECIFIC GUIDANCE: ${policy.toUpperCase()}

`;

  switch (policy) {
    case "vi":
      section += `### Violence and Incitement (VI) - Key Definitions

${Object.entries(VI_GLOSSARY).map(([key, val]) => `**${key.replace(/_/g, " ").toUpperCase()}**: ${val}`).join("\n\n")}

### VI Severity Classification
- **HIGH SEVERITY (HSV)**: Lethal violence - ALWAYS label unless exception applies
- **MID SEVERITY (MSV)**: Serious injury - Label if credible or against private individuals
- **LOW SEVERITY (LSV)**: Minor harm - Label only against children, private individuals with name/face match, or PC groups

### VI Label Hierarchy (use in order)
1. Escalate > Threatening > Other (if credible threat formula met)
2. Label > VI > Election Violence
3. Label > VI > High-severity violence > Threats/Admissions/Calls for death
4. Label > VI > Mid-severity violence > Threats/Admissions
5. Label > VI > Low-severity violence
6. Label > VI > Bringing weapons to HRL
7. Label > VI > Other > Instructions (weapons/explosives)

`;
      break;

    case "ssied":
    case "cis":
      section += `### Suicide, Self-Injury & Eating Disorders (SSIED) - Key Definitions

${Object.entries(SSIED_GLOSSARY).map(([key, val]) => `**${key.replace(/_/g, " ").toUpperCase()}**: ${val}`).join("\n\n")}

### SSIED Label Hierarchy (use in order)
**SUICIDE:**
1. Escalate > Suicide > Graphic/Promotion (if CIS criteria met)
2. Escalate > Suicide > Admission (if CIS criteria met)
3. Label > SSIED > Suicide > Promotion > Encourage/coordinate/instruct
4. Label > SSIED > Suicide > Promotion > Speaks Positively
5. Label > SSIED > Suicide > Graphic Content
6. Label > SSIED > Suicide > Mocking
7. Label > SSIED > Suicide > Admission
8. Label > SSIED > Suicide > Reference or Narratives

**SELF-INJURY:**
1. Label > SSIED > Self-Injury > Promotion
2. Label > SSIED > Self-Injury > Graphic Content
3. Label > SSIED > Self-Injury > Mocking
4. Label > SSIED > Self-Injury > Admission
5. Label > SSIED > Self-Injury > Recovery with Imagery

**EATING DISORDERS:**
1. Label > SSIED > Eating Disorder > Yes > Promotion (if ED context)
2. Label > SSIED > Eating Disorder > Yes > Graphic Content
3. Label > SSIED > Eating Disorder > Yes > Mocking
4. Label > SSIED > Eating Disorder > Yes > Admission
5. Label > SSIED > Eating Disorder > Yes > Recovery
6. Label > SSIED > Eating Disorder > No > Promotion (extreme weight loss)
7. Label > SSIED > Eating Disorder > No > Admission

### ED Signal Classification
- **PROMOTION SIGNALS** (CRITICAL - always violate): thinspo, bonespo, meanspo, proana, promia, edtips, anabuddy
- **CONTEXT SIGNALS** (need additional indicators): anorexia, bulimia, binge, purge, thigh gap, goal weight
- **BENIGN SIGNALS** (usually No Action): #goals, fitspo, diet, flat stomach, recovery hashtags

`;
      break;

    case "bh":
      section += `### Bullying and Harassment (BH) - Key Definitions

${Object.entries(BH_GLOSSARY).map(([key, val]) => `**${key.replace(/_/g, " ").toUpperCase()}**: ${val}`).join("\n\n")}

### BH Tier System
**TIER 1** (Universal - applies to ALL users):
- Calls for death, SSI, or medical condition
- Sexualized harassment
- Attacks based on sexual assault experience
- Statements of intent for sexual activity
- Doxxing threats

**TIER 2** (Minors, Private Adults, Limited Scope PF):
- Claims about sexual activity
- Sexualizing another adult
- Dehumanizing comparisons (animals, objects)
- Manipulated imagery highlighting features

**TIER 3** (Private Individuals - requires self-report for some):
- Targeted cursing
- Romantic/gender identity claims
- Exclusion statements
- Negative character claims

**TIER 4** (Private Minors ONLY):
- Criminal allegations
- Physical bullying videos
- Female-gendered cursing

### BH Label Hierarchy
1. Label > BH > Sexualized Harassment
2. Label > BH > Calls for death, SSI, or medical condition
3. Label > BH > Claims about sexual activity
4. Label > BH > Violent Tragedies
5. Label > BH > Negative comparison to animals/objects
6. Label > BH > Negative physical description
7. Label > BH > Targeted cursing
8. Label > BH > Negative character/contempt/exclusion
9. Label > BH > Physical bullying

`;
      break;

    default:
      section += `No specific guidance loaded for ${policy}. Use general decision tree.\n\n`;
  }

  return section;
}

// ============================================
// BUILD DECISION TREE SECTION
// ============================================

function buildDecisionTreeSection(primaryCandidate: PolicyId | null): string {
  let section = `## DECISION TREE

### PHASE 1: MAIN ACTION
Choose ONE:
1. **No Action** - Content does not violate any policy
2. **Escalate** - Content requires immediate escalation (CIS, CSAM, credible threats)
3. **Label** - Content violates a policy

---

### IF "No Action" - Choose the specific reason:
- No - No Action, Benign (content is harmless)
- No Action, Implicit Sexualization of Children (borderline but not explicit)
- No - DOI Social & Political Discourse Context (political speech exception)
- No - No Action, Missing Self-Reporting (BH requires self-report)

---

### IF "Escalate" - Select escalation type:

**Child Exploitation:**
- Sextortion | CSAM | CSAM Links | Soliciting Imagery | IIC | Imminent Threat | Non-Sexual Abuse

**Human Trafficking:**
- Imminent Threat | Minor Sex Trafficking | Sex Trafficking | Organ Trafficking | Other

**Threatening (VI):**
- Dangerous Individuals/Orgs | Other | Potentially Credible Rape

**Suicide (SSIED):**
- Graphic/Promotion (CIS) | Admission (CIS)

---

### IF "Label" - Navigate to correct category:

`;

  // Add simplified label tree based on candidate
  if (primaryCandidate === "vi" || !primaryCandidate) {
    section += `**Violence and Incitement (VI):**
- Election Violence
- High-severity violence > Threats | Admissions | Calls for death
- Mid-severity violence > Threats | Admissions
- Low-severity violence
- Bringing weapons to HRL or THRL
- Other Violence > Services | Weapons instructions | Explosive instructions | GBV glorification

`;
  }

  if (primaryCandidate === "ssied" || primaryCandidate === "cis" || !primaryCandidate) {
    section += `**SSIED (Suicide, Self-Injury, Eating Disorders):**
- Suicide > Promotion | Graphic Content | Mocking | Admission | Reference/Narratives
- Self-Injury > Promotion | Graphic Content | Mocking | Admission | Recovery
- Eating Disorder > Yes/No > Promotion | Graphic | Mocking | Admission | Recovery

`;
  }

  if (primaryCandidate === "bh" || !primaryCandidate) {
    section += `**Bullying and Harassment (BH):**
- Sexualized Harassment
- Calls for death, SSI, or medical condition
- Claims about sexual activity, romantic involvement, gender identity
- Violent Tragedies
- Negative comparison to animals/objects
- Negative physical description
- Targeted cursing
- Negative character/contempt/exclusion
- Physical bullying
- Other

`;
  }

  if (primaryCandidate === "hc" || !primaryCandidate) {
    section += `**Hateful Conduct (HC):**
- T1: Dehumanizing comparisons | Harm statements | Harmful stereotypes | Mocking hate crimes
- T2: Character insults | Mental insults | Other insults | Disgust | Cursing | Exclusion
- Slur (with or without special context)

`;
  }

  return section;
}

// ============================================
// BUILD ESCALATION SECTION
// ============================================

function buildEscalationSection(primaryCandidate: PolicyId | null, context: PreAnalysisContext): string {
  let section = `## ESCALATION CRITERIA

### ALWAYS ESCALATE FOR:
1. **CSAM** - Any child sexual abuse material
2. **Credible Violence Threats** - Target + Intent + Method + (Timing OR Armament OR Location)
3. **Sextortion** - Sexual extortion involving minors
4. **CIS (Credible Intent of Suicide)** - Explicit intent + Capability + Imminence (<24h)

### DO NOT ESCALATE FOR:
- Content >1 month old
- Calls for action against adult public figures (even high-risk)
- Threats with physically impossible methods ("when pigs fly")
- Kidnapping without additional HSV + escalation criteria
- Fictional content without captions meeting criteria

`;

  // Add specific criteria based on checks
  if (context.viChecks?.isCredibleThreat) {
    section += `### ⚠️ CREDIBLE THREAT DETECTED
Based on pre-analysis, this content MAY meet escalation criteria for violence.
Verify: Target (${context.viChecks.hasTarget ? "✓" : "?"}) + Intent (${context.viChecks.hasIntent ? "✓" : "?"}) + Method (${context.viChecks.hasMethod ? "✓" : "?"}) + (Timing/Armament/Location)

`;
  }

  if (context.ssiedChecks?.isCIS) {
    section += `### ⚠️ CIS DETECTED
Based on pre-analysis, this content MEETS CIS escalation criteria.
- Explicit Intent: ✓
- Capability/Method: ✓
- Imminence (<24h): ✓
**YOU MUST ESCALATE THIS CONTENT**

`;
  }

  return section;
}

// ============================================
// EXPORT
// ============================================

export default buildEnhancedPrompt;