// src/pages/ProfilePage.tsx
import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useWorkoutLogs } from "../hooks/useWorkoutLogs";
import { MuscularSystemAnalysis, ProfileCard } from "../components/Profile";
import Spinner from "../components/UI/Spinner";
import Card from "../components/UI/Card";

const ProfilePage: React.FC = () => {
  const { loading: authLoading } = useAuth();
  const {
    workoutLogs,
    isLoading: isLoadingLogs,
    error: logsError,
  } = useWorkoutLogs();

  const isLoading = authLoading || isLoadingLogs;
  const error = logsError;

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto p-4 sm:p-6"
    >
      <motion.h1
        variants={itemVariants}
        className="text-4xl font-bold mb-8 text-brand-text tracking-tight"
      >
        Profile & Analysis
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Left Column: Profile Card */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 flex justify-center"
        >
          <ProfileCard />
        </motion.div>

        {/* Right Column: Muscle Analysis */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          {isLoading ? (
            <div className="flex justify-center items-center h-[700px]">
              <Spinner />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 h-[700px] flex items-center justify-center">
              Error loading profile data.
            </div>
          ) : (
            <Card className="h-[700px] bg-gradient-to-br from-brand-background to-brand-card/20 p-2">
              <MuscularSystemAnalysis workoutLogs={workoutLogs || []} />
            </Card>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
