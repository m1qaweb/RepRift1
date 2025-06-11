import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  Workout,
  PersonalRecord,
  WorkoutContextType,
  WorkoutState,
} from "../types"; // <-- Updated import

const WORKOUT_DATA_KEY = "workoutHistory";

// A robust function to sanitize the entire workouts array
const sanitizeWorkouts = (workouts: Workout[]): Workout[] => {
  return (workouts || []).map((workout) => {
    const sanitizedExercises = (workout.exercises || []).map((exercise) => {
      const sanitizedSets = (exercise.sets || []).map((set) => ({
        ...set,
        weight: set.weight ?? 0,
        reps: set.reps ?? 0,
        completed: set.completed ?? false,
      }));

      return {
        ...exercise,
        sets: sanitizedSets,
      };
    });

    const calculatedVolume = sanitizedExercises.reduce((total, exercise) => {
      return (
        total +
        exercise.sets.reduce((exTotal, set) => {
          return (
            exTotal + (set.completed ? (set.weight ?? 0) * (set.reps ?? 0) : 0)
          );
        }, 0)
      );
    }, 0);

    return {
      ...workout,
      volume: !isNaN(calculatedVolume) ? calculatedVolume : 0,
      duration: workout.duration ?? 0,
      exercises: sanitizedExercises,
    };
  });
};

// Epley formula for estimating 1 Rep Max
const calculateEpley1RM = (weight: number, reps: number): number => {
  if (reps === 1) return weight;
  if (reps === 0) return 0;
  return weight * (1 + reps / 30);
};

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error("useWorkout must be used within a WorkoutProvider");
  }
  return context;
};

interface WorkoutProviderProps {
  children: ReactNode;
}

export const WorkoutProvider: React.FC<WorkoutProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState<WorkoutState>({
    workouts: [],
    personalRecords: {},
    loading: true,
  });

  const calculateAllStats = useCallback(
    (workouts: Workout[]): { [key: string]: PersonalRecord } => {
      const allPrs: { [key: string]: PersonalRecord } = {};

      workouts.forEach((workout) => {
        workout.exercises.forEach((exercise) => {
          if (!allPrs[exercise.name]) {
            // Initialize PR for this exercise
            allPrs[exercise.name] = {
              exerciseName: exercise.name,
              estimated1RM: { value: 0, date: "" },
              highestWeight: { value: 0, date: "" },
              highestReps: { value: 0, weight: 0, date: "" },
              highestSetVolume: { value: 0, date: "" },
            };
          }

          const currentPr = allPrs[exercise.name];

          exercise.sets.forEach((set) => {
            if (!set.completed) return;

            // Check for e1RM PR
            const e1RM = calculateEpley1RM(set.weight, set.reps);
            if (e1RM > currentPr.estimated1RM.value) {
              currentPr.estimated1RM = { value: e1RM, date: workout.date };
            }

            // Check for highest weight PR
            if (set.weight > currentPr.highestWeight.value) {
              currentPr.highestWeight = {
                value: set.weight,
                date: workout.date,
              };
            }

            // Check for highest reps PR
            if (set.reps > currentPr.highestReps.value) {
              currentPr.highestReps = {
                value: set.reps,
                weight: set.weight,
                date: workout.date,
              };
            }

            // Check for highest set volume PR
            const setVolume = set.reps * set.weight;
            if (setVolume > currentPr.highestSetVolume.value) {
              currentPr.highestSetVolume = {
                value: setVolume,
                date: workout.date,
              };
            }
          });
        });
      });
      return allPrs;
    },
    []
  );

  // Load data from localStorage on initial render
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(WORKOUT_DATA_KEY);
      if (storedData) {
        const parsedData: WorkoutState = JSON.parse(storedData);
        // Sanitize data on load
        const sanitized = sanitizeWorkouts(parsedData.workouts || []);
        const newPrs = calculateAllStats(sanitized);
        setState({
          workouts: sanitized,
          personalRecords: newPrs,
          loading: false,
        });
      } else {
        setState((s) => ({ ...s, loading: false }));
      }
    } catch (error) {
      console.error("Failed to load workout data from localStorage", error);
      setState((s) => ({ ...s, loading: false }));
    }
  }, [calculateAllStats]);

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    if (!state.loading) {
      localStorage.setItem(WORKOUT_DATA_KEY, JSON.stringify(state));
    }
  }, [state]);

  const addWorkout = useCallback(
    (newWorkout: Workout) => {
      // Sanitize the new workout before doing anything else
      const [sanitizedWorkout] = sanitizeWorkouts([newWorkout]);

      const updatedWorkouts = [...state.workouts, sanitizedWorkout];
      const newPrs = calculateAllStats(updatedWorkouts);

      setState({
        loading: false,
        workouts: updatedWorkouts,
        personalRecords: newPrs,
      });
    },
    [state.workouts, calculateAllStats]
  );

  const updateWorkout = useCallback(
    (updatedWorkout: Workout) => {
      // Sanitize the updated workout
      const [sanitizedWorkout] = sanitizeWorkouts([updatedWorkout]);

      const updatedWorkouts = state.workouts.map((w) =>
        w.id === sanitizedWorkout.id ? sanitizedWorkout : w
      );
      const newPrs = calculateAllStats(updatedWorkouts);
      setState({
        loading: false,
        workouts: updatedWorkouts,
        personalRecords: newPrs,
      });
    },
    [state.workouts, calculateAllStats]
  );

  const deleteWorkout = useCallback(
    (workoutId: string) => {
      const updatedWorkouts = state.workouts.filter((w) => w.id !== workoutId);
      const newPrs = calculateAllStats(updatedWorkouts);
      setState({
        loading: false,
        workouts: updatedWorkouts,
        personalRecords: newPrs,
      });
    },
    [state.workouts, calculateAllStats]
  );

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      ...state,
      actions: {
        addWorkout,
        updateWorkout,
        deleteWorkout,
      },
    }),
    [state, addWorkout, updateWorkout, deleteWorkout]
  );

  return (
    <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>
  );
};
