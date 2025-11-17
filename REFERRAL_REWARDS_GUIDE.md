# Referral Rewards System - Complete Guide

## Overview
The referral rewards system automatically grants **1 month of Plus tier** to both the referrer and the referred user when a successful referral is completed.

## How It Works

### 1. User Shares Referral Link
- Each user gets a unique 8-character referral code (auto-generated on signup)
- Referral link format: `https://yoursite.com/signup?ref=ABC12345`
- Users can copy their link from `/referrals` page

### 2. New User Signs Up
- When someone signs up using the referral link, a referral record is created with status `pending`
- The referral stays in `pending` state until the new user adds their Discord username

### 3. Automatic Reward Application
**Trigger Conditions:**
- ✅ New user completes signup
- ✅ New user adds Discord username to their profile
- ✅ Referral status automatically changes from `pending` to `completed`

**What Happens Automatically:**
1. Both users receive **1 month of Plus tier**
2. If user is already on Plus, their subscription is **extended by 1 month**
3. If user is on Max tier, they keep Max (no downgrade)
4. Rewards are tracked in the database to prevent double-rewarding

### 4. Users See Rewards
- Referrals page shows:
  - ✓ Completed referrals with "🎁 +1 Month Plus" badge
  - ⏳ Pending referrals with "Waiting for Discord" message

## Database Schema

### Referrals Table
```sql
referrals:
  - id (UUID)
  - referrer_id (UUID) - User who shared the link
  - referred_user_id (UUID) - User who signed up
  - referred_email (TEXT)
  - referral_code (TEXT)
  - status (TEXT) - 'pending' or 'completed'
  - reward_status (TEXT) - 'pending', 'processing', 'completed', 'failed'
  - referrer_rewarded_at (TIMESTAMP)
  - referred_rewarded_at (TIMESTAMP)
  - created_at (TIMESTAMP)
  - completed_at (TIMESTAMP)
```

## Installation Instructions

### Step 1: Run the SQL File
You need to execute the referral rewards SQL file in your Supabase database:

**Option A: Using Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to "SQL Editor"
3. Click "New Query"
4. Copy the contents of `database/referral_rewards_system.sql`
5. Paste into the SQL editor
6. Click "Run" to execute

**Option B: Using psql Command Line**
```bash
# If you have direct database access
psql "postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres" \
  -f database/referral_rewards_system.sql
```

**Option C: Using Supabase CLI**
```bash
supabase db push
```

### Step 2: Verify Installation
After running the SQL, verify the installation:

```sql
-- Check if new columns exist
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'referrals'
  AND column_name IN ('reward_status', 'referrer_rewarded_at', 'referred_rewarded_at');

-- Check if functions exist
SELECT routine_name
FROM information_schema.routines
WHERE routine_name IN ('grant_referral_reward', 'process_referral_rewards', 'check_referral_completion');
```

### Step 3: Test the System

#### Test Flow:
1. **Create a test user (Referrer)**
   - Sign up as User A
   - Go to `/referrals` page
   - Copy your referral link

2. **Sign up with referral link (Referred User)**
   - Open incognito/private browser
   - Paste the referral link (e.g., `http://localhost:3000/signup?ref=ABC12345`)
   - Sign up as User B
   - **Don't add Discord username yet**

3. **Check pending status**
   - Log back in as User A
   - Go to `/referrals` page
   - You should see User B listed with:
     - Status: "⏳ Pending"
     - Message: "Waiting for Discord"

4. **Add Discord username (Trigger Rewards)**
   - Log in as User B
   - Go to profile settings
   - Add Discord username
   - **Rewards should be automatically applied!**

5. **Verify rewards**
   - Check User A's subscription:
     ```sql
     SELECT subscription_tier, current_period_end
     FROM user_subscriptions
     WHERE user_id = '[USER_A_ID]';
     ```
   - Check User B's subscription:
     ```sql
     SELECT subscription_tier, current_period_end
     FROM user_subscriptions
     WHERE user_id = '[USER_B_ID]';
     ```
   - Both should now have `subscription_tier = 'plus'`
   - Check referral status:
     ```sql
     SELECT status, reward_status, referrer_rewarded_at, referred_rewarded_at
     FROM referrals
     WHERE referral_code = 'ABC12345';
     ```
   - Should show `reward_status = 'completed'`

## Key Functions

### `grant_referral_reward(user_id)`
- Grants 1 month of Plus tier to a specific user
- Handles different scenarios:
  - Free tier → Grants Plus for 1 month
  - Active Plus → Extends by 1 month
  - Max tier → Keeps Max (no downgrade)

### `process_referral_rewards(referral_id)`
- Processes rewards for both referrer and referred user
- Checks Discord username requirement
- Marks referral as completed
- Returns success/failure status

### `check_referral_completion()`
- Trigger function that runs when user profile is updated
- Automatically detects when Discord username is added
- Calls `process_referral_rewards()` for pending referrals

### `admin_process_pending_referrals()`
- Admin function to manually process stuck referrals
- Useful for bulk processing or troubleshooting
- Only accessible with service role

## Edge Cases Handled

✅ **User already has Plus** - Extended by 1 month
✅ **User has Max tier** - Keeps Max, no downgrade
✅ **User signed up without Discord** - Rewards wait until Discord added
✅ **Multiple referrals** - Each referral processed independently
✅ **Failed reward application** - Marked as 'failed', can be retried
✅ **Double-rewarding** - Prevented by checking `referrer_rewarded_at` timestamp

## Monitoring & Admin

### Check Pending Referrals
```sql
SELECT
  r.id,
  r.referred_email,
  r.status,
  r.reward_status,
  up.discord_username,
  r.created_at
FROM referrals r
LEFT JOIN user_profiles up ON up.id = r.referred_user_id
WHERE r.status = 'pending'
ORDER BY r.created_at DESC;
```

### Manually Process Stuck Referrals
```sql
-- Process all pending referrals where Discord username exists
SELECT * FROM admin_process_pending_referrals();
```

### Check Reward Distribution
```sql
SELECT
  COUNT(*) as total_referrals,
  COUNT(CASE WHEN reward_status = 'completed' THEN 1 END) as rewarded,
  COUNT(CASE WHEN reward_status = 'pending' THEN 1 END) as pending,
  COUNT(CASE WHEN reward_status = 'failed' THEN 1 END) as failed
FROM referrals;
```

## Troubleshooting

### Problem: Rewards not applied after adding Discord
**Check:**
1. Verify Discord username is saved in `user_profiles`
2. Check referral status: `SELECT * FROM referrals WHERE referred_user_id = '[USER_ID]'`
3. Look for errors in Supabase logs
4. Manually trigger: `SELECT process_referral_rewards('[REFERRAL_ID]')`

### Problem: User shows wrong tier after reward
**Check:**
1. Verify `user_subscriptions` table: `SELECT * FROM user_subscriptions WHERE user_id = '[USER_ID]'`
2. Clear subscription cache
3. Check for Stripe conflicts (if user has active Stripe subscription)

### Problem: Referral stuck in 'processing'
**Fix:**
```sql
UPDATE referrals
SET reward_status = 'pending'
WHERE id = '[REFERRAL_ID]';

-- Then retry
SELECT process_referral_rewards('[REFERRAL_ID]');
```

## Files Modified

### Backend
- `database/referral_rewards_system.sql` - Main SQL schema and functions
- `app/api/referrals/route.ts` - API returns reward status

### Frontend
- `app/referrals/page.tsx` - Displays reward badges and status
- `app/referrals/referrals.css` - Styling for reward elements

## Next Steps / Future Enhancements

1. **Email Notifications**
   - Send email when referral completes
   - Notify users when they receive Plus tier

2. **Analytics Dashboard**
   - Track referral conversion rates
   - Show top referrers

3. **Tiered Rewards**
   - Offer different rewards for multiple referrals
   - Bonus rewards for referring paying users

4. **Referral Leaderboard**
   - Gamify the referral system
   - Show top referrers on platform

## Support

If you encounter issues:
1. Check Supabase logs for errors
2. Verify all triggers are active
3. Test with fresh test accounts
4. Review the troubleshooting section above

For additional help, check the database logs:
```sql
-- Enable function logging
SET log_min_messages = NOTICE;

-- Then test the function
SELECT process_referral_rewards('[REFERRAL_ID]');
```
