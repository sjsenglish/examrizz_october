import React from 'react';

interface VideoIconProps {
  className?: string;
  size?: number;
}

export const VideoIcon: React.FC<VideoIconProps> = ({ className = '', size = 120 }) => {
  return (
    <svg 
      width={size} 
      height={size * 1.16} 
      viewBox="0 0 215 249" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`video-icon ${className}`}
    >
      <path d="M65.709 29.352V26.632H62.893V21.128H60.077V8.584H64.141V19.496H66.957V25H68.557V19.496H71.373V8.584H75.469V21.128H72.621V26.632H69.805V29.352H65.709ZM79.3582 29.352V25H82.1742V12.968H79.3582V8.584H89.0862V12.968H86.2382V25H89.0862V29.352H79.3582ZM92.9832 29.352V8.584H102.711V11.336H105.527V14.056H108.375V23.88H105.527V26.632H102.711V29.352H92.9832ZM97.0472 25H101.463V22.248H104.279V15.688H101.463V12.968H97.0472V25ZM115.08 29.352V26.632H112.264V11.336H115.08V8.584H124.808V11.336H127.656V15.688H123.56V12.968H116.328V16.808H121.992V21.128H116.328V25H123.56V22.248H127.656V26.632H124.808V29.352H115.08ZM134.362 29.352V26.632H131.546V11.336H134.362V8.584H144.09V11.336H146.938V26.632H144.09V29.352H134.362ZM135.61 25H142.842V12.968H135.61V25Z" fill="#1E1E2F"/>
      
      <mask id="mask0_80_15" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="0" y="44" width="188" height="164">
        <path d="M0 44H188V207.497H0V44Z" fill="white"/>
      </mask>
      <g mask="url(#mask0_80_15)">
        <path d="M181.528 77.8065C181.334 77.7581 181.092 77.7097 180.898 77.6129L181.043 65.1654V64.9718L34.7208 44H34.6724L0.0891113 57.0768V172.159L25.6619 178.02L151.741 207.615L179.398 187.854L179.494 187.805L179.688 171.481L181.286 170.077L187.777 164.411V79.5514C187.777 79.5514 184.725 78.6779 181.528 77.8065Z" fill="#00CED1"/>
      </g>
      
      {/* TV/Monitor main body */}
      <rect x="40" y="70" width="100" height="70" rx="8" fill="#00CED1" stroke="black" strokeWidth="3"/>
      <rect x="45" y="75" width="90" height="55" rx="4" fill="black"/>
      <rect x="48" y="78" width="84" height="49" rx="2" fill="white"/>
      
      {/* TV Screen content - play button */}
      <circle cx="90" cy="102.5" r="12" fill="#00CED1" opacity="0.8"/>
      <polygon points="86,96 86,109 99,102.5" fill="white"/>
      
      {/* TV Stand/legs */}
      <rect x="60" y="140" width="8" height="15" fill="#00CED1" stroke="black" strokeWidth="2"/>
      <rect x="122" y="140" width="8" height="15" fill="#00CED1" stroke="black" strokeWidth="2"/>
      
      {/* TV controls/buttons */}
      <circle cx="150" cy="85" r="3" fill="white" stroke="black"/>
      <circle cx="150" cy="95" r="3" fill="white" stroke="black"/>
      <circle cx="150" cy="105" r="3" fill="white" stroke="black"/>
      
      {/* Antenna */}
      <line x1="45" y1="70" x2="35" y2="50" stroke="black" strokeWidth="2"/>
      <line x1="135" y1="70" x2="145" y2="50" stroke="black" strokeWidth="2"/>
      <circle cx="35" cy="50" r="2" fill="black"/>
      <circle cx="145" cy="50" r="2" fill="black"/>
      
      {/* Character watching */}
      <g transform="translate(160, 120)">
        <circle cx="15" cy="15" r="8" fill="white" stroke="black" strokeWidth="1.5"/>
        <circle cx="12" cy="13" r="1" fill="black"/>
        <circle cx="18" cy="13" r="1" fill="black"/>
        <path d="M12 18C14 20 16 20 18 18" stroke="black" strokeWidth="1" fill="none"/>
        <rect x="5" y="23" width="20" height="25" rx="2" fill="white" stroke="black" strokeWidth="1.5"/>
        <rect x="10" y="40" width="5" height="8" fill="white" stroke="black" strokeWidth="1.5"/>
        <rect x="15" y="40" width="5" height="8" fill="white" stroke="black" strokeWidth="1.5"/>
        <rect x="8" y="28" width="4" height="8" fill="white" stroke="black" strokeWidth="1.5"/>
        <rect x="18" y="28" width="4" height="8" fill="white" stroke="black" strokeWidth="1.5"/>
      </g>
      
      {/* Small clouds around */}
      <ellipse cx="25" cy="60" rx="8" ry="5" fill="white" stroke="black" strokeWidth="1" opacity="0.8"/>
      <ellipse cx="165" cy="180" rx="12" ry="7" fill="white" stroke="black" strokeWidth="1" opacity="0.8"/>
    </svg>
  );
};