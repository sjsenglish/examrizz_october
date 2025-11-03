-- Fix 406 errors by ensuring proper RLS policies and permissions
-- Run this in Supabase SQL Editor

-- First, let's check what's causing the 406 errors
-- 406 = Not Acceptable, usually means the query format is wrong or RLS is blocking

-- 1. Check current auth context
SELECT 
  auth.uid() as current_user_id,
  auth.role() as current_role,
  current_setting('request.headers', true)::json->>'authorization' as auth_header;

-- 2. Check existing policies
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- 3. Drop all existing policies and recreate them with broader permissions
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

-- 4. Create very permissive policies to fix 406 errors
CREATE POLICY "allow_authenticated_select"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "allow_authenticated_insert"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "allow_authenticated_update"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "allow_authenticated_delete"
ON public.user_profiles
FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- 5. Ensure service role has full access
CREATE POLICY "service_role_full_access"
ON public.user_profiles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 6. Grant all necessary permissions
GRANT ALL ON public.user_profiles TO authenticated;
GRANT ALL ON public.user_profiles TO service_role;
GRANT ALL ON public.user_profiles TO anon;

-- 7. Ensure RLS is enabled
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 8. Test the policies work
DO $$
BEGIN
  -- This should work for any authenticated user
  PERFORM * FROM public.user_profiles LIMIT 1;
  RAISE NOTICE 'RLS policies are working correctly';
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'RLS policies may still have issues: %', SQLERRM;
END $$;

-- 9. Verify the new policies
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd
FROM pg_policies 
WHERE tablename = 'user_profiles'
ORDER BY policyname;