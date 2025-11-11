'use client';

import React, { useState, useRef, useEffect } from 'react';
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

const TOTAL_HOURS = 92.83;

export default function MathsDemoPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [currentSpecIndex, setCurrentSpecIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Calculate cumulative hours for each spec point
  const getCumulativeHours = (index: number) => {
    return specPoints.slice(0, index + 1).reduce((sum, spec) => sum + spec.hours, 0);
  };

  // Calculate current progress percentage based on spec index
  const currentProgress = (getCumulativeHours(currentSpecIndex) / TOTAL_HOURS) * 100;

  // Scroll to specific spec point
  const scrollToSpec = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const stones = container.querySelectorAll('.stepping-stone');
    if (stones[index]) {
      const stone = stones[index] as HTMLElement;
      const containerWidth = container.offsetWidth;
      const stoneLeft = stone.offsetLeft;
      const stoneWidth = stone.offsetWidth;

      // Center the stone in the viewport
      const scrollPosition = stoneLeft - (containerWidth / 2) + (stoneWidth / 2);

      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });

      setCurrentSpecIndex(index);
    }
  };

  // Handle ghost drag on progress bar
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const barWidth = rect.width - 60; // Account for treasure chest space
    const clickPercentage = (clickX / barWidth) * 100;

    // Find which spec point this percentage corresponds to
    let targetIndex = 0;
    for (let i = 0; i < specPoints.length; i++) {
      const specProgress = (getCumulativeHours(i) / TOTAL_HOURS) * 100;
      if (clickPercentage >= specProgress) {
        targetIndex = i;
      } else {
        break;
      }
    }

    scrollToSpec(targetIndex);
  };

  // Handle ghost drag
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const barWidth = rect.width - 60;
    const percentage = Math.max(0, Math.min(100, (mouseX / barWidth) * 100));

    // Find closest spec point
    let closestIndex = 0;
    let closestDiff = Infinity;

    for (let i = 0; i < specPoints.length; i++) {
      const specProgress = (getCumulativeHours(i) / TOTAL_HOURS) * 100;
      const diff = Math.abs(percentage - specProgress);
      if (diff < closestDiff) {
        closestDiff = diff;
        closestIndex = i;
      }
    }

    scrollToSpec(closestIndex);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  // Update current spec index based on scroll position
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const stones = container.querySelectorAll('.stepping-stone');
      const containerCenter = container.scrollLeft + (container.offsetWidth / 2);

      let closestIndex = 0;
      let closestDistance = Infinity;

      stones.forEach((stone, index) => {
        const stoneElement = stone as HTMLElement;
        const stoneCenter = stoneElement.offsetLeft + (stoneElement.offsetWidth / 2);
        const distance = Math.abs(containerCenter - stoneCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setCurrentSpecIndex(closestIndex);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="maths-demo-page">
      <div className="page-background">
        <Navbar />

        {/* Back Button */}
        <Link
          href="/subject-selection"
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

        {/* Progress Bar */}
        <div className="progress-bar-container" ref={progressBarRef} onClick={handleProgressBarClick}>
          <div className="progress-bar-track">
            {/* Progress fill */}
            <div className="progress-bar-fill" style={{ width: `${currentProgress}%` }} />

            {/* Loveletter ghost tracker */}
            <div
              className="progress-ghost"
              style={{ left: `${currentProgress}%` }}
              onMouseDown={handleMouseDown}
            >
              <Image
                src="/icons/love-letter-ghost.svg"
                alt="Progress tracker"
                width={40}
                height={40}
                className="ghost-tracker-icon"
              />
            </div>

            {/* Progress text */}
            <div className="progress-text">
              {getCumulativeHours(currentSpecIndex).toFixed(2)} / {TOTAL_HOURS} hours
            </div>

            {/* Treasure chest at the end */}
            <div className="progress-treasure">
              <Image
                src="/icons/treasure-box-blue.svg"
                alt="Complete"
                width={35}
                height={35}
              />
            </div>
          </div>
        </div>

        {/* Stepping stones container */}
        <div
          className="stepping-stones-container"
          ref={scrollContainerRef}
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
                    <Link
                      key={lessonIndex}
                      href={`/spec-point-session?spec=${spec.id}&lesson=${lessonIndex + 1}&name=${encodeURIComponent(spec.name)}`}
                      className="toast-item"
                    >
                      <Image
                        src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2FGroup%202376.svg?alt=media&token=96940cfc-fd51-4c0c-a40b-eca32f113b46"
                        alt={`Lesson ${lessonIndex + 1}`}
                        width={50}
                        height={50}
                      />
                    </Link>
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
                    <Link
                      href={`/spec-point-session?spec=${spec.id}&lesson=1&name=${encodeURIComponent(spec.name)}`}
                      className="ghost-link"
                    >
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
