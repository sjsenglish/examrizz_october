import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './VideoModal.module.css';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
}

const getYouTubeEmbedUrl = (url: string): string => {
  if (!url) return '';
  
  // Handle different YouTube URL formats
  const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
  const videoId = videoIdMatch ? videoIdMatch[1] : '';
  
  return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
};

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

  const embedUrl = videoUrl ? getYouTubeEmbedUrl(videoUrl) : '';

  const modalContent = (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
        </button>
        
        {embedUrl ? (
          <div className={styles.videoContainer}>
            <iframe
              src={embedUrl}
              title="Video Solution"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className={styles.videoFrame}
            />
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