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
          width: '1440px', /* 10% smaller: 1600px -> 1440px */
          height: '720px', /* 10% smaller: 800px -> 720px */
          zIndex: 15
        }}
      >
        {/* ARENA - top-left (20% from left, 25% from top) */}
        <div 
          className="absolute"
          style={{
            left: '32%',
            top: '18%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Link href="/arena" className="block">
            <Image 
              src="/icons/arena.svg"
              alt="ARENA"
              width={248} /* 10% smaller: 276 -> 248 */
              height={248} /* 10% smaller: 276 -> 248 */
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
          <Link href="/videogallery" className="block">
            <Image 
              src="/icons/video.svg"
              alt="VIDEO"
              width={207} /* 10% smaller: 230 -> 207 */
              height={207} /* 10% smaller: 230 -> 207 */
              className="drop-shadow-lg"
            />
          </Link>
        </div>

        {/* PRACTICE - dead center (50% horizontal, 50% vertical) */}
        <div 
          className="absolute"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Link href="/practice" className="block">
            <Image 
              src="/icons/practice.svg"
              alt="PRACTICE"
              width={207} /* 10% smaller: 230 -> 207 */
              height={207} /* 10% smaller: 230 -> 207 */
              className="drop-shadow-lg"
            />
          </Link>
        </div>

        {/* TEACHER - bottom-left (25% from left, 55% from top) - MOVED UP */}
        <div 
          className="absolute"
          style={{
            left: '25%',
            top: '55%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Link href="/teacher" className="block">
            <Image 
              src="/icons/teacher.svg"
              alt="TEACHER"
              width={228} /* 10% smaller: 253 -> 228 */
              height={228} /* 10% smaller: 253 -> 228 */
              className="drop-shadow-lg"
            />
          </Link>
        </div>

        {/* ASK BO - moved further left (18% from left, 25% from top) */}
        <div 
          className="absolute"
          style={{
            left: '18%',
            top: '25%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Link href="/askbo" className="block">
            <Image 
              src="/icons/island-ask-bo.svg"
              alt="ASK BO"
              width={207}
              height={207}
              className="drop-shadow-lg"
            />
          </Link>
        </div>

        {/* LEARN - bottom-right (70% from left, 45% from top) - MOVED UP */}
        <div 
          className="absolute"
          style={{
            left: '70%',
            top: '45%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Link href="/learn" className="block">
            <Image 
              src="/icons/learn.svg"
              alt="LEARN"
              width={186} /* 10% smaller: 207 -> 186 */
              height={186} /* 10% smaller: 207 -> 186 */
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
          width={162} /* 10% smaller: 180 -> 162 */
          height={108} /* 10% smaller: 120 -> 108 */
        />
      </div>
      
      {/* Big cloud top right */}
      <div className="absolute right-[15%] top-[35%] opacity-70 pointer-events-none" style={{ zIndex: 5 }}>
        <Image 
          src="/svg/island-cloud-big.svg"
          alt="Cloud"
          width={162} /* 10% smaller: 180 -> 162 */
          height={108} /* 10% smaller: 120 -> 108 */
        />
      </div>
      
      {/* Medium cloud top middle left */}
      <div className="absolute left-[35%] top-[15%] opacity-60 pointer-events-none" style={{ zIndex: 5 }}>
        <Image 
          src="/svg/island-cloud-medium.svg"
          alt="Cloud"
          width={108} /* 10% smaller: 120 -> 108 */
          height={72} /* 10% smaller: 80 -> 72 */
        />
      </div>
      
      {/* Medium cloud top middle right */}
      <div className="absolute right-[35%] top-[17%] opacity-60 pointer-events-none" style={{ zIndex: 5 }}>
        <Image 
          src="/svg/island-cloud-medium.svg"
          alt="Cloud"
          width={108} /* 10% smaller: 120 -> 108 */
          height={72} /* 10% smaller: 80 -> 72 */
        />
      </div>

    </div>
  );
};