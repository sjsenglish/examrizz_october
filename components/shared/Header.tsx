'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' }
      }}
      className={`
        relative z-50 w-full 
        bg-background/95 backdrop-blur-sm
        border-b border-gray-100
        ${className}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-gray-800 tracking-tight">
                  examrizz
                </span>
                <span className="text-lg font-medium text-primary-600 ml-1">
                  search
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Right side - Logout and Home */}
          <div className="flex items-center space-x-3">
            {/* Home button - only show when not on home page */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/"
                className="
                  p-2 rounded-lg
                  bg-white border border-gray-200
                  hover:bg-gray-50 hover:border-gray-300
                  transition-all duration-200
                  flex items-center justify-center
                "
                aria-label="Go to home"
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                  className="text-gray-600"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </Link>
            </motion.div>

            {/* Logout button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                // TODO: Implement logout logic
                console.log('Logout clicked');
              }}
              className="
                px-4 py-2 rounded-lg
                bg-gray-100 text-gray-700
                hover:bg-gray-200 hover:text-gray-800
                transition-all duration-200
                font-medium text-sm
                border border-gray-200
                flex items-center space-x-2
              "
            >
              <span>Log out</span>
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 20 20" 
                fill="currentColor"
                className="opacity-60"
              >
                <path 
                  fillRule="evenodd" 
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" 
                  clipRule="evenodd" 
                />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-50/20 to-transparent pointer-events-none"></div>
    </motion.header>
  );
};