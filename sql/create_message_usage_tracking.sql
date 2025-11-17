-- Create message usage tracking table for free tier message limits
-- Free users have separate message limits per service (askbo, interview)
CREATE TABLE IF NOT EXISTS message_usage_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service TEXT NOT NULL CHECK (service IN ('askbo', 'interview')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  month_year TEXT NOT NULL, -- Format: 'YYYY-MM'

  -- Indexes for performance
  CONSTRAINT message_usage_tracking_user_month_idx UNIQUE (user_id, month_year, service, id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_message_usage_tracking_user_id ON message_usage_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_message_usage_tracking_month_year ON message_usage_tracking(month_year);
CREATE INDEX IF NOT EXISTS idx_message_usage_tracking_user_month ON message_usage_tracking(user_id, month_year);
CREATE INDEX IF NOT EXISTS idx_message_usage_tracking_service ON message_usage_tracking(service);
CREATE INDEX IF NOT EXISTS idx_message_usage_tracking_user_service_month ON message_usage_tracking(user_id, service, month_year);

-- Enable Row Level Security
ALTER TABLE message_usage_tracking ENABLE ROW LEVEL SECURITY;

-- Create RLS policy so users can only see their own usage
CREATE POLICY "Users can view own message usage" ON message_usage_tracking
  FOR SELECT USING (auth.uid() = user_id);

-- Create RLS policy for inserting usage records (service role only)
CREATE POLICY "Service role can insert message usage" ON message_usage_tracking
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Create RLS policy for updating usage records (service role only)
CREATE POLICY "Service role can update message usage" ON message_usage_tracking
  FOR UPDATE USING (auth.role() = 'service_role');

-- Grant necessary permissions
GRANT SELECT ON message_usage_tracking TO authenticated;
GRANT ALL ON message_usage_tracking TO service_role;

-- Create a view for monthly message usage summaries
CREATE OR REPLACE VIEW monthly_message_usage_summary AS
SELECT
  user_id,
  month_year,
  service,
  COUNT(*) as message_count,
  MIN(created_at) as first_message,
  MAX(created_at) as last_message
FROM message_usage_tracking
GROUP BY user_id, month_year, service;

-- Grant access to the view
GRANT SELECT ON monthly_message_usage_summary TO authenticated;
GRANT ALL ON monthly_message_usage_summary TO service_role;
