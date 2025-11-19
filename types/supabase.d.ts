// Global type overrides to fix Supabase type inference issues
// This is a temporary fix until proper database types are generated

declare module '@/lib/supabase-client' {
  import { SupabaseClient } from '@supabase/supabase-js';
  export const supabase: any;
}
