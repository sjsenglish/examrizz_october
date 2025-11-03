import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      request.headers.get('Authorization')?.replace('Bearer ', '') || ''
    );

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Fixing Discord auth for user:', user.id, user.email);

    // Check if user profile exists
    const { data: existingProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    let profile;

    if (profileError && profileError.code === 'PGRST116') {
      // Profile doesn't exist, create it
      console.log('Creating missing profile for user:', user.email);
      
      const newProfile = {
        id: user.id,
        email: user.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // If this is a Discord user, add Discord data
      if (user.app_metadata?.provider === 'discord') {
        const userMetadata = user.user_metadata || {};
        Object.assign(newProfile, {
          discord_id: userMetadata.provider_id || userMetadata.sub || userMetadata.id,
          discord_username: userMetadata.username || userMetadata.global_name || userMetadata.name,
          discord_avatar: userMetadata.avatar_url || userMetadata.picture,
          discord_discriminator: userMetadata.discriminator,
          discord_linked_at: new Date().toISOString()
        });
      }

      const { data: createdProfile, error: createError } = await supabase
        .from('user_profiles')
        .insert([newProfile])
        .select()
        .single();

      if (createError) {
        console.error('Failed to create profile:', createError);
        return NextResponse.json({ 
          error: 'Failed to create user profile',
          details: createError.message 
        }, { status: 500 });
      }

      profile = createdProfile;
      console.log('Successfully created profile for:', user.email);

    } else if (existingProfile && user.app_metadata?.provider === 'discord') {
      // Profile exists but might be missing Discord data
      console.log('Updating Discord data for existing profile:', user.email);
      
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

      if (updateError) {
        console.error('Failed to update Discord data:', updateError);
        return NextResponse.json({ 
          error: 'Failed to update Discord data',
          details: updateError.message 
        }, { status: 500 });
      }

      profile = updatedProfile;
      console.log('Successfully updated Discord data for:', user.email);

    } else {
      // Profile exists and is fine
      profile = existingProfile;
      console.log('Profile already exists and is valid for:', user.email);
    }

    return NextResponse.json({ 
      success: true,
      message: 'Discord authentication fixed successfully',
      profile: {
        id: profile.id,
        email: profile.email,
        discord_id: profile.discord_id,
        discord_username: profile.discord_username,
        hasDiscordData: !!profile.discord_id
      }
    });

  } catch (error) {
    console.error('Error in fix-discord-auth:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}