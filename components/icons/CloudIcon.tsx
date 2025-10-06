import React from 'react';
import Image from 'next/image';

interface CloudIconProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
  opacity?: number;
}

export const CloudIcon: React.FC<CloudIconProps> = ({ 
  className = '', 
  size = 'medium',
  opacity = 1 
}) => {
  const sizeMap = {
    small: { width: 80, height: 50 },
    medium: { width: 120, height: 75 },
    large: { width: 160, height: 100 }
  };

  const { width, height } = sizeMap[size];

  return (
    <div 
      className={`cloud-icon ${className}`}
      style={{ opacity, width, height }}
    >
      <Image 
        src="/icons/cloud.svg" 
        alt="Cloud" 
        width={width} 
        height={height} 
        className="w-full h-full object-contain"
      />
    </div>
  );
};