"use client";

import { useState, useMemo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { POLICIES, POLICY_STATS } from "@/data/policies";
import {
  Shield,
  ChevronDown,
  ChevronRight,
  Search,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowRight,
  Tag,
  FileText,
  Scale,
  Users,
  Clock,
  Filter,
  Copy,
  Check,
} from "lucide-react";

// ============================================
// POLICY REFERENCE DATA
// Comprehensive data for each policy
// ============================================

interface PolicySection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

interface PolicyReferenceData {
  id: string;
  name: string;
  shortName: string;
  color: string;
  description: string;
  quickReference: string[];
  sections: PolicySection[];
  keywords: {
    category: string;
    terms: { term: string; severity: "critical" | "high" | "mid" | "low"; note?: string }[];
  }[];
  labelHierarchy: { label: string; action: "escalate" | "label" | "no_action"; description: string }[];
  clarifications: { question: string; answer: string }[];
}

const POLICY_REFERENCE: PolicyReferenceData[] = [
  // ============================================
  // CSEAN - Child Safety
  // ============================================
  {
    id: "csean",
    name: "Child Sexual Exploitation, Abuse, and Nudity",
    shortName: "CSEAN",
    color: "#dc2626",
    description: "Proteção de menores contra exploração sexual, abuso e conteúdo de nudez. A policy mais crítica - CSEAN tem SEMPRE prioridade sobre outras violações.",
    quickReference: [
      "Qualquer pessoa <18 anos é considerada menor",
      "Real ou não-real (arte, desenhos, AI) - ambos violam",
      "Age buckets: Baby (0-1.5), Toddler (1.5-4), Minor (4-18)",
      "Se incerto adulto/menor → assumir MENOR",
      "Se incerto real/não-real → assumir REAL (para escalação)",
    ],
    sections: [
      {
        id: "csam",
        title: "CSAM - Critérios de Escalação",
        icon: <AlertTriangle className="w-4 h-4" />,
        content: (
          <div className="space-y-4">
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">
              SEMPRE ESCALAR - Prioridade Máxima
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-2">Cenário 1: Sexual Intercourse</p>
                <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                  <li>• Genital-to-genital, genital-to-mouth, genital-to-anus</li>
                  <li>• Manual manipulation for arousal, masturbation</li>
                  <li>• Sexual fluids present, involving animals</li>
                  <li>• Foreign object insertion, imminent intercourse</li>
                </ul>
              </div>
              <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-2">Cenário 2: S&M Abuse</p>
                <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                  <li>• Inflicting pain/bondage/restraints em contexto fetiche</li>
                  <li>• Para propósito sexual</li>
                </ul>
              </div>
              <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-2">Cenário 3: Genitals + 2+ Sexual Elements</p>
                <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                  <li>• Genitais/ânus visível + 2 ou mais elementos:</li>
                  <li>• Focus on genitals, setting sexual, sexualized pose</li>
                  <li>• Imagery intended to elicit sexual response</li>
                </ul>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "solicitation",
        title: "Solicitação",
        icon: <Users className="w-4 h-4" />,
        content: (
          <div className="space-y-3">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Oferecendo, pedindo, admitindo posse ou tentando obter conteúdo sexualizado de menores.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                <p className="text-xs font-semibold text-zinc-500 mb-2">Sinais de Solicitação</p>
                <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                  <li>• "Looking for", "send me", "I want", "I'm selling"</li>
                  <li>• Pedidos de contato: phone, email, DM, inbox</li>
                  <li>• Links: Mega, DropBox, Telegram, Discord</li>
                  <li>• "I have it" + referência a menor</li>
                </ul>
              </div>
              <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                <p className="text-xs font-semibold text-zinc-500 mb-2">Plataformas de Risco</p>
                <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                  <li>• Telegram, Wickr, Signal, Discord</li>
                  <li>• Mega, DropBox, Kik, Snapchat</li>
                  <li>• Zalo, Viber, ZANGI, Enigma, ICQ</li>
                </ul>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "iic",
        title: "IIC - Interações Inapropriadas",
        icon: <AlertTriangle className="w-4 h-4" />,
        content: (
          <div className="space-y-3">
            <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <p className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-2">Sempre Escalar</p>
              <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                <li>• Soliciting/arranging sexual encounters with children</li>
                <li>• Adults enticing children to engage in sexual activity</li>
                <li>• Minors enticing children (requer PE em superfícies públicas)</li>
              </ul>
            </div>
            <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
              <p className="text-xs font-semibold text-zinc-500 mb-2">Elementos de Enticement</p>
              <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                <li>• Sexualized conversations directed at child</li>
                <li>• Romantic interest expressions (adult→minor only)</li>
                <li>• Sharing nude content or requesting inappropriate imagery</li>
              </ul>
            </div>
            <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
              <p className="text-xs font-semibold text-zinc-500 mb-2">11 Aggravating Factors</p>
              <div className="grid grid-cols-2 gap-1 text-xs text-zinc-600 dark:text-zinc-400">
                <span>1. Meeting for Sex</span>
                <span>2. Meeting for Sodomy</span>
                <span>3. Coercion</span>
                <span>4. CSAM Offense</span>
                <span>5. Position of Trust</span>
                <span>6. Unsupervised Relationship</span>
                <span>7. Suicide/Self-Harm</span>
                <span>8. Incest</span>
                <span>9. Minor-on-Minor</span>
                <span>10. Sadism</span>
                <span>11. Bestiality</span>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "sextortion",
        title: "Sextortion",
        icon: <AlertTriangle className="w-4 h-4" />,
        content: (
          <div className="space-y-3">
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">
              SEMPRE ESCALAR
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Coercing money/favors/imagery with threats to expose nude/intimate content of child.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded text-center">
                <p className="text-xs font-medium">Financial</p>
                <p className="text-xs text-zinc-500">Money demanded</p>
              </div>
              <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded text-center">
                <p className="text-xs font-medium">Content</p>
                <p className="text-xs text-zinc-500">More imagery demanded</p>
              </div>
              <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded text-center">
                <p className="text-xs font-medium">Favor-based</p>
                <p className="text-xs text-zinc-500">Meeting/activity demanded</p>
              </div>
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Nota: Target NÃO precisa de cumprir - a ameaça é suficiente.
            </p>
          </div>
        ),
      },
      {
        id: "age-determination",
        title: "Determinação de Idade",
        icon: <Users className="w-4 h-4" />,
        content: (
          <div className="space-y-3">
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">5+ Sinais = Menor</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-semibold text-zinc-500 mb-1">Body Development</p>
                  <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-0.5">
                    <li>• Narrow shoulders (≤ face size)</li>
                    <li>• Physical underdevelopment</li>
                    <li>• Facial roundness</li>
                    <li>• Small hands/feet relative to body</li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-500 mb-1">Setting/Context</p>
                  <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-0.5">
                    <li>• School environment visible</li>
                    <li>• School uniform</li>
                    <li>• Backpacks/school materials</li>
                    <li>• Presence of other apparent minors</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
              <p className="text-xs font-semibold text-zinc-500 mb-2">Hierarquia de Sinais de Idade (IIC)</p>
              <ol className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                <li>1. <strong>Confessed Age</strong> - Idade confessada no thread</li>
                <li>2. <strong>Potential Age</strong> - Estimativa backend ("Potential Minor" tag)</li>
                <li>3. <strong>Listed Age</strong> - Idade no perfil</li>
                <li>4. <strong>Previous DOB</strong> - Data de nascimento anterior</li>
              </ol>
            </div>
          </div>
        ),
      },
    ],
    keywords: [
      {
        category: "CSAM Codes/Slang",
        terms: [
          { term: "cheese pizza", severity: "critical", note: "Code for CP" },
          { term: "CP", severity: "critical", note: "Child Porn" },
          { term: "MAP", severity: "critical", note: "Minor Attracted Person" },
          { term: "pedobait", severity: "critical" },
          { term: "mapfriendly", severity: "critical" },
          { term: "teen packs", severity: "critical" },
          { term: "jailbait", severity: "critical" },
          { term: "lolita", severity: "high", note: "Context required" },
          { term: "shota", severity: "high" },
          { term: "preteen", severity: "high" },
        ],
      },
      {
        category: "Portuguese Terms",
        terms: [
          { term: "nudes de menor", severity: "critical" },
          { term: "pack teen", severity: "critical" },
          { term: "novinha", severity: "mid", note: "Context required" },
          { term: "novinho", severity: "mid", note: "Context required" },
          { term: "pedofilia", severity: "critical" },
          { term: "abuso infantil", severity: "critical" },
        ],
      },
      {
        category: "Emoji Codes",
        terms: [
          { term: "🍕", severity: "high", note: "Pizza = CP" },
          { term: "🧀+🍕", severity: "high", note: "Cheese Pizza" },
          { term: "🌀", severity: "high", note: "Spiral = pedophilia" },
          { term: "🗺️", severity: "high", note: "MAP" },
          { term: "🧚‍♀️", severity: "mid", note: "Children reference" },
        ],
      },
    ],
    labelHierarchy: [
      { label: "ESCALATE > CSEAN > CSAM", action: "escalate", description: "Material de abuso sexual infantil" },
      { label: "ESCALATE > CSEAN > Sextortion", action: "escalate", description: "Extorsão sexual de menor" },
      { label: "ESCALATE > CSEAN > Solicitation", action: "escalate", description: "Solicitação de conteúdo de menores" },
      { label: "ESCALATE > CSEAN > IIC", action: "escalate", description: "Interações inapropriadas com crianças" },
      { label: "LABEL > CSEAN > CSE (non-real)", action: "label", description: "Exploração sexual (não-real)" },
      { label: "LABEL > CSEAN > Sexualization", action: "label", description: "Sexualização de menores" },
      { label: "LABEL > CSEAN > Child Nudity", action: "label", description: "Nudez infantil sem exploração" },
      { label: "LABEL > CSEAN > Non-Sexual Abuse", action: "label", description: "Abuso não-sexual" },
    ],
    clarifications: [
      {
        question: "Anime/manga com personagem aparentemente adulto mas em uniforme escolar?",
        answer: "Considerar como MENOR se houver 1+ indicador de criança (uniforme escolar, sala de aula, shoulders narrower than face). Usar guidance mesmo que personagem seja normalmente adulto no canon.",
      },
      {
        question: "Conteúdo gerado por AI de menores?",
        answer: "Tratado IGUAL a conteúdo real para efeitos de violação. Prompts para AI que gerariam CSAM também violam, mesmo que imagem não seja gerada.",
      },
      {
        question: "Idade incerta - adulto ou menor?",
        answer: "SEMPRE assumir MENOR. A proteção da criança tem prioridade.",
      },
      {
        question: "Contexto médico/educacional com nudez infantil?",
        answer: "Ainda é LABEL > Child Nudity, mas não escalate. Contexto médico legítimo é exceção para escalação.",
      },
    ],
  },

  // ============================================
  // B&H - Bullying and Harassment
  // ============================================
  {
    id: "bh",
    name: "Bullying and Harassment",
    shortName: "B&H",
    color: "#ea580c",
    description: "Proíbe ataques pessoais, assédio, termos depreciativos e conteúdo que visa humilhar ou degradar indivíduos. Sistema de 4 tiers de proteção baseado no tipo de figura.",
    quickReference: [
      "4 Tiers: Public Figure, LSPF, Private Adult, Private Minor",
      "Name/Face Match necessário para certas violações",
      "Purposeful Exposure (PE) em superfícies públicas",
      "Menores têm proteção extra",
      "Exceções: Business reviews, Fight sports, Endearing context",
    ],
    sections: [
      {
        id: "tiers",
        title: "Sistema de 4 Tiers",
        icon: <Users className="w-4 h-4" />,
        content: (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Tier 1: Universal</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                  Protege TODOS - Public Figures, LSPF, Private Adults, Private Minors
                </p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Tier 2: Minors + Private</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                  LSPF, Private Adults, Private Minors (exclui Public Figures)
                </p>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <p className="text-sm font-medium text-amber-700 dark:text-amber-300">Tier 3: Self-Reported</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                  Private Adults, Private Minors (apenas com self-report)
                </p>
              </div>
              <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <p className="text-sm font-medium text-red-700 dark:text-red-300">Tier 4: Minors Only</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                  Apenas Private Minors - proteção máxima
                </p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "nfm",
        title: "Name/Face Match (NFM)",
        icon: <CheckCircle className="w-4 h-4" />,
        content: (
          <div className="space-y-3">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Necessário para algumas violações. Requer correspondência entre nome/cara e ataque.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                <p className="text-xs font-semibold text-zinc-500 mb-2">Primary Features</p>
                <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-0.5">
                  <li>• Full name</li>
                  <li>• Face clearly visible</li>
                  <li>• Unique identifier (username)</li>
                </ul>
              </div>
              <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                <p className="text-xs font-semibold text-zinc-500 mb-2">Secondary Features</p>
                <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-0.5">
                  <li>• Location/workplace</li>
                  <li>• Profession/role</li>
                  <li>• Relationship to others</li>
                </ul>
              </div>
            </div>
            <div className="p-2 bg-blue-500/10 rounded border border-blue-500/20">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                <strong>Fórmula:</strong> 3 Primary Features OU 2 Primary + 1 Secondary
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "hierarchy",
        title: "Hierarquia de Labels",
        icon: <Scale className="w-4 h-4" />,
        content: (
          <div className="space-y-2">
            <p className="text-xs text-zinc-500 mb-2">Aplicar a label mais alta que corresponder:</p>
            <ol className="space-y-1.5">
              {[
                "Sexualized Harassment",
                "Calls for Death / SSI",
                "Sexual Activity Claims",
                "Violent Tragedies Mockery",
                "Dehumanizing Comparisons",
                "Negative Physical Description",
                "Targeted Cursing",
                "Negative Character Claims",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-xs">
                  <span className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-400 font-medium">
                    {i + 1}
                  </span>
                  <span className="text-zinc-700 dark:text-zinc-300">{item}</span>
                </li>
              ))}
            </ol>
          </div>
        ),
      },
      {
        id: "exceptions",
        title: "Exceções (No Action)",
        icon: <CheckCircle className="w-4 h-4" />,
        content: (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-2">Criminal Allegations</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Alegações criminais de interesse público (não para menores)
                </p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-2">Business Reviews</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Reviews legítimos de negócios/serviços
                </p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-2">Fight Sports</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Contexto de desportos de combate (MMA, boxe)
                </p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-2">Endearing Context</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Contexto de carinho entre amigos/família
                </p>
              </div>
            </div>
          </div>
        ),
      },
    ],
    keywords: [
      {
        category: "Calls for Death/SSI",
        terms: [
          { term: "mata-te", severity: "critical" },
          { term: "morre", severity: "critical" },
          { term: "kill yourself", severity: "critical" },
          { term: "kys", severity: "critical" },
          { term: "go die", severity: "critical" },
        ],
      },
      {
        category: "Sexual Harassment",
        terms: [
          { term: "puta", severity: "high" },
          { term: "vadia", severity: "high" },
          { term: "whore", severity: "high" },
          { term: "slut", severity: "high" },
        ],
      },
      {
        category: "Targeted Cursing",
        terms: [
          { term: "filho da puta", severity: "high" },
          { term: "fdp", severity: "high" },
          { term: "cabrão", severity: "mid" },
          { term: "idiota", severity: "mid" },
          { term: "imbecil", severity: "mid" },
          { term: "retardado", severity: "high" },
        ],
      },
      {
        category: "Dehumanizing",
        terms: [
          { term: "animal", severity: "mid", note: "Context required" },
          { term: "porco", severity: "mid" },
          { term: "verme", severity: "mid" },
          { term: "lixo", severity: "mid" },
          { term: "escumalha", severity: "mid" },
        ],
      },
    ],
    labelHierarchy: [
      { label: "ESCALATE > B&H > Calls for Death", action: "escalate", description: "Incitamento à morte/suicídio" },
      { label: "LABEL > B&H > Sexualized Harassment", action: "label", description: "Assédio sexualizado" },
      { label: "LABEL > B&H > Sexual Activity Claims", action: "label", description: "Alegações de atividade sexual" },
      { label: "LABEL > B&H > Dehumanizing", action: "label", description: "Comparações desumanizantes" },
      { label: "LABEL > B&H > Negative Physical", action: "label", description: "Descrições físicas negativas" },
      { label: "LABEL > B&H > Targeted Cursing", action: "label", description: "Insultos direcionados" },
      { label: "LABEL > B&H > Negative Character", action: "label", description: "Alegações negativas de caráter" },
    ],
    clarifications: [
      {
        question: "Insulto entre amigos com emojis de riso?",
        answer: "Verificar indicadores de Endearing Context: emojis positivos (😂🤣❤️), linguagem recíproca, histórico de amizade. Se presentes, é exceção.",
      },
      {
        question: "Review negativo de restaurante que menciona o dono?",
        answer: "Business review legítimo é exceção. Mas se incluir ataques pessoais não relacionados ao serviço (e.g., aparência física), pode violar.",
      },
      {
        question: "Public Figure vs LSPF - como distinguir?",
        answer: "LSPF (Limited Scope Public Figure) tem fama limitada a um tópico/área. Verificar se a pessoa é conhecida apenas num contexto específico.",
      },
    ],
  },

  // ============================================
  // V&I - Violence and Incitement
  // ============================================
  {
    id: "vi",
    name: "Violence and Incitement",
    shortName: "V&I",
    color: "#dc2626",
    description: "Proíbe ameaças credíveis de violência, incitamento à violência e declarações de intenção violenta contra pessoas ou grupos.",
    quickReference: [
      "Escalate = Target + Intent + High-Severity + (Timing OU Armament OU Location)",
      "Verificar Statement Type: Intent, Call for Action, Advocating, etc.",
      "Severidade: HIGH (matar, assassinar), MID (bater, espancar), LOW (empurrar)",
      "Exceções: Self-defense, Ficção, Condenação, Arrependimento",
    ],
    sections: [
      {
        id: "escalation",
        title: "Critérios de Escalação",
        icon: <AlertTriangle className="w-4 h-4" />,
        content: (
          <div className="space-y-3">
            <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
              <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-2">Fórmula de Escalação</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 bg-red-500/20 rounded">Target</span>
                <span className="text-red-500">+</span>
                <span className="px-2 py-1 bg-red-500/20 rounded">Intent</span>
                <span className="text-red-500">+</span>
                <span className="px-2 py-1 bg-red-500/20 rounded">High-Severity</span>
                <span className="text-red-500">+</span>
                <span className="px-2 py-1 bg-amber-500/20 rounded">(Timing OU Armament OU Location)</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {["Target", "Intent", "Timing", "Armament", "Location"].map((item) => (
                <div key={item} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded text-center">
                  <p className="text-xs font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        id: "statement-types",
        title: "Tipos de Statement",
        icon: <FileText className="w-4 h-4" />,
        content: (
          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                { type: "Statement of Intent", example: "Vou te matar" },
                { type: "Call for Action", example: "Vamos matar todos" },
                { type: "Advocating", example: "Deviam matar esses..." },
                { type: "Aspirational", example: "Espero que morras" },
                { type: "Conditional", example: "Se fizeres isso, mato-te" },
                { type: "Admission", example: "Eu matei aquele..." },
              ].map((item) => (
                <div key={item.type} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded">
                  <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{item.type}</p>
                  <p className="text-xs text-zinc-500 italic">"{item.example}"</p>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        id: "severity",
        title: "Níveis de Severidade",
        icon: <Scale className="w-4 h-4" />,
        content: (
          <div className="space-y-3">
            <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
              <p className="text-xs font-semibold text-red-700 dark:text-red-300 mb-1">HIGH</p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                matar, assassinar, esfaquear, atirar, enforcar, queimar, decapitar, esquartejar
              </p>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1">MID</p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                soco, pontapé, bater, surra, cabeçada, espancar, agredir
              </p>
            </div>
            <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-300 mb-1">LOW</p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                tapa, empurrar, cuspir, beliscar, puxar cabelo
              </p>
            </div>
          </div>
        ),
      },
    ],
    keywords: [
      {
        category: "High Severity",
        terms: [
          { term: "matar", severity: "high" },
          { term: "assassinar", severity: "high" },
          { term: "esfaquear", severity: "high" },
          { term: "decapitar", severity: "critical" },
          { term: "esquartejar", severity: "critical" },
          { term: "kill", severity: "high" },
          { term: "murder", severity: "high" },
        ],
      },
      {
        category: "Mid Severity",
        terms: [
          { term: "bater", severity: "mid" },
          { term: "espancar", severity: "high" },
          { term: "agredir", severity: "mid" },
          { term: "partir a cara", severity: "high" },
          { term: "beat", severity: "mid" },
          { term: "assault", severity: "mid" },
        ],
      },
      {
        category: "Armaments",
        terms: [
          { term: "pistola", severity: "mid", note: "Context required" },
          { term: "arma", severity: "mid", note: "Context required" },
          { term: "faca", severity: "mid", note: "Context required" },
          { term: "bomba", severity: "high" },
          { term: "explosivo", severity: "high" },
        ],
      },
    ],
    labelHierarchy: [
      { label: "ESCALATE > V&I > Credible Threat", action: "escalate", description: "Ameaça credível com todos os elementos" },
      { label: "LABEL > V&I > High-Severity", action: "label", description: "Violência de alta severidade" },
      { label: "LABEL > V&I > Mid-Severity", action: "label", description: "Violência de média severidade" },
      { label: "LABEL > V&I > Low-Severity", action: "label", description: "Violência de baixa severidade" },
      { label: "LABEL > V&I > Incitement", action: "label", description: "Incitamento à violência" },
    ],
    clarifications: [
      {
        question: "\"Vou te matar\" sem mais contexto - escalate?",
        answer: "NÃO automaticamente. Precisa de Target específico + Timing OU Armament OU Location. Sem esses elementos adicionais, é Label > High-Severity.",
      },
      {
        question: "Ameaça em contexto de jogo/filme?",
        answer: "Contexto hipotético/ficção é exceção. Se claramente sobre personagens fictícios ou cenário de jogo, No Action.",
      },
      {
        question: "Post de arrependimento após ameaça?",
        answer: "Redemption context é exceção. Se o mesmo utilizador se arrepende genuinamente, considerar No Action.",
      },
    ],
  },

  // ============================================
  // ASE - Adult Sexual Exploitation
  // ============================================
  {
    id: "ase",
    name: "Adult Sexual Exploitation",
    shortName: "ASE",
    color: "#be185d",
    description: "Exploração sexual de adultos incluindo NCII (Non-Consensual Intimate Imagery), sextortion, creepshots e conteúdo de natureza não consensual.",
    quickReference: [
      "NCII = Imagens íntimas não consensuais (revenge porn)",
      "Sextortion = Extorsão com ameaça de expor imagens íntimas",
      "Creepshots = Fotos tiradas secretamente de áreas íntimas",
      "Consent é o fator chave - falta de consentimento = violação",
    ],
    sections: [
      {
        id: "ncii",
        title: "NCII - Non-Consensual Intimate Imagery",
        icon: <AlertTriangle className="w-4 h-4" />,
        content: (
          <div className="space-y-3">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Partilha de imagens íntimas sem consentimento da pessoa retratada.
            </p>
            <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
              <p className="text-xs font-semibold text-red-700 dark:text-red-300 mb-2">Indicadores de NCII</p>
              <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                <li>• "Leaked", "vazado", "exposed"</li>
                <li>• "Revenge porn", "ex-girlfriend/boyfriend"</li>
                <li>• Contexto de vingança aparente</li>
                <li>• Sharing without permission indicators</li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: "sextortion-adult",
        title: "Sextortion (Adultos)",
        icon: <AlertTriangle className="w-4 h-4" />,
        content: (
          <div className="space-y-3">
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">ESCALATE</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Extorsão com ameaça de expor conteúdo íntimo de adulto.
            </p>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded text-center">
                <p className="text-xs font-medium">Financial</p>
              </div>
              <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded text-center">
                <p className="text-xs font-medium">Content</p>
              </div>
              <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded text-center">
                <p className="text-xs font-medium">Favor-based</p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "creepshots",
        title: "Creepshots",
        icon: <XCircle className="w-4 h-4" />,
        content: (
          <div className="space-y-3">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Fotos/vídeos tirados secretamente focando em áreas íntimas.
            </p>
            <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                <li>• <strong>Upskirt</strong> - Por baixo de saia/vestido</li>
                <li>• <strong>Downblouse</strong> - Por dentro de blusa/decote</li>
                <li>• Fotos em balneários/casas de banho</li>
                <li>• Zoom não autorizado em partes íntimas</li>
              </ul>
            </div>
          </div>
        ),
      },
    ],
    keywords: [
      {
        category: "NCII Terms",
        terms: [
          { term: "nudes vazados", severity: "high" },
          { term: "leaked nudes", severity: "high" },
          { term: "revenge porn", severity: "high" },
          { term: "exposed", severity: "mid", note: "Context required" },
        ],
      },
      {
        category: "Sextortion",
        terms: [
          { term: "sextortion", severity: "critical" },
          { term: "send nudes or", severity: "critical" },
          { term: "envia nudes ou", severity: "critical" },
        ],
      },
      {
        category: "Creepshots",
        terms: [
          { term: "creepshot", severity: "high" },
          { term: "upskirt", severity: "high" },
          { term: "downblouse", severity: "high" },
        ],
      },
    ],
    labelHierarchy: [
      { label: "ESCALATE > ASE > Sextortion", action: "escalate", description: "Extorsão sexual" },
      { label: "ESCALATE > ASE > NCST", action: "escalate", description: "Non-Consensual Sexual Touching" },
      { label: "LABEL > ASE > NCII", action: "label", description: "Imagens íntimas não consensuais" },
      { label: "LABEL > ASE > Creepshots", action: "label", description: "Fotos secretas de áreas íntimas" },
    ],
    clarifications: [
      {
        question: "Como distinguir NCII de conteúdo consensual?",
        answer: "Verificar indicadores: menção de 'leaked/vazado', contexto de vingança, alegações de não consentimento, tom depreciativo sobre a pessoa.",
      },
      {
        question: "Deepfake pornográfico de celebridade?",
        answer: "Viola como NCII - imagens manipuladas/AI-generated de pessoas reais sem consentimento são tratadas igual a imagens reais.",
      },
    ],
  },

  // ============================================
  // SSPx - Sexual Solicitation
  // ============================================
  {
    id: "sspx",
    name: "Adult Sexual Solicitation & Sexually Explicit Language",
    shortName: "SSPx",
    color: "#a21caf",
    description: "Solicitação sexual entre adultos, serviços sexuais comerciais e linguagem sexualmente explícita em contextos não permitidos.",
    quickReference: [
      "Prostituição = Transação + Encontro Sexual",
      "Solicitação = Pedir/oferecer atividade sexual",
      "Links para pornografia/sites adultos",
      "Linguagem sexualizada explícita em contextos inapropriados",
    ],
    sections: [
      {
        id: "prostitution",
        title: "Prostituição",
        icon: <XCircle className="w-4 h-4" />,
        content: (
          <div className="space-y-3">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Combinação de transação financeira + encontro sexual.
            </p>
            <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
              <p className="text-xs font-semibold text-zinc-500 mb-2">Indicadores</p>
              <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                <li>• Menção de preço/valor por serviço</li>
                <li>• "Acompanhante", "escort", "garota de programa"</li>
                <li>• "Massagem com final feliz"</li>
                <li>• Locais de encontro + serviços sexuais</li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: "solicitation",
        title: "Solicitação Sexual",
        icon: <Users className="w-4 h-4" />,
        content: (
          <div className="space-y-3">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Pedir ou oferecer atividade sexual entre adultos.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded">
                <p className="text-xs font-medium mb-1">Termos PT</p>
                <p className="text-xs text-zinc-500">quero sexo, procuro sexo, dtf</p>
              </div>
              <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded">
                <p className="text-xs font-medium mb-1">Termos EN</p>
                <p className="text-xs text-zinc-500">looking for sex, hookup, fwb</p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "platforms",
        title: "Plataformas Adultas",
        icon: <Tag className="w-4 h-4" />,
        content: (
          <div className="space-y-3">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Links/promoção de plataformas de conteúdo adulto.
            </p>
            <div className="flex flex-wrap gap-2">
              {["OnlyFans", "Fansly", "ManyVids", "Pornhub", "XVideos"].map((platform) => (
                <span key={platform} className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">
                  {platform}
                </span>
              ))}
            </div>
          </div>
        ),
      },
    ],
    keywords: [
      {
        category: "Prostitution",
        terms: [
          { term: "serviços sexuais", severity: "high" },
          { term: "acompanhante", severity: "mid", note: "Context required" },
          { term: "escort", severity: "mid", note: "Context required" },
          { term: "garota de programa", severity: "high" },
          { term: "massagem final feliz", severity: "high" },
        ],
      },
      {
        category: "Solicitation",
        terms: [
          { term: "quero sexo", severity: "high" },
          { term: "procuro sexo", severity: "high" },
          { term: "looking for sex", severity: "high" },
          { term: "dtf", severity: "high" },
          { term: "hookup", severity: "mid", note: "Context required" },
        ],
      },
    ],
    labelHierarchy: [
      { label: "LABEL > SSPx > Prostitution", action: "label", description: "Oferta de serviços sexuais" },
      { label: "LABEL > SSPx > Sexual Solicitation", action: "label", description: "Solicitação sexual" },
      { label: "LABEL > SSPx > Adult Platform Links", action: "label", description: "Links para plataformas adultas" },
      { label: "LABEL > SSPx > Explicit Language", action: "label", description: "Linguagem sexualmente explícita" },
    ],
    clarifications: [
      {
        question: "Alguém a promover OnlyFans na bio - viola?",
        answer: "Depende do contexto e superfície. Em perfis pessoais pode ser permitido, mas em certas superfícies (ads, business) é proibido.",
      },
      {
        question: "\"Hookup\" sem contexto sexual explícito?",
        answer: "Requer contexto. 'Hookup' sozinho pode ser ambíguo. Verificar se há indicadores sexuais adicionais.",
      },
    ],
  },

  // ============================================
  // ANSA - Adult Nudity
  // ============================================
  {
    id: "ansa",
    name: "Adult Nudity and Sexual Activity",
    shortName: "ANSA",
    color: "#db2777",
    description: "Restringe nudez adulta e atividade sexual. Distingue entre tipos de imagem e fornece exceções para contextos legítimos.",
    quickReference: [
      "Tipos: Fotorrealista > Arte do Mundo Real > Imagem Digital",
      "Contextos permitidos: Médico, Arte, Amamentação, Protesto",
      "Atividade sexual explícita vs implícita",
      "Ads e Commerce = SEMPRE proibido",
    ],
    sections: [
      {
        id: "image-types",
        title: "Tipos de Imagem",
        icon: <FileText className="w-4 h-4" />,
        content: (
          <div className="space-y-3">
            <p className="text-xs text-zinc-500 mb-2">Verificar nesta ordem de prioridade:</p>
            <div className="space-y-2">
              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">1. Fotorrealista</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Parece fotografia/vídeo de pessoa real. Na dúvida, assumir fotorrealista.
                </p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <p className="text-sm font-medium text-green-700 dark:text-green-300">2. Arte do Mundo Real</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Objetos físicos: estátuas, pinturas, esculturas. Meio tradicional visível.
                </p>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">3. Imagem Digital</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Gerada por AI/computador, não fotorrealista. Photoshop, pintura digital.
                </p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "contexts",
        title: "Contextos Permitidos",
        icon: <CheckCircle className="w-4 h-4" />,
        content: (
          <div className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                { name: "Médico/Saúde", desc: "Educação médica, condições de saúde" },
                { name: "Artístico", desc: "Arte reconhecida, museus" },
                { name: "Amamentação", desc: "Breastfeeding" },
                { name: "Protesto", desc: "Nudez em contexto de protesto" },
                { name: "Pós-mastectomia", desc: "Cicatrizes, reconstrução" },
                { name: "Nascimento", desc: "Parto, educação prenatal" },
              ].map((ctx) => (
                <div key={ctx.name} className="p-2 bg-green-500/10 rounded border border-green-500/20">
                  <p className="text-xs font-medium text-green-700 dark:text-green-300">{ctx.name}</p>
                  <p className="text-xs text-zinc-500">{ctx.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        id: "activity-types",
        title: "Tipos de Atividade Sexual",
        icon: <Scale className="w-4 h-4" />,
        content: (
          <div className="space-y-3">
            <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
              <p className="text-xs font-semibold text-red-700 dark:text-red-300 mb-1">Explícita</p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Penetração visível, genitais em contacto, atos sexuais claros
              </p>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1">Implícita</p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Posições sugestivas, movimentos rítmicos, expressões de prazer sem atos visíveis
              </p>
            </div>
          </div>
        ),
      },
    ],
    keywords: [
      {
        category: "Nudity",
        terms: [
          { term: "nu", severity: "low", note: "Context required" },
          { term: "nua", severity: "low", note: "Context required" },
          { term: "nude", severity: "low", note: "Context required" },
          { term: "naked", severity: "low", note: "Context required" },
        ],
      },
      {
        category: "Body Parts",
        terms: [
          { term: "mamilos", severity: "low", note: "Context required" },
          { term: "genitais", severity: "mid" },
          { term: "pénis", severity: "mid" },
          { term: "vagina", severity: "mid" },
        ],
      },
      {
        category: "Sexual Activity",
        terms: [
          { term: "sexo", severity: "mid", note: "Context required" },
          { term: "penetração", severity: "mid" },
          { term: "oral", severity: "mid", note: "Context required" },
        ],
      },
    ],
    labelHierarchy: [
      { label: "LABEL > ANSA > Explicit Sexual Activity", action: "label", description: "Atividade sexual explícita" },
      { label: "LABEL > ANSA > Implicit Sexual Activity", action: "label", description: "Atividade sexual implícita" },
      { label: "LABEL > ANSA > Adult Nudity", action: "label", description: "Nudez adulta" },
      { label: "LABEL > ANSA > Fetish Content", action: "label", description: "Conteúdo fetiche" },
      { label: "INFO > ANSA > Educational Context", action: "no_action", description: "Contexto educacional" },
    ],
    clarifications: [
      {
        question: "Estátua clássica com nudez - viola?",
        answer: "Arte do mundo real tem tratamento diferente. Estátuas/pinturas clássicas em contexto de museu/arte são geralmente permitidas.",
      },
      {
        question: "Imagem de amamentação - viola?",
        answer: "Não, amamentação é contexto permitido. Mamilos visíveis em contexto de breastfeeding não violam.",
      },
      {
        question: "Nudez em anúncio/commerce?",
        answer: "SEMPRE proibido em ads e commerce surfaces, independentemente do contexto artístico ou educacional.",
      },
    ],
  },
];

// ============================================
// MAIN COMPONENT
// ============================================

export function PolicyList() {
  const [selectedPolicy, setSelectedPolicy] = useState<string>("csean");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  const selectedPolicyData = POLICY_REFERENCE.find((p) => p.id === selectedPolicy);

  // Filter keywords based on search
  const filteredKeywords = useMemo(() => {
    if (!selectedPolicyData || !searchQuery) return selectedPolicyData?.keywords || [];
    
    const query = searchQuery.toLowerCase();
    return selectedPolicyData.keywords
      .map((category) => ({
        ...category,
        terms: category.terms.filter(
          (t) => t.term.toLowerCase().includes(query) || t.note?.toLowerCase().includes(query)
        ),
      }))
      .filter((category) => category.terms.length > 0);
  }, [selectedPolicyData, searchQuery]);

  const handleCopyLabel = (label: string) => {
    navigator.clipboard.writeText(label);
    setCopiedLabel(label);
    setTimeout(() => setCopiedLabel(null), 2000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30";
      case "high":
        return "bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30";
      case "mid":
        return "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30";
      case "low":
        return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30";
      default:
        return "bg-zinc-500/20 text-zinc-700 dark:text-zinc-300 border-zinc-500/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold mb-1">Policy Reference</h2>
        <p className="text-sm text-zinc-500">
          Documentação completa para consulta de analistas - {POLICY_STATS.ready} policies prontas
        </p>
      </div>

      {/* Policy Selector */}
      <div className="flex flex-wrap gap-2">
        {POLICY_REFERENCE.map((policy) => (
          <button
            key={policy.id}
            onClick={() => {
              setSelectedPolicy(policy.id);
              setActiveSection(null);
              setSearchQuery("");
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedPolicy === policy.id
                ? "text-white shadow-lg"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
            style={
              selectedPolicy === policy.id
                ? { backgroundColor: policy.color }
                : undefined
            }
          >
            {policy.shortName}
          </button>
        ))}
      </div>

      {selectedPolicyData && (
        <>
          {/* Policy Header */}
          <Card>
            <CardContent>
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${selectedPolicyData.color}20` }}
                >
                  <Shield className="w-7 h-7" style={{ color: selectedPolicyData.color }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">{selectedPolicyData.name}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                    {selectedPolicyData.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPolicyData.quickReference.map((ref, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-xs text-zinc-600 dark:text-zinc-400"
                      >
                        {ref}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar termos e keywords..."
              className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Content Sections */}
          {!searchQuery && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left Column - Sections */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-zinc-500 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Documentação
                </h4>
                {selectedPolicyData.sections.map((section) => (
                  <Card key={section.id}>
                    <CardHeader
                      className="cursor-pointer py-3"
                      onClick={() =>
                        setActiveSection(activeSection === section.id ? null : section.id)
                      }
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {section.icon}
                          <span className="font-medium text-sm">{section.title}</span>
                        </div>
                        {activeSection === section.id ? (
                          <ChevronDown className="w-4 h-4 text-zinc-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-zinc-400" />
                        )}
                      </div>
                    </CardHeader>
                    {activeSection === section.id && (
                      <CardContent className="pt-0">{section.content}</CardContent>
                    )}
                  </Card>
                ))}
              </div>

              {/* Right Column - Labels & Clarifications */}
              <div className="space-y-4">
                {/* Label Hierarchy */}
                <Card>
                  <CardHeader className="py-3">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      <span className="font-medium text-sm">Hierarquia de Labels</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {selectedPolicyData.labelHierarchy.map((item, i) => (
                        <div
                          key={i}
                          className={`p-2 rounded-lg border flex items-center justify-between ${
                            item.action === "escalate"
                              ? "bg-red-500/10 border-red-500/20"
                              : item.action === "label"
                              ? "bg-amber-500/10 border-amber-500/20"
                              : "bg-green-500/10 border-green-500/20"
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-mono truncate">{item.label}</p>
                            <p className="text-xs text-zinc-500 truncate">{item.description}</p>
                          </div>
                          <button
                            onClick={() => handleCopyLabel(item.label)}
                            className="p-1.5 hover:bg-black/10 rounded transition-colors flex-shrink-0"
                          >
                            {copiedLabel === item.label ? (
                              <Check className="w-3.5 h-3.5 text-green-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-zinc-400" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Clarifications */}
                <Card>
                  <CardHeader className="py-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="font-medium text-sm">Clarificações</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {selectedPolicyData.clarifications.map((item, i) => (
                        <div key={i} className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                          <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Q: {item.question}
                          </p>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400">
                            A: {item.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Keywords Section */}
          <Card>
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span className="font-medium text-sm">Keywords & Termos</span>
                </div>
                {searchQuery && (
                  <span className="text-xs text-zinc-500">
                    {filteredKeywords.reduce((acc, cat) => acc + cat.terms.length, 0)} resultados
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {filteredKeywords.length > 0 ? (
                <div className="space-y-4">
                  {filteredKeywords.map((category) => (
                    <div key={category.category}>
                      <p className="text-xs font-semibold text-zinc-500 mb-2">{category.category}</p>
                      <div className="flex flex-wrap gap-2">
                        {category.terms.map((term, i) => (
                          <div
                            key={i}
                            className={`px-2 py-1 rounded border text-xs ${getSeverityColor(term.severity)}`}
                            title={term.note}
                          >
                            <span className="font-medium">{term.term}</span>
                            {term.note && (
                              <span className="ml-1 opacity-60">({term.note})</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500 text-center py-4">
                  Nenhum termo encontrado para "{searchQuery}"
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Pending Policies */}
      <Card className="opacity-60">
        <CardContent className="py-6 text-center">
          <Clock className="w-8 h-8 text-zinc-400 dark:text-zinc-600 mx-auto mb-2" />
          <h3 className="font-medium mb-1">Mais Policies em Desenvolvimento</h3>
          <p className="text-xs text-zinc-500">
            {POLICIES.filter((p) => !p.ready)
              .slice(0, 6)
              .map((p) => p.shortName)
              .join(", ")}{" "}
            e mais {POLICIES.filter((p) => !p.ready).length - 6}...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}