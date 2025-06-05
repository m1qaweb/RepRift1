// /src/pages/SettingsPage.tsx
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

  const inputFocusVariants = {
    focus: {
      borderColor: "rgb(var(--color-primary))",
      boxShadow: "0 0 0 2px rgb(var(--color-primary-rgb) / 0.4)",
      transition: { duration: 0.2 },
    },
    blur: {
      borderColor: "rgb(var(--color-border))",
      boxShadow: "0 0 0 0px rgb(var(--color-primary-rgb) / 0)",
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
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }

    setIsChangingPassword(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setPasswordSuccess("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordError(
        "Failed to change password. Please check your old password."
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  interface PasswordInputProps {
    id: string;
    value: string;
    onChange: (val: string) => void;
    label: string;
    show: boolean;
    toggleShow: () => void;
  }

  const PasswordInput: React.FC<PasswordInputProps> = ({
    id,
    value,
    onChange,
    label,
    show,
    toggleShow,
  }) => {
    const hasError =
      (id === "confirmPassword" &&
        passwordError === "New passwords do not match.") ||
      (id === "newPassword" &&
        passwordError === "New password must be at least 8 characters long.");

    return (
      <div>
        {" "}
        <label
          htmlFor={id}
          className="block text-sm font-medium text-brand-text-muted mb-1"
        >
          {label}
        </label>
        <motion.div
          className="relative"
          whileFocus="focus"
          initial="blur"
          variants={inputFocusVariants}
        >
          <LockClosedIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-muted" />
          <input
            type={show ? "text" : "password"}
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required
            className={`w-full px-3 py-2 pl-10 border rounded-md bg-transparent text-brand-text
                          focus:outline-none focus-visible:ring-0 
                          ${hasError ? "border-error" : "border-brand-border"}`}
          />
          <button
            type="button"
            onClick={toggleShow}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-brand-text-muted hover:text-brand-text"
          >
            {show ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        </motion.div>
      </div>
    );
  };

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
          {" "}
          Currently using:{" "}
          <span className="font-semibold capitalize text-brand-text">
            {theme} mode
          </span>{" "}
        </p>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-brand-text">
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
          {passwordError &&
            (passwordError.includes("New password must be") ||
              passwordError.includes("New passwords do not match")) && (
              <p className="text-xs text-error -mt-2 mb-2">{passwordError}</p>
            )}

          <PasswordInput
            id="confirmPassword"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            show={showConfirmPass}
            toggleShow={() => setShowConfirmPass(!showConfirmPass)}
          />
          {passwordError &&
            passwordError.includes("New passwords do not match") && (
              <p className="text-xs text-error -mt-2 mb-2">{passwordError}</p>
            )}

          {passwordError &&
            !(
              passwordError.includes("New password must be") ||
              passwordError.includes("New passwords do not match")
            ) && <p className="text-xs text-error mt-1">{passwordError}</p>}

          {passwordSuccess && (
            <p className="text-sm text-success"> {passwordSuccess}</p>
          )}

          <div className="flex justify-end pt-2">
            {" "}
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
    </motion.div>
  );
};

export default SettingsPage;
