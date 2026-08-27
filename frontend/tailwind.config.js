/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f7f5",
          100: "#dcebe4",
          200: "#bcd9cc",
          300: "#8fc0aa",
          400: "#3f9c78",
          500: "#237a58",
          600: "#1a5f44",
          700: "#164e38",
          800: "#123d2c",
          900: "#0f2e21",
        },
        ink: "#12181a",
        surface: {
          DEFAULT: "#ffffff",
          muted: "#f8faf9",
          sunken: "#f1f5f3",
        },
        success: { 50: "#ecfdf5", 500: "#10b981", 700: "#047857" },
        warning: { 50: "#fffbeb", 500: "#f59e0b", 700: "#b45309" },
        danger: { 50: "#fef2f2", 500: "#ef4444", 700: "#b91c1c" },
        info: { 50: "#eff6ff", 500: "#3b82f6", 700: "#1d4ed8" },
      },
      fontFamily: {
        display: ["'Sora'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      // Tailwind ships no numeric font-weight utilities, but the codebase uses
      // `font-700` / `font-800` throughout. Registering them here makes every
      // existing heading and price actually render bold.
      fontWeight: {
        400: "400",
        500: "500",
        600: "600",
        700: "700",
        800: "800",
      },
      boxShadow: {
        soft: "0 1px 2px 0 rgb(18 24 26 / 0.04), 0 1px 3px 0 rgb(18 24 26 / 0.06)",
        card: "0 2px 4px -1px rgb(18 24 26 / 0.05), 0 4px 12px -2px rgb(18 24 26 / 0.08)",
        lift: "0 8px 16px -4px rgb(18 24 26 / 0.1), 0 16px 32px -8px rgb(18 24 26 / 0.12)",
        ring: "0 0 0 3px rgb(35 122 88 / 0.15)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.3s ease-out both",
        "scale-in": "scale-in 0.18s ease-out",
      },
    },
  },
  plugins: [],
};
