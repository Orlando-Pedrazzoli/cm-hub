// ============================================
// FSDP - Fraud, Scam, and Deceptive Practices
// Fraude, Scam e Práticas Enganosas
// ============================================

import { PolicyDefinition } from "@/lib/types";

export const FSDP_POLICY: PolicyDefinition = {
  id: "fsdp",
  name: "Fraud, Scam, and Deceptive Practices",
  shortName: "FSDP",
  description:
    "Conteúdo que facilita fraude, scams ou práticas enganosas para ganho comercial ou financeiro. Inclui documentos falsos, bens roubados, money muling, e diversos tipos de scams.",
  color: "#dc2626",
  icon: "🎭",
  ready: true,

  categories: [
    // ============================================
    // SECTION 1: FRAUDULENT GOODS & SERVICES
    // ============================================
    {
      id: "fraudulent-goods",
      name: "Fraudulent Goods & Services",
      description: "Solicitação, criação, venda, compra ou troca de bens/serviços fraudulentos",
      severity: "critical",
      subcategories: [
        // === FAKE DOCUMENTS ===
        {
          id: "fake-documents",
          name: "Fake, Forged, Counterfeit or Stolen Documents",
          description: "Documentos falsos, forjados, contrafeitos ou roubados",
          examples: [
            "Fake IDs, passports, driving licenses",
            "Forged visas, green cards, work permits",
            "Counterfeit currency, banknotes",
            "Fake vouchers, coupons",
            "Fake educational certificates, diplomas",
            "Forged medical prescriptions",
          ],
        },
        // === FAKE FINANCIAL INSTRUMENTS ===
        {
          id: "fake-financial-instruments",
          name: "Fake, Forged or Stolen Financial Instruments",
          description: "Carding, cartões clonados, instrumentos financeiros roubados",
          examples: [
            "Clone cards",
            "Stolen credit/debit cards",
            "Carding tutorials",
            "Buy/sell account balances",
          ],
        },
        // === FAKE REVIEWS ===
        {
          id: "fake-reviews",
          name: "Fake Reviews",
          description: "Reviews falsos ou incentivados para manipular perceção",
          examples: [
            "Paid reviews",
            "Incentivized reviews for refund",
            "Review exchange schemes",
          ],
        },
        // === STOLEN GOODS ===
        {
          id: "stolen-goods",
          name: "Stolen Goods and Services",
          description: "Bens ou serviços com auto-declaração de serem roubados",
          examples: [
            "Self-disclosed stolen items",
            "Stolen electronics",
            "Stolen vehicles",
          ],
        },
        // === MANIPULATED DEVICES/SUBSCRIPTIONS ===
        {
          id: "manipulated-devices",
          name: "Devices & Subscriptions Manipulated/Unauthorized",
          description: "Dispositivos manipulados ou subscrições não autorizadas",
          examples: [
            "Jailbroken/loaded Fire Sticks",
            "IPTV services",
            "Kodi boxes",
            "Silenced AirTags",
            "Modified measuring devices (meters)",
            "Login credentials for Netflix, Spotify, etc.",
          ],
        },
        // === PII FRAUD ===
        {
          id: "pii-fraud",
          name: "PII or Other Personal Information",
          description: "Venda/compra de informação pessoal identificável",
          examples: [
            "SSN, passport numbers",
            "Credit Privacy Numbers (CPN)",
            "Bank account details",
            "Gig account credentials (Uber, DoorDash)",
          ],
        },
        // === CHEATING PRODUCTS ===
        {
          id: "cheating-products",
          name: "Products & Services Enabling Cheating",
          description: "Produtos que permitem fazer batota em exames/testes",
          examples: [
            "Exam proxy services",
            "Future exam papers",
            "Drug test bypass products",
            "Hidden earphones for exams",
            "Thesis writing services",
            "Grade alteration services",
          ],
        },
      ],
    },

    // ============================================
    // SECTION 2: MONEY MULING & LAUNDERING
    // ============================================
    {
      id: "money-crimes",
      name: "Money Muling & Laundering",
      description: "Coordenação de atividades de lavagem de dinheiro",
      severity: "critical",
      subcategories: [
        {
          id: "money-muling",
          name: "Money Muling",
          description: "Usar contas bancárias de terceiros para transferir dinheiro",
          examples: [
            "Use my bank account for quick money",
            "Who has Wells Fargo business?",
            "Cash app, Chime drops",
            "Job transferring money to third parties",
          ],
        },
        {
          id: "money-laundering",
          name: "Money Laundering",
          description: "Disfarçar origem de fundos ilícitos",
          examples: [
            "SWIFT transfers (MT103, MT799)",
            "Loaders, rippers, flashers, receivers",
            "USDT receiver needed",
            "Coinbase wallet users DM me",
          ],
        },
      ],
    },

    // ============================================
    // SECTION 3: SCAM TYPES
    // ============================================
    {
      id: "scam-types",
      name: "Scam Types",
      description: "Diversos tipos de scams e fraudes",
      severity: "high",
      subcategories: [
        // === LOAN FRAUD ===
        {
          id: "loan-fraud",
          name: "Loan Fraud and Scam",
          description: "Empréstimos fraudulentos com garantia de aprovação",
          examples: [
            "Guaranteed loan approval",
            "No credit check required",
            "Advance fee for loan",
          ],
        },
        // === GAMBLING FRAUD ===
        {
          id: "gambling-fraud",
          name: "Gambling Fraud and Scam",
          description: "Garantias de ganhos em jogos de azar",
          examples: [
            "Guaranteed winning",
            "Match fixing tips",
            "Rigged game outcomes",
          ],
        },
        // === INVESTMENT FRAUD ===
        {
          id: "investment-fraud",
          name: "Investment or Financial Fraud and Scam",
          description: "Investimentos fraudulentos, esquemas Ponzi",
          examples: [
            "Guaranteed returns",
            "Risk-free investment",
            "Get rich quick",
            "Money/cash flip",
            "Recruitment-based compensation",
            "Forex/crypto scams",
          ],
        },
        // === CHARITY FRAUD ===
        {
          id: "charity-fraud",
          name: "Charity Fraud and Scam",
          description: "Angariação fraudulenta para causas falsas",
          examples: [
            "Urgent medical surgery donation",
            "Bank transfer only donations",
            "PII required for donation",
          ],
        },
        // === ROMANCE FRAUD ===
        {
          id: "romance-fraud",
          name: "Romance Fraud and Scam",
          description: "Scams românticos para obter dinheiro",
          examples: [
            "Sugar daddy/mommy offers",
            "Military romance scams",
            "Gift card requests from lovers",
          ],
        },
        // === BUSINESS IMPERSONATION ===
        {
          id: "business-fraud",
          name: "Established Business/Entity Fraud and Scam",
          description: "Fingir representar empresas estabelecidas",
          examples: [
            "Fake UN investment offers",
            "Fake bank representatives",
            "Impersonating multinational companies",
          ],
        },
        // === GOVERNMENT GRANT FRAUD ===
        {
          id: "government-grant-fraud",
          name: "Government Grant Fraud and Scam",
          description: "Falsas promessas de subsídios governamentais",
          examples: [
            "Free government money claims",
            "Disaster relief fund scams",
            "Claim within 24 hours",
          ],
        },
        // === SPIRITUAL/ILLUMINATI FRAUD ===
        {
          id: "spiritual-fraud",
          name: "Tangible, Spiritual or Illuminati Fraud and Scam",
          description: "Recompensas em troca de adesão a cultos ou magia",
          examples: [
            "Join Illuminati brotherhood",
            "Magic wallet for money",
            "Spells for wealth",
          ],
        },
        // === INSURANCE FRAUD ===
        {
          id: "insurance-fraud",
          name: "Insurance Fraud and Scam (Ghost Broking)",
          description: "Seguros falsos com grandes descontos",
          examples: [
            "50%+ savings on insurance",
            "Admin fee required upfront",
            "Ghost broking",
          ],
        },
        // === JOB FRAUD ===
        {
          id: "job-fraud",
          name: "Job Fraud and Scam",
          description: "Ofertas de emprego fraudulentas",
          examples: [
            "Vague job opportunities",
            "Guaranteed job for anyone",
            "Advance fee before job",
            "WFH packing products",
            "Deceptive Temu/Shein jobs",
          ],
        },
        // === DEBT RELIEF FRAUD ===
        {
          id: "debt-relief-fraud",
          name: "Debt Relief and Credit Repair Fraud Scam",
          description: "Falsas promessas de eliminar dívidas",
          examples: [
            "Delete all debt",
            "New credit identity",
            "Stop all debt collections",
          ],
        },
        // === GIVEAWAY FRAUD ===
        {
          id: "giveaway-fraud",
          name: "Giveaway Fraud and Scam",
          description: "Falsas ofertas de dinheiro grátis",
          examples: [
            "Register at link to claim prize",
            "Share PII for free money",
            "DM to claim winnings",
          ],
        },
        // === ADVANCE FEE FRAUD ===
        {
          id: "advance-fee-fraud",
          name: "Advance Fee Fraud and Scam",
          description: "Pedir taxa adiantada para receber dinheiro",
          examples: [
            "Pay $50 to receive $5000",
            "Inheritance claims with fee",
            "Wire transfer required first",
          ],
        },
        // === MISLEADING HEALTH ===
        {
          id: "misleading-health",
          name: "Misleading Health Practices",
          description: "Alegações de saúde falsas ou enganosas",
          examples: [
            "Cure diabetes/cancer claims",
            "Instant scar removal",
            "Lose 10lbs in 1 week",
            "Doctors don't want you to know",
          ],
        },
      ],
    },
  ],

  // ============================================
  // LABEL HIERARCHY
  // ============================================
  labelHierarchy: [
    // === SECTION 1 ===
    {
      id: "fsdp-fake-documents",
      label: "LABEL > FSDP > Fake Documents",
      path: ["LABEL", "FSDP", "Fake Documents"],
      action: "label",
      severity: "critical",
    },
    {
      id: "fsdp-fake-financial",
      label: "LABEL > FSDP > Fake Financial Instruments",
      path: ["LABEL", "FSDP", "Fake Financial Instruments"],
      action: "label",
      severity: "critical",
    },
    {
      id: "fsdp-fake-reviews",
      label: "LABEL > FSDP > Fake Reviews",
      path: ["LABEL", "FSDP", "Fake Reviews"],
      action: "label",
      severity: "high",
    },
    {
      id: "fsdp-stolen-goods",
      label: "LABEL > FSDP > Stolen Goods",
      path: ["LABEL", "FSDP", "Stolen Goods"],
      action: "label",
      severity: "high",
    },
    {
      id: "fsdp-devices-subscriptions",
      label: "LABEL > FSDP > Devices & Subscriptions",
      path: ["LABEL", "FSDP", "Devices Subscriptions"],
      action: "label",
      severity: "high",
    },
    {
      id: "fsdp-pii",
      label: "LABEL > FSDP > PII Fraud",
      path: ["LABEL", "FSDP", "PII Fraud"],
      action: "label",
      severity: "critical",
    },
    {
      id: "fsdp-cheating",
      label: "LABEL > FSDP > Cheating Products",
      path: ["LABEL", "FSDP", "Cheating Products"],
      action: "label",
      severity: "high",
    },
    // === SECTION 2 ===
    {
      id: "fsdp-money-muling",
      label: "LABEL > FSDP > Money Muling",
      path: ["LABEL", "FSDP", "Money Muling"],
      action: "label",
      severity: "critical",
    },
    {
      id: "fsdp-money-laundering",
      label: "LABEL > FSDP > Money Laundering",
      path: ["LABEL", "FSDP", "Money Laundering"],
      action: "label",
      severity: "critical",
    },
    // === SECTION 3 - SCAMS ===
    {
      id: "fsdp-loan-scam",
      label: "LABEL > FSDP > Loan Fraud and Scam",
      path: ["LABEL", "FSDP", "Loan Scam"],
      action: "label",
      severity: "high",
    },
    {
      id: "fsdp-gambling-scam",
      label: "LABEL > FSDP > Gambling Fraud and Scam",
      path: ["LABEL", "FSDP", "Gambling Scam"],
      action: "label",
      severity: "high",
    },
    {
      id: "fsdp-investment-scam",
      label: "LABEL > FSDP > Investment or Financial Fraud and Scam",
      path: ["LABEL", "FSDP", "Investment Scam"],
      action: "label",
      severity: "high",
    },
    {
      id: "fsdp-charity-scam",
      label: "LABEL > FSDP > Charity Fraud and Scam",
      path: ["LABEL", "FSDP", "Charity Scam"],
      action: "label",
      severity: "high",
    },
    {
      id: "fsdp-romance-scam",
      label: "LABEL > FSDP > Romance Fraud and Scam",
      path: ["LABEL", "FSDP", "Romance Scam"],
      action: "label",
      severity: "high",
    },
    {
      id: "fsdp-business-scam",
      label: "LABEL > FSDP > Established Business Fraud and Scam",
      path: ["LABEL", "FSDP", "Business Scam"],
      action: "label",
      severity: "high",
    },
    {
      id: "fsdp-government-scam",
      label: "LABEL > FSDP > Government Grant Fraud and Scam",
      path: ["LABEL", "FSDP", "Government Scam"],
      action: "label",
      severity: "high",
    },
    {
      id: "fsdp-spiritual-scam",
      label: "LABEL > FSDP > Tangible, Spiritual or Illuminati Fraud and Scam",
      path: ["LABEL", "FSDP", "Spiritual Scam"],
      action: "label",
      severity: "high",
    },
    {
      id: "fsdp-insurance-scam",
      label: "LABEL > FSDP > Insurance Fraud and Scam",
      path: ["LABEL", "FSDP", "Insurance Scam"],
      action: "label",
      severity: "high",
    },
    {
      id: "fsdp-job-scam",
      label: "LABEL > FSDP > Job Fraud and Scam",
      path: ["LABEL", "FSDP", "Job Scam"],
      action: "label",
      severity: "high",
    },
    {
      id: "fsdp-debt-scam",
      label: "LABEL > FSDP > Debt Relief and Credit Repair Fraud Scam",
      path: ["LABEL", "FSDP", "Debt Scam"],
      action: "label",
      severity: "high",
    },
    {
      id: "fsdp-giveaway-scam",
      label: "LABEL > FSDP > Giveaway Fraud and Scam",
      path: ["LABEL", "FSDP", "Giveaway Scam"],
      action: "label",
      severity: "high",
    },
    {
      id: "fsdp-advance-fee-scam",
      label: "LABEL > FSDP > Advance Fee Fraud and Scam",
      path: ["LABEL", "FSDP", "Advance Fee Scam"],
      action: "label",
      severity: "high",
    },
    {
      id: "fsdp-health-scam",
      label: "LABEL > FSDP > Misleading Health Practices",
      path: ["LABEL", "FSDP", "Misleading Health"],
      action: "label",
      severity: "high",
    },
  ],

  // ============================================
  // EXCEPTIONS
  // ============================================
  exceptions: [
    {
      id: "condemnation",
      name: "Condemnation",
      description: "Condenar fraudes e scams",
      appliesTo: ["all"],
    },
    {
      id: "awareness",
      name: "Awareness Raising / Education",
      description: "Educar sobre fraudes sem promover ou revelar info sensível",
      appliesTo: ["all"],
    },
    {
      id: "verified-entity",
      name: "Verified Entity",
      description: "Conteúdo publicado por entidades verificadas (certas categorias)",
      appliesTo: ["loan-fraud", "charity-fraud", "government-grant-fraud", "insurance-fraud", "job-fraud", "debt-relief-fraud"],
    },
    {
      id: "past-exams",
      name: "Past Exams",
      description: "Exames passados não são considerados batota",
      appliesTo: ["cheating-products"],
    },
    {
      id: "prop-money",
      name: "Legitimate Prop Cash",
      description: "Dinheiro de adereço legítimo para filmes (distinguível)",
      appliesTo: ["fake-documents"],
    },
  ],

  // ============================================
  // SIGNALS FOR SOLICITATION/SALE
  // ============================================
  solicitationSignals: [
    // Solicitation/Creation
    "Looking for XYZ",
    "Who wants XYZ?",
    "Anyone selling XYZ?",
    "Need XYZ",
    "Tap in, tappn, tapin",
    "hit me",
    "hmu",
    // Sale/Purchase
    "For sale",
    "On sale",
    "Buy it now",
    "Price negotiable",
    // Payment Methods
    "Paypal",
    "CashApp",
    "MoneyGram",
    "Western Union",
    "Venmo",
    "Zelle",
    "Paytm",
    "PhonePe",
    "Bitcoin",
    "Apple Pay",
    "Chime",
    "Gift cards",
    // Money Emojis
    "🤑", "💵", "💶", "💸", "💷", "💴", "💰",
    // Trade
    "Trade for",
    "Swap with",
  ],

  // ============================================
  // SECONDARY INDICATORS
  // ============================================
  secondaryIndicators: {
    general: [
      "Contact for more info",
      "DM me",
      "Email me",
      "Inbox for details",
      "Link in bio",
      "📲", "📤", "📩",
      "Sign up with your ID",
      "Register with passport",
    ],
    loan: [
      "No terms and conditions",
      "Immediate loan forgiveness",
      "Offer expires shortly",
      "Poor spelling/grammar",
    ],
    gambling: [
      "Match tips",
      "Coupon photo",
      "Money photo",
      "Screenshots of betting sites",
      "Happy clients",
    ],
    investment: [
      "Depictions of cash",
      "Large bank account balances",
      "Expensive cars, planes, jewelry",
      "Wealthy lifestyle",
      "Trade positions",
      "Congratulatory messages",
    ],
    romance: [
      "🥰", "😘", "💝", "💏", "🔥", "🎁", "❤️", "🔞",
      "Stacks of money imagery",
      "Help those in financial hardship",
    ],
    job: [
      "Proof of payment",
      "Images unrelated to job",
      "Salary significantly larger than expected",
      "Need 15+ employees",
    ],
  },

  // ============================================
  // CARDING KEYWORDS
  // ============================================
  cardingKeywords: [
    "dumps",
    "cc",
    "cvv",
    "fullz",
    "clone card",
    "carding",
    "cashout",
    "bins",
    "track1",
    "track2",
  ],

  // ============================================
  // UNAUTHORIZED STREAMING BRANDS
  // ============================================
  unauthorizedStreamingBrands: [
    "Alphasat", "Athomics", "AzAmerica", "AzBox", "BTV",
    "Cinebox", "Duosat", "Evolutionbox", "FlujoTV", "Freesky",
    "Gigabox", "Globalsat", "Gosat", "IPTV", "Kodi",
    "MagisTV", "Miuibox", "MXQ", "Mytvbox", "Nazabox",
    "Netfree", "Tocomfree", "Tocomlink", "Tocomsat", "Tourosat",
  ],

  // ============================================
  // JAILBROKEN DEVICE TERMS
  // ============================================
  jailbrokenDeviceTerms: [
    "Jailbroken",
    "Loaded",
    "Fully loaded",
    "FL",
    "All channels",
    "Firestick +",
    "Firestick addon",
    "Firestick subscription",
    "Firestick update",
    "Enhanced",
    "Set up for firestick",
  ],

  // ============================================
  // LIFE THREATENING CONDITIONS (Exhaustive)
  // ============================================
  lifeThreatening: [
    "Diabetes",
    "Herpes",
    "Thyroid",
    "Psoriasis",
    "Ebola",
    "Cancer",
    "Autism",
    "Alzheimer's",
    "Parkinson's",
    "ALS",
    "HIV",
  ],

  // ============================================
  // NON-LIFE THREATENING (Instant cure violates)
  // ============================================
  nonLifeThreatening: [
    "Scars",
    "Skin tags",
    "Moles",
    "Eczema",
    "Rosacea",
    "Varicose veins",
    "Arthritis",
    "Alopecia",
  ],

  keywordsLoaded: true,
};

// ============================================
// FSDP POLICY CONTENT (Full text for AI context)
// ============================================

export const FSDP_POLICY_CONTENT = `
# FRAUD, SCAM, AND DECEPTIVE PRACTICES (FSDP) POLICY

## POLICY RATIONALE
Proteger utilizadores e negócios de serem enganados para perder dinheiro, propriedade ou informação pessoal. Removemos conteúdo que emprega meios enganosos - como falsificação, informação roubada e alegações exageradas - para scams ou fraudes para ganho comercial ou financeiro.

Permitimos que pessoas alertem, eduquem e condenem estas atividades.

---

## SECTION 1: FRAUDULENT GOODS & SERVICES

### 1.a Fake, Forged, Counterfeit or Stolen Documents (LABEL)

**Tipos de Documentos:**
- **Identification:** Government IDs, Passports, Driving licenses, Visas, Green cards, Work permits, License plates
- **Official:** Business docs, Utility bills, Pay slips, Birth/Death/Marriage certificates, Medical certificates, Vaccine certificates
- **Financial:** Cheques, Invoices, Receipts, Bank statements
- **Currency:** Fake money, banknotes, bills
- **Vouchers/Coupons:** Modified or fake vouchers
- **Educational:** Fake diplomas, degrees, transcripts, TOEFL, IELTS, GRE certificates

**Sinais de Legitimidade Falsa:**
- Informal payment (CashApp, Venmo, crypto)
- Avoiding regular requirements ("license without exam")
- Suspicious production language ("produce", "create", "make")
- Authenticity claims ("100% original", "scannable")
- Redacted information in images
- Bulk documents offers
- Cheap currency purchase ("€150 → €1000")
- Counterfeiting imagery (stacks with rubber bands, gloves)
- Counterfeit terminology ("frozen dollar", "G5", "A+++", "clone paper")

**NÃO viola:**
- Document examination/authentication services
- Passport photo services
- Awareness on forging risks
- Legitimate prop cash (clearly marked "FOR MOTION PICTURE PURPOSES")

### 1.b Fake, Forged or Stolen Financial Instruments (LABEL)

**Carding Keywords:**
- dumps, cc, cvv, fullz, clone card, carding, cashout, bins, track1, track2

**Sinais:**
- Images of multiple stacked cards
- Blank cards with chip only
- Card numbers listed
- Working proof (purchases, receipts)
- Creation devices
- Carding tutorials
- Buy/sell account balances

### 1.c Fake Reviews (LABEL)

**Viola:**
- Solicitation, creation, sale, purchase or trade of ratings/reviews
- Reviews in exchange for compensation
- Incentivized reviews (discount, refund, free item)

**NÃO viola:**
- Chances to win in exchange for surveys/feedback
- Product testers with genuine experiences
- Affiliate marketing with proper disclosure
- Loyalty/referral programs

### 1.d Stolen Goods and Services (LABEL)

**Requisito:** Self-disclosure of being "stolen"

### 1.e Devices & Subscriptions Manipulated/Unauthorized (LABEL)

**Unauthorized Streaming Devices:**
Alphasat, AzAmerica, IPTV, Kodi, MagisTV, Tocomsat, etc.

**Jailbroken Devices:**
- Fire Sticks: "Jailbroken", "Loaded", "Fully loaded", "All channels"
- Android boxes unlocked
- Devices with IPTV/Kodi subscription

**Other:**
- Silenced AirTags (speaker disabled/removed)
- Access codes to circumvent security
- Modified measuring devices (meters)
- Login credentials for Netflix, Spotify, ChatGPT, etc.

**Sinais Não Autorizados:**
- Name obfuscation (Ntflix, D1sn3y)
- Informal communication (WhatsApp, gmail)
- Informal payment
- Private/shared accounts
- Technical support offered

**NÃO viola:**
- Internet service with bundled streaming
- Installation services
- Discount promotions on legitimate services

### 1.f PII or Other Personal Information (LABEL)

**PII:**
- National ID numbers (SSN, Passport, ITIN)
- Government IDs of law enforcement/military
- Civil registry records
- Immigration documents
- Driver's licenses, license plates
- Credit Privacy Number (CPN)
- Digital identity (passwords, pins, account access)
- Gig accounts (Uber, Lyft, DoorDash)

**Other Personal Info:**
- Financial records, bank accounts, credit cards
- Private phone numbers, emails, addresses
- Medical/psychological records
- School IDs with name + photo + ID number

### 1.g Products & Services Enabling Cheating (LABEL)

**Viola:**
- Exam proxy services
- Future exam papers or answer sheets
- Drug test bypass products
- Hidden speakers/earphones for exams
- Thesis/essay writing services
- Grade alteration services

**NÃO viola:**
- Past exams or answer keys
- Exam prep courses, study aids

---

## SECTION 2: MONEY MULING & LAUNDERING

### 2.a Money Muling (LABEL)

**Definição:** Usar conta bancária de terceiro para transferir dinheiro

**Viola:**
- "Money can be made quickly using your bank account"
- Employment accepting/transferring money via victim's account
- "Who got Wells Fargo business? I got 360k for u"
- "CashApp, Chime drops"

### 2.b Money Laundering (LABEL)

**Viola:**
- SWIFT transfers (MT103, MT799, MT101, MT102)
- References to "loaders", "rippers", "flashers", "receivers"
- "USDT receiver needed"
- Seeking bank accounts for cash transfer

---

## SECTION 3: SCAM TYPES

### 3.a Loan Fraud and Scam (LABEL)

**Primary + Secondary Indicator Required**

**Primary:**
- Guarantee of approval (explicit or implicit)
- No credit check/collateral required
- Advance fee required

**Secondary:**
- No terms and conditions
- Unrealistic claims (immediate forgiveness)
- Urgency
- Instructions to avoid controls
- Poor spelling/grammar

**Exception:** Verified entity = No Action

### 3.b Gambling Fraud and Scam (LABEL)

**Viola:**
- Guarantee of result or winning
- Admitting rigged outcomes
- Soliciting match fixing

**Secondary:** Match tips, betting screenshots, happy clients

**NÃO viola:** Social casino games (no real money), "free spin", "sign up bonus"

### 3.c Investment or Financial Fraud and Scam (LABEL)

**Investment Opportunities:**
- Guaranteed or risk-free returns
- Recruitment-based compensation (MLM/Ponzi)
- Known scam trends (Dabba trading)
- Get Rich Quick / small investment → large returns

**Money/Cash Flip:**
- "Cash Flip", "Money Flip" terminology
- Turn small amount into large amount

**Secondary:** Cash imagery, luxury goods, wealthy lifestyle, trade positions

### 3.d Charity Fraud and Scam (LABEL)

**ALL conditions must be met:**
1. Claiming to collect for charitable causes
2. Urgent donation needed
3. Bank/payment details provided
4. One of: bank transfer only, specific amount only, PII required

**Exception:** P4P Fundraiser, Verified entity = No Action

### 3.e Romance Fraud and Scam (LABEL)

**Seeking non-sexual companionship + money/equivalent in exchange**

**Sinais:**
- Sugar Daddy/Mommy/Baby
- Yahoo Boy
- Wealthy seeking to "spoil" someone
- Gift cards, flight tickets requests
- Military romance scam patterns

### 3.f Established Business/Entity Fraud and Scam (LABEL)

**Falsely claiming to represent established business AND violating another scam type**

Examples: "I work for UN investment bank, guaranteed 200% returns"

### 3.g Government Grant Fraud and Scam (LABEL)

**False promise of money from government grants**

**Sinais:**
- No application necessary
- Claim within short time
- Money can be spent any way
- International organization fund claims

**Exception:** Verified entity = No Action

### 3.h Tangible, Spiritual or Illuminati Fraud and Scam (LABEL)

**Tangible rewards in exchange for:**
- Membership in association/cult/sect (Illuminati)
- Black magic, spells, magical items

Examples: "Join Illuminati Brotherhood. You will become rich"

**NÃO viola:** "Love spells are £100" (no tangible reward claim)

### 3.i Insurance Fraud and Scam (Ghost Broking) (LABEL)

**Viola:**
- Request for upfront fee (admin/deposit)
- Promises 30%+ savings vs conventional providers

**Secondary:** Happy customer photos, insurance deal screenshots

**Exception:** Verified entity = No Action

### 3.j Job Fraud and Scam (LABEL)

**Deceptive Job Opportunity:**
- Get rich quick with little effort
- Fake Temu/Shein/Walmart/Shopee jobs (not from verified page)

**Vague Job Opportunity:**
- No company name + unclear requirements
- Opportunity to make money without clear job/investment

**Other Violations:**
- No job information, just "Who needs work?"
- Salary offered in advance
- Guaranteed job
- Advance fee required
- WFH but job requires presence (WFH packer, WFH nurse)

**Secondary:** Proof of payment, unrelated images, salary significantly larger than expected, 15+ employees needed

**Exception:** Verified entity = No Action

### 3.k Debt Relief and Credit Repair Fraud Scam (LABEL)

**Viola:**
- Delete/eliminate debt in set time
- Stop all debt collections/lawsuits
- Forgive debt through "new government program"
- Create new "credit identity"

**Exception:** Verified entity = No Action

### 3.l Giveaway Fraud and Scam (LABEL)

**Guaranteed reward of real money if user:**
- Registers at off-site link
- Shares PII
- Contacts via private message
- No action required

**Secondary:** Temporary/expiring offer

### 3.m Advance Fee Fraud and Scam (LABEL)

**Falsely promises money in exchange for upfront fee**

Examples: "Send $50 to receive $5000", inheritance claims

### 3.n Misleading Health Practices (LABEL)

**Life-Threatening Conditions (always violates if cure claimed):**
Diabetes, Herpes, Thyroid, Psoriasis, Ebola, Cancer, Autism, Alzheimer's, Parkinson's, ALS, HIV

**Non-Life-Threatening (violates only with instant/immediate cure):**
Scars, Skin tags, Moles, Eczema, Rosacea, Varicose veins, Arthritis, Alopecia

**Specific Results + Specific Time (no disclaimer):**
- "Lose 5 lbs/week running" = LABEL
- "Lose 10-15 lbs in a week" = LABEL
- "I lost 25 lbs in 25 days" = LABEL

**NÃO viola:**
- "Lose up to 5 lbs/week" (qualifying "up to")
- "Lose 5 lbs" (no specific time)
- "Get fit in 10 days" (non-numeric result)
- "Results may vary" disclaimer

**Sensationalist Language:**
- "Doctors don't want you to know"
- "Miracle cure"
- "Secret solution"
- "Shocking", "amazing", "hidden"

---

## SECTION 4: EXCEPTIONS

### Condemnation (No Action)
Condenar fraudes e scams

### Raising Awareness/Education (No Action)
Educar sobre fraudes sem:
- Revelar informação sensível (PII, future exams, credentials)
- Promover fraude ou scams

---

## VERIFIED ENTITY EXCEPTION

Applies to:
- Loan Fraud
- Charity Fraud
- Government Grant Fraud
- Insurance Fraud
- Job Fraud
- Debt Relief Fraud

If content is posted by verified entity → No Action

---

## MESSENGER REVIEW SPECIFICS

**Violating requires:**
- 1 Primary + 1 Secondary indicator in message thread, OR
- 1 Primary in thread + 1 Primary/Secondary in subject elements, OR
- 1 Primary + Highlighted Scam Score (Suspicious Account)

**FAI Score:** 0.7 or above is secondary indicator
`;

export default FSDP_POLICY;