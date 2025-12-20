"use client";

import { useAppStore } from "@/lib/store";
import { Policy } from "@/lib/types";
import { ChevronRight, Sparkles, X } from "lucide-react";

const policies: Policy[] = [
  { id: "vi", name: "Violence and Incitement", shortName: "V&I", color: "#DC2626", ready: true },
  { id: "bh", name: "Bullying and Harassment", shortName: "B&H", color: "#7C3AED", ready: true },
  { id: "ssied", name: "Suicide, Self-Injury, Eating Disorders", shortName: "SSIED", color: "#0891B2", ready: false },
  { id: "ase", name: "Adult Sexual Exploitation", shortName: "ASE", color: "#DB2777", ready: false },
  { id: "csean", name: "Child Sexual Exploitation", shortName: "CSEAN", color: "#6366F1", ready: false },
  { id: "hs", name: "Hate Speech", shortName: "HS", color: "#9333EA", ready: false },
  { id: "doi", name: "Dangerous Organizations", shortName: "DOI", color: "#1D4ED8", ready: false },
  { id: "fsdp", name: "Fraud, Scam, Deceptive Practices", shortName: "FSDP", color: "#0D9488", ready: false },
];

export function Sidebar() {
  const { selectedPolicy, setSelectedPolicy, sidebarOpen, setSidebarOpen } = useAppStore();

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-[57px] md:top-[57px] bottom-0 w-64 bg-zinc-900/95 backdrop-blur-md border-r border-zinc-800 overflow-y-auto z-50 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-4">
          {/* Mobile close button */}
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Policies
            </h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded hover:bg-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h2 className="hidden lg:block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4">
            Policies
          </h2>

          <div className="space-y-1">
            {policies.map((policy) => (
              <button
                key={policy.id}
                onClick={() => {
                  setSelectedPolicy(policy.id === selectedPolicy ? null : policy.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  selectedPolicy === policy.id
                    ? "bg-blue-600 text-white"
                    : policy.ready
                    ? "hover:bg-zinc-800 text-zinc-300"
                    : "hover:bg-zinc-800/50 text-zinc-500"
                }`}
              >
                <div className="relative">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: policy.color, opacity: policy.ready ? 1 : 0.4 }}
                  />
                  {policy.ready && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                  )}
                </div>
                <span className="flex-1 text-left">{policy.shortName}</span>
                {policy.ready && <ChevronRight className="w-4 h-4 text-zinc-500" />}
              </button>
            ))}
          </div>

          <div className="mt-6 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-green-400" />
              <span className="text-xs font-semibold text-green-400">AI Ready</span>
            </div>
            <p className="text-xs text-zinc-500">2 de 8 policies prontas</p>
            <div className="mt-2 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
              <div className="h-full w-1/4 bg-green-500 rounded-full" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}