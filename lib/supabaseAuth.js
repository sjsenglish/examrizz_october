import { supabase } from './supabase';

/**
 * Sign up a new user with email, password, and role
 * @param {string} email 
 * @param {string} password 
 * @param {string} role - 'student' or 'teacher'
 * @returns {Object} { success: boolean, user?: object, error?: string }
 */
export const signUp = async (email, password, role) => {
  try {
    if (!email || !password || !role) {
      return { success: false, error: 'Email, password, and role are required' };
    }

    if (!['student', 'teacher'].includes(role)) {
      return { success: false, error: 'Role must be either "student" or "teacher"' };
    }

    console.log('Attempting signup with email:', email);
    console.log('Supabase client exists:', !!supabase);
    console.log('Supabase auth exists:', !!supabase?.auth);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: role
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005'}/auth/callback`
      }
    });

    if (error) {
      console.error('Supabase signup error:', error);
      return { success: false, error: error.message };
    }

    console.log('Signup successful:', data);
    return { success: true, user: data.user };
  } catch (error) {
    console.error('Caught error during signup:', error);
    return { success: false, error: error.message || 'Failed to connect to authentication service' };
  }
};

/**
 * Sign in a user with email and password
 * @param {string} email 
 * @param {string} password 
 * @returns {Object} { success: boolean, user?: object, error?: string }
 */
export const signIn = async (email, password) => {
  try {
    if (!email || !password) {
      return { success: false, error: 'Email and password are required' };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Sign out the current user
 * @returns {Object} { success: boolean, error?: string }
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get the current authenticated user
 * @returns {Object} { success: boolean, user?: object, error?: string }
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get user profile information
 * @param {string} userId 
 * @returns {Object} { success: boolean, profile?: object, error?: string }
 */
export const getUserProfile = async (userId) => {
  try {
    if (!userId) {
      return { success: false, error: 'User ID is required' };
    }

    const { data, error } = await (supabase as any)
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, profile: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};