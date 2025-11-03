-- Create draft_versions table for personal statement versioning system
CREATE TABLE IF NOT EXISTS draft_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL DEFAULT 1,
  version_number INTEGER NOT NULL DEFAULT 1,
  content TEXT NOT NULL,
  title TEXT,
  word_count INTEGER DEFAULT 0,
  is_current BOOLEAN DEFAULT false,
  last_edited TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_draft_versions_user_id ON draft_versions(user_id);
CREATE INDEX IF NOT EXISTS idx_draft_versions_user_current ON draft_versions(user_id, is_current);
CREATE INDEX IF NOT EXISTS idx_draft_versions_user_question ON draft_versions(user_id, question_number);
CREATE INDEX IF NOT EXISTS idx_draft_versions_version ON draft_versions(user_id, question_number, version_number);

-- Enable Row Level Security
ALTER TABLE draft_versions ENABLE ROW LEVEL SECURITY;

-- Create RLS policy so users can only see their own drafts
CREATE POLICY "Users can view own drafts" ON draft_versions
  FOR SELECT USING (auth.uid() = user_id);

-- Create RLS policy for inserting drafts
CREATE POLICY "Users can create own drafts" ON draft_versions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policy for updating drafts
CREATE POLICY "Users can update own drafts" ON draft_versions
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policy for deleting drafts
CREATE POLICY "Users can delete own drafts" ON draft_versions
  FOR DELETE USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT ALL ON draft_versions TO authenticated;
GRANT ALL ON draft_versions TO service_role;

-- Add a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_draft_versions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_draft_versions_updated_at_trigger
    BEFORE UPDATE ON draft_versions
    FOR EACH ROW
    EXECUTE FUNCTION update_draft_versions_updated_at();

-- Optional: Add a constraint to ensure version numbers are positive
ALTER TABLE draft_versions ADD CONSTRAINT draft_versions_version_positive 
  CHECK (version_number > 0);

-- Optional: Add a constraint to ensure question numbers are positive  
ALTER TABLE draft_versions ADD CONSTRAINT draft_versions_question_positive 
  CHECK (question_number > 0);