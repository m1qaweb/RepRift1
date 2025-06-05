// /src/pages/AnalyticsPage.tsx
import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import ProgressChart from "../components/Analytics/ProgressChart"; // Assuming ProgressChart handles its own theming or uses generic styles
import StatsCard from "../components/Analytics/StatsCard"; // Assuming StatsCard handles its own theming or uses generic styles
import {
  BodyMetric,
  WorkoutLog,
  fetchBodyMetrics,
  fetchWorkoutLogs,
} from "../utils/fakeApi"; // Assuming fakeApi.ts exists and exports these
import Spinner from "../components/UI/Spinner";
import {
  ChartBarIcon,
  BoltIcon,
  ClockIcon,
  ExclamationTriangleIcon, // For error display
} from "@heroicons/react/24/outline";

const AnalyticsPage: React.FC = () => {
  const [bodyMetrics, setBodyMetrics] = useState<BodyMetric[]>([]);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [metricsData, logsData] = await Promise.all([
          fetchBodyMetrics(),
          fetchWorkoutLogs(),
        ]);
        setBodyMetrics(metricsData);
        setWorkoutLogs(logsData);
      } catch (err) {
        console.error("Failed to fetch analytics data:", err);
        setError("Could not load analytics data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const totalWorkoutsThisMonth = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    return workoutLogs.filter((log) => {
      const logDate = new Date(log.date);
      return (
        logDate.getMonth() === currentMonth &&
        logDate.getFullYear() === currentYear
      );
    }).length;
  }, [workoutLogs]);

  const avgDuration = useMemo(() => {
    if (workoutLogs.length === 0) return 0;
    const totalDuration = workoutLogs.reduce(
      (sum, log) => sum + (log.durationMinutes || 0),
      0
    );
    // Using Math.round for cleaner integer calculation before potentially passing to StatsCard
    return Math.round(totalDuration / workoutLogs.length);
  }, [workoutLogs]);

  const maxCalories = useMemo(() => {
    if (workoutLogs.length === 0) return 0;
    return Math.max(0, ...workoutLogs.map((log) => log.caloriesBurned || 0)); // Ensure Math.max doesn't return -Infinity for empty or all-zero array
  }, [workoutLogs]);

  // Memoized and sorted data for the workout duration chart
  const durationChartData = useMemo(() => {
    return workoutLogs
      .map((log) => ({
        date: log.date, // ProgressChart should be capable of parsing string dates or use a date utility
        durationMinutes: log.durationMinutes || 0,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [workoutLogs]);

  const sectionVariant = {
    hidden: { opacity: 0, y: 20 }, // Slightly reduced y for a smoother feel
    visible: (i: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1, // Slightly reduced delay
        duration: 0.4, // Slightly faster duration
        ease: "easeOut",
      },
    }),
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-brand-text-muted">
        <Spinner size="lg" />
        <p className="mt-4">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-center items-center h-screen text-center p-4"
      >
        <ExclamationTriangleIcon className="w-16 h-16 text-error mb-4" />
        <h2 className="text-2xl font-semibold text-brand-text mb-2">
          Oops! Something went wrong.
        </h2>
        <p className="text-brand-text-muted">{error}</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-10 p-4 md:p-6">
      {" "}
      {/* Added padding for smaller screens */}
      <motion.div
        custom={0}
        variants={sectionVariant}
        initial="hidden"
        animate="visible"
        className="mb-8" // Add some margin bottom
      >
        <h1 className="text-3xl md:text-4xl font-bold text-brand-text mb-2">
          Your Fitness Analytics
        </h1>
        <p className="text-lg text-brand-text-muted">
          Track your progress and see how far you've come.
        </p>
      </motion.div>
      <motion.div
        custom={1}
        variants={sectionVariant}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <StatsCard
          title="Workouts This Month"
          value={totalWorkoutsThisMonth}
          icon={<ChartBarIcon className="w-7 h-7" />} // Slightly larger icons
          unit="workouts"
        />
        <StatsCard
          title="Avg. Workout Duration"
          value={avgDuration}
          icon={<ClockIcon className="w-7 h-7" />}
          unit="min"
        />
        <StatsCard
          title="Max Calories Burned"
          value={maxCalories}
          icon={<BoltIcon className="w-7 h-7" />}
          unit="kcal"
        />
      </motion.div>
      <motion.div
        custom={2}
        variants={sectionVariant}
        initial="hidden"
        animate="visible"
        className="space-y-8" // Increased spacing for better section separation
      >
        <h2 className="text-2xl md:text-3xl font-semibold text-brand-text">
          Progress Over Time
        </h2>

        {/* Weight Trend Chart */}
        <motion.div
          custom={2.1}
          variants={sectionVariant}
          initial="hidden"
          animate="visible"
          className="bg-brand-card p-4 sm:p-6 rounded-lg shadow-brand-card-light dark:shadow-brand-card-glow"
        >
          {bodyMetrics.length > 0 ? (
            <ProgressChart
              data={bodyMetrics}
              dataKey="weightKg"
              title="Weight Trend (kg)"
              yAxisLabel="Weight (kg)"
              // The ProgressChart component itself will use themed text colors or accept them as props
            />
          ) : (
            <p className="text-brand-text-muted text-center py-8">
              No weight data to display. Add some weigh-ins to see your trend!
            </p>
          )}
        </motion.div>

        {/* BMI Trend Chart */}
        {/* Conditionally render this section only if there's BMI data */}
        {bodyMetrics.some((m) => m.bmi != null && m.bmi > 0) ? (
          <motion.div
            custom={2.2}
            variants={sectionVariant}
            initial="hidden"
            animate="visible"
            className="bg-brand-card p-4 sm:p-6 rounded-lg shadow-brand-card-light dark:shadow-brand-card-glow"
          >
            <ProgressChart
              // Filter for entries that specifically have BMI.
              data={bodyMetrics.filter((m) => m.bmi != null && m.bmi > 0)}
              dataKey="bmi"
              title="BMI Trend"
              yAxisLabel="BMI"
            />
          </motion.div>
        ) : (
          // Only show this "No BMI" message if there was some body metric data but no BMI.
          bodyMetrics.length > 0 && (
            <motion.div
              custom={2.2}
              variants={sectionVariant}
              initial="hidden"
              animate="visible"
              className="bg-brand-card p-4 sm:p-6 rounded-lg shadow-brand-card-light dark:shadow-brand-card-glow"
            >
              <p className="text-brand-text-muted text-center py-8">
                No BMI data available to display.
              </p>
            </motion.div>
          )
        )}

        {/* Workout Duration Chart */}
        <motion.div
          custom={2.3}
          variants={sectionVariant}
          initial="hidden"
          animate="visible"
          className="bg-brand-card p-4 sm:p-6 rounded-lg shadow-brand-card-light dark:shadow-brand-card-glow"
        >
          {/* Changed threshold to > 0 logs to show chart if even one log exists, adjusted message otherwise. 
                Or keep > 1 if a "trend" implies multiple points. Let's assume trend needs at least 2 points. */}
          {durationChartData.length > 1 ? (
            <ProgressChart
              data={durationChartData}
              dataKey="durationMinutes"
              title="Workout Duration Over Time"
              yAxisLabel="Duration (min)"
            />
          ) : (
            <p className="text-brand-text-muted text-center py-8">
              {workoutLogs.length <= 1
                ? "Log more workouts to see your duration trend."
                : "Not enough data points for duration trend."}
            </p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;
