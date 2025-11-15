import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await context.params;

    if (!lessonId) {
      return NextResponse.json(
        { error: 'Lesson ID is required' },
        { status: 400 }
      );
    }

    // Fetch all questions for this lesson
    const { data: questions, error: questionsError } = await supabase
      .from('learn_questions')
      .select('id, code, difficulty, instructions, display_order')
      .eq('lesson_id', lessonId)
      .order('display_order', { ascending: true });

    if (questionsError) {
      console.error('Error fetching questions:', questionsError);
      return NextResponse.json(
        { error: 'Database error while fetching questions' },
        { status: 500 }
      );
    }

    if (!questions || questions.length === 0) {
      return NextResponse.json({ questions: [] });
    }

    // Fetch question parts for all questions
    const questionIds = questions.map(q => q.id);
    const { data: parts, error: partsError } = await supabase
      .from('learn_question_parts')
      .select('question_id, letter, question_latex, question_display, display_order')
      .in('question_id', questionIds)
      .order('display_order', { ascending: true });

    if (partsError) {
      console.error('Error fetching question parts:', partsError);
      return NextResponse.json(
        { error: 'Database error while fetching question parts' },
        { status: 500 }
      );
    }

    // Group parts by question
    const questionsWithParts = questions.map(question => {
      const questionParts = parts?.filter(p => p.question_id === question.id) || [];
      return {
        code: question.code,
        difficulty: question.difficulty,
        instructions: question.instructions,
        parts: questionParts.map(part => ({
          letter: part.letter,
          questionLatex: part.question_latex,
          questionDisplay: part.question_display
        }))
      };
    });

    return NextResponse.json({ questions: questionsWithParts });

  } catch (error) {
    console.error('Questions API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
