-- Create feature_usage_tracking table for submit answer and video solution limits
CREATE TABLE IF NOT EXISTS feature_usage_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature TEXT NOT NULL CHECK (feature IN ('submit_answer', 'video_solution')),
  month_year TEXT NOT NULL, -- Format: 'YYYY-MM'
  day_date TEXT NOT NULL, -- Format: 'YYYY-MM-DD'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_feature_usage_user_id ON feature_usage_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_feature_usage_user_feature ON feature_usage_tracking(user_id, feature);
CREATE INDEX IF NOT EXISTS idx_feature_usage_month ON feature_usage_tracking(user_id, feature, month_year);
CREATE INDEX IF NOT EXISTS idx_feature_usage_day ON feature_usage_tracking(user_id, feature, day_date);

-- Enable Row Level Security
ALTER TABLE feature_usage_tracking ENABLE ROW LEVEL SECURITY;

-- Create RLS policy so users can only see their own usage
CREATE POLICY "Users can view own feature usage" ON feature_usage_tracking
  FOR SELECT USING (auth.uid() = user_id);

-- Create RLS policy for inserting feature usage
CREATE POLICY "Users can create own feature usage" ON feature_usage_tracking
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policy for updating feature usage (though we probably won't update)
CREATE POLICY "Users can update own feature usage" ON feature_usage_tracking
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policy for deleting feature usage (though we probably won't delete)
CREATE POLICY "Users can delete own feature usage" ON feature_usage_tracking
  FOR DELETE USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT ALL ON feature_usage_tracking TO authenticated;
GRANT ALL ON feature_usage_tracking TO service_role;

-- Add a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_feature_usage_tracking_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    return NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_feature_usage_tracking_updated_at_trigger
    BEFORE UPDATE ON feature_usage_tracking
    FOR EACH ROW
    EXECUTE FUNCTION update_feature_usage_tracking_updated_at();