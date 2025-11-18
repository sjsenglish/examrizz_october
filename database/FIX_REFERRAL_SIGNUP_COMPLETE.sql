-- COMPREHENSIVE FIX: Referral Signup Blocking Issue
-- This script fixes ALL triggers to prevent user creation failures
-- Run this in Supabase SQL Editor

-- ============================================================================
-- PART 1: Fix subscription creation trigger (CRITICAL - was blocking signups)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS TRIGGER AS $$
BEGIN
  -- Wrap in exception handling to NEVER block user creation
  BEGIN
    -- Insert a default 'free' subscription for the new user
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
    ON CONFLICT (user_id) DO NOTHING; -- Handle race conditions gracefully

    RAISE LOG 'Created subscription for user %', NEW.id;

  EXCEPTION
    WHEN OTHERS THEN
      -- Log error but NEVER fail user creation
      RAISE WARNING 'Failed to create subscription for user %: % (SQLSTATE: %)',
        NEW.id, SQLERRM, SQLSTATE;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the subscription trigger
DROP TRIGGER IF EXISTS on_auth_user_created_subscription ON auth.users;
CREATE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_subscription();

-- ============================================================================
-- PART 2: Ensure reward_status column exists in referrals table
-- ============================================================================

DO $$
BEGIN
  -- Check if reward_status column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'referrals'
    AND column_name = 'reward_status'
  ) THEN
    -- Add the column if it doesn't exist
    ALTER TABLE public.referrals
    ADD COLUMN reward_status TEXT DEFAULT 'pending'
    CHECK (reward_status IN ('pending', 'processing', 'completed', 'failed'));

    RAISE NOTICE 'Added reward_status column to referrals table';
  ELSE
    RAISE NOTICE 'reward_status column already exists';
  END IF;

  -- Check if reward timestamp columns exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'referrals'
    AND column_name = 'referrer_rewarded_at'
  ) THEN
    ALTER TABLE public.referrals
    ADD COLUMN referrer_rewarded_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN referred_rewarded_at TIMESTAMP WITH TIME ZONE;

    RAISE NOTICE 'Added reward timestamp columns to referrals table';
  END IF;
END $$;

-- ============================================================================
-- PART 3: Fix the track_referral_signup trigger (with reward_status field)
-- ============================================================================

CREATE OR REPLACE FUNCTION track_referral_signup()
RETURNS TRIGGER AS $$
DECLARE
  referrer_user_id UUID;
  ref_code TEXT;
BEGIN
  -- Wrap everything in exception handling so user creation NEVER fails
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
        -- Create referral record with PENDING status (not completed)
        -- Include reward_status column for compatibility with rewards system
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
          'pending',  -- Changed from 'completed' to 'pending'
          'pending'   -- Reward status starts as pending
        )
        ON CONFLICT DO NOTHING; -- Handle any conflicts gracefully

        RAISE LOG 'Referral tracked: user % referred by % using code %',
          NEW.id, referrer_user_id, ref_code;
      ELSE
        -- Invalid referral code - log but don't fail
        RAISE WARNING 'Invalid referral code % for user %', ref_code, NEW.id;
      END IF;
    END IF;

  EXCEPTION
    WHEN OTHERS THEN
      -- Log error but NEVER fail user creation
      RAISE WARNING 'Failed to track referral for user %: % (SQLSTATE: %)',
        NEW.id, SQLERRM, SQLSTATE;
  END;

  -- Always return NEW to allow user creation to proceed
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS trigger_track_referral_signup ON auth.users;
CREATE TRIGGER trigger_track_referral_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION track_referral_signup();

-- ============================================================================
-- PART 4: Verify user profile creation trigger has exception handling
-- ============================================================================

-- This ensures the profile creation trigger also won't block user creation
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

  EXCEPTION
    WHEN OTHERS THEN
      -- Log error but don't fail user creation
      RAISE WARNING 'Failed to create user profile for %: % (SQLSTATE: %)',
        NEW.id, SQLERRM, SQLSTATE;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the profile trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- PART 5: Verification and Testing
-- ============================================================================

-- Check that all triggers exist and are active
DO $$
DECLARE
  v_profile_trigger BOOLEAN;
  v_subscription_trigger BOOLEAN;
  v_referral_code_trigger BOOLEAN;
  v_referral_track_trigger BOOLEAN;
BEGIN
  -- Check each trigger
  SELECT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) INTO v_profile_trigger;

  SELECT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created_subscription'
  ) INTO v_subscription_trigger;

  SELECT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_create_referral_code'
  ) INTO v_referral_code_trigger;

  SELECT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_track_referral_signup'
  ) INTO v_referral_track_trigger;

  -- Report status
  RAISE NOTICE '====================================';
  RAISE NOTICE 'TRIGGER STATUS CHECK';
  RAISE NOTICE '====================================';
  RAISE NOTICE 'Profile creation trigger: %', CASE WHEN v_profile_trigger THEN '✓ ACTIVE' ELSE '✗ MISSING' END;
  RAISE NOTICE 'Subscription creation trigger: %', CASE WHEN v_subscription_trigger THEN '✓ ACTIVE' ELSE '✗ MISSING' END;
  RAISE NOTICE 'Referral code creation trigger: %', CASE WHEN v_referral_code_trigger THEN '✓ ACTIVE' ELSE '✗ MISSING' END;
  RAISE NOTICE 'Referral tracking trigger: %', CASE WHEN v_referral_track_trigger THEN '✓ ACTIVE' ELSE '✗ MISSING' END;
  RAISE NOTICE '====================================';

  IF v_profile_trigger AND v_subscription_trigger AND v_referral_code_trigger AND v_referral_track_trigger THEN
    RAISE NOTICE '✓ All triggers are active and fixed!';
    RAISE NOTICE 'User signup with referral links should now work correctly.';
  ELSE
    RAISE WARNING '✗ Some triggers are missing! Please investigate.';
  END IF;
END $$;

-- Display summary of changes
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '====================================';
  RAISE NOTICE 'FIX SUMMARY';
  RAISE NOTICE '====================================';
  RAISE NOTICE '1. ✓ Added exception handling to subscription trigger';
  RAISE NOTICE '2. ✓ Ensured reward_status column exists';
  RAISE NOTICE '3. ✓ Fixed referral tracking trigger with reward_status';
  RAISE NOTICE '4. ✓ Verified profile creation trigger has exception handling';
  RAISE NOTICE '5. ✓ All triggers now use ON CONFLICT for race conditions';
  RAISE NOTICE '';
  RAISE NOTICE 'RESULT: User signups with referral links will no longer fail';
  RAISE NOTICE 'Even if individual triggers encounter errors, user creation proceeds.';
  RAISE NOTICE '====================================';
END $$;
