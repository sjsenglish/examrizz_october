import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const feedbackItems = await request.json();

    for (const item of feedbackItems) {
      // Create embedding text from relevant fields
      const embeddingText = `
        Subject: ${item.subject}
        Issue: ${item.issue_type}
        Severity: ${item.severity}
        Feedback: ${item.your_feedback}
        Improvement: ${item.improvement_suggested}
        Weak Passage: ${item.weak_passage || ''}
        Tags: ${item.tags?.join(', ') || ''}
      `.trim();

      const embeddingResponse = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: embeddingText,
      });

      const embedding = embeddingResponse.data[0].embedding;

      await supabase.from('personal_statement_feedback').insert({
        ...item,
        embedding,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload feedback' }, { status: 500 });
  }
}