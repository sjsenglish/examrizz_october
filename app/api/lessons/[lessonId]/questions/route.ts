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

    // Fetch all questions with their parts using nested query
    const { data: questions, error } = await supabase
      .from('learn_questions')
      .select(`
        id,
        question_code,
        difficulty_level,
        instructions,
        display_order,
        learn_question_parts (
          id,
          part_letter,
          question_latex,
          question_display,
          solution_steps,
          marks,
          display_order
        )
      `)
      .eq('lesson_id', lessonId)
      .order('display_order');

    if (error) {
      console.error('Error fetching questions:', error);
      return NextResponse.json(
        { error: 'Database error while fetching questions' },
        { status: 500 }
      );
    }

    // Transform data to match frontend expectations (camelCase format)
    const transformedQuestions = questions?.map(question => ({
      code: question.question_code,
      difficulty: question.difficulty_level,
      instructions: question.instructions,
      parts: question.learn_question_parts?.map((part: any) => ({
        id: part.id,
        letter: part.part_letter,
        questionLatex: part.question_latex,
        questionDisplay: part.question_display,
        solutionSteps: part.solution_steps,
        marks: part.marks
      })) || []
    })) || [];

    return NextResponse.json({
      success: true,
      questions: transformedQuestions
    });

  } catch (error: any) {
    console.error('Questions API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
