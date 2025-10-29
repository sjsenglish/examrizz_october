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
    return;
  }

  console.log('🔍 Testing Supabase connection...');
  
  const { error: testError } = await supabase
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
  
  console.log(`📁 Found ${files.length} files to process\n`);
  
  let totalUploaded = 0;
  let totalFailed = 0;
  let totalItems = 0;

  for (const file of files) {
    console.log(`📄 Processing ${file}...`);
    const filePath = path.join(feedbackDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    // Handle both array and single object formats
    const feedbackItems = Array.isArray(data) ? data : [data];
    
    let fileUploaded = 0;
    let fileFailed = 0;
    
    // Count total feedback items in this file
    let itemCount = 0;
    for (const item of feedbackItems) {
      if (item.feedback_items && Array.isArray(item.feedback_items)) {
        itemCount += item.feedback_items.length;
      }
    }
    
    console.log(`  Found ${itemCount} feedback items in ${file}`);
    totalItems += itemCount;
    
    // Process each statement
    for (const item of feedbackItems) {
      // Extract feedback_items if they exist
      const itemsToUpload = item.feedback_items || [];
      
      // Process in batches to avoid timeout
      for (const feedbackItem of itemsToUpload) {
        try {
          const embeddingText = `
            Subject: ${item.subject || ''}
            Issue: ${feedbackItem.issue_type || ''}
            Severity: ${feedbackItem.severity || ''}
            Feedback: ${feedbackItem.your_feedback || ''}
            Improvement: ${feedbackItem.improvement_suggested || ''}
            Weak Passage: ${feedbackItem.weak_passage || ''}
            Tags: ${feedbackItem.tags?.join(', ') || ''}
          `.trim();
          
          // Create embedding
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
          
          // Upload to database
          const { error: insertError } = await supabase
            .from('personal_statement_feedback')
            .insert(uploadData)
            .select();
          
          if (insertError) {
            fileFailed++;
            totalFailed++;
            console.error(`  ❌ Error:`, insertError.message);
          } else {
            fileUploaded++;
            totalUploaded++;
            // Show progress every 10 items
            if (fileUploaded % 10 === 0) {
              console.log(`    Progress: ${fileUploaded}/${itemCount} items uploaded`);
            }
          }
        } catch (error) {
          fileFailed++;
          totalFailed++;
          console.error(`  ❌ Processing error:`, error);
        }
      }
    }
    
    console.log(`  ✅ ${file}: ${fileUploaded} uploaded, ${fileFailed} failed\n`);
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 FINAL SUMMARY:');
  console.log(`  Total items processed: ${totalItems}`);
  console.log(`  Successfully uploaded: ${totalUploaded}`);
  console.log(`  Failed: ${totalFailed}`);
  console.log(`  Success rate: ${((totalUploaded/totalItems)*100).toFixed(1)}%`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

uploadFeedback().catch(console.error);