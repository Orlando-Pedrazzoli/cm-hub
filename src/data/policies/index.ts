// ============================================
// CM POLICY HUB - POLICIES INDEX
// Exporta todas as 27 policies
// ============================================

import { PolicyId } from "@/lib/types";

// Import policy content strings
import { ANSA_POLICY } from "./ansa-policy";
import { ASE_POLICY } from "./ase-policy";
import { SSPX_POLICY } from "./sspx-policy";
import { BH_POLICY } from "./bh-policy";
import { CSEAN_POLICY } from "./csean-policy";

// ============================================
// POLICY DEFINITIONS
// ============================================

export interface PolicyConfig {
  id: PolicyId;
  name: string;
  shortName: string;
  description: string;
  color: string;
  bgColor: string;
  icon: string;
  ready: boolean;
  priority: number; // Lower = higher priority (for hierarchy)
  content?: string; // Full policy text for AI context
}

export const POLICIES: PolicyConfig[] = [
  // ============================================
  // CHILD SAFETY - HIGHEST PRIORITY
  // ============================================
  {
    id: "csean",
    name: "Child Sexual Exploitation, Abuse, and Nudity",
    shortName: "CSEAN",
    description: "Proteção de menores contra exploração sexual, abuso e conteúdo de nudez. Inclui CSAM, solicitação, IIC, sextortion e sexualização.",
    color: "#dc2626",
    bgColor: "#fef2f2",
    icon: "🛡️",
    ready: true,
    priority: 1,
    content: CSEAN_POLICY,
  },

  // ============================================
  // VIOLENCE - HIGH PRIORITY
  // ============================================
  {
    id: "vi",
    name: "Violence and Incitement",
    shortName: "V&I",
    description: "Ameaças credíveis, incitamento à violência, declarações de intenção violenta contra pessoas ou grupos.",
    color: "#dc2626",
    bgColor: "#fef2f2",
    icon: "⚠️",
    ready: true,
    priority: 2,
  },
  {
    id: "vgc",
    name: "Violent and Graphic Content",
    shortName: "VGC",
    description: "Conteúdo gráfico violento, gore, mutilação, morte violenta visível.",
    color: "#b91c1c",
    bgColor: "#fef2f2",
    icon: "🩸",
    ready: false,
    priority: 3,
  },
  {
    id: "doi",
    name: "Dangerous Organizations and Individuals",
    shortName: "DOI",
    description: "Organizações terroristas, grupos de ódio, indivíduos perigosos designados.",
    color: "#991b1b",
    bgColor: "#fef2f2",
    icon: "🚨",
    ready: false,
    priority: 4,
  },

  // ============================================
  // ADULT SEXUAL CONTENT
  // ============================================
  {
    id: "ansa",
    name: "Adult Nudity and Sexual Activity",
    shortName: "ANSA",
    description: "Nudez adulta e atividade sexual. Inclui tipos de imagem (fotorealista, digital, arte), contextos permitidos e exceções.",
    color: "#db2777",
    bgColor: "#fdf2f8",
    icon: "🔞",
    ready: true,
    priority: 10,
    content: ANSA_POLICY,
  },
  {
    id: "ase",
    name: "Adult Sexual Exploitation",
    shortName: "ASE",
    description: "Exploração sexual de adultos. Inclui NCST, sextortion, NCII, creepshots, stripping forçado, necrofilia.",
    color: "#be185d",
    bgColor: "#fdf2f8",
    icon: "⛔",
    ready: true,
    priority: 5,
    content: ASE_POLICY,
  },
  {
    id: "sspx",
    name: "Adult Sexual Solicitation & Sexually Explicit Language",
    shortName: "SSPx",
    description: "Solicitação sexual adulta e linguagem sexualmente explícita. Prostituição, solicitação, pornografia, linguagem sexualizada.",
    color: "#a21caf",
    bgColor: "#fdf4ff",
    icon: "💬",
    ready: true,
    priority: 11,
    content: SSPX_POLICY,
  },

  // ============================================
  // HARASSMENT & HATE
  // ============================================
  {
    id: "bh",
    name: "Bullying and Harassment",
    shortName: "B&H",
    description: "Bullying e assédio. Sistema de 4 tiers de proteção baseado no tipo de figura (pública, LSPF, privada, menor).",
    color: "#ea580c",
    bgColor: "#fff7ed",
    icon: "🎯",
    ready: true,
    priority: 6,
    content: BH_POLICY,
  },
  {
    id: "hc",
    name: "Hateful Conduct",
    shortName: "HC",
    description: "Conduta de ódio baseada em características protegidas (raça, etnia, religião, orientação sexual, etc.).",
    color: "#c2410c",
    bgColor: "#fff7ed",
    icon: "🚫",
    ready: false,
    priority: 7,
  },

  // ============================================
  // SELF-HARM & MENTAL HEALTH
  // ============================================
  {
    id: "ssied",
    name: "Suicide, Self-Injury, and Eating Disorders",
    shortName: "SSIED",
    description: "Suicídio, auto-lesão e distúrbios alimentares. Promoção, glorificação, instruções.",
    color: "#7c3aed",
    bgColor: "#f5f3ff",
    icon: "💜",
    ready: false,
    priority: 8,
  },
  {
    id: "cis",
    name: "Credible Intent of Suicide",
    shortName: "CIS",
    description: "Intenção credível de suicídio. Requer escalação imediata.",
    color: "#6d28d9",
    bgColor: "#f5f3ff",
    icon: "🆘",
    ready: false,
    priority: 9,
  },

  // ============================================
  // EXPLOITATION & CRIME
  // ============================================
  {
    id: "he",
    name: "Human Exploitation",
    shortName: "HE",
    description: "Tráfico humano, exploração laboral, tráfico de órgãos, casamento forçado.",
    color: "#be123c",
    bgColor: "#fff1f2",
    icon: "⛓️",
    ready: false,
    priority: 12,
  },
  {
    id: "chpc",
    name: "Coordinating Harm and Promoting Crime",
    shortName: "CHPC",
    description: "Coordenação de danos e promoção de crime. Organização de atividades ilegais.",
    color: "#9f1239",
    bgColor: "#fff1f2",
    icon: "🔗",
    ready: false,
    priority: 13,
  },

  // ============================================
  // FRAUD & DECEPTION
  // ============================================
  {
    id: "fsdp",
    name: "Fraud, Scam, and Deceptive Practices",
    shortName: "FSDP",
    description: "Fraude, scams, práticas enganosas. Phishing, esquemas financeiros, falsificação.",
    color: "#0891b2",
    bgColor: "#ecfeff",
    icon: "🎭",
    ready: false,
    priority: 14,
  },
  {
    id: "cyber",
    name: "Cybersecurity",
    shortName: "Cyber",
    description: "Ameaças de cibersegurança. Hacking, malware, exploits, doxxing.",
    color: "#0e7490",
    bgColor: "#ecfeff",
    icon: "🔐",
    ready: false,
    priority: 15,
  },
  {
    id: "pv",
    name: "Privacy Violations",
    shortName: "PV",
    description: "Violações de privacidade. Partilha de informação pessoal, doxxing, stalking.",
    color: "#0284c7",
    bgColor: "#f0f9ff",
    icon: "👁️",
    ready: false,
    priority: 16,
  },

  // ============================================
  // REGULATED GOODS & SERVICES
  // ============================================
  {
    id: "dp",
    name: "Drugs and Pharmaceuticals",
    shortName: "D&P",
    description: "Drogas e farmacêuticos. Venda, promoção, instruções de uso.",
    color: "#4f46e5",
    bgColor: "#eef2ff",
    icon: "💊",
    ready: false,
    priority: 17,
  },
  {
    id: "ta",
    name: "Tobacco and Alcohol",
    shortName: "T&A",
    description: "Tabaco e álcool. Venda a menores, promoção inadequada.",
    color: "#6366f1",
    bgColor: "#eef2ff",
    icon: "🚬",
    ready: false,
    priority: 18,
  },
  {
    id: "wae",
    name: "Weapons, Ammunition, and Explosives",
    shortName: "WAE",
    description: "Armas, munições e explosivos. Venda, fabricação, instruções.",
    color: "#7c3aed",
    bgColor: "#f5f3ff",
    icon: "💣",
    ready: false,
    priority: 19,
  },
  {
    id: "ogg",
    name: "Online Gambling and Games",
    shortName: "OGG",
    description: "Jogos de azar online. Casinos, apostas, jogos não regulamentados.",
    color: "#059669",
    bgColor: "#ecfdf5",
    icon: "🎰",
    ready: false,
    priority: 20,
  },

  // ============================================
  // HEALTH & SAFETY
  // ============================================
  {
    id: "hw",
    name: "Health and Wellness",
    shortName: "H&W",
    description: "Saúde e bem-estar. Desinformação médica, tratamentos perigosos.",
    color: "#10b981",
    bgColor: "#ecfdf5",
    icon: "🏥",
    ready: false,
    priority: 21,
  },
  {
    id: "rp",
    name: "Recalled Products",
    shortName: "RP",
    description: "Produtos recolhidos. Venda de produtos perigosos ou recolhidos.",
    color: "#84cc16",
    bgColor: "#f7fee7",
    icon: "📦",
    ready: false,
    priority: 22,
  },

  // ============================================
  // SPAM & MANIPULATION
  // ============================================
  {
    id: "spam",
    name: "Spam",
    shortName: "Spam",
    description: "Spam e comportamento inautêntico. Conteúdo repetitivo, bots, manipulação.",
    color: "#64748b",
    bgColor: "#f8fafc",
    icon: "📧",
    ready: false,
    priority: 23,
  },

  // ============================================
  // BRANDED CONTENT
  // ============================================
  {
    id: "bcp",
    name: "Branded Content Prohibited",
    shortName: "BCP",
    description: "Conteúdo de marca proibido. Categorias não permitidas para publicidade.",
    color: "#475569",
    bgColor: "#f8fafc",
    icon: "🏷️",
    ready: false,
    priority: 24,
  },
  {
    id: "bcr",
    name: "Branded Content Restricted",
    shortName: "BCR",
    description: "Conteúdo de marca restrito. Requer aprovação ou limitações.",
    color: "#334155",
    bgColor: "#f8fafc",
    icon: "🔖",
    ready: false,
    priority: 25,
  },

  // ============================================
  // OTHER
  // ============================================
  {
    id: "psl",
    name: "Profane and Sexualized Language",
    shortName: "PSL",
    description: "Linguagem profana e sexualizada fora de contexto de exploração.",
    color: "#ec4899",
    bgColor: "#fdf2f8",
    icon: "🤬",
    ready: false,
    priority: 26,
  },
  {
    id: "orgs",
    name: "Other RGS",
    shortName: "Other",
    description: "Outros bens e serviços regulamentados não cobertos por outras policies.",
    color: "#94a3b8",
    bgColor: "#f8fafc",
    icon: "📋",
    ready: false,
    priority: 27,
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getPolicyById(id: PolicyId): PolicyConfig | undefined {
  return POLICIES.find((p) => p.id === id);
}

export function getReadyPolicies(): PolicyConfig[] {
  return POLICIES.filter((p) => p.ready);
}

export function getPoliciesByPriority(): PolicyConfig[] {
  return [...POLICIES].sort((a, b) => a.priority - b.priority);
}

export function getPolicyColor(id: PolicyId): string {
  return getPolicyById(id)?.color || "#64748b";
}

export function getPolicyName(id: PolicyId): string {
  return getPolicyById(id)?.name || id.toUpperCase();
}

export function getPolicyShortName(id: PolicyId): string {
  return getPolicyById(id)?.shortName || id.toUpperCase();
}

// ============================================
// POLICY CONTENT FOR AI CONTEXT
// ============================================

export function getPolicyContent(id: PolicyId): string | undefined {
  return getPolicyById(id)?.content;
}

export function getAllReadyPolicyContent(): string {
  return getReadyPolicies()
    .filter((p) => p.content)
    .map((p) => `\n\n=== ${p.shortName} (${p.name}) ===\n${p.content}`)
    .join("\n");
}

// ============================================
// EXPORT INDIVIDUAL POLICIES
// ============================================

export { ANSA_POLICY } from "./ansa-policy";
export { ASE_POLICY } from "./ase-policy";
export { SSPX_POLICY } from "./sspx-policy";
export { BH_POLICY } from "./bh-policy";
export { CSEAN_POLICY } from "./csean-policy";

// ============================================
// POLICY STATISTICS
// ============================================

export const POLICY_STATS = {
  total: POLICIES.length,
  ready: POLICIES.filter((p) => p.ready).length,
  pending: POLICIES.filter((p) => !p.ready).length,
  readyPercentage: Math.round((POLICIES.filter((p) => p.ready).length / POLICIES.length) * 100),
};

export default POLICIES;
