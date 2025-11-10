'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Import the fonts used in search page
import './video.css';

export default function VideoPage() {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && event.target instanceof Node && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let startTime = 0;

    const handleLoadedMetadata = () => {
      const duration = video.duration;
      const maxStartTime = Math.max(0, duration - 15);
      startTime = Math.random() * maxStartTime;
      
      video.currentTime = startTime;
      video.play().catch(console.error);
    };

    const handleTimeUpdate = () => {
      const video = videoRef.current;
      if (!video) return;
      
      const playedDuration = video.currentTime - startTime;
      if (playedDuration >= 15) {
        video.pause();
        video.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      if (video) {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, []);

  const subjects = [
    'Maths',
    'Physics',
    'Economics', 
    'Biology',
    'Chemistry'
  ];

  const videoPlaceholders = Array(3).fill(null);

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#FFFFFF',
      fontFamily: "'Futura PT', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      overflowY: 'auto',
      height: '100vh'
    }}>
      {/* Navbar */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: '#F8F8F5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        zIndex: 100,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <h1 style={{
            fontFamily: "'Madimi One', cursive",
            fontSize: '24px',
            fontWeight: '400',
            color: '#000000',
            margin: '0',
            cursor: 'pointer'
          }}>
            examrizzsearch
          </h1>
        </Link>
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <div style={{
              width: '20px',
              height: '2px',
              backgroundColor: '#000000',
              borderRadius: '1px'
            }}></div>
            <div style={{
              width: '20px',
              height: '2px',
              backgroundColor: '#000000',
              borderRadius: '1px'
            }}></div>
            <div style={{
              width: '20px',
              height: '2px',
              backgroundColor: '#000000',
              borderRadius: '1px'
            }}></div>
          </button>
          
          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: '0',
              marginTop: '8px',
              backgroundColor: '#FFFFFF',
              border: '2px solid #000000',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              zIndex: 1000,
              minWidth: '160px',
              padding: '8px 0'
            }}>
              <Link 
                href="/terms-and-conditions"
                style={{
                  display: 'block',
                  padding: '12px 20px',
                  color: '#000000',
                  textDecoration: 'none',
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '14px',
                  fontWeight: '500',
                  letterSpacing: '0.04em',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F8F8F5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={() => setShowDropdown(false)}
              >
                Terms & Conditions
              </Link>
              <Link 
                href="/payment"
                style={{
                  display: 'block',
                  padding: '12px 20px',
                  color: '#000000',
                  textDecoration: 'none',
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '14px',
                  fontWeight: '500',
                  letterSpacing: '0.04em',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F8F8F5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={() => setShowDropdown(false)}
              >
                Payment
              </Link>
              <Link 
                href="/help"
                style={{
                  display: 'block',
                  padding: '12px 20px',
                  color: '#000000',
                  textDecoration: 'none',
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '14px',
                  fontWeight: '500',
                  letterSpacing: '0.04em',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F8F8F5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={() => setShowDropdown(false)}
              >
                Help
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Featured Video Section - Full Width */}
      <div style={{ 
        position: 'relative',
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        height: '520px',
        marginBottom: '40px',
        marginTop: '60px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
      }}>
        <video
          ref={videoRef}
          src="https://examrizzjoemathsvideos.s3.eu-central-1.amazonaws.com/7.1_L/7_1+Lesson+1+Differentiation.mov"
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1
          }}
        />
        
        {/* Back Button on top of video */}
        <Link 
          href="/" 
          style={{
            position: 'absolute',
            top: '30px',
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
        
        {/* Info Box in Bottom Left Corner */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '40px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #000000',
          padding: '21px',
          width: '245px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ 
              fontFamily: "'Madimi One', cursive",
              fontSize: '17px',
              fontWeight: '400',
              color: '#000000',
              marginBottom: '6px'
            }}>
              The Examrizz A Level
            </h2>
            <h3 style={{ 
              fontFamily: "'Madimi One', cursive",
              fontSize: '17px',
              fontWeight: '400',
              color: '#000000',
              marginBottom: '14px'
            }}>
              Maths Video Bank
            </h3>
            <p style={{ 
              fontFamily: "'Futura PT', sans-serif",
              fontSize: '11px',
              fontWeight: 'bold',
              color: '#333333',
              lineHeight: '1.4',
              marginBottom: '18px'
            }}>
              Start learning with bitesized videos!
            </p>
            <button
              disabled
              style={{
                padding: '8px 21px',
                backgroundColor: '#00CED1',
                color: '#000000',
                border: '1px solid #000000',
                borderRadius: '6px',
                fontFamily: "'Madimi One', cursive",
                fontSize: '13px',
                fontWeight: '400',
                cursor: 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                margin: '0 auto',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 0 0 rgba(0, 0, 0, 0.2)',
                opacity: 0.5
              }}>
              Start maths series
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Singing Ghost Icon */}
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '320px',
          zIndex: 20
        }}>
          <Image
            src="/svg/ghost-karaoke.svg"
            alt="Singing Ghost"
            width={160}
            height={200}
          />
        </div>
      </div>

      <div style={{ padding: '0 20px 40px', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Subject Selection and Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div ref={dropdownRef} style={{ position: 'relative', marginLeft: '40px', display: 'none' }}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                  padding: '12px 40px 12px 20px',
                  fontSize: '16px',
                  border: '1px solid #000000',
                  backgroundColor: '#DFF8F9',
                  fontFamily: "'Figtree', sans-serif",
                  fontWeight: '400',
                  minWidth: '350px',
                  outline: 'none',
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                {selectedSubject || 'Select subject'}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{
                    transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                  }}
                >
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {isDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  width: '100%',
                  backgroundColor: '#DFF8F9',
                  border: '1px solid #000000',
                  borderTop: 'none',
                  zIndex: 1000,
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  {subjects.map((subject, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedSubject(subject);
                        setIsDropdownOpen(false);
                      }}
                      style={{
                        padding: '12px 20px',
                        fontSize: '16px',
                        fontFamily: "'Figtree', sans-serif",
                        fontWeight: '400',
                        letterSpacing: '0.04em',
                        cursor: 'pointer',
                        backgroundColor: subject === 'Physics' ? '#95EAEC' : '#DFF8F9',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (subject !== 'Physics') {
                          (e.target as HTMLElement).style.backgroundColor = '#95EAEC';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (subject !== 'Physics') {
                          (e.target as HTMLElement).style.backgroundColor = '#DFF8F9';
                        }
                      }}
                    >
                      {subject}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button style={{
              display: 'none',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              backgroundColor: '#E0F7FA',
              color: '#000000',
              border: '1px solid #000000',
              borderRadius: '4px',
              fontFamily: "'Figtree', sans-serif",
              fontSize: '14px',
              fontWeight: '400',
              cursor: 'pointer',
              letterSpacing: '0.04em',
              boxShadow: '0 2px 0 0 rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease',
              height: '48px'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <div style={{ textAlign: 'right', lineHeight: '1.1', fontSize: '14px' }}>
                watch<br />later
              </div>
            </button>
            <button style={{
              display: 'none',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              backgroundColor: '#E0F7FA',
              color: '#000000',
              border: '1px solid #000000',
              borderRadius: '4px',
              fontFamily: "'Figtree', sans-serif",
              fontSize: '14px',
              fontWeight: '400',
              cursor: 'pointer',
              letterSpacing: '0.04em',
              boxShadow: '0 2px 0 0 rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Saved
            </button>
          </div>
        </div>

        {/* A Level Chemistry AQA Section */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <h3 style={{ 
                fontFamily: "'Madimi One', cursive",
                fontSize: '22px',
                fontWeight: '400',
                color: '#000000'
              }}>
                English Lit Fundamentals
              </h3>
              <Link href="/videogallery/english" style={{ textDecoration: 'none' }}>
                <button style={{
                  padding: '8px 16px',
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  border: '1px solid #000000',
                  borderRadius: '4px',
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '14px',
                  fontWeight: '400',
                  cursor: 'pointer',
                  letterSpacing: '0.04em',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 0 0 rgba(0, 0, 0, 0.2)'
                }}>
                  open video gallery
                </button>
              </Link>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ cursor: 'pointer' }}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#000000" strokeWidth="1.5" fill="none"/>
              </svg>
            </div>
          </div>
          
          {/* Full-width divider below title */}
          <div style={{
            width: '100vw',
            marginLeft: 'calc(-50vw + 50%)',
            height: '2px',
            backgroundColor: '#000000',
            marginBottom: '20px'
          }}></div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button style={{
              padding: '15px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #000000',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <div style={{ display: 'flex', gap: '20px', flex: '1', justifyContent: 'space-between' }}>
              {videoPlaceholders.map((_, index) => (
                <Link key={index} href={`/video/${index + 1}`} style={{ textDecoration: 'none' }}>
                  <div style={{ 
                    backgroundColor: '#d0d0d0',
                    border: '1px solid #000000',
                    borderRadius: '8px',
                    height: '200px',
                    width: '350px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'Futura PT', sans-serif",
                    fontSize: '14px',
                    color: '#666666',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    Video {index + 1}
                    <div style={{ 
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '50%',
                      width: '60px',
                      height: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                      transition: 'all 0.3s ease'
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <polygon points="9,6 9,18 17,12" fill="#000000"/>
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <button style={{
              padding: '15px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #000000',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          
          {/* Full-width divider below Chemistry video set */}
          <div style={{
            width: '100vw',
            marginLeft: 'calc(-50vw + 50%)',
            height: '2px',
            backgroundColor: '#000000',
            marginTop: '40px',
            marginBottom: '60px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}></div>
        </div>

        {/* A Level Biology AQA Section */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <h3 style={{ 
                fontFamily: "'Madimi One', cursive",
                fontSize: '22px',
                fontWeight: '400',
                color: '#000000'
              }}>
                The How To Series
              </h3>
              <Link href="/videogallery/howto" style={{ textDecoration: 'none' }}>
                <button style={{
                  padding: '8px 16px',
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  border: '1px solid #000000',
                  borderRadius: '4px',
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '14px',
                  fontWeight: '400',
                  cursor: 'pointer',
                  letterSpacing: '0.04em',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 0 0 rgba(0, 0, 0, 0.2)'
                }}>
                  open video gallery
                </button>
              </Link>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ cursor: 'pointer' }}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#000000" strokeWidth="1.5" fill="#e4e0f7"/>
              </svg>
            </div>
          </div>
          
          {/* Full-width divider below title */}
          <div style={{
            width: '100vw',
            marginLeft: 'calc(-50vw + 50%)',
            height: '2px',
            backgroundColor: '#000000',
            marginBottom: '20px'
          }}></div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button style={{
              padding: '15px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #000000',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <div style={{ display: 'flex', gap: '20px', flex: '1', justifyContent: 'space-between' }}>
              {videoPlaceholders.map((_, index) => (
                <Link key={index} href={`/video/${index + 4}`} style={{ textDecoration: 'none' }}>
                  <div style={{ 
                    backgroundColor: '#d0d0d0',
                    border: '1px solid #000000',
                    borderRadius: '8px',
                    height: '200px',
                    width: '350px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'Futura PT', sans-serif",
                    fontSize: '14px',
                    color: '#666666',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    Video {index + 1}
                    <div style={{ 
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '50%',
                      width: '60px',
                      height: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                      transition: 'all 0.3s ease'
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <polygon points="9,6 9,18 17,12" fill="#000000"/>
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <button style={{
              padding: '15px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #000000',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          
          {/* Full-width divider below Biology video set */}
          <div style={{
            width: '100vw',
            marginLeft: 'calc(-50vw + 50%)',
            height: '2px',
            backgroundColor: '#000000',
            marginTop: '40px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}></div>
        </div>
      </div>
    </div>
  );
}