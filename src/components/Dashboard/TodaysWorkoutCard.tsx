// /src/components/Dashboard/TodaysWorkoutCard.tsx (Corrected & Refactored)
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ClipboardDocumentListIcon,
  ArrowRightCircleIcon,
  FireIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";

import { formatDate } from "../../utils/dateUtils";
import Button from "../UI/Button";
import Spinner from "../UI/Spinner";
import { getWorkoutLogs } from "../../services/workoutLogService";
import { useQuery } from "@tanstack/react-query";

interface TodaysWorkoutCardProps {}

const TodaysWorkoutCard: React.FC<TodaysWorkoutCardProps> = () => {
  // === CHANGE 2: Fetch data using useQuery ===
  // This one hook replaces the `useState` for logs, `isLoading`, and the `useEffect` hook.
  const { data: allLogs, isLoading } = useQuery({
    // Give this query a unique key
    queryKey: ["workoutLogs"],
    // Tell it which function to use to fetch the data
    queryFn: getWorkoutLogs,
  });

  // This logic is now much cleaner. It derives state from the query result.
  const todaysWorkout =
    allLogs?.find(
      (log) =>
        formatDate(log.date, "yyyy-MM-dd") ===
        formatDate(new Date(), "yyyy-MM-dd")
    ) || null;

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.07,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 18 },
    },
  };

  // --- REFACTOR START ---
  // This gradient class now uses dark: variants. Ensure your --color-accent-rgb is defined in CSS.
  const gradientBackground = `bg-gradient-to-br from-[rgb(var(--color-primary-rgb)/0.9)] via-[rgb(var(--color-primary-rgb)/0.8)] to-[rgb(var(--color-accent-rgb)/0.7)] 
                                dark:from-[rgb(var(--color-primary-rgb)/1)] dark:via-[rgb(var(--color-primary-rgb)/0.9)] dark:to-[rgb(var(--color-accent-rgb)/0.8)]`;

  if (isLoading) {
    return (
      <div
        className={`rounded-xl shadow-xl ${gradientBackground} p-6 min-h-[250px] flex items-center justify-center`}
      >
        {/* Spinner color and text color will be inherited or can be set with dark: variant */}
        <Spinner size="md" className="text-neutral-700 dark:text-white/80" />
        <p className="ml-3 text-neutral-600 dark:text-white/80">
          Loading today's focus...
        </p>
      </div>
    );
  }
  // --- REFACTOR END ---

  const totalExercises = todaysWorkout?.completedExercises?.length || 0;
  const completedExercisesCount =
    todaysWorkout?.completedExercises?.filter(
      (ex) => ex.sets.length > 0 && ex.sets.every((set) => set.completed)
    ).length || 0;
  const progressPercentage =
    totalExercises > 0 ? (completedExercisesCount / totalExercises) * 100 : 0;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      // Apply base text color here and let dark: handle the change.
      className={`rounded-xl shadow-2xl overflow-hidden ${gradientBackground} min-h-[250px] flex flex-col text-neutral-800 dark:text-white`}
    >
      <div className="p-5 sm:p-6 flex-grow">
        <motion.h3
          variants={itemVariants}
          // The parent 'dark:text-white' covers this. No extra classes needed unless you want a different color.
          className="text-xl sm:text-2xl font-bold mb-1 drop-shadow-sm"
        >
          Today's Focus
        </motion.h3>
        <motion.p
          variants={itemVariants}
          // Use dark: variant for text opacity change
          className="text-sm mb-4 drop-shadow-sm text-neutral-600 dark:text-white/80"
        >
          {formatDate(new Date(), "EEEE, MMMM d")}
        </motion.p>

        {todaysWorkout ? (
          <>
            <motion.div variants={itemVariants} className="mb-3">
              <h4 className="text-lg sm:text-xl font-semibold truncate drop-shadow-sm">
                {todaysWorkout.programTitle}
              </h4>
              <div className="flex items-center space-x-3 text-xs mt-1 text-neutral-600 dark:text-white/80">
                {todaysWorkout.durationMinutes && (
                  <span className="flex items-center">
                    <ClockIcon className="h-3.5 w-3.5 mr-1 text-neutral-500 dark:text-white/80" />
                    {todaysWorkout.durationMinutes} mins
                  </span>
                )}
                {todaysWorkout.caloriesBurned && (
                  <span className="flex items-center">
                    <FireIcon className="h-3.5 w-3.5 mr-1 text-neutral-500 dark:text-white/80" />
                    {todaysWorkout.caloriesBurned} kcal
                  </span>
                )}
              </div>
            </motion.div>

            {totalExercises > 0 && (
              <motion.div variants={itemVariants} className="my-4">
                <div className="flex justify-between text-xs mb-1 text-neutral-600 dark:text-white/80">
                  <span>Progress</span>
                  <span>
                    {completedExercisesCount} / {totalExercises} exercises
                  </span>
                </div>
                <div className="w-full rounded-full h-2 bg-neutral-800/20 dark:bg-white/20">
                  <motion.div
                    className="h-2 rounded-full bg-neutral-800 dark:bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                  />
                </div>
              </motion.div>
            )}

            {todaysWorkout.completedExercises &&
              todaysWorkout.completedExercises.length > 0 && (
                <motion.div
                  variants={itemVariants}
                  className="space-y-1.5 mb-4 text-xs max-h-28 overflow-y-auto pr-2 custom-scrollbar-transparent"
                >
                  <h5 className="font-medium text-sm mb-1.5 sticky top-0 bg-inherit py-1 text-neutral-700 dark:text-white/90">
                    Key Exercises:
                  </h5>
                  <ul className="space-y-1">
                    {todaysWorkout.completedExercises.slice(0, 4).map((ex) => (
                      <motion.li
                        key={ex.exerciseId}
                        className="flex items-center justify-between text-neutral-600 dark:text-white/80"
                      >
                        <span className="truncate mr-2">{ex.exerciseName}</span>
                        <span className="flex-shrink-0 text-neutral-500 dark:text-white/70">
                          {ex.sets.filter((s) => s.completed).length} /{" "}
                          {ex.sets.length} sets
                        </span>
                      </motion.li>
                    ))}
                    {todaysWorkout.completedExercises.length > 4 && (
                      <li className="text-neutral-500 dark:text-white/70 text-center">
                        ...and more
                      </li>
                    )}
                  </ul>
                </motion.div>
              )}
          </>
        ) : (
          <motion.div
            variants={itemVariants}
            className="text-center py-6 flex flex-col items-center justify-center flex-grow"
          >
            <ClipboardDocumentListIcon className="h-10 w-10 sm:h-12 sm:w-12 mb-3 text-neutral-500 opacity-100 dark:text-white/80 dark:opacity-60" />
            <p className="mb-2 text-base font-medium">No Workout Today?</p>
            <p className="text-xs max-w-xs mx-auto text-neutral-600 dark:text-white/80">
              Log your session or pick a program to get started on your goals.
            </p>
          </motion.div>
        )}
      </div>

      <motion.div
        variants={itemVariants}
        className="p-4 sm:p-5 border-t border-neutral-400/20 dark:border-white/10 mt-auto"
      >
        <Link
          to={
            todaysWorkout
              ? `/log-workout?date=${todaysWorkout.date}&programId=${todaysWorkout.programId}`
              : "/log-workout"
          }
        >
          <Button
            variant="ghost"
            // Use dark: variants for the button styling. Text color is inherited from parent.
            className="bg-neutral-800/10 hover:bg-neutral-800/20 dark:bg-white/10 dark:hover:bg-white/20 w-full !font-semibold !py-2.5 sm:!py-3 group"
            rightIcon={
              <ArrowRightCircleIcon className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
            }
          >
            {todaysWorkout
              ? todaysWorkout.completedExercises.length > 0 &&
                progressPercentage === 100
                ? "View Details"
                : "Continue Workout"
              : "Plan or Log Workout"}
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default TodaysWorkoutCard;
