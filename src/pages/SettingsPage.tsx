// /src/pages/SettingsPage.tsx (FINAL, PRODUCTION-READY VERSION)

import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";

import Card from "../components/UI/Card";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  // Get the real changePassword function from our context.

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      <h1 className="text-3xl font-bold text-brand-text">Settings</h1>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-brand-text">
          Appearance
        </h2>
        <div className="flex items-center justify-between">
          <p className="text-brand-text-muted">Theme</p>
          <motion.div
            className="relative w-16 h-8 flex items-center rounded-full p-1 cursor-pointer bg-brand-border"
            onClick={toggleTheme}
          >
            <motion.div
              className="w-6 h-6 bg-brand-card shadow-md flex items-center justify-center rounded-full"
              layout
              transition={{ type: "spring", stiffness: 700, damping: 30 }}
              style={{ x: theme === "dark" ? "calc(100% - 2px)" : "2px" }}
            >
              {theme === "dark" ? (
                <MoonIcon className="h-4 w-4 text-brand-text" />
              ) : (
                <SunIcon className="h-4 w-4 text-brand-text" />
              )}
            </motion.div>
          </motion.div>
        </div>
        <p className="text-xs text-brand-text-muted mt-2">
          Currently using:{" "}
          <span className="font-semibold capitalize text-brand-text">
            {theme} mode
          </span>
        </p>
      </Card>
    </motion.div>
  );
};

export default SettingsPage;
