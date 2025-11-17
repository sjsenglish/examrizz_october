-- Referral Rewards System - Complete Implementation
-- This script adds reward tracking and auto-application of Plus tier for successful referrals

-- Step 1: Add reward tracking fields to referrals table
ALTER TABLE referrals
ADD COLUMN IF NOT EXISTS referrer_rewarded_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS referred_rewarded_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS reward_status TEXT DEFAULT 'pending' CHECK (reward_status IN ('pending', 'processing', 'completed', 'failed'));

-- Add index for reward status queries
CREATE INDEX IF NOT EXISTS idx_referrals_reward_status ON referrals(reward_status);

-- Step 2: Create function to grant Plus tier for 1 month
CREATE OR REPLACE FUNCTION grant_referral_reward(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_current_tier TEXT;
  v_current_status TEXT;
  v_current_period_end TIMESTAMP WITH TIME ZONE;
  v_new_period_end TIMESTAMP WITH TIME ZONE;
  v_subscription_exists BOOLEAN;
BEGIN
  -- Check if user has a subscription record
  SELECT
    subscription_tier,
    subscription_status,
    current_period_end
  INTO
    v_current_tier,
    v_current_status,
    v_current_period_end
  FROM user_subscriptions
  WHERE user_id = p_user_id;

  v_subscription_exists := FOUND;

  -- If no subscription exists, this shouldn't happen (trigger should create it)
  -- but we'll handle it gracefully
  IF NOT v_subscription_exists THEN
    RAISE WARNING 'No subscription found for user %, skipping reward', p_user_id;
    RETURN FALSE;
  END IF;

  -- Determine the new period end date
  -- If user is free tier or expired, start from now
  -- If user has active Plus/Max, extend their current period
  IF v_current_tier = 'free' OR v_current_period_end IS NULL OR v_current_period_end < NOW() THEN
    -- User is free or expired - give them 1 month from now
    v_new_period_end := NOW() + INTERVAL '1 month';

    -- Update to Plus tier for 1 month
    UPDATE user_subscriptions
    SET
      subscription_tier = 'plus',
      subscription_status = 'active',
      current_period_start = NOW(),
      current_period_end = v_new_period_end,
      updated_at = NOW()
    WHERE user_id = p_user_id;

    RAISE NOTICE 'Granted 1 month Plus tier to free user %', p_user_id;
  ELSIF v_current_tier = 'plus' AND v_current_status = 'active' THEN
    -- User already has Plus - extend by 1 month
    v_new_period_end := v_current_period_end + INTERVAL '1 month';

    UPDATE user_subscriptions
    SET
      current_period_end = v_new_period_end,
      updated_at = NOW()
    WHERE user_id = p_user_id;

    RAISE NOTICE 'Extended Plus tier by 1 month for user %', p_user_id;
  ELSIF v_current_tier = 'max' THEN
    -- User has Max tier - don't downgrade, but we could give them a credit
    -- For now, we'll just skip rewarding Max users
    RAISE NOTICE 'User % has Max tier, skipping Plus reward', p_user_id;
    RETURN TRUE; -- Still return true as this isn't an error
  END IF;

  RETURN TRUE;

EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error granting reward to user %: %', p_user_id, SQLERRM;
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Create function to process referral rewards
CREATE OR REPLACE FUNCTION process_referral_rewards(p_referral_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_referrer_id UUID;
  v_referred_user_id UUID;
  v_referrer_rewarded BOOLEAN := FALSE;
  v_referred_rewarded BOOLEAN := FALSE;
  v_referred_has_discord BOOLEAN := FALSE;
BEGIN
  -- Get referral details
  SELECT
    referrer_id,
    referred_user_id
  INTO
    v_referrer_id,
    v_referred_user_id
  FROM referrals
  WHERE id = p_referral_id;

  IF NOT FOUND THEN
    RAISE WARNING 'Referral % not found', p_referral_id;
    RETURN FALSE;
  END IF;

  -- Check if referred user has Discord username
  SELECT
    CASE
      WHEN discord_username IS NOT NULL AND discord_username != '' THEN TRUE
      ELSE FALSE
    END
  INTO v_referred_has_discord
  FROM user_profiles
  WHERE id = v_referred_user_id;

  -- Only proceed if referred user has Discord username
  IF NOT v_referred_has_discord THEN
    RAISE NOTICE 'Referred user % does not have Discord username yet', v_referred_user_id;
    RETURN FALSE;
  END IF;

  -- Mark as processing
  UPDATE referrals
  SET reward_status = 'processing'
  WHERE id = p_referral_id;

  -- Grant reward to referrer
  v_referrer_rewarded := grant_referral_reward(v_referrer_id);

  -- Grant reward to referred user
  v_referred_rewarded := grant_referral_reward(v_referred_user_id);

  -- Update referral record with reward timestamps
  IF v_referrer_rewarded AND v_referred_rewarded THEN
    UPDATE referrals
    SET
      referrer_rewarded_at = NOW(),
      referred_rewarded_at = NOW(),
      reward_status = 'completed',
      status = 'completed'
    WHERE id = p_referral_id;

    RAISE NOTICE 'Successfully processed rewards for referral %', p_referral_id;
    RETURN TRUE;
  ELSE
    -- Mark as failed if either reward failed
    UPDATE referrals
    SET reward_status = 'failed'
    WHERE id = p_referral_id;

    RAISE WARNING 'Failed to process rewards for referral %', p_referral_id;
    RETURN FALSE;
  END IF;

EXCEPTION
  WHEN OTHERS THEN
    -- Mark as failed on any error
    UPDATE referrals
    SET reward_status = 'failed'
    WHERE id = p_referral_id;

    RAISE WARNING 'Error processing referral rewards: %', SQLERRM;
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Update the track_referral_signup trigger function
-- This now checks for Discord username and marks referral as pending until Discord is added
CREATE OR REPLACE FUNCTION track_referral_signup()
RETURNS TRIGGER AS $$
DECLARE
  referrer_user_id UUID;
  ref_code TEXT;
  referred_has_discord BOOLEAN := FALSE;
BEGIN
  -- Check if user metadata contains referral code
  ref_code := NEW.raw_user_meta_data->>'referral_code';

  IF ref_code IS NOT NULL THEN
    -- Find the referrer user ID
    SELECT user_id INTO referrer_user_id
    FROM referral_codes
    WHERE referral_code = ref_code;

    IF referrer_user_id IS NOT NULL THEN
      -- Create referral record as PENDING (will be completed when Discord username is added)
      INSERT INTO referrals (referrer_id, referred_user_id, referred_email, referral_code, status)
      VALUES (referrer_user_id, NEW.id, NEW.email, ref_code, 'pending');

      RAISE NOTICE 'Created pending referral for user % with code %', NEW.id, ref_code;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
DROP TRIGGER IF EXISTS trigger_track_referral_signup ON auth.users;
CREATE TRIGGER trigger_track_referral_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION track_referral_signup();

-- Step 5: Create trigger to auto-process rewards when Discord username is added
CREATE OR REPLACE FUNCTION check_referral_completion()
RETURNS TRIGGER AS $$
DECLARE
  v_referral RECORD;
BEGIN
  -- Only proceed if Discord username was just added (changed from NULL/empty to a value)
  IF (OLD.discord_username IS NULL OR OLD.discord_username = '')
     AND (NEW.discord_username IS NOT NULL AND NEW.discord_username != '') THEN

    -- Find any pending referrals where this user is the referred user
    FOR v_referral IN
      SELECT id, referrer_id, referred_user_id
      FROM referrals
      WHERE referred_user_id = NEW.id
        AND status = 'pending'
        AND reward_status = 'pending'
    LOOP
      -- Process the rewards for this referral
      RAISE NOTICE 'Processing rewards for referral % (user % added Discord)', v_referral.id, NEW.id;
      PERFORM process_referral_rewards(v_referral.id);
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on user_profiles table
DROP TRIGGER IF EXISTS trigger_check_referral_completion ON user_profiles;
CREATE TRIGGER trigger_check_referral_completion
  AFTER UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION check_referral_completion();

-- Step 6: Grant necessary permissions
GRANT EXECUTE ON FUNCTION grant_referral_reward(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION process_referral_rewards(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION track_referral_signup() TO authenticated;
GRANT EXECUTE ON FUNCTION check_referral_completion() TO authenticated;

-- Step 7: Create a manual reward processing function (for admin use if needed)
CREATE OR REPLACE FUNCTION admin_process_pending_referrals()
RETURNS TABLE(
  referral_id UUID,
  referrer_id UUID,
  referred_user_id UUID,
  success BOOLEAN
) AS $$
DECLARE
  v_referral RECORD;
  v_success BOOLEAN;
BEGIN
  FOR v_referral IN
    SELECT r.id, r.referrer_id, r.referred_user_id
    FROM referrals r
    INNER JOIN user_profiles up ON up.id = r.referred_user_id
    WHERE r.status = 'pending'
      AND r.reward_status = 'pending'
      AND up.discord_username IS NOT NULL
      AND up.discord_username != ''
  LOOP
    v_success := process_referral_rewards(v_referral.id);

    RETURN QUERY SELECT
      v_referral.id,
      v_referral.referrer_id,
      v_referral.referred_user_id,
      v_success;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION admin_process_pending_referrals() TO service_role;

-- Add helpful comment
COMMENT ON FUNCTION grant_referral_reward IS 'Grants 1 month of Plus tier to a user as a referral reward';
COMMENT ON FUNCTION process_referral_rewards IS 'Processes rewards for both referrer and referred user when conditions are met';
COMMENT ON FUNCTION admin_process_pending_referrals IS 'Admin function to manually process all pending referrals that meet requirements';
