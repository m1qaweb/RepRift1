import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

const LOCAL_STORAGE_KEY = "exercisedMuscleGroups";
const TWENTY_FOUR_HOURS_IN_MS = 24 * 60 * 60 * 1000;

interface ExercisedMuscleEntry {
  group: string;
  timestamp: number;
}

interface WorkoutContextType {
  exercisedMuscleGroups: string[];
  addExercisedMuscleGroup: (group: string) => void;
  clearExercisedMuscleGroups: () => void;
}

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
  const [exercisedMuscles, setExercisedMuscles] = useState<
    ExercisedMuscleEntry[]
  >([]);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedData) {
        const parsedData: ExercisedMuscleEntry[] = JSON.parse(storedData);
        const now = Date.now();

        const recentMuscles = parsedData.filter(
          (entry) => now - entry.timestamp < TWENTY_FOUR_HOURS_IN_MS
        );

        setExercisedMuscles(recentMuscles);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(recentMuscles));
      }
    } catch (error) {
      console.error(
        "Failed to load or parse exercised muscle data from localStorage",
        error
      );
      setExercisedMuscles([]);
    }
  }, []);

  const addExercisedMuscleGroup = (group: string) => {
    setExercisedMuscles((prevMuscles) => {
      const now = Date.now();
      const newEntry: ExercisedMuscleEntry = { group, timestamp: now };

      // Remove any existing entry for the same group to update its timestamp
      const otherMuscles = prevMuscles.filter((entry) => entry.group !== group);
      const updatedMuscles = [...otherMuscles, newEntry];

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedMuscles));
      return updatedMuscles;
    });
  };

  const clearExercisedMuscleGroups = () => {
    setExercisedMuscles([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const value = {
    exercisedMuscleGroups: exercisedMuscles.map((e) => e.group),
    addExercisedMuscleGroup,
    clearExercisedMuscleGroups,
  };

  return (
    <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>
  );
};
