"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Star,
  Calendar,
  Hash,
  Tag,
  X,
} from "lucide-react";

// ============================================
// CLARIFICATIONS DATA (inline para evitar problemas de import)
// ============================================

const clarificationsData = {
  version: "1.0.0",
  lastUpdated: "2025-06-13",
  totalClarifications: 35,
  
  clarifications: [
    {
      id: "clar-001",
      date: "2025-05-23",
      policy: "ansa",
      policyName: "Adult Nudity and Sexual Activity",
      type: "QnA",
      summary: "Sexualized breastfeeding overlap with SSPx",
      question: "KQ C6 addresses sexualized breastfeeding, a lot of the indicators have an overlap with sexual solicitation, should reviewers label this as solicitation or under ANSA?",
      answer: "If the content meets the thresholds of ANSA, please label accordingly. If it meets the thresholds of SSPx of nudity + interaction information, please label accordingly. (IS 16.2.a, KQ A3.1.e)",
      action: "label",
      tags: ["ansa", "sspx", "overlap", "breastfeeding"],
      language: "en"
    },
    {
      id: "clar-002",
      date: "2025-05-23",
      policy: "ansa",
      policyName: "Adult Nudity and Sexual Activity",
      type: "QnA",
      summary: "Visible anus photoshopped onto public figure - now violating",
      question: "Visible anus photoshopped onto public figure has been removed from the IS, does this mean this type of content should be labelled going forward?",
      answer: "Yes.",
      action: "label",
      tags: ["ansa", "photoshop", "public-figure", "policy-update"],
      language: "en"
    },
    {
      id: "clar-007",
      date: "2025-05-23",
      policy: "sspx",
      policyName: "Sexual Solicitation",
      type: "QnA",
      summary: "18+ no longer requires 'exclusive/private content'",
      question: "Do we no longer require the mention of 'exclusive/private content' in conjunction with 18+ to consider as an indicator for sexual encounter, after the update?",
      answer: "Yes we no longer require exclusive/private content.",
      action: "label",
      tags: ["sspx", "18+", "policy-update", "sexual-encounter"],
      language: "en",
      important: true
    },
    {
      id: "clar-014",
      date: "2025-05-23",
      policy: "sspx",
      policyName: "Sexual Solicitation",
      type: "QnA",
      summary: "SEL - explicit vs indirect mention",
      question: "How do we define graphic detail for SEL?",
      answer: "If there is an explicit mention of sexual encounters ('fucked', 'had sex', 'did anal') coupled with an adverb or adjective, consider it SEL. 'Fucked softly' = SEL. If there is an indirect mention ('made love', 'spent the night together', 'had spicy time'), this would NOT be SEL.",
      action: "depends",
      tags: ["sspx", "sel", "explicit", "indirect", "language"],
      language: "en",
      important: true
    },
    {
      id: "clar-018",
      date: "2025-05-23",
      policy: "vgc",
      policyName: "Violent and Graphic Content",
      type: "QnA",
      summary: "Animal fights in wild - no longer carveout",
      question: "The line about Animal to animal fights in the wild has been removed from the IS, how should this be actioned going forward?",
      answer: "Yes, we no longer have a carveout for animal-to-animal fights in the wild, so it should be labeled like any other imagery of animals (mutilated animals, animals with visible blood, animals going from live to dead, etc.)",
      action: "label",
      tags: ["vgc", "animals", "wild", "policy-update"],
      language: "en",
      important: true
    },
    {
      id: "clar-019",
      date: "2025-05-23",
      policy: "vgc",
      policyName: "Violent and Graphic Content",
      type: "QnA",
      summary: "Religious/cultural self-flagellation - no exception",
      question: "In IS of 'Non medical object piercing skin' the line 'Religious or cultural context (e.g., self-flagellation)' is removed, is it correct to keep label content under this scenario?",
      answer: "Yes, the policy line was deprecated because we no longer distinguish between religious/cultural context and any other context. Everything should be labelled as 'non-medical objects piercing skin' regardless of the context.",
      action: "label",
      tags: ["vgc", "religious", "self-flagellation", "policy-update"],
      language: "en",
      important: true
    },
    {
      id: "clar-020",
      date: "2025-05-23",
      policy: "ssied",
      policyName: "Suicide, Self-Injury, Eating Disorders",
      type: "QnA",
      summary: "SSI admission - self-referential only",
      question: "We would like to seek your clarification that whether or not we no longer consider suicide admission from 3rd person with SSI intention in AAPC SSI?",
      answer: "SSI admission will be self-Referential. Third person will be covered SSI Reference.",
      action: "label",
      tags: ["ssied", "admission", "self-referential", "third-person"],
      language: "en",
      important: true
    },
    {
      id: "clar-023",
      date: "2025-05-29",
      policy: "ansa",
      policyName: "Adult Nudity and Sexual Activity",
      type: "Clarification",
      summary: "Female nipples outline through clothing = No Action",
      question: "",
      answer: "The client clarified that the outline of female nipples visible through clothing should no longer be considered 'near nudity', instead please consider these scenarios benign (No Action).",
      action: "no_action",
      tags: ["ansa", "nipples", "clothing", "near-nudity", "policy-update"],
      language: "en",
      important: true
    },
    {
      id: "clar-024",
      date: "2024-04-21",
      policy: "sspx",
      policyName: "Sexual Solicitation",
      type: "Clarification",
      summary: "'Videos caseiros' = sexual hint",
      question: "We've been noticing the expression 'videos caseiros' surfacing in our queues, usually in borderline content for Sexual Solicitation and/or Nudity and Sexual Activity. Since it's not a slang term in our lists, could we accept the context that it refers to sexual imagery?",
      answer: "As per market knowledge we understand the context of the expressions 'videos caseiros' and by the sample shared we also have plenty other indicators/signals that would fulfill Sexual Solicitation requirements, content should be enforced as violating. We can consider it as a sexual hint.",
      action: "label",
      sampleIds: ["1513896019472955", "1536657180241910", "969312274566019", "734604752201601"],
      tags: ["sspx", "videos-caseiros", "market-knowledge", "pt-br"],
      language: "pt",
      important: true
    },
    {
      id: "clar-025",
      date: "2020-07-15",
      policy: "csean",
      policyName: "Child Sexual Exploitation",
      type: "Clarification",
      summary: "CSAM - menina vestido roxo 'david.fanta' watermark",
      question: "",
      answer: "Client has confirmed as CSAM content: Screenshots of a young girl with black curly hair, wearing a purple dress looking over her shoulder who seems to be twerking outside a house. In some cases these screenshots are watermarked with 'david.fanta'. Any instance of this content, soliciting/sharing of said content, should be escalated for CSAM (even non-violating screenshots).",
      action: "escalate",
      tags: ["csean", "csam", "escalate", "david-fanta", "viral"],
      language: "multi",
      important: true
    },
    {
      id: "clar-026",
      date: "2024-10-24",
      policy: "vi",
      policyName: "Violence and Incitement",
      type: "Clarification",
      summary: "Violence by deity vs violence via prayer",
      question: "",
      answer: "Calls for violence perpetrated by a deity are not violating for V&I. However, if the user is wishing/praying to a deity for violence to be committed by someone else, it is violating for V&I. If the target is a PC, it is violating either way.",
      action: "depends",
      examples: [
        {text: "I hope that God burns you", action: "no_action", label: "No Action"},
        {text: "I hope that God burns all the Portuguese people", action: "label", label: "HC > Statements supporting harm"},
        {text: "I pray to God that someone burns you", action: "label", label: "VI > High-severity violence"},
        {text: "I pray to God that someone burns all the Portuguese people", action: "label", label: "VI > High-severity violence"}
      ],
      tags: ["vi", "hc", "deity", "prayer", "pc-group"],
      language: "en",
      important: true
    },
    {
      id: "clar-027",
      date: "2024-11-02",
      policy: "dp",
      policyName: "Drugs and Pharmaceuticals",
      type: "Clarification",
      summary: "Lança-perfume/Loló - visual identification",
      question: "In the last few weeks we started receiving items with photos/videos in which people appear inhaling something liquid straight from a tube. Can we use our market knowledge to identify visually the good and assume the consumption of non-medical drugs?",
      answer: "You are correct, we can use market knowledge in this case since loló/lança-perfume is a pretty common non-medical drug within our market.",
      action: "label",
      sampleIds: ["8096695493785725", "1033915105186421", "3545411755750881"],
      tags: ["dp", "lanca-perfume", "lolo", "market-knowledge", "visual-id", "brazil"],
      language: "pt",
      important: true
    },
    {
      id: "clar-028",
      date: "2025-09-28",
      policy: "fsdp",
      policyName: "Fraud, Scams, Deceptive Practices",
      type: "Clarification",
      summary: "Inheritance scam - 'riqueza/fortuna' vs 'patrimonio/bens'",
      question: "Jobs present themselves with the usual layout of an inheritance scam but instead of the usual mention of money, they use other terms like 'património', 'riqueza' and 'bens'. Should we consider No Action?",
      answer: "You can consider 'riqueza' and 'fortuna' as rewards of real money for the purpose of Giveaway Fraud, but for 'patrimonio' and 'bens' do not consider them as offers of real money.",
      action: "depends",
      sampleIds: ["1377411940466832", "1151973646777544", "1123202539968829"],
      tags: ["fsdp", "inheritance-scam", "riqueza", "fortuna", "patrimonio", "bens", "pt-br"],
      language: "pt",
      important: true
    },
    {
      id: "clar-029",
      date: "2021-04-09",
      policy: "sspx",
      policyName: "Sexual Solicitation",
      type: "Clarification",
      summary: "'Patrocinar/Patrocinador' ≠ hint at price",
      question: "Can we assume 'patrocinar/patrocinador' as hint at price, since sponsorships and patrons involve an exchange, usually of money for content?",
      answer: "Patrocinar/Patrocinador should not be assumed as a hint of price.",
      action: "no_action",
      tags: ["sspx", "patrocinar", "hint-at-price", "pt-br"],
      language: "pt"
    },
    {
      id: "clar-030",
      date: "2024-01-01",
      policy: "ase",
      policyName: "Adult Sexual Exploitation",
      type: "Clarification",
      summary: "Creepshots - face alone ≠ 'revealing identity'",
      question: "Would having the PDITI face clearly depicted qualify for identity reveal in creepshots?",
      answer: "Showing someone's face alone does not qualify as 'revealing identity' for Creepshots. We can consider as examples: (1) captions that reveal the name/username, (2) digitally drawn circles or arrows that highlight the face, (3) digitally inserted face where otherwise not visible. The idea is that the person has taken an extra step to highlight the PDITI's identity.",
      action: "depends",
      tags: ["ase", "creepshots", "identity", "face", "definition"],
      language: "en",
      important: true
    },
    {
      id: "clar-031",
      date: "2020-06-10",
      policy: "doi",
      policyName: "Dangerous Organizations and Individuals",
      type: "Clarification",
      summary: "Zuckerberg + nazi symbol = satire/No Action",
      question: "",
      answer: "Content depicts a cutesy edit of Mark Zuckerberg paired with a nazi symbol. As per Dangerous Orgs KQ A12 'Humor and satire is content that compares or contrasts a designated entity with an undesignated individual, undesignated organization, or object.' = No Action",
      action: "no_action",
      tags: ["doi", "satire", "humor", "nazi", "public-figure"],
      language: "en"
    },
    {
      id: "clar-032",
      date: "2025-06-13",
      policy: "bh",
      policyName: "Bullying and Harassment",
      type: "Clarification",
      summary: "Overlap BH/SSPx - 'want to' vs 'going to'",
      question: "",
      answer: "With the recent update (June 11th), 'Profane expressions of sexual activity' was removed from BH. Now: 'I want to fuck you' = SSPx. 'I want to lick your feet' = SSPx. 'I'm going to fuck you' = BH. 'I will lick your feet' = BH. Rule: 'Want to' (desire) = SSPx. 'Going to/Will' (imposition) = BH.",
      action: "depends",
      examples: [
        {text: "I want to have sex with you", action: "label", label: "SSPx"},
        {text: "I want to see you naked", action: "label", label: "SSPx"},
        {text: "I want to lick your feet", action: "label", label: "SSPx"},
        {text: "I'm going to fuck you", action: "label", label: "BH"},
        {text: "I will lick your feet", action: "label", label: "BH"}
      ],
      tags: ["bh", "sspx", "overlap", "want-to", "going-to", "policy-update"],
      language: "en",
      important: true
    },
    {
      id: "clar-035",
      date: "2025-11-21",
      policy: "he",
      policyName: "Human Exploitation",
      type: "QnA",
      summary: "HE vs FSDP overlap - HE takes precedence",
      question: "There are scenarios where indicators for Fraud will overlap with Labor Exploitation. Per hierarchy HEx is higher than Fraud. Can you clarify?",
      answer: "You should follow the hierarchy of actions. If content is violating for both Human Exploitation and Frauds and Scams, it should be considered as Human Exploitation. If content contains some Labor Exploitation/Abuse signals, but not enough to violate, it should be considered for other violations, including Fraud and Scams.",
      action: "depends",
      tags: ["he", "fsdp", "overlap", "hierarchy", "labor-exploitation"],
      language: "en",
      important: true
    }
  ]
};

// ============================================
// TYPES
// ============================================

interface ClarificationExample {
  text: string;
  action: string;
  label: string;
}

interface Clarification {
  id: string;
  date: string;
  policy: string;
  policyName: string;
  type: string;
  summary: string;
  question?: string;
  answer: string;
  action: string;
  sampleIds?: string[];
  examples?: ClarificationExample[];
  tags: string[];
  language: string;
  important?: boolean;
}

// ============================================
// POLICY COLORS
// ============================================

const POLICY_COLORS: Record<string, { bg: string; text: string }> = {
  ssied: { bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400" },
  bh: { bg: "bg-violet-500/10", text: "text-violet-600 dark:text-violet-400" },
  vi: { bg: "bg-orange-500/10", text: "text-orange-600 dark:text-orange-400" },
  ase: { bg: "bg-indigo-500/10", text: "text-indigo-600 dark:text-indigo-400" },
  csean: { bg: "bg-red-500/10", text: "text-red-600 dark:text-red-400" },
  hc: { bg: "bg-pink-500/10", text: "text-pink-600 dark:text-pink-400" },
  vgc: { bg: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400" },
  he: { bg: "bg-red-600/10", text: "text-red-700 dark:text-red-400" },
  doi: { bg: "bg-amber-600/10", text: "text-amber-700 dark:text-amber-400" },
  fsdp: { bg: "bg-cyan-500/10", text: "text-cyan-600 dark:text-cyan-400" },
  dp: { bg: "bg-lime-500/10", text: "text-lime-600 dark:text-lime-400" },
  wae: { bg: "bg-red-500/10", text: "text-red-600 dark:text-red-400" },
  ta: { bg: "bg-stone-500/10", text: "text-stone-600 dark:text-stone-400" },
  sspx: { bg: "bg-pink-600/10", text: "text-pink-700 dark:text-pink-400" },
  ansa: { bg: "bg-blue-600/10", text: "text-blue-700 dark:text-blue-400" },
  default: { bg: "bg-zinc-500/10", text: "text-zinc-600 dark:text-zinc-400" },
};

const ACTION_STYLES: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  label: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", icon: <Tag className="w-3 h-3" /> },
  no_action: { bg: "bg-green-500/10", text: "text-green-600 dark:text-green-400", icon: <CheckCircle className="w-3 h-3" /> },
  escalate: { bg: "bg-red-500/10", text: "text-red-600 dark:text-red-400", icon: <AlertTriangle className="w-3 h-3" /> },
  depends: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", icon: <Lightbulb className="w-3 h-3" /> },
};

// ============================================
// COMPONENT
// ============================================

export function ClarificationsTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPolicy, setSelectedPolicy] = useState<string>("all");
  const [selectedAction, setSelectedAction] = useState<string>("all");
  const [showImportantOnly, setShowImportantOnly] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const clarifications = clarificationsData.clarifications as Clarification[];

  // Get unique policies
  const policies = useMemo(() => {
    const unique = [...new Set(clarifications.map((c) => c.policy))];
    return unique.sort();
  }, [clarifications]);

  // Filter clarifications
  const filteredClarifications = useMemo(() => {
    return clarifications.filter((c) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          c.summary.toLowerCase().includes(query) ||
          c.answer.toLowerCase().includes(query) ||
          c.question?.toLowerCase().includes(query) ||
          c.tags.some((t) => t.toLowerCase().includes(query)) ||
          c.sampleIds?.some((s) => s.includes(query)) ||
          c.policyName.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      if (selectedPolicy !== "all" && c.policy !== selectedPolicy) return false;
      if (selectedAction !== "all" && c.action !== selectedAction) return false;
      if (showImportantOnly && !c.important) return false;
      return true;
    });
  }, [clarifications, searchQuery, selectedPolicy, selectedAction, showImportantOnly]);

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getPolicyColors = (policy: string) => POLICY_COLORS[policy] || POLICY_COLORS.default;
  const getActionStyle = (action: string) => ACTION_STYLES[action] || ACTION_STYLES.depends;

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Clarificações</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {filteredClarifications.length} de {clarifications.length} clarificações
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar por termo, sample ID, tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <select
            value={selectedPolicy}
            onChange={(e) => setSelectedPolicy(e.target.value)}
            className="px-4 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-w-[140px]"
          >
            <option value="all">Todas Policies</option>
            {policies.map((p) => (
              <option key={p} value={p}>{p.toUpperCase()}</option>
            ))}
          </select>

          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="px-4 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-w-[140px]"
          >
            <option value="all">Todas Actions</option>
            <option value="label">Label</option>
            <option value="no_action">No Action</option>
            <option value="escalate">Escalate</option>
            <option value="depends">Depends</option>
          </select>

          <button
            onClick={() => setShowImportantOnly(!showImportantOnly)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              showImportantOnly
                ? "bg-amber-500 text-white"
                : "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-700"
            }`}
          >
            <Star className={`w-4 h-4 ${showImportantOnly ? "fill-white" : ""}`} />
            <span className="hidden sm:inline">Importantes</span>
          </button>
        </div>
      </div>

      {/* Clarifications List */}
      <div className="space-y-3">
        {filteredClarifications.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
            <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Nenhuma clarificação encontrada</p>
            <p className="text-sm mt-1">Tenta ajustar os filtros</p>
          </div>
        ) : (
          filteredClarifications.map((clarification) => {
            const isExpanded = expandedIds.has(clarification.id);
            const policyColors = getPolicyColors(clarification.policy);
            const actionStyle = getActionStyle(clarification.action);

            return (
              <div
                key={clarification.id}
                className={`bg-white dark:bg-zinc-800/50 border rounded-xl overflow-hidden transition-all ${
                  clarification.important ? "border-amber-500/50 shadow-amber-500/10 shadow-lg" : "border-zinc-200 dark:border-zinc-700"
                }`}
              >
                {/* Header */}
                <button
                  onClick={() => toggleExpanded(clarification.id)}
                  className="w-full px-4 py-3 flex items-start gap-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <div className="mt-0.5">
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-zinc-400" /> : <ChevronRight className="w-4 h-4 text-zinc-400" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      {clarification.important && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
                      <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${policyColors.bg} ${policyColors.text}`}>
                        {clarification.policy.toUpperCase()}
                      </span>
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${actionStyle.bg} ${actionStyle.text}`}>
                        {actionStyle.icon}
                        {clarification.action === "no_action" ? "No Action" : clarification.action === "depends" ? "Depends" : clarification.action.charAt(0).toUpperCase() + clarification.action.slice(1)}
                      </span>
                      <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-700 rounded-md text-xs text-zinc-500 dark:text-zinc-400">
                        {clarification.type}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-zinc-400">
                        <Calendar className="w-3 h-3" />
                        {formatDate(clarification.date)}
                      </span>
                    </div>
                    <h3 className="font-medium text-zinc-900 dark:text-white text-sm leading-snug">{clarification.summary}</h3>
                    {!isExpanded && clarification.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {clarification.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-700/50 rounded text-[10px] text-zinc-500 dark:text-zinc-400">
                            #{tag}
                          </span>
                        ))}
                        {clarification.tags.length > 4 && <span className="text-[10px] text-zinc-400">+{clarification.tags.length - 4}</span>}
                      </div>
                    )}
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 border-t border-zinc-100 dark:border-zinc-700/50">
                    {clarification.question && (
                      <div className="mt-4">
                        <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1.5">Pergunta</h4>
                        <p className="text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3">{clarification.question}</p>
                      </div>
                    )}

                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Resposta / Clarificação</h4>
                        <button
                          onClick={() => copyToClipboard(clarification.answer, clarification.id)}
                          className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                        >
                          {copiedId === clarification.id ? (
                            <><Check className="w-3 h-3 text-green-500" /><span className="text-green-500">Copiado!</span></>
                          ) : (
                            <><Copy className="w-3 h-3" /><span>Copiar</span></>
                          )}
                        </button>
                      </div>
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-100 dark:border-blue-800/30">
                        {clarification.answer}
                      </p>
                    </div>

                    {clarification.examples && clarification.examples.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">Exemplos</h4>
                        <div className="space-y-2">
                          {clarification.examples.map((example, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-2.5 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                              <span className={`flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold ${
                                example.action === "no_action" ? "bg-green-500/10 text-green-600" : example.action === "escalate" ? "bg-red-500/10 text-red-600" : "bg-blue-500/10 text-blue-600"
                              }`}>
                                {example.action === "no_action" ? "NO ACTION" : example.action.toUpperCase()}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-zinc-700 dark:text-zinc-300 italic">"{example.text}"</p>
                                <p className="text-xs text-zinc-500 mt-0.5">→ {example.label}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {clarification.sampleIds && clarification.sampleIds.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1.5">Sample IDs</h4>
                        <div className="flex flex-wrap gap-2">
                          {clarification.sampleIds.map((id) => (
                            <span key={id} className="flex items-center gap-1 px-2 py-1 bg-zinc-100 dark:bg-zinc-700 rounded-md text-xs font-mono text-zinc-600 dark:text-zinc-300">
                              <Hash className="w-3 h-3" />{id}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4">
                      <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1.5">Tags</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {clarification.tags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => setSearchQuery(tag)}
                            className="px-2 py-1 bg-zinc-100 dark:bg-zinc-700/50 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-md text-xs text-zinc-600 dark:text-zinc-400 transition-colors"
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-700/50">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-400">{clarification.policyName}</span>
                        <span className="text-xs text-zinc-400">ID: {clarification.id}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Stats Footer */}
      <div className="flex flex-wrap gap-4 justify-center text-xs text-zinc-400 pt-4 border-t border-zinc-200 dark:border-zinc-700">
        <span>📊 Total: <strong>{clarifications.length}</strong> clarificações</span>
        <span>⭐ Importantes: <strong>{clarifications.filter((c) => c.important).length}</strong></span>
        <span>🏷️ Policies: <strong>{policies.length}</strong></span>
        <span>📅 Última atualização: <strong>{clarificationsData.lastUpdated}</strong></span>
      </div>
    </div>
  );
}

export default ClarificationsTab;