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
    if (typeof window === 'undefined') return null;
    try {
      const cached = localStorage.getItem(getCacheKey(userId));
      if (cached) {
        const parsed = JSON.parse(cached);
        // Cache valid for 5 minutes
        if (Date.now() - parsed.timestamp < 5 * 60 * 1000) {
          return parsed.profile;
        }
        localStorage.removeItem(getCacheKey(userId));
      }
    } catch (error) {
      console.error('Error loading profile from cache:', error);
    }
    return null;
  }, []);
  
  // Save profile to cache
  const saveToCache = useCallback((userId: string, profileData: UserProfile) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(getCacheKey(userId), JSON.stringify({
        profile: profileData,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error saving profile to cache:', error);
    }
  }, []);
  
  // Load profile data from database (OPTIMIZED: Parallel fetching)
  const loadProfileFromDatabase = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      // Run all three queries in parallel to cut loading time by ~66%
      const [profileResult, gcseResult, aLevelResult] = await Promise.all([
        (supabase as any).from('user_profiles').select('*').eq('id', userId).single(),
        (supabase as any).from('user_gcse_grades').select('subject, grade').eq('user_id', userId),
        (supabase as any).from('user_alevel_grades').select('subject, grade').eq('user_id', userId)
      ]);

      if (profileResult.error) {
        // PGRST116 means "No rows found" - valid case for new users
        if (profileResult.error.code === 'PGRST116') {
          return null;
        }
        throw profileResult.error;
      }

      // Log non-critical errors but continue
      if (gcseResult.error) {
        console.error('Error loading GCSE grades:', gcseResult.error);
      }

      if (aLevelResult.error) {
        console.error('Error loading A Level grades:', aLevelResult.error);
      }

      // Combine results
      const fullProfile: UserProfile = {
        ...profileResult.data,
        gcse_grades: gcseResult.data || [],
        a_level_grades: aLevelResult.data || []
      };

      // Update cache
      saveToCache(userId, fullProfile);

      return fullProfile;
    } catch (error) {
      console.error('Error loading profile from database:', error);
      throw error;
    }
  }, [saveToCache]);

  // Refresh profile data (background refresh - doesn't set loading state)
  const refreshProfile = useCallback(async () => {
    if (!user?.id) return;

    // Don't set global loading to true to avoid UI flicker during background refresh
    try {
      const profileData = await loadProfileFromDatabase(user.id);
      setProfile(profileData);
    } catch (err) {
      console.error('Error refreshing profile:', err);
      // Don't overwrite error state on background refresh failure
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

    // Only check session on mount
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (mounted) {
          if (session?.user) {
            setUser(session.user);
            // Try cache first (Instant load)
            const cached = loadFromCache(session.user.id);
            if (cached) {
              setProfile(cached);
              setLoading(false);
              // Refresh in background to ensure data is fresh
              loadProfileFromDatabase(session.user.id).then(data => {
                if (mounted && data) setProfile(data);
              }).catch(err => console.error('Background refresh failed:', err));
            } else {
              // No cache, wait for DB
              const data = await loadProfileFromDatabase(session.user.id);
              if (mounted) {
                setProfile(data);
                setLoading(false);
              }
            }
          } else {
            // No session found
            setUser(null);
            setProfile(null);
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to check authentication');
          setLoading(false);
        }
      }
    };

    checkSession();

    // Listen for auth changes (Sign In / Sign Out / Token Refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      if (!mounted) return;

      // Debug logging
      console.log(`Auth state changed: ${event}`);

      if (session?.user) {
        setUser(session.user);

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          // Don't set loading=true if we already have data (prevents flash)
          const cached = loadFromCache(session.user.id);
          if (cached && !profile) {
            setProfile(cached);
          }

          // Fetch fresh data in background
          loadProfileFromDatabase(session.user.id)
            .then(data => {
              if (mounted) setProfile(data);
            })
            .catch(err => console.error('Error loading profile:', err))
            .finally(() => {
              if (mounted) setLoading(false);
            });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setLoading(false);
        // Clear local storage
        if (typeof window !== 'undefined') {
          const keys = Object.keys(localStorage);
          keys.forEach((key: string) => {
            if (key.startsWith('profile_cache_')) {
              localStorage.removeItem(key);
            }
          });
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadFromCache, loadProfileFromDatabase]); // Stable dependencies

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