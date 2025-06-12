// /src/hooks/useWorkoutLogs.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { getWorkoutLogs } from "../services/workoutLogService";
import { supabase } from "../supabaseClient";
import { useAuth } from "../contexts/AuthContext";

export const useWorkoutLogs = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ["workoutLogs", user?.id];

  const {
    data: workoutLogs,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey,
    queryFn: getWorkoutLogs,
    enabled: !!user, // Only run the query if the user is authenticated
  });

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`public:workout_logs:user=${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "workout_logs",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user, queryClient, queryKey]);

  return { workoutLogs, isLoading, isError, error };
};
