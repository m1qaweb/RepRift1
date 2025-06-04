// /src/components/Workout/ExerciseLogRow.tsx – Displays a single exercise during workout logging.
import React from "react";
import { motion } from "framer-motion";
import { Exercise } from "../../utils/fakeApi";
import Button from "../UI/Button";
import { PlayIcon, CheckIcon } from "@heroicons/react/24/solid";

interface LoggedSetData {
  reps: number | null;
  weight: number | null;
  completed: boolean;
}

interface ExerciseLogRowProps {
  exercise: Exercise;
  loggedSets: LoggedSetData[];
  onSetChange: (
    setIndex: number,
    field: keyof LoggedSetData,
    value: string | number | boolean
  ) => void;
  onTimerStart: (durationSeconds: number) => void;
  isTimerActive: boolean;
}

const ExerciseLogRow: React.FC<ExerciseLogRowProps> = ({
  exercise,
  loggedSets,
  onSetChange,
  onTimerStart,
  isTimerActive,
}) => {
  const rowVariants = {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 10 }, // Not typically used here unless removing rows dynamically from this component
  };

  const handleSetCompleteToggle = (setIndex: number) => {
    onSetChange(setIndex, "completed", !loggedSets[setIndex].completed);
    if (!loggedSets[setIndex].completed && !isTimerActive) {
      // If marking as complete, start timer
      onTimerStart(exercise.restInterval);
    }
  };

  return (
    <motion.div
      variants={rowVariants}
      className="p-4 border border-light-border dark:border-dark-border rounded-lg bg-light-card/50 dark:bg-dark-card/50"
    >
      <div className="flex justify-between items-center mb-3">
        <div>
          <h4 className="text-lg font-semibold text-light-text dark:text-dark-text">
            {exercise.name}
          </h4>
          <p className="text-xs text-light-secondary dark:text-dark-secondary">
            Target: {exercise.sets} sets of {exercise.reps} reps,{" "}
            {exercise.restInterval}s rest
          </p>
        </div>
        {/* Optional: button to start timer for first set or if user manually wants it */}
        {!isTimerActive && !loggedSets.every((s) => s.completed) && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onTimerStart(exercise.restInterval)}
            leftIcon={<PlayIcon className="h-4 w-4" />}
            disabled={loggedSets.some(
              (s) =>
                s.completed && !loggedSets[loggedSets.indexOf(s) + 1]?.completed
            )} // disable if in middle of sets
          >
            Start Rest
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {loggedSets.map((set, setIndex) => {
          const setCompleted = set.completed;
          const rowAnimation = setCompleted
            ? {
                opacity: 0.6,
                textDecoration: "line-through",
                transition: { duration: 0.3 },
              }
            : { opacity: 1, textDecoration: "none" };

          return (
            <motion.div
              key={setIndex}
              animate={rowAnimation}
              className={`grid grid-cols-12 gap-2 items-center p-2 rounded-md ${
                setCompleted ? "bg-green-500/10 dark:bg-green-500/20" : ""
              }`}
            >
              <span className="col-span-1 text-sm font-medium text-light-secondary dark:text-dark-secondary">
                Set {setIndex + 1}
              </span>
              <div className="col-span-4 md:col-span-3">
                <label
                  htmlFor={`ex-${exercise.id}-set-${setIndex}-reps`}
                  className="sr-only"
                >
                  Reps
                </label>
                <input
                  type="number"
                  id={`ex-${exercise.id}-set-${setIndex}-reps`}
                  placeholder="Reps"
                  value={set.reps === null ? "" : set.reps}
                  onChange={(e) =>
                    onSetChange(setIndex, "reps", e.target.value)
                  }
                  disabled={setCompleted}
                  className="w-full text-sm px-2 py-1 border rounded-md bg-transparent border-gray-300 dark:border-gray-600 disabled:opacity-70"
                />
              </div>
              <div className="col-span-4 md:col-span-3">
                <label
                  htmlFor={`ex-${exercise.id}-set-${setIndex}-weight`}
                  className="sr-only"
                >
                  Weight (kg)
                </label>
                <input
                  type="number"
                  id={`ex-${exercise.id}-set-${setIndex}-weight`}
                  placeholder="Weight"
                  value={set.weight === null ? "" : set.weight}
                  step="0.5"
                  onChange={(e) =>
                    onSetChange(setIndex, "weight", e.target.value)
                  }
                  disabled={setCompleted}
                  className="w-full text-sm px-2 py-1 border rounded-md bg-transparent border-gray-300 dark:border-gray-600 disabled:opacity-70"
                />
              </div>
              <div className="col-span-3 md:col-span-2 flex justify-center">
                <motion.button
                  onClick={() => handleSetCompleteToggle(setIndex)}
                  className={`p-2 rounded-full transition-colors 
                                ${
                                  setCompleted
                                    ? "bg-green-500 text-white hover:bg-green-600"
                                    : "bg-gray-200 dark:bg-gray-600 text-light-text dark:text-dark-text hover:bg-gray-300 dark:hover:bg-gray-500"
                                }`}
                  whileTap={{ scale: 0.9 }}
                  title={
                    setCompleted ? "Mark as Incomplete" : "Mark as Complete"
                  }
                >
                  <CheckIcon className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ExerciseLogRow;
