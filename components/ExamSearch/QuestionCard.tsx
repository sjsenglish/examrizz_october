import React, { useState } from 'react';
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
  
  // Debug log to verify URL conversion
  console.log('Converting Firebase URL:', gsUrl, '→', firebaseUrl);
  
  return firebaseUrl;
};

export const QuestionCard: React.FC<QuestionCardProps> = ({ hit }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Detect question type based on data structure
  const isMathsQuestion = hit?.paper_info && hit?.spec_topic;
  const isEnglishLitQuestion = hit?.QualificationLevel === 'A Level' && hit?.Subject === 'English Literature';
  const isInterviewQuestion = hit?.QuestionID && hit?.Time && hit?.QuestionPromptText;

  const handleAnswerClick = (letter: string) => {
    setSelectedAnswer(letter);
    setIsAnswerRevealed(true);
  };

  const handleShowAnswer = () => {
    if (isMathsQuestion || isEnglishLitQuestion) {
      setIsPdfModalOpen(true);
    } else if (!isInterviewQuestion) {
      setIsAnswerRevealed(true);
    }
    // Interview questions don't have answers - they're discussion questions
  };

  const handleVideoSolutionClick = () => {
    setIsVideoModalOpen(true);
  };

  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false);
  };

  const handleClosePdfModal = () => {
    setIsPdfModalOpen(false);
  };

  const handleSubmitAnswer = async () => {
    try {
      // Import Supabase client for authentication check
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Please log in to submit an answer for review.');
        return;
      }

      // Determine question type and format content accordingly
      let questionContent = '';
      let ticketPrefix = '';
      let submissionType = '';

      if (isInterviewQuestion) {
        questionContent = `**Interview Question Submission**\n\n` +
                         `**Question ID:** ${normalizedData.questionNumber}\n` +
                         `**Duration:** ${normalizedData.time} minutes\n` +
                         `**Subjects:** ${normalizedData.subjects?.join(', ') || 'N/A'}\n\n` +
                         `**Question:**\n${normalizedData.questionText?.replace(/\\n\\n/g, '\n\n').replace(/\\n/g, '\n')}\n\n` +
                         `**Student's Answer:**\n[Student submitted this question for review]`;
        ticketPrefix = 'INTERVIEW';
        submissionType = 'interview-question';
      } else if (isEnglishLitQuestion) {
        questionContent = `**English Literature Question Submission**\n\n` +
                         `**Question:** ${normalizedData.questionNumber}\n` +
                         `**Year:** ${normalizedData.year}\n` +
                         `**Paper:** ${normalizedData.questionType} - ${normalizedData.subType}\n` +
                         `**Text:** ${normalizedData.textInfo?.Title} by ${normalizedData.textInfo?.Author}\n` +
                         `**Marks:** ${normalizedData.marks}\n\n` +
                         `**Question:**\n${normalizedData.questionText}\n\n` +
                         `**Student's Answer:**\n[Student submitted this question for review]`;
        ticketPrefix = 'ENGLIT';
        submissionType = 'english-lit-question';
      } else if (isMathsQuestion) {
        questionContent = `**Maths Question Submission**\n\n` +
                         `**Question:** ${normalizedData.questionNumber}\n` +
                         `**Year:** ${normalizedData.year}\n` +
                         `**Topic:** ${normalizedData.questionType}\n` +
                         `**Subtopic:** ${normalizedData.subType}\n` +
                         `**Marks:** ${normalizedData.marks}\n\n` +
                         `**Question:**\n${normalizedData.questionText || 'See image'}\n\n` +
                         `**Student's Answer:**\n[Student submitted this question for review]`;
        ticketPrefix = 'MATHS';
        submissionType = 'maths-question';
      } else {
        // TSA, BMAT, other admission tests
        const subjectName = normalizedData.questionType || 'Admission Test';
        questionContent = `**${subjectName} Question Submission**\n\n` +
                         `**Question:** ${normalizedData.questionNumber}\n` +
                         `**Year:** ${normalizedData.year}\n` +
                         `**Type:** ${normalizedData.questionType}\n` +
                         `**Category:** ${normalizedData.subType}\n\n` +
                         `**Question:**\n${normalizedData.questionText}\n\n` +
                         `**Student's Answer:**\n[Student submitted this question for review]`;
        ticketPrefix = 'ADMISSION';
        submissionType = 'admission-question';
      }
      
      // Generate unique ticket ID
      const ticketId = `${ticketPrefix}-${normalizedData.questionNumber}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Send to Discord webhook
      const response = await fetch('/api/discord-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: questionContent,
          ticketId: ticketId,
          userEmail: user.email,
          type: submissionType
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(`Answer submitted successfully! Our teachers will review your response and provide feedback. Ticket ID: ${result.ticketId}`);
      } else {
        alert('Failed to submit answer. Please try again.');
      }
    } catch (error) {
      console.error('Discord submission error:', error);
      alert('Failed to submit answer. Please try again.');
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

  const isALevelQuestion = hit?.paper_info && hit?.qualification_level === 'A Level';
  
  // Get normalized data based on question type
  const normalizedData = {
    questionNumber: isInterviewQuestion ? hit?.QuestionID : (isEnglishLitQuestion ? hit?.QuestionNo : (hit?.question_number || '')),
    year: isInterviewQuestion ? null : (isEnglishLitQuestion ? hit?.PaperYear : (isMathsQuestion ? hit?.paper_info?.year : hit?.year)),
    questionType: isInterviewQuestion ? hit?.SubjectId1 : (isEnglishLitQuestion ? hit?.PaperName : (isMathsQuestion ? hit?.spec_topic : hit?.question_type)),
    subType: isInterviewQuestion ? hit?.SubjectId2 : (isEnglishLitQuestion ? hit?.PaperSection : (isMathsQuestion ? hit?.question_topic : (Array.isArray(hit?.sub_types) ? hit.sub_types[0] : hit?.sub_types))),
    filters: isInterviewQuestion ? hit?.all_subjects || [] : (isEnglishLitQuestion ? [hit?.Text1?.Author, hit?.Text1?.Age].filter(Boolean) : (isMathsQuestion ? hit?.filters : [])),
    questionContent: hit?.question_content || hit?.question_text,
    imageUrl: hit?.imageFile || hit?.imageUrl,
    questionText: isInterviewQuestion ? hit?.QuestionPromptText : (isEnglishLitQuestion ? hit?.QuestionPrompt : (hit?.question || hit?.question_text)),
    videoUrl: hit?.videoSolutionLink || hit?.video_solution_url_1,
    marks: isInterviewQuestion ? null : (isEnglishLitQuestion ? hit?.QuestionTotalMarks : hit?.marks),
    time: isInterviewQuestion ? hit?.Time : null,
    paperInfo: isEnglishLitQuestion ? { 
      code: hit?.PaperCode, 
      name: hit?.PaperName, 
      section: hit?.PaperSection,
      year: hit?.PaperYear,
      month: hit?.PaperMonth 
    } : hit?.paper_info,
    textInfo: isEnglishLitQuestion ? hit?.Text1 : null,
    subjects: isInterviewQuestion ? hit?.all_subjects : null,
    pdfUrl: isEnglishLitQuestion ? hit?.MS : (hit?.markscheme_pdf || hit?.pdf_url || hit?.markscheme_url || hit?.answer_pdf || hit?.answers_pdf)
  };

  // Debug: Log available fields for maths questions
  if (isMathsQuestion) {
    console.log('Maths question data:', {
      markscheme_pdf: hit?.markscheme_pdf,
      pdf_url: hit?.pdf_url,
      markscheme_url: hit?.markscheme_url,
      answer_pdf: hit?.answer_pdf,
      answers_pdf: hit?.answers_pdf,
      allFields: Object.keys(hit || {})
    });
  }

  // Debug: Log available fields for English Literature questions
  if (isEnglishLitQuestion) {
    console.log('English Lit question data:', {
      QuestionNo: hit?.QuestionNo,
      PaperYear: hit?.PaperYear,
      QuestionPrompt: hit?.QuestionPrompt,
      QuestionTotalMarks: hit?.QuestionTotalMarks,
      PaperName: hit?.PaperName,
      PaperSection: hit?.PaperSection,
      Text1: hit?.Text1,
      MS: hit?.MS,
      QP: hit?.QP,
      ER: hit?.ER,
      allFields: Object.keys(hit || {})
    });
  }

  // Debug: Log available fields for interview questions
  if (isInterviewQuestion) {
    console.log('Interview question data:', {
      QuestionID: hit?.QuestionID,
      Time: hit?.Time,
      QuestionPromptText: hit?.QuestionPromptText,
      SubjectId1: hit?.SubjectId1,
      SubjectId2: hit?.SubjectId2,
      all_subjects: hit?.all_subjects,
      allFields: Object.keys(hit || {})
    });
  }
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
              {normalizedData.paperInfo.paper_reference || 'SPEC PT. 4.1'}
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

        {/* Show question text for all question types */}
        {normalizedData.questionText && (
          <div className={styles.questionText}>
            {isInterviewQuestion ? (
              // Format interview questions with proper line breaks
              normalizedData.questionText.split('\\n\\n').map((paragraph, index) => (
                <p key={index} style={{ marginBottom: '16px', lineHeight: '1.6' }}>
                  {paragraph.replace(/\\n/g, ' ')}
                </p>
              ))
            ) : (
              normalizedData.questionText
            )}
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
          
          {/* Video Solution button - only show when video is available */}
          {normalizedData.videoUrl && (
            <Button 
              variant="primary" 
              size="md"
              onClick={handleVideoSolutionClick}
            >
              Video Solution
            </Button>
          )}
          
          {/* Submit Answer button - available for all question types */}
          <Button 
            variant="secondary" 
            size="md"
            onClick={handleSubmitAnswer}
            style={{ backgroundColor: '#5865F2', color: 'white' }}
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