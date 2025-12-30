/**
 * Clarification Loader v1.0
 * Loads and indexes policy clarifications for CM Policy Hub AI analysis
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
 */
export function loadClarificationsFromFile(filePath?: string): ClarificationDatabase {
  const defaultPath = path.join(process.cwd(), 'src', 'data', 'clarifications', 'clarifications-database.json');
  const targetPath = filePath || defaultPath;
  
  try {
    const content = fs.readFileSync(targetPath, 'utf-8');
    return JSON.parse(content) as ClarificationDatabase;
  } catch (error) {
    console.error(`[ClarificationLoader] Failed to load from ${targetPath}:`, error);
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

      // Index by policy
      const policyNormalized = clarification.policy.toUpperCase();
      if (!byPolicy.has(policyNormalized)) {
        byPolicy.set(policyNormalized, []);
      }
      byPolicy.get(policyNormalized)!.push(clarification);

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
  if (normalized.includes('no action') || normalized.includes('ignore')) {
    return 'NO_ACTION';
  }
  if (normalized.includes('escalate') || normalized.includes('escalar')) {
    return 'ESCALATE';
  }
  if (normalized.includes('label')) {
    return 'LABEL';
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
 * Get clarifications by policy
 */
export function getClarificationsByPolicy(policy: string): Clarification[] {
  const index = getClarificationIndex();
  const normalized = policy.toUpperCase();
  
  // Handle common aliases
  const policyMap: Record<string, string> = {
    'SUICIDE': 'SSIED',
    'SELF-INJURY': 'SSIED',
    'BULLYING': 'BH',
    'HARASSMENT': 'BH',
    'VIOLENCE': 'VI',
    'INCITEMENT': 'VI',
    'HATE': 'HC',
    'HATEFUL': 'HC',
    'NUDITY': 'ANSA',
    'SEXUAL ACTIVITY': 'ANSA',
    'PROFANITY': 'PSL',
    'SPAM': 'SPAM',
    'FRAUD': 'FD',
    'CHILD': 'CSE',
    'CSE': 'CSE',
    'EXPLOITATION': 'ASE',
    'HUMAN TRAFFICKING': 'HE',
    'GRAPHIC': 'VGC',
    'GORE': 'VGC',
    'RESTRICTED GOODS': 'RGS',
    'SOLICITATION': 'SSPX'
  };

  const mappedPolicy = policyMap[normalized] || normalized;
  return index.byPolicy.get(mappedPolicy) || [];
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
 */
export function getClarificationStats(): {
  total: number;
  byPolicy: Record<string, number>;
  byDecision: Record<string, number>;
  uniqueKeywords: number;
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

  return {
    total: index.all.length,
    byPolicy,
    byDecision,
    uniqueKeywords: index.byKeyword.size
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