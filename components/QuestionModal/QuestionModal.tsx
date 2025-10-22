'use client';

import React, { useEffect } from 'react';
import { QuestionCard } from '../ExamSearch/QuestionCard';
import './QuestionModal.css';

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  hit: any;
  isSelected: boolean;
  onToggleSelection: () => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  isOpen,
  onClose,
  hit,
  isSelected,
  onToggleSelection
}) => {
  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="question-modal-overlay" onClick={onClose}>
      <div className="question-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header - Only close button */}
        <div className="question-modal-header">
          <button 
            onClick={onClose}
            className="modal-close-button"
            aria-label="Close modal"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Modal Content - Full Question Card */}
        <div className="question-modal-content">
          <QuestionCard hit={hit} />
        </div>

      </div>
    </div>
  );
};