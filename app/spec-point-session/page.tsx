'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { supabase } from '@/lib/supabase-client';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import './spec-point-session.css';

// Dynamically import PdfViewer with ssr: false to prevent DOMMatrix error during build
const PdfViewer = dynamic(() => import('@/components/PdfViewer'), {
  ssr: false,
  loading: () => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '550px',
      fontSize: '14px',
      color: '#666'
    }}>
      Loading PDF viewer...
    </div>
  ),
});

// Dynamically import VideoPlayer with ssr: false to prevent SSR issues with react-player
const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'), {
  ssr: false,
  loading: () => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '550px',
      fontSize: '14px',
      color: '#666'
    }}>
      Loading video player...
    </div>
  ),
});

type ContentType = 'video' | 'questions' | 'pdf';

// Sample question data
const sampleQuestions = [
  {
    id: '1',
    question_text: 'What is the derivative of x²?',
    options: {
      A: '2x',
      B: 'x',
      C: '2',
      D: 'x²'
    },
    answer_letter: 'A'
  },
  {
    id: '2', 
    question_text: 'What is the integral of 2x dx?',
    options: {
      A: '2',
      B: 'x² + C',
      C: '2x + C',
      D: 'x + C'
    },
    answer_letter: 'B'
  }
];

function SpecPointSessionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get URL parameters
  const specPoint = searchParams.get('spec') || '6.4';
  const lessonNumber = searchParams.get('lesson') || '1';
  const specName = searchParams.get('name') || 'Differentiation';

  // Content state
  const [currentContent, setCurrentContent] = useState<ContentType>('video');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  // Lesson data state
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [lastProgressUpdate, setLastProgressUpdate] = useState<number>(0);

  // Chat state
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Array<{id: string, role: 'user' | 'assistant', content: string, timestamp: Date}>>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        setUserId(user?.id || null);
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch lesson data including video and PDF URLs
  useEffect(() => {
    const fetchLessonData = async () => {
      setPdfLoading(true);
      setVideoLoading(true);
      try {
        // Query learn_lessons table to get lesson data including video and PDF URLs
        const { data, error } = await supabase
          .from('learn_lessons')
          .select('id, video_url, pdf_notes_url')
          .eq('spec_point', specPoint)
          .eq('lesson_number', parseInt(lessonNumber))
          .single();

        if (error) {
          console.error('Error fetching lesson data:', error);
          // If no data in database, use default S3 URLs
          setPdfUrl('https://examrizzjoemathsvideos.s3.eu-central-1.amazonaws.com/lessonpdf/Copy+of+Chapter+7+Differentiation+Lessons.pdf');
          setVideoUrl('https://examrizzjoemathsvideos.s3.eu-central-1.amazonaws.com/7.1_L/7_1+Lesson+1+Differentiation.mov');
        } else if (data) {
          setLessonId(data.id);
          setPdfUrl(data.pdf_notes_url || 'https://examrizzjoemathsvideos.s3.eu-central-1.amazonaws.com/lessonpdf/Copy+of+Chapter+7+Differentiation+Lessons.pdf');
          setVideoUrl(data.video_url || 'https://examrizzjoemathsvideos.s3.eu-central-1.amazonaws.com/7.1_L/7_1+Lesson+1+Differentiation.mov');
        }
      } catch (error) {
        console.error('Error in fetchLessonData:', error);
        // Fallback to default URLs
        setPdfUrl('https://examrizzjoemathsvideos.s3.eu-central-1.amazonaws.com/lessonpdf/Copy+of+Chapter+7+Differentiation+Lessons.pdf');
        setVideoUrl('https://examrizzjoemathsvideos.s3.eu-central-1.amazonaws.com/7.1_L/7_1+Lesson+1+Differentiation.mov');
      } finally {
        setPdfLoading(false);
        setVideoLoading(false);
      }
    };

    fetchLessonData();
  }, [specPoint, lessonNumber]);

  // Track PDF viewed when user switches to PDF tab
  useEffect(() => {
    if (currentContent === 'pdf' && pdfUrl && userId && lessonId) {
      trackPdfViewed();
    }
  }, [currentContent, pdfUrl, userId, lessonId]);

  // Chat functions
  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading) {
      return;
    }

    // If no user is logged in, show a helpful message
    if (!userId) {
      const loginPromptMessage = {
        id: Date.now().toString(),
        role: 'assistant' as const,
        content: 'Hi! To have full conversations and save your progress, please log in or sign up. You can still browse the interface and see how it works!',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'user',
        content: currentMessage.trim(),
        timestamp: new Date()
      }, loginPromptMessage]);
      setCurrentMessage('');
      return;
    }

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: currentMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/learn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          conversationId,
          userId,
          currentContent,
          specPoint: `${specPoint} ${specName} - Lesson ${lessonNumber}`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      const assistantId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date()
      }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'token') {
                assistantMessage += data.content;
                setMessages(prev => prev.map(msg => 
                  msg.id === assistantId 
                    ? { ...msg, content: assistantMessage }
                    : msg
                ));
                
                if (data.conversationId && !conversationId) {
                  setConversationId(data.conversationId);
                }
              } else if (data.type === 'complete') {
                if (data.conversationId && !conversationId) {
                  setConversationId(data.conversationId);
                }
                // Check if Joe wants to switch content
                if (data.switchContent) {
                  setCurrentContent(data.switchContent);
                }
              } else if (data.type === 'error') {
                setMessages(prev => prev.map(msg => 
                  msg.id === assistantId 
                    ? { ...msg, content: data.content }
                    : msg
                ));
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // Track PDF viewing
  const trackPdfViewed = async () => {
    if (!userId || !lessonId) {
      return;
    }

    try {
      // Check if progress record exists for this user and lesson
      const { data: existingProgress, error: fetchError } = await supabase
        .from('learn_user_progress')
        .select('id, pdf_viewed')
        .eq('user_id', userId)
        .eq('lesson_id', lessonId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is expected if no progress exists yet
        console.error('Error fetching progress:', fetchError);
        return;
      }

      if (existingProgress && !existingProgress.pdf_viewed) {
        // Update existing progress record
        const { error: updateError } = await supabase
          .from('learn_user_progress')
          .update({
            pdf_viewed: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingProgress.id);

        if (updateError) {
          console.error('Error updating PDF viewed status:', updateError);
        }
      } else if (!existingProgress) {
        // Create new progress record
        const { error: insertError } = await supabase
          .from('learn_user_progress')
          .insert({
            user_id: userId,
            lesson_id: lessonId,
            pdf_viewed: true,
            video_watched: false,
            questions_completed: false
          });

        if (insertError) {
          console.error('Error creating progress record:', insertError);
        }
      }
    } catch (error) {
      console.error('Error in trackPdfViewed:', error);
    }
  };

  // Handle opening PDF (track and open in new tab)
  const handleDownloadPdf = () => {
    if (pdfUrl) {
      trackPdfViewed();
      window.open(pdfUrl, '_blank');
    }
  };

  // Track video progress (called every 10 seconds during playback)
  const handleVideoProgress = async (progress: number) => {
    if (!userId || !lessonId || !videoUrl) {
      return;
    }

    // Get current video duration from the player (estimate based on typical lesson length)
    // For now, we'll track progress as a percentage
    const currentSeconds = Math.floor(progress * 3600); // Assuming ~1 hour max video

    // Only update if 10 seconds have passed since last update
    if (currentSeconds - lastProgressUpdate < 10) {
      return;
    }

    setLastProgressUpdate(currentSeconds);

    try {
      const { data: existingProgress, error: fetchError } = await supabase
        .from('learn_user_progress')
        .select('id, video_progress_seconds')
        .eq('user_id', userId)
        .eq('lesson_id', lessonId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching progress for video tracking:', fetchError);
        return;
      }

      if (existingProgress) {
        // Update existing progress
        const { error: updateError } = await supabase
          .from('learn_user_progress')
          .update({
            video_progress_seconds: currentSeconds,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingProgress.id);

        if (updateError) {
          console.error('Error updating video progress:', updateError);
        }
      } else {
        // Create new progress record
        const { error: insertError } = await supabase
          .from('learn_user_progress')
          .insert({
            user_id: userId,
            lesson_id: lessonId,
            video_progress_seconds: currentSeconds,
            video_watched: false,
            pdf_viewed: false,
            questions_completed: false
          });

        if (insertError) {
          console.error('Error creating progress record for video:', insertError);
        }
      }
    } catch (error) {
      console.error('Error in handleVideoProgress:', error);
    }
  };

  // Mark video as watched when it ends
  const handleVideoEnded = async () => {
    if (!userId || !lessonId) {
      return;
    }

    try {
      const { data: existingProgress, error: fetchError } = await supabase
        .from('learn_user_progress')
        .select('id')
        .eq('user_id', userId)
        .eq('lesson_id', lessonId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching progress for video completion:', fetchError);
        return;
      }

      if (existingProgress) {
        // Update existing progress
        const { error: updateError } = await supabase
          .from('learn_user_progress')
          .update({
            video_watched: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingProgress.id);

        if (updateError) {
          console.error('Error marking video as watched:', updateError);
        }
      } else {
        // Create new progress record
        const { error: insertError } = await supabase
          .from('learn_user_progress')
          .insert({
            user_id: userId,
            lesson_id: lessonId,
            video_watched: true,
            pdf_viewed: false,
            questions_completed: false
          });

        if (insertError) {
          console.error('Error creating progress record for video completion:', insertError);
        }
      }
    } catch (error) {
      console.error('Error in handleVideoEnded:', error);
    }
  };

  const renderVideoContent = () => {
    if (videoLoading) {
      return (
        <div className="content-container">
          <div className="video-player">
            <div className="video-placeholder">
              <div className="video-loading-icon">🎬</div>
              <p>Loading video...</p>
            </div>
          </div>
        </div>
      );
    }

    if (!videoUrl) {
      return (
        <div className="content-container">
          <div className="video-player">
            <div className="video-placeholder">
              <div className="video-loading-icon">🎬</div>
              <p>No video available for this lesson</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="content-container">
        <VideoPlayer
          videoUrl={videoUrl}
          onProgress={handleVideoProgress}
          onEnded={handleVideoEnded}
        />
      </div>
    );
  };

  const renderQuestionsContent = () => {
    const currentQuestion = sampleQuestions[currentQuestionIndex];

    return (
      <div className="content-container">
        <div className="question-header">
          <div className="question-navigation">
            <button
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
              className="nav-button"
            >
              Previous
            </button>
            <span className="question-counter">
              {currentQuestionIndex + 1} of {sampleQuestions.length}
            </span>
            <button
              onClick={() => setCurrentQuestionIndex(Math.min(sampleQuestions.length - 1, currentQuestionIndex + 1))}
              disabled={currentQuestionIndex === sampleQuestions.length - 1}
              className="nav-button"
            >
              Next
            </button>
          </div>
        </div>
        
        <div className="question-content">
          <div className="question-text">
            {currentQuestion.question_text}
          </div>
          
          <div className="options-list">
            {Object.entries(currentQuestion.options).map(([letter, text]) => {
              const isSelected = selectedAnswers[currentQuestion.id] === letter;
              
              return (
                <div
                  key={letter}
                  className={`option-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelect(currentQuestion.id, letter)}
                >
                  <span className="option-letter">{letter}</span>
                  <span className="option-text">{text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderPdfContent = () => {
    if (pdfLoading) {
      return (
        <div className="content-container">
          <div className="pdf-viewer">
            <div className="pdf-placeholder">
              <div className="pdf-icon">📄</div>
              <p>Loading PDF...</p>
            </div>
          </div>
        </div>
      );
    }

    if (!pdfUrl) {
      return (
        <div className="content-container">
          <div className="pdf-viewer">
            <div className="pdf-placeholder">
              <div className="pdf-icon">📄</div>
              <p>No PDF available for this lesson</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="content-container">
        <div className="pdf-controls">
          <button
            onClick={handleDownloadPdf}
            className="download-pdf-button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Download PDF
          </button>
        </div>
        <div className="pdf-viewer-container">
          <PdfViewer
            pdfUrl={pdfUrl}
            onPageChange={(page) => {
              // Optional: track page changes if needed
              console.log('PDF page changed to:', page);
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="spec-point-session-page">
      <div className="page-background">
        {/* Navbar */}
        <nav className="navbar">
          <Link href="/" className="logo">
            examrizzsearch
          </Link>
          <button className="menu-button">
            <div className="menu-line"></div>
            <div className="menu-line"></div>
            <div className="menu-line"></div>
          </button>
        </nav>

        {/* Back Button */}
        <Link 
          href="/maths-demo"
          className="back-button"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </Link>

        {/* Header */}
        <div className="header-container">
          <h1 className="page-title">{specPoint} {specName}: Lesson {lessonNumber}</h1>
        </div>

        {/* Main Content */}
        <div className="main-content-container">
          {/* Left Container - Content Types */}
          <div className="left-container">
            {/* Content Type Selector */}
            <div className="content-selector">
              <button
                className={`selector-button ${currentContent === 'video' ? 'active' : ''}`}
                onClick={() => setCurrentContent('video')}
              >
                Video
              </button>
              <button
                className={`selector-button ${currentContent === 'questions' ? 'active' : ''}`}
                onClick={() => setCurrentContent('questions')}
              >
                Questions
              </button>
              <button
                className={`selector-button ${currentContent === 'pdf' ? 'active' : ''}`}
                onClick={() => setCurrentContent('pdf')}
              >
                PDF Notes
              </button>
            </div>

            {/* Content Display */}
            {currentContent === 'video' && renderVideoContent()}
            {currentContent === 'questions' && renderQuestionsContent()}
            {currentContent === 'pdf' && renderPdfContent()}
          </div>

          {/* Right Container - Joe Chat */}
          <div className="right-container">
            <div className="joe-chat-container">
              <div className="joe-messages-area">
                {messages.length === 0 ? (
                  <div className="joe-welcome-message">
                    <h4>Hi, I'm Joe</h4>
                    <p>I'm here to guide you through {specPoint} {specName} - Lesson {lessonNumber}. I can help with the notes, video, or practice questions. Ready to start?</p>
                  </div>
                ) : (
                  messages.map(message => (
                    <div key={message.id} className={`joe-message ${message.role}`}>
                      <div className="joe-message-content">
                        {message.role === 'assistant' ? (
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        ) : (
                          message.content
                        )}
                      </div>
                      <div className="joe-message-time">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="joe-chat-input">
                <div className="joe-input-container">
                  <textarea
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask Joe..."
                    disabled={isLoading}
                    rows={2}
                    className="joe-textarea"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !currentMessage.trim()}
                    className="joe-send-btn"
                  >
                    {isLoading ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SpecPointSessionPage() {
  return (
    <Suspense fallback={
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: "'Madimi One', sans-serif"
      }}>
        Loading...
      </div>
    }>
      <SpecPointSessionContent />
    </Suspense>
  );
}