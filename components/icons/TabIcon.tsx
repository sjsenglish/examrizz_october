import React from 'react';

interface TabIconProps {
  isActive?: boolean;
  width?: number;
  height?: number;
}

export const TabIcon: React.FC<TabIconProps> = ({ 
  isActive = false, 
  width = 320, 
  height = 70 
}) => {
  const fillColor = isActive ? '#00CED1' : '#FFFFFF';
  
  return (
    <svg width={width} height={height} viewBox="0 0 320 70" xmlns="http://www.w3.org/2000/svg">
      <polygon points="3,13 294,13 294,57 3,57" fill={fillColor}/>
      <polygon points="3,13 15,3 306,3 294,13" fill={fillColor}/>
      <polygon points="294,13 306,3 306,45 294,57" fill={fillColor}/>
      <path d="M 3,57 L 3,13 L 15,3 L 306,3 L 306,45 L 294,57 Z" 
            fill="none" stroke="#000000" strokeWidth="2"/>
      <line x1="3" y1="13" x2="294" y2="13" stroke="#000000" strokeWidth="2"/>
      <line x1="294" y1="13" x2="294" y2="57" stroke="#000000" strokeWidth="2"/>
      <line x1="294" y1="13" x2="306" y2="3" stroke="#000000" strokeWidth="2"/>
    </svg>
  );
};