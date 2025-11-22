import { supabase } from '@/lib/supabase';

export interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  username?: string;
  school?: string;
  rank_in_school?: string;
  discord_id?: string;
  discord_username?: string;
  discord_avatar?: string;
  discord_discriminator?: string;
  discord_linked_at?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Ensures a user profile exists for the authenticated user
 * This fixes issues with Discord OAuth not creating profiles properly
 */
export async function ensureUserProfile(): Promise<{ user: any; profile: UserProfile | null; error?: string }> {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { user: null, profile: null, error: 'Not authenticated' };
    }

    // Add small delay to prevent race conditions with database triggers
    await new Promise(resolve => setTimeout(resolve, 100));

    // Check if profile exists with retry logic
    let existingProfile = null;
    let profileError = null;
    
    for (let attempt = 0; attempt < 3; attempt++) {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (data && !error) {
        existingProfile = data;
        profileError = null;
        break;
      } else if (error?.code === 'PGRST116') {
        // Profile doesn't exist yet, continue to creation
        profileError = error;
        break;
      } else {
        // Other error (like 406), retry after small delay
        if (attempt < 2) {
          await new Promise(resolve => setTimeout(resolve, 50));
        } else {
          profileError = error;
        }
      }
    }

    // If profile exists, check if we need to sync Discord data
    if (existingProfile && !profileError) {
      // Check if user has Discord auth but profile lacks Discord data
      const provider = user.app_metadata?.provider;
      const hasDiscordAuth = user.identities?.find((identity: any) => identity.provider === 'discord');
      
      if ((provider === 'discord' || hasDiscordAuth) && !existingProfile.discord_id) {
        // User has Discord auth but profile doesn't have Discord data - sync it
        try {
          const userMetadata = user.user_metadata || {};
          const discordData = {
            discord_id: userMetadata.provider_id || userMetadata.sub || userMetadata.id,
            discord_username: userMetadata.username || userMetadata.global_name || userMetadata.name,
            discord_avatar: userMetadata.avatar_url || userMetadata.picture,
            discord_discriminator: userMetadata.discriminator,
            discord_linked_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          const { data: updatedProfile, error: updateError } = await supabase
            .from('user_profiles')
            .update(discordData)
            .eq('id', user.id)
            .select()
            .single();

          if (!updateError && updatedProfile) {
            return { user, profile: updatedProfile };
          }
        } catch (error) {
          // If Discord sync fails, continue with existing profile
        }
      }
      
      return { user, profile: existingProfile };
    }

    // If profile doesn't exist or we had an error, try to create/upsert it
    const newProfile: Partial<UserProfile> = {
      id: user.id,
      email: user.email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // If this is a Discord user, add Discord data
    const provider = user.app_metadata?.provider;
    if (provider === 'discord') {
      const userMetadata = user.user_metadata || {};
      newProfile.discord_id = userMetadata.provider_id || userMetadata.sub || userMetadata.id;
      newProfile.discord_username = userMetadata.username || userMetadata.global_name || userMetadata.name;
      newProfile.discord_avatar = userMetadata.avatar_url || userMetadata.picture;
      newProfile.discord_discriminator = userMetadata.discriminator;
      newProfile.discord_linked_at = new Date().toISOString();
    }

    // Use upsert to handle conflicts gracefully
    const { data: createdProfile, error: createError } = await supabase
      .from('user_profiles')
      .upsert([newProfile], { 
        onConflict: 'id',
        ignoreDuplicates: false 
      })
      .select()
      .single();

    if (createError) {
      // Silently handle expected conflicts and try to fetch existing profile
      if (createError.code === '23505' || createError.message?.includes('duplicate key')) {
        const { data: retryProfile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (retryProfile) {
          return { user, profile: retryProfile };
        }
      }
      
      // For other errors, return without throwing
      return { user, profile: null };
    }

    return { user, profile: createdProfile };

  } catch (error) {
    // Silently handle errors to prevent user-facing error messages
    return { user: null, profile: null };
  }
}

/**
 * Updates a user's Discord information in their profile
 */
export async function updateDiscordProfile(userId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || user.id !== userId || user.app_metadata?.provider !== 'discord') {
      return false;
    }

    const userMetadata = user.user_metadata || {};
    const discordData = {
      discord_id: userMetadata.provider_id || userMetadata.sub || userMetadata.id,
      discord_username: userMetadata.username || userMetadata.global_name || userMetadata.name,
      discord_avatar: userMetadata.avatar_url || userMetadata.picture,
      discord_discriminator: userMetadata.discriminator,
      discord_linked_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('user_profiles')
      .update(discordData)
      .eq('id', userId);

    if (error) {
      console.error('Failed to update Discord profile:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating Discord profile:', error);
    return false;
  }
}

/**
 * Checks if user is properly authenticated and has a valid profile
 */
export async function validateUserSession(): Promise<{ isValid: boolean; user: any; profile: UserProfile | null }> {
  const result = await ensureUserProfile();
  
  return {
    isValid: !!(result.user && result.profile),
    user: result.user,
    profile: result.profile
  };
}

/**
 * Clears all user-related cached data and performs complete logout
 */
export async function performLogout(): Promise<void> {
  try {
    // Clear localStorage cache
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('feature-usage-') || 
          key.includes('user-') || 
          key.includes('auth-') ||
          key.includes('supabase-')) {
        localStorage.removeItem(key);
      }
    });

    // Clear sessionStorage cache  
    const sessionKeys = Object.keys(sessionStorage);
    sessionKeys.forEach(key => {
      if (key.includes('user-') || 
          key.includes('auth-') ||
          key.includes('supabase-')) {
        sessionStorage.removeItem(key);
      }
    });

    // Sign out from Supabase
    await supabase.auth.signOut();
    
  } catch (error) {
    console.error('Error during logout:', error);
    // Continue with logout even if there are errors
  }
}