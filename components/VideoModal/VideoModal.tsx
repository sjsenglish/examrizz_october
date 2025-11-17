import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './VideoModal.module.css';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
}

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoUrl }) => {
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

  const modalContent = (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
        </button>

        {videoUrl ? (
          <div className={styles.videoContainer}>
            <video
              src={videoUrl}
              controls
              controlsList="nodownload"
              className={styles.videoFrame}
              style={{ width: '100%', height: '100%', backgroundColor: '#000' }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <div className={styles.noVideoMessage}>
            No video solution available
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default VideoModal;