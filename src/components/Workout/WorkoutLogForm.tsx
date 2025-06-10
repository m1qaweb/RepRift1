// /src/components/Workout/WorkoutLogForm.tsx
import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useForm,
  SubmitHandler,
  useFieldArray,
  Controller,
} from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useWorkout } from "../../contexts/WorkoutContext";
import { generateUUID } from "../../utils/uuid";
import {
  Workout,
  Exercise as WorkoutExercise,
  Set as WorkoutSet,
} from "../../types";
import { getProgramById } from "../../services/programService";
import { useQuery } from "@tanstack/react-query";
import Button from "../UI/Button";
import Timer from "./Timer";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Spinner from "../UI/Spinner";

type WorkoutFormData = Workout;

const parseReps = (reps: string): number => {
  if (!reps) return 0;
  const match = reps.match(/^\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

const exerciseListVariants = {
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
  hidden: { opacity: 0 },
};

const exerciseItemVariants = {
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 24, mass: 0.5 },
  },
  hidden: { opacity: 0, x: -40 },
  exit: {
    opacity: 0,
    height: 0,
    scale: 0.9,
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: 0,
    marginBottom: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20,
    },
  },
};

const WorkoutLogForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const programId = searchParams.get("programId");
  const { actions } = useWorkout();
  const [activeTimerExerciseIndex, setActiveTimerExerciseIndex] = useState<
    number | null
  >(null);

  const workoutStartTime = useMemo(() => new Date(), []);

  const {
    data: program,
    isLoading: isProgramLoading,
    isError: isProgramError,
  } = useQuery({
    queryKey: ["program", programId],
    queryFn: () => getProgramById(programId!),
    enabled: !!programId,
  });

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<WorkoutFormData>({
    defaultValues: {
      id: generateUUID(),
      name: "New Workout",
      date: new Date().toISOString().split("T")[0],
      exercises: [],
      duration: 0,
      volume: 0,
    },
  });

  useEffect(() => {
    if (program) {
      const newExercises: WorkoutExercise[] = program.exercises.map(
        (programExercise) => {
          const sets: WorkoutSet[] = Array.from(
            { length: programExercise.sets },
            () => ({
              id: generateUUID(),
              reps: parseReps(programExercise.reps),
              weight: 0,
              completed: false,
            })
          );

          return {
            id: generateUUID(),
            name: programExercise.name,
            type: "strength", // Defaulting to strength
            muscleGroups: [], // Program exercises don't have muscle groups defined in this structure
            sets: sets,
          };
        }
      );

      reset({
        id: generateUUID(),
        name: `${program.title}`,
        date: new Date().toISOString().split("T")[0],
        exercises: newExercises,
        duration: 0,
        volume: 0,
      });
    }
  }, [program, reset]);

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "exercises",
  });

  const onSubmitHandler: SubmitHandler<WorkoutFormData> = (data) => {
    const workoutToSave: Workout = {
      ...data,
      duration: Math.round(
        (new Date().getTime() - workoutStartTime.getTime()) / 60000
      ),
      exercises: data.exercises.map((ex) => ({
        ...ex,
        sets: ex.sets.map((set) => ({
          ...set,
          weight: Number(set.weight),
          reps: Number(set.reps),
        })),
      })),
    };

    actions.addWorkout(workoutToSave);
    navigate("/analytics");
  };

  const addExercise = () => {
    append({
      id: generateUUID(),
      name: "New Exercise",
      type: "strength",
      sets: [],
      muscleGroups: [],
    });
  };

  const addSet = (exerciseIndex: number) => {
    const exercise = watch(`exercises.${exerciseIndex}`);
    const updatedSets = [
      ...exercise.sets,
      { id: generateUUID(), reps: 0, weight: 0, completed: false },
    ];
    update(exerciseIndex, { ...exercise, sets: updatedSets });
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const exercise = watch(`exercises.${exerciseIndex}`);
    const updatedSets = exercise.sets.filter((_, i) => i !== setIndex);
    update(exerciseIndex, { ...exercise, sets: updatedSets });
  };

  if (isProgramLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
        <p className="ml-4 text-brand-text-muted">Loading program...</p>
      </div>
    );
  }

  if (isProgramError) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl text-error font-semibold">
          Error Loading Program
        </h2>
        <p className="text-brand-text-muted mt-2">
          There was a problem fetching the program details.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-card p-4 rounded-lg shadow-lg"
      >
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              className="text-2xl font-bold bg-transparent border-b-2 border-brand-border focus:outline-none focus:border-brand-primary w-full"
            />
          )}
        />
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="date"
              className="mt-2 text-sm text-brand-text-muted bg-transparent focus:outline-none"
            />
          )}
        />
      </motion.div>

      <motion.div
        layout
        variants={exerciseListVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <AnimatePresence>
          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              layout="position"
              variants={exerciseItemVariants}
              className="bg-brand-card p-4 rounded-lg shadow-lg space-y-3 overflow-hidden"
            >
              <div className="flex justify-between items-center">
                <Controller
                  name={`exercises.${index}.name`}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      placeholder="Exercise Name"
                      className="font-semibold bg-transparent border-b border-brand-border focus:outline-none w-full"
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-400"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-4 gap-2 text-xs text-brand-text-muted">
                  <span>Set</span>
                  <span>Weight (kg)</span>
                  <span>Reps</span>
                  <span>Done</span>
                </div>
                {watch(`exercises.${index}.sets`).map((set, setIndex) => (
                  <div
                    key={set.id}
                    className="grid grid-cols-4 gap-2 items-center"
                  >
                    <span className="font-bold">{setIndex + 1}</span>
                    <Controller
                      name={`exercises.${index}.sets.${setIndex}.weight`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          className="bg-brand-secondary rounded p-1 w-full"
                        />
                      )}
                    />
                    <Controller
                      name={`exercises.${index}.sets.${setIndex}.reps`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          className="bg-brand-secondary rounded p-1 w-full"
                        />
                      )}
                    />
                    <Controller
                      name={`exercises.${index}.sets.${setIndex}.completed`}
                      control={control}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <input
                          type="checkbox"
                          onBlur={onBlur}
                          onChange={onChange}
                          checked={value}
                          ref={ref}
                          className="h-5 w-5 rounded bg-brand-secondary text-brand-primary focus:ring-brand-primary"
                        />
                      )}
                    />
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addSet(index)}
              >
                Add Set
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <Button
        type="button"
        onClick={addExercise}
        leftIcon={<PlusIcon className="w-5 h-5" />}
      >
        Add Exercise
      </Button>

      <div className="flex justify-end space-x-4 pt-4 border-t border-brand-border">
        <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Workout"}
        </Button>
      </div>
      {activeTimerExerciseIndex !== null && (
        <Timer
          durationSeconds={60}
          onComplete={() => setActiveTimerExerciseIndex(null)}
        />
      )}
    </form>
  );
};

export default WorkoutLogForm;
