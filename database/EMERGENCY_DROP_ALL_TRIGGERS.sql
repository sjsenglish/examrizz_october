-- EMERGENCY: Remove ALL triggers on auth.users that could block user creation

-- Drop any triggers on auth.users table
DO $$ 
DECLARE
    trigger_record RECORD;
BEGIN
    FOR trigger_record IN 
        SELECT trigger_name 
        FROM information_schema.triggers 
        WHERE event_object_schema = 'auth' 
        AND event_object_table = 'users'
    LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || trigger_record.trigger_name || ' ON auth.users';
        RAISE NOTICE 'Dropped trigger: %', trigger_record.trigger_name;
    END LOOP;
END $$;

-- Drop the function we created
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Verify no triggers remain on auth.users
SELECT 
    trigger_name, 
    event_object_table, 
    action_statement,
    action_timing,
    event_manipulation
FROM information_schema.triggers 
WHERE event_object_schema = 'auth' 
AND event_object_table = 'users';

-- This query should return NO ROWS if successful