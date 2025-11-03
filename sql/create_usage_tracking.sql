-- Create usage tracking table for AskBo paywall system
CREATE TABLE IF NOT EXISTS usage_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service TEXT NOT NULL CHECK (service IN ('askbo', 'other')),
  tokens_used INTEGER NOT NULL DEFAULT 0,
  cost_usd DECIMAL(10, 6) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  month_year TEXT NOT NULL, -- Format: 'YYYY-MM'
  
  -- Indexes for performance
  CONSTRAINT usage_tracking_user_month_idx UNIQUE (user_id, month_year, service, id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_id ON usage_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_month_year ON usage_tracking(month_year);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_month ON usage_tracking(user_id, month_year);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_service ON usage_tracking(service);

-- Enable Row Level Security
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- Create RLS policy so users can only see their own usage
CREATE POLICY "Users can view own usage" ON usage_tracking
  FOR SELECT USING (auth.uid() = user_id);

-- Create RLS policy for inserting usage records (service role only)
CREATE POLICY "Service role can insert usage" ON usage_tracking
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Create RLS policy for updating usage records (service role only)  
CREATE POLICY "Service role can update usage" ON usage_tracking
  FOR UPDATE USING (auth.role() = 'service_role');

-- Grant necessary permissions
GRANT SELECT ON usage_tracking TO authenticated;
GRANT ALL ON usage_tracking TO service_role;

-- Create a view for monthly usage summaries
CREATE OR REPLACE VIEW monthly_usage_summary AS
SELECT 
  user_id,
  month_year,
  service,
  SUM(tokens_used) as total_tokens,
  SUM(cost_usd) as total_cost,
  COUNT(*) as request_count,
  MIN(created_at) as first_request,
  MAX(created_at) as last_request
FROM usage_tracking
GROUP BY user_id, month_year, service;

-- Grant access to the view
GRANT SELECT ON monthly_usage_summary TO authenticated;
GRANT ALL ON monthly_usage_summary TO service_role;