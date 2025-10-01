import React from 'react';

interface TeacherIconProps {
  className?: string;
  size?: number;
}

export const TeacherIcon: React.FC<TeacherIconProps> = ({ className = '', size = 120 }) => {
  return (
    <svg 
      width={size} 
      height={size * 1.04} 
      viewBox="0 0 241 251" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`teacher-icon ${className}`}
    >
      {/* Teacher text */}
      <path d="M62.2402 29.352V12.968H60.6722V15.688H56.6082V11.336H59.4242V8.584H69.1522V11.336H72.0002V15.688H67.9042V12.968H66.3362V29.352H62.2402ZM77.7367 29.352V26.632H74.9207V11.336H77.7367V8.584H87.4647V11.336H90.3127V15.688H86.2167V12.968H78.9847V16.808H84.6487V21.128H78.9847V25H86.2167V22.248H90.3127V26.632H87.4647V29.352H77.7367ZM94.202 29.352V14.056H97.018V11.336H99.834V8.584H103.93V11.336H106.746V14.056H109.594V29.352H105.498V23.88H98.266V29.352H94.202ZM98.266 19.496H105.498V15.688H102.682V12.968H101.082V15.688H98.266V19.496ZM115.987 29.352V26.632H113.171V11.336H115.987V8.584H125.715V11.336H128.563V18.408H124.467V12.968H117.235V25H124.467V19.496H128.563V26.632H125.715V29.352H115.987ZM132.452 29.352V8.584H136.516V16.808H138.084V14.056H142.18V16.808H143.748V8.584H147.844V29.352H143.748V21.128H136.516V29.352H132.452ZM154.549 29.352V26.632H151.733V11.336H154.549V8.584H164.277V11.336H167.125V15.688H163.029V12.968H155.797V16.808H161.461V21.128H155.797V25H163.029V22.248H167.125V26.632H164.277V29.352H154.549ZM171.014 29.352V11.336H173.83V8.584H183.558V11.336H186.406V21.128H183.558V23.88H182.182V25H184.966V29.352H180.934V26.632H178.054V23.88H175.078V29.352H171.014ZM175.078 19.496H182.31V12.968H175.078V19.496Z" fill="#1E1E2F"/>
      
      {/* Main briefcase/laptop shape */}
      <rect x="60" y="80" width="120" height="80" rx="8" fill="#00CED1" stroke="black" strokeWidth="3"/>
      
      {/* Laptop screen (opened) */}
      <rect x="65" y="60" width="110" height="75" rx="6" fill="white" stroke="black" strokeWidth="2"/>
      <rect x="70" y="65" width="100" height="65" rx="3" fill="black"/>
      <rect x="75" y="70" width="90" height="55" rx="2" fill="white"/>
      
      {/* Screen content - presentation/teaching material */}
      <rect x="80" y="75" width="80" height="45" fill="#f0f0f0"/>
      <rect x="85" y="80" width="30" height="20" fill="#00CED1" opacity="0.6"/>
      <line x1="85" y1="105" x2="155" y2="105" stroke="#333" strokeWidth="1"/>
      <line x1="85" y1="110" x2="140" y2="110" stroke="#333" strokeWidth="1"/>
      <line x1="85" y1="115" x2="150" y2="115" stroke="#333" strokeWidth="1"/>
      
      {/* Keyboard */}
      <rect x="70" y="85" width="100" height="50" rx="4" fill="#f8f8f8" stroke="black" strokeWidth="1"/>
      {/* Keyboard keys */}
      <g fill="#e0e0e0" stroke="#ccc" strokeWidth="0.5">
        <rect x="75" y="90" width="8" height="6" rx="1"/>
        <rect x="85" y="90" width="8" height="6" rx="1"/>
        <rect x="95" y="90" width="8" height="6" rx="1"/>
        <rect x="105" y="90" width="8" height="6" rx="1"/>
        <rect x="115" y="90" width="8" height="6" rx="1"/>
        <rect x="125" y="90" width="8" height="6" rx="1"/>
        <rect x="135" y="90" width="8" height="6" rx="1"/>
        <rect x="145" y="90" width="8" height="6" rx="1"/>
        <rect x="155" y="90" width="8" height="6" rx="1"/>
        
        <rect x="75" y="98" width="8" height="6" rx="1"/>
        <rect x="85" y="98" width="8" height="6" rx="1"/>
        <rect x="95" y="98" width="8" height="6" rx="1"/>
        <rect x="105" y="98" width="8" height="6" rx="1"/>
        <rect x="115" y="98" width="8" height="6" rx="1"/>
        <rect x="125" y="98" width="8" height="6" rx="1"/>
        <rect x="135" y="98" width="8" height="6" rx="1"/>
        <rect x="155" y="98" width="8" height="6" rx="1"/>
        
        <rect x="85" y="106" width="50" height="6" rx="1"/>
        <rect x="140" y="106" width="23" height="6" rx="1"/>
        
        <rect x="75" y="114" width="12" height="6" rx="1"/>
        <rect x="90" y="114" width="12" height="6" rx="1"/>
        <rect x="105" y="114" width="12" height="6" rx="1"/>
        <rect x="120" y="114" width="12" height="6" rx="1"/>
        <rect x="135" y="114" width="12" height="6" rx="1"/>
        <rect x="150" y="114" width="13" height="6" rx="1"/>
      </g>
      
      {/* Trackpad */}
      <rect x="110" y="122" width="20" height="12" rx="2" fill="#e8e8e8" stroke="#ccc" strokeWidth="1"/>
      
      {/* Handle */}
      <rect x="110" y="160" width="20" height="4" rx="2" fill="#888" stroke="black" strokeWidth="1"/>
      
      {/* Hinges */}
      <circle cx="75" cy="85" r="3" fill="#888" stroke="black" strokeWidth="1"/>
      <circle cx="165" cy="85" r="3" fill="#888" stroke="black" strokeWidth="1"/>
      
      {/* Small details - ports/indicators */}
      <rect x="50" y="95" width="8" height="3" rx="1" fill="#333"/>
      <rect x="50" y="100" width="8" height="3" rx="1" fill="#333"/>
      <circle cx="190" cy="90" r="2" fill="#00ff00" opacity="0.8"/>
      <circle cx="190" cy="100" r="2" fill="#ff0000" opacity="0.6"/>
    </svg>
  );
};