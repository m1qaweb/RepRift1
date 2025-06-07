// /src/services/workoutLogService.ts

import { supabase } from "../supabaseClient";
import { WorkoutLog } from "../types/data"; // Reuse the type definition

/**
 * --- READ ---
 * Fetches all workout logs for the currently logged-in user.
 * The RLS policy on the `workout_logs` table ensures a user can only see their own logs.
 */
export const getWorkoutLogs = async (): Promise<WorkoutLog[]> => {
  const { data, error } = await supabase
    .from("workout_logs")
    .select("*")
    .order("date", { ascending: false }); // Show most recent logs first

  if (error) {
    console.error("Error fetching workout logs:", error.message);
    throw error;
  }

  // Map snake_case columns from the database to our camelCase interface if needed.
  const mappedData = data.map((log) => ({
    ...log,
    userId: log.user_id,
    programId: log.program_id,
    programTitle: log.program_title,
    durationMinutes: log.duration_minutes,
    caloriesBurned: log.calories_burned,
    completedExercises: log.completed_exercises,
  })) as WorkoutLog[];

  return mappedData || [];
};

/**
 * --- CREATE ---
 * Saves a new, completed workout log.
 * @param logData - The workout log object to save. It should not have an 'id'.
 */
export const saveWorkoutLog = async (
  logData: Omit<WorkoutLog, "id">
): Promise<WorkoutLog> => {
  // First, let's get the user ID to ensure we're saving for the correct person.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("You must be logged in to save a workout log.");
  }

  // Prepare the data to match our database columns (snake_case)
  const logRow = {
    user_id: logData.userId,
    program_id: logData.programId,
    program_title: logData.programTitle,
    date: logData.date,
    duration_minutes: logData.durationMinutes,
    calories_burned: logData.caloriesBurned,
    notes: logData.notes,
    completed_exercises: logData.completedExercises,
  };

  const { data: savedLog, error } = await supabase
    .from("workout_logs")
    .insert(logRow)
    .select()
    .single(); // Return the newly created log from the database

  if (error) {
    console.error("Error saving workout log:", error.message);
    throw error;
  }
  if (!savedLog) {
    throw new Error("Save operation did not return the workout log data.");
  }

  // Map the returned database row back to our frontend type definition
  return {
    ...savedLog,
    userId: savedLog.user_id,
    programId: savedLog.program_id,
    programTitle: savedLog.program_title,
    durationMinutes: savedLog.duration_minutes,
    caloriesBurned: savedLog.calories_burned,
    completedExercises: savedLog.completed_exercises,
  } as WorkoutLog;
};
