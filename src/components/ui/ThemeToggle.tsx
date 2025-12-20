"use client";

import { useAppStore } from "@/lib/store";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { settings, updateSettings } = useAppStore();
  const isDark = settings.theme === "dark";

  const toggleTheme = () => {
    updateSettings({ theme: isDark ? "light" : "dark" });
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
      title={isDark ? "Mudar para Light Mode" : "Mudar para Dark Mode"}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-500" />
      ) : (
        <Moon className="w-5 h-5 text-zinc-600" />
      )}
    </button>
  );
}