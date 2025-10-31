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

  const handleAnswerClick = (letter: string) => {
    setSelectedAnswer(letter);
    setIsAnswerRevealed(true);
  };

  const handleShowAnswer = () => {
    if (isMathsQuestion) {
      setIsPdfModalOpen(true);
    } else {
      setIsAnswerRevealed(true);
    }
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
    questionNumber: hit?.question_number || '',
    year: isMathsQuestion ? hit?.paper_info?.year : hit?.year,
    questionType: isMathsQuestion ? hit?.spec_topic : hit?.question_type,
    subType: isMathsQuestion ? hit?.question_topic : (Array.isArray(hit?.sub_types) ? hit.sub_types[0] : hit?.sub_types),
    filters: isMathsQuestion ? hit?.filters : [],
    questionContent: hit?.question_content || hit?.question_text,
    imageUrl: hit?.imageFile || hit?.imageUrl,
    questionText: hit?.question || hit?.question_text,
    videoUrl: hit?.videoSolutionLink || hit?.video_solution_url_1,
    marks: hit?.marks,
    paperInfo: hit?.paper_info,
    pdfUrl: hit?.markscheme_pdf
  };
  return (
    <article className={styles.questionCard}>
      <header className={styles.questionHeader}>
        <div className={styles.questionInfo}>
          <span className={styles.questionNumber}>
            Question {normalizedData.questionNumber}
          </span>
          {normalizedData.year && <span className={styles.yearBadge}>{normalizedData.year}</span>}
          {normalizedData.marks && <span className={styles.marksBadge}>{normalizedData.marks} marks</span>}
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
        {/* Only show question content and text for non-maths questions */}
        {!isMathsQuestion && normalizedData.questionContent && (
          <p className={styles.questionPassage}>
            {normalizedData.questionContent}
          </p>
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

        {!isMathsQuestion && normalizedData.questionText && (
          <div className={styles.questionText}>
            {normalizedData.questionText}
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
          <Button 
            variant="secondary" 
            size="md" 
            className={styles.showAnswerBtn}
            onClick={handleShowAnswer}
          >
            Show Answer
          </Button>
          <Button 
            variant="primary" 
            size="md"
            onClick={handleVideoSolutionClick}
            disabled={!normalizedData.videoUrl}
          >
            Video Solution
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