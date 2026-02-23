/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f0ff",
          100: "#e4e4ff",
          200: "#cdcdfe",
          300: "#a9a8fd",
          400: "#7e7afb",
          500: "#6057f6",
          600: "#5139eb",
          700: "#4530d0",
          800: "#3829a9",
          900: "#302685",
          950: "#1c155b",
        },
        surface: {
          900: "#0d0d14",
          800: "#13131f",
          700: "#1a1a2e",
          600: "#212138",
          500: "#2a2a45",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-mesh":
          "radial-gradient(at 40% 20%, hsla(252,83%,57%,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(225,83%,60%,0.12) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(270,83%,57%,0.10) 0px, transparent 50%)",
        "gradient-brand":
          "linear-gradient(135deg, #6057f6 0%, #8b5cf6 50%, #7c3aed 100%)",
        "gradient-card":
          "linear-gradient(135deg, rgba(96,87,246,0.08) 0%, rgba(139,92,246,0.04) 100%)",
      },
      boxShadow: {
        "glass-sm":
          "0 2px 8px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.04)",
        "glass-md":
          "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
        "glass-lg":
          "0 8px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
        brand: "0 0 24px rgba(96,87,246,0.35)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      backdropBlur: {
        xs: "4px",
      },
      animation: {
        shimmer: "shimmer 1.8s infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
