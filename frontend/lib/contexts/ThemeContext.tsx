"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // FORCE DARK MODE - "Command Center" theme is dark-only
    setThemeState("dark");
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }, []);

  const setTheme = (newTheme: Theme) => {
    // Prevent switching to light
    if (newTheme === "light") return;
    setThemeState("dark");
    document.documentElement.classList.add("dark");
  };

  const toggleTheme = () => {
    // Disabled
    setTheme("dark");
  };

  // Prevent flash of wrong theme
  // if (!mounted) {
  //   return <>{children}</>;
  // }

  // Always provide context to prevent useTheme from crashing
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {/* Visual hiding until mounted if needed, or just render */}
      {/* For now, just render children. Hydration mismatch for class is handled by suppressHydrationWarning in root */}
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
