// /src/components/Workout/ExerciseLogRow.tsx (Corrected & Memoized)
import React from "react";
import { motion } from "framer-motion";
import { Exercise } from "../../types/data";
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

// NOTE: Component logic remains identical as it was functionally correct.
const ExerciseLogRowComponent: React.FC<ExerciseLogRowProps> = ({
  exercise,
  loggedSets,
  onSetChange,
  onTimerStart,
  isTimerActive,
}) => {
  const handleSetCompleteToggle = (setIndex: number) => {
    const currentlyCompleted = loggedSets[setIndex].completed;
    onSetChange(setIndex, "completed", !currentlyCompleted);
    if (!currentlyCompleted && !isTimerActive) {
      onTimerStart(exercise.restInterval);
    }
  };

  const inputStyle = (completed: boolean) =>
    `w-full text-sm px-2 py-1.5 border rounded-md bg-transparent focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary
     ${completed ? "border-brand-border opacity-70" : "border-brand-border"}
     disabled:opacity-50 disabled:cursor-not-allowed`;

  return (
    <motion.div className="p-4 border border-brand-border rounded-lg bg-brand-card/50">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h4 className="text-lg font-semibold text-brand-text">
            {exercise.name}
          </h4>
          <p className="text-xs text-brand-text-muted">
            Target: {exercise.sets} sets of {exercise.reps} reps,{" "}
            {exercise.restInterval}s rest
          </p>
        </div>
        {!isTimerActive && !loggedSets.every((s) => s.completed) && (
          <Button
            size="sm"
            onClick={() => onTimerStart(exercise.restInterval)}
            leftIcon={<PlayIcon className="h-4 w-4" />}
            disabled={
              isTimerActive ||
              loggedSets.some(
                (s, idx, arr) =>
                  s.completed && arr[idx + 1] && !arr[idx + 1].completed
              )
            }
          >
            Start Rest
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {loggedSets.map((set, setIndex) => {
          const setCompleted = set.completed;
          return (
            <div
              key={setIndex}
              className={`grid grid-cols-12 gap-2 items-center p-2 rounded-md 
                          transition-colors duration-100 ease-in-out
                          ${
                            setCompleted
                              ? "opacity-60 line-through"
                              : "opacity-100"
                          }
                          ${
                            setCompleted
                              ? "bg-success/10"
                              : "bg-transparent hover:bg-brand-card/30"
                          }`}
            >
              <span className="col-span-1 text-sm font-medium text-brand-text-muted">
                Set {setIndex + 1}
              </span>
              <div className="col-span-4 md:col-span-3">
                <input
                  type="number"
                  id={`ex-${exercise.id}-set-${setIndex}-reps`}
                  placeholder="Reps"
                  value={set.reps ?? ""}
                  onChange={(e) =>
                    onSetChange(setIndex, "reps", e.target.value)
                  }
                  disabled={setCompleted}
                  className={inputStyle(setCompleted)}
                />
              </div>
              <div className="col-span-4 md:col-span-3">
                <input
                  type="number"
                  id={`ex-${exercise.id}-set-${setIndex}-weight`}
                  placeholder="Weight"
                  value={set.weight ?? ""}
                  step="0.25"
                  onChange={(e) =>
                    onSetChange(setIndex, "weight", e.target.value)
                  }
                  disabled={setCompleted}
                  className={inputStyle(setCompleted)}
                />
              </div>
              <div className="col-span-3 md:col-span-2 flex justify-center">
                <button
                  onClick={() => handleSetCompleteToggle(setIndex)}
                  className={`p-1.5 rounded-full transition-colors duration-200 ease-in-out flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 
                              ${
                                setCompleted
                                  ? "bg-success text-white hover:bg-success/90 focus-visible:ring-success"
                                  : "bg-brand-secondary/30 text-brand-text hover:bg-brand-secondary/50 focus-visible:ring-brand-secondary"
                              }`}
                  title={setCompleted ? "Mark Incomplete" : "Mark Complete"}
                >
                  <CheckIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

// THE FIX: Wrap the component in React.memo to prevent unnecessary re-renders when other
// rows in the list are updated. This is a critical performance optimization.
const ExerciseLogRow = React.memo(ExerciseLogRowComponent);

export default ExerciseLogRow;
