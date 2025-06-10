// /src/pages/AnalyticsPage.tsx
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useWorkout } from "../contexts/WorkoutContext";
import StatsCard from "../components/Analytics/StatsCard";
import Spinner from "../components/UI/Spinner";
import {
  ChartBarIcon,
  BoltIcon,
  TrophyIcon,
  ScaleIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { subDays, parseISO, isAfter, format, isValid } from "date-fns";
import VolumeChart from "../components/Analytics/VolumeChart";
import { Workout } from "../types";
import ExerciseProgressChart from "../components/Analytics/ExerciseProgressChart";
import MuscleGroupDistributionChart from "../components/Analytics/MuscleGroupDistributionChart";
import { getMuscleGroup } from "../utils/muscleGroupMapping";
import Skeleton from "../components/UI/Skeleton";
import ConsistencyCalendar from "../components/Analytics/ConsistencyCalendar";

const calculateEpley1RM = (weight: number, reps: number): number => {
  if (reps === 1) return weight;
  if (reps === 0) return 0;
  return weight * (1 + reps / 30);
};

const processVolumeDataForChart = (workouts: Workout[]) => {
  if (!workouts || workouts.length === 0) {
    return [{ name: "Volume", data: [] }];
  }

  const seriesData = (workouts || [])
    // 1. Filter out any workout with an invalid date
    .filter((w) => w && w.date && isValid(parseISO(w.date)))
    .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime())
    .map((workout) => ({
      x: format(parseISO(workout.date!), "yyyy-MM-dd"),
      // 2. Ensure volume is a valid number
      y: Number(workout.volume) || 0,
    }));

  return [{ name: "Volume", data: seriesData }];
};

const processExerciseDataForChart = (
  workouts: Workout[],
  exerciseName: string
) => {
  if (!workouts || !exerciseName) {
    return {
      series: [
        { name: "Est. 1RM", data: [] },
        { name: "Top Weight", data: [] },
        { name: "Top Reps", data: [] },
      ],
      categories: [],
    };
  }

  const exerciseSessions = workouts
    .map((w) => ({
      date: w.date,
      exercise: w.exercises.find((e) => e.name === exerciseName),
    }))
    .filter(
      (
        session
      ): session is {
        date: string;
        exercise: NonNullable<typeof session.exercise>;
      } =>
        // 3. Filter out sessions with invalid dates or missing exercises
        !!session.exercise && !!session.date && isValid(parseISO(session.date))
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const categories = exerciseSessions.map((s) =>
    format(parseISO(s.date), "dd MMM")
  );
  const e1RMData: number[] = [];
  const topWeightData: number[] = [];
  const topRepsData: number[] = [];

  exerciseSessions.forEach((session) => {
    const topSet = (session.exercise.sets || [])
      .filter((s) => s && s.completed)
      .reduce(
        (maxSet, currentSet) => {
          const currentWeight = Number(currentSet.weight) || 0;
          const currentReps = Number(currentSet.reps) || 0;
          const maxWeight = Number(maxSet.weight) || 0;
          const maxReps = Number(maxSet.reps) || 0;

          const maxE1RM = calculateEpley1RM(maxWeight, maxReps);
          const currentE1RM = calculateEpley1RM(currentWeight, currentReps);

          return currentE1RM > maxE1RM
            ? { ...currentSet, weight: currentWeight, reps: currentReps }
            : { ...maxSet, weight: maxWeight, reps: maxReps };
        },
        // We must ensure the initial reduce object has a valid `id` property
        { id: "", weight: 0, reps: 0, completed: true }
      );

    const e1RMValue = calculateEpley1RM(topSet.weight, topSet.reps);

    // 4. Final paranoid check on every value
    e1RMData.push(Number(e1RMValue) || 0);
    topWeightData.push(Number(topSet.weight) || 0);
    topRepsData.push(Number(topSet.reps) || 0);
  });

  return {
    series: [
      { name: "Est. 1RM (kg)", data: e1RMData },
      { name: "Top Weight (kg)", data: topWeightData },
      { name: "Top Reps", data: topRepsData },
    ],
    categories: categories,
  };
};

const processMuscleGroupData = (workouts: Workout[]) => {
  const distribution: { [key: string]: number } = {};

  (workouts || []).forEach((workout) => {
    (workout.exercises || []).forEach((exercise) => {
      const muscleGroup = getMuscleGroup(exercise.name);
      const exerciseVolume = (exercise.sets || []).reduce((sum, set) => {
        if (!set || !set.completed) return sum;
        // 5. Ensure every part of the volume calculation is a valid number
        const setVolume = (Number(set.weight) || 0) * (Number(set.reps) || 0);
        return sum + setVolume;
      }, 0);
      distribution[muscleGroup] =
        (distribution[muscleGroup] || 0) + exerciseVolume;
    });
  });

  const labels = Object.keys(distribution);
  const series = Object.values(distribution).map((v) => Number(v) || 0);

  return { labels, series };
};

const AnalyticsPageLoader: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-6 w-1/2" />
      </div>

      {/* Volume Chart Skeleton */}
      <Skeleton className="h-[400px] w-full" />

      {/* Exercise Progress Skeleton */}
      <Skeleton className="h-[400px] w-full" />

      {/* Stats and Muscle Group Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-8 w-1/4" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-full w-full min-h-[200px]" />
        </div>
      </div>
    </div>
  );
};

const AnalyticsPage: React.FC = () => {
  const { workouts, personalRecords, loading } = useWorkout();
  const [selectedExercise, setSelectedExercise] = useState("");

  const exerciseOptions = useMemo(() => {
    const allExercises = (workouts || [])
      .flatMap((w) => w.exercises?.map((e) => e.name) || [])
      .filter(Boolean);
    return Array.from(new Set(allExercises));
  }, [workouts]);

  React.useEffect(() => {
    if (exerciseOptions.length > 0 && !selectedExercise) {
      setSelectedExercise(exerciseOptions[0]);
    }
  }, [exerciseOptions, selectedExercise]);

  const volumeSeries = useMemo(
    () => processVolumeDataForChart(workouts),
    [workouts]
  );

  const exerciseProgressData = useMemo(
    () => processExerciseDataForChart(workouts, selectedExercise),
    [workouts, selectedExercise]
  );

  const muscleGroupData = useMemo(
    () => processMuscleGroupData(workouts),
    [workouts]
  );

  const workoutDates = useMemo(() => workouts.map((w) => w.date), [workouts]);

  const workoutDataForCalendar = useMemo(
    () => workouts.map((w) => ({ date: w.date, volume: w.volume })),
    [workouts]
  );

  const analytics = useMemo(() => {
    // Current period: Last 30 days
    const last30DaysStart = subDays(new Date(), 30);
    const workoutsLast30Days = workouts.filter((w) =>
      isAfter(parseISO(w.date!), last30DaysStart)
    );

    // Previous period: 30 days before the last 30 days
    const prev30DaysStart = subDays(new Date(), 60);
    const prev30DaysEnd = last30DaysStart;
    const workoutsPrev30Days = workouts.filter(
      (w) =>
        isAfter(parseISO(w.date!), prev30DaysStart) &&
        !isAfter(parseISO(w.date!), prev30DaysEnd)
    );

    // --- Calculations for Current Period ---
    const monthlyWorkouts = workoutsLast30Days.length;
    const monthlyVolume = workoutsLast30Days.reduce(
      (sum, w) => sum + w.volume,
      0
    );
    const allPrs = Object.values(personalRecords);
    const monthlyPrs = allPrs.filter((pr) =>
      isAfter(parseISO(pr.estimated1RM.date), last30DaysStart)
    ).length;

    // --- Calculations for Previous Period ---
    const prevMonthlyWorkouts = workoutsPrev30Days.length;
    const prevMonthlyVolume = workoutsPrev30Days.reduce(
      (sum, w) => sum + w.volume,
      0
    );
    const prevMonthlyPrs = allPrs.filter(
      (pr) =>
        isAfter(parseISO(pr.estimated1RM.date), prev30DaysStart) &&
        !isAfter(parseISO(pr.estimated1RM.date), prev30DaysEnd)
    ).length;

    // --- Comparison Calculations ---
    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    const workoutsChange = calculateChange(
      monthlyWorkouts,
      prevMonthlyWorkouts
    );
    const volumeChange = calculateChange(monthlyVolume, prevMonthlyVolume);
    const prsChange = calculateChange(monthlyPrs, prevMonthlyPrs);

    const totalVolume = workouts.reduce((sum, w) => sum + w.volume, 0);

    const topSet = (Object.values(personalRecords) || []).reduce(
      (max, pr) => {
        const value = pr?.estimated1RM?.value;
        if (value && !isNaN(value) && value > (max.estimated1RM.value || 0)) {
          return pr;
        }
        return max;
      },
      {
        estimated1RM: { value: 0, date: "" },
        exerciseName: "N/A",
        highestReps: { value: 0, weight: 0, date: "" },
        highestSetVolume: { value: 0, date: "" },
        highestWeight: { value: 0, date: "" },
      }
    );

    return {
      monthlyWorkouts,
      monthlyVolume,
      monthlyPrs,
      workoutsChange,
      volumeChange,
      prsChange,
      allTimeVolume: totalVolume,
      allTimePrs: allPrs.length,
      topSet,
    };
  }, [workouts, personalRecords]);

  if (loading) {
    return <AnalyticsPageLoader />;
  }

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

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariant}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariant}>
        <h1 className="text-3xl sm:text-4xl font-bold text-brand-text tracking-tight">
          Analytics Dashboard
        </h1>
        <p className="text-lg text-brand-text-muted mt-1">
          An overview of your fitness journey and progress.
        </p>
      </motion.div>

      {workouts.length === 0 ? (
        <motion.div
          variants={itemVariant}
          className="flex flex-col items-center justify-center h-96 text-center"
        >
          <ChartBarIcon className="w-16 h-16 text-brand-primary/20 mb-4" />
          <h2 className="text-2xl font-semibold text-brand-text mb-2">
            Your Dashboard Awaits
          </h2>
          <p className="text-brand-text-muted max-w-md">
            Log a workout to start tracking your progress and unlocking powerful
            insights!
          </p>
        </motion.div>
      ) : (
        <>
          <motion.section variants={itemVariant}>
            <ConsistencyCalendar workoutData={workoutDataForCalendar} />
          </motion.section>

          <motion.section variants={itemVariant}>
            <VolumeChart series={volumeSeries} />
          </motion.section>

          {exerciseOptions.length > 0 && (
            <motion.section variants={itemVariant}>
              <ExerciseProgressChart
                series={exerciseProgressData.series}
                categories={exerciseProgressData.categories}
                title="Exercise Progression"
                onExerciseChange={setSelectedExercise}
                exerciseOptions={exerciseOptions}
                selectedExercise={selectedExercise}
              />
            </motion.section>
          )}

          <motion.section variants={itemVariant}>
            <h2 className="text-2xl font-semibold text-brand-text mb-4 tracking-tight">
              Statistics
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column for Stats */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-brand-text-muted mb-3">
                    Activity (Last 30 Days)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <StatsCard
                      title="Workouts"
                      value={analytics.monthlyWorkouts}
                      icon={<BoltIcon className="w-6 h-6" />}
                      comparisonValue={analytics.workoutsChange}
                    />
                    <StatsCard
                      title="Volume"
                      value={`${(analytics.monthlyVolume / 1000).toFixed(1)}`}
                      unit="k kg"
                      icon={<ScaleIcon className="w-6 h-6" />}
                      comparisonValue={analytics.volumeChange}
                    />
                    <StatsCard
                      title="New PRs"
                      value={analytics.monthlyPrs}
                      icon={<TrophyIcon className="w-6 h-6" />}
                      comparisonValue={analytics.prsChange}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-brand-text-muted mb-3">
                    All-Time Progress
                  </h3>
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
                      value={`${analytics.topSet.estimated1RM.value.toFixed(
                        1
                      )}kg`}
                      icon={<StarIcon className="w-6 h-6" />}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column for Muscle Distribution */}
              <div className="lg:col-span-1">
                <MuscleGroupDistributionChart
                  series={muscleGroupData.series}
                  labels={muscleGroupData.labels}
                />
              </div>
            </div>
          </motion.section>
        </>
      )}
    </motion.div>
  );
};

export default AnalyticsPage;
