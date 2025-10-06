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
          width: '1600px',
          height: '800px',
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
          <Link href="/competition" className="block">
            <Image 
              src="/icons/arena.svg"
              alt="ARENA"
              width={276}
              height={276}
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
              width={230}
              height={230}
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
              width={230}
              height={230}
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
              width={253}
              height={253}
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
              width={207}
              height={207}
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
          width={180}
          height={120}
        />
      </div>
      
      {/* Big cloud top right */}
      <div className="absolute right-[15%] top-[35%] opacity-70 pointer-events-none" style={{ zIndex: 5 }}>
        <Image 
          src="/svg/island-cloud-big.svg"
          alt="Cloud"
          width={180}
          height={120}
        />
      </div>
      
      {/* Medium cloud top middle left */}
      <div className="absolute left-[35%] top-[15%] opacity-60 pointer-events-none" style={{ zIndex: 5 }}>
        <Image 
          src="/svg/island-cloud-medium.svg"
          alt="Cloud"
          width={120}
          height={80}
        />
      </div>
      
      {/* Medium cloud top middle right */}
      <div className="absolute right-[35%] top-[17%] opacity-60 pointer-events-none" style={{ zIndex: 5 }}>
        <Image 
          src="/svg/island-cloud-medium.svg"
          alt="Cloud"
          width={120}
          height={80}
        />
      </div>

    </div>
  );
};