import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

    // Check if profile exists
    const { data: existingProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // If profile exists, return it
    if (existingProfile && !profileError) {
      return { user, profile: existingProfile };
    }

    // If profile doesn't exist, create it
    console.log('Creating missing user profile for:', user.email);
    
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

    const { data: createdProfile, error: createError } = await supabase
      .from('user_profiles')
      .insert([newProfile])
      .select()
      .single();

    if (createError) {
      console.error('Failed to create user profile:', createError);
      return { user, profile: null, error: 'Failed to create user profile' };
    }

    console.log('Successfully created user profile:', createdProfile.id);
    return { user, profile: createdProfile };

  } catch (error) {
    console.error('Error in ensureUserProfile:', error);
    return { user: null, profile: null, error: 'Unexpected error' };
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
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    await supabase.auth.signOut();
    
  } catch (error) {
    console.error('Error during logout:', error);
    // Continue with logout even if there are errors
  }
}