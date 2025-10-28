-- Create user_uploads table for storing uploaded study materials
CREATE TABLE IF NOT EXISTS user_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  extracted_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_uploads_user_id ON user_uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_user_uploads_created_at ON user_uploads(created_at);

-- Enable Row Level Security
ALTER TABLE user_uploads ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own uploaded files" ON user_uploads
  FOR SELECT USING (user_id = (SELECT user_id FROM user_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their own uploaded files" ON user_uploads
  FOR INSERT WITH CHECK (user_id = (SELECT user_id FROM user_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own uploaded files" ON user_uploads
  FOR UPDATE USING (user_id = (SELECT user_id FROM user_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete their own uploaded files" ON user_uploads
  FOR DELETE USING (user_id = (SELECT user_id FROM user_profiles WHERE user_id = auth.uid()));