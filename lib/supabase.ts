import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Single Supabase client instance to avoid multiple GoTrueClient warnings
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Types for database schema
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

// Helper function to get current user
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting current user:', error);
    return null;
  }
  return user;
}

// Helper function to get user profile
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      // If the profile doesn't exist (not an error), return null
      if (error.code === 'PGRST116') {
        console.log('User profile not found, will create new one');
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

// Helper function to create or update user profile
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
      // Update existing profile if needed
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .update({
            email,
            full_name: fullName || existingProfile.full_name,
            role: role
          })
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
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          email,
          full_name: fullName || email.split('@')[0],
          role: role,
          school_id: null // Will be set when user joins a school
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating user profile:', error.message || error);
        // Check if the table exists by testing a simple query
        const { error: tableError } = await supabase.from('user_profiles').select('count', { count: 'exact', head: true });
        if (tableError) {
          console.error('user_profiles table may not exist:', tableError.message);
        }
        return null;
      }

      console.log('Successfully created user profile:', data);
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

// Check if database is properly set up
export async function checkDatabaseConnection(): Promise<{ connected: boolean, tablesExist: boolean, error?: string }> {
  try {
    // Test basic connection
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

// Helper function to ensure user has teacher profile
export async function ensureTeacherProfile(userId: string, email: string): Promise<UserProfile | null> {
  try {
    // First check if database is set up
    const dbStatus = await checkDatabaseConnection();
    
    if (!dbStatus.connected) {
      console.error('Database connection failed:', dbStatus.error);
      // Return a mock profile for development
      return {
        id: userId,
        email,
        full_name: email.split('@')[0],
        role: 'teacher',
        school_id: null,
        created_at: new Date().toISOString()
      };
    }
    
    if (!dbStatus.tablesExist) {
      console.warn('Database tables not created yet. Using mock profile for development.');
      // Return a mock profile for development
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
      // Create new teacher profile
      profile = await createOrUpdateUserProfile(userId, email, undefined, 'teacher');
    } else if (profile.role !== 'teacher') {
      // Update role to teacher
      profile = await createOrUpdateUserProfile(userId, email, profile.full_name, 'teacher');
    }
    
    return profile;
  } catch (error) {
    console.error('Error in ensureTeacherProfile:', error);
    // Return a mock profile as fallback
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