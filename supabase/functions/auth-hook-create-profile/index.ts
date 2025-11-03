import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AuthUserData {
  id: string;
  email?: string;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
}

interface AuthHookPayload {
  type: string;
  table: string;
  record: AuthUserData;
  schema: string;
  old_record?: AuthUserData;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify the request is from Supabase (basic security check)
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      console.error('No authorization header found')
      return new Response('Unauthorized', { status: 401 })
    }

    // Parse the webhook payload
    const payload: AuthHookPayload = await req.json()
    console.log('Auth hook triggered:', JSON.stringify(payload, null, 2))

    // Only process INSERT events on auth.users table
    if (payload.type !== 'INSERT' || payload.table !== 'users') {
      console.log('Skipping non-INSERT event or non-users table')
      return new Response('OK', { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const user = payload.record
    if (!user || !user.id) {
      console.error('Invalid user data in payload')
      return new Response('Invalid user data', { status: 400 })
    }

    // Create Supabase client with service role key to bypass RLS
    const supabaseServiceRole = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check if profile already exists (shouldn't happen, but good to be safe)
    const { data: existingProfile } = await supabaseServiceRole
      .from('user_profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    if (existingProfile) {
      console.log(`Profile already exists for user ${user.id}`)
      return new Response('Profile already exists', { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Prepare the new profile data
    const newProfile: Record<string, any> = {
      id: user.id,
      email: user.email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Extract provider-specific data
    const provider = user.app_metadata?.provider
    const userMetadata = user.user_metadata || {}

    console.log(`Creating profile for ${provider} user:`, user.email)

    if (provider === 'discord') {
      // Extract Discord-specific data
      newProfile.discord_id = userMetadata.provider_id || userMetadata.sub || userMetadata.id
      newProfile.discord_username = userMetadata.username || userMetadata.global_name || userMetadata.name
      newProfile.discord_avatar = userMetadata.avatar_url || userMetadata.picture
      newProfile.discord_discriminator = userMetadata.discriminator
      newProfile.discord_linked_at = new Date().toISOString()
      
      console.log('Discord data extracted:', {
        discord_id: newProfile.discord_id,
        discord_username: newProfile.discord_username,
        discord_avatar: newProfile.discord_avatar
      })
    } else if (provider === 'google') {
      // Extract Google-specific data if available
      if (userMetadata.full_name || userMetadata.name) {
        newProfile.full_name = userMetadata.full_name || userMetadata.name
      }
      
      console.log('Google data extracted:', {
        full_name: newProfile.full_name
      })
    }

    // Create the user profile
    const { data: createdProfile, error: createError } = await supabaseServiceRole
      .from('user_profiles')
      .insert([newProfile])
      .select()
      .single()

    if (createError) {
      console.error('Failed to create user profile:', createError)
      return new Response(JSON.stringify({ 
        error: 'Failed to create profile',
        details: createError.message 
      }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('Successfully created user profile:', createdProfile.id)
    
    return new Response(JSON.stringify({ 
      success: true,
      profile_id: createdProfile.id,
      provider: provider 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in auth hook:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})