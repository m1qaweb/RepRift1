// /src/pages/DashboardPage.tsx – Main dashboard after InitialSetupPage.
import React from "react";
import { motion } from "framer-motion";
import TodaysWorkoutCard from "../components/Dashboard/TodaysWorkoutCard";
import WeeklySummaryWidget from "../components/Dashboard/WeeklySummaryWidget";
import BodyMetricsWidget from "../components/Dashboard/BodyMetricsWidget";
import StatsCard from "../components/Analytics/StatsCard";
import { useAuth } from "../contexts/AuthContext";
import { FireIcon, BoltIcon } from "@heroicons/react/24/outline";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Stagger the animation of children
        delayChildren: 0.2, // Delay before children start animating
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-brand-text">
          Welcome back,{" "}
          <span className="text-brand-primary">
            {user?.name?.split(" ")[0]}
          </span>
          !
        </h1>
        <p className="text-brand-muted">
          Here's what's happening with your fitness journey.
        </p>
      </motion.div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Today's Workout and other prominent card) */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <TodaysWorkoutCard />
          {/* You can add another prominent card here if needed */}
          <StatsCard // Example re-use for "Active Streak" or similar
            title="Active Streak"
            value="12"
            unit="days"
            icon={<FireIcon className="w-6 h-6" />}
            onVisibleAnimate={false} // Controlled by parent stagger
          />
        </motion.div>

        {/* Right Column (Widgets) */}
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
          <WeeklySummaryWidget />
          <BodyMetricsWidget />
          <StatsCard // Example "Total Workouts"
            title="Total Workouts"
            value={37} // Replace with dynamic data
            icon={<BoltIcon className="w-6 h-6" />}
            onVisibleAnimate={false}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
