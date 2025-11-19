import { createClient } from '@supabase/supabase-js';

// Create a single shared Supabase client instance
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Singleton pattern to ensure only one client exists
let supabaseInstance: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        storageKey: 'examrizz-auth-token'
      },
      global: {
        headers: {
          'x-application-name': 'examrizz'
        }
      }
    });
  }
  return supabaseInstance;
}

export const supabase = getSupabaseClient();

export default supabase;