// /src/components/Workout/WorkoutLogForm.tsx – Form for logging a workout.
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import {
  Program,
  // UPDATED: Removed Exercise from this import
  WorkoutLog,
  fetchProgramById,
  saveWorkoutLog,
} from "../../utils/fakeApi";
import Button from "../UI/Button";
import ExerciseLogRow from "./ExerciseLogRow"; // Component for individual exercise log rows
import Timer from "./Timer"; // The Timer component
import { useLocation, useNavigate, Link } from "react-router-dom"; // For query params
import { formatDate } from "../../utils/dateUtils";

interface WorkoutLogFormProps {
  // Potentially pre-filled programId or date via route/props
}

type LoggedSet = {
  reps: number | null;
  weight: number | null;
  completed: boolean;
};

type LoggedExercise = {
  exerciseId: string;
  exerciseName: string; // Denormalized
  targetSets: number;
  targetReps: string;
  sets: LoggedSet[];
};

type WorkoutFormInputs = {
  programId: string;
  programTitle: string;
  date: string; // YYYY-MM-DD
  loggedExercises: LoggedExercise[];
  notes?: string;
};

const WorkoutLogForm: React.FC<WorkoutLogFormProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const preSelectedProgramId = queryParams.get("programId");
  const preSelectedDate =
    queryParams.get("date") || formatDate(new Date(), "yyyy-MM-dd");

  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isLoadingProgram, setIsLoadingProgram] = useState(false);
  const [activeTimerExerciseIndex, setActiveTimerExerciseIndex] = useState<
    number | null
  >(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<WorkoutFormInputs>({
    defaultValues: {
      programId: preSelectedProgramId || "",
      programTitle: "",
      date: preSelectedDate,
      loggedExercises: [],
      notes: "",
    },
  });

  // UPDATED: Removed append and remove from destructuring
  const { fields, update } = useFieldArray({
    control,
    name: "loggedExercises",
  });

  const watchedProgramId = watch("programId");
  const watchedLoggedExercises = watch("loggedExercises");

  useEffect(() => {
    if (watchedProgramId) {
      setIsLoadingProgram(true);
      fetchProgramById(watchedProgramId)
        .then((prog) => {
          if (prog) {
            setSelectedProgram(prog);
            setValue("programTitle", prog.title);
            const initialLoggedExercises = prog.exercises.map((ex) => ({
              exerciseId: ex.id,
              exerciseName: ex.name,
              targetSets: ex.sets,
              targetReps: ex.reps,
              sets: Array(ex.sets)
                .fill(null)
                .map(() => ({ reps: null, weight: null, completed: false })),
            }));
            reset((currentValues) => ({
              ...currentValues,
              programId: prog.id,
              programTitle: prog.title,
              loggedExercises: initialLoggedExercises,
            }));
          } else {
            setSelectedProgram(null);
            setValue("programTitle", "Program not found");
            setValue("loggedExercises", []);
          }
        })
        .catch(console.error)
        .finally(() => setIsLoadingProgram(false));
    } else {
      setSelectedProgram(null);
      setValue("programTitle", "");
      setValue("loggedExercises", []);
    }
  }, [watchedProgramId, setValue, reset]);

  useEffect(() => {
    if (preSelectedProgramId && !watchedProgramId) {
      setValue("programId", preSelectedProgramId);
    }
  }, [preSelectedProgramId, setValue, watchedProgramId]); // Added watchedProgramId to deps of this useEffect

  const onSubmitHandler: SubmitHandler<WorkoutFormInputs> = async (data) => {
    const workoutLogToSave: Omit<
      WorkoutLog,
      "id" | "durationMinutes" | "caloriesBurned"
    > = {
      programId: data.programId,
      programTitle: data.programTitle,
      date: data.date,
      notes: data.notes,
      completedExercises: data.loggedExercises.map((le) => ({
        exerciseId: le.exerciseId,
        exerciseName: le.exerciseName,
        sets: le.sets.map((s) => ({
          reps: s.reps === null || s.reps === undefined ? null : Number(s.reps),
          weight:
            s.weight === null || s.weight === undefined
              ? null
              : Number(s.weight),
          completed: s.completed,
        })),
      })),
    };
    try {
      const savedLog = await saveWorkoutLog(workoutLogToSave);
      console.log("Workout logged:", savedLog);
      navigate(`/history?highlight=${savedLog.date}`);
    } catch (error) {
      console.error("Failed to log workout:", error);
    }
  };

  const handleSetChange = (
    exerciseIndex: number,
    setIndex: number,
    field: keyof LoggedSet,
    value: string | number | boolean
  ) => {
    const updatedLoggedExercises = [...watchedLoggedExercises]; // Create a new array instance
    const exercise = { ...updatedLoggedExercises[exerciseIndex] }; // Create a new exercise object instance
    const newSets = [...exercise.sets]; // Create a new sets array instance
    newSets[setIndex] = {
      ...newSets[setIndex],
      [field]:
        (field === "reps" || field === "weight") && typeof value === "string"
          ? value === ""
            ? null
            : parseFloat(value)
          : value,
    }; // Create a new set object instance

    exercise.sets = newSets;
    updatedLoggedExercises[exerciseIndex] = exercise;

    // Instead of setValue for the whole array which might have issues with deep updates for RHF,
    // use the `update` function from useFieldArray.
    update(exerciseIndex, exercise);
  };

  const handleTimerStart = (exerciseIndex: number, durationSeconds: number) => {
    const exerciseToFind = watchedLoggedExercises[exerciseIndex];
    if (exerciseToFind) {
      const restInterval = selectedProgram?.exercises.find(
        (ex) => ex.id === exerciseToFind.exerciseId
      )?.restInterval;
      if (restInterval) {
        setActiveTimerExerciseIndex(exerciseIndex);
      }
    }
  };

  const handleTimerComplete = () => {
    setActiveTimerExerciseIndex(null);
  };

  if (!preSelectedProgramId) {
    return (
      <div className="p-6 bg-light-card dark:bg-dark-card rounded-lg shadow-md text-center">
        <p className="mb-4">Please select a program to log a workout.</p>
        <Link to="/programs">
          <Button variant="primary">Select Program</Button>
        </Link>
      </div>
    );
  }

  if (isLoadingProgram) {
    return <div className="p-6 text-center">Loading program details...</div>;
  }

  if (!selectedProgram && !isLoadingProgram && watchedProgramId) {
    return (
      <div className="p-6 text-center text-red-500">
        Program not found.{" "}
        <Link to="/programs" className="underline">
          Select another program.
        </Link>
      </div>
    );
  }

  if (!selectedProgram && !watchedProgramId) {
    return <div className="p-6 text-center">Initializing...</div>;
  }

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmitHandler)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 md:p-6 space-y-6 bg-light-card dark:bg-dark-card rounded-lg shadow-md"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text">
            {selectedProgram?.title || "Log Workout"}
          </h2>
          <p className="text-sm text-light-secondary dark:text-dark-secondary">
            For program: {selectedProgram?.title || "N/A"}
          </p>
        </div>
        <input
          type="date"
          {...register("date", { required: "Date is required" })}
          defaultValue={preSelectedDate}
          className="px-3 py-2 border rounded-md bg-transparent border-gray-300 dark:border-gray-600 focus:border-light-primary dark:focus:border-dark-primary"
        />
      </div>
      {errors.date && (
        <p className="text-xs text-red-500">{errors.date.message}</p>
      )}

      <input type="hidden" {...register("programId")} />
      <input type="hidden" {...register("programTitle")} />

      {fields.length > 0 ? (
        <div className="space-y-8">
          {fields.map((field, exerciseIndex) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: exerciseIndex * 0.1 }}
            >
              <ExerciseLogRow
                exercise={
                  selectedProgram!.exercises.find(
                    (ex) => ex.id === field.exerciseId
                  )!
                }
                loggedSets={field.sets} // Pass the field.sets directly from RHF's fields array
                onSetChange={(setIndex, setField, value) =>
                  handleSetChange(exerciseIndex, setIndex, setField, value)
                }
                onTimerStart={(duration) =>
                  handleTimerStart(exerciseIndex, duration)
                }
                isTimerActive={activeTimerExerciseIndex === exerciseIndex}
              />
              {activeTimerExerciseIndex === exerciseIndex &&
                selectedProgram && (
                  <div className="mt-4 flex justify-center">
                    <Timer
                      durationSeconds={
                        selectedProgram.exercises.find(
                          (ex) => ex.id === field.exerciseId
                        )?.restInterval || 60
                      }
                      onComplete={handleTimerComplete}
                      size={80}
                    />
                  </div>
                )}
            </motion.div>
          ))}
        </div>
      ) : (
        !isLoadingProgram && (
          <p className="text-light-secondary dark:text-dark-secondary text-center py-6">
            No exercises in this program, or program not loaded.
          </p>
        )
      )}

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-light-text dark:text-dark-text"
        >
          Workout Notes
        </label>
        <textarea
          id="notes"
          rows={3}
          {...register("notes")}
          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-transparent border-gray-300 dark:border-gray-600 focus:border-light-primary dark:focus:border-dark-primary"
          placeholder="Any comments about your workout, how you felt, etc."
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-light-border dark:border-dark-border">
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate("/dashboard")}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          Finish & Save Workout
        </Button>
      </div>
    </motion.form>
  );
};

export default WorkoutLogForm;
