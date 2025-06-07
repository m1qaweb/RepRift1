// /src/components/UI/ProfileAvatar.tsx
import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CameraIcon } from "@heroicons/react/24/solid";

interface ProfileAvatarProps {
  avatarUrl?: string | null;
  defaultAvatar: string;
  name: string;
  editMode: boolean;
  isSaving: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  avatarUrl,
  defaultAvatar,
  name,
  editMode,
  isSaving,
  onFileChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const triggerAvatarUpload = () => fileInputRef.current?.click();

  return (
    <div className="relative group mx-auto w-36 h-36 sm:w-48 sm:h-48 flex-shrink-0">
      <motion.div
        whileHover={editMode ? { scale: 1.05 } : {}}
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-primary/50 to-brand-accent/40 blur-lg transition-all duration-300 group-hover:blur-xl"
        aria-hidden="true"
      />
      <motion.img
        key={avatarUrl}
        src={avatarUrl || defaultAvatar}
        alt={name}
        className="w-full h-full rounded-full object-cover border-4 border-brand-card/80 shadow-2xl relative"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          transition: { delay: 0.1, type: "spring", stiffness: 180 },
        }}
      />
      <AnimatePresence>
        {editMode && (
          <motion.button
            onClick={triggerAvatarUpload}
            disabled={isSaving}
            title="Change Avatar"
            className="absolute bottom-1 right-1 bg-brand-primary text-white p-3.5 rounded-full shadow-lg hover:bg-brand-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-card focus-visible:ring-brand-primary"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.95 }}
          >
            <CameraIcon className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        disabled={isSaving}
      />
    </div>
  );
};

export default ProfileAvatar;
