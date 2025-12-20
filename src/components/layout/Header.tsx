"use client";

import { useAppStore } from "@/lib/store";
import { TabType } from "@/lib/types";
import { Tabs } from "@/components/ui/Tabs";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Shield, Brain, History, BookOpen, Settings, Menu } from "lucide-react";

const tabs = [
  { id: "analyzer", label: "Analyzer", icon: <Brain className="w-4 h-4" /> },
  { id: "history", label: "Histórico", icon: <History className="w-4 h-4" /> },
  { id: "policies", label: "Policies", icon: <BookOpen className="w-4 h-4" /> },
  { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
];

export function Header() {
  const { activeTab, setActiveTab, sidebarOpen, setSidebarOpen, history } = useAppStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-white/80 backdrop-blur-md border-b border-zinc-800 dark:border-zinc-800 light:border-zinc-200">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-zinc-100 transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-semibold">CM Policy Hub</h1>
              <p className="text-xs text-zinc-500">Content Moderation</p>
            </div>
          </div>
        </div>

        {/* Center: Tabs */}
        <div className="hidden md:block">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={(id) => setActiveTab(id as TabType)}
          />
        </div>

        {/* Right: Theme + Status */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {history.length > 0 && (
            <span className="px-2 py-1 bg-zinc-800 dark:bg-zinc-800 light:bg-zinc-100 text-zinc-400 rounded-full text-xs">
              {history.length} análises
            </span>
          )}
          <span className="hidden sm:inline-block px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
            V&I
          </span>
          <span className="hidden sm:inline-block px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium">
            B&H
          </span>
        </div>
      </div>

      {/* Mobile Tabs */}
      <div className="md:hidden px-4 pb-3 overflow-x-auto">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id as TabType)}
        />
      </div>
    </header>
  );
}