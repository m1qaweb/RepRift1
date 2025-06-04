// /src/components/Dashboard/TodaysWorkoutCard.tsx – Displays summary of today's planned/completed workout.
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Card from "../UI/Card";
// UPDATED: Removed 'Exercise' from this import
import { WorkoutLog, fetchWorkoutLogs } from "../../utils/fakeApi"; // Assume API
import { formatDate } from "../../utils/dateUtils";
import Button from "../UI/Button";
import { Link } from "react-router-dom";
// UPDATED: Removed CalendarDaysIcon and FireIcon from this import
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";

interface TodaysWorkoutCardProps {}

const TodaysWorkoutCard: React.FC<TodaysWorkoutCardProps> = () => {
  const [todaysWorkout, setTodaysWorkout] = useState<WorkoutLog | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const today = formatDate(new Date(), "yyyy-MM-dd");
    fetchWorkoutLogs({ date: today })
      .then((logs) => {
        if (logs.length > 0) {
          setTodaysWorkout(logs[0]); // Assuming one log per day for simplicity
        } else {
          setTodaysWorkout(null); // Or perhaps show a default "Plan today's workout"
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Stagger animation for child elements
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  if (isLoading) {
    return (
      <Card className="p-4 text-center">
        <p>Loading today's workout...</p>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-light-primary to-blue-600 dark:from-dark-primary dark:to-blue-700 text-white shadow-xl overflow-hidden">
      <motion.div
        className="p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h3 variants={itemVariants} className="text-2xl font-bold mb-1">
          Today's Workout
        </motion.h3>
        <motion.p variants={itemVariants} className="text-sm opacity-80 mb-4">
          {formatDate(new Date(), "EEEE, MMMM d")}
        </motion.p>

        {todaysWorkout ? (
          <>
            <motion.div variants={itemVariants} className="mb-4">
              <h4 className="text-xl font-semibold">
                {todaysWorkout.programTitle}
              </h4>
              {todaysWorkout.durationMinutes && (
                <p className="text-xs opacity-90">
                  Duration: {todaysWorkout.durationMinutes} mins
                  {todaysWorkout.caloriesBurned &&
                    ` - ${todaysWorkout.caloriesBurned} kcal`}
                </p>
              )}
            </motion.div>

            {todaysWorkout.completedExercises &&
              todaysWorkout.completedExercises.length > 0 && (
                <motion.div
                  variants={itemVariants}
                  className="space-y-2 mb-4 max-h-40 overflow-y-auto pr-2 custom-scrollbar-light"
                >
                  <h5 className="font-medium text-sm opacity-90">
                    Completed Exercises:
                  </h5>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {todaysWorkout.completedExercises.slice(0, 3).map(
                      (
                        ex // Show first 3
                      ) => (
                        <motion.li key={ex.exerciseId} variants={itemVariants}>
                          {ex.exerciseName} -{" "}
                          {ex.sets.filter((s) => s.completed).length} /{" "}
                          {ex.sets.length} sets done
                        </motion.li>
                      )
                    )}
                    {todaysWorkout.completedExercises.length > 3 && (
                      <motion.li variants={itemVariants}>...and more</motion.li>
                    )}
                  </ul>
                </motion.div>
              )}

            <motion.div variants={itemVariants}>
              <Link
                to={`/log-workout?date=${todaysWorkout.date}&programId=${todaysWorkout.programId}`}
              >
                <Button
                  variant="ghost"
                  className="bg-white/20 hover:bg-white/30 text-white w-full"
                >
                  {todaysWorkout.completedExercises.length > 0
                    ? "View Details"
                    : "Continue Workout"}
                </Button>
              </Link>
            </motion.div>
          </>
        ) : (
          <motion.div variants={itemVariants} className="text-center py-4">
            <ClipboardDocumentListIcon className="h-12 w-12 mx-auto opacity-70 mb-2" />
            <p className="mb-4 opacity-90">
              No workout logged or planned for today yet.
            </p>
            <Link to="/log-workout">
              <Button
                variant="ghost"
                className="bg-white/20 hover:bg-white/30 text-white"
              >
                Log Today's Workout
              </Button>
            </Link>
          </motion.div>
        )}
      </motion.div>
    </Card>
  );
};

export default TodaysWorkoutCard;
