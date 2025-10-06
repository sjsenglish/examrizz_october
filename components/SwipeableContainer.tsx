'use client';

import React, { useState } from 'react';
import { LandingHub } from '@/components/landing/LandingHub';
import ExamSearch from '@/components/ExamSearch';
import { SettingsButton } from '@/components/SettingsButton';
import Image from 'next/image';
import Link from 'next/link';
import './SwipeableContainer.css';

export const SwipeableContainer: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'island' | 'search'>('island');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Speech bubble states
  const [islandSpeechText, setIslandSpeechText] = useState(
    "Let's go to search island!\nSearch past paper questions\nof A Levels and admissions exams."
  );
  const [searchSpeechText, setSearchSpeechText] = useState(
    "Let's go back to the main island!\nExplore learning resources\nand practice questions."
  );
  const [editingBubble, setEditingBubble] = useState<'island' | 'search' | null>(null);
  const [tempText, setTempText] = useState('');
  const [showGhost, setShowGhost] = useState(true);

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

  const renderGhostWithArrow = (side: 'island' | 'search') => {
    const isEditing = editingBubble === side;
    const speechText = side === 'island' ? islandSpeechText : searchSpeechText;

    if (!showGhost) return null;

    return (
      <div className="absolute top-1/2 -translate-y-1/2 right-12 flex items-center gap-4 pointer-events-auto z-40">
        {/* Ghost with speech bubble */}
        <div className="relative">
          {/* Speech bubble */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 cursor-pointer group"
            style={{ top: '110px', transform: 'translateX(0%) translateY(0%)' }}
            onClick={handleDismissGhost}
          >
            <div className="relative w-[220px] h-[101px]">
              <Image
                src="/svg/speech-bubble.svg"
                alt="Speech bubble"
                fill
                className="drop-shadow-md group-hover:scale-105 transition-transform object-contain"
              />
              {isEditing ? (
                <div 
                  className="absolute flex items-center justify-center"
                  style={{
                    left: side === 'island' ? '20px' : '30px',
                    top: '28px',
                    width: '160px',
                    height: '45px'
                  }}
                >
                  <textarea
                    value={tempText}
                    onChange={(e) => setTempText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSaveBubble();
                      }
                      if (e.key === 'Escape') {
                        handleCancelBubble();
                      }
                    }}
                    className="w-full h-full bg-transparent font-normal resize-none outline-none text-left"
                    style={{ 
                      color: '#221468',
                      fontSize: '7.5pt',
                      fontFamily: 'Figtree, sans-serif',
                      letterSpacing: '0.04em',
                      lineHeight: '1.4',
                      padding: '0 6px'
                    }}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              ) : (
                <div 
                  className="absolute flex items-center justify-center"
                  style={{
                    left: side === 'island' ? '20px' : '30px',
                    top: '28px',
                    width: '160px',
                    height: '45px'
                  }}
                >
                  <p 
                    className="text-left"
                    style={{ 
                      color: '#221468',
                      fontSize: '7.5pt',
                      fontFamily: 'Figtree, sans-serif',
                      letterSpacing: '0.04em',
                      fontWeight: 400,
                      lineHeight: '1.4',
                      width: '100%',
                      padding: '0 6px',
                      whiteSpace: 'pre-line'
                    }}
                  >
                    {speechText}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Ghost */}
          <div className="animate-bounce-slow cursor-pointer" onClick={handleDismissGhost}>
            <Image
              src="/svg/ghost.svg"
              alt="Ghost guide"
              width={72}
              height={90}
              className="drop-shadow-lg hover:scale-110 transition-transform"
            />
          </div>
        </div>

        {/* Navigation Arrow */}
        {side === 'island' ? (
          <button
            onClick={() => navigateToPage('search')}
            className="p-1 hover:scale-110 transition-all"
            aria-label="Go to search page"
          >
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ) : (
          <button
            onClick={() => navigateToPage('island')}
            className="p-1 hover:scale-110 transition-all"
            aria-label="Go back to island"
          >
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className={`relative w-full bg-white overflow-x-hidden ${currentPage === 'search' ? 'min-h-screen' : 'h-screen overflow-hidden'}`}>
      {/* Settings Button - show only on island page */}
      {currentPage === 'island' && <SettingsButton />}
      
      {/* Header */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        padding: '20px 40px',
        backgroundColor: currentPage === 'island' ? 'transparent' : '#FFFFFF',
        zIndex: 60
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <h1 style={{
            fontFamily: "'Madimi One', cursive",
            fontSize: '32px',
            fontWeight: '400',
            color: '#000000',
            margin: '0',
            cursor: 'pointer'
          }}>
            examrizzsearch
          </h1>
        </Link>
      </div>

      <div
        className={`${currentPage === 'search' ? 'relative' : 'absolute'} transition-transform duration-500 ease-in-out ${
          isTransitioning ? 'scale-105 opacity-95' : ''
        }`}
        style={{
          transform: `translateX(-${currentPage === 'search' ? 100 : 0}%)`,
          ...(currentPage === 'island' ? {
            top: '72px',
            left: '0',
            right: '0',
            bottom: '0'
          } : {
            marginTop: '72px',
            width: '200%'
          })
        }}
      >
        <div className={`flex ${currentPage === 'island' ? 'h-full' : 'min-h-screen'}`} style={{ width: '200%' }}>
          {/* Island Page */}
          <div className="relative w-1/2 h-full overflow-hidden">
            <div className="absolute inset-0 transform scale-[0.79] origin-center">
              <LandingHub />
            </div>
            {currentPage === 'island' && renderGhostWithArrow('island')}
          </div>
          
          {/* Search Page */}
          <div className={`relative w-1/2 ${currentPage === 'island' ? 'h-full' : 'min-h-screen'}`} style={{ backgroundColor: '#FFFFFF' }}>
            <div className="absolute inset-0" style={{ backgroundColor: '#FFFFFF', width: '100%', height: '100%' }}></div>
            <div className="relative z-10">
              <ExamSearch />
            </div>
            {/* Navigation Arrow - always visible on search page */}
            {currentPage === 'search' && (
              <div className="fixed top-1/2 -translate-y-1/2 left-12 pointer-events-auto z-40">
                <button
                  onClick={() => navigateToPage('island')}
                  className="p-1 hover:scale-110 transition-all"
                  aria-label="Go back to island"
                >
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            )}
            
            {/* Ghost with speech bubble - separate from navigation */}
            {currentPage === 'search' && showGhost && (
              <div className="fixed top-1/2 -translate-y-1/2 left-28 pointer-events-auto z-40">
                <div className="relative">
                  {/* Speech bubble */}
                  <div 
                    className="absolute left-1/2 -translate-x-1/2 cursor-pointer group"
                    style={{ top: '-133px' }}
                    onClick={handleDismissGhost}
                  >
                    <div className="relative w-[220px] h-[101px]">
                      <Image
                        src="/svg/speech-bubble.svg"
                        alt="Speech bubble"
                        fill
                        className="drop-shadow-md group-hover:scale-105 transition-transform object-contain"
                      />
                      {editingBubble === 'search' ? (
                        <div 
                          className="absolute flex items-center justify-center"
                          style={{
                            left: '20px',
                            top: '28px',
                            width: '160px',
                            height: '45px'
                          }}
                        >
                          <textarea
                            value={tempText}
                            onChange={(e) => setTempText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSaveBubble();
                              }
                              if (e.key === 'Escape') {
                                handleCancelBubble();
                              }
                            }}
                            className="w-full h-full bg-transparent font-normal resize-none outline-none text-left"
                            style={{ 
                              color: '#221468',
                              fontSize: '7.5pt',
                              fontFamily: 'Figtree, sans-serif',
                      letterSpacing: '0.04em',
                              lineHeight: '1.4',
                              padding: '0 6px'
                            }}
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      ) : (
                        <div 
                          className="absolute flex items-center justify-center"
                          style={{
                            left: '20px',
                            top: '28px',
                            width: '160px',
                            height: '45px'
                          }}
                        >
                          <p 
                            className="text-left"
                            style={{ 
                              color: '#221468',
                              fontSize: '7.5pt',
                              fontFamily: 'Figtree, sans-serif',
                      letterSpacing: '0.04em',
                              fontWeight: 400,
                              lineHeight: '1.4',
                              width: '100%',
                              padding: '0 6px',
                              whiteSpace: 'pre-line'
                            }}
                          >
                            {searchSpeechText}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Ghost */}
                  <div className="animate-bounce-slow cursor-pointer" onClick={handleDismissGhost}>
                    <Image
                      src="/svg/ghost.svg"
                      alt="Ghost guide"
                      width={72}
                      height={90}
                      className="drop-shadow-lg hover:scale-110 transition-transform"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>


      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};