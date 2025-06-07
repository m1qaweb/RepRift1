// /src/supabaseClient.ts

import { createClient } from "@supabase/supabase-js";

// Get the URL and Key from the .env file
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Check if the variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase URL and Anon Key must be provided in the .env file."
  );
}

// Create the Supabase client
// This one client will be used by our entire application.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // This tells Supabase to automatically store the user's session in localStorage.
    persistSession: true,
    // This tells Supabase to automatically refresh the session token.
    autoRefreshToken: true,
  },
});
