-- Draft versions table for storing question draft history
-- Only create if not exists to avoid conflicts

CREATE TABLE IF NOT EXISTS draft_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  question_number int NOT NULL CHECK (question_number >= 1 AND question_number <= 3),
  version_number int NOT NULL,
  content text NOT NULL,
  is_current boolean DEFAULT true,
  word_count int DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS draft_versions_user_id_idx ON draft_versions(user_id);
CREATE INDEX IF NOT EXISTS draft_versions_question_number_idx ON draft_versions(question_number);
CREATE INDEX IF NOT EXISTS draft_versions_user_question_idx ON draft_versions(user_id, question_number);

-- Create RLS (Row Level Security) policies
ALTER TABLE draft_versions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own draft versions
CREATE POLICY IF NOT EXISTS "Users can access own draft versions" ON draft_versions
    FOR ALL USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER IF NOT EXISTS update_draft_versions_updated_at 
    BEFORE UPDATE ON draft_versions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();