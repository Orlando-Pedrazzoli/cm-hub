// ============================================
// CHPC - Coordinating Harm and Promoting Crime
// Policy de Coordenação de Danos e Promoção de Crime
// ============================================

import { PolicyDefinition } from "@/lib/types";

export const CHPC_POLICY: PolicyDefinition = {
  id: "chpc",
  name: "Coordinating Harm and Promoting Crime",
  shortName: "CHPC",
  description:
    "Proíbe a facilitação, organização, promoção ou admissão de atividades criminosas ou prejudiciais contra pessoas, empresas, propriedade ou animais. Permite debate sobre legalidade e consciencialização.",
  color: "#bf360c",
  icon: "⚠️",
  ready: true,

  categories: [
    // ============================================
    // HARM AGAINST ANIMALS
    // ============================================
    {
      id: "harm-animals",
      name: "Harm Against Animals",
      description: "Coordenação, ameaça, apoio ou admissão de danos físicos contra animais",
      severity: "high",
      subcategories: [
        {
          id: "physical-harm-animals",
          name: "Physical Harm Against Animals",
          description: "Danos físicos intencionais a animais",
          examples: [
            "Kicking, beating, stabbing animals",
            "Crushing, bestiality, rough handling",
            "Neglect leading to endangerment",
            "Killing or death of animals",
          ],
        },
        {
          id: "staged-animal-fights",
          name: "Staged Animal Fights",
          description: "Lutas organizadas entre animais para entretenimento",
          examples: [
            "Cockfighting / Rinhas de galo",
            "Dogfighting / Rinhas de cães",
            "Breeding animals for fighting",
            "Trading animals for fights",
            "Betting on animal fights",
          ],
        },
        {
          id: "fake-animal-rescues",
          name: "Fake Animal Rescues",
          description: "Colocar animais em perigo para depois 'resgatá-los'",
          examples: [
            "Staging animal in danger",
            "Multiple camera angles of 'rescue'",
            "No professional animal handling",
          ],
        },
      ],
    },
    // ============================================
    // HARM AGAINST PROPERTY
    // ============================================
    {
      id: "harm-property",
      name: "Harm Against Property",
      description: "Coordenação, ameaça, apoio ou admissão de vandalismo ou roubo",
      severity: "mid",
      subcategories: [
        {
          id: "vandalism",
          name: "Vandalism",
          description: "Dano deliberado a propriedade pública ou privada",
          examples: [
            "Burning statues",
            "Spraying walls",
            "Keying cars",
            "Egging houses",
            "Breaking windows",
          ],
        },
        {
          id: "theft",
          name: "Theft",
          description: "Roubo de propriedade alheia sem consentimento",
          examples: [
            "Stealing / Roubar",
            "Shoplifting / Furto em lojas",
            "Looting / Saque",
            "Robbing / Assalto",
          ],
        },
      ],
    },
    // ============================================
    // HARM AGAINST PEOPLE
    // ============================================
    {
      id: "harm-people",
      name: "Harm Against People",
      description: "Outing, swatting, viral challenges, doenças transmissíveis",
      severity: "high",
      subcategories: [
        {
          id: "outing",
          name: "Outing",
          description: "Expor identidade de pessoas em grupos de risco",
          examples: [
            "Outing LGBTQIA+ in risk countries",
            "Exposing drug dealers/addicts (Philippines)",
            "Exposing interfaith couples (India)",
            "Exposing undercover law enforcement",
          ],
        },
        {
          id: "swatting",
          name: "Swatting",
          description: "Chamadas falsas para enviar polícia armada a um endereço",
          examples: [
            "Hoax emergency calls",
            "False reports to dispatch police",
            "Gaming community swatting",
          ],
        },
        {
          id: "high-risk-viral-challenges",
          name: "High-Risk Viral Challenges",
          description: "Desafios virais que podem causar lesões graves ou morte",
          examples: [
            "Fire challenge (pouring flammable fluids)",
            "Pointing firearms at self/others",
            "Blocking airway challenges",
            "Severe burns or wounds challenges",
          ],
        },
        {
          id: "mid-risk-stunts",
          name: "Mid-Risk Stunts/Challenges",
          description: "Acrobacias ou desafios com risco de lesão física",
          examples: [
            "Driving with body outside vehicle",
            "Jumping at heights > 3 meters",
            "Handling lit flammable substances",
            "Throwing sharp objects",
          ],
        },
        {
          id: "communicable-diseases",
          name: "Communicable Diseases",
          description: "Propagação ativa e deliberada de doenças transmissíveis",
          examples: [
            "COVID-19 intentional spread",
            "HIV/AIDS intentional spread",
            "Ebola intentional spread",
            "Tuberculosis intentional spread",
          ],
        },
      ],
    },
    // ============================================
    // VOTING AND CENSUS INTERFERENCE
    // ============================================
    {
      id: "voting-census",
      name: "Voting and Census Interference",
      description: "Interferência em processos eleitorais e de censo",
      severity: "high",
      subcategories: [
        {
          id: "voter-misrepresentation",
          name: "Voter Misrepresentation",
          description: "Desinformação sobre processos de votação",
          examples: [
            "False voting dates/locations/times",
            "False voting qualifications",
            "Claims votes won't be counted",
            "False voting requirements",
          ],
        },
        {
          id: "voter-fraud",
          name: "Voter Fraud",
          description: "Tentativas de fraude eleitoral",
          examples: [
            "Buying/selling votes",
            "Instructions for illegal voting",
            "Voting twice",
            "Fabricating voting eligibility",
          ],
        },
        {
          id: "census-interference",
          name: "Census Interference",
          description: "Interferência em processos de censo",
          examples: [
            "False census dates/methods",
            "Instructions for census fraud",
            "Misrepresenting household members",
          ],
        },
      ],
    },
  ],

  // ============================================
  // LABEL HIERARCHY
  // ============================================
  labelHierarchy: [
    // Harm Against Animals
    {
      id: "chpc-harm-animals",
      label: "LABEL > CHPC > Harm against Animals",
      path: ["LABEL", "CHPC", "Harm against Animals"],
      action: "label",
      severity: "high",
      conditions: ["Physical harm", "Staged fights", "Fake rescues"],
    },
    // Harm Against Property
    {
      id: "chpc-harm-property",
      label: "LABEL > CHPC > Harm against Property",
      path: ["LABEL", "CHPC", "Harm against Property"],
      action: "label",
      severity: "mid",
      conditions: ["Vandalism", "Theft"],
    },
    // Harm Against People - Outing
    {
      id: "chpc-outing",
      label: "LABEL > CHPC > Outing",
      path: ["LABEL", "CHPC", "Outing"],
      action: "label",
      severity: "high",
      conditions: ["Exposing identity of risk group members"],
    },
    // Harm Against People - Other
    {
      id: "chpc-other-harm-people",
      label: "LABEL > CHPC > Other Harm against people",
      path: ["LABEL", "CHPC", "Other Harm against people"],
      action: "label",
      severity: "high",
      conditions: ["Swatting", "Communicable diseases"],
    },
    // High-Risk Viral Challenges
    {
      id: "chpc-high-risk-challenges",
      label: "LABEL > CHPC > Risky Behaviour > High-risk Viral challenges",
      path: ["LABEL", "CHPC", "Risky Behaviour", "High-risk Viral challenges"],
      action: "label",
      severity: "high",
      conditions: ["Designated high-risk challenge"],
    },
    // Mid-Risk Stunts
    {
      id: "chpc-mid-risk-stunts",
      label: "LABEL > CHPC > Risky Behaviour > Mid-risk stunts/challenges",
      path: ["LABEL", "CHPC", "Risky Behaviour", "Mid-risk stunts/challenges"],
      action: "label",
      severity: "mid",
      conditions: ["Designated mid-risk stunt"],
    },
    // Voter Interference
    {
      id: "chpc-voter-interference",
      label: "LABEL > CHPC > Voter Interference",
      path: ["LABEL", "CHPC", "Voter Interference"],
      action: "label",
      severity: "high",
      conditions: ["Voter fraud", "Voting misrepresentation"],
    },
    // Census Interference
    {
      id: "chpc-census-interference",
      label: "LABEL > CHPC > Census Interference",
      path: ["LABEL", "CHPC", "Census Interference"],
      action: "label",
      severity: "mid",
      conditions: ["Census fraud", "Census misrepresentation"],
    },
  ],

  // ============================================
  // EXCEPTIONS
  // ============================================
  exceptions: [
    {
      id: "awareness-raising",
      name: "Awareness Raising",
      description: "Consciencialização ou condenação do ato",
      appliesTo: ["all"],
    },
    {
      id: "educational",
      name: "Educational/Academic",
      description: "Propósitos educacionais ou debate sobre legalidade",
      appliesTo: ["all"],
    },
    {
      id: "redemption",
      name: "Redemption",
      description: "Arrependimento ou reconhecimento do erro",
      appliesTo: ["all"],
    },
    {
      id: "fictional-staged",
      name: "Fictional/Staged",
      description: "Contextos ficcionais ou encenados (exceto animal fights)",
      appliesTo: ["harm-animals", "harm-property", "swatting"],
    },
    {
      id: "self-defense",
      name: "Self-Defense",
      description: "Defesa própria ou de outro humano/animal",
      appliesTo: ["harm-animals"],
    },
    {
      id: "hunting-fishing",
      name: "Hunting/Fishing/Food",
      description: "Caça, pesca ou preparação de alimentos",
      appliesTo: ["harm-animals"],
    },
    {
      id: "religious-sacrifice",
      name: "Religious Sacrifice",
      description: "Sacrifício religioso",
      appliesTo: ["harm-animals"],
    },
    {
      id: "pests-vermin",
      name: "Pests/Vermin",
      description: "Pragas ou vermes prejudiciais",
      appliesTo: ["harm-animals"],
    },
    {
      id: "mercy-killing",
      name: "Mercy Killing",
      description: "Eutanásia para minimizar sofrimento",
      appliesTo: ["harm-animals"],
    },
    {
      id: "bullfighting",
      name: "Bullfighting",
      description: "Touradas (não consideradas staged animal fights)",
      appliesTo: ["staged-animal-fights"],
    },
    {
      id: "protest-vandalism",
      name: "Protest Context",
      description: "Vandalismo em contexto de protesto",
      appliesTo: ["vandalism"],
    },
    {
      id: "graffiti",
      name: "Graffiti",
      description: "Graffiti artístico",
      appliesTo: ["vandalism"],
    },
    {
      id: "cctv-news",
      name: "CCTV/News Coverage",
      description: "Imagens de CCTV ou cobertura jornalística",
      appliesTo: ["all"],
    },
    {
      id: "condemning-humor-satire",
      name: "Condemning/Humor/Satire",
      description: "Condenação, humor ou sátira (voter/census)",
      appliesTo: ["voting-census"],
    },
    {
      id: "professional-setting",
      name: "Professional Setting",
      description: "Contexto profissional (stunts)",
      appliesTo: ["mid-risk-stunts"],
    },
  ],

  // ============================================
  // OUTING RISK GROUPS BY COUNTRY
  // ============================================
  outingRiskGroups: [
    {
      group: "Drug dealers/addicts",
      countries: ["PH"], // Philippines
      terms: ["pusher", "drug pusher", "user", "drug user", "adik", "drug adik", "drug lord", "narco"],
    },
    {
      group: "CPP/NPA/NDFP/CTG supporters",
      countries: ["PH"], // Philippines
      terms: ["CPP", "NPA", "NDFP", "CTG", "CTFG", "communist"],
    },
    {
      group: "Militant/Political group affiliation",
      countries: ["EG", "LY", "YE", "IQ", "SY", "SD", "SS", "LB"],
      terms: [],
    },
    {
      group: "Religious conversion/apostasy/atheism/blasphemy",
      countries: [
        "ID", "IL", "PK", "BD", "MV", "NG", "SO", "SA", "PS", "EG", "BH", "IQ", "IR", "JO", "KW",
        "LB", "OM", "SD", "SY", "AE", "YE", "DZ", "LY", "MR", "MA", "TN", "EH",
      ],
      terms: ["apóstata", "ateu", "blasfêmia", "convertido", "apostasy", "atheist", "blasphemy"],
    },
    {
      group: "LGBTQIA+",
      countries: [
        // MENA
        "BH", "EG", "IQ", "JO", "KW", "LB", "OM", "PS", "QA", "SA", "SD", "SY", "AE", "YE",
        "DZ", "LY", "MR", "MA", "TN", "EH", "IR",
        // Franco-SSA
        "MG", "CI", "CD", "SN", "CM", "ML", "GA", "BF", "GN", "TG", "CG", "NE", "DJ", "BI",
        "TD", "CF", "MU", "GQ", "KM", "SC",
        // Anglophone Africa
        "NG", "GH", "GM", "LR", "RW", "ET", "SO", "ZM", "MW", "NA", "ER", "KE", "TZ", "UG", "SS", "LS",
        // South Asia
        "BD", "PK",
      ],
      terms: ["gay", "lésbica", "trans", "LGBT", "LGBTQ", "homosexual", "queer", "bissexual"],
    },
    {
      group: "Vaccine/Health workers",
      countries: ["PK"],
      terms: ["vaccine worker", "polio worker", "health worker"],
    },
    {
      group: "Ahmadi/Ahmadiya/Qadiyani",
      countries: ["PK"],
      terms: ["Ahmadi", "Ahmadiya", "Qadiyani"],
    },
    {
      group: "Lideres Sociales",
      countries: ["VE", "GT", "HN", "SV", "NI", "CO", "EC", "PE", "BO"],
      terms: ["líder social", "lider social", "ativista social"],
    },
    {
      group: "PDF/CRPH/NUG supporters",
      countries: ["MM"], // Myanmar
      terms: ["PDF", "CRPH", "NUG", "ERO", "dalan"],
    },
    {
      group: "Mukhbir (informants)",
      countries: ["IN"],
      terms: ["mukhbir", "informante"],
    },
    {
      group: "Interfaith couples",
      countries: ["IN"],
      terms: ["interfaith", "casamento misto", "mixed marriage"],
    },
    {
      group: "Sex workers",
      countries: [
        "BH", "EG", "IQ", "JO", "KW", "LB", "OM", "PS", "QA", "SA", "SD", "SY", "AE", "YE",
        "DZ", "LY", "MR", "MA", "TN", "EH", "PK", "IR",
      ],
      terms: ["prostituta", "sex worker", "escort", "garota de programa"],
    },
    {
      group: "Undocumented immigrants",
      countries: ["MX", "GT", "HN", "SV", "NI", "CO", "EC", "PE", "BO", "AR", "CL", "UY", "PY"],
      terms: ["imigrante ilegal", "undocumented", "illegal immigrant", "sin papeles", "indocumentado"],
    },
    {
      group: "Spies/Traitors/Informants",
      countries: ["ET"],
      terms: ["spy", "traitor", "informant", "espião", "traidor"],
    },
    {
      group: "Rwandaphones/Tutsis",
      countries: ["CD"], // DRC
      terms: ["Rwandaphone", "Rwandan", "Banyamulenge", "Tutsi"],
    },
    {
      group: "Baha'i",
      countries: ["IR"],
      terms: ["Baha'i", "Bahai"],
    },
  ],

  // ============================================
  // HIGH-RISK VIRAL CHALLENGES
  // ============================================
  highRiskChallenges: [
    "Fire challenge - pouring flammable fluids on self/others",
    "Pointing firearms at self/others",
    "Throwing flammable substances at others",
    "Throwing sharp objects at others",
    "Blocking airway challenges",
    "Challenges causing severe burns or wounds",
    "Tide Pod challenge",
    "Blackout challenge",
    "Skull breaker challenge",
  ],

  // ============================================
  // MID-RISK STUNTS (EXHAUSTIVE LIST)
  // ============================================
  midRiskStunts: [
    "Driving with half body outside vehicle",
    "Standing while driving",
    "Jumping at height > 3 meters (10 feet)",
    "Skating at height > 3 meters",
    "Rollerblading at height > 3 meters",
    "Cycling at height > 3 meters",
    "Handling lit flammable substances",
    "Throwing lit flammable substances",
    "Handling explosives",
    "Throwing sharp objects",
  ],

  // ============================================
  // COMMUNICABLE DISEASES LIST
  // ============================================
  communicableDiseases: [
    "COVID-19",
    "Coronavirus",
    "HIV/AIDS",
    "Ebola",
    "Tuberculosis",
  ],

  keywordsLoaded: true,
};

// ============================================
// CHPC KEYWORDS - Portuguese + English
// ============================================

export const CHPC_KEYWORDS = {
  // ============================================
  // HARM AGAINST ANIMALS
  // ============================================
  animalHarm: {
    actions: [
      // Portuguese
      { term: "maus tratos a animais", severity: "high", category: "Animal Harm" },
      { term: "maltratar animal", severity: "high", category: "Animal Harm" },
      { term: "abusar de animal", severity: "high", category: "Animal Harm" },
      { term: "torturar animal", severity: "high", category: "Animal Harm" },
      { term: "espancar animal", severity: "high", category: "Animal Harm" },
      { term: "matar animal", severity: "high", category: "Animal Harm" },
      { term: "abandonar animal", severity: "mid", category: "Animal Harm" },
      { term: "deixar animal morrer", severity: "high", category: "Animal Harm" },
      // English
      { term: "animal abuse", severity: "high", category: "Animal Harm" },
      { term: "animal cruelty", severity: "high", category: "Animal Harm" },
      { term: "torture animal", severity: "high", category: "Animal Harm" },
      { term: "beat animal", severity: "high", category: "Animal Harm" },
      { term: "kill animal", severity: "high", category: "Animal Harm" },
      { term: "abandon animal", severity: "mid", category: "Animal Harm" },
      { term: "starve animal", severity: "high", category: "Animal Harm" },
    ],
    stagedFights: [
      // Portuguese
      { term: "rinha de galo", severity: "high", category: "Staged Animal Fights" },
      { term: "rinha de cães", severity: "high", category: "Staged Animal Fights" },
      { term: "briga de galo", severity: "high", category: "Staged Animal Fights" },
      { term: "briga de cachorro", severity: "high", category: "Staged Animal Fights" },
      { term: "luta de animais", severity: "high", category: "Staged Animal Fights" },
      { term: "criar para briga", severity: "high", category: "Staged Animal Fights" },
      { term: "apostar em briga", severity: "high", category: "Staged Animal Fights" },
      // English
      { term: "cockfighting", severity: "high", category: "Staged Animal Fights" },
      { term: "dogfighting", severity: "high", category: "Staged Animal Fights" },
      { term: "animal fight", severity: "high", category: "Staged Animal Fights" },
      { term: "animal vs animal", severity: "mid", category: "Staged Animal Fights" },
      { term: "breeding for fighting", severity: "high", category: "Staged Animal Fights" },
      { term: "fighting rooster", severity: "mid", category: "Staged Animal Fights" },
      { term: "fighting pit", severity: "high", category: "Staged Animal Fights" },
      { term: "bet on fight", severity: "mid", category: "Staged Animal Fights" },
    ],
    fakeRescues: [
      { term: "fake rescue", severity: "high", category: "Fake Animal Rescue" },
      { term: "staged rescue", severity: "high", category: "Fake Animal Rescue" },
      { term: "resgate falso", severity: "high", category: "Fake Animal Rescue" },
      { term: "resgate encenado", severity: "high", category: "Fake Animal Rescue" },
    ],
  },

  // ============================================
  // HARM AGAINST PROPERTY
  // ============================================
  propertyHarm: {
    vandalism: [
      // Portuguese
      { term: "vandalismo", severity: "mid", category: "Vandalism" },
      { term: "vandalizar", severity: "mid", category: "Vandalism" },
      { term: "destruir propriedade", severity: "mid", category: "Vandalism" },
      { term: "quebrar vidro", severity: "mid", category: "Vandalism" },
      { term: "pichar", severity: "low", category: "Vandalism" },
      { term: "riscar carro", severity: "mid", category: "Vandalism" },
      { term: "queimar estátua", severity: "high", category: "Vandalism" },
      { term: "jogar ovo em", severity: "low", category: "Vandalism" },
      // English
      { term: "vandalism", severity: "mid", category: "Vandalism" },
      { term: "vandalize", severity: "mid", category: "Vandalism" },
      { term: "destroy property", severity: "mid", category: "Vandalism" },
      { term: "break windows", severity: "mid", category: "Vandalism" },
      { term: "key car", severity: "mid", category: "Vandalism" },
      { term: "burn statue", severity: "high", category: "Vandalism" },
      { term: "egg house", severity: "low", category: "Vandalism" },
      { term: "spray paint", severity: "low", category: "Vandalism" },
    ],
    theft: [
      // Portuguese
      { term: "roubar", severity: "high", category: "Theft" },
      { term: "furtar", severity: "high", category: "Theft" },
      { term: "assaltar", severity: "high", category: "Theft" },
      { term: "saquear", severity: "high", category: "Theft" },
      { term: "shoplifting", severity: "mid", category: "Theft" },
      { term: "furto em loja", severity: "mid", category: "Theft" },
      { term: "como roubar", severity: "high", category: "Theft" },
      { term: "tutorial roubo", severity: "high", category: "Theft" },
      { term: "vender roubado", severity: "high", category: "Theft" },
      { term: "comprar roubado", severity: "high", category: "Theft" },
      // English
      { term: "steal", severity: "high", category: "Theft" },
      { term: "rob", severity: "high", category: "Theft" },
      { term: "loot", severity: "high", category: "Theft" },
      { term: "shoplift", severity: "mid", category: "Theft" },
      { term: "how to steal", severity: "high", category: "Theft" },
      { term: "theft tutorial", severity: "high", category: "Theft" },
      { term: "sell stolen", severity: "high", category: "Theft" },
      { term: "buy stolen", severity: "high", category: "Theft" },
      { term: "boost car", severity: "high", category: "Theft" },
    ],
  },

  // ============================================
  // HARM AGAINST PEOPLE
  // ============================================
  peopleHarm: {
    outing: [
      // Portuguese
      { term: "expor identidade", severity: "high", category: "Outing" },
      { term: "revelar identidade", severity: "high", category: "Outing" },
      { term: "denunciar gay", severity: "high", category: "Outing" },
      { term: "denunciar lésbica", severity: "high", category: "Outing" },
      { term: "é gay", severity: "mid", category: "Outing", requiresContext: true },
      { term: "é lésbica", severity: "mid", category: "Outing", requiresContext: true },
      { term: "policial disfarçado", severity: "high", category: "Outing" },
      { term: "agente infiltrado", severity: "high", category: "Outing" },
      // English
      { term: "expose identity", severity: "high", category: "Outing" },
      { term: "reveal identity", severity: "high", category: "Outing" },
      { term: "out someone", severity: "high", category: "Outing" },
      { term: "undercover cop", severity: "high", category: "Outing" },
      { term: "undercover agent", severity: "high", category: "Outing" },
      { term: "is gay", severity: "mid", category: "Outing", requiresContext: true },
      { term: "is lesbian", severity: "mid", category: "Outing", requiresContext: true },
    ],
    swatting: [
      // Portuguese
      { term: "swatting", severity: "high", category: "Swatting" },
      { term: "swat call", severity: "high", category: "Swatting" },
      { term: "chamar swat", severity: "high", category: "Swatting" },
      { term: "trote policial", severity: "high", category: "Swatting" },
      { term: "denúncia falsa polícia", severity: "high", category: "Swatting" },
      // English
      { term: "swat someone", severity: "high", category: "Swatting" },
      { term: "fake emergency call", severity: "high", category: "Swatting" },
      { term: "hoax call police", severity: "high", category: "Swatting" },
      { term: "prank call police", severity: "mid", category: "Swatting" },
    ],
    viralChallenges: [
      // High-risk
      { term: "fire challenge", severity: "critical", category: "High-Risk Challenge" },
      { term: "desafio do fogo", severity: "critical", category: "High-Risk Challenge" },
      { term: "tide pod challenge", severity: "critical", category: "High-Risk Challenge" },
      { term: "desafio tide pod", severity: "critical", category: "High-Risk Challenge" },
      { term: "blackout challenge", severity: "critical", category: "High-Risk Challenge" },
      { term: "desafio do apagão", severity: "critical", category: "High-Risk Challenge" },
      { term: "skull breaker", severity: "critical", category: "High-Risk Challenge" },
      { term: "choking game", severity: "critical", category: "High-Risk Challenge" },
      { term: "jogo da asfixia", severity: "critical", category: "High-Risk Challenge" },
      // Mid-risk
      { term: "surfar no carro", severity: "high", category: "Mid-Risk Stunt" },
      { term: "car surfing", severity: "high", category: "Mid-Risk Stunt" },
      { term: "train surfing", severity: "high", category: "Mid-Risk Stunt" },
      { term: "pular de altura", severity: "mid", category: "Mid-Risk Stunt" },
      { term: "saltar de prédio", severity: "high", category: "Mid-Risk Stunt" },
    ],
    communicableDiseases: [
      // Portuguese
      { term: "espalhar covid", severity: "high", category: "Communicable Diseases" },
      { term: "infectar propositalmente", severity: "high", category: "Communicable Diseases" },
      { term: "transmitir hiv", severity: "high", category: "Communicable Diseases" },
      { term: "passar aids", severity: "high", category: "Communicable Diseases" },
      { term: "contaminar de propósito", severity: "high", category: "Communicable Diseases" },
      // English
      { term: "spread covid", severity: "high", category: "Communicable Diseases" },
      { term: "infect on purpose", severity: "high", category: "Communicable Diseases" },
      { term: "deliberately infect", severity: "high", category: "Communicable Diseases" },
      { term: "transmit hiv", severity: "high", category: "Communicable Diseases" },
      { term: "give aids", severity: "high", category: "Communicable Diseases" },
      { term: "spread disease", severity: "mid", category: "Communicable Diseases", requiresContext: true },
    ],
  },

  // ============================================
  // VOTING AND CENSUS INTERFERENCE
  // ============================================
  votingCensus: {
    voterMisinfo: [
      // Portuguese
      { term: "voto não conta", severity: "high", category: "Voter Misrepresentation" },
      { term: "voto não será contado", severity: "high", category: "Voter Misrepresentation" },
      { term: "não pode votar", severity: "high", category: "Voter Misrepresentation" },
      { term: "eleição adiada", severity: "high", category: "Voter Misrepresentation" },
      { term: "local de votação errado", severity: "high", category: "Voter Misrepresentation" },
      { term: "data de votação", severity: "mid", category: "Voter Misrepresentation", requiresContext: true },
      // English
      { term: "vote won't count", severity: "high", category: "Voter Misrepresentation" },
      { term: "can't vote", severity: "high", category: "Voter Misrepresentation" },
      { term: "election postponed", severity: "high", category: "Voter Misrepresentation" },
      { term: "wrong polling station", severity: "high", category: "Voter Misrepresentation" },
      { term: "voting date", severity: "mid", category: "Voter Misrepresentation", requiresContext: true },
    ],
    voterFraud: [
      // Portuguese
      { term: "comprar voto", severity: "high", category: "Voter Fraud" },
      { term: "vender voto", severity: "high", category: "Voter Fraud" },
      { term: "votar duas vezes", severity: "high", category: "Voter Fraud" },
      { term: "voto ilegal", severity: "high", category: "Voter Fraud" },
      { term: "fraude eleitoral", severity: "high", category: "Voter Fraud" },
      { term: "como fraudar eleição", severity: "high", category: "Voter Fraud" },
      // English
      { term: "buy vote", severity: "high", category: "Voter Fraud" },
      { term: "sell vote", severity: "high", category: "Voter Fraud" },
      { term: "vote twice", severity: "high", category: "Voter Fraud" },
      { term: "illegal voting", severity: "high", category: "Voter Fraud" },
      { term: "voter fraud", severity: "high", category: "Voter Fraud" },
      { term: "election fraud", severity: "high", category: "Voter Fraud" },
      { term: "how to rig election", severity: "high", category: "Voter Fraud" },
    ],
    censusFraud: [
      // Portuguese
      { term: "fraude censo", severity: "high", category: "Census Fraud" },
      { term: "mentir no censo", severity: "high", category: "Census Fraud" },
      { term: "falsificar censo", severity: "high", category: "Census Fraud" },
      // English
      { term: "census fraud", severity: "high", category: "Census Fraud" },
      { term: "lie on census", severity: "high", category: "Census Fraud" },
      { term: "fake census", severity: "high", category: "Census Fraud" },
    ],
  },

  // ============================================
  // COORDINATION SIGNALS
  // ============================================
  coordinationSignals: [
    // Portuguese
    { term: "vamos organizar", severity: "mid", category: "Coordination Signal" },
    { term: "quem quer participar", severity: "mid", category: "Coordination Signal" },
    { term: "evento marcado", severity: "mid", category: "Coordination Signal" },
    { term: "ponto de encontro", severity: "mid", category: "Coordination Signal" },
    { term: "recrutar para", severity: "mid", category: "Coordination Signal" },
    { term: "procuro pessoas para", severity: "mid", category: "Coordination Signal" },
    { term: "quem topa", severity: "low", category: "Coordination Signal" },
    // English
    { term: "let's organize", severity: "mid", category: "Coordination Signal" },
    { term: "who wants to join", severity: "mid", category: "Coordination Signal" },
    { term: "event scheduled", severity: "mid", category: "Coordination Signal" },
    { term: "meeting point", severity: "mid", category: "Coordination Signal" },
    { term: "recruiting for", severity: "mid", category: "Coordination Signal" },
    { term: "looking for people to", severity: "mid", category: "Coordination Signal" },
    { term: "who's down", severity: "low", category: "Coordination Signal" },
  ],

  // ============================================
  // ADMISSION SIGNALS
  // ============================================
  admissionSignals: [
    // Portuguese
    { term: "eu fiz isso", severity: "mid", category: "Admission" },
    { term: "eu participei", severity: "mid", category: "Admission" },
    { term: "nós fizemos", severity: "mid", category: "Admission" },
    { term: "confesso que", severity: "mid", category: "Admission" },
    { term: "admito que", severity: "mid", category: "Admission" },
    // English
    { term: "i did this", severity: "mid", category: "Admission" },
    { term: "i participated", severity: "mid", category: "Admission" },
    { term: "we did", severity: "mid", category: "Admission" },
    { term: "i confess", severity: "mid", category: "Admission" },
    { term: "i admit", severity: "mid", category: "Admission" },
  ],
};

// ============================================
// CHPC POLICY CONTENT (Full text for AI context)
// ============================================

export const CHPC_POLICY_CONTENT = `
# COORDINATING HARM AND PROMOTING CRIME (CHPC)

## POLICY RATIONALE
Para prevenir e interromper danos offline e comportamento de imitação, proibimos a facilitação, organização, promoção ou admissão de certas atividades criminosas ou prejudiciais direcionadas a pessoas, empresas, propriedade ou animais. Permitimos que as pessoas debatam e defendam a legalidade de atividades criminosas e prejudiciais, bem como chamem a atenção para atividades prejudiciais ou criminosas que possam testemunhar ou experimentar, desde que não defendam ou coordenem danos.

## 1. HARM AGAINST ANIMALS

### 1.a Physical Harm Against Animals
Coordenação, ameaça, apoio ou admissão de danos físicos contra animais.

**LABEL quando:**
- Indicator 1: Descrição escrita ou visual de danos físicos intencionais a animais
- Indicator 2: Sinais de coordenação, ameaça, apoio ou admissão

**Danos físicos incluem:**
- Infligir sofrimento além da disciplina normal (chutar, bater, esfaquear, esmagar)
- Negligência levando a perigo por predador, fome, desidratação ou abandono
- Morte ou matança de animal

**EXCEÇÕES (No Action):**
- Consciencialização ou condenação
- Propósitos educacionais/académicos
- Arrependimento
- Autodefesa ou defesa de outro humano/animal
- Contextos ficcionais ou encenados (EXCETO staged animal fights)
- Caça, pesca, preparação de alimentos
- Sacrifício religioso
- Pragas ou vermes
- Eutanásia/mercy killing
- Touradas

### 1.b Staged Animal Fights
Lutas entre animais organizadas por humanos para entretenimento.

**LABEL quando:**
- Indicator 1: Menção explícita de luta de animais, referência a "animal1 VS animal2", indicadores visuais (ring, pit, audiência)
- Indicator 2: Coordenação, promoção, admissão (sem legenda, legenda neutra, legenda positiva, eventos futuros, compra/venda, aposta)

**Atividades incluídas:**
- Admissão de posse de local de luta
- Comércio de animais para lutas
- Comércio de acessórios que maximizam lesões (garras metálicas)
- Coordenação de apostas
- Criação de animais para lutas
- Participação como audiência
- Referência ao nome dos animais na luta

**NOTA:** Touradas NÃO são consideradas staged animal fights

### 1.c Fake Animal Rescues
Resgates de animais encenados onde humanos colocam animais em perigo para depois "resgatá-los".

**LABEL quando presentes:**
- 2+ Indicadores Primários E 2+ Indicadores Secundários

**Indicadores Primários:**
- Incidente capturado de 2+ ângulos de câmera
- "Resgatador" parece descobrir animal por acaso
- Resgatador sem equipamento profissional de manejo
- Resgatador coloca predador e presa juntos

**Indicadores Secundários:**
- Ausência de explicação para o resgate
- Ausência de cuidado profissional após resgate

## 2. HARM AGAINST PROPERTY

### 2.a Vandalism
Dano deliberado a propriedade pública ou privada.

**LABEL quando:**
- Indicator 1: Descrição ou visual de vandalismo (queimar estátua, pichar, riscar carro, jogar ovos, quebrar janelas)
- Indicator 2: Sinais de coordenação, apoio, ameaça ou admissão

**EXCEÇÕES (No Action):**
- Consciencialização ou condenação
- Educacional/académico
- Arrependimento
- Fictício ou encenado
- Autodefesa
- Contexto de protesto
- Graffiti

### 2.b Theft
Roubo de propriedade alheia sem consentimento (roubar, furtar, saquear).

**LABEL quando:**
- Sinais de coordenação, ameaça, apoio ou admissão de roubo
- Tutoriais de como roubar
- Intenção de comprar/vender bens roubados
- Oferecer/procurar serviços para cometer roubo

## 3. HARM AGAINST PEOPLE

### 3.a Outing
Expor identidade de pessoas em grupos de risco.

**LABEL quando:**
- Exposição de identidade (nome ou imagem) de membros de grupos de risco
- Exposição de status undercover de agentes da lei

**Grupos de Risco por País:**
- Philippines: Traficantes/usuários de drogas, apoiadores CPP/NPA/NDFP
- MENA + multiple countries: Conversão religiosa, apostasia, ateísmo, blasfêmia
- 40+ countries: LGBTQIA+ (exceto contexto de protesto/ativismo)
- Pakistan: Trabalhadores de vacina, Ahmadi
- India: Mukhbir, casais interreligiosos
- Multiple LATAM: Líderes sociais, imigrantes indocumentados
- Myanmar: Apoiadores PDF/CRPH/NUG
- DRC: Ruandaphones/Tutsis
- Iran: Baha'i

**Undercover Law Enforcement:**
- Nome + face ou badge number
- + Organização (FBI, Metropolitan Police)
- OU Operação específica
- OU Status undercover

### 3.b Swatting
Chamadas falsas para emergência para enviar polícia armada.

**LABEL em qualquer contexto EXCETO:**
- Consciencialização ou condenação
- Educacional
- Fictício
- Arrependimento
- Footage de CCTV/notícias

### 3.c High-Risk Viral Challenges
Desafios virais que podem causar lesões graves ou morte.

**SEMPRE LABEL:**
- Fire challenge (fluidos inflamáveis)
- Pointing firearms
- Blocking airway
- Severe burns/wounds challenges
- Tide Pod, Blackout, Skull Breaker

**LABEL com imagery + awareness = "Yes, depiction"**
**LABEL sem imagery + awareness = No Action**

### 3.d Mid-Risk Stunts/Challenges
Acrobacias com risco de lesão física.

**Lista Exaustiva:**
- Dirigir com metade do corpo fora do veículo
- Saltar/patinar/andar de bicicleta a >3 metros de altura
- Manusear/atirar substâncias inflamáveis acesas, explosivos ou objetos cortantes

**EXCEÇÕES:**
- Consciencialização/condenação
- Contexto profissional (F1, esportes competitivos, militar, parques de skate, artes marciais, sets de filme)

### 3.f Communicable Diseases
Propagação ativa e deliberada de doenças transmissíveis.

**Doenças cobertas:**
- COVID-19/Coronavirus
- HIV/AIDS
- Ebola
- Tuberculosis

**LABEL quando:**
- Declaração explícita de intenção de propagar doença
- Coordenação, ameaça, apoio ou admissão

**EXCEÇÕES:**
- Consciencialização sobre políticas governamentais/OMS
- Arrependimento

## 4. VOTING AND CENSUS INTERFERENCE

### 4.a Voter Misrepresentation
**LABEL:**
- Datas, locais, horários, métodos de votação falsos
- Quem pode votar ou qualificações falsas
- Alegações de que voto não será contado
- Informações/materiais falsos necessários para votar

### 4.b Voter Fraud
**LABEL:**
- Ofertas de compra/venda de votos
- Instruções para votação ilegal
- Intenção explícita de participar ilegalmente

### 4.c Census Misrepresentation/Fraud
**LABEL:**
- Datas, locais, métodos falsos de censo
- Quem pode participar falso
- Instruções para participação ilegal

**EXCEÇÕES para todos voting/census:**
- Contexto de condenação
- Consciencialização
- Reportagem de notícias
- Humor ou sátira

## GLOSSÁRIO

**Admission:** Declaração ou ação que reconhece ou confirma um fato, tipicamente que a pessoa se envolveu em certa conduta.

**Associate:** Pessoa/grupo que participa na comissão dos atos (ajudando, omitindo intervir, contribuindo para rede).

**Awareness Raising:** Partilha de informação para melhorar compreensão de assunto de interesse público.

**Coordination:** Organização de atividade futura, incluindo criação de eventos.

**Mercy Killing:** Ato de matar animais feridos/doentes para minimizar sofrimento (não inclui quando a pessoa causou a lesão/doença).

**Outing:** Divulgar afiliação de pessoa a grupo sem consentimento.

**Outing-Risk Group:** Quando afiliação a grupo traz risco associado à segurança pessoal.

**Political Figure:** Pessoa que ocupa, concorre, foi nomeada para cargo público executivo ou legislativo.

**Staged Animal Fights:** Lutas entre animais organizadas por humanos para entretenimento. Inclui lutas profissionais (ring, pit) e amadoras/ilegais. EXCLUI touradas.

**Swatting:** Ação de fazer chamada falsa para emergência para enviar polícia armada a endereço específico.

**Threat:** Declaração ou visual representando intenção, aspiração ou chamada para ação (Statement of Intent, Call for Action, Advocating, Aspirational, Conditional).

**Vandalism:** Dano deliberado a propriedade pública/privada por pessoa que não é proprietária. NÃO inclui ameaças a propriedade que poderiam levar a morte/lesão (acionar sob V&I).
`;

export default CHPC_POLICY;