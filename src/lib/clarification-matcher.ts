/**
 * Clarification Matcher v1.1
 * Finds the most relevant clarifications for content analysis
 * 
 * v1.1 FIX: Added safety checks to NEVER return No Action for credible threats
 * 
 * Location: /src/lib/clarification-matcher.ts
 */

import {
  Clarification,
  getClarificationsByPolicy,
  getClarificationsByKeywords,
  searchClarifications,
  getClarificationIndex
} from './clarification-loader';

// Types
export interface MatchContext {
  content: string;
  detectedKeywords: string[];
  candidatePolicies: string[];
  contentLanguage?: string;
}

export interface MatchResult {
  clarification: Clarification;
  relevanceScore: number;
  matchReasons: string[];
}

export interface MatcherConfig {
  maxResults: number;
  minScore: number;
  boostExactKeywordMatch: number;
  boostPolicyMatch: number;
  boostContentSimilarity: number;
}

const DEFAULT_CONFIG: MatcherConfig = {
  maxResults: 3,
  minScore: 2,
  boostExactKeywordMatch: 5,
  boostPolicyMatch: 3,
  boostContentSimilarity: 2
};

// ============================================
// SAFETY PATTERNS - NEVER No Action for these
// ============================================

const THREAT_INDICATORS = {
  // Violence verbs
  violenceVerbs: /\b(matar|mato|mate|matei|matou|morrer|morra|morre|assassinar|executar|eliminar|acabar|destruir|explodir|atirar|esfaquear|espancar|bater|agredir|estuprar|violentar)\b/i,
  
  // Intent markers
  intentMarkers: /\b(vou|irei|vamos|quero|preciso|tenho que|preciso|devo|deveria|devemos|prometo|juro|decidi)\b/i,
  
  // Target indicators
  targetIndicators: /\b(te|ti|você|voce|tu|ele|ela|eles|elas|vocês|voces|vcs|todos|todas|família|familia|filho|filha|mãe|mae|pai|irmão|irmao|irmã|irma)\b/i,
  
  // Timing indicators
  timingIndicators: /\b(agora|já|ja|hoje|amanhã|amanha|depois|logo|em breve|quando|daqui|esta noite|hoje à noite|nesta semana|semana que vem)\b/i,
  
  // Location indicators (high-risk)
  locationIndicators: /\b(escola|trabalho|casa|escritório|escritorio|faculdade|universidade|igreja|shopping|aeroporto|hospital)\b/i,
  
  // Weapon indicators
  weaponIndicators: /\b(arma|faca|pistola|revolver|revólver|rifle|espingarda|fuzil|bomba|explosivo|veneno|corda)\b/i,
  
  // Suicide/Self-harm with target (becomes BH, not SSIED)
  suicideWithTarget: /\b(se mata|te mata|mata-te|mate-se|suicida-te|suicidar)\b/i,
};

// Idiomatic expressions that ARE safe (No Action)
const SAFE_IDIOMATIC_PHRASES = [
  'matar a fome',
  'matar o tempo',
  'matar a saudade',
  'matar aula',
  'matar serviço',
  'morrer de rir',
  'morrer de fome',
  'morrer de vontade',
  'morrer de vergonha',
  'me mata de rir',
  'mata de vergonha',
  'atira-te ao mar', // Idiomatic in Portugal
  'atira te ao mar',
  'vai te catar',
  'vai plantar batata',
  'vai ver se estou na esquina',
  'vou te contar',
  'mato-me a rir',
];

/**
 * Check if content contains a safe idiomatic expression
 */
function containsSafeIdiom(content: string): boolean {
  const normalizedContent = content.toLowerCase().trim();
  return SAFE_IDIOMATIC_PHRASES.some(phrase => 
    normalizedContent.includes(phrase.toLowerCase())
  );
}

/**
 * Check if content shows signs of a credible threat
 * Returns true if content should NEVER be No Action
 */
function hasCredibleThreatIndicators(content: string): boolean {
  const normalizedContent = content.toLowerCase();
  
  // If it's a safe idiom, it's NOT a threat
  if (containsSafeIdiom(content)) {
    return false;
  }
  
  // Check for violence verb
  const hasViolence = THREAT_INDICATORS.violenceVerbs.test(normalizedContent);
  if (!hasViolence) {
    return false; // No violence verb, could be No Action
  }
  
  // Violence + Intent = NEVER No Action
  const hasIntent = THREAT_INDICATORS.intentMarkers.test(normalizedContent);
  if (hasViolence && hasIntent) {
    console.log('[ClarificationMatcher] ⚠️ BLOCKED No Action: Violence + Intent detected');
    return true;
  }
  
  // Violence + Target = NEVER No Action
  const hasTarget = THREAT_INDICATORS.targetIndicators.test(normalizedContent);
  if (hasViolence && hasTarget) {
    console.log('[ClarificationMatcher] ⚠️ BLOCKED No Action: Violence + Target detected');
    return true;
  }
  
  // Violence + Timing = NEVER No Action
  const hasTiming = THREAT_INDICATORS.timingIndicators.test(normalizedContent);
  if (hasViolence && hasTiming) {
    console.log('[ClarificationMatcher] ⚠️ BLOCKED No Action: Violence + Timing detected');
    return true;
  }
  
  // Violence + Weapon = NEVER No Action
  const hasWeapon = THREAT_INDICATORS.weaponIndicators.test(normalizedContent);
  if (hasViolence && hasWeapon) {
    console.log('[ClarificationMatcher] ⚠️ BLOCKED No Action: Violence + Weapon detected');
    return true;
  }
  
  // Violence + Location = NEVER No Action
  const hasLocation = THREAT_INDICATORS.locationIndicators.test(normalizedContent);
  if (hasViolence && hasLocation) {
    console.log('[ClarificationMatcher] ⚠️ BLOCKED No Action: Violence + Location detected');
    return true;
  }
  
  return false;
}

/**
 * Find the most relevant clarifications for a given analysis context
 */
export function findRelevantClarifications(
  context: MatchContext,
  config: Partial<MatcherConfig> = {}
): MatchResult[] {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const results = new Map<string, MatchResult>();

  // 1. Match by detected keywords
  const keywordMatches = getClarificationsByKeywords(context.detectedKeywords);
  for (const clarification of keywordMatches) {
    addOrUpdateResult(results, clarification, cfg.boostExactKeywordMatch, 'keyword match');
  }

  // 2. Match by candidate policies
  for (const policy of context.candidatePolicies) {
    const policyMatches = getClarificationsByPolicy(policy);
    for (const clarification of policyMatches) {
      addOrUpdateResult(results, clarification, cfg.boostPolicyMatch, `policy: ${policy}`);
    }
  }

  // 3. Match by content similarity (text search)
  const contentMatches = searchClarifications(context.content);
  for (let i = 0; i < Math.min(contentMatches.length, 10); i++) {
    const clarification = contentMatches[i];
    // Decay score based on position
    const score = cfg.boostContentSimilarity * (1 - i * 0.1);
    addOrUpdateResult(results, clarification, score, 'content similarity');
  }

  // 4. Boost clarifications that match multiple criteria
  for (const [id, result] of results.entries()) {
    if (result.matchReasons.length >= 2) {
      result.relevanceScore *= 1.5; // 50% boost for multi-match
    }
    if (result.matchReasons.length >= 3) {
      result.relevanceScore *= 1.3; // Additional 30% for triple match
    }
  }

  // 5. Filter and sort
  return Array.from(results.values())
    .filter(r => r.relevanceScore >= cfg.minScore)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, cfg.maxResults);
}

/**
 * Add or update a result in the results map
 */
function addOrUpdateResult(
  results: Map<string, MatchResult>,
  clarification: Clarification,
  score: number,
  reason: string
): void {
  const existing = results.get(clarification.id);
  if (existing) {
    existing.relevanceScore += score;
    if (!existing.matchReasons.includes(reason)) {
      existing.matchReasons.push(reason);
    }
  } else {
    results.set(clarification.id, {
      clarification,
      relevanceScore: score,
      matchReasons: [reason]
    });
  }
}

/**
 * Format clarifications for injection into Gemini prompt
 */
export function formatClarificationsForPrompt(matches: MatchResult[]): string {
  if (matches.length === 0) {
    return '';
  }

  const lines: string[] = [
    '',
    '## CLARIFICAÇÕES RELEVANTES (Decisões Oficiais)',
    'As seguintes clarificações da equipa de Policy aplicam-se a conteúdo semelhante:',
    ''
  ];

  for (let i = 0; i < matches.length; i++) {
    const { clarification } = matches[i];
    lines.push(`### Clarificação ${i + 1} [${clarification.id}]`);
    lines.push(`- **Conteúdo exemplo**: "${clarification.content}"`);
    lines.push(`- **Decisão**: ${clarification.decision}`);
    lines.push(`- **Regra aplicável**: ${clarification.rule}`);
    lines.push(`- **Racional**: ${clarification.rationale}`);
    lines.push('');
  }

  lines.push('**IMPORTANTE**: Usar estas clarificações como referência para decisões semelhantes.');
  lines.push('');

  return lines.join('\n');
}

/**
 * Format clarifications as few-shot examples
 */
export function formatClarificationsAsFewShot(matches: MatchResult[]): string {
  if (matches.length === 0) {
    return '';
  }

  const examples: string[] = [
    '',
    '## EXEMPLOS DE DECISÕES ANTERIORES',
    ''
  ];

  for (let i = 0; i < matches.length; i++) {
    const { clarification } = matches[i];
    examples.push(`**Exemplo ${i + 1}**:`);
    examples.push(`Input: "${clarification.content}"`);
    examples.push(`Output: ${clarification.decision}`);
    examples.push(`Razão: ${clarification.rule}`);
    examples.push('');
  }

  return examples.join('\n');
}

/**
 * Get clarifications specifically for No Action cases
 */
export function getNoActionClarifications(policy: string): Clarification[] {
  const index = getClarificationIndex();
  const noActionClarifications = index.byDecision.get('NO_ACTION') || [];
  
  return noActionClarifications.filter(c => 
    c.policy.toUpperCase() === policy.toUpperCase() || 
    c.policy === 'No Action'
  );
}

/**
 * Get clarifications for escalation cases
 */
export function getEscalationClarifications(policy: string): Clarification[] {
  const index = getClarificationIndex();
  const escalateClarifications = index.byDecision.get('ESCALATE') || [];
  
  return escalateClarifications.filter(c => 
    c.policy.toUpperCase() === policy.toUpperCase()
  );
}

/**
 * Check if content matches any known No Action patterns
 * 
 * v1.1 FIX: Now includes safety checks for credible threats
 * NEVER returns No Action if content has threat indicators
 */
export function checkNoActionPatterns(
  content: string, 
  policy: string
): { isNoAction: boolean; matchedClarification?: Clarification; blockedReason?: string } {
  
  // SAFETY CHECK: If content has credible threat indicators, NEVER No Action
  if (hasCredibleThreatIndicators(content)) {
    console.log('[ClarificationMatcher] 🚫 Quick No Action BLOCKED - credible threat indicators detected');
    return { 
      isNoAction: false, 
      blockedReason: 'Credible threat indicators detected - requires full AI analysis' 
    };
  }
  
  // Only check for safe idiomatic expressions
  if (containsSafeIdiom(content)) {
    // Find the matching clarification for the idiom
    const noActionClarifications = getNoActionClarifications(policy);
    
    for (const clarification of noActionClarifications) {
      // Check if clarification content matches an idiom
      const clarificationContent = clarification.content.toLowerCase();
      const normalizedContent = content.toLowerCase();
      
      // Match the FULL idiomatic phrase, not just keywords
      for (const phrase of SAFE_IDIOMATIC_PHRASES) {
        if (normalizedContent.includes(phrase) && 
            clarificationContent.includes(phrase)) {
          console.log(`[ClarificationMatcher] ✅ Safe idiom matched: "${phrase}"`);
          return {
            isNoAction: true,
            matchedClarification: clarification
          };
        }
      }
    }
  }

  // Default: require full AI analysis
  return { isNoAction: false };
}

/**
 * Get policy-specific clarification summary
 */
export function getPolicyClarificationSummary(policy: string): string {
  const clarifications = getClarificationsByPolicy(policy);
  
  if (clarifications.length === 0) {
    return `Sem clarificações específicas para ${policy}.`;
  }

  const noActionCount = clarifications.filter(c => 
    c.decision.toLowerCase().includes('no action') || 
    c.decision.toLowerCase().includes('ignore')
  ).length;

  const labelCount = clarifications.filter(c => 
    c.decision.toLowerCase().includes('label')
  ).length;

  const escalateCount = clarifications.filter(c => 
    c.decision.toLowerCase().includes('escalate') || 
    c.decision.toLowerCase().includes('escalar')
  ).length;

  return `${policy}: ${clarifications.length} clarificações (${noActionCount} No Action, ${labelCount} Label, ${escalateCount} Escalate)`;
}

/**
 * Quick match for common patterns
 */
export function quickMatchClarification(
  content: string,
  policy: string
): Clarification | null {
  const clarifications = getClarificationsByPolicy(policy);
  const normalizedContent = content.toLowerCase();

  // First pass: exact keyword match
  for (const clarification of clarifications) {
    for (const keyword of clarification.keywords) {
      if (normalizedContent.includes(keyword.toLowerCase())) {
        return clarification;
      }
    }
  }

  // Second pass: content similarity
  for (const clarification of clarifications) {
    const clarificationContent = clarification.content.toLowerCase();
    if (normalizedContent.includes(clarificationContent) || 
        clarificationContent.includes(normalizedContent)) {
      return clarification;
    }
  }

  return null;
}

export default {
  findRelevantClarifications,
  formatClarificationsForPrompt,
  formatClarificationsAsFewShot,
  getNoActionClarifications,
  getEscalationClarifications,
  checkNoActionPatterns,
  getPolicyClarificationSummary,
  quickMatchClarification,
  // Export safety check for testing
  hasCredibleThreatIndicators,
  containsSafeIdiom
};