// ============================================
// CM POLICY HUB - POLICIES INDEX
// Compatível com imports existentes no projeto
// Status: 25 of 25 policies com dados completos ✅
// Updated: 2024-12-27
// ============================================

// =====================================
// TYPES
// =====================================

export interface PolicyConfig {
  id: string;
  name: string;
  shortName: string;
  description: string;
  color: string;
  icon: string;
  ready: boolean;
  sensitive?: boolean;
  categories?: number;
  keywords?: number;
}

export interface PolicyStats {
  total: number;
  ready: number;
  pending: number;
  withData: number;
}

// =====================================
// ALL 25 POLICIES CONFIGURATION
// =====================================

export const POLICIES: PolicyConfig[] = [
  // ===== READY (25) - Com dados completos =====
  
  // Critical Priority - Child Safety
  {
    id: "csean",
    name: "Child Sexual Exploitation, Abuse, and Nudity",
    shortName: "CSEAN",
    description: "Highest priority policy protecting minors from exploitation, CSAM, grooming, IIC, sextortion, and child nudity.",
    color: "#DC2626",
    icon: "shield-alert",
    ready: true,
    sensitive: true,
    categories: 7,
    keywords: 200,
  },
  
  // Critical Priority - Human Safety
  {
    id: "he",
    name: "Human Exploitation",
    shortName: "HE",
    description: "Addresses human trafficking, sex trafficking, organ trafficking, smuggling, and forced labor.",
    color: "#B91C1C",
    icon: "users",
    ready: true,
    sensitive: true,
    categories: 5,
    keywords: 150,
  },
  
  // Critical Priority - Dangerous Entities
  {
    id: "doi",
    name: "Dangerous Organizations and Individuals",
    shortName: "DOI",
    description: "Restricts content from terrorist organizations (Tier 1-3), hate groups, criminal enterprises, and militarized movements.",
    color: "#7C2D12",
    icon: "alert-octagon",
    ready: true,
    categories: 6,
    keywords: 300,
  },
  
  // High Priority - Self-Harm
  {
    id: "ssied",
    name: "Suicide, Self-Injury, and Eating Disorders",
    shortName: "SSIED",
    description: "Protects users from harmful content while allowing support-seeking. Includes CIS escalation protocol.",
    color: "#9333EA",
    icon: "heart-pulse",
    ready: true,
    sensitive: true,
    categories: 5,
    keywords: 150,
  },
  
  // High Priority - Violence
  {
    id: "vi",
    name: "Violence and Incitement",
    shortName: "VI",
    description: "Prevents offline harm by removing threats, incitement, and calls for violence. High/Mid/Low severity tiers.",
    color: "#EA580C",
    icon: "alert-triangle",
    ready: true,
    categories: 5,
    keywords: 150,
  },
  
  // High Priority - Hate
  {
    id: "hc",
    name: "Hateful Conduct",
    shortName: "HC",
    description: "Addresses hate speech, dehumanization, slurs, exclusion, and discrimination based on protected characteristics.",
    color: "#BE185D",
    icon: "ban",
    ready: true,
    categories: 4,
    keywords: 200,
  },
  
  // High Priority - Graphic Content
  {
    id: "vgc",
    name: "Violent and Graphic Content",
    shortName: "VGC",
    description: "Addresses graphic violence imagery with 10-level severity hierarchy for humans, animals, and fictional content.",
    color: "#DB2777",
    icon: "skull",
    ready: true,
    categories: 4,
    keywords: 100,
  },
  
  // Mid Priority - Harassment
  {
    id: "bh",
    name: "Bullying and Harassment",
    shortName: "BH",
    description: "4-tier protection system based on user status (public/private) and age (adult/minor). Protects from targeted harassment.",
    color: "#7C3AED",
    icon: "message-circle-warning",
    ready: true,
    categories: 4,
    keywords: 180,
  },
  
  // Mid Priority - Coordinating Harm
  {
    id: "chpc",
    name: "Coordinating Harm and Promoting Crime",
    shortName: "CHPC",
    description: "Prevents coordination of harmful activities against animals, property, people. Includes outing, swatting, viral challenges.",
    color: "#7C3AED",
    icon: "gavel",
    ready: true,
    categories: 4,
    keywords: 120,
  },
  
  // Mid Priority - Fraud
  {
    id: "fsdp",
    name: "Fraud, Scams, and Deceptive Practices",
    shortName: "FSDP",
    description: "Addresses financial fraud, scams, fake documents, counterfeit currency, and deceptive practices.",
    color: "#0891B2",
    icon: "shield-x",
    ready: true,
    categories: 6,
    keywords: 150,
  },
  
  // Mid Priority - Cybersecurity
  {
    id: "cs",
    name: "Cybersecurity",
    shortName: "CS",
    description: "Addresses hacking, phishing, malware distribution, credential theft, and unauthorized access.",
    color: "#0D9488",
    icon: "lock",
    ready: true,
    categories: 5,
    keywords: 100,
  },
  
  // Mid Priority - Privacy
  {
    id: "pv",
    name: "Privacy Violations",
    shortName: "PV",
    description: "Protects PII (PIID/PIFI), addresses doxxing, unauthorized data sharing, and hacked materials.",
    color: "#059669",
    icon: "eye",
    ready: true,
    categories: 4,
    keywords: 80,
  },
  
  // Mid Priority - Drugs
  {
    id: "dp",
    name: "Drugs and Pharmaceuticals",
    shortName: "DP",
    description: "Restricts sale of illegal drugs, prescription medications, drug paraphernalia. 4-tier classification system.",
    color: "#65A30D",
    icon: "pill",
    ready: true,
    categories: 4,
    keywords: 200,
  },
  
  // Mid Priority - Weapons
  {
    id: "wae",
    name: "Weapons, Ammunition, and Explosives",
    shortName: "WAE",
    description: "Restricts sale and promotion of weapons, ammunition, and explosives. Distinguishes B2B vs P2P sales.",
    color: "#EF4444",
    icon: "bomb",
    ready: true,
    categories: 3,
    keywords: 100,
  },
  
  // Mid Priority - Tobacco/Alcohol
  {
    id: "ta",
    name: "Tobacco and Alcohol",
    shortName: "TA",
    description: "Restricts sale and promotion of tobacco, ENDS/vape, and alcohol products. B2B vs P2P detection.",
    color: "#78716C",
    icon: "cigarette",
    ready: true,
    categories: 4,
    keywords: 130,
  },
  
  // Mid Priority - Health
  {
    id: "hw",
    name: "Health and Wellness",
    shortName: "HW",
    description: "Addresses misleading health claims, miracle cures, dangerous medical advice, and wellness scams.",
    color: "#84CC16",
    icon: "heart",
    ready: true,
    categories: 4,
    keywords: 100,
  },
  
  // Mid Priority - Gambling
  {
    id: "ogg",
    name: "Online Gambling and Gaming",
    shortName: "OGG",
    description: "Restricts illegal gambling, unlicensed casinos, and predatory gaming content.",
    color: "#F59E0B",
    icon: "dice",
    ready: true,
    categories: 3,
    keywords: 80,
  },
  
  // Low Priority - Spam
  {
    id: "spam",
    name: "Spam",
    shortName: "SPAM",
    description: "Addresses spam, engagement manipulation, fake engagement, and inauthentic behavior.",
    color: "#F97316",
    icon: "mail-warning",
    ready: true,
    categories: 3,
    keywords: 60,
  },
  
  // Low Priority - Recalled Products
  {
    id: "rp",
    name: "Recalled Products",
    shortName: "RP",
    description: "Restricts sale of recalled and dangerous products based on official recall databases.",
    color: "#DC2626",
    icon: "package-x",
    ready: true,
    categories: 2,
    keywords: 50,
  },
  
  // Low Priority - Language
  {
    id: "psl",
    name: "Profanity and Sensitive Language",
    shortName: "PSL",
    description: "Addresses profanity, slurs, and sensitive language. Includes market-specific slang.",
    color: "#475569",
    icon: "message-square-x",
    ready: true,
    categories: 3,
    keywords: 150,
  },
  
  // Supporting - CIS (part of SSIED)
  {
    id: "cis",
    name: "Credible Intent of Suicide",
    shortName: "CIS",
    description: "Escalation protocol for credible suicide threats. Requires explicit intent + method + imminence.",
    color: "#9333EA",
    icon: "phone-call",
    ready: true,
    sensitive: true,
    categories: 2,
    keywords: 50,
  },
  
  // Supporting - Organizations (part of DOI)
  {
    id: "orgs",
    name: "Designated Organizations Database",
    shortName: "ORGS",
    description: "Comprehensive database of Tier 1-3 terrorist organizations, hate groups, and criminal enterprises.",
    color: "#7C2D12",
    icon: "database",
    ready: true,
    categories: 3,
    keywords: 500,
  },

  // ===== ADULT CONTENT POLICIES (3) =====
  
  {
    id: "ase",
    name: "Adult Sexual Exploitation",
    shortName: "ASE",
    description: "Addresses NCST, sextortion, NCII, creepshots, necrophilia, and forced stripping. Protects victims while allowing discussion.",
    color: "#4C1D95",
    icon: "EyeOff",
    ready: true,
    sensitive: true,
    categories: 4,
    keywords: 150,
  },
  {
    id: "ansa",
    name: "Adult Nudity and Sexual Activity",
    shortName: "ANSA",
    description: "5 major categories covering explicit/implicit sexual activity, adult nudity, fetish content across 3 imagery types.",
    color: "#1E3A8A",
    icon: "UserX",
    ready: true,
    sensitive: true,
    categories: 5,
    keywords: 200,
  },
  {
    id: "sspx",
    name: "Adult Sexual Solicitation & Sexually Explicit Language",
    shortName: "SSPX",
    description: "Addresses prostitution, sexual solicitation, pornography, and sexually explicit/suggestive language.",
    color: "#BE185D",
    icon: "MessageCircleOff",
    ready: true,
    sensitive: true,
    categories: 6,
    keywords: 180,
  },
];

// =====================================
// POLICY STATS
// =====================================

export const POLICY_STATS: PolicyStats = {
  total: POLICIES.length,
  ready: POLICIES.filter((p) => p.ready).length,
  pending: POLICIES.filter((p) => !p.ready).length,
  withData: POLICIES.filter((p) => p.ready).length,
};

// =====================================
// HELPER FUNCTIONS
// =====================================

export function getPolicyById(id: string): PolicyConfig | undefined {
  return POLICIES.find((p) => p.id === id);
}

export function getReadyPolicies(): PolicyConfig[] {
  return POLICIES.filter((p) => p.ready);
}

export function getPendingPolicies(): PolicyConfig[] {
  return POLICIES.filter((p) => !p.ready);
}

export function getSensitivePolicies(): PolicyConfig[] {
  return POLICIES.filter((p) => p.sensitive);
}

export function isPolicyReady(id: string): boolean {
  const policy = getPolicyById(id);
  return policy?.ready ?? false;
}

export function getPolicyColor(id: string): string {
  const policy = getPolicyById(id);
  return policy?.color ?? "#666666";
}

export function getPolicyIcon(id: string): string {
  const policy = getPolicyById(id);
  return policy?.icon ?? "help-circle";
}

// =====================================
// POLICY HIERARCHY (Enforcement Priority)
// =====================================

export const POLICY_HIERARCHY: string[] = [
  // Tier 1 - Critical (Always Escalate)
  "csean",  // Child Sexual Exploitation - HIGHEST PRIORITY
  "he",     // Human Exploitation
  "doi",    // Dangerous Organizations
  "cis",    // Credible Intent of Suicide
  
  // Tier 2 - High Priority
  "ssied",  // Suicide, Self-Injury, Eating Disorders
  "vi",     // Violence and Incitement
  "hc",     // Hateful Conduct
  "ase",    // Adult Sexual Exploitation
  "vgc",    // Violent and Graphic Content
  
  // Tier 3 - Mid Priority
  "bh",     // Bullying and Harassment
  "ansa",   // Adult Nudity and Sexual Activity
  "sspx",   // Sexual Solicitation
  "chpc",   // Coordinating Harm
  "fsdp",   // Fraud, Scams
  "cs",     // Cybersecurity
  "pv",     // Privacy Violations
  "dp",     // Drugs and Pharmaceuticals
  
  // Tier 4 - Standard Priority
  "wae",    // Weapons
  "ta",     // Tobacco and Alcohol
  "ogg",    // Online Gambling
  "hw",     // Health and Wellness
  
  // Tier 5 - Low Priority
  "spam",   // Spam
  "rp",     // Recalled Products
  "psl",    // Profanity
  
  // Supporting
  "orgs",   // Organizations Database
];

// =====================================
// POLICY GROUPS
// =====================================

export const POLICY_GROUPS = {
  childSafety: ["csean"],
  humanSafety: ["he", "ssied", "cis", "vi"],
  dangerousEntities: ["doi", "orgs"],
  harassment: ["hc", "bh"],
  adultContent: ["ase", "ansa", "sspx"],
  violentContent: ["vgc", "chpc"],
  fraudAndDeception: ["fsdp", "cs", "spam"],
  privacy: ["pv"],
  regulatedGoods: ["dp", "wae", "ta", "ogg", "rp"],
  healthAndWellness: ["hw"],
  language: ["psl"],
};

// =====================================
// DEFAULT EXPORT
// =====================================

export default POLICIES;