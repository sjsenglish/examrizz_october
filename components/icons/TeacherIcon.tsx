import React from 'react';

interface TeacherIconProps {
  className?: string;
  size?: number;
}

export const TeacherIcon: React.FC<TeacherIconProps> = ({ className = '', size = 120 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`teacher-icon ${className}`}
    >
      {/* Laptop base */}
      <rect x="10" y="65" width="100" height="45" rx="6" fill="#00CED1" stroke="#000" strokeWidth="2"/>
      
      {/* Laptop screen */}
      <rect x="15" y="20" width="90" height="60" rx="4" fill="#333" stroke="#000" strokeWidth="2"/>
      <rect x="20" y="25" width="80" height="50" rx="2" fill="#fff"/>
      
      {/* Screen content */}
      <rect x="25" y="30" width="70" height="40" fill="#f8f8f8"/>
      <rect x="30" y="35" width="25" height="15" fill="#00CED1" opacity="0.7"/>
      <line x1="30" y1="55" x2="85" y2="55" stroke="#ccc" strokeWidth="1"/>
      <line x1="30" y1="60" x2="75" y2="60" stroke="#ccc" strokeWidth="1"/>
      <line x1="30" y1="65" x2="80" y2="65" stroke="#ccc" strokeWidth="1"/>
      
      {/* Keyboard area */}
      <rect x="20" y="70" width="80" height="30" rx="3" fill="#f0f0f0" stroke="#000" strokeWidth="1"/>
      
      {/* Keyboard keys (simplified) */}
      <g fill="#e0e0e0" stroke="#ccc" strokeWidth="0.5">
        <rect x="25" y="75" width="6" height="4" rx="1"/>
        <rect x="33" y="75" width="6" height="4" rx="1"/>
        <rect x="41" y="75" width="6" height="4" rx="1"/>
        <rect x="49" y="75" width="6" height="4" rx="1"/>
        <rect x="57" y="75" width="6" height="4" rx="1"/>
        <rect x="65" y="75" width="6" height="4" rx="1"/>
        <rect x="73" y="75" width="6" height="4" rx="1"/>
        <rect x="81" y="75" width="6" height="4" rx="1"/>
        <rect x="89" y="75" width="6" height="4" rx="1"/>
        
        <rect x="27" y="82" width="6" height="4" rx="1"/>
        <rect x="35" y="82" width="6" height="4" rx="1"/>
        <rect x="43" y="82" width="6" height="4" rx="1"/>
        <rect x="51" y="82" width="6" height="4" rx="1"/>
        <rect x="59" y="82" width="6" height="4" rx="1"/>
        <rect x="67" y="82" width="6" height="4" rx="1"/>
        <rect x="75" y="82" width="6" height="4" rx="1"/>
        <rect x="83" y="82" width="6" height="4" rx="1"/>
        
        <rect x="35" y="89" width="30" height="4" rx="1"/>
        <rect x="70" y="89" width="15" height="4" rx="1"/>
      </g>
      
      {/* Trackpad */}
      <rect x="50" y="95" width="15" height="8" rx="2" fill="#ddd" stroke="#ccc" strokeWidth="1"/>
      
      {/* Screen hinge */}
      <circle cx="25" cy="65" r="2" fill="#666"/>
      <circle cx="95" cy="65" r="2" fill="#666"/>
      
      {/* Power indicator */}
      <circle cx="95" cy="75" r="1.5" fill="#00ff00" opacity="0.8"/>
      
      {/* Small briefcase handle */}
      <rect x="50" y="110" width="20" height="3" rx="1" fill="#666" stroke="#000" strokeWidth="1"/>
    </svg>
  );
};