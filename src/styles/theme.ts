// /src/styles/theme.ts - Exports theme configuration for light/dark modes.

export interface ThemeColors {
  background: string;
  text: string;
  primary: string;
  secondary: string;
  accent: string;
  card: string;
  border: string;
  mutedText: string;
}

export interface AppTheme {
  light: ThemeColors;
  dark: ThemeColors;
}

// Tailwind color names are used here for easier reference with tailwind.config.js
// but these specific hex values are for programmatic use (e.g. charts, JS-driven styles)
// Tailwind classes are preferred for direct styling in components.
export const themeConfig: AppTheme = {
  light: {
    background: "#FFFFFF", // bg-white
    text: "#111827", // text-gray-900
    primary: "#3B82F6", // bg-blue-500
    secondary: "#6B7280", // text-gray-500
    accent: "#10B981", // bg-emerald-500
    card: "#F9FAFB", // bg-gray-50
    border: "#E5E7EB", // border-gray-200
    mutedText: "#6B7280", // text-gray-500
  },
  dark: {
    background: "#1F2937", // bg-gray-800
    text: "#F9FAFB", // text-gray-50
    primary: "#60A5FA", // bg-blue-400
    secondary: "#9CA3AF", // text-gray-400
    accent: "#34D399", // bg-emerald-400
    card: "#374151", // bg-gray-700
    border: "#4B5563", // border-gray-600
    mutedText: "#9CA3AF", // text-gray-400
  },
};

// You can also export functions to get specific theme variables based on current mode
// but ThemeContext will usually handle providing these through CSS variables or classes.
