// /src/components/Dashboard/TodaysWorkoutCard.tsx (Enhanced and Fixed)
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ClipboardDocumentListIcon,
  ArrowRightCircleIcon,
  FireIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";

import { WorkoutLog, fetchWorkoutLogs } from "../../utils/fakeApi";
import { formatDate } from "../../utils/dateUtils";
import Button from "../UI/Button";
import Spinner from "../UI/Spinner";
import { useTheme } from "../../contexts/ThemeContext";

interface TodaysWorkoutCardProps {}

const TodaysWorkoutCard: React.FC<TodaysWorkoutCardProps> = () => {
  const { theme } = useTheme();
  const [todaysWorkout, setTodaysWorkout] = useState<WorkoutLog | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const today = formatDate(new Date(), "yyyy-MM-dd");
    setIsLoading(true);
    fetchWorkoutLogs({ date: today })
      .then((logs) => {
        setTodaysWorkout(logs.length > 0 ? logs[0] : null);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

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

  const gradientBackground = `bg-gradient-to-br from-[rgb(var(--color-primary-rgb)/0.9)] via-[rgb(var(--color-primary-rgb)/0.8)] to-[rgb(var(--color-accent-rgb)/0.7)] dark:from-[rgb(var(--color-primary-rgb)/1)] dark:via-[rgb(var(--color-primary-rgb)/0.9)] dark:to-[rgb(var(--color-accent-rgb)/0.8)]`;

  const isLightMode = theme === "light";

  const primaryTextColor = isLightMode ? "text-neutral-800" : "text-white";
  const secondaryTextColor = isLightMode ? "text-neutral-600" : "text-white/80";
  const tertiaryTextColor = isLightMode ? "text-neutral-500" : "text-white/70";
  const iconMutedColor = isLightMode ? "text-neutral-500" : "text-white/80";

  const progressBarBgColor = isLightMode ? "bg-neutral-800/20" : "bg-white/20";
  const progressBarFillColor = isLightMode ? "bg-neutral-800" : "bg-white";

  const buttonBgColor = isLightMode ? "bg-neutral-800/10" : "bg-white/10";
  const buttonHoverBgColor = isLightMode
    ? "hover:bg-neutral-800/20"
    : "hover:bg-white/20";
  const buttonTextColor = isLightMode ? "text-neutral-800" : "text-white";
  const spinnerColorClass = isLightMode ? "text-neutral-700" : "text-white/80";

  if (isLoading) {
    return (
      <div
        className={`rounded-xl shadow-xl ${gradientBackground} p-6 min-h-[250px] flex items-center justify-center`}
      >
        <Spinner size="md" colorClass={spinnerColorClass} />
        <p className={`ml-3 ${secondaryTextColor}`}>Loading today's focus...</p>
      </div>
    );
  }

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
      className={`rounded-xl shadow-2xl overflow-hidden ${gradientBackground} min-h-[250px] flex flex-col ${primaryTextColor}`}
    >
      <div className="p-5 sm:p-6 flex-grow">
        <motion.h3
          variants={itemVariants}
          className={`text-xl sm:text-2xl font-bold mb-1 drop-shadow-sm ${primaryTextColor}`}
        >
          Today's Focus
        </motion.h3>
        <motion.p
          variants={itemVariants}
          className={`text-sm mb-4 drop-shadow-sm ${secondaryTextColor}`}
        >
          {formatDate(new Date(), "EEEE, MMMM d")}
        </motion.p>

        {todaysWorkout ? (
          <>
            <motion.div variants={itemVariants} className="mb-3">
              <h4
                className={`text-lg sm:text-xl font-semibold truncate drop-shadow-sm ${primaryTextColor}`}
              >
                {todaysWorkout.programTitle}
              </h4>
              <div
                className={`flex items-center space-x-3 text-xs mt-1 ${secondaryTextColor}`}
              >
                {todaysWorkout.durationMinutes && (
                  <span className="flex items-center">
                    <ClockIcon
                      className={`h-3.5 w-3.5 mr-1 ${iconMutedColor}`}
                    />
                    {todaysWorkout.durationMinutes} mins
                  </span>
                )}
                {todaysWorkout.caloriesBurned && (
                  <span className="flex items-center">
                    <FireIcon
                      className={`h-3.5 w-3.5 mr-1 ${iconMutedColor}`}
                    />
                    {todaysWorkout.caloriesBurned} kcal
                  </span>
                )}
              </div>
            </motion.div>

            {totalExercises > 0 && (
              <motion.div variants={itemVariants} className="my-4">
                <div
                  className={`flex justify-between text-xs mb-1 ${secondaryTextColor}`}
                >
                  <span>Progress</span>
                  <span>
                    {completedExercisesCount} / {totalExercises} exercises
                  </span>
                </div>
                <div
                  className={`w-full rounded-full h-2 ${progressBarBgColor}`}
                >
                  <motion.div
                    className={`h-2 rounded-full ${progressBarFillColor}`}
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
                  className={`space-y-1.5 mb-4 text-xs max-h-28 overflow-y-auto pr-2 custom-scrollbar-transparent`}
                >
                  <h5
                    className={`font-medium text-sm mb-1.5 sticky top-0 bg-inherit py-1 ${
                      secondaryTextColor === "text-white/80"
                        ? "text-white/90"
                        : "text-neutral-700"
                    }`}
                  >
                    Key Exercises:
                  </h5>
                  <ul className="space-y-1">
                    {todaysWorkout.completedExercises.slice(0, 4).map((ex) => (
                      <motion.li
                        key={ex.exerciseId}
                        className={`flex items-center justify-between ${secondaryTextColor}`}
                      >
                        <span className="truncate mr-2">{ex.exerciseName}</span>
                        <span className={`flex-shrink-0 ${tertiaryTextColor}`}>
                          {ex.sets.filter((s) => s.completed).length} /{" "}
                          {ex.sets.length} sets
                        </span>
                      </motion.li>
                    ))}
                    {todaysWorkout.completedExercises.length > 4 && (
                      <li className={`${tertiaryTextColor} text-center`}>
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
            <ClipboardDocumentListIcon
              className={`h-10 w-10 sm:h-12 sm:w-12 mb-3 ${
                iconMutedColor === "text-white/80"
                  ? "opacity-60"
                  : iconMutedColor
              }`}
            />
            <p className={`mb-2 text-base font-medium ${primaryTextColor}`}>
              No Workout Today?
            </p>
            <p className={`text-xs max-w-xs mx-auto ${secondaryTextColor}`}>
              Log your session or pick a program to get started on your goals.
            </p>
          </motion.div>
        )}
      </div>

      <motion.div
        variants={itemVariants}
        className={`p-4 sm:p-5 border-t ${
          isLightMode ? "border-neutral-400/20" : "border-white/10"
        } mt-auto`}
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
            className={`${buttonBgColor} ${buttonHoverBgColor} ${buttonTextColor} w-full !font-semibold !py-2.5 sm:!py-3 group`}
            rightIcon={
              <ArrowRightCircleIcon
                className={`h-5 w-5 transition-transform duration-200 group-hover:translate-x-1 ${buttonTextColor}`}
              />
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
