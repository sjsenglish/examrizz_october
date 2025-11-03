-- COMPREHENSIVE RLS FIX FOR OAUTH USERS
-- This fixes the 406/403 errors for Google/Discord authenticated users

-- Step 1: Check current authentication context
-- Run this first to debug what's happening
SELECT 
  auth.uid() as current_user_id,
  auth.role() as current_role,
  current_user as pg_user,
  session_user as pg_session_user;

-- Step 2: Check if there are any existing profiles
SELECT COUNT(*) as profile_count FROM public.user_profiles;
SELECT * FROM public.user_profiles LIMIT 5;

-- Step 3: Completely rebuild RLS policies
-- Remove all existing policies
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'user_profiles' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(pol.policyname) || ' ON public.user_profiles';
        RAISE NOTICE 'Dropped policy: %', pol.policyname;
    END LOOP;
END $$;

-- Disable and re-enable RLS to reset everything
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Step 4: Create the most permissive policies that still maintain security
-- Policy 1: Allow users to read their own profile
CREATE POLICY "authenticated_users_select_own_profile"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (
  auth.uid()::text = id::text OR 
  auth.uid() = id OR
  (auth.uid() IS NOT NULL AND id IS NOT NULL AND auth.uid()::text = id::text)
);

-- Policy 2: Allow users to insert their own profile  
CREATE POLICY "authenticated_users_insert_own_profile"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid()::text = id::text OR 
  auth.uid() = id OR
  (auth.uid() IS NOT NULL AND id IS NOT NULL AND auth.uid()::text = id::text)
);

-- Policy 3: Allow users to update their own profile
CREATE POLICY "authenticated_users_update_own_profile"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (
  auth.uid()::text = id::text OR 
  auth.uid() = id OR
  (auth.uid() IS NOT NULL AND id IS NOT NULL AND auth.uid()::text = id::text)
)
WITH CHECK (
  auth.uid()::text = id::text OR 
  auth.uid() = id OR
  (auth.uid() IS NOT NULL AND id IS NOT NULL AND auth.uid()::text = id::text)
);

-- Policy 4: Allow service role full access
CREATE POLICY "service_role_all_access"
ON public.user_profiles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Step 5: Grant necessary permissions
GRANT ALL ON public.user_profiles TO authenticated;
GRANT ALL ON public.user_profiles TO service_role;
GRANT ALL ON public.user_profiles TO anon;

-- Step 6: Alternative approach - temporarily disable RLS for testing
-- UNCOMMENT ONLY IF ABOVE DOESN'T WORK:
-- ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Step 7: Verify the policies are working
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'user_profiles' 
ORDER BY policyname;

-- Step 8: Test query that should work for any authenticated user
-- This will help us verify if the policies are working
-- (Don't run this in production - it's just for testing)
-- SELECT 'Test passed: Can read profiles' as test_result 
-- WHERE EXISTS (
--   SELECT 1 FROM public.user_profiles 
--   WHERE id = auth.uid() 
--   LIMIT 1
-- );

RAISE NOTICE 'RLS policies have been rebuilt. Test with an authenticated OAuth user.';
RAISE NOTICE 'If this still fails, temporarily disable RLS by uncommenting the ALTER TABLE command above.';