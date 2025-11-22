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

  console.log('🔍 Testing Supabase connection...');
  
  // Test the connection first
  const { data: testData, error: testError } = await (supabase as any)
    .from('personal_statement_feedback')
    .select('count')
    .limit(1);
  
  if (testError) {
    console.error('❌ Error connecting to Supabase:', testError);
    return;
  }
  
  console.log('✅ Successfully connected to Supabase');

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const feedbackDir = './feedback-data';
  const files = fs.readdirSync(feedbackDir).filter(f => f.endsWith('.json'));
  
  console.log(`📁 Found ${files.length} files to process`);
  
  let totalUploaded = 0;
  let totalFailed = 0;

  for (const file of files) {
    console.log(`\n📄 Processing ${file}...`);
    const filePath = path.join(feedbackDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    // Handle both array and single object formats
    const feedbackItems = Array.isArray(data) ? data : [data];
    
    console.log(`  Found ${feedbackItems.length} items in ${file}`);
    
    for (const [index, item] of feedbackItems.entries()) {
      try {
        // Extract feedback_items if they exist
        const itemsToUpload = item.feedback_items || [item];
        
        for (const feedbackItem of itemsToUpload) {
          const embeddingText = `
            Subject: ${item.subject || feedbackItem.subject || ''}
            Issue: ${feedbackItem.issue_type || ''}
            Severity: ${feedbackItem.severity || ''}
            Feedback: ${feedbackItem.your_feedback || ''}
            Improvement: ${feedbackItem.improvement_suggested || ''}
            Weak Passage: ${feedbackItem.weak_passage || ''}
            Tags: ${feedbackItem.tags?.join(', ') || ''}
          `.trim();

          console.log(`  Creating embedding for item ${index + 1}...`);
          
          const embeddingResponse = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: embeddingText,
          });

          const embedding = embeddingResponse.data[0].embedding;
          
          // Prepare the data for insertion
          const uploadData = {
            filename: item.filename,
            batch_id: item.batch_id,
            processed_by: item.processed_by || 'claude-sonnet-4.5',
            processing_date: item.processing_date,
            subject: item.subject,
            character_count: item.character_count,
            universities: item.universities || [],
            university_tier: item.university_tier,
            year_group: item.year_group,
            feedback_format: item.feedback_format,
            statement_full_text: item.statement_full_text,
            section: feedbackItem.section,
            weak_passage: feedbackItem.weak_passage,
            issue_type: feedbackItem.issue_type,
            severity: feedbackItem.severity,
            your_feedback: feedbackItem.your_feedback,
            improvement_suggested: feedbackItem.improvement_suggested,
            strong_passage: feedbackItem.strong_passage,
            why_strong: feedbackItem.why_strong,
            tags: feedbackItem.tags,
            embedding,
          };

          console.log(`  Uploading to database...`);
          
          const { data: insertData, error: insertError } = await (supabase as any)
            .from('personal_statement_feedback')
            .insert(uploadData)
            .select();
          
          if (insertError) {
            console.error(`  ❌ Error uploading item:`, insertError.message);
            console.error(`     Details:`, insertError);
            totalFailed++;
          } else {
            console.log(`  ✓ Successfully uploaded item ${index + 1}`);
            totalUploaded++;
          }
        }
      } catch (error) {
        console.error(`  ❌ Error processing item ${index + 1}:`, error);
        totalFailed++;
      }
    }
    
    console.log(`✓ ${file} processing complete`);
  }
  
  console.log('\n📊 Summary:');
  console.log(`  Total uploaded: ${totalUploaded}`);
  console.log(`  Total failed: ${totalFailed}`);
  console.log('\nAll done!');
}

uploadFeedback().catch(console.error);