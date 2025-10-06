'use client';

import React, { useState, useRef, useEffect } from 'react';
import { LandingHub } from '@/components/landing/LandingHub';
import ExamSearch from '@/components/ExamSearch';
import { PlatformConnection } from '@/components/PlatformConnection';
import Image from 'next/image';

type ViewState = 'overview' | 'island' | 'search';

export const SwipeableContainer: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>('overview');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const navigateToView = (view: ViewState) => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setViewState(view);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 800);
    }
  };

  // Ghost speech bubble states
  const [islandSpeechText, setIslandSpeechText] = useState(
    "Let's go to search island! Search past paper questions of A Levels and admissions exams."
  );
  const [searchSpeechText, setSearchSpeechText] = useState(
    "Let's go back to the main island! Explore learning resources and practice questions."
  );
  const [editingBubble, setEditingBubble] = useState<'island' | 'search' | null>(null);
  const [tempText, setTempText] = useState('');

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

  // Keyboard navigation for going back
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isTransitioning && viewState !== 'overview') {
        if (e.key === 'Escape' || e.key === 'Backspace') {
          navigateToView('overview');
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [viewState, isTransitioning]);

  const renderGhost = (side: 'island' | 'search', position: 'left' | 'right') => {
    const isEditing = editingBubble === side;
    const speechText = side === 'island' ? islandSpeechText : searchSpeechText;
    const targetView = side === 'island' ? 'search' : 'island';
    
    // Adjust ghost position based on view state
    const getGhostPosition = () => {
      if (viewState === 'overview') {
        return position === 'left' ? 'right-[10%]' : 'left-[10%]';
      }
      return 'right-[20%]';
    };

    return (
      <div 
        className={`absolute ${getGhostPosition()} bottom-[15%] pointer-events-auto z-40`}
      >
        <div className="relative">
          {/* Speech bubble */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 cursor-pointer group"
            style={{ top: '-100px' }}
            onClick={() => handleBubbleEdit(side)}
          >
            <div className="relative w-[200px] h-[100px]">
              <Image
                src="/svg/speech-bubble.svg"
                alt="Speech bubble"
                fill
                className="drop-shadow-md group-hover:scale-105 transition-transform object-contain"
              />
              {isEditing ? (
                <div className="absolute inset-0 flex items-center justify-center px-6 py-4">
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
                    className="w-full h-full bg-transparent text-[10px] font-normal resize-none outline-none text-center"
                    style={{ 
                      color: '#221468',
                      fontFamily: 'Figtree, sans-serif',
                      letterSpacing: '0.04em',
                      lineHeight: '1.3'
                    }}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveBubble();
                      }}
                      className="px-2 py-1 bg-cyan-500 text-white text-[10px] rounded hover:bg-cyan-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelBubble();
                      }}
                      className="px-2 py-1 bg-gray-300 text-gray-700 text-[10px] rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-end justify-center px-4 pb-3">
                  <p 
                    className="text-center leading-tight"
                    style={{ 
                      color: '#221468',
                      fontSize: '10px',
                      fontFamily: 'Figtree, sans-serif',
                      letterSpacing: '0.04em',
                      fontWeight: 400,
                      maxWidth: '180px'
                    }}
                  >
                    {speechText}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Ghost */}
          <div 
            className="animate-bounce-slow cursor-pointer hover:scale-110 transition-transform"
            onClick={() => {
              if (viewState === 'overview') {
                navigateToView(targetView);
              } else if (viewState === 'island') {
                navigateToView('search');
              } else if (viewState === 'search') {
                navigateToView('island');
              }
            }}
          >
            <Image
              src="/svg/ghost.svg"
              alt={`Ghost guide - Click to go to ${targetView === 'island' ? 'main island' : 'search island'}`}
              width={80}
              height={100}
              className="drop-shadow-xl"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white">
      {/* Container that transforms based on view state */}
      <div
        ref={containerRef}
        className={`absolute inset-0 transition-all duration-700 ease-in-out`}
      >
        {/* Overview Mode - Show both pages side by side */}
        {viewState === 'overview' && (
          <div className="flex h-full w-full -ml-[30%]">
            {/* Left Island View - 50% width */}
            <div 
              className="relative w-1/2 h-full cursor-pointer overflow-hidden"
              onClick={() => navigateToView('island')}
            >
              <div className="absolute inset-0 transform scale-[0.78] origin-center">
                <div className="w-[200%] h-[200%] -ml-[50%] -mt-[50%]">
                  <LandingHub />
                </div>
              </div>
            </div>

            {/* Right Search View - 50% width */}
            <div 
              className="relative w-1/2 h-full cursor-pointer overflow-hidden"
              onClick={() => navigateToView('search')}
            >
              <div className="absolute inset-0 transform scale-[0.78] origin-center">
                <div className="w-[200%] h-[200%] -ml-[50%] -mt-[50%]">
                  <ExamSearch />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Island View - Full screen */}
        {viewState === 'island' && (
          <div className={`w-full h-full ${isTransitioning ? 'scale-110 opacity-90' : ''}`}>
            <LandingHub />
            {renderGhost('island', 'left')}
          </div>
        )}
        
        {/* Search View - Full screen */}
        {viewState === 'search' && (
          <div className={`w-full h-full ${isTransitioning ? 'scale-110 opacity-90' : ''}`}>
            <ExamSearch />
            {renderGhost('search', 'right')}
          </div>
        )}
      </div>
      
      {/* Platform connections and ghosts visible in overview */}
      {viewState === 'overview' && (
        <div className="absolute inset-0 pointer-events-auto z-30">
          <div className="absolute top-1/2 left-[35%] -translate-x-1/2 -translate-y-1/2 flex items-center">
            {/* Ghost on left side of platforms */}
            <div className="relative mr-4">
              <div className="relative">
                {/* Speech bubble */}
                <div 
                  className="absolute left-1/2 -translate-x-1/2 cursor-pointer group"
                  style={{ top: '-80px' }}
                  onClick={() => handleBubbleEdit('island')}
                >
                  <div className="relative w-[180px] h-[90px]">
                    <Image
                      src="/svg/speech-bubble.svg"
                      alt="Speech bubble"
                      fill
                      className="drop-shadow-md group-hover:scale-105 transition-transform object-contain"
                    />
                    {editingBubble === 'island' ? (
                      <div className="absolute inset-0 flex items-center justify-center px-4 py-3">
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
                          className="w-full h-full bg-transparent text-[9px] font-normal resize-none outline-none text-center"
                          style={{ 
                            color: '#221468',
                            fontFamily: 'Figtree, sans-serif',
                      letterSpacing: '0.04em',
                            lineHeight: '1.2'
                          }}
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveBubble();
                            }}
                            className="px-2 py-0.5 bg-cyan-500 text-white text-[8px] rounded hover:bg-cyan-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelBubble();
                            }}
                            className="px-2 py-0.5 bg-gray-300 text-gray-700 text-[8px] rounded hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-end justify-center px-3 pb-2">
                        <p 
                          className="text-center leading-tight"
                          style={{ 
                            color: '#221468',
                            fontSize: '9px',
                            fontFamily: 'Figtree, sans-serif',
                      letterSpacing: '0.04em',
                            fontWeight: 400,
                            maxWidth: '160px'
                          }}
                        >
                          {islandSpeechText}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Ghost */}
                <div 
                  className="animate-bounce-slow cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => navigateToView('search')}
                >
                  <Image
                    src="/svg/ghost.svg"
                    alt="Ghost guide - Click to go to search island"
                    width={50}
                    height={65}
                    className="drop-shadow-lg"
                  />
                </div>
              </div>
            </div>

            {/* Platforms */}
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="animate-float-gentle mx-1"
                style={{ 
                  animationDelay: `${index * 0.3}s`,
                  transform: `translateY(${index % 2 === 0 ? -3 : 3}px)`
                }}
              >
                <Image
                  src="/svg/platform.svg"
                  alt="Platform"
                  width={45}
                  height={32}
                  className="drop-shadow-md"
                />
              </div>
            ))}

            {/* Ghost on right side of platforms */}
            <div className="relative ml-4">
              <div className="relative">
                {/* Speech bubble */}
                <div 
                  className="absolute left-1/2 -translate-x-1/2 cursor-pointer group"
                  style={{ top: '-80px' }}
                  onClick={() => handleBubbleEdit('search')}
                >
                  <div className="relative w-[180px] h-[90px]">
                    <Image
                      src="/svg/speech-bubble.svg"
                      alt="Speech bubble"
                      fill
                      className="drop-shadow-md group-hover:scale-105 transition-transform object-contain"
                    />
                    {editingBubble === 'search' ? (
                      <div className="absolute inset-0 flex items-center justify-center px-4 py-3">
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
                          className="w-full h-full bg-transparent text-[9px] font-normal resize-none outline-none text-center"
                          style={{ 
                            color: '#221468',
                            fontFamily: 'Figtree, sans-serif',
                      letterSpacing: '0.04em',
                            lineHeight: '1.2'
                          }}
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveBubble();
                            }}
                            className="px-2 py-0.5 bg-cyan-500 text-white text-[8px] rounded hover:bg-cyan-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelBubble();
                            }}
                            className="px-2 py-0.5 bg-gray-300 text-gray-700 text-[8px] rounded hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-end justify-center px-3 pb-2">
                        <p 
                          className="text-center leading-tight"
                          style={{ 
                            color: '#221468',
                            fontSize: '9px',
                            fontFamily: 'Figtree, sans-serif',
                      letterSpacing: '0.04em',
                            fontWeight: 400,
                            maxWidth: '160px'
                          }}
                        >
                          {searchSpeechText}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Ghost */}
                <div 
                  className="animate-bounce-slow cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => navigateToView('island')}
                >
                  <Image
                    src="/svg/ghost.svg"
                    alt="Ghost guide - Click to go to main island"
                    width={50}
                    height={65}
                    className="drop-shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation hint for going back */}
      {viewState !== 'overview' && (
        <div className="absolute top-8 left-8 z-50">
          <button
            onClick={() => navigateToView('overview')}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-md hover:bg-white transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="#221468" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[#221468] font-['Figtree'] text-sm">Back to Overview</span>
          </button>
        </div>
      )}

      {/* View indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-50">
        <button
          onClick={() => navigateToView('overview')}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            viewState === 'overview' 
              ? 'bg-cyan-500 w-8' 
              : 'bg-gray-400 hover:bg-gray-600'
          }`}
          aria-label="Overview"
        />
        <button
          onClick={() => navigateToView('island')}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            viewState === 'island' 
              ? 'bg-cyan-500 w-8' 
              : 'bg-gray-400 hover:bg-gray-600'
          }`}
          aria-label="Island"
        />
        <button
          onClick={() => navigateToView('search')}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            viewState === 'search' 
              ? 'bg-cyan-500 w-8' 
              : 'bg-gray-400 hover:bg-gray-600'
          }`}
          aria-label="Search"
        />
      </div>

      <style jsx>{`
        @keyframes float-gentle {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .animate-float-gentle {
          animation: float-gentle 4s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};