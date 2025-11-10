'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import '../videogallery.css';

export default function HowToVideoGalleryPage() {
  // Refs for scrolling containers
  const topic1Ref = useRef<HTMLDivElement>(null);
  const topic2Ref = useRef<HTMLDivElement>(null);
  const topic3Ref = useRef<HTMLDivElement>(null);
  const topic4Ref = useRef<HTMLDivElement>(null);
  const topic5Ref = useRef<HTMLDivElement>(null);

  // Scroll function
  const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Topic 1 videos (8 videos)
  const topic1Videos = Array(8).fill(null).map((_, index) => ({
    id: index + 4,
    title: `Video Description Topic or something`
  }));

  // Topic 2 videos (8 videos)
  const topic2Videos = Array(8).fill(null).map((_, index) => ({
    id: index + 12,
    title: `Video Description Topic or something`
  }));

  // Topic 3 videos (8 videos)
  const topic3Videos = Array(8).fill(null).map((_, index) => ({
    id: index + 20,
    title: `Video Description Topic or something`
  }));

  // Topic 4 videos (8 videos)
  const topic4Videos = Array(8).fill(null).map((_, index) => ({
    id: index + 28,
    title: `Video Description Topic or something`
  }));

  // Topic 5 videos (8 videos)
  const topic5Videos = Array(8).fill(null).map((_, index) => ({
    id: index + 36,
    title: `Video Description Topic or something`
  }));

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#FFFFFF',
      fontFamily: "'Figtree', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      <Navbar />

      {/* Content with navbar padding */}
      <div style={{ paddingTop: '60px' }}>

        {/* Main Video Section - Full Width */}
        <div style={{ 
        position: 'relative',
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        height: '600px',
        backgroundColor: '#d0d0d0',
        marginBottom: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Figtree', sans-serif",
        fontSize: '24px',
        color: '#666666',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
      }}>
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
              fontFamily: "'Madimi One', sans-serif",
              fontSize: '17px',
              fontWeight: '400',
              color: '#000000',
              marginBottom: '18px',
              textAlign: 'left'
            }}>
              The How To Series
            </h2>
            <button style={{
              padding: '8px 21px',
              backgroundColor: '#00CED1',
              color: '#000000',
              border: '1px solid #000000',
              borderRadius: '6px',
              fontFamily: "'Madimi One', sans-serif",
              fontSize: '13px',
              fontWeight: '400',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              margin: '0 auto',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 0 0 rgba(0, 0, 0, 0.2)'
            }}>
              Start video series
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Karaoke Ghost Icon */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '310px',
          zIndex: 10
        }}>
          <Image
            src="/svg/ghost-karaoke.svg"
            alt="Singing Ghost"
            width={120}
            height={150}
          />
        </div>
        
        {/* Back Button on top of video */}
        <Link 
          href="/video" 
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
            fontFamily: "'Madimi One', sans-serif",
            fontSize: '13px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            zIndex: 10
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </Link>
        </div>

        {/* Main Content Area */}
        <div style={{ 
          padding: '0 40px',
          marginTop: '40px'
        }}>

          {/* Topic Section */}
          <div style={{ width: '100%' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '30px',
              marginBottom: '30px'
            }}>
              <h2 style={{
                fontFamily: "'Madimi One', sans-serif",
                fontSize: '24px',
                fontWeight: '400',
                color: '#000000',
                margin: '0'
              }}>
                How to read, write, and take notes
              </h2>
              <button style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: '1px solid #000000',
                borderRadius: '4px',
                fontFamily: "'Madimi One', sans-serif",
                fontSize: '12px',
                color: '#000000',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 0 0 rgba(0, 0, 0, 0.2)'
              }}>
                start topic
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="9,6 9,18 17,12" fill="#000000"/>
                </svg>
              </button>
              
            </div>

            {/* Divider Line */}
            <div style={{
              width: '100vw',
              marginLeft: 'calc(-50vw + 50%)',
              height: '1px',
              backgroundColor: '#000000',
              marginBottom: '30px'
            }}></div>

            {/* Video Carousel - 4 videos visible at a time */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
              {/* Left Arrow */}
              <button
                onClick={() => scroll(topic1Ref, 'left')}
                style={{
                  padding: '15px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #000000',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  flexShrink: 0
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Scrollable Container */}
              <div
                ref={topic1Ref}
                style={{
                  display: 'flex',
                  gap: '40px',
                  overflow: 'hidden',
                  scrollBehavior: 'smooth',
                  flex: 1
                }}
              >
                {topic1Videos.map((video, index) => (
                  <Link key={video.id} href={`/video/${video.id}`} style={{ textDecoration: 'none', minWidth: 'calc(25% - 30px)', flexShrink: 0 }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer'
                    }}>
                      <div style={{
                        backgroundColor: '#d0d0d0',
                        border: '1px solid #000000',
                        borderRadius: '4px',
                        padding: '20px',
                        height: '200px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                        marginBottom: '10px',
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
                        <div style={{
                          fontFamily: "'Figtree', sans-serif",
                          fontSize: '24px',
                          color: '#666666',
                          textAlign: 'center'
                        }}>
                          Video Player
                        </div>
                      </div>

                      <div style={{
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: '12px',
                        color: '#000000',
                        letterSpacing: '0.04em',
                        textAlign: 'left'
                      }}>
                        {video.title}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Right Arrow */}
              <button
                onClick={() => scroll(topic1Ref, 'right')}
                style={{
                  padding: '15px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #000000',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  flexShrink: 0
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            {/* Divider line below videos */}
            <div style={{
              width: '100vw',
              marginLeft: 'calc(-50vw + 50%)',
              height: '1px',
              backgroundColor: '#000000',
              marginTop: '30px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            }}></div>
          </div>

          {/* Topic 2 Section */}
          <div style={{ width: '100%', marginTop: '40px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '30px',
              marginBottom: '30px'
            }}>
              <h2 style={{
                fontFamily: "'Madimi One', sans-serif",
                fontSize: '24px',
                fontWeight: '400',
                color: '#000000',
                margin: '0'
              }}>
                How to make your studying efficient
              </h2>
              <button style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: '1px solid #000000',
                borderRadius: '4px',
                fontFamily: "'Madimi One', sans-serif",
                fontSize: '12px',
                color: '#000000',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 0 0 rgba(0, 0, 0, 0.2)'
              }}>
                start topic
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="9,6 9,18 17,12" fill="#000000"/>
                </svg>
              </button>
              
            </div>

            {/* Divider Line */}
            <div style={{
              width: '100vw',
              marginLeft: 'calc(-50vw + 50%)',
              height: '1px',
              backgroundColor: '#000000',
              marginBottom: '30px'
            }}></div>

            {/* Video Carousel - 4 videos visible at a time */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
              {/* Left Arrow */}
              <button
                onClick={() => scroll(topic2Ref, 'left')}
                style={{
                  padding: '15px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #000000',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  flexShrink: 0
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Scrollable Container */}
              <div
                ref={topic2Ref}
                style={{
                  display: 'flex',
                  gap: '40px',
                  overflow: 'hidden',
                  scrollBehavior: 'smooth',
                  flex: 1
                }}
              >
                {topic2Videos.map((video, index) => (
                  <Link key={video.id} href={`/video/${video.id}`} style={{ textDecoration: 'none', minWidth: 'calc(25% - 30px)', flexShrink: 0 }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer'
                    }}>
                      <div style={{
                        backgroundColor: '#d0d0d0',
                        border: '1px solid #000000',
                        borderRadius: '4px',
                        padding: '20px',
                        height: '200px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                        marginBottom: '10px',
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
                        <div style={{
                          fontFamily: "'Figtree', sans-serif",
                          fontSize: '24px',
                          color: '#666666',
                          textAlign: 'center'
                        }}>
                          Video Player
                        </div>
                      </div>

                      <div style={{
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: '12px',
                        color: '#000000',
                        letterSpacing: '0.04em',
                        textAlign: 'left'
                      }}>
                        {video.title}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Right Arrow */}
              <button
                onClick={() => scroll(topic2Ref, 'right')}
                style={{
                  padding: '15px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #000000',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  flexShrink: 0
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            {/* Divider line below videos */}
            <div style={{
              width: '100vw',
              marginLeft: 'calc(-50vw + 50%)',
              height: '1px',
              backgroundColor: '#000000',
              marginTop: '30px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            }}></div>
          </div>

          {/* Topic 3 Section */}
          <div style={{ width: '100%', marginTop: '40px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '30px',
              marginBottom: '30px'
            }}>
              <h2 style={{
                fontFamily: "'Madimi One', sans-serif",
                fontSize: '24px',
                fontWeight: '400',
                color: '#000000',
                margin: '0'
              }}>
                How to make your studying efficient
              </h2>
              <button style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: '1px solid #000000',
                borderRadius: '4px',
                fontFamily: "'Madimi One', sans-serif",
                fontSize: '12px',
                color: '#000000',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 0 0 rgba(0, 0, 0, 0.2)'
              }}>
                start topic
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="9,6 9,18 17,12" fill="#000000"/>
                </svg>
              </button>
            </div>

            {/* Divider Line */}
            <div style={{
              width: '100vw',
              marginLeft: 'calc(-50vw + 50%)',
              height: '1px',
              backgroundColor: '#000000',
              marginBottom: '30px'
            }}></div>

            {/* Video Carousel - 4 videos visible at a time */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
              {/* Left Arrow */}
              <button
                onClick={() => scroll(topic3Ref, 'left')}
                style={{
                  padding: '15px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #000000',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  flexShrink: 0
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Scrollable Container */}
              <div
                ref={topic3Ref}
                style={{
                  display: 'flex',
                  gap: '40px',
                  overflow: 'hidden',
                  scrollBehavior: 'smooth',
                  flex: 1
                }}
              >
                {topic3Videos.map((video, index) => (
                  <Link key={video.id} href={`/video/${video.id}`} style={{ textDecoration: 'none', minWidth: 'calc(25% - 30px)', flexShrink: 0 }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer'
                    }}>
                      <div style={{
                        backgroundColor: '#d0d0d0',
                        border: '1px solid #000000',
                        borderRadius: '4px',
                        padding: '20px',
                        height: '200px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                        marginBottom: '10px',
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
                        <div style={{
                          fontFamily: "'Figtree', sans-serif",
                          fontSize: '24px',
                          color: '#666666',
                          textAlign: 'center'
                        }}>
                          Video Player
                        </div>
                      </div>

                      <div style={{
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: '12px',
                        color: '#000000',
                        letterSpacing: '0.04em',
                        textAlign: 'left'
                      }}>
                        {video.title}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Right Arrow */}
              <button
                onClick={() => scroll(topic3Ref, 'right')}
                style={{
                  padding: '15px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #000000',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  flexShrink: 0
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Divider line below videos */}
            <div style={{
              width: '100vw',
              marginLeft: 'calc(-50vw + 50%)',
              height: '1px',
              backgroundColor: '#000000',
              marginTop: '30px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            }}></div>
          </div>

          {/* Topic 4 Section */}
          <div style={{ width: '100%', marginTop: '40px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '30px',
              marginBottom: '30px'
            }}>
              <h2 style={{
                fontFamily: "'Madimi One', sans-serif",
                fontSize: '24px',
                fontWeight: '400',
                color: '#000000',
                margin: '0'
              }}>
                How to make your studying efficient
              </h2>
              <button style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: '1px solid #000000',
                borderRadius: '4px',
                fontFamily: "'Madimi One', sans-serif",
                fontSize: '12px',
                color: '#000000',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 0 0 rgba(0, 0, 0, 0.2)'
              }}>
                start topic
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="9,6 9,18 17,12" fill="#000000"/>
                </svg>
              </button>
            </div>

            {/* Divider Line */}
            <div style={{
              width: '100vw',
              marginLeft: 'calc(-50vw + 50%)',
              height: '1px',
              backgroundColor: '#000000',
              marginBottom: '30px'
            }}></div>

            {/* Video Carousel - 4 videos visible at a time */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
              {/* Left Arrow */}
              <button
                onClick={() => scroll(topic4Ref, 'left')}
                style={{
                  padding: '15px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #000000',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  flexShrink: 0
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Scrollable Container */}
              <div
                ref={topic4Ref}
                style={{
                  display: 'flex',
                  gap: '40px',
                  overflow: 'hidden',
                  scrollBehavior: 'smooth',
                  flex: 1
                }}
              >
                {topic4Videos.map((video, index) => (
                  <Link key={video.id} href={`/video/${video.id}`} style={{ textDecoration: 'none', minWidth: 'calc(25% - 30px)', flexShrink: 0 }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer'
                    }}>
                      <div style={{
                        backgroundColor: '#d0d0d0',
                        border: '1px solid #000000',
                        borderRadius: '4px',
                        padding: '20px',
                        height: '200px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                        marginBottom: '10px',
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
                        <div style={{
                          fontFamily: "'Figtree', sans-serif",
                          fontSize: '24px',
                          color: '#666666',
                          textAlign: 'center'
                        }}>
                          Video Player
                        </div>
                      </div>

                      <div style={{
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: '12px',
                        color: '#000000',
                        letterSpacing: '0.04em',
                        textAlign: 'left'
                      }}>
                        {video.title}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Right Arrow */}
              <button
                onClick={() => scroll(topic4Ref, 'right')}
                style={{
                  padding: '15px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #000000',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  flexShrink: 0
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Divider line below videos */}
            <div style={{
              width: '100vw',
              marginLeft: 'calc(-50vw + 50%)',
              height: '1px',
              backgroundColor: '#000000',
              marginTop: '30px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            }}></div>
          </div>

          {/* Topic 5 Section */}
          <div style={{ width: '100%', marginTop: '40px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '30px',
              marginBottom: '30px'
            }}>
              <h2 style={{
                fontFamily: "'Madimi One', sans-serif",
                fontSize: '24px',
                fontWeight: '400',
                color: '#000000',
                margin: '0'
              }}>
                How to make your studying efficient
              </h2>
              <button style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: '1px solid #000000',
                borderRadius: '4px',
                fontFamily: "'Madimi One', sans-serif",
                fontSize: '12px',
                color: '#000000',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 0 0 rgba(0, 0, 0, 0.2)'
              }}>
                start topic
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="9,6 9,18 17,12" fill="#000000"/>
                </svg>
              </button>
            </div>

            {/* Divider Line */}
            <div style={{
              width: '100vw',
              marginLeft: 'calc(-50vw + 50%)',
              height: '1px',
              backgroundColor: '#000000',
              marginBottom: '30px'
            }}></div>

            {/* Video Carousel - 4 videos visible at a time */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
              {/* Left Arrow */}
              <button
                onClick={() => scroll(topic5Ref, 'left')}
                style={{
                  padding: '15px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #000000',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  flexShrink: 0
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Scrollable Container */}
              <div
                ref={topic5Ref}
                style={{
                  display: 'flex',
                  gap: '40px',
                  overflow: 'hidden',
                  scrollBehavior: 'smooth',
                  flex: 1
                }}
              >
                {topic5Videos.map((video, index) => (
                  <Link key={video.id} href={`/video/${video.id}`} style={{ textDecoration: 'none', minWidth: 'calc(25% - 30px)', flexShrink: 0 }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer'
                    }}>
                      <div style={{
                        backgroundColor: '#d0d0d0',
                        border: '1px solid #000000',
                        borderRadius: '4px',
                        padding: '20px',
                        height: '200px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                        marginBottom: '10px',
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
                        <div style={{
                          fontFamily: "'Figtree', sans-serif",
                          fontSize: '24px',
                          color: '#666666',
                          textAlign: 'center'
                        }}>
                          Video Player
                        </div>
                      </div>

                      <div style={{
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: '12px',
                        color: '#000000',
                        letterSpacing: '0.04em',
                        textAlign: 'left'
                      }}>
                        {video.title}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Right Arrow */}
              <button
                onClick={() => scroll(topic5Ref, 'right')}
                style={{
                  padding: '15px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #000000',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  flexShrink: 0
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Divider line below videos */}
            <div style={{
              width: '100vw',
              marginLeft: 'calc(-50vw + 50%)',
              height: '1px',
              backgroundColor: '#000000',
              marginTop: '30px',
              marginBottom: '60px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}