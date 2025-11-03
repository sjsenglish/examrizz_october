import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '../ui/Button';
import { QuestionCardProps, Question } from '@/types/question';
import { VideoModal } from '../VideoModal';
import { PdfModal } from '../PdfModal';
import styles from './QuestionCard.module.css';
import DOMPurify from 'dompurify';
import { supabase } from '@/lib/supabase-client';

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
  const [userProfile, setUserProfile] = useState<any>(null);
  
  // Tooltip state
  const [showSubmitTooltip, setShowSubmitTooltip] = useState(false);
  const [showVideoTooltip, setShowVideoTooltip] = useState(false);
  
  // Submit answer modal state
  const [userAnswer, setUserAnswer] = useState('');
  const [additionalLinks, setAdditionalLinks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Detect question type based on data structure - memoized to prevent re-renders
  const isMathsQuestion = useMemo(() => hit?.paper_info && hit?.spec_topic, [hit]);
  const isEnglishLitQuestion = useMemo(() => hit?.QualificationLevel === 'A Level' && hit?.Subject === 'English Literature', [hit]);
  const isInterviewQuestion = useMemo(() => hit?.QuestionID && hit?.Time && hit?.QuestionPromptText, [hit]);
  const isBiologyQuestion = useMemo(() => hit?.Subject === 'Biology' && hit?.Parts && Array.isArray(hit.Parts), [hit]);

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
          setUserProfile(null);
          setFeatureUsage(null);
          return;
        }
        
        setUser(user);
        
        // Get user profile from database
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        setUserProfile(profile);

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
        setUserProfile(null);
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
        setUserProfile(null);
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
    } else if (!isInterviewQuestion) {
      setIsAnswerRevealed(true);
    }
    // Interview questions don't have answers - they're discussion questions
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

      // Check if user is authenticated with Discord/Google (sufficient for submission)
      const provider = user.app_metadata?.provider;
      const hasDiscordAuth = user.identities?.find((identity: any) => identity.provider === 'discord');
      const hasGoogleAuth = user.identities?.find((identity: any) => identity.provider === 'google');
      
      if (!hasDiscordAuth && !hasGoogleAuth && (!userProfile.discord_id)) {
        // No OAuth provider and no Discord linked - need to link Discord
        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'discord',
            options: {
              redirectTo: `${window.location.origin}${window.location.pathname}?submit=true`
            }
          });

          if (error) {
            console.error('Discord OAuth error:', error);
            alert('Failed to connect Discord account. Please try again.');
          }
          // User will be redirected to Discord OAuth
          return;
        } catch (error) {
          console.error('Discord OAuth setup error:', error);
          alert('Failed to setup Discord connection. Please try again.');
          return;
        }
      }
      
      // Update profile with Discord data if Discord authenticated but not saved
      if (hasDiscordAuth && !userProfile.discord_id) {
        try {
          const userMetadata = user.user_metadata || {};
          const discordData = {
            discord_id: userMetadata.provider_id || userMetadata.sub || userMetadata.id,
            discord_username: userMetadata.username || userMetadata.global_name || userMetadata.name,
            discord_avatar: userMetadata.avatar_url || userMetadata.picture,
            discord_discriminator: userMetadata.discriminator,
            discord_linked_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          await supabase
            .from('user_profiles')
            .update(discordData)
            .eq('id', user.id);
            
          // Update local state
          setUserProfile((prev: any) => ({ ...prev, ...discordData }));
        } catch (error) {
          console.error('Failed to update Discord profile data:', error);
        }
      }

      if (!featureUsage) {
        return; // Tooltip will show the message
      }

      if (!featureUsage.submit_answer.allowed) {
        return; // Tooltip will show the message
      }

      // Open the submission modal for users with Discord linked
      setUserAnswer('');
      setAdditionalLinks('');
      setIsSubmitModalOpen(true);
    } catch (error) {
      console.error('Submit answer error:', error);
      alert('Failed to open submission form. Please try again.');
    }
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

      // Create the question context with user's answer
      let questionContext = `**${questionType} Help Request**\n\n**QUESTION:** ${normalizedData.questionText || 'See question above'}\n\n**MY ANSWER:** ${userAnswer.trim()}`;
      
      if (additionalLinks.trim()) {
        questionContext += `\n\n**ADDITIONAL LINKS/CONTEXT:** ${additionalLinks.trim()}`;
      }
      
      // Generate unique ticket ID
      const ticketId = `QUEST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

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
          type: submissionType
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Close modal and open Discord server
        setIsSubmitModalOpen(false);
        setUserAnswer('');
        setAdditionalLinks('');
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

  const handleCloseSubmitModal = () => {
    setIsSubmitModalOpen(false);
    setUserAnswer('');
    setAdditionalLinks('');
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
    
    if (!hasDiscordAuth && !hasGoogleAuth && !userProfile.discord_id) {
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
    return normalizedData.videoUrl && (isMathsQuestion || (!isInterviewQuestion && !isEnglishLitQuestion && !isBiologyQuestion));
  };
  
  // Get normalized data based on question type - memoized to prevent re-renders
  const normalizedData = useMemo(() => ({
    questionNumber: isInterviewQuestion ? hit?.QuestionID : (isEnglishLitQuestion ? hit?.QuestionNo : (isBiologyQuestion ? hit?.QuestionNumber : (hit?.question_number || ''))),
    year: isInterviewQuestion ? null : (isEnglishLitQuestion ? hit?.PaperYear : (isMathsQuestion ? hit?.paper_info?.year : (isBiologyQuestion ? hit?.Year : hit?.year))),
    questionType: isInterviewQuestion ? hit?.SubjectId1 : (isEnglishLitQuestion ? hit?.PaperName : (isMathsQuestion ? hit?.spec_topic : (isBiologyQuestion ? hit?.Subject : hit?.question_type))),
    subType: isInterviewQuestion ? hit?.SubjectId2 : (isEnglishLitQuestion ? hit?.PaperSection : (isMathsQuestion ? hit?.question_topic : (isBiologyQuestion ? hit?.QuestionTopics?.[0] : (Array.isArray(hit?.sub_types) ? hit.sub_types[0] : hit?.sub_types)))),
    filters: isInterviewQuestion ? (hit?.all_subjects || []) : (isEnglishLitQuestion ? englishLitFilters : (isBiologyQuestion ? (hit?.QuestionTopics || []) : (hit?.filters || []))),
    questionContent: hit?.question_content || hit?.question_text,
    imageUrl: hit?.imageFile || hit?.imageUrl,
    questionText: isInterviewQuestion ? hit?.QuestionPromptText : (isEnglishLitQuestion ? hit?.QuestionPrompt : (isBiologyQuestion ? hit?.Parts?.[0]?.QuestionText : (hit?.question || hit?.question_text))),
    videoUrl: hit?.videoSolutionLink || hit?.video_solution_url_1,
    marks: isInterviewQuestion ? null : (isEnglishLitQuestion ? hit?.QuestionTotalMarks : (isBiologyQuestion ? hit?.TotalMarks : hit?.marks)),
    time: isInterviewQuestion ? hit?.Time : null,
    paperInfo: englishLitPaperInfo || hit?.paper_info,
    textInfo: isEnglishLitQuestion ? hit?.Text1 : null,
    subjects: isInterviewQuestion ? hit?.all_subjects : null,
    pdfUrl: isEnglishLitQuestion ? hit?.MS : (isBiologyQuestion ? hit?.MarkScheme : (hit?.markscheme_pdf || hit?.pdf_url || hit?.markscheme_url || hit?.answer_pdf || hit?.answers_pdf)),
    biologyParts: isBiologyQuestion ? hit?.Parts : null
  }), [hit, isInterviewQuestion, isEnglishLitQuestion, isMathsQuestion, isBiologyQuestion, englishLitFilters, englishLitPaperInfo]);

  return (
    <article className={styles.questionCard}>
      <header className={styles.questionHeader}>
        <div className={styles.questionInfo}>
          <span className={styles.questionNumber}>
            {isInterviewQuestion ? normalizedData.questionNumber : `Question ${normalizedData.questionNumber}`}
          </span>
          {normalizedData.year && <span className={styles.yearBadge}>{normalizedData.year}</span>}
          {normalizedData.marks && <span className={styles.marksBadge}>{normalizedData.marks} marks</span>}
          {normalizedData.time && <span className={styles.marksBadge}>{normalizedData.time} minutes</span>}
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
        {/* Show question content for non-maths questions */}
        {!isMathsQuestion && normalizedData.questionContent && (
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
          <div className={styles.questionText}>
            {isInterviewQuestion ? (
              // Format interview questions with proper line breaks
              normalizedData.questionText.split('\\n\\n').map((paragraph, index) => (
                <p key={index} style={{ marginBottom: '16px', lineHeight: '1.6' }}>
                  {paragraph.replace(/\\n/g, ' ')}
                </p>
              ))
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
          {/* Show Answer button - hidden for interview questions */}
          {!isInterviewQuestion && (
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
              disabled={!user || !userProfile || (userProfile?.discord_id && (!featureUsage || !featureUsage.submit_answer.allowed))}
              style={{ 
                backgroundColor: (!user || !userProfile || (userProfile?.discord_id && (!featureUsage || !featureUsage.submit_answer.allowed))) ? '#9CA3AF' : '#5865F2', 
                color: 'white',
                opacity: (!user || !userProfile || (userProfile?.discord_id && (!featureUsage || !featureUsage.submit_answer.allowed))) ? 0.6 : 1,
                cursor: (!user || !userProfile || (userProfile?.discord_id && (!featureUsage || !featureUsage.submit_answer.allowed))) ? 'not-allowed' : 'pointer'
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
                disabled={isSubmitting || !userAnswer.trim()}
                style={{
                  backgroundColor: isSubmitting || !userAnswer.trim() ? '#9CA3AF' : '#5865F2',
                  color: 'white',
                  opacity: isSubmitting || !userAnswer.trim() ? 0.6 : 1
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit to Discord'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};