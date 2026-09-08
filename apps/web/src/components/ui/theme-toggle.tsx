"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

/** Pill toggle that switches between light and dark themes. */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  // Avoid hydration mismatch: server renders a neutral placeholder, the real
  // icon appears only after mount when the client theme is known.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={mounted ? label : "Toggle theme"}
      title={mounted ? label : "Toggle theme"}
      className={cn(
        "inline-flex items-center justify-center h-9 w-9 rounded-pill",
        "text-muted hover:text-ink hover:bg-surface-strong",
        "transition-colors duration-150",
        className,
      )}
    >
      {mounted ? (
        isDark ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )
      ) : (
        <span className="h-4 w-4" />
      )}
    </button>
  );
}
