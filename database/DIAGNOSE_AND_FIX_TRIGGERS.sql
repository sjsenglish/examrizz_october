-- ============================================================================
-- DIAGNOSTIC AND FIX: Referral Code Trigger Not Firing
-- This script diagnoses and fixes why new users aren't getting referral codes
-- ============================================================================

-- ============================================================================
-- PART 1: DIAGNOSTIC - Check if triggers exist
-- ============================================================================

DO $$
DECLARE
  v_trigger_exists BOOLEAN;
  v_function_exists BOOLEAN;
  v_trigger_enabled TEXT;
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'TRIGGER DIAGNOSTIC REPORT';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';

  -- Check if trigger exists
  SELECT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'trigger_create_referral_code'
  ) INTO v_trigger_exists;

  -- Check trigger status
  SELECT tgenabled::TEXT INTO v_trigger_enabled
  FROM pg_trigger
  WHERE tgname = 'trigger_create_referral_code'
  LIMIT 1;

  -- Check if function exists
  SELECT EXISTS (
    SELECT 1 FROM pg_proc
    WHERE proname = 'create_referral_code_for_user'
  ) INTO v_function_exists;

  RAISE NOTICE 'Trigger Status:';
  RAISE NOTICE '  - Trigger exists: %', CASE WHEN v_trigger_exists THEN '✓ YES' ELSE '✗ NO' END;
  RAISE NOTICE '  - Trigger enabled: %', COALESCE(v_trigger_enabled, 'N/A');
  RAISE NOTICE '  - Function exists: %', CASE WHEN v_function_exists THEN '✓ YES' ELSE '✗ NO' END;
  RAISE NOTICE '';

  -- Show trigger details if it exists
  IF v_trigger_exists THEN
    RAISE NOTICE 'Trigger Details:';
    RAISE NOTICE '%', (
      SELECT
        'Table: ' || schemaname || '.' || tablename || E'\n' ||
        'Timing: ' || CASE tgtype::integer & 1 WHEN 1 THEN 'BEFORE' ELSE 'AFTER' END || E'\n' ||
        'Events: ' || CASE
          WHEN tgtype::integer & 4 = 4 THEN 'INSERT'
          ELSE 'OTHER'
        END
      FROM pg_trigger t
      JOIN pg_class c ON t.tgrelid = c.oid
      JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE t.tgname = 'trigger_create_referral_code'
      LIMIT 1
    );
  END IF;

  RAISE NOTICE '========================================';
END $$;

-- ============================================================================
-- PART 2: Check auth.users table structure and permissions
-- ============================================================================

DO $$
DECLARE
  v_table_exists BOOLEAN;
  v_can_create_trigger BOOLEAN;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE 'AUTH.USERS TABLE CHECK:';

  -- Check if auth.users table exists
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'auth' AND table_name = 'users'
  ) INTO v_table_exists;

  RAISE NOTICE '  - auth.users exists: %', CASE WHEN v_table_exists THEN '✓ YES' ELSE '✗ NO' END;

  -- Check permissions
  SELECT has_table_privilege('auth.users', 'TRIGGER') INTO v_can_create_trigger;
  RAISE NOTICE '  - Can create triggers: %', CASE WHEN v_can_create_trigger THEN '✓ YES' ELSE '✗ NO' END;

  RAISE NOTICE '';
END $$;

-- ============================================================================
-- PART 3: Drop and recreate ALL signup-related triggers
-- ============================================================================

RAISE NOTICE 'Dropping all signup-related triggers...';

-- Drop all triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_subscription ON auth.users;
DROP TRIGGER IF EXISTS trigger_create_referral_code ON auth.users;
DROP TRIGGER IF EXISTS trigger_track_referral_signup ON auth.users;

RAISE NOTICE 'All triggers dropped.';
RAISE NOTICE '';

-- ============================================================================
-- PART 4: Recreate functions with enhanced error logging
-- ============================================================================

RAISE NOTICE 'Recreating functions with enhanced logging...';

-- Function 1: User profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  provider text;
  user_meta jsonb;
BEGIN
  BEGIN
    provider := NEW.raw_app_meta_data->>'provider';
    user_meta := NEW.raw_user_meta_data;

    RAISE NOTICE '[TRIGGER] handle_new_user executing for user %', NEW.id;

    INSERT INTO public.user_profiles (
      id, email, full_name,
      discord_id, discord_username, discord_avatar, discord_discriminator, discord_linked_at,
      created_at, updated_at
    )
    VALUES (
      NEW.id, NEW.email,
      COALESCE(user_meta->>'full_name', user_meta->>'name', NULL),
      CASE WHEN provider = 'discord' THEN COALESCE(user_meta->>'provider_id', user_meta->>'sub', user_meta->>'id') ELSE NULL END,
      CASE WHEN provider = 'discord' THEN COALESCE(user_meta->>'username', user_meta->>'global_name', user_meta->>'name') ELSE NULL END,
      CASE WHEN provider = 'discord' THEN COALESCE(user_meta->>'avatar_url', user_meta->>'picture') ELSE NULL END,
      CASE WHEN provider = 'discord' THEN user_meta->>'discriminator' ELSE NULL END,
      CASE WHEN provider = 'discord' THEN NOW() ELSE NULL END,
      NOW(), NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      email = COALESCE(user_profiles.email, EXCLUDED.email),
      full_name = COALESCE(user_profiles.full_name, EXCLUDED.full_name),
      discord_id = COALESCE(user_profiles.discord_id, EXCLUDED.discord_id),
      discord_username = COALESCE(user_profiles.discord_username, EXCLUDED.discord_username),
      discord_avatar = COALESCE(user_profiles.discord_avatar, EXCLUDED.discord_avatar),
      discord_discriminator = COALESCE(user_profiles.discord_discriminator, EXCLUDED.discord_discriminator),
      discord_linked_at = COALESCE(user_profiles.discord_linked_at, EXCLUDED.discord_linked_at),
      updated_at = NOW();

    RAISE NOTICE '[TRIGGER] handle_new_user SUCCESS for user %', NEW.id;

  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING '[TRIGGER] handle_new_user FAILED for %: % (SQLSTATE: %)', NEW.id, SQLERRM, SQLSTATE;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function 2: Subscription creation
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS TRIGGER AS $$
BEGIN
  BEGIN
    RAISE NOTICE '[TRIGGER] handle_new_user_subscription executing for user %', NEW.id;

    INSERT INTO public.user_subscriptions (
      user_id, subscription_tier, subscription_status, cancel_at_period_end
    ) VALUES (
      NEW.id, 'free', 'active', false
    )
    ON CONFLICT (user_id) DO NOTHING;

    RAISE NOTICE '[TRIGGER] handle_new_user_subscription SUCCESS for user %', NEW.id;

  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING '[TRIGGER] handle_new_user_subscription FAILED for %: % (SQLSTATE: %)', NEW.id, SQLERRM, SQLSTATE;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function 3: Referral code creation (THIS IS THE KEY ONE)
CREATE OR REPLACE FUNCTION create_referral_code_for_user()
RETURNS TRIGGER AS $$
DECLARE
  new_code TEXT;
BEGIN
  BEGIN
    RAISE NOTICE '[TRIGGER] create_referral_code_for_user STARTING for user %', NEW.id;

    -- Generate the code
    new_code := generate_referral_code();

    RAISE NOTICE '[TRIGGER] Generated referral code % for user %', new_code, NEW.id;

    -- Insert the referral code
    INSERT INTO referral_codes (user_id, referral_code)
    VALUES (NEW.id, new_code)
    ON CONFLICT (user_id) DO NOTHING;

    RAISE NOTICE '[TRIGGER] create_referral_code_for_user SUCCESS for user % with code %', NEW.id, new_code;

  EXCEPTION
    WHEN unique_violation THEN
      RAISE WARNING '[TRIGGER] Referral code already exists for user %', NEW.id;
    WHEN OTHERS THEN
      RAISE WARNING '[TRIGGER] create_referral_code_for_user FAILED for user %: % (SQLSTATE: %)', NEW.id, SQLERRM, SQLSTATE;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function 4: Referral tracking
CREATE OR REPLACE FUNCTION track_referral_signup()
RETURNS TRIGGER AS $$
DECLARE
  referrer_user_id UUID;
  ref_code TEXT;
BEGIN
  BEGIN
    RAISE NOTICE '[TRIGGER] track_referral_signup executing for user %', NEW.id;

    ref_code := NEW.raw_user_meta_data->>'referral_code';

    IF ref_code IS NOT NULL AND ref_code != '' THEN
      RAISE NOTICE '[TRIGGER] Found referral code % in metadata for user %', ref_code, NEW.id;

      SELECT user_id INTO referrer_user_id
      FROM referral_codes
      WHERE referral_code = ref_code;

      IF referrer_user_id IS NOT NULL THEN
        INSERT INTO referrals (
          referrer_id, referred_user_id, referred_email, referral_code, status, reward_status
        )
        VALUES (
          referrer_user_id, NEW.id, NEW.email, ref_code, 'pending', 'pending'
        )
        ON CONFLICT DO NOTHING;

        RAISE NOTICE '[TRIGGER] Referral tracked: user % referred by % using code %', NEW.id, referrer_user_id, ref_code;
      ELSE
        RAISE WARNING '[TRIGGER] Invalid referral code % for user %', ref_code, NEW.id;
      END IF;
    ELSE
      RAISE NOTICE '[TRIGGER] No referral code in metadata for user %', NEW.id;
    END IF;

  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING '[TRIGGER] track_referral_signup FAILED for user %: % (SQLSTATE: %)', NEW.id, SQLERRM, SQLSTATE;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

RAISE NOTICE 'Functions recreated with enhanced logging.';
RAISE NOTICE '';

-- ============================================================================
-- PART 5: Recreate triggers in correct order
-- ============================================================================

RAISE NOTICE 'Creating triggers...';

-- Trigger 1: User profile (runs first)
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

RAISE NOTICE '✓ Created: on_auth_user_created';

-- Trigger 2: Subscription (runs second)
CREATE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_subscription();

RAISE NOTICE '✓ Created: on_auth_user_created_subscription';

-- Trigger 3: Referral code creation (THIS IS CRITICAL - runs third)
CREATE TRIGGER trigger_create_referral_code
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_referral_code_for_user();

RAISE NOTICE '✓ Created: trigger_create_referral_code';

-- Trigger 4: Referral tracking (runs last)
CREATE TRIGGER trigger_track_referral_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION track_referral_signup();

RAISE NOTICE '✓ Created: trigger_track_referral_signup';
RAISE NOTICE '';

-- ============================================================================
-- PART 6: Fix existing users without referral codes
-- ============================================================================

DO $$
DECLARE
  v_fixed_count INTEGER;
BEGIN
  RAISE NOTICE 'Fixing users without referral codes...';

  -- Generate referral codes for users missing them
  INSERT INTO referral_codes (user_id, referral_code)
  SELECT
    u.id,
    generate_referral_code()
  FROM auth.users u
  LEFT JOIN referral_codes rc ON rc.user_id = u.id
  WHERE rc.id IS NULL
  ON CONFLICT (user_id) DO NOTHING;

  GET DIAGNOSTICS v_fixed_count = ROW_COUNT;

  RAISE NOTICE '✓ Fixed % users without referral codes', v_fixed_count;
  RAISE NOTICE '';
END $$;

-- ============================================================================
-- PART 7: Final verification
-- ============================================================================

DO $$
DECLARE
  v_total_users INT;
  v_users_with_codes INT;
  v_users_without_codes INT;
  v_all_triggers_exist BOOLEAN;
BEGIN
  -- Count users
  SELECT COUNT(*) INTO v_total_users FROM auth.users;
  SELECT COUNT(DISTINCT user_id) INTO v_users_with_codes FROM referral_codes;
  v_users_without_codes := v_total_users - v_users_with_codes;

  -- Check all triggers exist
  SELECT
    (SELECT COUNT(*) FROM pg_trigger WHERE tgname = 'on_auth_user_created') = 1 AND
    (SELECT COUNT(*) FROM pg_trigger WHERE tgname = 'on_auth_user_created_subscription') = 1 AND
    (SELECT COUNT(*) FROM pg_trigger WHERE tgname = 'trigger_create_referral_code') = 1 AND
    (SELECT COUNT(*) FROM pg_trigger WHERE tgname = 'trigger_track_referral_signup') = 1
  INTO v_all_triggers_exist;

  RAISE NOTICE '========================================';
  RAISE NOTICE 'FINAL STATUS';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Total users: %', v_total_users;
  RAISE NOTICE 'Users with codes: %', v_users_with_codes;
  RAISE NOTICE 'Users without codes: %', v_users_without_codes;
  RAISE NOTICE 'All triggers active: %', CASE WHEN v_all_triggers_exist THEN '✓ YES' ELSE '✗ NO' END;
  RAISE NOTICE '';

  IF v_all_triggers_exist AND v_users_without_codes = 0 THEN
    RAISE NOTICE '✓✓✓ ALL FIXED! ✓✓✓';
    RAISE NOTICE 'New signups will now get referral codes automatically.';
    RAISE NOTICE '';
    RAISE NOTICE 'TEST IT:';
    RAISE NOTICE '1. Create a new test account via email signup';
    RAISE NOTICE '2. Check Supabase logs (Logs Explorer) for NOTICE messages';
    RAISE NOTICE '3. Verify referral code appears in referral_codes table';
  ELSE
    RAISE WARNING 'Something is still wrong. Check the errors above.';
  END IF;

  RAISE NOTICE '========================================';
END $$;

-- ============================================================================
-- PART 8: Enable detailed logging for next signup
-- ============================================================================

-- This will help debug the next signup attempt
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'NEXT STEPS FOR TESTING';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '1. Go to Supabase Dashboard → Logs → Postgres Logs';
  RAISE NOTICE '2. Create a new test user via signup';
  RAISE NOTICE '3. Look for messages starting with [TRIGGER]';
  RAISE NOTICE '4. You should see:';
  RAISE NOTICE '   - [TRIGGER] handle_new_user executing...';
  RAISE NOTICE '   - [TRIGGER] handle_new_user_subscription executing...';
  RAISE NOTICE '   - [TRIGGER] create_referral_code_for_user STARTING...';
  RAISE NOTICE '   - [TRIGGER] Generated referral code...';
  RAISE NOTICE '   - [TRIGGER] create_referral_code_for_user SUCCESS...';
  RAISE NOTICE '';
  RAISE NOTICE 'If you do NOT see these messages, the triggers are not firing.';
  RAISE NOTICE 'If you see FAILED messages, there is an error in the trigger.';
  RAISE NOTICE '========================================';
END $$;
