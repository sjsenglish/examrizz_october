-- Switch from IVFFlat to HNSW index for faster vector searches
-- Run this in Supabase SQL Editor

-- HNSW (Hierarchical Navigable Small World) provides:
-- - 50-70% faster queries compared to IVFFlat
-- - Better accuracy for similarity search
-- - Trade-off: Slightly slower writes (acceptable for rare inserts)

-- Drop old IVFFlat index if it exists
DROP INDEX IF EXISTS idx_personal_statement_feedback_embedding;

-- Create HNSW index for personal statement feedback
CREATE INDEX IF NOT EXISTS idx_personal_statement_feedback_embedding
ON personal_statement_feedback
USING hnsw (embedding vector_cosine_ops);

-- Drop old IVFFlat index if it exists
DROP INDEX IF EXISTS idx_interview_resources_embedding;

-- Create HNSW index for interview resources
CREATE INDEX IF NOT EXISTS idx_interview_resources_embedding
ON interview_resources
USING hnsw (embedding vector_cosine_ops);

-- Expected performance improvement:
-- - Vector search queries: 342ms avg → ~100-150ms avg (60% faster)
-- - Max query time: 3176ms → ~500-800ms (75% faster)
