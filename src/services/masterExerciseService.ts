// /src/services/masterExerciseService.ts

import masterExerciseData from "../assets/data/master-exercises.json";
import { MasterExercise } from "../types/data"; // Import the type for type safety

/**
 * --- READ ---
 * Fetches the master list of exercises. In a real app, this could be
 * an API call. Here, it just returns our static JSON data.
 * The async/Promise is to simulate a real API call's asynchronous nature.
 */
export const getMasterExercises = async (): Promise<MasterExercise[]> => {
  // We wrap the synchronous import in a promise to simulate a network request.
  // This makes it compatible with TanStack Query's async `queryFn`.
  return new Promise((resolve) => {
    resolve(masterExerciseData as MasterExercise[]);
  });
};
