// ============================================
// CM POLICY HUB - KEYWORD LOADER
// Carrega dinamicamente todos os ficheiros de keywords
// v1.0.0
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
  policy: PolicyId;
  category: string;
  subcategory?: string;
  severity: Severity;
  language?: "pt" | "en" | "es" | "multi";
  requiresContext?: boolean;
}

// ============================================
// SEVERITY MAPPING
// Determina severidade baseada no nome da categoria
// ============================================

const CRITICAL_CATEGORIES = [
  "threat", "ameaça", "csam", "csean", "sextortion", "trafficking",
  "suicide", "suicídio", "cis", "death", "morte", "kill", "matar",
  "rape", "estupro", "ncst", "exploitation", "exploração",
  "dismember", "decapit", "lethal", "hsv", "high_severity",
  "child", "menor", "criança", "pedophilia", "grooming",
  "terrorist", "terrorista", "tier1", "tier_1"
];

const HIGH_CATEGORIES = [
  "solicitation", "solicitação", "admission", "admissão",
  "incitement", "incitação", "promotion", "promoção",
  "graphic", "gráfico", "explicit", "explícito",
  "weapon", "arma", "explosive", "explosivo", "drug", "droga",
  "msv", "mid_severity", "harassment", "assédio",
  "hate", "ódio", "slur", "tier2", "tier_2", "ncii",
  "violence", "violência", "intent", "intenção"
];

const MID_CATEGORIES = [
  "indicator", "indicador", "signal", "sinal",
  "context", "contexto", "reference", "referência",
  "method", "método", "means", "meios",
  "lsv", "low_severity", "insult", "insulto",
  "tier3", "tier_3", "tier4", "tier_4"
];

function determineSeverity(category: string, subcategory?: string): Severity {
  const combined = `${category} ${subcategory || ""}`.toLowerCase();
  
  // Check for critical indicators
  for (const indicator of CRITICAL_CATEGORIES) {
    if (combined.includes(indicator)) return "critical";
  }
  
  // Check for high indicators
  for (const indicator of HIGH_CATEGORIES) {
    if (combined.includes(indicator)) return "high";
  }
  
  // Check for mid indicators
  for (const indicator of MID_CATEGORIES) {
    if (combined.includes(indicator)) return "mid";
  }
  
  // Default to mid for unknown categories
  return "mid";
}

// ============================================
// CONTEXT-REQUIRING CATEGORIES
// Palavras que precisam de contexto para serem violação
// ============================================

const CONTEXT_REQUIRED_PATTERNS = [
  "indicator", "indicador", "signal", "sinal",
  "context", "contexto", "setting", "ambiente",
  "emoji", "method", "payment", "pagamento",
  "product", "produto", "brand", "marca"
];

function requiresContext(category: string): boolean {
  const lower = category.toLowerCase();
  return CONTEXT_REQUIRED_PATTERNS.some(pattern => lower.includes(pattern));
}

// ============================================
// EXTRACT TERMS FROM NESTED STRUCTURE
// ============================================

function extractTermsFromValue(
  value: unknown,
  policy: PolicyId,
  category: string,
  subcategory?: string
): LoadedKeyword[] {
  const keywords: LoadedKeyword[] = [];
  const severity = determineSeverity(category, subcategory);
  const needsContext = requiresContext(category);

  // Handle different value types
  if (Array.isArray(value)) {
    // Direct array of strings
    value.forEach(term => {
      if (typeof term === "string" && term.length > 1) {
        keywords.push({
          term: term.toLowerCase(),
          policy,
          category,
          subcategory,
          severity,
          language: "multi",
          requiresContext: needsContext,
        });
      }
    });
  } else if (typeof value === "object" && value !== null) {
    // Object with language keys (en, pt, es) or nested structure
    const obj = value as Record<string, unknown>;
    
    // Check if it's a language object
    if (obj.en || obj.pt || obj.es) {
      // Language-specific arrays
      for (const [lang, terms] of Object.entries(obj)) {
        if (Array.isArray(terms)) {
          terms.forEach(term => {
            if (typeof term === "string" && term.length > 1) {
              keywords.push({
                term: term.toLowerCase(),
                policy,
                category,
                subcategory,
                severity,
                language: lang as "pt" | "en" | "es",
                requiresContext: needsContext,
              });
            }
          });
        }
      }
    } else {
      // Nested object - recurse
      for (const [key, nestedValue] of Object.entries(obj)) {
        // Skip metadata fields
        if (["policyId", "policyName", "shortName", "version", "lastUpdated", "note", "notes", "description"].includes(key)) {
          continue;
        }
        
        const nestedKeywords = extractTermsFromValue(
          nestedValue,
          policy,
          category,
          key // Use key as subcategory
        );
        keywords.push(...nestedKeywords);
      }
    }
  } else if (typeof value === "string" && value.length > 1) {
    // Single string value
    keywords.push({
      term: value.toLowerCase(),
      policy,
      category,
      subcategory,
      severity,
      language: "multi",
      requiresContext: needsContext,
    });
  }

  return keywords;
}

// ============================================
// PARSE SINGLE KEYWORD FILE
// ============================================

function parseKeywordFile(data: Record<string, unknown>, policyId: PolicyId): LoadedKeyword[] {
  const keywords: LoadedKeyword[] = [];

  for (const [categoryKey, categoryValue] of Object.entries(data)) {
    // Skip metadata fields
    if (["policyId", "policyName", "shortName", "version", "lastUpdated", "note", "notes", "description"].includes(categoryKey)) {
      continue;
    }

    // Extract all terms from this category
    const categoryKeywords = extractTermsFromValue(
      categoryValue,
      policyId,
      categoryKey
    );
    keywords.push(...categoryKeywords);
  }

  return keywords;
}

// ============================================
// LOAD ALL KEYWORDS
// ============================================

let cachedKeywords: LoadedKeyword[] | null = null;

export function loadAllKeywords(): LoadedKeyword[] {
  // Return cached if available
  if (cachedKeywords) {
    return cachedKeywords;
  }

  const allKeywords: LoadedKeyword[] = [];

  // Map of policy files
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

  // Parse each file
  for (const [policyId, data] of Object.entries(keywordFiles)) {
    try {
      const policyKeywords = parseKeywordFile(data, policyId as PolicyId);
      allKeywords.push(...policyKeywords);
      console.log(`✅ Loaded ${policyKeywords.length} keywords for ${policyId.toUpperCase()}`);
    } catch (error) {
      console.error(`❌ Error loading keywords for ${policyId}:`, error);
    }
  }

  // Remove duplicates (same term + policy)
  const uniqueMap = new Map<string, LoadedKeyword>();
  allKeywords.forEach(kw => {
    const key = `${kw.term}|${kw.policy}`;
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, kw);
    }
  });

  cachedKeywords = Array.from(uniqueMap.values());
  
  console.log(`📊 Total unique keywords loaded: ${cachedKeywords.length}`);
  
  return cachedKeywords;
}

// ============================================
// KEYWORD SEARCH FUNCTION
// ============================================

export function findKeywordsInText(text: string): KeywordMatch[] {
  const keywords = loadAllKeywords();
  const found: KeywordMatch[] = [];
  const processedTerms = new Set<string>();
  
  const normalizedText = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  for (const kw of keywords) {
    // Skip if already found this term
    if (processedTerms.has(kw.term)) continue;

    const normalizedTerm = kw.term
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    // Check if term exists in text
    let isMatch = false;
    
    if (normalizedTerm.includes(" ")) {
      // Multi-word: check for phrase
      isMatch = normalizedText.includes(normalizedTerm);
    } else {
      // Single word: check with word boundaries
      const regex = new RegExp(`\\b${normalizedTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`);
      isMatch = regex.test(normalizedText);
    }

    if (isMatch) {
      found.push({
        term: kw.term,
        policy: kw.policy,
        category: kw.category,
        subcategory: kw.subcategory,
        severity: kw.severity,
        requiresContext: kw.requiresContext,
      });
      processedTerms.add(kw.term);
    }
  }

  // Sort by severity (critical first)
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
// GET KEYWORDS BY POLICY
// ============================================

export function getKeywordsByPolicy(policyId: PolicyId): LoadedKeyword[] {
  const keywords = loadAllKeywords();
  return keywords.filter(kw => kw.policy === policyId);
}

// ============================================
// GET KEYWORD STATS
// ============================================

export function getKeywordStats(): Record<string, number> {
  const keywords = loadAllKeywords();
  const stats: Record<string, number> = {
    total: keywords.length,
  };

  // Count by policy
  keywords.forEach(kw => {
    stats[kw.policy] = (stats[kw.policy] || 0) + 1;
  });

  // Count by severity
  stats.critical = keywords.filter(k => k.severity === "critical").length;
  stats.high = keywords.filter(k => k.severity === "high").length;
  stats.mid = keywords.filter(k => k.severity === "mid").length;
  stats.low = keywords.filter(k => k.severity === "low").length;

  return stats;
}

// ============================================
// EXPORT
// ============================================

export default loadAllKeywords;