import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Brand & accent — resolved from CSS variables so they flip in dark mode
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        "primary-active": "rgb(var(--color-primary-active) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        body: "rgb(var(--color-body) / <alpha-value>)",
        "body-strong": "rgb(var(--color-body-strong) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        "muted-soft": "rgb(var(--color-muted-soft) / <alpha-value>)",
        hairline: "rgb(var(--color-hairline) / <alpha-value>)",
        "hairline-soft": "rgb(var(--color-hairline-soft) / <alpha-value>)",
        "hairline-strong": "rgb(var(--color-hairline-strong) / <alpha-value>)",
        canvas: "rgb(var(--color-canvas) / <alpha-value>)",
        "canvas-soft": "rgb(var(--color-canvas-soft) / <alpha-value>)",
        "canvas-deep": "rgb(var(--color-canvas-deep) / <alpha-value>)",
        "surface-card": "rgb(var(--color-surface-card) / <alpha-value>)",
        "surface-strong": "rgb(var(--color-surface-strong) / <alpha-value>)",
        "surface-dark": "rgb(var(--color-surface-dark) / <alpha-value>)",
        "surface-dark-elevated":
          "rgb(var(--color-surface-dark-elevated) / <alpha-value>)",
        "on-primary": "rgb(var(--color-on-primary) / <alpha-value>)",
        "on-dark": "rgb(var(--color-on-dark) / <alpha-value>)",
        "on-dark-soft": "rgb(var(--color-on-dark-soft) / <alpha-value>)",
        // Atmospheric gradient orbs (decoration only)
        "gradient-mint": "#a7e5d3",
        "gradient-peach": "#f4c5a8",
        "gradient-lavender": "#c8b8e0",
        "gradient-sky": "#a8c8e8",
        "gradient-rose": "#e8b8c4",
        // Semantic
        "semantic-error": "rgb(var(--color-semantic-error) / <alpha-value>)",
        "semantic-success":
          "rgb(var(--color-semantic-success) / <alpha-value>)",
      },
      fontFamily: {
        // Waldenburg Light substitute: EB Garamond at weight 300
        display: ["'EB Garamond'", "'Times New Roman'", "serif"],
        sans: ["'Inter'", "sans-serif"],
      },
      fontSize: {
        // Display (Waldenburg Light 300)
        "display-mega": [
          "64px",
          { lineHeight: "1.05", letterSpacing: "-1.92px", fontWeight: "300" },
        ],
        "display-xl": [
          "48px",
          { lineHeight: "1.08", letterSpacing: "-0.96px", fontWeight: "300" },
        ],
        "display-lg": [
          "36px",
          { lineHeight: "1.17", letterSpacing: "-0.36px", fontWeight: "300" },
        ],
        "display-md": [
          "32px",
          { lineHeight: "1.13", letterSpacing: "-0.32px", fontWeight: "300" },
        ],
        "display-sm": [
          "24px",
          { lineHeight: "1.2", letterSpacing: "0", fontWeight: "300" },
        ],
        // Titles (Inter)
        "title-md": [
          "20px",
          { lineHeight: "1.35", letterSpacing: "0", fontWeight: "500" },
        ],
        "title-sm": [
          "18px",
          { lineHeight: "1.44", letterSpacing: "0.18px", fontWeight: "500" },
        ],
        // Body (Inter)
        "body-md": [
          "16px",
          { lineHeight: "1.5", letterSpacing: "0.16px", fontWeight: "400" },
        ],
        "body-strong": [
          "16px",
          { lineHeight: "1.5", letterSpacing: "0.16px", fontWeight: "500" },
        ],
        "body-sm": [
          "15px",
          { lineHeight: "1.47", letterSpacing: "0.15px", fontWeight: "400" },
        ],
        caption: [
          "14px",
          { lineHeight: "1.5", letterSpacing: "0", fontWeight: "400" },
        ],
        "caption-uppercase": [
          "12px",
          { lineHeight: "1.4", letterSpacing: "0.96px", fontWeight: "600" },
        ],
        button: [
          "15px",
          { lineHeight: "1.0", letterSpacing: "0", fontWeight: "500" },
        ],
        "nav-link": [
          "15px",
          { lineHeight: "1.4", letterSpacing: "0", fontWeight: "500" },
        ],
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        xxl: "24px",
        pill: "9999px",
        full: "9999px",
      },
      spacing: {
        xxs: "4px",
        xs: "8px",
        sm: "12px",
        base: "16px",
        md: "20px",
        lg: "24px",
        xl: "32px",
        xxl: "48px",
        section: "96px",
      },
      boxShadow: {
        // Single soft drop tier
        soft: "0 4px 16px rgba(0, 0, 0, 0.04)",
        "soft-lg": "0 8px 32px rgba(0, 0, 0, 0.06)",
      },
      maxWidth: {
        content: "1200px",
      },
      keyframes: {
        "orb-drift": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(20px, -15px) scale(1.05)" },
          "66%": { transform: "translate(-15px, 10px) scale(0.97)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "orb-drift": "orb-drift 18s ease-in-out infinite",
        "fade-up": "fade-up 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
