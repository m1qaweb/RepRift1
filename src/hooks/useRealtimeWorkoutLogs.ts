import { useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import { WorkoutLog } from "../types/data";

/**
 * Subscribe to changes on `workout_logs` for the current user.
 * On INSERT / UPDATE / DELETE it invalidates the React-Query cache
 * so any component using useQuery(["workoutLogs", userId]) refetches.
 *
 * We scope the channel to the authenticated user to reduce traffic and respect RLS.
 */
export const useRealtimeWorkoutLogs = (userId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`public:workout_logs:user=${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "workout_logs",
          filter: `user_id=eq.${userId}`,
        },
        (_payload) => {
          // Invalidate cache – React Query will refetch in background
          queryClient.invalidateQueries({ queryKey: ["workoutLogs", userId] });
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [userId, queryClient]);
};
