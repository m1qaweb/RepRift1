// /src/pages/ProfilePage.tsx – User profile and security settings.
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext"; // AuthContext now exports updateUser
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import {
  UserCircleIcon,
  EnvelopeIcon,
  CameraIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";
import Spinner from "../components/UI/Spinner";
// Assuming User type from fakeApi.ts or a types file
import { User } from "../utils/fakeApi"; // Import User type if not already

interface ProfileData {
  name: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
}

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (val: string) => void;
  label: string;
  show: boolean;
  toggleShow: () => void;
  error?: string | null;
  disabled?: boolean;
}
const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  value,
  onChange,
  label,
  show,
  toggleShow,
  error,
  disabled,
}) => (
  <div className="space-y-1">
    <label
      htmlFor={id}
      className="text-xs font-medium text-brand-text-muted uppercase tracking-wider"
    >
      {label}
    </label>
    <div className="relative group">
      <LockClosedIcon
        className={`w-5 h-5 absolute left-3.5 top-1/2 transform -translate-y-1/2 
        ${
          disabled
            ? "text-brand-text-muted/50"
            : "text-brand-text-muted group-focus-within:text-brand-primary"
        }`}
      />
      <input
        type={show ? "text" : "password"}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        disabled={disabled}
        className={`w-full px-4 py-3 pl-12 border rounded-lg bg-brand-background text-brand-text
          text-sm transition-all duration-150 ease-in-out
          focus:outline-none focus-visible:ring-2 
          ${
            disabled
              ? "border-brand-border/40 bg-brand-secondary/10 cursor-not-allowed"
              : error
              ? "border-error focus-visible:border-error focus-visible:ring-error/50"
              : "border-brand-border focus-visible:border-brand-primary focus-visible:ring-brand-primary/50"
          }`}
      />
      {!disabled && (
        <button
          type="button"
          onClick={toggleShow}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 text-brand-text-muted hover:text-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary rounded-full"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? (
            <EyeSlashIcon className="w-5 h-5" />
          ) : (
            <EyeIcon className="w-5 h-5" />
          )}
        </button>
      )}
    </div>
    {error && !disabled && (
      <p className="text-xs text-error mt-1 ml-1">{error}</p>
    )}
  </div>
);

const ProfilePage: React.FC = () => {
  const { user, loading: authLoading, updateUser } = useAuth(); // <<< Get updateUser

  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    avatarUrl: "",
    bio: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState<
    string | null
  >(null); // For feedback
  const [profileUpdateError, setProfileUpdateError] = useState<string | null>(
    null
  ); // For feedback
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ... (Password Change State remains the same) ...
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  useEffect(() => {
    if (user) {
      const userData = {
        name: user.name || "",
        email: user.email || "",
        avatarUrl: user.avatarUrl || "",
        bio: user.bio || "",
      };
      setProfileData(userData);
      setAvatarPreview(user.avatarUrl || null);
    }
  }, [user]); // This effect will also re-run if `user` object from AuthContext changes, reflecting updates.

  const handleProfileInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
    setProfileUpdateSuccess(null); // Clear success message on new edit
    setProfileUpdateError(null);
  };
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
      setProfileUpdateSuccess(null); // Clear success message on new edit
      setProfileUpdateError(null);
    }
  };
  const triggerAvatarUpload = () => fileInputRef.current?.click();

  const handleSaveProfile = async () => {
    if (!user) {
      setProfileUpdateError("User session is invalid. Please log in again.");
      return;
    }
    setIsSavingProfile(true);
    setProfileUpdateSuccess(null);
    setProfileUpdateError(null);

    let dataToSubmit: Partial<User> = {
      id: user.id, // Important to pass the user's ID for backend update
      name: profileData.name,
      bio: profileData.bio,
      // avatarUrl will be handled based on avatarFile and avatarPreview
    };

    if (avatarFile && avatarPreview) {
      console.log("Simulating avatar upload for:", avatarFile.name);
      // Real app: urlFromServer = await uploadFileToCloud(avatarFile);
      // dataToSubmit.avatarUrl = urlFromServer;
      // For simulation using Data URL:
      dataToSubmit.avatarUrl = avatarPreview;
    } else {
      // If no new avatar was selected, ensure we don't accidentally clear existing one
      // by sending undefined if profileData.avatarUrl was initially undefined
      dataToSubmit.avatarUrl = profileData.avatarUrl || user.avatarUrl;
    }

    try {
      // Simulate API call to backend for saving profileData and potentially uploaded avatar URL
      await new Promise((r) => setTimeout(r, 1500));

      await updateUser(dataToSubmit); // <<< CALL AuthContext's updateUser

      setProfileUpdateSuccess("Profile updated successfully!");
      setEditMode(false);
      setAvatarFile(null); // Clear the staged file
      // The local component state for profileData will be updated via the useEffect [user]
    } catch (error) {
      console.error("Failed to save profile:", error);
      setProfileUpdateError(
        error instanceof Error
          ? error.message
          : "Failed to update profile. Please try again."
      );
    } finally {
      setIsSavingProfile(false);
    }
  };
  const handleCancelEditProfile = () => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        avatarUrl: user.avatarUrl || "",
        bio: user.bio || "",
      });
      setAvatarPreview(user.avatarUrl || null);
      setAvatarFile(null);
    }
    setEditMode(false);
    setProfileUpdateSuccess(null);
    setProfileUpdateError(null);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    // ... (password change logic - can remain as is, as it's separate from profile data updates) ...
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);
    let hasError = false;
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      hasError = true;
    }
    if (newPassword.length > 0 && newPassword.length < 8) {
      setPasswordError(
        (prev) =>
          (prev ? prev + " " : "") +
          "New password must be at least 8 characters."
      );
      hasError = true;
    } // Combined message example
    if (hasError) return;

    setIsChangingPassword(true);
    try {
      // In real app: await auth.changePassword(oldPassword, newPassword);
      await new Promise((r) => setTimeout(r, 1500));
      setPasswordSuccess("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowOldPass(false);
      setShowNewPass(false);
      setShowConfirmPass(false);
    } catch (error) {
      setPasswordError(
        error instanceof Error
          ? error.message
          : "Failed to change password. Old password might be incorrect or service unavailable."
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  // ... (Animations, Loaders, Default Avatar, ProfileDetailInput sub-component definitions remain the same) ...
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 16, mass: 0.8 },
    },
  };
  const cardBaseClasses =
    "p-6 sm:p-8 bg-brand-card/70 dark:bg-brand-card/60 backdrop-blur-xl border border-brand-border/20 shadow-2xl rounded-xl";

  if (authLoading && !user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Spinner size="xl" />
      </div>
    );
  }
  if (!user && !authLoading) {
    return (
      <div className="text-center p-10 text-brand-text">
        User information unavailable. Please try logging in.
      </div>
    );
  }

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    profileData.name || "U"
  )}&background=rgb(var(--color-primary-rgb))&color=rgb(var(--color-background-rgb))&size=160&font-size=0.33&bold=true&format=svg`;

  const ProfileDetailInput: React.FC<{
    name: keyof ProfileData;
    label: string;
    Icon: React.ElementType;
    type?: string;
    isTextarea?: boolean;
    disabled?: boolean;
    placeholder?: string;
  }> = ({
    name,
    label,
    Icon,
    type = "text",
    isTextarea = false,
    disabled = false,
    placeholder,
  }) => {
    // ... (ProfileDetailInput JSX - no changes here) ...
    const InputComponent = isTextarea ? "textarea" : "input";
    return (
      <div className="space-y-1">
        <label
          htmlFor={name}
          className="text-xs font-medium text-brand-text-muted uppercase tracking-wider"
        >
          {label}
        </label>
        <AnimatePresence mode="wait">
          {!editMode || disabled ? (
            <motion.div
              key="view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-[46px] flex items-center text-brand-text text-sm py-2.5 px-0 break-words"
            >
              {profileData[name] || (
                <span className="italic text-brand-text-muted/70">
                  {placeholder || "Not set"}
                </span>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="edit"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="relative group"
            >
              <Icon
                className={`w-5 h-5 absolute left-3.5 ${
                  isTextarea ? "top-3.5" : "top-1/2 transform -translate-y-1/2"
                } text-brand-text-muted group-focus-within:text-brand-primary`}
              />
              <InputComponent
                type={type}
                name={name}
                id={name}
                value={profileData[name] || ""}
                onChange={handleProfileInputChange}
                rows={isTextarea ? 4 : undefined}
                placeholder={placeholder}
                maxLength={name === "bio" ? 200 : undefined}
                disabled={isSavingProfile || disabled}
                className={`w-full px-4 py-3 pl-12 border rounded-lg bg-brand-background text-brand-text text-sm transition-all duration-150 ease-in-out
                              ${isTextarea ? "min-h-[100px]" : ""}
                              focus:outline-none focus-visible:ring-2 
                              ${
                                disabled
                                  ? "border-brand-border/40 bg-brand-secondary/10 cursor-not-allowed"
                                  : "border-brand-border focus-visible:border-brand-primary focus-visible:ring-brand-primary/50"
                              }`}
              />
              {name === "bio" && editMode && (
                <div className="text-xs text-right text-brand-text-muted mt-1 pr-1">
                  {profileData.bio?.length || 0} / 200
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.div
      key="profilePageRoot"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-3xl mx-auto py-10 sm:py-16 px-4 space-y-10 sm:space-y-12"
    >
      <motion.div variants={itemVariants} className="text-center relative">
        <SparklesIcon className="w-7 h-7 text-brand-accent absolute -top-3 -left-3 opacity-70 transform -rotate-12" />
        <SparklesIcon className="w-5 h-5 text-brand-accent absolute -top-1 -right-1 opacity-50 transform rotate-12" />
        <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-text tracking-tight">
          Account Settings
        </h1>
        <p className="text-brand-text-muted mt-2 text-sm sm:text-base">
          Manage your profile and security preferences.
        </p>
      </motion.div>

      <motion.section variants={itemVariants} aria-labelledby="profile-heading">
        <div className={`relative ${cardBaseClasses}`}>
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            {/* ... Avatar and name display ... */}
            <div className="relative group flex-shrink-0">
              <motion.img
                src={avatarPreview || profileData.avatarUrl || defaultAvatar}
                alt={profileData.name || "User"}
                className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover border-[5px] border-brand-card shadow-2xl bg-brand-secondary/30"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  transition: { delay: 0.2, type: "spring", stiffness: 180 },
                }}
                whileHover={
                  editMode
                    ? {
                        scale: 1.03,
                        boxShadow:
                          "0 0 25px rgb(var(--color-primary-rgb)/0.35)",
                      }
                    : {}
                }
              />
              {editMode && (
                <motion.button
                  onClick={triggerAvatarUpload}
                  disabled={isSavingProfile}
                  title="Change Avatar"
                  className="absolute -bottom-1 -right-1 bg-brand-primary text-[rgb(var(--color-background-rgb))] p-3 rounded-full shadow-lg hover:bg-brand-primary/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-card focus-visible:ring-brand-primary"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.1, rotate: 8 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <CameraIcon className="h-5 w-5" />
                </motion.button>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
                disabled={isSavingProfile}
              />
            </div>
            <div className="flex-grow text-center sm:text-left">
              <motion.h2
                layout="position"
                className="text-2xl sm:text-3xl font-bold text-brand-text"
              >
                {(editMode && profileData.name) || user?.name || "User"}
              </motion.h2>
              <p className="text-sm text-brand-text-muted mt-1">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={itemVariants}
        aria-labelledby="personal-info-heading"
      >
        <Card className={cardBaseClasses}>
          <div className="flex justify-between items-center mb-6">
            <h3
              id="personal-info-heading"
              className="text-xl font-semibold text-brand-text flex items-center"
            >
              <UserCircleIcon className="w-6 h-6 mr-2.5 text-brand-primary" />{" "}
              Personal Information
            </h3>
            {!editMode && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditMode(true);
                  setProfileUpdateSuccess(null);
                  setProfileUpdateError(null);
                }}
                leftIcon={<PencilSquareIcon className="h-4 w-4" />}
              >
                Edit
              </Button>
            )}
          </div>
          {/* Profile Update Feedback */}
          <AnimatePresence>
            {profileUpdateSuccess && !editMode && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 p-3 bg-success/10 border border-success/30 text-success text-sm rounded-md"
              >
                {profileUpdateSuccess}
              </motion.div>
            )}
            {profileUpdateError &&
              editMode && ( // Show error only if in edit mode still or immediately after failed save
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-4 p-3 bg-error/10 border border-error/30 text-error text-sm rounded-md"
                >
                  {profileUpdateError}
                </motion.div>
              )}
          </AnimatePresence>

          <form className="space-y-5">
            <ProfileDetailInput
              name="email"
              label="Email Address"
              Icon={EnvelopeIcon}
              disabled={true}
              placeholder="Your email address"
            />
            <ProfileDetailInput
              name="bio"
              label="Bio"
              Icon={InformationCircleIcon}
              isTextarea={true}
              placeholder={editMode ? "Max 200 chars..." : "No bio set"}
            />

            <AnimatePresence>
              {editMode && (
                <motion.div
                  key="profileActions"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col sm:flex-row justify-end gap-3 pt-5 border-t border-brand-border/50 mt-8"
                >
                  <Button
                    variant="ghost"
                    size="md"
                    onClick={handleCancelEditProfile}
                    disabled={isSavingProfile}
                    leftIcon={<XCircleIcon className="h-5 w-5" />}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleSaveProfile}
                    isLoading={isSavingProfile}
                    disabled={
                      isSavingProfile ||
                      (JSON.stringify(profileData) ===
                        JSON.stringify({
                          name: user?.name || "",
                          email: user?.email || "",
                          avatarUrl: user?.avatarUrl || "",
                          bio: user?.bio || "",
                        }) &&
                        !avatarFile)
                    }
                    leftIcon={<CheckCircleIcon className="h-5 w-5" />}
                  >
                    Save Changes
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </Card>
      </motion.section>

      {/* Change Password Card */}
      <motion.section
        variants={itemVariants}
        aria-labelledby="security-heading"
      >
        <Card className={cardBaseClasses}>
          <h3
            id="security-heading"
            className="text-xl font-semibold text-brand-text mb-6 flex items-center"
          >
            <ShieldCheckIcon className="w-6 h-6 mr-2.5 text-brand-primary" />{" "}
            Security
          </h3>
          <form onSubmit={handleChangePassword} className="space-y-5">
            <PasswordInput
              id="oldPassword"
              label="Current Password"
              value={oldPassword}
              onChange={setOldPassword}
              show={showOldPass}
              toggleShow={() => setShowOldPass(!showOldPass)}
              error={passwordError}
              disabled={isChangingPassword}
            />
            <PasswordInput
              id="newPassword"
              label="New Password"
              value={newPassword}
              onChange={setNewPassword}
              show={showNewPass}
              toggleShow={() => setShowNewPass(!showNewPass)}
              error={passwordError}
              disabled={isChangingPassword}
            />
            <PasswordInput
              id="confirmPassword"
              label="Confirm New Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              show={showConfirmPass}
              toggleShow={() => setShowConfirmPass(!showConfirmPass)}
              error={passwordError}
              disabled={isChangingPassword}
            />

            <AnimatePresence>
              {passwordSuccess && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-success pt-1 font-medium"
                >
                  {passwordSuccess}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="flex justify-end pt-4 border-t border-brand-border/50 mt-8">
              <Button
                type="submit"
                variant="primary"
                isLoading={isChangingPassword}
                disabled={
                  isChangingPassword ||
                  isSavingProfile ||
                  !oldPassword ||
                  !newPassword ||
                  !confirmPassword
                }
              >
                Update Password
              </Button>
            </div>
          </form>
        </Card>
      </motion.section>
    </motion.div>
  );
};

export default ProfilePage;
