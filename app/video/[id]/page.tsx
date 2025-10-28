'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function IndividualVideoPage() {
  const params = useParams();
  const videoId = params?.id;

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

      {/* Video Content */}
      <div style={{ paddingTop: '60px' }}>
        {/* Full Width Video Section */}
        <div style={{ 
          position: 'relative',
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          height: '600px',
          backgroundColor: '#d0d0d0',
          marginBottom: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Futura PT', sans-serif",
          fontSize: '24px',
          color: '#666666',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
        }}>
          {/* Back Button */}
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

          {/* Video Player Placeholder */}
          <div style={{
            fontSize: '32px',
            textAlign: 'center'
          }}>
            Video Player {videoId}
          </div>
        </div>

        {/* Video Info Section */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 40px'
        }}>
          <h1 style={{
            fontFamily: "'Madimi One', cursive",
            fontSize: '28px',
            fontWeight: '400',
            color: '#000000',
            marginBottom: '20px'
          }}>
            Video Title {videoId}
          </h1>
          
          <div style={{
            display: 'flex',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <button style={{
              padding: '10px 20px',
              backgroundColor: '#00CED1',
              color: '#000000',
              border: '1px solid #000000',
              borderRadius: '6px',
              fontFamily: "'Madimi One', sans-serif",
              fontSize: '14px',
              fontWeight: '400',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 0 0 rgba(0, 0, 0, 0.2)'
            }}>
              Like
            </button>
            
            <button style={{
              padding: '10px 20px',
              backgroundColor: '#E0F7FA',
              color: '#000000',
              border: '1px solid #000000',
              borderRadius: '6px',
              fontFamily: "'Madimi One', sans-serif",
              fontSize: '14px',
              fontWeight: '400',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 0 0 rgba(0, 0, 0, 0.2)'
            }}>
              Save
            </button>
            
            <button style={{
              padding: '10px 20px',
              backgroundColor: '#E0F7FA',
              color: '#000000',
              border: '1px solid #000000',
              borderRadius: '6px',
              fontFamily: "'Madimi One', sans-serif",
              fontSize: '14px',
              fontWeight: '400',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 0 0 rgba(0, 0, 0, 0.2)'
            }}>
              Share
            </button>
          </div>

          <div style={{
            backgroundColor: '#F8F8F5',
            border: '1px solid #000000',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '40px'
          }}>
            <h3 style={{
              fontFamily: "'Madimi One', sans-serif",
              fontSize: '18px',
              fontWeight: '400',
              color: '#000000',
              marginBottom: '10px'
            }}>
              Description
            </h3>
            <p style={{
              fontFamily: "'Futura PT', sans-serif",
              fontSize: '14px',
              color: '#333333',
              lineHeight: '1.6',
              margin: '0'
            }}>
              This is a placeholder description for video {videoId}. This video covers important concepts and provides detailed explanations with examples.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}