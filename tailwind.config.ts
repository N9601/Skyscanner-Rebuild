import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0770E3",
          50: "#EEF6FF",
          100: "#D9EAFF",
          200: "#B5D7FF",
          300: "#84BDFF",
          400: "#4A9BF5",
          500: "#0770E3",
          600: "#065BB8",
          700: "#04478F",
          800: "#063868",
          900: "#082C4E",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F4F6FB",
          dark: "#0A0F1E",
          "dark-muted": "#131A2E",
        },
        ink: {
          DEFAULT: "#0B1220",
          muted: "#5B6472",
          soft: "#8A93A3",
          inverse: "#F8FAFC",
        },
        eco: {
          DEFAULT: "#16A34A",
          soft: "#DCFCE7",
          dark: "#134E2A",
        },
        amberglow: "#F59E0B",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Manrope", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,23,42,0.04), 0 4px 12px rgba(15,23,42,0.06)",
        lifted: "0 2px 4px rgba(15,23,42,0.05), 0 12px 32px rgba(15,23,42,0.10)",
        glow: "0 0 0 1px rgba(7,112,227,0.10), 0 8px 24px rgba(7,112,227,0.18)",
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(rgba(7,112,227,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(7,112,227,0.05) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
} satisfies Config;
