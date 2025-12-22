// ============================================
// CYBER - Cybersecurity Policy
// Segurança cibernética e proteção de dados
// ============================================

import { PolicyDefinition } from "@/lib/types";

export const CYBER_POLICY: PolicyDefinition = {
  id: "cyber",
  name: "Cybersecurity",
  shortName: "Cyber",
  description:
    "Protege utilizadores contra tentativas de recolha de informações sensíveis ou acesso não autorizado através de métodos enganosos ou invasivos. Inclui phishing, malware, hacking e violações de segurança.",
  color: "#0e7490",
  icon: "🔐",
  ready: true,

  categories: [
    // ============================================
    // UNAUTHORIZED ACCOUNT & DATA ACCESS
    // ============================================
    {
      id: "unauthorized-access",
      name: "Unauthorized Account & Data Access",
      description: "Acesso não autorizado a contas e dados",
      severity: "high",
      subcategories: [
        {
          id: "phishing",
          name: "Phishing",
          description: "Comunicações ou websites falsos para obter informações sensíveis",
          examples: [
            "Fake login pages for Meta products",
            "Messages claiming account restriction with fake links",
            "Spoofed emails requesting credentials",
            "Fake security alerts with malicious links",
          ],
        },
        {
          id: "social-engineering",
          name: "Social Engineering",
          description: "Manipulação para obter credenciais ou informações sensíveis",
          examples: [
            "Repeated questions about security answers",
            "Requests for password under false promises",
            "Mother's maiden name harvesting",
            "First car/school questions harvesting",
          ],
        },
        {
          id: "sharing-login-info",
          name: "Publicly Sharing Login Information",
          description: "Partilha pública de credenciais de login de outros",
          examples: [
            "Leaked account credentials",
            "Lists of passwords",
            "Links to credential dumps",
            "Sharing others' login details",
          ],
        },
        {
          id: "hacking-threats",
          name: "Threatening/Supporting/Admitting to Hacking",
          description: "Ameaças, apoio ou admissão de hacking",
          examples: [
            "Offering hacking services",
            "Threatening to hack accounts",
            "Admitting to hacking",
            "Tutorials on hacking accounts",
          ],
        },
      ],
    },
    // ============================================
    // MALICIOUS & HARMFUL CODE
    // ============================================
    {
      id: "malicious-code",
      name: "Malicious & Harmful Code",
      description: "Código malicioso, malware, spyware e downloads automáticos",
      severity: "high",
      subcategories: [
        {
          id: "malware",
          name: "Malware",
          description: "Programas maliciosos para danificar ou aceder a sistemas",
          examples: [
            "Viruses",
            "Trojans",
            "Ransomware",
            "Keyloggers",
            "RATs (Remote Access Trojans)",
          ],
        },
        {
          id: "spyware",
          name: "Spyware",
          description: "Código que recolhe dados sem consentimento",
          examples: [
            "Phone monitoring apps",
            "Location trackers without consent",
            "Screen capture software",
            "Keyloggers",
          ],
        },
        {
          id: "greyware",
          name: "Greyware",
          description: "Software que prejudica uso de hardware/software",
          examples: [
            "Adware",
            "Browser hijackers",
            "Potentially Unwanted Programs (PUPs)",
          ],
        },
        {
          id: "automatic-download",
          name: "Automatic Download",
          description: "Links que causam download automático ao abrir",
          examples: [
            "Links ending in .exe, .apk, .zip",
            "Drive-by downloads",
            "Google Drive download links",
            "Auto-executing files",
          ],
        },
        {
          id: "circumventing-security",
          name: "Circumventing Security Systems",
          description: "Software para contornar sistemas de segurança",
          examples: [
            "Hacking tools",
            "Password crackers",
            "Account hacking services",
            "Ethical hacking courses for malicious purposes",
          ],
        },
        {
          id: "disrupting-communication",
          name: "Disrupting Communication/Signal Sharing",
          description: "Dispositivos para interromper comunicações",
          examples: [
            "Cell phone jammers",
            "Signal blockers",
            "Descrambling devices",
            "GPS jammers",
          ],
        },
      ],
    },
  ],

  // ============================================
  // LABEL HIERARCHY (Priority Order)
  // ============================================
  labelHierarchy: [
    {
      id: "cyber-phishing",
      label: "LABEL > Cybersecurity > Phishing",
      path: ["LABEL", "Cybersecurity", "Phishing"],
      action: "label",
      severity: "high",
      conditions: ["Fake login page", "Spoofed communications", "Credential harvesting"],
    },
    {
      id: "cyber-social-engineering",
      label: "LABEL > Cybersecurity > Social Engineering",
      path: ["LABEL", "Cybersecurity", "Social Engineering"],
      action: "label",
      severity: "high",
      conditions: ["Manipulation for credentials", "Security question harvesting"],
    },
    {
      id: "cyber-login-sharing",
      label: "LABEL > Cybersecurity > Publicly Sharing Login Information",
      path: ["LABEL", "Cybersecurity", "Publicly Sharing Login Information"],
      action: "label",
      severity: "high",
      conditions: ["Sharing others' credentials", "Leaked login data"],
    },
    {
      id: "cyber-automatic-download",
      label: "LABEL > Cybersecurity > Automatic Download",
      path: ["LABEL", "Cybersecurity", "Automatic Download"],
      action: "label",
      severity: "high",
      conditions: ["Auto-download on page load", "Malicious file links"],
    },
    {
      id: "cyber-circumvent-security",
      label: "LABEL > Cybersecurity > Circumventing Security Systems",
      path: ["LABEL", "Cybersecurity", "Circumventing Security Systems"],
      action: "label",
      severity: "high",
      conditions: ["Hacking tools", "Password crackers", "Spy software"],
    },
    {
      id: "cyber-disrupt-communication",
      label: "LABEL > Cybersecurity > Disrupt Communication or Signal Sharing",
      path: ["LABEL", "Cybersecurity", "Disrupt Communication or Signal Sharing"],
      action: "label",
      severity: "mid",
      conditions: ["Jammers", "Signal blockers"],
    },
  ],

  // ============================================
  // EXCEPTIONS
  // ============================================
  exceptions: [
    {
      id: "condemnation",
      name: "Condemnation Context",
      description: "Conteúdo partilhado para condenar cybersecurity violations (mas links funcionais ainda violam)",
      appliesTo: ["all"],
    },
    {
      id: "academic-discussion",
      name: "Academic Discussion",
      description: "Discussão académica sobre segurança",
      appliesTo: ["disrupting-communication"],
    },
    {
      id: "legitimate-security",
      name: "Legitimate Security Tools",
      description: "Ferramentas de segurança legítimas para proteção própria",
      appliesTo: ["circumventing-security"],
    },
  ],

  // ============================================
  // SENSITIVE USER INFORMATION (Glossary)
  // ============================================
  sensitiveUserInfo: [
    "Usernames",
    "Email Addresses",
    "Passwords",
    "Security question answers",
    "Financial data (Credit Card, Bank info)",
    "Social Security numbers",
    "Government ID information",
    "Other PII",
  ],

  // ============================================
  // LEGITIMATE META DOMAINS
  // ============================================
  legitimateMetaDomains: [
    "facebook.com",
    "instagram.com",
    "whatsapp.com",
    "threads.com",
    "fb.me",
    "fb.com",
    "messenger.com",
    "meta.com",
    "oculus.com",
    "fbcdn.net",
    "whatsapp.net",
    "facebook-hardware.com",
    "cdninstagram.com",
    "wa.me",
  ],

  // ============================================
  // COMMON SECURITY QUESTIONS (for social engineering detection)
  // ============================================
  securityQuestions: [
    "mother's maiden name",
    "grandmother's maiden name",
    "relative's middle name",
    "first car make and model",
    "favorite pizza toppings",
    "favorite movie",
    "elementary school",
    "middle school",
    "high school name",
    "pet's name",
    "street you grew up on",
    "city you were born in",
  ],

  // ============================================
  // FILE EXTENSIONS (for automatic download detection)
  // ============================================
  dangerousFileExtensions: [
    ".exe",
    ".zip",
    ".doc",
    ".docx",
    ".pdf",
    ".apk",
    ".dmg",
    ".msi",
    ".bat",
    ".cmd",
    ".ps1",
    ".vbs",
    ".js",
    ".jar",
    ".rar",
    ".7z",
  ],

  keywordsLoaded: true,
};

// ============================================
// CYBER KEYWORDS - Portuguese + English
// ============================================

export const CYBER_KEYWORDS = {
  // ============================================
  // PHISHING
  // ============================================
  phishing: [
    // Portuguese
    { term: "sua conta foi bloqueada", severity: "high", category: "Phishing" },
    { term: "sua conta foi suspensa", severity: "high", category: "Phishing" },
    { term: "verificar sua conta", severity: "mid", category: "Phishing", requiresContext: true },
    { term: "confirme sua identidade", severity: "mid", category: "Phishing", requiresContext: true },
    { term: "clique aqui para verificar", severity: "high", category: "Phishing" },
    { term: "link expira em", severity: "mid", category: "Phishing", requiresContext: true },
    { term: "violação de política", severity: "mid", category: "Phishing", requiresContext: true },
    { term: "sua página foi sinalizada", severity: "high", category: "Phishing" },
    { term: "ação necessária na sua conta", severity: "high", category: "Phishing" },
    { term: "página de login falsa", severity: "high", category: "Phishing" },
    
    // English
    { term: "your account has been blocked", severity: "high", category: "Phishing" },
    { term: "your account has been suspended", severity: "high", category: "Phishing" },
    { term: "verify your account", severity: "mid", category: "Phishing", requiresContext: true },
    { term: "confirm your identity", severity: "mid", category: "Phishing", requiresContext: true },
    { term: "click here to verify", severity: "high", category: "Phishing" },
    { term: "link expires in", severity: "mid", category: "Phishing", requiresContext: true },
    { term: "policy violation", severity: "mid", category: "Phishing", requiresContext: true },
    { term: "your page has been flagged", severity: "high", category: "Phishing" },
    { term: "action required on your account", severity: "high", category: "Phishing" },
    { term: "fake login page", severity: "high", category: "Phishing" },
  ],

  // ============================================
  // SOCIAL ENGINEERING
  // ============================================
  socialEngineering: [
    // Portuguese
    { term: "qual o nome de solteira", severity: "mid", category: "Social Engineering", requiresContext: true },
    { term: "dê-me sua senha", severity: "high", category: "Social Engineering" },
    { term: "me passa sua senha", severity: "high", category: "Social Engineering" },
    { term: "qual foi seu primeiro carro", severity: "mid", category: "Social Engineering", requiresContext: true },
    { term: "em que escola estudou", severity: "mid", category: "Social Engineering", requiresContext: true },
    { term: "desbloquear sua conta", severity: "mid", category: "Social Engineering", requiresContext: true },
    
    // English
    { term: "what is your mother's maiden name", severity: "mid", category: "Social Engineering", requiresContext: true },
    { term: "give me your password", severity: "high", category: "Social Engineering" },
    { term: "share your password", severity: "high", category: "Social Engineering" },
    { term: "what was your first car", severity: "mid", category: "Social Engineering", requiresContext: true },
    { term: "where did you go to school", severity: "mid", category: "Social Engineering", requiresContext: true },
    { term: "unlock your account", severity: "mid", category: "Social Engineering", requiresContext: true },
    { term: "recovery code", severity: "mid", category: "Social Engineering", requiresContext: true },
  ],

  // ============================================
  // LOGIN SHARING
  // ============================================
  loginSharing: [
    // Portuguese
    { term: "senhas vazadas", severity: "high", category: "Login Sharing" },
    { term: "contas vazadas", severity: "high", category: "Login Sharing" },
    { term: "lista de senhas", severity: "high", category: "Login Sharing" },
    { term: "credenciais vazadas", severity: "high", category: "Login Sharing" },
    { term: "login e senha de", severity: "high", category: "Login Sharing" },
    
    // English
    { term: "leaked passwords", severity: "high", category: "Login Sharing" },
    { term: "leaked accounts", severity: "high", category: "Login Sharing" },
    { term: "password list", severity: "high", category: "Login Sharing" },
    { term: "leaked credentials", severity: "high", category: "Login Sharing" },
    { term: "login details", severity: "mid", category: "Login Sharing", requiresContext: true },
    { term: "account dump", severity: "high", category: "Login Sharing" },
    { term: "credential dump", severity: "high", category: "Login Sharing" },
  ],

  // ============================================
  // HACKING
  // ============================================
  hacking: [
    // Portuguese
    { term: "hackear conta", severity: "high", category: "Hacking" },
    { term: "hackear facebook", severity: "high", category: "Hacking" },
    { term: "hackear instagram", severity: "high", category: "Hacking" },
    { term: "hackear whatsapp", severity: "high", category: "Hacking" },
    { term: "serviços de hacker", severity: "high", category: "Hacking" },
    { term: "contratar hacker", severity: "high", category: "Hacking" },
    { term: "como hackear", severity: "high", category: "Hacking" },
    { term: "tutorial hacking", severity: "high", category: "Hacking" },
    { term: "invadir conta", severity: "high", category: "Hacking" },
    { term: "clonar whatsapp", severity: "high", category: "Hacking" },
    { term: "clonar celular", severity: "high", category: "Hacking" },
    { term: "espionar celular", severity: "high", category: "Hacking" },
    { term: "rastrear celular", severity: "mid", category: "Hacking", requiresContext: true },
    
    // English
    { term: "hack account", severity: "high", category: "Hacking" },
    { term: "hack facebook", severity: "high", category: "Hacking" },
    { term: "hack instagram", severity: "high", category: "Hacking" },
    { term: "hack whatsapp", severity: "high", category: "Hacking" },
    { term: "hacking services", severity: "high", category: "Hacking" },
    { term: "hire hacker", severity: "high", category: "Hacking" },
    { term: "how to hack", severity: "high", category: "Hacking" },
    { term: "hacking tutorial", severity: "high", category: "Hacking" },
    { term: "clone whatsapp", severity: "high", category: "Hacking" },
    { term: "clone phone", severity: "high", category: "Hacking" },
    { term: "spy on phone", severity: "high", category: "Hacking" },
    { term: "track phone", severity: "mid", category: "Hacking", requiresContext: true },
    { term: "monitoring app", severity: "mid", category: "Hacking", requiresContext: true },
    { term: "location tracker", severity: "mid", category: "Hacking", requiresContext: true },
    { term: "ethical hacking", severity: "mid", category: "Hacking", requiresContext: true },
    { term: "web defacement", severity: "high", category: "Hacking" },
    { term: "ddos attack", severity: "high", category: "Hacking" },
    { term: "denial of service", severity: "high", category: "Hacking" },
  ],

  // ============================================
  // MALWARE & HARMFUL CODE
  // ============================================
  malware: [
    // Portuguese
    { term: "malware", severity: "high", category: "Malware" },
    { term: "vírus", severity: "mid", category: "Malware", requiresContext: true },
    { term: "trojan", severity: "high", category: "Malware" },
    { term: "ransomware", severity: "high", category: "Malware" },
    { term: "keylogger", severity: "high", category: "Malware" },
    { term: "spyware", severity: "high", category: "Malware" },
    { term: "greyware", severity: "mid", category: "Malware" },
    { term: "rat trojan", severity: "high", category: "Malware" },
    { term: "baixar automaticamente", severity: "mid", category: "Automatic Download", requiresContext: true },
    
    // English
    { term: "virus download", severity: "high", category: "Malware" },
    { term: "trojan horse", severity: "high", category: "Malware" },
    { term: "remote access trojan", severity: "high", category: "Malware" },
    { term: "auto download", severity: "mid", category: "Automatic Download", requiresContext: true },
    { term: "drive-by download", severity: "high", category: "Automatic Download" },
  ],

  // ============================================
  // CIRCUMVENTING SECURITY
  // ============================================
  circumventingSecurity: [
    // Portuguese
    { term: "quebrar senha", severity: "high", category: "Circumventing Security" },
    { term: "crackear conta", severity: "high", category: "Circumventing Security" },
    { term: "burlar segurança", severity: "high", category: "Circumventing Security" },
    { term: "software de espionagem", severity: "high", category: "Circumventing Security" },
    { term: "app espião", severity: "high", category: "Circumventing Security" },
    
    // English
    { term: "password cracker", severity: "high", category: "Circumventing Security" },
    { term: "crack password", severity: "high", category: "Circumventing Security" },
    { term: "bypass security", severity: "high", category: "Circumventing Security" },
    { term: "spy software", severity: "high", category: "Circumventing Security" },
    { term: "spy app", severity: "high", category: "Circumventing Security" },
    { term: "installation on other device not required", severity: "high", category: "Circumventing Security" },
  ],

  // ============================================
  // DISRUPTING COMMUNICATION
  // ============================================
  disruptingCommunication: [
    // Portuguese
    { term: "bloqueador de sinal", severity: "high", category: "Disrupting Communication" },
    { term: "jammer celular", severity: "high", category: "Disrupting Communication" },
    { term: "inibidor de sinal", severity: "high", category: "Disrupting Communication" },
    { term: "bloquear sinal", severity: "mid", category: "Disrupting Communication", requiresContext: true },
    
    // English
    { term: "cell phone jammer", severity: "high", category: "Disrupting Communication" },
    { term: "signal jammer", severity: "high", category: "Disrupting Communication" },
    { term: "signal blocker", severity: "high", category: "Disrupting Communication" },
    { term: "gps jammer", severity: "high", category: "Disrupting Communication" },
    { term: "descrambling device", severity: "high", category: "Disrupting Communication" },
    { term: "intercept signal", severity: "high", category: "Disrupting Communication" },
  ],

  // ============================================
  // SUSPICIOUS URL PATTERNS
  // ============================================
  suspiciousUrls: [
    { term: "faceb00k.com", severity: "critical", category: "Phishing URL" },
    { term: "facebok.com", severity: "critical", category: "Phishing URL" },
    { term: "facebook-security", severity: "high", category: "Phishing URL", requiresContext: true },
    { term: "fb-support", severity: "high", category: "Phishing URL", requiresContext: true },
    { term: "instagram-verify", severity: "high", category: "Phishing URL", requiresContext: true },
    { term: "whatsapp-verify", severity: "high", category: "Phishing URL", requiresContext: true },
    { term: "meta-support", severity: "high", category: "Phishing URL", requiresContext: true },
    { term: "account-verify", severity: "high", category: "Phishing URL", requiresContext: true },
    { term: "login-verify", severity: "high", category: "Phishing URL", requiresContext: true },
    { term: "bit.ly", severity: "low", category: "Shortened URL", requiresContext: true },
    { term: "tinyurl", severity: "low", category: "Shortened URL", requiresContext: true },
    { term: "url.zip", severity: "high", category: "Suspicious URL" },
    { term: "bio.link", severity: "mid", category: "Link Service", requiresContext: true },
  ],
};

// ============================================
// CYBER POLICY CONTENT (Full text for AI context)
// ============================================

export const CYBER_POLICY_CONTENT = `
# CYBERSECURITY POLICY

## POLICY RATIONALE
Reconhecemos que a segurança dos utilizadores inclui a proteção das suas informações pessoais, contas, perfis e outras entidades que possam gerir, bem como os nossos produtos e serviços de forma mais ampla. Tentativas de recolher informações sensíveis ou obter acesso não autorizado através de métodos enganosos ou invasivos são prejudiciais ao ambiente autêntico, aberto e seguro que queremos fomentar.

Portanto, não permitimos tentativas de recolher informações sensíveis do utilizador ou obter acesso não autorizado através do abuso da nossa plataforma, produtos ou serviços.

## 1. UNAUTHORIZED ACCOUNT & DATA ACCESS

### 1.a Accessing Accounts Without Permission
LABEL: Aceder a contas, perfis ou entidades Meta através de meios enganosos ou sem permissão explícita do proprietário.

### 1.b Obtaining Sensitive Information
LABEL: Obter, adquirir ou solicitar informações de login, informações pessoais ou outras informações sensíveis para acesso não autorizado.

**Métodos incluem:**
- **Phishing:** Criar comunicações ou websites falsos que parecem de fontes confiáveis para obter informações sensíveis fraudulentamente
- **Social Engineering:** Tentativas repetidas ou consistentes de obter respostas a perguntas comuns de recuperação de conta
- **Malware, Greyware, Spyware:** Código malicioso para obter acesso

### 1.c Threatening/Supporting/Admitting to Hacking
LABEL: Ameaçar, apoiar ou admitir hacking.

**Atividades incluem:**
- Oferecer/solicitar serviços para hackear contas
- Web defacements
- Denial of Service attacks
- Ameaçar aceder a dados não autorizados
- Tutoriais de hacking

### 1.d Publicly Sharing Login Information
LABEL: Partilhar publicamente informações de login de outros, na plataforma ou via serviço de terceiros.

## 2. MALICIOUS & HARMFUL CODE

### 2.a Encouraging Downloads of Malicious Files
LABEL: Encorajar ou enganar utilizadores a fazer download de ficheiros que comprometem a segurança.

**Tipos:**
- **Malware:** Programas maliciosos para danificar ou aceder a sistemas, incluindo ransomware
- **Greyware:** Software que prejudica uso de hardware/software
- **Spyware:** Código que recolhe dados sem consentimento e envia a terceiros

### 2.b Automatic Downloads
LABEL: Links que causam download automático ao abrir a landing page.

**Indicadores:**
- URL termina em extensão de ficheiro (.exe, .zip, .doc, .pdf, .apk)
- Google Drive link com "download&id"
- Download automático acionado ao clicar

### 2.c Creating/Sharing Malicious Software
LABEL: Criar, partilhar ou hospedar software malicioso, incluindo browser extensions e apps móveis.

### 2.d Circumventing Security Systems
LABEL: Partilhar ou anunciar software que permite contornar sistemas de segurança.

**Palavras-chave suspeitas:**
- "spy", "hack", "clone", "monitoring", "location tracker"
- "installation on other device not required"
- Ofertas de hacking de contas, dispositivos, sistemas
- Cursos de "ethical hacking" para fins maliciosos

### 2.e Disrupting Communication/Signal Sharing
LABEL: Anunciar software ou produtos para interromper comunicações ou sinais.

**Exemplos:**
- Cell phone jammers
- Descrambling devices
- GPS jammers
- Signal blockers

### 2.f Providing Abusive Infrastructure
LABEL: Fornecer infraestrutura online (hosting, DNS, ad networks) que permite links abusivos.

## HIERARCHY OF HARM (Priority Order)
1. Phishing
2. Social Engineering
3. Publicly Sharing Login Information
4. Automatic Download
5. Circumventing Security Systems
6. Disrupting Communication/Signal Sharing

## SENSITIVE USER INFORMATION
- Usernames
- Email Addresses
- Passwords
- Answers to security questions
- Financial Data (Credit Card, Bank info)
- Social Security / Government ID
- Other PII

## PHISHING DETECTION

### Com Screenshot de Landing Page:
LABEL se:
1. Screenshot mostra página de login Meta (Facebook, Instagram, WhatsApp, Messenger, Threads)
2. Domínio NÃO é legítimo Meta

### Domínios Legítimos Meta:
facebook.com, instagram.com, whatsapp.com, threads.com, fb.me, fb.com, messenger.com, meta.com, oculus.com, fbcdn.net, whatsapp.net, facebook-hardware.com, cdninstagram.com, wa.me

### Sem Screenshot (análise de texto):
LABEL se:
1. Texto notifica sobre restrição/violação/bloqueio/problema de segurança
2. Texto fala na voz de plataformas Meta
3. Pede ação através de link externo
4. Link não contém URL legítimo Meta

## SOCIAL ENGINEERING DETECTION

LABEL se:
- Manipulação para dar credenciais de login sob falsas promessas
- Perguntas de segurança repetidas (2+ vezes pelo mesmo poster)

**Perguntas de Segurança Comuns:**
- Qual o nome de solteira da sua mãe/avó?
- Qual o nome do meio do seu familiar?
- Qual foi seu primeiro carro?
- Qual sua pizza favorita?
- Qual seu filme favorito?
- Em que escola estudou?

## EXCEPTION
Conteúdo de cybersecurity partilhado em contexto de condenação clara NÃO viola, EXCETO se contiver links funcionais maliciosos (risco permanece).

## OPERATIONAL NOTES

### Extensões de Ficheiro Perigosas:
.exe, .zip, .doc, .pdf, .apk, .dmg, .msi, .bat, .cmd, .ps1, .vbs, .js, .jar, .rar, .7z

### Google Drive Downloads:
URLs com "export=download&id" indicam download automático

### Não Violar se:
- Nome do perfil/página contém "hack" ou "spy" mas conteúdo não oferece serviços
- Discussão académica sobre segurança
- Campanhas promocionais legítimas
`;

export default CYBER_POLICY;