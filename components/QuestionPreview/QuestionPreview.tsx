'use client';

import React from 'react';
import './QuestionPreview.css';

interface QuestionPreviewProps {
  hit: any;
  isSelected: boolean;
  onToggle: () => void;
  onViewFull: () => void;
  subject: string;
}

// Helper function for Firebase image URL conversion
const getFirebaseImageUrl = (gsUrl: string): string => {
  if (!gsUrl || !gsUrl.startsWith('gs://')) return '';
  
  const urlParts = gsUrl.replace('gs://', '').split('/');
  const bucketName = urlParts[0];
  const filePath = urlParts.slice(1).join('/');
  const encodedPath = encodeURIComponent(filePath);
  
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedPath}?alt=media`;
};

export const QuestionPreview: React.FC<QuestionPreviewProps> = ({ 
  hit, 
  isSelected, 
  onToggle, 
  onViewFull, 
  subject 
}) => {
  // Subject-specific rendering logic
  const renderTSAPreview = () => (
    <>
      {/* Header with question info and badges */}
      <div className="question-preview-header">
        <div className="question-info">
          {/* Checkbox before question number */}
          <label className="checkbox-container">
            <input 
              type="checkbox" 
              checked={isSelected}
              onChange={onToggle}
              className="selection-checkbox" 
            />
            <span className="checkmark"></span>
          </label>
          <span className="question-number">
            Question {hit.questionno || hit.question_number || ''}
          </span>
          {hit.year && <span className="year-badge">{hit.year}</span>}
        </div>
        <div className="filter-badges">
          {hit.question_type && (
            <span className="filter-badge">{hit.question_type}</span>
          )}
          {hit.sub_types && (
            <span className="filter-badge filter-badge-secondary">
              {Array.isArray(hit.sub_types) ? hit.sub_types[0] : hit.sub_types}
            </span>
          )}
        </div>
      </div>

      {/* Preview content - limited height */}
      <div className="question-preview-content">
        {/* Question passage/content */}
        {(hit.question_content || hit.questiontext) && (
          <div className="question-passage">
            {hit.question_content || hit.questiontext}
          </div>
        )}

        {/* Question image */}
        {(hit.imageFile || hit.question_image) && (
          <div className="question-image-container">
            <img 
              src={getFirebaseImageUrl(hit.imageFile || hit.question_image)} 
              alt="Question"
              className="question-image"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Question text */}
        {hit.question && (
          <div className="question-text">
            {hit.question}
          </div>
        )}

        {/* Partial answer options - only show first 2-3 */}
        <div className="answer-options-preview">
          {['A', 'B', 'C'].map((letter) => {
            const answerKey = `answer${letter.toLowerCase()}`;
            const answerText = hit[answerKey] || 
              (hit.options && hit.options[letter.charCodeAt(0) - 65]?.text) ||
              (hit.options && hit.options[letter.charCodeAt(0) - 65]);
            
            if (!answerText) return null;
            
            return (
              <div key={letter} className="answer-option-preview">
                <span className="answer-letter">{letter}</span>
                <span className="answer-text">{answerText}</span>
              </div>
            );
          })}
          {/* Show indicator for more options */}
          <div className="more-options-indicator">
            ...
          </div>
        </div>
      </div>
    </>
  );

  // Default preview for other subjects (can be customized later)
  const renderDefaultPreview = () => (
    <>
      <div className="question-preview-header">
        <div className="question-info">
          {/* Checkbox before question number */}
          <label className="checkbox-container">
            <input 
              type="checkbox" 
              checked={isSelected}
              onChange={onToggle}
              className="selection-checkbox" 
            />
            <span className="checkmark"></span>
          </label>
          <span className="question-number">
            Question {hit.questionno || hit.question_number || ''}
          </span>
          {hit.year && <span className="year-badge">{hit.year}</span>}
        </div>
      </div>

      <div className="question-preview-content">
        {(hit.question_content || hit.questiontext || hit.question) && (
          <div className="question-text">
            {hit.question_content || hit.questiontext || hit.question}
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className={`question-preview-card ${isSelected ? 'selected' : ''}`}>
      {/* Subject-specific preview content */}
      <div className="preview-content-wrapper">
        {subject.toLowerCase() === 'tsa' ? renderTSAPreview() : renderDefaultPreview()}
      </div>

      {/* View full question button */}
      <div className="preview-actions">
        <button 
          onClick={onViewFull}
          className="view-full-button"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 3h6v6M14 10l6.1-6.1M9 21H3v-6M10 14l-6.1 6.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          View Full Question
        </button>
      </div>
    </div>
  );
};