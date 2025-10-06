'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { IslandSection } from '@/types/navigation';

interface IslandCardProps {
  island: IslandSection;
  index: number;
  className?: string;
}

export const IslandCard: React.FC<IslandCardProps> = ({ 
  island, 
  index, 
  className = '' 
}) => {
  const { title, description, route, icon, position, size, isMainHub } = island;

  // Animation variants
  const cardVariants = {
    initial: { 
      opacity: 0, 
      y: 50,
      scale: 0.8
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        delay: index * 0.1,
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99] as any
      }
    },
    hover: {
      scale: isMainHub ? 1.08 : 1.05,
      y: -8,
      transition: {
        duration: 0.3,
        ease: 'easeOut' as any
      }
    },
    tap: {
      scale: 0.98,
      y: 2,
      transition: {
        duration: 0.1
      }
    }
  };

  // Floating animation for main hub
  const floatingVariants = {
    animate: isMainHub ? {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut' as any
      }
    } : {
      y: 0
    }
  };

  // Size mapping
  const sizeClasses = {
    small: 'w-20 h-20 md:w-24 md:h-24',
    medium: 'w-24 h-24 md:w-28 md:h-28',
    large: 'w-28 h-28 md:w-32 md:h-32'
  };

  const cardSizeClasses = {
    small: 'p-3 md:p-4',
    medium: 'p-4 md:p-5',
    large: 'p-5 md:p-6'
  };

  // Position styles for absolute positioning
  const positionStyle = {
    position: 'absolute' as const,
    left: `${position.desktop.x}%`,
    top: `${position.desktop.y}%`,
    transform: 'translate(-50%, -50%)'
  };

  return (
    <motion.div
      style={positionStyle}
      variants={cardVariants}
      initial="initial"
      animate={['animate', isMainHub ? 'float' : '']}
      whileHover="hover"
      whileTap="tap"
      className={`${className}`}
    >
      <Link href={route} className="block">
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className={`
            relative group cursor-pointer
            ${cardSizeClasses[size]}
            ${isMainHub ? 'z-20' : 'z-10'}
          `}
        >
          {/* Main island card */}
          <div className={`
            relative
            bg-surface rounded-2xl shadow-lg
            border-2 border-gray-100
            transition-all duration-300
            group-hover:shadow-xl
            group-hover:border-primary-200
            ${isMainHub ? 'ring-2 ring-primary-200 ring-opacity-50' : ''}
          `}>
            {/* Icon container */}
            <div className={`
              flex items-center justify-center
              ${sizeClasses[size]}
              mx-auto
            `}>
              <Image 
                src={icon} 
                alt={title} 
                width={120} 
                height={120} 
                className="w-full h-full object-contain"
              />
            </div>

            {/* Title */}
            <div className="mt-2 text-center">
              <h3 className={`
                font-bold text-gray-800 uppercase tracking-wide
                ${size === 'large' ? 'text-sm md:text-base' : 'text-xs md:text-sm'}
                ${isMainHub ? 'text-primary-600' : ''}
              `}>
                {title}
              </h3>
            </div>

            {/* Hover description tooltip */}
            <div className="
              absolute -top-12 left-1/2 transform -translate-x-1/2
              bg-gray-800 text-white text-xs rounded-lg px-3 py-2
              opacity-0 group-hover:opacity-100
              transition-opacity duration-300
              pointer-events-none
              whitespace-nowrap
              z-30
            ">
              {description}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
            </div>

            {/* Main hub indicator */}
            {isMainHub && (
              <motion.div
                className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center"
                animate={{
                  scale: [1, 1.2, 1],
                  transition: {
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut' as any
                  }
                }}
              >
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </motion.div>
            )}

            {/* Sparkle effects for main hub */}
            {isMainHub && (
              <>
                <motion.div
                  className="absolute -top-1 -left-1 w-3 h-3"
                  animate={{
                    rotate: 360,
                    transition: {
                      duration: 4,
                      repeat: Infinity,
                      ease: 'linear' as any
                    }
                  }}
                >
                  <div className="w-full h-full bg-primary-400 rounded-full opacity-60"></div>
                </motion.div>
                <motion.div
                  className="absolute -bottom-1 -right-1 w-2 h-2"
                  animate={{
                    rotate: -360,
                    transition: {
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear' as any
                    }
                  }}
                >
                  <div className="w-full h-full bg-primary-300 rounded-full opacity-80"></div>
                </motion.div>
              </>
            )}
          </div>

          {/* Shadow underneath */}
          <div className={`
            absolute top-full left-1/2 transform -translate-x-1/2 mt-1
            ${sizeClasses[size]}
            bg-gray-400 rounded-full opacity-20 blur-sm
            group-hover:opacity-30 transition-opacity duration-300
          `} style={{ height: '8px' }}></div>
        </motion.div>
      </Link>
    </motion.div>
  );
};