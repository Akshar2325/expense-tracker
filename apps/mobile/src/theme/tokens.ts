/**
 * Design tokens mirroring the web app (DESIGN.md).
 * Light + Dark palettes, shared gradients, spacing, radii, typography.
 */

export type ThemeMode = "light" | "dark" | "system";

export interface Palette {
  canvas: string;
  canvasSoft: string;
  canvasDeep: string;
  ink: string;
  body: string;
  bodyStrong: string;
  muted: string;
  mutedSoft: string;
  hairline: string;
  hairlineSoft: string;
  hairlineStrong: string;
  surfaceCard: string;
  surfaceStrong: string;
  surfaceDark: string;
  surfaceDarkElevated: string;
  /** Neutral surface for inputs / subtle fills. */
  surface: string;
  /** Mint accent used for progress / positive fills. */
  accentGreen: string;
  /** Track background for progress bars. */
  progressBg: string;
  primary: string;
  primaryActive: string;
  onPrimary: string;
  onDark: string;
  onDarkSoft: string;
  semanticError: string;
  semanticSuccess: string;
  /** Glassmorphism helpers */
  glass: string;
  glassBorder: string;
  glassHighlight: string;
}

export const lightPalette: Palette = {
  canvas: "#f5f5f5",
  canvasSoft: "#fafafa",
  canvasDeep: "#0c0a09",
  ink: "#0c0a09",
  body: "#4e4e4e",
  bodyStrong: "#292524",
  muted: "#777169",
  mutedSoft: "#a8a29e",
  hairline: "#e7e5e4",
  hairlineSoft: "#f0efed",
  hairlineStrong: "#d6d3d1",
  surfaceCard: "#ffffff",
  surfaceStrong: "#f0efed",
  surfaceDark: "#0c0a09",
  surfaceDarkElevated: "#1c1917",
  surface: "#ffffff",
  accentGreen: "#a7e5d3",
  progressBg: "#e7e5e4",
  primary: "#292524",
  primaryActive: "#0c0a09",
  onPrimary: "#ffffff",
  onDark: "#ffffff",
  onDarkSoft: "#a8a29e",
  semanticError: "#dc2626",
  semanticSuccess: "#16a34a",
  glass: "rgba(255, 255, 255, 0.55)",
  glassBorder: "rgba(255, 255, 255, 0.65)",
  glassHighlight: "rgba(255, 255, 255, 0.8)",
};

export const darkPalette: Palette = {
  canvas: "#0c0a09",
  canvasSoft: "#141210",
  canvasDeep: "#0c0a09",
  ink: "#f5f5f5",
  body: "#d6d3d1",
  bodyStrong: "#e7e5e4",
  muted: "#a8a29e",
  mutedSoft: "#78716c",
  hairline: "#292524",
  hairlineSoft: "#1c1917",
  hairlineStrong: "#44403c",
  surfaceCard: "#1c1917",
  surfaceStrong: "#292524",
  surfaceDark: "#f5f5f5",
  surfaceDarkElevated: "#e7e5e4",
  surface: "#1c1917",
  accentGreen: "#34d399",
  progressBg: "#292524",
  primary: "#f5f5f5",
  primaryActive: "#e7e5e4",
  onPrimary: "#0c0a09",
  onDark: "#0c0a09",
  onDarkSoft: "#78716c",
  semanticError: "#f87171",
  semanticSuccess: "#4ade80",
  glass: "rgba(28, 25, 23, 0.55)",
  glassBorder: "rgba(255, 255, 255, 0.12)",
  glassHighlight: "rgba(255, 255, 255, 0.08)",
};

/** Pastel gradient orbs — shared across themes (softened in dark via opacity). */
export const gradients = {
  mint: ["#d9f5ec", "#a7e5d3"],
  peach: ["#fde8d8", "#f4c5a8"],
  lavender: ["#e6e0f5", "#c8b8e0"],
  sky: ["#dcebf7", "#a8c8e8"],
  rose: ["#f8dde4", "#e8b8c4"],
  primary: ["#44403c", "#292524"],
  primaryLight: ["#f5f5f5", "#e7e5e4"],
} as const;

export type GradientName = keyof typeof gradients;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  base: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 48,
  section: 96,
} as const;

export const radius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 36,
  pill: 9999,
} as const;

export const fontSize = {
  caption: 12,
  bodySm: 13,
  body: 15,
  bodyMd: 16,
  titleSm: 17,
  title: 19,
  titleMd: 21,
  titleLg: 26,
  displaySm: 30,
  display: 38,
  displayLg: 46,
  displayMega: 64,
} as const;

export const fontFamily = {
  display: "EBGaramond_500Medium",
  displayBold: "EBGaramond_700Bold",
  body: "Inter_400Regular",
  bodyMedium: "Inter_500Medium",
  bodySemibold: "Inter_600SemiBold",
  bodyBold: "Inter_700Bold",
} as const;

export const shadow = {
  soft: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  softLg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 28,
    elevation: 6,
  },
} as const;
