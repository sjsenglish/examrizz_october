'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './videoopen.css';

export default function VideoOpenPage() {
  const [selectedFilters, setSelectedFilters] = useState({
    filter1: false,
    filter2: false
  });

  const videoPlaceholders = Array(4).fill(null);

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#FFFFFF',
      fontFamily: "'Futura PT', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
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
        <button style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
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
      </nav>

      {/* Content with navbar padding */}
      <div style={{ paddingTop: '60px' }}>
        
        {/* Back Button */}
        <div style={{ 
          padding: '20px 40px 0',
          backgroundColor: '#FFFFFF'
        }}>
          <Link 
            href="/video" 
            style={{
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
              width: 'fit-content',
              border: '1px solid #000000'
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </Link>
        </div>

        {/* Main Content Flex Container */}
        <div style={{ 
          display: 'flex',
          gap: '40px',
          padding: '20px 40px'
        }}>
          
          {/* Left Side - Video and Controls */}
          <div style={{ flex: '1', maxWidth: 'calc(100% - 340px)' }}>
            
            {/* Video Title */}
            <h2 style={{
              fontFamily: "'Madimi One', sans-serif",
              fontSize: '28px',
              fontWeight: '400',
              color: '#000000',
              marginBottom: '20px',
              marginLeft: '10%'
            }}>
              Title of content video
            </h2>

            {/* Video Player */}
            <div style={{
              width: '80%',
              height: '449px',
              backgroundColor: '#d0d0d0',
              border: '2px solid #000000',
              marginBottom: '20px',
              marginLeft: '10%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Futura PT', sans-serif",
              fontSize: '24px',
              color: '#666666',
              position: 'relative'
            }}>
              Video Player
            </div>

            {/* Video Controls Bar */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #000000',
              borderRadius: '0px',
              padding: '15px 20px',
              marginBottom: '30px',
              width: '80%',
              marginLeft: '10%',
              boxShadow: '0 4px 0 0 #00CED1, 4px 4px 0 0 #00CED1, 4px 0 0 0 #00CED1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxSizing: 'border-box'
            }}>
              
              {/* Left side controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {/* Bookmark */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ cursor: 'pointer' }}>
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="#000000" strokeWidth="2"/>
                </svg>
              </div>

              {/* Right side controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {/* Volume */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ cursor: 'pointer' }}>
                  <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" stroke="#000000" strokeWidth="2" fill="none"/>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" stroke="#000000" strokeWidth="2" fill="none"/>
                </svg>
                
                {/* Fullscreen */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ cursor: 'pointer' }}>
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" stroke="#000000" strokeWidth="2" fill="none"/>
                </svg>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '15px',
              marginBottom: '40px',
              flexWrap: 'wrap',
              width: '80%',
              marginLeft: '10%'
            }}>
              <button style={{
                padding: '6px 24px',
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
                mark as complete
              </button>
              
              <button style={{
                padding: '6px 24px',
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
                watch later
              </button>
              
              <button style={{
                padding: '6px 24px',
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
                practice
              </button>
              
              {/* Vertical divider */}
              <div style={{
                width: '1px',
                height: '30px',
                backgroundColor: '#000000',
                margin: '0 10px'
              }}></div>
              
              <button style={{
                padding: '6px 24px',
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
                boxShadow: '0 2px 0 0 rgba(0, 0, 0, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}>⏮</span>
                previous
              </button>
              
              <button style={{
                padding: '6px 24px',
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
                boxShadow: '0 2px 0 0 rgba(0, 0, 0, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                next video
                <span style={{
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}>⏭</span>
              </button>
            </div>

            {/* Up Next Section */}
            <div style={{ marginBottom: '10px', marginTop: '10%', marginLeft: '10%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '10px' }}>
                <h3 style={{ 
                  fontFamily: "'Madimi One', sans-serif",
                  fontSize: '18px',
                  fontWeight: '400',
                  color: '#000000',
                  margin: '0'
                }}>
                  Up next
                </h3>
                <button style={{
                  padding: '6px 24px',
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
              </div>
            </div>
          </div>

          {/* Right Side - Filters and Info */}
          <div style={{ 
            width: '300px',
            paddingTop: '0px'
          }}>
            
            {/* Difficulty */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '30px',
              marginTop: '15px'
            }}>
              <span style={{
                fontFamily: "'Figtree', sans-serif",
                fontSize: '14px',
                color: '#000000',
                letterSpacing: '0.04em'
              }}>
                difficulty high [A*]
              </span>
              <div style={{
                display: 'flex',
                gap: '2px'
              }}>
                {[1,2,3,4].map((bar) => (
                  <div 
                    key={bar}
                    style={{
                      width: '4px',
                      height: bar <= 3 ? '16px' : '12px',
                      backgroundColor: '#000000'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Filter Buttons */}
            <div style={{ marginBottom: '25px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button 
                  style={{
                    padding: '8px 24px',
                    backgroundColor: '#B3F0F2',
                    color: '#000000',
                    border: '1px solid #000000',
                    borderRadius: '4px',
                    fontFamily: "'Madimi One', sans-serif",
                    fontSize: '12px',
                    fontWeight: '400',
                    cursor: 'pointer',
                    letterSpacing: '0.04em',
                    textAlign: 'center',
                    boxShadow: '0 2px 0 0 rgba(0, 0, 0, 0.2)',
                    width: '120px'
                  }}
                >
                  FILTER 1
                </button>
                
                <button 
                  style={{
                    padding: '8px 24px',
                    backgroundColor: '#D4D0FF',
                    color: '#000000',
                    border: '1px solid #000000',
                    borderRadius: '4px',
                    fontFamily: "'Madimi One', sans-serif",
                    fontSize: '12px',
                    fontWeight: '400',
                    cursor: 'pointer',
                    letterSpacing: '0.04em',
                    textAlign: 'center',
                    boxShadow: '0 2px 0 0 rgba(0, 0, 0, 0.2)',
                    width: '120px'
                  }}
                >
                  FILTER 2
                </button>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px' }}>
                <div style={{
                  backgroundColor: '#FFFFFF',
                  padding: '6px 12px',
                  border: '1px solid #000000',
                  borderRadius: '4px',
                  boxShadow: '0 2px 0 0 rgba(0, 0, 0, 0.2)',
                  whiteSpace: 'nowrap'
                }}>
                  <span style={{
                    fontFamily: "'Madimi One', sans-serif",
                    fontSize: '12px',
                    color: '#000000',
                    letterSpacing: '0.04em'
                  }}>
                    SPEC PT. 4.1
                  </span>
                </div>
                <div style={{
                  backgroundColor: '#FFFFFF',
                  padding: '6px 12px',
                  border: '1px solid #000000',
                  borderRadius: '4px',
                  boxShadow: '0 2px 0 0 rgba(0, 0, 0, 0.2)',
                  whiteSpace: 'nowrap'
                }}>
                  <span style={{
                    fontFamily: "'Madimi One', sans-serif",
                    fontSize: '12px',
                    color: '#000000',
                    letterSpacing: '0.04em'
                  }}>
                    SPEC PT. 4.2
                  </span>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div style={{ marginBottom: '25px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                marginBottom: '10px'
              }}>
                <span style={{
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '14px',
                  color: '#000000',
                  letterSpacing: '0.04em'
                }}>
                  Timestamps
                </span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              <div style={{
                backgroundColor: '#E0F7FA',
                border: '1px solid #000000',
                borderRadius: '4px',
                padding: '12px',
                width: '120px',
                boxSizing: 'border-box'
              }}>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '12px',
                    color: '#000000',
                    letterSpacing: '0.04em'
                  }}>
                    0:00 Intro
                  </span>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '12px',
                    color: '#000000',
                    letterSpacing: '0.04em'
                  }}>
                    2:34 Key
                  </span>
                </div>
                <div>
                  <span style={{
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '12px',
                    color: '#000000',
                    letterSpacing: '0.04em'
                  }}>
                    8:12 Example
                  </span>
                </div>
              </div>
            </div>

            {/* Ghost Speech Bubble */}
            <div style={{
              position: 'absolute',
              bottom: '96px',
              right: '80px',
              zIndex: 50
            }}>
              <Image 
                src="/icons/speech-bubble-ghost.svg"
                alt="Help"
                width={60}
                height={60}
                style={{ cursor: 'pointer' }}
              />
            </div>

            {/* Help Text */}
            <div style={{
              position: 'absolute',
              bottom: '120px',
              right: '150px',
              backgroundColor: '#E8E3FF',
              border: '1px solid #000000',
              borderRadius: '8px',
              padding: '8px 12px',
              maxWidth: '160px',
              zIndex: 40
            }}>
              <span style={{
                fontFamily: "'Figtree', sans-serif",
                fontSize: '12px',
                color: '#000000',
                letterSpacing: '0.04em'
              }}>
                Did you understand the content well?
              </span>
            </div>
          </div>
        </div>

        {/* Full Width Divider Line Above Videos */}
        <div style={{
          width: '100%',
          height: '1px',
          backgroundColor: '#000000',
          margin: '20px 0'
        }}></div>
        
        {/* Video Navigation Section */}
        <div style={{ padding: '0 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
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
            
            <div style={{ display: 'flex', gap: '15px', flex: '1', justifyContent: 'space-between' }}>
              {videoPlaceholders.map((_, index) => (
                <div 
                  key={index} 
                  style={{ 
                    backgroundColor: '#d0d0d0',
                    border: '1px solid #000000',
                    borderRadius: '8px',
                    height: '160px',
                    width: 'calc(25% - 11.25px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'Futura PT', sans-serif",
                    fontSize: '14px',
                    color: '#666666',
                    cursor: 'pointer'
                  }}
                >
                  Video {index + 1}
                </div>
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
        </div>

        {/* Full Width Divider Line Below Videos */}
        <div style={{
          width: '100%',
          height: '1px',
          backgroundColor: '#000000',
          margin: '30px 0',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
        }}></div>
      </div>
    </div>
  );
}