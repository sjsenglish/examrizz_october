-- Add missing columns to personal_statement_feedback table
-- Run this in Supabase SQL Editor

-- Add batch_id column if it doesn't exist
ALTER TABLE personal_statement_feedback 
ADD COLUMN IF NOT EXISTS batch_id text;

-- Add filename column if it doesn't exist
ALTER TABLE personal_statement_feedback 
ADD COLUMN IF NOT EXISTS filename text;

-- Add processed_by column if it doesn't exist
ALTER TABLE personal_statement_feedback 
ADD COLUMN IF NOT EXISTS processed_by text;

-- Add processing_date column if it doesn't exist
ALTER TABLE personal_statement_feedback 
ADD COLUMN IF NOT EXISTS processing_date date;

-- Add character_count column if it doesn't exist
ALTER TABLE personal_statement_feedback 
ADD COLUMN IF NOT EXISTS character_count integer;

-- Add universities column if it doesn't exist (array of text)
ALTER TABLE personal_statement_feedback 
ADD COLUMN IF NOT EXISTS universities text[];

-- Add university_tier column if it doesn't exist
ALTER TABLE personal_statement_feedback 
ADD COLUMN IF NOT EXISTS university_tier text;

-- Add year_group column if it doesn't exist
ALTER TABLE personal_statement_feedback 
ADD COLUMN IF NOT EXISTS year_group text;

-- Add feedback_format column if it doesn't exist
ALTER TABLE personal_statement_feedback 
ADD COLUMN IF NOT EXISTS feedback_format text;

-- Add statement_full_text column if it doesn't exist
ALTER TABLE personal_statement_feedback 
ADD COLUMN IF NOT EXISTS statement_full_text text;

-- Add section column if it doesn't exist
ALTER TABLE personal_statement_feedback 
ADD COLUMN IF NOT EXISTS section text;

-- Add strong_passage column if it doesn't exist
ALTER TABLE personal_statement_feedback 
ADD COLUMN IF NOT EXISTS strong_passage text;

-- Add why_strong column if it doesn't exist
ALTER TABLE personal_statement_feedback 
ADD COLUMN IF NOT EXISTS why_strong text;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_feedback_batch_id ON personal_statement_feedback(batch_id);
CREATE INDEX IF NOT EXISTS idx_feedback_filename ON personal_statement_feedback(filename);
CREATE INDEX IF NOT EXISTS idx_feedback_subject ON personal_statement_feedback(subject);
CREATE INDEX IF NOT EXISTS idx_feedback_issue_type ON personal_statement_feedback(issue_type);
CREATE INDEX IF NOT EXISTS idx_feedback_severity ON personal_statement_feedback(severity);