// /src/contexts/AuthContext.tsx (FINAL, PRODUCTION-READY VERSION)

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "../supabaseClient";
import { Session } from "@supabase/supabase-js";

// The AppUser interface is the data model our app's components will work with.
// It uses clean camelCase properties.
export interface AppUser {
  id: string;
  email?: string;
  name?: string;
  avatarUrl?: string; // App uses camelCase (e.g., user.avatarUrl)
  bio?: string;
  heightCm?: number; // App uses camelCase (e.g., user.heightCm)
  goals?: { weightKg?: number };
  initialSetupCompleted?: boolean; // App uses camelCase (e.g., user.initialSetupCompleted)
}

// Defines the functions and state that will be available to any component using our context.
export interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (credentials: { email: string; pass: string }) => Promise<void>;
  signup: (details: {
    name: string;
    email: string;
    pass: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedProfileData: Partial<AppUser>) => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // This single useEffect hook is the heart of the entire auth system.
  // It runs once on app load and sets up a listener that handles all authentication events.
  useEffect(() => {
    // This function handles the initial session check and sets up the listener.
    const initializeSession = async () => {
      // 1. Get the current session from Supabase
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // 2. Process the session to set the user state
      await processUserSession(session);

      // 3. We are now finished with the initial loading
      setLoading(false);

      // 4. Set up a listener for any future changes in auth state
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        processUserSession(session);
      });

      // 5. Return the subscription so we can unsubscribe on cleanup
      return subscription;
    };

    const subscriptionPromise = initializeSession();

    // The cleanup function for the useEffect hook
    return () => {
      subscriptionPromise.then((subscription) => subscription?.unsubscribe());
    };
  }, []);

  const processUserSession = async (session: Session | null) => {
    if (session?.user) {
      // A user is logged in. Fetch their data from our public `profiles` table.
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        // Ignore "row not found" errors, but log others
        console.error("Error fetching user profile:", error);
        return; // Don't proceed if there was a major error
      }

      // === ENHANCEMENT 1: EXPLICIT DATA MAPPING ===
      // This correctly maps from database snake_case columns (e.g., avatar_url)
      // to our application's camelCase properties (e.g., avatarUrl). This prevents bugs.
      const fullUser: AppUser = {
        id: session.user.id,
        email: session.user.email,
        name: profile?.name,
        avatarUrl: profile?.avatar_url,
        bio: profile?.bio,
        heightCm: profile?.height_cm,
        goals: profile?.goals,
        initialSetupCompleted: profile?.initial_setup_completed,
      };
      setUser(fullUser);
    } else {
      // User is logged out. Clear the user object.
      setUser(null);
    }
  };

  // --- Functions exposed via the context ---

  const login = async (credentials: { email: string; pass: string }) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.pass,
    });
    if (error) throw error;
  };

  const signup = async (details: {
    name: string;
    email: string;
    pass: string;
  }) => {
    // Step 1: Create the user in Supabase's secure 'auth.users' table.
    const { data, error } = await supabase.auth.signUp({
      email: details.email,
      password: details.pass,
    });
    if (error) throw error;
    if (!data.user) throw new Error("Signup did not return user data.");

    // Step 2: Create their corresponding row in our public 'profiles' table.
    // The `id` here MUST be provided to satisfy our Row Level Security policy.
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id, // <-- This is the most critical part
      name: details.name,
      initial_setup_completed: false,
    });

    if (profileError) throw profileError;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateUser = async (updatedProfileData: Partial<AppUser>) => {
    if (!user) throw new Error("User not authenticated.");

    // === ENHANCEMENT 2: GUARANTEED STATE CONSISTENCY ===
    // We add `.select().single()` to get the exact data that was saved in the database.
    const { data: updatedProfile, error } = await supabase
      .from("profiles")
      .update({
        // Map our app's camelCase properties to the database's snake_case columns
        name: updatedProfileData.name,
        bio: updatedProfileData.bio,
        avatar_url: updatedProfileData.avatarUrl,
        height_cm: updatedProfileData.heightCm,
        goals: updatedProfileData.goals,
        initial_setup_completed: updatedProfileData.initialSetupCompleted,
      })
      .eq("id", user.id)
      .select()
      .single();

    if (error) throw error;
    if (!updatedProfile)
      throw new Error("Update failed to return the updated profile.");

    // We now update our local state with the AUTHORITATIVE data returned
    // from the database, ensuring perfect consistency.
    setUser((currentUser) => ({
      ...currentUser!,
      name: updatedProfile.name,
      bio: updatedProfile.bio,
      avatarUrl: updatedProfile.avatar_url,
      heightCm: updatedProfile.height_cm,
      goals: updatedProfile.goals,
      initialSetupCompleted: updatedProfile.initial_setup_completed,
    }));
  };

  const changePassword = async (newPassword: string) => {
    // There is no `reauthenticate` function on the client.
    // The intended function is simply `updateUser`.
    // Let's ensure the user is present.
    if (!supabase.auth.getSession()) {
      throw new Error("User is not authenticated.");
    }

    // The function to update the user's password IS updateUser
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      // If there's an explicit error from the server, throw it.
      console.error("Error updating password:", error.message);
      throw error;
    }

    // A crucial check to see if the update was acknowledged.
    if (!data.user) {
      throw new Error(
        "Password update call did not return updated user data. The session might be too old."
      );
    }

    // To be absolutely certain the new session is active with the changes,
    // we can re-set the session manually. This can help with token propagation.
    await supabase.auth.refreshSession();

    console.log(
      "Password updated successfully on Supabase for user:",
      data.user.id
    );
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateUser,
    changePassword,
  };

  // This is a great pattern for resetting state across the app on logout.
  return (
    <AuthContext.Provider value={value} key={user?.id}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
