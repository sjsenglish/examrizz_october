-- Support tickets table for tracking Discord ticket creation
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  discord_username text,
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  resolved_at timestamp with time zone,
  notes text
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_session_id ON support_tickets(session_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON support_tickets(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own tickets
CREATE POLICY IF NOT EXISTS "Users can access own support tickets" ON support_tickets
    FOR ALL USING (auth.uid() = user_id);

-- Policy: Service role can access all tickets (for admin/teacher access)
CREATE POLICY IF NOT EXISTS "Service role can access all support tickets" ON support_tickets
    FOR ALL USING (auth.role() = 'service_role');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_support_tickets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER IF NOT EXISTS update_support_tickets_updated_at 
    BEFORE UPDATE ON support_tickets 
    FOR EACH ROW EXECUTE FUNCTION update_support_tickets_updated_at();