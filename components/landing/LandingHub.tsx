'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LandingHubProps {
  className?: string;
}

export const LandingHub: React.FC<LandingHubProps> = ({ className = '' }) => {

  return (
    <div className={`landing-hub-container ${className}`}>
      {/* White background */}
      <div className="absolute inset-0 bg-white"></div>

      {/* Island platform - just the SVG without gray overlay */}
      <div className="island-platform">
        <Image
          src="/icons/island-platform.svg"
          alt="Island Platform"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Icons container - positioned relative to oval center (doubled) */}
      <div className="icons-container">
        {/* ARENA - top-left */}
        <div className="icon-arena">
          <Image
            src="/icons/arena.svg"
            alt="ARENA"
            width={186}
            height={186}
            className="drop-shadow-lg opacity-40 grayscale cursor-not-allowed"
          />
        </div>

        {/* VIDEO - top-right */}
        <div className="icon-video">
          <Image
            src="/icons/video.svg"
            alt="VIDEO"
            width={155}
            height={155}
            className="drop-shadow-lg opacity-40 grayscale cursor-not-allowed"
          />
        </div>

        {/* PRACTICE - dead center */}
        <div className="icon-practice">
          <Link href="/practice" className="block">
            <Image
              src="/icons/practice.svg"
              alt="PRACTICE"
              width={155}
              height={155}
              className="drop-shadow-lg"
            />
          </Link>
        </div>

        {/* TEACHER - bottom-left */}
        <div className="icon-teacher">
          <Image
            src="/icons/teacher.svg"
            alt="TEACHER"
            width={171}
            height={171}
            className="drop-shadow-lg opacity-40 grayscale cursor-not-allowed"
          />
        </div>

        {/* ASK BO - moved further left */}
        <div className="icon-askbo">
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

        {/* LEARN - bottom-right */}
        <div className="icon-learn">
          <Image
            src="/icons/learn.svg"
            alt="LEARN"
            width={140}
            height={140}
            className="drop-shadow-lg opacity-40 grayscale cursor-not-allowed"
          />
        </div>

        {/* SEARCH - between video and learn icons on the right edge */}
        <div className="icon-search">
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
      <div className="cloud-big-left">
        <Image
          src="/svg/island-cloud-big.svg"
          alt="Cloud"
          width={122}
          height={81}
        />
      </div>

      {/* Big cloud top right */}
      <div className="cloud-big-right">
        <Image
          src="/svg/island-cloud-big.svg"
          alt="Cloud"
          width={122}
          height={81}
        />
      </div>

      {/* Medium cloud top middle left */}
      <div className="cloud-medium-left">
        <Image
          src="/svg/island-cloud-medium.svg"
          alt="Cloud"
          width={81}
          height={54}
        />
      </div>

      {/* Medium cloud top middle right */}
      <div className="cloud-medium-right">
        <Image
          src="/svg/island-cloud-medium.svg"
          alt="Cloud"
          width={81}
          height={54}
        />
      </div>

    </div>
  );
};