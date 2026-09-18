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
          500: "#0770E3",
          600: "#065BB8",
          700: "#04478F",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F5F7FA",
          dark: "#0B1220",
          "dark-muted": "#111827",
        },
        ink: {
          DEFAULT: "#0B1220",
          muted: "#4B5563",
          inverse: "#F9FAFB",
        },
        eco: {
          DEFAULT: "#16A34A",
          soft: "#DCFCE7",
        },
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
      },
    },
  },
  plugins: [],
} satisfies Config;
