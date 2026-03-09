import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nautilus: {
          teal: "#0d9488",
          "teal-light": "#ccfbf1",
          "teal-dark": "#0f766e",
          slate: "#475569",
          "slate-light": "#f1f5f9",
          pill: "#e2e8f0",
          "pill-text": "#334155",
          /* Primary accent: teal (easy on the eyes) */
          accent: "#0d9488",
          "accent-hover": "#0f766e",
          "accent-muted": "#f0fdfa",
        },
      },
    },
  },
  plugins: [],
};

export default config;
