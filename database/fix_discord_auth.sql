-- Fix Discord OAuth authentication issues
-- This script addresses problems with Discord user profile creation and authentication

-- First, let's check and fix the Discord OAuth trigger
DROP TRIGGER IF EXISTS on_auth_user_created_discord ON auth.users;
DROP FUNCTION IF EXISTS handle_discord_auth();

-- Improved Discord OAuth handler function
CREATE OR REPLACE FUNCTION handle_discord_auth()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if this is a Discord OAuth login
  IF NEW.raw_app_meta_data->>'provider' = 'discord' THEN
    -- Insert or update Discord data in user_profiles
    INSERT INTO user_profiles (
      id,
      discord_id,
      discord_username,
      discord_avatar,
      discord_discriminator,
      discord_linked_at,
      email,
      created_at,
      updated_at
    ) VALUES (
      NEW.id,
      COALESCE(
        NEW.raw_user_meta_data->>'provider_id',
        NEW.raw_user_meta_data->>'sub',
        NEW.raw_user_meta_data->>'id'
      ),
      COALESCE(
        NEW.raw_user_meta_data->>'username',
        NEW.raw_user_meta_data->>'global_name',
        NEW.raw_user_meta_data->>'name'
      ),
      COALESCE(
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_user_meta_data->>'picture'
      ),
      NEW.raw_user_meta_data->>'discriminator',
      NOW(),
      NEW.email,
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      discord_id = COALESCE(
        NEW.raw_user_meta_data->>'provider_id',
        NEW.raw_user_meta_data->>'sub',
        NEW.raw_user_meta_data->>'id'
      ),
      discord_username = COALESCE(
        NEW.raw_user_meta_data->>'username',
        NEW.raw_user_meta_data->>'global_name',
        NEW.raw_user_meta_data->>'name'
      ),
      discord_avatar = COALESCE(
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_user_meta_data->>'picture'
      ),
      discord_discriminator = NEW.raw_user_meta_data->>'discriminator',
      discord_linked_at = NOW(),
      email = COALESCE(user_profiles.email, NEW.email),
      updated_at = NOW();
  ELSE
    -- For non-Discord users (Google, etc.), ensure they have a basic profile
    INSERT INTO user_profiles (
      id,
      email,
      created_at,
      updated_at
    ) VALUES (
      NEW.id,
      NEW.email,
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      email = COALESCE(user_profiles.email, NEW.email),
      updated_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created_discord
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_discord_auth();

-- Fix existing Discord users who might be missing profiles
INSERT INTO user_profiles (id, email, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  NOW(),
  NOW()
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.id
WHERE up.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Update existing Discord users with proper Discord data
UPDATE user_profiles 
SET 
  discord_id = COALESCE(
    au.raw_user_meta_data->>'provider_id',
    au.raw_user_meta_data->>'sub',
    au.raw_user_meta_data->>'id'
  ),
  discord_username = COALESCE(
    au.raw_user_meta_data->>'username',
    au.raw_user_meta_data->>'global_name',
    au.raw_user_meta_data->>'name'
  ),
  discord_avatar = COALESCE(
    au.raw_user_meta_data->>'avatar_url',
    au.raw_user_meta_data->>'picture'
  ),
  discord_discriminator = au.raw_user_meta_data->>'discriminator',
  discord_linked_at = NOW(),
  updated_at = NOW()
FROM auth.users au
WHERE user_profiles.id = au.id 
  AND au.raw_app_meta_data->>'provider' = 'discord'
  AND user_profiles.discord_id IS NULL;

-- Create a function to manually fix any Discord user who is having auth issues
CREATE OR REPLACE FUNCTION fix_discord_user_profile(user_email text)
RETURNS BOOLEAN AS $$
DECLARE
  user_record auth.users%ROWTYPE;
  profile_exists BOOLEAN;
BEGIN
  -- Find the user
  SELECT * INTO user_record FROM auth.users WHERE email = user_email;
  
  IF NOT FOUND THEN
    RAISE NOTICE 'User with email % not found', user_email;
    RETURN FALSE;
  END IF;
  
  -- Check if profile exists
  SELECT EXISTS(SELECT 1 FROM user_profiles WHERE id = user_record.id) INTO profile_exists;
  
  IF NOT profile_exists THEN
    -- Create profile
    INSERT INTO user_profiles (
      id,
      email,
      discord_id,
      discord_username,
      discord_avatar,
      discord_discriminator,
      discord_linked_at,
      created_at,
      updated_at
    ) VALUES (
      user_record.id,
      user_record.email,
      COALESCE(
        user_record.raw_user_meta_data->>'provider_id',
        user_record.raw_user_meta_data->>'sub',
        user_record.raw_user_meta_data->>'id'
      ),
      COALESCE(
        user_record.raw_user_meta_data->>'username',
        user_record.raw_user_meta_data->>'global_name',
        user_record.raw_user_meta_data->>'name'
      ),
      COALESCE(
        user_record.raw_user_meta_data->>'avatar_url',
        user_record.raw_user_meta_data->>'picture'
      ),
      user_record.raw_user_meta_data->>'discriminator',
      NOW(),
      NOW(),
      NOW()
    );
    
    RAISE NOTICE 'Created profile for Discord user %', user_email;
    RETURN TRUE;
  ELSE
    -- Update existing profile with Discord data
    UPDATE user_profiles 
    SET 
      discord_id = COALESCE(
        user_record.raw_user_meta_data->>'provider_id',
        user_record.raw_user_meta_data->>'sub',
        user_record.raw_user_meta_data->>'id'
      ),
      discord_username = COALESCE(
        user_record.raw_user_meta_data->>'username',
        user_record.raw_user_meta_data->>'global_name',
        user_record.raw_user_meta_data->>'name'
      ),
      discord_avatar = COALESCE(
        user_record.raw_user_meta_data->>'avatar_url',
        user_record.raw_user_meta_data->>'picture'
      ),
      discord_discriminator = user_record.raw_user_meta_data->>'discriminator',
      discord_linked_at = NOW(),
      updated_at = NOW()
    WHERE id = user_record.id;
    
    RAISE NOTICE 'Updated Discord data for user %', user_email;
    RETURN TRUE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;