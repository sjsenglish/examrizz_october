import React from 'react';

interface LearnIconProps {
  className?: string;
  size?: number;
}

export const LearnIcon: React.FC<LearnIconProps> = ({ className = '', size = 120 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`learn-icon ${className}`}
    >
      {/* Ghost body */}
      <path 
        d="M35 45C35 25 50 10 70 10C90 10 105 25 105 45V85C105 90 100 95 95 95C90 95 85 90 85 95C85 90 80 95 75 95C75 90 70 95 65 95C65 90 60 95 55 95C55 90 50 95 45 95C40 95 35 90 35 85V45Z" 
        fill="white" 
        stroke="#000" 
        strokeWidth="2"
      />
      
      {/* Ghost eyes */}
      <circle cx="60" cy="40" r="4" fill="#000"/>
      <circle cx="80" cy="40" r="4" fill="#000"/>
      
      {/* Ghost mouth */}
      <ellipse cx="70" cy="55" rx="3" ry="5" fill="#000"/>
      
      {/* Book in ghost's hands */}
      <rect x="50" y="65" width="20" height="15" rx="2" fill="#00CED1" stroke="#000" strokeWidth="2"/>
      <rect x="52" y="67" width="16" height="11" rx="1" fill="white"/>
      
      {/* Book pages/lines */}
      <line x1="54" y1="70" x2="66" y2="70" stroke="#000" strokeWidth="1"/>
      <line x1="54" y1="73" x2="63" y2="73" stroke="#000" strokeWidth="1"/>
      <line x1="54" y1="76" x2="65" y2="76" stroke="#000" strokeWidth="1"/>
      
      {/* Book binding */}
      <line x1="60" y1="65" x2="60" y2="80" stroke="#000" strokeWidth="1"/>
      
      {/* Ghost's arms/hands holding book */}
      <ellipse cx="45" cy="70" rx="8" ry="4" fill="white" stroke="#000" strokeWidth="2"/>
      <ellipse cx="95" cy="70" rx="8" ry="4" fill="white" stroke="#000" strokeWidth="2"/>
      
      {/* Small sparkles around ghost (learning magic) */}
      <g opacity="0.7">
        <path d="M25 30L27 32L25 34L23 32Z" fill="#FFD700"/>
        <path d="M100 25L102 27L100 29L98 27Z" fill="#FFD700"/>
        <path d="M110 50L112 52L110 54L108 52Z" fill="#FFD700"/>
        <path d="M20 60L22 62L20 64L18 62Z" fill="#FFD700"/>
      </g>
    </svg>
  );
};