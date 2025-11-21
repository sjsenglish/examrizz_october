-- FIX STUCK REFERRALS - Manual Reward Processing
-- Run this in Supabase SQL Editor to process all pending referrals with Discord usernames

-- ============================================================================
-- STEP 1: Show all stuck referrals that should be processed
-- ============================================================================
DO $$
DECLARE
  v_stuck_count INTEGER;
BEGIN
  RAISE NOTICE '============================================';
  RAISE NOTICE 'FINDING STUCK REFERRALS';
  RAISE NOTICE '============================================';
  RAISE NOTICE '';

  -- Count stuck referrals
  SELECT COUNT(*)
  INTO v_stuck_count
  FROM referrals r
  INNER JOIN user_profiles up ON up.id = r.referred_user_id
  WHERE r.status = 'pending'
    AND (up.discord_username IS NOT NULL AND up.discord_username != '');

  RAISE NOTICE 'Found % stuck referral(s) ready to process', v_stuck_count;
  RAISE NOTICE '';
END $$;

-- Show details of stuck referrals
SELECT
  r.id as referral_id,
  referrer.email as referrer_email,
  referred.email as referred_email,
  up.discord_username,
  r.created_at,
  r.status,
  COALESCE(r.reward_status, 'no_column') as reward_status
FROM referrals r
INNER JOIN auth.users referrer ON referrer.id = r.referrer_id
INNER JOIN auth.users referred ON referred.id = r.referred_user_id
INNER JOIN user_profiles up ON up.id = r.referred_user_id
WHERE r.status = 'pending'
  AND (up.discord_username IS NOT NULL AND up.discord_username != '')
ORDER BY r.created_at;

-- ============================================================================
-- STEP 2: Process rewards for all stuck referrals
-- ============================================================================
DO $$
DECLARE
  v_referral RECORD;
  v_success BOOLEAN;
  v_processed_count INTEGER := 0;
  v_failed_count INTEGER := 0;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'PROCESSING STUCK REFERRALS';
  RAISE NOTICE '============================================';
  RAISE NOTICE '';

  -- Loop through all stuck referrals
  FOR v_referral IN
    SELECT
      r.id,
      r.referrer_id,
      r.referred_user_id,
      referrer.email as referrer_email,
      referred.email as referred_email,
      up.discord_username
    FROM referrals r
    INNER JOIN auth.users referrer ON referrer.id = r.referrer_id
    INNER JOIN auth.users referred ON referred.id = r.referred_user_id
    INNER JOIN user_profiles up ON up.id = r.referred_user_id
    WHERE r.status = 'pending'
      AND (up.discord_username IS NOT NULL AND up.discord_username != '')
  LOOP
    BEGIN
      RAISE NOTICE 'Processing referral: % → %',
        v_referral.referrer_email,
        v_referral.referred_email;

      -- Call the reward processing function
      SELECT process_referral_rewards(v_referral.id) INTO v_success;

      IF v_success THEN
        v_processed_count := v_processed_count + 1;
        RAISE NOTICE '  ✓ SUCCESS: Rewards granted to both users';
      ELSE
        v_failed_count := v_failed_count + 1;
        RAISE NOTICE '  ✗ FAILED: Reward processing returned false';
      END IF;

    EXCEPTION
      WHEN OTHERS THEN
        v_failed_count := v_failed_count + 1;
        RAISE WARNING '  ✗ ERROR: % (SQLSTATE: %)', SQLERRM, SQLSTATE;
    END;

    RAISE NOTICE '';
  END LOOP;

  RAISE NOTICE '============================================';
  RAISE NOTICE 'PROCESSING COMPLETE';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'Successfully processed: %', v_processed_count;
  RAISE NOTICE 'Failed: %', v_failed_count;
  RAISE NOTICE '';
END $$;

-- ============================================================================
-- STEP 3: Verify the results - check subscription tiers
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '============================================';
  RAISE NOTICE 'VERIFICATION: Checking Subscription Tiers';
  RAISE NOTICE '============================================';
  RAISE NOTICE '';
END $$;

-- Show subscription status for users involved in referrals
SELECT
  u.email,
  CASE
    WHEN r_referrer.id IS NOT NULL THEN 'Referrer'
    WHEN r_referred.id IS NOT NULL THEN 'Referred User'
  END as role,
  us.subscription_tier,
  us.subscription_status,
  us.current_period_end
FROM auth.users u
LEFT JOIN user_subscriptions us ON us.user_id = u.id
LEFT JOIN referrals r_referrer ON r_referrer.referrer_id = u.id
LEFT JOIN referrals r_referred ON r_referred.referred_user_id = u.id
WHERE r_referrer.id IS NOT NULL OR r_referred.id IS NOT NULL
ORDER BY u.email;

-- ============================================================================
-- STEP 4: Show final referral status
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'FINAL REFERRAL STATUS';
  RAISE NOTICE '============================================';
  RAISE NOTICE '';
END $$;

-- Show updated referral status
SELECT
  r.id as referral_id,
  referrer.email as referrer_email,
  referred.email as referred_email,
  r.status,
  COALESCE(r.reward_status, 'no_column') as reward_status,
  r.referrer_rewarded_at IS NOT NULL as referrer_rewarded,
  r.referred_rewarded_at IS NOT NULL as referred_rewarded
FROM referrals r
INNER JOIN auth.users referrer ON referrer.id = r.referrer_id
INNER JOIN auth.users referred ON referred.id = r.referred_user_id
ORDER BY r.created_at DESC
LIMIT 20;

-- Summary counts
SELECT
  COUNT(*) FILTER (WHERE status = 'completed') as completed_referrals,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_referrals,
  COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_referrals,
  COUNT(*) as total_referrals
FROM referrals;
