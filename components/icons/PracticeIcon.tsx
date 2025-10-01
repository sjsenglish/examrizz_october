import React from 'react';

interface PracticeIconProps {
  className?: string;
  size?: number;
}

export const PracticeIcon: React.FC<PracticeIconProps> = ({ className = '', size = 120 }) => {
  return (
    <svg 
      width={size} 
      height={size * 1.16} 
      viewBox="0 0 215 249" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`practice-icon ${className}`}
    >
      <path d="M65.709 29.352V26.632H62.893V21.128H60.077V8.584H64.141V19.496H66.957V25H68.557V19.496H71.373V8.584H75.469V21.128H72.621V26.632H69.805V29.352H65.709ZM79.3582 29.352V25H82.1742V12.968H79.3582V8.584H89.0862V12.968H86.2382V25H89.0862V29.352H79.3582ZM92.9832 29.352V8.584H102.711V11.336H105.527V14.056H108.375V23.88H105.527V26.632H102.711V29.352H92.9832ZM97.0472 25H101.463V22.248H104.279V15.688H101.463V12.968H97.0472V25ZM115.08 29.352V26.632H112.264V11.336H115.08V8.584H124.808V11.336H127.656V15.688H123.56V12.968H116.328V16.808H121.992V21.128H116.328V25H123.56V22.248H127.656V26.632H124.808V29.352H115.08ZM134.362 29.352V26.632H131.546V11.336H134.362V8.584H144.09V11.336H146.938V26.632H144.09V29.352H134.362ZM135.61 25H142.842V12.968H135.61V25Z" fill="#1E1E2F"/>
      
      <mask id="mask0_80_15" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="0" y="44" width="188" height="164">
        <path d="M0 44H188V207.497H0V44Z" fill="white"/>
      </mask>
      <g mask="url(#mask0_80_15)">
        <path d="M181.528 77.8065C181.334 77.7581 181.092 77.7097 180.898 77.6129L181.043 65.1654V64.9718L34.7208 44H34.6724L0.0891113 57.0768V172.159L25.6619 178.02L151.741 207.615L179.398 187.854L179.494 187.805L179.688 171.481L181.286 170.077L187.777 164.411V79.5514C187.777 79.5514 184.725 78.6779 181.528 77.8065Z" fill="#00CED1"/>
      </g>
      
      {/* Coffee cup illustration */}
      <circle cx="83.5" cy="107.5" r="43.5" fill="#00CED1"/>
      <path d="M83.5 64C104.21 64 121 80.79 121 101.5C121 122.21 104.21 139 83.5 139C62.79 139 46 122.21 46 101.5C46 80.79 62.79 64 83.5 64Z" fill="white" stroke="black" strokeWidth="2"/>
      
      {/* Coffee cup handle */}
      <path d="M121 90C130 90 137 97 137 106C137 115 130 122 121 122" stroke="black" strokeWidth="3" fill="none"/>
      
      {/* Coffee surface */}
      <ellipse cx="83.5" cy="85" rx="25" ry="8" fill="#8B4513"/>
      
      {/* Steam lines */}
      <path d="M70 75C70 70 72 68 74 70C76 72 74 74 76 76" stroke="#gray" strokeWidth="2" fill="none" opacity="0.7"/>
      <path d="M83 73C83 68 85 66 87 68C89 70 87 72 89 74" stroke="#gray" strokeWidth="2" fill="none" opacity="0.7"/>
      <path d="M96 75C96 70 98 68 100 70C102 72 100 74 102 76" stroke="#gray" strokeWidth="2" fill="none" opacity="0.7"/>
    </svg>
  );
};