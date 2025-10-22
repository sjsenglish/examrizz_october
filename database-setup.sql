-- Database setup script for teacher portal
-- Run this in your Supabase SQL editor if tables don't exist

-- Create schools table
CREATE TABLE IF NOT EXISTS schools (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    school_code TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('teacher', 'student', 'admin')),
    full_name TEXT NOT NULL,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    teacher_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create class_memberships table
CREATE TABLE IF NOT EXISTS class_memberships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(class_id, student_id)
);

-- Create question_packs table
CREATE TABLE IF NOT EXISTS question_packs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pack_questions table
CREATE TABLE IF NOT EXISTS pack_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    pack_id UUID REFERENCES question_packs(id) ON DELETE CASCADE NOT NULL,
    question_id TEXT NOT NULL, -- Reference to external question system
    position INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pack_assignments table
CREATE TABLE IF NOT EXISTS pack_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    pack_id UUID REFERENCES question_packs(id) ON DELETE CASCADE NOT NULL,
    assigned_by UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
    assigned_to_user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    assigned_to_class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    due_date TIMESTAMP WITH TIME ZONE,
    time_limit_minutes INTEGER,
    randomize_questions BOOLEAN DEFAULT FALSE,
    instructions TEXT,
    email_notification BOOLEAN DEFAULT TRUE,
    show_in_dashboard BOOLEAN DEFAULT TRUE,
    score_threshold_percent INTEGER DEFAULT 60,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'overdue', 'draft')),
    CHECK (
        (assigned_to_user_id IS NOT NULL AND assigned_to_class_id IS NULL) OR
        (assigned_to_user_id IS NULL AND assigned_to_class_id IS NOT NULL)
    )
);

-- Create pack_attempts table
CREATE TABLE IF NOT EXISTS pack_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    pack_id UUID REFERENCES question_packs(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
    assignment_id UUID REFERENCES pack_assignments(id) ON DELETE SET NULL,
    score INTEGER,
    total_questions INTEGER NOT NULL,
    time_taken_seconds INTEGER,
    answers JSONB,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_school_id ON user_profiles(school_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_class_memberships_class_id ON class_memberships(class_id);
CREATE INDEX IF NOT EXISTS idx_class_memberships_student_id ON class_memberships(student_id);
CREATE INDEX IF NOT EXISTS idx_question_packs_creator_id ON question_packs(creator_id);
CREATE INDEX IF NOT EXISTS idx_pack_assignments_pack_id ON pack_assignments(pack_id);
CREATE INDEX IF NOT EXISTS idx_pack_assignments_assigned_by ON pack_assignments(assigned_by);
CREATE INDEX IF NOT EXISTS idx_pack_attempts_user_id ON pack_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_pack_attempts_assignment_id ON pack_attempts(assignment_id);

-- Enable Row Level Security (RLS)
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pack_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pack_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE pack_attempts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for classes (teachers can manage their classes)
CREATE POLICY "Teachers can view their classes" ON classes
    FOR SELECT USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can create classes" ON classes
    FOR INSERT WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "Teachers can update their classes" ON classes
    FOR UPDATE USING (teacher_id = auth.uid());

-- RLS Policies for class_memberships
CREATE POLICY "Teachers can view their class memberships" ON class_memberships
    FOR SELECT USING (
        class_id IN (SELECT id FROM classes WHERE teacher_id = auth.uid())
    );

CREATE POLICY "Teachers can manage their class memberships" ON class_memberships
    FOR ALL USING (
        class_id IN (SELECT id FROM classes WHERE teacher_id = auth.uid())
    );

-- RLS Policies for question_packs
CREATE POLICY "Users can view their own packs or public packs" ON question_packs
    FOR SELECT USING (creator_id = auth.uid() OR is_public = TRUE);

CREATE POLICY "Users can create their own packs" ON question_packs
    FOR INSERT WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users can update their own packs" ON question_packs
    FOR UPDATE USING (creator_id = auth.uid());

-- RLS Policies for pack_assignments
CREATE POLICY "Teachers can view assignments they created" ON pack_assignments
    FOR SELECT USING (assigned_by = auth.uid());

CREATE POLICY "Students can view assignments assigned to them" ON pack_assignments
    FOR SELECT USING (
        assigned_to_user_id = auth.uid() OR 
        assigned_to_class_id IN (
            SELECT class_id FROM class_memberships WHERE student_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can create assignments" ON pack_assignments
    FOR INSERT WITH CHECK (assigned_by = auth.uid());

-- RLS Policies for pack_attempts
CREATE POLICY "Users can view their own attempts" ON pack_attempts
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Teachers can view attempts for their assignments" ON pack_attempts
    FOR SELECT USING (
        assignment_id IN (SELECT id FROM pack_assignments WHERE assigned_by = auth.uid())
    );

CREATE POLICY "Users can create their own attempts" ON pack_attempts
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Insert sample schools for testing
INSERT INTO schools (name, school_code) VALUES 
    ('Brixton 6th Form', 'BRIXTON6TH'),
    ('St Paul''s Girls School', 'STPAULS')
ON CONFLICT (school_code) DO NOTHING;

-- Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for question_packs
DROP TRIGGER IF EXISTS update_question_packs_updated_at ON question_packs;
CREATE TRIGGER update_question_packs_updated_at
    BEFORE UPDATE ON question_packs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();