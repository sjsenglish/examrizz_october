import React from 'react';

interface ArenaIconProps {
  className?: string;
  size?: number;
}

export const ArenaIcon: React.FC<ArenaIconProps> = ({ className = '', size = 120 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`arena-icon ${className}`}
    >
      {/* Toaster base */}
      <rect x="20" y="50" width="80" height="50" rx="8" fill="#00CED1" stroke="#000" strokeWidth="2"/>
      
      {/* Toaster top slots */}
      <rect x="30" y="35" width="15" height="20" rx="3" fill="#333" stroke="#000" strokeWidth="1"/>
      <rect x="75" y="35" width="15" height="20" rx="3" fill="#333" stroke="#000" strokeWidth="1"/>
      
      {/* Bread slices popping out */}
      <rect x="28" y="25" width="19" height="15" rx="2" fill="#DEB887" stroke="#000" strokeWidth="1"/>
      <rect x="73" y="25" width="19" height="15" rx="2" fill="#DEB887" stroke="#000" strokeWidth="1"/>
      
      {/* Toaster details */}
      <circle cx="85" cy="70" r="4" fill="#fff" stroke="#000" strokeWidth="1"/>
      <rect x="25" y="65" width="15" height="3" rx="1" fill="#fff"/>
      <rect x="25" y="75" width="20" height="3" rx="1" fill="#fff"/>
      
      {/* Small crumbs */}
      <circle cx="15" cy="95" r="2" fill="#8B4513"/>
      <circle cx="25" cy="105" r="1.5" fill="#8B4513"/>
      <circle cx="95" cy="105" r="2" fill="#8B4513"/>
    </svg>
  );
};