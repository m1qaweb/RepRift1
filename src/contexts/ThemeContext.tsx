// /src/contexts/ThemeContext.tsx - Manages application theme (light/dark).
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  // currentThemeColors: ThemeColors; // Optional: provide direct access to color palette
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const storedTheme = localStorage.getItem("appTheme") as ThemeMode | null;
    return (
      storedTheme ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
    );
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("appTheme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Optional: expose specific theme colors
  // const currentThemeColors = theme === 'light' ? themeConfig.light : themeConfig.dark;

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme /*, currentThemeColors */ }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
