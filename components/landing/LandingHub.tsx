'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { IslandCard } from '@/components/ui/IslandCard';
import { SteppingStones } from '@/components/ui/SteppingStones';
import { CloudIcon } from '@/components/icons';
import { navigationConfig } from '@/lib/navigation-config';

interface LandingHubProps {
  className?: string;
}

export const LandingHub: React.FC<LandingHubProps> = ({ className = '' }) => {
  const { islands, steppingStones, clouds } = navigationConfig;

  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary-50/30 to-background"></div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0">
        {/* Ground/platform illustration */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary-100/40 to-transparent"></div>
        
        {/* Curved path illustration */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M 0,80 Q 25,70 50,75 T 100,70"
            stroke="#00CED1"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            opacity={0.3}
            initial={{ pathLength: 0 }}
            animate={{ 
              pathLength: 1,
              transition: { 
                delay: 0.5, 
                duration: 2, 
                ease: 'easeInOut' 
              }
            }}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* Clouds */}
      <div className="absolute inset-0">
        {clouds.map((cloud, index) => {
          const positionStyle = {
            position: 'absolute' as const,
            left: `${cloud.position.desktop.x}%`,
            top: `${cloud.position.desktop.y}%`,
            transform: 'translate(-50%, -50%)'
          };

          return (
            <motion.div
              key={cloud.id}
              style={positionStyle}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: cloud.opacity,
                scale: 1,
                transition: {
                  delay: 0.3 + (index * 0.1),
                  duration: 0.8,
                  ease: 'easeOut'
                }
              }}
              className="pointer-events-none"
            >
              <motion.div
                animate={{
                  x: [0, 20, 0],
                  y: [0, -10, 0],
                  transition: {
                    duration: 6 + index,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }
                }}
              >
                <CloudIcon 
                  size={cloud.size} 
                  opacity={cloud.opacity}
                  className="drop-shadow-sm"
                />
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Main content container */}
      <div className="relative z-10 w-full h-screen">
        {/* Islands */}
        {islands.map((island, index) => (
          <IslandCard
            key={island.id}
            island={island}
            index={index}
            className="transition-transform duration-300"
          />
        ))}

        {/* Stepping stones to search */}
        <SteppingStones 
          stones={steppingStones}
          className="absolute inset-0"
        />

        {/* Welcome message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            transition: { delay: 1.5, duration: 0.8 }
          }}
          className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center z-20"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Welcome to{' '}
            <span className="text-primary-600">examrizz</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Your gamified learning adventure starts here. Choose your path and begin exploring!
          </p>
        </motion.div>

        {/* Navigation hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            transition: { delay: 2.5, duration: 1 }
          }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
        >
          <motion.div
            animate={{
              y: [0, -5, 0],
              transition: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }
            }}
            className="flex flex-col items-center space-y-2"
          >
            <p className="text-sm text-gray-500">Click any island to start your journey</p>
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 20 20" 
              fill="currentColor"
              className="text-gray-400"
            >
              <path 
                fillRule="evenodd" 
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                clipRule="evenodd" 
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Responsive breakpoints adjustments */}
      <style jsx>{`
        @media (max-width: 768px) {
          .landing-hub {
            padding: 1rem;
          }
        }
        
        @media (max-width: 640px) {
          .landing-hub h1 {
            font-size: 2.5rem;
          }
          
          .landing-hub p {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};