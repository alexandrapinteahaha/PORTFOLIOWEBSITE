import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#171717",
        paper: "#f7f6f2",
        chalk: "#fbfaf7",
        line: "#d8d4cc",
        mist: "#edeae4",
        graphite: "#4b4a47",
        rust: "#8f4d34",
        moss: "#566654"
      },
      fontFamily: {
        title: ["Myanmar Text", "serif"],
        sans: ["Minion Pro", "Georgia", "serif"],
        serif: ["Minion Pro", "Georgia", "serif"],
        mono: ["Minion Pro", "Courier New", "monospace"]
      },
      letterSpacing: {
        label: "0.22em",
        wide: "0.12em",
        title: "0.12em"
      },
      fontSize: {
        label: ["11px", { letterSpacing: "0.22em" }],
        xs:   ["0.875rem",  { lineHeight: "1.5" }],   /* 14px */
        sm:   ["1.0625rem", { lineHeight: "1.8" }],   /* 17px — was 14px */
        base: ["1.25rem",   { lineHeight: "1.85" }],  /* 20px — was 16px */
        lg:   ["1.375rem",  { lineHeight: "1.75" }],  /* 22px */
        xl:   ["1.5rem",    { lineHeight: "1.65" }],  /* 24px */
      }
    }
  },
  plugins: []
};

export default config;
