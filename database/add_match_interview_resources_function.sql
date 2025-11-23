-- Add the match_interview_resources function for semantic search
-- Run this in Supabase SQL Editor

CREATE OR REPLACE FUNCTION match_interview_resources(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10,
  filter_subject text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  subject text,
  concept text,
  difficulty text,
  questions jsonb,
  strong_answer_example text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    interview_resources.id,
    interview_resources.subject,
    interview_resources.concept,
    interview_resources.difficulty,
    interview_resources.questions,
    interview_resources.strong_answer_example,
    1 - (interview_resources.embedding <=> query_embedding) as similarity
  FROM interview_resources
  WHERE interview_resources.embedding IS NOT NULL
    AND 1 - (interview_resources.embedding <=> query_embedding) > match_threshold
    AND (filter_subject IS NULL OR interview_resources.subject = filter_subject)
  ORDER BY interview_resources.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Grant permissions to authenticated users
GRANT EXECUTE ON FUNCTION match_interview_resources TO authenticated;
GRANT EXECUTE ON FUNCTION match_interview_resources TO service_role;
