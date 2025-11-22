'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import ProgressDashboard from '@/components/ProgressDashboard';
import './maths-demo.css';

// Spec point type definition
type SpecPoint = {
  id: string;
  name: string;
  lessons: number;
  hours: number;
  type: 'normal' | 'blended';
  chapter: number;
  transitionTo?: number; // For blended blocks transitioning from even to odd chapters
};

// Chapter titles mapping
const chapterTitles: { [key: number]: string } = {
  1: 'Proof',
  2: 'Algebra and Functions',
  3: 'Coordinate Geometry',
  4: 'Binomial Expansion',
  5: 'Trigonometry',
  6: 'Exponentials and Logarithms',
  7: 'Differentiation',
  8: 'Integration',
  10: 'Vectors'
};

// Spec point data structure - includes blended block as special type
const specPoints = [
  { id: '1.1', name: 'Proofs', lessons: 3, hours: 4.42, type: 'normal', chapter: 1 },
  { id: 'blended-1', name: 'Blended Practice', lessons: 0, hours: 0, type: 'blended', chapter: 1 },
  { id: '2.1', name: 'Indices', lessons: 2, hours: 2.33, type: 'normal', chapter: 2 },
  { id: '2.2', name: 'Surds', lessons: 2, hours: 2.33, type: 'normal', chapter: 2 },
  { id: '2.3', name: 'Quadratic Function', lessons: 6, hours: 7.33, type: 'normal', chapter: 2 },
  { id: '2.4', name: 'Simultaneous Equations', lessons: 2, hours: 2.5, type: 'normal', chapter: 2 },
  { id: '2.5', name: 'Inequalities', lessons: 2, hours: 2.5, type: 'normal', chapter: 2 },
  { id: '2.6', name: 'Manipulating Polynomials', lessons: 4, hours: 5, type: 'normal', chapter: 2 },
  { id: '2.7', name: 'Graphs', lessons: 5, hours: 6.25, type: 'normal', chapter: 2 },
  { id: '2.9', name: 'Transformations', lessons: 1, hours: 1.25, type: 'normal', chapter: 2 },
  { id: 'blended-2', name: 'Blended Practice', lessons: 0, hours: 0, type: 'blended', chapter: 2, transitionTo: 3 },
  { id: '3.1', name: 'Straight Line Equation', lessons: 3, hours: 3.67, type: 'normal', chapter: 3 },
  { id: '3.2', name: 'Circles', lessons: 2, hours: 2.5, type: 'normal', chapter: 3 },
  { id: 'blended-3', name: 'Blended Practice', lessons: 0, hours: 0, type: 'blended', chapter: 3 },
  { id: '4.1', name: 'Binomial Expansions', lessons: 2, hours: 2.5, type: 'normal', chapter: 4 },
  { id: 'blended-4', name: 'Blended Practice', lessons: 0, hours: 0, type: 'blended', chapter: 4, transitionTo: 5 },
  { id: '5.1', name: 'Trigonometry', lessons: 3, hours: 3.67, type: 'normal', chapter: 5 },
  { id: '5.3', name: 'Trigonometric Graphs', lessons: 2, hours: 2.5, type: 'normal', chapter: 5 },
  { id: '5.5', name: 'Trigonometric Identities', lessons: 1, hours: 1.33, type: 'normal', chapter: 5 },
  { id: '5.7', name: 'Solving Trig Equations', lessons: 2, hours: 2.67, type: 'normal', chapter: 5 },
  { id: 'blended-5', name: 'Blended Practice', lessons: 0, hours: 0, type: 'blended', chapter: 5 },
  { id: '6.1', name: 'Exponential Functions', lessons: 2, hours: 2.5, type: 'normal', chapter: 6 },
  { id: '6.2', name: 'Exponential Models', lessons: 1, hours: 1.25, type: 'normal', chapter: 6 },
  { id: '6.3', name: 'Logarithms', lessons: 2, hours: 2.5, type: 'normal', chapter: 6 },
  { id: '6.4', name: 'Logarithm Laws', lessons: 1, hours: 1.25, type: 'normal', chapter: 6 },
  { id: '6.5', name: 'Solving Equations', lessons: 1, hours: 1.25, type: 'normal', chapter: 6 },
  { id: '6.6', name: 'Non-linear Graphs', lessons: 1, hours: 1.25, type: 'normal', chapter: 6 },
  { id: '6.7', name: 'Modelling', lessons: 1, hours: 1.25, type: 'normal', chapter: 6 },
  { id: 'blended-6', name: 'Blended Practice', lessons: 0, hours: 0, type: 'blended', chapter: 6, transitionTo: 7 },
  { id: '7.1', name: 'Intro to Differentiation', lessons: 3, hours: 4.42, type: 'normal', chapter: 7 },
  { id: '7.2', name: 'Differentiating Functions', lessons: 1, hours: 1.17, type: 'normal', chapter: 7 },
  { id: '7.3', name: 'Differentiation Application', lessons: 6, hours: 8, type: 'normal', chapter: 7 },
  { id: 'blended-7', name: 'Blended Practice', lessons: 0, hours: 0, type: 'blended', chapter: 7 },
  { id: '8.1', name: 'Integration', lessons: 1, hours: 1.25, type: 'normal', chapter: 8 },
  { id: '8.2', name: 'Integrate Functions', lessons: 2, hours: 2.5, type: 'normal', chapter: 8 },
  { id: '8.3', name: 'Definite Integrals', lessons: 4, hours: 5.33, type: 'normal', chapter: 8 },
  { id: 'blended-8', name: 'Blended Practice', lessons: 0, hours: 0, type: 'blended', chapter: 8, transitionTo: 10 },
  { id: '10.1-10.5', name: 'Vectors', lessons: 6, hours: 7.33, type: 'normal', chapter: 10 },
  { id: 'blended-10', name: 'Blended Practice', lessons: 0, hours: 0, type: 'blended', chapter: 10 },
];

const TOTAL_HOURS = 92.83;

// Get height offset for each stepping stone for visual variation
const getStoneHeightOffset = (index: number): number => {
  const pattern = [0, 0, -60, 30, -30, 20, -40, 10, -20, 40, -50, 0, -30, 20, -40, 0, 30, -20, 0, -35, 25, -45, 0, 15, -25, 35, -55, 0, -40, 20, -30, 40, -50, 0, 10, -30, 25, -35, 0];
  return pattern[index] || 0;
};

// Get signpost info for chapter markers
const getChapterSignpost = (chapter: number, isFirstInChapter: boolean) => {
  if (!isFirstInChapter) return null;

  // Determine if chapter is odd or even (chapter 10 is considered even)
  const isOddChapter = chapter % 2 === 1;

  const url = isOddChapter
    ? 'https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fflagpost-purple-empty.svg?alt=media&token=27b64194-9cec-458f-a2bc-aba75eb0c155'
    : 'https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fflagpost-blue-empty.svg?alt=media&token=635d87c5-3811-4cf1-88c3-e3581daa2eb7';

  return {
    chapter,
    url,
    title: chapterTitles[chapter] || `Chapter ${chapter}`
  };
};

export default function MathsDemoPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [currentSpecIndex, setCurrentSpecIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);

  // Scroll right by a fixed amount
  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollBy({ left: 300, behavior: 'smooth' });
  };

  // Filter spec points based on search query (exclude blended blocks)
  const filteredSpecs = specPoints.filter((spec: any) => {
    if (!searchQuery.trim() || spec.type === 'blended') return false;
    const query = searchQuery.toLowerCase();
    return (
      spec.id.toLowerCase().includes(query) ||
      spec.name.toLowerCase().includes(query)
    );
  });

  // Calculate cumulative hours for each spec point (exclude blended blocks)
  const getCumulativeHours = (index: number) => {
    return specPoints.slice(0, index + 1).reduce((sum, spec) => {
      return spec.type === 'normal' ? sum + spec.hours : sum;
    }, 0);
  };

  // Calculate current progress percentage based on spec index
  // Disabled for now - will implement chapter-based fill later
  const currentProgress = 0;

  // Scroll to specific spec point
  const scrollToSpec = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Query wrapper elements (direct children of track) for correct offsetLeft
    const wrappers = container.querySelectorAll('.stepping-stone-wrapper');
    if (wrappers[index]) {
      const wrapper = wrappers[index] as HTMLElement;
      const containerWidth = container.offsetWidth;
      const wrapperLeft = wrapper.offsetLeft;
      const wrapperWidth = wrapper.offsetWidth;

      // Center the stone in the viewport
      const scrollPosition = wrapperLeft - (containerWidth / 2) + (wrapperWidth / 2);

      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });

      setCurrentSpecIndex(index);
    }
  };

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowDropdown(value.trim().length > 0);
  };

  // Handle selecting a topic from dropdown
  const handleSelectTopic = (specId: string) => {
    const index = specPoints.findIndex(spec => spec.id === specId);
    if (index !== -1) {
      scrollToSpec(index);
      setSearchQuery('');
      setShowDropdown(false);
    }
  };

  // Handle ghost drag on progress bar
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;

    const trackElement = progressBarRef.current.querySelector('.progress-bar-track');
    if (!trackElement) return;

    const rect = trackElement.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const barWidth = rect.width;
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

    const trackElement = progressBarRef.current.querySelector('.progress-bar-track');
    if (!trackElement) return;

    const rect = trackElement.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const barWidth = rect.width;
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
      const wrappers = container.querySelectorAll('.stepping-stone-wrapper');
      const containerCenter = container.scrollLeft + (container.offsetWidth / 2);

      let closestIndex = 0;
      let closestDistance = Infinity;

      wrappers.forEach((wrapper, index) => {
        const wrapperElement = wrapper as HTMLElement;
        const wrapperCenter = wrapperElement.offsetLeft + (wrapperElement.offsetWidth / 2);
        const distance = Math.abs(containerCenter - wrapperCenter);

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

  // Fetch user progress data for lesson completion
  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setIsLoadingProgress(false);
          return;
        }

        // Fetch all lessons to get mapping between spec points and lesson IDs
        const { data: lessonsData, error: lessonsError } = await (supabase as any)
          .from('learn_lessons')
          .select(`
            id,
            lesson_number,
            learn_spec_points!inner(code)
          `);

        if (lessonsError) {
          console.error('Error fetching lessons:', lessonsError);
          setIsLoadingProgress(false);
          return;
        }

        // Fetch all progress records for this user
        const { data: progressData, error } = await (supabase as any)
          .from('learn_user_progress')
          .select('lesson_id, video_watched')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching progress:', error);
          setIsLoadingProgress(false);
          return;
        }

        // Create a mapping of lesson IDs to completion status
        const progressMap = new Map<string, boolean>();
        if (progressData) {
          progressData.forEach((progress: any) => {
            progressMap.set(progress.lesson_id, progress.video_watched);
          });
        }

        // Create a set of completed lesson keys (spec_id-lesson_number)
        const completed = new Set<string>();
        if (lessonsData) {
          lessonsData.forEach((lesson: any) => {
            const lessonId = lesson.id;
            const specCode = lesson.learn_spec_points?.code;
            const lessonNumber = lesson.lesson_number;

            if (specCode && lessonNumber && progressMap.get(lessonId)) {
              completed.add(`${specCode}-${lessonNumber}`);
            }
          });
        }

        setCompletedLessons(completed);
        setIsLoadingProgress(false);
      } catch (error) {
        console.error('Error in fetchUserProgress:', error);
        setIsLoadingProgress(false);
      }
    };

    fetchUserProgress();
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

        {/* Dashboard Folder Icon - Top Right */}
        <button
          onClick={() => setShowDashboard(true)}
          className="dashboard-icon-button"
          aria-label="Open progress dashboard"
        >
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Ffolder_blue.svg?alt=media&token=3f5b15d2-6e3c-4679-aa98-3d8bc86e4aff"
            alt="Dashboard"
            width={50}
            height={50}
          />
        </button>

        {/* Progress Dashboard Modal */}
        <ProgressDashboard isOpen={showDashboard} onClose={() => setShowDashboard(false)} />

        {/* Search Bar */}
        <div className="search-bar-wrapper">
          <div className="search-bar-container-custom">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search topics..."
              className="search-input"
            />
            {showDropdown && filteredSpecs.length > 0 && (
              <div className="search-dropdown">
                {filteredSpecs.map((spec) => (
                  <div
                    key={spec.id}
                    className="search-dropdown-item"
                    onClick={() => handleSelectTopic(spec.id)}
                  >
                    <span className="search-item-id">{spec.id}</span>
                    <span className="search-item-name">{spec.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

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
                src="/icons/love-letter.svg"
                alt="Progress tracker"
                width={40}
                height={40}
                className="ghost-tracker-icon"
              />
            </div>
          </div>

          {/* Progress text at end of bar */}
          <div className="progress-hours-text">
            {getCumulativeHours(currentSpecIndex).toFixed(2)} / {TOTAL_HOURS} hours
          </div>
        </div>

        {/* Stepping stones container */}
        <div
          className="stepping-stones-container"
          ref={scrollContainerRef}
        >
          <div className="stones-track">
            {/* Render stepping stones */}
            {specPoints.map((spec, index) => {
              // Check if this is the first spec of a new chapter
              const isFirstInChapter = index === 0 || spec.chapter !== specPoints[index - 1].chapter;
              const signpost = getChapterSignpost(spec.chapter, isFirstInChapter);
              const heightOffset = getStoneHeightOffset(index);

              return (
                <div key={spec.id} className="stepping-stone-wrapper">
                  {/* Stepping stone */}
                  <div className="stepping-stone" style={{ transform: `translateY(${heightOffset}px)` }}>
                    {/* Spec point info at TOP */}
                    {spec.type === 'normal' && (
                      <div className="spec-info-top">
                        <div className="spec-title">{spec.id} {spec.name}</div>
                      </div>
                    )}

                    {/* For blended block, show treasure chest above */}
                    {spec.type === 'blended' && (
                      <div className="blended-treasure">
                        <Image
                          src="/icons/treasure-box-blue.svg"
                          alt="Blended Practice"
                          width={60}
                          height={60}
                        />
                      </div>
                    )}

                    {/* Toast icons (one per lesson) - only for normal spec points */}
                    {spec.type === 'normal' && (
                      <div className="toasts-group">
                        {Array.from({ length: spec.lessons }).map((_, lessonIndex) => {
                          const lessonNumber = lessonIndex + 1;
                          const lessonKey = `${spec.id}-${lessonNumber}`;
                          const isCompleted = completedLessons.has(lessonKey);
                          const isOddChapter = spec.chapter % 2 === 1;

                          // Determine which icon to use
                          let iconSrc = "https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2FGroup%202376.svg?alt=media&token=96940cfc-fd51-4c0c-a40b-eca32f113b46";

                          if (isCompleted) {
                            iconSrc = isOddChapter
                              ? "https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Ftoast-purple.svg?alt=media&token=c39230b9-80b9-4689-9ae0-c76d4d253d2a"
                              : "https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Ftoast-blue.svg?alt=media&token=9da68ee7-14a8-454e-ab69-ef62732fa922";
                          }

                          return (
                            <Link
                              key={lessonIndex}
                              href={`/spec-point-session?spec=${spec.id}&lesson=${lessonNumber}&name=${encodeURIComponent(spec.name)}`}
                              className="toast-item"
                            >
                              <Image
                                src={iconSrc}
                                alt={`Lesson ${lessonNumber}`}
                                width={38}
                                height={38}
                              />
                            </Link>
                          );
                        })}
                      </div>
                    )}

                    {/* Bar/platform - different for blended block and chapter colors */}
                    <div className="stone-bar">
                      <Image
                        src={
                          spec.type === 'blended'
                            ? (spec.transitionTo
                              ? "https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fend-of-ch-blue-to-purple.svg?alt=media&token=aab99d41-a396-478b-8f5d-7e9c1d1f6296"
                              : "https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fblendedblock.svg?alt=media&token=71bb36cd-e129-4278-ad60-53c543311295"
                            )
                            : (spec.chapter % 2 === 1
                              ? "https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fpurpleblock.svg?alt=media&token=8703ec4c-6009-472a-96d7-4244a32170db"
                              : "https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fblueblock.svg?alt=media&token=dce6b734-b7bd-4803-bed6-4a426106fb0e"
                            )
                        }
                        alt={spec.type === 'blended' ? "Blended Block" : "Platform"}
                        width={spec.type === 'blended' ? 150 : 132}
                        height={spec.type === 'blended' ? 150 : 33}
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
                            width={77}
                            height={77}
                            className="ghost-icon"
                          />
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Chapter signpost under grass */}
                  {signpost && (
                    <div className="chapter-signpost">
                      <Image
                        src={signpost.url}
                        alt={`Chapter ${signpost.chapter}`}
                        width={120}
                        height={150}
                      />
                      <div className="signpost-text">
                        <div className="signpost-chapter">{signpost.chapter}</div>
                        <div className="signpost-title">{signpost.title}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Scroll Arrow Button - Bottom Right */}
        <button
          onClick={scrollRight}
          className="scroll-arrow-button"
          aria-label="Scroll right"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
