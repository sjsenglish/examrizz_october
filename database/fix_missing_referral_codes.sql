-- Fix Missing Referral Codes for Existing Users
-- This script creates referral codes for users who signed up before the referral system was implemented

-- Insert referral codes for existing users who don't have one
INSERT INTO referral_codes (user_id, referral_code)
SELECT
  u.id,
  generate_referral_code()
FROM auth.users u
LEFT JOIN referral_codes rc ON rc.user_id = u.id
WHERE rc.id IS NULL;

-- Verify the codes were created
SELECT
  u.email,
  rc.referral_code,
  rc.created_at
FROM auth.users u
LEFT JOIN referral_codes rc ON rc.user_id = u.id
ORDER BY u.created_at DESC;
