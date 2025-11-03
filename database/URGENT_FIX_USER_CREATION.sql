-- URGENT FIX: Restore user creation functionality
-- Run this in Supabase SQL Editor immediately

-- 1. First, drop any existing trigger to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Create function to automatically create user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  provider text;
  user_meta jsonb;
BEGIN
  -- Get provider and user metadata
  provider := NEW.raw_app_meta_data->>'provider';
  user_meta := NEW.raw_user_meta_data;
  
  -- Log for debugging
  RAISE LOG 'Creating profile for user % with provider %', NEW.id, provider;
  
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
    -- Update fields if profile already exists
    email = COALESCE(user_profiles.email, EXCLUDED.email),
    full_name = COALESCE(user_profiles.full_name, EXCLUDED.full_name),
    discord_id = COALESCE(user_profiles.discord_id, EXCLUDED.discord_id),
    discord_username = COALESCE(user_profiles.discord_username, EXCLUDED.discord_username),
    discord_avatar = COALESCE(user_profiles.discord_avatar, EXCLUDED.discord_avatar),
    discord_discriminator = COALESCE(user_profiles.discord_discriminator, EXCLUDED.discord_discriminator),
    discord_linked_at = COALESCE(user_profiles.discord_linked_at, EXCLUDED.discord_linked_at),
    updated_at = NOW();
  
  RAISE LOG 'Successfully created/updated profile for user %', NEW.id;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail user creation
    RAISE WARNING 'Failed to create user profile for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create trigger on auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 4. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, service_role;

-- 5. Ensure RLS is properly configured
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Service role has full access" ON public.user_profiles;

-- Create proper policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role has full access" ON public.user_profiles
  FOR ALL USING (auth.role() = 'service_role');

-- 6. Fix any existing users that don't have profiles (cleanup)
INSERT INTO public.user_profiles (id, email, created_at, updated_at)
SELECT 
  id, 
  email,
  COALESCE(created_at, NOW()),
  NOW()
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.user_profiles)
ON CONFLICT (id) DO NOTHING;

-- 7. Verify the fix
DO $$
DECLARE
  user_count integer;
  profile_count integer;
BEGIN
  SELECT COUNT(*) INTO user_count FROM auth.users;
  SELECT COUNT(*) INTO profile_count FROM public.user_profiles;
  
  RAISE NOTICE 'Total auth users: %', user_count;
  RAISE NOTICE 'Total user profiles: %', profile_count;
  
  IF user_count != profile_count THEN
    RAISE WARNING 'User count mismatch! Some users may not have profiles.';
  ELSE
    RAISE NOTICE 'All users have profiles. Fix successful!';
  END IF;
END $$;