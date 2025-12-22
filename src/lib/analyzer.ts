// ============================================
// CM POLICY HUB - ANALYZER
// Sistema de análise multi-policy
// ============================================

import {
  AnalysisResult,
  KeywordMatch,
  PolicyId,
  Severity,
  ActionType,
  PolicyChecks,
  DetectedExceptions,
  VIChecks,
  BHChecks,
  CSEANChecks,
  AdultSexualChecks,
} from "./types";
import { getPolicyById, getPoliciesByPriority, PolicyConfig } from "@/data/policies";

// ============================================
// KEYWORDS DATABASE
// Organized by policy and category
// ============================================

interface KeywordEntry {
  term: string;
  category: string;
  subcategory?: string;
  severity: Severity;
  requiresContext?: boolean;
  contextNotes?: string;
}

type PolicyKeywords = Record<PolicyId, KeywordEntry[]>;

// ============================================
// COMPREHENSIVE KEYWORDS
// Based on converted policies
// ============================================

const KEYWORDS: Partial<PolicyKeywords> = {
  // ============================================
  // CSEAN KEYWORDS
  // ============================================
  csean: [
    // CSAM Codes/Slang
    { term: "cheese pizza", category: "CSAM Solicitation", severity: "critical" },
    { term: "cp", category: "CSAM Solicitation", severity: "critical", requiresContext: true },
    { term: "child porn", category: "CSAM Solicitation", severity: "critical" },
    { term: "kiddie porn", category: "CSAM Solicitation", severity: "critical" },
    { term: "pedo content", category: "CSAM Solicitation", severity: "critical" },
    { term: "map content", category: "CSAM Solicitation", severity: "critical" },
    { term: "pedobait", category: "CSAM Solicitation", severity: "critical" },
    { term: "mapfriendly", category: "CSAM Solicitation", severity: "critical" },
    { term: "teen packs", category: "CSAM Solicitation", severity: "critical" },
    { term: "jailbait", category: "CSAM Solicitation", severity: "critical" },
    { term: "lolita", category: "CSAM Solicitation", severity: "high", requiresContext: true },
    { term: "shota", category: "CSAM Solicitation", severity: "high" },
    { term: "preteen", category: "CSAM Solicitation", severity: "high", requiresContext: true },
    { term: "underage", category: "CSAM Solicitation", severity: "high", requiresContext: true },
    { term: "pizza party", category: "CSAM Solicitation", severity: "high", requiresContext: true },
    
    // Portuguese CSAM terms
    { term: "nudes de menor", category: "CSAM Solicitation", severity: "critical" },
    { term: "fotos de crianças", category: "CSAM Solicitation", severity: "high", requiresContext: true },
    { term: "vídeos de menores", category: "CSAM Solicitation", severity: "high", requiresContext: true },
    { term: "pack teen", category: "CSAM Solicitation", severity: "critical" },
    { term: "conteúdo proibido", category: "CSAM Solicitation", severity: "high", requiresContext: true },
    { term: "pedofilia", category: "Pedophilia Support", severity: "critical" },
    { term: "abuso infantil", category: "Child Abuse", severity: "critical" },
    
    // MAP/Pedophilia terms
    { term: "map pride", category: "Pedophilia Support", severity: "critical" },
    { term: "aam pride", category: "Pedophilia Support", severity: "critical" },
    { term: "map supporter", category: "Pedophilia Support", severity: "critical" },
    { term: "pedobear", category: "Pedophilia Support", severity: "high" },
    
    // Age references (context required)
    { term: "novinha", category: "Age Reference", severity: "mid", requiresContext: true },
    { term: "novinho", category: "Age Reference", severity: "mid", requiresContext: true },
    { term: "criança", category: "Age Reference", severity: "low", requiresContext: true },
    { term: "menor", category: "Age Reference", severity: "low", requiresContext: true },
    { term: "miúda", category: "Age Reference", severity: "low", requiresContext: true },
    { term: "miúdo", category: "Age Reference", severity: "low", requiresContext: true },
    
    // Solicitation signals
    { term: "dm me", category: "Solicitation Signal", severity: "low", requiresContext: true },
    { term: "manda mensagem", category: "Solicitation Signal", severity: "low", requiresContext: true },
    { term: "telegram", category: "Platform Signal", severity: "low", requiresContext: true },
    { term: "wickr", category: "Platform Signal", severity: "mid", requiresContext: true },
    { term: "signal", category: "Platform Signal", severity: "low", requiresContext: true },
  ],

  // ============================================
  // VIOLENCE & INCITEMENT KEYWORDS
  // ============================================
  vi: [
    // High severity - direct threats
    { term: "vou matar", category: "Death Threat", severity: "critical" },
    { term: "vou te matar", category: "Death Threat", severity: "critical" },
    { term: "vai morrer", category: "Death Threat", severity: "critical" },
    { term: "matar", category: "Violence", severity: "high", requiresContext: true },
    { term: "assassinar", category: "Violence", severity: "high" },
    { term: "massacrar", category: "Violence", severity: "high" },
    { term: "exterminar", category: "Violence", severity: "high" },
    { term: "executar", category: "Violence", severity: "high", requiresContext: true },
    { term: "decapitar", category: "Violence", severity: "critical" },
    { term: "esquartejar", category: "Violence", severity: "critical" },
    { term: "esfaquear", category: "Violence", severity: "high" },
    { term: "atirar", category: "Violence", severity: "high", requiresContext: true },
    { term: "explodir", category: "Violence", severity: "high" },
    { term: "bombardear", category: "Violence", severity: "high" },
    
    // English equivalents
    { term: "kill you", category: "Death Threat", severity: "critical" },
    { term: "gonna kill", category: "Death Threat", severity: "critical" },
    { term: "murder", category: "Violence", severity: "high" },
    { term: "massacre", category: "Violence", severity: "high" },
    { term: "slaughter", category: "Violence", severity: "high" },
    { term: "execute", category: "Violence", severity: "high", requiresContext: true },
    { term: "behead", category: "Violence", severity: "critical" },
    { term: "stab", category: "Violence", severity: "high" },
    { term: "shoot", category: "Violence", severity: "high", requiresContext: true },
    { term: "bomb", category: "Violence", severity: "high", requiresContext: true },
    
    // Mid severity
    { term: "bater", category: "Physical Violence", severity: "mid", requiresContext: true },
    { term: "espancar", category: "Physical Violence", severity: "high" },
    { term: "agredir", category: "Physical Violence", severity: "mid" },
    { term: "partir a cara", category: "Physical Violence", severity: "high" },
    { term: "rebentar", category: "Physical Violence", severity: "mid", requiresContext: true },
    { term: "beat", category: "Physical Violence", severity: "mid", requiresContext: true },
    { term: "assault", category: "Physical Violence", severity: "mid" },
    { term: "attack", category: "Physical Violence", severity: "mid", requiresContext: true },
    
    // Incitement
    { term: "matem", category: "Incitement", severity: "critical" },
    { term: "ataquem", category: "Incitement", severity: "high" },
    { term: "destruam", category: "Incitement", severity: "high" },
    { term: "kill them", category: "Incitement", severity: "critical" },
    { term: "attack them", category: "Incitement", severity: "high" },
    
    // Armaments
    { term: "pistola", category: "Armament", severity: "mid", requiresContext: true },
    { term: "arma", category: "Armament", severity: "mid", requiresContext: true },
    { term: "faca", category: "Armament", severity: "mid", requiresContext: true },
    { term: "bomba", category: "Armament", severity: "high", requiresContext: true },
    { term: "explosivo", category: "Armament", severity: "high" },
    { term: "veneno", category: "Armament", severity: "high", requiresContext: true },
    { term: "gun", category: "Armament", severity: "mid", requiresContext: true },
    { term: "knife", category: "Armament", severity: "mid", requiresContext: true },
    { term: "explosive", category: "Armament", severity: "high" },
    { term: "poison", category: "Armament", severity: "high", requiresContext: true },
  ],

  // ============================================
  // BULLYING & HARASSMENT KEYWORDS
  // ============================================
  bh: [
    // Calls for death/SSI
    { term: "mata-te", category: "Calls for Death", severity: "critical" },
    { term: "morre", category: "Calls for Death", severity: "critical" },
    { term: "devias morrer", category: "Calls for Death", severity: "critical" },
    { term: "kill yourself", category: "Calls for Death", severity: "critical" },
    { term: "kys", category: "Calls for Death", severity: "critical" },
    { term: "go die", category: "Calls for Death", severity: "critical" },
    
    // Sexual harassment
    { term: "puta", category: "Sexual Harassment", severity: "high" },
    { term: "vadia", category: "Sexual Harassment", severity: "high" },
    { term: "prostituta", category: "Sexual Harassment", severity: "high" },
    { term: "whore", category: "Sexual Harassment", severity: "high" },
    { term: "slut", category: "Sexual Harassment", severity: "high" },
    
    // Targeted cursing
    { term: "filho da puta", category: "Targeted Cursing", severity: "high" },
    { term: "fdp", category: "Targeted Cursing", severity: "high" },
    { term: "cabrão", category: "Targeted Cursing", severity: "mid" },
    { term: "cabra", category: "Targeted Cursing", severity: "mid" },
    { term: "idiota", category: "Targeted Cursing", severity: "mid" },
    { term: "imbecil", category: "Targeted Cursing", severity: "mid" },
    { term: "retardado", category: "Targeted Cursing", severity: "high" },
    { term: "motherfucker", category: "Targeted Cursing", severity: "high" },
    { term: "asshole", category: "Targeted Cursing", severity: "mid" },
    { term: "bitch", category: "Targeted Cursing", severity: "mid" },
    { term: "retard", category: "Targeted Cursing", severity: "high" },
    
    // Dehumanizing
    { term: "animal", category: "Dehumanizing", severity: "mid", requiresContext: true },
    { term: "porco", category: "Dehumanizing", severity: "mid" },
    { term: "verme", category: "Dehumanizing", severity: "mid" },
    { term: "lixo", category: "Dehumanizing", severity: "mid" },
    { term: "escumalha", category: "Dehumanizing", severity: "mid" },
    { term: "pig", category: "Dehumanizing", severity: "mid" },
    { term: "worm", category: "Dehumanizing", severity: "mid" },
    { term: "trash", category: "Dehumanizing", severity: "mid", requiresContext: true },
    { term: "scum", category: "Dehumanizing", severity: "mid" },
    
    // Negative character
    { term: "mentiroso", category: "Negative Character", severity: "low" },
    { term: "ladrão", category: "Negative Character", severity: "mid" },
    { term: "criminoso", category: "Negative Character", severity: "mid" },
    { term: "pedófilo", category: "Negative Character", severity: "high" },
    { term: "violador", category: "Negative Character", severity: "high" },
    { term: "liar", category: "Negative Character", severity: "low" },
    { term: "thief", category: "Negative Character", severity: "mid" },
    { term: "criminal", category: "Negative Character", severity: "mid" },
    { term: "pedophile", category: "Negative Character", severity: "high" },
    { term: "rapist", category: "Negative Character", severity: "high" },
    
    // Negative physical
    { term: "gordo", category: "Negative Physical", severity: "low", requiresContext: true },
    { term: "feio", category: "Negative Physical", severity: "low" },
    { term: "horrível", category: "Negative Physical", severity: "low" },
    { term: "nojento", category: "Negative Physical", severity: "mid" },
    { term: "fat", category: "Negative Physical", severity: "low", requiresContext: true },
    { term: "ugly", category: "Negative Physical", severity: "low" },
    { term: "disgusting", category: "Negative Physical", severity: "mid" },
  ],

  // ============================================
  // ADULT SEXUAL EXPLOITATION (ASE)
  // ============================================
  ase: [
    // NCII terms
    { term: "nudes vazados", category: "NCII", severity: "high" },
    { term: "leaked nudes", category: "NCII", severity: "high" },
    { term: "revenge porn", category: "NCII", severity: "high" },
    { term: "exposed", category: "NCII", severity: "mid", requiresContext: true },
    
    // Sextortion
    { term: "sextortion", category: "Sextortion", severity: "critical" },
    { term: "envia nudes ou", category: "Sextortion", severity: "critical" },
    { term: "send nudes or", category: "Sextortion", severity: "critical" },
    
    // Creepshots
    { term: "creepshot", category: "Creepshots", severity: "high" },
    { term: "upskirt", category: "Creepshots", severity: "high" },
    { term: "downblouse", category: "Creepshots", severity: "high" },
    
    // NCST
    { term: "violação", category: "NCST", severity: "critical", requiresContext: true },
    { term: "estupro", category: "NCST", severity: "critical" },
    { term: "rape", category: "NCST", severity: "critical", requiresContext: true },
    { term: "sexual assault", category: "NCST", severity: "critical" },
  ],

  // ============================================
  // SEXUAL SOLICITATION (SSPx)
  // ============================================
  sspx: [
    // Prostitution
    { term: "serviços sexuais", category: "Prostitution", severity: "high" },
    { term: "sexual services", category: "Prostitution", severity: "high" },
    { term: "acompanhante", category: "Prostitution", severity: "mid", requiresContext: true },
    { term: "escort", category: "Prostitution", severity: "mid", requiresContext: true },
    { term: "garota de programa", category: "Prostitution", severity: "high" },
    { term: "massagem final feliz", category: "Prostitution", severity: "high" },
    { term: "happy ending massage", category: "Prostitution", severity: "high" },
    
    // Solicitation
    { term: "quero sexo", category: "Sexual Solicitation", severity: "high" },
    { term: "procuro sexo", category: "Sexual Solicitation", severity: "high" },
    { term: "looking for sex", category: "Sexual Solicitation", severity: "high" },
    { term: "dtf", category: "Sexual Solicitation", severity: "high" },
    { term: "hookup", category: "Sexual Solicitation", severity: "mid", requiresContext: true },
    
    // Adult platforms
    { term: "onlyfans", category: "Adult Platform", severity: "low", requiresContext: true },
    { term: "fansly", category: "Adult Platform", severity: "low", requiresContext: true },
    { term: "manyvids", category: "Adult Platform", severity: "mid" },
    { term: "pornhub", category: "Adult Platform", severity: "mid" },
    
    // Explicit language
    { term: "foder", category: "Explicit Language", severity: "mid", requiresContext: true },
    { term: "fuck", category: "Explicit Language", severity: "mid", requiresContext: true },
    { term: "chupar", category: "Explicit Language", severity: "mid", requiresContext: true },
    { term: "suck", category: "Explicit Language", severity: "mid", requiresContext: true },
  ],

  // ============================================
  // ADULT NUDITY (ANSA)
  // ============================================
  ansa: [
    // Nudity terms (context required for most)
    { term: "nu", category: "Nudity", severity: "low", requiresContext: true },
    { term: "nua", category: "Nudity", severity: "low", requiresContext: true },
    { term: "nude", category: "Nudity", severity: "low", requiresContext: true },
    { term: "naked", category: "Nudity", severity: "low", requiresContext: true },
    { term: "mamilos", category: "Body Parts", severity: "low", requiresContext: true },
    { term: "nipples", category: "Body Parts", severity: "low", requiresContext: true },
    { term: "genitais", category: "Body Parts", severity: "mid", requiresContext: true },
    { term: "genitals", category: "Body Parts", severity: "mid", requiresContext: true },
    { term: "pénis", category: "Body Parts", severity: "mid", requiresContext: true },
    { term: "penis", category: "Body Parts", severity: "mid", requiresContext: true },
    { term: "vagina", category: "Body Parts", severity: "mid", requiresContext: true },
    
    // Sexual activity
    { term: "sexo", category: "Sexual Activity", severity: "mid", requiresContext: true },
    { term: "sex", category: "Sexual Activity", severity: "mid", requiresContext: true },
    { term: "oral", category: "Sexual Activity", severity: "mid", requiresContext: true },
    { term: "anal", category: "Sexual Activity", severity: "mid", requiresContext: true },
    { term: "penetração", category: "Sexual Activity", severity: "mid" },
    { term: "penetration", category: "Sexual Activity", severity: "mid" },
  ],
};

// ============================================
// TEXT NORMALIZATION
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
  // Handle multi-word phrases and single words
  if (w.includes(" ")) {
    return norm.includes(w);
  }
  return new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(norm);
}

// ============================================
// KEYWORD DETECTION
// ============================================

function findKeywords(text: string): KeywordMatch[] {
  const found: KeywordMatch[] = [];
  const processedTerms = new Set<string>();

  // Check all policy keywords
  Object.entries(KEYWORDS).forEach(([policyId, keywords]) => {
    if (!keywords) return;
    
    keywords.forEach((kw) => {
      if (processedTerms.has(kw.term)) return;
      
      if (hasWord(text, kw.term)) {
        found.push({
          term: kw.term,
          policy: policyId as PolicyId,
          category: kw.category,
          subcategory: kw.subcategory,
          severity: kw.severity,
          requiresContext: kw.requiresContext,
          contextNotes: kw.contextNotes,
        });
        processedTerms.add(kw.term);
      }
    });
  });

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
// CONTEXT DETECTION
// ============================================

function detectExceptions(text: string): DetectedExceptions {
  const lower = text.toLowerCase();
  const detected: string[] = [];

  // General exceptions
  const hasSelfDefense = /\b(defesa|defender|proteger|atacou-me|atacou primeiro|self.?defense|protect myself)\b/i.test(lower);
  const hasRedemption = /\b(arrependo|desculpa|perdão|não devia|erro meu|sorry|regret|apologize)\b/i.test(lower);
  const hasCondemning = /\b(é errado|não se deve|condenamos|repudiamos|contra a violência|wrong|condemn|oppose)\b/i.test(lower);
  const hasHypothetical = /\b(se eu fosse|imagine|hipótese|ficção|personagem|filme|série|jogo|game|movie|fiction|hypothetical|if i were)\b/i.test(lower);
  const hasEducational = /\b(educação|ensino|aprender|estudo|academic|education|learn|study|research)\b/i.test(lower);
  const hasNewsReporting = /\b(notícia|reportagem|jornalismo|news|report|journalism|breaking)\b/i.test(lower);
  const hasArtisticContext = /\b(arte|artístico|música|letra|poema|artistic|art|lyrics|poem|creative)\b/i.test(lower);
  const hasSatire = /\b(sátira|ironia|piada|humor|satire|irony|joke|parody)\b/i.test(lower);

  // B&H specific
  const hasEndearingContext = /\b(meu amor|querido|amigo|brincadeira|joke|friend|dear|babe)\b/i.test(lower);
  const hasCriminalAllegation = /\b(polícia|tribunal|processo|crime|acusação|police|court|lawsuit|criminal)\b/i.test(lower);
  const hasBusinessReview = /\b(review|avaliação|estrelas|stars|serviço|produto|service|product)\b/i.test(lower);
  const hasFightSportContext = /\b(mma|ufc|boxe|boxing|luta|fight|wrestling|knockout)\b/i.test(lower);

  // CSEAN specific
  const hasMedicalContext = /\b(médico|medicina|pediatra|doctor|medical|pediatric|health)\b/i.test(lower);
  const hasFamilyContext = /\b(filho|filha|bebé|família|son|daughter|baby|family|parent)\b/i.test(lower);

  // Collect detected exceptions
  if (hasSelfDefense) detected.push("Self-defense");
  if (hasRedemption) detected.push("Redemption");
  if (hasCondemning) detected.push("Condemning");
  if (hasHypothetical) detected.push("Hypothetical/Fiction");
  if (hasEducational) detected.push("Educational");
  if (hasNewsReporting) detected.push("News Reporting");
  if (hasArtisticContext) detected.push("Artistic Context");
  if (hasSatire) detected.push("Satire/Humor");
  if (hasEndearingContext) detected.push("Endearing Context");
  if (hasCriminalAllegation) detected.push("Criminal Allegation");
  if (hasBusinessReview) detected.push("Business Review");
  if (hasFightSportContext) detected.push("Fight/Sport Context");
  if (hasMedicalContext) detected.push("Medical Context");
  if (hasFamilyContext) detected.push("Family Context");

  return {
    hasSelfDefense,
    hasRedemption,
    hasCondemning,
    hasHypothetical,
    hasEducational,
    hasNewsReporting,
    hasArtisticContext,
    hasSatire,
    hasEndearingContext,
    hasCriminalAllegation,
    hasBusinessReview,
    hasFightSportContext,
    hasMedicalContext,
    hasFamilyContext,
    detected,
  };
}

// ============================================
// POLICY-SPECIFIC CHECKS
// ============================================

function performVIChecks(text: string, keywords: KeywordMatch[]): VIChecks {
  const hasTarget = /\b(te|você|tu|voce|you|him|her|them)\b/i.test(text) || 
                   /[A-Z][a-záàâãéèêíïóôõöúç]{2,}/.test(text);
  const hasIntent = /\b(vou|vamos|gonna|will|going to)\s+(te\s+)?/i.test(text);
  const hasTiming = /\b(amanhã|hoje|às?\s*\d|daqui\s+a|esta\s+noite|tomorrow|today|tonight|at\s+\d)\b/i.test(text);
  const hasArmament = keywords.some((k) => k.category === "Armament");
  const hasLocation = /\b(escola|trabalho|casa|escritório|school|work|home|office|church|mall)\b/i.test(text);
  const hasMethod = keywords.some((k) => ["Violence", "Physical Violence", "Death Threat"].includes(k.category));
  
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

function performBHChecks(text: string, keywords: KeywordMatch[]): BHChecks {
  const hasIdentifiableTarget = /\b(te|você|@\w+|tu)\b/i.test(text) || 
                                /[A-Z][a-záàâãéèêíïóôõöúç]{2,}/.test(text);
  
  // Simplified target type detection
  let targetType: BHChecks["targetType"] = "unknown";
  if (/\b(presidente|ministro|celebridade|famoso|president|minister|celebrity|famous)\b/i.test(text)) {
    targetType = "public_figure";
  } else if (/\b(criança|menor|filho|kid|child|minor)\b/i.test(text)) {
    targetType = "private_minor";
  } else if (hasIdentifiableTarget) {
    targetType = "private_adult";
  }

  const hasNameFaceMatch = false; // Requires image analysis
  const hasPurposefulExposure = /@\w+/.test(text); // Tagging
  const hasSelfReport = false; // Requires report context
  const isEndearingContext = /\b(meu amor|querido|amigo|brincadeira|joke|friend|dear)\b/i.test(text);
  const isCriminalAllegation = /\b(polícia|tribunal|processo|police|court|lawsuit)\b/i.test(text);
  const isBusinessReview = /\b(review|avaliação|estrelas|stars|serviço)\b/i.test(text);

  return {
    hasIdentifiableTarget,
    targetType,
    hasNameFaceMatch,
    hasPurposefulExposure,
    hasSelfReport,
    isEndearingContext,
    isCriminalAllegation,
    isBusinessReview,
  };
}

function performCSEANChecks(text: string, keywords: KeywordMatch[]): CSEANChecks {
  const cseanKeywords = keywords.filter((k) => k.policy === "csean");
  
  const hasMinorPresent = /\b(criança|menor|miúdo|miúda|kid|child|minor|teen|adolescente|novinha|novinho)\b/i.test(text);
  
  // Age category detection
  let ageCategory: CSEANChecks["ageCategory"] = "unknown";
  if (/\b(bebé|baby|infant|recém.?nascido|newborn)\b/i.test(text)) {
    ageCategory = "baby";
  } else if (/\b(criança pequena|toddler|2\s*anos?|3\s*anos?)\b/i.test(text)) {
    ageCategory = "toddler";
  } else if (hasMinorPresent) {
    ageCategory = "minor";
  }

  const isRealOrNonReal: CSEANChecks["isRealOrNonReal"] = 
    /\b(cartoon|anime|desenho|drawing|ai.?generated|fictional)\b/i.test(text) ? "non_real" : "unknown";

  const hasCSAMIndicators = cseanKeywords.some((k) => 
    ["CSAM Solicitation", "Pedophilia Support"].includes(k.category)
  );
  
  const hasSolicitationSignals = cseanKeywords.some((k) => 
    ["Solicitation Signal", "Platform Signal"].includes(k.category)
  ) && hasMinorPresent;

  const hasIICElements = /\b(encontrar|meet|dm|mensagem privada|private message)\b/i.test(text) && hasMinorPresent;

  const hasSexualizationSignals = /\b(sexy|hot|gostosa|gostoso|deliciosa|yummy)\b/i.test(text) && hasMinorPresent;

  const isExploitativeContent = hasCSAMIndicators || 
    (hasSolicitationSignals && hasMinorPresent) ||
    (hasSexualizationSignals && hasMinorPresent);

  return {
    hasMinorPresent,
    ageCategory,
    isRealOrNonReal,
    hasCSAMIndicators,
    hasSolicitationSignals,
    hasIICElements,
    hasSexualizationSignals,
    isExploitativeContent,
  };
}

function performAdultSexualChecks(text: string, keywords: KeywordMatch[]): AdultSexualChecks {
  const sexualKeywords = keywords.filter((k) => 
    ["ansa", "ase", "sspx"].includes(k.policy)
  );

  const hasExplicitNudity = sexualKeywords.some((k) => 
    k.category === "Body Parts" && k.severity !== "low"
  );
  const hasImplicitNudity = sexualKeywords.some((k) => 
    k.category === "Nudity"
  );
  const hasSexualActivity = sexualKeywords.some((k) => 
    k.category === "Sexual Activity"
  );
  const hasExploitationIndicators = keywords.some((k) => 
    k.policy === "ase"
  );
  const hasSolicitationSignals = keywords.some((k) => 
    k.policy === "sspx" && ["Prostitution", "Sexual Solicitation"].includes(k.category)
  );
  const hasConsentIndicators = /\b(consensual|consent|acordo|willing)\b/i.test(text);
  const isCommercialContent = /\b(vendo|selling|buy|comprar|€|\$|onlyfans|fansly)\b/i.test(text);

  let contextType: AdultSexualChecks["contextType"] = "unknown";
  if (/\b(arte|art|artistic|museum)\b/i.test(text)) contextType = "artistic";
  else if (/\b(médico|medical|health|educação)\b/i.test(text)) contextType = "educational";
  else if (/\b(notícia|news|report)\b/i.test(text)) contextType = "news";
  else if (isCommercialContent) contextType = "commercial";

  return {
    hasExplicitNudity,
    hasImplicitNudity,
    hasSexualActivity,
    hasExploitationIndicators,
    hasSolicitationSignals,
    hasConsentIndicators,
    isCommercialContent,
    contextType,
  };
}

// ============================================
// DETERMINE PRIMARY POLICY & ACTION
// ============================================

interface PolicyDetermination {
  primaryPolicy: PolicyId | null;
  primaryPolicyName: string | null;
  detectedPolicies: {
    policy: PolicyId;
    policyName: string;
    confidence: number;
    categories: string[];
  }[];
  action: ActionType;
  label: string | null;
  labelPath: string[];
  shouldEscalate: boolean;
  escalationReason?: string;
  confidence: number;
}

function determinePolicyAndAction(
  keywords: KeywordMatch[],
  checks: PolicyChecks,
  exceptions: DetectedExceptions
): PolicyDetermination {
  const hasException = exceptions.detected.length > 0;
  
  // Group keywords by policy
  const policyGroups = new Map<PolicyId, KeywordMatch[]>();
  keywords.forEach((kw) => {
    const existing = policyGroups.get(kw.policy) || [];
    existing.push(kw);
    policyGroups.set(kw.policy, existing);
  });

  // Build detected policies list
  const detectedPolicies: PolicyDetermination["detectedPolicies"] = [];
  policyGroups.forEach((kws, policyId) => {
    const policy = getPolicyById(policyId);
    if (policy) {
      const categories = [...new Set(kws.map((k) => k.category))];
      const maxSeverity = kws.reduce((max, kw) => {
        const severityOrder: Record<Severity, number> = { critical: 5, high: 4, mid: 3, low: 2, info: 1 };
        return severityOrder[kw.severity] > severityOrder[max] ? kw.severity : max;
      }, "info" as Severity);
      
      let confidence = 50;
      if (maxSeverity === "critical") confidence = 90;
      else if (maxSeverity === "high") confidence = 75;
      else if (maxSeverity === "mid") confidence = 60;
      
      if (hasException) confidence -= 20;
      
      detectedPolicies.push({
        policy: policyId,
        policyName: policy.name,
        confidence: Math.max(0, Math.min(100, confidence)),
        categories,
      });
    }
  });

  // Sort by policy priority
  const sortedPolicies = getPoliciesByPriority();
  detectedPolicies.sort((a, b) => {
    const aPriority = sortedPolicies.findIndex((p) => p.id === a.policy);
    const bPriority = sortedPolicies.findIndex((p) => p.id === b.policy);
    return aPriority - bPriority;
  });

  // Determine primary policy
  let primaryPolicy: PolicyId | null = null;
  let primaryPolicyName: string | null = null;
  let action: ActionType = "no_action";
  let label: string | null = null;
  let labelPath: string[] = [];
  let shouldEscalate = false;
  let escalationReason: string | undefined;
  let confidence = 0;

  if (detectedPolicies.length > 0 && !hasException) {
    const primary = detectedPolicies[0];
    primaryPolicy = primary.policy;
    primaryPolicyName = primary.policyName;
    confidence = primary.confidence;

    // CSEAN - Always highest priority
    if (primaryPolicy === "csean" && checks.csean?.isExploitativeContent) {
      shouldEscalate = true;
      escalationReason = "CSAM/Exploitative content detected";
      action = "escalate";
      label = "ESCALATE > CSEAN > CSAM";
      labelPath = ["ESCALATE", "CSEAN", "CSAM"];
      confidence = 95;
    }
    // Violence - Check for credible threat
    else if (primaryPolicy === "vi") {
      if (checks.vi?.isCredibleThreat) {
        shouldEscalate = true;
        escalationReason = "Credible threat: Target + Intent + Method + (Timing/Armament/Location)";
        action = "escalate";
        label = "ESCALATE > V&I > Credible Threat";
        labelPath = ["ESCALATE", "V&I", "Credible Threat"];
        confidence = 90;
      } else {
        action = "label";
        const category = primary.categories[0] || "Violence";
        label = `LABEL > V&I > ${category}`;
        labelPath = ["LABEL", "V&I", category];
      }
    }
    // B&H
    else if (primaryPolicy === "bh") {
      const hasCallsForDeath = keywords.some((k) => k.category === "Calls for Death");
      if (hasCallsForDeath) {
        shouldEscalate = true;
        escalationReason = "Calls for death/suicide";
        action = "escalate";
        label = "ESCALATE > B&H > Calls for Death";
        labelPath = ["ESCALATE", "B&H", "Calls for Death"];
        confidence = 85;
      } else {
        action = "label";
        const category = primary.categories[0] || "Harassment";
        label = `LABEL > B&H > ${category}`;
        labelPath = ["LABEL", "B&H", category];
      }
    }
    // ASE - Sexual Exploitation
    else if (primaryPolicy === "ase") {
      const hasSextortion = keywords.some((k) => k.category === "Sextortion");
      if (hasSextortion) {
        shouldEscalate = true;
        escalationReason = "Sextortion detected";
        action = "escalate";
        label = "ESCALATE > ASE > Sextortion";
        labelPath = ["ESCALATE", "ASE", "Sextortion"];
        confidence = 90;
      } else {
        action = "label";
        const category = primary.categories[0] || "Sexual Exploitation";
        label = `LABEL > ASE > ${category}`;
        labelPath = ["LABEL", "ASE", category];
      }
    }
    // SSPx - Sexual Solicitation
    else if (primaryPolicy === "sspx") {
      action = "label";
      const category = primary.categories[0] || "Sexual Solicitation";
      label = `LABEL > SSPx > ${category}`;
      labelPath = ["LABEL", "SSPx", category];
    }
    // ANSA - Adult Nudity
    else if (primaryPolicy === "ansa") {
      action = "label";
      const category = primary.categories[0] || "Adult Nudity";
      label = `LABEL > ANSA > ${category}`;
      labelPath = ["LABEL", "ANSA", category];
    }
    // Default
    else {
      action = "label";
      label = `LABEL > ${primaryPolicy.toUpperCase()}`;
      labelPath = ["LABEL", primaryPolicy.toUpperCase()];
    }
  }

  // Reduce confidence for exceptions
  if (hasException && confidence > 0) {
    confidence = Math.max(20, confidence - 30);
    action = "no_action";
    label = `EXCEÇÃO DETECTADA: ${exceptions.detected.join(", ")}`;
    labelPath = ["NO ACTION", "Exception Detected"];
    shouldEscalate = false;
  }

  return {
    primaryPolicy,
    primaryPolicyName,
    detectedPolicies,
    action,
    label,
    labelPath,
    shouldEscalate,
    escalationReason,
    confidence,
  };
}

// ============================================
// MAIN ANALYSIS FUNCTION
// ============================================

export function analyzeContent(text: string): Omit<AnalysisResult, "id" | "text" | "timestamp" | "aiAnalysis" | "language" | "processingTime"> {
  const startTime = performance.now();
  
  // Find keywords
  const keywords = findKeywords(text);
  
  // Detect exceptions
  const exceptions = detectExceptions(text);
  
  // Perform policy-specific checks
  const checks: PolicyChecks = {
    vi: performVIChecks(text, keywords),
    bh: performBHChecks(text, keywords),
    csean: performCSEANChecks(text, keywords),
    adultSexual: performAdultSexualChecks(text, keywords),
  };
  
  // Determine policy and action
  const determination = determinePolicyAndAction(keywords, checks, exceptions);
  
  // Calculate confidence breakdown
  const keywordConfidence = keywords.length > 0 ? Math.min(40 + keywords.length * 10, 60) : 0;
  const contextConfidence = exceptions.detected.length > 0 ? -20 : 20;
  
  return {
    keywords,
    primaryPolicy: determination.primaryPolicy,
    primaryPolicyName: determination.primaryPolicyName,
    detectedPolicies: determination.detectedPolicies,
    action: determination.action,
    label: determination.label,
    labelPath: determination.labelPath,
    shouldEscalate: determination.shouldEscalate,
    escalationReason: determination.escalationReason,
    confidence: determination.confidence,
    confidenceBreakdown: {
      keywordMatch: keywordConfidence,
      contextAnalysis: contextConfidence,
      aiAdjustment: 0,
    },
    checks,
    exceptions,
  };
}

// ============================================
// MERGE WITH AI ANALYSIS
// ============================================

export interface GeminiAnalysis {
  hasViolation: boolean;
  policy: PolicyId | null;
  policyName: string | null;
  category: string | null;
  subcategory?: string | null;
  severity: Severity | null;
  shouldEscalate: boolean;
  confidence: number;
  reasoning: string;
  suggestedLabel: string | null;
  suggestedAction: ActionType;
  exceptionsDetected?: string[];
  ambiguityNotes?: string;
}

export function mergeWithAIAnalysis(
  baseAnalysis: Omit<AnalysisResult, "id" | "text" | "timestamp" | "language" | "processingTime">,
  aiAnalysis: GeminiAnalysis
): Omit<AnalysisResult, "id" | "text" | "timestamp" | "language" | "processingTime"> {
  
  const mergedConfidence = Math.round(
    (baseAnalysis.confidence * 0.4) + (aiAnalysis.confidence * 0.6)
  );

  // CRITICAL: If either local OR AI says escalate, the result MUST be escalate
  const shouldEscalate = aiAnalysis.shouldEscalate || baseAnalysis.shouldEscalate;
  
  // If we're escalating, action must be "escalate" regardless of AI suggestion
  let finalAction = aiAnalysis.suggestedAction || baseAnalysis.action;
  let finalLabel = aiAnalysis.suggestedLabel || baseAnalysis.label;
  let finalLabelPath = aiAnalysis.suggestedLabel
    ? aiAnalysis.suggestedLabel.split(" > ")
    : baseAnalysis.labelPath;

  // Override if local analysis detected escalation but AI didn't
  if (baseAnalysis.shouldEscalate && !aiAnalysis.shouldEscalate) {
    finalAction = "escalate";
    finalLabel = baseAnalysis.label; // Use local label which should have ESCALATE
    finalLabelPath = baseAnalysis.labelPath;
  }

  // Ensure consistency: if shouldEscalate is true, action must be escalate
  if (shouldEscalate) {
    finalAction = "escalate";
    if (!finalLabel?.startsWith("ESCALATE")) {
      // Convert label to escalate format
      const policy = aiAnalysis.policy || baseAnalysis.primaryPolicy || "V&I";
      const category = aiAnalysis.category || "Credible Threat";
      finalLabel = `ESCALATE > ${policy.toUpperCase()} > ${category}`;
      finalLabelPath = ["ESCALATE", policy.toUpperCase(), category];
    }
  }

  return {
    ...baseAnalysis,
    primaryPolicy: aiAnalysis.policy || baseAnalysis.primaryPolicy,
    primaryPolicyName: aiAnalysis.policyName || baseAnalysis.primaryPolicyName,
    action: finalAction,
    shouldEscalate,
    escalationReason: shouldEscalate 
      ? (baseAnalysis.escalationReason || aiAnalysis.reasoning || "Credible threat detected")
      : undefined,
    confidence: mergedConfidence,
    label: finalLabel,
    labelPath: finalLabelPath,
    confidenceBreakdown: {
      ...baseAnalysis.confidenceBreakdown,
      aiAdjustment: aiAnalysis.confidence - baseAnalysis.confidence,
    },
    aiAnalysis: {
      used: true,
      model: "gemini-2.5-flash",
      reasoning: [aiAnalysis.reasoning],
      suggestedPolicy: aiAnalysis.policy,
      suggestedLabel: aiAnalysis.suggestedLabel,
      suggestedAction: aiAnalysis.suggestedAction,
      adjustedConfidence: aiAnalysis.confidence,
      ambiguityNotes: aiAnalysis.ambiguityNotes ? [aiAnalysis.ambiguityNotes] : undefined,
    },
  };
}

export default analyzeContent;