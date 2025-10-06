'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Import the fonts used in search page
import './video.css';

export default function VideoPage() {
  const [selectedSubject, setSelectedSubject] = useState('');

  const subjects = [
    'A Level Chemistry AQA',
    'A Level Biology AQA', 
    'A Level Maths AQA',
    'A Level Physics AQA'
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

      {/* Featured Video Section - Full Width */}
      <div style={{ 
        position: 'relative',
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        height: '520px',
        backgroundColor: '#d0d0d0',
        marginBottom: '40px',
        marginTop: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Futura PT', sans-serif",
        fontSize: '24px',
        color: '#666666',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
      }}>
        Featured Video
        
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
            zIndex: 10
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
              Learn A Level Maths with videos and original practice questions!
            </p>
            <button style={{
              padding: '8px 21px',
              backgroundColor: '#00CED1',
              color: '#000000',
              border: '1px solid #000000',
              borderRadius: '6px',
              fontFamily: "'Madimi One', cursive",
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
          zIndex: 10
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
            <select 
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              style={{
                padding: '12px 20px',
                fontSize: '16px',
                border: '1px solid #000000',
                backgroundColor: '#E0F7FA',
                fontFamily: "'Figtree', sans-serif",
                fontWeight: '400',
                minWidth: '350px',
                outline: 'none',
                marginLeft: '40px',
                letterSpacing: '0.04em'
              }}
            >
              <option value="">Select subject</option>
              {subjects.map((subject, index) => (
                <option key={index} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button style={{
              display: 'flex',
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
              display: 'flex',
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
                A Level Chemistry AQA
              </h3>
              <Link href="/videogallery" style={{ textDecoration: 'none' }}>
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
                <div 
                  key={index} 
                  style={{ 
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
                    cursor: index === 0 ? 'pointer' : 'default'
                  }}
                  onClick={index === 0 ? () => window.location.href = '/videoopen' : undefined}
                >
                  Video {index + 1}
                  {index === 0 && (
                    <Link href="/videoopen" style={{ 
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
                      textDecoration: 'none',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                      transition: 'all 0.3s ease'
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <polygon points="9,6 9,18 17,12" fill="#000000"/>
                      </svg>
                    </Link>
                  )}
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
                A Level Biology AQA
              </h3>
              <Link href="/videogallery" style={{ textDecoration: 'none' }}>
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
                <div 
                  key={index} 
                  style={{ 
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
                    color: '#666666'
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