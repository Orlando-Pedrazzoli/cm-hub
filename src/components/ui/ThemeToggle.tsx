"use client";

import { useAppStore } from "@/lib/store";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { settings, updateSettings } = useAppStore();
  const isDark = settings.theme === "dark";

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    updateSettings({ theme: newTheme });
    
    // Update document class
    if (newTheme === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-zinc-200 transition-colors"
      title={isDark ? "Mudar para Light Mode" : "Mudar para Dark Mode"}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-zinc-400" />
      ) : (
        <Moon className="w-5 h-5 text-zinc-600" />
      )}
    </button>
  );
}