// /src/hooks/usePrograms.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { getPrograms } from "../services/programService";
import { supabase } from "../supabaseClient";
import { useAuth } from "../contexts/AuthContext";

export const usePrograms = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ["programs", user?.id];

  const {
    data: programs,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey,
    queryFn: getPrograms,
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`public:programs:user=${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "programs",
          filter: `created_by=eq.${user.id}`,
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

  return { programs, isLoading, isError, error };
};
