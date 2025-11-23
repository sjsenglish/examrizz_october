-- Migration: Add vector embeddings to interview_resources table
-- This enables semantic search for interview resources using pgvector

-- Step 1: Enable pgvector extension (run this in Supabase SQL Editor first)
CREATE EXTENSION IF NOT EXISTS vector;

-- Step 2: Add embedding column (1536 dimensions for text-embedding-3-small)
ALTER TABLE interview_resources
ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- Step 3: Create index for fast similarity search (using cosine distance)
CREATE INDEX IF NOT EXISTS idx_interview_resources_embedding
ON interview_resources
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Step 4: Create function to search by similarity
CREATE OR REPLACE FUNCTION match_interview_resources(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  subject text,
  concept text,
  difficulty text,
  questions jsonb,
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
    1 - (interview_resources.embedding <=> query_embedding) as similarity
  FROM interview_resources
  WHERE interview_resources.embedding IS NOT NULL
    AND 1 - (interview_resources.embedding <=> query_embedding) > match_threshold
  ORDER BY interview_resources.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION match_interview_resources TO authenticated;
