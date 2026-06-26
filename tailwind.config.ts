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
        label: ["11px", { letterSpacing: "0.22em" }]
      }
    }
  },
  plugins: []
};

export default config;
