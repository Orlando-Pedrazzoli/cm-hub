// ============================================
// SPAM - Spam Policy
// Spam e Links Enganosos
// ============================================

import { PolicyDefinition } from "@/lib/types";

export const SPAM_POLICY: PolicyDefinition = {
  id: "spam",
  name: "Spam",
  shortName: "Spam",
  description:
    "Conteúdo projetado para enganar, iludir ou sobrecarregar utilizadores para aumentar visualizações artificialmente. Inclui abuso de engagement, venda de privilegios, links enganosos e funcionalidades falsas.",
  color: "#f59e0b",
  icon: "📧",
  ready: true,

  categories: [
    // ============================================
    // ENGAGEMENT ABUSE & SALE
    // ============================================
    {
      id: "engagement-abuse",
      name: "Engagement Abuse & Sale",
      description: "Compra, venda ou troca artificial de engagement e privilégios",
      severity: "high",
      subcategories: [
        {
          id: "buy-sell-engagement",
          name: "Buy/Sell Engagement",
          description: "Compra/venda de likes, comentários, partilhas, seguidores",
          examples: [
            "Who needs 10k followers?",
            "Cheap likes available, DM me",
            "Buy followers for your page",
            "Likes, shares, follows available",
          ],
        },
        {
          id: "buy-sell-accounts",
          name: "Buy/Sell Accounts & Pages",
          description: "Compra/venda de contas, páginas ou grupos",
          examples: [
            "I want to buy your Instagram account",
            "Facebook page for sale",
            "Selling my 100k followers account",
            "Buy a page with 10k followers",
          ],
        },
        {
          id: "buy-sell-privileges",
          name: "Buy/Sell Site Privileges",
          description: "Compra/venda de posições de admin/moderador",
          examples: [
            "Admin role for sale",
            "Group admin position available",
            "Buy moderator access",
          ],
        },
        {
          id: "account-services",
          name: "Account Takedown/Restoration Services",
          description: "Serviços de remoção ou restauração de contas",
          examples: [
            "Get your banned account back",
            "Account recovery service",
            "Unlock suspended account",
          ],
        },
        {
          id: "engagement-for-engagement",
          name: "Engagement for Engagement (Asymmetric)",
          description: "Troca de engagement assimétrica",
          examples: [
            "Share my page = 50 shares back",
            "Like my picture = 10 likes back",
            "Trade my 100k account for 10k Threads",
          ],
        },
        {
          id: "exchange-monetary",
          name: "Exchange (Monetary Value)",
          description: "Engagement em troca de valor monetário",
          examples: [
            "Like my post = $5",
            "Follow = free iPhone",
            "Share = magazine subscription",
          ],
        },
        {
          id: "giveaway-cash",
          name: "Giveaway (Cash/Crypto)",
          description: "Sorteios de dinheiro/crypto em troca de engagement",
          examples: [
            "Follow to win $100",
            "Like to win 5 Ethereum",
            "Share for chance to win Bitcoin",
          ],
        },
        {
          id: "engagement-gating",
          name: "Engagement Gating",
          description: "Exigir engagement para ver conteúdo prometido",
          examples: [
            "Like and share to see video",
            "Follow to unlock content",
            "Mention me for free video",
          ],
        },
      ],
    },
    // ============================================
    // DECEPTIVE LINKS
    // ============================================
    {
      id: "deceptive-links",
      name: "Deceptive Links",
      description: "Links que enganam ou iludem utilizadores",
      severity: "high",
      subcategories: [
        {
          id: "cloaking",
          name: "Cloaking",
          description: "Mostrar conteúdo diferente a sistemas Meta e utilizadores",
          examples: [
            "Different content to Meta vs users",
            "Benign to systems, violating to users",
          ],
        },
        {
          id: "misleading-link",
          name: "Misleading Link",
          description: "Link promete um tipo de conteúdo mas entrega outro",
          examples: [
            "Promises cute animals, leads to porn",
            "Promises football news, leads to politics",
            "Significantly different content",
          ],
        },
        {
          id: "deceptive-redirect",
          name: "Deceptive Redirect Behavior",
          description: "Websites que redirecionam automaticamente ou após ação",
          examples: [
            "Click captcha, redirects to different domain",
            "Watch ad, then different site loads",
            "Auto-redirect to different domain",
          ],
        },
        {
          id: "like-share-gating",
          name: "Like/Share-Gating",
          description: "Landing pages que exigem engagement para acesso",
          examples: [
            "Share our page to see video",
            "Like before accessing content",
            "Follow to unlock article",
          ],
        },
        {
          id: "deceptive-platform-functionality",
          name: "Deceptive Platform Functionality",
          description: "Imitar funcionalidades Meta que não funcionam",
          examples: [
            "Fake play button on image",
            "Fake like button",
            "Fake poll",
            "Fake fundraising",
            "Fake live video indicator",
          ],
        },
        {
          id: "deceptive-landing-page",
          name: "Deceptive Landing Page Functionality",
          description: "Websites com interface enganosa",
          examples: [
            "Pop-ups/pop-unders",
            "Clickjacking",
            "Trapping (pop-ups when leaving)",
          ],
        },
        {
          id: "domain-impersonation",
          name: "Landing Page/Domain Impersonation",
          description: "Imitar marcas conhecidas através de domínio ou conteúdo",
          examples: [
            "faceb00k.com",
            "amaz0n.com",
            "bbc.com-latest-news.xyz",
            "FOXNNEWs.us",
          ],
        },
      ],
    },
    // ============================================
    // FAKE FUNCTIONALITY
    // ============================================
    {
      id: "fake-functionality",
      name: "Fake/Non-Existent Functionality",
      description: "Prometer funcionalidades Meta que não existem",
      severity: "mid",
      subcategories: [
        {
          id: "fake-features",
          name: "Fake Platform Features",
          description: "Funcionalidades falsas da plataforma",
          examples: [
            "Dislike button",
            "See who viewed your profile",
            "Change Instagram UI color",
            "Premium version of Instagram",
            "Boost algorithm visibility",
            "Mass delete followers",
            "See who doesn't follow back",
            "Recover deleted messages",
          ],
        },
      ],
    },
  ],

  // ============================================
  // LABEL HIERARCHY
  // ============================================
  labelHierarchy: [
    // === ENGAGEMENT ABUSE ===
    {
      id: "spam-engagement-sale",
      label: "LABEL > Spam > Engagement Abuse > Soliciting Purchase/Sale",
      path: ["LABEL", "Spam", "Engagement Abuse", "Purchase/Sale"],
      action: "label",
      severity: "high",
    },
    {
      id: "spam-engagement-gating",
      label: "LABEL > Spam > Engagement Abuse > Engagement Gating",
      path: ["LABEL", "Spam", "Engagement Abuse", "Gating"],
      action: "label",
      severity: "high",
    },
    {
      id: "spam-fake-functionality",
      label: "LABEL > Spam > Engagement Abuse > Fake Functionality",
      path: ["LABEL", "Spam", "Engagement Abuse", "Fake Functionality"],
      action: "label",
      severity: "mid",
    },
    // === DECEPTIVE LINKS ===
    {
      id: "spam-misleading-link",
      label: "LABEL > Spam > Deceptive Links > Misleading Link",
      path: ["LABEL", "Spam", "Deceptive Links", "Misleading"],
      action: "label",
      severity: "high",
    },
    {
      id: "spam-like-share-gating",
      label: "LABEL > Spam > Deceptive Links > Like/Share-Gating",
      path: ["LABEL", "Spam", "Deceptive Links", "Like/Share-Gating"],
      action: "label",
      severity: "high",
    },
    {
      id: "spam-deceptive-platform",
      label: "LABEL > Spam > Deceptive Links > Deceptive Platform Functionality",
      path: ["LABEL", "Spam", "Deceptive Links", "Deceptive Platform"],
      action: "label",
      severity: "high",
    },
    {
      id: "spam-domain-impersonation",
      label: "LABEL > Spam > Deceptive Links > Domain Impersonation",
      path: ["LABEL", "Spam", "Deceptive Links", "Domain Impersonation"],
      action: "label",
      severity: "high",
    },
  ],

  // ============================================
  // EXCEPTIONS
  // ============================================
  exceptions: [
    {
      id: "cross-promotion",
      name: "Cross Promotion",
      description: "Promoção cruzada sem pagamento a terceiros",
      appliesTo: ["engagement-abuse"],
    },
    {
      id: "admin-transfer",
      name: "Admin Transfer Based on Interest",
      description: "Transferir admin/mod baseado em interesse, não troca de valor",
      appliesTo: ["buy-sell-privileges"],
    },
    {
      id: "branded-content",
      name: "Branded Content",
      description: "Conteúdo de marca claramente identificado (#ad, #sponsored)",
      appliesTo: ["engagement-abuse"],
    },
    {
      id: "engagement-symmetric",
      name: "Symmetric Engagement for Engagement",
      description: "Like-for-like, follow-for-follow simétrico",
      appliesTo: ["engagement-for-engagement"],
      examples: ["Like my post and I'll like yours", "Follow for follow"],
    },
    {
      id: "no-monetary-value",
      name: "No Monetary Value Exchange",
      description: "Troca sem valor monetário (amor, admiração, coupons)",
      appliesTo: ["exchange-monetary"],
    },
    {
      id: "giveaway-gift-cards",
      name: "Giveaway with Gift Cards",
      description: "Sorteios com gift cards ou moeda in-game (não dinheiro/crypto)",
      appliesTo: ["giveaway-cash"],
    },
    {
      id: "future-content",
      name: "Future Content Promises",
      description: "Promessas de conteúdo futuro disponível para todos",
      appliesTo: ["engagement-gating"],
      examples: ["Like and subscribe to see new videos when they come out"],
    },
    {
      id: "dm-access",
      name: "DM for Access",
      description: "Pedir DM para acesso (sem engagement público)",
      appliesTo: ["engagement-gating"],
    },
    {
      id: "creator-subscriptions",
      name: "Creator Subscriptions",
      description: "Subscrições premium de criadores",
      appliesTo: ["engagement-gating"],
    },
    {
      id: "condemning-spam",
      name: "Condemning Spam",
      description: "Partilhar spam para condenar (sem links funcionais)",
      appliesTo: ["all"],
    },
    {
      id: "link-error",
      name: "Link Error/404",
      description: "Links com erro ou não funcionais",
      appliesTo: ["deceptive-links"],
    },
  ],

  // ============================================
  // SITE PRIVILEGES LIST (Official)
  // ============================================
  sitePrivileges: [
    "Admin and moderator roles",
    "Admin and moderator permissions",
    "Facebook or Instagram accounts",
    "Profiles",
    "Posts",
    "Posting permissions",
    "Likes, shares, comments, follows",
    "Facebook Pages or Groups",
    "Account Takedown or Restoration services",
  ],

  // ============================================
  // FAKE FUNCTIONALITIES LIST (Official)
  // ============================================
  fakeFunctionalities: [
    "Dislike button",
    "See who viewed your profile",
    "Change Instagram UI color",
    "Premium/paid version of Instagram",
    "Charge users monthly fees for IG",
    "Boost algorithm visibility",
    "Manipulate Meta algorithm",
    "Mass delete followers",
    "See who doesn't follow back",
    "Recover deleted messages/chats",
    "Recover messages taken down by Meta",
    "Unlock restricted accounts",
    "Unlock account restricted by Meta",
    "Content/comment takedowns (unauthorized)",
  ],

  // ============================================
  // REAL FUNCTIONALITIES LIST (Official)
  // ============================================
  realFunctionalities: {
    posts: [
      "Like", "Favorite", "Save", "Hide", 
      "Turn on notifications", "Copy link", 
      "Snooze", "View edit history", "Manage your feed"
    ],
    instagramProfiles: [
      "Follow", "Unfollow", "Mute", "Report", 
      "Block", "Restrict", "Copy profile URL", 
      "Share profile", "Message", 
      "Add to close friends list", "Add to favorites"
    ],
    facebookProfiles: [
      "Report profile", "Block", "View main profile", 
      "Video call", "Audio call", "View friendship", 
      "Help user", "Search", "Unfollow"
    ],
    ads: [
      "Show more", "Show less", "Save link", 
      "Hide ad", "Report ad"
    ],
    groups: [
      "Search", "Join", "Share group", 
      "Manage your content", "Manage badges", 
      "Manage notifications", "View your group profile",
      "Pin group", "Share", "Unfollow group", 
      "Report group", "Sort comments"
    ],
  },

  // ============================================
  // MONETARY VALUE DEFINITIONS
  // ============================================
  monetaryValue: {
    hasMoney: [
      "Fiat currency (USD, EUR, GBP, etc.)",
      "Cryptocurrency (Bitcoin, Ethereum, etc.)",
      "Precious metals (gold, silver)",
      "Gift cards",
      "Mobile phones",
      "Cars",
      "Food",
      "Purchasable goods",
    ],
    noMoney: [
      "Intangibles (love, respect)",
      "Social interactions",
      "Coupons",
      "Special offers (BOGO)",
      "Loans",
      "Desktop wallpapers (free)",
      "Items of negligible value (peppercorn, toothpick)",
    ],
  },

  keywordsLoaded: true,
};

// ============================================
// SPAM KEYWORDS - Portuguese + English
// ============================================

export const SPAM_KEYWORDS = {
  // ============================================
  // ENGAGEMENT SALE
  // ============================================
  engagementSale: [
    // Portuguese
    { term: "comprar seguidores", category: "Buy Engagement", severity: "high" },
    { term: "vender seguidores", category: "Sell Engagement", severity: "high" },
    { term: "comprar likes", category: "Buy Engagement", severity: "high" },
    { term: "vender likes", category: "Sell Engagement", severity: "high" },
    { term: "comprar curtidas", category: "Buy Engagement", severity: "high" },
    { term: "comprar visualizações", category: "Buy Engagement", severity: "high" },
    { term: "comprar views", category: "Buy Engagement", severity: "high" },
    { term: "seguidores baratos", category: "Sell Engagement", severity: "high" },
    { term: "likes baratos", category: "Sell Engagement", severity: "high" },
    { term: "aumentar seguidores", category: "Sell Engagement", severity: "mid" },
    { term: "ganhar seguidores", category: "Sell Engagement", severity: "mid" },
    
    // English
    { term: "buy followers", category: "Buy Engagement", severity: "high" },
    { term: "sell followers", category: "Sell Engagement", severity: "high" },
    { term: "buy likes", category: "Buy Engagement", severity: "high" },
    { term: "sell likes", category: "Sell Engagement", severity: "high" },
    { term: "buy views", category: "Buy Engagement", severity: "high" },
    { term: "buy comments", category: "Buy Engagement", severity: "high" },
    { term: "buy shares", category: "Buy Engagement", severity: "high" },
    { term: "cheap followers", category: "Sell Engagement", severity: "high" },
    { term: "cheap likes", category: "Sell Engagement", severity: "high" },
    { term: "10k followers", category: "Sell Engagement", severity: "mid" },
    { term: "who needs followers", category: "Sell Engagement", severity: "high" },
    { term: "followers available", category: "Sell Engagement", severity: "high" },
    { term: "likes available", category: "Sell Engagement", severity: "high" },
    { term: "dm for followers", category: "Sell Engagement", severity: "high" },
    { term: "dm for likes", category: "Sell Engagement", severity: "high" },
  ],

  // ============================================
  // ACCOUNT/PAGE SALE
  // ============================================
  accountSale: [
    // Portuguese
    { term: "vender conta", category: "Sell Account", severity: "high" },
    { term: "comprar conta", category: "Buy Account", severity: "high" },
    { term: "conta à venda", category: "Sell Account", severity: "high" },
    { term: "página à venda", category: "Sell Page", severity: "high" },
    { term: "vender página", category: "Sell Page", severity: "high" },
    { term: "comprar página", category: "Buy Page", severity: "high" },
    { term: "grupo à venda", category: "Sell Group", severity: "high" },
    { term: "vender grupo", category: "Sell Group", severity: "high" },
    
    // English
    { term: "sell account", category: "Sell Account", severity: "high" },
    { term: "buy account", category: "Buy Account", severity: "high" },
    { term: "account for sale", category: "Sell Account", severity: "high" },
    { term: "page for sale", category: "Sell Page", severity: "high" },
    { term: "sell page", category: "Sell Page", severity: "high" },
    { term: "buy page", category: "Buy Page", severity: "high" },
    { term: "group for sale", category: "Sell Group", severity: "high" },
    { term: "sell group", category: "Sell Group", severity: "high" },
    { term: "buy instagram account", category: "Buy Account", severity: "high" },
    { term: "buy facebook page", category: "Buy Page", severity: "high" },
  ],

  // ============================================
  // ADMIN/PRIVILEGES SALE
  // ============================================
  privilegesSale: [
    // Portuguese
    { term: "admin à venda", category: "Sell Privileges", severity: "high" },
    { term: "vender admin", category: "Sell Privileges", severity: "high" },
    { term: "comprar admin", category: "Buy Privileges", severity: "high" },
    { term: "posição de admin", category: "Sell Privileges", severity: "mid" },
    { term: "moderador à venda", category: "Sell Privileges", severity: "high" },
    
    // English
    { term: "admin for sale", category: "Sell Privileges", severity: "high" },
    { term: "admin role for sale", category: "Sell Privileges", severity: "high" },
    { term: "sell admin", category: "Sell Privileges", severity: "high" },
    { term: "buy admin", category: "Buy Privileges", severity: "high" },
    { term: "admin position", category: "Sell Privileges", severity: "mid" },
    { term: "moderator for sale", category: "Sell Privileges", severity: "high" },
    { term: "highest bidder", category: "Sell Privileges", severity: "high" },
  ],

  // ============================================
  // ACCOUNT SERVICES
  // ============================================
  accountServices: [
    // Portuguese
    { term: "recuperar conta", category: "Account Services", severity: "mid" },
    { term: "desbloquear conta", category: "Account Services", severity: "high" },
    { term: "conta banida", category: "Account Services", severity: "mid" },
    { term: "restaurar conta", category: "Account Services", severity: "high" },
    
    // English
    { term: "recover account", category: "Account Services", severity: "mid" },
    { term: "unlock account", category: "Account Services", severity: "high" },
    { term: "banned account", category: "Account Services", severity: "mid" },
    { term: "restore account", category: "Account Services", severity: "high" },
    { term: "get your account back", category: "Account Services", severity: "high" },
    { term: "account recovery service", category: "Account Services", severity: "high" },
    { term: "unlock suspended account", category: "Account Services", severity: "high" },
    { term: "unlock restricted account", category: "Account Services", severity: "high" },
  ],

  // ============================================
  // ENGAGEMENT GATING
  // ============================================
  engagementGating: [
    // Portuguese
    { term: "curtir para ver", category: "Engagement Gating", severity: "high" },
    { term: "seguir para ver", category: "Engagement Gating", severity: "high" },
    { term: "partilhar para ver", category: "Engagement Gating", severity: "high" },
    { term: "like para desbloquear", category: "Engagement Gating", severity: "high" },
    { term: "seguir para desbloquear", category: "Engagement Gating", severity: "high" },
    
    // English
    { term: "like to see", category: "Engagement Gating", severity: "high" },
    { term: "follow to see", category: "Engagement Gating", severity: "high" },
    { term: "share to see", category: "Engagement Gating", severity: "high" },
    { term: "like to unlock", category: "Engagement Gating", severity: "high" },
    { term: "follow to unlock", category: "Engagement Gating", severity: "high" },
    { term: "share to unlock", category: "Engagement Gating", severity: "high" },
    { term: "like and share to see", category: "Engagement Gating", severity: "high" },
    { term: "mention me for", category: "Engagement Gating", severity: "mid" },
    { term: "before seeing", category: "Engagement Gating", severity: "mid" },
  ],

  // ============================================
  // EXCHANGE/GIVEAWAY
  // ============================================
  exchangeGiveaway: [
    // Portuguese
    { term: "seguir para ganhar", category: "Giveaway", severity: "high" },
    { term: "curtir para ganhar", category: "Giveaway", severity: "high" },
    { term: "partilhar para ganhar", category: "Giveaway", severity: "high" },
    { term: "sorteio de dinheiro", category: "Giveaway Cash", severity: "high" },
    { term: "sorteio de bitcoin", category: "Giveaway Crypto", severity: "high" },
    { term: "sorteio de crypto", category: "Giveaway Crypto", severity: "high" },
    
    // English
    { term: "follow to win", category: "Giveaway", severity: "high" },
    { term: "like to win", category: "Giveaway", severity: "high" },
    { term: "share to win", category: "Giveaway", severity: "high" },
    { term: "cash giveaway", category: "Giveaway Cash", severity: "high" },
    { term: "bitcoin giveaway", category: "Giveaway Crypto", severity: "high" },
    { term: "crypto giveaway", category: "Giveaway Crypto", severity: "high" },
    { term: "ethereum giveaway", category: "Giveaway Crypto", severity: "high" },
    { term: "win $100", category: "Giveaway Cash", severity: "high" },
    { term: "win bitcoin", category: "Giveaway Crypto", severity: "high" },
    { term: "follow my account will be entered", category: "Giveaway", severity: "high" },
    { term: "like this post will be entered", category: "Giveaway", severity: "high" },
  ],

  // ============================================
  // FAKE FUNCTIONALITY
  // ============================================
  fakeFunctionality: [
    // Portuguese
    { term: "ver quem viu seu perfil", category: "Fake Functionality", severity: "high" },
    { term: "ver quem visitou seu perfil", category: "Fake Functionality", severity: "high" },
    { term: "botão de não gostar", category: "Fake Functionality", severity: "high" },
    { term: "mudar cor do instagram", category: "Fake Functionality", severity: "high" },
    { term: "aumentar algoritmo", category: "Fake Functionality", severity: "high" },
    { term: "hackear algoritmo", category: "Fake Functionality", severity: "high" },
    
    // English
    { term: "see who viewed your profile", category: "Fake Functionality", severity: "high" },
    { term: "see who views your instagram", category: "Fake Functionality", severity: "high" },
    { term: "dislike button", category: "Fake Functionality", severity: "high" },
    { term: "get a dislike button", category: "Fake Functionality", severity: "high" },
    { term: "change instagram color", category: "Fake Functionality", severity: "high" },
    { term: "boost algorithm", category: "Fake Functionality", severity: "high" },
    { term: "boost who sees you", category: "Fake Functionality", severity: "high" },
    { term: "mass delete followers", category: "Fake Functionality", severity: "high" },
    { term: "see who doesn't follow you back", category: "Fake Functionality", severity: "high" },
    { term: "recover deleted messages", category: "Fake Functionality", severity: "high" },
    { term: "premium instagram", category: "Fake Functionality", severity: "high" },
  ],

  // ============================================
  // DOMAIN IMPERSONATION
  // ============================================
  domainImpersonation: [
    { term: "faceb00k.com", category: "Domain Impersonation", severity: "critical" },
    { term: "facebok.com", category: "Domain Impersonation", severity: "critical" },
    { term: "amaz0n.com", category: "Domain Impersonation", severity: "critical" },
    { term: "g00gle.com", category: "Domain Impersonation", severity: "critical" },
    { term: "paypa1.com", category: "Domain Impersonation", severity: "critical" },
    { term: "instgram.com", category: "Domain Impersonation", severity: "critical" },
    { term: "instagran.com", category: "Domain Impersonation", severity: "critical" },
    { term: "lnstagram.com", category: "Domain Impersonation", severity: "critical" },
    { term: "whatsap.com", category: "Domain Impersonation", severity: "critical" },
    { term: "whatssapp.com", category: "Domain Impersonation", severity: "critical" },
  ],

  // ============================================
  // DECEPTIVE LINK INDICATORS
  // ============================================
  deceptiveLinks: [
    { term: "click here to claim", category: "Deceptive Link", severity: "high" },
    { term: "clique aqui para receber", category: "Deceptive Link", severity: "high" },
    { term: "share to 3 groups", category: "Deceptive Link", severity: "high" },
    { term: "partilhar em 3 grupos", category: "Deceptive Link", severity: "high" },
    { term: "share with 5 friends", category: "Deceptive Link", severity: "high" },
    { term: "share with friends to claim", category: "Deceptive Link", severity: "high" },
  ],
};

// ============================================
// SPAM POLICY CONTENT (Full text for AI context)
// ============================================

export const SPAM_POLICY_CONTENT = `
# SPAM POLICY

## POLICY RATIONALE
Não permitimos conteúdo projetado para enganar, iludir ou sobrecarregar utilizadores para aumentar visualizações artificialmente. Este conteúdo prejudica a capacidade das pessoas de interagir autenticamente e pode ameaçar a segurança, estabilidade e usabilidade dos nossos serviços.

Também procuramos prevenir táticas abusivas como:
- Espalhar links enganosos
- Funcionalidade ou código enganoso
- Imitar domínios de confiança

## 1. ENGAGEMENT ABUSE & SALE

### 1.a Compra/Venda de Engagement e Privilégios (LABEL)

**Conteúdo que oferece, solicita ou troca:**
- Likes, Comments, Shares, Follows
- Contas Facebook ou Instagram
- Páginas ou Grupos Facebook
- Posições de Admin/Moderador
- Serviços de Account Takedown/Restoration

**Site Privileges (Lista Oficial):**
- Admin and moderator roles
- Admin and moderator permissions
- Facebook or Instagram accounts
- Profiles
- Posts
- Posting permissions
- Likes, shares, comments, follows
- Facebook Pages or Groups
- Account Takedown or Restoration services

**Exemplos violadores:**
- "Admin role for sale to highest bidder"
- "I want to buy your Instagram account"
- "I want to buy a Page with 10k followers"
- "Who needs an extra 10k followers?"
- "Likes, Price Negotiable"
- "If you want cheap followers, DM me"
- "Likes, shares, follows available. DM"
- "I can connect you to someone that can give you 10k likes"

### 1.b Engagement for Engagement (Assimétrico) (LABEL)

**Viola quando:**
- Engagement oferecido > engagement pedido ("50 shares por 1 share")
- Engagement impossível por única conta ("10 likes pelo seu 1 like")
- Trading accounts across platforms ("Trade my 100k FB for 10k Threads")

**Exemplos violadores:**
- "Anyone who shares my Page will receive 50 shares"
- "If you like my picture, I will like one of yours 10 times"
- "To gain 100 likes, like this photo and share it in 3 groups"

**NÃO viola (simétrico):**
- "Like my post, I'll like yours"
- "Follow for follow"
- Celebrity takeovers (transparentes e temporárias)

### 1.c Exchanges (LABEL)

**Definição:** Simple offer (If you do X, I'll give you Y)

**Viola quando AMBOS:**
1. Condição é engagement
2. Recompensa tem valor monetário

**Exemplos violadores:**
- "Like = $5"
- "Follow = iPhone"
- "Follow = magazine every month"

**NÃO viola:**
- "Share = my love and admiration" (sem valor monetário)
- Desktop wallpaper grátis
- Coupons, descontos, ofertas especiais (BOGO)
- Loans

### 1.d Giveaways (LABEL)

**Definição:** Contest/raffle onde entrants têm CHANCE de ganhar (não garantido)

**Viola quando AMBOS:**
1. Condição de entrada é engagement
2. Prémio é: Cash, Cryptocurrency, Precious Metals

**Exemplos violadores:**
- "Follow to win $100" (cash)
- "Like to win 5 Ethereum" (crypto)

**NÃO viola:**
- Gift cards como prémio
- In-game currency como prémio
- Prémio não especificado (assume valor monetário mas não cash)

**Nota:** Se "ganha" sem referência a giveaway anterior → tratar como Exchange

### 1.e Engagement Gating (LABEL)

**Definição:** Exigir engagement público para ver conteúdo prometido

**Requisitos para violar:**
- Conteúdo específico (não futuro)
- Conteúdo existente
- Oferecido apenas a quem engaja

**Exemplos violadores:**
- "Before seeing celebrity's shocking video, like and share"
- "Like and follow to see exclusive video"
- "If you mention me I'll send you free video" (específico)

**NÃO viola:**
- "Like and subscribe to see new videos when they come out" (futuro)
- "DM me for content" (não público)
- Creator subscriptions
- Facebook Group membership questions

### 1.f Fake/Non-Existent Functionality (LABEL)

**Funcionalidades que NÃO existem:**
- Dislike button
- See who viewed your profile
- Change Instagram UI color
- Charge monthly fees/premium IG
- Boost algorithm visibility
- Manipulate Meta algorithm
- Mass delete followers
- See who doesn't follow back
- Recover deleted messages/chats
- Recover messages taken down by Meta
- Unlock restricted accounts
- Content/comment takedowns

**Funcionalidades REAIS (não viola):**
- Posts: Like, Favorite, Save, Hide, Turn on notifications, Copy link, Snooze, View edit history, Manage your feed
- IG Profiles: Follow, Unfollow, Mute, Report, Block, Restrict, Copy profile URL, Share profile, Message, Add to close friends, Add to favorites
- FB Profiles: Report, Block, View main profile, Video/Audio call, View friendship, Help user, Search, Unfollow
- Ads: Show more, Show less, Save link, Hide ad, Report ad
- Groups: Search, Join, Share, Manage content, Manage badges, Manage notifications, Pin, Report, Sort comments

**Exemplos violadores:**
- "Get a dislike button!"
- "How to see who views your Instagram"
- "Boost who sees you in the algorithm"
- "Mass delete followers on Instagram"
- "View who doesn't follow you back"

**NÃO viola:**
- "I wish Threads had a dislike button!" (wishful)
- "View who you don't follow back" (real)
- "Hide posts from friends" (real)

## 2. DECEPTIVE LINKS

### 2.a Cloaking (LABEL)
Mostrar conteúdo diferente a sistemas Meta vs utilizadores.
- Content benign para Meta, violating para users

### 2.b Misleading Link (LABEL)
Link promete um tipo de conteúdo mas entrega algo substancialmente diferente.

**Exemplos violadores:**
- Promete fotos de animais → leva a pornografia
- Promete notícias de futebol → leva a política

**NÃO viola:**
- Mais geral que prometido (futebol → desportos)
- Mais específico que prometido (animais → gatos)
- Link com erro/404
- Shampoo ad → Hair oil (same brand, same category)

### 2.c Deceptive Redirect Behavior (LABEL)
Websites que redirecionam automaticamente ou após ação.
- Click captcha → different domain
- Watch ad → different site
- Auto-redirect to different domain

### 2.d Like/Share-Gating (Landing Page) (LABEL)
Landing pages que exigem engagement para acesso.
- "Share our page to see video"

**NÃO viola:**
- "If you like my blogspot, I'd appreciate if you like my FB page" (não required)

### 2.e Deceptive Platform Functionality (LABEL)
Imitar funcionalidades Meta que não funcionam.
- Fake play button (links to unrelated site)
- Fake like button
- Fake poll
- Fake live video indicator
- Fake Facebook photo album

**Exceções:**
- IG Story previews (play button that links to video)
- Screenshots com play button (users unlikely deceived)
- Real videos with play button

### 2.f Deceptive Landing Page Functionality (LABEL)
- Pop-ups/pop-unders
- Clickjacking
- Trapping (pop-ups when leaving)

### 2.g Domain Impersonation (LABEL)
Imitar marcas conhecidas através de:
- Typos: faceb00k.com, amaz0n.com
- Misspellings: instagran.com, facebok.com
- Additions: bbc.com-latest-news.xyz
- Similar: FOXNNEWs.us, amazon-customerservice.com

**Exemplos violadores:**
- faceb00k.com
- amaz0n.com
- facebookstore.com/metacoin
- bbc.com-latest-news.xyz
- FOXNNEWs.us
- amazon-customerservice.com (fake)

**NÃO viola:**
- Regional domains: amazon.com, amazon.co.uk, amazon.es
- News aggregators showing brand logos (reddit showing CNN)

## HIERARCHY

1. Soliciting Purchase/Sale of Engagement/Privileges
2. Engagement Gating
3. Fake Functionality
4. Deceptive Links:
   - Misleading Link
   - Like/Share-Gating
   - Deceptive Platform Functionality
   - Domain Impersonation

## NOT SPAM (No Action)

- Low quality content ("tHiS cRRazzY")
- Irrelevant content (weather on movie post)
- Click-bait/content farms
- Adult nudity → Adult policy
- Fraud → Fraud & Deception policy
- Mass activity in messaging (not violating per IS)

## MONETARY VALUE DEFINITIONS

**HAS Monetary Value:**
- Fiat currency (USD, EUR, GBP)
- Cryptocurrency (Bitcoin, Ethereum)
- Precious metals (gold, silver)
- Gift cards
- Mobile phones, cars, food
- Purchasable goods

**NO Monetary Value:**
- Intangibles (love, respect)
- Social interactions
- Coupons, special offers (BOGO)
- Loans
- Desktop wallpapers (free)
- Negligible items (peppercorn, toothpick)

## EXCEPTIONS

1. **Cross-promotion** sem pagamento a terceiros
2. **Admin transfer** baseado em interesse, não troca de valor
3. **Branded content** claramente identificado (#ad, #sponsored)
4. **Engagement simétrico** (like-for-like, follow-for-follow)
5. **Sem valor monetário** (amor, admiração, wallpapers grátis)
6. **Gift cards em giveaways** (não cash/crypto)
7. **Conteúdo futuro** ("subscribe for new videos")
8. **DM for access** (sem engagement público)
9. **Creator subscriptions**
10. **Condemning spam** (sem links funcionais)
11. **Links com erro/404**

## MESSAGE REVIEW SPECIFICS

**NOT Violating:**
- Mass activity (high frequency messaging ≠ spam)
- Giveaways WITHOUT engagement requirement
- Requiring DM to third-party app (Signal, LINE, iMessage)

**Violating:**
- Engagement Sales
- Engagement Abuse (gating)
- Fake Functionalities
- Deceptive Links

**URL Review in Messaging:**
- Use Crawler or hover functions
- If both don't work → assume NOT deceptive
- If leads to CSAM/ASS → hierarchy to those policies
`;

export default SPAM_POLICY;