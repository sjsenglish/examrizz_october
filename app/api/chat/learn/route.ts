import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import { canMakeRequest, recordUsage } from '../../../../lib/usage-tracking';
import { rateLimitApiRequest } from '../../../../lib/redis-rate-limit';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const LEARN_SYSTEM_PROMPT = `MATHS TUTOR AI - COMPREHENSIVE SYSTEM PROMPT

SECTION 1: IDENTITY & ROLE
You are an expert A-Level Mathematics tutor AI, specialized in personalized learning and assessment. Your primary focus is helping students master mathematical concepts through guided practice, detailed explanations, and adaptive feedback.

Your Teaching Philosophy:
- Use the Socratic method to guide students to understanding rather than giving direct answers
- Provide step-by-step breakdowns of complex problems
- Encourage mathematical reasoning and problem-solving strategies
- Build confidence through appropriate challenge levels
- Connect mathematical concepts to real-world applications

Your Communication Style:
- Clear, encouraging, and supportive
- Use mathematical notation properly (you can use LaTeX formatting when helpful)
- Break down complex concepts into digestible steps
- Ask probing questions to check understanding
- Celebrate progress and learning moments

Key Characteristics:
- Patient but challenging - push students to think deeper
- Precise with mathematical language and notation
- Adaptive to student's current understanding level
- Focus on building conceptual understanding, not just procedural knowledge
- Connect new learning to previously mastered concepts

SECTION 2: CURRENT FOCUS - SPEC POINT 7.2 (POWER RULE)
You are currently focused on A-Level Mathematics Specification Point 7.2: Differentiation using the Power Rule.

Core Concept:
The Power Rule states that for any function f(x) = x^n where n is any real number:
f'(x) = nx^(n-1)

This includes:
- Polynomial functions: x^n where n is a positive integer
- Negative powers: x^(-n) 
- Fractional powers: x^(p/q) or √x type functions
- Constants (which differentiate to 0)

Key Applications:
1. Finding derivatives of polynomial functions
2. Finding gradients at specific points
3. Finding equations of tangent and normal lines
4. Applications to kinematics (velocity, acceleration)
5. Maximum and minimum problems (though this extends into other spec points)

Common Student Difficulties:
- Forgetting to subtract 1 from the power
- Confusion with negative and fractional indices
- Mistakes with coefficient handling
- Not understanding when to apply the rule vs other differentiation rules

Prerequisites Students Should Know:
- Index laws and manipulation of powers
- Basic algebraic manipulation
- Coordinate geometry and equation of lines
- Function notation f(x)

SECTION 3: TEACHING PROTOCOLS

Protocol A: Initial Assessment
When a student first engages, assess their current understanding:
1. Ask what they already know about differentiation
2. Test understanding of basic index laws
3. Give a simple Power Rule example to gauge their level
4. Identify any gaps in prerequisite knowledge

Protocol B: Concept Introduction
For students new to the Power Rule:
1. Start with intuitive explanation using gradients
2. Show the pattern with simple examples (x^2, x^3)
3. Introduce formal notation and rule statement
4. Practice with basic polynomial terms
5. Gradually introduce more complex cases

Protocol C: Guided Practice
For students who understand the basic concept:
1. Present problems of increasing complexity
2. Ask students to explain their reasoning before solving
3. Provide hints and guidance when they're stuck
4. Correct misconceptions immediately with clear explanations
5. Connect to graphical interpretations where helpful

Protocol D: Advanced Applications
For students ready for more challenge:
1. Composite functions requiring multiple steps
2. Real-world applications and word problems
3. Connection to tangent lines and optimization
4. Integration of Power Rule with other mathematical concepts

Protocol E: Error Analysis and Correction
When students make mistakes:
1. Don't immediately give the correct answer
2. Ask them to check their work and identify potential errors
3. Guide them to the mistake with specific questions
4. Explain why the error occurred and how to avoid it
5. Provide similar practice to reinforce correct method

SECTION 4: RESPONSE PATTERNS

Question Types and Responses:

Student asks for help with homework:
- Don't solve it for them
- Break down the problem into steps
- Ask what they've tried already
- Guide them through each step with questions

Student shares their solution:
- Check their work step by step
- Praise correct reasoning
- Address any errors with explanations
- Suggest improvements or alternative methods

Student asks conceptual questions:
- Provide clear, visual explanations when possible
- Use concrete examples before abstract concepts
- Connect to their existing knowledge
- Check understanding with follow-up questions

Student seems frustrated or stuck:
- Break the problem into smaller parts
- Go back to simpler examples
- Encourage them and acknowledge the difficulty
- Provide additional scaffolding and support

Student asks about exam preparation:
- Focus on common question types and patterns
- Discuss exam technique and time management
- Provide practice suggestions
- Help them identify their strengths and areas for improvement

SECTION 5: MATHEMATICAL FORMATTING

When displaying mathematical expressions:
- Use clear notation: f(x) = x^3, f'(x) = 3x^2
- Show working steps: "Let f(x) = x^4, then f'(x) = 4x^(4-1) = 4x^3"
- Use fractions clearly: x^(1/2) or √x
- Be consistent with notation throughout explanations

For complex expressions, break them down:
Instead of: f(x) = 3x^4 - 2x^3 + x^2 - 5x + 7, f'(x) = 12x^3 - 6x^2 + 2x - 5
Show: 
"Let's differentiate term by term:
- 3x^4 becomes 3 × 4x^3 = 12x^3
- -2x^3 becomes -2 × 3x^2 = -6x^2  
- x^2 becomes 2x^1 = 2x
- -5x becomes -5 × 1x^0 = -5
- 7 (constant) becomes 0
Therefore: f'(x) = 12x^3 - 6x^2 + 2x - 5"

SECTION 6: PROGRESSION AND ASSESSMENT

Track student progress by observing:
- Accuracy in applying the Power Rule
- Speed and confidence in calculations
- Ability to handle increasingly complex functions
- Understanding of when and why to use the rule
- Connection to broader mathematical concepts

Provide feedback on:
- Correct application of mathematical procedures
- Mathematical reasoning and explanation quality
- Problem-solving strategies and approaches
- Progress toward mastery of the specification point

Adjust difficulty based on:
- Student responses and confidence levels
- Types of errors being made
- Time taken to complete problems
- Questions asked about concepts

SECTION 7: SESSION MANAGEMENT

Each learning session should:
1. Begin with a brief review of previous learning
2. Introduce new content or practice at appropriate level
3. Include guided practice with immediate feedback
4. End with summary of key learning points
5. Set expectations for next session or independent practice

Maintain engagement by:
- Varying problem types and contexts
- Celebrating successes and progress
- Connecting math to interesting applications
- Encouraging questions and mathematical curiosity
- Providing just the right level of challenge

Remember: Your goal is to help students develop deep understanding and confidence in differentiation using the Power Rule, preparing them for success in A-Level Mathematics and beyond.`;

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId, userId, specPoint } = await request.json();

    if (!message || !userId) {
      return NextResponse.json({ error: 'Message and userId are required' }, { status: 400 });
    }

    // Apply Redis rate limiting
    const rateLimitResult = await rateLimitApiRequest(userId, 'chat', request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: `Rate limit exceeded for ${rateLimitResult.tier} tier. Upgrade for higher limits.`,
          resetTime: rateLimitResult.resetTime,
          tier: rateLimitResult.tier,
          limit: rateLimitResult.limit,
          remaining: rateLimitResult.remaining
        }, 
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
            'X-RateLimit-Tier': rateLimitResult.tier
          }
        }
      );
    }

    // Check usage limits
    const estimatedInputTokens = Math.ceil(message.length / 4);
    const estimatedOutputTokens = 500;
    
    const usageCheck = await canMakeRequest(userId, estimatedInputTokens, estimatedOutputTokens);
    
    if (!usageCheck.allowed) {
      return NextResponse.json({ 
        error: 'usage_limit_exceeded',
        message: usageCheck.reason,
        usage: usageCheck.usage
      }, { status: 402 });
    }

    let currentSessionId = sessionId;

    // Handle session creation/retrieval
    if (!currentSessionId) {
      // Check for existing active session
      const { data: existingSession } = await supabase
        .from('learn_sessions')
        .select('id')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (existingSession) {
        currentSessionId = existingSession.id;
      } else {
        // Create new learn session
        const { data: newSession } = await supabase
          .from('learn_sessions')
          .insert({
            user_id: userId,
            spec_point: specPoint || '7.2',
            session_type: 'practice',
            first_message: message.substring(0, 100)
          })
          .select('id')
          .single();

        if (!newSession) {
          throw new Error('Failed to create learn session');
        }
        currentSessionId = newSession.id;
      }
    }

    // Update session with first message if needed
    if (message && message.trim()) {
      await supabase
        .from('learn_sessions')
        .update({ 
          first_message: message.substring(0, 100),
          updated_at: new Date().toISOString()
        })
        .eq('id', currentSessionId);
    }

    // Save user message (we'll create a simple message storage for learn sessions)
    // For now, we'll store messages in a JSON field or create a separate table
    // Let's use the existing pattern but adapt it for learn sessions

    // Get session history for context (this would need to be implemented based on your schema)
    // For now, we'll work with a simple approach
    const messages = [
      {
        role: 'user' as const,
        content: message
      }
    ];

    // Get comprehensive user profile for context
    const [studentProfileResponse, userProfileResponse] = await Promise.all([
      supabase
        .from('learn_student_subjects')
        .select('target_grade, exam_date, current_topic')
        .eq('user_id', userId)
        .eq('subject', 'Mathematics')
        .single(),
      supabase
        .from('user_profiles')
        .select(`
          subjects,
          universities,
          supercurriculars,
          timeline
        `)
        .eq('id', userId)
        .single()
    ]);

    const { data: studentProfile } = studentProfileResponse;
    const { data: userProfile } = userProfileResponse;

    // Build context string with comprehensive profile information
    let contextString = '';
    
    if (studentProfile) {
      contextString += '\n\nSTUDENT LEARNING CONTEXT:\n';
      contextString += `Target Grade: ${studentProfile.target_grade}\n`;
      contextString += `Exam Date: ${studentProfile.exam_date}\n`;
      if (studentProfile.current_topic) {
        contextString += `Current Topic: ${studentProfile.current_topic}\n`;
      }
    }

    if (userProfile) {
      // Add subjects information
      if (userProfile.subjects && userProfile.subjects.length > 0) {
        contextString += '\n\nSUBJECTS:\n';
        userProfile.subjects.forEach((subject: any) => {
          contextString += `- ${subject.name} (${subject.level})`;
          if (subject.grade_achieved) contextString += ` - Achieved: ${subject.grade_achieved}`;
          if (subject.target_grade) contextString += ` - Target: ${subject.target_grade}`;
          contextString += '\n';
        });
      }

      // Add university choices
      if (userProfile.universities && userProfile.universities.length > 0) {
        contextString += '\n\nUNIVERSITY CHOICES:\n';
        userProfile.universities.forEach((uni: any) => {
          contextString += `- ${uni.name}: ${uni.course} (${uni.type})\n`;
        });
      }

      // Add relevant supercurriculars (books, lectures, courses)
      if (userProfile.supercurriculars && userProfile.supercurriculars.length > 0) {
        const relevantSupercurriculars = userProfile.supercurriculars.filter((item: any) => 
          ['book', 'lecture', 'course', 'experience'].includes(item.type)
        );
        
        if (relevantSupercurriculars.length > 0) {
          contextString += '\n\nRELEVANT BACKGROUND:\n';
          relevantSupercurriculars.forEach((item: any) => {
            contextString += `- ${item.type}: ${item.title}`;
            if (item.description) contextString += ` - ${item.description.substring(0, 100)}`;
            if (item.relevance_to_subject) contextString += ` (Relevance: ${item.relevance_to_subject})`;
            contextString += '\n';
          });
        }
      }

      // Add timeline information
      if (userProfile.timeline) {
        contextString += '\n\nTIMELINE CONTEXT:\n';
        if (userProfile.timeline.current_status) {
          contextString += `Current Status: ${userProfile.timeline.current_status}\n`;
        }
        
        if (userProfile.timeline.exam_dates && userProfile.timeline.exam_dates.length > 0) {
          contextString += 'Upcoming Exams:\n';
          userProfile.timeline.exam_dates.forEach((exam: any) => {
            contextString += `  - ${exam.subject} (${exam.type}): ${exam.date}\n`;
          });
        }
      }
    }

    contextString += `\nCURRENT SESSION FOCUS: Spec Point ${specPoint || '7.2'} - Power Rule for Differentiation\n`;

    // Enhanced system prompt with context
    const enhancedSystemPrompt = LEARN_SYSTEM_PROMPT + contextString + 
      `\n\nPERSONALIZATION INSTRUCTIONS:
- Reference the student's profile information naturally when relevant to their learning
- Consider their target grades and university choices when setting appropriate challenge levels
- Connect mathematical concepts to their background reading, experiences, and interests where applicable
- Be mindful of their exam timeline and current status to provide appropriately paced learning
- Use their supercurricular activities (books, lectures, experiences) as examples when explaining concepts
- Adapt explanations to match their academic level based on their subject grades and university aspirations

Remember: You have access to comprehensive profile information about this student. Use it to provide truly personalized mathematics tutoring that connects to their goals, experiences, and timeline.`;

    // Create streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-5-20250929',
            max_tokens: 2000,
            system: enhancedSystemPrompt,
            messages: messages,
            stream: true
          });

          let fullResponse = '';

          for await (const chunk of response) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
              const text = chunk.delta.text;
              fullResponse += text;
              
              // Send chunk to client
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ 
                type: 'token', 
                content: text,
                sessionId: currentSessionId 
              })}\n\n`));
            }
          }

          // Record usage for billing/limits
          try {
            const actualInputTokens = Math.ceil(message.length / 4);
            const actualOutputTokens = Math.ceil(fullResponse.length / 4);
            await recordUsage(userId, 'other', actualInputTokens, actualOutputTokens);
          } catch (usageError) {
            console.error('Error recording usage:', usageError);
          }

          // Send completion signal
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ 
            type: 'complete',
            sessionId: currentSessionId 
          })}\n\n`));

          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ 
            type: 'error', 
            content: 'Sorry, I encountered an error. Please try again.' 
          })}\n\n`));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}