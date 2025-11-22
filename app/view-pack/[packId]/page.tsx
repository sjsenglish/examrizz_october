'use client';

import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { getQuestionsByIds } from '../../../lib/algolia';
import './view-pack.css';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Question {
  objectID: string;
  question_text: string;
  answer_letter: string;
  marks: number;
  video_url?: string | null;
  rawData?: any; // Original Algolia data for subject-specific rendering
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

const mockPack: QuestionPack = {
  id: 'pack-123',
  name: 'Integration Basics',
  subject: 'Edexcel A Level Maths',
  created_at: '2025-10-17',
  questions: [
    {
      objectID: '2022-1',
      question_text: 'Simplify the following: b/q× k/u',
      answer_letter: 'B',
      marks: 2,
      video_url: null,
      options: {
        A: 'y²/6',
        B: 'y²/6',
        C: 'y²/6',
        D: 'y²/6',
        E: 'y²/6'
      }
    },
    {
      objectID: '2022-2',
      question_text: 'What is the integral of x² dx?',
      answer_letter: 'C',
      marks: 1,
      video_url: 'https://example.com/video1',
      options: {
        A: 'x³/2 + C',
        B: '2x + C',
        C: 'x³/3 + C',
        D: '3x² + C',
        E: 'x + C'
      }
    },
    {
      objectID: '2022-3',
      question_text: 'Differentiate y = sin(x)',
      answer_letter: 'A',
      marks: 1,
      video_url: null,
      options: {
        A: 'cos(x)',
        B: '-cos(x)',
        C: 'sin(x)',
        D: '-sin(x)',
        E: 'tan(x)'
      }
    }
  ]
};

// Helper function for Firebase image URL conversion
function getFirebaseImageUrl(gsUrl: string): string {
  if (!gsUrl || !gsUrl.startsWith('gs://')) return '';
  
  const urlParts = gsUrl.replace('gs://', '').split('/');
  const bucketName = urlParts[0];
  const filePath = urlParts.slice(1).join('/');
  const encodedPath = encodeURIComponent(filePath);
  
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedPath}?alt=media`;
}

// Helper function to safely extract text from Algolia data
function extractText(value: any): string {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'object' && value !== null) {
    if (value.text) return value.text;
    if (value.content) return value.content;
    if (value.value) return value.value;
    return JSON.stringify(value);
  }
  return String(value || '');
}

// =============================================================================
// SUBJECT-SPECIFIC QUESTION RENDERERS
// =============================================================================

// TSA Question Renderer
function TSAQuestionRenderer({ question, index }: { question: Question; index: number }) {
  const data = question.rawData;
  
  return (
    <div id={`question-${index}`} className="question-container">
      <div className="question-tag">
        <span>Question {data?.question_number || index + 1}</span>
        {data?.year && <span className="year-info"> ({data.year})</span>}
      </div>
      
      <div className="question-content-wrapper">
        <div className="question-card">
          {/* Question passage/content */}
          {data?.question_content && (
            <div className="question-passage">
              {data.question_content}
            </div>
          )}

          {/* Question image (if has_image_question is true) */}
          {data?.has_image_question && (data?.imageFile || data?.question_image) && (
            <div className="question-image-container">
              <img 
                src={getFirebaseImageUrl(data.imageFile || data.question_image)} 
                alt="Question"
                className="question-image"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* The actual question */}
          {data?.question && (
            <div className="question-text">
              {data.question}
            </div>
          )}
          
          {/* Answer options */}
          {data?.options && Array.isArray(data.options) && (
            <div className="options-list">
              {data.options.map((option: any) => (
                <div 
                  key={option.id}
                  className={`option-item ${option.id === data.correct_answer ? 'correct-answer' : ''}`}
                >
                  <span className="option-letter">{option.id}</span>
                  <span className="option-text">{option.text}</span>
                </div>
              ))}
            </div>
          )}
          
          {/* Fallback for legacy option format */}
          {(!data?.options || !Array.isArray(data.options)) && question.options && (
            <div className="options-list">
              {Object.entries(question.options).map(([letter, text]) => (
                <div 
                  key={letter}
                  className={`option-item ${letter === question.answer_letter ? 'correct-answer' : ''}`}
                >
                  <span className="option-letter">{letter}</span>
                  <span className="option-text">{text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="video-section">
          <h3 className="video-title">Video Solution</h3>
          <div className="video-container">
            {question.video_url ? (
              <div className="video-player">
                <iframe
                  src={question.video_url}
                  width="100%"
                  height="200"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`Video solution for Question ${index + 1}`}
                ></iframe>
              </div>
            ) : (
              <div className="video-placeholder">
                <p>respective video</p>
                <p>possible like</p>
                <p>this?</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// BMAT Question Renderer (placeholder for future implementation)
function BMATQuestionRenderer({ question, index }: { question: Question; index: number }) {
  // TODO: Implement BMAT-specific rendering when BMAT data structure is available
  return <DefaultQuestionRenderer question={question} index={index} />;
}

// UCAT Question Renderer (placeholder for future implementation) 
function UCATQuestionRenderer({ question, index }: { question: Question; index: number }) {
  // TODO: Implement UCAT-specific rendering when UCAT data structure is available
  return <DefaultQuestionRenderer question={question} index={index} />;
}

// Default Question Renderer (fallback)
function DefaultQuestionRenderer({ question, index }: { question: Question; index: number }) {
  return (
    <div id={`question-${index}`} className="question-container">
      <div className="question-tag">
        <span>Question {index + 1}</span>
      </div>
      
      <div className="question-content-wrapper">
        <div className="question-card">
          <div className="question-text">
            {question.question_text}
          </div>
          
          {question.options && (
            <div className="options-list">
              {Object.entries(question.options).map(([letter, text]) => (
                <div 
                  key={letter}
                  className={`option-item ${letter === question.answer_letter ? 'correct-answer' : ''}`}
                >
                  <span className="option-letter">{letter}</span>
                  <span className="option-text">{text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="video-section">
          <h3 className="video-title">Video Solution</h3>
          <div className="video-container">
            {question.video_url ? (
              <div className="video-player">
                <iframe
                  src={question.video_url}
                  width="100%"
                  height="200"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`Video solution for Question ${index + 1}`}
                ></iframe>
              </div>
            ) : (
              <div className="video-placeholder">
                <p>respective video</p>
                <p>possible like</p>
                <p>this?</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Question Renderer - routes to subject-specific renderer
function QuestionRenderer({ question, index, subject }: { 
  question: Question; 
  index: number; 
  subject: string; 
}) {
  // Subject-specific rendering logic
  switch (subject?.toUpperCase()) {
    case 'TSA':
      return <TSAQuestionRenderer question={question} index={index} />;
    case 'BMAT':
      return <BMATQuestionRenderer question={question} index={index} />;
    case 'UCAT':
      return <UCATQuestionRenderer question={question} index={index} />;
    // Add more subjects here as needed:
    // case 'INTERVIEW':
    //   return <InterviewQuestionRenderer question={question} index={index} />;
    default:
      return <DefaultQuestionRenderer question={question} index={index} />;
  }
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function ViewPackPage({ params }: { params: Promise<{ packId: string }> }) {
  const { packId } = use(params);
  const [pack, setPack] = useState<QuestionPack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overviewVisible, setOverviewVisible] = useState(true);
  const [overviewPinned, setOverviewPinned] = useState(false);

  // Fetch pack data from Supabase
  useEffect(() => {
    const fetchPackData = async () => {
      try {
        setLoading(true);
        
        // Handle demo/mock pack
        if (packId === 'mock') {
          setPack(mockPack);
          setLoading(false);
          return;
        }

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
          // Fetch actual questions from Algolia
          const questionIds = questionData.map((q: any) => q.question_id);
          console.log('Fetching questions:', questionIds, 'for subject:', packData.subject);
          
          try {
            const algoliaQuestions = await getQuestionsByIds(packData.subject || 'TSA', questionIds);
            console.log('Fetched questions from Algolia:', algoliaQuestions);
            if (algoliaQuestions[0]) console.log('Sample question structure:', algoliaQuestions[0]);
            
            // Transform Algolia questions - keep original data structure for subject-specific rendering
            questions = algoliaQuestions.map((q: any) => ({
              objectID: q.objectID,
              // Keep original data for subject-specific rendering
              rawData: q,
              // Legacy fields for compatibility
              question_text: extractText(q.question || q.question_text || q.content || 'Question text not available'),
              answer_letter: extractText(q.correct_answer || q.answer_letter || 'A'),
              marks: Number(q.marks) || 1,
              video_url: q.videoSolutionLink || q.video_url || null,
              options: q.options || {
                A: extractText(q.answera || q.option_a || 'Option A'),
                B: extractText(q.answerb || q.option_b || 'Option B'),
                C: extractText(q.answerc || q.option_c || 'Option C'),
                D: extractText(q.answerd || q.option_d || 'Option D'),
                E: extractText(q.answere || q.option_e || 'Option E')
              }
            }));
          } catch (algoliaError) {
            console.error('Error fetching from Algolia:', algoliaError);
            // Fall back to mock questions if Algolia fails
            questions = mockPack.questions;
          }
        } else {
          // No questions found, use mock data
          questions = mockPack.questions;
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

  const scrollToQuestion = (index: number) => {
    const element = document.getElementById(`question-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const totalMarks = pack?.questions.reduce((sum: any, q: any) => sum + (q.marks || 1), 0) || 0;

  if (loading) {
    return (
      <div className="view-pack-wrapper">
        <nav className="navbar">
          <a href="/" className="logo">examrizzsearch</a>
          <button className="menu-button">
            <div className="menu-line"></div>
            <div className="menu-line"></div>
            <div className="menu-line"></div>
          </button>
        </nav>
        <div style={{ padding: '100px', textAlign: 'center', fontFamily: "'Madimi One', sans-serif" }}>
          Loading pack...
        </div>
      </div>
    );
  }

  if (error || !pack) {
    return (
      <div className="view-pack-wrapper">
        <nav className="navbar">
          <a href="/" className="logo">examrizzsearch</a>
          <button className="menu-button">
            <div className="menu-line"></div>
            <div className="menu-line"></div>
            <div className="menu-line"></div>
          </button>
        </nav>
        <div style={{ padding: '100px', textAlign: 'center', fontFamily: "'Madimi One', sans-serif" }}>
          {error || 'Pack not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="view-pack-wrapper">
      {/* Navbar */}
      <nav className="navbar">
        <a href="/" className="logo">
          examrizzsearch
        </a>
        <button className="menu-button">
          <div className="menu-line"></div>
          <div className="menu-line"></div>
          <div className="menu-line"></div>
        </button>
      </nav>

      <div className="view-pack-container">
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

        <div className="pack-header">
          <h1 className="pack-title">{pack.name}</h1>
          <span className="subject-tag">{pack.subject}</span>
        </div>

      <div className="content-wrapper">
        <div className="icon-container">
          <Image 
            src="/icons/love-letter.svg" 
            alt="Pack Icon" 
            width={90} 
            height={90}
            className="pack-icon"
          />
        </div>

        {overviewVisible && (
          <div className={`question-overview ${overviewPinned ? 'pinned' : ''}`}>
            <h2 className="overview-title">Question Overview</h2>
            
            <div className="overview-content">
              <div className="question-numbers">
                {pack.questions.map((_, index) => (
                  <button
                    key={index}
                    className="question-number-box"
                    onClick={() => scrollToQuestion(index)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <div className="pack-info">
                <div className="info-line">{pack.questions.length} Questions</div>
                <div className="info-line">{totalMarks} marks</div>
                <div className="info-line">Created {formatDate(pack.created_at)}</div>
              </div>
            </div>
            
            <div className="overview-controls">
              <button 
                className="control-link"
                onClick={() => setOverviewPinned(!overviewPinned)}
              >
                {overviewPinned ? 'unpin overview' : 'pin overview'}
              </button>
              <button 
                className="control-link"
                onClick={() => setOverviewVisible(false)}
              >
                hide overview
              </button>
            </div>
          </div>
        )}

        <div className="questions-section">
          {pack.questions.map((question, index) => (
            <QuestionRenderer 
              key={question.objectID}
              question={question}
              index={index}
              subject={pack.subject}
            />
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}