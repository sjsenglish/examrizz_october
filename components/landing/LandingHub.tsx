'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LandingHubProps {
  className?: string;
}

export const LandingHub: React.FC<LandingHubProps> = ({ className = '' }) => {
  
  return (
    <div className={`fixed inset-0 overflow-hidden ${className}`} style={{ width: '150vw', height: '150vh', left: '-25vw', top: '-25vh' }}>
      {/* White background */}
      <div className="absolute inset-0 bg-white"></div>

      {/* Island platform - just the SVG without gray overlay */}
      <div 
        className="absolute"
        style={{
          left: '50%',
          top: '55%',
          transform: 'translate(-50%, -50%)',
          width: '1600px',
          height: '800px',
          zIndex: 1
        }}
      >
        <Image 
          src="/icons/island-platform.svg"
          alt="Island Platform"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Icons container - positioned relative to oval center (doubled) */}
      <div 
        className="absolute"
        style={{
          left: '50%',
          top: '55%',
          transform: 'translate(-50%, -50%)',
          width: '1166px', /* Zoomed out even more: 1296px -> 1166px (10% smaller) */
          height: '583px', /* Zoomed out even more: 648px -> 583px (10% smaller) */
          zIndex: 15
        }}
      >
        {/* ARENA - positioned based on reference image */}
        <div 
          className="absolute"
          style={{
            left: '35%',
            top: '22%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="block" style={{ cursor: 'not-allowed' }}>
            <Image 
              src="/icons/arena.svg"
              alt="ARENA"
              width={180}
              height={180}
              className="drop-shadow-lg"
              style={{ 
                filter: 'grayscale(100%) opacity(0.6)',
                pointerEvents: 'none'
              }}
            />
          </div>
        </div>

        {/* VIDEO - positioned based on reference image */}
        <div 
          className="absolute"
          style={{
            left: '68%',
            top: '18%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Link href="/video" className="block">
            <Image 
              src="/icons/video.svg"
              alt="VIDEO"
              width={160}
              height={160}
              className="drop-shadow-lg"
            />
          </Link>
        </div>

        {/* PRACTICE - center positioned based on reference image */}
        <div 
          className="absolute"
          style={{
            left: '50%',
            top: '48%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Link href="/practice" className="block">
            <Image 
              src="/icons/practice.svg"
              alt="PRACTICE"
              width={170}
              height={170}
              className="drop-shadow-lg"
            />
          </Link>
        </div>

        {/* TEACHER - positioned based on reference image */}
        <div 
          className="absolute"
          style={{
            left: '18%',
            top: '65%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="block" style={{ cursor: 'not-allowed' }}>
            <Image 
              src="/icons/teacher.svg"
              alt="TEACHER"
              width={160}
              height={160}
              className="drop-shadow-lg"
              style={{ 
                filter: 'grayscale(100%) opacity(0.6)',
                pointerEvents: 'none'
              }}
            />
          </div>
        </div>

        {/* ASK BO - positioned based on reference image */}
        <div 
          className="absolute"
          style={{
            left: '25%',
            top: '32%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Link href="/askbo" className="block">
            <Image 
              src="/icons/island-ask-bo.svg"
              alt="ASK BO"
              width={155}
              height={155}
              className="drop-shadow-lg"
            />
          </Link>
        </div>

        {/* LEARN - positioned based on reference image */}
        <div 
          className="absolute"
          style={{
            left: '75%',
            top: '45%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Link href="/learn" className="block">
            <Image 
              src="/icons/learn.svg"
              alt="LEARN"
              width={145}
              height={145}
              className="drop-shadow-lg"
            />
          </Link>
        </div>

        {/* SEARCH - positioned based on reference image */}
        <div 
          className="absolute"
          style={{
            left: '42%',
            top: '75%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Link href="/search" className="block">
            <Image 
              src="/icons/search-island-icon.svg"
              alt="SEARCH"
              width={140}
              height={140}
              className="drop-shadow-lg"
            />
          </Link>
        </div>
      </div>


      {/* Decorative clouds - new layout */}
      {/* Big cloud top left */}
      <div className="absolute left-[15%] top-[20%] opacity-70 pointer-events-none" style={{ zIndex: 5 }}>
        <Image 
          src="/svg/island-cloud-big.svg"
          alt="Cloud"
          width={131} /* Zoomed out even more: 146 -> 131 (10% smaller) */
          height={87} /* Zoomed out even more: 97 -> 87 (10% smaller) */
        />
      </div>
      
      {/* Big cloud top right */}
      <div className="absolute right-[15%] top-[35%] opacity-70 pointer-events-none" style={{ zIndex: 5 }}>
        <Image 
          src="/svg/island-cloud-big.svg"
          alt="Cloud"
          width={131} /* Zoomed out even more: 146 -> 131 (10% smaller) */
          height={87} /* Zoomed out even more: 97 -> 87 (10% smaller) */
        />
      </div>
      
      {/* Medium cloud top middle left */}
      <div className="absolute left-[35%] top-[15%] opacity-60 pointer-events-none" style={{ zIndex: 5 }}>
        <Image 
          src="/svg/island-cloud-medium.svg"
          alt="Cloud"
          width={87} /* Zoomed out even more: 97 -> 87 (10% smaller) */
          height={59} /* Zoomed out even more: 65 -> 59 (10% smaller) */
        />
      </div>
      
      {/* Medium cloud top middle right */}
      <div className="absolute right-[35%] top-[17%] opacity-60 pointer-events-none" style={{ zIndex: 5 }}>
        <Image 
          src="/svg/island-cloud-medium.svg"
          alt="Cloud"
          width={87} /* Zoomed out even more: 97 -> 87 (10% smaller) */
          height={59} /* Zoomed out even more: 65 -> 59 (10% smaller) */
        />
      </div>

    </div>
  );
};