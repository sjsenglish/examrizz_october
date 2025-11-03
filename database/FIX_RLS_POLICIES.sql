-- FIX RLS POLICIES FOR OAUTH USERS
-- Run this in Supabase SQL Editor to fix profile access issues

-- First, check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Service role has full access" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable read access for users based on user_id" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.user_profiles;

-- Ensure RLS is enabled
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create comprehensive policies that work for ALL authentication methods
CREATE POLICY "Allow all authenticated users to read their own profile"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Allow all authenticated users to insert their own profile"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow all authenticated users to update their own profile"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow service role full access (for admin functions)
CREATE POLICY "Service role full access"
ON public.user_profiles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Grant necessary permissions to ensure policies work
GRANT ALL ON public.user_profiles TO authenticated;
GRANT ALL ON public.user_profiles TO service_role;

-- Verify the new policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- Test queries that should work for authenticated users
-- (These are just examples - don't run in production)
-- SELECT * FROM public.user_profiles WHERE id = auth.uid();
-- INSERT INTO public.user_profiles (id, email) VALUES (auth.uid(), 'test@example.com');
-- UPDATE public.user_profiles SET email = 'test@example.com' WHERE id = auth.uid();