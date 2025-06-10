import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWorkout } from "../../contexts/WorkoutContext";
import { FireIcon } from "@heroicons/react/24/solid";
import { UIGroup } from "./AnatomicalGraph";
import { Workout, Exercise } from "../../types";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

// Helper to get recently exercised muscles from the new context
const getRecentlyExercisedGroups = (workouts: Workout[]): Set<UIGroup> => {
  const recentGroups = new Set<UIGroup>();
  const now = Date.now();
  const twentyFourHours = 24 * 60 * 60 * 1000;

  workouts.forEach((workout) => {
    if (now - new Date(workout.date).getTime() < twentyFourHours) {
      workout.exercises.forEach((exercise: Exercise) => {
        exercise.muscleGroups.forEach((group) => {
          recentGroups.add(group as UIGroup);
        });
      });
    }
  });

  return recentGroups;
};

const ExercisedMusclesList: React.FC = () => {
  const { workouts } = useWorkout();

  const exercisedMuscleGroups = useMemo(
    () => Array.from(getRecentlyExercisedGroups(workouts)),
    [workouts]
  );

  return (
    <div className="p-4 rounded-lg h-full">
      <h3 className="text-lg font-semibold text-white/90 mb-4 tracking-wide">
        Recently Activated
      </h3>
      <AnimatePresence>
        {exercisedMuscleGroups.length > 0 ? (
          <motion.ul
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="space-y-2"
          >
            {exercisedMuscleGroups.map((group: UIGroup) => (
              <motion.li
                key={group}
                variants={itemVariants}
                className="flex items-center bg-white/5 p-3 rounded-lg"
              >
                <FireIcon className="h-5 w-5 text-brand-primary mr-3" />
                <span className="text-white/80">{group}</span>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-full text-center text-white/50"
          >
            <p>No recent workout data found.</p>
            <p className="text-sm mt-1">
              Complete a workout to see your activated muscles here.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExercisedMusclesList;
