import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        foreground: "#ffffff"
      },
      letterSpacing: {
        wideLuxury: "0.2em"
      },
      fontFamily: {
        sans: ["Geist", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Iowan Old Style", "Palatino Linotype", "Book Antiqua", "Georgia", "serif"]
      },
      boxShadow: {
        ambient: "0 0 120px rgba(255, 255, 255, 0.08)"
      },
      backgroundImage: {
        "luxury-grid": "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
