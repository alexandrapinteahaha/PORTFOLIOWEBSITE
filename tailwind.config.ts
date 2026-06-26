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
        sans: ["Myanmar Text", "Segoe UI", "system-ui", "sans-serif"],
        serif: ["Myanmar Text", "Segoe UI", "system-ui", "sans-serif"],
        mono: ["Myanmar Text", "Courier New", "monospace"]
      },
      letterSpacing: {
        label: "0.22em",
        wide: "0.15em",
        widest: "0.35em"
      },
      borderStyle: {
        dot: "dotted"
      }
    }
  },
  plugins: []
};

export default config;
