/**
 * Clarification Loader v2.0
 * Loads and indexes policy clarifications for CM Policy Hub AI analysis
 * 
 * v2.0 CHANGES:
 * - Now uses clarifications-unified.json (159 clarifications)
 * - Supports all 25 policies including new ones (CHPC, CS, PV, DP, WAE, TA, HW, OGG, RP, CIS, ORGS)
 * - Improved policy alias mapping
 * 
 * Location: /src/lib/clarification-loader.ts
 */

import fs from 'fs';
import path from 'path';

// Types
export interface Clarification {
  id: string;
  source: string;
  policy: string;
  subPolicy: string;
  keywords: string[];
  content: string;
  decision: string;
  rationale: string;
  rule: string;
}

export interface ClarificationDatabase {
  metadata: {
    version: string;
    totalClarifications: number;
    lastUpdated: string;
    description: string;
    sources?: string[];
  };
  clarifications: Record<string, Clarification[]>;
}

export interface ClarificationIndex {
  byPolicy: Map<string, Clarification[]>;
  byKeyword: Map<string, Clarification[]>;
  byDecision: Map<string, Clarification[]>;
  all: Clarification[];
}

// Global cache
let clarificationIndex: ClarificationIndex | null = null;
let lastLoadTime: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Load clarifications from JSON file
 * v2.0: Now defaults to clarifications-unified.json
 */
export function loadClarificationsFromFile(filePath?: string): ClarificationDatabase {
  // v2.0: Use unified file by default
  const defaultPath = path.join(process.cwd(), 'src', 'data', 'clarifications', 'clarifications-unified.json');
  const fallbackPath = path.join(process.cwd(), 'src', 'data', 'clarifications', 'clarifications-database.json');
  
  const targetPath = filePath || defaultPath;
  
  try {
    const content = fs.readFileSync(targetPath, 'utf-8');
    return JSON.parse(content) as ClarificationDatabase;
  } catch (error) {
    // Fallback to old file if unified doesn't exist
    console.warn(`[ClarificationLoader] Could not load ${targetPath}, trying fallback...`);
    try {
      const fallbackContent = fs.readFileSync(fallbackPath, 'utf-8');
      return JSON.parse(fallbackContent) as ClarificationDatabase;
    } catch (fallbackError) {
      console.error(`[ClarificationLoader] Failed to load any clarification file:`, fallbackError);
      return {
        metadata: {
          version: '0.0.0',
          totalClarifications: 0,
          lastUpdated: new Date().toISOString(),
          description: 'Empty fallback database'
        },
        clarifications: {}
      };
    }
  }
}

/**
 * Build search index from clarifications database
 */
export function buildClarificationIndex(database: ClarificationDatabase): ClarificationIndex {
  const byPolicy = new Map<string, Clarification[]>();
  const byKeyword = new Map<string, Clarification[]>();
  const byDecision = new Map<string, Clarification[]>();
  const all: Clarification[] = [];

  for (const [policyKey, clarifications] of Object.entries(database.clarifications)) {
    for (const clarification of clarifications) {
      // Add to all
      all.push(clarification);

      // Index by policy (normalize to uppercase)
      const policyNormalized = clarification.policy.toUpperCase();
      if (!byPolicy.has(policyNormalized)) {
        byPolicy.set(policyNormalized, []);
      }
      byPolicy.get(policyNormalized)!.push(clarification);

      // Also index by the key used in the JSON
      const keyNormalized = policyKey.toUpperCase();
      if (keyNormalized !== policyNormalized && !byPolicy.has(keyNormalized)) {
        byPolicy.set(keyNormalized, []);
      }
      if (keyNormalized !== policyNormalized) {
        byPolicy.get(keyNormalized)!.push(clarification);
      }

      // Index by keywords
      for (const keyword of clarification.keywords) {
        const keywordNormalized = keyword.toLowerCase();
        if (!byKeyword.has(keywordNormalized)) {
          byKeyword.set(keywordNormalized, []);
        }
        byKeyword.get(keywordNormalized)!.push(clarification);
      }

      // Index by decision type
      const decisionType = extractDecisionType(clarification.decision);
      if (!byDecision.has(decisionType)) {
        byDecision.set(decisionType, []);
      }
      byDecision.get(decisionType)!.push(clarification);
    }
  }

  return { byPolicy, byKeyword, byDecision, all };
}

/**
 * Extract decision type from decision string
 */
function extractDecisionType(decision: string): string {
  const normalized = decision.toLowerCase();
  if (normalized.includes('no action') || normalized.includes('ignore') || normalized.includes('benign')) {
    return 'NO_ACTION';
  }
  if (normalized.includes('escalate') || normalized.includes('escalar')) {
    return 'ESCALATE';
  }
  if (normalized.includes('label')) {
    return 'LABEL';
  }
  if (normalized.includes('depends')) {
    return 'DEPENDS';
  }
  return 'OTHER';
}

/**
 * Get or create clarification index (with caching)
 */
export function getClarificationIndex(forceReload: boolean = false): ClarificationIndex {
  const now = Date.now();
  
  if (!forceReload && clarificationIndex && (now - lastLoadTime) < CACHE_TTL) {
    return clarificationIndex;
  }

  const database = loadClarificationsFromFile();
  clarificationIndex = buildClarificationIndex(database);
  lastLoadTime = now;

  console.log(`[ClarificationLoader] Indexed ${clarificationIndex.all.length} clarifications`);
  console.log(`[ClarificationLoader] Policies: ${clarificationIndex.byPolicy.size}`);
  console.log(`[ClarificationLoader] Keywords: ${clarificationIndex.byKeyword.size}`);

  return clarificationIndex;
}

/**
 * v2.0: Extended policy alias mapping for all 25 policies
 */
const POLICY_ALIASES: Record<string, string> = {
  // SSIED aliases
  'SUICIDE': 'SSIED',
  'SELF-INJURY': 'SSIED',
  'EATING DISORDER': 'SSIED',
  'ED': 'SSIED',
  'SI': 'SSIED',
  
  // BH aliases
  'BULLYING': 'BH',
  'HARASSMENT': 'BH',
  
  // VI aliases
  'VIOLENCE': 'VI',
  'INCITEMENT': 'VI',
  'V&I': 'VI',
  
  // HC aliases
  'HATE': 'HC',
  'HATEFUL': 'HC',
  'HATE SPEECH': 'HC',
  
  // ANSA aliases
  'NUDITY': 'ANSA',
  'SEXUAL ACTIVITY': 'ANSA',
  'ADULT NUDITY': 'ANSA',
  
  // PSL aliases
  'PROFANITY': 'PSL',
  'PROFANE': 'PSL',
  
  // CSE/CSEAN aliases
  'CHILD': 'CSEAN',
  'CSAM': 'CSEAN',
  'CSE': 'CSEAN',
  
  // ASE aliases
  'EXPLOITATION': 'ASE',
  'ADULT EXPLOITATION': 'ASE',
  'NCII': 'ASE',
  
  // HE aliases
  'HUMAN TRAFFICKING': 'HE',
  'TRAFFICKING': 'HE',
  
  // VGC aliases
  'GRAPHIC': 'VGC',
  'GORE': 'VGC',
  'GRAPHIC CONTENT': 'VGC',
  
  // SSPX aliases
  'SOLICITATION': 'SSPX',
  'SEXUAL SOLICITATION': 'SSPX',
  
  // DOI aliases
  'DANGEROUS ORGS': 'DOI',
  'TERRORISM': 'DOI',
  
  // FD/FSDP aliases
  'FRAUD': 'FSDP',
  'SCAM': 'FSDP',
  'FD': 'FSDP',
  
  // SPAM aliases
  'ENGAGEMENT GATING': 'SPAM',
  
  // RGS aliases
  'RESTRICTED GOODS': 'RGS',
  
  // New policy aliases (v2.0)
  'COORDINATING HARM': 'CHPC',
  'PROMOTING CRIME': 'CHPC',
  
  'CYBERSECURITY': 'CYBER',
  'HACKING': 'CYBER',
  'CYBER': 'CYBER',
  'CS': 'CYBER',
  
  'PRIVACY': 'PV',
  'DOXXING': 'PV',
  
  'DRUGS': 'DP',
  'PHARMACEUTICALS': 'DP',
  
  'WEAPONS': 'WAE',
  'AMMUNITION': 'WAE',
  'EXPLOSIVES': 'WAE',
  
  'TOBACCO': 'TA',
  'ALCOHOL': 'TA',
  
  'HEALTH': 'HW',
  'WELLNESS': 'HW',
  
  'GAMBLING': 'OGG',
  'GAMES': 'OGG',
  
  'RECALLED': 'RP',
  'RECALLED PRODUCTS': 'RP',
  
  'CREDIBLE INTENT': 'CIS',
  'CRISIS': 'CIS',
  
  'OTHER RGS': 'ORGS',
  'OTHER RESTRICTED': 'ORGS',
};

/**
 * Get clarifications by policy
 * v2.0: Improved alias handling
 */
export function getClarificationsByPolicy(policy: string): Clarification[] {
  const index = getClarificationIndex();
  const normalized = policy.toUpperCase();
  
  // Try direct match first
  let results = index.byPolicy.get(normalized);
  if (results && results.length > 0) {
    return results;
  }
  
  // Try alias mapping
  const mappedPolicy = POLICY_ALIASES[normalized];
  if (mappedPolicy) {
    results = index.byPolicy.get(mappedPolicy);
    if (results && results.length > 0) {
      return results;
    }
  }
  
  return [];
}

/**
 * Get clarifications by keyword
 */
export function getClarificationsByKeyword(keyword: string): Clarification[] {
  const index = getClarificationIndex();
  const normalized = keyword.toLowerCase().trim();
  return index.byKeyword.get(normalized) || [];
}

/**
 * Get clarifications by multiple keywords
 */
export function getClarificationsByKeywords(keywords: string[]): Clarification[] {
  const index = getClarificationIndex();
  const results = new Map<string, { clarification: Clarification; matchCount: number }>();

  for (const keyword of keywords) {
    const normalized = keyword.toLowerCase().trim();
    const matches = index.byKeyword.get(normalized) || [];
    
    for (const clarification of matches) {
      const existing = results.get(clarification.id);
      if (existing) {
        existing.matchCount++;
      } else {
        results.set(clarification.id, { clarification, matchCount: 1 });
      }
    }
  }

  // Sort by match count (descending)
  return Array.from(results.values())
    .sort((a, b) => b.matchCount - a.matchCount)
    .map(r => r.clarification);
}

/**
 * Get all clarifications
 */
export function getAllClarifications(): Clarification[] {
  const index = getClarificationIndex();
  return index.all;
}

/**
 * Get clarification statistics
 * v2.0: Now shows all 25 policies
 */
export function getClarificationStats(): {
  total: number;
  byPolicy: Record<string, number>;
  byDecision: Record<string, number>;
  uniqueKeywords: number;
  policiesWithClarifications: string[];
  policiesWithoutClarifications: string[];
} {
  const index = getClarificationIndex();
  
  const byPolicy: Record<string, number> = {};
  for (const [policy, clarifications] of index.byPolicy.entries()) {
    byPolicy[policy] = clarifications.length;
  }

  const byDecision: Record<string, number> = {};
  for (const [decision, clarifications] of index.byDecision.entries()) {
    byDecision[decision] = clarifications.length;
  }

  // All 27 policies (usando IDs de types.ts)
  const ALL_POLICIES = [
    'SSIED', 'BH', 'VI', 'HC', 'ANSA', 'PSL', 'CSEAN', 'ASE', 'HE', 'VGC',
    'SSPX', 'DOI', 'FSDP', 'SPAM', 'CHPC', 'CYBER', 'PV', 'DP', 'WAE',
    'TA', 'HW', 'OGG', 'RP', 'CIS', 'ORGS', 'BCP', 'BCR'
  ];

  const policiesWithClarifications = ALL_POLICIES.filter(p => 
    index.byPolicy.has(p) && (index.byPolicy.get(p)?.length || 0) > 0
  );

  const policiesWithoutClarifications = ALL_POLICIES.filter(p => 
    !index.byPolicy.has(p) || (index.byPolicy.get(p)?.length || 0) === 0
  );

  return {
    total: index.all.length,
    byPolicy,
    byDecision,
    uniqueKeywords: index.byKeyword.size,
    policiesWithClarifications,
    policiesWithoutClarifications,
  };
}

/**
 * Search clarifications by text content
 */
export function searchClarifications(query: string): Clarification[] {
  const index = getClarificationIndex();
  const normalized = query.toLowerCase();
  const words = normalized.split(/\s+/).filter(w => w.length > 2);

  const results = new Map<string, { clarification: Clarification; score: number }>();

  for (const clarification of index.all) {
    let score = 0;
    const searchText = `${clarification.content} ${clarification.rationale} ${clarification.rule}`.toLowerCase();

    // Check for exact phrase match
    if (searchText.includes(normalized)) {
      score += 10;
    }

    // Check for individual word matches
    for (const word of words) {
      if (searchText.includes(word)) {
        score += 1;
      }
      // Check keywords
      if (clarification.keywords.some(k => k.toLowerCase().includes(word))) {
        score += 3;
      }
    }

    if (score > 0) {
      results.set(clarification.id, { clarification, score });
    }
  }

  return Array.from(results.values())
    .sort((a, b) => b.score - a.score)
    .map(r => r.clarification);
}

export default {
  loadClarificationsFromFile,
  buildClarificationIndex,
  getClarificationIndex,
  getClarificationsByPolicy,
  getClarificationsByKeyword,
  getClarificationsByKeywords,
  getAllClarifications,
  getClarificationStats,
  searchClarifications
};