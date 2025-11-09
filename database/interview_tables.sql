-- Interview Tables for Oxford/Cambridge Interview Coach
-- This creates separate tables for interview conversations and messages

-- Interview Conversations Table
CREATE TABLE IF NOT EXISTS interview_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    protocol_state JSONB,
    context JSONB,
    section_focus TEXT, -- 'personal_statement', 'analytical_reasoning', 'current_affairs', 'course_knowledge'
    difficulty_level TEXT DEFAULT 'baseline', -- 'baseline', 'leveled_down', 'advanced'
    question_count INTEGER DEFAULT 0,
    performance_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interview Messages Table
CREATE TABLE IF NOT EXISTS interview_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID NOT NULL REFERENCES interview_conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    question_type TEXT, -- 'ps_factual_recall', 'ps_knowledge_depth', 'analytical_baseline', 'analytical_extension', 'current_affairs'
    evaluation_score INTEGER, -- 1-10 score for user answers
    evaluation_notes TEXT, -- Notes about the answer quality
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_interview_conversations_user_id ON interview_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_conversations_created_at ON interview_conversations(created_at);
CREATE INDEX IF NOT EXISTS idx_interview_messages_conversation_id ON interview_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_interview_messages_user_id ON interview_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_messages_created_at ON interview_messages(created_at);

-- RLS (Row Level Security) policies
ALTER TABLE interview_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_messages ENABLE ROW LEVEL SECURITY;

-- Interview Conversations RLS Policies
CREATE POLICY "Users can view own interview conversations" ON interview_conversations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interview conversations" ON interview_conversations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own interview conversations" ON interview_conversations
    FOR UPDATE USING (auth.uid() = user_id);

-- Interview Messages RLS Policies
CREATE POLICY "Users can view own interview messages" ON interview_messages
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interview messages" ON interview_messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_interview_conversation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER trigger_update_interview_conversation_updated_at
    BEFORE UPDATE ON interview_conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_interview_conversation_updated_at();

-- Interview Resources Table (for concept-specific questions and evaluation)
CREATE TABLE IF NOT EXISTS interview_resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subject TEXT NOT NULL,
    concept TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('baseline', 'leveled_down', 'advanced')),
    frequency INTEGER DEFAULT 1,
    ps_triggers TEXT[] DEFAULT '{}',
    questions JSONB NOT NULL,
    strong_answer_criteria TEXT[] DEFAULT '{}',
    strong_answer_example TEXT,
    weak_answer_patterns TEXT[] DEFAULT '{}',
    pushback_phrases JSONB,
    scaffolding JSONB,
    refer_to_discord_after TEXT,
    common_errors TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for interview resources
CREATE INDEX IF NOT EXISTS idx_interview_resources_subject ON interview_resources(subject);
CREATE INDEX IF NOT EXISTS idx_interview_resources_concept ON interview_resources(concept);
CREATE INDEX IF NOT EXISTS idx_interview_resources_difficulty ON interview_resources(difficulty);
CREATE INDEX IF NOT EXISTS idx_interview_resources_subject_concept ON interview_resources(subject, concept);

-- RLS for interview resources (make them readable by all authenticated users)
ALTER TABLE interview_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can read interview resources" ON interview_resources
    FOR SELECT USING (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON interview_conversations TO authenticated;
GRANT SELECT, INSERT ON interview_messages TO authenticated;
GRANT SELECT ON interview_resources TO authenticated;