-- FIX: Referral signup errors preventing user creation
-- This script fixes the database triggers to prevent referral errors from blocking user signups
-- Run this in Supabase SQL Editor

-- STEP 1: Fix the track_referral_signup function to handle errors gracefully
CREATE OR REPLACE FUNCTION track_referral_signup()
RETURNS TRIGGER AS $$
DECLARE
  referrer_user_id UUID;
  ref_code TEXT;
BEGIN
  -- Wrap everything in exception handling so user creation never fails
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
        );

        RAISE LOG 'Referral tracked: user % referred by % using code %', NEW.id, referrer_user_id, ref_code;
      ELSE
        -- Invalid referral code - log but don't fail
        RAISE WARNING 'Invalid referral code % for user %', ref_code, NEW.id;
      END IF;
    END IF;

  EXCEPTION
    WHEN OTHERS THEN
      -- Log error but NEVER fail user creation
      RAISE WARNING 'Failed to track referral for user %: % (SQLSTATE: %)', NEW.id, SQLERRM, SQLSTATE;
  END;

  -- Always return NEW to allow user creation to proceed
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 2: Recreate the trigger to ensure it uses the updated function
DROP TRIGGER IF EXISTS trigger_track_referral_signup ON auth.users;
CREATE TRIGGER trigger_track_referral_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION track_referral_signup();

-- STEP 3: Also make the referral code creation trigger more resilient
CREATE OR REPLACE FUNCTION create_referral_code_for_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Wrap in exception handling to prevent user creation failure
  BEGIN
    -- Generate and insert referral code for the new user
    INSERT INTO referral_codes (user_id, referral_code)
    VALUES (NEW.id, generate_referral_code());

    RAISE LOG 'Referral code created for user %', NEW.id;

  EXCEPTION
    WHEN unique_violation THEN
      -- User already has a referral code (shouldn't happen, but handle it)
      RAISE WARNING 'Referral code already exists for user %', NEW.id;
    WHEN OTHERS THEN
      -- Log error but don't fail user creation
      RAISE WARNING 'Failed to create referral code for user %: % (SQLSTATE: %)', NEW.id, SQLERRM, SQLSTATE;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 4: Recreate the referral code trigger
DROP TRIGGER IF EXISTS trigger_create_referral_code ON auth.users;
CREATE TRIGGER trigger_create_referral_code
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_referral_code_for_user();

-- STEP 5: Verify the reward_status column exists (should be added by referral_rewards_system.sql)
-- This ensures the INSERT statement above won't fail
DO $$
BEGIN
  -- Check if reward_status column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'referrals'
    AND column_name = 'reward_status'
  ) THEN
    -- Add the column if it doesn't exist
    ALTER TABLE referrals
    ADD COLUMN reward_status TEXT DEFAULT 'pending'
    CHECK (reward_status IN ('pending', 'processing', 'completed', 'failed'));

    RAISE NOTICE 'Added reward_status column to referrals table';
  ELSE
    RAISE NOTICE 'reward_status column already exists';
  END IF;
END $$;

-- STEP 6: Update any existing referrals that have 'completed' status but should be 'pending'
-- (Referrals should only be 'completed' after Discord username is added)
UPDATE referrals
SET status = 'pending'
WHERE status = 'completed'
  AND reward_status = 'pending'
  AND referred_user_id IN (
    SELECT id FROM user_profiles
    WHERE discord_username IS NULL OR discord_username = ''
  );

-- STEP 7: Verification query - check that triggers exist and are active
DO $$
DECLARE
  v_track_trigger_exists BOOLEAN;
  v_create_trigger_exists BOOLEAN;
BEGIN
  -- Check track referral trigger
  SELECT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'trigger_track_referral_signup'
  ) INTO v_track_trigger_exists;

  -- Check create referral code trigger
  SELECT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'trigger_create_referral_code'
  ) INTO v_create_trigger_exists;

  IF v_track_trigger_exists AND v_create_trigger_exists THEN
    RAISE NOTICE '✓ All referral triggers are active and fixed';
  ELSE
    RAISE WARNING '✗ Some triggers are missing! Track: %, Create: %',
      v_track_trigger_exists, v_create_trigger_exists;
  END IF;
END $$;

-- STEP 8: Test query - you can use this to verify the fix worked
-- Uncomment and run after applying the fix:
/*
SELECT
  'Total users' as metric,
  COUNT(*)::text as value
FROM auth.users
UNION ALL
SELECT
  'Users with referral codes',
  COUNT(*)::text
FROM referral_codes
UNION ALL
SELECT
  'Total referrals',
  COUNT(*)::text
FROM referrals
UNION ALL
SELECT
  'Pending referrals',
  COUNT(*)::text
FROM referrals
WHERE status = 'pending';
*/

RAISE NOTICE '====================================';
RAISE NOTICE 'Referral signup fix completed successfully!';
RAISE NOTICE '====================================';
RAISE NOTICE 'Changes made:';
RAISE NOTICE '1. Added exception handling to prevent user creation failures';
RAISE NOTICE '2. Changed referral status from "completed" to "pending"';
RAISE NOTICE '3. Added reward_status column to INSERT statements';
RAISE NOTICE '4. Made both referral triggers more resilient';
RAISE NOTICE '====================================';
RAISE NOTICE 'Next: Test signup with referral link to verify fix';
