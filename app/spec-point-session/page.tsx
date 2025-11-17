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

// Dynamically import MathInput with ssr: false to prevent SSR issues with MathQuill
const MathInput = dynamic(() => import('@/components/MathInput'), {
  ssr: false,
  loading: () => (
    <div style={{
      padding: '12px',
      border: '2px solid #ddd',
      borderRadius: '8px',
      fontSize: '14px',
      color: '#666'
    }}>
      Loading math input...
    </div>
  ),
});

type ContentType = 'video' | 'questions' | 'pdf';

// Types for question data
interface QuestionPart {
  id: string;
  letter: string;
  questionLatex: string;
  questionDisplay: string;
  solutionSteps: string | null;
  marks: number;
}

interface Question {
  code: string;
  difficulty: string;
  instructions: string;
  parts: QuestionPart[];
}

interface PartSubmissionState {
  submitted: boolean;
  correct: boolean | null;
  showSolution: boolean;
  feedback: string;
  marksAwarded: number;
  attemptNumber: number;
  isSubmitting: boolean;
}

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
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});

  // Answer submission state
  const [submissionStates, setSubmissionStates] = useState<Record<string, PartSubmissionState>>({});
  const [questionStartTimes, setQuestionStartTimes] = useState<Record<string, number>>({});

  // Lesson data state
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(true);
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [lastProgressUpdate, setLastProgressUpdate] = useState<number>(0);

  // Questions state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  // Progress tracking state
  const [progressData, setProgressData] = useState({
    questionsAttempted: 0,
    questionsCorrect: 0,
    totalQuestions: 0,
    videoWatched: false,
    pdfViewed: false
  });
  const [progressLoading, setProgressLoading] = useState(false);

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
        console.log('🔍 Fetching lesson data for spec point:', specPoint, 'lesson:', lessonNumber);

        // First, get the spec point ID from the code (e.g., "7.2")
        const { data: specPointData, error: specPointError } = await supabase
          .from('learn_spec_points')
          .select('id')
          .eq('code', specPoint)
          .single();

        if (specPointError || !specPointData) {
          console.error('❌ Error fetching spec point:', specPointError);
          throw new Error('Spec point not found');
        }

        console.log('✅ Found spec point ID:', specPointData.id);

        // Now query learn_lessons table using spec_point_id and lesson_number
        const { data, error } = await supabase
          .from('learn_lessons')
          .select(`
            id,
            name,
            video_url,
            pdf_notes_url,
            learn_spec_points (
              code,
              name
            )
          `)
          .eq('spec_point_id', specPointData.id)
          .eq('lesson_number', parseInt(lessonNumber))
          .single();

        if (error) {
          console.error('❌ Error fetching lesson data:', error);
          console.log('⚠️ Using fallback URLs');
          // If no data in database, use default S3 URLs
          const fallbackPdfUrl = 'https://examrizzjoemathsvideos.s3.eu-central-1.amazonaws.com/lessonpdf/Copy+of+Chapter+7+Differentiation+Lessons.pdf';
          const fallbackVideoUrl = 'https://examrizzjoemathsvideos.s3.eu-central-1.amazonaws.com/7.1_L/7_1+Lesson+1+Differentiation.mov';
          setPdfUrl(fallbackPdfUrl);
          setVideoUrl(fallbackVideoUrl);
          console.log('📄 PDF URL (fallback):', fallbackPdfUrl);
          console.log('🎬 Video URL (fallback):', fallbackVideoUrl);
        } else if (data) {
          console.log('✅ Lesson data fetched successfully:', data);
          setLessonId(data.id);

          const pdfUrlFromDb = data.pdf_notes_url || 'https://examrizzjoemathsvideos.s3.eu-central-1.amazonaws.com/lessonpdf/Copy+of+Chapter+7+Differentiation+Lessons.pdf';
          const videoUrlFromDb = data.video_url || 'https://examrizzjoemathsvideos.s3.eu-central-1.amazonaws.com/7.1_L/7_1+Lesson+1+Differentiation.mov';

          setPdfUrl(pdfUrlFromDb);
          setVideoUrl(videoUrlFromDb);

          console.log('📄 PDF URL:', pdfUrlFromDb);
          console.log('🎬 Video URL:', videoUrlFromDb);
        }
      } catch (error) {
        console.error('❌ Error in fetchLessonData:', error);
        // Fallback to default URLs
        const fallbackPdfUrl = 'https://examrizzjoemathsvideos.s3.eu-central-1.amazonaws.com/lessonpdf/Copy+of+Chapter+7+Differentiation+Lessons.pdf';
        const fallbackVideoUrl = 'https://examrizzjoemathsvideos.s3.eu-central-1.amazonaws.com/7.1_L/7_1+Lesson+1+Differentiation.mov';
        setPdfUrl(fallbackPdfUrl);
        setVideoUrl(fallbackVideoUrl);
        console.log('📄 PDF URL (error fallback):', fallbackPdfUrl);
        console.log('🎬 Video URL (error fallback):', fallbackVideoUrl);
      } finally {
        console.log('🏁 Loading complete - pdfLoading: false, videoLoading: false');
        setPdfLoading(false);
        setVideoLoading(false);
      }
    };

    fetchLessonData();
  }, [specPoint, lessonNumber]);

  // Fetch questions when lessonId is available
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!lessonId) return;

      setQuestionsLoading(true);
      try {
        const response = await fetch(`/api/lessons/${lessonId}/questions`);
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }

        const data = await response.json();
        setQuestions(data.questions || []);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setQuestions([]);
      } finally {
        setQuestionsLoading(false);
      }
    };

    fetchQuestions();
  }, [lessonId]);

  // Fetch progress data when lessonId and userId are available
  useEffect(() => {
    const fetchProgressData = async () => {
      if (!lessonId || !userId) return;

      setProgressLoading(true);
      try {
        // Fetch user progress (video_watched, pdf_viewed)
        const { data: progress, error: progressError } = await supabase
          .from('learn_user_progress')
          .select('video_watched, pdf_viewed')
          .eq('user_id', userId)
          .eq('lesson_id', lessonId)
          .single();

        if (progressError && progressError.code !== 'PGRST116') {
          console.error('Error fetching progress:', progressError);
        }

        // Get all question part IDs from current questions
        const allPartIds = questions.flatMap(q => q.parts.map(p => p.id));
        const totalQuestions = allPartIds.length;

        // Fetch user answers for this lesson's questions
        let questionsAttempted = 0;
        let questionsCorrect = 0;

        if (allPartIds.length > 0) {
          const { data: answers, error: answersError } = await supabase
            .from('learn_user_answers')
            .select('question_part_id, is_correct')
            .eq('user_id', userId)
            .in('question_part_id', allPartIds);

          if (answersError) {
            console.error('Error fetching answers:', answersError);
          } else if (answers) {
            // Count unique attempted questions
            const attemptedPartIds = new Set(answers.map(a => a.question_part_id));
            questionsAttempted = attemptedPartIds.size;

            // Count correct answers (only count each part once, even if multiple attempts)
            const correctPartIds = new Set(
              answers.filter(a => a.is_correct).map(a => a.question_part_id)
            );
            questionsCorrect = correctPartIds.size;
          }
        }

        setProgressData({
          questionsAttempted,
          questionsCorrect,
          totalQuestions,
          videoWatched: progress?.video_watched || false,
          pdfViewed: progress?.pdf_viewed || false
        });
      } catch (error) {
        console.error('Error in fetchProgressData:', error);
      } finally {
        setProgressLoading(false);
      }
    };

    fetchProgressData();
  }, [lessonId, userId, questions]);

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

  const handleAnswerChange = (key: string, latex: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [key]: latex
    }));

    // Track start time when user starts typing (only once per part)
    if (!questionStartTimes[key] && latex.trim()) {
      setQuestionStartTimes(prev => ({
        ...prev,
        [key]: Date.now()
      }));
    }
  };

  // Submit answer for a question part
  const handleSubmitAnswer = async (partId: string, partKey: string) => {
    const answer = userAnswers[partKey];

    if (!answer || !answer.trim()) {
      return;
    }

    if (!userId) {
      alert('Please log in to submit answers');
      return;
    }

    // Calculate time spent
    const startTime = questionStartTimes[partKey] || Date.now();
    const timeSpentSeconds = Math.floor((Date.now() - startTime) / 1000);

    // Set submitting state
    setSubmissionStates(prev => ({
      ...prev,
      [partKey]: {
        ...prev[partKey],
        isSubmitting: true,
        submitted: false,
        correct: null,
        showSolution: false,
        feedback: '',
        marksAwarded: 0,
        attemptNumber: 0
      }
    }));

    try {
      const response = await fetch('/api/answers/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          question_part_id: partId,
          submitted_answer_latex: answer,
          time_spent_seconds: timeSpentSeconds
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit answer');
      }

      const data = await response.json();

      // Update submission state with feedback
      setSubmissionStates(prev => ({
        ...prev,
        [partKey]: {
          submitted: true,
          correct: data.correct,
          showSolution: false,
          feedback: data.feedback,
          marksAwarded: data.marksAwarded,
          attemptNumber: data.attemptNumber,
          isSubmitting: false
        }
      }));

      // Update progress data in real-time
      setProgressData(prev => {
        // Check if this is a new attempt (first time submitting this part)
        const isNewAttempt = data.attemptNumber === 1;
        const isCorrect = data.correct;

        return {
          ...prev,
          questionsAttempted: isNewAttempt ? prev.questionsAttempted + 1 : prev.questionsAttempted,
          questionsCorrect: isCorrect ? prev.questionsCorrect + 1 : prev.questionsCorrect
        };
      });
    } catch (error) {
      console.error('Error submitting answer:', error);

      // Show error state
      setSubmissionStates(prev => ({
        ...prev,
        [partKey]: {
          ...prev[partKey],
          isSubmitting: false,
          submitted: false,
          feedback: 'Error submitting answer. Please try again.'
        }
      }));
    }
  };

  // Toggle solution display
  const handleToggleSolution = (partKey: string) => {
    setSubmissionStates(prev => ({
      ...prev,
      [partKey]: {
        ...prev[partKey],
        showSolution: !prev[partKey]?.showSolution
      }
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
        } else {
          // Update progress state in real-time
          setProgressData(prev => ({ ...prev, pdfViewed: true }));
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
        } else {
          // Update progress state in real-time
          setProgressData(prev => ({ ...prev, pdfViewed: true }));
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
        } else {
          // Update progress state in real-time
          setProgressData(prev => ({ ...prev, videoWatched: true }));
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
        } else {
          // Update progress state in real-time
          setProgressData(prev => ({ ...prev, videoWatched: true }));
        }
      }
    } catch (error) {
      console.error('Error in handleVideoEnded:', error);
    }
  };

  const renderVideoContent = () => {
    console.log('🎬 renderVideoContent called - videoLoading:', videoLoading, 'videoUrl:', videoUrl);

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
      console.log('⚠️ No video URL available');
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

    console.log('✅ Rendering VideoPlayer with URL:', videoUrl);
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
    if (questionsLoading) {
      return (
        <div className="content-container">
          <div className="questions-loading">
            <div className="loading-icon">📝</div>
            <p>Loading questions...</p>
          </div>
        </div>
      );
    }

    if (!questions || questions.length === 0) {
      return (
        <div className="content-container">
          <div className="no-questions">
            <div className="no-questions-icon">📝</div>
            <p>No questions available for this lesson</p>
          </div>
        </div>
      );
    }

    const currentQuestion = questions[currentQuestionIndex];

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
              {currentQuestionIndex + 1} of {questions.length}
            </span>
            <button
              onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
              disabled={currentQuestionIndex === questions.length - 1}
              className="nav-button"
            >
              Next
            </button>
          </div>
        </div>

        <div className="question-content">
          <div className="question-header-info">
            <div className="question-code">{currentQuestion.code}</div>
            <div className="question-difficulty">
              Difficulty: <span className={`difficulty-${currentQuestion.difficulty.toLowerCase()}`}>{currentQuestion.difficulty}</span>
            </div>
          </div>

          {currentQuestion.instructions && (
            <div className="question-instructions">
              {currentQuestion.instructions}
            </div>
          )}

          <div className="question-parts">
            {currentQuestion.parts.map((part, partIndex) => {
              const answerKey = `${currentQuestion.code}-${part.letter}`;
              const submissionState = submissionStates[answerKey];

              return (
                <div key={partIndex} className="question-part">
                  <div className="part-header">
                    <span className="part-letter">{part.letter})</span>
                    <span className="part-question">{part.questionDisplay}</span>
                    {part.marks && (
                      <span className="part-marks">({part.marks} {part.marks === 1 ? 'mark' : 'marks'})</span>
                    )}
                  </div>

                  <div className="part-answer">
                    <MathInput
                      value={userAnswers[answerKey] || ''}
                      onChange={(latex) => handleAnswerChange(answerKey, latex)}
                      placeholder="Enter your answer using LaTeX..."
                    />
                  </div>

                  {/* Check Answer Button */}
                  <div className="answer-actions">
                    <button
                      onClick={() => handleSubmitAnswer(part.id, answerKey)}
                      disabled={!userAnswers[answerKey] || submissionState?.isSubmitting}
                      className="check-answer-btn"
                    >
                      {submissionState?.isSubmitting ? 'Checking...' : 'Check Answer'}
                    </button>
                  </div>

                  {/* Feedback Display */}
                  {submissionState?.submitted && (
                    <div className={`feedback-container ${submissionState.correct ? 'correct' : 'incorrect'}`}>
                      <div className="feedback-header">
                        {submissionState.correct ? (
                          <div className="feedback-icon correct-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="12" cy="12" r="10" fill="#4CAF50"/>
                              <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        ) : (
                          <div className="feedback-icon incorrect-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="12" cy="12" r="10" fill="#f44336"/>
                              <path d="M15 9l-6 6M9 9l6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        )}
                        <div className="feedback-content">
                          <div className="feedback-message">
                            {submissionState.correct ? (
                              <>
                                <strong>Correct! ✓</strong>
                                <span> You earned {submissionState.marksAwarded} {submissionState.marksAwarded === 1 ? 'mark' : 'marks'}!</span>
                              </>
                            ) : (
                              <>
                                <strong>Incorrect.</strong>
                                <span> Try again or view the solution.</span>
                              </>
                            )}
                          </div>
                          {submissionState.attemptNumber > 1 && (
                            <div className="attempt-info">Attempt #{submissionState.attemptNumber}</div>
                          )}
                        </div>
                      </div>

                      {/* Show Solution Button (only for incorrect answers) */}
                      {!submissionState.correct && part.solutionSteps && (
                        <div className="solution-actions">
                          <button
                            onClick={() => handleToggleSolution(answerKey)}
                            className="toggle-solution-btn"
                          >
                            {submissionState.showSolution ? 'Hide Solution' : 'Show Solution'}
                          </button>
                        </div>
                      )}

                      {/* Solution Display */}
                      {submissionState.showSolution && part.solutionSteps && (
                        <div className="solution-display">
                          <h4>Solution:</h4>
                          <ReactMarkdown>{part.solutionSteps}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderPdfContent = () => {
    console.log('📄 renderPdfContent called - pdfLoading:', pdfLoading, 'pdfUrl:', pdfUrl);

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
      console.log('⚠️ No PDF URL available');
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

    console.log('✅ Rendering PdfViewer with URL:', pdfUrl);
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

        {/* Progress Indicator */}
        {userId && !progressLoading && (
          <div className="progress-indicator">
            <div className="progress-stats">
              <div className="progress-stat-item">
                <span className="progress-stat-label">Questions:</span>
                <span className="progress-stat-value">
                  {progressData.questionsCorrect} / {progressData.totalQuestions} answered correctly
                </span>
              </div>
              <div className="progress-stat-item">
                <span className="progress-stat-label">Video:</span>
                <span className={`progress-indicator-icon ${progressData.videoWatched ? 'completed' : ''}`}>
                  {progressData.videoWatched ? '✓' : '○'}
                </span>
              </div>
              <div className="progress-stat-item">
                <span className="progress-stat-label">PDF:</span>
                <span className={`progress-indicator-icon ${progressData.pdfViewed ? 'completed' : ''}`}>
                  {progressData.pdfViewed ? '✓' : '○'}
                </span>
              </div>
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{
                  width: progressData.totalQuestions > 0
                    ? `${(progressData.questionsCorrect / progressData.totalQuestions) * 100}%`
                    : '0%'
                }}
              />
            </div>
          </div>
        )}

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