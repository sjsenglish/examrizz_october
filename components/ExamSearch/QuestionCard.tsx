import React, { useState, useMemo, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from '../ui/Button';
import { QuestionCardProps, Question } from '@/types/question';
import { VideoModal } from '../VideoModal';
import { PdfModal } from '../PdfModal';
import styles from './QuestionCard.module.css';
import DOMPurify from 'dompurify';
import { supabase } from '@/lib/supabase-client';
import { uploadVideoToSupabase, validateVideoFile, formatFileSize } from '@/lib/video-upload';
import { useProfile } from '@/contexts/ProfileContext';

// Sanitize HTML content to prevent XSS attacks
const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['br', 'p', 'strong', 'em', 'u', 'sub', 'sup'],
    ALLOWED_ATTR: []
  });
};

const getFirebaseImageUrl = (gsUrl: string): string => {
  if (!gsUrl || !gsUrl.startsWith('gs://')) return '';
  
  // Convert gs://bucket-name/path/file.ext to Firebase Storage download URL
  // Format: https://firebasestorage.googleapis.com/v0/b/bucket-name/o/path%2Ffile.ext?alt=media
  const urlParts = gsUrl.replace('gs://', '').split('/');
  const bucketName = urlParts[0];
  const filePath = urlParts.slice(1).join('/');
  
  // URL encode the file path (replace / with %2F)
  const encodedPath = encodeURIComponent(filePath);
  
  const firebaseUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedPath}?alt=media`;
  
  
  return firebaseUrl;
};

// React #301 FIXED: All infinite render sources eliminated via comprehensive memoization
export const QuestionCard: React.FC<QuestionCardProps> = ({ hit }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  
  // Feature usage state
  const [featureUsage, setFeatureUsage] = useState<{
    submit_answer: { allowed: boolean; remaining: number; limit: number; period: 'month' | 'day' };
    video_solution: { allowed: boolean; remaining: number; limit: number; period: 'month' | 'day' };
    tier: string;
  } | null>(null);
  const [user, setUser] = useState<any>(null);
  const { profile: userProfile, refreshProfile } = useProfile();
  
  // Tooltip state
  const [showSubmitTooltip, setShowSubmitTooltip] = useState(false);
  const [showVideoTooltip, setShowVideoTooltip] = useState(false);
  
  // Submit answer modal state
  const [userAnswer, setUserAnswer] = useState('');
  const [additionalLinks, setAdditionalLinks] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Discord info modal state
  const [isDiscordInfoModalOpen, setIsDiscordInfoModalOpen] = useState(false);
  const [manualDiscordUsername, setManualDiscordUsername] = useState('');
  const [manualDiscordId, setManualDiscordId] = useState('');

  // Detect question type based on data structure - memoized to prevent re-renders
  const isMathsQuestion = useMemo(() => hit?.paper_info && hit?.spec_topic, [hit]);
  const isEnglishLitQuestion = useMemo(() => hit?.QualificationLevel === 'A Level' && hit?.Subject === 'English Literature', [hit]);
  const isInterviewQuestion = useMemo(() => hit?.QuestionID && hit?.Time && hit?.QuestionPromptText, [hit]);
  const isInterviewResourcesQuestion = useMemo(() => hit?.subject && hit?.subjectArea && hit?.sectionCategory && hit?.overview, [hit]);
  const isBiologyQuestion = useMemo(() => hit?.Subject === 'Biology' && hit?.Parts && Array.isArray(hit.Parts), [hit]);

  // Check if content should be blurred (premium Interview Resources for non-Plus/Max users)
  const shouldBlurContent = useMemo(() => {
    if (!isInterviewResourcesQuestion) return false;
    if (!hit?.isPremium) return false;

    // If user is not logged in, blur premium content immediately
    if (!user) return true;

    // If user is logged in but we don't have feature usage yet, blur by default (safer)
    if (!featureUsage) return true;

    // If user has plus or max tier, don't blur
    return featureUsage.tier === 'free';
  }, [isInterviewResourcesQuestion, hit?.isPremium, user, featureUsage]);

  // Check if interview questions should be blurred (all interview questions for logged out users)
  const shouldBlurInterviewContent = useMemo(() => {
    if (!isInterviewQuestion) return false;

    // If user is not logged in, blur all interview questions
    if (!user) return true;

    // If user is logged in, don't blur (regardless of tier)
    return false;
  }, [isInterviewQuestion, user]);

  // Memoize array calculations to prevent re-renders
  const englishLitFilters = useMemo(() => 
    isEnglishLitQuestion ? [hit?.Text1?.Author, hit?.Text1?.Age].filter(Boolean) : [],
    [isEnglishLitQuestion, hit?.Text1?.Author, hit?.Text1?.Age]
  );

  // Memoize paperInfo object to prevent re-renders
  const englishLitPaperInfo = useMemo(() => 
    isEnglishLitQuestion ? {
      code: hit?.PaperCode, 
      name: hit?.PaperName, 
      section: hit?.PaperSection,
      year: hit?.PaperYear,
      month: hit?.PaperMonth 
    } : null,
    [isEnglishLitQuestion, hit?.PaperCode, hit?.PaperName, hit?.PaperSection, hit?.PaperYear, hit?.PaperMonth]
  );

  // Load user and feature usage data - using same approach as Ask Bo
  useEffect(() => {
    const loadUserAndUsage = async () => {
      try {
        // Check authentication using same method as Ask Bo
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          // User not authenticated - clear state
          setUser(null);
          setFeatureUsage(null);
          return;
        }
        
        setUser(user);
        
        // Profile is now handled by ProfileContext

        if (user) {
          // Check localStorage cache first
          const cacheKey = `feature-usage-${user.id}`;
          const cached = localStorage.getItem(cacheKey);
          const now = Date.now();
          
          if (cached) {
            try {
              const parsedCache = JSON.parse(cached);
              // Use cached data if it's less than 10 seconds old
              if (now - parsedCache.timestamp < 10000) {
                setFeatureUsage(parsedCache.data);
                return;
              }
            } catch (e) {
              // Invalid cache, clear it
              localStorage.removeItem(cacheKey);
            }
          }

          // Fetch feature usage summary
          const response = await fetch(`/api/feature-usage?userId=${user.id}`);
          if (response.ok) {
            const data = await response.json();
            setFeatureUsage(data.summary);
            
            // Cache the result in localStorage
            localStorage.setItem(cacheKey, JSON.stringify({
              data: data.summary,
              timestamp: now
            }));
          } else {
            // Clear stale feature usage on API error
            setFeatureUsage(null);
          }
        } else {
          // No user or profile, clear feature usage
          setFeatureUsage(null);
        }
      } catch (error) {
        console.error('Error loading user and feature usage:', error);
        // Clear stale state on any error
        setUser(null);
        setFeatureUsage(null);
      }
    };

    loadUserAndUsage();

    // Listen for auth state changes - same as Ask Bo
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // User signed in - reload user data
        loadUserAndUsage();
      } else if (event === 'SIGNED_OUT') {
        // User signed out - clear state
        setUser(null);
        setFeatureUsage(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle OAuth callback for submit answer
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('submit') === 'true' && user && userProfile?.discord_id) {
      // User just came back from Discord OAuth and is now linked
      // Clean up URL and open submit modal
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      
      // Small delay to ensure everything is loaded
      setTimeout(() => {
        if (featureUsage?.submit_answer?.allowed) {
          setUserAnswer('');
          setAdditionalLinks('');
          setVideoLink('');
          setVideoFile(null);
          setIsSubmitModalOpen(true);
        }
      }, 500);
    }
  }, [user, userProfile, featureUsage]);

  const handleAnswerClick = (letter: string) => {
    setSelectedAnswer(letter);
    setIsAnswerRevealed(true);
  };

  const handleShowAnswer = () => {
    if (isMathsQuestion || isEnglishLitQuestion || isBiologyQuestion) {
      setIsPdfModalOpen(true);
    } else if (!isInterviewQuestion && !isInterviewResourcesQuestion) {
      setIsAnswerRevealed(true);
    }
    // Interview questions and Interview Resources don't have answers - they're discussion questions
  };

  const handleVideoSolutionClick = async () => {
    if (!user) {
      return; // Tooltip will show the message
    }

    if (!featureUsage) {
      return; // Tooltip will show the message
    }

    if (!featureUsage.video_solution.allowed) {
      return; // Tooltip will show the message
    }

    try {
      // Record video solution usage
      const response = await fetch('/api/feature-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          feature: 'video_solution'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setFeatureUsage(prev => prev ? { ...prev, video_solution: data.usage } : null);
        setIsVideoModalOpen(true);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to access video solution.');
      }
    } catch (error) {
      console.error('Video solution error:', error);
      alert('Failed to access video solution. Please try again.');
    }
  };

  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false);
  };

  const handleClosePdfModal = () => {
    setIsPdfModalOpen(false);
  };

  const handleSubmitAnswer = async () => {
    try {
      if (!user) {
        return; // Tooltip will show the message
      }

      if (!userProfile) {
        return; // Tooltip will show the message
      }

      if (!featureUsage) {
        return; // Tooltip will show the message
      }

      if (!featureUsage.submit_answer.allowed) {
        return; // Tooltip will show the message
      }

      // Check if Discord username is available (from profile or manual entry)
      const hasDiscordUsername = userProfile?.discord_username || manualDiscordUsername;

      if (!hasDiscordUsername) {
        // No Discord username - show modal to collect it
        setIsDiscordInfoModalOpen(true);
        return;
      }

      // Open the submission modal
      setUserAnswer('');
      setAdditionalLinks('');
      setVideoLink('');
      setVideoFile(null);
      setIsSubmitModalOpen(true);
    } catch (error) {
      console.error('Submit answer error:', error);
      alert('Failed to open submission form. Please try again.');
    }
  };

  const handleDiscordInfoSubmit = async () => {
    if (!manualDiscordUsername.trim()) {
      alert('Please enter your Discord username.');
      return;
    }

    // Close Discord info modal and open submission modal
    setIsDiscordInfoModalOpen(false);
    setUserAnswer('');
    setAdditionalLinks('');
    setVideoLink('');
    setVideoFile(null);
    setIsSubmitModalOpen(true);
  };

  const handleCloseDiscordInfoModal = () => {
    setIsDiscordInfoModalOpen(false);
    setManualDiscordUsername('');
    setManualDiscordId('');
  };

  const handleFinalSubmitAnswer = async () => {
    try {
      if (!userAnswer.trim()) {
        alert('Please enter your answer before submitting.');
        return;
      }

      setIsSubmitting(true);

      // Record submit answer usage first
      const usageResponse = await fetch('/api/feature-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          feature: 'submit_answer'
        })
      });

      if (!usageResponse.ok) {
        const errorData = await usageResponse.json();
        alert(errorData.error || 'Failed to submit answer.');
        setIsSubmitting(false);
        return;
      }

      // Update feature usage state
      const usageData = await usageResponse.json();
      setFeatureUsage(prev => prev ? { ...prev, submit_answer: usageData.usage } : null);

      // Format question context for Discord help center ticket
      let questionType = '';
      let submissionType = '';
      if (isInterviewQuestion) {
        questionType = 'Interview Question';
        submissionType = 'interview-question';
      } else if (isInterviewResourcesQuestion) {
        questionType = 'Interview Resources Question';
        submissionType = 'interview-resources-question';
      } else if (isEnglishLitQuestion) {
        questionType = 'English Literature Question';
        submissionType = 'english-lit-question';
      } else if (isMathsQuestion) {
        questionType = 'Maths Question';
        submissionType = 'maths-question';
      } else if (isBiologyQuestion) {
        questionType = 'Biology Question';
        submissionType = 'biology-question';
      } else {
        questionType = 'Question';
        submissionType = 'admission-question';
      }

      // Handle video upload if file is selected
      let videoUrl = videoLink.trim();
      if (videoFile && !videoUrl) {
        const uploadedUrl = await uploadVideoFile(videoFile);
        if (uploadedUrl) {
          videoUrl = uploadedUrl;
        } else {
          alert('Failed to upload video. Please try again or use a video link instead.');
          setIsSubmitting(false);
          return;
        }
      }

      // Create the question context with user's answer
      let questionContext = `**${questionType} Help Request**\n\n**QUESTION:** ${normalizedData.questionText || 'See question above'}\n\n**MY ANSWER:** ${userAnswer.trim()}`;
      
      if (videoUrl) {
        const videoType = videoFile ? 'VIDEO EXPLANATION (Uploaded)' : 'VIDEO EXPLANATION (Link)';
        questionContext += `\n\n**${videoType}:** ${videoUrl}`;
      }
      
      if (additionalLinks.trim()) {
        questionContext += `\n\n**ADDITIONAL LINKS/CONTEXT:** ${additionalLinks.trim()}`;
      }
      
      // Generate unique ticket ID
      const ticketId = `QUEST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Use Discord info from profile or manual entry
      const discordUsername = userProfile?.discord_username || manualDiscordUsername;
      const discordId = userProfile?.discord_id || manualDiscordId || undefined;

      // Create ticket in Discord help center via webhook with user's complete submission
      const response = await fetch('/api/discord-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: questionContext,
          ticketId: ticketId,
          userEmail: user.email,
          type: submissionType,
          discordId: discordId,
          discordUsername: discordUsername
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Close modal and open Discord server
        setIsSubmitModalOpen(false);
        setUserAnswer('');
        setAdditionalLinks('');
        setVideoLink('');
        setVideoFile(null);
        window.open('https://discord.gg/examrizzsearch', '_blank');
      } else {
        alert('Failed to create help ticket. Please try again.');
      }
    } catch (error) {
      console.error('Submit answer error:', error);
      alert('Failed to submit answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVideoFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate the video file using the utility function
    const validation = validateVideoFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    setVideoFile(file);
    setUploadProgress(0); // Reset progress
    // Clear video link if file is selected
    setVideoLink('');
  };

  const uploadVideoFile = async (file: File): Promise<string | null> => {
    try {
      setIsUploadingVideo(true);
      setUploadProgress(0);
      
      // Generate a ticket ID for organizing files
      const ticketId = `QUEST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Use the utility function for upload with progress tracking
      const result = await uploadVideoToSupabase(file, {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        userId: user.id,
        ticketId: ticketId,
        onProgress: (progress) => {
          setUploadProgress(progress);
        }
      });

      if (!result.success) {
        alert(result.error || 'Failed to upload video');
        return null;
      }

      return result.publicUrl!;

    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Upload failed due to network error. Please check your connection and try again.');
      return null;
    } finally {
      setIsUploadingVideo(false);
      setUploadProgress(0);
    }
  };

  const handleCloseSubmitModal = () => {
    setIsSubmitModalOpen(false);
    setUserAnswer('');
    setAdditionalLinks('');
    setVideoLink('');
    setVideoFile(null);
  };

  const getOptionClass = (letter: string): string => {
    if (!isAnswerRevealed) return '';
    
    const isCorrect = letter === hit?.correct_answer;
    const isSelected = letter === selectedAnswer;
    
    if (isCorrect) return styles.optionCorrect;
    if (isSelected && !isCorrect) return styles.optionIncorrect;
    return '';
  };

  const getOptionStyle = (letter: string) => {
    const baseClass = styles.option;
    const answerClass = getOptionClass(letter);
    const noHoverClass = isAnswerRevealed ? styles.optionNoHover : '';
    
    return `${baseClass} ${answerClass} ${noHoverClass}`.trim();
  };

  const isALevelQuestion = useMemo(() => hit?.paper_info && hit?.qualification_level === 'A Level', [hit]);

  // Generate tooltip text for feature usage
  const getSubmitAnswerTooltip = () => {
    if (!user) return 'Please log in to submit answers for review';
    if (!userProfile) return 'Loading profile information...';
    
    // Check if user has any OAuth authentication
    const hasDiscordAuth = user?.identities?.find((identity: any) => identity.provider === 'discord');
    const hasGoogleAuth = user?.identities?.find((identity: any) => identity.provider === 'google');
    
    if (!hasDiscordAuth && !hasGoogleAuth && !userProfile?.discord_id) {
      return 'Click to link Discord account for answer submission';
    }
    
    if (!featureUsage) return 'Checking submission limits...';
    
    const { submit_answer } = featureUsage;
    const periodText = submit_answer.period === 'day' ? 'daily' : 'monthly';
    
    if (!submit_answer.allowed) {
      return `Limit reached: ${submit_answer.remaining} of ${submit_answer.limit} ${periodText} submissions remaining`;
    }
    if (submit_answer.limit === -1) return 'Unlimited submissions available';
    return `${submit_answer.remaining} of ${submit_answer.limit} ${periodText} submissions remaining`;
  };

  const getVideoSolutionTooltip = () => {
    if (!user) return 'Please log in to access video solutions';
    if (!featureUsage) return 'Checking video limits...';
    
    const { video_solution } = featureUsage;
    const periodText = video_solution.period === 'day' ? 'daily' : 'monthly';
    
    if (!video_solution.allowed) {
      return `Limit reached: ${video_solution.remaining} of ${video_solution.limit} ${periodText} video solutions remaining`;
    }
    if (video_solution.limit === -1) return 'Unlimited video solutions available';
    return `${video_solution.remaining} of ${video_solution.limit} ${periodText} video solutions remaining`;
  };

  // Check if video solutions are available for this question type
  const isVideoSolutionAvailable = () => {
    return normalizedData.videoUrl && (isMathsQuestion || (!isInterviewQuestion && !isInterviewResourcesQuestion && !isEnglishLitQuestion && !isBiologyQuestion));
  };
  
  // Get normalized data based on question type - memoized to prevent re-renders
  const normalizedData = useMemo(() => ({
    questionNumber: isInterviewQuestion ? hit?.QuestionID : (isInterviewResourcesQuestion ? hit?.id : (isEnglishLitQuestion ? hit?.QuestionNo : (isBiologyQuestion ? hit?.QuestionNumber : (hit?.question_number || '')))),
    year: isInterviewQuestion ? null : (isInterviewResourcesQuestion ? null : (isEnglishLitQuestion ? hit?.PaperYear : (isMathsQuestion ? hit?.paper_info?.year : (isBiologyQuestion ? hit?.Year : hit?.year)))),
    questionType: isInterviewQuestion ? hit?.SubjectId1 : (isInterviewResourcesQuestion ? hit?.subject : (isEnglishLitQuestion ? hit?.PaperName : (isMathsQuestion ? hit?.spec_topic : (isBiologyQuestion ? hit?.Subject : hit?.question_type)))),
    subType: isInterviewQuestion ? hit?.SubjectId2 : (isInterviewResourcesQuestion ? hit?.subjectArea : (isEnglishLitQuestion ? hit?.PaperSection : (isMathsQuestion ? hit?.question_topic : (isBiologyQuestion ? hit?.QuestionTopics?.[0] : (Array.isArray(hit?.sub_types) ? hit.sub_types[0] : hit?.sub_types))))),
    filters: isInterviewQuestion ? (hit?.all_subjects || []) : (isInterviewResourcesQuestion ? [hit?.sectionCategory] : (isEnglishLitQuestion ? englishLitFilters : (isBiologyQuestion ? (hit?.QuestionTopics || []) : (hit?.filters || [])))),
    questionContent: isInterviewResourcesQuestion ? hit?.overview : (hit?.question_content || hit?.question_text),
    imageUrl: hit?.imageFile || hit?.imageUrl,
    questionText: isInterviewQuestion ? hit?.QuestionPromptText : (isInterviewResourcesQuestion ? hit?.title : (isEnglishLitQuestion ? hit?.QuestionPrompt : (isBiologyQuestion ? hit?.Parts?.[0]?.QuestionText : (hit?.question || hit?.question_text)))),
    videoUrl: hit?.videoSolutionLink || hit?.video_solution_url_1,
    marks: isInterviewQuestion ? null : (isInterviewResourcesQuestion ? null : (isEnglishLitQuestion ? hit?.QuestionTotalMarks : (isBiologyQuestion ? hit?.TotalMarks : hit?.marks))),
    time: isInterviewQuestion ? hit?.Time : null,
    paperInfo: englishLitPaperInfo || hit?.paper_info,
    textInfo: isEnglishLitQuestion ? hit?.Text1 : null,
    subjects: isInterviewQuestion ? hit?.all_subjects : null,
    pdfUrl: isEnglishLitQuestion ? hit?.MS : (isBiologyQuestion ? hit?.MarkScheme : (hit?.markscheme_pdf || hit?.pdf_url || hit?.markscheme_url || hit?.answer_pdf || hit?.answers_pdf)),
    biologyParts: isBiologyQuestion ? hit?.Parts : null,
    practiceQuestions: isInterviewResourcesQuestion ? hit?.practiceQuestions : null
  }), [hit, isInterviewQuestion, isInterviewResourcesQuestion, isEnglishLitQuestion, isMathsQuestion, isBiologyQuestion, englishLitFilters, englishLitPaperInfo]);

  return (
    <article className={styles.questionCard}>
      <header className={styles.questionHeader}>
        <div className={styles.questionInfo}>
          <span className={styles.questionNumber}>
            {isInterviewQuestion || isInterviewResourcesQuestion ? normalizedData.questionNumber : `Question ${normalizedData.questionNumber}`}
          </span>
          {normalizedData.year && <span className={styles.yearBadge}>{normalizedData.year}</span>}
          {normalizedData.marks && <span className={styles.marksBadge}>{normalizedData.marks} marks</span>}
          {normalizedData.time && <span className={styles.marksBadge}>{normalizedData.time} minutes</span>}
          {/* Premium badge for Interview Resources */}
          {isInterviewResourcesQuestion && hit?.isPremium && (
            <span style={{
              backgroundColor: '#FFD700',
              color: '#000',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '600',
              fontFamily: "'Madimi One', cursive",
              border: '1px solid #FFA500'
            }}>
              ⭐ PREMIUM
            </span>
          )}
        </div>
        <div className={styles.filterButtons}>
          {normalizedData.questionType && (
            <Button variant="filter" size="sm">{normalizedData.questionType}</Button>
          )}
          {normalizedData.subType && (
            <Button variant="filter" size="sm"
              style={{ backgroundColor: 'var(--color-secondary-light)' }}>
              {normalizedData.subType}
            </Button>
          )}
          {normalizedData.filters && normalizedData.filters.length > 0 && (
            <Button variant="filter" size="sm"
              style={{ backgroundColor: 'var(--color-primary-lighter)' }}>
              {normalizedData.filters[0]}
            </Button>
          )}
          {normalizedData.paperInfo && (
            <Button variant="filter" size="sm"
              style={{ backgroundColor: 'transparent' }}>
              {(normalizedData.paperInfo as any)?.paper_reference || 'SPEC PT. 4.1'}
            </Button>
          )}
        </div>
      </header>

      <div className={styles.questionContent}>
        {/* Show question content for non-maths questions (excluding Interview Resources) */}
        {!isMathsQuestion && !isInterviewResourcesQuestion && normalizedData.questionContent && (
          <p className={styles.questionPassage}>
            {normalizedData.questionContent}
          </p>
        )}

        {/* Show text information for English Literature */}
        {isEnglishLitQuestion && normalizedData.textInfo && (
          <div className={styles.questionText}>
            <strong>{normalizedData.textInfo.Title}</strong> by {normalizedData.textInfo.Author}
            {normalizedData.textInfo.Theme && <span> ({normalizedData.textInfo.Theme})</span>}
          </div>
        )}

        {normalizedData.imageUrl && (
          <div className={styles.questionImageContainer}>
            <img 
              src={getFirebaseImageUrl(normalizedData.imageUrl)} 
              alt="Question diagram"
              className={styles.questionImage}
              onError={(e) => {
                console.warn('Failed to load question image:', normalizedData.imageUrl);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Show question text for all question types except maths */}
        {!isMathsQuestion && normalizedData.questionText && (
          <div
            className={styles.questionText}
            style={{
              filter: shouldBlurInterviewContent ? 'blur(8px)' : 'none',
              userSelect: shouldBlurInterviewContent ? 'none' : 'auto',
              pointerEvents: shouldBlurInterviewContent ? 'none' : 'auto'
            }}
          >
            {isInterviewQuestion ? (
              // Format interview questions with proper line breaks
              normalizedData.questionText.split('\\n\\n').map((paragraph, index) => (
                <p key={index} style={{ marginBottom: '16px', lineHeight: '1.6' }}>
                  {paragraph.replace(/\\n/g, ' ')}
                </p>
              ))
            ) : isInterviewResourcesQuestion ? (
              // Format Interview Resources title (just display as-is, overview is in questionContent)
              <h2 style={{ marginBottom: '16px', fontSize: '20px', fontWeight: '600' }}>
                {normalizedData.questionText}
              </h2>
            ) : isBiologyQuestion ? (
              // Render biology questions with HTML tags properly parsed and sanitized
              <div
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(
                    normalizedData.questionText
                      .replace(/<br\s*\/?>/gi, '<br />') // Normalize br tags
                      .replace(/\n/g, '<br />') // Convert newlines to br tags
                  )
                }}
              />
            ) : (
              normalizedData.questionText
            )}
          </div>
        )}

        {/* Show overview for Interview Resources with markdown formatting */}
        {isInterviewResourcesQuestion && normalizedData.questionContent && (
          <div
            className={styles.questionText}
            style={{
              marginBottom: '20px',
              filter: shouldBlurContent ? 'blur(8px)' : 'none',
              userSelect: shouldBlurContent ? 'none' : 'auto',
              pointerEvents: shouldBlurContent ? 'none' : 'auto'
            }}
          >
            <ReactMarkdown>
              {normalizedData.questionContent.replace(/\\n\\n/g, '\n\n').replace(/\\n/g, '\n')}
            </ReactMarkdown>
          </div>
        )}

        {/* Show practice questions for Interview Resources */}
        {isInterviewResourcesQuestion && normalizedData.practiceQuestions && normalizedData.practiceQuestions.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Practice Questions:</h3>
            <div
              style={{
                filter: shouldBlurContent ? 'blur(8px)' : 'none',
                userSelect: shouldBlurContent ? 'none' : 'auto',
                pointerEvents: shouldBlurContent ? 'none' : 'auto'
              }}
            >
              {normalizedData.practiceQuestions.map((q: any, index: number) => (
                <div key={index} style={{ marginBottom: '16px', paddingLeft: '16px', borderLeft: '3px solid #E5E7EB' }}>
                  <div style={{ fontWeight: '500', marginBottom: '8px' }}>
                    {q.number}. <ReactMarkdown>
                      {q.question.replace(/\\n\\n/g, '\n\n').replace(/\\n/g, '\n')}
                    </ReactMarkdown>
                  </div>
                  {q.type && (
                    <span style={{ fontSize: '12px', color: '#6B7280', fontStyle: 'italic' }}>
                      [{q.type}]
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Show biology question parts */}
        {isBiologyQuestion && normalizedData.biologyParts && normalizedData.biologyParts.length > 0 && (
          <div className={styles.questionText}>
            {normalizedData.biologyParts.map((part, index) => (
              <div key={index} style={{ marginBottom: '20px' }}>
                <div style={{ 
                  fontWeight: 'bold', 
                  marginBottom: '8px',
                  color: '#333'
                }}>
                  {part.PartNumber}
                </div>
                <div 
                  style={{ lineHeight: '1.6' }}
                  dangerouslySetInnerHTML={{ 
                    __html: sanitizeHtml(
                      part.QuestionText
                        .replace(/<br\s*\/?>/gi, '<br />') // Normalize br tags
                        .replace(/\n/g, '<br />') // Convert newlines to br tags
                    )
                  }}
                />
                {part.Marks && (
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#666', 
                    marginTop: '4px' 
                  }}>
                    [{part.Marks} marks]
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {hit?.options && hit.options.length > 0 && (
          <div className={styles.answerOptions}>
            {hit.options.map((option, index) => {
              const letter = String.fromCharCode(65 + index); // Convert 0->A, 1->B, etc.
              const optionText = typeof option === 'string' ? option : option.text;
              return (
                <div 
                  key={index} 
                  onClick={() => handleAnswerClick(letter)} 
                  className={getOptionStyle(letter)}
                >
                  <span className={styles.optionLetter}>{letter}</span>
                  <span className={styles.optionText}>{optionText}</span>
                </div>
              );
            })}
          </div>
        )}

        <div className={styles.actionButtons}>
          {/* Show Answer button - hidden for interview questions and interview resources */}
          {!isInterviewQuestion && !isInterviewResourcesQuestion && (
            <Button
              variant="secondary"
              size="md"
              className={styles.showAnswerBtn}
              onClick={handleShowAnswer}
            >
              Show Answer
            </Button>
          )}
          
          {/* Video Solution button - only show when video is available for TSA and Maths */}
          {isVideoSolutionAvailable() && (
            <div 
              style={{ position: 'relative', display: 'inline-block' }}
              onMouseEnter={() => setShowVideoTooltip(true)}
              onMouseLeave={() => setShowVideoTooltip(false)}
            >
              <Button 
                variant="primary" 
                size="md"
                onClick={handleVideoSolutionClick}
                disabled={!user || !featureUsage || !featureUsage.video_solution.allowed}
                style={{
                  opacity: (!user || !featureUsage || !featureUsage.video_solution.allowed) ? 0.6 : 1,
                  cursor: (!user || !featureUsage || !featureUsage.video_solution.allowed) ? 'not-allowed' : 'pointer'
                }}
              >
                Video Solution
              </Button>
              
              {/* Custom Tooltip */}
              {showVideoTooltip && (
                <div style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  marginBottom: '10px',
                  zIndex: 10000,
                  pointerEvents: 'none'
                }}>
                  <div style={{
                    backgroundColor: 'white',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '2px solid black',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    fontFamily: "'Madimi One', cursive",
                    fontSize: '12px',
                    color: 'black',
                    whiteSpace: 'nowrap',
                    position: 'relative'
                  }}>
                    {getVideoSolutionTooltip()}
                    {/* Arrow */}
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '0',
                      height: '0',
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: '6px solid black'
                    }}></div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Submit Answer button - available for all question types */}
          <div 
            style={{ position: 'relative', display: 'inline-block' }}
            onMouseEnter={() => setShowSubmitTooltip(true)}
            onMouseLeave={() => setShowSubmitTooltip(false)}
          >
            <Button 
              variant="secondary" 
              size="md"
              onClick={handleSubmitAnswer}
              disabled={!user || !userProfile || (!!userProfile?.discord_id && (!featureUsage || !featureUsage.submit_answer.allowed))}
              style={{ 
                backgroundColor: (!user || !userProfile || (!!userProfile?.discord_id && (!featureUsage || !featureUsage.submit_answer.allowed))) ? '#9CA3AF' : '#5865F2', 
                color: 'white',
                opacity: (!user || !userProfile || (!!userProfile?.discord_id && (!featureUsage || !featureUsage.submit_answer.allowed))) ? 0.6 : 1,
                cursor: (!user || !userProfile || (!!userProfile?.discord_id && (!featureUsage || !featureUsage.submit_answer.allowed))) ? 'not-allowed' : 'pointer'
              }}
            >
              Submit Answer
            </Button>
            
            {/* Custom Tooltip */}
            {showSubmitTooltip && (
              <div style={{
                position: 'absolute',
                bottom: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginBottom: '10px',
                zIndex: 10000,
                pointerEvents: 'none'
              }}>
                <div style={{
                  backgroundColor: 'white',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '2px solid black',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  fontFamily: "'Madimi One', cursive",
                  fontSize: '12px',
                  color: 'black',
                  whiteSpace: 'nowrap',
                  position: 'relative'
                }}>
                  {getSubmitAnswerTooltip()}
                  {/* Arrow */}
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '0',
                    height: '0',
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: '6px solid black'
                  }}></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={handleCloseVideoModal}
        videoUrl={normalizedData.videoUrl}
      />

      {/* PDF Modal */}
      <PdfModal
        isOpen={isPdfModalOpen}
        onClose={handleClosePdfModal}
        pdfUrl={normalizedData.pdfUrl}
        questionNumber={String(normalizedData.questionNumber)}
      />

      {/* Discord Info Modal */}
      {isDiscordInfoModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '500px',
            border: '2px solid black',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{
              fontFamily: "'Madimi One', cursive",
              fontSize: '20px',
              marginBottom: '16px',
              color: 'black'
            }}>
              Discord Information Required
            </h3>

            <p style={{
              marginBottom: '20px',
              fontSize: '14px',
              lineHeight: '1.5',
              color: '#333'
            }}>
              To submit your answer for teacher review, we need your Discord username so our teachers can contact you. Please enter your Discord information below.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: 'black'
              }}>
                Discord Username: *
              </label>
              <input
                type="text"
                value={manualDiscordUsername}
                onChange={(e) => setManualDiscordUsername(e.target.value)}
                placeholder="e.g., username#1234 or username"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
              <div style={{
                fontSize: '11px',
                color: '#666',
                marginTop: '4px'
              }}>
                Your Discord username (e.g., "johndoe" or "johndoe#1234")
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: 'black'
              }}>
                Discord ID (Optional):
              </label>
              <input
                type="text"
                value={manualDiscordId}
                onChange={(e) => setManualDiscordId(e.target.value)}
                placeholder="e.g., 123456789012345678"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
              <div style={{
                fontSize: '11px',
                color: '#666',
                marginTop: '4px'
              }}>
                Your Discord user ID (18-digit number). Right-click your name in Discord and select "Copy User ID" with Developer Mode enabled.
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <Button
                variant="ghost"
                size="md"
                onClick={handleCloseDiscordInfoModal}
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={handleDiscordInfoSubmit}
                disabled={!manualDiscordUsername.trim()}
                style={{
                  backgroundColor: !manualDiscordUsername.trim() ? '#9CA3AF' : '#5865F2',
                  color: 'white',
                  opacity: !manualDiscordUsername.trim() ? 0.6 : 1
                }}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Answer Modal */}
      {isSubmitModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflowY: 'auto',
            border: '2px solid black',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{
              fontFamily: "'Madimi One', cursive",
              fontSize: '20px',
              marginBottom: '16px',
              color: 'black'
            }}>
              Submit Your Answer for Review
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: 'black'
              }}>
                Question:
              </label>
              <div style={{
                padding: '12px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                border: '1px solid #ccc',
                marginBottom: '16px',
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                {normalizedData.questionText || 'Question details will be included in the submission'}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: 'black'
              }}>
                Your Answer: *
              </label>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter your answer here. Our teachers will review it and provide feedback..."
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: 'black'
              }}>
                Video Explanation (Optional):
              </label>
              
              {/* Video Link Input */}
              <div style={{ marginBottom: '12px' }}>
                <input
                  type="url"
                  value={videoLink}
                  onChange={(e) => {
                    setVideoLink(e.target.value);
                    if (e.target.value.trim()) setVideoFile(null); // Clear file if link is entered
                  }}
                  placeholder="Paste YouTube, Loom, or any video link..."
                  disabled={!!videoFile}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    backgroundColor: videoFile ? '#f5f5f5' : 'white'
                  }}
                />
              </div>

              {/* OR Divider */}
              <div style={{
                textAlign: 'center',
                margin: '12px 0',
                fontSize: '12px',
                color: '#666',
                position: 'relative'
              }}>
                <span style={{
                  backgroundColor: 'white',
                  padding: '0 8px'
                }}>
                  OR
                </span>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  right: 0,
                  height: '1px',
                  backgroundColor: '#ddd',
                  zIndex: -1
                }} />
              </div>

              {/* Video File Upload */}
              <div>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoFileChange}
                  disabled={!!videoLink.trim() || isUploadingVideo}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px dashed #ccc',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    backgroundColor: (videoLink.trim() || isUploadingVideo) ? '#f5f5f5' : 'white',
                    cursor: (videoLink.trim() || isUploadingVideo) ? 'not-allowed' : 'pointer'
                  }}
                />
                {videoFile && (
                  <div style={{
                    marginTop: '8px',
                    padding: '8px',
                    backgroundColor: '#e8f5e8',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: '#2d5a2d'
                  }}>
                    ✓ Selected: {videoFile.name} ({formatFileSize(videoFile.size)})
                    <button
                      type="button"
                      onClick={() => setVideoFile(null)}
                      style={{
                        marginLeft: '8px',
                        background: 'none',
                        border: 'none',
                        color: '#d73502',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
                <div style={{
                  fontSize: '11px',
                  color: '#666',
                  marginTop: '4px'
                }}>
                  Upload MP4, MOV, AVI or other video files (max 2GB)
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: 'black'
              }}>
                Additional Links or Context (Optional):
              </label>
              <textarea
                value={additionalLinks}
                onChange={(e) => setAdditionalLinks(e.target.value)}
                placeholder="Add any relevant links, sources, or additional context that might help with the review..."
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            {isUploadingVideo && (
              <div style={{
                padding: '16px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                marginBottom: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Uploading video...
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#5865F2' }}>
                    {uploadProgress}%
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${uploadProgress}%`,
                    height: '100%',
                    backgroundColor: '#5865F2',
                    transition: 'width 0.3s ease',
                    borderRadius: '4px'
                  }} />
                </div>
              </div>
            )}

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <Button
                variant="ghost"
                size="md"
                onClick={handleCloseSubmitModal}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={handleFinalSubmitAnswer}
                disabled={isSubmitting || isUploadingVideo || !userAnswer.trim()}
                style={{
                  backgroundColor: (isSubmitting || isUploadingVideo || !userAnswer.trim()) ? '#9CA3AF' : '#5865F2',
                  color: 'white',
                  opacity: (isSubmitting || isUploadingVideo || !userAnswer.trim()) ? 0.6 : 1
                }}
              >
                {isUploadingVideo ? `Uploading Video... ${uploadProgress}%` : isSubmitting ? 'Submitting...' : 'Submit to Discord'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};