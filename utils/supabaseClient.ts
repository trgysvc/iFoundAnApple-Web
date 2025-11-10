import { createClient } from "@supabase/supabase-js";
import { getSecureConfig } from "./security.ts";

// Get secure configuration from environment variables
const { supabaseUrl, supabaseAnonKey } = getSecureConfig();

// Create a single Supabase client instance to be used throughout the application
// This prevents multiple GoTrueClient instances warning
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: "public",
  },
});

export default supabase;

