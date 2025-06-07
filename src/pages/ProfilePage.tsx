// /src/pages/ProfilePage.tsx (FINAL REFINED VERSION)

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import { uploadAvatar } from "../services/storageService";
import Spinner from "../components/UI/Spinner";
import {
  CameraIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  PencilSquareIcon as PencilIcon,
  SparklesIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

// --- CHILD COMPONENTS (Defined inside for self-containment) ---

interface ProfileFormData {
  name: string;
  bio: string;
}

const ProfileInput: React.FC<{
  label: string;
  name: keyof ProfileFormData;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  disabled: boolean;
  isTextarea?: boolean;
  placeholder?: string;
}> = ({
  label,
  name,
  value,
  onChange,
  disabled,
  isTextarea = false,
  placeholder,
}) => (
  <div className="space-y-1 w-full">
    <label htmlFor={name} className="text-sm font-medium text-brand-text-muted">
      {label}
    </label>
    {isTextarea ? (
      <textarea
        id={name}
        name={name}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        rows={5}
        placeholder={placeholder}
        className="w-full text-sm bg-brand-background border-2 border-brand-border/40 focus:border-brand-primary focus:ring-brand-primary rounded-lg p-3 transition-colors"
      />
    ) : (
      <input
        type="text"
        id={name}
        name={name}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full text-sm bg-brand-background border-2 border-brand-border/40 focus:border-brand-primary focus:ring-brand-primary rounded-lg p-3 transition-colors"
      />
    )}
  </div>
);

const ProfileAvatar: React.FC<{
  avatarUrl?: string | null;
  defaultAvatar: string;
  name: string;
  editMode: boolean;
  isSaving: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ avatarUrl, defaultAvatar, name, editMode, isSaving, onFileChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const triggerAvatarUpload = () => fileInputRef.current?.click();
  return (
    <div className="relative group w-32 h-32 mx-auto">
      <motion.img
        key={avatarUrl}
        src={avatarUrl || defaultAvatar}
        alt="User Avatar"
        className="w-full h-full rounded-full object-cover border-4 border-brand-card/50 shadow-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      />
      <AnimatePresence>
        {editMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer transition-opacity"
            onClick={triggerAvatarUpload}
          >
            <CameraIcon className="h-8 w-8 text-white/80" />
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileChange}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
              disabled={isSaving}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
const ProfilePage: React.FC = () => {
  const { user, loading: authLoading, updateUser } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    bio: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Core logic functions remain unchanged.
  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || "", bio: user.bio || "" });
      setAvatarPreview(user.avatarUrl || null);
    }
  }, [user]);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFeedback(null);
  };
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setFeedback(null);
    }
  };
  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    setFeedback(null);
    try {
      let finalAvatarUrl = user.avatarUrl;
      if (avatarFile) {
        finalAvatarUrl = await uploadAvatar(user.id, avatarFile);
      }
      await updateUser({
        name: formData.name,
        bio: formData.bio,
        avatarUrl: finalAvatarUrl,
      });
      setFeedback({
        type: "success",
        message: "Profile updated successfully!",
      });
      setEditMode(false);
      setAvatarFile(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred.";
      console.error("Failed to save profile:", error);
      setFeedback({ type: "error", message: `Update failed: ${message}` });
    } finally {
      setIsSaving(false);
    }
  };
  const handleCancel = () => {
    if (user) {
      setFormData({ name: user.name || "", bio: user.bio || "" });
      setAvatarPreview(user.avatarUrl || null);
      setAvatarFile(null);
    }
    setEditMode(false);
    setFeedback(null);
  };

  if (authLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Spinner size="xl" />
      </div>
    );
  }
  if (!user && !authLoading) {
    return (
      <div className="text-center p-10">
        User information unavailable. Please try logging in.
      </div>
    );
  }

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user.name || "U"
  )}&size=128&background=random&color=fff&font-size=0.4&bold=true`;
  const isDirty =
    JSON.stringify(formData) !==
      JSON.stringify({ name: user.name || "", bio: user.bio || "" }) ||
    !!avatarFile;

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
      }}
      className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8"
    >
      <motion.div
        variants={{
          initial: { y: -20, opacity: 0 },
          animate: { y: 0, opacity: 1 },
        }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-text tracking-tight flex items-center gap-3">
            <SparklesIcon className="w-7 h-7 text-brand-accent/80 hidden sm:block" />
            My Profile
          </h1>
          <p className="text-brand-text-muted mt-1">
            {editMode
              ? "You are currently editing your profile."
              : "View and manage your account details."}
          </p>
        </div>
        <AnimatePresence>
          {!editMode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <Button
                variant="primary"
                onClick={() => {
                  setEditMode(true);
                  setFeedback(null);
                }}
                leftIcon={<PencilIcon className="h-5 w-5" />}
                className="w-full sm:w-auto"
              >
                Edit Profile
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <motion.div
          variants={{
            initial: { x: -20, opacity: 0 },
            animate: { x: 0, opacity: 1 },
          }}
          className="lg:col-span-1 space-y-6"
        >
          <Card className="p-6 text-center shadow-lg">
            <ProfileAvatar
              avatarUrl={avatarPreview || user.avatarUrl}
              defaultAvatar={defaultAvatar}
              name={user.name || "User"}
              editMode={editMode}
              isSaving={isSaving}
              onFileChange={handleAvatarChange}
            />
            <h2 className="mt-4 text-2xl font-bold text-brand-text truncate">
              {user.name}
            </h2>
            <div className="flex items-center justify-center gap-2 mt-1 text-sm text-brand-text-muted">
              <EnvelopeIcon className="h-4 w-4" />
              <span>{user.email}</span>
            </div>

            {/* === REFINED BIO SECTION === */}
            <div className="mt-4 pt-4 border-t border-brand-border/20">
              <p className="text-sm text-brand-text-muted whitespace-pre-line text-center">
                {user.bio || (
                  <AnimatePresence>
                    {!editMode && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="italic opacity-70"
                      >
                        No bio has been set.
                      </motion.span>
                    )}
                  </AnimatePresence>
                )}
              </p>
            </div>
            {/* === END REFINEMENT === */}
          </Card>
        </motion.div>

        <AnimatePresence>
          {editMode && (
            <motion.div
              key="edit-panel"
              variants={{
                initial: { x: 20, opacity: 0 },
                animate: { x: 0, opacity: 1 },
              }}
              exit={{ x: 20, opacity: 0, transition: { duration: 0.2 } }}
              className="lg:col-span-2"
            >
              <Card className="p-6 sm:p-8 shadow-lg">
                {feedback && (
                  <motion.div
                    className={`p-4 text-sm rounded-lg mb-6 flex items-center gap-3 ${
                      feedback.type === "success"
                        ? "bg-success/10 text-success"
                        : "bg-error/10 text-error"
                    }`}
                  >
                    <CheckCircleIcon className="h-5 w-5" /> {feedback.message}
                  </motion.div>
                )}
                <form className="space-y-6">
                  <ProfileInput
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isSaving}
                    placeholder="Your full name"
                  />
                  <ProfileInput
                    label="Bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={isSaving}
                    isTextarea={true}
                    placeholder="A short description about yourself..."
                  />
                </form>
                <div className="flex justify-end gap-4 mt-8 border-t border-brand-border/20 pt-6">
                  <Button
                    variant="ghost"
                    onClick={handleCancel}
                    disabled={isSaving}
                    leftIcon={<XCircleIcon className="w-5" />}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    isLoading={isSaving}
                    disabled={isSaving || !isDirty}
                    leftIcon={<CheckCircleIcon className="w-5" />}
                  >
                    Save Changes
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
