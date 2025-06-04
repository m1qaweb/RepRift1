// /src/pages/AnalyticsPage.tsx – Displays charts and stats about workout progress.
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProgressChart from "../components/Analytics/ProgressChart";
import StatsCard from "../components/Analytics/StatsCard";
import {
  BodyMetric,
  WorkoutLog,
  fetchBodyMetrics,
  fetchWorkoutLogs,
} from "../utils/fakeApi";
import Spinner from "../components/UI/Spinner"; // Corrected path
import {
  ChartBarIcon,
  BoltIcon,
  ClockIcon,
  // ScaleIcon, // Removed as unused
  // PresentationChartLineIcon, // Removed as unused
} from "@heroicons/react/24/outline";

const AnalyticsPage: React.FC = () => {
  const [bodyMetrics, setBodyMetrics] = useState<BodyMetric[]>([]);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchBodyMetrics(), fetchWorkoutLogs()])
      .then(([metricsData, logsData]) => {
        setBodyMetrics(metricsData);
        setWorkoutLogs(logsData);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const totalWorkoutsThisMonth = workoutLogs.filter(
    (log) =>
      new Date(log.date).getMonth() === new Date().getMonth() &&
      new Date(log.date).getFullYear() === new Date().getFullYear()
  ).length;

  const avgDuration =
    workoutLogs.length > 0
      ? parseFloat(
          // Ensure it's a number if StatsCard expects one, or keep as string if it accepts string | number
          (
            workoutLogs.reduce(
              (sum, log) => sum + (log.durationMinutes || 0),
              0
            ) / workoutLogs.length
          ).toFixed(0)
        )
      : 0;

  const maxCalories =
    workoutLogs.length > 0
      ? Math.max(...workoutLogs.map((log) => log.caloriesBurned || 0))
      : 0;

  const sectionVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  // Prepare data for the workout duration chart
  // Ensure date field is consistently named 'date' for the generic ProgressChart
  const durationChartData = workoutLogs
    .map((log) => ({
      date: log.date, // Already a string, should be fine
      durationMinutes: log.durationMinutes || 0,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-8">
      <motion.div
        custom={0}
        variants={sectionVariant}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-2">
          Your Fitness Analytics
        </h1>
        <p className="text-light-secondary dark:text-dark-secondary">
          Track your progress and see how far you've come.
        </p>
      </motion.div>

      <motion.div
        custom={1}
        variants={sectionVariant}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <StatsCard
          title="Workouts This Month"
          value={totalWorkoutsThisMonth}
          icon={<ChartBarIcon className="w-6 h-6" />}
          unit="workouts"
        />
        <StatsCard
          title="Avg. Workout Duration"
          value={avgDuration}
          icon={<ClockIcon className="w-6 h-6" />}
          unit="min"
        />
        <StatsCard
          title="Max Calories Burned"
          value={maxCalories}
          icon={<BoltIcon className="w-6 h-6" />}
          unit="kcal"
        />
      </motion.div>

      <motion.div
        custom={2}
        variants={sectionVariant}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text">
          Progress Over Time
        </h2>
        {bodyMetrics.length > 0 ? (
          <ProgressChart
            data={bodyMetrics} // TData inferred as BodyMetric
            dataKey="weightKg"
            title="Weight Trend (kg)"
            yAxisLabel="Weight (kg)"
          />
        ) : (
          <p className="text-light-secondary dark:text-dark-secondary">
            No weight data to display.
          </p>
        )}

        {bodyMetrics.length > 0 && bodyMetrics.some((m) => m.bmi != null) ? (
          <ProgressChart
            data={bodyMetrics.filter((m) => m.bmi != null)} // TData inferred as BodyMetric (with non-null bmi)
            dataKey="bmi"
            title="BMI Trend"
            yAxisLabel="BMI"
          />
        ) : (
          <p className="text-light-secondary dark:text-dark-secondary">
            No BMI data to display.
          </p>
        )}

        {workoutLogs.length > 1 ? (
          <ProgressChart
            data={durationChartData} // TData inferred as { date: string; durationMinutes: number }
            dataKey="durationMinutes"
            title="Workout Duration Over Time"
            yAxisLabel="Duration (min)"
          />
        ) : (
          <p className="text-light-secondary dark:text-dark-secondary">
            Not enough workout logs to show duration trend.
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;
