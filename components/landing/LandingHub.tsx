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
        {/* ARENA - moved right and up */}
        <div 
          className="absolute"
          style={{
            left: '35%', /* moved right from 32% */
            top: '16%', /* moved up from 18% */
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="block" style={{ position: 'relative', cursor: 'not-allowed' }}>
            <Image 
              src="/icons/arena.svg"
              alt="ARENA"
              width={201} /* Zoomed out even more: 223 -> 201 (10% smaller) */
              height={201} /* Zoomed out even more: 223 -> 201 (10% smaller) */
              className="drop-shadow-lg"
              style={{ 
                filter: 'grayscale(100%) opacity(0.6)',
                pointerEvents: 'none'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: '-5px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#666',
              color: '#fff',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontFamily: "'Madimi One', cursive",
              whiteSpace: 'nowrap'
            }}>
              Coming Soon
            </div>
          </div>
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
              width={167} /* Zoomed out even more: 186 -> 167 (10% smaller) */
              height={167} /* Zoomed out even more: 186 -> 167 (10% smaller) */
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
              width={167} /* Zoomed out even more: 186 -> 167 (10% smaller) */
              height={167} /* Zoomed out even more: 186 -> 167 (10% smaller) */
              className="drop-shadow-lg"
            />
          </Link>
        </div>

        {/* TEACHER - moved further left */}
        <div 
          className="absolute"
          style={{
            left: '12%', /* moved left by 10% from 22% */
            top: '50%', /* moved up from 55% */
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="block" style={{ position: 'relative', cursor: 'not-allowed' }}>
            <Image 
              src="/icons/teacher.svg"
              alt="TEACHER"
              width={184} /* Zoomed out even more: 205 -> 184 (10% smaller) */
              height={184} /* Zoomed out even more: 205 -> 184 (10% smaller) */
              className="drop-shadow-lg"
              style={{ 
                filter: 'grayscale(100%) opacity(0.6)',
                pointerEvents: 'none'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: '-5px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#666',
              color: '#fff',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontFamily: "'Madimi One', cursive",
              whiteSpace: 'nowrap'
            }}>
              Coming Soon
            </div>
          </div>
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
              width={167} /* Zoomed out even more: 186 -> 167 (10% smaller) */
              height={167} /* Zoomed out even more: 186 -> 167 (10% smaller) */
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
              width={150} /* Zoomed out even more: 167 -> 150 (10% smaller) */
              height={150} /* Zoomed out even more: 167 -> 150 (10% smaller) */
              className="drop-shadow-lg"
            />
          </Link>
        </div>

        {/* SEARCH - moved up further */}
        <div 
          className="absolute"
          style={{
            left: '39%', /* moved right from 35% */
            top: '63%', /* moved up by 5% from 68% */
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Link href="/search" className="block">
            <Image 
              src="/icons/search-island-icon.svg"
              alt="SEARCH"
              width={150} /* Zoomed out even more: 167 -> 150 (10% smaller) */
              height={150} /* Zoomed out even more: 167 -> 150 (10% smaller) */
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