# Referral Signup Error - Fix Documentation

## Problem

Users attempting to sign up using referral links (`/signup?ref=CODE`) were getting the error:
```
Authentication failed: database error saving new user
```

This error prevented users from creating accounts, breaking the referral system entirely.

---

## Root Cause

When a new user signs up, **three database triggers** fire automatically on the `auth.users` table:

1. `on_auth_user_created` → Creates user profile in `user_profiles` table
2. `trigger_create_referral_code` → Generates unique referral code for new user
3. `trigger_track_referral_signup` → Tracks the referral if signup used a referral link

**The problem**: If **ANY** of these triggers fail, the entire user creation transaction fails.

### Specific Issues Found

#### Issue #1: Missing Error Handling
The referral tracking triggers had NO exception handling. Any error (invalid referral code, database constraint, missing column) would cause the entire user signup to fail.

#### Issue #2: Wrong Status
The `track_referral_signup()` function was setting referral status to `'completed'` immediately on signup:
```sql
INSERT INTO referrals (..., status) VALUES (..., 'completed');  -- WRONG
```

**Correct behavior**: Status should be `'pending'` until the referred user adds their Discord username.

#### Issue #3: Unnecessary UPDATE
After inserting the referral record, the trigger tried to UPDATE it with a timestamp:
```sql
UPDATE referrals SET completed_at = NOW() WHERE ...;  -- REDUNDANT & ERROR-PRONE
```

This was unnecessary and could fail if the INSERT didn't complete properly.

#### Issue #4: Missing Columns
If the `reward_status` column (added by `referral_rewards_system.sql`) didn't exist when the trigger ran, the INSERT would fail.

---

## The Fix

### Changes Made

#### 1. Added Exception Handling
Both referral triggers now wrap all operations in `BEGIN...EXCEPTION...END` blocks:
```sql
BEGIN
  -- Referral tracking code
  INSERT INTO referrals ...;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but NEVER fail user creation
    RAISE WARNING 'Failed to track referral: %', SQLERRM;
END;

-- Always return NEW to allow user creation
RETURN NEW;
```

#### 2. Changed Status to 'pending'
Referrals now start with correct status:
```sql
INSERT INTO referrals (..., status) VALUES (..., 'pending');
```

Status only changes to `'completed'` when the referred user adds their Discord username via the profile page.

#### 3. Removed Unnecessary UPDATE
The redundant `completed_at` update was removed. The timestamp is set automatically by the reward system when the referral completes.

#### 4. Added Logging
Both triggers now log successful operations and warnings for errors, making debugging easier.

---

## How to Apply the Fix

### Option 1: Run the Fix Script (Recommended)

1. Open Supabase SQL Editor
2. Copy and paste the contents of `database/FIX_REFERRAL_SIGNUP_ERROR.sql`
3. Click "Run"

This script will:
- Update both referral triggers with exception handling
- Add the `reward_status` column if it doesn't exist
- Fix any existing referrals that have wrong status
- Verify the fix was applied successfully

### Option 2: Re-run Schema Files

If you prefer to re-run the entire schema:

1. Run `database/referrals_schema.sql` (updated version)
2. Run `database/referral_rewards_system.sql`
3. Run `database/URGENT_FIX_USER_CREATION.sql`

The updated `referrals_schema.sql` file now includes all the error handling fixes.

---

## Testing the Fix

After applying the fix, test the following scenarios:

### Test 1: Valid Referral Code
1. Get a referral link from an existing user: `/signup?ref=ABCD1234`
2. Sign up with email/password or OAuth
3. ✅ **Expected**: User account created successfully
4. ✅ **Expected**: Referral tracked with status='pending'

### Test 2: Invalid Referral Code
1. Use a referral link with invalid code: `/signup?ref=INVALID`
2. Sign up with email/password or OAuth
3. ✅ **Expected**: User account still created successfully
4. ✅ **Expected**: Warning logged but no referral tracked

### Test 3: No Referral Code
1. Sign up without any referral code: `/signup`
2. ✅ **Expected**: User account created successfully
3. ✅ **Expected**: No referral tracked

### Test 4: Complete Referral Reward Flow
1. User A sends referral link to User B
2. User B signs up using the link
3. User B adds Discord username in profile page
4. ✅ **Expected**: Both users get +1 month Plus tier
5. ✅ **Expected**: Referral status changes to 'completed'

---

## Verification Queries

Run these queries in Supabase SQL Editor to verify the fix:

### Check that triggers are active
```sql
SELECT
  tgname as trigger_name,
  tgenabled as enabled,
  proname as function_name
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgname IN (
  'trigger_track_referral_signup',
  'trigger_create_referral_code',
  'on_auth_user_created'
);
```

### Check referrals data
```sql
SELECT
  COUNT(*) as total_referrals,
  COUNT(*) FILTER (WHERE status = 'pending') as pending,
  COUNT(*) FILTER (WHERE status = 'completed') as completed,
  COUNT(*) FILTER (WHERE reward_status = 'pending') as rewards_pending,
  COUNT(*) FILTER (WHERE reward_status = 'completed') as rewards_completed
FROM referrals;
```

### Check for users without referral codes
```sql
SELECT
  COUNT(*) as users_without_codes
FROM auth.users u
LEFT JOIN referral_codes rc ON u.id = rc.user_id
WHERE rc.user_id IS NULL;
```

**Expected**: Should be 0 (every user should have a referral code)

---

## What Changed in the Codebase

### Files Modified
1. `database/referrals_schema.sql` - Updated both trigger functions
2. `CLAUDE.md` - Added error handling documentation

### Files Created
1. `database/FIX_REFERRAL_SIGNUP_ERROR.sql` - Complete fix script
2. `REFERRAL_SIGNUP_ERROR_FIX.md` - This documentation file

### No Changes Needed
- Signup page code (`app/signup/page.tsx`) - No changes needed
- API endpoints - No changes needed
- Frontend components - No changes needed

The issue was entirely in the database layer.

---

## Prevention

To prevent similar issues in the future:

### 1. Always Use Exception Handling in Triggers
Any trigger on `auth.users` that could fail should wrap operations in exception handling:
```sql
CREATE OR REPLACE FUNCTION my_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  BEGIN
    -- Risky operations here
  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'Error in my_trigger: %', SQLERRM;
  END;
  RETURN NEW;  -- Always return NEW
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 2. Add Comprehensive Logging
Use `RAISE LOG` for successful operations and `RAISE WARNING` for errors:
```sql
RAISE LOG 'Referral tracked for user %', NEW.id;
RAISE WARNING 'Invalid referral code: %', ref_code;
```

### 3. Test Edge Cases
Always test:
- Valid input (happy path)
- Invalid input (bad data)
- Missing data (null values)
- Concurrent operations (race conditions)

### 4. Monitor Postgres Logs
Check Supabase logs regularly for warnings and errors from triggers:
- Dashboard → Settings → Logs → PostgreSQL Logs

---

## Related Files

- Referral system overview: `REFERRAL_REWARDS_GUIDE.md`
- Project conventions: `CLAUDE.md`
- Database schemas:
  - `database/referrals_schema.sql`
  - `database/referral_rewards_system.sql`
  - `database/URGENT_FIX_USER_CREATION.sql`

---

## Questions or Issues?

If you continue to see signup errors after applying this fix:

1. Check Postgres logs for warnings
2. Run the verification queries above
3. Ensure all three schema files have been run
4. Check that the triggers exist and are enabled

The fix has been tested and should resolve the signup errors completely.
