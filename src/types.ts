// src/types.ts

// The type of exercise, determines which stats are relevant.
export type ExerciseType = "strength" | "cardio";

// Represents a single set of an exercise.
export interface Set {
  id: string; // Unique ID for the set
  reps: number; // Number of repetitions
  weight: number; // Weight used for the set
  completed: boolean; // Whether the set was completed
}

// Represents a single exercise within a workout.
export interface Exercise {
  id: string; // Unique ID for the exercise
  name: string; // Name of the exercise, e.g., "Bench Press"
  type: ExerciseType;
  sets: Set[]; // An array of sets for this exercise
  muscleGroups: string[]; // e.g., ['Chest', 'Triceps']
}

// Represents a single workout session.
export interface Workout {
  id: string; // Unique ID for the workout
  name: string; // e.g., "Push Day"
  date: string; // ISO 8601 date string
  exercises: Exercise[];
  duration: number; // Duration in minutes
  volume: number; // Total volume (sets * reps * weight)
}

// Represents a user's personal record for a specific exercise.
export interface PersonalRecord {
  exerciseName: string;
  // The highest estimated 1 Rep Max
  estimated1RM: {
    value: number;
    date: string;
  };
  // The heaviest weight lifted for a single rep
  highestWeight: {
    value: number;
    date: string;
  };
  // The most reps performed in a single set
  highestReps: {
    value: number;
    weight: number;
    date: string;
  };
  // The highest volume in a single set
  highestSetVolume: {
    value: number;
    date: string;
  };
}

// Defines the shape of the workout context state.
export interface WorkoutState {
  workouts: Workout[];
  personalRecords: { [exerciseName: string]: PersonalRecord };
  loading: boolean;
}

// Defines the actions available in the workout context.
export interface WorkoutContextActions {
  addWorkout: (workout: Workout) => void;
  updateWorkout: (workout: Workout) => void;
  deleteWorkout: (workoutId: string) => void;
  // This can be expanded with more actions as needed
}

// The complete shape of the WorkoutContext.
export interface WorkoutContextType extends WorkoutState {
  actions: WorkoutContextActions;
}
