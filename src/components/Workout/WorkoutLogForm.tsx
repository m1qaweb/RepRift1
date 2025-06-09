// /src/components/Workout/WorkoutLogForm.tsx
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import {
  Program,
  WorkoutLog,
  MasterExercise,
  Exercise,
  CompletedSet,
  CompletedExercise,
} from "../../types/data";
import { getProgramById } from "../../services/programService";
import { saveWorkoutLog } from "../../services/workoutLogService";
import Button from "../UI/Button";
import ExerciseLogRow from "./ExerciseLogRow";
import Timer from "./Timer";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { formatDate } from "../../utils/dateUtils";
import Spinner from "../UI/Spinner";
import { useAuth } from "../../contexts/AuthContext";
import { useWorkout } from "../../contexts/WorkoutContext";
import { getMasterExercises } from "../../services/masterExerciseService";
import { generateUUID } from "../../utils/uuid";
import {
  DocumentTextIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/outline";

interface WorkoutLogFormProps {}

type LoggedSet = {
  id: string;
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

type WorkoutFormData = {
  programId: string;
  programTitle: string;
  date: string;
  loggedExercises: LoggedExercise[];
  notes?: string;
};

const WorkoutLogForm: React.FC<WorkoutLogFormProps> = () => {
  const { user } = useAuth();
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

  const workoutStartTime = useMemo(() => new Date(), []);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
    getValues,
  } = useForm<WorkoutFormData>({
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
  const { addExercisedMuscleGroup } = useWorkout();

  useEffect(() => {
    if (watchedProgramId) {
      setIsLoadingProgram(true);
      getProgramById(watchedProgramId)
        .then((prog) => {
          if (prog) {
            setSelectedProgram(prog);
            const initialLoggedExercises = prog.exercises.map(
              (ex: Exercise) => ({
                exerciseId: ex.id,
                exerciseName: ex.name,
                targetSets: ex.sets,
                targetReps: ex.reps,
                sets: Array(ex.sets)
                  .fill(null)
                  .map(() => ({
                    id: generateUUID(),
                    reps: null,
                    weight: null,
                    completed: false,
                  })),
              })
            );
            reset({
              programId: prog.id,
              programTitle: prog.title,
              date: preSelectedDate,
              loggedExercises: initialLoggedExercises,
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

  const onSubmitHandler: SubmitHandler<WorkoutFormData> = async (data) => {
    if (!user) {
      console.error("Cannot log workout, no user is logged in.");
      return;
    }

    const totalVolume = data.loggedExercises.reduce(
      (sum, le) =>
        sum +
        le.sets.reduce(
          (setSum, s) => setSum + (s.reps || 0) * (s.weight || 0),
          0
        ),
      0
    );

    const workoutLogToSave: Omit<WorkoutLog, "id"> = {
      userId: user.id,
      programId: data.programId,
      programTitle: data.programTitle,
      date: data.date,
      durationMinutes: Math.round(
        (new Date().getTime() - workoutStartTime.getTime()) / 60000
      ),
      caloriesBurned: Math.round(totalVolume * 0.05),
      notes: data.notes,
      completedExercises: data.loggedExercises.map(
        (le): CompletedExercise => ({
          exerciseId: le.exerciseId,
          exerciseName: le.exerciseName,
          sets: le.sets.map(
            (s): CompletedSet => ({
              reps: s.reps === null ? 0 : Number(s.reps),
              weight: s.weight === null ? 0 : Number(s.weight),
              completed: s.completed,
            })
          ),
        })
      ),
    };

    try {
      const savedLog = await saveWorkoutLog(workoutLogToSave);

      const masterExercises: MasterExercise[] = await getMasterExercises();
      const exerciseIdToBodyPart = new Map<string, string>(
        masterExercises.map((ex: MasterExercise) => [ex.id, ex.bodyPart])
      );

      const bodyPartToUIGroupMap: { [key: string]: string[] } = {
        Arms: ["Biceps", "Triceps"],
        "Full Body": ["Chest", "Back", "Legs", "Core", "Shoulders"],
      };

      data.loggedExercises.forEach((le) => {
        const bodyPart = exerciseIdToBodyPart.get(le.exerciseId);
        if (bodyPart) {
          if (bodyPartToUIGroupMap[bodyPart]) {
            bodyPartToUIGroupMap[bodyPart].forEach((group) => {
              addExercisedMuscleGroup(group);
            });
          } else {
            addExercisedMuscleGroup(bodyPart);
          }
        }
      });

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
    const loggedExercises = getValues("loggedExercises");
    const updatedExercise = { ...loggedExercises[exerciseIndex] };
    const updatedSet = { ...updatedExercise.sets[setIndex] };

    let processedValue: number | boolean | null = null;
    if (field === "reps" || field === "weight") {
      const numValue = parseFloat(value as string);
      processedValue = isNaN(numValue) ? null : numValue;
    } else if (field === "completed") {
      processedValue = Boolean(value);
    }

    (updatedSet[field] as any) = processedValue;
    updatedExercise.sets[setIndex] = updatedSet;
    update(exerciseIndex, updatedExercise);
  };

  const addSet = (exerciseIndex: number) => {
    const loggedExercises = getValues("loggedExercises");
    const updatedExercise = { ...loggedExercises[exerciseIndex] };
    updatedExercise.sets.push({
      id: generateUUID(),
      reps: null,
      weight: null,
      completed: false,
    });
    update(exerciseIndex, updatedExercise);
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const loggedExercises = getValues("loggedExercises");
    const updatedExercise = { ...loggedExercises[exerciseIndex] };
    updatedExercise.sets.splice(setIndex, 1);
    update(exerciseIndex, updatedExercise);
  };

  const handleTimerStart = (duration: number) => {
    setActiveTimerExerciseIndex(duration);
  };

  const handleTimerComplete = () => {
    setActiveTimerExerciseIndex(null);
  };

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  if (isLoadingProgram) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (!preSelectedProgramId) {
    return (
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="p-6 bg-brand-card/80 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg text-center text-brand-text max-w-md mx-auto"
      >
        <motion.p variants={itemVariants} className="mb-4 text-lg">
          Please select a program to log a workout.
        </motion.p>
        <motion.div variants={itemVariants}>
          <Button
            as={Link}
            to="/programs"
            variant="primary"
            className="text-brand-primary hover:underline"
          >
            Go to Programs
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto"
    >
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row justify-between sm:items-center mb-8"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-text tracking-tight">
              Log Workout
            </h1>
            <div className="flex items-center gap-4 mt-2 text-brand-text-muted">
              <div className="flex items-center gap-1.5">
                <DocumentTextIcon className="h-5 w-5" />
                <span className="font-medium">
                  {selectedProgram?.title || "Custom Workout"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <CalendarDaysIcon className="h-5 w-5" />
                <span className="font-medium">
                  {formatDate(new Date(preSelectedDate), "EEEE, d MMMM")}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {fields.length > 0 && (
          <motion.div
            className="space-y-4"
            variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
            initial="hidden"
            animate="visible"
          >
            {fields.map((field, index) => {
              const exerciseData = selectedProgram?.exercises.find(
                (ex) => ex.id === field.exerciseId
              );
              if (!exerciseData) return null;

              return (
                <ExerciseLogRow
                  key={field.id}
                  exercise={exerciseData}
                  loggedSets={watchedLoggedExercises[index].sets}
                  onSetChange={(setIndex, fieldName, value) =>
                    handleSetChange(index, setIndex, fieldName, value)
                  }
                  onTimerStart={() =>
                    handleTimerStart(exerciseData.restInterval)
                  }
                  isTimerActive={
                    activeTimerExerciseIndex === exerciseData.restInterval
                  }
                  onAddSet={() => addSet(index)}
                  onRemoveSet={(setIndex) => removeSet(index, setIndex)}
                />
              );
            })}
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="mt-8">
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-brand-text-muted mb-2"
          >
            Workout Notes
          </label>
          <textarea
            id="notes"
            {...register("notes")}
            rows={4}
            className="w-full bg-brand-card/50 backdrop-blur-sm border-2 border-white/10 rounded-lg p-3 focus:ring-brand-primary focus:border-brand-primary transition-colors placeholder:text-brand-text-muted/60"
            placeholder="How did the workout feel? Any PRs?"
          ></textarea>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-8 flex justify-end space-x-4"
        >
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
            leftIcon={<ArrowUturnLeftIcon className="h-5 w-5" />}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            leftIcon={
              isSubmitting ? null : <CheckCircleIcon className="h-5 w-5" />
            }
            className="min-w-[200px]"
          >
            {isSubmitting ? <Spinner size="sm" /> : "Finish & Save Workout"}
          </Button>
        </motion.div>
      </form>
      {activeTimerExerciseIndex !== null && (
        <Timer
          durationSeconds={activeTimerExerciseIndex}
          onComplete={handleTimerComplete}
        />
      )}
    </motion.div>
  );
};

export default WorkoutLogForm;
