"use client";

import { Moon, Sun } from "lucide-react";
import { useAppStore } from "@/lib/store";

export function ThemeToggle() {
  const { settings, updateSettings } = useAppStore();
  const isDark = settings.darkMode;

  const toggleTheme = () => {
    updateSettings({ darkMode: !isDark });
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
      ) : (
        <Moon className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
      )}
    </button>
  );
}