// ============================================
// CM POLICY HUB - POLICIES INDEX
// Compatível com imports existentes no projeto
// Status: 5 of 25 policies com dados completos
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
  // ===== READY (5) - Com dados completos =====
  {
    id: "wae",
    name: "Weapons, Ammunition, Explosives",
    shortName: "WAE",
    description: "Restricts sale and promotion of weapons, ammunition, and explosives. Distinguishes between B2B and P2P sales.",
    color: "#f44336",
    icon: "bomb",
    ready: true,
    categories: 3,
    keywords: 100,
  },
  {
    id: "vgc",
    name: "Violent and Graphic Content",
    shortName: "VGC",
    description: "Addresses graphic violence imagery involving humans, animals, and fictional content with 10-level severity hierarchy.",
    color: "#e91e63",
    icon: "skull",
    ready: true,
    categories: 4,
    keywords: 80,
  },
  {
    id: "vi",
    name: "Violence and Incitement",
    shortName: "VI",
    description: "Prevents offline harm by removing threats, incitement, and calls for violence. Includes escalation criteria.",
    color: "#ff5722",
    icon: "alert-triangle",
    ready: true,
    categories: 5,
    keywords: 150,
  },
  {
    id: "ta",
    name: "Tobacco and Alcohol",
    shortName: "TA",
    description: "Restricts sale and promotion of tobacco, ENDS, and alcohol products. Includes B2B vs P2P detection.",
    color: "#795548",
    icon: "cigarette",
    ready: true,
    categories: 4,
    keywords: 130,
  },
  {
    id: "ssied",
    name: "Suicide, Self-Injury, and Eating Disorders",
    shortName: "SSIED",
    description: "Protects users from harmful content while allowing support-seeking. Includes CIS escalation protocol.",
    color: "#9c27b0",
    icon: "heart-pulse",
    ready: true,
    sensitive: true,
    categories: 5,
    keywords: 100,
  },

  // ===== PENDING (20) - Aguardando dados =====
  {
    id: "csean",
    name: "Child Safety - CSAM/Exploitation",
    shortName: "CSEAN",
    description: "Highest priority policy protecting minors from exploitation, CSAM, and grooming.",
    color: "#d32f2f",
    icon: "shield-alert",
    ready: false,
  },
  {
    id: "he",
    name: "Human Exploitation",
    shortName: "HE",
    description: "Addresses human trafficking, smuggling, and exploitation.",
    color: "#c62828",
    icon: "users",
    ready: false,
  },
  {
    id: "doi",
    name: "Dangerous Organizations and Individuals",
    shortName: "DOI",
    description: "Restricts content from terrorist organizations, hate groups, and criminal enterprises.",
    color: "#b71c1c",
    icon: "alert-octagon",
    ready: false,
  },
  {
    id: "hc",
    name: "Hateful Conduct",
    shortName: "HC",
    description: "Addresses hate speech, dehumanization, and discrimination based on protected characteristics.",
    color: "#880e4f",
    icon: "ban",
    ready: false,
  },
  {
    id: "bh",
    name: "Bullying and Harassment",
    shortName: "BH",
    description: "Protects individuals from targeted harassment, cyberbullying, and unwanted contact.",
    color: "#4a148c",
    icon: "message-circle-warning",
    ready: false,
  },
  {
    id: "ase",
    name: "Adult Sexual Exploitation",
    shortName: "ASE",
    description: "Addresses non-consensual intimate imagery, sextortion, and sexual exploitation.",
    color: "#311b92",
    icon: "eye-off",
    ready: false,
  },
  {
    id: "ansa",
    name: "Adult Nudity and Sexual Activity",
    shortName: "ANSA",
    description: "Restricts explicit adult content based on context and consent indicators.",
    color: "#1a237e",
    icon: "user-x",
    ready: false,
  },
  {
    id: "sspx",
    name: "Sexual Solicitation",
    shortName: "SSPX",
    description: "Addresses prostitution, escort services, and sexual solicitation.",
    color: "#0d47a1",
    icon: "message-square-warning",
    ready: false,
  },
  {
    id: "chpc",
    name: "Coordinating Harm and Publicizing Crime",
    shortName: "CHPC",
    description: "Prevents coordination of harmful activities and glorification of crimes.",
    color: "#01579b",
    icon: "link",
    ready: false,
  },
  {
    id: "fsdp",
    name: "Fraud, Scams, Deceptive Practices",
    shortName: "FSDP",
    description: "Addresses financial fraud, scams, fake documents, and deceptive practices.",
    color: "#006064",
    icon: "shield-x",
    ready: false,
  },
  {
    id: "cyber",
    name: "Cybersecurity",
    shortName: "CYBER",
    description: "Addresses hacking, phishing, malware distribution, and credential theft.",
    color: "#004d40",
    icon: "lock",
    ready: false,
  },
  {
    id: "pv",
    name: "Privacy Violations",
    shortName: "PV",
    description: "Protects personal information, addresses doxxing and unauthorized data sharing.",
    color: "#1b5e20",
    icon: "eye",
    ready: false,
  },
  {
    id: "dp",
    name: "Drugs and Pharmaceuticals",
    shortName: "DP",
    description: "Restricts sale and promotion of illegal drugs and prescription medications.",
    color: "#33691e",
    icon: "pill",
    ready: false,
  },
  {
    id: "hw",
    name: "Health and Wellness",
    shortName: "HW",
    description: "Addresses misleading health claims, dangerous medical advice, and wellness scams.",
    color: "#827717",
    icon: "heart",
    ready: false,
  },
  {
    id: "ogg",
    name: "Online Gambling and Gaming",
    shortName: "OGG",
    description: "Restricts illegal gambling and gaming content.",
    color: "#f57f17",
    icon: "dice",
    ready: false,
  },
  {
    id: "spam",
    name: "Spam",
    shortName: "SPAM",
    description: "Addresses spam, engagement manipulation, and inauthentic behavior.",
    color: "#ff6f00",
    icon: "mail-warning",
    ready: false,
  },
  {
    id: "rp",
    name: "Recalled Products",
    shortName: "RP",
    description: "Restricts sale of recalled and dangerous products.",
    color: "#e65100",
    icon: "package-x",
    ready: false,
  },
  {
    id: "bcp",
    name: "Branded Content - Prohibited",
    shortName: "BCP",
    description: "Addresses prohibited branded content partnerships.",
    color: "#bf360c",
    icon: "badge-x",
    ready: false,
  },
  {
    id: "bcr",
    name: "Branded Content - Restricted",
    shortName: "BCR",
    description: "Addresses restricted branded content requiring disclosure.",
    color: "#3e2723",
    icon: "badge-alert",
    ready: false,
  },
  {
    id: "psl",
    name: "Profanity and Sensitive Language",
    shortName: "PSL",
    description: "Addresses profanity, slurs, and sensitive language in various contexts.",
    color: "#263238",
    icon: "message-square-x",
    ready: false,
  },
];

// =====================================
// POLICY STATS
// =====================================

export const POLICY_STATS: PolicyStats = {
  total: POLICIES.length,
  ready: POLICIES.filter((p) => p.ready).length,
  pending: POLICIES.filter((p) => !p.ready).length,
  withData: 5,
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
// POLICY HIERARCHY
// =====================================

export const POLICY_HIERARCHY: string[] = [
  "csean", "he", "doi", "ssied", "vi", "hc", "ase", "vgc", "bh",
  "ansa", "sspx", "chpc", "fsdp", "cyber", "pv", "dp", "wae",
  "ta", "ogg", "hw", "spam", "rp", "bcp", "bcr", "psl",
];

// =====================================
// DEFAULT EXPORT
// =====================================

export default POLICIES;