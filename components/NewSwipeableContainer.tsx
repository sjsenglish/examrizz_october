'use client';

import React, { useState } from 'react';
import { LandingHub } from '@/components/landing/LandingHub';
import ExamSearch from '@/components/ExamSearch';
import { SettingsButton } from '@/components/SettingsButton';
import Image from 'next/image';
import Link from 'next/link';
import './NewSwipeableContainer.css';

export const NewSwipeableContainer: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'island' | 'search'>('island');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showGhost, setShowGhost] = useState(true);
  
  // Speech bubble states
  const [islandSpeechText, setIslandSpeechText] = useState(
    "Search past\npaper questions!"
  );
  const [searchSpeechText, setSearchSpeechText] = useState(
    "Back to main\nisland!"
  );
  const [editingBubble, setEditingBubble] = useState<'island' | 'search' | null>(null);
  const [tempText, setTempText] = useState('');

  const navigateToPage = (page: 'island' | 'search') => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentPage(page);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    }
  };

  const handleBubbleEdit = (side: 'island' | 'search') => {
    setEditingBubble(side);
    setTempText(side === 'island' ? islandSpeechText : searchSpeechText);
  };

  const handleSaveBubble = () => {
    if (editingBubble === 'island') {
      setIslandSpeechText(tempText);
    } else if (editingBubble === 'search') {
      setSearchSpeechText(tempText);
    }
    setEditingBubble(null);
  };

  const handleCancelBubble = () => {
    setEditingBubble(null);
    setTempText('');
  };

  const handleDismissGhost = () => {
    setShowGhost(false);
  };

  // Render the current page content
  const renderCurrentPage = () => {
    if (currentPage === 'island') {
      return (
        <div className="island-page">
          <div className="island-content">
            <LandingHub />
          </div>
        </div>
      );
    } else {
      return (
        <div className="search-page">
          <ExamSearch />
        </div>
      );
    }
  };

  return (
    <div className="swipeable-container">
      {/* Navbar */}
      <nav className="navbar">
        <Link href="/" className="navbar-logo">
          <h1 className="navbar-title">examrizzsearch</h1>
        </Link>
        <button className="navbar-menu">
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
        </button>
      </nav>

      {/* Settings Button - only on island page */}
      {currentPage === 'island' && <SettingsButton />}
      

      {/* Page Content */}
      <div className={`page-content ${currentPage}-active ${isTransitioning ? 'transitioning' : ''}`}>
        {renderCurrentPage()}
      </div>

      {/* Navigation Arrows - positioned relative to viewport */}
      {currentPage === 'island' && (
        <NavigationArrow direction="right" onClick={() => navigateToPage('search')} />
      )}
      {currentPage === 'search' && (
        <NavigationArrow direction="left" onClick={() => navigateToPage('island')} />
      )}

      {/* Ghost - positioned relative to viewport */}
      {showGhost && (
        <GhostWithBubble 
          side={currentPage} 
          speechText={currentPage === 'island' ? islandSpeechText : searchSpeechText}
          isEditing={editingBubble === currentPage}
          onEdit={() => handleBubbleEdit(currentPage)}
          onDismiss={handleDismissGhost}
          tempText={tempText}
          setTempText={setTempText}
          onSave={handleSaveBubble}
          onCancel={handleCancelBubble}
        />
      )}
    </div>
  );
};

// Ghost and Speech Bubble Component
interface GhostWithBubbleProps {
  side: 'island' | 'search';
  speechText: string;
  isEditing: boolean;
  onEdit: () => void;
  onDismiss: () => void;
  tempText: string;
  setTempText: (text: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const GhostWithBubble: React.FC<GhostWithBubbleProps> = ({
  side,
  speechText,
  isEditing,
  onEdit,
  onDismiss,
  tempText,
  setTempText,
  onSave,
  onCancel
}) => {
  return (
    <div className={`ghost-with-bubble ${side}`}>
      {/* Speech bubble */}
      <div className="speech-bubble">
        <Image
          src="/svg/speech-bubble.svg"
          alt="Speech bubble"
          width={138}
          height={64}
          className="bubble-image"
        />
        {isEditing ? (
          <textarea
            value={tempText}
            onChange={(e) => setTempText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSave();
              }
              if (e.key === 'Escape') {
                onCancel();
              }
            }}
            className="bubble-text-input"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <p className="bubble-text">{speechText}</p>
        )}
      </div>
      
      {/* Ghost */}
      <div className="ghost">
        <Image
          src="/svg/ghost.svg"
          alt="Ghost guide"
          width={36}
          height={45}
          className="ghost-image"
        />
      </div>
    </div>
  );
};

// Navigation Arrow Component
interface NavigationArrowProps {
  direction: 'left' | 'right';
  onClick: () => void;
}

const NavigationArrow: React.FC<NavigationArrowProps> = ({ direction, onClick }) => {
  return (
    <button className={`nav-arrow ${direction}`} onClick={onClick}>
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d={direction === 'left' ? "M15 18L9 12L15 6" : "M9 6L15 12L9 18"} 
          stroke="#000000" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};