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
          /* Cordros / institutional accent: primary actions (Generate, Export, Send) */
          accent: "#b91c1c",
          "accent-hover": "#991b1b",
          "accent-muted": "#fef2f2",
        },
      },
    },
  },
  plugins: [],
};

export default config;
