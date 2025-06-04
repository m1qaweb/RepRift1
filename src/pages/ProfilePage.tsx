// /src/pages/ProfilePage.tsx – User profile editing page.
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
// CORRECTED IMPORT PATHS:
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import {
  UserIcon,
  EnvelopeIcon,
  CameraIcon,
} from "@heroicons/react/24/outline";
import Spinner from "../components/UI/Spinner";

// Assuming User type might have more fields for profile
interface ProfileData {
  name: string;
  email: string;
  avatarUrl?: string;
  // Add other fields like bio, preferences, etc.
}

const ProfilePage: React.FC = () => {
  const { user, loading: authLoading } = useAuth(); // User state from AuthContext
  // In a real app, you'd have a separate 'updateProfile' function in AuthContext or an API call
  const [profileData, setProfileData] = useState<ProfileData | null>(
    user ? { ...user } : null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.avatarUrl || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      });
      setAvatarPreview(user.avatarUrl || null);
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (profileData) {
      setProfileData({ ...profileData, [e.target.name]: e.target.value });
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Simulate upload and preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        if (profileData) {
          // In real app, you'd upload to server and get URL
          setProfileData({
            ...profileData,
            avatarUrl: reader.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!profileData) return;
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Profile saved:", profileData);
    // Update AuthContext user if necessary, or rely on re-fetch.
    // authContext.updateUser(profileData);
    setIsLoading(false);
    setIsEditing(false);
    // Add toast notification for success
  };

  if (authLoading || !profileData) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const inputFieldStyle =
    "w-full px-3 py-2 border rounded-md bg-transparent border-gray-300 dark:border-gray-600 focus:border-light-primary dark:focus:border-dark-primary disabled:opacity-70 disabled:bg-gray-100 dark:disabled:bg-gray-700";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">
        Your Profile
      </h1>

      <Card className="p-6">
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
          {/* Avatar Section */}
          <div className="relative group">
            <motion.img
              src={
                avatarPreview ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  profileData.name
                )}&background=random&size=128`
              }
              alt="User avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-light-card dark:border-dark-card shadow-md"
              whileHover={
                isEditing
                  ? {
                      scale: 1.05,
                      boxShadow:
                        "0px 0px 15px rgba(var(--color-primary-rgb), 0.5)",
                    }
                  : {}
              } // Color needs to be RGB for boxShadow var
            />
            {isEditing && (
              <motion.button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 bg-light-primary dark:bg-dark-primary text-white p-2 rounded-full shadow-md hover:bg-blue-600 dark:hover:bg-blue-500"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                title="Change Avatar"
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
            />
          </div>

          {/* Details Section */}
          <div className="flex-grow w-full sm:w-auto">
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-light-secondary dark:text-dark-secondary mb-1"
              >
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing || isLoading}
                  className={`${inputFieldStyle} pl-10`}
                />
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-light-secondary dark:text-dark-secondary mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <EnvelopeIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  disabled // Typically email is not editable or needs verification
                  className={`${inputFieldStyle} pl-10`}
                />
              </div>
              {!isEditing && (
                <p className="text-xs text-light-secondary dark:text-dark-secondary mt-1">
                  Email cannot be changed through profile settings.
                </p>
              )}
            </div>

            {/* Add more fields like bio if needed */}
            {/* {isEditing && (
                     <div className="mb-4">
                         <label htmlFor="bio" className="block text-sm font-medium text-light-secondary dark:text-dark-secondary mb-1">Bio</label>
                         <textarea name="bio" id="bio" rows={3} className={inputFieldStyle} placeholder="Tell us a bit about yourself..." />
                     </div>
                 )} */}

            <div className="mt-6 flex justify-end space-x-3">
              {isEditing ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsEditing(false);
                      setProfileData(user ? { ...user } : null);
                      setAvatarPreview(user?.avatarUrl || null);
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSaveProfile}
                    isLoading={isLoading}
                    disabled={isLoading}
                  >
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button variant="primary" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
// For --color-primary-rgb:
// In global.css:
// :root { --color-primary-rgb: 59, 130, 246; } /* For blue-500 */
// .dark { --color-primary-rgb: 96, 165, 250; } /* For blue-400 */

export default ProfilePage;
