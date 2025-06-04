// /src/pages/SettingsPage.tsx – Page for app settings like theme, password change.
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import {
  SunIcon,
  MoonIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Motion variants for input focus
  const inputFocusVariants = {
    focus: {
      borderColor: "var(--color-primary, #3B82F6)",
      boxShadow: "0 0 0 3px rgba(var(--color-primary-rgb), 0.3)", // Ensure --color-primary-rgb is defined
      transition: { duration: 0.2 },
    },
    blur: {
      borderColor: "var(--color-border, #E5E7EB)", // Assuming --color-border from your theme
      boxShadow: "0 0 0 0px rgba(var(--color-primary-rgb), 0)",
      transition: { duration: 0.2 },
    },
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      // Basic validation
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }

    setIsChangingPassword(true);
    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // On success:
      setPasswordSuccess("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      // On failure:
      setPasswordError(
        "Failed to change password. Please check your old password."
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  const PasswordInput: React.FC<{
    id: string;
    value: string;
    onChange: (val: string) => void;
    label: string;
    show: boolean;
    toggleShow: () => void;
    error?: string | null;
  }> = ({ id, value, onChange, label, show, toggleShow, error }) => (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-light-secondary dark:text-dark-secondary mb-1"
      >
        {label}
      </label>
      <motion.div
        className="relative"
        whileFocus="focus"
        initial="blur"
        variants={inputFocusVariants}
      >
        <LockClosedIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type={show ? "text" : "password"}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          className={`w-full px-3 py-2 pl-10 border rounded-md bg-transparent 
                        focus:outline-none focus-visible:ring-0  /* ring handled by motion */
                        ${
                          error
                            ? "border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
        />
        <button
          type="button"
          onClick={toggleShow}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          {show ? (
            <EyeSlashIcon className="w-5 h-5" />
          ) : (
            <EyeIcon className="w-5 h-5" />
          )}
        </button>
      </motion.div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">
        Settings
      </h1>

      {/* Theme Settings Card */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-light-text dark:text-dark-text">
          Appearance
        </h2>
        <div className="flex items-center justify-between">
          <p className="text-light-secondary dark:text-dark-secondary">Theme</p>
          <motion.div
            className="relative w-16 h-8 flex items-center rounded-full p-1 cursor-pointer bg-gray-200 dark:bg-gray-700"
            onClick={toggleTheme}
            animate={{
              backgroundColor:
                theme === "dark" ? "rgb(55 65 81)" : "rgb(229 231 235)",
            }} // Animate background color transition
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
              layout // Enables smooth transition of the handle
              transition={{ type: "spring", stiffness: 700, damping: 30 }}
              style={{ x: theme === "dark" ? "100%" : "0%" }} // Position handle based on theme
            >
              {theme === "dark" ? (
                <MoonIcon className="h-4 w-4 text-slate-700" />
              ) : (
                <SunIcon className="h-4 w-4 text-yellow-500" />
              )}
            </motion.div>
          </motion.div>
        </div>
        <p className="text-xs text-light-secondary dark:text-dark-secondary mt-2">
          Currently using:{" "}
          <span className="font-semibold capitalize">{theme} mode</span>
        </p>
      </Card>

      {/* Password Change Card */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-light-text dark:text-dark-text">
          Change Password
        </h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <PasswordInput
            id="oldPassword"
            label="Old Password"
            value={oldPassword}
            onChange={setOldPassword}
            show={showOldPass}
            toggleShow={() => setShowOldPass(!showOldPass)}
          />
          <PasswordInput
            id="newPassword"
            label="New Password"
            value={newPassword}
            onChange={setNewPassword}
            show={showNewPass}
            toggleShow={() => setShowNewPass(!showNewPass)}
          />
          <PasswordInput
            id="confirmPassword"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            show={showConfirmPass}
            toggleShow={() => setShowConfirmPass(!showConfirmPass)}
            error={passwordError}
          />

          {passwordSuccess && (
            <p className="text-sm text-green-600 dark:text-green-400">
              {passwordSuccess}
            </p>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              isLoading={isChangingPassword}
              disabled={isChangingPassword}
            >
              Change Password
            </Button>
          </div>
        </form>
      </Card>

      {/* Add more settings sections as needed (e.g., Notifications, Data Export) */}
    </motion.div>
  );
};
// CSS Vars for this page:
// --color-primary (used by input focus), --color-border (input blur), --color-primary-rgb

export default SettingsPage;
