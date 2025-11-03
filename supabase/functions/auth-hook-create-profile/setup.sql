-- Create a function that will be triggered when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  response_status int;
  response_content text;
BEGIN
  -- Call the Edge Function to create the user profile
  SELECT 
    status,
    content::text
  INTO 
    response_status,
    response_content
  FROM http_post(
    'https://jdnernhuafjoxvpgmodn.supabase.co/functions/v1/auth-hook-create-profile',
    json_build_object(
      'type', 'INSERT',
      'table', 'users',
      'schema', 'auth',
      'record', json_build_object(
        'id', NEW.id,
        'email', NEW.email,
        'user_metadata', NEW.raw_user_meta_data,
        'app_metadata', NEW.raw_app_meta_data
      )
    )::text,
    'application/json'
  );
  
  -- Log the response for debugging
  RAISE NOTICE 'Edge Function response: % - %', response_status, response_content;
  
  -- Return the new record regardless of Edge Function result
  -- This ensures user creation isn't blocked if profile creation fails
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, service_role;