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

    return (
      <div 
        className={`absolute ${position === 'left' ? 'left-[35%]' : 'right-[35%]'} bottom-[15%] pointer-events-auto z-40`}
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
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-sky-100 to-cyan-50">
      <div
        ref={containerRef}
        className={`absolute inset-0 transition-all duration-700 ease-in-out ${
          isTransitioning ? 'scale-110 opacity-90' : ''
        }`}
        style={{
          transform: viewState === 'overview' 
            ? 'scale(0.5) translateX(0)' 
            : viewState === 'island'
            ? 'scale(1) translateX(50%)'
            : 'scale(1) translateX(-50%)',
        }}
      >
        {/* Container for both views side by side */}
        <div className="flex h-full w-[200vw]">
          {/* Left Island View */}
          <div 
            className={`relative min-w-[100vw] h-full ${
              viewState === 'overview' ? 'cursor-pointer' : ''
            }`}
            onClick={() => viewState === 'overview' && navigateToView('island')}
          >
            <LandingHub />
            {/* Ghost on island when in island view or overview */}
            {(viewState === 'island' || viewState === 'overview') && renderGhost('island', 'left')}
          </div>

          {/* Right Search View */}
          <div 
            className={`relative min-w-[100vw] h-full ${
              viewState === 'overview' ? 'cursor-pointer' : ''
            }`}
            onClick={() => viewState === 'overview' && navigateToView('search')}
          >
            <ExamSearch />
            {/* Ghost on search when in search view or overview */}
            {(viewState === 'search' || viewState === 'overview') && renderGhost('search', 'right')}
          </div>
        </div>

        {/* Platform connections visible in overview */}
        {viewState === 'overview' && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-4">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="animate-float"
                  style={{ 
                    animationDelay: `${index * 0.2}s`,
                    transform: `translateY(${index % 2 === 0 ? -10 : 10}px)`
                  }}
                >
                  <Image
                    src="/svg/platform.svg"
                    alt="Platform"
                    width={100}
                    height={70}
                    className="drop-shadow-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};