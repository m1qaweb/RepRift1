import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { uploadAvatar } from "../../services/storageService";
import Button from "../UI/Button";
import ProfileAvatar from "../UI/ProfileAvatar";
import {
  PencilSquareIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserCircleIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/outline";
import Card from "../UI/Card";

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
  isTextarea?: boolean;
  placeholder?: string;
  disabled: boolean;
  icon: React.ReactNode;
}> = ({
  label,
  name,
  value,
  onChange,
  isTextarea,
  placeholder,
  disabled,
  icon,
}) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-text-muted">
      {icon}
    </div>
    {isTextarea ? (
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={4}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full bg-brand-background/50 border-2 border-brand-border/30 rounded-lg p-2 pl-10 focus:ring-brand-primary focus:border-brand-primary transition-colors duration-300 placeholder:text-brand-text-muted/50"
      />
    ) : (
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full bg-brand-background/50 border-2 border-brand-border/30 rounded-lg p-2 pl-10 focus:ring-brand-primary focus:border-brand-primary transition-colors duration-300 placeholder:text-brand-text-muted/50"
      />
    )}
  </div>
);

const ProfileCard: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    bio: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || "", bio: user.bio || "" });
      setAvatarPreview(user.avatarUrl || null);
    }
  }, [user]);

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user?.name || "U"
  )}&background=252834&color=fff&bold=true&size=192`;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setFeedback(null);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFeedback(null);
  };

  const handleCancel = () => {
    if (user) {
      setFormData({ name: user.name || "", bio: user.bio || "" });
      setAvatarPreview(user.avatarUrl || null);
    }
    setAvatarFile(null);
    setEditMode(false);
    setFeedback(null);
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

      await updateUser({ ...formData, avatarUrl: finalAvatarUrl });

      setFeedback({ type: "success", message: "Profile updated!" });
      setTimeout(() => setEditMode(false), 1500);
      setAvatarFile(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred.";
      setFeedback({ type: "error", message });
    } finally {
      setIsSaving(false);
    }
  };

  const isDirty = user
    ? JSON.stringify(formData) !==
        JSON.stringify({ name: user.name || "", bio: user.bio || "" }) ||
      !!avatarFile
    : false;

  const flipVariants = {
    front: { rotateY: 0 },
    back: { rotateY: 180 },
  };

  const flipTransition = {
    duration: 0.7,
    ease: [0.34, 1.56, 0.64, 1],
  };

  const contentContainerVariants = {
    enter: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
    exit: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
  };

  const contentItemVariants = {
    enter: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 200, damping: 20 },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const backContentItemVariants = {
    enter: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 200, damping: 25, delay: 0.2 },
    },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
  };

  if (!user) return null;

  return (
    <div
      style={{ perspective: "1200px" }}
      className="relative w-full max-w-md mx-auto"
    >
      <motion.div
        className="relative w-full h-[700px]"
        style={{ transformStyle: "preserve-3d" }}
        animate={editMode ? "back" : "front"}
        variants={flipVariants}
        transition={flipTransition}
      >
        {/* Front Side: Display Profile */}
        <div
          className="absolute w-full h-full"
          style={{ backfaceVisibility: "hidden" }}
        >
          <Card className="p-6 sm:p-8 h-full flex flex-col justify-center bg-gradient-to-br from-brand-card/80 to-brand-background/60 backdrop-blur-lg border border-white/10 shadow-2xl">
            <motion.div
              className="flex flex-col items-center text-center w-full"
              initial="exit"
              animate={editMode ? "exit" : "enter"}
              variants={contentContainerVariants}
            >
              <motion.div variants={contentItemVariants}>
                <ProfileAvatar
                  avatarUrl={avatarPreview || user.avatarUrl}
                  defaultAvatar={defaultAvatar}
                  name={user.name || "User"}
                  editMode={false}
                  isSaving={false}
                  onFileChange={() => {}}
                />
              </motion.div>
              <motion.h2
                variants={contentItemVariants}
                className="mt-6 text-3xl font-bold text-brand-text tracking-tight"
              >
                {user.name}
              </motion.h2>
              <motion.div
                variants={contentItemVariants}
                className="mt-2 flex items-center gap-2 text-brand-text-muted"
              >
                <EnvelopeIcon className="h-5 w-5" />
                <span>{user.email}</span>
              </motion.div>
              <motion.p
                variants={contentItemVariants}
                className="mt-6 text-brand-text-muted text-center max-w-sm"
              >
                {user.bio || <span className="italic">No bio provided.</span>}
              </motion.p>
              <motion.div variants={contentItemVariants} className="mt-8">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setEditMode(true)}
                  leftIcon={<PencilSquareIcon className="h-5 w-5" />}
                  className="shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30"
                >
                  Edit Profile
                </Button>
              </motion.div>
            </motion.div>
          </Card>
        </div>

        {/* Back Side: Edit Form */}
        <div
          className="absolute w-full h-full"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <Card className="p-6 sm:p-8 h-full flex flex-col bg-gradient-to-br from-brand-card/80 to-brand-background/60 backdrop-blur-lg border border-white/10 shadow-2xl">
            <motion.div
              className="flex flex-col h-full"
              initial="exit"
              animate={editMode ? "enter" : "exit"}
              variants={{
                enter: {
                  transition: { staggerChildren: 0.1, delayChildren: 0.3 },
                },
                exit: {
                  transition: { staggerChildren: 0.05, staggerDirection: -1 },
                },
              }}
            >
              <motion.h3
                variants={backContentItemVariants}
                className="text-2xl font-bold text-center mb-6 text-brand-text tracking-tight"
              >
                Edit Your Profile
              </motion.h3>
              <div className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-5">
                <motion.div variants={backContentItemVariants}>
                  <ProfileAvatar
                    avatarUrl={avatarPreview}
                    defaultAvatar={defaultAvatar}
                    name={formData.name || "User"}
                    editMode={true}
                    isSaving={isSaving}
                    onFileChange={handleAvatarChange}
                  />
                </motion.div>

                <AnimatePresence>
                  {feedback && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        y: -10,
                        transition: { duration: 0.2 },
                      }}
                      className={`flex items-center gap-2 text-sm p-3 rounded-lg ${
                        feedback.type === "success"
                          ? "bg-success/20 text-success"
                          : "bg-error/20 text-error"
                      }`}
                    >
                      {feedback.type === "success" ? (
                        <CheckCircleIcon className="h-5 w-5" />
                      ) : (
                        <XCircleIcon className="h-5 w-5" />
                      )}
                      {feedback.message}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div variants={backContentItemVariants}>
                  <ProfileInput
                    label="Display Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your Name"
                    disabled={isSaving}
                    icon={<UserCircleIcon className="h-5 w-5" />}
                  />
                </motion.div>
                <motion.div variants={backContentItemVariants}>
                  <ProfileInput
                    label="Biography"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    isTextarea
                    placeholder="Tell us about yourself"
                    disabled={isSaving}
                    icon={
                      <ChatBubbleBottomCenterTextIcon className="h-5 w-5" />
                    }
                  />
                </motion.div>
              </div>
              <motion.div
                variants={backContentItemVariants}
                className="mt-6 flex justify-end gap-3 pt-4 border-t border-brand-border/20"
              >
                <Button
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSave}
                  isLoading={isSaving}
                  disabled={isSaving || !isDirty}
                  className="shadow-lg shadow-brand-primary/20"
                >
                  Save Changes
                </Button>
              </motion.div>
            </motion.div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileCard;
