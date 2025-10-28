import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function uploadFeedback() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY not found in environment variables');
    console.log('Please add OPENAI_API_KEY to your .env.local file');
    return;
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const feedbackDir = './feedback-data'; // Put your JSON files here
  const files = fs.readdirSync(feedbackDir).filter(f => f.endsWith('.json'));

  for (const file of files) {
    console.log(`Processing ${file}...`);
    const filePath = path.join(feedbackDir, file);
    const feedbackItems = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    for (const item of feedbackItems) {
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
    console.log(`✓ ${file} complete`);
  }
  console.log('All done!');
}

uploadFeedback();