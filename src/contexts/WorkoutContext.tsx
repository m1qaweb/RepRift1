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

  // Load data from localStorage on initial render
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(WORKOUT_DATA_KEY);
      if (storedData) {
        const parsedData: WorkoutState = JSON.parse(storedData);
        setState({ ...parsedData, loading: false });
      } else {
        setState((s) => ({ ...s, loading: false }));
      }
    } catch (error) {
      console.error("Failed to load workout data from localStorage", error);
      setState((s) => ({ ...s, loading: false }));
    }
  }, []);

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    if (!state.loading) {
      localStorage.setItem(WORKOUT_DATA_KEY, JSON.stringify(state));
    }
  }, [state]);

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

  const addWorkout = useCallback(
    (newWorkout: Workout) => {
      // Recalculate total volume for the workout
      const totalVolume = newWorkout.exercises.reduce((total, exercise) => {
        return (
          total +
          exercise.sets.reduce((exTotal, set) => {
            return exTotal + (set.completed ? set.weight * set.reps : 0);
          }, 0)
        );
      }, 0);
      newWorkout.volume = totalVolume;

      const updatedWorkouts = [...state.workouts, newWorkout];
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
      const updatedWorkouts = state.workouts.map((w) =>
        w.id === updatedWorkout.id ? updatedWorkout : w
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
