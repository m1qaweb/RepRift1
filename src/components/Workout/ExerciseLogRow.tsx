// /src/components/Workout/ExerciseLogRow.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Exercise } from "../../types/data";
import Button from "../UI/Button";
import {
  ClockIcon,
  CheckIcon,
  PlusIcon,
  XMarkIcon,
  TrophyIcon,
  HashtagIcon,
  ScaleIcon,
} from "@heroicons/react/24/outline";

interface LoggedSetData {
  id: string; // Add id for proper keying in animations
  reps: number | null;
  weight: number | null;
  completed: boolean;
}

interface ExerciseLogRowProps {
  exercise: Exercise;
  loggedSets: LoggedSetData[];
  onSetChange: (
    setIndex: number,
    field: keyof Omit<LoggedSetData, "id">,
    value: string | number | boolean
  ) => void;
  onTimerStart: () => void;
  isTimerActive: boolean;
  onAddSet: () => void;
  onRemoveSet: (setIndex: number) => void;
}

const ExerciseLogRowComponent: React.FC<ExerciseLogRowProps> = ({
  exercise,
  loggedSets,
  onSetChange,
  onTimerStart,
  isTimerActive,
  onAddSet,
  onRemoveSet,
}) => {
  const handleSetCompleteToggle = (setIndex: number) => {
    const currentlyCompleted = loggedSets[setIndex].completed;
    onSetChange(setIndex, "completed", !currentlyCompleted);
    if (!currentlyCompleted && !isTimerActive) {
      onTimerStart();
    }
  };

  const SetInput: React.FC<{
    value: number | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    disabled: boolean;
    icon: React.ReactNode;
  }> = ({ value, onChange, placeholder, disabled, icon }) => (
    <div className="relative flex items-center">
      <span className="absolute left-3 text-brand-text-muted pointer-events-none">
        {icon}
      </span>
      <input
        type="number"
        placeholder={placeholder}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        className="w-full bg-brand-background/40 border-2 border-brand-border/30 rounded-lg py-2 pl-9 pr-2 text-center text-brand-text focus:ring-brand-primary focus:border-brand-primary transition-colors duration-300 placeholder:text-brand-text-muted/50 disabled:bg-brand-background/20 disabled:text-brand-text-muted"
      />
    </div>
  );

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const setVariants = {
    hidden: { opacity: 0, height: 0, y: -10 },
    visible: {
      opacity: 1,
      height: "auto",
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: {
      opacity: 0,
      height: 0,
      y: -10,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      className="bg-brand-card/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg overflow-hidden"
      variants={cardVariants}
      layout
    >
      <div className="p-4 md:p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="text-xl font-bold text-brand-text tracking-tight">
              {exercise.name}
            </h4>
            <p className="text-xs text-brand-text-muted uppercase tracking-wider font-medium">
              Target: {exercise.sets} sets of {exercise.reps} reps
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-sm text-brand-text-muted bg-brand-card/70 px-3 py-1 rounded-full">
              <ScaleIcon className="h-4 w-4 mr-1.5" />
              <span>{exercise.weight}kg Target</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={onTimerStart}
              leftIcon={<ClockIcon className="h-4 w-4" />}
              disabled={isTimerActive}
              className="!text-brand-text-muted hover:!bg-brand-primary/20 hover:!text-brand-primary"
              title="Start Rest Timer"
            >
              Rest
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {loggedSets.map((set, setIndex) => (
              <motion.div
                key={set.id}
                variants={setVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                className={`grid grid-cols-12 gap-x-2 sm:gap-x-3 items-center p-2 rounded-lg transition-colors duration-300
                ${
                  set.completed
                    ? "bg-brand-primary/10"
                    : "bg-brand-background/20"
                }`}
              >
                <span className="col-span-1 text-sm font-semibold text-brand-text-muted text-center">
                  {setIndex + 1}
                </span>
                <div className="col-span-4 sm:col-span-4">
                  <SetInput
                    placeholder="Reps"
                    value={set.reps}
                    onChange={(e) =>
                      onSetChange(setIndex, "reps", e.target.value)
                    }
                    disabled={set.completed}
                    icon={<HashtagIcon className="h-4 w-4" />}
                  />
                </div>
                <div className="col-span-4 sm:col-span-4">
                  <SetInput
                    placeholder="kg"
                    value={set.weight}
                    onChange={(e) =>
                      onSetChange(setIndex, "weight", e.target.value)
                    }
                    disabled={set.completed}
                    icon={<TrophyIcon className="h-4 w-4" />}
                  />
                </div>
                <div className="col-span-3 sm:col-span-3 flex justify-center items-center gap-1">
                  <button
                    onClick={() => handleSetCompleteToggle(setIndex)}
                    className={`p-2 rounded-full transition-all duration-200 ease-in-out flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-offset-transparent
                    ${
                      set.completed
                        ? "bg-brand-primary text-white hover:bg-brand-primary/80 focus-visible:ring-brand-primary"
                        : "bg-brand-background/50 text-brand-text-muted hover:bg-brand-background/80 hover:text-white focus-visible:ring-white"
                    }`}
                    title={set.completed ? "Mark Incomplete" : "Mark Complete"}
                  >
                    <CheckIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onRemoveSet(setIndex)}
                    className="p-2 rounded-full text-brand-text-muted hover:bg-error/20 hover:text-error transition-colors"
                    title="Remove Set"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-4 border-t border-white/10 pt-4">
          <Button
            onClick={onAddSet}
            variant="ghost"
            className="w-full !text-brand-text-muted hover:!bg-brand-primary/20 hover:!text-brand-primary"
            leftIcon={<PlusIcon className="h-4 w-4" />}
          >
            Add Set
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const ExerciseLogRow = React.memo(ExerciseLogRowComponent);

export default ExerciseLogRow;
