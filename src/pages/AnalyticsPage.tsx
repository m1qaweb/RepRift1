// /src/pages/AnalyticsPage.tsx
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { BodyMetric, WorkoutLog } from "../types/data";
import { getBodyMetrics } from "../services/bodyMetricService";
import { getWorkoutLogs } from "../services/workoutLogService";
import { formatDate } from "../utils/dateUtils";

import ProgressChart from "../components/Analytics/ProgressChart";
import StatsCard from "../components/Analytics/StatsCard";
import Spinner from "../components/UI/Spinner";
import Card from "../components/UI/Card";
import {
  ChartBarIcon,
  BoltIcon,
  ClockIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  TrophyIcon,
  ArrowPathIcon,
  ScaleIcon,
} from "@heroicons/react/24/outline";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

// calculateBMI helper function (no changes needed)
const calculateBMI = (w?: number, h?: number) =>
  w && h && h > 0 ? parseFloat((w / (h / 100) ** 2).toFixed(1)) : undefined;

const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<{
    metrics: BodyMetric[];
    logs: WorkoutLog[];
  }>({ metrics: [], logs: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // <<< FIX #1: Wrap the data loading logic in useCallback
  const loadData = useCallback(async () => {
    if (!user) return; // The dependency 'user' is now declared below
    setIsLoading(true);
    setError(null);
    try {
      const [metricsData, logsData] = await Promise.all([
        getBodyMetrics(),
        getWorkoutLogs(),
      ]);
      const sortedMetrics = metricsData.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      const sortedLogs = logsData.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      setData({ metrics: sortedMetrics, logs: sortedLogs });
    } catch (err) {
      console.error("Failed to fetch analytics data:", err);
      setError("Could not load analytics data.");
    } finally {
      setIsLoading(false);
    }
  }, [user]); // <<< This useCallback depends on 'user'

  useEffect(() => {
    loadData();
    // <<< FIX #2: Add the stable `loadData` function to the dependency array.
    // The ESLint warning is now resolved correctly.
  }, [loadData]);

  // --- DERIVED STATISTICS ---

  const { recentStats, allTimeStats, bodyTrends } = useMemo(() => {
    const { metrics, logs } = data;
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    const recentLogs = logs.filter((log) => new Date(log.date) >= last30Days);

    const workoutsThisMonth = recentLogs.length;
    const totalDuration = recentLogs.reduce((s, l) => s + l.durationMinutes, 0);
    const totalCalories = recentLogs.reduce((s, l) => s + l.caloriesBurned, 0);

    const allTimeWorkouts = logs.length;
    const allTimeDurationHours = Math.round(
      logs.reduce((s, l) => s + l.durationMinutes, 0) / 60
    );

    const weightChange =
      metrics.length < 2
        ? 0
        : parseFloat(
            (
              metrics[metrics.length - 1].weightKg - metrics[0].weightKg
            ).toFixed(1)
          );
    const latestWeight =
      metrics.length > 0 ? metrics[metrics.length - 1].weightKg : "N/A";

    return {
      recentStats: {
        workoutsThisMonth,
        avgDuration:
          workoutsThisMonth > 0
            ? Math.round(totalDuration / workoutsThisMonth)
            : 0,
        avgCalories:
          workoutsThisMonth > 0
            ? Math.round(totalCalories / workoutsThisMonth)
            : 0,
      },
      allTimeStats: { allTimeWorkouts, allTimeDurationHours, latestWeight },
      bodyTrends: { weightChange },
    };
  }, [data]);

  const chartData = useMemo(() => {
    return data.metrics.map((m) => ({
      date: formatDate(m.date, "MMM d"),
      Weight: m.weightKg,
      BMI: m.bmi ?? calculateBMI(m.weightKg, user?.heightCm),
    }));
  }, [data.metrics, user?.heightCm]);

  // Animation Variants (no changes)
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

  // RENDER LOGIC
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="lg" />
      </div>
    );
  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <ExclamationTriangleIcon className="w-12 h-12 text-error mb-4" />
        <h2 className="text-2xl font-semibold">Error Loading Data</h2>
        <p className="text-brand-text-muted">{error}</p>
      </div>
    );

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariant}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={itemVariant}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-text">
            Your Analytics
          </h1>
          <p className="text-lg text-brand-text-muted">
            An overview of your fitness journey.
          </p>
        </div>
        <button
          onClick={() => loadData()}
          className="p-2 text-brand-text-muted hover:text-brand-primary hover:bg-brand-secondary/20 rounded-full transition-colors"
        >
          <ArrowPathIcon className="h-5 w-5" />
        </button>
      </motion.div>

      {data.logs.length === 0 && data.metrics.length === 0 ? (
        <motion.div
          variants={itemVariant}
          className="flex flex-col items-center justify-center h-96 text-center"
        >
          <ChartBarIcon className="w-16 h-16 text-brand-primary/20 mb-4" />
          <h2 className="text-2xl font-semibold text-brand-text mb-2">
            Your Analytics Dashboard Awaits
          </h2>
          <p className="text-brand-text-muted max-w-md">
            Log a workout or add a body weight measurement to start tracking
            your progress and unlocking powerful insights!
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
                value={recentStats.workoutsThisMonth}
                icon={<BoltIcon className="w-6 h-6" />}
              />
              <StatsCard
                title="Avg. Duration"
                value={recentStats.avgDuration}
                unit="min"
                icon={<ClockIcon className="w-6 h-6" />}
              />
              <StatsCard
                title="Avg. Calories"
                value={recentStats.avgCalories}
                unit="kcal"
                icon={<FireIcon className="w-6 h-6" />}
              />
            </div>
          </motion.section>

          <motion.section variants={itemVariant}>
            <h2 className="text-xl font-semibold text-brand-text mb-4">
              Body Composition
            </h2>
            <Card className="!p-2 sm:!p-4 md:!p-6">
              <ProgressChart
                data={chartData}
                xAxisDataKey="date"
                title="Weight & BMI Trend"
                height={350}
                goal={
                  user?.goals?.weightKg
                    ? {
                        value: user.goals.weightKg,
                        label: `Goal`,
                        yAxisId: "left",
                      }
                    : undefined
                }
                dataKeys={[
                  {
                    key: "Weight",
                    name: "Weight (kg)",
                    color: "var(--color-primary)",
                    yAxisId: "left",
                    type: "area",
                  },
                  {
                    key: "BMI",
                    name: "BMI",
                    color: "rgb(var(--color-secondary-rgb))",
                    yAxisId: "right",
                  },
                ]}
              />
            </Card>
          </motion.section>

          <motion.section variants={itemVariant}>
            <h2 className="text-xl font-semibold text-brand-text mb-4">
              All-Time Progress
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StatsCard
                title="Total Workouts"
                value={allTimeStats.allTimeWorkouts}
                icon={<TrophyIcon className="w-6 h-6" />}
              />
              <StatsCard
                title="Current Weight"
                value={allTimeStats.latestWeight}
                unit="kg"
                icon={<ScaleIcon className="w-6 h-6" />}
              />
              <StatsCard
                title="Weight Trend"
                value={`${bodyTrends.weightChange >= 0 ? "+" : ""}${
                  bodyTrends.weightChange
                }`}
                unit="kg"
                icon={<ArrowTrendingUpIcon className="w-6 h-6" />}
                trend={bodyTrends.weightChange > 0 ? "up" : "down"}
                trendDescription="since beginning"
              />
            </div>
          </motion.section>
        </>
      )}
    </motion.div>
  );
};

export default AnalyticsPage;
