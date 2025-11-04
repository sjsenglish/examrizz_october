'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function ArenaPage() {
  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#FAFAFA',
      paddingTop: '60px'
    }}>
      <Navbar />

      {/* Main Content */}
      <div style={{ padding: '40px' }}>
        {/* Back Button */}
        <Link 
          href="/" 
          style={{
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
            width: 'fit-content',
            marginBottom: '24px'
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </Link>

        {/* Arena Content */}
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            color: '#333333',
            marginBottom: '24px',
            fontFamily: "'Madimi One', cursive"
          }}>
            Arena
          </h1>
          
          <p style={{
            fontSize: '20px',
            color: '#666666',
            marginBottom: '40px',
            lineHeight: '1.6'
          }}>
            Compete with other students, join challenges, and find others aiming for the same course.
          </p>

          {/* Feature Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            marginBottom: '40px'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '32px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              textAlign: 'left'
            }}>
              <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: '#333' }}>
                🏆 Challenges
              </h3>
              <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.5' }}>
                Participate in academic challenges and compete with students from around the world.
              </p>
            </div>

            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '32px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              textAlign: 'left'
            }}>
              <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: '#333' }}>
                👥 Find Your Peers
              </h3>
              <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.5' }}>
                Connect with other students applying to the same universities and courses.
              </p>
            </div>

            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '32px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              textAlign: 'left'
            }}>
              <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: '#333' }}>
                📊 Leaderboards
              </h3>
              <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.5' }}>
                Track your progress and see how you rank against other students.
              </p>
            </div>
          </div>

          {/* Coming Soon Section */}
          <div style={{
            backgroundColor: '#E0F7FA',
            borderRadius: '12px',
            padding: '40px',
            border: '2px solid #00CED1'
          }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#00CED1',
              marginBottom: '16px'
            }}>
              Features Coming Soon
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#333',
              marginBottom: '24px'
            }}>
              We're working hard to bring you the ultimate competitive learning experience.
            </p>
            <button style={{
              backgroundColor: '#00CED1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 32px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Get Notified
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}