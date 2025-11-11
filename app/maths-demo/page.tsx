'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import './maths-demo.css';

// Spec point data structure
const specPoints = [
  { id: '1.1', name: 'Proofs', lessons: 3, hours: 4.42 },
  { id: '2.1', name: 'Indices', lessons: 2, hours: 2.33 },
  { id: '2.2', name: 'Surds', lessons: 2, hours: 2.33 },
  { id: '2.3', name: 'Quadratic Function', lessons: 6, hours: 7.33 },
  { id: '2.4', name: 'Simultaneous Equations', lessons: 2, hours: 2.5 },
  { id: '2.5', name: 'Inequalities', lessons: 2, hours: 2.5 },
  { id: '2.6', name: 'Manipulating Polynomials', lessons: 4, hours: 5 },
  { id: '2.7', name: 'Graphs', lessons: 5, hours: 6.25 },
  { id: '2.9', name: 'Transformations', lessons: 1, hours: 1.25 },
  { id: '3.1', name: 'Straight Line Equation', lessons: 3, hours: 3.67 },
  { id: '3.2', name: 'Circles', lessons: 2, hours: 2.5 },
  { id: '4.1', name: 'Binomial Expansions', lessons: 2, hours: 2.5 },
  { id: '5.1', name: 'Trigonometry', lessons: 3, hours: 3.67 },
  { id: '5.3', name: 'Trigonometric Graphs', lessons: 2, hours: 2.5 },
  { id: '5.5', name: 'Trigonometric Identities', lessons: 1, hours: 1.33 },
  { id: '5.7', name: 'Solving Trig Equations', lessons: 2, hours: 2.67 },
  { id: '6.1', name: 'Exponential Functions', lessons: 2, hours: 2.5 },
  { id: '6.2', name: 'Exponential Models', lessons: 1, hours: 1.25 },
  { id: '6.3', name: 'Logarithms', lessons: 2, hours: 2.5 },
  { id: '6.4', name: 'Logarithm Laws', lessons: 1, hours: 1.25 },
  { id: '6.5', name: 'Solving Equations', lessons: 1, hours: 1.25 },
  { id: '6.6', name: 'Non-linear Graphs', lessons: 1, hours: 1.25 },
  { id: '6.7', name: 'Modelling', lessons: 1, hours: 1.25 },
  { id: '7.1', name: 'Intro to Differentiation', lessons: 3, hours: 4.42 },
  { id: '7.2', name: 'Differentiating Functions', lessons: 1, hours: 1.17 },
  { id: '7.3', name: 'Differentiation Application', lessons: 6, hours: 8 },
  { id: '8.1', name: 'Integration', lessons: 1, hours: 1.25 },
  { id: '8.2', name: 'Integrate Functions', lessons: 2, hours: 2.5 },
  { id: '8.3', name: 'Definite Integrals', lessons: 4, hours: 5.33 },
  { id: '10.1-10.5', name: 'Vectors', lessons: 6, hours: 7.33 },
];

export default function MathsDemoPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 400;
    const newPosition = direction === 'right'
      ? scrollPosition + scrollAmount
      : scrollPosition - scrollAmount;

    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
    setScrollPosition(newPosition);
  };

  return (
    <div className="maths-demo-page">
      <div className="page-background">
        <Navbar />

        {/* Back Button */}
        <Link
          href="/competition"
          style={{
            position: 'absolute',
            top: '90px',
            left: '45px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '9px 18px',
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            textDecoration: 'none',
            color: '#333333',
            fontFamily: "'Madimi One', cursive",
            fontSize: '13px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            zIndex: 20
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </Link>

        {/* Title badge */}
        <div className="title-badge">
          Maths A Level - 90 hours
        </div>

        {/* Scroll navigation arrows */}
        <button
          className="scroll-arrow left-arrow"
          onClick={() => handleScroll('left')}
          disabled={scrollPosition <= 0}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <button
          className="scroll-arrow right-arrow"
          onClick={() => handleScroll('right')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Stepping stones container */}
        <div
          className="stepping-stones-container"
          ref={scrollContainerRef}
          onScroll={(e) => setScrollPosition(e.currentTarget.scrollLeft)}
        >
          <div className="stones-track">
            {/* Grass pattern at bottom */}
            <div className="grass-pattern">
              <Image
                src="/icons/grass-pattern.svg"
                alt="Grass"
                fill
                className="grass-image"
              />
            </div>

            {/* Render stepping stones */}
            {specPoints.map((spec, index) => (
              <div key={spec.id} className="stepping-stone">
                {/* Toast icons (one per lesson) */}
                <div className="toasts-group">
                  {Array.from({ length: spec.lessons }).map((_, lessonIndex) => (
                    <div key={lessonIndex} className="toast-item">
                      <Image
                        src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2FGroup%202376.svg?alt=media&token=96940cfc-fd51-4c0c-a40b-eca32f113b46"
                        alt={`Lesson ${lessonIndex + 1}`}
                        width={50}
                        height={50}
                      />
                    </div>
                  ))}
                </div>

                {/* Bar/platform */}
                <div className="stone-bar">
                  <Image
                    src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2FVector%20448.svg?alt=media&token=a9e45250-f832-4b9d-b896-7282df82e5d7"
                    alt="Platform"
                    width={180}
                    height={40}
                    className="bar-image"
                  />
                </div>

                {/* Ghost on first stone */}
                {index === 0 && (
                  <div className="ghost-on-stone">
                    <Link href="/spec-point-session" className="ghost-link">
                      <Image
                        src="/icons/pixel-ghost-w-sword-yellow.svg"
                        alt="Ghost Character"
                        width={100}
                        height={100}
                        className="ghost-icon"
                      />
                    </Link>
                  </div>
                )}

                {/* Spec point info */}
                <div className="spec-info">
                  <div className="spec-id">{spec.id}</div>
                  <div className="spec-name">{spec.name}</div>
                  <div className="spec-time">{spec.hours} hrs</div>
                </div>
              </div>
            ))}

            {/* Treasure box at the end */}
            <div className="treasure-box-end">
              <Image
                src="/icons/treasure-box-blue.svg"
                alt="Treasure Box"
                width={120}
                height={120}
              />
              <div className="treasure-label">Complete!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
