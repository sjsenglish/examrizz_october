import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { QuestionCardProps, Question } from '@/types/question';
import { VideoModal } from '../VideoModal';
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

  const handleAnswerClick = (letter: string) => {
    setSelectedAnswer(letter);
    setIsAnswerRevealed(true);
  };

  const handleShowAnswer = () => {
    setIsAnswerRevealed(true);
  };

  const handleVideoSolutionClick = () => {
    setIsVideoModalOpen(true);
  };

  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false);
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

  const subType = Array.isArray(hit?.sub_types) ? hit.sub_types[0] : hit?.sub_types;
  return (
    <article className={styles.questionCard}>
      <header className={styles.questionHeader}>
        <div className={styles.questionInfo}>
          <span className={styles.questionNumber}>
            Question {hit?.question_number || ''}
          </span>
          {hit?.year && <span className={styles.yearBadge}>{hit.year}</span>}
        </div>
        <div className={styles.filterButtons}>
          {hit?.question_type && (
            <Button variant="filter" size="sm">{hit.question_type}</Button>
          )}
          {subType && (
            <Button variant="filter" size="sm" 
              style={{ backgroundColor: 'var(--color-secondary-light)' }}>
              {subType}
            </Button>
          )}
          <Button variant="filter" size="sm" 
            style={{ backgroundColor: 'transparent' }}>
            SPEC PT. 4.1
          </Button>
        </div>
      </header>

      <div className={styles.questionContent}>
        {hit?.question_content && (
          <p className={styles.questionPassage}>
            {hit.question_content}
          </p>
        )}

        {hit?.imageFile && (
          <div className={styles.questionImageContainer}>
            <img 
              src={getFirebaseImageUrl(hit.imageFile)} 
              alt="Question diagram"
              className={styles.questionImage}
              onError={(e) => {
                console.warn('Failed to load question image:', hit.imageFile);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        {hit?.question && (
          <div className={styles.questionText}>
            {hit.question}
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
            disabled={!hit?.videoSolutionLink}
          >
            Video Solution
          </Button>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={handleCloseVideoModal}
        videoUrl={hit?.videoSolutionLink}
      />
    </article>
  );
};