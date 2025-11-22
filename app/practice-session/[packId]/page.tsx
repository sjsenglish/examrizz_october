'use client';

import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { getQuestionsByIds } from '../../../lib/algolia';
import './practice-session.css';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Helper function for Firebase image URL conversion
function getFirebaseImageUrl(gsUrl: string): string {
  if (!gsUrl || !gsUrl.startsWith('gs://')) return '';
  
  const urlParts = gsUrl.replace('gs://', '').split('/');
  const bucketName = urlParts[0];
  const filePath = urlParts.slice(1).join('/');
  const encodedPath = encodeURIComponent(filePath);
  
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedPath}?alt=media`;
}

interface Question {
  objectID: string;
  question_text: string;
  answer_letter: string;
  marks: number;
  video_url?: string | null;
  rawData?: any;
  options?: {
    A: string;
    B: string;
    C: string;
    D: string;
    E?: string;
  };
}

interface QuestionPack {
  id: string;
  name: string;
  subject: string;
  created_at: string;
  questions: Question[];
}

// =============================================================================
// SUBJECT-SPECIFIC QUESTION RENDERERS
// =============================================================================

// TSA Question Renderer for Practice
function TSAPracticeRenderer({ 
  question, 
  questionNumber, 
  selectedAnswer, 
  onAnswerSelect 
}: { 
  question: Question; 
  questionNumber: number;
  selectedAnswer?: string;
  onAnswerSelect: (answer: string) => void;
}) {
  const data = question.rawData;
  
  return (
    <div className="practice-question-container">
      <div className="practice-question-header">
        <span className="practice-question-number">Question {questionNumber}</span>
        {data?.year && <span className="practice-year-info">({data.year})</span>}
      </div>

      <div className="practice-question-content">
        {/* Question passage/content */}
        {data?.question_content && (
          <div className="practice-question-passage">
            {data.question_content}
          </div>
        )}

        {/* Question image (if has_image_question is true) */}
        {data?.has_image_question && (data?.imageFile || data?.question_image) && (
          <div className="practice-question-image-container">
            <img 
              src={getFirebaseImageUrl(data.imageFile || data.question_image)} 
              alt="Question"
              className="practice-question-image"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* The actual question */}
        {data?.question && (
          <div className="practice-question-text">
            {data.question}
          </div>
        )}
        
        {/* Answer options */}
        {data?.options && Array.isArray(data.options) && (
          <div className="practice-options-list">
            {data.options.map((option: any) => (
              <div 
                key={option.id}
                className={`practice-option-item ${selectedAnswer === option.id ? 'selected' : ''}`}
                onClick={() => onAnswerSelect(option.id)}
              >
                <span className="practice-option-letter">{option.id}</span>
                <span className="practice-option-text">{option.text}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Fallback for legacy option format */}
        {(!data?.options || !Array.isArray(data.options)) && question.options && (
          <div className="practice-options-list">
            {Object.entries(question.options).map(([letter, text]) => (
              <div 
                key={letter}
                className={`practice-option-item ${selectedAnswer === letter ? 'selected' : ''}`}
                onClick={() => onAnswerSelect(letter)}
              >
                <span className="practice-option-letter">{letter}</span>
                <span className="practice-option-text">{text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Default Practice Renderer (fallback)
function DefaultPracticeRenderer({ 
  question, 
  questionNumber, 
  selectedAnswer, 
  onAnswerSelect 
}: { 
  question: Question; 
  questionNumber: number;
  selectedAnswer?: string;
  onAnswerSelect: (answer: string) => void;
}) {
  return (
    <div className="practice-question-container">
      <div className="practice-question-header">
        <span className="practice-question-number">Question {questionNumber}</span>
      </div>

      <div className="practice-question-content">
        <div className="practice-question-text">
          {question.question_text}
        </div>
        
        {question.options && (
          <div className="practice-options-list">
            {Object.entries(question.options).map(([letter, text]) => (
              <div 
                key={letter}
                className={`practice-option-item ${selectedAnswer === letter ? 'selected' : ''}`}
                onClick={() => onAnswerSelect(letter)}
              >
                <span className="practice-option-letter">{letter}</span>
                <span className="practice-option-text">{text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Main Practice Question Renderer - routes to subject-specific renderer
function PracticeQuestionRenderer({ 
  question, 
  questionNumber, 
  subject, 
  selectedAnswer, 
  onAnswerSelect 
}: { 
  question: Question; 
  questionNumber: number; 
  subject: string;
  selectedAnswer?: string;
  onAnswerSelect: (answer: string) => void;
}) {
  switch (subject?.toUpperCase()) {
    case 'TSA':
      return (
        <TSAPracticeRenderer 
          question={question} 
          questionNumber={questionNumber}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={onAnswerSelect}
        />
      );
    case 'BMAT':
      // TODO: Implement BMAT-specific practice rendering
      return (
        <DefaultPracticeRenderer 
          question={question} 
          questionNumber={questionNumber}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={onAnswerSelect}
        />
      );
    case 'UCAT':
      // TODO: Implement UCAT-specific practice rendering  
      return (
        <DefaultPracticeRenderer 
          question={question} 
          questionNumber={questionNumber}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={onAnswerSelect}
        />
      );
    default:
      return (
        <DefaultPracticeRenderer 
          question={question} 
          questionNumber={questionNumber}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={onAnswerSelect}
        />
      );
  }
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function PracticeSessionPage({ params }: { params: Promise<{ packId: string }> }) {
  const { packId } = use(params);
  const [pack, setPack] = useState<QuestionPack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [startTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((new Date().getTime() - startTime.getTime()) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  // Fetch pack data
  useEffect(() => {
    const fetchPackData = async () => {
      try {
        setLoading(true);
        
        // Fetch pack from Supabase
        const { data: packData, error: packError } = await (supabase as any)
          .from('question_packs')
          .select('*')
          .eq('id', packId)
          .single();

        if (packError) {
          console.error('Error fetching pack:', packError);
          setError('Pack not found');
          setLoading(false);
          return;
        }

        // Fetch questions for this pack
        const { data: questionData, error: questionsError } = await (supabase as any)
          .from('pack_questions')
          .select('question_id, position')
          .eq('pack_id', packId)
          .order('position');

        if (questionsError) {
          console.error('Error fetching questions:', questionsError);
          setError('Failed to load questions');
          setLoading(false);
          return;
        }

        let questions: Question[] = [];
        
        if (questionData && questionData.length > 0) {
          const questionIds = questionData.map((q: any) => q.question_id);
          
          try {
            const algoliaQuestions = await getQuestionsByIds(packData.subject || 'TSA', questionIds);
            
            questions = algoliaQuestions.map((q: any) => ({
              objectID: q.objectID,
              rawData: q,
              question_text: q.question || q.question_text || q.content || 'Question text not available',
              answer_letter: q.correct_answer || q.answer_letter || 'A',
              marks: Number(q.marks) || 1,
              video_url: q.videoSolutionLink || q.video_url || null,
              options: q.options || {
                A: q.answera || q.option_a || 'Option A',
                B: q.answerb || q.option_b || 'Option B',
                C: q.answerc || q.option_c || 'Option C',
                D: q.answerd || q.option_d || 'Option D',
                E: q.answere || q.option_e || 'Option E'
              }
            }));
          } catch (algoliaError) {
            console.error('Error fetching from Algolia:', algoliaError);
            setError('Failed to load questions');
            setLoading(false);
            return;
          }
        }

        const packWithQuestions: QuestionPack = {
          id: packData.id,
          name: packData.name,
          subject: packData.subject || 'Unknown Subject',
          created_at: packData.created_at,
          questions: questions
        };

        setPack(packWithQuestions);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load pack');
      } finally {
        setLoading(false);
      }
    };

    fetchPackData();
  }, [packId]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (!pack) return;
    
    if (currentQuestionIndex < pack.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Last question - finish quiz
      handleFinishQuiz();
    }
  };

  const isLastQuestion = pack ? currentQuestionIndex === pack.questions.length - 1 : false;

  const jumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleAnswerSelect = (answer: string) => {
    if (!pack || quizCompleted) return;
    
    const currentQuestion = pack.questions[currentQuestionIndex];
    const newAnswers = { ...userAnswers, [currentQuestion.objectID]: answer };
    setUserAnswers(newAnswers);
    
    // Update answered questions set
    const newAnsweredQuestions = new Set(answeredQuestions);
    newAnsweredQuestions.add(currentQuestionIndex);
    setAnsweredQuestions(newAnsweredQuestions);
  };

  const calculateScore = () => {
    if (!pack) return { correct: 0, total: 0 };
    
    let correct = 0;
    pack.questions.forEach((question) => {
      const userAnswer = userAnswers[question.objectID];
      if (userAnswer === question.answer_letter) {
        correct++;
      }
    });
    
    return { correct, total: pack.questions.length };
  };

  const saveAttemptToSupabase = async (score: number, totalQuestions: number, timeTaken: number) => {
    try {
      // Get current user - if not logged in, skip saving
      let { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        // User not logged in - skip saving to database but allow practice to continue
        console.log('User not logged in - skipping attempt save');
        return true; // Return success to allow practice session to complete
      }

      // Prepare answers object with question_id as key
      const answersObject: Record<string, string> = {};
      pack?.questions.forEach((question) => {
        const userAnswer = userAnswers[question.objectID];
        if (userAnswer) {
          answersObject[question.objectID] = userAnswer;
        }
      });

      const { error } = await (supabase as any)
        .from('pack_attempts')
        .insert([
          {
            pack_id: packId,
            user_id: user.id,
            score: score,
            total_questions: totalQuestions,
            time_taken_seconds: timeTaken,
            answers: answersObject
          }
        ]);

      if (error) {
        console.error('Error saving attempt:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving attempt:', error);
      return false;
    }
  };

  const handleFinishQuiz = async () => {
    if (!pack) return;
    
    setQuizCompleted(true);
    const finalTime = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
    const { correct, total } = calculateScore();
    
    // Save to Supabase
    const saved = await saveAttemptToSupabase(correct, total, finalTime);
    
    if (saved) {
      // Redirect to review page after short delay
      setTimeout(() => {
        window.location.href = `/review/${pack.id}`;
      }, 2000);
    } else {
      // Still redirect even if save failed
      setTimeout(() => {
        window.location.href = `/review/${pack.id}`;
      }, 2000);
    }
  };

  if (loading) {
    return (
      <div className="practice-session-wrapper">
        <div className="practice-loading">Loading practice session...</div>
      </div>
    );
  }

  if (error || !pack) {
    return (
      <div className="practice-session-wrapper">
        <div className="practice-error">{error || 'Pack not found'}</div>
      </div>
    );
  }

  const currentQuestion = pack.questions[currentQuestionIndex];
  const currentQuestionAnswer = currentQuestion ? userAnswers[currentQuestion.objectID] : undefined;

  return (
    <div className="practice-session-wrapper">
      {/* Navbar */}
      <nav className="practice-navbar">
        <a href="/" className="practice-logo">
          examrizzsearch
        </a>
        <button className="practice-menu-button">
          <div className="practice-menu-line"></div>
          <div className="practice-menu-line"></div>
          <div className="practice-menu-line"></div>
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

      <div className="practice-session-container">
        {/* Left Side - Question */}
        <div className="practice-question-section">
          {currentQuestion && (
            <PracticeQuestionRenderer 
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              subject={pack.subject}
              selectedAnswer={currentQuestionAnswer}
              onAnswerSelect={handleAnswerSelect}
            />
          )}

          {/* Navigation Buttons */}
          <div className="practice-navigation-buttons">
            <button 
              className="practice-previous-button"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0 || quizCompleted}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Previous Question
            </button>

            <button 
              className="practice-next-button"
              onClick={handleNextQuestion}
              disabled={quizCompleted}
            >
              {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Right Side - Pack Info and Overview */}
        <div className="practice-info-section">
          {/* Pack Title */}
          <div className="practice-pack-title-box">
            <h1 className="practice-pack-title">{pack.name}</h1>
            <span className="practice-pack-subtitle">{pack.questions.length} Questions</span>
          </div>

          {/* Question Overview */}
          <div className="practice-question-overview">
            <h2 className="practice-overview-title">Question Overview</h2>
            
            <div className="practice-question-numbers">
              {pack.questions.map((_, index) => (
                <button
                  key={index}
                  className={`practice-question-number-box ${
                    index === currentQuestionIndex ? 'active' : ''
                  } ${
                    answeredQuestions.has(index) ? 'answered' : ''
                  }`}
                  onClick={() => jumpToQuestion(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            
            <div className="practice-overview-footer">
              <div className="practice-time">
                Time: {formatTime(elapsedTime)}
              </div>
              <div className="practice-question-count">
                Question {currentQuestionIndex + 1} of {pack.questions.length}
              </div>
            </div>
          </div>
        </div>

        {/* Cowboy Icon */}
        <div className="practice-cowboy-icon">
          <Image 
            src="/icons/cowboy-guitar.svg"
            alt="Cowboy with guitar"
            width={120}
            height={120}
          />
        </div>
      </div>
    </div>
  );
}