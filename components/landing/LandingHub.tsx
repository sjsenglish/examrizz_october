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
          width: '1296px', /* Zoomed out further: 1440px -> 1296px (10% smaller) */
          height: '648px', /* Zoomed out further: 720px -> 648px (10% smaller) */
          zIndex: 15
        }}
      >
        {/* ARENA - moved right and up */}
        <div 
          className="absolute"
          style={{
            left: '35%', /* moved right from 32% */
            top: '16%', /* moved up from 18% */
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Link href="/arena" className="block">
            <Image 
              src="/icons/arena.svg"
              alt="ARENA"
              width={223} /* Zoomed out further: 248 -> 223 (10% smaller) */
              height={223} /* Zoomed out further: 248 -> 223 (10% smaller) */
              className="drop-shadow-lg"
            />
          </Link>
        </div>

        {/* VIDEO - top-right (75% from left, 25% from top) */}
        <div 
          className="absolute"
          style={{
            left: '65%',
            top: '15%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Link href="/video" className="block">
            <Image 
              src="/icons/video.svg"
              alt="VIDEO"
              width={186} /* Zoomed out further: 207 -> 186 (10% smaller) */
              height={186} /* Zoomed out further: 207 -> 186 (10% smaller) */
              className="drop-shadow-lg"
            />
          </Link>
        </div>

        {/* PRACTICE - moved to the right */}
        <div 
          className="absolute"
          style={{
            left: '55%', /* moved right from 50% */
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Link href="/practice" className="block">
            <Image 
              src="/icons/practice.svg"
              alt="PRACTICE"
              width={186} /* Zoomed out further: 207 -> 186 (10% smaller) */
              height={186} /* Zoomed out further: 207 -> 186 (10% smaller) */
              className="drop-shadow-lg"
            />
          </Link>
        </div>

        {/* TEACHER - moved left and up */}
        <div 
          className="absolute"
          style={{
            left: '22%', /* moved left from 25% */
            top: '50%', /* moved up from 55% */
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Link href="/teacher" className="block">
            <Image 
              src="/icons/teacher.svg"
              alt="TEACHER"
              width={205} /* Zoomed out further: 228 -> 205 (10% smaller) */
              height={205} /* Zoomed out further: 228 -> 205 (10% smaller) */
              className="drop-shadow-lg"
            />
          </Link>
        </div>

        {/* ASK BO - moved to the right */}
        <div 
          className="absolute"
          style={{
            left: '20%', /* moved right from 18% */
            top: '25%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Link href="/askbo" className="block">
            <Image 
              src="/icons/island-ask-bo.svg"
              alt="ASK BO"
              width={186} /* Zoomed out further: 207 -> 186 (10% smaller) */
              height={186} /* Zoomed out further: 207 -> 186 (10% smaller) */
              className="drop-shadow-lg"
            />
          </Link>
        </div>

        {/* LEARN - moved to the right and slightly up */}
        <div 
          className="absolute"
          style={{
            left: '77%', /* moved right from 70% */
            top: '41%', /* moved up from 45% */
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Link href="/learn" className="block">
            <Image 
              src="/icons/learn.svg"
              alt="LEARN"
              width={167} /* Zoomed out further: 186 -> 167 (10% smaller) */
              height={167} /* Zoomed out further: 186 -> 167 (10% smaller) */
              className="drop-shadow-lg"
            />
          </Link>
        </div>

        {/* SEARCH - moved up and slightly right */}
        <div 
          className="absolute"
          style={{
            left: '39%', /* moved right from 35% */
            top: '68%', /* moved up from 75% */
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Link href="/search" className="block">
            <Image 
              src="/icons/search-island-icon.svg"
              alt="SEARCH"
              width={167} /* Zoomed out further: 186 -> 167 (10% smaller) */
              height={167} /* Zoomed out further: 186 -> 167 (10% smaller) */
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
          width={146} /* Zoomed out further: 162 -> 146 (10% smaller) */
          height={97} /* Zoomed out further: 108 -> 97 (10% smaller) */
        />
      </div>
      
      {/* Big cloud top right */}
      <div className="absolute right-[15%] top-[35%] opacity-70 pointer-events-none" style={{ zIndex: 5 }}>
        <Image 
          src="/svg/island-cloud-big.svg"
          alt="Cloud"
          width={146} /* Zoomed out further: 162 -> 146 (10% smaller) */
          height={97} /* Zoomed out further: 108 -> 97 (10% smaller) */
        />
      </div>
      
      {/* Medium cloud top middle left */}
      <div className="absolute left-[35%] top-[15%] opacity-60 pointer-events-none" style={{ zIndex: 5 }}>
        <Image 
          src="/svg/island-cloud-medium.svg"
          alt="Cloud"
          width={97} /* Zoomed out further: 108 -> 97 (10% smaller) */
          height={65} /* Zoomed out further: 72 -> 65 (10% smaller) */
        />
      </div>
      
      {/* Medium cloud top middle right */}
      <div className="absolute right-[35%] top-[17%] opacity-60 pointer-events-none" style={{ zIndex: 5 }}>
        <Image 
          src="/svg/island-cloud-medium.svg"
          alt="Cloud"
          width={97} /* Zoomed out further: 108 -> 97 (10% smaller) */
          height={65} /* Zoomed out further: 72 -> 65 (10% smaller) */
        />
      </div>

    </div>
  );
};