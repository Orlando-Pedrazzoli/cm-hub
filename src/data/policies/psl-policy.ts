// ============================================
// PSL - Profane and Sexualized Language
// Linguagem Profana e Sexualizada
// ============================================

import { PolicyDefinition } from "@/lib/types";

export const PSL_POLICY: PolicyDefinition = {
  id: "psl",
  name: "Profane and Sexualized Language",
  shortName: "PSL",
  description:
    "Linguagem sexualmente vulgar ou profana. Profanidades são frequentemente vistas como culturalmente impolidas, grosseiras ou ofensivas. Mesmo quando usadas em contextos comuns ou não-sexuais, profanidades sexualmente derivadas podem ser inapropriadas, especialmente para menores. Protegemos adolescentes de exposição a tal linguagem, permitindo alguma profanidade em contextos artísticos e outros usos benignos.",
  color: "#9333ea",
  icon: "🤬",
  ready: true,

  categories: [
    // ============================================
    // 1. SEXUALLY VULGAR LANGUAGE
    // ============================================
    {
      id: "sexually-vulgar",
      name: "Sexually Vulgar Language",
      description: "Frases ou palavras anatomicamente ou sexualmente derivadas (ex: suck my balls, eat my dick, blow my cock, dick, fuck, pussy, motherfucker, cocksucker). Referir às listas exaustivas por mercado.",
      severity: "mid",
      subcategories: [
        {
          id: "targeting-individuals",
          name: "When Targeting Identifiable Individuals",
          description: "Linguagem vulgar dirigida a indivíduos identificáveis",
          action: "information",
          examples: [
            "Suck my dick, [name]",
            "Fuck you, [person]",
            "Vai tomar no cu, [nome]",
          ],
        },
        {
          id: "targeting-protected",
          name: "When Targeting Protected Characteristics",
          description: "Linguagem vulgar dirigida a indivíduos ou grupos baseados em características protegidas",
          action: "information",
          examples: [
            "Fuck all [protected group]",
            "Suck my dick, [ethnicity]",
            "Vai se foder, [grupo protegido]",
          ],
        },
        {
          id: "sexual-context",
          name: "Sexual Solicitation or Explicit Context",
          description: "Usado em contexto de solicitação sexual, ou quando sexualmente explícito ou sugestivo",
          action: "information",
          examples: [
            "DM me to suck my dick",
            "Chupa meu pau no privado",
            "Looking for someone to...",
          ],
        },
        {
          id: "commercial-music",
          name: "Commercial Music",
          description: "Linguagem vulgar em música comercial",
          action: "no_action",
          examples: [
            "Song lyrics with profanity",
            "Music video content",
            "Letras de músicas comerciais",
          ],
        },
        {
          id: "other-context",
          name: "Any Other Context",
          description: "Linguagem vulgar em qualquer outro contexto não especificado acima",
          action: "label",
          examples: [
            "What the fuck",
            "This is bullshit",
            "Motherfucker",
            "Puta que pariu",
            "Vai se foder (sem target)",
          ],
        },
      ],
    },
  ],

  // ============================================
  // LABEL HIERARCHY
  // ============================================
  labelHierarchy: [
    {
      id: "psl-targeting-individuals",
      label: "INFORMATION > PSL > Targeting Identifiable Individuals",
      path: ["INFORMATION", "PSL", "Targeting Individuals"],
      action: "information",
      severity: "high",
    },
    {
      id: "psl-targeting-protected",
      label: "INFORMATION > PSL > Targeting Protected Characteristics",
      path: ["INFORMATION", "PSL", "Targeting Protected"],
      action: "information",
      severity: "high",
    },
    {
      id: "psl-sexual-context",
      label: "INFORMATION > PSL > Sexual Solicitation/Explicit",
      path: ["INFORMATION", "PSL", "Sexual Context"],
      action: "information",
      severity: "high",
    },
    {
      id: "psl-other-context",
      label: "LABEL > PSL > Sexually Vulgar Language",
      path: ["LABEL", "PSL", "Sexually Vulgar"],
      action: "label",
      severity: "mid",
    },
  ],

  // ============================================
  // 2. POLICY-WIDE ALLOWED CONTENT (EXCEPTIONS)
  // ============================================
  exceptions: [
    {
      id: "condemnation",
      name: "Condemnation",
      description: "Condenar uso de linguagem vulgar",
      appliesTo: ["all"],
    },
    {
      id: "educational",
      name: "Educational or Awareness Raising",
      description: "Partilhar, discutir ou reportar informação para melhorar o entendimento de um assunto de interesse público. Não deve incitar violência, espalhar ódio ou desinformação. Inclui jornalismo cidadão.",
      appliesTo: ["all"],
    },
    {
      id: "news-reporting",
      name: "News Reporting",
      description: "Partilha de informação fiável e clara produzida por meios de comunicação, páginas locais ou jornalistas independentes, para aumentar consciência situacional. Inclui segmentos de notícias, entrevistas, fotojornalismo. Sujeito a standards editoriais, não glorifica ou incita hostilidade.",
      appliesTo: ["all"],
    },
    {
      id: "health",
      name: "Health Context",
      description: "Conteúdo partilhado para discutir, informar ou educar sobre questões de saúde (anatomia humana) ou doenças (anorexia, condições dermatológicas, cancro da mama, etc.)",
      appliesTo: ["all"],
    },
  ],

  // ============================================
  // VARIATION RULES (Known Questions A1, A2)
  // ============================================
  variationRules: {
    qualifies: [
      "Spelled incorrectly (e.g. fack, phuck, fuk)",
      "Partially obfuscated (e.g. f**k this, f*ck, sh*t)",
      "Audio where you can hear part of the phrase/word before bleeping",
      "Multi-word as single word (e.g. suckmydick = suck my dick)",
      "Single word split into phrase (e.g. mother fucker = motherfucker, cock sucker = cocksucker)",
    ],
    doesNotQualify: [
      "Names of person, group, location, event, brand, or media title (e.g. 'Dick' as name, 'Fuck' as brand)",
      "Fully censored - fully starred, bleeped, silenced, or blurred out",
      "Acronyms (even if standing for word) as long as acronym doesn't spell the word (e.g. WTF, FML, AF, STFU)",
      "Single letters (e.g. Lil B, S Motors)",
      "Depicted through emojis only (e.g. 🖕 without text)",
    ],
  },

  // ============================================
  // GLOSSARY
  // ============================================
  glossary: {
    sexuallyVulgar: "Frases ou palavras anatomicamente ou sexualmente derivadas (ex: suck my balls, eat my dick, blow my cock, dick, fuck, pussy, motherfucker, cocksucker). Referir às listas exaustivas por mercado.",
    awarenessRaising: "Partilhar, discutir ou reportar nova informação ou explicar informação existente para melhorar o entendimento de um assunto de interesse público. Não deve incitar violência, espalhar ódio ou desinformação. Inclui jornalismo cidadão e partilha de reportagens por utilizadores regulares.",
    healthContext: "Conteúdo partilhado para discutir, informar ou educar sobre questões de saúde (anatomia humana) ou doenças (anorexia, condições dermatológicas, cancro da mama ou outros tipos de cancro).",
    newsReporting: "Partilha de informação fiável e clara produzida por meios de comunicação, páginas locais, ou jornalistas independentes, com objetivo de aumentar consciência situacional sobre eventos locais, regionais e globais. Inclui segmentos de notícias, breaking news, entrevistas, fotojornalismo. Sujeito a standards editoriais da organização, não glorifica ou incita hostilidade, discriminação ou violência.",
  },

  // ============================================
  // OPERATIONAL GUIDELINES
  // ============================================
  operationalGuidelines: {
    marketsWithoutList: "Para mercados sem lista designada, a policy deve ser aplicada consistentemente. Usar a lista English como referência com traduções apropriadas para o mercado alvo.",
    marketsWithList: "Mercados com lista designada devem referir EXCLUSIVAMENTE à sua lista específica, que é EXAUSTIVA.",
    nonSexuallyVulgar: "Palavras que podem ser consideradas profanas mas NÃO são sexualmente vulgares NÃO são cobertas por esta policy. Referir às policies de Bullying & Harassment e Hateful Conduct para enforcement quando estes termos são targeting.",
  },

  keywordsLoaded: true,
};

// ============================================
// MARKETIZED LISTS - Sexually Vulgar Terms
// EXAUSTIVE por mercado - usar EXCLUSIVAMENTE
// ============================================

export const PSL_MARKETIZED_LISTS = {
  // ============================================
  // B1. US ENGLISH
  // ============================================
  "en-US": [
    // Suck variations
    "suck my dick",
    "suck my balls",
    "suck my tits",
    "eat my dick",
    "blow my cock",
    "kiss my ass",
    // Dick variations
    "dick",
    "dickhead",
    "dickwad",
    // Fuck variations
    "fuck",
    "fucker",
    "fuckhead",
    "motherfucker",
    // Other terms
    "pussy",
    "cock",
    "cocksucker",
    "bollocks",
    "whore",
    "ho",
    "hoe",
    "screw",
    "weiner",
    "twat",
    "jerkoff",
  ],

  // ============================================
  // B2. SPANISH ESLA (LATAM)
  // ============================================
  "es-LATAM": [
    // Chupa variations
    "chúpame el pene",
    "chúpame las bolas",
    "chúpame las tetas",
    "chúpame el pito",
    "chúpame la pija",
    "mamar la verga",
    "chúpame la verga",
    "chúpame las güevas",
    "me pela la verga",
    "mamar el pito",
    // Cómete/Bésame
    "cómete mi pene",
    "bésame el culo",
    // Genitalia masculina
    "pene",
    "pito",
    "verga",
    "chota",
    "poronga",
    "mondá",
    "pinga",
    "chupa pijas",
    "care mondá",
    "care verga",
    // Fuck variations
    "puta",
    "puto",
    "hijo de puta",
    // Genitalia feminina
    "vágina",
    "chocha",
    "chocho",
    "chichi",
    // Testículos
    "testículos",
    "bolas",
    "pelotas",
    "güevas",
    // Whore variations
    "putita",
    "vagabunda",
    "cualquiera",
    "zorra",
    "perra",
    "golfa",
    "ramera",
    // Sex verbs
    "follar",
    "culear",
    "culiar",
    "pichar",
    // Other
    "cariñosa",
    "mujer de la vida alegre",
    "detonar",
  ],

  // ============================================
  // B3. VIETNAMESE
  // ============================================
  "vi-VN": [
    // Suck variations (bú/liếm/mút + genitalia + tao đi)
    "bú cặc",
    "bú buồi",
    "bú cu",
    "bú dái",
    "bú chim",
    "bú lồn",
    "bú đít",
    "liếm cặc",
    "liếm buồi",
    "liếm cu",
    "liếm lồn",
    "mút cặc",
    "mút buồi",
    "mút cu",
    "bú cặc tao",
    "liếm cặc tao",
    // Expletives
    "vãi lồn",
    "vãi cặc",
    // Commands
    "ăn cặc tao đi",
    "thổi kèn cho tao đi",
    "hôn đít tao đi",
    // Male genitalia
    "cặc",
    "buồi",
    "cu",
    "đầu buồi",
    "chim",
    // Fuck variations
    "địt",
    "đụ",
    "chịch",
    "nện",
    "địt mẹ mày",
    "địt cụ mày",
    "địt bố mày",
    "địt con mẹ mày",
    "đụ má mày",
    "đụ mẹ mày",
    // Female genitalia
    "lồn",
    "bím",
    // Balls
    "dái",
    "hòn dái",
    // Whore/prostitute
    "đĩ",
    "cave",
    "điếm",
    "phò",
    "con 4",
  ],

  // ============================================
  // B4. CHINESE MANDARIN
  // ============================================
  "zh-CN": [
    // Suck terms
    "吸",
    "吮",
    "吹",
    "口",
    "含",
    // Oral sex variations
    "吸屌",
    "咂陽",
    "吮陽",
    "吸蛋",
    "口交",
    "口淫",
    "口活",
    "口愛",
    "口爆",
    "吃屌",
    "吃雞",
    "含蕭",
    "品簫",
    "吃雕",
    "吹簫",
    "吹喇叭",
    // Semen terms
    "甲洨",
    "呷洨",
    "食洨",
    "吃洨",
    "洨",
    // Insults with genitalia
    "操雞掰",
    "臭機掰",
    "臭屌",
    // Male genitalia
    "陰莖",
    "屌",
    "蕭",
    "喇叭",
    "GG",
    "雞雞",
    "肉棒",
    "大雕",
    // Fuck variations
    "幹",
    "操",
    "幹羚羊",
    "幹林老師",
    "幹你娘",
    "肏你媽",
    "幹他媽的",
    "幹你老母",
    "操你娘",
    "操他媽的",
    "操你老母",
    "幹你娘雞掰",
    "幹你媽的逼",
    // Extended family fucker
    "幹你祖罵",
    "幹你開基祖",
    // Female genitalia / insults
    "穴",
    "屄",
    "逼",
    "雞掰",
    "GY",
    // Gendered insults
    "娘們",
    "娘娘腔",
    "娘炮",
    "孬種",
    // Whore/slut
    "婊",
    "婊子",
    "蕩婦",
    "淫婦",
    "姣婆",
    "賤貨",
  ],

  // ============================================
  // B5. FILIPINO
  // ============================================
  "fil-PH": [
    // Oral sex
    "chupa",
    "tsupa",
    "chupain",
    "tsupain",
    "chupain mo ang utong ko",
    "chupain mo ang dede ko",
    "halikan mo puwet ko",
    "halikan mo pwet ko",
    // Male genitalia
    "tite",
    "titi",
    "etits",
    "burat",
    // Motherfucker variations
    "puta",
    "deputa",
    "putangina mo",
    "putragis",
    "pukingina mo",
    "punyeta",
    // Female genitalia
    "kiki",
    "pekpek",
    "putay",
    "puki",
    "puke",
    "kiffy",
    "bilat",
    // Oral sex performers
    "chupador",
    "tsupador",
    "palatsupa",
    // Balls
    "betlog",
    "bayag",
    // Insults
    "kabalbalan",
    "pokpok",
    // Sex terms
    "hindot",
    "pakangkang",
    "pakarat",
    "burikat",
    "tirahin",
    "putukan",
    "kantot",
    "kantutin",
    // Penis size insults
    "supot",
    "jutay",
    "gamay pikoy",
    "gamay utin",
    // Masturbation
    "salsalero",
    "jakulero",
    // Other
    "kulo kadidang",
  ],

  // ============================================
  // B6. PORTUGUESE BRAZILIAN
  // ============================================
  "pt-BR": [
    // Chupa variations
    "chupa meu pau",
    "chupa minhas bolas",
    "chupa meus peitos",
    "chupa o meu caralho",
    "chupa o meu pinto",
    "chupa a minha rola",
    "mama meus peitos",
    // Come/Beija
    "come meu pau",
    "beija minha bunda",
    "beija o meu cu",
    // Male genitalia
    "pau",
    "pinto",
    "caralho",
    "rola",
    "cacete",
    // Fuck variations
    "fuder",
    "foda",
    "filho da puta",
    // Female genitalia
    "buceta",
    "pepeca",
    "ppk",
    "vagina",
    // Cocksucker
    "chupador de rola",
    // Balls
    "testículos",
    "bola",
    "bolas",
    // Whore variations
    "puta",
    "putinha",
    "prostituta",
    "vagabunda",
    // Sex verb
    "foder",
  ],

  // ============================================
  // B7. INDIA - HINDI / HINGLISH
  // ============================================
  "hi-IN": [
    // Suck my dick variations (Romanized)
    "mera lauda chus",
    "mera chus",
    "mera lund kha",
    "mera lauda kha",
    "mera chuso",
    "mera lund chuso",
    "mera choos le",
    "munh mein le mera",
    "choosna padega mera",
    "le munh mein",
    "choos ke dikha",
    // Suck my dick (Devanagari)
    "मेरा लौड़ा चूस",
    "लंड चूसो",
    "मेरा लंड खा",
    "मेरा लौड़ा खा",
    "मेरा चूसो",
    "मेरा लंड चूसो",
    "मेरा चूस ले",
    "मुंह में ले मेरा",
    "चूसना पड़ेगा मेरा",
    "ले मुंह में",
    "चूस के दिखा",
    // Kiss my ass variations (Romanized)
    "meri gaand chumo",
    "mera chutad choos",
    "gaand chaato meri",
    "meri gaand mein munh daalo",
    "chaatna padega gaand",
    "choom ke dikha gaand",
    // Kiss my ass (Devanagari)
    "मेरी गांड चूमो",
    "मेरा चूतड़ चूस",
    "गांड चाटो मेरी",
    "मेरी गांड में मुंह डालो",
    "चाटना पड़ेगा गांड",
    "चूम के दिखा गांड",
    // Male genitalia (Romanized)
    "laude",
    "laudey",
    "laura",
    "lora",
    "lauda",
    "ling",
    "loda",
    "lode",
    "lund",
    "lulli",
    "nunni",
    "nunnu",
    "lodu",
    // Male genitalia (Devanagari)
    "लोड़े",
    "लौड़े",
    "लौड़ा",
    "लोड़ा",
    "लौडा",
    "लिंग",
    "लोडा",
    "लोडे",
    "लंड",
    "लोडू",
    // Fuck variations (Romanized)
    "bahenchod",
    "behenchod",
    "bhenchod",
    "bhenchodd",
    "b.c.",
    "bc",
    "bhosadchod",
    "bhosadchodal",
    "chhod",
    "chod",
    "chodd",
    "chudne",
    "chudney",
    "chudwa",
    "chudwaa",
    "chudwane",
    "chudwaane",
    "madarchod",
    "madarchodd",
    "madarchood",
    "m.c.",
    "mc",
    // Fuck variations (Devanagari)
    "बहनचोद",
    "बेहेनचोद",
    "भेनचोद",
    "भोसरचोदल",
    "भोसदचोद",
    "भोसड़ाचोदल",
    "भोसड़ाचोद",
    "चोद",
    "चुदने",
    "चुदवा",
    "चुदवाने",
    "मादरचोद",
    // Female genitalia (Romanized)
    "bhosada",
    "bhosda",
    "bhosdaa",
    "choot",
    "chut",
    "chute",
    "chutia",
    "chutiya",
    "chutiye",
    "bur",
    "burr",
    "buurr",
    "buur",
    // Female genitalia (Devanagari)
    "भोसड़ा",
    "चूत",
    "चूतिया",
    "चूतिये",
    "बुर",
    // Cocksucker (Romanized)
    "lund choosne wali",
    "lauda chuso",
    "choosne wala",
    "munh mein le",
    // Cocksucker (Devanagari)
    "लंड चूसने वाली",
    "लौड़ा चूसो",
    "चूसने वाला",
    "मुंह में ले",
    // Balls (Romanized)
    "aad",
    "aand",
    "gote",
    "gotey",
    "gotte",
    // Balls (Devanagari)
    "आंड़",
    "आंड",
    "आँड",
    "गोटे",
    // Whore/Randi (Romanized)
    "bhosdike",
    "bhonsdike",
    "bhosdiki",
    "bhosdiwala",
    "bhosdiwale",
    "bsdk",
    "b.s.d.k",
    "randi",
    "raand",
    "rand",
    "randy",
    // Whore/Randi (Devanagari)
    "भोसड़ीके",
    "भोसड़ीकी",
    "भोसड़ीवाला",
    "भोसड़ीवाले",
    "रांड",
    "रंडी",
    // Sex verbs (Romanized)
    "chodna",
    "pelna",
    "maarna",
    "karna",
    "uski chod de",
    "chodne wali hai",
    "pel diya",
    "ladki ko chod",
    "uski pel de",
    "karne layak hai",
    "ghusana",
    // Sex verbs (Devanagari)
    "चोदना",
    "पेलना",
    "मारना",
    "करना",
    "उसको चोद दे",
    "चोदने वाली है",
    "पेल दिया",
    "लड़की को चोद",
    "उसकी पेल दे",
    "करने लायक है",
    // Other
    "gapagap",
    "ghapaghap",
  ],

  // ============================================
  // B8. INDONESIAN
  // ============================================
  "id-ID": [
    // Oral sex
    "isep kontol",
    "makan kontol",
    "cium pantat",
    // Male genitalia
    "kontol",
    "titit",
    // Fuck
    "ngentot",
    // Female genitalia
    "memek",
    // Balls
    "biji",
    // Whore
    "lonte",
    // Sex terms
    "tobrut",
    // Breasts
    "toket",
    "toge",
    "toge pasar",
  ],

  // ============================================
  // B9. ARABIC
  // ============================================
  "ar": [
    // Suck my dick variations
    "مص عيري",
    "مص ايري",
    "اكل زبي",
    "مص زبي",
    "اكل عيري",
    "تاكل عيري",
    "تبوس طيزي",
    "بلاع العير",
    "تلحس طيزي",
    // Male genitalia
    "عير",
    "اير",
    "زب",
    // Sex
    "نيك",
    "نيج",
    "سكس",
    // Fucker/Fuckhead
    "ينيج",
    "منيوج",
    "منيوك",
    // Female genitalia
    "كس",
    // Balls
    "خصاوي",
    // Whore variations
    "كحبة",
    "كحبه",
    "قحبة",
    "قحبه",
    "بربوك",
    "شرموطة",
    "عاهرة",
    "قحبونة",
    // I'll fuck you
    "انيكك",
    "انيجك",
    // Dick insults (toward male)
    "عيري بيك",
    "ايري بيك",
    "عيري فيك",
    "ايري فيك",
    "زبي بيك",
    // Dick insults (toward female)
    "عيري بيج",
    "ايري فيكي",
    "زبي بيج",
    "زبي فيكي",
    // Motherfucker
    "ابن المنيوكة",
    "ابن المنيوجة",
    "منيكة",
    "منيجة",
    "استنياج",
    // Your mother's pussy
    "كس امك",
    "كسمك",
  ],
};

// ============================================
// PSL POLICY CONTENT (Full text for AI context)
// ============================================

export const PSL_POLICY_CONTENT = `
# PROFANE AND SEXUALIZED LANGUAGE (PSL) POLICY

## POLICY RATIONALE
Profanities are often viewed as culturally impolite, crude, or offensive. Even when used in common or non-sexual contexts, such as swearing, sexually derived or sexualized profanities can still be inappropriate, especially for minors. While adults may use profanities as a form of self-expression, we aim to protect teenagers from exposure to such language. However, we do allow some profanity in limited cases to account for artistic contexts and other benign usage.

---

## IMPLEMENTATION STANDARDS

### 1. Sexually Vulgar Language

**Definition:** Phrases or words that are anatomically or sexually derived (for example, suck my balls, eat my dick, blow my cock, dick, fuck, pussy, motherfucker, cocksucker etc). Refer to the exhaustive marketized lists.

#### 1.a When Targeting Identifiable Individuals
**Action:** INFORMATION

#### 1.b When Targeting Protected Characteristics
**Action:** INFORMATION
When targeting individuals or groups based on protected characteristics.

#### 1.c When Used in Sexual Solicitation or Explicit Context
**Action:** INFORMATION
When used in the context of sexual solicitation, or when sexually explicit or suggestive.

#### 1.d Commercial Music
**Action:** NO ACTION

#### 1.e Any Other Context
**Action:** LABEL

---

## POLICY-WIDE ALLOWED CONTENT (EXCEPTIONS)

### Condemnation
**Action:** NO ACTION

### Educational or Awareness Raising
**Action:** NO ACTION
Sharing, discussing or reporting new information or further explaining existing information for the purpose of improving the understanding of an issue or knowledge of a subject that has public interest value. 'Awareness Raising' context can be present in captions, posts, videos or images and should not aim to incite violence, or spread hate or misinformation. This includes, but is not limited to, citizen journalism and sharing of news reports by regular users.

### News Reporting
**Action:** NO ACTION
The sharing of reliable and clear information produced by news outlets, local news pages or groups, or independent journalists, with an aim to increase situational awareness and/or understanding about local, regional, and global events. This includes, but is not limited to, news segments (including audio or video), breaking news, interviews, photojournalism or any other forms of reporting or journalistic coverage. 'News Reporting' content typically involves coverage by a news outlet, subject to the organization's editorial standards, to frame the content as news material, and it does not glorify or incite hostility, discrimination or violence.

### Health Context
**Action:** NO ACTION
Content shared to discuss, inform, or educate people about health related issues (such as human anatomy) or disease (such as anorexia, dermatological conditions, breast cancer or other types of cancer).

---

## KNOWN QUESTIONS

### A1. How should variations of sexually vulgar words or phrases be treated?

**The following variations QUALIFY as use of sexually vulgar words or phrases:**
- Spelled incorrectly (e.g. fack, phuck)
- Partially obfuscated (e.g. "f**k this", audio where you can hear part of the phrase or word before bleeping)

**The following variations DO NOT QUALIFY:**
- Name/s of a person, group, location, event, brand, or media title that spell the same (e.g. 'dick', 'fuck')
- Fully censored, i.e., fully starred, bleeped, silenced, or blurred out
- Acronyms, even if they could stand for a word, as long as the acronym itself does not spell the word (e.g., "WTF", "FML", "AF")
- Single letters, such as "Lil B", "S Motors"
- Depicted through emojis (e.g. "🖕")

### A2. How should terms that overlap between sexually vulgar words or phrases be treated?

- When multi-word phrases are mentioned as a single word but contain two or more distinct words, treat them as sexually vulgar phrases (e.g. 'suckmydick' → 'suck my dick')
- When sexually vulgar words are mentioned as a phrase or split into two words, treat them as sexually vulgar words (e.g. 'mother fucker' → 'motherfucker', 'cock sucker' → 'cocksucker')

### A3. How are non-sexually vulgar phrases or words treated?

Words that may be considered profane but are NOT sexually vulgar are NOT covered under this policy. Refer to the relevant Bullying & Harassment and Hateful Conduct policies for enforcement when these terms are targeted.

### A4. How are sexually vulgar words or phrases designated?

The words and phrases are designated in marketized lists through a process that assesses qualitative information about a word's use in a given market/language as well as quantitative data of on-platform usage.

---

## OPERATIONAL GUIDELINES

### Markets Without Designated List
For markets without a designated list of sexually vulgar phrases/words, the policy must still be enforced consistently. Leverage the existing English list as a reference and use appropriate translations for the target market.

### Markets With Designated List
Markets that have an existing designated list should refer EXCLUSIVELY to their market-specific list, which is EXHAUSTIVE.

---

## MARKETIZED LISTS SUMMARY

### Available Markets:
- B1. US English
- B2. Spanish ESLA (Latin America)
- B3. Vietnamese
- B4. Chinese Mandarin
- B5. Filipino
- B6. Portuguese Brazilian
- B7. India Hindi/Hinglish
- B8. Indonesian
- B9. Arabic

### Key Categories in Each List:
1. Oral sex commands ("suck my...", "eat my...", "blow my...")
2. Male genitalia terms
3. Female genitalia terms
4. Fuck variations (including motherfucker equivalents)
5. Whore/prostitute terms
6. Balls/testicles terms
7. Sex verbs

---

## CROSS-REFERENCE WITH OTHER POLICIES

- **B&H (Bullying & Harassment):** Non-sexually vulgar profanity when targeting
- **HC (Hateful Conduct):** Sexually vulgar language targeting protected characteristics may also violate HC
- **SSPx (Sexual Solicitation):** Sexual context usage overlaps with SSPx

---

## DECISION TREE

1. Is the term in the marketized list for this language/market?
   - NO → Check English list for equivalent, or NOT covered by PSL
   - YES → Continue

2. Is it fully censored (starred, bleeped, silenced, blurred)?
   - YES → NO ACTION
   - NO → Continue

3. Is it an acronym (WTF, FML, AF)?
   - YES → NO ACTION
   - NO → Continue

4. Is it a name/brand/location that happens to spell the word?
   - YES → NO ACTION
   - NO → Continue

5. Is there an exception context (condemnation, educational, news, health)?
   - YES → NO ACTION
   - NO → Continue

6. Is it targeting an identifiable individual?
   - YES → INFORMATION (1.a)
   - NO → Continue

7. Is it targeting protected characteristics?
   - YES → INFORMATION (1.b)
   - NO → Continue

8. Is it in sexual solicitation or explicit context?
   - YES → INFORMATION (1.c)
   - NO → Continue

9. Is it in commercial music?
   - YES → NO ACTION (1.d)
   - NO → LABEL (1.e - Any Other Context)
`;

export default PSL_POLICY;