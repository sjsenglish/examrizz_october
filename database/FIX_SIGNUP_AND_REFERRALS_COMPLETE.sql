-- ============================================================================
-- COMPREHENSIVE FIX: Signup Process and Referral System
-- This script fixes all issues with user signup and referral tracking
-- Run this in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- PART 1: Ensure all required tables and columns exist
-- ============================================================================

-- Ensure referral_codes table exists
CREATE TABLE IF NOT EXISTS referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Ensure referrals table exists with all required columns
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  referred_email TEXT,
  referral_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  reward_status TEXT DEFAULT 'pending',
  referrer_rewarded_at TIMESTAMP WITH TIME ZONE,
  referred_rewarded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT valid_status CHECK (status IN ('pending', 'completed', 'cancelled')),
  CONSTRAINT valid_reward_status CHECK (reward_status IN ('pending', 'processing', 'completed', 'failed'))
);

-- Add reward_status columns if they don't exist (for existing tables)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'referrals'
    AND column_name = 'reward_status'
  ) THEN
    ALTER TABLE public.referrals
    ADD COLUMN reward_status TEXT DEFAULT 'pending'
    CHECK (reward_status IN ('pending', 'processing', 'completed', 'failed'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'referrals'
    AND column_name = 'referrer_rewarded_at'
  ) THEN
    ALTER TABLE public.referrals
    ADD COLUMN referrer_rewarded_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN referred_rewarded_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_referral_codes_user_id ON referral_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON referral_codes(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_user_id ON referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);

-- ============================================================================
-- PART 2: Create/Update Referral Code Generation Function
-- ============================================================================

CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate a random 8-character alphanumeric code
    code := UPPER(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8));

    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM referral_codes WHERE referral_code = code) INTO code_exists;

    -- Exit loop if code is unique
    EXIT WHEN NOT code_exists;
  END LOOP;

  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PART 3: Create/Update User Profile Creation Trigger
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  provider text;
  user_meta jsonb;
BEGIN
  BEGIN
    -- Get provider and user metadata
    provider := NEW.raw_app_meta_data->>'provider';
    user_meta := NEW.raw_user_meta_data;

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
      email = COALESCE(user_profiles.email, EXCLUDED.email),
      full_name = COALESCE(user_profiles.full_name, EXCLUDED.full_name),
      discord_id = COALESCE(user_profiles.discord_id, EXCLUDED.discord_id),
      discord_username = COALESCE(user_profiles.discord_username, EXCLUDED.discord_username),
      discord_avatar = COALESCE(user_profiles.discord_avatar, EXCLUDED.discord_avatar),
      discord_discriminator = COALESCE(user_profiles.discord_discriminator, EXCLUDED.discord_discriminator),
      discord_linked_at = COALESCE(user_profiles.discord_linked_at, EXCLUDED.discord_linked_at),
      updated_at = NOW();

    RAISE LOG 'Successfully created/updated profile for user %', NEW.id;

  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'Failed to create user profile for %: % (SQLSTATE: %)',
        NEW.id, SQLERRM, SQLSTATE;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- PART 4: Create/Update Subscription Creation Trigger
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS TRIGGER AS $$
BEGIN
  BEGIN
    INSERT INTO public.user_subscriptions (
      user_id,
      subscription_tier,
      subscription_status,
      cancel_at_period_end
    ) VALUES (
      NEW.id,
      'free',
      'active',
      false
    )
    ON CONFLICT (user_id) DO NOTHING;

    RAISE LOG 'Created subscription for user %', NEW.id;

  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'Failed to create subscription for user %: % (SQLSTATE: %)',
        NEW.id, SQLERRM, SQLSTATE;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created_subscription ON auth.users;
CREATE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_subscription();

-- ============================================================================
-- PART 5: Create/Update Referral Code Generation Trigger
-- ============================================================================

CREATE OR REPLACE FUNCTION create_referral_code_for_user()
RETURNS TRIGGER AS $$
BEGIN
  BEGIN
    -- Generate and insert referral code for the new user
    INSERT INTO referral_codes (user_id, referral_code)
    VALUES (NEW.id, generate_referral_code())
    ON CONFLICT (user_id) DO NOTHING;

    RAISE LOG 'Referral code created for user %', NEW.id;

  EXCEPTION
    WHEN unique_violation THEN
      RAISE WARNING 'Referral code already exists for user %', NEW.id;
    WHEN OTHERS THEN
      RAISE WARNING 'Failed to create referral code for user %: % (SQLSTATE: %)', NEW.id, SQLERRM, SQLSTATE;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS trigger_create_referral_code ON auth.users;
CREATE TRIGGER trigger_create_referral_code
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_referral_code_for_user();

-- ============================================================================
-- PART 6: Create/Update Referral Tracking Trigger
-- ============================================================================

CREATE OR REPLACE FUNCTION track_referral_signup()
RETURNS TRIGGER AS $$
DECLARE
  referrer_user_id UUID;
  ref_code TEXT;
BEGIN
  BEGIN
    -- Check if user metadata contains referral code
    ref_code := NEW.raw_user_meta_data->>'referral_code';

    -- Only proceed if referral code exists
    IF ref_code IS NOT NULL AND ref_code != '' THEN
      -- Find the referrer user ID
      SELECT user_id INTO referrer_user_id
      FROM referral_codes
      WHERE referral_code = ref_code;

      -- Only create referral record if valid referrer found
      IF referrer_user_id IS NOT NULL THEN
        INSERT INTO referrals (
          referrer_id,
          referred_user_id,
          referred_email,
          referral_code,
          status,
          reward_status
        )
        VALUES (
          referrer_user_id,
          NEW.id,
          NEW.email,
          ref_code,
          'pending',
          'pending'
        )
        ON CONFLICT DO NOTHING;

        RAISE LOG 'Referral tracked: user % referred by % using code %',
          NEW.id, referrer_user_id, ref_code;
      ELSE
        RAISE WARNING 'Invalid referral code % for user %', ref_code, NEW.id;
      END IF;
    END IF;

  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'Failed to track referral for user %: % (SQLSTATE: %)',
        NEW.id, SQLERRM, SQLSTATE;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS trigger_track_referral_signup ON auth.users;
CREATE TRIGGER trigger_track_referral_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION track_referral_signup();

-- ============================================================================
-- PART 7: Fix Missing Referral Codes for Existing Users
-- ============================================================================

-- Generate referral codes for users who don't have one
INSERT INTO referral_codes (user_id, referral_code)
SELECT
  u.id,
  generate_referral_code()
FROM auth.users u
LEFT JOIN referral_codes rc ON rc.user_id = u.id
WHERE rc.id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- ============================================================================
-- PART 8: Enable RLS and Create Policies
-- ============================================================================

ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own referral code" ON referral_codes;
DROP POLICY IF EXISTS "Users can read own referrals" ON referrals;
DROP POLICY IF EXISTS "Service role can manage all referral codes" ON referral_codes;
DROP POLICY IF EXISTS "Service role can manage all referrals" ON referrals;

-- Recreate policies
CREATE POLICY "Users can read own referral code"
  ON referral_codes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read own referrals"
  ON referrals FOR SELECT
  USING (auth.uid() = referrer_id);

CREATE POLICY "Service role can manage all referral codes"
  ON referral_codes FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role can manage all referrals"
  ON referrals FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- Grant permissions
GRANT SELECT ON referral_codes TO authenticated;
GRANT SELECT ON referrals TO authenticated;

-- ============================================================================
-- PART 9: Verification
-- ============================================================================

DO $$
DECLARE
  v_profile_trigger BOOLEAN;
  v_subscription_trigger BOOLEAN;
  v_referral_code_trigger BOOLEAN;
  v_referral_track_trigger BOOLEAN;
  v_total_users INT;
  v_users_with_codes INT;
  v_users_without_codes INT;
BEGIN
  -- Check triggers
  SELECT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') INTO v_profile_trigger;
  SELECT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created_subscription') INTO v_subscription_trigger;
  SELECT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_create_referral_code') INTO v_referral_code_trigger;
  SELECT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_track_referral_signup') INTO v_referral_track_trigger;

  -- Check user counts
  SELECT COUNT(*) INTO v_total_users FROM auth.users;
  SELECT COUNT(DISTINCT user_id) INTO v_users_with_codes FROM referral_codes;
  v_users_without_codes := v_total_users - v_users_with_codes;

  -- Report status
  RAISE NOTICE '========================================';
  RAISE NOTICE 'SIGNUP & REFERRAL SYSTEM STATUS';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'TRIGGERS:';
  RAISE NOTICE '  Profile creation: %', CASE WHEN v_profile_trigger THEN '✓ ACTIVE' ELSE '✗ MISSING' END;
  RAISE NOTICE '  Subscription creation: %', CASE WHEN v_subscription_trigger THEN '✓ ACTIVE' ELSE '✗ MISSING' END;
  RAISE NOTICE '  Referral code creation: %', CASE WHEN v_referral_code_trigger THEN '✓ ACTIVE' ELSE '✗ MISSING' END;
  RAISE NOTICE '  Referral tracking: %', CASE WHEN v_referral_track_trigger THEN '✓ ACTIVE' ELSE '✗ MISSING' END;
  RAISE NOTICE '';
  RAISE NOTICE 'REFERRAL CODES:';
  RAISE NOTICE '  Total users: %', v_total_users;
  RAISE NOTICE '  Users with codes: %', v_users_with_codes;
  RAISE NOTICE '  Users without codes: %', v_users_without_codes;
  RAISE NOTICE '';

  IF v_profile_trigger AND v_subscription_trigger AND v_referral_code_trigger AND v_referral_track_trigger THEN
    IF v_users_without_codes = 0 THEN
      RAISE NOTICE '✓ ALL SYSTEMS OPERATIONAL';
      RAISE NOTICE '  - All triggers active';
      RAISE NOTICE '  - All users have referral codes';
      RAISE NOTICE '  - Email signup will work';
      RAISE NOTICE '  - OAuth signup will work';
      RAISE NOTICE '  - Referral tracking will work';
    ELSE
      RAISE WARNING '⚠ Triggers active but % users still missing referral codes', v_users_without_codes;
    END IF;
  ELSE
    RAISE WARNING '✗ Some triggers are missing! Please investigate.';
  END IF;

  RAISE NOTICE '========================================';
END $$;
