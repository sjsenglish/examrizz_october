-- Function to automatically create a default subscription for new users
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription() 
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a default 'free' subscription for the new user
  INSERT INTO public.user_subscriptions (
    user_id,
    subscription_tier,
    subscription_status,
    cancel_at_period_end
  ) VALUES (
    NEW.id,
    'free',
    'active',
    false
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created_subscription ON auth.users;

-- Create trigger to automatically create subscription when user is created
CREATE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_subscription();

-- Grant execute permission to authenticated users and service role
GRANT EXECUTE ON FUNCTION public.handle_new_user_subscription() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user_subscription() TO service_role;