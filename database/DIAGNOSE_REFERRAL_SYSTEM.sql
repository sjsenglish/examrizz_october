-- DIAGNOSTIC SCRIPT: Check Referral System Status
-- Run this in Supabase SQL Editor to see what's actually in your database

-- ============================================================================
-- PART 1: Check if reward columns exist in referrals table
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '============================================';
  RAISE NOTICE 'PART 1: CHECKING REFERRALS TABLE COLUMNS';
  RAISE NOTICE '============================================';

  -- Check for reward_status column
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'referrals'
    AND column_name = 'reward_status'
  ) THEN
    RAISE NOTICE '✓ reward_status column EXISTS';
  ELSE
    RAISE WARNING '✗ reward_status column MISSING';
  END IF;

  -- Check for referrer_rewarded_at column
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'referrals'
    AND column_name = 'referrer_rewarded_at'
  ) THEN
    RAISE NOTICE '✓ referrer_rewarded_at column EXISTS';
  ELSE
    RAISE WARNING '✗ referrer_rewarded_at column MISSING';
  END IF;

  -- Check for referred_rewarded_at column
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'referrals'
    AND column_name = 'referred_rewarded_at'
  ) THEN
    RAISE NOTICE '✓ referred_rewarded_at column EXISTS';
  ELSE
    RAISE WARNING '✗ referred_rewarded_at column MISSING';
  END IF;
END $$;

-- ============================================================================
-- PART 2: Check if reward functions exist
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'PART 2: CHECKING REWARD FUNCTIONS';
  RAISE NOTICE '============================================';

  -- Check for grant_referral_reward function
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
    AND p.proname = 'grant_referral_reward'
  ) THEN
    RAISE NOTICE '✓ grant_referral_reward() function EXISTS';
  ELSE
    RAISE WARNING '✗ grant_referral_reward() function MISSING';
  END IF;

  -- Check for process_referral_rewards function
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
    AND p.proname = 'process_referral_rewards'
  ) THEN
    RAISE NOTICE '✓ process_referral_rewards() function EXISTS';
  ELSE
    RAISE WARNING '✗ process_referral_rewards() function MISSING';
  END IF;

  -- Check for check_referral_completion function
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
    AND p.proname = 'check_referral_completion'
  ) THEN
    RAISE NOTICE '✓ check_referral_completion() function EXISTS';
  ELSE
    RAISE WARNING '✗ check_referral_completion() function MISSING';
  END IF;
END $$;

-- ============================================================================
-- PART 3: Check if triggers are active
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'PART 3: CHECKING TRIGGERS';
  RAISE NOTICE '============================================';

  -- Check for referral completion trigger on user_profiles
  IF EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'trigger_check_referral_completion'
  ) THEN
    RAISE NOTICE '✓ trigger_check_referral_completion EXISTS on user_profiles';
  ELSE
    RAISE WARNING '✗ trigger_check_referral_completion MISSING';
  END IF;

  -- Check for referral tracking trigger on auth.users
  IF EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'trigger_track_referral_signup'
  ) THEN
    RAISE NOTICE '✓ trigger_track_referral_signup EXISTS on auth.users';
  ELSE
    RAISE WARNING '✗ trigger_track_referral_signup MISSING';
  END IF;
END $$;

-- ============================================================================
-- PART 4: Check actual referral data for the specific user
-- ============================================================================
DO $$
DECLARE
  v_user_id UUID;
  v_has_discord BOOLEAN;
  v_discord_username TEXT;
  v_referral_record RECORD;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'PART 4: CHECKING USER DATA';
  RAISE NOTICE '============================================';

  -- Find the referred user by email
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'seajungson10@gmail.com';

  IF v_user_id IS NULL THEN
    RAISE WARNING '✗ User with email seajungson10@gmail.com NOT FOUND in auth.users';
    RETURN;
  ELSE
    RAISE NOTICE '✓ Found user with email seajungson10@gmail.com';
    RAISE NOTICE '  User ID: %', v_user_id;
  END IF;

  -- Check user profile
  SELECT
    discord_username,
    CASE WHEN discord_username IS NOT NULL AND discord_username != '' THEN TRUE ELSE FALSE END
  INTO v_discord_username, v_has_discord
  FROM user_profiles
  WHERE id = v_user_id;

  IF FOUND THEN
    RAISE NOTICE '✓ User profile exists';
    RAISE NOTICE '  Discord username: %', COALESCE(v_discord_username, 'NULL or empty');
    RAISE NOTICE '  Has Discord: %', v_has_discord;
  ELSE
    RAISE WARNING '✗ User profile NOT FOUND';
  END IF;

  -- Check referral records
  FOR v_referral_record IN
    SELECT
      r.id,
      r.referrer_id,
      r.referred_user_id,
      r.status,
      r.created_at,
      r.completed_at,
      u.email as referrer_email
    FROM referrals r
    JOIN auth.users u ON u.id = r.referrer_id
    WHERE r.referred_user_id = v_user_id
  LOOP
    RAISE NOTICE '';
    RAISE NOTICE '  Referral Record Found:';
    RAISE NOTICE '    Referral ID: %', v_referral_record.id;
    RAISE NOTICE '    Referrer Email: %', v_referral_record.referrer_email;
    RAISE NOTICE '    Status: %', v_referral_record.status;
    RAISE NOTICE '    Created: %', v_referral_record.created_at;
    RAISE NOTICE '    Completed: %', COALESCE(v_referral_record.completed_at::TEXT, 'NULL');

    -- Try to check reward_status if column exists
    BEGIN
      EXECUTE format('SELECT reward_status FROM referrals WHERE id = %L', v_referral_record.id)
      INTO v_referral_record;
      RAISE NOTICE '    Reward Status: %', v_referral_record.reward_status;
    EXCEPTION WHEN undefined_column THEN
      RAISE NOTICE '    Reward Status: Column does not exist';
    END;
  END LOOP;

  IF NOT FOUND THEN
    RAISE WARNING '✗ No referral records found for this user';
  END IF;

END $$;

-- ============================================================================
-- PART 5: Check subscription table for both users
-- ============================================================================
DO $$
DECLARE
  v_referred_user_id UUID;
  v_referrer_user_id UUID;
  v_referred_tier TEXT;
  v_referrer_tier TEXT;
  v_referral_record RECORD;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'PART 5: CHECKING SUBSCRIPTION STATUS';
  RAISE NOTICE '============================================';

  -- Get referred user ID
  SELECT id INTO v_referred_user_id
  FROM auth.users
  WHERE email = 'seajungson10@gmail.com';

  IF v_referred_user_id IS NULL THEN
    RAISE WARNING 'Cannot check subscriptions - referred user not found';
    RETURN;
  END IF;

  -- Get referrer user ID from referral record
  SELECT referrer_id INTO v_referrer_user_id
  FROM referrals
  WHERE referred_user_id = v_referred_user_id
  LIMIT 1;

  IF v_referrer_user_id IS NULL THEN
    RAISE WARNING 'Cannot check subscriptions - no referral record found';
    RETURN;
  END IF;

  -- Check referred user subscription
  SELECT subscription_tier INTO v_referred_tier
  FROM user_subscriptions
  WHERE user_id = v_referred_user_id;

  IF FOUND THEN
    RAISE NOTICE 'Referred user subscription tier: %', v_referred_tier;
  ELSE
    RAISE WARNING 'Referred user has NO subscription record';
  END IF;

  -- Check referrer subscription
  SELECT subscription_tier INTO v_referrer_tier
  FROM user_subscriptions
  WHERE user_id = v_referrer_user_id;

  IF FOUND THEN
    RAISE NOTICE 'Referrer subscription tier: %', v_referrer_tier;
  ELSE
    RAISE WARNING 'Referrer has NO subscription record';
  END IF;

END $$;

-- ============================================================================
-- SUMMARY
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'DIAGNOSTIC COMPLETE';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'Please review the output above to identify missing components.';
  RAISE NOTICE 'Look for any lines with ✗ or WARNING.';
END $$;
