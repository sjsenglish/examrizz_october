-- ============================================================================
-- PERMISSION CHECK SCRIPT
-- Run this first to diagnose permission issues with triggers
-- ============================================================================

-- ============================================================================
-- PART 1: Check current role and permissions
-- ============================================================================

DO $$
DECLARE
  current_role_name TEXT;
  is_superuser BOOLEAN;
BEGIN
  -- Get current role
  SELECT current_user INTO current_role_name;

  -- Check if superuser
  SELECT rolsuper INTO is_superuser
  FROM pg_roles
  WHERE rolname = current_role_name;

  RAISE NOTICE '========================================';
  RAISE NOTICE 'CURRENT USER PERMISSIONS';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Current role: %', current_role_name;
  RAISE NOTICE 'Is superuser: %', CASE WHEN is_superuser THEN '✓ YES' ELSE '✗ NO' END;
  RAISE NOTICE '';
END $$;

-- ============================================================================
-- PART 2: Check permissions on auth.users table
-- ============================================================================

DO $$
DECLARE
  can_select BOOLEAN;
  can_insert BOOLEAN;
  can_update BOOLEAN;
  can_delete BOOLEAN;
  can_trigger BOOLEAN;
  can_references BOOLEAN;
BEGIN
  -- Check various permissions
  SELECT
    has_table_privilege('auth.users', 'SELECT'),
    has_table_privilege('auth.users', 'INSERT'),
    has_table_privilege('auth.users', 'UPDATE'),
    has_table_privilege('auth.users', 'DELETE'),
    has_table_privilege('auth.users', 'TRIGGER'),
    has_table_privilege('auth.users', 'REFERENCES')
  INTO
    can_select, can_insert, can_update, can_delete, can_trigger, can_references;

  RAISE NOTICE 'PERMISSIONS ON auth.users:';
  RAISE NOTICE '  SELECT: %', CASE WHEN can_select THEN '✓ YES' ELSE '✗ NO' END;
  RAISE NOTICE '  INSERT: %', CASE WHEN can_insert THEN '✓ YES' ELSE '✗ NO' END;
  RAISE NOTICE '  UPDATE: %', CASE WHEN can_update THEN '✓ YES' ELSE '✗ NO' END;
  RAISE NOTICE '  DELETE: %', CASE WHEN can_delete THEN '✓ YES' ELSE '✗ NO' END;
  RAISE NOTICE '  TRIGGER: %', CASE WHEN can_trigger THEN '✓ YES (REQUIRED!)' ELSE '✗ NO (THIS IS THE PROBLEM!)' END;
  RAISE NOTICE '  REFERENCES: %', CASE WHEN can_references THEN '✓ YES' ELSE '✗ NO' END;
  RAISE NOTICE '';

  IF NOT can_trigger THEN
    RAISE WARNING '⚠️  TRIGGER permission is MISSING! This will prevent triggers from working.';
    RAISE NOTICE '';
  END IF;
END $$;

-- ============================================================================
-- PART 3: Check if triggers currently exist
-- ============================================================================

DO $$
DECLARE
  trigger_count INTEGER;
  trigger_record RECORD;
BEGIN
  RAISE NOTICE 'EXISTING TRIGGERS ON auth.users:';

  SELECT COUNT(*) INTO trigger_count
  FROM pg_trigger t
  JOIN pg_class c ON t.tgrelid = c.oid
  JOIN pg_namespace n ON c.relnamespace = n.oid
  WHERE n.nspname = 'auth' AND c.relname = 'users'
  AND NOT t.tgisinternal;  -- Exclude internal triggers

  RAISE NOTICE 'Total triggers found: %', trigger_count;
  RAISE NOTICE '';

  IF trigger_count > 0 THEN
    FOR trigger_record IN
      SELECT
        t.tgname as name,
        CASE t.tgenabled
          WHEN 'O' THEN 'ENABLED'
          WHEN 'D' THEN 'DISABLED'
          WHEN 'R' THEN 'REPLICA'
          WHEN 'A' THEN 'ALWAYS'
          ELSE 'UNKNOWN'
        END as status,
        p.proname as function_name
      FROM pg_trigger t
      JOIN pg_class c ON t.tgrelid = c.oid
      JOIN pg_namespace n ON c.relnamespace = n.oid
      JOIN pg_proc p ON t.tgfoid = p.oid
      WHERE n.nspname = 'auth' AND c.relname = 'users'
      AND NOT t.tgisinternal
      ORDER BY t.tgname
    LOOP
      RAISE NOTICE '  - % (%)', trigger_record.name, trigger_record.status;
      RAISE NOTICE '    Function: %()', trigger_record.function_name;
    END LOOP;
  ELSE
    RAISE WARNING '  ✗ No triggers found on auth.users!';
  END IF;
  RAISE NOTICE '';
END $$;

-- ============================================================================
-- PART 4: Check if required functions exist
-- ============================================================================

DO $$
DECLARE
  func_count INTEGER;
BEGIN
  RAISE NOTICE 'REQUIRED FUNCTIONS:';

  -- Check each function
  SELECT COUNT(*) INTO func_count FROM pg_proc WHERE proname = 'generate_referral_code';
  RAISE NOTICE '  generate_referral_code(): %', CASE WHEN func_count > 0 THEN '✓ EXISTS' ELSE '✗ MISSING' END;

  SELECT COUNT(*) INTO func_count FROM pg_proc WHERE proname = 'create_referral_code_for_user';
  RAISE NOTICE '  create_referral_code_for_user(): %', CASE WHEN func_count > 0 THEN '✓ EXISTS' ELSE '✗ MISSING' END;

  SELECT COUNT(*) INTO func_count FROM pg_proc WHERE proname = 'track_referral_signup';
  RAISE NOTICE '  track_referral_signup(): %', CASE WHEN func_count > 0 THEN '✓ EXISTS' ELSE '✗ MISSING' END;

  SELECT COUNT(*) INTO func_count FROM pg_proc WHERE proname = 'handle_new_user';
  RAISE NOTICE '  handle_new_user(): %', CASE WHEN func_count > 0 THEN '✓ EXISTS' ELSE '✗ MISSING' END;

  SELECT COUNT(*) INTO func_count FROM pg_proc WHERE proname = 'handle_new_user_subscription';
  RAISE NOTICE '  handle_new_user_subscription(): %', CASE WHEN func_count > 0 THEN '✓ EXISTS' ELSE '✗ MISSING' END;

  RAISE NOTICE '';
END $$;

-- ============================================================================
-- PART 5: Check if required tables exist
-- ============================================================================

DO $$
DECLARE
  table_exists BOOLEAN;
BEGIN
  RAISE NOTICE 'REQUIRED TABLES:';

  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'referral_codes'
  ) INTO table_exists;
  RAISE NOTICE '  referral_codes: %', CASE WHEN table_exists THEN '✓ EXISTS' ELSE '✗ MISSING' END;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'referrals'
  ) INTO table_exists;
  RAISE NOTICE '  referrals: %', CASE WHEN table_exists THEN '✓ EXISTS' ELSE '✗ MISSING' END;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'user_profiles'
  ) INTO table_exists;
  RAISE NOTICE '  user_profiles: %', CASE WHEN table_exists THEN '✓ EXISTS' ELSE '✗ MISSING' END;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'user_subscriptions'
  ) INTO table_exists;
  RAISE NOTICE '  user_subscriptions: %', CASE WHEN table_exists THEN '✓ EXISTS' ELSE '✗ MISSING' END;

  RAISE NOTICE '';
END $$;

-- ============================================================================
-- PART 6: Test if we can create a trigger (dry run)
-- ============================================================================

DO $$
DECLARE
  test_result TEXT;
BEGIN
  RAISE NOTICE 'TRIGGER CREATION TEST:';

  BEGIN
    -- Try to create a dummy trigger
    EXECUTE '
      CREATE OR REPLACE FUNCTION test_trigger_function()
      RETURNS TRIGGER AS $func$
      BEGIN
        RETURN NEW;
      END;
      $func$ LANGUAGE plpgsql;
    ';

    EXECUTE 'DROP TRIGGER IF EXISTS test_trigger ON auth.users';

    EXECUTE '
      CREATE TRIGGER test_trigger
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION test_trigger_function();
    ';

    EXECUTE 'DROP TRIGGER IF EXISTS test_trigger ON auth.users';
    EXECUTE 'DROP FUNCTION IF EXISTS test_trigger_function()';

    RAISE NOTICE '  ✓ Can create triggers on auth.users';
    RAISE NOTICE '';

  EXCEPTION
    WHEN insufficient_privilege THEN
      RAISE WARNING '  ✗ PERMISSION DENIED - Cannot create triggers on auth.users';
      RAISE NOTICE '  Error: %', SQLERRM;
      RAISE NOTICE '';
    WHEN OTHERS THEN
      RAISE WARNING '  ✗ ERROR - %', SQLERRM;
      RAISE NOTICE '';
  END;
END $$;

-- ============================================================================
-- PART 7: Summary and recommendations
-- ============================================================================

DO $$
DECLARE
  can_trigger BOOLEAN;
  triggers_exist BOOLEAN;
  functions_exist BOOLEAN;
  tables_exist BOOLEAN;
BEGIN
  -- Check all conditions
  SELECT has_table_privilege('auth.users', 'TRIGGER') INTO can_trigger;

  SELECT EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'auth' AND c.relname = 'users'
    AND t.tgname = 'trigger_create_referral_code'
  ) INTO triggers_exist;

  SELECT
    EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'create_referral_code_for_user') AND
    EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'generate_referral_code')
  INTO functions_exist;

  SELECT
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'referral_codes') AND
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'referrals')
  INTO tables_exist;

  RAISE NOTICE '========================================';
  RAISE NOTICE 'SUMMARY';
  RAISE NOTICE '========================================';

  IF NOT tables_exist THEN
    RAISE NOTICE '❌ ISSUE: Required tables missing';
    RAISE NOTICE '   → Run FIX_SIGNUP_AND_REFERRALS_COMPLETE.sql first';
    RAISE NOTICE '';
  ELSIF NOT functions_exist THEN
    RAISE NOTICE '❌ ISSUE: Required functions missing';
    RAISE NOTICE '   → Run FIX_SIGNUP_AND_REFERRALS_COMPLETE.sql';
    RAISE NOTICE '';
  ELSIF NOT can_trigger THEN
    RAISE NOTICE '❌ ISSUE: No TRIGGER permission on auth.users';
    RAISE NOTICE '   → This is likely a Supabase limitation';
    RAISE NOTICE '   → Try running the script as service_role';
    RAISE NOTICE '   → Or contact Supabase support';
    RAISE NOTICE '';
  ELSIF NOT triggers_exist THEN
    RAISE NOTICE '⚠️  ISSUE: Triggers not created yet';
    RAISE NOTICE '   → Run DIAGNOSE_AND_FIX_TRIGGERS.sql';
    RAISE NOTICE '';
  ELSE
    RAISE NOTICE '✓ Everything looks good!';
    RAISE NOTICE '  If triggers still not firing, check Postgres logs';
    RAISE NOTICE '';
  END IF;

  RAISE NOTICE '========================================';
END $$;
