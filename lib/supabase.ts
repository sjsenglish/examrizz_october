import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Singleton pattern to ensure only one client exists across the app
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
        storageKey: 'examrizz-auth-token' // Ensuring consistent key
      },
      global: {
        headers: {
          'x-application-name': 'examrizz'
        }
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    });
  }
  return supabaseInstance;
}

export const supabase = getSupabaseClient();

// --- TYPES ---
export interface School {
  id: string;
  name: string;
  school_code: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  school_id: string | null;
  role: 'teacher' | 'student' | 'admin';
  full_name: string;
  email?: string;
  created_at: string;
}

export interface Class {
  id: string;
  teacher_id: string;
  school_id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface ClassMembership {
  id: string;
  class_id: string;
  student_id: string;
  joined_at: string;
}

export interface QuestionPack {
  id: string;
  creator_id: string;
  name: string;
  subject: string;
  description?: string;
  is_public: boolean;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface PackAssignment {
  id: string;
  pack_id: string;
  assigned_by: string;
  assigned_to_user_id?: string;
  assigned_to_class_id?: string;
  due_date?: string;
  time_limit_minutes?: number;
  randomize_questions: boolean;
  instructions?: string;
  email_notification: boolean;
  show_in_dashboard: boolean;
  score_threshold_percent?: number;
  assigned_at: string;
  status: 'active' | 'completed' | 'overdue' | 'draft';
}

export interface PackAttempt {
  id: string;
  pack_id: string;
  user_id: string;
  assignment_id?: string;
  score?: number;
  total_questions: number;
  time_taken_seconds?: number;
  answers?: any;
  completed_at?: string;
  created_at: string;
}

// --- HELPER FUNCTIONS ---

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting current user:', error);
    return null;
  }
  return user;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      // PGRST116 is the error code for "no rows returned" (not a critical failure)
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error getting user profile:', error.message || error);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Unexpected error getting user profile:', error);
    return null;
  }
}

export async function createOrUpdateUserProfile(
  userId: string,
  email: string,
  fullName?: string,
  role: 'teacher' | 'student' | 'admin' = 'teacher'
): Promise<UserProfile | null> {
  try {
    // First try to get existing profile
    const existingProfile = await getUserProfile(userId);

    if (existingProfile) {
      try {
        const updateData: any = {
          email,
          full_name: fullName || existingProfile.full_name,
          role: role
        };

        const { data, error } = await supabase
          .from('user_profiles')
          .update(updateData)
          .eq('id', userId)
          .select()
          .single();

        if (error) {
          console.error('Error updating user profile:', error.message || error);
          return existingProfile;
        }

        return data;
      } catch (updateError) {
        console.error('Unexpected error updating profile:', updateError);
        return existingProfile;
      }
    }

    // Create new profile
    try {
      const insertData: any = {
        id: userId,
        email,
        full_name: fullName || email.split('@')[0],
        role: role,
        school_id: null
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Error creating user profile:', error.message || error);
        return null;
      }

      return data;
    } catch (insertError) {
      console.error('Unexpected error creating profile:', insertError);
      return null;
    }
  } catch (error) {
    console.error('Error in createOrUpdateUserProfile:', error);
    return null;
  }
}

export async function checkDatabaseConnection(): Promise<{ connected: boolean, tablesExist: boolean, error?: string }> {
  try {
    const { error: connectionError } = await supabase.from('user_profiles').select('count', { count: 'exact', head: true });

    if (connectionError) {
      if (connectionError.message.includes('relation "public.user_profiles" does not exist')) {
        return { connected: true, tablesExist: false, error: 'Tables not created yet' };
      }
      return { connected: false, tablesExist: false, error: connectionError.message };
    }

    return { connected: true, tablesExist: true };
  } catch (error) {
    return { connected: false, tablesExist: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function ensureTeacherProfile(userId: string, email: string): Promise<UserProfile | null> {
  try {
    const dbStatus = await checkDatabaseConnection();

    if (!dbStatus.connected || !dbStatus.tablesExist) {
      console.warn('Database issues detected, using mock profile');
      return {
        id: userId,
        email,
        full_name: email.split('@')[0],
        role: 'teacher',
        school_id: null,
        created_at: new Date().toISOString()
      };
    }

    let profile = await getUserProfile(userId);

    if (!profile) {
      profile = await createOrUpdateUserProfile(userId, email, undefined, 'teacher');
    } else if (profile.role !== 'teacher') {
      profile = await createOrUpdateUserProfile(userId, email, profile.full_name, 'teacher');
    }

    return profile;
  } catch (error) {
    console.error('Error in ensureTeacherProfile:', error);
    return {
      id: userId,
      email,
      full_name: email.split('@')[0],
      role: 'teacher',
      school_id: null,
      created_at: new Date().toISOString()
    };
  }
}

// Default export to ensure compatibility with files using "import supabase from..."
export default supabase;
