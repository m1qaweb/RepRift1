import { useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Realtime subscription for the `programs` table filtered by current user.
 * Invalidates React-Query cache key ["programs"].
 */
export const useRealtimePrograms = (userId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`public:programs:user=${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "programs",
          filter: `created_by=eq.${userId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["programs"] });
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [userId, queryClient]);
};
