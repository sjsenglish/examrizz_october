-- Enhanced user signup schema
-- Adds support for username, school, rank, and academic grades

-- First, let's add the missing columns to user_profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS school TEXT,
ADD COLUMN IF NOT EXISTS rank_in_school TEXT;

-- Create table for storing user's GCSE grades
CREATE TABLE IF NOT EXISTS user_gcse_grades (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
    subject TEXT NOT NULL,
    grade TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, subject)
);

-- Create table for storing user's A Level grades
CREATE TABLE IF NOT EXISTS user_alevel_grades (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
    subject TEXT NOT NULL,
    grade TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, subject)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_gcse_grades_user_id ON user_gcse_grades(user_id);
CREATE INDEX IF NOT EXISTS idx_user_alevel_grades_user_id ON user_alevel_grades(user_id);

-- Enable Row Level Security
ALTER TABLE user_gcse_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_alevel_grades ENABLE ROW LEVEL SECURITY;

-- RLS Policies for GCSE grades
CREATE POLICY "Users can view their own GCSE grades" ON user_gcse_grades
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own GCSE grades" ON user_gcse_grades
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own GCSE grades" ON user_gcse_grades
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own GCSE grades" ON user_gcse_grades
    FOR DELETE USING (user_id = auth.uid());

-- RLS Policies for A Level grades
CREATE POLICY "Users can view their own A Level grades" ON user_alevel_grades
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own A Level grades" ON user_alevel_grades
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own A Level grades" ON user_alevel_grades
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own A Level grades" ON user_alevel_grades
    FOR DELETE USING (user_id = auth.uid());

-- Create trigger for updated_at timestamps
DROP TRIGGER IF EXISTS update_user_gcse_grades_updated_at ON user_gcse_grades;
CREATE TRIGGER update_user_gcse_grades_updated_at
    BEFORE UPDATE ON user_gcse_grades
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_alevel_grades_updated_at ON user_alevel_grades;
CREATE TRIGGER update_user_alevel_grades_updated_at
    BEFORE UPDATE ON user_alevel_grades
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();