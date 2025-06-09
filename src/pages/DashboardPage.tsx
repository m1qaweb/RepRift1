// /src/pages/DashboardPage.tsx – Main dashboard after InitialSetupPage.
import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import TodaysWorkoutCard from "../components/Dashboard/TodaysWorkoutCard";
import QuickStats from "../components/Dashboard/QuickStats";
import VolumeChart from "../components/Dashboard/VolumeChart";
import GoalProgress from "../components/Dashboard/GoalProgress";
import BodyMetricsWidget from "../components/Dashboard/BodyMetricsWidget";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 80, damping: 12 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 md:space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl md:text-4xl font-bold text-brand-text tracking-tight">
          Welcome back,{" "}
          <span className="text-brand-primary">
            {user?.name?.split(" ")[0]}
          </span>
          !
        </h1>
        <p className="text-brand-text-muted mt-1">
          Here's a snapshot of your progress. Keep up the great work!
        </p>
      </motion.div>

      {/* Advanced Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Quick Stats Cards */}
        <motion.div
          variants={itemVariants}
          className="md:col-span-2 lg:col-span-4"
        >
          <QuickStats />
        </motion.div>

        {/* Today's Workout */}
        <motion.div
          variants={itemVariants}
          className="md:col-span-2 lg:col-span-2"
        >
          <TodaysWorkoutCard />
        </motion.div>

        {/* Weekly Goal Progress */}
        <motion.div
          variants={itemVariants}
          className="md:col-span-1 lg:col-span-1"
        >
          <GoalProgress />
        </motion.div>

        {/* Body Metrics or other widget */}
        <motion.div
          variants={itemVariants}
          className="md:col-span-1 lg:col-span-1"
        >
          <BodyMetricsWidget />
        </motion.div>

        {/* Volume Chart */}
        <motion.div
          variants={itemVariants}
          className="md:col-span-2 lg:col-span-4"
        >
          <VolumeChart />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
