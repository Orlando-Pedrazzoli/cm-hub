// ============================================
// HE - Human Exploitation
// Exploração Humana
// ============================================

import { PolicyDefinition } from "@/lib/types";

export const HE_POLICY: PolicyDefinition = {
  id: "he",
  name: "Human Exploitation",
  shortName: "HE",
  description:
    "Removemos conteúdo que facilita ou coordena a exploração de humanos, incluindo tráfico humano. Definimos tráfico humano como o negócio de privar alguém de liberdade para lucro - a exploração de humanos para forçá-los a envolver-se em sexo comercial, trabalho ou outras atividades contra a sua vontade.",
  color: "#7c3aed",
  icon: "⛓️",
  ready: true,

  categories: [
    // ============================================
    // 1. HUMAN TRAFFICKING
    // ============================================
    {
      id: "human-trafficking",
      name: "Human Trafficking",
      description: "Conteúdo que recruta, facilita ou explora pessoas através de tráfico humano",
      severity: "critical",
      subcategories: [
        // 1.a.i - Minor Sex Trafficking
        {
          id: "minor-sex-trafficking",
          name: "Minor Sex Trafficking",
          description: "Tráfico sexual de menores (<18). SEMPRE ESCALAR. Não requer sinais de força/fraude/coerção se menor envolvido.",
          action: "escalate",
          examples: [
            "Recruta, transporta ou oferece menor para atividade sexual comercial",
            "Solicita ou procura comprar atividade sexual comercial envolvendo menor",
            "Ofertas de serviços sexuais mencionando disponibilidade de menores",
          ],
        },
        // 1.a.ii - Adult Sex Trafficking
        {
          id: "adult-sex-trafficking",
          name: "Adult Sex Trafficking",
          description: "Tráfico sexual de adultos com uso de força, fraude ou coerção. ESCALAR.",
          action: "escalate",
          examples: [
            "Recruta adulto para atividade sexual comercial através de força/fraude/coerção",
            "Oferece adulto para atividade sexual comercial com ameaças",
            "Procura comprar atividade sexual com adulto usando coerção",
          ],
        },
        // 1.a.iii - Sale of Children or Illegal Adoptions
        {
          id: "child-sale-adoption",
          name: "Sale of Children or Illegal Adoptions",
          description: "Venda de crianças ou adoções ilegais sem menção de processo legal.",
          action: "label",
          examples: [
            "Oferece criança (nascida ou não) para venda/adoção sem processo legal",
            "Solicita criança para adoção sem menção de processo legal",
            "Menciona preço + detalhes da gravidez + contacto + localização",
          ],
        },
        // 1.a.iv - Orphanage Trafficking
        {
          id: "orphanage-trafficking",
          name: "Orphanage Trafficking and Voluntourism",
          description: "Tráfico de orfanato e volunturismo de orfanato. ESCALAR.",
          action: "escalate",
          examples: [
            "Recruta para trabalho em orfanatos com sinais de exploração",
            "Oferece crianças de orfanatos para 'adoção' ou 'apadrinhamento'",
          ],
        },
        // 1.a.v - Forced Marriages
        {
          id: "forced-marriages",
          name: "Forced Marriages (including child marriages)",
          description: "Casamentos forçados, incluindo casamentos infantis. ESCALAR.",
          action: "escalate",
          examples: [
            "Solicita menores para casamento",
            "Solicita adultos para casamentos infantis",
            "'Looking for a nice man to marry my 15 year-old niece'",
          ],
        },
        // 1.a.vi - Labor Exploitation
        {
          id: "labor-exploitation",
          name: "Labor Exploitation (including bonded labor)",
          description: "Exploração laboral através de força, fraude ou coerção. Inclui trabalho forçado e servidão por dívida.",
          action: "label",
          examples: [
            "Oferece emprego com salário excessivamente baixo",
            "Exige entrega de passaporte para trabalho transfronteiriço",
            "Garante visto 100%",
            "Empregador controla rendimentos do trabalhador",
          ],
        },
        // 1.a.vii - Domestic Servitude
        {
          id: "domestic-servitude",
          name: "Domestic Servitude",
          description: "Servidão doméstica - trabalho doméstico através de força, fraude ou coerção.",
          action: "label",
          examples: [
            "Oferece empregadas domésticas para venda",
            "Recruta empregadas com visto de visitante em vez de contrato",
            "Menciona contornar regulamentos laborais locais",
          ],
        },
        // 1.a.viii - Organ Trafficking
        {
          id: "organ-trafficking",
          name: "Non-regenerative Organ Trafficking",
          description: "Tráfico de órgãos não-regenerativos. ESCALAR. Exclui contexto de doação não-exploratória.",
          action: "escalate",
          examples: [
            "Recruta pessoas para vender órgãos com menção de compensação",
            "Oferece órgãos de terceiros para venda",
            "Oferece próprios órgãos com menção de dificuldades financeiras + preço + contacto",
          ],
        },
        // 1.a.ix - Forced Criminality
        {
          id: "forced-criminality",
          name: "Forced Criminal Activity",
          description: "Atividade criminal forçada (mendicidade forçada, tráfico de drogas forçado). ESCALAR.",
          action: "escalate",
          examples: [
            "Recruta menores para atividades criminosas",
            "Força pessoas a mendigar ou traficar drogas",
          ],
        },
        // 1.a.x - Child Soldiers
        {
          id: "child-soldiers",
          name: "Use of Child Soldiers",
          description: "Uso de crianças soldado. Recrutamento de menores para grupos armados.",
          action: "label",
          examples: [
            "Oferece dinheiro/privilégios para menor juntar-se a grupo armado",
            "Menciona centro de recrutamento para menores com endereço/contacto",
            "Imagens de crianças soldado com emojis de apoio/louvor",
          ],
        },
      ],
    },

    // ============================================
    // 1.b - THIRD PARTY COMMERCIAL SEXUAL ACTIVITY
    // ============================================
    {
      id: "third-party-csa",
      name: "Third Party Commercial Sexual Activity",
      description: "Conteúdo onde terceiro recruta, facilita ou beneficia de atividade sexual comercial.",
      severity: "critical",
      subcategories: [
        {
          id: "ccsa",
          name: "Coordinated Commercial Sexual Activity (CCSA)",
          description: "Terceiro oferece/recruta adultos para atividade sexual comercial SEM força/fraude/coerção.",
          action: "escalate",
          examples: [
            "Procura pessoas para trabalhar em atividades sexuais comerciais",
            "Menciona disponibilidade de pessoas em bordel",
            "Terceiro oferece adultos para serviços sexuais com preço",
            "'We have girls available, contact for rates'",
          ],
        },
      ],
    },

    // ============================================
    // 1.c - TEMPORARY MARRIAGES
    // ============================================
    {
      id: "temporary-marriages",
      name: "Temporary Marriages",
      description: "Casamentos temporários sem troca de dinheiro ou valor.",
      severity: "high",
      subcategories: [
        {
          id: "temp-marriage-recruitment",
          name: "Recruitment for Temporary Marriages",
          description: "Recruta pessoas para casamentos temporários (mut'ah, sigheh).",
          action: "label",
          examples: [
            "Recruta para casamento temporário sem menção de compensação",
          ],
        },
      ],
    },

    // ============================================
    // 1.d - DOMESTIC HELPERS
    // ============================================
    {
      id: "domestic-helpers",
      name: "Domestic Helpers Recruitment",
      description: "Recrutamento de empregadas domésticas sem sinais de exploração.",
      severity: "mid",
      subcategories: [
        {
          id: "domestic-helper-jobs",
          name: "Domestic Helper Job Opportunities",
          description: "Ofertas de emprego como empregadas domésticas em casas privadas, sem sinais de exploração.",
          action: "label",
          examples: [
            "Recruta empregadas domésticas para trabalho em casas privadas",
          ],
        },
      ],
    },

    // ============================================
    // 1.e - OFFERING OWN ORGANS
    // ============================================
    {
      id: "own-organs",
      name: "Offering Own Non-regenerative Organs",
      description: "Oferece os próprios órgãos não-regenerativos.",
      severity: "high",
      subcategories: [
        {
          id: "self-organ-offer",
          name: "Self Organ Offering",
          description: "Oferece os próprios órgãos para venda/doação.",
          action: "label",
          examples: [
            "Oferece próprio rim com menção de preço",
            "Oferece órgão devido a dificuldades financeiras",
          ],
        },
      ],
    },

    // ============================================
    // 1.g - HIGH-RISK LOCATIONS
    // ============================================
    {
      id: "high-risk-locations",
      name: "High-Risk Location Jobs",
      description: "Ofertas de emprego em localizações de alto risco conhecidas por exploração.",
      severity: "high",
      subcategories: [
        {
          id: "high-risk-job-offers",
          name: "Job Offers in High-Risk Locations",
          description: "Oferece emprego em: Cambodia (Bavet, Pailin, Poipet), Laos (Bokeo), Myanmar (Myawaddy).",
          action: "label",
          examples: [
            "Job offer in Poipet, Cambodia",
            "Work opportunity in Myawaddy, Myanmar",
            "Employment in Bokeo, Laos",
          ],
        },
      ],
    },

    // ============================================
    // 1.h - LABOR ABUSE
    // ============================================
    {
      id: "labor-abuse",
      name: "Labor Abuse",
      description: "Abuso laboral - exploração através de meios injustos ou prejudiciais, sem necessidade de força/fraude/coerção.",
      severity: "mid",
      subcategories: [
        {
          id: "labor-abuse-recruitment",
          name: "Labor Abuse Recruitment",
          description: "Recruta pessoas para empregos com condições abusivas.",
          action: "label",
          examples: [
            "Garante emprego em trabalho não qualificado",
            "Menciona que candidato não pode escolher o trabalho",
            "Urgência excessiva para candidatar, escassez de vagas",
            "Promessas irrealistas de salário/benefícios",
          ],
        },
      ],
    },

    // ============================================
    // 2. HUMAN SMUGGLING
    // ============================================
    {
      id: "human-smuggling",
      name: "Human Smuggling",
      description: "Contrabando humano - facilitação de entrada irregular num estado através de fronteiras internacionais.",
      severity: "high",
      subcategories: [
        {
          id: "smuggling-offer",
          name: "Offers to Provide/Facilitate Human Smuggling",
          description: "Oferece ou facilita contrabando humano.",
          action: "label",
          examples: [
            "Oferece travessia ilegal de fronteira",
            "Oferece viagem sem documentos de entrada",
            "Usa termos como 'smuggling services', 'illegal immigration'",
            "Menciona documentos falsos para travessia",
          ],
        },
        {
          id: "smuggling-request",
          name: "Asks for Human Smuggling Services",
          description: "Pede serviços de contrabando humano.",
          action: "label",
          examples: [
            "Solicita serviços de travessia ilegal",
            "'Looking for a coyote to cross the border'",
            "Pede ajuda para imigração ilegal",
          ],
        },
      ],
    },
  ],

  // ============================================
  // LABEL HIERARCHY
  // ============================================
  labelHierarchy: [
    // ESCALATE - Human Trafficking
    {
      id: "he-mst",
      label: "ESCALATE > Human Trafficking > Minor Sex Trafficking",
      path: ["ESCALATE", "Human Trafficking", "Minor Sex Trafficking"],
      action: "escalate",
      severity: "critical",
    },
    {
      id: "he-st",
      label: "ESCALATE > Human Trafficking > Sex Trafficking",
      path: ["ESCALATE", "Human Trafficking", "Sex Trafficking"],
      action: "escalate",
      severity: "critical",
    },
    {
      id: "he-ccsa",
      label: "ESCALATE > Human Trafficking > Coordinated Commercial Sexual Activity",
      path: ["ESCALATE", "Human Trafficking", "CCSA"],
      action: "escalate",
      severity: "critical",
    },
    {
      id: "he-organ",
      label: "ESCALATE > Human Trafficking > Organ Trafficking",
      path: ["ESCALATE", "Human Trafficking", "Organ Trafficking"],
      action: "escalate",
      severity: "critical",
    },
    {
      id: "he-other-escalate",
      label: "ESCALATE > Human Trafficking > Other",
      path: ["ESCALATE", "Human Trafficking", "Other"],
      action: "escalate",
      severity: "critical",
    },
    // LABEL - Human Trafficking
    {
      id: "he-child-sale",
      label: "LABEL > Human Exploitation > Child Selling/Illegal Adoption",
      path: ["LABEL", "Human Exploitation", "Child Selling"],
      action: "label",
      severity: "high",
    },
    {
      id: "he-child-soldiers",
      label: "LABEL > Human Exploitation > Child Soldiers",
      path: ["LABEL", "Human Exploitation", "Child Soldiers"],
      action: "label",
      severity: "high",
    },
    {
      id: "he-labor-exploitation",
      label: "LABEL > Human Exploitation > Labor Exploitation",
      path: ["LABEL", "Human Exploitation", "Labor Exploitation"],
      action: "label",
      severity: "high",
    },
    {
      id: "he-labor-abuse",
      label: "LABEL > Human Exploitation > Labor Abuse",
      path: ["LABEL", "Human Exploitation", "Labor Abuse"],
      action: "label",
      severity: "mid",
    },
    {
      id: "he-domestic-servitude",
      label: "LABEL > Human Exploitation > Domestic Servitude",
      path: ["LABEL", "Human Exploitation", "Domestic Servitude"],
      action: "label",
      severity: "high",
    },
    {
      id: "he-domestic-helpers",
      label: "LABEL > Human Exploitation > Domestic Helpers",
      path: ["LABEL", "Human Exploitation", "Domestic Helpers"],
      action: "label",
      severity: "mid",
    },
    {
      id: "he-temp-marriage",
      label: "LABEL > Human Exploitation > Temporary Marriages",
      path: ["LABEL", "Human Exploitation", "Temporary Marriages"],
      action: "label",
      severity: "mid",
    },
    // LABEL - Human Smuggling
    {
      id: "he-smuggling-offer",
      label: "LABEL > Human Exploitation > Facilitate/Offer Smuggling",
      path: ["LABEL", "Human Exploitation", "Smuggling Offer"],
      action: "label",
      severity: "high",
    },
    {
      id: "he-smuggling-ask",
      label: "LABEL > Human Exploitation > Asks for Smuggling Services",
      path: ["LABEL", "Human Exploitation", "Smuggling Request"],
      action: "label",
      severity: "mid",
    },
  ],

  // ============================================
  // EXCEPTIONS
  // ============================================
  exceptions: [
    {
      id: "condemnation",
      name: "Condemnation",
      description: "Condenar tráfico humano ou contrabando",
      appliesTo: ["all"],
    },
    {
      id: "awareness-raising",
      name: "Awareness Raising",
      description: "Consciencialização sobre questões de tráfico humano (campanhas de sociedade civil, histórias pessoais)",
      appliesTo: ["all"],
    },
    {
      id: "news-reporting",
      name: "News Reporting",
      description: "Reportagem de notícias sobre tráfico humano ou contrabando",
      appliesTo: ["all"],
    },
    {
      id: "personal-safety",
      name: "Personal Safety and Asylum",
      description: "Informação sobre segurança pessoal, travessia de fronteiras, pedido de asilo, ou como sair de um país",
      appliesTo: ["human-smuggling"],
    },
    {
      id: "legal-process",
      name: "Legal Process Mention",
      description: "Menção de processo legal para adoção (advogado, tribunal, agências licenciadas)",
      appliesTo: ["child-sale-adoption"],
    },
    {
      id: "organ-donation",
      name: "Non-exploitative Organ Donation",
      description: "Contexto de doação de órgãos não-exploratória (registos de doadores, angariação de fundos para transplantes)",
      appliesTo: ["organ-trafficking"],
    },
    {
      id: "joke-context",
      name: "Joke Context",
      description: "Piadas sobre vender órgãos para comprar coisas (bilhetes de concerto, universidade)",
      appliesTo: ["organ-trafficking"],
    },
    {
      id: "state-military",
      name: "State Military Academies",
      description: "Academias militares estatais, escolas militares nacionais, contexto de caça",
      appliesTo: ["child-soldiers"],
    },
    {
      id: "victim-support",
      name: "Victim Support Services",
      description: "Serviços de apoio a vítimas, hotlines, abrigos, aconselhamento",
      appliesTo: ["labor-exploitation", "labor-abuse"],
    },
  ],

  keywordsLoaded: true,
};

// ============================================
// FORCE, FRAUD, COERCION DEFINITIONS
// ============================================

export const HE_FORCE_FRAUD_COERCION = {
  force: {
    definition: "Uso ou ameaça de violência física, agressão, restrição ou confinamento",
    examples: [
      "Qualquer violência ou ameaça de violência",
      "Abuso ou agressão sexual",
      "Algemar, restrição física, isolamento em sala trancada",
    ],
  },
  fraud: {
    definition: "Falsificação intencional para obter algo de valor",
    examples: [
      "Promessas falsas ou irrealistas sobre condições de trabalho/vida",
      "Reter salários prometidos",
      "Garantir visto ou oferta de emprego",
    ],
  },
  coercion: {
    definition: "Uso de ameaças de dano grave ou restrição física",
    examples: [
      "Ameaças ou intimidação contra vítima ou família",
      "Ameaças de deportação ou contactar autoridades",
      "Confisco de documentos de identidade",
      "Dirigir violência contra outra pessoa para coagir alvo",
      "Retenção de drogas",
      "Ameaças de expor que indivíduo praticou sexo comercial",
    ],
  },
};

// ============================================
// LABOR EXPLOITATION INDICATORS
// ============================================

export const HE_LABOR_INDICATORS = {
  // EXPLICIT INDICATORS - 1 = Labor Exploitation
  explicit: [
    "Menção explícita de contornar regulamentos laborais",
    "Afirmar que trabalho é ilegal/trabalhadores ilegais necessários",
    "Oferecer ajudar 'escapar' do empregador atual por taxa",
    "Recrutamento para plantação de óleo de palma (sem visto específico, por indivíduo, recruta casais/famílias)",
    "Empregador controla rendimentos do trabalhador",
    "Salário excessivamente baixo ou sem salário",
    "Exigir empréstimo do empregador para garantir emprego",
    "Trabalho transfronteiriço + exigir entrega de passaporte",
    "Trabalho transfronteiriço + visto de visitante em vez de trabalho",
    "ECNR explícito em anúncio",
    "Garantir visto 100%",
  ],

  // PRIMARY INDICATORS - 2 = Labor Exploitation, 1 = Labor Abuse
  primary: [
    "Sem skills/experiência para trabalho qualificado",
    "Garantir emprego em trabalho qualificado",
    "Exigir taxa sem especificar propósito",
    "Visar menores <15 para emprego",
    "Deduzir despesas de vida do salário",
    "Trabalho transfronteiriço + sem permissão de trabalho necessária",
    "Trabalho transfronteiriço + visto grátis",
    "Restrição de liberdade (alojamento controlado)",
    "Falsificar empregador/empresa/entidade governamental",
    "Imagens manipuladas de documentos oficiais",
  ],

  // SECONDARY INDICATORS - 1 Primary + 1 Secondary = Labor Exploitation, 2 = Labor Abuse
  secondary: [
    "Garantir emprego em trabalho não qualificado",
    "Candidato não pode escolher trabalho",
    "Pagar adiantado ou trabalhar para pagar taxas de recrutamento",
    "Não requer falar língua do país",
    "Urgência para candidatar/escassez de vagas/começar imediatamente",
    "Sem contrato mencionado",
    "Requisito específico de velocidade de digitação",
    "Custos de viagem cobertos e deduzidos do salário",
    "Pagamento informal/anónimo (cash)",
    "Bónus não relacionados com desempenho (passaporte, diploma)",
    "Empréstimo/pagamento adiantado oferecido",
    "Trabalho transfronteiriço + permissão disponível à chegada",
    "Trabalho transfronteiriço + visto em prazo específico",
    "Tarefas fora da descrição de trabalho",
    "Horas longas/horas extra esperadas",
    "Compensação irrealista (>$1000/mês para não qualificado em países como Vietnam/Cambodia)",
    "Benefícios irrealistas (alojamento/voos/utilities grátis)",
  ],
};

// ============================================
// HUMAN SMUGGLING INDICATORS
// ============================================

export const HE_SMUGGLING_INDICATORS = {
  // EXPLICIT INDICATORS - 1 = Smuggling
  explicit: [
    "Travessia explicitamente mencionada como ilegal",
    "Viagem sem documentos de entrada ou com documentos falsos",
    "Termos: smuggle, smuggling services, secret immigration, illegal migrants/migration/travel/immigration",
  ],

  // PRIMARY INDICATORS - 2 = Smuggling, or 1 Primary + 1 Secondary
  primary: [
    "Transporte: menção de meios de transporte (a pé, carro, barco, camião, RIB)",
    "Método de travessia: rota específica, modo de transporte, entrada não convencional (túnel)",
    "Integridade da rota: guaranteed, safe, secured, reliable, unconventional, avoiding controls/checkpoints",
    "Documentos falsos/fraudulentos (sem menção de fronteira)",
    "Vistos 'garantidos' sem oferta de emprego",
  ],

  // SECONDARY INDICATORS - 1 Primary + 1 Secondary = Smuggling
  secondary: [
    "Localizações: menção de país/cidade de partida e destino (hubs de contrabando)",
    "Sinais visuais: pessoas com coletes salva-vidas, em barco/caravana, documentos de viagem",
    "Emojis indicadores: 🚗🚕🚙🚌🚐🚎🚑🚒🚓🏎️🛵🚲🛴🚢⛵🚤🛳️⛴️🛥️✈️🚁🛩️🚀🛸🚂🚃🚄🚅🚆🚇🚈🚉🛤️",
    "Método de contacto: número, email, messaging app, 'DM me', 'hmu'",
    "Opções de pagamento: custo, preço, método de pagamento, Hawala/Sarafi",
    "Emojis de contacto: 📲📞☎️📱💬📧📩📨📤📥✉️📬📭📪",
  ],

  // EMOJIS
  smugglingEmojis: "🚗🚕🚙🚌🚐🚎🚑🚒🚓🏎️🛵🚲🛴🚢⛵🚤🛳️⛴️🛥️✈️🚁🛩️🚀🛸🚂🚃🚄🚅🚆🚇🚈🚉🛤️🛶🚣",
  contactEmojis: "📲📞☎️📱💬📧📩📨📤📥✉️📬📭📪",
  locationEmojis: "🇺🇸🇲🇽🇨🇦🇬🇧🇪🇺🇩🇪🇫🇷🇮🇹🇪🇸🇵🇹🇬🇷🇹🇷🇱🇾🇹🇳🇪🇬🇲🇦",
};

// ============================================
// COMMERCIAL SEXUAL ACTIVITY EXAMPLES
// ============================================

export const HE_COMMERCIAL_SEXUAL_ACTIVITY = [
  "Escort services",
  "Prostitution",
  "Erotic massage services",
  "Pornographic activities (recruiting for porn, erotic, adult, x-rated films)",
  "Live performances/displays of nudity to sexually stimulate audience (strip clubs)",
  "Live streamed/filmed sexual activities for money",
  "Sex chats for money",
  "Nude photos/videos for money",
  "Temporary marriage for money",
];

// ============================================
// NON-REGENERATIVE ORGANS
// ============================================

export const HE_NON_REGENERATIVE_ORGANS = [
  "Kidney / Rim",
  "Liver / Fígado",
  "Heart / Coração",
  "Eyeballs / Olhos",
  "Cornea / Córnea",
  "Lungs / Pulmões",
  "Intestines / Intestinos",
  "Pancreas / Pâncreas",
];

// ============================================
// HIGH-RISK LOCATIONS
// ============================================

export const HE_HIGH_RISK_LOCATIONS = {
  cambodia: ["Bavet", "Pailin", "Poipet"],
  laos: ["Bokeo"],
  myanmar: ["Myawaddy"],
};

// ============================================
// COORDINATED TARGETED CAMPAIGN (CTC) TRENDS
// ============================================

export const HE_CTC_TRENDS = [
  {
    name: "Vietnam Instagram Trend",
    description: "Captions/imagens em Vietnamita sobre tráfico de órgãos, sexo, venda de crianças. Frequentemente com bandeiras ISIS ou fotos de Osama Bin Laden.",
    indicators: ["0 followers", "Bio vazia", "Conta <20 dias", "Registration Vietnam"],
  },
  {
    name: "Indian Call Boy",
    description: "Recruta para trabalhadores sexuais usando 'call boy/girl'. Job scam (advance fee).",
    indicators: ["call boy/girl", "escort services", "India origin", "WhatsApp/Telegram redirect"],
  },
  {
    name: "Sugar Mommy (Amharic/SSA)",
    description: "Scammers posando como sugar mummy agency. Pedem taxa adiantada.",
    indicators: ["sugar mummy", "sugar daddy", "agency", "marriage mention"],
  },
  {
    name: "Nigerian Massage Scam",
    description: "Oferece massagens eróticas noutros países mas localização é Nigéria.",
    indicators: ["nuru massage", "body to body massage", "VIP massage", "Nigeria location"],
  },
  {
    name: "Korean Sex Party Scripted",
    description: "Linguagem scripted em Coreano sobre 'sex parties' com links spammy.",
    indicators: ["Real Sex Party", "Part-time job arrangement", "links com letras/números aleatórios"],
  },
  {
    name: "Korean Escort Trend",
    description: "Fotos sexualizadas com texto Coreano oferecendo escorts. Links redirecionam para sites spam.",
    indicators: ["1:1 reservation", "highest ranking women", "pharmaceuticals", "tumez domains"],
  },
];

// ============================================
// POLICY CONTENT FOR AI
// ============================================

export const HE_POLICY_CONTENT = `
# HUMAN EXPLOITATION (HE) POLICY

## POLICY RATIONALE
In an effort to disrupt and prevent offline harm, we remove content that facilitates or coordinates the exploitation of humans, including human trafficking. We define human trafficking as the business of depriving someone of liberty for profit. It is the exploitation of humans in order to force them to engage in commercial sex, labor or other activities against their will. It relies on deception, force, and coercion, and degrades humans by depriving them of their freedom while economically or materially benefiting others.

Human trafficking is multi-faceted and global; it can affect anyone regardless of age, socioeconomic background, ethnicity, gender or location.

While we need to be careful not to conflate human trafficking and smuggling, they can be related. Human smuggling is a crime against a state (movement), human trafficking is a crime against a person (exploitation).

---

## IMPLEMENTATION STANDARDS

### 1. HUMAN TRAFFICKING

#### 1.a Content that recruits, facilitates, or exploits people through:

| Sub-violation | Action |
|---------------|--------|
| i. Minor Sex Trafficking | ESCALATE |
| ii. Adult Sex Trafficking | ESCALATE |
| iii. Sale of Children or Illegal Adoptions | LABEL |
| iv. Orphanage Trafficking/Voluntourism | ESCALATE |
| v. Forced Marriages (including child) | ESCALATE |
| vi. Labor Exploitation (bonded labor) | LABEL |
| vii. Domestic Servitude | LABEL |
| viii. Non-regenerative Organ Trafficking | ESCALATE |
| ix. Forced Criminal Activity | ESCALATE |
| x. Use of Child Soldiers | LABEL |

#### 1.b Third Party Commercial Sexual Activity
**Action:** ESCALATE
Content where third-party actor recruits for, facilitates, or benefits from commercial sexual activity.

#### 1.c Temporary Marriages
**Action:** LABEL
Recruits for temporary marriages without money exchange.

#### 1.d Domestic Helpers (lacking exploitation signals)
**Action:** LABEL

#### 1.e Offers Own Non-regenerative Organs
**Action:** LABEL

#### 1.f Condemnation/Awareness Raising
**Action:** NO ACTION

#### 1.g High-Risk Location Jobs
**Action:** LABEL
Jobs in: Cambodia (Bavet, Pailin, Poipet), Laos (Bokeo), Myanmar (Myawaddy)

#### 1.h Labor Abuse
**Action:** LABEL

---

### 2. HUMAN SMUGGLING

| Sub-violation | Action |
|---------------|--------|
| a. Offers to provide/facilitate smuggling | LABEL |
| b. Asks for smuggling services | LABEL |
| c. Personal safety/asylum info | NO ACTION |
| d. Condemnation/awareness raising | NO ACTION |

---

## KEY DEFINITIONS

### FORCE
Use or threatened use of physical violence, assault, restraint or confinement.
- Violence or threats as defined under V&I
- Sexual abuse or assault
- Handcuffing, physical restraint, locked room isolation

### FRAUD
Intentional misrepresentation for obtaining something of value.
- False promises about work/living conditions
- Withholding promised wages
- Guaranteeing visa or employment

### COERCION
Threats of serious harm or physical restraint.
- Threats/intimidation against victim or family
- Threats of deportation
- Confiscation of identity documents
- Withholding of drugs
- Threats to expose commercial sex engagement

---

## LABOR EXPLOITATION DETECTION

### Formula:
- **Labor Exploitation:** 1 Explicit OR 2 Primary OR 1 Primary + 1 Secondary
- **Labor Abuse:** 1 Primary OR 2 Secondary

### EXPLICIT INDICATORS (1 = Exploitation):
- Explicit mention of bypassing labor regulations
- Job stated as illegal
- Employer controls worker income
- Excessively low or no salary
- Requiring loan from employer for job
- Cross-border + surrender passport
- Cross-border + visitor visa instead of work visa
- Guaranteeing visa 100%

### PRIMARY INDICATORS:
- No skills required for skilled job
- Guaranteeing employment in skilled job
- Fee required without specifying purpose
- Targeting minors <15
- Living expenses deducted from wages
- Cross-border + no work permit required
- Cross-border + free visa
- Restriction of liberty (controlled housing)
- Misrepresenting employer/company
- Manipulated official documents

### SECONDARY INDICATORS:
- Guaranteeing unskilled job
- Cannot choose job type
- Pay upfront or work off recruitment fees
- No language skills required
- Urgency/scarcity/start immediately
- No contract mentioned
- Specific typing speed requirement
- Travel costs covered then deducted
- Informal/cash payment
- Unrealistic bonuses
- Advanced loan offered
- Cross-border + permit on arrival
- Cross-border + visa within timeframe
- Tasks outside job description
- Long hours expected
- Unrealistic compensation (>$1000/month for unskilled in Vietnam/Cambodia)
- Unrealistic benefits (free accommodation/flights)

---

## HUMAN SMUGGLING DETECTION

### Formula:
- 1 Explicit OR 2 Primary OR 1 Primary + 1 Secondary = Smuggling

### EXPLICIT INDICATORS:
- Crossing explicitly mentioned as illegal
- Travel with no/fake documents
- Terms: smuggle, smuggling services, secret immigration, illegal migration

### PRIMARY INDICATORS:
- Transportation: any means (foot, car, boat, truck, RIB)
- Crossing method: route, mode, unconventional entry (tunneling)
- Route integrity: guaranteed, safe, secured, reliable, avoiding controls
- Fake/fraudulent documentation
- Guaranteed visas without job offer

### SECONDARY INDICATORS:
- Locations: departure/destination countries (smuggling hubs)
- Visual hints: life jackets, boats, caravans, travel documents
- Transport emojis: 🚗🚕🚙🚌🚢⛵✈️🚂
- Contact method: phone, email, messaging apps, "DM me"
- Payment: cost, price, method, Hawala/Sarafi
- Contact emojis: 📲📞📱💬📧

---

## SEX TRAFFICKING DISTINCTION

### Minor Sex Trafficking (MST)
- ANY commercial sexual activity involving minor (<18)
- NO force/fraud/coercion required for minors
- ALWAYS ESCALATE

### Adult Sex Trafficking (ST)
- Commercial sexual activity with adult
- REQUIRES force, fraud or coercion
- ESCALATE

### Coordinated Commercial Sexual Activity (CCSA)
- Third party recruits/offers adults for commercial sex
- WITHOUT force/fraud/coercion
- ESCALATE
- Formula: Sexual element + Commercial element + Third party

### Third Party Indicators:
- Pronouns: "we", "us", "she", "her", "he", "him", "they"
- Multiple people offered
- Plural language ("prostitutes available")
- Posted by business/agency

---

## SALE OF CHILDREN / ILLEGAL ADOPTION

### Violates when ALL criteria met:
1. Offers child (born or unborn) for sale/adoption
2. No explicit mention of legal process
3. At least 2 of:
   - Details of pregnancy/child (age, due date, photos)
   - Mention of price/payment method
   - Contact method
   - Location of mother/child

### Legal Process (negates violation):
- Seeking legal advice (solicitor, lawyer, CASA)
- Court proceedings for adoption
- National adoption registration
- Adoption placement agencies
- Documents required (birth certificates, consent)

---

## NON-REGENERATIVE ORGAN TRAFFICKING

### Non-regenerative Organs:
Kidneys, Liver, Heart, Eyeballs/Cornea, Lungs, Intestines, Pancreas

### Exploits when:
- Offers to sell others' organs
- Mentions availability of organs + contact/location
- Offers own organs with:
  - Financial difficulties as reason
  - Age mention
  - Medical info (blood type, "healthy")
  - Compensation method
  - Location
  - Contact method

### DOES NOT VIOLATE:
- Joke context ("selling kidney for concert tickets")
- Non-exploitative donation (living donor registries, fundraising)
- Medical context

---

## CHILD SOLDIERS

### Violates when:
- Offering/encouraging minor to join armed group (non-state)
- Offering funding/transport/accommodation to join
- Offering non-financial privileges (citizenship, scholarships, religious rewards)
- Mention of recruiting center with address/contact/names
- Images of child soldiers with:
  - Religious texts praising
  - Animal comparison (lion, tiger)
  - Like/share requests
  - Praise emojis
  - No caption

### DOES NOT VIOLATE:
- State military academies
- Condemnation
- Rehabilitation fundraising

---

## IMMINENT THREAT TO LIFE/SAFETY (ITTLoS)

### Escalate when ALL present:
1. Content violates HEx policy
2. IMMINENT (within 72 hours)
3. Threat to life/safety of SPECIFIC, IDENTIFIABLE person

### Threat Types:
- Death risk
- Serious physical harm (disfigurement, brain injury, gunshot)
- Deprivation of liberty (confined against will)

---

## EXCEPTIONS (NO ACTION)

1. **Condemnation** - Condemning trafficking/smuggling
2. **Awareness Raising** - Civil society campaigns, personal stories
3. **News Reporting** - Journalistic coverage
4. **Personal Safety Info** - Border crossing safety, asylum seeking
5. **Legal Process** - Mention of legal adoption process
6. **Non-exploitative Organ Donation** - Donor registries, transplant fundraising
7. **Joke Context** - Jokes about selling organs for purchases
8. **State Military Academies** - National military schools
9. **Victim Support Services** - Hotlines, shelters, counseling
`;

export default HE_POLICY;