import React from 'react';

interface LearnIconProps {
  className?: string;
  size?: number;
}

export const LearnIcon: React.FC<LearnIconProps> = ({ className = '', size = 120 }) => {
  return (
    <svg 
      width={size} 
      height={size * 1.07} 
      viewBox="0 0 173 186" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`learn-icon ${className}`}
    >
      <path d="M43.0649 29.352V26.632H40.2489V8.584H44.3129V25H51.5449V22.248H55.6409V26.632H52.7929V29.352H43.0649ZM62.3461 29.352V26.632H59.5301V11.336H62.3461V8.584H72.0741V11.336H74.9221V15.688H70.8261V12.968H63.5941V16.808H69.2581V21.128H63.5941V25H70.8261V22.248H74.9221V26.632H72.0741V29.352H62.3461ZM78.8114 29.352V14.056H81.6274V11.336H84.4434V8.584H88.5394V11.336H91.3554V14.056H94.2034V29.352H90.1074V23.88H82.8754V29.352H78.8114ZM82.8754 19.496H90.1074V15.688H87.2914V12.968H85.6914V15.688H82.8754V19.496ZM98.0926 29.352V11.336H100.909V8.584H110.637V11.336H113.485V21.128H110.637V23.88H109.261V25H112.045V29.352H108.013V26.632H105.133V23.88H102.157V29.352H98.0926ZM102.157 19.496H109.389V12.968H102.157V19.496ZM117.374 29.352V8.584H121.438V11.336H124.254V14.056H127.102V22.248H128.67V8.584H132.766V29.352H128.67V26.632H125.854V23.88H123.006V15.688H121.438V29.352H117.374Z" fill="#1E1E2F"/>
      
      {/* Main bulb shape */}
      <circle cx="83.5" cy="107.5" r="45" fill="#00CED1"/>
      <path d="M83.5 62C105.315 62 123 79.685 123 101.5C123 123.315 105.315 141 83.5 141C61.685 141 44 123.315 44 101.5C44 79.685 61.685 62 83.5 62Z" fill="white" stroke="black" strokeWidth="2"/>
      
      {/* Bulb base/screw threads */}
      <rect x="72" y="141" width="23" height="8" fill="#gray" stroke="black"/>
      <rect x="70" y="149" width="27" height="6" fill="#gray" stroke="black"/>
      <rect x="72" y="155" width="23" height="6" fill="#gray" stroke="black"/>
      
      {/* Filament inside bulb */}
      <path d="M75 95C75 95 83.5 90 92 95C92 105 83.5 110 75 105C75 105 75 100 75 95Z" stroke="black" strokeWidth="2" fill="none"/>
      <path d="M77 100C77 100 83.5 98 90 100" stroke="black" strokeWidth="1.5" fill="none"/>
      
      {/* Light rays */}
      <g opacity="0.8">
        <path d="M55 75L50 70" stroke="#FFD700" strokeWidth="3" strokeLinecap="round"/>
        <path d="M112 75L117 70" stroke="#FFD700" strokeWidth="3" strokeLinecap="round"/>
        <path d="M45 101L35 101" stroke="#FFD700" strokeWidth="3" strokeLinecap="round"/>
        <path d="M122 101L132 101" stroke="#FFD700" strokeWidth="3" strokeLinecap="round"/>
        <path d="M55 127L50 132" stroke="#FFD700" strokeWidth="3" strokeLinecap="round"/>
        <path d="M112 127L117 132" stroke="#FFD700" strokeWidth="3" strokeLinecap="round"/>
        <path d="M83.5 55L83.5 45" stroke="#FFD700" strokeWidth="3" strokeLinecap="round"/>
      </g>
      
      {/* Character reading */}
      <g transform="translate(120, 120)">
        <circle cx="15" cy="15" r="8" fill="white" stroke="black" strokeWidth="1.5"/>
        <circle cx="12" cy="13" r="1" fill="black"/>
        <circle cx="18" cy="13" r="1" fill="black"/>
        <path d="M12 18C14 20 16 20 18 18" stroke="black" strokeWidth="1" fill="none"/>
        <rect x="5" y="23" width="20" height="25" rx="2" fill="white" stroke="black" strokeWidth="1.5"/>
        <rect x="10" y="40" width="5" height="8" fill="white" stroke="black" strokeWidth="1.5"/>
        <rect x="15" y="40" width="5" height="8" fill="white" stroke="black" strokeWidth="1.5"/>
        <rect x="8" y="28" width="4" height="8" fill="white" stroke="black" strokeWidth="1.5"/>
        <rect x="18" y="28" width="4" height="8" fill="white" stroke="black" strokeWidth="1.5"/>
        {/* Book */}
        <rect x="2" y="25" width="8" height="6" rx="1" fill="#00CED1" stroke="black" strokeWidth="1"/>
        <line x1="4" y1="27" x2="8" y2="27" stroke="black" strokeWidth="0.5"/>
        <line x1="4" y1="29" x2="8" y2="29" stroke="black" strokeWidth="0.5"/>
      </g>
    </svg>
  );
};