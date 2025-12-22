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

  // ============================================
  // CHPC - Coordinating Harm and Promoting Crime
  // ============================================
  chpc: [
    // === HARM AGAINST ANIMALS ===
    // Physical harm
    { term: "maus tratos a animais", category: "Animal Harm", severity: "high" },
    { term: "maltratar animal", category: "Animal Harm", severity: "high" },
    { term: "abusar de animal", category: "Animal Harm", severity: "high" },
    { term: "torturar animal", category: "Animal Harm", severity: "high" },
    { term: "animal abuse", category: "Animal Harm", severity: "high" },
    { term: "animal cruelty", category: "Animal Harm", severity: "high" },
    { term: "torture animal", category: "Animal Harm", severity: "high" },
    
    // Staged animal fights
    { term: "rinha de galo", category: "Staged Animal Fights", severity: "high" },
    { term: "rinha de cães", category: "Staged Animal Fights", severity: "high" },
    { term: "briga de galo", category: "Staged Animal Fights", severity: "high" },
    { term: "cockfighting", category: "Staged Animal Fights", severity: "high" },
    { term: "dogfighting", category: "Staged Animal Fights", severity: "high" },
    { term: "animal fight", category: "Staged Animal Fights", severity: "high" },
    { term: "animal vs animal", category: "Staged Animal Fights", severity: "mid", requiresContext: true },
    { term: "fighting pit", category: "Staged Animal Fights", severity: "high" },
    
    // Fake rescues
    { term: "fake rescue", category: "Fake Animal Rescue", severity: "high" },
    { term: "staged rescue", category: "Fake Animal Rescue", severity: "high" },
    { term: "resgate falso", category: "Fake Animal Rescue", severity: "high" },
    
    // === HARM AGAINST PROPERTY ===
    // Vandalism
    { term: "vandalismo", category: "Vandalism", severity: "mid" },
    { term: "vandalizar", category: "Vandalism", severity: "mid" },
    { term: "destruir propriedade", category: "Vandalism", severity: "mid" },
    { term: "destroy property", category: "Vandalism", severity: "mid" },
    { term: "queimar estátua", category: "Vandalism", severity: "high" },
    { term: "burn statue", category: "Vandalism", severity: "high" },
    
    // Theft
    { term: "como roubar", category: "Theft", severity: "high" },
    { term: "how to steal", category: "Theft", severity: "high" },
    { term: "tutorial roubo", category: "Theft", severity: "high" },
    { term: "theft tutorial", category: "Theft", severity: "high" },
    { term: "vender roubado", category: "Theft", severity: "high" },
    { term: "sell stolen", category: "Theft", severity: "high" },
    { term: "comprar roubado", category: "Theft", severity: "high" },
    { term: "buy stolen", category: "Theft", severity: "high" },
    { term: "shoplifting", category: "Theft", severity: "mid" },
    { term: "furto em loja", category: "Theft", severity: "mid" },
    
    // === HARM AGAINST PEOPLE ===
    // Outing
    { term: "expor identidade", category: "Outing", severity: "high" },
    { term: "revelar identidade", category: "Outing", severity: "high" },
    { term: "expose identity", category: "Outing", severity: "high" },
    { term: "out someone", category: "Outing", severity: "high" },
    { term: "undercover cop", category: "Outing", severity: "high" },
    { term: "policial disfarçado", category: "Outing", severity: "high" },
    { term: "agente infiltrado", category: "Outing", severity: "high" },
    
    // Swatting
    { term: "swatting", category: "Swatting", severity: "high" },
    { term: "swat call", category: "Swatting", severity: "high" },
    { term: "trote policial", category: "Swatting", severity: "high" },
    { term: "fake emergency call", category: "Swatting", severity: "high" },
    { term: "denúncia falsa polícia", category: "Swatting", severity: "high" },
    
    // High-risk viral challenges
    { term: "fire challenge", category: "High-Risk Challenge", severity: "critical" },
    { term: "desafio do fogo", category: "High-Risk Challenge", severity: "critical" },
    { term: "tide pod challenge", category: "High-Risk Challenge", severity: "critical" },
    { term: "blackout challenge", category: "High-Risk Challenge", severity: "critical" },
    { term: "desafio do apagão", category: "High-Risk Challenge", severity: "critical" },
    { term: "skull breaker", category: "High-Risk Challenge", severity: "critical" },
    { term: "choking game", category: "High-Risk Challenge", severity: "critical" },
    { term: "jogo da asfixia", category: "High-Risk Challenge", severity: "critical" },
    
    // Mid-risk stunts
    { term: "car surfing", category: "Mid-Risk Stunt", severity: "high" },
    { term: "surfar no carro", category: "Mid-Risk Stunt", severity: "high" },
    { term: "train surfing", category: "Mid-Risk Stunt", severity: "high" },
    
    // Communicable diseases
    { term: "espalhar covid", category: "Communicable Diseases", severity: "high" },
    { term: "spread covid", category: "Communicable Diseases", severity: "high" },
    { term: "infectar propositalmente", category: "Communicable Diseases", severity: "high" },
    { term: "infect on purpose", category: "Communicable Diseases", severity: "high" },
    { term: "transmitir hiv", category: "Communicable Diseases", severity: "high" },
    { term: "passar aids", category: "Communicable Diseases", severity: "high" },
    
    // === VOTING/CENSUS INTERFERENCE ===
    { term: "comprar voto", category: "Voter Fraud", severity: "high" },
    { term: "buy vote", category: "Voter Fraud", severity: "high" },
    { term: "vender voto", category: "Voter Fraud", severity: "high" },
    { term: "sell vote", category: "Voter Fraud", severity: "high" },
    { term: "votar duas vezes", category: "Voter Fraud", severity: "high" },
    { term: "vote twice", category: "Voter Fraud", severity: "high" },
    { term: "fraude eleitoral", category: "Voter Fraud", severity: "high" },
    { term: "voter fraud", category: "Voter Fraud", severity: "high" },
    { term: "election fraud", category: "Voter Fraud", severity: "high" },
    { term: "voto não conta", category: "Voter Misrepresentation", severity: "high" },
    { term: "vote won't count", category: "Voter Misrepresentation", severity: "high" },
    { term: "fraude censo", category: "Census Fraud", severity: "high" },
    { term: "census fraud", category: "Census Fraud", severity: "high" },
    
    // Coordination signals
    { term: "vamos organizar", category: "Coordination Signal", severity: "mid", requiresContext: true },
    { term: "let's organize", category: "Coordination Signal", severity: "mid", requiresContext: true },
    { term: "quem quer participar", category: "Coordination Signal", severity: "mid", requiresContext: true },
    { term: "who wants to join", category: "Coordination Signal", severity: "mid", requiresContext: true },
  ],

  // ============================================
  // CYBER - Cybersecurity
  // ============================================
  cyber: [
    // === PHISHING ===
    { term: "sua conta foi bloqueada", category: "Phishing", severity: "high" },
    { term: "sua conta foi suspensa", category: "Phishing", severity: "high" },
    { term: "your account has been blocked", category: "Phishing", severity: "high" },
    { term: "your account has been suspended", category: "Phishing", severity: "high" },
    { term: "verify your account", category: "Phishing", severity: "mid", requiresContext: true },
    { term: "verificar sua conta", category: "Phishing", severity: "mid", requiresContext: true },
    { term: "clique aqui para verificar", category: "Phishing", severity: "high" },
    { term: "click here to verify", category: "Phishing", severity: "high" },
    { term: "sua página foi sinalizada", category: "Phishing", severity: "high" },
    { term: "your page has been flagged", category: "Phishing", severity: "high" },
    { term: "ação necessária na sua conta", category: "Phishing", severity: "high" },
    { term: "action required on your account", category: "Phishing", severity: "high" },
    { term: "página de login falsa", category: "Phishing", severity: "high" },
    { term: "fake login page", category: "Phishing", severity: "high" },
    
    // Suspicious URLs
    { term: "faceb00k.com", category: "Phishing URL", severity: "critical" },
    { term: "facebok.com", category: "Phishing URL", severity: "critical" },
    { term: "facebook-security", category: "Phishing URL", severity: "high", requiresContext: true },
    { term: "instagram-verify", category: "Phishing URL", severity: "high", requiresContext: true },
    { term: "whatsapp-verify", category: "Phishing URL", severity: "high", requiresContext: true },
    
    // === SOCIAL ENGINEERING ===
    { term: "dê-me sua senha", category: "Social Engineering", severity: "high" },
    { term: "me passa sua senha", category: "Social Engineering", severity: "high" },
    { term: "give me your password", category: "Social Engineering", severity: "high" },
    { term: "share your password", category: "Social Engineering", severity: "high" },
    { term: "qual o nome de solteira", category: "Social Engineering", severity: "mid", requiresContext: true },
    { term: "mother's maiden name", category: "Social Engineering", severity: "mid", requiresContext: true },
    { term: "qual foi seu primeiro carro", category: "Social Engineering", severity: "mid", requiresContext: true },
    { term: "what was your first car", category: "Social Engineering", severity: "mid", requiresContext: true },
    { term: "recovery code", category: "Social Engineering", severity: "mid", requiresContext: true },
    
    // === LOGIN SHARING ===
    { term: "senhas vazadas", category: "Login Sharing", severity: "high" },
    { term: "leaked passwords", category: "Login Sharing", severity: "high" },
    { term: "contas vazadas", category: "Login Sharing", severity: "high" },
    { term: "leaked accounts", category: "Login Sharing", severity: "high" },
    { term: "credenciais vazadas", category: "Login Sharing", severity: "high" },
    { term: "leaked credentials", category: "Login Sharing", severity: "high" },
    { term: "credential dump", category: "Login Sharing", severity: "high" },
    { term: "account dump", category: "Login Sharing", severity: "high" },
    { term: "lista de senhas", category: "Login Sharing", severity: "high" },
    { term: "password list", category: "Login Sharing", severity: "high" },
    
    // === HACKING ===
    { term: "hackear conta", category: "Hacking", severity: "high" },
    { term: "hack account", category: "Hacking", severity: "high" },
    { term: "hackear facebook", category: "Hacking", severity: "high" },
    { term: "hack facebook", category: "Hacking", severity: "high" },
    { term: "hackear instagram", category: "Hacking", severity: "high" },
    { term: "hack instagram", category: "Hacking", severity: "high" },
    { term: "hackear whatsapp", category: "Hacking", severity: "high" },
    { term: "hack whatsapp", category: "Hacking", severity: "high" },
    { term: "serviços de hacker", category: "Hacking", severity: "high" },
    { term: "hacking services", category: "Hacking", severity: "high" },
    { term: "contratar hacker", category: "Hacking", severity: "high" },
    { term: "hire hacker", category: "Hacking", severity: "high" },
    { term: "como hackear", category: "Hacking", severity: "high" },
    { term: "how to hack", category: "Hacking", severity: "high" },
    { term: "tutorial hacking", category: "Hacking", severity: "high" },
    { term: "hacking tutorial", category: "Hacking", severity: "high" },
    { term: "invadir conta", category: "Hacking", severity: "high" },
    { term: "clonar whatsapp", category: "Hacking", severity: "high" },
    { term: "clone whatsapp", category: "Hacking", severity: "high" },
    { term: "clonar celular", category: "Hacking", severity: "high" },
    { term: "clone phone", category: "Hacking", severity: "high" },
    { term: "espionar celular", category: "Hacking", severity: "high" },
    { term: "spy on phone", category: "Hacking", severity: "high" },
    { term: "web defacement", category: "Hacking", severity: "high" },
    { term: "ddos attack", category: "Hacking", severity: "high" },
    { term: "denial of service", category: "Hacking", severity: "high" },
    
    // === MALWARE ===
    { term: "malware", category: "Malware", severity: "high" },
    { term: "trojan", category: "Malware", severity: "high" },
    { term: "ransomware", category: "Malware", severity: "high" },
    { term: "keylogger", category: "Malware", severity: "high" },
    { term: "spyware", category: "Malware", severity: "high" },
    { term: "rat trojan", category: "Malware", severity: "high" },
    { term: "remote access trojan", category: "Malware", severity: "high" },
    
    // === CIRCUMVENTING SECURITY ===
    { term: "quebrar senha", category: "Circumventing Security", severity: "high" },
    { term: "password cracker", category: "Circumventing Security", severity: "high" },
    { term: "crack password", category: "Circumventing Security", severity: "high" },
    { term: "crackear conta", category: "Circumventing Security", severity: "high" },
    { term: "burlar segurança", category: "Circumventing Security", severity: "high" },
    { term: "bypass security", category: "Circumventing Security", severity: "high" },
    { term: "software de espionagem", category: "Circumventing Security", severity: "high" },
    { term: "spy software", category: "Circumventing Security", severity: "high" },
    { term: "app espião", category: "Circumventing Security", severity: "high" },
    { term: "spy app", category: "Circumventing Security", severity: "high" },
    { term: "monitoring app", category: "Circumventing Security", severity: "mid", requiresContext: true },
    { term: "location tracker", category: "Circumventing Security", severity: "mid", requiresContext: true },
    
    // === DISRUPTING COMMUNICATION ===
    { term: "bloqueador de sinal", category: "Disrupting Communication", severity: "high" },
    { term: "signal blocker", category: "Disrupting Communication", severity: "high" },
    { term: "jammer celular", category: "Disrupting Communication", severity: "high" },
    { term: "cell phone jammer", category: "Disrupting Communication", severity: "high" },
    { term: "signal jammer", category: "Disrupting Communication", severity: "high" },
    { term: "gps jammer", category: "Disrupting Communication", severity: "high" },
    { term: "inibidor de sinal", category: "Disrupting Communication", severity: "high" },
    { term: "descrambling device", category: "Disrupting Communication", severity: "high" },
    { term: "intercept signal", category: "Disrupting Communication", severity: "high" },
  ],

  // ============================================
  // SSIED - Suicide, Self-Injury, Eating Disorders
  // ============================================
  ssied: [
    // === SUICIDE - EXPLICIT INTENT ===
    { term: "vou me matar", category: "Suicide Intent", severity: "critical" },
    { term: "vou cometer suicídio", category: "Suicide Intent", severity: "critical" },
    { term: "i will kill myself", category: "Suicide Intent", severity: "critical" },
    { term: "going to commit suicide", category: "Suicide Intent", severity: "critical" },
    { term: "vou tirar minha vida", category: "Suicide Intent", severity: "critical" },
    { term: "take my own life", category: "Suicide Intent", severity: "critical" },
    { term: "end my life", category: "Suicide Intent", severity: "critical" },
    
    // === SUICIDE - IDEATION ===
    { term: "quero morrer", category: "Suicide Ideation", severity: "high" },
    { term: "i want to die", category: "Suicide Ideation", severity: "high" },
    { term: "não quero mais viver", category: "Suicide Ideation", severity: "high" },
    { term: "vou acabar com tudo", category: "Suicide Ideation", severity: "high" },
    { term: "nobody would miss me", category: "Suicide Ideation", severity: "high" },
    { term: "better off without me", category: "Suicide Ideation", severity: "high" },
    { term: "melhor sem mim", category: "Suicide Ideation", severity: "high" },
    
    // === SUICIDE - NOTES/FINAL ===
    { term: "carta de suicídio", category: "Suicide Note", severity: "critical" },
    { term: "nota de suicídio", category: "Suicide Note", severity: "critical" },
    { term: "suicide note", category: "Suicide Note", severity: "critical" },
    { term: "meu último adeus", category: "Suicide Note", severity: "high" },
    { term: "my final goodbye", category: "Suicide Note", severity: "high" },
    
    // === SUICIDE - SLANG ===
    { term: "kms", category: "Suicide Slang", severity: "high" },
    { term: "kill myself", category: "Suicide Slang", severity: "high" },
    { term: "unalive myself", category: "Suicide Slang", severity: "high" },
    { term: "sewerslide", category: "Suicide Slang", severity: "mid" },
    
    // === SUICIDE - METHODS ===
    { term: "enforcar", category: "Suicide Method", severity: "high", requiresContext: true },
    { term: "hanging myself", category: "Suicide Method", severity: "high" },
    { term: "overdose", category: "Suicide Method", severity: "high", requiresContext: true },
    { term: "cortar os pulsos", category: "Suicide Method", severity: "high" },
    { term: "slit wrists", category: "Suicide Method", severity: "high" },
    { term: "drink bleach", category: "Suicide Method", severity: "high" },
    { term: "beber água sanitária", category: "Suicide Method", severity: "high" },
    
    // === SUICIDE - PROMOTION ===
    { term: "como se matar", category: "Suicide Promotion", severity: "critical" },
    { term: "how to kill yourself", category: "Suicide Promotion", severity: "critical" },
    { term: "tutorial suicídio", category: "Suicide Promotion", severity: "critical" },
    { term: "suicide tutorial", category: "Suicide Promotion", severity: "critical" },
    { term: "suicide is the answer", category: "Suicide Promotion", severity: "high" },
    { term: "suicide pact", category: "Suicide Promotion", severity: "critical" },
    { term: "pacto de suicídio", category: "Suicide Promotion", severity: "critical" },
    
    // === VIRAL EVENTS ===
    { term: "blue whale challenge", category: "Viral Event", severity: "critical" },
    { term: "desafio baleia azul", category: "Viral Event", severity: "critical" },
    { term: "momo challenge", category: "Viral Event", severity: "high" },
    { term: "desafio momo", category: "Viral Event", severity: "high" },
    { term: "jonathan galindo", category: "Viral Event", severity: "high" },
    { term: "dogface challenge", category: "Viral Event", severity: "high" },
    
    // === SELF-INJURY - EXPLICIT ===
    { term: "me cortar", category: "Self-Injury", severity: "high" },
    { term: "me corto", category: "Self-Injury", severity: "high" },
    { term: "cut myself", category: "Self-Injury", severity: "high" },
    { term: "cutting myself", category: "Self-Injury", severity: "high" },
    { term: "auto-mutilação", category: "Self-Injury", severity: "high" },
    { term: "automutilação", category: "Self-Injury", severity: "high" },
    { term: "self harm", category: "Self-Injury", severity: "high" },
    { term: "self-harm", category: "Self-Injury", severity: "high" },
    { term: "self injury", category: "Self-Injury", severity: "high" },
    { term: "self-injury", category: "Self-Injury", severity: "high" },
    { term: "cicatrizes de corte", category: "Self-Injury", severity: "high" },
    { term: "cutting scars", category: "Self-Injury", severity: "high" },
    
    // === SELF-INJURY - HASHTAGS ===
    { term: "#selfharm", category: "Self-Injury Hashtag", severity: "high" },
    { term: "#cutting", category: "Self-Injury Hashtag", severity: "high" },
    { term: "#selfinjury", category: "Self-Injury Hashtag", severity: "high" },
    
    // === SELF-INJURY - PROMOTION ===
    { term: "5 likes = 1 cut", category: "Self-Injury Promotion", severity: "critical" },
    { term: "cutting feels good", category: "Self-Injury Promotion", severity: "high" },
    { term: "cortar é bom", category: "Self-Injury Promotion", severity: "high" },
    { term: "you should try cutting", category: "Self-Injury Promotion", severity: "critical" },
    
    // === EATING DISORDERS - PROMOTIONAL ===
    { term: "proana", category: "ED Promotion", severity: "high" },
    { term: "pro ana", category: "ED Promotion", severity: "high" },
    { term: "promia", category: "ED Promotion", severity: "high" },
    { term: "pro mia", category: "ED Promotion", severity: "high" },
    { term: "thinspo", category: "ED Promotion", severity: "high" },
    { term: "thinspiration", category: "ED Promotion", severity: "high" },
    { term: "bonespo", category: "ED Promotion", severity: "high" },
    { term: "meanspo", category: "ED Promotion", severity: "high" },
    { term: "anabuddy", category: "ED Promotion", severity: "high" },
    { term: "ana buddy", category: "ED Promotion", severity: "high" },
    { term: "#anatips", category: "ED Promotion", severity: "high" },
    { term: "#anagoals", category: "ED Promotion", severity: "high" },
    { term: "ana coach", category: "ED Promotion", severity: "high" },
    
    // === EATING DISORDERS - CONTEXTUAL ===
    { term: "#anamia", category: "ED Signal", severity: "high" },
    { term: "edtwt", category: "ED Signal", severity: "high" },
    { term: "anatwt", category: "ED Signal", severity: "high" },
    { term: "edinsta", category: "ED Signal", severity: "high" },
    { term: "eddiary", category: "ED Signal", severity: "high" },
    { term: "#thighgap", category: "ED Signal", severity: "mid" },
    { term: "UGW", category: "ED Signal", severity: "mid" },
    { term: "ultimate goal weight", category: "ED Signal", severity: "mid" },
    
    // === EATING DISORDERS - BEHAVIORS ===
    { term: "purgar", category: "ED Behavior", severity: "high" },
    { term: "purging", category: "ED Behavior", severity: "high" },
    { term: "vomitar para emagrecer", category: "ED Behavior", severity: "high" },
    { term: "vomit to lose weight", category: "ED Behavior", severity: "high" },
    { term: "comer giz", category: "Pica", severity: "high" },
    { term: "eating chalk", category: "Pica", severity: "high" },
    { term: "eating clay", category: "Pica", severity: "high" },
    { term: "eating dirt", category: "Pica", severity: "high" },
    
    // === EXTREME WEIGHT LOSS ===
    { term: "menos de 1200 calorias", category: "Extreme Weight Loss", severity: "high" },
    { term: "under 1200 calories", category: "Extreme Weight Loss", severity: "high" },
    { term: "1000 calorias por dia", category: "Extreme Weight Loss", severity: "high" },
    { term: "800 calories a day", category: "Extreme Weight Loss", severity: "high" },
    { term: "500 calorias", category: "Extreme Weight Loss", severity: "high" },
    { term: "jejum de 24 horas", category: "Extreme Weight Loss", severity: "high" },
    { term: "24 hour fast", category: "Extreme Weight Loss", severity: "high" },
    { term: "water fasting", category: "Extreme Weight Loss", severity: "high" },
    { term: "jejum de água", category: "Extreme Weight Loss", severity: "high" },
    { term: "perder 3 quilos por semana", category: "Extreme Weight Loss", severity: "high" },
    { term: "lose 3 pounds a week", category: "Extreme Weight Loss", severity: "high" },
    
    // === MOCKING ===
    { term: "lmao kms", category: "Mocking", severity: "mid" },
    { term: "lowkey wanna die", category: "Mocking", severity: "mid" },
    { term: "#dankmemes suicide", category: "Mocking", severity: "mid" },
  ],

  // ============================================
  // HC - Hateful Conduct
  // ============================================
  hc: [
    // === TIER 1 - DEHUMANIZING ANIMALS ===
    { term: "são baratas", category: "T1 Dehumanizing - Insects", severity: "critical" },
    { term: "são ratos", category: "T1 Dehumanizing - Animals", severity: "critical" },
    { term: "são porcos", category: "T1 Dehumanizing - Animals", severity: "critical" },
    { term: "são macacos", category: "T1 Dehumanizing - Animals", severity: "critical" },
    { term: "são vermes", category: "T1 Dehumanizing - Animals", severity: "critical" },
    { term: "are cockroaches", category: "T1 Dehumanizing - Insects", severity: "critical" },
    { term: "are locusts", category: "T1 Dehumanizing - Insects", severity: "critical" },
    { term: "are rats", category: "T1 Dehumanizing - Animals", severity: "critical" },
    { term: "are pigs", category: "T1 Dehumanizing - Animals", severity: "critical" },
    { term: "are apes", category: "T1 Dehumanizing - Animals", severity: "critical" },
    { term: "are monkeys", category: "T1 Dehumanizing - Animals", severity: "critical" },
    { term: "are worms", category: "T1 Dehumanizing - Animals", severity: "critical" },
    
    // === TIER 1 - DEHUMANIZING PATHOGENS ===
    { term: "são uma praga", category: "T1 Dehumanizing - Pathogens", severity: "critical" },
    { term: "são um vírus", category: "T1 Dehumanizing - Pathogens", severity: "critical" },
    { term: "são um cancro", category: "T1 Dehumanizing - Pathogens", severity: "critical" },
    { term: "are a plague", category: "T1 Dehumanizing - Pathogens", severity: "critical" },
    { term: "are a virus", category: "T1 Dehumanizing - Pathogens", severity: "critical" },
    { term: "are a cancer", category: "T1 Dehumanizing - Pathogens", severity: "critical" },
    { term: "are a disease", category: "T1 Dehumanizing - Pathogens", severity: "critical" },
    { term: "are parasites", category: "T1 Dehumanizing - Pathogens", severity: "critical" },
    
    // === TIER 1 - DEHUMANIZING SUBHUMAN ===
    { term: "são selvagens", category: "T1 Dehumanizing - Subhuman", severity: "critical" },
    { term: "são demónios", category: "T1 Dehumanizing - Subhuman", severity: "critical" },
    { term: "são monstros", category: "T1 Dehumanizing - Subhuman", severity: "critical" },
    { term: "são bárbaros", category: "T1 Dehumanizing - Subhuman", severity: "critical" },
    { term: "are savages", category: "T1 Dehumanizing - Subhuman", severity: "critical" },
    { term: "are devils", category: "T1 Dehumanizing - Subhuman", severity: "critical" },
    { term: "are monsters", category: "T1 Dehumanizing - Subhuman", severity: "critical" },
    { term: "are barbarians", category: "T1 Dehumanizing - Subhuman", severity: "critical" },
    { term: "are subhuman", category: "T1 Dehumanizing - Subhuman", severity: "critical" },
    { term: "are inhuman", category: "T1 Dehumanizing - Subhuman", severity: "critical" },
    
    // === TIER 1 - CRIMINAL ALLEGATIONS ===
    { term: "são pedófilos", category: "T1 Criminal - Sexual", severity: "critical" },
    { term: "são violadores", category: "T1 Criminal - Sexual", severity: "critical" },
    { term: "são terroristas", category: "T1 Criminal - Violent", severity: "critical" },
    { term: "são assassinos", category: "T1 Criminal - Violent", severity: "critical" },
    { term: "are pedophiles", category: "T1 Criminal - Sexual", severity: "critical" },
    { term: "are rapists", category: "T1 Criminal - Sexual", severity: "critical" },
    { term: "are terrorists", category: "T1 Criminal - Violent", severity: "critical" },
    { term: "are murderers", category: "T1 Criminal - Violent", severity: "critical" },
    { term: "are child molesters", category: "T1 Criminal - Sexual", severity: "critical" },
    
    // === TIER 1 - HARM STATEMENTS ===
    { term: "deviam morrer", category: "T1 Harm - Death", severity: "critical" },
    { term: "espero que morram", category: "T1 Harm - Death", severity: "critical" },
    { term: "deviam matar-se", category: "T1 Harm - Suicide", severity: "critical" },
    { term: "should die", category: "T1 Harm - Death", severity: "critical" },
    { term: "hope they die", category: "T1 Harm - Death", severity: "critical" },
    { term: "should kill themselves", category: "T1 Harm - Suicide", severity: "critical" },
    { term: "deserve to die", category: "T1 Harm - Death", severity: "critical" },
    { term: "may god strike", category: "T1 Harm - Deity", severity: "high" },
    
    // === TIER 1 - HOLOCAUST DENIAL ===
    { term: "holocaust didn't happen", category: "T1 Stereotype - Holocaust Denial", severity: "critical" },
    { term: "holohoax", category: "T1 Stereotype - Holocaust Denial", severity: "critical" },
    { term: "holocaust was fake", category: "T1 Stereotype - Holocaust Denial", severity: "critical" },
    { term: "holocaust is a lie", category: "T1 Stereotype - Holocaust Denial", severity: "critical" },
    { term: "holocausto não aconteceu", category: "T1 Stereotype - Holocaust Denial", severity: "critical" },
    { term: "holocausto é mentira", category: "T1 Stereotype - Holocaust Denial", severity: "critical" },
    
    // === TIER 1 - JEWISH CONTROL ===
    { term: "jews control", category: "T1 Stereotype - Jewish Control", severity: "critical" },
    { term: "jews own", category: "T1 Stereotype - Jewish Control", severity: "critical" },
    { term: "jews rule", category: "T1 Stereotype - Jewish Control", severity: "critical" },
    { term: "judeus controlam", category: "T1 Stereotype - Jewish Control", severity: "critical" },
    { term: "zionists control the media", category: "T1 Stereotype - Jewish Control", severity: "critical" },
    { term: "zionists control the banks", category: "T1 Stereotype - Jewish Control", severity: "critical" },
    
    // === TIER 2 - CHARACTER INSULTS ===
    { term: "são cobardes", category: "T2 Character Insult", severity: "high" },
    { term: "são mentirosos", category: "T2 Character Insult", severity: "high" },
    { term: "são ladrões", category: "T2 Character Insult", severity: "high" },
    { term: "são criminosos", category: "T2 Character Insult", severity: "high" },
    { term: "são gananciosos", category: "T2 Character Insult", severity: "high" },
    { term: "are cowards", category: "T2 Character Insult", severity: "high" },
    { term: "are liars", category: "T2 Character Insult", severity: "high" },
    { term: "are thieves", category: "T2 Character Insult", severity: "high" },
    { term: "are criminals", category: "T2 Character Insult", severity: "high" },
    { term: "are greedy", category: "T2 Character Insult", severity: "high" },
    { term: "are slutty", category: "T2 Character Insult", severity: "high" },
    
    // === TIER 2 - MENTAL INSULTS ===
    { term: "são estúpidos", category: "T2 Mental Insult", severity: "high" },
    { term: "são idiotas", category: "T2 Mental Insult", severity: "high" },
    { term: "são burros", category: "T2 Mental Insult", severity: "high" },
    { term: "são retardados", category: "T2 Mental Insult", severity: "high" },
    { term: "are stupid", category: "T2 Mental Insult", severity: "high" },
    { term: "are idiots", category: "T2 Mental Insult", severity: "high" },
    { term: "are dumb", category: "T2 Mental Insult", severity: "high" },
    { term: "are retarded", category: "T2 Mental Insult", severity: "high" },
    
    // === TIER 2 - OTHER INSULTS ===
    { term: "não valem nada", category: "T2 Other Insult", severity: "high" },
    { term: "são lixo", category: "T2 Other Insult", severity: "high" },
    { term: "são escumalha", category: "T2 Other Insult", severity: "high" },
    { term: "são nojentos", category: "T2 Other Insult", severity: "high" },
    { term: "are worthless", category: "T2 Other Insult", severity: "high" },
    { term: "are useless", category: "T2 Other Insult", severity: "high" },
    { term: "are ugly", category: "T2 Other Insult", severity: "high" },
    { term: "are dirty", category: "T2 Other Insult", severity: "high" },
    { term: "are scum", category: "T2 Other Insult", severity: "high" },
    { term: "are filthy", category: "T2 Other Insult", severity: "high" },
    { term: "are trash", category: "T2 Other Insult", severity: "high" },
    { term: "pieces of shit", category: "T2 Other Insult", severity: "high" },
    
    // === TIER 2 - DISGUST ===
    { term: "fazem-me vomitar", category: "T2 Disgust", severity: "high" },
    { term: "dão-me nojo", category: "T2 Disgust", severity: "high" },
    { term: "são repugnantes", category: "T2 Disgust", severity: "high" },
    { term: "make me vomit", category: "T2 Disgust", severity: "high" },
    { term: "make me want to throw up", category: "T2 Disgust", severity: "high" },
    { term: "are disgusting", category: "T2 Disgust", severity: "high" },
    { term: "are vile", category: "T2 Disgust", severity: "high" },
    
    // === TIER 2 - CURSING ===
    { term: "foda-se os", category: "T2 Cursing", severity: "high" },
    { term: "fuck the", category: "T2 Cursing", severity: "high" },
    
    // === TIER 2 - EXCLUSION ===
    { term: "não permitidos", category: "T2 Exclusion", severity: "high" },
    { term: "expulsem os", category: "T2 Exclusion", severity: "high" },
    { term: "mundo sem", category: "T2 Exclusion", severity: "high" },
    { term: "not allowed", category: "T2 Exclusion", severity: "high" },
    { term: "kick out", category: "T2 Exclusion", severity: "high" },
    { term: "world without", category: "T2 Exclusion", severity: "high" },
    { term: "keep them out", category: "T2 Exclusion", severity: "high" },
    { term: "no jews allowed", category: "T2 Exclusion", severity: "critical" },
    { term: "no muslims allowed", category: "T2 Exclusion", severity: "critical" },
    { term: "no blacks allowed", category: "T2 Exclusion", severity: "critical" },
    { term: "should not be allowed to vote", category: "T2 Political Exclusion", severity: "high" },
    { term: "should not be allowed to work", category: "T2 Economic Exclusion", severity: "high" },
  ],

  // ============================================
  // SPAM - Spam & Deceptive Links
  // ============================================
  spam: [
    // === ENGAGEMENT SALE - PORTUGUESE ===
    { term: "comprar seguidores", category: "Buy Engagement", severity: "high" },
    { term: "vender seguidores", category: "Sell Engagement", severity: "high" },
    { term: "comprar likes", category: "Buy Engagement", severity: "high" },
    { term: "vender likes", category: "Sell Engagement", severity: "high" },
    { term: "comprar curtidas", category: "Buy Engagement", severity: "high" },
    { term: "comprar visualizações", category: "Buy Engagement", severity: "high" },
    { term: "seguidores baratos", category: "Sell Engagement", severity: "high" },
    { term: "likes baratos", category: "Sell Engagement", severity: "high" },
    
    // === ENGAGEMENT SALE - ENGLISH ===
    { term: "buy followers", category: "Buy Engagement", severity: "high" },
    { term: "sell followers", category: "Sell Engagement", severity: "high" },
    { term: "buy likes", category: "Buy Engagement", severity: "high" },
    { term: "buy views", category: "Buy Engagement", severity: "high" },
    { term: "buy comments", category: "Buy Engagement", severity: "high" },
    { term: "cheap followers", category: "Sell Engagement", severity: "high" },
    { term: "cheap likes", category: "Sell Engagement", severity: "high" },
    { term: "who needs followers", category: "Sell Engagement", severity: "high" },
    { term: "followers available", category: "Sell Engagement", severity: "high" },
    { term: "dm for followers", category: "Sell Engagement", severity: "high" },
    { term: "dm for likes", category: "Sell Engagement", severity: "high" },
    
    // === ACCOUNT/PAGE SALE - PORTUGUESE ===
    { term: "vender conta", category: "Sell Account", severity: "high" },
    { term: "comprar conta", category: "Buy Account", severity: "high" },
    { term: "conta à venda", category: "Sell Account", severity: "high" },
    { term: "página à venda", category: "Sell Page", severity: "high" },
    { term: "grupo à venda", category: "Sell Group", severity: "high" },
    
    // === ACCOUNT/PAGE SALE - ENGLISH ===
    { term: "sell account", category: "Sell Account", severity: "high" },
    { term: "buy account", category: "Buy Account", severity: "high" },
    { term: "account for sale", category: "Sell Account", severity: "high" },
    { term: "page for sale", category: "Sell Page", severity: "high" },
    { term: "group for sale", category: "Sell Group", severity: "high" },
    { term: "buy instagram account", category: "Buy Account", severity: "high" },
    { term: "buy facebook page", category: "Buy Page", severity: "high" },
    
    // === ADMIN/PRIVILEGES SALE ===
    { term: "admin à venda", category: "Sell Privileges", severity: "high" },
    { term: "admin for sale", category: "Sell Privileges", severity: "high" },
    { term: "admin role for sale", category: "Sell Privileges", severity: "high" },
    { term: "highest bidder", category: "Sell Privileges", severity: "high" },
    { term: "moderator for sale", category: "Sell Privileges", severity: "high" },
    
    // === ACCOUNT SERVICES ===
    { term: "recuperar conta", category: "Account Services", severity: "mid" },
    { term: "desbloquear conta", category: "Account Services", severity: "high" },
    { term: "recover account", category: "Account Services", severity: "mid" },
    { term: "unlock account", category: "Account Services", severity: "high" },
    { term: "get your account back", category: "Account Services", severity: "high" },
    { term: "account recovery service", category: "Account Services", severity: "high" },
    { term: "unlock suspended account", category: "Account Services", severity: "high" },
    
    // === ENGAGEMENT GATING - PORTUGUESE ===
    { term: "curtir para ver", category: "Engagement Gating", severity: "high" },
    { term: "seguir para ver", category: "Engagement Gating", severity: "high" },
    { term: "partilhar para ver", category: "Engagement Gating", severity: "high" },
    { term: "like para desbloquear", category: "Engagement Gating", severity: "high" },
    
    // === ENGAGEMENT GATING - ENGLISH ===
    { term: "like to see", category: "Engagement Gating", severity: "high" },
    { term: "follow to see", category: "Engagement Gating", severity: "high" },
    { term: "share to see", category: "Engagement Gating", severity: "high" },
    { term: "like to unlock", category: "Engagement Gating", severity: "high" },
    { term: "follow to unlock", category: "Engagement Gating", severity: "high" },
    { term: "like and share to see", category: "Engagement Gating", severity: "high" },
    
    // === GIVEAWAY - PORTUGUESE ===
    { term: "seguir para ganhar", category: "Giveaway", severity: "high" },
    { term: "curtir para ganhar", category: "Giveaway", severity: "high" },
    { term: "sorteio de dinheiro", category: "Giveaway Cash", severity: "high" },
    { term: "sorteio de bitcoin", category: "Giveaway Crypto", severity: "high" },
    
    // === GIVEAWAY - ENGLISH ===
    { term: "follow to win", category: "Giveaway", severity: "high" },
    { term: "like to win", category: "Giveaway", severity: "high" },
    { term: "share to win", category: "Giveaway", severity: "high" },
    { term: "cash giveaway", category: "Giveaway Cash", severity: "high" },
    { term: "bitcoin giveaway", category: "Giveaway Crypto", severity: "high" },
    { term: "crypto giveaway", category: "Giveaway Crypto", severity: "high" },
    { term: "win $100", category: "Giveaway Cash", severity: "high" },
    { term: "win bitcoin", category: "Giveaway Crypto", severity: "high" },
    
    // === FAKE FUNCTIONALITY - PORTUGUESE ===
    { term: "ver quem viu seu perfil", category: "Fake Functionality", severity: "high" },
    { term: "ver quem visitou seu perfil", category: "Fake Functionality", severity: "high" },
    { term: "botão de não gostar", category: "Fake Functionality", severity: "high" },
    { term: "mudar cor do instagram", category: "Fake Functionality", severity: "high" },
    
    // === FAKE FUNCTIONALITY - ENGLISH ===
    { term: "see who viewed your profile", category: "Fake Functionality", severity: "high" },
    { term: "see who views your instagram", category: "Fake Functionality", severity: "high" },
    { term: "dislike button", category: "Fake Functionality", severity: "high" },
    { term: "get a dislike button", category: "Fake Functionality", severity: "high" },
    { term: "boost algorithm", category: "Fake Functionality", severity: "high" },
    { term: "boost who sees you", category: "Fake Functionality", severity: "high" },
    { term: "mass delete followers", category: "Fake Functionality", severity: "high" },
    { term: "see who doesn't follow you back", category: "Fake Functionality", severity: "high" },
    { term: "recover deleted messages", category: "Fake Functionality", severity: "high" },
    
    // === DOMAIN IMPERSONATION ===
    { term: "faceb00k.com", category: "Domain Impersonation", severity: "critical" },
    { term: "facebok.com", category: "Domain Impersonation", severity: "critical" },
    { term: "amaz0n.com", category: "Domain Impersonation", severity: "critical" },
    { term: "g00gle.com", category: "Domain Impersonation", severity: "critical" },
    { term: "paypa1.com", category: "Domain Impersonation", severity: "critical" },
    { term: "instgram.com", category: "Domain Impersonation", severity: "critical" },
    { term: "instagran.com", category: "Domain Impersonation", severity: "critical" },
    { term: "lnstagram.com", category: "Domain Impersonation", severity: "critical" },
    
    // === DECEPTIVE LINK INDICATORS ===
    { term: "click here to claim", category: "Deceptive Link", severity: "high" },
    { term: "clique aqui para receber", category: "Deceptive Link", severity: "high" },
    { term: "share to 3 groups", category: "Deceptive Link", severity: "high" },
    { term: "share with 5 friends", category: "Deceptive Link", severity: "high" },
  ],

  // ============================================
  // FSDP - Fraud, Scam, and Deceptive Practices
  // ============================================
  fsdp: [
    // === FAKE DOCUMENTS - PORTUGUESE ===
    { term: "documentos falsos", category: "Fake Documents", severity: "critical" },
    { term: "identidade falsa", category: "Fake Documents", severity: "critical" },
    { term: "passaporte falso", category: "Fake Documents", severity: "critical" },
    { term: "carta de condução falsa", category: "Fake Documents", severity: "critical" },
    { term: "certificado falso", category: "Fake Documents", severity: "critical" },
    { term: "diploma falso", category: "Fake Documents", severity: "critical" },
    { term: "dinheiro falso", category: "Counterfeit Currency", severity: "critical" },
    { term: "notas falsas", category: "Counterfeit Currency", severity: "critical" },
    
    // === FAKE DOCUMENTS - ENGLISH ===
    { term: "fake id", category: "Fake Documents", severity: "critical" },
    { term: "fake ids", category: "Fake Documents", severity: "critical" },
    { term: "fake passport", category: "Fake Documents", severity: "critical" },
    { term: "fake license", category: "Fake Documents", severity: "critical" },
    { term: "fake diploma", category: "Fake Documents", severity: "critical" },
    { term: "fake degree", category: "Fake Documents", severity: "critical" },
    { term: "fake certificate", category: "Fake Documents", severity: "critical" },
    { term: "scannable id", category: "Fake Documents", severity: "critical" },
    { term: "counterfeit money", category: "Counterfeit Currency", severity: "critical" },
    { term: "counterfeit bills", category: "Counterfeit Currency", severity: "critical" },
    { term: "fake currency", category: "Counterfeit Currency", severity: "critical" },
    { term: "prop money", category: "Counterfeit Currency", severity: "high" },
    
    // === CARDING ===
    { term: "clone card", category: "Carding", severity: "critical" },
    { term: "clone cards", category: "Carding", severity: "critical" },
    { term: "cartão clonado", category: "Carding", severity: "critical" },
    { term: "carding tutorial", category: "Carding", severity: "critical" },
    { term: "dumps cc", category: "Carding", severity: "critical" },
    { term: "fullz", category: "Carding", severity: "critical" },
    { term: "cvv shop", category: "Carding", severity: "critical" },
    { term: "cashout method", category: "Carding", severity: "critical" },
    
    // === MONEY MULING ===
    { term: "use my bank account", category: "Money Muling", severity: "critical" },
    { term: "usar minha conta", category: "Money Muling", severity: "critical" },
    { term: "who got wells fargo", category: "Money Muling", severity: "critical" },
    { term: "who got chase", category: "Money Muling", severity: "critical" },
    { term: "cashapp drops", category: "Money Muling", severity: "critical" },
    { term: "chime drops", category: "Money Muling", severity: "critical" },
    { term: "apple pay drops", category: "Money Muling", severity: "critical" },
    
    // === MONEY LAUNDERING ===
    { term: "mt103", category: "Money Laundering", severity: "critical" },
    { term: "mt799", category: "Money Laundering", severity: "critical" },
    { term: "swift transfer", category: "Money Laundering", severity: "high" },
    { term: "usdt receiver", category: "Money Laundering", severity: "critical" },
    { term: "crypto receiver", category: "Money Laundering", severity: "critical" },
    { term: "loaders needed", category: "Money Laundering", severity: "critical" },
    { term: "receiver needed", category: "Money Laundering", severity: "critical" },
    
    // === LOAN SCAM ===
    { term: "guaranteed loan", category: "Loan Scam", severity: "high" },
    { term: "empréstimo garantido", category: "Loan Scam", severity: "high" },
    { term: "no credit check loan", category: "Loan Scam", severity: "high" },
    { term: "advance fee for loan", category: "Loan Scam", severity: "high" },
    { term: "loan approval guaranteed", category: "Loan Scam", severity: "high" },
    
    // === INVESTMENT SCAM ===
    { term: "guaranteed returns", category: "Investment Scam", severity: "high" },
    { term: "retorno garantido", category: "Investment Scam", severity: "high" },
    { term: "risk free investment", category: "Investment Scam", severity: "high" },
    { term: "investimento sem risco", category: "Investment Scam", severity: "high" },
    { term: "get rich quick", category: "Investment Scam", severity: "high" },
    { term: "ficar rico rápido", category: "Investment Scam", severity: "high" },
    { term: "money flip", category: "Investment Scam", severity: "critical" },
    { term: "cash flip", category: "Investment Scam", severity: "critical" },
    { term: "double your money", category: "Investment Scam", severity: "high" },
    { term: "duplicar seu dinheiro", category: "Investment Scam", severity: "high" },
    { term: "forex guaranteed", category: "Investment Scam", severity: "high" },
    { term: "crypto guaranteed", category: "Investment Scam", severity: "high" },
    
    // === ROMANCE SCAM ===
    { term: "sugar daddy", category: "Romance Scam", severity: "high" },
    { term: "sugar mommy", category: "Romance Scam", severity: "high" },
    { term: "sugar baby", category: "Romance Scam", severity: "high" },
    { term: "looking to spoil", category: "Romance Scam", severity: "high" },
    { term: "send gift card", category: "Romance Scam", severity: "high" },
    { term: "yahoo boy", category: "Romance Scam", severity: "critical" },
    
    // === JOB SCAM ===
    { term: "guaranteed job", category: "Job Scam", severity: "high" },
    { term: "emprego garantido", category: "Job Scam", severity: "high" },
    { term: "work from home packing", category: "Job Scam", severity: "high" },
    { term: "wfh packing products", category: "Job Scam", severity: "high" },
    { term: "advance fee for job", category: "Job Scam", severity: "high" },
    { term: "salary in advance", category: "Job Scam", severity: "high" },
    { term: "make money watching videos", category: "Job Scam", severity: "high" },
    { term: "ganhar dinheiro vendo vídeos", category: "Job Scam", severity: "high" },
    
    // === GIVEAWAY SCAM ===
    { term: "you have won", category: "Giveaway Scam", severity: "high" },
    { term: "você ganhou", category: "Giveaway Scam", severity: "high" },
    { term: "claim your prize", category: "Giveaway Scam", severity: "high" },
    { term: "receba seu prémio", category: "Giveaway Scam", severity: "high" },
    { term: "register to claim", category: "Giveaway Scam", severity: "high" },
    { term: "dm to claim", category: "Giveaway Scam", severity: "high" },
    { term: "inheritance claim", category: "Giveaway Scam", severity: "high" },
    
    // === ADVANCE FEE SCAM ===
    { term: "pay to receive", category: "Advance Fee Scam", severity: "high" },
    { term: "pagar para receber", category: "Advance Fee Scam", severity: "high" },
    { term: "send money first", category: "Advance Fee Scam", severity: "high" },
    { term: "enviar dinheiro primeiro", category: "Advance Fee Scam", severity: "high" },
    { term: "processing fee required", category: "Advance Fee Scam", severity: "high" },
    
    // === ILLUMINATI/SPIRITUAL SCAM ===
    { term: "join illuminati", category: "Spiritual Scam", severity: "high" },
    { term: "illuminati brotherhood", category: "Spiritual Scam", severity: "high" },
    { term: "magic wallet", category: "Spiritual Scam", severity: "high" },
    { term: "carteira mágica", category: "Spiritual Scam", severity: "high" },
    { term: "money spell", category: "Spiritual Scam", severity: "high" },
    
    // === GOVERNMENT GRANT SCAM ===
    { term: "government grant free", category: "Government Grant Scam", severity: "high" },
    { term: "subsídio do governo", category: "Government Grant Scam", severity: "high" },
    { term: "claim government money", category: "Government Grant Scam", severity: "high" },
    { term: "disaster relief fund", category: "Government Grant Scam", severity: "high" },
    
    // === DEBT RELIEF SCAM ===
    { term: "delete your debt", category: "Debt Relief Scam", severity: "high" },
    { term: "eliminar sua dívida", category: "Debt Relief Scam", severity: "high" },
    { term: "new credit identity", category: "Debt Relief Scam", severity: "high" },
    { term: "stop all debt collections", category: "Debt Relief Scam", severity: "high" },
    
    // === MISLEADING HEALTH ===
    { term: "cure diabetes", category: "Misleading Health", severity: "high" },
    { term: "curar diabetes", category: "Misleading Health", severity: "high" },
    { term: "cure cancer", category: "Misleading Health", severity: "high" },
    { term: "curar câncer", category: "Misleading Health", severity: "high" },
    { term: "cure alzheimer", category: "Misleading Health", severity: "high" },
    { term: "cure hiv", category: "Misleading Health", severity: "high" },
    { term: "doctors don't want you to know", category: "Misleading Health", severity: "high" },
    { term: "médicos não querem que saiba", category: "Misleading Health", severity: "high" },
    { term: "miracle cure", category: "Misleading Health", severity: "high" },
    { term: "cura milagrosa", category: "Misleading Health", severity: "high" },
    { term: "lose weight instantly", category: "Misleading Health", severity: "high" },
    { term: "perder peso instantaneamente", category: "Misleading Health", severity: "high" },
    { term: "secret weight loss", category: "Misleading Health", severity: "high" },
    
    // === CHEATING PRODUCTS ===
    { term: "exam answers for sale", category: "Cheating Products", severity: "high" },
    { term: "respostas de exame", category: "Cheating Products", severity: "high" },
    { term: "take your exam for you", category: "Cheating Products", severity: "high" },
    { term: "fazer seu exame", category: "Cheating Products", severity: "high" },
    { term: "thesis writing service", category: "Cheating Products", severity: "high" },
    { term: "pass drug test", category: "Cheating Products", severity: "high" },
    { term: "passar teste de drogas", category: "Cheating Products", severity: "high" },
    
    // === UNAUTHORIZED STREAMING ===
    { term: "iptv subscription", category: "Unauthorized Streaming", severity: "high" },
    { term: "kodi box", category: "Unauthorized Streaming", severity: "high" },
    { term: "jailbroken firestick", category: "Unauthorized Streaming", severity: "high" },
    { term: "fully loaded firestick", category: "Unauthorized Streaming", severity: "high" },
    { term: "all channels firestick", category: "Unauthorized Streaming", severity: "high" },
    
    // === CREDENTIAL SALES ===
    { term: "netflix account for sale", category: "Credential Sales", severity: "high" },
    { term: "spotify account for sale", category: "Credential Sales", severity: "high" },
    { term: "conta netflix", category: "Credential Sales", severity: "high" },
    { term: "login credentials for", category: "Credential Sales", severity: "high" },
    
    // === SOLICITATION SIGNALS ===
    { term: "tap in", category: "Solicitation", severity: "mid" },
    { term: "tappn", category: "Solicitation", severity: "mid" },
    { term: "hmu", category: "Solicitation", severity: "mid" },
    { term: "dm for details", category: "Solicitation", severity: "mid" },
  ],

  // ============================================
  // PSL KEYWORDS - Profane and Sexualized Language
  // ============================================
  psl: [
    // === ENGLISH - Oral Sex Commands ===
    { term: "suck my dick", category: "Sexually Vulgar", severity: "mid" },
    { term: "suck my balls", category: "Sexually Vulgar", severity: "mid" },
    { term: "suck my tits", category: "Sexually Vulgar", severity: "mid" },
    { term: "eat my dick", category: "Sexually Vulgar", severity: "mid" },
    { term: "blow my cock", category: "Sexually Vulgar", severity: "mid" },
    { term: "kiss my ass", category: "Sexually Vulgar", severity: "mid" },
    
    // === ENGLISH - Genitalia & Insults ===
    { term: "dick", category: "Sexually Vulgar", severity: "low", requiresContext: true },
    { term: "dickhead", category: "Sexually Vulgar", severity: "mid" },
    { term: "dickwad", category: "Sexually Vulgar", severity: "mid" },
    { term: "fuck", category: "Sexually Vulgar", severity: "mid", requiresContext: true },
    { term: "fucker", category: "Sexually Vulgar", severity: "mid" },
    { term: "fuckhead", category: "Sexually Vulgar", severity: "mid" },
    { term: "motherfucker", category: "Sexually Vulgar", severity: "mid" },
    { term: "pussy", category: "Sexually Vulgar", severity: "mid", requiresContext: true },
    { term: "cock", category: "Sexually Vulgar", severity: "mid", requiresContext: true },
    { term: "cocksucker", category: "Sexually Vulgar", severity: "mid" },
    { term: "bollocks", category: "Sexually Vulgar", severity: "mid" },
    { term: "whore", category: "Sexually Vulgar", severity: "mid" },
    { term: "twat", category: "Sexually Vulgar", severity: "mid" },
    { term: "jerkoff", category: "Sexually Vulgar", severity: "mid" },
    
    // === PORTUGUESE BRAZILIAN ===
    { term: "chupa meu pau", category: "Sexually Vulgar", severity: "mid" },
    { term: "chupa minhas bolas", category: "Sexually Vulgar", severity: "mid" },
    { term: "chupa meus peitos", category: "Sexually Vulgar", severity: "mid" },
    { term: "chupa o meu caralho", category: "Sexually Vulgar", severity: "mid" },
    { term: "chupa a minha rola", category: "Sexually Vulgar", severity: "mid" },
    { term: "come meu pau", category: "Sexually Vulgar", severity: "mid" },
    { term: "beija minha bunda", category: "Sexually Vulgar", severity: "mid" },
    { term: "beija o meu cu", category: "Sexually Vulgar", severity: "mid" },
    { term: "pau", category: "Sexually Vulgar", severity: "low", requiresContext: true },
    { term: "pinto", category: "Sexually Vulgar", severity: "low", requiresContext: true },
    { term: "caralho", category: "Sexually Vulgar", severity: "mid" },
    { term: "rola", category: "Sexually Vulgar", severity: "mid", requiresContext: true },
    { term: "cacete", category: "Sexually Vulgar", severity: "mid" },
    { term: "buceta", category: "Sexually Vulgar", severity: "mid" },
    { term: "pepeca", category: "Sexually Vulgar", severity: "mid" },
    { term: "ppk", category: "Sexually Vulgar", severity: "mid" },
    { term: "fuder", category: "Sexually Vulgar", severity: "mid" },
    { term: "foda", category: "Sexually Vulgar", severity: "mid" },
    { term: "filho da puta", category: "Sexually Vulgar", severity: "mid" },
    { term: "chupador de rola", category: "Sexually Vulgar", severity: "mid" },
    { term: "puta", category: "Sexually Vulgar", severity: "mid", requiresContext: true },
    { term: "putinha", category: "Sexually Vulgar", severity: "mid" },
    { term: "vagabunda", category: "Sexually Vulgar", severity: "mid" },
    { term: "foder", category: "Sexually Vulgar", severity: "mid" },
    
    // === SPANISH LATAM ===
    { term: "chúpame el pene", category: "Sexually Vulgar", severity: "mid" },
    { term: "chúpame las bolas", category: "Sexually Vulgar", severity: "mid" },
    { term: "chúpame la verga", category: "Sexually Vulgar", severity: "mid" },
    { term: "bésame el culo", category: "Sexually Vulgar", severity: "mid" },
    { term: "verga", category: "Sexually Vulgar", severity: "mid" },
    { term: "pinga", category: "Sexually Vulgar", severity: "mid" },
    { term: "hijo de puta", category: "Sexually Vulgar", severity: "mid" },
    { term: "chocha", category: "Sexually Vulgar", severity: "mid" },
    { term: "zorra", category: "Sexually Vulgar", severity: "mid" },
    { term: "perra", category: "Sexually Vulgar", severity: "mid", requiresContext: true },
    { term: "follar", category: "Sexually Vulgar", severity: "mid" },
    { term: "culear", category: "Sexually Vulgar", severity: "mid" },
    
    // === VIETNAMESE ===
    { term: "bú cặc", category: "Sexually Vulgar", severity: "mid" },
    { term: "liếm cặc", category: "Sexually Vulgar", severity: "mid" },
    { term: "vãi lồn", category: "Sexually Vulgar", severity: "mid" },
    { term: "vãi cặc", category: "Sexually Vulgar", severity: "mid" },
    { term: "ăn cặc tao", category: "Sexually Vulgar", severity: "mid" },
    { term: "cặc", category: "Sexually Vulgar", severity: "mid" },
    { term: "buồi", category: "Sexually Vulgar", severity: "mid" },
    { term: "lồn", category: "Sexually Vulgar", severity: "mid" },
    { term: "địt", category: "Sexually Vulgar", severity: "mid" },
    { term: "đụ", category: "Sexually Vulgar", severity: "mid" },
    { term: "địt mẹ mày", category: "Sexually Vulgar", severity: "mid" },
    { term: "đĩ", category: "Sexually Vulgar", severity: "mid" },
    { term: "cave", category: "Sexually Vulgar", severity: "mid", requiresContext: true },
    { term: "điếm", category: "Sexually Vulgar", severity: "mid" },
    
    // === CHINESE MANDARIN ===
    { term: "吸屌", category: "Sexually Vulgar", severity: "mid" },
    { term: "口交", category: "Sexually Vulgar", severity: "mid" },
    { term: "口爆", category: "Sexually Vulgar", severity: "mid" },
    { term: "屌", category: "Sexually Vulgar", severity: "mid" },
    { term: "幹", category: "Sexually Vulgar", severity: "mid" },
    { term: "操", category: "Sexually Vulgar", severity: "mid" },
    { term: "幹你娘", category: "Sexually Vulgar", severity: "mid" },
    { term: "肏你媽", category: "Sexually Vulgar", severity: "mid" },
    { term: "操你娘", category: "Sexually Vulgar", severity: "mid" },
    { term: "屄", category: "Sexually Vulgar", severity: "mid" },
    { term: "逼", category: "Sexually Vulgar", severity: "mid" },
    { term: "婊子", category: "Sexually Vulgar", severity: "mid" },
    { term: "蕩婦", category: "Sexually Vulgar", severity: "mid" },
    
    // === FILIPINO ===
    { term: "chupa", category: "Sexually Vulgar", severity: "mid", requiresContext: true },
    { term: "tsupa", category: "Sexually Vulgar", severity: "mid" },
    { term: "tite", category: "Sexually Vulgar", severity: "mid" },
    { term: "titi", category: "Sexually Vulgar", severity: "mid" },
    { term: "burat", category: "Sexually Vulgar", severity: "mid" },
    { term: "puta", category: "Sexually Vulgar", severity: "mid", requiresContext: true },
    { term: "putangina mo", category: "Sexually Vulgar", severity: "mid" },
    { term: "puki", category: "Sexually Vulgar", severity: "mid" },
    { term: "kantot", category: "Sexually Vulgar", severity: "mid" },
    { term: "pokpok", category: "Sexually Vulgar", severity: "mid" },
    
    // === HINDI/HINGLISH ===
    { term: "mera lauda chus", category: "Sexually Vulgar", severity: "mid" },
    { term: "lund", category: "Sexually Vulgar", severity: "mid" },
    { term: "lauda", category: "Sexually Vulgar", severity: "mid" },
    { term: "भेनचोद", category: "Sexually Vulgar", severity: "mid" },
    { term: "bhenchod", category: "Sexually Vulgar", severity: "mid" },
    { term: "मादरचोद", category: "Sexually Vulgar", severity: "mid" },
    { term: "madarchod", category: "Sexually Vulgar", severity: "mid" },
    { term: "चूतिया", category: "Sexually Vulgar", severity: "mid" },
    { term: "chutiya", category: "Sexually Vulgar", severity: "mid" },
    { term: "रंडी", category: "Sexually Vulgar", severity: "mid" },
    { term: "randi", category: "Sexually Vulgar", severity: "mid" },
    { term: "chodna", category: "Sexually Vulgar", severity: "mid" },
    
    // === INDONESIAN ===
    { term: "isep kontol", category: "Sexually Vulgar", severity: "mid" },
    { term: "kontol", category: "Sexually Vulgar", severity: "mid" },
    { term: "ngentot", category: "Sexually Vulgar", severity: "mid" },
    { term: "memek", category: "Sexually Vulgar", severity: "mid" },
    { term: "lonte", category: "Sexually Vulgar", severity: "mid" },
    
    // === ARABIC ===
    { term: "مص عيري", category: "Sexually Vulgar", severity: "mid" },
    { term: "زب", category: "Sexually Vulgar", severity: "mid" },
    { term: "نيك", category: "Sexually Vulgar", severity: "mid" },
    { term: "كس", category: "Sexually Vulgar", severity: "mid" },
    { term: "شرموطة", category: "Sexually Vulgar", severity: "mid" },
    { term: "كس امك", category: "Sexually Vulgar", severity: "mid" },
    { term: "قحبة", category: "Sexually Vulgar", severity: "mid" },
    
    // === OBFUSCATION PATTERNS ===
    { term: "f**k", category: "Sexually Vulgar", severity: "mid" },
    { term: "f*ck", category: "Sexually Vulgar", severity: "mid" },
    { term: "f***", category: "Sexually Vulgar", severity: "mid" },
    { term: "sh*t", category: "Sexually Vulgar", severity: "low" },
    { term: "fack", category: "Sexually Vulgar", severity: "mid" },
    { term: "phuck", category: "Sexually Vulgar", severity: "mid" },
    { term: "fuk", category: "Sexually Vulgar", severity: "mid" },
    { term: "suckmydick", category: "Sexually Vulgar", severity: "mid" },
    { term: "motherfuker", category: "Sexually Vulgar", severity: "mid" },
    { term: "mother fucker", category: "Sexually Vulgar", severity: "mid" },
    { term: "cock sucker", category: "Sexually Vulgar", severity: "mid" },
  ],

  // ============================================
  // HE KEYWORDS - Human Exploitation
  // ============================================
  he: [
    // === SEX TRAFFICKING ===
    { term: "sex trafficking", category: "Sex Trafficking", severity: "critical" },
    { term: "tráfico sexual", category: "Sex Trafficking", severity: "critical" },
    { term: "tráfico de pessoas", category: "Human Trafficking", severity: "critical" },
    { term: "human trafficking", category: "Human Trafficking", severity: "critical" },
    { term: "minor for sale", category: "Minor Sex Trafficking", severity: "critical" },
    { term: "girls available", category: "Sex Trafficking", severity: "high", requiresContext: true },
    { term: "women available", category: "Sex Trafficking", severity: "high", requiresContext: true },
    { term: "escort service", category: "Commercial Sexual Activity", severity: "mid", requiresContext: true },
    { term: "call girl", category: "Commercial Sexual Activity", severity: "mid" },
    { term: "call boy", category: "Commercial Sexual Activity", severity: "mid" },
    { term: "prostitutes available", category: "CCSA", severity: "high" },
    { term: "brothel", category: "CCSA", severity: "mid", requiresContext: true },
    { term: "bordel", category: "CCSA", severity: "mid", requiresContext: true },
    
    // === LABOR EXPLOITATION - Explicit ===
    { term: "bypass labor regulations", category: "Labor Exploitation", severity: "critical" },
    { term: "contornar regulamentos laborais", category: "Labor Exploitation", severity: "critical" },
    { term: "trabalho ilegal", category: "Labor Exploitation", severity: "high" },
    { term: "illegal workers", category: "Labor Exploitation", severity: "high" },
    { term: "trabalhadores ilegais", category: "Labor Exploitation", severity: "high" },
    { term: "black job", category: "Labor Exploitation", severity: "high" },
    { term: "gray job", category: "Labor Exploitation", severity: "high" },
    { term: "escape your sponsor", category: "Labor Exploitation", severity: "critical" },
    { term: "100% visa guaranteed", category: "Labor Exploitation", severity: "high" },
    { term: "visto garantido", category: "Labor Exploitation", severity: "high" },
    { term: "surrender passport", category: "Labor Exploitation", severity: "critical" },
    { term: "entregar passaporte", category: "Labor Exploitation", severity: "critical" },
    { term: "visitor visa for work", category: "Labor Exploitation", severity: "high" },
    { term: "palm oil plantation", category: "Labor Exploitation", severity: "high", requiresContext: true },
    
    // === LABOR EXPLOITATION - Primary ===
    { term: "no experience required", category: "Labor Abuse", severity: "mid", requiresContext: true },
    { term: "sem experiência necessária", category: "Labor Abuse", severity: "mid", requiresContext: true },
    { term: "guaranteed job", category: "Labor Abuse", severity: "mid" },
    { term: "emprego garantido", category: "Labor Abuse", severity: "mid" },
    { term: "free visa", category: "Labor Exploitation", severity: "high" },
    { term: "visto grátis", category: "Labor Exploitation", severity: "high" },
    { term: "no work permit required", category: "Labor Exploitation", severity: "high" },
    { term: "restricted movement", category: "Labor Exploitation", severity: "high" },
    { term: "employer controls income", category: "Labor Exploitation", severity: "critical" },
    
    // === LABOR EXPLOITATION - Secondary ===
    { term: "start immediately", category: "Labor Abuse", severity: "low" },
    { term: "começar imediatamente", category: "Labor Abuse", severity: "low" },
    { term: "urgent hiring", category: "Labor Abuse", severity: "low" },
    { term: "contratação urgente", category: "Labor Abuse", severity: "low" },
    { term: "no contract", category: "Labor Abuse", severity: "mid" },
    { term: "sem contrato", category: "Labor Abuse", severity: "mid" },
    { term: "long hours", category: "Labor Abuse", severity: "low", requiresContext: true },
    { term: "deducted from salary", category: "Labor Abuse", severity: "mid" },
    { term: "descontado do salário", category: "Labor Abuse", severity: "mid" },
    { term: "travel costs deducted", category: "Labor Abuse", severity: "mid" },
    { term: "unrealistic salary", category: "Labor Abuse", severity: "mid" },
    
    // === DOMESTIC SERVITUDE ===
    { term: "maids for sale", category: "Domestic Servitude", severity: "critical" },
    { term: "empregadas à venda", category: "Domestic Servitude", severity: "critical" },
    { term: "domestic helper visa", category: "Domestic Servitude", severity: "mid", requiresContext: true },
    { term: "domestic worker sale", category: "Domestic Servitude", severity: "critical" },
    
    // === ORGAN TRAFFICKING ===
    { term: "kidney for sale", category: "Organ Trafficking", severity: "critical" },
    { term: "rim à venda", category: "Organ Trafficking", severity: "critical" },
    { term: "sell my kidney", category: "Organ Trafficking", severity: "high" },
    { term: "vender meu rim", category: "Organ Trafficking", severity: "high" },
    { term: "liver for sale", category: "Organ Trafficking", severity: "critical" },
    { term: "fígado à venda", category: "Organ Trafficking", severity: "critical" },
    { term: "organ trafficking", category: "Organ Trafficking", severity: "critical" },
    { term: "tráfico de órgãos", category: "Organ Trafficking", severity: "critical" },
    { term: "buy organ", category: "Organ Trafficking", severity: "critical" },
    { term: "comprar órgão", category: "Organ Trafficking", severity: "critical" },
    { term: "organ donor needed", category: "Organ Trafficking", severity: "mid", requiresContext: true },
    { term: "sell organs", category: "Organ Trafficking", severity: "high" },
    { term: "vender órgãos", category: "Organ Trafficking", severity: "high" },
    
    // === CHILD SALE / ADOPTION ===
    { term: "baby for sale", category: "Child Sale", severity: "critical" },
    { term: "bebé à venda", category: "Child Sale", severity: "critical" },
    { term: "child for sale", category: "Child Sale", severity: "critical" },
    { term: "criança à venda", category: "Child Sale", severity: "critical" },
    { term: "adopt my baby", category: "Child Sale", severity: "high", requiresContext: true },
    { term: "adoptar meu bebé", category: "Child Sale", severity: "high", requiresContext: true },
    { term: "selling my child", category: "Child Sale", severity: "critical" },
    { term: "vender meu filho", category: "Child Sale", severity: "critical" },
    { term: "illegal adoption", category: "Child Sale", severity: "critical" },
    { term: "adoção ilegal", category: "Child Sale", severity: "critical" },
    
    // === FORCED MARRIAGE ===
    { term: "forced marriage", category: "Forced Marriage", severity: "critical" },
    { term: "casamento forçado", category: "Forced Marriage", severity: "critical" },
    { term: "child marriage", category: "Forced Marriage", severity: "critical" },
    { term: "casamento infantil", category: "Forced Marriage", severity: "critical" },
    { term: "marry my daughter", category: "Forced Marriage", severity: "high", requiresContext: true },
    { term: "casar com minha filha", category: "Forced Marriage", severity: "high", requiresContext: true },
    { term: "young bride", category: "Forced Marriage", severity: "high", requiresContext: true },
    { term: "noiva jovem", category: "Forced Marriage", severity: "high", requiresContext: true },
    
    // === CHILD SOLDIERS ===
    { term: "child soldier", category: "Child Soldiers", severity: "critical" },
    { term: "criança soldado", category: "Child Soldiers", severity: "critical" },
    { term: "young fighter", category: "Child Soldiers", severity: "high" },
    { term: "minor fighter", category: "Child Soldiers", severity: "critical" },
    { term: "join armed group", category: "Child Soldiers", severity: "high" },
    { term: "juntar-se a grupo armado", category: "Child Soldiers", severity: "high" },
    { term: "recruiting minors", category: "Child Soldiers", severity: "critical" },
    { term: "recrutar menores", category: "Child Soldiers", severity: "critical" },
    
    // === HUMAN SMUGGLING - Explicit ===
    { term: "human smuggling", category: "Human Smuggling", severity: "critical" },
    { term: "contrabando humano", category: "Human Smuggling", severity: "critical" },
    { term: "smuggling services", category: "Human Smuggling", severity: "critical" },
    { term: "serviços de contrabando", category: "Human Smuggling", severity: "critical" },
    { term: "illegal immigration", category: "Human Smuggling", severity: "high" },
    { term: "imigração ilegal", category: "Human Smuggling", severity: "high" },
    { term: "illegal crossing", category: "Human Smuggling", severity: "high" },
    { term: "travessia ilegal", category: "Human Smuggling", severity: "high" },
    { term: "secret immigration", category: "Human Smuggling", severity: "critical" },
    { term: "smuggling passage", category: "Human Smuggling", severity: "critical" },
    { term: "illegal migrants", category: "Human Smuggling", severity: "high" },
    { term: "coyote", category: "Human Smuggling", severity: "high", requiresContext: true },
    { term: "pollero", category: "Human Smuggling", severity: "high" },
    
    // === HUMAN SMUGGLING - Primary ===
    { term: "cross the border", category: "Human Smuggling", severity: "mid", requiresContext: true },
    { term: "atravessar a fronteira", category: "Human Smuggling", severity: "mid", requiresContext: true },
    { term: "fake passport", category: "Human Smuggling", severity: "high" },
    { term: "passaporte falso", category: "Human Smuggling", severity: "high" },
    { term: "fake documents", category: "Human Smuggling", severity: "high" },
    { term: "documentos falsos", category: "Human Smuggling", severity: "high" },
    { term: "guaranteed visa crossing", category: "Human Smuggling", severity: "high" },
    { term: "safe crossing", category: "Human Smuggling", severity: "mid", requiresContext: true },
    { term: "travessia segura", category: "Human Smuggling", severity: "mid", requiresContext: true },
    { term: "avoid checkpoints", category: "Human Smuggling", severity: "high" },
    { term: "evitar checkpoints", category: "Human Smuggling", severity: "high" },
    
    // === HIGH-RISK LOCATIONS ===
    { term: "job in poipet", category: "High-Risk Location", severity: "high" },
    { term: "trabalho em poipet", category: "High-Risk Location", severity: "high" },
    { term: "job in bavet", category: "High-Risk Location", severity: "high" },
    { term: "job in pailin", category: "High-Risk Location", severity: "high" },
    { term: "job in bokeo", category: "High-Risk Location", severity: "high" },
    { term: "job in myawaddy", category: "High-Risk Location", severity: "high" },
    { term: "trabalho em myawaddy", category: "High-Risk Location", severity: "high" },
    
    // === FORCE/FRAUD/COERCION SIGNALS ===
    { term: "confiscate passport", category: "Force Signal", severity: "critical" },
    { term: "confiscar passaporte", category: "Force Signal", severity: "critical" },
    { term: "cannot leave", category: "Force Signal", severity: "high" },
    { term: "não pode sair", category: "Force Signal", severity: "high" },
    { term: "held against will", category: "Force Signal", severity: "critical" },
    { term: "retido contra vontade", category: "Force Signal", severity: "critical" },
    { term: "threat of deportation", category: "Coercion Signal", severity: "high" },
    { term: "ameaça de deportação", category: "Coercion Signal", severity: "high" },
    { term: "withhold wages", category: "Fraud Signal", severity: "high" },
    { term: "reter salário", category: "Fraud Signal", severity: "high" },
    
    // === CTC TRENDS (for reference) ===
    { term: "call boy service india", category: "CTC Trend", severity: "mid" },
    { term: "sugar mummy agency", category: "CTC Trend", severity: "mid" },
    { term: "nuru massage", category: "CTC Trend", severity: "mid", requiresContext: true },
    { term: "body to body massage", category: "CTC Trend", severity: "mid", requiresContext: true },
    { term: "vip massage", category: "CTC Trend", severity: "mid", requiresContext: true },
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

  return {
    ...baseAnalysis,
    primaryPolicy: aiAnalysis.policy || baseAnalysis.primaryPolicy,
    primaryPolicyName: aiAnalysis.policyName || baseAnalysis.primaryPolicyName,
    action: aiAnalysis.suggestedAction || baseAnalysis.action,
    shouldEscalate: aiAnalysis.shouldEscalate || baseAnalysis.shouldEscalate,
    confidence: mergedConfidence,
    label: aiAnalysis.suggestedLabel || baseAnalysis.label,
    labelPath: aiAnalysis.suggestedLabel
      ? aiAnalysis.suggestedLabel.split(" > ")
      : baseAnalysis.labelPath,
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