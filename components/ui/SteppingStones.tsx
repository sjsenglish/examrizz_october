'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SteppingStone } from '@/types/navigation';

interface SteppingStonesProps {
  stones: SteppingStone[];
  className?: string;
}

export const SteppingStones: React.FC<SteppingStonesProps> = ({ 
  stones, 
  className = '' 
}) => {
  // Animation variants for stones
  const stoneVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.5,
      y: 20
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: 0.8,
        duration: 0.4,
        ease: 'easeOut' as any
      }
    },
    hover: {
      scale: 1.1,
      y: -5,
      transition: {
        duration: 0.2,
        ease: 'easeOut' as any
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1
      }
    }
  };

  // Ripple effect variants
  const rippleVariants = {
    initial: { scale: 1, opacity: 0.6 },
    animate: {
      scale: [1, 1.5, 2],
      opacity: [0.6, 0.3, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeOut' as any
      }
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search label */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ 
          opacity: 1, 
          x: 0,
          transition: { delay: 1.2, duration: 0.5 }
        }}
        className="absolute top-0 right-0 transform translate-x-full -translate-y-1/2"
      >
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{
              x: [0, 10, 0],
              transition: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }
            }}
            className="text-primary-600 font-bold text-lg tracking-wide"
          >
            SEARCH →
          </motion.div>
        </div>
      </motion.div>

      {/* Stepping stones path */}
      {stones.map((stone, index) => {
        const positionStyle = {
          position: 'absolute' as const,
          left: `${stone.position.desktop.x}%`,
          top: `${stone.position.desktop.y}%`,
          transform: 'translate(-50%, -50%)'
        };

        return (
          <motion.div
            key={stone.id}
            style={positionStyle}
            variants={stoneVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
            transition={{
              delay: 0.8 + (index * 0.1),
              duration: 0.4,
              ease: 'easeOut' as any
            }}
            className="relative z-10"
          >
            <Link href="/search" className="block">
              <div className="relative group cursor-pointer">
                {/* Ripple effect */}
                <motion.div
                  variants={rippleVariants}
                  initial="initial"
                  animate="animate"
                  className="absolute inset-0 bg-primary-300 rounded-full opacity-60"
                  style={{ 
                    width: `${stone.size}px`, 
                    height: `${stone.size}px` 
                  }}
                />
                
                {/* Main stone */}
                <div
                  className="
                    relative bg-primary-500 rounded-full
                    border-3 border-primary-600
                    shadow-lg group-hover:shadow-xl
                    transition-all duration-300
                    group-hover:bg-primary-400
                  "
                  style={{ 
                    width: `${stone.size}px`, 
                    height: `${stone.size}px` 
                  }}
                >
                  {/* Stone texture */}
                  <div className="absolute inset-1 bg-primary-400 rounded-full opacity-50"></div>
                  <div className="absolute inset-2 bg-primary-300 rounded-full opacity-30"></div>
                  
                  {/* Search icon */}
                  <div className="
                    absolute inset-0 flex items-center justify-center
                    text-white text-opacity-80 group-hover:text-opacity-100
                    transition-all duration-300
                  ">
                    <svg 
                      width={stone.size * 0.4} 
                      height={stone.size * 0.4} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </div>
                </div>

                {/* Stone shadow */}
                <div 
                  className="
                    absolute top-full left-1/2 transform -translate-x-1/2 mt-1
                    bg-gray-400 rounded-full opacity-20 blur-sm
                    group-hover:opacity-30 transition-opacity duration-300
                  "
                  style={{ 
                    width: `${stone.size * 0.8}px`, 
                    height: '6px' 
                  }}
                ></div>

                {/* Hover tooltip */}
                <div className="
                  absolute -top-10 left-1/2 transform -translate-x-1/2
                  bg-gray-800 text-white text-xs rounded-lg px-3 py-2
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-300
                  pointer-events-none
                  whitespace-nowrap
                  z-30
                ">
                  Search Questions
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}

      {/* Connecting path line */}
      <svg 
        className="absolute inset-0 pointer-events-none" 
        style={{ width: '100%', height: '100%' }}
      >
        <motion.path
          d={`M ${stones[0]?.position.desktop.x}% ${stones[0]?.position.desktop.y}% ${stones.map(stone => `L ${stone.position.desktop.x}% ${stone.position.desktop.y}%`).join(' ')}`}
          stroke="#00CED1"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="10,5"
          initial={{ pathLength: 0 }}
          animate={{ 
            pathLength: 1,
            transition: { 
              delay: 1.0, 
              duration: 1.5, 
              ease: 'easeInOut' 
            }
          }}
          opacity={0.6}
        />
      </svg>
    </div>
  );
};