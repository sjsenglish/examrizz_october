-- Add metadata columns to user_uploads table for enhanced materials functionality
-- This enhances the Ask Bo feature by allowing detailed material categorization

-- Add metadata columns to user_uploads
ALTER TABLE user_uploads ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE user_uploads ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE user_uploads ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE user_uploads ADD COLUMN IF NOT EXISTS main_arguments TEXT;
ALTER TABLE user_uploads ADD COLUMN IF NOT EXISTS conclusions TEXT;
ALTER TABLE user_uploads ADD COLUMN IF NOT EXISTS sources TEXT;
ALTER TABLE user_uploads ADD COLUMN IF NOT EXISTS methodology TEXT;
ALTER TABLE user_uploads ADD COLUMN IF NOT EXISTS completion_date TEXT;

-- Add enhanced draft metadata to draft_versions
ALTER TABLE draft_versions ADD COLUMN IF NOT EXISTS title TEXT DEFAULT 'Draft';
ALTER TABLE draft_versions ADD COLUMN IF NOT EXISTS last_edited TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create indexes for better performance on new searchable columns
CREATE INDEX IF NOT EXISTS idx_user_uploads_category ON user_uploads(category);
CREATE INDEX IF NOT EXISTS idx_user_uploads_title ON user_uploads(title);
CREATE INDEX IF NOT EXISTS idx_draft_versions_title ON draft_versions(title);
CREATE INDEX IF NOT EXISTS idx_draft_versions_last_edited ON draft_versions(last_edited);

-- Update trigger for draft_versions to set last_edited
CREATE OR REPLACE FUNCTION update_last_edited_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_edited = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to automatically update last_edited
DROP TRIGGER IF EXISTS update_draft_versions_last_edited ON draft_versions;
CREATE TRIGGER update_draft_versions_last_edited 
    BEFORE UPDATE ON draft_versions 
    FOR EACH ROW EXECUTE FUNCTION update_last_edited_column();