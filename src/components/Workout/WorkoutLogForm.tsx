// /src/components/Workout/WorkoutLogForm.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import {
  Program,
  WorkoutLog,
  fetchProgramById,
  saveWorkoutLog,
} from "../../utils/fakeApi";
import Button from "../UI/Button";
import ExerciseLogRow from "./ExerciseLogRow";
import Timer from "./Timer";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { formatDate } from "../../utils/dateUtils";
import Spinner from "../UI/Spinner";

interface WorkoutLogFormProps {}

type LoggedSet = {
  reps: number | null;
  weight: number | null;
  completed: boolean;
};

type LoggedExercise = {
  exerciseId: string;
  exerciseName: string;
  targetSets: number;
  targetReps: string;
  sets: LoggedSet[];
};

type WorkoutFormInputs = {
  programId: string;
  programTitle: string;
  date: string;
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
            const initialLoggedExercises = prog.exercises.map((ex) => ({
              exerciseId: ex.id,
              exerciseName: ex.name,
              targetSets: ex.sets,
              targetReps: ex.reps,
              sets: Array(ex.sets)
                .fill(null)
                .map(() => ({ reps: null, weight: null, completed: false })),
            }));
            reset({
              programId: prog.id,
              programTitle: prog.title,
              date: preSelectedDate,
              loggedExercises: initialLoggedExercises,
              notes: "",
            });
          } else {
            setSelectedProgram(null);
            reset({
              programId: watchedProgramId,
              programTitle: "Program not found",
              date: preSelectedDate,
              loggedExercises: [],
              notes: "",
            });
          }
        })
        .catch(console.error)
        .finally(() => setIsLoadingProgram(false));
    } else {
      setSelectedProgram(null);
      reset({
        programId: "",
        programTitle: "",
        date: preSelectedDate,
        loggedExercises: [],
        notes: "",
      });
    }
  }, [watchedProgramId, reset, preSelectedDate]);

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
    const currentExercise = watchedLoggedExercises[exerciseIndex];
    const updatedSets = currentExercise.sets.map((s, idx) =>
      idx === setIndex
        ? {
            ...s,
            [field]:
              (field === "reps" || field === "weight") &&
              typeof value === "string"
                ? value === ""
                  ? null
                  : parseFloat(value)
                : value,
          }
        : s
    );
    update(exerciseIndex, { ...currentExercise, sets: updatedSets });
  };

  const handleTimerStart = (exerciseIndex: number) => {
    const currentExerciseInProgram = selectedProgram?.exercises.find(
      (ex) => ex.id === watchedLoggedExercises[exerciseIndex]?.exerciseId
    );
    if (currentExerciseInProgram?.restInterval) {
      setActiveTimerExerciseIndex(exerciseIndex);
    }
  };

  const handleTimerComplete = () => {
    setActiveTimerExerciseIndex(null);
  };

  if (!preSelectedProgramId) {
    return (
      <div className="p-6 bg-brand-card rounded-lg shadow-md text-center text-brand-text">
        <p className="mb-4">Please select a program to log a workout.</p>
        <Link to="/programs">
          <Button variant="primary">Select Program</Button>
        </Link>
      </div>
    );
  }

  if (isLoadingProgram) {
    return (
      <div className="p-6 text-center flex flex-col items-center justify-center h-64 text-brand-text">
        <Spinner size="lg" className="mb-4" />
        Loading program details...
      </div>
    );
  }

  if (!selectedProgram && !isLoadingProgram && watchedProgramId) {
    return (
      <div className="p-6 text-center text-error">
        {" "}
        Program not found.{" "}
        <Link to="/programs" className="underline hover:text-brand-primary">
          Select another program.
        </Link>
      </div>
    );
  }

  if (!selectedProgram) {
    return (
      <div className="p-6 text-center flex flex-col items-center justify-center h-64 text-brand-text">
        <Spinner size="lg" className="mb-4" />
        Initializing program...
      </div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmitHandler)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 md:p-6 space-y-6 bg-brand-card rounded-lg shadow-xl"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-brand-text">
            {selectedProgram?.title || "Log Workout"}
          </h2>
          <p className="text-sm text-brand-text-muted">
            Using program: {selectedProgram?.title || "N/A"}
          </p>
        </div>
        <input
          type="date"
          {...register("date", { required: "Date is required" })}
          defaultValue={preSelectedDate}
          className="px-3 py-2 border border-brand-border rounded-md bg-transparent text-brand-text focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
        />
      </div>
      {errors.date && (
        <p className="text-xs text-error">{errors.date.message}</p>
      )}

      <input type="hidden" {...register("programId")} />
      <input type="hidden" {...register("programTitle")} />

      {fields.length > 0 ? (
        <div className="space-y-8">
          {fields.map((field, exerciseIndex) => (
            <div key={field.id}>
              <ExerciseLogRow
                exercise={
                  selectedProgram!.exercises.find(
                    (ex) => ex.id === field.exerciseId
                  )!
                }
                loggedSets={field.sets}
                onSetChange={(setIndex, setField, value) =>
                  handleSetChange(exerciseIndex, setIndex, setField, value)
                }
                onTimerStart={() => handleTimerStart(exerciseIndex)}
                isTimerActive={activeTimerExerciseIndex === exerciseIndex}
              />
              {activeTimerExerciseIndex === exerciseIndex &&
                selectedProgram && (
                  <div className="mt-6 flex justify-center">
                    <Timer
                      durationSeconds={
                        selectedProgram.exercises.find(
                          (ex) => ex.id === field.exerciseId
                        )?.restInterval || 60
                      }
                      onComplete={handleTimerComplete}
                      size={80}
                      className="my-2"
                    />
                  </div>
                )}
            </div>
          ))}
        </div>
      ) : (
        !isLoadingProgram && (
          <p className="text-brand-text-muted text-center py-6">
            No exercises found for this program, or program is still loading.
          </p>
        )
      )}

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-brand-text"
        >
          Workout Notes
        </label>
        <textarea
          id="notes"
          rows={3}
          {...register("notes")}
          className="mt-1 block w-full px-3 py-2 border border-brand-border rounded-md shadow-sm bg-transparent text-brand-text focus:ring-1 focus:ring-brand-primary focus:border-brand-primary placeholder-brand-text-muted/70"
          placeholder="Any comments about your workout, how you felt, PBs, etc."
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-brand-border">
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
