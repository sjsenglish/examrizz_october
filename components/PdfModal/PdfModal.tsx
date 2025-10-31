import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './PdfModal.module.css';

interface PdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl?: string;
  questionNumber?: string;
}

export const PdfModal: React.FC<PdfModalProps> = ({ isOpen, onClose, pdfUrl, questionNumber }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when modal is open
      if (document.body) {
        document.body.style.overflow = 'hidden';
      }
    } else {
      // Restore body scroll when modal is closed
      if (document.body) {
        document.body.style.overflow = 'unset';
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      // Ensure we restore scroll on unmount
      if (document.body) {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isOpen, onClose]);

  if (!isMounted || !isOpen) return null;

  // Convert Firebase storage URL if needed
  const getFirebasePdfUrl = (gsUrl: string): string => {
    if (!gsUrl) return '';
    
    if (gsUrl.startsWith('gs://')) {
      const urlParts = gsUrl.replace('gs://', '').split('/');
      const bucketName = urlParts[0];
      const filePath = urlParts.slice(1).join('/');
      const encodedPath = encodeURIComponent(filePath);
      return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedPath}?alt=media`;
    }
    
    return gsUrl;
  };

  const finalPdfUrl = pdfUrl ? getFirebasePdfUrl(pdfUrl) : '';

  // Create PDF URL with page parameter and search
  const pdfUrlWithParams = finalPdfUrl && questionNumber 
    ? `${finalPdfUrl}#toolbar=1&navpanes=1&scrollbar=1&page=1&search=${encodeURIComponent(`Question ${questionNumber}`)}&view=FitH`
    : finalPdfUrl;

  const modalContent = (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            Mark Scheme {questionNumber ? `- Question ${questionNumber}` : ''}
          </h3>
          <button className={styles.closeButton} onClick={onClose}>
          </button>
        </div>
        
        {finalPdfUrl ? (
          <div className={styles.pdfContainer}>
            <iframe
              src={pdfUrlWithParams}
              title="Mark Scheme PDF"
              className={styles.pdfFrame}
            />
          </div>
        ) : (
          <div className={styles.noPdfMessage}>
            No mark scheme available
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default PdfModal;