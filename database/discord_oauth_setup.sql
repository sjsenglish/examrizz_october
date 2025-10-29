-- Discord OAuth setup for user_profiles table
-- Run this in Supabase SQL Editor

-- Add Discord columns to user_profiles if they don't exist
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS discord_id text UNIQUE,
ADD COLUMN IF NOT EXISTS discord_username text,
ADD COLUMN IF NOT EXISTS discord_avatar text,
ADD COLUMN IF NOT EXISTS discord_discriminator text,
ADD COLUMN IF NOT EXISTS discord_linked_at timestamp with time zone;

-- Create index for Discord ID lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_discord_id ON user_profiles(discord_id);

-- Function to handle Discord OAuth data after successful authentication
CREATE OR REPLACE FUNCTION handle_discord_auth()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if this is a Discord OAuth login
  IF NEW.raw_app_meta_data->>'provider' = 'discord' THEN
    -- Update or insert Discord data in user_profiles
    INSERT INTO user_profiles (
      id,
      discord_id,
      discord_username,
      discord_avatar,
      discord_discriminator,
      discord_linked_at
    ) VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'provider_id',
      NEW.raw_user_meta_data->>'username',
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'discriminator',
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      discord_id = NEW.raw_user_meta_data->>'provider_id',
      discord_username = NEW.raw_user_meta_data->>'username',
      discord_avatar = NEW.raw_user_meta_data->>'avatar_url',
      discord_discriminator = NEW.raw_user_meta_data->>'discriminator',
      discord_linked_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to handle Discord OAuth data
DROP TRIGGER IF EXISTS on_auth_user_created_discord ON auth.users;
CREATE TRIGGER on_auth_user_created_discord
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_discord_auth();

-- Update existing user_profiles to create entries for users who don't have them
INSERT INTO user_profiles (id)
SELECT id FROM auth.users 
WHERE id NOT IN (SELECT id FROM user_profiles)
ON CONFLICT (id) DO NOTHING;