// /src/types/data.ts

// This file is the single source of truth for our application's data shapes.
// It is imported by services, components, and pages.

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  heightCm?: number;
  goals?: {
    weightKg?: number;
  };
  initialSetupCompleted?: boolean;
}

export interface MasterExercise {
  id: string;
  name: string;
  category:
    | "Strength"
    | "Cardio"
    | "Stretching"
    | "Plyometrics"
    | "Mobility"
    | "Stability"
    | "Power";
  bodyPart:
    | "Chest"
    | "Back"
    | "Legs"
    | "Shoulders"
    | "Biceps"
    | "Triceps"
    | "Core"
    | "Full Body"
    | "Glutes"
    | "Arms";
  equipment: string[];
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weight: number;
}

export interface Program {
  id: string;
  title: string;
  description: string;
  exercises: Exercise[];
  // Note: This matches the `created_by` column from our Supabase table after mapping
  createdBy: string;
}

// A read-only template that users can import. It mirrors `Program` but omits `createdBy`.
export interface ProgramTemplate {
  id: string;
  title: string;
  description: string;
  exercises: Exercise[];
}

export interface CompletedSet {
  reps: number | null;
  weight: number | null;
  completed: boolean;
}

export interface CompletedExercise {
  exerciseId: string;
  exerciseName: string;
  sets: CompletedSet[];
}

export interface WorkoutLog {
  id: string;
  userId: string;
  date: string;
  programId: string;
  programTitle: string;
  durationMinutes?: number;
  caloriesBurned?: number;
  notes?: string;
  completedExercises: CompletedExercise[];
}

export interface BodyMetric {
  id: string;
  userId: string;
  date: string;
  weightKg: number;
  bmi?: number;
  bodyFatPercentage?: number;
}
