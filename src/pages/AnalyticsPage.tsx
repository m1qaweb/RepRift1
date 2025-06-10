// /src/pages/AnalyticsPage.tsx
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useWorkout } from "../contexts/WorkoutContext";
import StatsCard from "../components/Analytics/StatsCard";
import Spinner from "../components/UI/Spinner";
import {
  ChartBarIcon,
  BoltIcon,
  ClockIcon,
  TrophyIcon,
  ScaleIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { subDays, parseISO, isAfter } from "date-fns";

const AnalyticsPage: React.FC = () => {
  const { workouts, personalRecords, loading } = useWorkout();

  const analytics = useMemo(() => {
    const last30Days = subDays(new Date(), 30);
    const workoutsLast30Days = workouts.filter((w) =>
      isAfter(parseISO(w.date), last30Days)
    );

    const monthlyWorkouts = workoutsLast30Days.length;
    const monthlyVolume = workoutsLast30Days.reduce(
      (sum, w) => sum + w.volume,
      0
    );

    const allPrs = Object.values(personalRecords);
    const monthlyPrs = allPrs.filter((pr) =>
      isAfter(parseISO(pr.estimated1RM.date), last30Days)
    ).length;

    const totalVolume = workouts.reduce((sum, w) => sum + w.volume, 0);

    const topSet = allPrs.reduce(
      (max, pr) => (pr.estimated1RM.value > max.estimated1RM.value ? pr : max),
      {
        estimated1RM: { value: 0, date: "" },
        exerciseName: "",
        highestReps: { value: 0, weight: 0, date: "" },
        highestSetVolume: { value: 0, date: "" },
        highestWeight: { value: 0, date: "" },
      }
    );

    return {
      monthlyWorkouts,
      monthlyVolume,
      monthlyPrs,
      allTimeVolume: totalVolume,
      allTimePrs: allPrs.length,
      topSet,
    };
  }, [workouts, personalRecords]);

  // Animation Variants
  const containerVariant = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };
  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariant}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariant}>
        <h1 className="text-3xl sm:text-4xl font-bold text-brand-text">
          Your Analytics
        </h1>
        <p className="text-lg text-brand-text-muted">
          An overview of your fitness journey.
        </p>
      </motion.div>

      {workouts.length === 0 ? (
        <motion.div
          variants={itemVariant}
          className="flex flex-col items-center justify-center h-96 text-center"
        >
          <ChartBarIcon className="w-16 h-16 text-brand-primary/20 mb-4" />
          <h2 className="text-2xl font-semibold text-brand-text mb-2">
            Your Analytics Dashboard Awaits
          </h2>
          <p className="text-brand-text-muted max-w-md">
            Log a workout to start tracking your progress and unlocking powerful
            insights!
          </p>
        </motion.div>
      ) : (
        <>
          <motion.section variants={itemVariant}>
            <h2 className="text-xl font-semibold text-brand-text mb-4">
              Activity (Last 30 Days)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StatsCard
                title="Workouts"
                value={analytics.monthlyWorkouts}
                icon={<BoltIcon className="w-6 h-6" />}
              />
              <StatsCard
                title="Volume"
                value={`${(analytics.monthlyVolume / 1000).toFixed(1)}`}
                unit="k kg"
                icon={<ScaleIcon className="w-6 h-6" />}
              />
              <StatsCard
                title="New PRs"
                value={analytics.monthlyPrs}
                icon={<TrophyIcon className="w-6 h-6" />}
              />
            </div>
          </motion.section>

          <motion.section variants={itemVariant}>
            <h2 className="text-xl font-semibold text-brand-text mb-4">
              All-Time Progress
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StatsCard
                title="Total Volume"
                value={`${(analytics.allTimeVolume / 1000).toFixed(1)}`}
                unit="k kg"
                icon={<ScaleIcon className="w-6 h-6" />}
              />
              <StatsCard
                title="Total PRs"
                value={analytics.allTimePrs}
                icon={<TrophyIcon className="w-6 h-6" />}
              />
              <StatsCard
                title="Top Set (e1RM)"
                value={`${
                  analytics.topSet.exerciseName
                } @ ${analytics.topSet.estimated1RM.value.toFixed(1)}kg`}
                icon={<StarIcon className="w-6 h-6" />}
              />
            </div>
          </motion.section>
        </>
      )}
    </motion.div>
  );
};

export default AnalyticsPage;
