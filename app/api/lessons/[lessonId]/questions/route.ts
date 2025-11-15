import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { lessonId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

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
          answer_latex,
          answer_display,
          acceptable_answers,
          marks,
          display_order
        )
      `)
      .eq('lesson_id', params.lessonId)
      .order('display_order');

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      questions: questions || []
    });

  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error.message
    }, { status: 500 });
  }
}
