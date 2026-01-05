// ============================================
// CM POLICY HUB - POLICY CHECKS (Shared)
// v1.0.0 - Funções compartilhadas entre route.ts e analyzer.ts
// Elimina redundância de código
// ============================================

import { KeywordMatch, PolicyId, DetectedExceptions, VIChecks } from "./types";
import { getExcludedTerms } from "./keyword-loader";

// ============================================
// TYPES EXPORTED
// ============================================

export interface SSIEDChecks {
  hasSuicideContent: boolean;
  hasSelfInjuryContent: boolean;
  hasEDContent: boolean;
  cisHasExplicitIntent: boolean;
  cisHasCapability: boolean;
  cisHasImminence: boolean;
  isCIS: boolean;
  hasPromotionSignals: boolean;
  hasViralEvent: boolean;
  edSignalType: "promotion" | "context" | "benign" | "none";
  // Extended fields for analyzer.ts compatibility
  hasEatingDisorderContent?: boolean;
  hasAdmissionSignals?: boolean;
  hasGraphicImagery?: boolean;
  hasMockingContent?: boolean;
  hasRecoveryContext?: boolean;
  hasViralEventReference?: boolean;
}

// BHChecks compatível com types.ts E enhanced-prompt-builder.ts
export interface BHChecks {
  // Campos obrigatórios de types.ts
  hasIdentifiableTarget: boolean;
  targetType: "public_figure" | "lspf" | "private_adult" | "private_minor" | "unknown";
  hasNameFaceMatch: boolean;
  hasPurposefulExposure: boolean;
  hasSelfReport: boolean;
  isEndearingContext: boolean;
  isCriminalAllegation: boolean;
  isBusinessReview: boolean;
  // Campos obrigatórios para enhanced-prompt-builder (BHPreChecks)
  hasTarget: boolean;
  attackType: string | null;
  tier: 1 | 2 | 3 | 4 | null;
}

export interface WAEChecks {
  hasWeaponMention: boolean;
  hasAmmunitionMention: boolean;
  hasExplosiveMention: boolean;
  hasSaleIntent: boolean;
  hasBrickAndMortar: boolean;
  hasPeerToPeer: boolean;
  hasInstructions: boolean;
  has3DPrintingContext: boolean;
  hasCircumventionSignals: boolean;
  weaponType: "firearm" | "bladed" | "explosive" | "ammunition" | "3d_printed" | "unknown";
}

export interface VGCChecks {
  hasGraphicImagerySignals: boolean;
  hasHumanVictim: boolean;
  hasAnimalVictim: boolean;
  hasFictionalContext: boolean;
  hasSadisticIndicators: boolean;
  hasNewsContext: boolean;
  severityLevel: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  isDesignatedEvent: boolean;
}

export interface TAChecks {
  hasTobaccoProduct: boolean;
  hasAlcoholProduct: boolean;
  hasENDSProduct: boolean;
  hasSaleIntent: boolean;
  hasBrickAndMortar: boolean;
  hasPeerToPeer: boolean;
  hasConsumptionDepiction: boolean;
  hasBrandDepiction: boolean;
  hasPromotion: boolean;
  isFictionalContext: boolean;
  productType: "tobacco" | "alcohol" | "ends" | "cessation" | "unknown";
}

// ============================================
// LANGUAGE DETECTION
// ============================================

export function detectLanguage(text: string): "pt" | "en" | "multi" {
  const ptPatterns = /\b(você|voce|não|nao|está|são|também|porque|já|obrigado|olá|boa|bom|matar|morrer|faca|arma)\b/i;
  const enPatterns = /\b(the|is|are|was|have|has|will|would|could|hello|thank|please|kill|death|gun|knife)\b/i;

  const hasPt = ptPatterns.test(text);
  const hasEn = enPatterns.test(text);

  if (hasPt && hasEn) return "multi";
  if (hasPt) return "pt";
  return "en";
}

// ============================================
// EXCEPTION DETECTION (Unified)
// ============================================

export function detectExceptions(text: string): DetectedExceptions {
  const lower = text.toLowerCase();
  const detected: string[] = [];

  // Get excluded terms from keyword-loader
  let hasExcludedPhrase = false;
  try {
    const excludedTerms = getExcludedTerms();
    hasExcludedPhrase = excludedTerms.some((et: { term: string; reason: string }) => lower.includes(et.term));
  } catch {
    // keyword-loader not available in some contexts
  }

  const checks = {
    hasSelfDefense: /\b(defesa|defender|proteger|self.?defense|legítima defesa|me defender|se defender)\b/i.test(lower),
    hasRedemption: /\b(arrependo|desculpa|perdão|sorry|regret|me arrependo|nunca mais|parei de)\b/i.test(lower),
    hasCondemning: /\b(é errado|não se deve|condenamos|wrong|condemn|vergonha|não apoio|contra isso)\b/i.test(lower),
    hasHypothetical: /\b(se eu fosse|imagine|ficção|filme|série|jogo|game|movie|fiction|hipotético|e se)\b/i.test(lower),
    hasEducational: /\b(educação|ensino|academic|education|study|universidade|escola|pesquisa|research)\b/i.test(lower),
    hasNewsReporting: /\b(notícia|reportagem|news|report|journalism|jornal|g1|folha|segundo fontes|de acordo com)\b/i.test(lower),
    hasArtisticContext: /\b(arte|artístico|música|letra|artistic|lyrics|poesia|poema|canção|song)\b/i.test(lower),
    hasSatire: /\b(sátira|ironia|piada|satire|joke|parody|meme|comédia|brincadeira|só zuando)\b/i.test(lower),
    hasEndearingContext: /\b(meu amor|querido|amigo|brincadeira|friend|dear|carinho|te amo|meu bem)\b/i.test(lower),
    hasCriminalAllegation: /\b(polícia|tribunal|police|court|lawsuit|processo|crime|acusação|denúncia)\b/i.test(lower),
    hasBusinessReview: /\b(review|avaliação|estrelas|stars|serviço|atendimento|recomendo|não recomendo)\b/i.test(lower),
    hasFightSportContext: /\b(mma|ufc|boxe|boxing|luta|fight|wrestling|jiu.?jitsu|treino|academia|sparring)\b/i.test(lower),
    hasMedicalContext: /\b(médico|medicina|doctor|medical|health|hospital|tratamento|diagnóstico|sintoma)\b/i.test(lower),
    hasFamilyContext: /\b(filho|filha|bebé|família|son|daughter|baby|family|mãe|pai|criança)\b/i.test(lower),
    hasRecoveryContext: /\b(recuperação|recovery|superando|overcame|em tratamento|sobriety|venci|superei)\b/i.test(lower),
    hasAwarenessContext: /\b(conscientização|awareness|prevenção|prevention|ajuda|help|apoio|campanha)\b/i.test(lower),
    hasBrickAndMortar: /\b(loja|store|shop|site oficial|official|retail|compre em|disponível em)\b/i.test(lower),
    hasReligiousContext: /\b(ramadan|quaresma|jejum religioso|religious|oração|prayer|deus|god|igreja)\b/i.test(lower),
    hasFictionalContext: /\b(filme|movie|série|series|tv show|novela|livro|book|jogo|game|personagem|character)\b/i.test(lower),
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
  
  // Flag se tem frase excluída
  if (hasExcludedPhrase) detected.push("Contains Excluded Phrase");

  return { ...checks, detected };
}

// ============================================
// VI CHECKS (Violence and Incitement)
// ============================================

export function performVIChecks(text: string, keywords: KeywordMatch[]): VIChecks {
  const viKeywords = keywords.filter((k) => k.policy === "vi");
  const lower = text.toLowerCase();

  // Target detection (mais robusto)
  const hasDirectTarget = /\b(te|você|tu|voce|you|him|her|them|ele|ela|eles|elas)\b/i.test(lower);
  const hasNamedTarget = /[A-Z][a-záàâãéèêíïóôõöúç]{2,}/.test(text); // Nome próprio
  const hasMentionTarget = /@\w+/.test(text); // @mention
  const hasGroupTarget = /\b(todos|all|every|cada|gente|pessoal|vocês|vcs)\b/i.test(lower);
  const hasTarget = hasDirectTarget || hasNamedTarget || hasMentionTarget || hasGroupTarget;

  // Intent detection (mais padrões)
  const hasIntent = /\b(vou|vamos|gonna|will|going to|irei|farei|quero|want to|preciso|need to|tenho que)\b/i.test(lower);

  // Timing detection
  const hasTiming = /\b(amanhã|hoje|às?\s*\d|daqui\s+a|tomorrow|today|tonight|agora|now|já já|em breve|soon|quando|when)\b/i.test(lower);

  // Armament detection (keywords + patterns)
  const hasArmamentKeyword = viKeywords.some(
    (k) =>
      k.category.toLowerCase().includes("armament") ||
      k.category.toLowerCase().includes("weapon")
  );
  const hasArmamentPattern = /\b(arma|faca|pistola|gun|knife|weapon|espingarda|rifle|revólver|38|9mm|calibre|metralhadora|fuzil|explosivo|bomba)\b/i.test(lower);
  const hasArmament = hasArmamentKeyword || hasArmamentPattern;

  // Location detection (high-risk locations)
  const hasLocation = /\b(escola|trabalho|casa|escritório|school|work|home|office|igreja|church|hospital|tribunal|delegacia|aeroporto|shopping|universidade|faculdade)\b/i.test(lower);

  // Method detection (from keywords)
  const hasMethod = viKeywords.some(
    (k) =>
      k.category.toLowerCase().includes("hsv") ||
      k.category.toLowerCase().includes("threat") ||
      k.category.toLowerCase().includes("death") ||
      k.category.toLowerCase().includes("lethal") ||
      k.severity === "critical"
  );

  // Credibility formula: Target + Intent + Method + (Timing OR Armament OR Location)
  const isCredibleThreat =
    hasTarget && hasIntent && hasMethod && (hasTiming || hasArmament || hasLocation);

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

// ============================================
// SSIED CHECKS (Suicide, Self-Injury, Eating Disorders)
// ============================================

export function performSSIEDChecks(text: string, keywords: KeywordMatch[]): SSIEDChecks {
  const ssiedKeywords = keywords.filter((k) => k.policy === "ssied" || k.policy === "cis");
  const lower = text.toLowerCase();

  const hasSuicideContent = ssiedKeywords.some(
    (k) =>
      k.category.toLowerCase().includes("suicide") ||
      k.category.toLowerCase().includes("suicídio")
  ) || /\b(suicídio|suicidio|me matar|tirar minha vida|acabar com tudo|não aguento mais|quero morrer)\b/i.test(lower);

  const hasSelfInjuryContent = ssiedKeywords.some(
    (k) =>
      k.category.toLowerCase().includes("self") ||
      k.category.toLowerCase().includes("injury") ||
      k.category.toLowerCase().includes("cutting")
  ) || /\b(me cortar|cortes|automutilação|self.?harm|cutting)\b/i.test(lower);

  const hasEDContent = ssiedKeywords.some(
    (k) =>
      k.category.toLowerCase().includes("eating") ||
      k.category.toLowerCase().includes("ed") ||
      k.category.toLowerCase().includes("anorex") ||
      k.category.toLowerCase().includes("bulim")
  );

  const hasPromotionSignals =
    ssiedKeywords.some(
      (k) =>
        k.category.toLowerCase().includes("promotion") ||
        k.category.toLowerCase().includes("incitement")
    ) || /\b(thinspo|bonespo|proana|promia|edtips|anabuddy|meanspo)\b/i.test(lower);

  const hasViralEvent = /\b(blue whale|baleia azul|momo challenge|jonathan galindo|choking challenge)\b/i.test(lower);

  // CIS Detection (Credible Intent of Suicide)
  const cisHasExplicitIntent =
    ssiedKeywords.some(
      (k) =>
        k.category.toLowerCase().includes("intent") ||
        k.category.toLowerCase().includes("note")
    ) ||
    /\b(vou me matar|i will kill myself|going to end it|this is goodbye|carta de suicídio|suicide note|decidi acabar|tomei a decisão|não estarei mais aqui)\b/i.test(lower);

  const cisHasCapability =
    ssiedKeywords.some((k) => k.category.toLowerCase().includes("method")) ||
    /\b(pílulas|pills|arma|gun|corda|rope|ponte|bridge|prédio|building|veneno|poison|remédios|overdose|saltar|pular)\b/i.test(lower);

  const cisHasImminence = /\b(agora|now|hoje|today|tonight|esta noite|amanhã|tomorrow|daqui a pouco|soon|em minutos|já|neste momento)\b/i.test(lower);

  const isCIS = cisHasExplicitIntent && cisHasCapability && cisHasImminence;

  // ED Signal Type
  let edSignalType: SSIEDChecks["edSignalType"] = "none";
  if (hasPromotionSignals) edSignalType = "promotion";
  else if (hasEDContent) edSignalType = "context";
  else if (/\b(dieta|diet|emagrecer|weight loss|fitness|academia|treino)\b/i.test(lower))
    edSignalType = "benign";

  // Extended fields for analyzer.ts compatibility
  const hasAdmissionSignals = /\b(eu tenho|i have|sofro de|i suffer|minha anorexia|my anorexia|me corto|i cut myself)\b/i.test(lower);
  const hasGraphicImagery = /\b(sangue|blood|corte|cut|cicatriz|scar|vômito|vomit)\b/i.test(lower) && 
    (hasSuicideContent || hasSelfInjuryContent || hasEDContent);
  const hasMockingContent = /\b(lol|lmao|kkk|😂|🤣|meme|piada|joke)\b/i.test(lower) && 
    (hasSuicideContent || hasSelfInjuryContent || hasEDContent);
  const hasRecoveryContext = /\b(recuperação|recovery|superando|overcame|em tratamento|sober|clean)\b/i.test(lower);

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
    // Extended fields
    hasEatingDisorderContent: hasEDContent,
    hasAdmissionSignals,
    hasGraphicImagery,
    hasMockingContent,
    hasRecoveryContext,
    hasViralEventReference: hasViralEvent,
  };
}

// ============================================
// BH CHECKS (Bullying and Harassment)
// ============================================

export function performBHChecks(text: string, keywords: KeywordMatch[]): BHChecks {
  const lower = text.toLowerCase();
  const hasTarget = /\b(te|você|@\w+|tu|seu|sua|you|your|ele|ela|o\s+\w+|a\s+\w+)\b/i.test(lower);

  let targetType: BHChecks["targetType"] = "unknown";
  if (/\b(presidente|ministro|celebridade|president|celebrity|famoso|1M|milhão de seguidores|político|governador|prefeito)\b/i.test(lower)) {
    targetType = "public_figure";
  } else if (/\b(ativista|jornalista|activist|journalist|defensor|influencer)\b/i.test(lower)) {
    targetType = "lspf";
  } else if (/\b(criança|menor|filho|kid|child|minor|adolescente|teen)\b/i.test(lower)) {
    targetType = "private_minor";
  } else if (hasTarget) {
    targetType = "private_adult";
  }

  const hasPurposefulExposure = /@\w+/.test(text) || /\b(olhem|vejam|look at|check out)\b/i.test(lower);

  // Determine attack type and tier from keywords
  const bhKeywords = keywords.filter((k) => k.policy === "bh");
  let attackType: string | null = null;
  let tier: 1 | 2 | 3 | 4 | null = null;

  if (
    bhKeywords.some(
      (k) =>
        k.category.toLowerCase().includes("death") ||
        k.category.toLowerCase().includes("calls")
    ) || /\b(morra|morre|deveria morrer|should die|kill yourself)\b/i.test(lower)
  ) {
    attackType = "Calls for death";
    tier = 1;
  } else if (
    bhKeywords.some((k) => k.category.toLowerCase().includes("sexual")) ||
    /\b(vagabunda|puta|whore|slut)\b/i.test(lower)
  ) {
    attackType = "Sexualized harassment";
    tier = 1;
  } else if (
    bhKeywords.some((k) => k.category.toLowerCase().includes("dehumaniz")) ||
    /\b(animal|bicho|verme|lixo|escória)\b/i.test(lower)
  ) {
    attackType = "Dehumanizing comparison";
    tier = 2;
  } else if (bhKeywords.some((k) => k.category.toLowerCase().includes("physical"))) {
    attackType = "Negative physical description";
    tier = 2;
  } else if (
    bhKeywords.some(
      (k) =>
        k.category.toLowerCase().includes("character") ||
        k.category.toLowerCase().includes("insult")
    )
  ) {
    attackType = "Negative character claim";
    tier = 3;
  }

  // Campos obrigatórios para types.ts
  const isEndearingContext = /\b(meu amor|querido|amigo|friend|dear)\b/i.test(lower);
  const isCriminalAllegation = /\b(polícia|tribunal|police|court)\b/i.test(lower);
  const isBusinessReview = /\b(review|avaliação|estrelas)\b/i.test(lower);

  return {
    // Campos obrigatórios de types.ts
    hasIdentifiableTarget: hasTarget,
    targetType,
    hasNameFaceMatch: false,
    hasPurposefulExposure,
    hasSelfReport: false,
    isEndearingContext,
    isCriminalAllegation,
    isBusinessReview,
    // Campos extended para enhanced-prompt-builder
    hasTarget,
    attackType,
    tier,
  };
}

// ============================================
// WAE CHECKS (Weapons, Ammunition, Explosives)
// ============================================

export function performWAEChecks(text: string, keywords: KeywordMatch[]): WAEChecks {
  const waeKeywords = keywords.filter((k) => k.policy === "wae");
  
  const hasWeaponMention = waeKeywords.some((k) => 
    ["Firearm", "Firearm Slang BR", "Bladed Weapon", "firearm", "firearms", "bladed_weapons"].some(cat => 
      k.category.toLowerCase().includes(cat.toLowerCase())
    )
  );
  const hasAmmunitionMention = waeKeywords.some((k) => 
    k.category.toLowerCase().includes("ammunition")
  );
  const hasExplosiveMention = waeKeywords.some((k) => 
    k.category.toLowerCase().includes("explosive")
  );
  const has3DPrintingContext = waeKeywords.some((k) => 
    k.category.toLowerCase().includes("3d") || k.category.toLowerCase().includes("printed")
  );
  const hasInstructions = waeKeywords.some((k) => 
    k.category.toLowerCase().includes("instruction")
  );
  
  const hasSaleIntent = /\b(vendo|compro|vender|comprar|sell|buy|sale|à venda|for sale)\b/i.test(text);
  const hasBrickAndMortar = /\b(loja|store|site oficial|official|retail|armasltda|taurus)\b/i.test(text);
  const hasPeerToPeer = /\b(dm|inbox|whatsapp|telegram|particular|privado)\b/i.test(text) && hasSaleIntent;
  
  const hasCircumventionSignals = /\b(emoji|código|code|foto inbox|pic in dm)\b/i.test(text) ||
    /[🔫💣🗡️🔪]/u.test(text);

  let weaponType: WAEChecks["weaponType"] = "unknown";
  if (has3DPrintingContext) weaponType = "3d_printed";
  else if (hasExplosiveMention) weaponType = "explosive";
  else if (hasAmmunitionMention) weaponType = "ammunition";
  else if (waeKeywords.some((k) => k.category.toLowerCase().includes("bladed"))) weaponType = "bladed";
  else if (hasWeaponMention) weaponType = "firearm";

  return {
    hasWeaponMention,
    hasAmmunitionMention,
    hasExplosiveMention,
    hasSaleIntent,
    hasBrickAndMortar,
    hasPeerToPeer,
    hasInstructions,
    has3DPrintingContext,
    hasCircumventionSignals,
    weaponType,
  };
}

// ============================================
// VGC CHECKS (Violent and Graphic Content)
// ============================================

export function performVGCChecks(text: string, keywords: KeywordMatch[]): VGCChecks {
  const vgcKeywords = keywords.filter((k) => k.policy === "vgc");
  
  const hasGraphicImagerySignals = vgcKeywords.some((k) => 
    ["dismemberment", "burning", "internal_organs", "dead_body", "graphic", "gore", "mutilation"].some(cat =>
      k.category.toLowerCase().includes(cat)
    )
  );
  const hasHumanVictim = /\b(pessoa|human|homem|mulher|man|woman|child|criança)\b/i.test(text);
  const hasAnimalVictim = vgcKeywords.some((k) => 
    k.category.toLowerCase().includes("animal")
  );
  const hasFictionalContext = /\b(filme|movie|jogo|game|série|series|animação|animation)\b/i.test(text);
  const hasSadisticIndicators = vgcKeywords.some((k) => 
    ["sadistic", "torture"].some(cat => k.category.toLowerCase().includes(cat))
  );
  const hasNewsContext = /\b(notícia|news|reportagem|report|jornal|g1)\b/i.test(text);

  // Calculate severity level (1-10)
  let severityLevel: VGCChecks["severityLevel"] = 10;
  if (vgcKeywords.some((k) => k.severity === "critical")) severityLevel = 1;
  else if (hasSadisticIndicators) severityLevel = 2;
  else if (vgcKeywords.some((k) => k.category.toLowerCase().includes("dismemberment"))) severityLevel = 3;
  else if (vgcKeywords.some((k) => k.severity === "high")) severityLevel = 4;
  else if (hasGraphicImagerySignals) severityLevel = 5;
  else if (vgcKeywords.length > 0) severityLevel = 7;

  // Check for designated events
  const isDesignatedEvent = /\b(holocaust|holocausto|rwanda|tiananmen|columbine|christchurch)\b/i.test(text);

  return {
    hasGraphicImagerySignals,
    hasHumanVictim,
    hasAnimalVictim,
    hasFictionalContext,
    hasSadisticIndicators,
    hasNewsContext,
    severityLevel,
    isDesignatedEvent,
  };
}

// ============================================
// TA CHECKS (Tobacco and Alcohol)
// ============================================

export function performTAChecks(text: string, keywords: KeywordMatch[]): TAChecks {
  const taKeywords = keywords.filter((k) => k.policy === "ta");
  
  const hasTobaccoProduct = taKeywords.some((k) => 
    k.category.toLowerCase().includes("tobacco")
  );
  const hasAlcoholProduct = taKeywords.some((k) => 
    k.category.toLowerCase().includes("alcohol")
  );
  const hasENDSProduct = taKeywords.some((k) => 
    ["ends", "vape", "vaping", "e-cigarette"].some(cat => k.category.toLowerCase().includes(cat))
  );
  
  const hasSaleIntent = /\b(vendo|compro|vender|comprar|sell|buy|sale|à venda|for sale|delivery)\b/i.test(text);
  const hasBrickAndMortar = /\b(loja|store|restaurante|bar|pub|brewery|cervejaria|vinícola)\b/i.test(text);
  const hasPeerToPeer = /\b(dm|inbox|whatsapp|particular|privado|hmu|hit me up)\b/i.test(text) && hasSaleIntent;
  
  const hasConsumptionDepiction = /\b(bebendo|drinking|fumando|smoking|vaping|tomando)\b/i.test(text);
  const hasBrandDepiction = taKeywords.some((k) => 
    k.category.toLowerCase().includes("brand")
  );
  const hasPromotion = /\b(promoção|promotion|desconto|discount|grátis|free|oferta|offer)\b/i.test(text);
  
  const isFictionalContext = /\b(filme|movie|série|series|novela|tv show)\b/i.test(text);

  let productType: TAChecks["productType"] = "unknown";
  if (hasENDSProduct) productType = "ends";
  else if (hasTobaccoProduct) productType = "tobacco";
  else if (hasAlcoholProduct) productType = "alcohol";

  return {
    hasTobaccoProduct,
    hasAlcoholProduct,
    hasENDSProduct,
    hasSaleIntent,
    hasBrickAndMortar,
    hasPeerToPeer,
    hasConsumptionDepiction,
    hasBrandDepiction,
    hasPromotion,
    isFictionalContext,
    productType,
  };
}

// ============================================
// EXPORT ALL
// ============================================

export default {
  detectLanguage,
  detectExceptions,
  performVIChecks,
  performSSIEDChecks,
  performBHChecks,
  performWAEChecks,
  performVGCChecks,
  performTAChecks,
};