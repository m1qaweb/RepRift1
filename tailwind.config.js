/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"], // Ensure this covers all files using Tailwind classes
  darkMode: "class", // This is CRITICAL
  theme: {
    extend: {
      colors: {
        "brand-background": "rgb(var(--color-background-rgb) / <alpha-value>)",
        "brand-card": "rgb(var(--color-card-rgb) / <alpha-value>)",
        "brand-text": "rgb(var(--color-text-rgb) / <alpha-value>)",
        "brand-text-muted": "rgb(var(--color-text-muted-rgb) / <alpha-value>)",
        "brand-primary": "rgb(var(--color-primary-rgb) / <alpha-value>)",
        "brand-primary-content":
          "rgb(var(--color-primary-content-rgb) / <alpha-value>)",
        "brand-secondary": "rgb(var(--color-secondary-rgb) / <alpha-value>)",
        "brand-accent": "rgb(var(--color-accent-rgb) / <alpha-value>)",
        "brand-border": "rgb(var(--color-border-rgb) / <alpha-value>)",
        "brand-surface": "rgb(var(--color-surface-rgb) / <alpha-value>)",
        error: "rgb(var(--color-error-rgb) / <alpha-value>)",
        success: "rgb(var(--color-success-rgb) / <alpha-value>)",
        warning: "rgb(var(--color-warning-rgb) / <alpha-value>)",
      },
      boxShadow: {
        brand: "var(--shadow-card)",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      keyframes: {
        pulseRed: {
          "0%, 100%": {
            boxShadow: "0 0 0 0 rgb(var(--color-error-rgb) / 0.4)",
          },
          "50%": { boxShadow: "0 0 0 6px rgb(var(--color-error-rgb) / 0)" },
        },
      },
      animation: {
        "pulse-red": "pulseRed 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
