"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "ledger-theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  // Apply the .dark class to <html> whenever the theme changes
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  // Follow OS preference changes while the user hasn't chosen explicitly
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      if (!window.localStorage.getItem(STORAGE_KEY)) {
        setThemeState(e.matches ? "dark" : "light");
      }
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const setTheme = useCallback((next: Theme) => setThemeState(next), []);
  const toggleTheme = useCallback(
    () => setThemeState((prev) => (prev === "dark" ? "light" : "dark")),
    [],
  );

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}

/**
 * Inline script injected into <head> to apply the saved theme before first
 * paint, preventing a flash of the wrong theme (FOUC).
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('ledger-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export interface ChartColors {
  grid: string;
  tick: string;
  axis: string;
  border: string;
  ink: string;
}

const FALLBACK_CHART_COLORS: ChartColors = {
  grid: "#e7e5e4",
  tick: "#777169",
  axis: "#e7e5e4",
  border: "#e7e5e4",
  ink: "#292524",
};

function readChartColors(): ChartColors {
  if (typeof window === "undefined") return FALLBACK_CHART_COLORS;
  const styles = getComputedStyle(document.documentElement);
  const read = (name: string, fallback: string) => {
    const value = styles.getPropertyValue(name).trim();
    return value ? `rgb(${value})` : fallback;
  };
  return {
    grid: read("--color-hairline", FALLBACK_CHART_COLORS.grid),
    tick: read("--color-muted", FALLBACK_CHART_COLORS.tick),
    axis: read("--color-hairline", FALLBACK_CHART_COLORS.axis),
    border: read("--color-hairline", FALLBACK_CHART_COLORS.border),
    ink: read("--color-ink", FALLBACK_CHART_COLORS.ink),
  };
}

/**
 * Resolves chart colors from the active theme's CSS variables so Recharts
 * stays in sync with light/dark mode. Uses a MutationObserver on the <html>
 * class attribute so colors update the moment the theme flips, independent of
 * React effect ordering. Starts from the light fallback so server and client
 * hydration render identically (no hydration mismatch).
 */
export function useChartColors(): ChartColors {
  const [colors, setColors] = useState<ChartColors>(FALLBACK_CHART_COLORS);

  useEffect(() => {
    const root = document.documentElement;
    const update = () => setColors(readChartColors());
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return colors;
}
