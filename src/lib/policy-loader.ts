// ============================================
// CM POLICY HUB - POLICY LOADER
// Carrega dados completos dos JSONs das policies
// para injeção no prompt do Gemini
// v2.0.0
// ============================================

import { PolicyId } from "./types";

// Import all policy JSON files statically (Next.js requirement)
// Using same pattern as keyword-loader.ts
import ansaPolicy from "@/data/policies/ansa.json";
import asePolicy from "@/data/policies/ase.json";
import bhPolicy from "@/data/policies/bh.json";
import chpcPolicy from "@/data/policies/chpc.json";
import cisPolicy from "@/data/policies/cis.json";
import csPolicy from "@/data/policies/cs.json";
import cseanPolicy from "@/data/policies/csean.json";
import doiPolicy from "@/data/policies/doi.json";
import dpPolicy from "@/data/policies/dp.json";
import fsdpPolicy from "@/data/policies/fsdp.json";
import hcPolicy from "@/data/policies/hc.json";
import hePolicy from "@/data/policies/he.json";
import hwPolicy from "@/data/policies/hw.json";
import oggPolicy from "@/data/policies/ogg.json";
import orgsPolicy from "@/data/policies/orgs.json";
import pslPolicy from "@/data/policies/psl.json";
import pvPolicy from "@/data/policies/pv.json";
import rpPolicy from "@/data/policies/rp.json";
import spamPolicy from "@/data/policies/spam.json";
import ssiedPolicy from "@/data/policies/ssied.json";
import sspxPolicy from "@/data/policies/sspx.json";
import taPolicy from "@/data/policies/ta.json";
import vgcPolicy from "@/data/policies/vgc.json";
import viPolicy from "@/data/policies/vi.json";
import waePolicy from "@/data/policies/wae.json";

// Note: If you get import errors, ensure tsconfig.json has:
// "resolveJsonModule": true
// "esModuleInterop": true

// ============================================
// TYPES
// ============================================

export interface PolicyData {
  id: string;
  name: string;
  shortName: string;
  description: string;
  categories?: CategoryData[];
  labelHierarchy?: LabelHierarchyItem[];
  exceptions?: ExceptionData[];
  glossary?: Record<string, string>;
  operationalGuidelines?: Record<string, string>;
  escalationCriteria?: EscalationCriteriaData;
  // Policy-specific fields
  tiers?: Record<string, TierData>;
  credibleIntentSuicide?: CISData;
  edSignals?: EDSignalsData;
  violenceSeverityLevels?: ViolenceSeverityData;
  threatSignals?: ThreatSignalsData;
  userCategories?: Record<string, UserCategoryData>;
  [key: string]: unknown;
}

export interface CategoryData {
  id: string;
  name: string;
  description?: string;
  severity: string;
  subcategories?: SubcategoryData[];
}

export interface SubcategoryData {
  id: string;
  name: string;
  description?: string;
  action?: string;
  conditions?: string[];
  examples?: string[];
}

export interface LabelHierarchyItem {
  id: string;
  label: string;
  path: string[];
  action: string;
  severity: string;
  hierarchyRank?: number;
  conditions?: string[];
}

export interface ExceptionData {
  id: string;
  name: string;
  description: string;
  appliesTo?: string[];
  action?: string;
}

export interface EscalationCriteriaData {
  escalate_when?: string[];
  do_not_escalate?: string[];
  criteria?: Record<string, string[]>;
}

export interface TierData {
  name: string;
  targets?: string | string[];
  attacks?: AttackData[];
  purposefulExposureRequired?: AttackData[];
  selfReportRequired?: AttackData[];
}

export interface AttackData {
  id: string;
  name: string;
  description?: string;
  definition?: string;
  types?: string[];
  examples?: string[];
  action?: string;
  note?: string;
  exception?: string;
}

export interface CISData {
  criteria: {
    explicitIntent: string[];
    specificCapability: string[];
    imminence: string[];
  };
  doNotEscalate: string[];
}

export interface EDSignalsData {
  promotionSignals?: string[];
  contextSignals?: string[];
  benignSignals?: string[];
}

export interface ViolenceSeverityData {
  high_severity?: {
    description: string;
    explicit_methods: string[];
    proxy_language?: string[];
  };
  mid_severity?: {
    description: string;
    explicit_methods: string[];
  };
  low_severity?: {
    description: string;
    explicit_methods: string[];
  };
}

export interface ThreatSignalsData {
  content_level_signals?: string[];
  military_language_excluded?: string[];
}

export interface UserCategoryData {
  definition: string;
  criteria?: string[];
  note?: string;
}

// ============================================
// POLICY MAP
// ============================================

const POLICY_MAP: Record<string, PolicyData> = {
  ansa: ansaPolicy as unknown as PolicyData,
  ase: asePolicy as unknown as PolicyData,
  bh: bhPolicy as unknown as PolicyData,
  chpc: chpcPolicy as unknown as PolicyData,
  cis: cisPolicy as unknown as PolicyData,
  cs: csPolicy as unknown as PolicyData,
  csean: cseanPolicy as unknown as PolicyData,
  doi: doiPolicy as unknown as PolicyData,
  dp: dpPolicy as unknown as PolicyData,
  fsdp: fsdpPolicy as unknown as PolicyData,
  hc: hcPolicy as unknown as PolicyData,
  he: hePolicy as unknown as PolicyData,
  hw: hwPolicy as unknown as PolicyData,
  ogg: oggPolicy as unknown as PolicyData,
  orgs: orgsPolicy as unknown as PolicyData,
  psl: pslPolicy as unknown as PolicyData,
  pv: pvPolicy as unknown as PolicyData,
  rp: rpPolicy as unknown as PolicyData,
  spam: spamPolicy as unknown as PolicyData,
  ssied: ssiedPolicy as unknown as PolicyData,
  sspx: sspxPolicy as unknown as PolicyData,
  ta: taPolicy as unknown as PolicyData,
  vgc: vgcPolicy as unknown as PolicyData,
  vi: viPolicy as unknown as PolicyData,
  wae: waePolicy as unknown as PolicyData,
};

// ============================================
// GET POLICY DATA
// ============================================

export function getPolicyData(policyId: PolicyId): PolicyData | null {
  return POLICY_MAP[policyId] || null;
}

// ============================================
// EXTRACT GLOSSARY FOR PROMPT
// ============================================

export function extractGlossaryForPrompt(policy: PolicyData): string {
  if (!policy.glossary || Object.keys(policy.glossary).length === 0) {
    return "";
  }

  let glossaryText = `### GLOSSARY - ${policy.shortName}\n`;
  glossaryText += `Use these EXACT definitions when analyzing content:\n\n`;

  for (const [term, definition] of Object.entries(policy.glossary)) {
    const formattedTerm = term.replace(/_/g, " ").toUpperCase();
    glossaryText += `**${formattedTerm}**: ${definition}\n\n`;
  }

  return glossaryText;
}

// ============================================
// EXTRACT LABEL HIERARCHY FOR PROMPT
// ============================================

export function extractLabelHierarchyForPrompt(policy: PolicyData): string {
  if (!policy.labelHierarchy || policy.labelHierarchy.length === 0) {
    return "";
  }

  let hierarchyText = `### LABEL HIERARCHY - ${policy.shortName}\n`;
  hierarchyText += `Use this hierarchy to determine the correct label (ordered by priority):\n\n`;

  // Sort by hierarchyRank if available
  const sorted = [...policy.labelHierarchy].sort((a, b) => 
    (a.hierarchyRank ?? 999) - (b.hierarchyRank ?? 999)
  );

  sorted.forEach((item, index) => {
    const path = item.path.join(" > ");
    const severity = item.severity.toUpperCase();
    const action = item.action.toUpperCase();
    
    hierarchyText += `${index + 1}. **${item.label}**\n`;
    hierarchyText += `   - Path: ${path}\n`;
    hierarchyText += `   - Action: ${action} | Severity: ${severity}\n`;
    
    if (item.conditions && item.conditions.length > 0) {
      hierarchyText += `   - Conditions: ${item.conditions.join("; ")}\n`;
    }
    hierarchyText += "\n";
  });

  return hierarchyText;
}

// ============================================
// EXTRACT EXCEPTIONS FOR PROMPT
// ============================================

export function extractExceptionsForPrompt(policy: PolicyData): string {
  if (!policy.exceptions || policy.exceptions.length === 0) {
    return "";
  }

  let exceptionsText = `### EXCEPTIONS (No Action Contexts) - ${policy.shortName}\n`;
  exceptionsText += `If ANY of these apply, the content may NOT violate:\n\n`;

  policy.exceptions.forEach((exc, index) => {
    exceptionsText += `${index + 1}. **${exc.name}**\n`;
    exceptionsText += `   ${exc.description}\n`;
    
    if (exc.appliesTo && exc.appliesTo.length > 0) {
      exceptionsText += `   Applies to: ${exc.appliesTo.join(", ")}\n`;
    }
    exceptionsText += "\n";
  });

  return exceptionsText;
}

// ============================================
// EXTRACT OPERATIONAL GUIDELINES FOR PROMPT
// ============================================

export function extractOperationalGuidelinesForPrompt(policy: PolicyData): string {
  if (!policy.operationalGuidelines || Object.keys(policy.operationalGuidelines).length === 0) {
    return "";
  }

  let guidelinesText = `### OPERATIONAL GUIDELINES - ${policy.shortName}\n`;
  guidelinesText += `Follow these rules when making decisions:\n\n`;

  for (const [key, value] of Object.entries(policy.operationalGuidelines)) {
    const formattedKey = key.replace(/_/g, " ").toUpperCase();
    guidelinesText += `**${formattedKey}**: ${value}\n\n`;
  }

  return guidelinesText;
}

// ============================================
// EXTRACT CATEGORIES FOR PROMPT
// ============================================

export function extractCategoriesForPrompt(policy: PolicyData): string {
  if (!policy.categories || policy.categories.length === 0) {
    return "";
  }

  let categoriesText = `### CATEGORIES & SUBCATEGORIES - ${policy.shortName}\n\n`;

  policy.categories.forEach(cat => {
    categoriesText += `**${cat.name}** (${cat.severity.toUpperCase()})\n`;
    
    if (cat.description) {
      categoriesText += `${cat.description}\n`;
    }

    if (cat.subcategories && cat.subcategories.length > 0) {
      cat.subcategories.forEach(sub => {
        const action = sub.action ? `[${sub.action.toUpperCase()}]` : "";
        categoriesText += `  - ${sub.name} ${action}\n`;
        
        if (sub.description) {
          categoriesText += `    ${sub.description}\n`;
        }
      });
    }
    categoriesText += "\n";
  });

  return categoriesText;
}

// ============================================
// EXTRACT ESCALATION CRITERIA FOR PROMPT
// ============================================

export function extractEscalationCriteriaForPrompt(policy: PolicyData): string {
  let escalationText = "";

  // Check for escalationCriteria object
  if (policy.escalationCriteria) {
    escalationText = `### ESCALATION CRITERIA - ${policy.shortName}\n\n`;
    
    if (policy.escalationCriteria.escalate_when) {
      escalationText += `**ESCALATE WHEN:**\n`;
      policy.escalationCriteria.escalate_when.forEach(condition => {
        escalationText += `- ${condition}\n`;
      });
      escalationText += "\n";
    }

    if (policy.escalationCriteria.do_not_escalate) {
      escalationText += `**DO NOT ESCALATE:**\n`;
      policy.escalationCriteria.do_not_escalate.forEach(condition => {
        escalationText += `- ${condition}\n`;
      });
      escalationText += "\n";
    }
  }

  // Check for CIS criteria (SSIED specific)
  if (policy.credibleIntentSuicide) {
    const cis = policy.credibleIntentSuicide;
    escalationText += `### CREDIBLE INTENT OF SUICIDE (CIS) CRITERIA\n`;
    escalationText += `**ALL THREE REQUIRED FOR ESCALATION:**\n\n`;

    escalationText += `1. **EXPLICIT INTENT** (one of):\n`;
    cis.criteria.explicitIntent.forEach(item => {
      escalationText += `   - ${item}\n`;
    });

    escalationText += `\n2. **SPECIFIC CAPABILITY** (one of):\n`;
    cis.criteria.specificCapability.forEach(item => {
      escalationText += `   - ${item}\n`;
    });

    escalationText += `\n3. **IMMINENCE** (one of):\n`;
    cis.criteria.imminence.forEach(item => {
      escalationText += `   - ${item}\n`;
    });

    escalationText += `\n**DO NOT ESCALATE CIS:**\n`;
    cis.doNotEscalate.forEach(item => {
      escalationText += `- ${item}\n`;
    });
    escalationText += "\n";
  }

  return escalationText;
}

// ============================================
// EXTRACT VIOLENCE SEVERITY LEVELS (VI specific)
// ============================================

export function extractViolenceSeverityForPrompt(policy: PolicyData): string {
  if (!policy.violenceSeverityLevels) {
    return "";
  }

  const levels = policy.violenceSeverityLevels;
  let severityText = `### VIOLENCE SEVERITY LEVELS\n\n`;

  if (levels.high_severity) {
    severityText += `**HIGH SEVERITY (LETHAL)**: ${levels.high_severity.description}\n`;
    severityText += `Methods: ${levels.high_severity.explicit_methods.join(", ")}\n`;
    if (levels.high_severity.proxy_language) {
      severityText += `Proxy language: ${levels.high_severity.proxy_language.join(", ")}\n`;
    }
    severityText += "\n";
  }

  if (levels.mid_severity) {
    severityText += `**MID SEVERITY (SERIOUS INJURY)**: ${levels.mid_severity.description}\n`;
    severityText += `Methods: ${levels.mid_severity.explicit_methods.join(", ")}\n\n`;
  }

  if (levels.low_severity) {
    severityText += `**LOW SEVERITY (MINOR HARM)**: ${levels.low_severity.description}\n`;
    severityText += `Methods: ${levels.low_severity.explicit_methods.join(", ")}\n\n`;
  }

  return severityText;
}

// ============================================
// EXTRACT BH TIERS (BH specific)
// ============================================

export function extractBHTiersForPrompt(policy: PolicyData): string {
  if (!policy.tiers) {
    return "";
  }

  let tiersText = `### BULLYING & HARASSMENT TIERS\n\n`;

  for (const [tierId, tier] of Object.entries(policy.tiers)) {
    tiersText += `**${tier.name}**\n`;
    
    if (tier.targets) {
      const targets = Array.isArray(tier.targets) ? tier.targets.join(", ") : tier.targets;
      tiersText += `Targets: ${targets}\n`;
    }

    if (tier.attacks && tier.attacks.length > 0) {
      tiersText += `Attacks:\n`;
      tier.attacks.forEach(attack => {
        tiersText += `  - ${attack.name}`;
        if (attack.action) tiersText += ` [${attack.action.toUpperCase()}]`;
        tiersText += "\n";
        if (attack.definition) {
          tiersText += `    Definition: ${attack.definition}\n`;
        }
      });
    }

    if (tier.purposefulExposureRequired && tier.purposefulExposureRequired.length > 0) {
      tiersText += `Purposeful Exposure Required:\n`;
      tier.purposefulExposureRequired.forEach(attack => {
        tiersText += `  - ${attack.name}\n`;
      });
    }

    if (tier.selfReportRequired && tier.selfReportRequired.length > 0) {
      tiersText += `Self-Report Required:\n`;
      tier.selfReportRequired.forEach(attack => {
        tiersText += `  - ${attack.name}\n`;
      });
    }

    tiersText += "\n";
  }

  return tiersText;
}

// ============================================
// EXTRACT ED SIGNALS (SSIED specific)
// ============================================

export function extractEDSignalsForPrompt(policy: PolicyData): string {
  if (!policy.edSignals) {
    return "";
  }

  const signals = policy.edSignals;
  let signalsText = `### EATING DISORDER SIGNAL CLASSIFICATION\n\n`;

  if (signals.promotionSignals) {
    signalsText += `**PROMOTION SIGNALS** (CRITICAL - always violating):\n`;
    signalsText += `${signals.promotionSignals.join(", ")}\n\n`;
  }

  if (signals.contextSignals) {
    signalsText += `**CONTEXT SIGNALS** (need additional indicators):\n`;
    signalsText += `${signals.contextSignals.join(", ")}\n\n`;
  }

  if (signals.benignSignals) {
    signalsText += `**BENIGN SIGNALS** (usually No Action):\n`;
    signalsText += `${signals.benignSignals.join(", ")}\n\n`;
  }

  return signalsText;
}

// ============================================
// EXTRACT USER CATEGORIES (BH specific)
// ============================================

export function extractUserCategoriesForPrompt(policy: PolicyData): string {
  if (!policy.userCategories) {
    return "";
  }

  let categoriesText = `### USER CATEGORIES\n\n`;

  for (const [categoryId, category] of Object.entries(policy.userCategories)) {
    const formattedId = categoryId.replace(/([A-Z])/g, " $1").trim().toUpperCase();
    categoriesText += `**${formattedId}**\n`;
    categoriesText += `Definition: ${category.definition}\n`;
    
    if (category.criteria && category.criteria.length > 0) {
      categoriesText += `Criteria:\n`;
      category.criteria.forEach(c => {
        categoriesText += `  - ${c}\n`;
      });
    }
    
    if (category.note) {
      categoriesText += `Note: ${category.note}\n`;
    }
    categoriesText += "\n";
  }

  return categoriesText;
}

// ============================================
// BUILD COMPLETE POLICY CONTEXT
// ============================================

export function buildCompletePolicyContext(policyId: PolicyId): string {
  const policy = getPolicyData(policyId);
  
  if (!policy) {
    return `No policy data found for ${policyId}.\n`;
  }

  let context = `\n## COMPLETE POLICY DATA: ${policy.name} (${policy.shortName})\n\n`;
  context += `${policy.description}\n\n`;

  // Add all sections
  context += extractGlossaryForPrompt(policy);
  context += extractCategoriesForPrompt(policy);
  context += extractLabelHierarchyForPrompt(policy);
  context += extractExceptionsForPrompt(policy);
  context += extractOperationalGuidelinesForPrompt(policy);
  context += extractEscalationCriteriaForPrompt(policy);

  // Policy-specific extractions
  if (policyId === "vi") {
    context += extractViolenceSeverityForPrompt(policy);
  }

  if (policyId === "bh") {
    context += extractBHTiersForPrompt(policy);
    context += extractUserCategoriesForPrompt(policy);
  }

  if (policyId === "ssied" || policyId === "cis") {
    context += extractEDSignalsForPrompt(policy);
  }

  return context;
}

// ============================================
// GET ALL POLICIES SUMMARY
// ============================================

export function getAllPoliciesSummary(): string {
  let summary = "## AVAILABLE POLICIES\n\n";

  for (const [id, policy] of Object.entries(POLICY_MAP)) {
    summary += `- **${policy.shortName}**: ${policy.name}\n`;
  }

  return summary;
}

// ============================================
// EXPORT
// ============================================

export default getPolicyData;