import React from 'react';

interface VideoIconProps {
  className?: string;
  size?: number;
}

export const VideoIcon: React.FC<VideoIconProps> = ({ className = '', size = 120 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`video-icon ${className}`}
    >
      {/* Retro TV main body */}
      <rect x="15" y="40" width="75" height="55" rx="8" fill="#00CED1" stroke="#000" strokeWidth="2"/>
      
      {/* TV Screen */}
      <rect x="22" y="47" width="50" height="35" rx="4" fill="#333" stroke="#000" strokeWidth="1"/>
      <rect x="25" y="50" width="44" height="29" rx="2" fill="#fff"/>
      
      {/* Screen content - lines to simulate video */}
      <rect x="27" y="55" width="40" height="2" fill="#ddd"/>
      <rect x="27" y="60" width="35" height="2" fill="#ddd"/>
      <rect x="27" y="65" width="38" height="2" fill="#ddd"/>
      <rect x="27" y="70" width="32" height="2" fill="#ddd"/>
      
      {/* TV controls on the right */}
      <circle cx="80" cy="55" r="3" fill="#fff" stroke="#000" strokeWidth="1"/>
      <circle cx="80" cy="65" r="3" fill="#fff" stroke="#000" strokeWidth="1"/>
      <circle cx="80" cy="75" r="3" fill="#fff" stroke="#000" strokeWidth="1"/>
      
      {/* TV brand name */}
      <rect x="25" y="85" width="15" height="3" rx="1" fill="#fff"/>
      
      {/* TV antennas */}
      <line x1="20" y1="40" x2="10" y2="20" stroke="#000" strokeWidth="2"/>
      <line x1="85" y1="40" x2="95" y2="20" stroke="#000" strokeWidth="2"/>
      <circle cx="10" cy="20" r="2" fill="#000"/>
      <circle cx="95" cy="20" r="2" fill="#000"/>
      
      {/* TV stand/legs */}
      <rect x="25" y="95" width="8" height="12" fill="#00CED1" stroke="#000" strokeWidth="2"/>
      <rect x="72" y="95" width="8" height="12" fill="#00CED1" stroke="#000" strokeWidth="2"/>
      
      {/* Small device on ground (remote) */}
      <rect x="95" y="100" width="12" height="8" rx="2" fill="#333" stroke="#000" strokeWidth="1"/>
      <circle cx="99" cy="104" r="1" fill="#fff"/>
      <circle cx="103" cy="104" r="1" fill="#fff"/>
    </svg>
  );
};