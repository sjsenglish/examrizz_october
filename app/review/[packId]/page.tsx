'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { getQuestionsByIds } from '../../../lib/algolia';
import './review.css';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Question {
  objectID: string;
  question_text: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
    E?: string;
  };
  answer_letter: string;
  year?: string;
  image_url?: string;
  passage?: string;
  video_url?: string;
  rawData?: any;
}

interface Pack {
  id: string;
  name: string;
  subject: string;
  questions: Question[];
}

interface AttemptData {
  answers: Record<string, string>;
  user_answers?: Record<string, string>; // For backward compatibility
  score: number;
  total_questions: number;
  time_taken: number;
  time_taken_seconds?: number;
  completed_at: string;
}

const formatTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '0m 0s';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

// Firebase image URL conversion function
function getFirebaseImageUrl(gsUrl: string): string {
  if (!gsUrl || !gsUrl.startsWith('gs://')) return '';
  
  const urlParts = gsUrl.replace('gs://', '').split('/');
  const bucketName = urlParts[0];
  const filePath = urlParts.slice(1).join('/');
  const encodedPath = encodeURIComponent(filePath);
  
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedPath}?alt=media`;
}

// YouTube URL conversion function
function getYouTubeEmbedUrl(url: string): string {
  if (!url) return '';
  
  // If it's already an embed URL, return as is
  if (url.includes('youtube.com/embed/')) {
    return url;
  }
  
  // Handle various YouTube URL formats
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      const videoId = match[1];
      // Remove any additional parameters after the video ID
      const cleanVideoId = videoId.split('&')[0].split('?')[0];
      return `https://www.youtube.com/embed/${cleanVideoId}`;
    }
  }
  
  // If it's not a recognized YouTube URL, return the original
  // This allows for other video platforms or direct links
  return url;
}

// =============================================================================
// SUBJECT-SPECIFIC REVIEW RENDERERS
// =============================================================================

// TSA Review Renderer
function TSAReviewRenderer({ 
  question, 
  questionNumber, 
  userAnswer, 
  correctAnswer 
}: { 
  question: Question; 
  questionNumber: number; 
  userAnswer: string | undefined;
  correctAnswer: string;
}) {
  const data = question.rawData || question;
  
  return (
    <div className="review-question-container">
      <div className="review-question-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="review-question-number">Question {questionNumber}</span>
          {data?.year && (
            <span className="review-year-info">({data.year})</span>
          )}
          <div className={`review-status-badge ${userAnswer === correctAnswer ? 'correct' : 'incorrect'}`}>
            {userAnswer === correctAnswer ? '✓ CORRECT' : '✗ INCORRECT'}
          </div>
        </div>
        <div className="review-difficulty">Question Difficulty B</div>
      </div>

      <div className="review-question-content">
        {/* Question passage/content */}
        {data?.question_content && (
          <div className="review-question-passage">
            {data.question_content}
          </div>
        )}

        {/* Question image */}
        {(data?.has_image_question && (data?.imageFile || data?.question_image)) || question.image_url && (
          <div className="review-question-image-container">
            <img 
              src={question.image_url || getFirebaseImageUrl(data.imageFile || data.question_image)} 
              alt="Question" 
              className="review-question-image"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* The actual question */}
        <div className="review-question-text">
          {data?.question || question.question_text || 'Question text not available'}
        </div>
        
        {/* Answer options - handle both new and legacy formats */}
        {data?.options && Array.isArray(data.options) ? (
          <div className="review-options-list">
            {data.options.map((option: any) => {
              const isUserAnswer = option.id === userAnswer;
              const isCorrectAnswer = option.id === correctAnswer;
              
              let className = 'review-option-item';
              if (isCorrectAnswer) {
                className += ' correct-answer';
              }
              if (isUserAnswer && !isCorrectAnswer) {
                className += ' user-incorrect';
              }

              return (
                <div key={option.id} className={className}>
                  <span className="review-option-letter">{option.id}</span>
                  <span className="review-option-text">{option.text}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="review-options-list">
            {Object.entries(question.options || {}).map(([label, text]) => {
              const textStr = typeof text === 'string' ? text : String(text || '');
              if (!textStr || textStr === `Option ${label}`) return null;
              
              const isUserAnswer = label === userAnswer;
              const isCorrectAnswer = label === correctAnswer;
              
              let className = 'review-option-item';
              if (isCorrectAnswer) {
                className += ' correct-answer';
              }
              if (isUserAnswer && !isCorrectAnswer) {
                className += ' user-incorrect';
              }

              return (
                <div key={label} className={className}>
                  <span className="review-option-letter">{label}</span>
                  <span className="review-option-text">{textStr}</span>
                </div>
              );
            }).filter(Boolean)}
          </div>
        )}
      </div>
    </div>
  );
}

// BMAT Review Renderer (placeholder for future implementation)
function BMATReviewRenderer({ 
  question, 
  questionNumber, 
  userAnswer, 
  correctAnswer 
}: { 
  question: Question; 
  questionNumber: number; 
  userAnswer: string | undefined;
  correctAnswer: string;
}) {
  // TODO: Implement BMAT-specific review rendering when BMAT data structure is available
  return (
    <DefaultReviewRenderer 
      question={question}
      questionNumber={questionNumber}
      userAnswer={userAnswer}
      correctAnswer={correctAnswer}
    />
  );
}

// UCAT Review Renderer (placeholder for future implementation)
function UCATReviewRenderer({ 
  question, 
  questionNumber, 
  userAnswer, 
  correctAnswer 
}: { 
  question: Question; 
  questionNumber: number; 
  userAnswer: string | undefined;
  correctAnswer: string;
}) {
  // TODO: Implement UCAT-specific review rendering when UCAT data structure is available
  return (
    <DefaultReviewRenderer 
      question={question}
      questionNumber={questionNumber}
      userAnswer={userAnswer}
      correctAnswer={correctAnswer}
    />
  );
}

// Default Review Renderer (fallback)
function DefaultReviewRenderer({ 
  question, 
  questionNumber, 
  userAnswer, 
  correctAnswer 
}: { 
  question: Question; 
  questionNumber: number; 
  userAnswer: string | undefined;
  correctAnswer: string;
}) {
  return (
    <div className="review-question-container">
      <div className="review-question-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="review-question-number">Question {questionNumber}</span>
          <div className={`review-status-badge ${userAnswer === correctAnswer ? 'correct' : 'incorrect'}`}>
            {userAnswer === correctAnswer ? '✓ CORRECT' : '✗ INCORRECT'}
          </div>
        </div>
      </div>

      <div className="review-question-content">
        <div className="review-question-text">
          {question.question_text}
        </div>

        <div className="review-options-list">
          {Object.entries(question.options || {}).map(([label, text]) => {
            const textStr = typeof text === 'string' ? text : String(text || '');
            if (!textStr || textStr === `Option ${label}`) return null;
            
            const isUserAnswer = label === userAnswer;
            const isCorrectAnswer = label === correctAnswer;
            
            let className = 'review-option-item';
            if (isCorrectAnswer) {
              className += ' correct-answer';
            }
            if (isUserAnswer && !isCorrectAnswer) {
              className += ' user-incorrect';
            }

            return (
              <div key={label} className={className}>
                <span className="review-option-letter">{label}</span>
                <span className="review-option-text">{textStr}</span>
              </div>
            );
          }).filter(Boolean)}
        </div>
      </div>
    </div>
  );
}

// Main Review Question Renderer - routes to subject-specific renderer
function ReviewQuestionRenderer({ 
  question, 
  questionNumber, 
  subject, 
  userAnswer, 
  correctAnswer 
}: { 
  question: Question; 
  questionNumber: number; 
  subject: string; 
  userAnswer: string | undefined;
  correctAnswer: string;
}) {
  // Subject-specific rendering logic
  switch (subject?.toUpperCase()) {
    case 'TSA':
      return (
        <TSAReviewRenderer 
          question={question}
          questionNumber={questionNumber}
          userAnswer={userAnswer}
          correctAnswer={correctAnswer}
        />
      );
    case 'BMAT':
      return (
        <BMATReviewRenderer 
          question={question}
          questionNumber={questionNumber}
          userAnswer={userAnswer}
          correctAnswer={correctAnswer}
        />
      );
    case 'UCAT':
      return (
        <UCATReviewRenderer 
          question={question}
          questionNumber={questionNumber}
          userAnswer={userAnswer}
          correctAnswer={correctAnswer}
        />
      );
    // Add more subjects here as needed:
    // case 'INTERVIEW':
    //   return <InterviewReviewRenderer ... />;
    default:
      return (
        <DefaultReviewRenderer 
          question={question}
          questionNumber={questionNumber}
          userAnswer={userAnswer}
          correctAnswer={correctAnswer}
        />
      );
  }
}

export default function ReviewPage({ params }: { params: Promise<{ packId: string }> }) {
  const resolvedParams = use(params);
  const [pack, setPack] = useState<Pack | null>(null);
  const [attemptData, setAttemptData] = useState<AttemptData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPackAndAttempt();
  }, [resolvedParams.packId]);

  const fetchPackAndAttempt = async () => {
    try {
      setLoading(true);

      // Fetch pack data
      const { data: packData, error: packError } = await supabase
        .from('question_packs')
        .select('*')
        .eq('id', resolvedParams.packId)
        .single();

      if (packError) throw packError;

      // Fetch latest attempt
      const { data: attemptData, error: attemptError } = await supabase
        .from('pack_attempts')
        .select('*')
        .eq('pack_id', resolvedParams.packId)
        .order('completed_at', { ascending: false })
        .limit(1)
        .single();

      if (attemptError) throw attemptError;

      // Fetch questions for this pack from pack_questions table
      const { data: questionData, error: questionsError } = await supabase
        .from('pack_questions')
        .select('question_id, position')
        .eq('pack_id', resolvedParams.packId)
        .order('position');

      if (questionsError) {
        console.error('Error fetching pack questions:', questionsError);
        throw new Error('Failed to load pack questions');
      }

      let questions: Question[] = [];
      
      if (questionData && questionData.length > 0) {
        const questionIds = questionData.map(q => q.question_id);
        
        try {
          const algoliaQuestions = await getQuestionsByIds(packData.subject || 'TSA', questionIds);
          
          
          questions = algoliaQuestions.map((q: any) => {
            return {
            objectID: q.objectID,
            question_text: q.question || q.question_text || q.content || 'Question text not available',
            rawData: q,
            options: (() => {
              // Handle case where options might already be an object or array
              if (q.options && typeof q.options === 'object' && !Array.isArray(q.options)) {
                // If it's already an object with A, B, C, D keys, use it
                if (q.options.A || q.options.a) {
                  return {
                    A: q.options.A || q.options.a || 'Option A',
                    B: q.options.B || q.options.b || 'Option B', 
                    C: q.options.C || q.options.c || 'Option C',
                    D: q.options.D || q.options.d || 'Option D',
                    E: q.options.E || q.options.e || undefined
                  };
                }
              }
              // Otherwise construct from individual fields
              return {
                A: q.answera || q.option_a || 'Option A',
                B: q.answerb || q.option_b || 'Option B',
                C: q.answerc || q.option_c || 'Option C',
                D: q.answerd || q.option_d || 'Option D',
                E: q.answere || q.option_e || undefined
              };
            })(),
            answer_letter: q.correct_answer || q.answer_letter || 'A',
            year: q.year || null,
            image_url: q.image_url ? q.image_url.replace('gs://question-images/', 'https://storage.googleapis.com/question-images/') : null,
            passage: q.passage || null,
            video_url: q.videoSolutionLink || q.video_url || null
          };
        });
        } catch (algoliaError) {
          console.error('Error fetching from Algolia:', algoliaError);
          throw new Error('Failed to load questions');
        }
      }
      
      setPack({
        id: packData.id,
        name: packData.name,
        subject: packData.subject,
        questions: questions
      });

      setAttemptData(attemptData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load review data');
    } finally {
      setLoading(false);
    }
  };

  const jumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handlePracticeAgain = () => {
    window.location.href = `/practice-session/${resolvedParams.packId}`;
  };

  if (loading) {
    return (
      <div className="review-wrapper">
        <div className="review-loading">Loading review...</div>
      </div>
    );
  }

  if (error || !pack || !attemptData) {
    return (
      <div className="review-wrapper">
        <div className="review-error">{error || 'Review data not found'}</div>
      </div>
    );
  }

  if (!pack.questions || pack.questions.length === 0) {
    return (
      <div className="review-wrapper">
        <div className="review-error">No questions found for this pack</div>
      </div>
    );
  }

  const currentQuestion = pack.questions[currentQuestionIndex];
  
  if (!currentQuestion) {
    return (
      <div className="review-wrapper">
        <div className="review-error">Question not found</div>
      </div>
    );
  }
  
  // Safely access user answer with fallback - check both 'answers' and 'user_answers' for compatibility
  const userAnswers = attemptData?.answers || attemptData?.user_answers || {};
  const userAnswer = currentQuestion?.objectID ? userAnswers[currentQuestion.objectID] : undefined;
    
  // Use the actual userAnswer from the database (don't convert to empty string)
  const displayUserAnswer = userAnswer;
    
  const correctAnswer = currentQuestion.answer_letter;
  const correctCount = (userAnswers && pack?.questions) 
    ? Object.keys(userAnswers).filter(
        (questionId) => {
          const question = pack.questions.find(q => q.objectID === questionId);
          return question && userAnswers[questionId] === question.answer_letter;
        }
      ).length
    : 0;
  const incorrectCount = attemptData.total_questions - correctCount;
  const scorePercentage = Math.round((correctCount / attemptData.total_questions) * 100);

  return (
    <div className="review-wrapper">
      {/* Navbar */}
      <nav className="review-navbar">
        <a href="/" className="review-logo">
          examrizzsearch
        </a>
        <button className="review-menu-button">
          <div className="review-menu-line"></div>
          <div className="review-menu-line"></div>
          <div className="review-menu-line"></div>
        </button>
      </nav>

      {/* Back Button */}
      <Link 
        href="/practice"
        style={{
          position: 'absolute',
          top: '80px',
          left: '40px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '9px 18px',
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          textDecoration: 'none',
          color: '#333333',
          fontFamily: "'Madimi One', cursive",
          fontSize: '13px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          zIndex: 20
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back
      </Link>

      {/* Quiz Review Header */}
      <div className="review-header-container">
        <div className="review-header-content">
          <div className="review-header-left">
            <h1 className="review-title">Quiz Review</h1>
            <div className="review-pack-info">{pack.name}</div>
            <div className="review-stats">
              <div className="review-stat-item">
                <div className="review-stat-circle correct"></div>
                <span>{correctCount} Correct</span>
              </div>
              <div className="review-stat-item">
                <div className="review-stat-circle incorrect"></div>
                <span>{incorrectCount} Incorrect</span>
              </div>
              <div className="review-stat-separator">•</div>
              <div className="review-stat-item">
                <span>{scorePercentage}% Score</span>
              </div>
              <div className="review-stat-separator">•</div>
              <div className="review-stat-item">
                <span>Time: {formatTime(attemptData.time_taken_seconds || attemptData.time_taken || 0)}</span>
              </div>
            </div>
            <button className="review-practice-again-button" onClick={handlePracticeAgain}>
              Practice again ▶
            </button>
          </div>

          <div className="review-header-right">
            <div className="review-question-numbers">
              {pack.questions.map((question, index) => {
                const userAns = question?.objectID ? userAnswers[question.objectID] : undefined;
                const isCorrect = userAns === question.answer_letter;
                const isAnswered = userAns !== undefined;
                
                return (
                  <button
                    key={index}
                    className={`review-question-number-box ${
                      index === currentQuestionIndex ? 'active' : ''
                    } ${
                      isAnswered ? (isCorrect ? 'correct' : 'incorrect') : ''
                    }`}
                    onClick={() => jumpToQuestion(index)}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="review-content-container">
        {/* Left Side - Question */}
        <div className="review-question-section">
          {currentQuestion && (
            <ReviewQuestionRenderer 
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              subject={pack.subject}
              userAnswer={displayUserAnswer}
              correctAnswer={correctAnswer}
            />
          )}
        </div>

        {/* Right Side - Video Solution */}
        <div className="review-video-section">
          <div className="review-video-container">
            <h3 className="review-video-title">Video Walkthrough</h3>
            
            <div className="review-video-player">
              {currentQuestion.video_url ? (
                <iframe
                  src={getYouTubeEmbedUrl(currentQuestion.video_url)}
                  width="100%"
                  height="300"
                  frameBorder="0"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              ) : (
                <div className="review-video-placeholder">
                  <p>respective video</p>
                  <p>possible like</p>
                  <p>this?</p>
                </div>
              )}
            </div>

            <div className="review-answer-indicators">
              <div className={`review-answer-indicator ${displayUserAnswer === correctAnswer ? 'correct' : 'incorrect'}`}>
                Your Answer: {displayUserAnswer || 'Not answered'}
              </div>
              <div className="review-answer-indicator correct">
                Correct Answer: {correctAnswer}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}