-- EMERGENCY FIX: Drop the problematic trigger immediately
-- This is blocking user creation in Supabase

-- Drop the trigger that's causing the database error
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the function as well
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Verify triggers are gone
SELECT trigger_name, event_object_table, action_statement 
FROM information_schema.triggers 
WHERE event_object_schema = 'auth' AND event_object_table = 'users';

-- This should return no rows if successful