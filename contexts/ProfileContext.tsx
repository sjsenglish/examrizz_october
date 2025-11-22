'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

export interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  username?: string;
  school?: string;
  rank_in_school?: string;
  target_degree?: string;
  discord_id?: string;
  discord_username?: string;
  discord_avatar?: string;
  discord_discriminator?: string;
  discord_linked_at?: string;
  created_at?: string;
  updated_at?: string;
  gcse_grades?: Array<{subject: string, grade: string}>;
  a_level_grades?: Array<{subject: string, grade: string}>;
}

interface ProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  
  // Methods
  refreshProfile: () => Promise<void>;
  updateProfileCache: (updates: Partial<UserProfile>) => void;
  saveProfileAndUpdateCache: (profileUpdates: Partial<UserProfile>, grades?: { gcse?: Array<{subject: string, grade: string}>, aLevel?: Array<{subject: string, grade: string}> }) => Promise<void>;
  clearProfileCache: () => void;
  
  // Helper methods
  hasProfile: boolean;
  isAuthenticated: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
}

export function ProfileProvider({ children }: ProfileProviderProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // Cache key for localStorage
  const getCacheKey = (userId: string) => `profile_cache_${userId}`;
  
  // Load profile from cache
  const loadFromCache = useCallback((userId: string): UserProfile | null => {
    try {
      const cached = localStorage.getItem(getCacheKey(userId));
      if (cached) {
        const parsed = JSON.parse(cached);
        // Check if cache is less than 5 minutes old
        if (Date.now() - parsed.timestamp < 5 * 60 * 1000) {
          return parsed.profile;
        }
        // Clear expired cache
        localStorage.removeItem(getCacheKey(userId));
      }
    } catch (error) {
      console.error('Error loading profile from cache:', error);
    }
    return null;
  }, []);
  
  // Save profile to cache
  const saveToCache = useCallback((userId: string, profileData: UserProfile) => {
    try {
      localStorage.setItem(getCacheKey(userId), JSON.stringify({
        profile: profileData,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error saving profile to cache:', error);
    }
  }, []);
  
  // Load profile data from database
  const loadProfileFromDatabase = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      // Load profile data
      const { data: profileData, error: profileError } = await (supabase as any)
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          // Profile doesn't exist yet
          return null;
        }
        throw profileError;
      }
      
      // Load GCSE grades
      const { data: gcseGrades, error: gcseError } = await (supabase as any)
        .from('user_gcse_grades')
        .select('subject, grade')
        .eq('user_id', userId);
      
      // Load A Level grades
      const { data: aLevelGrades, error: aLevelError } = await (supabase as any)
        .from('user_alevel_grades')
        .select('subject, grade')
        .eq('user_id', userId);

      if (gcseError) {
        console.error('Error loading GCSE grades:', gcseError);
      }
      
      if (aLevelError) {
        console.error('Error loading A Level grades:', aLevelError);
      }

      if (!profileData) {
        return null;
      }

      // Combine profile with grades
      const fullProfile: UserProfile = {
        ...(profileData as any),
        gcse_grades: gcseGrades || [],
        a_level_grades: aLevelGrades || []
      };
      
      // Cache the result
      saveToCache(userId, fullProfile);
      
      return fullProfile;
    } catch (error) {
      console.error('Error loading profile from database:', error);
      throw error;
    }
  }, [saveToCache]);

  // Refresh profile data
  const refreshProfile = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const profileData = await loadProfileFromDatabase(user.id);
      setProfile(profileData);
    } catch (err) {
      console.error('Error refreshing profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [user?.id, loadProfileFromDatabase]);

  // Update profile cache without hitting database
  const updateProfileCache = useCallback((updates: Partial<UserProfile>) => {
    if (!profile || !user?.id) return;
    
    const updatedProfile = { ...profile, ...updates };
    setProfile(updatedProfile);
    saveToCache(user.id, updatedProfile);
  }, [profile, user?.id, saveToCache]);

  // Save profile and update cache
  const saveProfileAndUpdateCache = useCallback(async (profileUpdates: Partial<UserProfile>, grades?: { gcse?: Array<{subject: string, grade: string}>, aLevel?: Array<{subject: string, grade: string}> }) => {
    if (!user?.id) throw new Error('User not authenticated');

    try {
      // Update user profile (excluding grades)
      const { data, error } = await (supabase as any)
        .from('user_profiles')
        .update(profileUpdates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Save grades if provided
      if (grades?.gcse !== undefined) {
        // Delete existing GCSE grades
        await (supabase as any)
          .from('user_gcse_grades')
          .delete()
          .eq('user_id', user.id);
          
        // Insert new GCSE grades
        if (grades.gcse.length > 0) {
          const gcseGrades = grades.gcse
            .filter((g: any) => g.subject && g.grade)
            .map((g: any) => ({
              user_id: user.id,
              subject: g.subject,
              grade: g.grade
            }));

          if (gcseGrades.length > 0) {
            await (supabase as any)
              .from('user_gcse_grades')
              .insert(gcseGrades);
          }
        }
      }

      if (grades?.aLevel !== undefined) {
        // Delete existing A Level grades
        await (supabase as any)
          .from('user_alevel_grades')
          .delete()
          .eq('user_id', user.id);
          
        // Insert new A Level grades
        if (grades.aLevel.length > 0) {
          const aLevelGrades = grades.aLevel
            .filter((g: any) => g.subject && g.grade)
            .map((g: any) => ({
              user_id: user.id,
              subject: g.subject,
              grade: g.grade
            }));

          if (aLevelGrades.length > 0) {
            await (supabase as any)
              .from('user_alevel_grades')
              .insert(aLevelGrades);
          }
        }
      }

      // Refresh profile to get latest data including grades
      await refreshProfile();
      
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  }, [user?.id, refreshProfile]);

  // Clear profile cache
  const clearProfileCache = useCallback(() => {
    setProfile(null);
    if (user?.id) {
      try {
        localStorage.removeItem(getCacheKey(user.id));
      } catch (error) {
        console.error('Error clearing profile cache:', error);
      }
    }
  }, [user?.id]);

  // Initialize auth state and profile
  useEffect(() => {
    let mounted = true;
    
    const initializeProfile = async () => {
      try {
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          if (mounted) {
            setError('Failed to check authentication status');
            setLoading(false);
          }
          return;
        }

        if (session?.user) {
          if (mounted) {
            setUser(session.user);
          }
          
          // Try to load from cache first
          const cachedProfile = loadFromCache(session.user.id);
          if (cachedProfile && mounted) {
            setProfile(cachedProfile);
            setLoading(false);
            return;
          }
          
          // If no cache, load from database
          try {
            const profileData = await loadProfileFromDatabase(session.user.id);
            if (mounted) {
              setProfile(profileData);
            }
          } catch (err) {
            console.error('Error loading profile:', err);
            if (mounted) {
              setError(err instanceof Error ? err.message : 'Failed to load profile');
            }
          }
        } else {
          if (mounted) {
            setUser(null);
            setProfile(null);
          }
        }
      } catch (error) {
        console.error('Error initializing profile:', error);
        if (mounted) {
          setError('Failed to initialize profile');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeProfile();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      if (!mounted) return;
      
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        setError(null);
        setLoading(true);
        
        // Try cache first, then database
        const cachedProfile = loadFromCache(session.user.id);
        if (cachedProfile) {
          setProfile(cachedProfile);
          setLoading(false);
        } else {
          try {
            const profileData = await loadProfileFromDatabase(session.user.id);
            setProfile(profileData);
          } catch (err) {
            console.error('Error loading profile on sign in:', err);
            setError(err instanceof Error ? err.message : 'Failed to load profile');
          } finally {
            setLoading(false);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setError(null);
        setLoading(false);
        
        // Clear all profile caches
        try {
          const keys = Object.keys(localStorage);
          keys.forEach((key: any) => {
            if (key.startsWith('profile_cache_')) {
              localStorage.removeItem(key);
            }
          });
        } catch (error) {
          console.error('Error clearing profile caches:', error);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadFromCache, loadProfileFromDatabase]);

  const contextValue: ProfileContextType = {
    profile,
    loading,
    error,
    refreshProfile,
    updateProfileCache,
    saveProfileAndUpdateCache,
    clearProfileCache,
    hasProfile: !!profile,
    isAuthenticated: !!user
  };

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
}

// Hook to use the profile context
export function useProfile(): ProfileContextType {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}

// Hook for checking if user has specific profile fields
export function useProfileField<K extends keyof UserProfile>(field: K): UserProfile[K] | undefined {
  const { profile } = useProfile();
  return profile?.[field];
}

// Hook for checking if user has complete profile
export function useHasCompleteProfile(): boolean {
  const { profile } = useProfile();
  return !!(profile?.full_name && profile?.username);
}