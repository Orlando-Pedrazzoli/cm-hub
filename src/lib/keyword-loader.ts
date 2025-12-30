// ============================================
// CM POLICY HUB - KEYWORD LOADER v2.0
// MELHORIAS:
// 1. Suporte completo a ALIASES
// 2. Uso de EXCLUDEDTERMS para evitar falsos positivos
// 3. Uso de CAVEATS para contexto
// 4. Detecção de THREAT STATEMENTS patterns
// 5. Cache otimizado
// ============================================

import { PolicyId, Severity, KeywordMatch } from "./types";

// Import all keyword files statically (Next.js requirement)
import aseKeywords from "@/data/policies/keywords/ase-keywords.json";
import ansaKeywords from "@/data/policies/keywords/ansa-keywords.json";
import bhKeywords from "@/data/policies/keywords/bh-keywords.json";
import chpcKeywords from "@/data/policies/keywords/chpc-keywords.json";
import cisKeywords from "@/data/policies/keywords/cis-keywords.json";
import csKeywords from "@/data/policies/keywords/cs-keywords.json";
import cseanKeywords from "@/data/policies/keywords/csean-keywords.json";
import doiKeywords from "@/data/policies/keywords/doi-keywords.json";
import dpKeywords from "@/data/policies/keywords/dp-keywords.json";
import fsdpKeywords from "@/data/policies/keywords/fsdp-keywords.json";
import hcKeywords from "@/data/policies/keywords/hc-keywords.json";
import heKeywords from "@/data/policies/keywords/he-keywords.json";
import hwKeywords from "@/data/policies/keywords/hw-keywords.json";
import oggKeywords from "@/data/policies/keywords/ogg-keywords.json";
import orgsKeywords from "@/data/policies/keywords/orgs-keywords.json";
import pslKeywords from "@/data/policies/keywords/psl-keywords.json";
import pvKeywords from "@/data/policies/keywords/pv-keywords.json";
import rpKeywords from "@/data/policies/keywords/rp-keywords.json";
import spamKeywords from "@/data/policies/keywords/spam-keywords.json";
import ssiedKeywords from "@/data/policies/keywords/ssied-keywords.json";
import sspxKeywords from "@/data/policies/keywords/sspx-keywords.json";
import taKeywords from "@/data/policies/keywords/ta-keywords.json";
import vgcKeywords from "@/data/policies/keywords/vgc-keywords.json";
import viKeywords from "@/data/policies/keywords/vi-keywords.json";
import waeKeywords from "@/data/policies/keywords/wae-keywords.json";

// ============================================
// TYPES
// ============================================

export interface LoadedKeyword {
  term: string;
  originalTerm: string; // Termo principal (para agrupar aliases)
  policy: PolicyId;
  category: string;
  subcategory?: string;
  severity: Severity;
  language?: "pt" | "en" | "es" | "multi";
  requiresContext?: boolean;
  caveats?: string; // NOVO: Notas de contexto
  isAlias?: boolean; // NOVO: Se é um alias
}

export interface ExcludedTerm {
  term: string;
  reason: string;
  language?: string;
}

export interface ThreatPattern {
  pattern: string;
  aliases?: string[];
  type: string;
  language: string;
}

// ============================================
// CACHE STRUCTURES
// ============================================

let cachedKeywords: LoadedKeyword[] | null = null;
let cachedExcludedTerms: ExcludedTerm[] | null = null;
let cachedThreatPatterns: ThreatPattern[] | null = null;

// ============================================
// SEVERITY MAPPING
// ============================================

function determineSeverityFromData(
  explicitSeverity?: string,
  category?: string
): Severity {
  // Se tem severity explícita no JSON, usar essa
  if (explicitSeverity) {
    const normalized = explicitSeverity.toLowerCase();
    if (normalized === "critical") return "critical";
    if (normalized === "high") return "high";
    if (normalized === "mid" || normalized === "medium") return "mid";
    if (normalized === "low") return "low";
    if (normalized === "info") return "info";
  }

  // Fallback: determinar por categoria
  const categoryLower = (category || "").toLowerCase();

  const CRITICAL_INDICATORS = [
    "lethal", "hsv", "high_severity", "explicit_lethal", "proxy_lethal",
    "csam", "csean", "sextortion", "trafficking", "suicide", "suicídio",
    "death", "morte", "kill", "matar", "rape", "exploitation",
    "terrorist", "tier1", "tier_1", "calls_for_death"
  ];

  const HIGH_INDICATORS = [
    "threat", "ameaça", "solicitation", "admission", "incitement",
    "promotion", "graphic", "explicit", "weapon", "arma", "drug",
    "msv", "mid_severity", "harassment", "hate", "slur", "tier2",
    "ncii", "violence", "intent", "armament", "high_risk"
  ];

  const MID_INDICATORS = [
    "indicator", "signal", "context", "reference", "method",
    "lsv", "low_severity", "insult", "tier3", "tier4", "explicit_serious",
    "explicit_minor"
  ];

  for (const indicator of CRITICAL_INDICATORS) {
    if (categoryLower.includes(indicator)) return "critical";
  }

  for (const indicator of HIGH_INDICATORS) {
    if (categoryLower.includes(indicator)) return "high";
  }

  for (const indicator of MID_INDICATORS) {
    if (categoryLower.includes(indicator)) return "mid";
  }

  return "mid"; // Default
}

// ============================================
// PARSE STRUCTURED KEYWORD ENTRY
// Suporta a estrutura com term, aliases, severity, etc.
// ============================================

interface StructuredKeywordEntry {
  term: string;
  aliases?: string[];
  severity?: string;
  category?: string;
  language?: string;
  caveats?: string;
  notes?: string;
  type?: string;
}

function parseStructuredEntry(
  entry: StructuredKeywordEntry,
  policy: PolicyId,
  categoryName: string
): LoadedKeyword[] {
  const keywords: LoadedKeyword[] = [];

  const severity = determineSeverityFromData(
    entry.severity,
    entry.category || categoryName
  );

  const caveats = entry.caveats || entry.notes;

  // Adicionar termo principal
  keywords.push({
    term: entry.term.toLowerCase(),
    originalTerm: entry.term.toLowerCase(),
    policy,
    category: entry.category || categoryName,
    severity,
    language: (entry.language as "pt" | "en" | "es" | "multi") || "multi",
    caveats,
    isAlias: false,
  });

  // CRÍTICO: Adicionar todos os aliases como keywords separados
  if (entry.aliases && Array.isArray(entry.aliases)) {
    for (const alias of entry.aliases) {
      if (typeof alias === "string" && alias.length > 1) {
        keywords.push({
          term: alias.toLowerCase(),
          originalTerm: entry.term.toLowerCase(),
          policy,
          category: entry.category || categoryName,
          severity,
          language: (entry.language as "pt" | "en" | "es" | "multi") || "multi",
          caveats,
          isAlias: true,
        });
      }
    }
  }

  return keywords;
}

// ============================================
// PARSE EXCLUDED TERMS
// ============================================

function parseExcludedTerms(data: Record<string, unknown>): ExcludedTerm[] {
  const excluded: ExcludedTerm[] = [];

  // Procurar por "excludedTerms" em qualquer nível
  const findExcluded = (obj: unknown): void => {
    if (!obj || typeof obj !== "object") return;

    if (Array.isArray(obj)) {
      obj.forEach((item) => {
        if (
          typeof item === "object" &&
          item !== null &&
          "term" in item &&
          "reason" in item
        ) {
          excluded.push({
            term: (item as { term: string }).term.toLowerCase(),
            reason: (item as { reason: string }).reason,
            language: (item as { language?: string }).language,
          });
        }
      });
    } else {
      const record = obj as Record<string, unknown>;
      if (record.excludedTerms) {
        findExcluded(record.excludedTerms);
      }
      // Recursively search other properties
      for (const value of Object.values(record)) {
        if (typeof value === "object" && value !== null) {
          findExcluded(value);
        }
      }
    }
  };

  findExcluded(data);
  return excluded;
}

// ============================================
// PARSE THREAT PATTERNS
// ============================================

function parseThreatPatterns(data: Record<string, unknown>): ThreatPattern[] {
  const patterns: ThreatPattern[] = [];

  const findPatterns = (obj: unknown): void => {
    if (!obj || typeof obj !== "object") return;

    if (Array.isArray(obj)) {
      obj.forEach((item) => {
        if (
          typeof item === "object" &&
          item !== null &&
          "pattern" in item &&
          "type" in item
        ) {
          const entry = item as {
            pattern: string;
            aliases?: string[];
            type: string;
            language: string;
          };
          patterns.push({
            pattern: entry.pattern.toLowerCase(),
            aliases: entry.aliases?.map((a) => a.toLowerCase()),
            type: entry.type,
            language: entry.language || "multi",
          });
        }
      });
    } else {
      const record = obj as Record<string, unknown>;
      if (record.threatStatements) {
        findPatterns(record.threatStatements);
      }
      for (const value of Object.values(record)) {
        if (typeof value === "object" && value !== null) {
          findPatterns(value);
        }
      }
    }
  };

  findPatterns(data);
  return patterns;
}

// ============================================
// PARSE KEYWORD FILE (Enhanced)
// ============================================

function parseKeywordFile(
  data: Record<string, unknown>,
  policyId: PolicyId
): LoadedKeyword[] {
  const keywords: LoadedKeyword[] = [];

  const SKIP_KEYS = [
    "policy",
    "policyId",
    "policyName",
    "shortName",
    "version",
    "lastUpdated",
    "note",
    "notes",
    "description",
    "excludedTerms",
    "notHighRiskPersons", // Não são keywords, são exceções
  ];

  for (const [categoryKey, categoryValue] of Object.entries(data)) {
    if (SKIP_KEYS.includes(categoryKey)) continue;

    // Handle arrays of structured entries
    if (Array.isArray(categoryValue)) {
      categoryValue.forEach((item) => {
        if (typeof item === "object" && item !== null && "term" in item) {
          // Structured entry with term, aliases, etc.
          const parsed = parseStructuredEntry(
            item as StructuredKeywordEntry,
            policyId,
            categoryKey
          );
          keywords.push(...parsed);
        } else if (typeof item === "string" && item.length > 1) {
          // Simple string array
          keywords.push({
            term: item.toLowerCase(),
            originalTerm: item.toLowerCase(),
            policy: policyId,
            category: categoryKey,
            severity: determineSeverityFromData(undefined, categoryKey),
            language: "multi",
            isAlias: false,
          });
        }
      });
    } else if (typeof categoryValue === "object" && categoryValue !== null) {
      // Nested object (e.g., language-specific or subcategories)
      const nestedObj = categoryValue as Record<string, unknown>;

      // Check if it's a language object (has en, pt, es keys)
      if (nestedObj.en || nestedObj.pt || nestedObj.es) {
        for (const [lang, terms] of Object.entries(nestedObj)) {
          if (Array.isArray(terms)) {
            terms.forEach((term) => {
              if (typeof term === "string" && term.length > 1) {
                keywords.push({
                  term: term.toLowerCase(),
                  originalTerm: term.toLowerCase(),
                  policy: policyId,
                  category: categoryKey,
                  severity: determineSeverityFromData(undefined, categoryKey),
                  language: lang as "pt" | "en" | "es",
                  isAlias: false,
                });
              } else if (typeof term === "object" && term !== null && "term" in term) {
                const parsed = parseStructuredEntry(
                  term as StructuredKeywordEntry,
                  policyId,
                  categoryKey
                );
                keywords.push(...parsed);
              }
            });
          }
        }
      } else {
        // Recursively process nested categories
        for (const [subKey, subValue] of Object.entries(nestedObj)) {
          if (SKIP_KEYS.includes(subKey)) continue;

          if (Array.isArray(subValue)) {
            subValue.forEach((item) => {
              if (typeof item === "object" && item !== null && "term" in item) {
                const parsed = parseStructuredEntry(
                  item as StructuredKeywordEntry,
                  policyId,
                  `${categoryKey}/${subKey}`
                );
                keywords.push(...parsed);
              } else if (typeof item === "string" && item.length > 1) {
                keywords.push({
                  term: item.toLowerCase(),
                  originalTerm: item.toLowerCase(),
                  policy: policyId,
                  category: `${categoryKey}/${subKey}`,
                  severity: determineSeverityFromData(undefined, subKey),
                  language: "multi",
                  isAlias: false,
                });
              }
            });
          }
        }
      }
    }
  }

  return keywords;
}

// ============================================
// LOAD ALL KEYWORDS (Enhanced)
// ============================================

export function loadAllKeywords(): LoadedKeyword[] {
  if (cachedKeywords) return cachedKeywords;

  const allKeywords: LoadedKeyword[] = [];
  const allExcluded: ExcludedTerm[] = [];
  const allPatterns: ThreatPattern[] = [];

  const keywordFiles: Record<string, Record<string, unknown>> = {
    ase: aseKeywords as Record<string, unknown>,
    ansa: ansaKeywords as Record<string, unknown>,
    bh: bhKeywords as Record<string, unknown>,
    chpc: chpcKeywords as Record<string, unknown>,
    cis: cisKeywords as Record<string, unknown>,
    cs: csKeywords as Record<string, unknown>,
    csean: cseanKeywords as Record<string, unknown>,
    doi: doiKeywords as Record<string, unknown>,
    dp: dpKeywords as Record<string, unknown>,
    fsdp: fsdpKeywords as Record<string, unknown>,
    hc: hcKeywords as Record<string, unknown>,
    he: heKeywords as Record<string, unknown>,
    hw: hwKeywords as Record<string, unknown>,
    ogg: oggKeywords as Record<string, unknown>,
    orgs: orgsKeywords as Record<string, unknown>,
    psl: pslKeywords as Record<string, unknown>,
    pv: pvKeywords as Record<string, unknown>,
    rp: rpKeywords as Record<string, unknown>,
    spam: spamKeywords as Record<string, unknown>,
    ssied: ssiedKeywords as Record<string, unknown>,
    sspx: sspxKeywords as Record<string, unknown>,
    ta: taKeywords as Record<string, unknown>,
    vgc: vgcKeywords as Record<string, unknown>,
    vi: viKeywords as Record<string, unknown>,
    wae: waeKeywords as Record<string, unknown>,
  };

  for (const [policyId, data] of Object.entries(keywordFiles)) {
    try {
      // Parse keywords
      const policyKeywords = parseKeywordFile(data, policyId as PolicyId);
      allKeywords.push(...policyKeywords);

      // Parse excluded terms
      const excluded = parseExcludedTerms(data);
      allExcluded.push(...excluded);

      // Parse threat patterns (VI specific)
      if (policyId === "vi") {
        const patterns = parseThreatPatterns(data);
        allPatterns.push(...patterns);
      }

      console.log(
        `✅ Loaded ${policyKeywords.length} keywords for ${policyId.toUpperCase()} (including aliases)`
      );
    } catch (error) {
      console.error(`❌ Error loading keywords for ${policyId}:`, error);
    }
  }

  // Remove duplicates (same term + policy)
  const uniqueMap = new Map<string, LoadedKeyword>();
  allKeywords.forEach((kw) => {
    const key = `${kw.term}|${kw.policy}`;
    // Prefer non-alias over alias if duplicate
    if (!uniqueMap.has(key) || !kw.isAlias) {
      uniqueMap.set(key, kw);
    }
  });

  cachedKeywords = Array.from(uniqueMap.values());
  cachedExcludedTerms = allExcluded;
  cachedThreatPatterns = allPatterns;

  console.log(`📊 Total unique keywords loaded: ${cachedKeywords.length}`);
  console.log(`📊 Excluded terms loaded: ${cachedExcludedTerms.length}`);
  console.log(`📊 Threat patterns loaded: ${cachedThreatPatterns.length}`);

  return cachedKeywords;
}

// ============================================
// GET EXCLUDED TERMS
// ============================================

export function getExcludedTerms(): ExcludedTerm[] {
  if (!cachedExcludedTerms) {
    loadAllKeywords(); // This populates all caches
  }
  return cachedExcludedTerms || [];
}

// ============================================
// GET THREAT PATTERNS
// ============================================

export function getThreatPatterns(): ThreatPattern[] {
  if (!cachedThreatPatterns) {
    loadAllKeywords();
  }
  return cachedThreatPatterns || [];
}

// ============================================
// CHECK IF TERM IS EXCLUDED
// ============================================

function isExcludedTerm(text: string, term: string): boolean {
  const excluded = getExcludedTerms();
  const textLower = text.toLowerCase();

  for (const exc of excluded) {
    // Check if the excluded phrase exists in text
    if (textLower.includes(exc.term)) {
      // If the detected term is part of an excluded phrase, skip it
      if (exc.term.includes(term)) {
        return true;
      }
    }
  }

  return false;
}

// ============================================
// FIND KEYWORDS IN TEXT (Enhanced)
// ============================================

export function findKeywordsInText(text: string): KeywordMatch[] {
  const keywords = loadAllKeywords();
  const found: KeywordMatch[] = [];
  const processedTerms = new Set<string>();

  // Normalize text
  const normalizedText = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const originalTextLower = text.toLowerCase();

  for (const kw of keywords) {
    // Skip if already found this term for this policy
    const uniqueKey = `${kw.term}|${kw.policy}`;
    if (processedTerms.has(uniqueKey)) continue;

    const normalizedTerm = kw.term
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    let isMatch = false;

    if (normalizedTerm.includes(" ")) {
      // Multi-word: check for phrase
      isMatch = normalizedText.includes(normalizedTerm);
    } else {
      // Single word: check with word boundaries
      const regex = new RegExp(
        `\\b${normalizedTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
        "i"
      );
      isMatch = regex.test(normalizedText);
    }

    if (isMatch) {
      // NOVO: Check if this is part of an excluded phrase
      if (isExcludedTerm(originalTextLower, kw.term)) {
        console.log(`⚠️ Skipping excluded term: "${kw.term}"`);
        continue;
      }

      found.push({
        term: kw.term,
        policy: kw.policy,
        category: kw.category,
        subcategory: kw.subcategory,
        severity: kw.severity,
        requiresContext: kw.requiresContext,
        contextNotes: kw.caveats, // NOVO: Incluir caveats
      });

      processedTerms.add(uniqueKey);

      // Also mark the original term as processed (to avoid duplicates from aliases)
      if (kw.isAlias && kw.originalTerm !== kw.term) {
        processedTerms.add(`${kw.originalTerm}|${kw.policy}`);
      }
    }
  }

  // Sort by severity
  const severityOrder: Record<Severity, number> = {
    critical: 0,
    high: 1,
    mid: 2,
    low: 3,
    info: 4,
  };

  return found.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
}

// ============================================
// DETECT THREAT PATTERNS
// ============================================

export function detectThreatPatterns(
  text: string
): { pattern: string; type: string }[] {
  const patterns = getThreatPatterns();
  const detected: { pattern: string; type: string }[] = [];
  const textLower = text.toLowerCase();

  for (const p of patterns) {
    // Check main pattern
    if (textLower.includes(p.pattern)) {
      detected.push({ pattern: p.pattern, type: p.type });
      continue;
    }

    // Check aliases
    if (p.aliases) {
      for (const alias of p.aliases) {
        if (textLower.includes(alias)) {
          detected.push({ pattern: alias, type: p.type });
          break;
        }
      }
    }
  }

  return detected;
}

// ============================================
// GET KEYWORDS BY POLICY
// ============================================

export function getKeywordsByPolicy(policyId: PolicyId): LoadedKeyword[] {
  const keywords = loadAllKeywords();
  return keywords.filter((kw) => kw.policy === policyId);
}

// ============================================
// GET KEYWORD STATS (Enhanced)
// ============================================

export function getKeywordStats(): Record<string, number> {
  const keywords = loadAllKeywords();
  const excluded = getExcludedTerms();
  const patterns = getThreatPatterns();

  const stats: Record<string, number> = {
    total: keywords.length,
    excludedTerms: excluded.length,
    threatPatterns: patterns.length,
  };

  // Count by policy
  const policyCount: Record<string, number> = {};
  keywords.forEach((kw) => {
    policyCount[kw.policy] = (policyCount[kw.policy] || 0) + 1;
  });

  // Add policy counts
  Object.assign(stats, policyCount);

  // Count by severity
  stats.critical = keywords.filter((k) => k.severity === "critical").length;
  stats.high = keywords.filter((k) => k.severity === "high").length;
  stats.mid = keywords.filter((k) => k.severity === "mid").length;
  stats.low = keywords.filter((k) => k.severity === "low").length;

  // Count aliases
  stats.aliases = keywords.filter((k) => k.isAlias).length;
  stats.primaryTerms = keywords.filter((k) => !k.isAlias).length;

  return stats;
}

// ============================================
// EXPORT
// ============================================

export default loadAllKeywords;