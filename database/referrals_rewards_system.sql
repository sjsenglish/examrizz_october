-- Referrals Rewards System with Discord Verification
-- Automatically grants 1 month of Plus tier to users who refer valid (Discord-verified) accounts

-- Add reward tracking columns to referrals table
ALTER TABLE referrals
ADD COLUMN IF NOT EXISTS reward_granted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS reward_granted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS reward_type TEXT DEFAULT 'plus_1month',
ADD COLUMN IF NOT EXISTS discord_verified BOOLEAN DEFAULT FALSE;

-- Add reward tracking to referral_codes table
ALTER TABLE referral_codes
ADD COLUMN IF NOT EXISTS total_successful_referrals INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_rewards_granted INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_reward_granted_at TIMESTAMP WITH TIME ZONE;

-- Function to check if referred user has Discord connected
CREATE OR REPLACE FUNCTION check_discord_verification(user_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
  discord_connected BOOLEAN;
BEGIN
  SELECT (discord_id IS NOT NULL AND discord_id != '')
  INTO discord_connected
  FROM user_profiles
  WHERE id = user_id_param;

  RETURN COALESCE(discord_connected, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to grant 1 month of Plus tier
CREATE OR REPLACE FUNCTION grant_plus_tier_reward(user_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_subscription RECORD;
  new_period_end TIMESTAMP WITH TIME ZONE;
  subscription_exists BOOLEAN;
BEGIN
  -- Check if user subscription record exists
  SELECT EXISTS(
    SELECT 1 FROM user_subscriptions WHERE user_id = user_id_param
  ) INTO subscription_exists;

  -- Get current subscription info
  SELECT * INTO current_subscription
  FROM user_subscriptions
  WHERE user_id = user_id_param;

  IF NOT subscription_exists THEN
    -- Create new subscription with 1 month Plus tier
    INSERT INTO user_subscriptions (
      user_id,
      subscription_tier,
      subscription_status,
      current_period_start,
      current_period_end,
      cancel_at_period_end,
      created_at,
      updated_at
    ) VALUES (
      user_id_param,
      'plus',
      'active',
      NOW(),
      NOW() + INTERVAL '1 month',
      FALSE,
      NOW(),
      NOW()
    );

    RETURN TRUE;
  ELSE
    -- User has existing subscription
    IF current_subscription.subscription_tier = 'free' THEN
      -- Upgrade from free to Plus for 1 month
      UPDATE user_subscriptions
      SET
        subscription_tier = 'plus',
        subscription_status = 'active',
        current_period_start = NOW(),
        current_period_end = NOW() + INTERVAL '1 month',
        cancel_at_period_end = FALSE,
        updated_at = NOW()
      WHERE user_id = user_id_param;

      RETURN TRUE;
    ELSIF current_subscription.subscription_tier = 'plus' THEN
      -- Extend Plus subscription by 1 month
      IF current_subscription.current_period_end IS NOT NULL
         AND current_subscription.current_period_end > NOW() THEN
        -- Still active, extend from current end date
        new_period_end := current_subscription.current_period_end + INTERVAL '1 month';
      ELSE
        -- Expired or no end date, start from now
        new_period_end := NOW() + INTERVAL '1 month';
      END IF;

      UPDATE user_subscriptions
      SET
        subscription_status = 'active',
        current_period_end = new_period_end,
        cancel_at_period_end = FALSE,
        updated_at = NOW()
      WHERE user_id = user_id_param;

      RETURN TRUE;
    ELSIF current_subscription.subscription_tier = 'max' THEN
      -- Don't downgrade Max users, but could track the credit
      -- For now, just return TRUE without changing their subscription
      RETURN TRUE;
    END IF;
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to process referral reward
CREATE OR REPLACE FUNCTION process_referral_reward(referral_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
  referral_record RECORD;
  discord_is_verified BOOLEAN;
  reward_granted_success BOOLEAN;
BEGIN
  -- Get referral details
  SELECT * INTO referral_record
  FROM referrals
  WHERE id = referral_id_param;

  IF NOT FOUND THEN
    RAISE NOTICE 'Referral not found: %', referral_id_param;
    RETURN FALSE;
  END IF;

  -- Check if reward already granted
  IF referral_record.reward_granted THEN
    RAISE NOTICE 'Reward already granted for referral: %', referral_id_param;
    RETURN FALSE;
  END IF;

  -- Check if referral is completed
  IF referral_record.status != 'completed' THEN
    RAISE NOTICE 'Referral not completed: %', referral_id_param;
    RETURN FALSE;
  END IF;

  -- Check if referred user has Discord connected
  IF referral_record.referred_user_id IS NULL THEN
    RAISE NOTICE 'No referred user ID for referral: %', referral_id_param;
    RETURN FALSE;
  END IF;

  discord_is_verified := check_discord_verification(referral_record.referred_user_id);

  -- Update Discord verification status
  UPDATE referrals
  SET discord_verified = discord_is_verified
  WHERE id = referral_id_param;

  IF NOT discord_is_verified THEN
    RAISE NOTICE 'Referred user does not have Discord connected: %', referral_record.referred_user_id;
    RETURN FALSE;
  END IF;

  -- Grant reward to referrer
  reward_granted_success := grant_plus_tier_reward(referral_record.referrer_id);

  IF reward_granted_success THEN
    -- Mark reward as granted
    UPDATE referrals
    SET
      reward_granted = TRUE,
      reward_granted_at = NOW()
    WHERE id = referral_id_param;

    -- Update referral_codes stats
    UPDATE referral_codes
    SET
      total_successful_referrals = total_successful_referrals + 1,
      total_rewards_granted = total_rewards_granted + 1,
      last_reward_granted_at = NOW()
    WHERE user_id = referral_record.referrer_id;

    RAISE NOTICE 'Reward granted successfully for referral: %', referral_id_param;
    RETURN TRUE;
  ELSE
    RAISE NOTICE 'Failed to grant reward for referral: %', referral_id_param;
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically process rewards when Discord is connected
CREATE OR REPLACE FUNCTION auto_process_referral_reward_on_discord_connect()
RETURNS TRIGGER AS $$
DECLARE
  referral_record RECORD;
BEGIN
  -- Only process if Discord ID was just added (changed from NULL to a value)
  IF OLD.discord_id IS NULL AND NEW.discord_id IS NOT NULL THEN
    -- Find all pending referrals where this user is the referred user
    FOR referral_record IN
      SELECT id FROM referrals
      WHERE referred_user_id = NEW.id
        AND status = 'completed'
        AND reward_granted = FALSE
        AND discord_verified = FALSE
    LOOP
      -- Process each referral reward
      PERFORM process_referral_reward(referral_record.id);
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for Discord connection
DROP TRIGGER IF EXISTS trigger_auto_process_reward_on_discord ON user_profiles;
CREATE TRIGGER trigger_auto_process_reward_on_discord
  AFTER UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION auto_process_referral_reward_on_discord_connect();

-- Modify the existing referral signup trigger to check Discord immediately
CREATE OR REPLACE FUNCTION track_referral_signup()
RETURNS TRIGGER AS $$
DECLARE
  referrer_user_id UUID;
  ref_code TEXT;
  new_referral_id UUID;
BEGIN
  -- Check if user metadata contains referral code
  ref_code := NEW.raw_user_meta_data->>'referral_code';

  IF ref_code IS NOT NULL THEN
    -- Find the referrer user ID
    SELECT user_id INTO referrer_user_id
    FROM referral_codes
    WHERE referral_code = ref_code;

    IF referrer_user_id IS NOT NULL AND referrer_user_id != NEW.id THEN
      -- Create referral record
      INSERT INTO referrals (referrer_id, referred_user_id, referred_email, referral_code, status)
      VALUES (referrer_user_id, NEW.id, NEW.email, ref_code, 'completed')
      RETURNING id INTO new_referral_id;

      -- Update completed_at timestamp
      UPDATE referrals
      SET completed_at = NOW()
      WHERE id = new_referral_id;

      -- Try to process reward immediately (will check Discord verification)
      -- This will grant reward if Discord is already connected
      PERFORM process_referral_reward(new_referral_id);
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update the trigger
DROP TRIGGER IF EXISTS trigger_track_referral_signup ON auth.users;
CREATE TRIGGER trigger_track_referral_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION track_referral_signup();

-- Function to manually process all pending rewards (admin use)
CREATE OR REPLACE FUNCTION process_all_pending_referral_rewards()
RETURNS TABLE(
  referral_id UUID,
  referrer_id UUID,
  referred_email TEXT,
  success BOOLEAN,
  message TEXT
) AS $$
DECLARE
  referral_record RECORD;
  process_success BOOLEAN;
BEGIN
  FOR referral_record IN
    SELECT id, referrer_id, referred_email
    FROM referrals
    WHERE status = 'completed'
      AND reward_granted = FALSE
  LOOP
    process_success := process_referral_reward(referral_record.id);

    RETURN QUERY SELECT
      referral_record.id,
      referral_record.referrer_id,
      referral_record.referred_email,
      process_success,
      CASE
        WHEN process_success THEN 'Reward granted successfully'
        ELSE 'Failed to grant reward (likely no Discord connected)'
      END::TEXT;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION check_discord_verification TO authenticated;
GRANT EXECUTE ON FUNCTION grant_plus_tier_reward TO authenticated;
GRANT EXECUTE ON FUNCTION process_referral_reward TO authenticated;
GRANT EXECUTE ON FUNCTION process_all_pending_referral_rewards TO authenticated;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_referrals_reward_status ON referrals(status, reward_granted, discord_verified);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_user_id ON referrals(referred_user_id) WHERE referred_user_id IS NOT NULL;
