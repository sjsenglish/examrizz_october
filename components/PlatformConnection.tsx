'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface PlatformConnectionProps {
  currentPage: number;
  navigateToPage?: (pageIndex: number) => void;
}

export const PlatformConnection: React.FC<PlatformConnectionProps> = ({ currentPage, navigateToPage }) => {
  const [speechBubbleText, setSpeechBubbleText] = useState(
    "Let's go to search island! Search past paper questions of A Levels and admissions exams."
  );
  const [isEditingBubble, setIsEditingBubble] = useState(false);
  const [tempText, setTempText] = useState(speechBubbleText);

  const handleBubbleClick = () => {
    setIsEditingBubble(true);
    setTempText(speechBubbleText);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTempText(e.target.value);
  };

  const handleSave = () => {
    setSpeechBubbleText(tempText);
    setIsEditingBubble(false);
  };

  const handleCancel = () => {
    setTempText(speechBubbleText);
    setIsEditingBubble(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleGhostClick = () => {
    if (navigateToPage && currentPage === 0) {
      navigateToPage(1); // Navigate to search island (page 1)
    }
  };

  return (
    <div 
      className="absolute inset-0 pointer-events-none z-30"
      style={{
        transform: `translateX(-${currentPage * 100}vw)`
      }}
    >
      {/* Platform stepping stones between pages */}
      <div className="absolute top-0 left-0 w-[200vw] h-full flex items-center">
        <div className="relative w-full h-full">
          {/* Four platforms creating a bridge between the two pages */}
          {[0, 1, 2, 3].map((index) => {
            // Position platforms closer together between the two pages
            const xPosition = 85 + (index * 8); // Reduced spacing - positions from 85vw to 109vw
            const yOffset = index % 2 === 0 ? -40 : 20; // Alternate heights for dynamic look
            const scale = 1.0; // Uniform larger scale
            
            return (
              <div
                key={index}
                className="absolute top-1/2"
                style={{
                  left: `${xPosition}vw`,
                  transform: `translate(-50%, calc(-50% + ${yOffset}px)) scale(${scale})`,
                  zIndex: 10 + index
                }}
              >
                <div 
                  className="animate-float"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <Image
                    src="/svg/platform.svg"
                    alt="Platform"
                    width={200}  // Reduced by 250% (500 / 2.5)
                    height={140}  // Reduced by 250% (350 / 2.5)
                    className="drop-shadow-xl"
                  />
                </div>
              </div>
            );
          })}

          {/* Ghost with speech bubble - positioned on the second platform */}
          <div
            className="absolute pointer-events-auto"
            style={{
              left: '90vw',
              top: '50%',
              transform: 'translate(-50%, -180%)',
              zIndex: 20
            }}
          >
            <div className="relative">
              {/* Speech bubble */}
              <div 
                className="absolute left-1/2 -translate-x-1/2 cursor-pointer group"
                style={{ top: '-120px' }}
                onClick={handleBubbleClick}
              >
                <div className="relative w-[240px] h-[120px]">
                  <Image
                    src="/svg/speech-bubble.svg"
                    alt="Speech bubble"
                    fill
                    className="drop-shadow-md group-hover:scale-105 transition-transform object-contain"
                  />
                  {isEditingBubble ? (
                    <div className="absolute inset-0 flex items-center justify-center px-8 py-6">
                      <textarea
                        value={tempText}
                        onChange={handleTextChange}
                        onKeyDown={handleKeyDown}
                        className="w-full h-full bg-transparent text-[11px] font-normal resize-none outline-none text-center"
                        style={{ 
                          color: '#221468',
                          fontFamily: 'Figtree, sans-serif',
                          letterSpacing: '0.04em',
                          lineHeight: '1.4'
                        }}
                        autoFocus
                      />
                      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
                        <button
                          onClick={handleSave}
                          className="px-3 py-1 bg-cyan-500 text-white text-xs rounded-md hover:bg-cyan-600 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded-md hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-end justify-center px-6 pb-4">
                      <p 
                        className="text-center leading-normal"
                        style={{ 
                          color: '#221468',
                          fontSize: '11px',
                          fontFamily: 'Figtree, sans-serif',
                          letterSpacing: '0.04em',
                          fontWeight: 400,
                          maxWidth: '220px',
                          lineHeight: '1.3'
                        }}
                      >
                        {speechBubbleText}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Ghost */}
              <div 
                className="animate-bounce-slow cursor-pointer hover:scale-110 transition-transform"
                onClick={handleGhostClick}
              >
                <Image
                  src="/svg/ghost.svg"
                  alt="Ghost guide - Click to go to search island"
                  width={100}
                  height={120}
                  className="drop-shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
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