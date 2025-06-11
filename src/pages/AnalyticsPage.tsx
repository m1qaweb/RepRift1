// /src/pages/AnalyticsPage.tsx
import React, { useMemo, useState, lazy } from "react";
import { motion } from "framer-motion";
import { useWorkout } from "../contexts/WorkoutContext";
import StatsCard from "../components/Analytics/StatsCard";
import {
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { subDays, parseISO, isAfter, format, isValid, startOfDay } from "date-fns";
import type { Workout, Exercise, Set } from "../types";
import { getMuscleGroup } from "../utils/muscleGroupMapping";
import Skeleton from "../components/UI/Skeleton";
import GlassCard from "../components/UI/GlassCard";

const VolumeChart = React.lazy(
  () => import("../components/Analytics/VolumeChart")
);
const ExerciseProgressChart = React.lazy(
  () => import("../components/Analytics/ExerciseProgressChart")
);
const MuscleGroupDistributionChart = React.lazy(
  () => import("../components/Analytics/MuscleGroupDistributionChart")
);

type DateRange = "7" | "30" | "90" | "all";

const DateRangeSelector: React.FC<{
  selectedRange: DateRange;
  onSelectRange: (range: DateRange) => void;
}> = ({ selectedRange, onSelectRange }) => {
  const ranges: { value: DateRange; label: string }[] = [
    { value: "7", label: "7D" },
    { value: "30", label: "30D" },
    { value: "90", label: "90D" },
    { value: "all", label: "All Time" },
  ];

  return (
    <div className="flex items-center space-x-2 rounded-lg bg-brand-surface p-1 shadow-inner">
      {ranges.map((range) => (
        <button
          key={range.value}
          onClick={() => onSelectRange(range.value)}
          className={`relative px-4 py-1.5 text-sm font-semibold transition focus:outline-none ${
            selectedRange === range.value
              ? "text-brand-text-light"
              : "text-brand-text-muted hover:text-brand-text"
          }`}
        >
          {selectedRange === range.value && (
            <motion.div
              layoutId="date-range-bg"
              className="absolute inset-0 z-0 rounded-md bg-brand-primary/20"
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          )}
          <span className="relative z-10">{range.label}</span>
        </button>
      ))}
    </div>
  );
};

const calculateEpley1RM = (weight: number, reps: number): number => {
  if (reps === 1) return weight;
  if (reps === 0) return 0;
  return weight * (1 + reps / 30);
};

const generateSparklineData = (
    data: (Workout | { date: string })[], 
    key: 'volume' | 'count', 
    days: number
) => {
    const intervals = 15;
    if (days === -1) { // -1 for "All Time"
        const sorted = data.sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());
        const chunks = Array.from({ length: intervals }, (_, i) => {
            const start = Math.floor(i * sorted.length / intervals);
            const end = Math.floor((i + 1) * sorted.length / intervals);
            return sorted.slice(start, end);
        });
        if (key === 'volume') {
            return chunks.map(chunk => chunk.reduce((sum, item) => sum + ('volume' in item ? item.volume || 0 : 0), 0));
        }
        return chunks.map(chunk => chunk.length);
    }

    const intervalDays = Math.max(Math.floor(days / intervals), 1);
    const now = startOfDay(new Date());
    const sparkline: number[] = [];
  
    for (let i = intervals - 1; i >= 0; i--) {
      const end = subDays(now, i * intervalDays);
      const start = subDays(end, intervalDays);
      
      const intervalData = data.filter(d => {
        const date = parseISO(d.date!);
        return isValid(date) && isAfter(date, start) && !isAfter(date, end);
      });
  
      if (key === 'volume') {
        sparkline.push(intervalData.reduce((sum, item) => sum + ('volume' in item ? item.volume || 0 : 0), 0));
      } else {
        sparkline.push(intervalData.length);
      }
    }
    return sparkline;
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
      exercise: w.exercises.find(
        (e: Exercise) => e.name === exerciseName
      ),
    }))
    .filter(
      (
        session
      ): session is {
        date: string;
        exercise: NonNullable<typeof session.exercise>;
      } =>
        !!session.exercise && !!session.date && isValid(parseISO(session.date))
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const categories = exerciseSessions.map((s) =>
    format(parseISO(s.date), "dd MMM")
  );
  const e1RMData: { x: string; y: number }[] = [];
  const topWeightData: { x: string; y: number }[] = [];
  const topRepsData: { x: string; y: number }[] = [];

  exerciseSessions.forEach((session) => {
    const topSet = (session.exercise.sets || [])
      .filter((s: Set) => s && s.completed)
      .reduce(
        (maxSet: Set, currentSet: Set) => {
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
    const date = format(parseISO(session.date), "yyyy-MM-dd");

    e1RMData.push({ x: date, y: Number(e1RMValue) || 0 });
    topWeightData.push({ x: date, y: Number(topSet.weight) || 0 });
    topRepsData.push({ x: date, y: Number(topSet.reps) || 0 });
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
    (workout.exercises || []).forEach((exercise: Exercise) => {
      const muscleGroup = getMuscleGroup(exercise.name);
      // In this chart, we care about the number of sets, not volume.
      const setCount = (exercise.sets || []).filter(s => s.completed).length;
      distribution[muscleGroup] = (distribution[muscleGroup] || 0) + setCount;
    });
  });

  return Object.entries(distribution)
    .map(([label, value]) => ({ label, value: Number(value) || 0 }))
    .sort((a, b) => b.value - a.value);
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
  const [dateRange, setDateRange] = useState<DateRange>("30");
  const [filteredWorkouts, setFilteredWorkouts] = useState<Workout[]>([]);

  const { dateRangeDays } = useMemo(() => {
    if (dateRange === "all") return { dateRangeDays: -1 };
    const rangeDays = parseInt(dateRange, 10);
    const startDate = subDays(startOfDay(new Date()), rangeDays);
    const filtered = workouts.filter((w) => {
      const workoutDate = parseISO(w.date!);
      return isValid(workoutDate) && isAfter(workoutDate, startDate);
    });
    return { dateRangeDays: rangeDays };
  }, [workouts, dateRange]);

  const exerciseOptions = useMemo(() => {
    const allExercises = new Set<string>();
    workouts.forEach((w) =>
      w.exercises?.forEach((e) => allExercises.add(e.name))
    );
    return Array.from(allExercises).map(e => ({ value: e, label: e }));
  }, [workouts]);

  React.useEffect(() => {
    if (exerciseOptions.length > 0 && !exerciseOptions.find(opt => opt.value === selectedExercise)) {
      setSelectedExercise(exerciseOptions[0].value);
    }
  }, [exerciseOptions, selectedExercise]);

  React.useEffect(() => {
    if (dateRange === "all") {
      setFilteredWorkouts(workouts);
      return;
    }
    const rangeDays = parseInt(dateRange, 10);
    const startDate = subDays(startOfDay(new Date()), rangeDays);
    const newWorkouts = workouts.filter((w) => {
      const workoutDate = parseISO(w.date!);
      return isValid(workoutDate) && isAfter(workoutDate, startDate);
    });
    if (newWorkouts.length === 0) {
      setFilteredWorkouts(workouts);
      return;
    }
    setFilteredWorkouts(newWorkouts);
  }, [dateRange, workouts]);

  const volumeSeries = useMemo(
    () => processVolumeDataForChart(filteredWorkouts),
    [filteredWorkouts]
  );

  const exerciseProgressData = useMemo(
    () => processExerciseDataForChart(filteredWorkouts, selectedExercise),
    [filteredWorkouts, selectedExercise]
  );

  const muscleGroupData = useMemo(
    () => processMuscleGroupData(filteredWorkouts),
    [filteredWorkouts]
  );

  const analytics = useMemo(() => {
    // --- Current Period Calculations ---
    const currentWorkouts = filteredWorkouts;
    const periodVolume = currentWorkouts.reduce((sum, w) => sum + (w.volume || 0), 0);
    
    let prsInPeriod;
    if (dateRange === "all") {
        prsInPeriod = personalRecords ? Object.values(personalRecords) : [];
    } else {
        const startDate = subDays(startOfDay(new Date()), dateRangeDays);
        prsInPeriod = personalRecords ? Object.values(personalRecords).filter(pr => {
            const prDate = parseISO(pr.estimated1RM.date);
            return isValid(prDate) && isAfter(prDate, startDate);
        }) : [];
    }

    // --- Previous Period Calculations ---
    let prevPeriodWorkouts = 0;
    let prevPeriodVolume = 0;
    let prevPeriodPrs = 0;

    if (dateRange !== "all") {
        const currentStartDate = subDays(startOfDay(new Date()), dateRangeDays);
        const prevStartDate = subDays(currentStartDate, dateRangeDays);
        const prevEndDate = currentStartDate;

        const prevPeriodWorkoutData = workouts.filter(w => {
            const date = parseISO(w.date!);
            return isValid(date) && isAfter(date, prevStartDate) && !isAfter(date, prevEndDate);
        });
        prevPeriodWorkouts = prevPeriodWorkoutData.length;
        prevPeriodVolume = prevPeriodWorkoutData.reduce((sum, w) => sum + (w.volume || 0), 0);
        
        prevPeriodPrs = personalRecords ? Object.values(personalRecords).filter(pr => {
            const prDate = parseISO(pr.estimated1RM.date);
            return isValid(prDate) && isAfter(prDate, prevStartDate) && !isAfter(prDate, prevEndDate);
        }).length : 0;
    }

    // --- Change Calculations ---
    const calculateChange = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
    };
    
    const workoutChange = calculateChange(currentWorkouts.length, prevPeriodWorkouts);
    const volumeChange = calculateChange(periodVolume, prevPeriodVolume);
    const prsChange = calculateChange(prsInPeriod.length, prevPeriodPrs);

    const prsAsWorkouts = prsInPeriod.map(p => ({ date: p.estimated1RM.date }));
    const workoutSparkline = generateSparklineData(currentWorkouts, 'count', dateRangeDays);
    const volumeSparkline = generateSparklineData(currentWorkouts, 'volume', dateRangeDays);
    const prSparkline = generateSparklineData(prsAsWorkouts, 'count', dateRangeDays);

    return {
      periodWorkouts: currentWorkouts.length,
      periodVolume: periodVolume,
      periodPrs: prsInPeriod.length,
      workoutChange,
      volumeChange,
      prsChange,
      workoutSparkline,
      volumeSparkline,
      prSparkline,
    };
  }, [filteredWorkouts, workouts, personalRecords, dateRange, dateRangeDays]);

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
      className="p-4 sm:p-6 lg:p-8 bg-brand-background-dark"
      variants={containerVariant}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariant} className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-text tracking-tight">
              Analytics
            </h1>
            <p className="text-lg text-brand-text-muted mt-1">
              An overview of your fitness journey and progress.
            </p>
        </div>
        <DateRangeSelector selectedRange={dateRange} onSelectRange={setDateRange} />
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
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 auto-rows-max">
          <div className="xl:col-span-12 space-y-8">
            <motion.div variants={itemVariant} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard 
                    title="Workouts"
                    value={analytics.periodWorkouts}
                    sparklineData={analytics.workoutSparkline}
                    comparisonValue={analytics.workoutChange}
                />
                <StatsCard 
                    title="Volume"
                    value={Number((analytics.periodVolume / 1000).toFixed(1))}
                    unit="k kg"
                    sparklineData={analytics.volumeSparkline}
                    comparisonValue={analytics.volumeChange}
                />
                <StatsCard 
                    title="New PRs"
                    value={analytics.periodPrs}
                    sparklineData={analytics.prSparkline}
                    comparisonValue={analytics.prsChange}
                />
            </motion.div>
          </div>

          <div className="xl:col-span-8 space-y-8">
            <GlassCard title="Total Volume">
                <React.Suspense fallback={<Skeleton className="h-[350px] w-full" />}>
                    <VolumeChart
                      data={volumeSeries[0]?.data || []}
                      dateRange={dateRange}
                      key={`volume-chart-${volumeSeries[0]?.data.length || 0}`}
                    />
                </React.Suspense>
            </GlassCard>
            
            {exerciseOptions.length > 0 && (
              <React.Suspense fallback={<Skeleton className="h-[440px] w-full rounded-2xl" />}>
                <ExerciseProgressChart
                    series={exerciseProgressData.series}
                    exercise={selectedExercise}
                    onExerciseChange={setSelectedExercise}
                    exerciseOptions={exerciseOptions}
                    key={selectedExercise}
                />
              </React.Suspense>
            )}
          </div>
          <div className="xl:col-span-4 space-y-8">
            <GlassCard title="Muscle Group Distribution" fullHeight>
                <React.Suspense fallback={<Skeleton className="h-full w-full" />}>
                    <MuscleGroupDistributionChart
                        data={muscleGroupData}
                        key={`muscle-chart-${muscleGroupData.length}`}
                    />
                </React.Suspense>
            </GlassCard>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AnalyticsPage;
