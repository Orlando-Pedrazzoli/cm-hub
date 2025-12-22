// ============================================
// HC - Hateful Conduct Policy
// Conduta de Ódio / Discurso de Ódio
// ============================================

import { PolicyDefinition } from "@/lib/types";

export const HC_POLICY: PolicyDefinition = {
  id: "hc",
  name: "Hateful Conduct",
  shortName: "HC",
  description:
    "Ataques diretos contra pessoas com base em características protegidas (PCs). Inclui discurso desumanizante, estereótipos prejudiciais, insultos, exclusão e slurs. Sistema de dois tiers de severidade.",
  color: "#dc2626",
  icon: "🚫",
  ready: true,

  // ============================================
  // PROTECTED CHARACTERISTICS (PCs)
  // ============================================
  protectedCharacteristics: [
    { id: "race", name: "Race", description: "Raça" },
    { id: "ethnicity", name: "Ethnicity", description: "Etnia" },
    { id: "national-origin", name: "National Origin", description: "Origem nacional/nacionalidade" },
    { id: "disability", name: "Disability", description: "Deficiência" },
    { id: "religious-affiliation", name: "Religious Affiliation", description: "Afiliação religiosa (inclui ateísmo)" },
    { id: "caste", name: "Caste", description: "Casta (Brahman, Kshatriya, Vaishya, Sudra, Dalits)" },
    { id: "sexual-orientation", name: "Sexual Orientation", description: "Orientação sexual" },
    { id: "sex", name: "Sex", description: "Sexo" },
    { id: "gender-identity", name: "Gender Identity", description: "Identidade de género" },
    { id: "serious-disease", name: "Serious Disease", description: "Doença grave (HIV/AIDS, cancro, etc.)" },
  ],

  // ============================================
  // QUASI-PROTECTED CHARACTERISTICS (QPCs)
  // ============================================
  quasiProtectedCharacteristics: [
    { id: "migrants", name: "Migrants", description: "Migrantes" },
    { id: "refugees", name: "Refugees", description: "Refugiados" },
    { id: "immigrants", name: "Immigrants", description: "Imigrantes" },
    { id: "asylum-seekers", name: "Asylum Seekers", description: "Requerentes de asilo" },
  ],

  categories: [
    // ============================================
    // TIER 1 - SEVERE ATTACKS (PCs, QPCs, Subsets)
    // ============================================
    {
      id: "tier1",
      name: "Tier 1 - Severe Attacks",
      description: "Ataques severos: desumanização, alegações de criminalidade grave, estereótipos prejudiciais",
      severity: "critical",
      subcategories: [
        {
          id: "t1-dehumanizing-animals",
          name: "Dehumanizing - Animals",
          description: "Comparações a animais culturalmente inferiores",
          examples: [
            "Insects (cockroaches, locusts)",
            "Apes/monkeys (Black people)",
            "Rats (Jewish people)",
            "Pigs (Muslim people)",
            "Worms (Mexican people)",
          ],
        },
        {
          id: "t1-dehumanizing-pathogens",
          name: "Dehumanizing - Pathogens",
          description: "Comparações a doenças, bactérias, vírus",
          examples: [
            "Diseases",
            "Bacteria",
            "Viruses",
            "Microbes",
            "Cancer/plague on society",
          ],
        },
        {
          id: "t1-dehumanizing-subhuman",
          name: "Dehumanizing - Subhumanity",
          description: "Comparações a sub-humanidade",
          examples: [
            "Savages",
            "Devils",
            "Monsters",
            "Barbarians",
            "Cannibals",
          ],
        },
        {
          id: "t1-criminals",
          name: "Allegations of Serious Criminality",
          description: "Alegações de criminalidade grave",
          examples: [
            "Sexual predators",
            "Pedophiles",
            "Violent criminals",
            "Terrorists",
            "Murderers",
          ],
        },
        {
          id: "t1-harm-statements",
          name: "Statements Supporting Harm",
          description: "Declarações apoiando dano",
          examples: [
            "Contracting a disease",
            "Experiencing natural disaster",
            "Self-injury or suicide",
            "Death without perpetrator",
            "Accidents/harm by deity",
          ],
        },
        {
          id: "t1-harmful-stereotypes",
          name: "Harmful Stereotypes",
          description: "Estereótipos historicamente ligados a violência",
          examples: [
            "Blackface",
            "Holocaust denial",
            "Jewish people control institutions",
            "Dalits as menial laborers",
            "Black people = farm equipment",
          ],
        },
        {
          id: "t1-mocking-hate-crimes",
          name: "Mocking Hate Crimes",
          description: "Zombar de conceito, eventos ou vítimas de crimes de ódio",
          examples: [
            "Mocking Holocaust",
            "Mocking slavery",
            "Mocking victims of hate crimes",
          ],
        },
        {
          id: "t1-mocking-disease",
          name: "Mocking Disease",
          description: "Zombar de pessoas por terem ou experienciarem doença",
          examples: [
            "Mocking AIDS patients",
            "Mocking cancer patients",
            "Mocking disabled people",
          ],
        },
      ],
    },
    // ============================================
    // TIER 2 - INSULTS, DISGUST, EXCLUSION (PCs only)
    // ============================================
    {
      id: "tier2",
      name: "Tier 2 - Insults, Disgust, Exclusion",
      description: "Insultos, expressões de nojo, exclusão (apenas PCs, não QPCs)",
      severity: "high",
      subcategories: [
        {
          id: "t2-character-insults",
          name: "Character Insults",
          description: "Insultos sobre carácter",
          examples: [
            "Cowardice",
            "Dishonesty",
            "Basic criminality (thieves, drug dealers)",
            "Sexual promiscuity/immorality",
          ],
        },
        {
          id: "t2-mental-insults",
          name: "Mental Insults",
          description: "Insultos sobre características mentais",
          examples: [
            "Stupidity",
            "Intellectual capacity",
            "Mental illness (except gender/sexual orientation)",
          ],
        },
        {
          id: "t2-other-insults",
          name: "Other Insults",
          description: "Outros insultos",
          examples: [
            "Worthlessness",
            "Uselessness",
            "Ugliness",
            "Dirtiness",
            "Scum/filth",
          ],
        },
        {
          id: "t2-disgust",
          name: "Expressions of Disgust",
          description: "Expressões de nojo",
          examples: [
            "Makes me vomit",
            "Disgusting",
            "Vile",
            "Repulsive",
          ],
        },
        {
          id: "t2-cursing",
          name: "Targeted Cursing",
          description: "Insultos direcionados com linguagem vulgar",
          examples: [
            "Fuck the [PC]!",
            "Suck my dick",
            "Kiss my ass",
            "Eat shit",
          ],
        },
        {
          id: "t2-exclusion-general",
          name: "General Exclusion",
          description: "Exclusão geral",
          examples: [
            "No [PC] allowed",
            "World without [PC]",
            "Keep [PC] race pure",
          ],
        },
        {
          id: "t2-exclusion-political",
          name: "Political Exclusion",
          description: "Exclusão política",
          examples: [
            "Deny right to vote",
            "Deny right to run for office",
            "Deny right to organize",
            "Jail/imprison [PC]",
          ],
        },
        {
          id: "t2-exclusion-economic",
          name: "Economic Exclusion",
          description: "Exclusão económica",
          examples: [
            "Deny employment",
            "Deny credit/loans",
            "Deny assets/goods/services",
          ],
        },
        {
          id: "t2-exclusion-social",
          name: "Social Exclusion",
          description: "Exclusão social",
          examples: [
            "Deny access to spaces",
            "Deny social services",
            "Deny education",
            "Deny healthcare",
          ],
        },
      ],
    },
    // ============================================
    // SLURS
    // ============================================
    {
      id: "slurs",
      name: "Slurs",
      description: "Termos pejorativos que criam atmosfera de exclusão e intimidação",
      severity: "high",
      subcategories: [
        {
          id: "slur-violating",
          name: "Violating Slur Use",
          description: "Uso de slurs que viola",
          examples: [
            "Calling someone a slur",
            "Slur without context",
            "Slur + T1/T2 attack",
          ],
        },
        {
          id: "slur-allowed",
          name: "Allowed Slur Contexts",
          description: "Contextos onde slurs são permitidos",
          examples: [
            "Self-referential use",
            "Mocking/condemning the slur",
            "Discussing slur use",
            "Explicitly positive context",
            "Alternative meaning",
          ],
        },
      ],
    },
  ],

  // ============================================
  // LABEL HIERARCHY
  // ============================================
  labelHierarchy: [
    // === TIER 1 ===
    {
      id: "hc-t1-comparisons",
      label: "LABEL > Hateful Conduct > T1 - Comparisons or Generalizations",
      path: ["LABEL", "Hateful Conduct", "T1", "Comparisons/Generalizations"],
      action: "label",
      severity: "critical",
      conditions: ["Dehumanizing comparisons to animals, pathogens, subhumanity", "Allegations of serious criminality"],
    },
    {
      id: "hc-t1-harm",
      label: "LABEL > Hateful Conduct > T1 - Statements Supporting Harm",
      path: ["LABEL", "Hateful Conduct", "T1", "Supporting Harm"],
      action: "label",
      severity: "critical",
      conditions: ["Disease wishes", "Natural disaster wishes", "Death wishes", "Suicide/self-injury calls"],
    },
    {
      id: "hc-t1-stereotypes",
      label: "LABEL > Hateful Conduct > T1 - Harmful Stereotypes",
      path: ["LABEL", "Hateful Conduct", "T1", "Harmful Stereotypes"],
      action: "label",
      severity: "critical",
      conditions: ["Blackface", "Holocaust denial", "Jewish control conspiracy", "Dalit stereotypes"],
    },
    {
      id: "hc-t1-mocking",
      label: "LABEL > Hateful Conduct > T1 - Mocking Hate Crimes/Disease",
      path: ["LABEL", "Hateful Conduct", "T1", "Mocking"],
      action: "label",
      severity: "critical",
      conditions: ["Mocking hate crime victims", "Mocking disease"],
    },
    // === TIER 2 ===
    {
      id: "hc-t2-character",
      label: "LABEL > Hateful Conduct > T2 - Character Insults",
      path: ["LABEL", "Hateful Conduct", "T2", "Character Insults"],
      action: "label",
      severity: "high",
    },
    {
      id: "hc-t2-mental",
      label: "LABEL > Hateful Conduct > T2 - Mental Insults",
      path: ["LABEL", "Hateful Conduct", "T2", "Mental Insults"],
      action: "label",
      severity: "high",
    },
    {
      id: "hc-t2-other",
      label: "LABEL > Hateful Conduct > T2 - Other Insults",
      path: ["LABEL", "Hateful Conduct", "T2", "Other Insults"],
      action: "label",
      severity: "high",
    },
    {
      id: "hc-t2-disgust",
      label: "LABEL > Hateful Conduct > T2 - Expressions of Disgust",
      path: ["LABEL", "Hateful Conduct", "T2", "Disgust"],
      action: "label",
      severity: "high",
    },
    {
      id: "hc-t2-cursing",
      label: "LABEL > Hateful Conduct > T2 - Targeted Cursing",
      path: ["LABEL", "Hateful Conduct", "T2", "Cursing"],
      action: "label",
      severity: "high",
    },
    {
      id: "hc-t2-exclusion",
      label: "LABEL > Hateful Conduct > T2 - Exclusion/Segregation",
      path: ["LABEL", "Hateful Conduct", "T2", "Exclusion"],
      action: "label",
      severity: "high",
    },
    // === SLURS ===
    {
      id: "hc-slur",
      label: "LABEL > Hateful Conduct > Slur",
      path: ["LABEL", "Hateful Conduct", "Slur"],
      action: "label",
      severity: "high",
    },
  ],

  // ============================================
  // SUBSETS
  // ============================================
  subsets: {
    fullyProtected: {
      description: "Protegidos de todos os tiers",
      examples: [
        "PC + PC (Muslim women)",
        "PC + age (Black children)",
        "PC + most/all (Most Muslims)",
        "PC + country location (Muslims in the US)",
        "Slur + any PC/QPC/NPC",
      ],
    },
    quasiProtected: {
      description: "Protegidos apenas de Tier 1",
      examples: [
        "PC + QPC (Muslim refugees)",
        "PC + NPC (Irish taxi drivers)",
        "QPC + age (Immigrant children)",
        "PC/QPC + location < country (Berliner Muslims)",
        "QPC + country location (Migrants in Europe)",
      ],
    },
    otherCriminal: {
      description: "PC/QPC + crimes (exceto violentos/sexuais) - Tier 1 only",
      examples: [
        "Illegal immigrants",
        "White thieves",
        "Undocumented migrants",
      ],
    },
    nonProtected: {
      description: "Sem proteção",
      examples: [
        "PC/QPC + violent criminals/sexual offenders",
        "Age only",
        "NPC only (blondes, rich people)",
      ],
    },
  },

  // ============================================
  // EXCEPTIONS
  // ============================================
  exceptions: [
    {
      id: "concepts",
      name: "Attacks on Concepts",
      description: "Ataques a conceitos, instituições, ideias (não pessoas)",
      appliesTo: ["tier1", "tier2"],
      examples: ["Islam should be eradicated", "Fuck Romania (country)"],
    },
    {
      id: "self-referential",
      name: "Self-Referential Use",
      description: "Uso auto-referencial de hateful conduct ou slurs",
      appliesTo: ["tier1", "tier2", "slurs"],
      examples: ["I am a die-hard dyke", "We beaners on the block"],
    },
    {
      id: "mocking-condemning",
      name: "Mocking/Condemning Hateful Conduct",
      description: "Zombar ou condenar uso de hateful conduct",
      appliesTo: ["tier1", "tier2", "slurs"],
    },
    {
      id: "discussion",
      name: "Discussion of Hateful Conduct",
      description: "Discutir uso de hateful conduct ou slurs",
      appliesTo: ["tier1", "tier2", "slurs"],
    },
    {
      id: "positive-context",
      name: "Explicitly Positive Context",
      description: "Slurs usados em contexto explicitamente positivo",
      appliesTo: ["slurs"],
      examples: ["My favorite nigger!", "I love you, you dyke"],
    },
    {
      id: "alternative-meaning",
      name: "Alternative Meaning",
      description: "Slurs com significado alternativo",
      appliesTo: ["slurs"],
      examples: ["I want to stop smoking fags (UK cigarettes)"],
    },
    {
      id: "behavioral",
      name: "Behavioral Statements",
      description: "Declarações sobre ações (não qualidades inerentes)",
      appliesTo: ["tier1", "tier2"],
      examples: ["Black people commit crimes", "Americans kill people"],
    },
    {
      id: "superiority",
      name: "Statements of Superiority",
      description: "Declarações de superioridade (sem inferioridade intelectual)",
      appliesTo: ["tier2"],
      examples: ["Asians are the best!", "Whites are better"],
    },
    {
      id: "gender-exclusion",
      name: "Gender-Based Exclusion",
      description: "Exclusão baseada em sexo/género em espaços limitados",
      appliesTo: ["t2-exclusion-social"],
      examples: ["No men in women's bathroom", "No trans in women's sports"],
    },
    {
      id: "military-teaching",
      name: "Military/Law Enforcement/Teaching",
      description: "Exclusão de género em militar/polícia/ensino",
      appliesTo: ["t2-exclusion-economic"],
      examples: ["No women in combat", "No trans in military"],
    },
    {
      id: "religious-sexual-orientation",
      name: "Religious-Based Sexual Orientation Exclusion",
      description: "Exclusão de orientação sexual baseada em religião",
      appliesTo: ["t2-exclusion-economic"],
      examples: ["As a Christian, gays shouldn't be in military"],
    },
    {
      id: "romantic-breakup",
      name: "Romantic Breakup Context",
      description: "Expressões de nojo em contexto de término romântico",
      appliesTo: ["t2-disgust"],
    },
    {
      id: "gender-mental",
      name: "Mental Illness Claims - Gender/Sexual Orientation",
      description: "Alegações de doença mental baseadas em género ou orientação sexual",
      appliesTo: ["t2-mental-insults"],
      examples: ["Trans people are mentally ill", "Gays are not normal"],
    },
  ],

  // ============================================
  // HARMFUL STEREOTYPES CRITERIA
  // ============================================
  harmfulStereotypes: [
    {
      name: "Blackface",
      criteria: [
        "Black makeup/paint significantly darkening face",
        "Visible lighter skin (neck, arm, around eyes)",
        "2+ exaggerated features: bulging eyes, oversized lips",
      ],
    },
    {
      name: "Holocaust Denial",
      criteria: [
        "Denying it happened",
        "Minimizing number of victims",
        "Denying mechanisms (gas chambers)",
        "Denying intentionality",
        "Accusing Jews of inventing/exaggerating",
      ],
    },
    {
      name: "Jewish Control Conspiracy",
      criteria: [
        "Reference to Jewish people or proxy",
        "Claims of controlling: financial systems, political systems, media",
      ],
      exception: "Zionists controlling Israeli institutions is allowed",
    },
    {
      name: "Dalit Stereotypes",
      criteria: [
        "Reference to lower caste/Dalits or Dr. Ambedkar",
        "Comparison to menial labor: toilets, cleaners, filth, sewage, scavenging, feces",
      ],
    },
    {
      name: "Black People Farm Equipment",
      criteria: [
        "Comparing Black people to farm equipment/tools",
      ],
    },
  ],

  // ============================================
  // PROXIES
  // ============================================
  proxies: {
    description: "Palavras usadas como substituto para PCs/QPCs",
    examples: [
      { term: "invaders", proxy: "immigrants/migrants", context: "with immigration context" },
      { term: "Zionist", proxy: "Jewish/Israeli", context: "in specific hateful contexts" },
      { term: "brown people", proxy: "various ethnicities", context: "context dependent" },
      { term: "skittles", proxy: "various", context: "context dependent" },
      { term: "Mohammed/Ahmed/Abdul", proxy: "Muslim people", context: "with pig/goat comparisons" },
    ],
  },

  keywordsLoaded: true,
};

// ============================================
// HC KEYWORDS - Portuguese + English
// ============================================

export const HC_KEYWORDS = {
  // ============================================
  // TIER 1 - DEHUMANIZING COMPARISONS
  // ============================================
  tier1Dehumanizing: {
    animals: [
      // Portuguese
      { term: "são baratas", severity: "critical", category: "T1 Dehumanizing - Insects" },
      { term: "são ratos", severity: "critical", category: "T1 Dehumanizing - Animals" },
      { term: "são porcos", severity: "critical", category: "T1 Dehumanizing - Animals" },
      { term: "são macacos", severity: "critical", category: "T1 Dehumanizing - Animals" },
      { term: "são vermes", severity: "critical", category: "T1 Dehumanizing - Animals" },
      { term: "são animais", severity: "high", category: "T1 Dehumanizing - Animals", requiresContext: true },
      
      // English
      { term: "are cockroaches", severity: "critical", category: "T1 Dehumanizing - Insects" },
      { term: "are locusts", severity: "critical", category: "T1 Dehumanizing - Insects" },
      { term: "are rats", severity: "critical", category: "T1 Dehumanizing - Animals" },
      { term: "are pigs", severity: "critical", category: "T1 Dehumanizing - Animals" },
      { term: "are apes", severity: "critical", category: "T1 Dehumanizing - Animals" },
      { term: "are monkeys", severity: "critical", category: "T1 Dehumanizing - Animals" },
      { term: "are worms", severity: "critical", category: "T1 Dehumanizing - Animals" },
      { term: "are animals", severity: "high", category: "T1 Dehumanizing - Animals", requiresContext: true },
    ],
    pathogens: [
      // Portuguese
      { term: "são uma praga", severity: "critical", category: "T1 Dehumanizing - Pathogens" },
      { term: "são um vírus", severity: "critical", category: "T1 Dehumanizing - Pathogens" },
      { term: "são um cancro", severity: "critical", category: "T1 Dehumanizing - Pathogens" },
      { term: "são uma doença", severity: "critical", category: "T1 Dehumanizing - Pathogens" },
      
      // English
      { term: "are a plague", severity: "critical", category: "T1 Dehumanizing - Pathogens" },
      { term: "are a virus", severity: "critical", category: "T1 Dehumanizing - Pathogens" },
      { term: "are a cancer", severity: "critical", category: "T1 Dehumanizing - Pathogens" },
      { term: "are a disease", severity: "critical", category: "T1 Dehumanizing - Pathogens" },
      { term: "are parasites", severity: "critical", category: "T1 Dehumanizing - Pathogens" },
    ],
    subhuman: [
      // Portuguese
      { term: "são selvagens", severity: "critical", category: "T1 Dehumanizing - Subhuman" },
      { term: "são demónios", severity: "critical", category: "T1 Dehumanizing - Subhuman" },
      { term: "são monstros", severity: "critical", category: "T1 Dehumanizing - Subhuman" },
      { term: "são bárbaros", severity: "critical", category: "T1 Dehumanizing - Subhuman" },
      
      // English
      { term: "are savages", severity: "critical", category: "T1 Dehumanizing - Subhuman" },
      { term: "are devils", severity: "critical", category: "T1 Dehumanizing - Subhuman" },
      { term: "are monsters", severity: "critical", category: "T1 Dehumanizing - Subhuman" },
      { term: "are barbarians", severity: "critical", category: "T1 Dehumanizing - Subhuman" },
      { term: "are subhuman", severity: "critical", category: "T1 Dehumanizing - Subhuman" },
      { term: "are inhuman", severity: "critical", category: "T1 Dehumanizing - Subhuman" },
    ],
  },

  // ============================================
  // TIER 1 - CRIMINAL ALLEGATIONS
  // ============================================
  tier1Criminals: [
    // Portuguese
    { term: "são pedófilos", severity: "critical", category: "T1 Criminal - Sexual" },
    { term: "são violadores", severity: "critical", category: "T1 Criminal - Sexual" },
    { term: "são terroristas", severity: "critical", category: "T1 Criminal - Violent" },
    { term: "são assassinos", severity: "critical", category: "T1 Criminal - Violent" },
    
    // English
    { term: "are pedophiles", severity: "critical", category: "T1 Criminal - Sexual" },
    { term: "are rapists", severity: "critical", category: "T1 Criminal - Sexual" },
    { term: "are terrorists", severity: "critical", category: "T1 Criminal - Violent" },
    { term: "are murderers", severity: "critical", category: "T1 Criminal - Violent" },
    { term: "are child molesters", severity: "critical", category: "T1 Criminal - Sexual" },
    { term: "are sexual predators", severity: "critical", category: "T1 Criminal - Sexual" },
  ],

  // ============================================
  // TIER 1 - HARM STATEMENTS
  // ============================================
  tier1Harm: [
    // Portuguese
    { term: "deviam morrer", severity: "critical", category: "T1 Harm - Death" },
    { term: "espero que morram", severity: "critical", category: "T1 Harm - Death" },
    { term: "deviam apanhar", severity: "high", category: "T1 Harm - Disease", requiresContext: true },
    { term: "espero que apanhem", severity: "high", category: "T1 Harm - Disease", requiresContext: true },
    { term: "deviam matar-se", severity: "critical", category: "T1 Harm - Suicide" },
    
    // English
    { term: "should die", severity: "critical", category: "T1 Harm - Death" },
    { term: "hope they die", severity: "critical", category: "T1 Harm - Death" },
    { term: "i hope they get", severity: "high", category: "T1 Harm - Disease", requiresContext: true },
    { term: "should kill themselves", severity: "critical", category: "T1 Harm - Suicide" },
    { term: "may god strike", severity: "high", category: "T1 Harm - Deity" },
    { term: "deserve to die", severity: "critical", category: "T1 Harm - Death" },
  ],

  // ============================================
  // TIER 1 - HARMFUL STEREOTYPES
  // ============================================
  tier1Stereotypes: [
    // Holocaust Denial
    { term: "holocaust didn't happen", severity: "critical", category: "T1 Stereotype - Holocaust Denial" },
    { term: "holohoax", severity: "critical", category: "T1 Stereotype - Holocaust Denial" },
    { term: "holocaust was fake", severity: "critical", category: "T1 Stereotype - Holocaust Denial" },
    { term: "holocaust is a lie", severity: "critical", category: "T1 Stereotype - Holocaust Denial" },
    { term: "holocausto não aconteceu", severity: "critical", category: "T1 Stereotype - Holocaust Denial" },
    { term: "holocausto é mentira", severity: "critical", category: "T1 Stereotype - Holocaust Denial" },
    
    // Jewish Control
    { term: "jews control", severity: "critical", category: "T1 Stereotype - Jewish Control" },
    { term: "jews own", severity: "critical", category: "T1 Stereotype - Jewish Control" },
    { term: "jews rule", severity: "critical", category: "T1 Stereotype - Jewish Control" },
    { term: "judeus controlam", severity: "critical", category: "T1 Stereotype - Jewish Control" },
    { term: "zionists control the media", severity: "critical", category: "T1 Stereotype - Jewish Control" },
    { term: "zionists control the banks", severity: "critical", category: "T1 Stereotype - Jewish Control" },
  ],

  // ============================================
  // TIER 2 - INSULTS
  // ============================================
  tier2Insults: {
    character: [
      // Portuguese
      { term: "são cobardes", severity: "high", category: "T2 Character Insult" },
      { term: "são mentirosos", severity: "high", category: "T2 Character Insult" },
      { term: "são ladrões", severity: "high", category: "T2 Character Insult" },
      { term: "são criminosos", severity: "high", category: "T2 Character Insult" },
      { term: "são gananciosos", severity: "high", category: "T2 Character Insult" },
      
      // English
      { term: "are cowards", severity: "high", category: "T2 Character Insult" },
      { term: "are liars", severity: "high", category: "T2 Character Insult" },
      { term: "are thieves", severity: "high", category: "T2 Character Insult" },
      { term: "are criminals", severity: "high", category: "T2 Character Insult" },
      { term: "are greedy", severity: "high", category: "T2 Character Insult" },
      { term: "are slutty", severity: "high", category: "T2 Character Insult" },
      { term: "are promiscuous", severity: "high", category: "T2 Character Insult" },
    ],
    mental: [
      // Portuguese
      { term: "são estúpidos", severity: "high", category: "T2 Mental Insult" },
      { term: "são idiotas", severity: "high", category: "T2 Mental Insult" },
      { term: "são burros", severity: "high", category: "T2 Mental Insult" },
      { term: "são retardados", severity: "high", category: "T2 Mental Insult" },
      
      // English
      { term: "are stupid", severity: "high", category: "T2 Mental Insult" },
      { term: "are idiots", severity: "high", category: "T2 Mental Insult" },
      { term: "are dumb", severity: "high", category: "T2 Mental Insult" },
      { term: "are retarded", severity: "high", category: "T2 Mental Insult" },
      { term: "are mentally ill", severity: "mid", category: "T2 Mental Insult", requiresContext: true },
    ],
    other: [
      // Portuguese
      { term: "não valem nada", severity: "high", category: "T2 Other Insult" },
      { term: "são lixo", severity: "high", category: "T2 Other Insult" },
      { term: "são escumalha", severity: "high", category: "T2 Other Insult" },
      { term: "são nojentos", severity: "high", category: "T2 Other Insult" },
      
      // English
      { term: "are worthless", severity: "high", category: "T2 Other Insult" },
      { term: "are useless", severity: "high", category: "T2 Other Insult" },
      { term: "are ugly", severity: "high", category: "T2 Other Insult" },
      { term: "are dirty", severity: "high", category: "T2 Other Insult" },
      { term: "are scum", severity: "high", category: "T2 Other Insult" },
      { term: "are filthy", severity: "high", category: "T2 Other Insult" },
      { term: "are trash", severity: "high", category: "T2 Other Insult" },
      { term: "pieces of shit", severity: "high", category: "T2 Other Insult" },
    ],
  },

  // ============================================
  // TIER 2 - DISGUST & CURSING
  // ============================================
  tier2DisgustCursing: [
    // Portuguese
    { term: "fazem-me vomitar", severity: "high", category: "T2 Disgust" },
    { term: "dão-me nojo", severity: "high", category: "T2 Disgust" },
    { term: "são repugnantes", severity: "high", category: "T2 Disgust" },
    { term: "foda-se os", severity: "high", category: "T2 Cursing" },
    
    // English
    { term: "make me vomit", severity: "high", category: "T2 Disgust" },
    { term: "make me want to throw up", severity: "high", category: "T2 Disgust" },
    { term: "are disgusting", severity: "high", category: "T2 Disgust" },
    { term: "are vile", severity: "high", category: "T2 Disgust" },
    { term: "fuck the", severity: "high", category: "T2 Cursing" },
    { term: "fucking", severity: "mid", category: "T2 Cursing", requiresContext: true },
  ],

  // ============================================
  // TIER 2 - EXCLUSION
  // ============================================
  tier2Exclusion: [
    // Portuguese
    { term: "não permitidos", severity: "high", category: "T2 Exclusion" },
    { term: "fora daqui", severity: "high", category: "T2 Exclusion" },
    { term: "voltem para", severity: "mid", category: "T2 Exclusion", requiresContext: true },
    { term: "expulsem os", severity: "high", category: "T2 Exclusion" },
    { term: "mundo sem", severity: "high", category: "T2 Exclusion" },
    { term: "não deviam poder votar", severity: "high", category: "T2 Political Exclusion" },
    
    // English
    { term: "not allowed", severity: "high", category: "T2 Exclusion" },
    { term: "get out", severity: "mid", category: "T2 Exclusion", requiresContext: true },
    { term: "go back to", severity: "mid", category: "T2 Exclusion", requiresContext: true },
    { term: "kick out", severity: "high", category: "T2 Exclusion" },
    { term: "world without", severity: "high", category: "T2 Exclusion" },
    { term: "should not be allowed to vote", severity: "high", category: "T2 Political Exclusion" },
    { term: "should not be allowed to work", severity: "high", category: "T2 Economic Exclusion" },
    { term: "keep them out", severity: "high", category: "T2 Exclusion" },
    { term: "no jews allowed", severity: "critical", category: "T2 Exclusion" },
    { term: "no muslims allowed", severity: "critical", category: "T2 Exclusion" },
    { term: "no blacks allowed", severity: "critical", category: "T2 Exclusion" },
  ],

  // ============================================
  // PROTECTED CHARACTERISTICS MENTIONS
  // ============================================
  pcMentions: [
    // Race
    { term: "black people", category: "PC - Race", requiresContext: true },
    { term: "white people", category: "PC - Race", requiresContext: true },
    { term: "negros", category: "PC - Race", requiresContext: true },
    { term: "brancos", category: "PC - Race", requiresContext: true },
    
    // Religion
    { term: "muslims", category: "PC - Religion", requiresContext: true },
    { term: "jews", category: "PC - Religion", requiresContext: true },
    { term: "christians", category: "PC - Religion", requiresContext: true },
    { term: "muçulmanos", category: "PC - Religion", requiresContext: true },
    { term: "judeus", category: "PC - Religion", requiresContext: true },
    { term: "cristãos", category: "PC - Religion", requiresContext: true },
    
    // Gender/Sexual Orientation
    { term: "gay people", category: "PC - Sexual Orientation", requiresContext: true },
    { term: "trans people", category: "PC - Gender Identity", requiresContext: true },
    { term: "women", category: "PC - Sex", requiresContext: true },
    { term: "men", category: "PC - Sex", requiresContext: true },
    { term: "mulheres", category: "PC - Sex", requiresContext: true },
    { term: "homens", category: "PC - Sex", requiresContext: true },
    
    // QPC
    { term: "immigrants", category: "QPC", requiresContext: true },
    { term: "migrants", category: "QPC", requiresContext: true },
    { term: "refugees", category: "QPC", requiresContext: true },
    { term: "imigrantes", category: "QPC", requiresContext: true },
    { term: "refugiados", category: "QPC", requiresContext: true },
  ],
};

// ============================================
// HC POLICY CONTENT (Full text for AI context)
// ============================================

export const HC_POLICY_CONTENT = `
# HATEFUL CONDUCT POLICY

## POLICY RATIONALE
Acreditamos que as pessoas se expressam mais livremente quando não se sentem atacadas com base em quem são. Por isso, não permitimos conduta de ódio no Facebook, Instagram ou Threads.

Definimos conduta de ódio como ataques diretos contra PESSOAS (não conceitos ou instituições) com base em Características Protegidas (PCs).

## PROTECTED CHARACTERISTICS (PCs)
- Race (Raça)
- Ethnicity (Etnia)
- National Origin (Origem Nacional)
- Disability (Deficiência)
- Religious Affiliation (Afiliação Religiosa - inclui ateísmo)
- Caste (Casta)
- Sexual Orientation (Orientação Sexual)
- Sex (Sexo)
- Gender Identity (Identidade de Género)
- Serious Disease (Doença Grave)

**Age** é protegido apenas quando combinado com outro PC.

## QUASI-PROTECTED CHARACTERISTICS (QPCs)
- Migrants
- Refugees
- Immigrants
- Asylum Seekers

QPCs são protegidos apenas de ataques Tier 1.

## TIER 1 - SEVERE ATTACKS (PCs, QPCs, Subsets)

### 1.a Dehumanizing Speech

**Comparisons to Animals:**
LABEL: Comparações a animais culturalmente inferiores
- Insects: cockroaches, locusts
- Specific animals: apes (Black), rats (Jewish), pigs (Muslim), worms (Mexican)
- Animals in general

**Comparisons to Pathogens:**
LABEL: Doenças, bactérias, vírus, micróbios

**Comparisons to Subhumanity:**
LABEL: Selvagens, demónios, monstros, bárbaros

### 1.b Allegations of Serious Criminality
LABEL: Comparações a:
- Sexual predators and pedophiles
- Violent criminals (terrorists, murderers)

### 1.c Statements Supporting Harm
LABEL: Declarações apoiando:
- Contracting a disease
- Experiencing natural disaster
- Self-injury or suicide
- Death without perpetrator
- Accidents/harm by deity

### 1.d Harmful Stereotypes
LABEL:
- **Blackface:** Black makeup + 2+ exaggerated features (eyes, lips)
- **Holocaust Denial:** Negar facto, número, mecanismos, intencionalidade
- **Jewish Control:** Claims Jews control financial/political/media institutions
- **Dalit Stereotypes:** References to Dalits as menial laborers
- **Black = Farm Equipment:** Comparing Black people to farm equipment

### 1.e Mocking
LABEL:
- Mocking concept, events, or victims of hate crimes
- Mocking people for having or experiencing disease

## TIER 2 - INSULTS, DISGUST, EXCLUSION (PCs only)

### 2.a Character Insults
LABEL: Insultos sobre carácter
- Cowardice, dishonesty
- Basic criminality (thieves, drug dealers)
- Sexual promiscuity/immorality

### 2.b Mental Insults
LABEL: Insultos sobre características mentais
- Stupidity, intellectual capacity
- Mental illness

**EXCEPTION:** Allegations of mental illness based on gender or sexual orientation = No Action

### 2.c Other Insults
LABEL: Worthlessness, uselessness, ugliness, dirtiness

### 2.d Statements of Superiority
No Action: "Asians are the best!"
LABEL: Comparisons on inherent intellectual capacity without support

### 2.e Expressions of Disgust
LABEL: "Make me vomit", "disgusting", "vile"

### 2.f Targeted Cursing
LABEL:
- "Fuck the [PC]!"
- Sexual contact terms (suck my dick, kiss my ass)

### 2.g Exclusion

**General Exclusion:**
LABEL: "No [PC] allowed!", "World without [PC]"

**Political Exclusion:**
LABEL: Deny right to vote, run for office, organize; imprisonment

**Economic Exclusion:**
LABEL: Deny employment, credit, assets, goods/services
EXCEPTION: Gender-based military/law enforcement/teaching exclusion

**Social Exclusion:**
LABEL: Deny access to spaces, social services, education
EXCEPTION: Sex/gender-based exclusion from commonly limited spaces (bathrooms, sports, support groups)

## SLURS

### When Slurs Violate:
- Calling someone a slur
- Slur without context
- Slur + T1/T2 attack

### When Slurs Are Allowed:
- To mock or condemn slur use
- To discuss slur use
- Self-referential use ("I am a [slur]")
- Explicitly positive context
- Alternative meaning

## SUBSETS

### Fully Protected (All Tiers):
- PC + PC (Muslim women)
- PC + age (Black children)
- PC + most/all quantifier
- PC + country location
- Slur + any characteristic

### Quasi-Protected (Tier 1 only):
- PC + QPC (Muslim refugees)
- PC + NPC (Irish taxi drivers)
- QPC + age (Immigrant children)
- PC/QPC + location < country (Berliner Muslims)

### Other Criminal Subsets (Tier 1 only):
- PC/QPC + crimes (except violent/sexual)
- "Illegal immigrants", "white thieves"

### Non-Protected:
- PC/QPC + violent criminals/sexual offenders
- Age only
- NPC only

## PROXIES

**Zionist as proxy for Jewish/Israeli:**
- When parent content calls out Jewish/Israeli + "Zionist" used with attack
- In Jewish control conspiracy context
- In animal comparisons (rats)
- In statements supporting harm

**Exception:** References to Zionists controlling Israeli institutions

## CONCEPTS VS PEOPLE

**No Action:** Attacks on concepts (Islam, Christianity, countries)
- "Islam should be eradicated"
- "Fuck Romania" (country)

**LABEL:** Concept + pronoun referring to people + attack
- "Islam should be wiped out. Every last one of them."
- "Fuck Romania, they're all thieves."

## BEHAVIORAL STATEMENTS VS GENERALIZATIONS

**Behavioral (No Action):** Assertions about actions
- "Black people commit crimes"
- "Americans kill people"

**Generalizations (LABEL):** Statements about inherent qualities
- "Black people are criminals"
- "Americans are killers"

## LABEL HIERARCHY

1. T1 - Comparisons or Generalizations
2. T1 - Statements Supporting Harm
3. T1 - Harmful Stereotypes
4. T1 - Mocking Hate Crimes/Disease
5. T2 - Character Insults
6. T2 - Mental Insults
7. T2 - Other Insults
8. T2 - Expressions of Disgust
9. T2 - Targeted Cursing
10. T2 - Exclusion/Segregation
11. Slurs

When slur + T1/T2 attack present: Label for highest-tiered attack
When slur alone: Label for Slur
`;

export default HC_POLICY;