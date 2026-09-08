import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import * as SystemUI from "expo-system-ui";
import {
  darkPalette,
  lightPalette,
  type Palette,
  type ThemeMode,
} from "./tokens";

const STORAGE_KEY = "ledger-theme";

interface ThemeContextValue {
  mode: ThemeMode;
  resolved: "light" | "dark";
  palette: Palette;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme(); // "light" | "dark" | null
  const [mode, setModeState] = useState<ThemeMode>("system");

  // Load persisted preference on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored === "light" || stored === "dark" || stored === "system") {
          setModeState(stored);
        }
      })
      .catch(() => {});
  }, []);

  const resolved: "light" | "dark" =
    mode === "system" ? (systemScheme === "dark" ? "dark" : "light") : mode;

  const palette = resolved === "dark" ? darkPalette : lightPalette;

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  const toggle = useCallback(() => {
    setModeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
      return next;
    });
  }, []);

  // Keep native bars in sync with the resolved theme
  useEffect(() => {
    const bg = resolved === "dark" ? "#0c0a09" : "#f5f5f5";
    SystemUI.setBackgroundColorAsync(bg).catch(() => {});
    NavigationBar.setBackgroundColorAsync(bg).catch(() => {});
    NavigationBar.setButtonStyleAsync(
      resolved === "dark" ? "light" : "dark",
    ).catch(() => {});
  }, [resolved]);

  const value = useMemo(
    () => ({ mode, resolved, palette, setMode, toggle }),
    [mode, resolved, palette, setMode, toggle],
  );

  return (
    <ThemeContext.Provider value={value}>
      <StatusBar style={resolved === "dark" ? "light" : "dark"} />
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
