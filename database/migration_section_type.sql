-- Add section_type column to question_drafts table for notes editing functionality
-- This column will store which section the note belongs to (books, academic_papers, lectures, etc.)

ALTER TABLE question_drafts ADD COLUMN IF NOT EXISTS section_type TEXT;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_question_drafts_section_type ON question_drafts(section_type);

-- Add comment for documentation
COMMENT ON COLUMN question_drafts.section_type IS 'Type of section this note belongs to: books, academic_papers, lectures, textbooks, essays, epq, moocs, internships, competitions';