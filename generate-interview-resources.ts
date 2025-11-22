// generate-interview-resources.ts
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface FeedbackItem {
  section?: string;
  weak_passage?: string;
  issue_type?: string;
  severity?: string;
  your_feedback?: string;
  improvement_suggested?: string;
  strong_passage?: string;
  why_strong?: string;
  tags?: string[];
}

interface StudentData {
  filename: string;
  batch_id: string;
  subject: string;
  feedback_items: FeedbackItem[];
}

type BatchData = StudentData[];

interface ConceptCluster {
  concept: string;
  subject: string;
  frequency: number;
  typical_ps_phrases: string[];
  common_weaknesses: string[];
  ps_contexts: string[];
  what_students_dont_understand: string;
}

async function extractAllConcepts() {
  console.log('📂 Reading feedback files...');
  
  const feedbackDir = './feedback-data';
  const files = fs.readdirSync(feedbackDir).filter(f => f.endsWith('.json'));
  
  console.log(`📊 Found ${files.length} files\n`);
  
  // Collect all feedback items by subject
  const allFeedbackBySubject: Record<string, FeedbackItem[]> = {};
  let totalItems = 0;
  
  for (const file of files) {
    const filePath = path.join(feedbackDir, file);
    
    try {
      const data: BatchData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      
      // Handle array of student data
      for (const studentData of data) {
        const subject = studentData.subject || 'Unknown';
        if (!allFeedbackBySubject[subject]) {
          allFeedbackBySubject[subject] = [];
        }
        
        const items = studentData.feedback_items || [];
        allFeedbackBySubject[subject].push(...items);
        totalItems += items.length;
      }
      
    } catch (error) {
      console.log(`⚠️  Skipping malformed JSON file: ${file}`);
      continue;
    }
  }
  
  console.log(`📈 Total feedback items: ${totalItems}`);
  console.log(`📚 Subjects found: ${Object.keys(allFeedbackBySubject).join(', ')}\n`);
  
  return allFeedbackBySubject;
}

async function clusterConceptsForSubject(
  subject: string, 
  feedbackItems: FeedbackItem[]
): Promise<ConceptCluster[]> {
  console.log(`🧠 Clustering concepts for ${subject} (${feedbackItems.length} items)...`);
  
  // Prepare sample of feedback for LLM
  const sampleSize = Math.min(100, feedbackItems.length);
  const sample = feedbackItems
    .sort(() => Math.random() - 0.5)
    .slice(0, sampleSize)
    .filter(item => item.weak_passage || item.your_feedback); // Only items with content
  
  console.log(`  📝 Valid samples: ${sample.length}`);
  
  if (sample.length === 0) {
    console.log('  ⚠️  No valid samples found');
    return [];
  }
  
  const prompt = `Analyze these ${subject} personal statement feedback samples and identify ALL distinct academic concepts students claim to understand.

Feedback samples (showing quote from PS, what's weak about it, and feedback given):
${JSON.stringify(sample.slice(0, 30).map(s => ({
  ps_quote: s.weak_passage,
  weakness: s.issue_type,
  feedback: s.your_feedback,
  section: s.section,
  tags: s.tags
})), null, 2)}

For each academic concept mentioned (e.g., for Economics: externalities, game theory, opportunity cost; for History: historiography, source criticism; for PPE: political theory, rational choice, etc.), create a cluster.

Include EVERY concept mentioned, even if only once.

Output as a JSON object with a "clusters" key containing an array:

{
  "clusters": [
    {
      "concept": "Externalities",
      "subject": "${subject}",
      "frequency": 15,
      "typical_ps_phrases": ["exact quote 1 from samples", "exact quote 2"],
      "common_weaknesses": ["weakness pattern 1", "weakness pattern 2"],
      "ps_contexts": ["context 1", "context 2"],
      "what_students_dont_understand": "Students claim to understand X but actually can't do Y"
    }
  ]
}

Be comprehensive - extract all concepts, not just common ones.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    });
    
    const content = response.choices[0].message.content!;
    const parsed = JSON.parse(content);
    const clusters: ConceptCluster[] = parsed.clusters || parsed.concepts || [];
    
    console.log(`  ✅ Found ${clusters.length} concepts for ${subject}`);
    if (clusters.length > 0) {
      console.log(`  📋 Concepts: ${clusters.map(c => c.concept).join(', ')}\n`);
    }
    
    return clusters;
    
  } catch (error) {
    console.error(`  ❌ Error clustering ${subject}:`, error);
    return [];
  }
}

async function generateResourcesForCluster(cluster: ConceptCluster) {
  const prompt = `Generate interview prep resources for Oxford/Cambridge interviews.

Concept: ${cluster.concept}
Subject: ${cluster.subject}

Context from real personal statements:
- Students typically write: ${cluster.typical_ps_phrases.join('; ')}
- Common weaknesses: ${cluster.common_weaknesses.join('; ')}
- PS contexts: ${cluster.ps_contexts.join('; ')}
- Understanding gap: ${cluster.what_students_dont_understand}

Generate resources for 3 difficulty levels. Output as JSON object with keys: baseline, leveled_down, advanced.

Each difficulty level must have:
{
  "ps_triggers": ["phrase 1", "phrase 2", "phrase 3"],
  "questions": {
    "ps_factual_recall": "Question testing specific facts they claimed",
    "ps_knowledge_depth": "What's ONE insight from [source]? Apply it to [scenario]",
    "ps_omissions": "What limitations didn't you mention?",
    "analytical_baseline": "Question testing framework application",
    "analytical_extension": "Harder analytical question",
    "current_affairs": "Connect recent event to this topic"
  },
  "strong_answer_criteria": ["criterion 1", "criterion 2", "criterion 3"],
  "strong_answer_example": "2-4 sentence example meeting all criteria",
  "weak_answer_patterns": ["pattern 1", "pattern 2", "pattern 3"],
  "pushback_phrases": {
    "if_descriptive": "Push for mechanism",
    "if_vague": "Demand specificity",
    "if_cannot_extend": "Test depth"
  },
  "scaffolding": {
    "when_to_use": "Trigger description",
    "simplification_1": {
      "approach": "Make concrete",
      "concrete_example": "Real example",
      "simplified_question": "Easier version"
    },
    "simplification_2": {
      "approach": "Provide framework",
      "framework_to_give": "Structure to use",
      "guided_question": "Question with framework"
    },
    "simplification_3": {
      "approach": "Break into steps",
      "step_by_step": ["step 1", "step 2", "step 3"]
    }
  },
  "refer_to_discord_after": "Specific failure after all scaffolding",
  "common_errors": ["misconception 1", "misconception 2"]
}

Make baseline standard first-year level, leveled_down simpler with more scaffolding, advanced more sophisticated.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
    response_format: { type: 'json_object' }
  });
  
  return JSON.parse(response.choices[0].message.content!);
}

async function generateAllResources() {
  console.log('🚀 Starting resource generation...\n');
  
  // Step 1: Extract concepts from all feedback
  const feedbackBySubject = await extractAllConcepts();
  
  // Step 2: Cluster concepts for each subject
  const allClusters: ConceptCluster[] = [];
  
  for (const [subject, items] of Object.entries(feedbackBySubject)) {
    if (items.length === 0) continue;
    
    const clusters = await clusterConceptsForSubject(subject, items);
    allClusters.push(...clusters);
    
    // Rate limit between subjects
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log(`\n📊 Total concepts across all subjects: ${allClusters.length}\n`);
  
  if (allClusters.length === 0) {
    console.log('❌ No concepts found. Check your data structure.');
    return;
  }
  
  // Step 3: Generate resources for each cluster
  let totalGenerated = 0;
  let totalFailed = 0;
  
  for (const cluster of allClusters) {
    try {
      console.log(`⚙️  Generating resources for: ${cluster.subject} - ${cluster.concept}`);
      
      const resources = await generateResourcesForCluster(cluster);
      
      // Insert each difficulty level as separate row
      for (const difficulty of ['baseline', 'leveled_down', 'advanced']) {
        const resource = resources[difficulty];
        
        if (!resource) {
          console.log(`  ⚠️  Missing ${difficulty} level`);
          continue;
        }
        
        const { error } = await (supabase as any)
          .from('interview_resources')
          .insert({
            subject: cluster.subject,
            concept: cluster.concept,
            difficulty: difficulty,
            frequency: cluster.frequency,
            ps_triggers: resource.ps_triggers,
            questions: resource.questions,
            strong_answer_criteria: resource.strong_answer_criteria,
            strong_answer_example: resource.strong_answer_example,
            weak_answer_patterns: resource.weak_answer_patterns,
            pushback_phrases: resource.pushback_phrases,
            scaffolding: resource.scaffolding,
            refer_to_discord_after: resource.refer_to_discord_after,
            common_errors: resource.common_errors
          });
        
        if (error) {
          console.error(`  ❌ Error inserting ${difficulty}:`, error.message);
          totalFailed++;
        } else {
          totalGenerated++;
        }
      }
      
      console.log(`  ✅ Generated 3 resources\n`);
      
      // Rate limit: wait 1 second between clusters
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`  ❌ Failed to generate resources for ${cluster.concept}:`, error);
      totalFailed++;
    }
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 FINAL SUMMARY:');
  console.log(`  Concepts identified: ${allClusters.length}`);
  console.log(`  Resources generated: ${totalGenerated}`);
  console.log(`  Failed: ${totalFailed}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

generateAllResources().catch(console.error);