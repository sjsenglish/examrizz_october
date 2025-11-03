-- EMERGENCY BYPASS - ONLY USE IF RLS FIX DOESN'T WORK
-- This temporarily disables RLS to get OAuth users working

-- WARNING: This removes security temporarily - only use for testing!
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'user_profiles';

-- TO RE-ENABLE SECURITY LATER, RUN:
-- ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;