// /src/components/Dashboard/TodaysWorkoutCard.tsx (Corrected & Refactored)
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ClipboardDocumentListIcon,
  ArrowRightCircleIcon,
  FireIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";

import { useWorkout } from "../../contexts/WorkoutContext";
import { format, isToday, parseISO } from "date-fns";
import Button from "../UI/Button";
import Spinner from "../UI/Spinner";

const TodaysWorkoutCard: React.FC = () => {
  const { workouts, loading } = useWorkout();

  const todaysWorkout = useMemo(() => {
    return workouts.find((w) => isToday(parseISO(w.date))) || null;
  }, [workouts]);

  const { totalSets, completedSets, progressPercentage } = useMemo(() => {
    if (!todaysWorkout)
      return { totalSets: 0, completedSets: 0, progressPercentage: 0 };
    let totalSets = 0;
    let completedSets = 0;
    todaysWorkout.exercises.forEach((ex) => {
      totalSets += ex.sets.length;
      completedSets += ex.sets.filter((s) => s.completed).length;
    });
    const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
    return { totalSets, completedSets, progressPercentage: progress };
  }, [todaysWorkout]);

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

  const gradientBackground = `bg-gradient-to-br from-[rgb(var(--color-primary-rgb)/0.9)] via-[rgb(var(--color-primary-rgb)/0.8)] to-[rgb(var(--color-accent-rgb)/0.7)] 
                                dark:from-[rgb(var(--color-primary-rgb)/1)] dark:via-[rgb(var(--color-primary-rgb)/0.9)] dark:to-[rgb(var(--color-accent-rgb)/0.8)]`;

  if (loading) {
    return (
      <div
        className={`rounded-xl shadow-xl ${gradientBackground} p-6 min-h-[250px] flex items-center justify-center`}
      >
        <Spinner size="md" className="text-neutral-700 dark:text-white/80" />
        <p className="ml-3 text-neutral-600 dark:text-white/80">
          Loading today's focus...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={`rounded-xl shadow-2xl overflow-hidden ${gradientBackground} min-h-[250px] flex flex-col text-neutral-800 dark:text-white`}
    >
      <div className="p-5 sm:p-6 flex-grow">
        <motion.h3
          variants={itemVariants}
          className="text-xl sm:text-2xl font-bold mb-1 drop-shadow-sm"
        >
          Today's Focus
        </motion.h3>
        <motion.p
          variants={itemVariants}
          className="text-sm mb-4 drop-shadow-sm text-neutral-600 dark:text-white/80"
        >
          {format(new Date(), "EEEE, MMMM d")}
        </motion.p>

        {todaysWorkout ? (
          <>
            <motion.div variants={itemVariants} className="mb-3">
              <h4 className="text-lg sm:text-xl font-semibold truncate drop-shadow-sm">
                {todaysWorkout.name}
              </h4>
              <div className="flex items-center space-x-3 text-xs mt-1 text-neutral-600 dark:text-white/80">
                <span className="flex items-center">
                  <ClockIcon className="h-3.5 w-3.5 mr-1 text-neutral-500 dark:text-white/80" />
                  {todaysWorkout.duration} mins
                </span>
                <span className="flex items-center">
                  <FireIcon className="h-3.5 w-3.5 mr-1 text-neutral-500 dark:text-white/80" />
                  {todaysWorkout.volume.toLocaleString()} kg Volume
                </span>
              </div>
            </motion.div>

            {totalSets > 0 && (
              <motion.div variants={itemVariants} className="my-4">
                <div className="flex justify-between text-xs mb-1 text-neutral-600 dark:text-white/80">
                  <span>Progress</span>
                  <span>
                    {completedSets} / {totalSets} sets
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
          </>
        ) : (
          <motion.div
            variants={itemVariants}
            className="text-center py-6 flex flex-col items-center justify-center flex-grow"
          >
            <ClipboardDocumentListIcon className="h-10 w-10 sm:h-12 sm:w-12 mb-3 text-neutral-500 opacity-100 dark:text-white/80 dark:opacity-60" />
            <p className="mb-2 text-base font-medium">
              No Workout Logged Today
            </p>
            <p className="text-xs max-w-xs mx-auto text-neutral-600 dark:text-white/80">
              Ready to train? Log a session to see your progress here.
            </p>
          </motion.div>
        )}
      </div>

      <motion.div
        variants={itemVariants}
        className="p-4 sm:p-5 border-t border-neutral-400/20 dark:border-white/10 mt-auto"
      >
        <Link to={todaysWorkout ? "/programs" : "/log-workout"}>
          <Button
            variant="ghost"
            className="bg-neutral-800/10 hover:bg-neutral-800/20 dark:bg-white/10 dark:hover:bg-white/20 w-full !font-semibold !py-2.5 sm:!py-3 group"
            rightIcon={
              <ArrowRightCircleIcon className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
            }
          >
            {todaysWorkout ? "Continue Workout" : "Log Today's Workout"}
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default TodaysWorkoutCard;
