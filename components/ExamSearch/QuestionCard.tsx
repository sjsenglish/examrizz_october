import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '../ui/Button';
import { QuestionCardProps, Question } from '@/types/question';
import { VideoModal } from '../VideoModal';
import { PdfModal } from '../PdfModal';
import styles from './QuestionCard.module.css';

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
  
  // Feature usage state
  const [featureUsage, setFeatureUsage] = useState<{
    submit_answer: { allowed: boolean; remaining: number; limit: number; period: 'month' | 'day' };
    video_solution: { allowed: boolean; remaining: number; limit: number; period: 'month' | 'day' };
    tier: string;
  } | null>(null);
  const [user, setUser] = useState<any>(null);

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

  // Load user and feature usage data
  useEffect(() => {
    const loadUserAndUsage = async () => {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          // Fetch feature usage summary
          const response = await fetch(`/api/feature-usage?userId=${user.id}`);
          if (response.ok) {
            const data = await response.json();
            setFeatureUsage(data.summary);
          }
        }
      } catch (error) {
        console.error('Error loading user and feature usage:', error);
      }
    };

    loadUserAndUsage();
  }, []);

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
      alert('Please log in to access video solutions.');
      return;
    }

    if (!featureUsage) {
      alert('Loading usage information...');
      return;
    }

    if (!featureUsage.video_solution.allowed) {
      alert(`You've reached your video solution limit. ${featureUsage.video_solution.remaining} of ${featureUsage.video_solution.limit} ${featureUsage.video_solution.period}ly uses remaining.`);
      return;
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
        alert('Please log in to submit an answer for review.');
        return;
      }

      if (!featureUsage) {
        alert('Loading usage information...');
        return;
      }

      if (!featureUsage.submit_answer.allowed) {
        alert(`You've reached your submission limit. ${featureUsage.submit_answer.remaining} of ${featureUsage.submit_answer.limit} ${featureUsage.submit_answer.period}ly submissions remaining.`);
        return;
      }

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

      // Create the question context - question is pre-filled, user needs to add answer
      const questionContext = `**${questionType} Help Request**\n\n**QUESTION:** ${normalizedData.questionText || 'See question above'}\n\n**STUDENT NEEDS HELP WITH:** [Please add your answer or specific question here for teacher feedback]`;
      
      // Generate unique ticket ID
      const ticketId = `QUEST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Create ticket in Discord help center via webhook (like Ask Bo)
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
        // Open Discord server directly
        window.open('https://discord.gg/examrizzsearch', '_blank');
      } else {
        alert('Failed to create help ticket. Please try again.');
      }

    } catch (error) {
      console.error('Submit answer error:', error);
      alert('Failed to create help ticket. Please try again.');
    }
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
    if (!featureUsage || !user) return '';
    const { submit_answer } = featureUsage;
    if (submit_answer.limit === -1) return 'Unlimited submissions';
    return `${submit_answer.remaining} of ${submit_answer.limit} monthly submissions remaining`;
  };

  const getVideoSolutionTooltip = () => {
    if (!featureUsage || !user) return '';
    const { video_solution } = featureUsage;
    if (video_solution.limit === -1) return 'Unlimited video solutions';
    return `${video_solution.remaining} of ${video_solution.limit} ${video_solution.period}ly video solutions remaining`;
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
              // Render biology questions with HTML tags properly parsed
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: normalizedData.questionText
                    .replace(/<br\s*\/?>/gi, '<br />') // Normalize br tags
                    .replace(/\n/g, '<br />') // Convert newlines to br tags
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
                    __html: part.QuestionText
                      .replace(/<br\s*\/?>/gi, '<br />') // Normalize br tags
                      .replace(/\n/g, '<br />') // Convert newlines to br tags
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
            <Button 
              variant="primary" 
              size="md"
              onClick={handleVideoSolutionClick}
              title={getVideoSolutionTooltip()}
              disabled={featureUsage ? !featureUsage.video_solution.allowed : false}
              style={{
                opacity: featureUsage && !featureUsage.video_solution.allowed ? 0.6 : 1,
                cursor: featureUsage && !featureUsage.video_solution.allowed ? 'not-allowed' : 'pointer'
              }}
            >
              Video Solution
            </Button>
          )}
          
          {/* Submit Answer button - available for all question types */}
          <Button 
            variant="secondary" 
            size="md"
            onClick={handleSubmitAnswer}
            title={getSubmitAnswerTooltip()}
            disabled={featureUsage ? !featureUsage.submit_answer.allowed : false}
            style={{ 
              backgroundColor: featureUsage && !featureUsage.submit_answer.allowed ? '#9CA3AF' : '#5865F2', 
              color: 'white',
              opacity: featureUsage && !featureUsage.submit_answer.allowed ? 0.6 : 1,
              cursor: featureUsage && !featureUsage.submit_answer.allowed ? 'not-allowed' : 'pointer'
            }}
          >
            Submit Answer
          </Button>
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
    </article>
  );
};