// ============================================
// SSIED - Suicide, Self-Injury, and Eating Disorders
// Suicídio, Auto-Lesão e Distúrbios Alimentares
// ============================================

import { PolicyDefinition } from "@/lib/types";

export const SSIED_POLICY: PolicyDefinition = {
  id: "ssied",
  name: "Suicide, Self-Injury, and Eating Disorders",
  shortName: "SSIED",
  description:
    "Protege utilizadores relacionados a suicídio, auto-lesão e distúrbios alimentares. Permite discussão e suporte, mas remove promoção, encorajamento, instruções e conteúdo gráfico. Inclui escalação para Credible Intent of Suicide (CIS).",
  color: "#7c3aed",
  icon: "💜",
  ready: true,

  categories: [
    // ============================================
    // SUICIDE
    // ============================================
    {
      id: "suicide",
      name: "Suicide",
      description: "Conteúdo relacionado a suicídio",
      severity: "critical",
      subcategories: [
        {
          id: "suicide-promotion",
          name: "Suicide Promotion",
          description: "Encorajamento, coordenação ou instruções para suicídio",
          examples: [
            "Provides instructions for suicide",
            "Encourages others to die by suicide",
            "Coordinates suicide pacts",
            "Speaks positively about suicide",
          ],
        },
        {
          id: "suicide-graphic",
          name: "Graphic Suicide Content",
          description: "Imagens ou vídeos de tentativas ou mortes por suicídio",
          examples: [
            "Photos/videos depicting suicide attempt",
            "Death by suicide imagery",
            "Euthanasia/assisted suicide in medical setting",
            "Graphic suicide admission with imagery",
          ],
        },
        {
          id: "suicide-admission",
          name: "Suicide Admission",
          description: "Admissões verbais ou escritas de ideação suicida",
          examples: [
            "I want to die",
            "I will kill myself",
            "kms (kill myself)",
            "Vague suicidal statements",
          ],
        },
        {
          id: "suicide-mocking",
          name: "Mocking Suicide",
          description: "Trivialização ou zombaria de suicídio",
          examples: [
            "Promoting suicide satirically/humorously",
            "Mocking suicide victims/survivors",
            "Dismissing the concept of suicide",
          ],
        },
      ],
    },
    // ============================================
    // SELF-INJURY
    // ============================================
    {
      id: "self-injury",
      name: "Self-Injury",
      description: "Conteúdo relacionado a auto-lesão",
      severity: "high",
      subcategories: [
        {
          id: "si-promotion",
          name: "Self-Injury Promotion",
          description: "Encorajamento, coordenação ou instruções para auto-lesão",
          examples: [
            "Instructions for cutting",
            "Encourages self-harm",
            "Coordinates self-injury (5 likes = 1 cut)",
            "Speaks positively about self-injury",
          ],
        },
        {
          id: "si-graphic",
          name: "Graphic Self-Injury",
          description: "Imagens gráficas de auto-lesão",
          examples: [
            "Unhealed cuts as primary subject",
            "Blood visible from self-injury",
            "Active self-injury (razor in use)",
            "Means of self-injury depicted",
          ],
        },
        {
          id: "si-admission",
          name: "Self-Injury Admission",
          description: "Admissões de auto-lesão",
          examples: [
            "Written admission of cutting",
            "Healed cuts in SSI context",
            "Verbal admission of self-harm",
          ],
        },
        {
          id: "si-mocking",
          name: "Mocking Self-Injury",
          description: "Trivialização de auto-lesão",
          examples: [
            "Promoting self-injury satirically",
            "Mocking self-injury victims",
          ],
        },
      ],
    },
    // ============================================
    // EATING DISORDERS
    // ============================================
    {
      id: "eating-disorders",
      name: "Eating Disorders",
      description: "Distúrbios alimentares, comportamentos de perda de peso extrema",
      severity: "high",
      subcategories: [
        {
          id: "ed-promotion",
          name: "Eating Disorder Promotion",
          description: "Encorajamento, coordenação ou instruções para distúrbios alimentares",
          examples: [
            "Instructions for anorexia/bulimia",
            "Pro-ana/pro-mia content",
            "Thinspo/bonespo content",
            "ED buddy systems",
          ],
        },
        {
          id: "ed-graphic",
          name: "Graphic ED Content",
          description: "Imagens gráficas de distúrbios alimentares",
          examples: [
            "Active purging",
            "Consumption of inedible objects (pica)",
            "Focused body parts with ED context",
          ],
        },
        {
          id: "ed-admission",
          name: "ED Admission",
          description: "Admissões de distúrbios alimentares",
          examples: [
            "Admission of having ED",
            "Stating desire for ED",
            "ED diary/journal",
          ],
        },
        {
          id: "extreme-weight-loss",
          name: "Extreme Weight Loss Behavior",
          description: "Comportamentos extremos de perda de peso",
          examples: [
            "Less than 1200 calories/day",
            "Fasting 24+ hours",
            "Rapid weight loss > 2lbs/week",
            "Water fasting",
          ],
        },
        {
          id: "restrictive-dieting",
          name: "Restrictive Dieting",
          description: "Dietas restritivas sem contexto de ED",
          examples: [
            "Intermittent fasting promotion",
            "Meal skipping/substituting",
            "Elimination of macronutrient groups",
            "Detox/cleanses",
          ],
        },
      ],
    },
  ],

  // ============================================
  // CREDIBLE INTENT OF SUICIDE (CIS) - ESCALATION
  // ============================================
  escalationCriteria: {
    name: "Credible Intent of Suicide (CIS)",
    description: "Conteúdo que indica intenção credível de suicídio requer ESCALAÇÃO",
    requirements: {
      allRequired: [
        {
          name: "Explicit Intent",
          description: "Declaração explícita de intenção de tirar a própria vida",
          examples: [
            "I am going to kill myself",
            "I will commit suicide",
            "I am going to drink bleach",
            "I will shoot myself",
            "This is my suicide note",
          ],
        },
        {
          name: "Specific Capability",
          description: "Menção ou imagem de método/meio legítimo",
          examples: [
            "...with a gun",
            "...with pills",
            "...with a knife",
            "...with a rope",
            "Picture of means",
          ],
        },
        {
          name: "Imminence",
          description: "Planos a menos de 24 horas E conteúdo postado há menos de 24h",
          examples: [
            "Now",
            "Tonight",
            "Tomorrow",
            "Content timestamp < 24h old",
          ],
        },
      ],
    },
    action: "ESCALATE",
  },

  // ============================================
  // LABEL HIERARCHY
  // ============================================
  labelHierarchy: [
    // === ESCALATION ===
    {
      id: "escalate-cis-graphic",
      label: "ESCALATE > Suicide > Graphic/Promotion",
      path: ["ESCALATE", "Suicide", "Graphic/Promotion"],
      action: "escalate",
      severity: "critical",
      conditions: ["CIS with graphic imagery or promotion"],
    },
    {
      id: "escalate-cis-admission",
      label: "ESCALATE > Suicide > Admission",
      path: ["ESCALATE", "Suicide", "Admission"],
      action: "escalate",
      severity: "critical",
      conditions: ["CIS without graphic imagery"],
    },
    // === SUICIDE ===
    {
      id: "ssied-suicide-promotion-instruct",
      label: "LABEL > SSIED > Suicide > Promotion > Encourage, coordinate, provide instructions",
      path: ["LABEL", "SSIED", "Suicide", "Promotion", "Encourage/Coordinate/Instructions"],
      action: "label",
      severity: "critical",
    },
    {
      id: "ssied-suicide-promotion-positive",
      label: "LABEL > SSIED > Suicide > Promotion > Speaks Positively",
      path: ["LABEL", "SSIED", "Suicide", "Promotion", "Speaks Positively"],
      action: "label",
      severity: "critical",
    },
    {
      id: "ssied-suicide-graphic-photo-video",
      label: "LABEL > SSIED > Suicide > Graphic Content > Imagery depicting suicide attempt/death",
      path: ["LABEL", "SSIED", "Suicide", "Graphic Content", "Suicide Attempt/Death"],
      action: "label",
      severity: "critical",
    },
    {
      id: "ssied-suicide-graphic-sensational",
      label: "LABEL > SSIED > Suicide > Graphic Content > Sensational (Media)",
      path: ["LABEL", "SSIED", "Suicide", "Graphic Content", "Sensational"],
      action: "label",
      severity: "high",
    },
    {
      id: "ssied-suicide-graphic-admission",
      label: "LABEL > SSIED > Suicide > Graphic Content > Graphic Admission",
      path: ["LABEL", "SSIED", "Suicide", "Graphic Content", "Graphic Admission"],
      action: "label",
      severity: "critical",
    },
    {
      id: "ssied-suicide-euthanasia",
      label: "LABEL > SSIED > Suicide > Graphic Content > Assisted Suicide/Euthanasia",
      path: ["LABEL", "SSIED", "Suicide", "Graphic Content", "Euthanasia"],
      action: "label",
      severity: "high",
    },
    {
      id: "ssied-suicide-admission",
      label: "LABEL > SSIED > Suicide > Admission > Admission or vague statement",
      path: ["LABEL", "SSIED", "Suicide", "Admission"],
      action: "label",
      severity: "high",
    },
    {
      id: "ssied-suicide-mocking-satirical",
      label: "LABEL > SSIED > Suicide > Mocking > Promotes Satirically/Humorously",
      path: ["LABEL", "SSIED", "Suicide", "Mocking", "Satirical"],
      action: "label",
      severity: "high",
    },
    {
      id: "ssied-suicide-mocking-dismissing",
      label: "LABEL > SSIED > Suicide > Mocking > Mocking/Dismissing concept",
      path: ["LABEL", "SSIED", "Suicide", "Mocking", "Dismissing"],
      action: "label",
      severity: "mid",
    },
    {
      id: "ssied-suicide-reference",
      label: "LABEL > SSIED > Suicide > Suicide Reference/Narratives",
      path: ["LABEL", "SSIED", "Suicide", "Reference/Narratives"],
      action: "label",
      severity: "mid",
    },
    // === SELF-INJURY ===
    {
      id: "ssied-si-promotion-instruct",
      label: "LABEL > SSIED > Self-Injury > Promotion > Encourage, coordinate, provide instructions",
      path: ["LABEL", "SSIED", "Self-Injury", "Promotion", "Encourage/Coordinate/Instructions"],
      action: "label",
      severity: "high",
    },
    {
      id: "ssied-si-promotion-positive",
      label: "LABEL > SSIED > Self-Injury > Promotion > Speaks Positively",
      path: ["LABEL", "SSIED", "Self-Injury", "Promotion", "Speaks Positively"],
      action: "label",
      severity: "high",
    },
    {
      id: "ssied-si-graphic-sensational",
      label: "LABEL > SSIED > Self-Injury > Graphic Content > Sensational (Media)",
      path: ["LABEL", "SSIED", "Self-Injury", "Graphic Content", "Sensational"],
      action: "label",
      severity: "high",
    },
    {
      id: "ssied-si-graphic-admission",
      label: "LABEL > SSIED > Self-Injury > Graphic Content > Graphic Admission",
      path: ["LABEL", "SSIED", "Self-Injury", "Graphic Content", "Graphic Admission"],
      action: "label",
      severity: "high",
    },
    {
      id: "ssied-si-admission-healed",
      label: "LABEL > SSIED > Self-Injury > Graphic Content > Admission with healed cuts",
      path: ["LABEL", "SSIED", "Self-Injury", "Graphic Content", "Healed Cuts"],
      action: "label",
      severity: "mid",
    },
    {
      id: "ssied-si-admission-no-imagery",
      label: "LABEL > SSIED > Self-Injury > Admission > No imagery",
      path: ["LABEL", "SSIED", "Self-Injury", "Admission"],
      action: "label",
      severity: "mid",
    },
    {
      id: "ssied-si-recovery",
      label: "LABEL > SSIED > Self-Injury > Admission > Recovery with imagery",
      path: ["LABEL", "SSIED", "Self-Injury", "Admission", "Recovery"],
      action: "label",
      severity: "low",
    },
    {
      id: "ssied-si-mocking",
      label: "LABEL > SSIED > Self-Injury > Mocking",
      path: ["LABEL", "SSIED", "Self-Injury", "Mocking"],
      action: "label",
      severity: "mid",
    },
    // === EATING DISORDERS ===
    {
      id: "ssied-ed-promotion-instruct",
      label: "LABEL > SSIED > Eating Disorder > Yes > Promotion > Encourage/coordinate/instructions",
      path: ["LABEL", "SSIED", "Eating Disorder", "Yes", "Promotion", "Instructions"],
      action: "label",
      severity: "high",
    },
    {
      id: "ssied-ed-promotion-positive",
      label: "LABEL > SSIED > Eating Disorder > Yes > Promotion > Speaks Positively",
      path: ["LABEL", "SSIED", "Eating Disorder", "Yes", "Promotion", "Speaks Positively"],
      action: "label",
      severity: "high",
    },
    {
      id: "ssied-ed-graphic",
      label: "LABEL > SSIED > Eating Disorder > Yes > Graphic Content > Graphic Admission",
      path: ["LABEL", "SSIED", "Eating Disorder", "Yes", "Graphic Content"],
      action: "label",
      severity: "high",
    },
    {
      id: "ssied-ed-admission",
      label: "LABEL > SSIED > Eating Disorder > Yes > Admission",
      path: ["LABEL", "SSIED", "Eating Disorder", "Yes", "Admission"],
      action: "label",
      severity: "mid",
    },
    {
      id: "ssied-ed-recovery",
      label: "LABEL > SSIED > Eating Disorder > Yes > Recovery",
      path: ["LABEL", "SSIED", "Eating Disorder", "Yes", "Recovery"],
      action: "label",
      severity: "low",
    },
    {
      id: "ssied-ed-mocking",
      label: "LABEL > SSIED > Eating Disorder > Yes > Mocking",
      path: ["LABEL", "SSIED", "Eating Disorder", "Yes", "Mocking"],
      action: "label",
      severity: "mid",
    },
    // === EXTREME WEIGHT LOSS (No ED Context) ===
    {
      id: "ssied-ewl-promotion",
      label: "LABEL > SSIED > Eating Disorder > No > Promotion > Extreme Weight Loss Promotion",
      path: ["LABEL", "SSIED", "Eating Disorder", "No", "Promotion", "Extreme Weight Loss"],
      action: "label",
      severity: "mid",
    },
    {
      id: "ssied-rd-promotion",
      label: "LABEL > SSIED > Eating Disorder > No > Promotion > Restrictive Dieting Promotion",
      path: ["LABEL", "SSIED", "Eating Disorder", "No", "Promotion", "Restrictive Dieting"],
      action: "label",
      severity: "mid",
    },
    {
      id: "ssied-body-parts",
      label: "LABEL > SSIED > Eating Disorder > No > Graphic Content > Body parts focus",
      path: ["LABEL", "SSIED", "Eating Disorder", "No", "Graphic Content", "Body Parts"],
      action: "label",
      severity: "mid",
    },
    {
      id: "ssied-ewl-admission",
      label: "LABEL > SSIED > Eating Disorder > No > Admission > Extreme Weight Loss",
      path: ["LABEL", "SSIED", "Eating Disorder", "No", "Admission"],
      action: "label",
      severity: "low",
    },
    {
      id: "ssied-comparison",
      label: "LABEL > SSIED > Eating Disorder > No > Other > Side-by-side Weight Comparison",
      path: ["LABEL", "SSIED", "Eating Disorder", "No", "Other", "Weight Comparison"],
      action: "label",
      severity: "low",
    },
  ],

  // ============================================
  // EXCEPTIONS
  // ============================================
  exceptions: [
    {
      id: "condemnation",
      name: "Condemnation/Awareness",
      description: "Conteúdo para consciencialização ou condenação (sem imagens gráficas)",
      appliesTo: ["all"],
    },
    {
      id: "recovery",
      name: "Recovery Context",
      description: "Conteúdo sobre recuperação com indicação clara de cura",
      appliesTo: ["suicide-admission", "si-admission", "ed-admission"],
    },
    {
      id: "support-resources",
      name: "Support Resources",
      description: "Recursos de suporte para vítimas (sem imagens gráficas)",
      appliesTo: ["all"],
    },
    {
      id: "accidental-injury",
      name: "Accidental Injury",
      description: "Lesões acidentais, não auto-infligidas",
      appliesTo: ["self-injury"],
    },
    {
      id: "body-modification",
      name: "Body Modification",
      description: "Modificação corporal por razões religiosas/culturais",
      appliesTo: ["self-injury"],
    },
    {
      id: "religious-fasting",
      name: "Religious Fasting",
      description: "Jejum religioso (Ramadão, Quaresma)",
      appliesTo: ["extreme-weight-loss"],
    },
    {
      id: "medical-context",
      name: "Medical Context",
      description: "Contexto médico ou procedimentos supervisionados",
      appliesTo: ["extreme-weight-loss", "restrictive-dieting"],
    },
    {
      id: "euthanasia-discussion",
      name: "Euthanasia Discussion",
      description: "Discussão sobre direito a morrer/eutanásia",
      appliesTo: ["suicide"],
    },
  ],

  // ============================================
  // VIRAL EVENTS
  // ============================================
  viralEvents: [
    { name: "Blue Whale Challenge", status: "designated", type: "suicide" },
    { name: "Momo Challenge", status: "assess", type: "suicide" },
    { name: "Jonathan Galindo / Dogface", status: "assess", type: "suicide" },
    { name: "6inner / 7inner", status: "designated", type: "suicide" },
    { name: "White Rabbit", status: "designated", type: "suicide" },
  ],

  // ============================================
  // EATING DISORDER SIGNALS
  // ============================================
  edSignals: {
    promotional: [
      "thinspo", "bonespo", "meanspo", "thinspiration",
      "proana", "promia", "edtips",
      "anabuddy", "princessanamia", "#anabudddywanted", "#anatips", "#anagoals",
      "ana coach", "eating disorder coach",
    ],
    contextual: [
      "bulimia", "anorexia", "orthorexia", "binging", "pica",
      "#mia", "#ana", "#anamia", "edtwt", "anatwt", "edinsta", "eddiary",
      "#thighgap", "body checking",
      "#selfharm", "#cutting",
      "#stopeating", "#starveyourself", "#donteat",
      "GW", "UGW", "goal weight", "ultimate goal weight",
    ],
    benign: [
      "#depression", "#sad", "#goals", "#bodygoals",
      "fitspo", "fitspiration", "#healthinspo",
      "dieting", "juice cleanse", "healthy eating",
      "#edrecovery", "#anafighter", "#anawarrior",
    ],
  },

  // ============================================
  // BODY PARTS (for focused depiction)
  // ============================================
  bodyPartsForIdealisation: [
    "ribs", "collarbones", "thigh gaps", "hips",
    "concave stomach", "protruding spine", "scapula",
    "visible bones in arms/legs", "hollow cheeks",
  ],

  // ============================================
  // EXTREME WEIGHT LOSS BEHAVIOR CRITERIA
  // ============================================
  extremeWeightLossCriteria: [
    "Less than 1200 calories per day",
    "Fasting for 24+ hours",
    "Water fasting / water only diet",
    "Rapid weight loss > 2 lbs (0.9 kg) per week",
    "Weight loss for children under 13 without supervision",
  ],

  // ============================================
  // RESTRICTIVE DIETING CRITERIA
  // ============================================
  restrictiveDietingCriteria: [
    "Unquantified rapid weight loss",
    "Elimination of entire macronutrient group (carbs, proteins, fats)",
    "Intermittent fasting",
    "Meal skipping or substituting",
    "Detoxes or cleanses (no solid food)",
  ],

  keywordsLoaded: true,
};

// ============================================
// SSIED KEYWORDS - Portuguese + English
// ============================================

export const SSIED_KEYWORDS = {
  // ============================================
  // SUICIDE KEYWORDS
  // ============================================
  suicide: {
    explicit: [
      // Portuguese
      { term: "vou me matar", severity: "critical", category: "Suicide Intent" },
      { term: "vou cometer suicídio", severity: "critical", category: "Suicide Intent" },
      { term: "quero morrer", severity: "high", category: "Suicide Ideation" },
      { term: "quero me matar", severity: "critical", category: "Suicide Intent" },
      { term: "vou acabar com tudo", severity: "high", category: "Suicide Ideation" },
      { term: "não quero mais viver", severity: "high", category: "Suicide Ideation" },
      { term: "vou tirar minha vida", severity: "critical", category: "Suicide Intent" },
      { term: "carta de suicídio", severity: "critical", category: "Suicide Note" },
      { term: "nota de suicídio", severity: "critical", category: "Suicide Note" },
      { term: "meu último adeus", severity: "high", category: "Suicide Ideation" },
      
      // English
      { term: "i will kill myself", severity: "critical", category: "Suicide Intent" },
      { term: "going to commit suicide", severity: "critical", category: "Suicide Intent" },
      { term: "i want to die", severity: "high", category: "Suicide Ideation" },
      { term: "end my life", severity: "critical", category: "Suicide Intent" },
      { term: "take my own life", severity: "critical", category: "Suicide Intent" },
      { term: "suicide note", severity: "critical", category: "Suicide Note" },
      { term: "my final goodbye", severity: "high", category: "Suicide Ideation" },
      { term: "nobody would miss me", severity: "high", category: "Suicide Ideation" },
      { term: "better off without me", severity: "high", category: "Suicide Ideation" },
    ],
    slang: [
      { term: "kms", severity: "high", category: "Suicide Slang" },
      { term: "kill myself", severity: "high", category: "Suicide Slang" },
      { term: "unalive myself", severity: "high", category: "Suicide Slang" },
      { term: "sewerslide", severity: "mid", category: "Suicide Slang" },
      { term: "s word", severity: "mid", category: "Suicide Slang", requiresContext: true },
    ],
    methods: [
      { term: "enforcar", severity: "high", category: "Suicide Method" },
      { term: "pular de", severity: "mid", category: "Suicide Method", requiresContext: true },
      { term: "overdose", severity: "high", category: "Suicide Method" },
      { term: "cortar os pulsos", severity: "high", category: "Suicide Method" },
      { term: "hanging", severity: "high", category: "Suicide Method" },
      { term: "jump off", severity: "mid", category: "Suicide Method", requiresContext: true },
      { term: "slit wrists", severity: "high", category: "Suicide Method" },
      { term: "take pills", severity: "mid", category: "Suicide Method", requiresContext: true },
      { term: "drink bleach", severity: "high", category: "Suicide Method" },
    ],
    promotion: [
      { term: "como se matar", severity: "critical", category: "Suicide Promotion" },
      { term: "tutorial suicídio", severity: "critical", category: "Suicide Promotion" },
      { term: "how to kill yourself", severity: "critical", category: "Suicide Promotion" },
      { term: "suicide tutorial", severity: "critical", category: "Suicide Promotion" },
      { term: "suicide is the answer", severity: "high", category: "Suicide Promotion" },
      { term: "suicide pact", severity: "critical", category: "Suicide Promotion" },
      { term: "pacto de suicídio", severity: "critical", category: "Suicide Promotion" },
    ],
    viralEvents: [
      { term: "blue whale challenge", severity: "critical", category: "Viral Event" },
      { term: "desafio baleia azul", severity: "critical", category: "Viral Event" },
      { term: "momo challenge", severity: "high", category: "Viral Event" },
      { term: "desafio momo", severity: "high", category: "Viral Event" },
      { term: "jonathan galindo", severity: "high", category: "Viral Event" },
      { term: "dogface challenge", severity: "high", category: "Viral Event" },
    ],
  },

  // ============================================
  // SELF-INJURY KEYWORDS
  // ============================================
  selfInjury: {
    explicit: [
      // Portuguese
      { term: "me cortar", severity: "high", category: "Self-Injury" },
      { term: "me corto", severity: "high", category: "Self-Injury" },
      { term: "auto-mutilação", severity: "high", category: "Self-Injury" },
      { term: "automutilação", severity: "high", category: "Self-Injury" },
      { term: "auto-lesão", severity: "high", category: "Self-Injury" },
      { term: "me machucar", severity: "mid", category: "Self-Injury", requiresContext: true },
      { term: "cicatrizes de corte", severity: "high", category: "Self-Injury" },
      
      // English
      { term: "cut myself", severity: "high", category: "Self-Injury" },
      { term: "cutting myself", severity: "high", category: "Self-Injury" },
      { term: "self harm", severity: "high", category: "Self-Injury" },
      { term: "self-harm", severity: "high", category: "Self-Injury" },
      { term: "self injury", severity: "high", category: "Self-Injury" },
      { term: "self-injury", severity: "high", category: "Self-Injury" },
      { term: "hurt myself", severity: "mid", category: "Self-Injury", requiresContext: true },
      { term: "cutting scars", severity: "high", category: "Self-Injury" },
    ],
    slang: [
      { term: "sh", severity: "mid", category: "Self-Injury Slang", requiresContext: true },
      { term: "#selfharm", severity: "high", category: "Self-Injury Hashtag" },
      { term: "#cutting", severity: "high", category: "Self-Injury Hashtag" },
      { term: "#selfinjury", severity: "high", category: "Self-Injury Hashtag" },
      { term: "yeeting", severity: "mid", category: "Self-Injury Slang", requiresContext: true },
    ],
    promotion: [
      { term: "5 likes = 1 cut", severity: "critical", category: "Self-Injury Promotion" },
      { term: "cutting feels good", severity: "high", category: "Self-Injury Promotion" },
      { term: "cortar é bom", severity: "high", category: "Self-Injury Promotion" },
      { term: "you should try cutting", severity: "critical", category: "Self-Injury Promotion" },
      { term: "fresh razors", severity: "high", category: "Self-Injury Promotion", requiresContext: true },
    ],
  },

  // ============================================
  // EATING DISORDER KEYWORDS
  // ============================================
  eatingDisorders: {
    promotional: [
      { term: "proana", severity: "high", category: "ED Promotion" },
      { term: "pro ana", severity: "high", category: "ED Promotion" },
      { term: "promia", severity: "high", category: "ED Promotion" },
      { term: "pro mia", severity: "high", category: "ED Promotion" },
      { term: "thinspo", severity: "high", category: "ED Promotion" },
      { term: "thinspiration", severity: "high", category: "ED Promotion" },
      { term: "bonespo", severity: "high", category: "ED Promotion" },
      { term: "meanspo", severity: "high", category: "ED Promotion" },
      { term: "anabuddy", severity: "high", category: "ED Promotion" },
      { term: "ana buddy", severity: "high", category: "ED Promotion" },
      { term: "#anatips", severity: "high", category: "ED Promotion" },
      { term: "#anagoals", severity: "high", category: "ED Promotion" },
      { term: "ana coach", severity: "high", category: "ED Promotion" },
    ],
    contextual: [
      { term: "anorexia", severity: "mid", category: "ED Signal", requiresContext: true },
      { term: "anorexica", severity: "mid", category: "ED Signal", requiresContext: true },
      { term: "bulimia", severity: "mid", category: "ED Signal", requiresContext: true },
      { term: "bulimica", severity: "mid", category: "ED Signal", requiresContext: true },
      { term: "ortorexia", severity: "mid", category: "ED Signal", requiresContext: true },
      { term: "pica disorder", severity: "high", category: "ED Signal" },
      { term: "#ana", severity: "mid", category: "ED Signal", requiresContext: true },
      { term: "#mia", severity: "mid", category: "ED Signal", requiresContext: true },
      { term: "#anamia", severity: "high", category: "ED Signal" },
      { term: "edtwt", severity: "high", category: "ED Signal" },
      { term: "anatwt", severity: "high", category: "ED Signal" },
      { term: "edinsta", severity: "high", category: "ED Signal" },
      { term: "eddiary", severity: "high", category: "ED Signal" },
      { term: "thigh gap", severity: "mid", category: "ED Signal", requiresContext: true },
      { term: "#thighgap", severity: "mid", category: "ED Signal" },
      { term: "body checking", severity: "mid", category: "ED Signal", requiresContext: true },
      { term: "goal weight", severity: "mid", category: "ED Signal", requiresContext: true },
      { term: "GW", severity: "low", category: "ED Signal", requiresContext: true },
      { term: "UGW", severity: "mid", category: "ED Signal" },
      { term: "ultimate goal weight", severity: "mid", category: "ED Signal" },
    ],
    behaviors: [
      { term: "purgar", severity: "high", category: "ED Behavior" },
      { term: "purging", severity: "high", category: "ED Behavior" },
      { term: "binging", severity: "mid", category: "ED Behavior", requiresContext: true },
      { term: "compulsão alimentar", severity: "mid", category: "ED Behavior", requiresContext: true },
      { term: "vomitar para emagrecer", severity: "high", category: "ED Behavior" },
      { term: "vomit to lose weight", severity: "high", category: "ED Behavior" },
      { term: "comer giz", severity: "high", category: "Pica" },
      { term: "eating chalk", severity: "high", category: "Pica" },
      { term: "eating clay", severity: "high", category: "Pica" },
      { term: "eating dirt", severity: "high", category: "Pica" },
    ],
    extremeWeightLoss: [
      { term: "menos de 1200 calorias", severity: "high", category: "Extreme Weight Loss" },
      { term: "under 1200 calories", severity: "high", category: "Extreme Weight Loss" },
      { term: "1000 calorias por dia", severity: "high", category: "Extreme Weight Loss" },
      { term: "800 calories a day", severity: "high", category: "Extreme Weight Loss" },
      { term: "500 calorias", severity: "high", category: "Extreme Weight Loss" },
      { term: "jejum de 24 horas", severity: "high", category: "Extreme Weight Loss" },
      { term: "24 hour fast", severity: "high", category: "Extreme Weight Loss" },
      { term: "water fasting", severity: "high", category: "Extreme Weight Loss" },
      { term: "jejum de água", severity: "high", category: "Extreme Weight Loss" },
      { term: "perder 3 quilos por semana", severity: "high", category: "Extreme Weight Loss" },
      { term: "lose 3 pounds a week", severity: "high", category: "Extreme Weight Loss" },
    ],
    restrictiveDieting: [
      { term: "jejum intermitente", severity: "mid", category: "Restrictive Dieting", requiresContext: true },
      { term: "intermittent fasting", severity: "mid", category: "Restrictive Dieting", requiresContext: true },
      { term: "pular refeição", severity: "mid", category: "Restrictive Dieting", requiresContext: true },
      { term: "skip meals", severity: "mid", category: "Restrictive Dieting", requiresContext: true },
      { term: "no carb diet", severity: "mid", category: "Restrictive Dieting", requiresContext: true },
      { term: "dieta sem carboidrato", severity: "mid", category: "Restrictive Dieting", requiresContext: true },
      { term: "detox", severity: "low", category: "Restrictive Dieting", requiresContext: true },
      { term: "cleanse diet", severity: "low", category: "Restrictive Dieting", requiresContext: true },
    ],
  },

  // ============================================
  // MOCKING/TRIVIALIZING
  // ============================================
  mocking: [
    { term: "#meme suicide", severity: "mid", category: "Mocking" },
    { term: "#dankmemes suicide", severity: "mid", category: "Mocking" },
    { term: "#edgymemes", severity: "low", category: "Mocking", requiresContext: true },
    { term: "#blackhumor suicide", severity: "mid", category: "Mocking" },
    { term: "lmao kms", severity: "mid", category: "Mocking" },
    { term: "lowkey wanna die", severity: "mid", category: "Mocking" },
  ],

  // ============================================
  // RECOVERY SIGNALS (Context)
  // ============================================
  recovery: [
    { term: "recovery", severity: "low", category: "Recovery", isException: true },
    { term: "recuperação", severity: "low", category: "Recovery", isException: true },
    { term: "#edrecovery", severity: "low", category: "Recovery", isException: true },
    { term: "#anafighter", severity: "low", category: "Recovery", isException: true },
    { term: "#anawarrior", severity: "low", category: "Recovery", isException: true },
    { term: "sobrevivi", severity: "low", category: "Recovery", isException: true },
    { term: "survived", severity: "low", category: "Recovery", isException: true },
    { term: "em tratamento", severity: "low", category: "Recovery", isException: true },
    { term: "in treatment", severity: "low", category: "Recovery", isException: true },
  ],
};

// ============================================
// SSIED POLICY CONTENT (Full text for AI context)
// ============================================

export const SSIED_POLICY_CONTENT = `
# SUICIDE, SELF-INJURY, AND EATING DISORDERS (SSIED)

## POLICY RATIONALE
Preocupamo-nos profundamente com a segurança das pessoas que usam as nossas aplicações. Consultamos regularmente especialistas em suicídio, auto-lesão e distúrbios alimentares.

**Não permitimos:**
- Celebrar ou promover intencionalmente suicídio, auto-lesão ou distúrbios alimentares
- Conteúdo ficcional que encoraje (memes, ilustrações)
- Conteúdo gráfico, independentemente do contexto
- Zombar de vítimas ou sobreviventes
- Representações em tempo real

**Permitimos:**
- Discussão destes tópicos
- Partilha de experiências
- Consciencialização
- Procurar suporte

## CREDIBLE INTENT OF SUICIDE (CIS) - ESCALAÇÃO

### Critérios para Escalação (TODOS necessários):
1. **Explicit Intent:** Declaração explícita de intenção de tirar a própria vida
   - "I am going to kill myself"
   - "I will commit suicide"
   - "This is my suicide note"

2. **Specific Capability:** Menção ou imagem de método/meio
   - Pistola, facas, cordas, comprimidos
   - Imagem do meio/método

3. **Imminence (< 24 horas):**
   - Planos imediatos: "agora", "amanhã", "esta noite"
   - Conteúdo postado há menos de 24 horas

### Escalation Paths:
- **ESCALATE > Suicide > Graphic/Promotion:** Com imagens gráficas ou promoção
- **ESCALATE > Suicide > Admission:** Sem imagens gráficas

## 1. SUICIDE

### 1.a Promotion (LABEL)
- Promove suicídio onde risco de dano é iminente
- Encoraja, coordena ou fornece instruções
- Fala positivamente sobre suicídio

### 1.b Graphic Content (LABEL)
- Fotos/vídeos de tentativa de suicídio ou morte
- Cortes verticais não cicatrizados no interior do antebraço
- Meios de suicídio ativamente ou passivamente retratados

### 1.c Admission (LABEL)
- Admissões verbais ou escritas de ideação suicida
- Declarações vagas potencialmente suicidas com contexto SSI

### 1.d Mocking (LABEL)
- Promover suicídio satiricamente ou humoristicamente
- Zombar de vítimas ou sobreviventes
- Descartar o conceito de suicídio

### 1.e Viral Events
- Blue Whale Challenge
- Momo Challenge
- Jonathan Galindo / Dogface
- 6inner / 7inner
- White Rabbit

### Exceções (No Action):
- Discussão sobre eutanásia/direito a morrer
- Recursos de suporte sem imagens gráficas
- Conteúdo sobre tentativa passada com indicação clara de recuperação

## 2. SELF-INJURY

### 2.a Promotion (LABEL)
- Encoraja, coordena ou fornece instruções
- "5 likes = 1 cut"
- Fala positivamente sobre auto-lesão

### 2.b Graphic Content (LABEL)
- Cortes não cicatrizados como tema principal
- Pele não cobre a ferida
- Sangue visível (incluindo crostas)
- Auto-lesão ativa (lâmina em uso)
- Meios de auto-lesão retratados

### 2.c Healed Cuts
Indicadores de cortes cicatrizados:
- Pele restaurada sobre a ferida
- Características elevadas visíveis nas margens da cicatriz
- Sem sangue visível

### Exceções (No Action):
- Lesões acidentais
- Modificação corporal por razões religiosas/culturais
- Recuperação com indicação clara

## 3. EATING DISORDERS

### 3.a Promotion (LABEL)
- Encoraja, coordena ou fornece instruções
- Fala positivamente de ED
- Sinais promocionais: thinspo, bonespo, proana, promia

### 3.b Graphic Content (LABEL)
- Purga ativa
- Consumo de objetos não comestíveis (pica)
- Imagens focadas em partes corporais com contexto ED

### 3.c Admission (LABEL)
- Admissão de engagement em ED
- Desejar ter um ED

### 3.d ED Signals

**Sinais Promocionais (violam):**
- thinspo, bonespo, meanspo, thinspiration
- proana, promia, edtips
- anabuddy, #anatips, #anagoals, ana coach

**Sinais de Contexto ED:**
- bulimia, anorexia, orthorexia, binging, pica
- #mia, #ana, #anamia, edtwt, anatwt
- #thighgap, body checking
- #stopeating, #starveyourself
- GW, UGW (goal weight)

**Sinais Benignos (não violam sozinhos):**
- #depression, #sad, #goals
- fitspo, fitspiration
- #edrecovery, #anafighter

## 4. EXTREME WEIGHT LOSS BEHAVIOR

### Definição:
Comportamentos para perda de peso que envolvem padrões alimentares desordenados e podem resultar em desnutrição, dano físico ou consequências graves.

### Critérios (LABEL em contexto promocional ou admissivo):
- Consumir menos de 1200 calorias por dia
- Jejum de 24+ horas
- Jejum de água
- Metas de perda de peso > 2 lbs (0.9 kg) por semana

### Exceções:
- Jejum religioso (Ramadão, Quaresma)
- Contexto médico/procedimento

## 5. RESTRICTIVE DIETING

### Definição:
Comportamentos que limitam consumo mas não são claramente ligados a padrões alimentares desordenados.

### Critérios (LABEL apenas em contexto promocional):
- Perda de peso rápida não quantificada
- Eliminação de grupos macronutrientes (carboidratos, proteínas, gorduras)
- Jejum intermitente
- Pular ou substituir refeições
- Detox ou cleanses sem alimentos sólidos

### Exceções:
- Contexto admissivo (No Action)
- Evitar alimentos específicos (produtos animais, glúten)

## 6. BODY PARTS (Focused Depiction)

### Partes Corporais para "Body Idealization":
- Costelas (ribs)
- Clavículas (collarbones)
- Espaço entre coxas (thigh gaps)
- Ancas (hips)
- Estômago côncavo
- Coluna protuberante
- Escápula
- Ossos visíveis em braços/pernas
- Bochechas ocas

### Focused Depiction (LABEL):
- Cropping ou zoom em partes do corpo sem rosto visível
- Edição para focar nas partes
- Deslocar ou remover roupa para expor

## HIERARCHY OF ACTIONS

### Suicide:
1. Encourages, coordinates, provides instructions
2. Speaks positively
3. Imagery depicting attempt/death
4. Sensational (media)
5. Graphic Admission
6. Promotes satirically/humorously
7. Assisted Suicide/Euthanasia
8. Admission (no graphic imagery)
9. Mocking/Dismissing concept
10. Reference/Narratives

### Self-Injury:
1. Encourages, coordinates, provides instructions
2. Speaks positively
3. Sensational (media)
4. Graphic Admission
5. Promotes satirically/humorously
6. Admission with healed cuts
7. Admission (no graphic imagery)
8. Recovery with imagery
9. Mocking/Dismissing concept
10. Reference/Narratives

### Eating Disorder:
1. Encourages, coordinates, provides instructions
2. Speaks positively
3. Graphic Admission
4. Promotes satirically/humorously
5. Admission (no focused imagery)
6. Extreme weight loss promotion
7. Restrictive dieting promotion
8. Body parts focus
9. Extreme weight loss admission
10. Recovery with focused imagery
11. Mocking/Dismissing concept
12. Side-by-side comparison

## CONTRADICTORY CONTEXT (Negates SSI/ED)
- Lesão infligida por outros
- Cortes acidentais
- Modificação corporal religiosa/cultural
- Materiais de prevenção
- Informação diagnóstica
- Fome/doença não relacionada a ED
- Bebés/animais consumindo objetos
- Jejum religioso
- Procedimentos médicos
- Greve de fome
`;

export default SSIED_POLICY;