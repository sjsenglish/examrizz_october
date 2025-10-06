import React from 'react';

interface PracticeIconProps {
  className?: string;
  size?: number;
}

export const PracticeIcon: React.FC<PracticeIconProps> = ({ className = '', size = 120 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`practice-icon ${className}`}
    >
      {/* Coffee cup base */}
      <rect x="30" y="45" width="50" height="45" rx="8" fill="#00CED1" stroke="#000" strokeWidth="2"/>
      
      {/* Coffee cup handle */}
      <path d="M80 55C88 55 95 62 95 70C95 78 88 85 80 85" stroke="#000" strokeWidth="3" fill="none"/>
      
      {/* Coffee surface */}
      <ellipse cx="55" cy="50" rx="20" ry="6" fill="#8B4513"/>
      
      {/* Steam lines */}
      <path d="M45 40C45 35 47 33 49 35C51 37 49 39 51 41" stroke="#999" strokeWidth="2" fill="none" opacity="0.7"/>
      <path d="M55 38C55 33 57 31 59 33C61 35 59 37 61 39" stroke="#999" strokeWidth="2" fill="none" opacity="0.7"/>
      <path d="M65 40C65 35 67 33 69 35C71 37 69 39 71 41" stroke="#999" strokeWidth="2" fill="none" opacity="0.7"/>
      
      {/* Saucer */}
      <ellipse cx="55" cy="90" rx="30" ry="8" fill="#00CED1" stroke="#000" strokeWidth="2"/>
    </svg>
  );
};