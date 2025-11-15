import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface RouteContext {
  params: {
    lessonId: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { lessonId } = params;

    if (!lessonId) {
      return NextResponse.json(
        { error: 'Lesson ID is required' },
        { status: 400 }
      );
    }

    // Query the learn_lessons table for lesson data
    const { data: lesson, error: lessonError } = await supabase
      .from('learn_lessons')
      .select(`
        id,
        spec_point,
        lesson_number,
        lesson_name,
        description,
        video_url,
        pdf_notes_url,
        created_at,
        updated_at
      `)
      .eq('id', lessonId)
      .single();

    if (lessonError) {
      console.error('Error fetching lesson:', lessonError);

      // Check if it's a "not found" error
      if (lessonError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Lesson not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: 'Database error while fetching lesson' },
        { status: 500 }
      );
    }

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Count total questions for this lesson
    // First get all questions for this lesson
    const { data: questions, error: questionsError } = await supabase
      .from('learn_questions')
      .select('id')
      .eq('lesson_id', lessonId);

    if (questionsError) {
      console.error('Error fetching questions:', questionsError);
      // Continue without question count rather than failing
    }

    // Count question parts across all questions
    let totalQuestionParts = 0;
    if (questions && questions.length > 0) {
      const questionIds = questions.map(q => q.id);

      const { count, error: partsError } = await supabase
        .from('learn_question_parts')
        .select('id', { count: 'exact', head: true })
        .in('question_id', questionIds);

      if (partsError) {
        console.error('Error counting question parts:', partsError);
        // Continue without question count
      } else {
        totalQuestionParts = count || 0;
      }
    }

    // Prepare response data
    const responseData = {
      id: lesson.id,
      specPoint: lesson.spec_point,
      lessonNumber: lesson.lesson_number,
      lessonName: lesson.lesson_name,
      description: lesson.description,
      videoUrl: lesson.video_url,
      pdfNotesUrl: lesson.pdf_notes_url,
      totalQuestions: totalQuestionParts,
      createdAt: lesson.created_at,
      updatedAt: lesson.updated_at
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Lessons API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
