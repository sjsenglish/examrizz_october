-- Create enum for subscription tiers
CREATE TYPE subscription_tier AS ENUM ('free', 'plus', 'max');

-- Create enum for subscription status (matching Stripe's status values)
CREATE TYPE subscription_status AS ENUM (
  'active',
  'canceled',
  'incomplete',
  'incomplete_expired',
  'past_due',
  'trialing',
  'unpaid',
  'paused'
);

-- Create the user_subscriptions table
CREATE TABLE public.user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subscription_tier subscription_tier DEFAULT 'free' NOT NULL,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  subscription_status subscription_status DEFAULT 'active' NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMP WITH TIME ZONE,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  -- Ensure one subscription per user
  CONSTRAINT unique_user_subscription UNIQUE (user_id)
);

-- Create index for faster lookups
CREATE INDEX idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_stripe_customer_id ON public.user_subscriptions(stripe_customer_id);
CREATE INDEX idx_user_subscriptions_stripe_subscription_id ON public.user_subscriptions(stripe_subscription_id);
CREATE INDEX idx_user_subscriptions_status ON public.user_subscriptions(subscription_status);

-- Enable Row Level Security
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Policy: Users can read their own subscription data
CREATE POLICY "Users can view own subscription"
  ON public.user_subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can update their own subscription (for things like cancellation requests)
CREATE POLICY "Users can update own subscription"
  ON public.user_subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Service role can do everything (for webhook handlers)
CREATE POLICY "Service role has full access"
  ON public.user_subscriptions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create function to automatically create free tier subscription for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_subscriptions (
    user_id,
    subscription_tier,
    subscription_status,
    current_period_start,
    current_period_end
  )
  VALUES (
    NEW.id,
    'free',
    'active',
    now(),
    now() + INTERVAL '100 years' -- Free tier never expires
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create free subscription on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create a view for easier subscription queries with user email
CREATE VIEW public.user_subscriptions_with_email AS
SELECT 
  us.*,
  au.email,
  au.email_confirmed_at,
  au.created_at as user_created_at
FROM 
  public.user_subscriptions us
  INNER JOIN auth.users au ON us.user_id = au.id;

-- Grant access to the view
GRANT SELECT ON public.user_subscriptions_with_email TO authenticated;
GRANT SELECT ON public.user_subscriptions_with_email TO service_role;

-- Create function to get user's current subscription
CREATE OR REPLACE FUNCTION public.get_user_subscription(user_uuid UUID)
RETURNS TABLE (
  subscription_tier subscription_tier,
  subscription_status subscription_status,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    us.subscription_tier,
    us.subscription_status,
    us.current_period_end,
    us.cancel_at_period_end
  FROM public.user_subscriptions us
  WHERE us.user_id = user_uuid
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.get_user_subscription(UUID) TO authenticated;

-- Create function to check if user has access to a feature based on tier
CREATE OR REPLACE FUNCTION public.check_subscription_access(
  user_uuid UUID,
  required_tier subscription_tier
)
RETURNS BOOLEAN AS $$
DECLARE
  user_tier subscription_tier;
  user_status subscription_status;
BEGIN
  SELECT subscription_tier, subscription_status 
  INTO user_tier, user_status
  FROM public.user_subscriptions
  WHERE user_id = user_uuid
  LIMIT 1;
  
  -- Check if subscription is active
  IF user_status != 'active' AND user_status != 'trialing' THEN
    RETURN FALSE;
  END IF;
  
  -- Check tier hierarchy: max > plus > free
  IF required_tier = 'free' THEN
    RETURN TRUE; -- Everyone has access to free features
  ELSIF required_tier = 'plus' THEN
    RETURN user_tier IN ('plus', 'max');
  ELSIF required_tier = 'max' THEN
    RETURN user_tier = 'max';
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.check_subscription_access(UUID, subscription_tier) TO authenticated;

-- Add helpful comments
COMMENT ON TABLE public.user_subscriptions IS 'Stores user subscription information for the educational platform';
COMMENT ON COLUMN public.user_subscriptions.subscription_tier IS 'User subscription level: free, plus, or max';
COMMENT ON COLUMN public.user_subscriptions.stripe_customer_id IS 'Stripe customer ID for payment processing';
COMMENT ON COLUMN public.user_subscriptions.stripe_subscription_id IS 'Stripe subscription ID for recurring payments';
COMMENT ON COLUMN public.user_subscriptions.subscription_status IS 'Current status of the subscription from Stripe';
COMMENT ON COLUMN public.user_subscriptions.cancel_at_period_end IS 'Whether the subscription will be canceled at the end of the current period';