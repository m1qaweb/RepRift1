// /src/services/bodyMetricService.ts (FULLY CORRECTED AND ROBUST)

import { supabase } from "../supabaseClient";
import { BodyMetric } from "../types/data"; // Import our app's type definition

// --- READ ---
/**
 * Fetches all body metrics for the currently logged-in user.
 * RLS in the database ensures the user only gets their own data.
 */
export const getBodyMetrics = async (): Promise<BodyMetric[]> => {
  const { data: rawData, error } = await supabase
    .from("body_metrics")
    .select("*")
    .order("date", { ascending: true }); // Order by date for trend calculation

  if (error) {
    console.error("Error fetching body metrics:", error.message);
    throw error;
  }

  if (!rawData) {
    return [];
  }

  // ENHANCEMENT: Explicitly map the snake_case data from the database
  // to our app's camelCase BodyMetric interface.
  const mappedData: BodyMetric[] = rawData.map((metric) => ({
    id: metric.id,
    userId: metric.user_id,
    date: metric.date,
    weightKg: metric.weight_kg,
    bmi: metric.bmi,
    bodyFatPercentage: metric.body_fat_percentage,
  }));

  return mappedData;
};

// --- CREATE ---
/**
 * Saves a new body metric entry.
 * @param metricData - The new metric data from our app, using camelCase.
 */
export const saveBodyMetric = async (
  metricData: Omit<BodyMetric, "id">
): Promise<BodyMetric> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("You must be logged in to save a body metric.");
  }

  // THE FIX: Create a new object for insertion that maps our app's
  // camelCase properties to the database's snake_case columns.
  const metricRowToInsert = {
    user_id: metricData.userId, // Maps `userId` to `user_id`
    date: metricData.date,
    weight_kg: metricData.weightKg, // Maps `weightKg` to `weight_kg`
    bmi: metricData.bmi,
    body_fat_percentage: metricData.bodyFatPercentage, // Maps `bodyFatPercentage`
  };

  const { data: savedMetric, error } = await supabase
    .from("body_metrics")
    .insert(metricRowToInsert)
    .select()
    .single(); // Return the newly created row.

  if (error) {
    console.error("Error saving body metric:", error.message);
    throw error;
  }
  if (!savedMetric) {
    throw new Error("Save operation did not return the expected metric data.");
  }

  // Also map the response back for consistency.
  const finalMetric: BodyMetric = {
    id: savedMetric.id,
    userId: savedMetric.user_id,
    date: savedMetric.date,
    weightKg: savedMetric.weight_kg,
    bmi: savedMetric.bmi,
    bodyFatPercentage: savedMetric.body_fat_percentage,
  };

  return finalMetric;
};
