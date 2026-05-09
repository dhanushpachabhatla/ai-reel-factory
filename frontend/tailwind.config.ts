import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#151515",
        paper: "#f7f6f2",
        line: "#dedbd2",
        moss: "#58764b",
        coral: "#d9674f",
        cobalt: "#315f9d",
        amber: "#c58b2b"
      },
      boxShadow: {
        soft: "0 18px 55px rgba(21, 21, 21, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
