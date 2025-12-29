// ============================================
// CM POLICY HUB - ENHANCED ANALYZE API ROUTE
// Endpoint de análise com Gemini AI
// Usa pré-análise + context injection para ~95% precisão
// v4.0.0
// ============================================

import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import buildEnhancedPrompt, {
  PreAnalysisContext,
  SSIEDPreChecks,
  BHPreChecks,
} from "@/lib/enhanced-prompt-builder";
import {
  PolicyId,
  Severity,
  KeywordMatch,
  VIChecks,
  DetectedExceptions,
} from "@/lib/types";

// ============================================
// TYPES
// ============================================

interface AnalyzeRequestBody {
  text: string;
  options?: {
    useAI?: boolean;
    includeDebugInfo?: boolean;
  };
}

interface DecisionTreeResponse {
  action: "no_action" | "escalate" | "label";
  decisionPath: string[];
  terminalNodeId: string;
  fullLabel: string;
  confidence: number;
  reasoning: string;
  shouldEscalate: boolean;
  escalationReason?: string;
}

// ============================================
// COMPREHENSIVE KEYWORD DATABASE
// Organized by policy and severity
// ============================================

interface KeywordEntry {
  term: string;
  policy: PolicyId;
  category: string;
  severity: Severity;
  language?: "pt" | "en" | "multi";
  aliases?: string[];
  requiresContext?: boolean;
}

const KEYWORDS_DATABASE: KeywordEntry[] = [
  // ============================================
  // VI - Violence and Incitement
  // ============================================
  // High Severity Violence (Lethal)
  { term: "kill", policy: "vi", category: "HSV", severity: "critical", language: "en" },
  { term: "matar", policy: "vi", category: "HSV", severity: "critical", language: "pt" },
  { term: "assassinar", policy: "vi", category: "HSV", severity: "critical", language: "pt" },
  { term: "shoot", policy: "vi", category: "HSV", severity: "critical", language: "en" },
  { term: "atirar", policy: "vi", category: "HSV", severity: "critical", language: "pt" },
  { term: "meter bala", policy: "vi", category: "HSV", severity: "critical", language: "pt" },
  { term: "stab", policy: "vi", category: "HSV", severity: "critical", language: "en" },
  { term: "esfaquear", policy: "vi", category: "HSV", severity: "critical", language: "pt" },
  { term: "facada", policy: "vi", category: "HSV", severity: "critical", language: "pt" },
  { term: "hang", policy: "vi", category: "HSV", severity: "critical", language: "en" },
  { term: "enforcar", policy: "vi", category: "HSV", severity: "critical", language: "pt" },
  { term: "burn alive", policy: "vi", category: "HSV", severity: "critical", language: "en" },
  { term: "queimar vivo", policy: "vi", category: "HSV", severity: "critical", language: "pt" },
  { term: "drown", policy: "vi", category: "HSV", severity: "critical", language: "en" },
  { term: "afogar", policy: "vi", category: "HSV", severity: "critical", language: "pt" },
  { term: "strangle", policy: "vi", category: "HSV", severity: "critical", language: "en" },
  { term: "estrangular", policy: "vi", category: "HSV", severity: "critical", language: "pt" },
  { term: "poison", policy: "vi", category: "HSV", severity: "critical", language: "en" },
  { term: "envenenar", policy: "vi", category: "HSV", severity: "critical", language: "pt" },
  { term: "decapitate", policy: "vi", category: "HSV", severity: "critical", language: "en" },
  { term: "decapitar", policy: "vi", category: "HSV", severity: "critical", language: "pt" },
  { term: "degolar", policy: "vi", category: "HSV", severity: "critical", language: "pt" },
  { term: "dismember", policy: "vi", category: "HSV", severity: "critical", language: "en" },
  { term: "desmembrar", policy: "vi", category: "HSV", severity: "critical", language: "pt" },
  { term: "lynch", policy: "vi", category: "HSV", severity: "critical", language: "en" },
  { term: "linchar", policy: "vi", category: "HSV", severity: "critical", language: "pt" },
  { term: "massacre", policy: "vi", category: "HSV", severity: "critical", language: "multi" },
  { term: "massacrar", policy: "vi", category: "HSV", severity: "critical", language: "pt" },
  { term: "run over", policy: "vi", category: "HSV", severity: "critical", language: "en" },
  { term: "atropelar", policy: "vi", category: "HSV", severity: "critical", language: "pt" },
  { term: "fuzilar", policy: "vi", category: "HSV", severity: "critical", language: "pt" },
  { term: "explodir", policy: "vi", category: "HSV", severity: "critical", language: "pt" },
  { term: "mutilar", policy: "vi", category: "HSV", severity: "critical", language: "pt" },
  
  // HSV Proxy Language (Brazilian)
  { term: "cpf cancelado", policy: "vi", category: "HSV_Proxy", severity: "critical", language: "pt" },
  { term: "cancelar cpf", policy: "vi", category: "HSV_Proxy", severity: "critical", language: "pt" },
  { term: "dar um fim", policy: "vi", category: "HSV_Proxy", severity: "critical", language: "pt" },
  { term: "mandar pro caixão", policy: "vi", category: "HSV_Proxy", severity: "critical", language: "pt" },
  { term: "eliminar", policy: "vi", category: "HSV_Proxy", severity: "critical", language: "pt" },
  
  // Calls for Death
  { term: "death to", policy: "vi", category: "Calls_for_Death", severity: "critical", language: "en" },
  { term: "morte a", policy: "vi", category: "Calls_for_Death", severity: "critical", language: "pt" },
  { term: "morte aos", policy: "vi", category: "Calls_for_Death", severity: "critical", language: "pt" },
  
  // Mid Severity Violence (Serious Injury)
  { term: "punch", policy: "vi", category: "MSV", severity: "high", language: "en" },
  { term: "socar", policy: "vi", category: "MSV", severity: "high", language: "pt" },
  { term: "soco", policy: "vi", category: "MSV", severity: "high", language: "pt" },
  { term: "kick", policy: "vi", category: "MSV", severity: "high", language: "en" },
  { term: "chutar", policy: "vi", category: "MSV", severity: "high", language: "pt" },
  { term: "beat", policy: "vi", category: "MSV", severity: "high", language: "en" },
  { term: "bater", policy: "vi", category: "MSV", severity: "high", language: "pt", requiresContext: true },
  { term: "surra", policy: "vi", category: "MSV", severity: "high", language: "pt" },
  { term: "espancar", policy: "vi", category: "MSV", severity: "high", language: "pt" },
  { term: "arrebentar", policy: "vi", category: "MSV", severity: "high", language: "pt" },
  { term: "partir a cara", policy: "vi", category: "MSV", severity: "high", language: "pt" },
  
  // Low Severity Violence (Minor Harm)
  { term: "slap", policy: "vi", category: "LSV", severity: "mid", language: "en" },
  { term: "tapa", policy: "vi", category: "LSV", severity: "mid", language: "pt" },
  { term: "push", policy: "vi", category: "LSV", severity: "mid", language: "en", requiresContext: true },
  { term: "empurrar", policy: "vi", category: "LSV", severity: "mid", language: "pt" },
  { term: "spit", policy: "vi", category: "LSV", severity: "mid", language: "en" },
  { term: "cuspir", policy: "vi", category: "LSV", severity: "mid", language: "pt" },
  
  // Armaments
  { term: "gun", policy: "vi", category: "Armament", severity: "high", language: "en", requiresContext: true },
  { term: "arma", policy: "vi", category: "Armament", severity: "high", language: "pt", requiresContext: true },
  { term: "pistola", policy: "vi", category: "Armament", severity: "high", language: "pt", requiresContext: true },
  { term: "fuzil", policy: "vi", category: "Armament", severity: "high", language: "pt" },
  { term: "3oitão", policy: "vi", category: "Armament", severity: "high", language: "pt" },
  { term: "38tão", policy: "vi", category: "Armament", severity: "high", language: "pt" },
  { term: "knife", policy: "vi", category: "Armament", severity: "high", language: "en", requiresContext: true },
  { term: "faca", policy: "vi", category: "Armament", severity: "high", language: "pt", requiresContext: true },
  { term: "facão", policy: "vi", category: "Armament", severity: "high", language: "pt" },
  { term: "bomb", policy: "vi", category: "Armament", severity: "critical", language: "en" },
  { term: "bomba", policy: "vi", category: "Armament", severity: "critical", language: "pt", requiresContext: true },
  { term: "explosivo", policy: "vi", category: "Armament", severity: "critical", language: "pt" },
  { term: "molotov", policy: "vi", category: "Armament", severity: "critical", language: "multi" },
  
  // High Risk Persons
  { term: "jornalista", policy: "vi", category: "HRP", severity: "mid", language: "pt", requiresContext: true },
  { term: "journalist", policy: "vi", category: "HRP", severity: "mid", language: "en", requiresContext: true },
  { term: "policial", policy: "vi", category: "HRP", severity: "mid", language: "pt", requiresContext: true },
  { term: "police", policy: "vi", category: "HRP", severity: "mid", language: "en", requiresContext: true },
  { term: "presidente", policy: "vi", category: "HRP", severity: "mid", language: "pt", requiresContext: true },
  { term: "president", policy: "vi", category: "HRP", severity: "mid", language: "en", requiresContext: true },
  
  // High Risk Locations
  { term: "escola", policy: "vi", category: "HRL", severity: "mid", language: "pt", requiresContext: true },
  { term: "school", policy: "vi", category: "HRL", severity: "mid", language: "en", requiresContext: true },
  { term: "igreja", policy: "vi", category: "HRL", severity: "mid", language: "pt", requiresContext: true },
  { term: "church", policy: "vi", category: "HRL", severity: "mid", language: "en", requiresContext: true },
  { term: "hospital", policy: "vi", category: "HRL", severity: "mid", language: "multi", requiresContext: true },
  
  // ============================================
  // SSIED - Suicide, Self-Injury, Eating Disorders
  // ============================================
  // Suicide - Explicit Intent
  { term: "kill myself", policy: "ssied", category: "Suicide_Intent", severity: "critical", language: "en" },
  { term: "kms", policy: "ssied", category: "Suicide_Intent", severity: "critical", language: "multi" },
  { term: "me matar", policy: "ssied", category: "Suicide_Intent", severity: "critical", language: "pt" },
  { term: "vou me matar", policy: "ssied", category: "Suicide_Intent", severity: "critical", language: "pt" },
  { term: "quero me matar", policy: "ssied", category: "Suicide_Intent", severity: "critical", language: "pt" },
  { term: "suicide", policy: "ssied", category: "Suicide_Explicit", severity: "critical", language: "en", requiresContext: true },
  { term: "suicídio", policy: "ssied", category: "Suicide_Explicit", severity: "critical", language: "pt", requiresContext: true },
  { term: "end my life", policy: "ssied", category: "Suicide_Intent", severity: "critical", language: "en" },
  { term: "acabar com minha vida", policy: "ssied", category: "Suicide_Intent", severity: "critical", language: "pt" },
  
  // Suicide - Methods
  { term: "hang myself", policy: "ssied", category: "Suicide_Method", severity: "critical", language: "en" },
  { term: "me enforcar", policy: "ssied", category: "Suicide_Method", severity: "critical", language: "pt" },
  { term: "overdose", policy: "ssied", category: "Suicide_Method", severity: "critical", language: "multi" },
  { term: "tomar pílulas", policy: "ssied", category: "Suicide_Method", severity: "critical", language: "pt" },
  { term: "jump off", policy: "ssied", category: "Suicide_Method", severity: "critical", language: "en" },
  { term: "pular de", policy: "ssied", category: "Suicide_Method", severity: "critical", language: "pt" },
  { term: "pular da ponte", policy: "ssied", category: "Suicide_Method", severity: "critical", language: "pt" },
  { term: "shoot myself", policy: "ssied", category: "Suicide_Method", severity: "critical", language: "en" },
  
  // Suicide - Ideation
  { term: "want to die", policy: "ssied", category: "Suicide_Ideation", severity: "high", language: "en" },
  { term: "wanna die", policy: "ssied", category: "Suicide_Ideation", severity: "high", language: "en" },
  { term: "quero morrer", policy: "ssied", category: "Suicide_Ideation", severity: "high", language: "pt" },
  { term: "wish I was dead", policy: "ssied", category: "Suicide_Ideation", severity: "high", language: "en" },
  { term: "queria estar morto", policy: "ssied", category: "Suicide_Ideation", severity: "high", language: "pt" },
  
  // Suicide - Incitement
  { term: "kill yourself", policy: "ssied", category: "Suicide_Incitement", severity: "critical", language: "en" },
  { term: "kys", policy: "ssied", category: "Suicide_Incitement", severity: "critical", language: "multi" },
  { term: "mata-te", policy: "ssied", category: "Suicide_Incitement", severity: "critical", language: "pt" },
  { term: "se mata", policy: "ssied", category: "Suicide_Incitement", severity: "critical", language: "pt" },
  
  // Self-Injury
  { term: "cutting", policy: "ssied", category: "Self_Injury", severity: "high", language: "en" },
  { term: "cut myself", policy: "ssied", category: "Self_Injury", severity: "high", language: "en" },
  { term: "me cortar", policy: "ssied", category: "Self_Injury", severity: "high", language: "pt" },
  { term: "self-harm", policy: "ssied", category: "Self_Injury", severity: "high", language: "en" },
  { term: "automutilação", policy: "ssied", category: "Self_Injury", severity: "high", language: "pt" },
  { term: "autolesão", policy: "ssied", category: "Self_Injury", severity: "high", language: "pt" },
  { term: "razor", policy: "ssied", category: "SI_Means", severity: "high", language: "en", requiresContext: true },
  { term: "gilete", policy: "ssied", category: "SI_Means", severity: "high", language: "pt", requiresContext: true },
  { term: "lâmina", policy: "ssied", category: "SI_Means", severity: "high", language: "pt", requiresContext: true },
  
  // Eating Disorders - Explicit
  { term: "anorexia", policy: "ssied", category: "ED_Explicit", severity: "high", language: "multi", requiresContext: true },
  { term: "bulimia", policy: "ssied", category: "ED_Explicit", severity: "high", language: "multi", requiresContext: true },
  { term: "pica", policy: "ssied", category: "ED_Explicit", severity: "high", language: "multi", requiresContext: true },
  { term: "purging", policy: "ssied", category: "ED_Behavior", severity: "high", language: "en" },
  { term: "purgar", policy: "ssied", category: "ED_Behavior", severity: "high", language: "pt" },
  { term: "starving myself", policy: "ssied", category: "ED_Behavior", severity: "high", language: "en" },
  { term: "passar fome", policy: "ssied", category: "ED_Behavior", severity: "high", language: "pt", requiresContext: true },
  
  // ED Promotion Signals (CRITICAL)
  { term: "thinspo", policy: "ssied", category: "ED_Promotion", severity: "critical", language: "multi" },
  { term: "thinspiration", policy: "ssied", category: "ED_Promotion", severity: "critical", language: "multi" },
  { term: "bonespo", policy: "ssied", category: "ED_Promotion", severity: "critical", language: "multi" },
  { term: "meanspo", policy: "ssied", category: "ED_Promotion", severity: "critical", language: "multi" },
  { term: "proana", policy: "ssied", category: "ED_Promotion", severity: "critical", language: "multi" },
  { term: "pro-ana", policy: "ssied", category: "ED_Promotion", severity: "critical", language: "multi" },
  { term: "promia", policy: "ssied", category: "ED_Promotion", severity: "critical", language: "multi" },
  { term: "pro-mia", policy: "ssied", category: "ED_Promotion", severity: "critical", language: "multi" },
  { term: "edtips", policy: "ssied", category: "ED_Promotion", severity: "critical", language: "multi" },
  { term: "anatips", policy: "ssied", category: "ED_Promotion", severity: "critical", language: "multi" },
  { term: "anabuddy", policy: "ssied", category: "ED_Coordination", severity: "critical", language: "multi" },
  { term: "anagoals", policy: "ssied", category: "ED_Promotion", severity: "critical", language: "multi" },
  
  // Viral Events
  { term: "blue whale", policy: "ssied", category: "Viral_Event", severity: "critical", language: "multi" },
  { term: "baleia azul", policy: "ssied", category: "Viral_Event", severity: "critical", language: "pt" },
  { term: "momo challenge", policy: "ssied", category: "Viral_Event", severity: "critical", language: "multi" },
  { term: "jonathan galindo", policy: "ssied", category: "Viral_Event", severity: "critical", language: "multi" },
  
  // ============================================
  // BH - Bullying and Harassment
  // ============================================
  // Calls for Death/SSI
  { term: "kill yourself", policy: "bh", category: "Calls_for_Death", severity: "critical", language: "en" },
  { term: "mata-te", policy: "bh", category: "Calls_for_Death", severity: "critical", language: "pt" },
  { term: "hope you die", policy: "bh", category: "Calls_for_Death", severity: "critical", language: "en" },
  { term: "espero que morra", policy: "bh", category: "Calls_for_Death", severity: "critical", language: "pt" },
  
  // Sexualized Harassment
  { term: "whore", policy: "bh", category: "Sexual_Harassment", severity: "high", language: "en" },
  { term: "puta", policy: "bh", category: "Sexual_Harassment", severity: "high", language: "pt" },
  { term: "slut", policy: "bh", category: "Sexual_Harassment", severity: "high", language: "en" },
  { term: "vadia", policy: "bh", category: "Sexual_Harassment", severity: "high", language: "pt" },
  
  // Dehumanizing Comparisons
  { term: "are rats", policy: "bh", category: "Dehumanizing", severity: "high", language: "en" },
  { term: "são ratos", policy: "bh", category: "Dehumanizing", severity: "high", language: "pt" },
  { term: "are cockroaches", policy: "bh", category: "Dehumanizing", severity: "high", language: "en" },
  { term: "são baratas", policy: "bh", category: "Dehumanizing", severity: "high", language: "pt" },
  { term: "trash", policy: "bh", category: "Dehumanizing", severity: "high", language: "en", requiresContext: true },
  { term: "lixo", policy: "bh", category: "Dehumanizing", severity: "high", language: "pt", requiresContext: true },
  
  // Physical Description Attacks
  { term: "ugly", policy: "bh", category: "Physical_Attack", severity: "mid", language: "en" },
  { term: "feio", policy: "bh", category: "Physical_Attack", severity: "mid", language: "pt" },
  { term: "feia", policy: "bh", category: "Physical_Attack", severity: "mid", language: "pt" },
  { term: "fat", policy: "bh", category: "Physical_Attack", severity: "mid", language: "en", requiresContext: true },
  { term: "gordo", policy: "bh", category: "Physical_Attack", severity: "mid", language: "pt", requiresContext: true },
  { term: "gorda", policy: "bh", category: "Physical_Attack", severity: "mid", language: "pt", requiresContext: true },
  
  // Character Attacks
  { term: "stupid", policy: "bh", category: "Character_Attack", severity: "mid", language: "en" },
  { term: "idiota", policy: "bh", category: "Character_Attack", severity: "mid", language: "pt" },
  { term: "imbecil", policy: "bh", category: "Character_Attack", severity: "mid", language: "pt" },
  { term: "retard", policy: "bh", category: "Character_Attack", severity: "high", language: "en" },
  { term: "retardado", policy: "bh", category: "Character_Attack", severity: "high", language: "pt" },
  
  // ============================================
  // HC - Hateful Conduct
  // ============================================
  { term: "should all die", policy: "hc", category: "Harm_Statement", severity: "critical", language: "en" },
  { term: "deviam morrer", policy: "hc", category: "Harm_Statement", severity: "critical", language: "pt" },
  { term: "são animais", policy: "hc", category: "Dehumanizing", severity: "critical", language: "pt" },
  { term: "are animals", policy: "hc", category: "Dehumanizing", severity: "critical", language: "en" },
  { term: "holocaust didn't happen", policy: "hc", category: "Holocaust_Denial", severity: "critical", language: "en" },
  
  // ============================================
  // CSEAN - Child Safety
  // ============================================
  { term: "csam", policy: "csean", category: "CSAM", severity: "critical", language: "multi" },
  { term: "cheese pizza", policy: "csean", category: "CSAM_Code", severity: "critical", language: "en" },
  { term: "cp", policy: "csean", category: "CSAM_Code", severity: "critical", language: "multi", requiresContext: true },
  { term: "pedo", policy: "csean", category: "Pedophilia", severity: "critical", language: "multi" },
  { term: "map pride", policy: "csean", category: "Pedophilia", severity: "critical", language: "en" },
  { term: "novinha", policy: "csean", category: "Minor_Reference", severity: "high", language: "pt", requiresContext: true },
];

// ============================================
// TEXT UTILITIES
// ============================================

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function hasWord(text: string, word: string): boolean {
  const norm = normalize(text);
  const w = normalize(word);
  if (w.includes(" ")) {
    return norm.includes(w);
  }
  return new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(norm);
}

function detectLanguage(text: string): "pt" | "en" | "multi" {
  const ptPatterns = /\b(você|voce|não|nao|está|são|também|porque|já|obrigado|olá|boa|bom)\b/i;
  const enPatterns = /\b(the|is|are|was|have|has|will|would|could|hello|thank|please)\b/i;
  
  const hasPt = ptPatterns.test(text);
  const hasEn = enPatterns.test(text);
  
  if (hasPt && hasEn) return "multi";
  if (hasPt) return "pt";
  return "en";
}

// ============================================
// KEYWORD DETECTION
// ============================================

function findKeywords(text: string): KeywordMatch[] {
  const found: KeywordMatch[] = [];
  const processedTerms = new Set<string>();

  KEYWORDS_DATABASE.forEach((kw) => {
    if (processedTerms.has(kw.term)) return;
    
    if (hasWord(text, kw.term)) {
      found.push({
        term: kw.term,
        policy: kw.policy,
        category: kw.category,
        severity: kw.severity,
        requiresContext: kw.requiresContext,
      });
      processedTerms.add(kw.term);
    }
  });

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
// EXCEPTION DETECTION
// ============================================

function detectExceptions(text: string): DetectedExceptions {
  const lower = text.toLowerCase();
  const detected: string[] = [];

  const checks = {
    hasSelfDefense: /\b(defesa|defender|proteger|self.?defense|legítima defesa)\b/i.test(lower),
    hasRedemption: /\b(arrependo|desculpa|perdão|sorry|regret|me arrependo)\b/i.test(lower),
    hasCondemning: /\b(é errado|não se deve|condenamos|wrong|condemn|vergonha)\b/i.test(lower),
    hasHypothetical: /\b(se eu fosse|imagine|ficção|filme|série|jogo|game|movie|fiction|hipotético)\b/i.test(lower),
    hasEducational: /\b(educação|ensino|academic|education|study|universidade|escola)\b/i.test(lower),
    hasNewsReporting: /\b(notícia|reportagem|news|report|journalism|jornal|g1|folha)\b/i.test(lower),
    hasArtisticContext: /\b(arte|artístico|música|letra|artistic|lyrics|poesia|poema)\b/i.test(lower),
    hasSatire: /\b(sátira|ironia|piada|satire|joke|parody|meme|comédia)\b/i.test(lower),
    hasEndearingContext: /\b(meu amor|querido|amigo|brincadeira|friend|dear|carinho)\b/i.test(lower),
    hasCriminalAllegation: /\b(polícia|tribunal|police|court|lawsuit|processo|crime)\b/i.test(lower),
    hasBusinessReview: /\b(review|avaliação|estrelas|stars|serviço|atendimento)\b/i.test(lower),
    hasFightSportContext: /\b(mma|ufc|boxe|boxing|luta|fight|wrestling|jiu.?jitsu)\b/i.test(lower),
    hasMedicalContext: /\b(médico|medicina|doctor|medical|health|hospital|tratamento)\b/i.test(lower),
    hasFamilyContext: /\b(filho|filha|bebé|família|son|daughter|baby|family|mãe|pai)\b/i.test(lower),
    hasRecoveryContext: /\b(recuperação|recovery|superando|overcame|em tratamento|sobriety)\b/i.test(lower),
    hasAwarenessContext: /\b(conscientização|awareness|prevenção|prevention|ajuda|help)\b/i.test(lower),
    hasBrickAndMortar: /\b(loja|store|shop|site oficial|official|retail)\b/i.test(lower),
    hasReligiousContext: /\b(ramadan|quaresma|jejum religioso|religious|oração|prayer)\b/i.test(lower),
    hasFictionalContext: /\b(filme|movie|série|series|tv show|novela|livro|book|jogo|game)\b/i.test(lower),
  };

  // Collect detected exceptions
  if (checks.hasSelfDefense) detected.push("Self-defense");
  if (checks.hasRedemption) detected.push("Redemption");
  if (checks.hasCondemning) detected.push("Condemning");
  if (checks.hasHypothetical) detected.push("Hypothetical/Fiction");
  if (checks.hasEducational) detected.push("Educational");
  if (checks.hasNewsReporting) detected.push("News Reporting");
  if (checks.hasArtisticContext) detected.push("Artistic Context");
  if (checks.hasSatire) detected.push("Satire/Humor");
  if (checks.hasEndearingContext) detected.push("Endearing Context");
  if (checks.hasCriminalAllegation) detected.push("Criminal Allegation");
  if (checks.hasBusinessReview) detected.push("Business Review");
  if (checks.hasFightSportContext) detected.push("Fight/Sport Context");
  if (checks.hasMedicalContext) detected.push("Medical Context");
  if (checks.hasFamilyContext) detected.push("Family Context");
  if (checks.hasRecoveryContext) detected.push("Recovery Context");
  if (checks.hasAwarenessContext) detected.push("Awareness/Prevention");
  if (checks.hasBrickAndMortar) detected.push("Brick-and-Mortar");
  if (checks.hasReligiousContext) detected.push("Religious Context");
  if (checks.hasFictionalContext) detected.push("Fictional Context");

  return { ...checks, detected };
}

// ============================================
// POLICY-SPECIFIC CHECKS
// ============================================

function performVIChecks(text: string, keywords: KeywordMatch[]): VIChecks {
  const viKeywords = keywords.filter((k) => k.policy === "vi");
  
  const hasTarget = /\b(te|você|tu|you|him|her|them|ele|ela|eles)\b/i.test(text) || 
                   /[A-Z][a-záàâãéèêíïóôõöúç]{2,}/.test(text) ||
                   /@\w+/.test(text);
  const hasIntent = /\b(vou|vamos|gonna|will|going to|irei|farei)\b/i.test(text);
  const hasTiming = /\b(amanhã|hoje|às?\s*\d|daqui\s+a|tomorrow|today|tonight|agora|now)\b/i.test(text);
  const hasArmament = viKeywords.some((k) => k.category === "Armament") ||
                      /\b(arma|faca|pistola|gun|knife|weapon|espingarda|rifle)\b/i.test(text);
  const hasLocation = /\b(escola|trabalho|casa|escritório|school|work|home|office|igreja|church)\b/i.test(text);
  const hasMethod = viKeywords.some((k) => 
    ["HSV", "HSV_Proxy", "MSV", "Calls_for_Death"].includes(k.category)
  );
  
  const isCredibleThreat = hasTarget && hasIntent && hasMethod && 
                          (hasTiming || hasArmament || hasLocation);

  return { 
    hasTarget, 
    hasIntent, 
    hasTiming, 
    hasArmament, 
    hasLocation, 
    hasMethod, 
    isCredibleThreat,
  };
}

function performSSIEDChecks(text: string, keywords: KeywordMatch[]): SSIEDPreChecks {
  const ssiedKeywords = keywords.filter((k) => k.policy === "ssied");
  
  const hasSuicideContent = ssiedKeywords.some((k) => 
    k.category.startsWith("Suicide_")
  );
  const hasSelfInjuryContent = ssiedKeywords.some((k) => 
    k.category.startsWith("Self_Injury") || k.category.startsWith("SI_")
  );
  const hasEDContent = ssiedKeywords.some((k) => 
    k.category.startsWith("ED_")
  );
  
  const hasPromotionSignals = ssiedKeywords.some((k) => 
    k.category === "ED_Promotion" || k.category === "ED_Coordination" || k.category === "Suicide_Incitement"
  );
  
  const hasViralEvent = ssiedKeywords.some((k) => k.category === "Viral_Event");
  
  // CIS Detection
  const cisHasExplicitIntent = ssiedKeywords.some((k) => 
    k.category === "Suicide_Intent" || k.category === "Suicide_Method"
  ) || /\b(vou me matar|i will kill myself|going to end it|this is goodbye|suicide note|carta de suicídio)\b/i.test(text);
  
  const cisHasCapability = ssiedKeywords.some((k) => 
    k.category === "Suicide_Method"
  ) || /\b(pílulas|pills|arma|gun|corda|rope|ponte|bridge|prédio|building|veneno|poison)\b/i.test(text);
  
  const cisHasImminence = /\b(agora|now|hoje|today|tonight|esta noite|amanhã|tomorrow|daqui a pouco|soon)\b/i.test(text);
  
  const isCIS = cisHasExplicitIntent && cisHasCapability && cisHasImminence;
  
  // ED Signal Type
  let edSignalType: SSIEDPreChecks["edSignalType"] = "none";
  if (hasPromotionSignals) edSignalType = "promotion";
  else if (hasEDContent) edSignalType = "context";
  else if (/\b(dieta|diet|emagrecer|weight loss|fitness)\b/i.test(text)) edSignalType = "benign";

  return {
    hasSuicideContent,
    hasSelfInjuryContent,
    hasEDContent,
    cisHasExplicitIntent,
    cisHasCapability,
    cisHasImminence,
    isCIS,
    hasPromotionSignals,
    hasViralEvent,
    edSignalType,
  };
}

function performBHChecks(text: string, keywords: KeywordMatch[]): BHPreChecks {
  const hasTarget = /\b(te|você|@\w+|tu|seu|sua|you|your)\b/i.test(text);
  
  let targetType: BHPreChecks["targetType"] = "unknown";
  if (/\b(presidente|ministro|celebridade|president|celebrity|famoso|1M|milhão de seguidores)\b/i.test(text)) {
    targetType = "public_figure";
  } else if (/\b(ativista|jornalista|activist|journalist)\b/i.test(text)) {
    targetType = "lspf";
  } else if (/\b(criança|menor|filho|kid|child|minor)\b/i.test(text)) {
    targetType = "private_minor";
  } else if (hasTarget) {
    targetType = "private_adult";
  }

  const hasPurposefulExposure = /@\w+/.test(text);
  
  // Determine attack type and tier
  const bhKeywords = keywords.filter((k) => k.policy === "bh");
  let attackType: string | null = null;
  let tier: BHPreChecks["tier"] = null;
  
  if (bhKeywords.some(k => k.category === "Calls_for_Death")) {
    attackType = "Calls for death";
    tier = 1;
  } else if (bhKeywords.some(k => k.category === "Sexual_Harassment")) {
    attackType = "Sexualized harassment";
    tier = 1;
  } else if (bhKeywords.some(k => k.category === "Dehumanizing")) {
    attackType = "Dehumanizing comparison";
    tier = 2;
  } else if (bhKeywords.some(k => k.category === "Physical_Attack")) {
    attackType = "Negative physical description";
    tier = 2;
  } else if (bhKeywords.some(k => k.category === "Character_Attack")) {
    attackType = "Negative character claim";
    tier = 3;
  }

  return {
    hasTarget,
    targetType,
    hasPurposefulExposure,
    attackType,
    tier,
  };
}

// ============================================
// BUILD PRE-ANALYSIS CONTEXT
// ============================================

function buildPreAnalysisContext(text: string): PreAnalysisContext {
  const detectedKeywords = findKeywords(text);
  const exceptions = detectExceptions(text);
  const language = detectLanguage(text);
  
  // Determine candidate policies from keywords
  const policyCounts: Record<PolicyId, number> = {} as Record<PolicyId, number>;
  detectedKeywords.forEach(kw => {
    policyCounts[kw.policy] = (policyCounts[kw.policy] || 0) + 1;
    // Weight critical keywords more
    if (kw.severity === "critical") {
      policyCounts[kw.policy] += 2;
    }
  });
  
  const candidatePolicies = Object.entries(policyCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([policy]) => policy as PolicyId);
  
  const primaryCandidate = candidatePolicies[0] || null;
  
  // Perform policy-specific checks
  const viChecks = performVIChecks(text, detectedKeywords);
  const ssiedChecks = performSSIEDChecks(text, detectedKeywords);
  const bhChecks = performBHChecks(text, detectedKeywords);
  
  return {
    text,
    detectedKeywords,
    candidatePolicies,
    primaryCandidate,
    exceptions,
    viChecks,
    ssiedChecks,
    bhChecks,
    language,
  };
}

// ============================================
// VALIDATE JSON COMPLETENESS
// ============================================

function isJSONComplete(jsonStr: string): boolean {
  try {
    const parsed = JSON.parse(jsonStr);
    return (
      typeof parsed.action === "string" &&
      Array.isArray(parsed.decisionPath) &&
      typeof parsed.fullLabel === "string" &&
      typeof parsed.confidence === "number" &&
      typeof parsed.reasoning === "string" &&
      parsed.reasoning.length > 5 &&
      typeof parsed.shouldEscalate === "boolean"
    );
  } catch {
    return false;
  }
}

// ============================================
// API HANDLER
// ============================================

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body: AnalyzeRequestBody = await request.json();
    const { text, options = {} } = body;

    // Validate input
    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Texto é obrigatório e deve ser uma string" },
        { status: 400 }
      );
    }

    if (text.length > 10000) {
      return NextResponse.json(
        { error: "Texto excede o limite de 10.000 caracteres" },
        { status: 400 }
      );
    }

    // Get API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key do Gemini não configurada no servidor" },
        { status: 500 }
      );
    }

    // PHASE 1: Pre-Analysis
    const preAnalysis = buildPreAnalysisContext(text);
    
    // Check for immediate escalations (CIS)
    if (preAnalysis.ssiedChecks?.isCIS) {
      console.log("⚠️ CIS detected in pre-analysis - will likely escalate");
    }
    
    // PHASE 2: Build Enhanced Prompt
    const prompt = buildEnhancedPrompt(preAnalysis);

    // Initialize Gemini
    const ai = new GoogleGenAI({ apiKey });

    // Call Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.1,
        maxOutputTokens: 4096,
      },
    });

    let responseText = response.text || "";

    // Remove markdown code blocks
    responseText = responseText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    // Extract JSON
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      console.error("Invalid Gemini response - no JSON found:", responseText.substring(0, 300));
      return NextResponse.json(
        {
          error: "Resposta inválida da IA - não foi possível extrair JSON",
          raw: options.includeDebugInfo ? responseText.substring(0, 500) : undefined,
        },
        { status: 500 }
      );
    }

    const jsonStr = jsonMatch[0];

    // Validate JSON completeness
    if (!isJSONComplete(jsonStr)) {
      console.error("Invalid Gemini response - JSON incomplete:", jsonStr.substring(0, 300));
      return NextResponse.json(
        {
          error: "Resposta da IA foi truncada. Tente novamente.",
          code: "TRUNCATED_RESPONSE",
          raw: options.includeDebugInfo ? jsonStr.substring(0, 500) : undefined,
        },
        { status: 500 }
      );
    }

    let analysis: DecisionTreeResponse;
    try {
      analysis = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return NextResponse.json(
        {
          error: "Erro ao processar resposta da IA",
          raw: options.includeDebugInfo ? jsonStr.substring(0, 500) : undefined,
        },
        { status: 500 }
      );
    }

    // Validate action
    const validatedAction = ["escalate", "label", "no_action"].includes(analysis.action) 
      ? analysis.action 
      : "no_action";

    // Build validated response
    const validatedAnalysis: DecisionTreeResponse = {
      action: validatedAction as "no_action" | "escalate" | "label",
      decisionPath: Array.isArray(analysis.decisionPath) ? analysis.decisionPath : [],
      terminalNodeId: String(analysis.terminalNodeId || "unknown"),
      fullLabel: String(analysis.fullLabel || "Unknown"),
      confidence: Math.max(0, Math.min(100, Number(analysis.confidence) || 0)),
      reasoning: String(analysis.reasoning || "Sem análise disponível"),
      shouldEscalate: Boolean(analysis.shouldEscalate),
      escalationReason: analysis.escalationReason ? String(analysis.escalationReason) : undefined,
    };

    // Calculate processing time
    const processingTime = Date.now() - startTime;

    // Return enhanced response
    return NextResponse.json({
      success: true,
      analysis: validatedAnalysis,
      preAnalysis: {
        keywords: preAnalysis.detectedKeywords,
        candidatePolicies: preAnalysis.candidatePolicies,
        primaryCandidate: preAnalysis.primaryCandidate,
        exceptions: preAnalysis.exceptions.detected,
        viChecks: preAnalysis.viChecks,
        ssiedChecks: preAnalysis.ssiedChecks,
        bhChecks: preAnalysis.bhChecks,
        language: preAnalysis.language,
      },
      processingTime,
      debug: options.includeDebugInfo
        ? {
            promptLength: prompt.length,
            responseLength: responseText?.length || 0,
            model: "gemini-2.5-flash",
            preAnalysisTime: "included",
          }
        : undefined,
    });
  } catch (error: unknown) {
    console.error("Analysis error:", error);
    
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido na análise";
    
    // Handle specific Gemini errors
    if (errorMessage.includes("SAFETY")) {
      return NextResponse.json(
        {
          error: "O conteúdo foi bloqueado pelos filtros de segurança do Gemini",
          code: "SAFETY_BLOCK",
        },
        { status: 400 }
      );
    }

    if (errorMessage.includes("quota") || errorMessage.includes("rate")) {
      return NextResponse.json(
        {
          error: "Limite de requisições da API excedido. Tente novamente em alguns minutos.",
          code: "RATE_LIMIT",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: errorMessage,
        code: "UNKNOWN_ERROR",
      },
      { status: 500 }
    );
  }
}

// ============================================
// GET - Health check
// ============================================

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "CM Policy Hub Analysis API",
    version: "4.0.0",
    features: {
      enhancedPrompt: true,
      preAnalysis: true,
      contextInjection: true,
      policySpecificGlossary: true,
      aiModel: "gemini-2.5-flash",
      maxTokens: 4096,
    },
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
}