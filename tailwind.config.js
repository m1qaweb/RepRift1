// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // Instruct Tailwind to scan these files for classes
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scans all .js, .jsx, .ts, .tsx files in the src folder
    "./public/index.html", // Include index.html if you ever use Tailwind classes there (less common for CRA)
  ],
  darkMode: "class", // Enables dark mode based on a 'dark' class on the html element (controlled by ThemeContext.tsx)
  theme: {
    extend: {
      // Here you can extend Tailwind's default theme
      colors: {
        // Define your light and dark theme colors as per your design.
        // These are used if you need to access theme colors in JS or for custom components,
        // but primarily you'll use Tailwind's built-in color classes or define new ones.
        // This matches the example given earlier.
        light: {
          background: "#FFFFFF", // e.g., bg-light-background
          text: "#111827", // e.g., text-light-text
          primary: "#3B82F6", // e.g., bg-light-primary
          secondary: "#6B7280", // e.g., text-light-secondary
          accent: "#10B981", // e.g., bg-light-accent
          card: "#F9FAFB", // e.g., bg-light-card
          border: "#E5E7EB", // e.g., border-light-border
        },
        dark: {
          background: "#1F2937", // e.g., bg-dark-background
          text: "#F9FAFB", // e.g., text-dark-text
          primary: "#60A5FA", // e.g., bg-dark-primary
          secondary: "#9CA3AF", // e.g., text-dark-secondary
          accent: "#34D399", // e.g., bg-dark-accent
          card: "#374151", // e.g., bg-dark-card
          border: "#4B5563", // e.g., border-dark-border
        },
        // You can also add specific color names directly:
        // 'brand-blue': '#007bff',
        // 'brand-green': '#28a745',
      },
      fontFamily: {
        // Example: If you want to use a custom font family like Inter
        // sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', "Segoe UI", 'Roboto', "Helvetica Neue", 'Arial', "Noto Sans", 'sans-serif', "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"],
        sans: ["Inter", "sans-serif"], // Make sure 'Inter' is imported in your global CSS or linked in index.html
      },
      keyframes: {
        // For Framer Motion animations or custom CSS animations defined here
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-5px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(5px)" },
        },
        pulseRed: {
          // Used in ProgramEditorForm.tsx -> ExerciseInput.tsx
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(239, 68, 68, 0.4)" }, // red-500
          "50%": { boxShadow: "0 0 0 5px rgba(239, 68, 68, 0)" },
        },
        // Add other keyframes if needed
      },
      animation: {
        // Make keyframes usable as utility classes like 'animate-shake'
        shake: "shake 0.5s ease-in-out",
        "pulse-red": "pulseRed 1s ease-in-out",
      },
    },
  },
  plugins: [
    // Add any Tailwind plugins here
    require("@tailwindcss/forms"), // For better default styling of form elements
    // require('@tailwindcss/typography'), // If you need prose styling
    // require('@tailwindcss/aspect-ratio'), // For aspect ratio utilities
  ],
};
