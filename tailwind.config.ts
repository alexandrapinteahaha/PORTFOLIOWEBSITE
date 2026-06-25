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
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"]
      },
      boxShadow: {
        soft: "0 18px 45px rgba(23, 23, 23, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
