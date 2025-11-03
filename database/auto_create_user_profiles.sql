-- Function to automatically create user profiles when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  provider text;
  user_meta jsonb;
BEGIN
  -- Get provider and user metadata
  provider := NEW.raw_app_meta_data->>'provider';
  user_meta := NEW.raw_user_meta_data;
  
  -- Create the user profile
  INSERT INTO public.user_profiles (
    id,
    email,
    full_name,
    discord_id,
    discord_username,
    discord_avatar,
    discord_discriminator,
    discord_linked_at,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      user_meta->>'full_name',
      user_meta->>'name',
      NULL
    ),
    -- Discord fields (only populated if provider is Discord)
    CASE WHEN provider = 'discord' THEN 
      COALESCE(
        user_meta->>'provider_id',
        user_meta->>'sub',
        user_meta->>'id'
      )
    ELSE NULL END,
    CASE WHEN provider = 'discord' THEN 
      COALESCE(
        user_meta->>'username',
        user_meta->>'global_name',
        user_meta->>'name'
      )
    ELSE NULL END,
    CASE WHEN provider = 'discord' THEN 
      COALESCE(
        user_meta->>'avatar_url',
        user_meta->>'picture'
      )
    ELSE NULL END,
    CASE WHEN provider = 'discord' THEN 
      user_meta->>'discriminator'
    ELSE NULL END,
    CASE WHEN provider = 'discord' THEN 
      NOW()
    ELSE NULL END,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    -- Update fields if profile already exists (shouldn't happen, but safe)
    email = EXCLUDED.email,
    full_name = COALESCE(user_profiles.full_name, EXCLUDED.full_name),
    discord_id = COALESCE(user_profiles.discord_id, EXCLUDED.discord_id),
    discord_username = COALESCE(user_profiles.discord_username, EXCLUDED.discord_username),
    discord_avatar = COALESCE(user_profiles.discord_avatar, EXCLUDED.discord_avatar),
    discord_discriminator = COALESCE(user_profiles.discord_discriminator, EXCLUDED.discord_discriminator),
    discord_linked_at = COALESCE(user_profiles.discord_linked_at, EXCLUDED.discord_linked_at),
    updated_at = NOW();
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail user creation
    RAISE WARNING 'Failed to create user profile for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger on auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, service_role;

-- Also ensure RLS is enabled on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$ 
BEGIN
  -- Drop existing policies first to avoid conflicts
  DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
  DROP POLICY IF EXISTS "Service role has full access" ON public.user_profiles;
  
  -- Users can view their own profile
  CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);
  
  -- Users can update their own profile
  CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);
  
  -- Service role can do everything (for the trigger)
  CREATE POLICY "Service role has full access" ON public.user_profiles
    FOR ALL USING (auth.role() = 'service_role');
END $$;