import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { create, all } from 'mathjs';

const math = create(all);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Normalize LaTeX string for comparison
function normalizeLatex(latex: string): string {
  if (!latex) return '';

  return latex
    // Remove all whitespace
    .replace(/\s+/g, '')
    // Convert \times and \cdot to *
    .replace(/\\times/g, '*')
    .replace(/\\cdot/g, '*')
    // Remove curly braces around single characters (e.g., x^{6} -> x^6)
    .replace(/\{([^{}])\}/g, '$1')
    // Standardize fractions - \frac{a}{b} remains as is for now
    // Convert \div to /
    .replace(/\\div/g, '/')
    // Lowercase for case-insensitive comparison
    .toLowerCase();
}

// Check if two LaTeX expressions are mathematically equivalent
function areEquivalent(submitted: string, acceptable: string): boolean {
  // First try exact string match after normalization
  const normalizedSubmitted = normalizeLatex(submitted);
  const normalizedAcceptable = normalizeLatex(acceptable);

  if (normalizedSubmitted === normalizedAcceptable) {
    return true;
  }

  // Try mathjs symbolic comparison for algebraic equivalence
  try {
    // Convert common LaTeX to mathjs format
    const convertToMathjs = (latex: string): string => {
      return latex
        .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
        .replace(/\^/g, '^')
        .replace(/\\pi/g, 'pi')
        .replace(/\\sqrt\{([^}]+)\}/g, 'sqrt($1)')
        .replace(/\\sqrt\[([^\]]+)\]\{([^}]+)\}/g, '($2)^(1/$1)')
        .replace(/\\left/g, '')
        .replace(/\\right/g, '')
        .replace(/\{/g, '(')
        .replace(/\}/g, ')')
        .replace(/\\,/g, '');
    };

    const submittedMath = convertToMathjs(normalizedSubmitted);
    const acceptableMath = convertToMathjs(normalizedAcceptable);

    // Try to simplify and compare
    const simplifiedSubmitted = math.simplify(submittedMath).toString();
    const simplifiedAcceptable = math.simplify(acceptableMath).toString();

    return simplifiedSubmitted === simplifiedAcceptable;
  } catch (error) {
    // If mathjs fails, fall back to string comparison
    console.log('Mathjs comparison failed, using string comparison only:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, question_part_id, submitted_answer_latex, time_spent_seconds } = body;

    // Validate required fields
    if (!user_id || !question_part_id || submitted_answer_latex === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, question_part_id, submitted_answer_latex' },
        { status: 400 }
      );
    }

    // Fetch the question part with acceptable answers
    const { data: questionPart, error: fetchError } = await supabase
      .from('learn_question_parts')
      .select('id, acceptable_answers, marks')
      .eq('id', question_part_id)
      .single();

    if (fetchError || !questionPart) {
      console.error('Error fetching question part:', fetchError);
      return NextResponse.json(
        { error: 'Question part not found' },
        { status: 404 }
      );
    }

    // Get acceptable answers array
    const acceptableAnswers: string[] = questionPart.acceptable_answers || [];

    if (acceptableAnswers.length === 0) {
      return NextResponse.json(
        { error: 'No acceptable answers configured for this question' },
        { status: 500 }
      );
    }

    // Check if submitted answer matches any acceptable answer
    let isCorrect = false;
    for (const acceptableAnswer of acceptableAnswers) {
      if (areEquivalent(submitted_answer_latex, acceptableAnswer)) {
        isCorrect = true;
        break;
      }
    }

    // Calculate marks awarded
    const marksAwarded = isCorrect ? (questionPart.marks || 1) : 0;

    // Get current attempt number for this user and question part
    const { data: previousAttempts } = await supabase
      .from('learn_user_answers')
      .select('attempt_number')
      .eq('user_id', user_id)
      .eq('question_part_id', question_part_id)
      .order('attempt_number', { ascending: false })
      .limit(1);

    const attemptNumber = previousAttempts && previousAttempts.length > 0
      ? previousAttempts[0].attempt_number + 1
      : 1;

    // Save the answer to database
    const { error: insertError } = await supabase
      .from('learn_user_answers')
      .insert({
        user_id,
        question_part_id,
        submitted_answer_latex,
        is_correct: isCorrect,
        marks_awarded: marksAwarded,
        attempt_number: attemptNumber,
        time_spent_seconds: time_spent_seconds || 0,
      });

    if (insertError) {
      console.error('Error saving answer:', insertError);
      return NextResponse.json(
        { error: 'Failed to save answer' },
        { status: 500 }
      );
    }

    // Prepare response
    const correctAnswer = acceptableAnswers[0]; // Show first acceptable answer
    const feedback = isCorrect
      ? 'Correct! Well done.'
      : `Incorrect. The correct answer is: ${correctAnswer}`;

    return NextResponse.json({
      correct: isCorrect,
      correctAnswer: correctAnswer,
      feedback: feedback,
      marksAwarded: marksAwarded,
      attemptNumber: attemptNumber,
    });

  } catch (error) {
    console.error('Answer submission API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
