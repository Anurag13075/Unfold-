import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "var(--ink-950)",
          900: "var(--ink-900)",
        },
        surface: {
          800: "var(--surface-800)",
          700: "var(--surface-700)",
          600: "var(--surface-600)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
        },
        border: {
          DEFAULT: "var(--border-default)",
          strong: "var(--border-strong)",
        },
        ember: {
          500: "var(--ember-500)",
          700: "var(--ember-700)",
          wash: "var(--ember-wash)",
        },
        pulse: {
          500: "var(--pulse-500)",
          700: "var(--pulse-700)",
          wash: "var(--pulse-wash)",
        },
        flatline: {
          500: "var(--flatline-500)",
          700: "var(--flatline-700)",
          wash: "var(--flatline-wash)",
        },
      },
      fontFamily: {
        display: ["var(--font-cabinet)", "system-ui", "sans-serif"],
        body: ["var(--font-switzer)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-xl": ["56px", { lineHeight: "60px", letterSpacing: "-0.02em" }],
        "display-l": ["40px", { lineHeight: "44px", letterSpacing: "-0.015em" }],
        "display-m": ["28px", { lineHeight: "34px", letterSpacing: "-0.01em" }],
        "body-l": ["17px", { lineHeight: "26px" }],
        "body-m": ["15px", { lineHeight: "22px" }],
        "body-s": ["13px", { lineHeight: "18px", letterSpacing: "0.01em" }],
        "mono-l": ["20px", { lineHeight: "26px" }],
        "mono-m": ["14px", { lineHeight: "20px" }],
        "mono-s": ["12px", { lineHeight: "16px" }],
      },
      spacing: {
        "18": "72px",
        "30": "120px",
      },
      maxWidth: {
        container: "1440px",
      },
      borderRadius: {
        chip: "4px",
        btn: "8px",
        card: "12px",
        modal: "16px",
      },
      boxShadow: {
        modal: "0 24px 48px -12px rgba(0,0,0,0.55)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "recovery": "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      gridTemplateColumns: {
        dashboard: "minmax(640px, 1fr) 380px",
      },
    },
  },
  plugins: [],
};

export default config;
