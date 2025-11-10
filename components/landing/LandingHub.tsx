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
          width: '1200px',
          height: '600px',
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
          width: '1080px', /* 75% of original: 1440px -> 1080px */
          height: '540px', /* 75% of original: 720px -> 540px */
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
          <Image
            src="/icons/arena.svg"
            alt="ARENA"
            width={186} /* 75% of 248 -> 186 */
            height={186} /* 75% of 248 -> 186 */
            className="drop-shadow-lg opacity-40 grayscale cursor-not-allowed"
          />
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
          <Image
            src="/icons/video.svg"
            alt="VIDEO"
            width={155} /* 75% of 207 -> 155 */
            height={155} /* 75% of 207 -> 155 */
            className="drop-shadow-lg opacity-40 grayscale cursor-not-allowed"
          />
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
              width={155} /* 75% of 207 -> 155 */
              height={155} /* 75% of 207 -> 155 */
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
          <Image
            src="/icons/teacher.svg"
            alt="TEACHER"
            width={171} /* 75% of 228 -> 171 */
            height={171} /* 75% of 228 -> 171 */
            className="drop-shadow-lg opacity-40 grayscale cursor-not-allowed"
          />
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
              width={155}
              height={155}
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
          <Image
            src="/icons/learn.svg"
            alt="LEARN"
            width={140} /* 75% of 186 -> 140 */
            height={140} /* 75% of 186 -> 140 */
            className="drop-shadow-lg opacity-40 grayscale cursor-not-allowed"
          />
        </div>

        {/* SEARCH - between video and learn icons on the right edge */}
        <div 
          className="absolute"
          style={{
            left: '82%',
            top: '30%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Link href="/search" className="block">
            <Image 
              src="/icons/search-island-icon.svg"
              alt="SEARCH"
              width={140} /* 75% of 186 -> 140 */
              height={140} /* 75% of 186 -> 140 */
              className="drop-shadow-lg"
            />
          </Link>
        </div>
      </div>


      {/* Decorative clouds - new layout */}
      {/* Big cloud top left */}
      <div className="absolute left-[20%] top-[30%] opacity-70 pointer-events-none" style={{ zIndex: 5 }}>
        <Image
          src="/svg/island-cloud-big.svg"
          alt="Cloud"
          width={122} /* 75% of 162 -> 122 */
          height={81} /* 75% of 108 -> 81 */
        />
      </div>

      {/* Big cloud top right */}
      <div className="absolute right-[20%] top-[45%] opacity-70 pointer-events-none" style={{ zIndex: 5 }}>
        <Image
          src="/svg/island-cloud-big.svg"
          alt="Cloud"
          width={122} /* 75% of 162 -> 122 */
          height={81} /* 75% of 108 -> 81 */
        />
      </div>

      {/* Medium cloud top middle left */}
      <div className="absolute left-[38%] top-[25%] opacity-60 pointer-events-none" style={{ zIndex: 5 }}>
        <Image
          src="/svg/island-cloud-medium.svg"
          alt="Cloud"
          width={81} /* 75% of 108 -> 81 */
          height={54} /* 75% of 72 -> 54 */
        />
      </div>

      {/* Medium cloud top middle right */}
      <div className="absolute right-[38%] top-[27%] opacity-60 pointer-events-none" style={{ zIndex: 5 }}>
        <Image
          src="/svg/island-cloud-medium.svg"
          alt="Cloud"
          width={81} /* 75% of 108 -> 81 */
          height={54} /* 75% of 72 -> 54 */
        />
      </div>

    </div>
  );
};