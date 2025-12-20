"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { 
  Shield, ChevronDown, ChevronRight, AlertTriangle, 
  Users, Target, Scale, BookOpen 
} from "lucide-react";

interface PolicySection {
  title: string;
  content: string[];
}

interface PolicyData {
  id: string;
  name: string;
  shortName: string;
  color: string;
  ready: boolean;
  description: string;
  sections: PolicySection[];
}

const policiesData: PolicyData[] = [
  {
    id: "vi",
    name: "Violence and Incitement",
    shortName: "V&I",
    color: "#DC2626",
    ready: true,
    description: "Proíbe ameaças de violência, incitamento à violência e declarações de intenção violenta contra pessoas ou grupos.",
    sections: [
      {
        title: "Statement Types",
        content: [
          "Statement of Intent - 'Vou te matar'",
          "Call for Action - 'Vamos matar todos'",
          "Advocating - 'Deviam matar esses...'",
          "Aspirational - 'Espero que morras'",
          "Conditional - 'Se fizeres isso, mato-te'",
          "Admission - 'Eu matei aquele...'",
        ],
      },
      {
        title: "Severity Levels",
        content: [
          "HIGH: matar, assassinar, esfaquear, atirar, enforcar, queimar",
          "MID: soco, pontapé, bater, surra, cabeçada",
          "LOW: tapa, empurrar, cuspir, beliscar",
        ],
      },
      {
        title: "Escalation Criteria",
        content: [
          "✓ Statement of Intent OU Call for Action",
          "✓ High-Severity violence term",
          "✓ Target identificado",
          "✓ Timing OU Armament OU Location",
          "→ Se todos presentes: ESCALATE > Threatening - Other",
        ],
      },
      {
        title: "Exceptions (No Action)",
        content: [
          "Self-defense context",
          "Redemption/arrepedimento",
          "Condemning/awareness",
          "Hypothetical/ficção",
          "Contact sports context",
        ],
      },
    ],
  },
  {
    id: "bh",
    name: "Bullying and Harassment",
    shortName: "B&H",
    color: "#7C3AED",
    ready: true,
    description: "Proíbe ataques pessoais, assédio, termos depreciativos e conteúdo que visa humilhar ou degradar indivíduos.",
    sections: [
      {
        title: "Label Hierarchy (Prioridade)",
        content: [
          "1. Sexualized Harassment",
          "2. Calls for Death / SSI",
          "3. Sexual Activity Claims",
          "4. Violent Tragedies Mockery",
          "5. Dehumanizing Comparisons",
          "6. Negative Physical Description",
          "7. Targeted Cursing",
          "8. Negative Character Claims",
        ],
      },
      {
        title: "Protection Tiers",
        content: [
          "Tier 1: Universal (todos)",
          "Tier 2: Minors + Private Adults",
          "Tier 3: Self-reported Private",
          "Tier 4: Private Minors only",
        ],
      },
      {
        title: "Name/Face Match",
        content: [
          "Necessário para algumas violações",
          "3 features primárias OU",
          "2 primárias + 1 secundária",
          "Features: nome, cara, local, profissão...",
        ],
      },
      {
        title: "Exceptions (No Action)",
        content: [
          "Criminal allegations (public interest)",
          "Business reviews",
          "Fight sports context",
          "Condemning context",
          "Endearing context (com indicadores)",
        ],
      },
    ],
  },
];

export function PolicyList() {
  const [expandedPolicy, setExpandedPolicy] = useState<string | null>("vi");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (policyId: string, sectionTitle: string) => {
    const key = `${policyId}-${sectionTitle}`;
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">Policy Reference</h2>
        <p className="text-sm text-zinc-500">Documentação das policies disponíveis</p>
      </div>

      <div className="space-y-4">
        {policiesData.map((policy) => (
          <Card key={policy.id} variant={policy.ready ? "default" : "default"}>
            <CardHeader
              className="cursor-pointer"
              onClick={() => setExpandedPolicy(expandedPolicy === policy.id ? null : policy.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${policy.color}20` }}
                  >
                    <Shield className="w-6 h-6" style={{ color: policy.color }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{policy.shortName}</h3>
                      {policy.ready && (
                        <Badge variant="success" size="sm">Ready</Badge>
                      )}
                    </div>
                    <p className="text-sm text-zinc-500">{policy.name}</p>
                  </div>
                </div>
                {expandedPolicy === policy.id ? (
                  <ChevronDown className="w-5 h-5 text-zinc-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-zinc-500" />
                )}
              </div>
            </CardHeader>

            {expandedPolicy === policy.id && (
              <CardContent className="pt-0">
                <p className="text-sm text-zinc-400 mb-4 pb-4 border-b border-zinc-800">
                  {policy.description}
                </p>

                <div className="space-y-3">
                  {policy.sections.map((section) => {
                    const key = `${policy.id}-${section.title}`;
                    const isExpanded = expandedSections[key] !== false; // Default open

                    return (
                      <div key={section.title} className="rounded-lg bg-zinc-800/50">
                        <button
                          onClick={() => toggleSection(policy.id, section.title)}
                          className="w-full flex items-center justify-between p-3 text-left"
                        >
                          <span className="text-sm font-medium">{section.title}</span>
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-zinc-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-zinc-500" />
                          )}
                        </button>
                        {isExpanded && (
                          <div className="px-3 pb-3">
                            <ul className="space-y-1">
                              {section.content.map((item, i) => (
                                <li key={i} className="text-xs text-zinc-400 flex items-start gap-2">
                                  <span className="text-zinc-600 mt-0.5">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            )}
          </Card>
        ))}

        {/* Coming Soon */}
        <Card className="opacity-60">
          <CardContent className="py-8 text-center">
            <BookOpen className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <h3 className="font-medium mb-1">Mais Policies em Breve</h3>
            <p className="text-sm text-zinc-500">
              SSIED, ASE, CSEAN, HS, DOI, FSDP
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}