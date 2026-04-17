/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        dark: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "var(--theme-bg-950, #020617)",
        },
      },
      textColor: {
        theme: {
          primary: "var(--theme-text-primary, #f1f5f9)",
          secondary: "var(--theme-text-secondary, #cbd5e1)",
        },
      },
      backgroundColor: {
        theme: {
          950: "var(--theme-bg-950, #020617)",
          900: "var(--theme-bg-900, #0f172a)",
          800: "var(--theme-bg-800, #1e293b)",
          700: "var(--theme-bg-700, #334155)",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        glow: "glow 2s ease-in-out infinite",
        /** Workout week — same motion as original Framer, but CSS @keyframes (compositor-friendly) */
        "session-ring": "sessionRingRipple 1s cubic-bezier(0.33, 0, 0.2, 1) infinite",
        "session-dot": "sessionDotPulse 0.9s ease-in-out infinite",
        "completed-halo": "completedHaloPulse 2.5s ease-in-out infinite",
        /** Subtle breathing on the neon ring around the dot (green + orange) */
        "marker-ring": "markerRingSoft 2.8s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(34, 197, 94, 0.5)" },
          "50%": { boxShadow: "0 0 40px rgba(34, 197, 94, 0.8)" },
        },
        /** Orange active ring — was: scale [1, 2.5], opacity [0.8, 0], 1s */
        sessionRingRipple: {
          "0%": {
            transform: "scale(1) translateZ(0)",
            opacity: "0.8",
          },
          "100%": {
            transform: "scale(2.5) translateZ(0)",
            opacity: "0",
          },
        },
        /** Active dot — was: scale [1, 1.2, 1], 0.9s */
        sessionDotPulse: {
          "0%, 100%": { transform: "scale(1) translateZ(0)" },
          "50%": { transform: "scale(1.2) translateZ(0)" },
        },
        /** Green soft halo — opacity only (no scale) so it stays centered; no “ghost” offset */
        completedHaloPulse: {
          "0%, 100%": { opacity: "0.36" },
          "50%": { opacity: "0.58" },
        },
        /** Light opacity + tiny scale — visible but not distracting */
        markerRingSoft: {
          "0%, 100%": {
            transform: "scale(1) translateZ(0)",
            opacity: "0.82",
          },
          "50%": {
            transform: "scale(1.055) translateZ(0)",
            opacity: "1",
          },
        },
      },
    },
  },
  plugins: [],
};
