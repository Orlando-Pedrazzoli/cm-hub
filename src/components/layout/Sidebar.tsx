"use client";

import { useAppStore } from "@/lib/store";
import { POLICIES, POLICY_STATS, PolicyConfig } from "@/data/policies";
import { ChevronRight, Sparkles, X, Check, Clock } from "lucide-react";

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  // Group policies by category
  const policyGroups: { title: string; policies: PolicyConfig[] }[] = [
    {
      title: "Child Safety",
      policies: POLICIES.filter((p) => p.id === "csean"),
    },
    {
      title: "Violence",
      policies: POLICIES.filter((p) => ["vi", "vgc", "doi"].includes(p.id)),
    },
    {
      title: "Sexual Content",
      policies: POLICIES.filter((p) => ["ansa", "ase", "sspx"].includes(p.id)),
    },
    {
      title: "Harassment & Hate",
      policies: POLICIES.filter((p) => ["bh", "hc"].includes(p.id)),
    },
    {
      title: "Mental Health",
      policies: POLICIES.filter((p) => ["ssied", "cis"].includes(p.id)),
    },
    {
      title: "Exploitation & Crime",
      policies: POLICIES.filter((p) => ["he", "chpc"].includes(p.id)),
    },
    {
      title: "Fraud & Security",
      policies: POLICIES.filter((p) => ["fsdp", "cyber", "pv"].includes(p.id)),
    },
    {
      title: "Regulated Goods",
      policies: POLICIES.filter((p) => ["dp", "ta", "wae", "ogg"].includes(p.id)),
    },
    {
      title: "Other",
      policies: POLICIES.filter((p) =>
        ["hw", "spam", "rp", "bcp", "bcr", "psl", "orgs"].includes(p.id)
      ),
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-[57px] md:top-[57px] bottom-0 w-72 bg-zinc-50/95 dark:bg-zinc-900/95 backdrop-blur-md border-r border-zinc-200 dark:border-zinc-800 overflow-y-auto z-50 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-4">
          {/* Mobile close button */}
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Policies ({POLICY_STATS.ready}/{POLICY_STATS.total})
            </h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Desktop header */}
          <h2 className="hidden lg:block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4">
            Policies ({POLICY_STATS.ready}/{POLICY_STATS.total})
          </h2>

          {/* Policy Groups */}
          <div className="space-y-4">
            {policyGroups.map((group) => (
              <div key={group.title}>
                <p className="text-xs font-medium text-zinc-400 dark:text-zinc-600 mb-1 px-1">
                  {group.title}
                </p>
                <div className="space-y-0.5">
                  {group.policies.map((policy) => (
                    <div
                      key={policy.id}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        policy.ready
                          ? "hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                          : "text-zinc-400 dark:text-zinc-600 cursor-not-allowed"
                      }`}
                    >
                      {/* Status indicator */}
                      <div className="relative flex-shrink-0">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{
                            backgroundColor: policy.color,
                            opacity: policy.ready ? 1 : 0.3,
                          }}
                        />
                        {policy.ready && (
                          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white dark:border-zinc-900" />
                        )}
                      </div>

                      {/* Policy name - full name instead of shortName */}
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-xs leading-tight block">
                          {policy.name}
                        </span>
                      </div>

                      {/* Status icon */}
                      {policy.ready ? (
                        <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Progress Card */}
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-green-500 dark:text-green-400" />
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                Ready Policies
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-2">
              {POLICY_STATS.ready} of {POLICY_STATS.total} policies ready for analysis
            </p>
            <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${POLICY_STATS.readyPercentage}%` }}
              />
            </div>
            <p className="text-xs text-zinc-500 mt-1.5">{POLICY_STATS.readyPercentage}% complete</p>
          </div>

          {/* Ready policies list */}
          <div className="mt-4 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800/50">
            <p className="text-xs font-semibold text-zinc-500 mb-2">Ready for Analysis:</p>
            <div className="flex flex-wrap gap-1">
              {POLICIES.filter((p) => p.ready).map((p) => (
                <span
                  key={p.id}
                  className="px-2 py-0.5 rounded text-xs font-medium"
                  style={{
                    backgroundColor: `${p.color}20`,
                    color: p.color,
                  }}
                >
                  {p.shortName}
                </span>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}