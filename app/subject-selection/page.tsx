'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import './subject-selection.css';

export default function SubjectSelectionPage() {
  return (
    <div className="subject-selection-page">
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

        <div className="main-content">
          <div className="content-container">
            <h1 className="main-title">Choose Your Subject</h1>

            <p className="subtitle">
              Select which area of mathematics you'd like to explore
            </p>

            <div className="subjects-grid">
              <Link href="/maths-demo" className="subject-card">
                <div className="icon-container">
                  <Image
                    src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fbook_blue.svg?alt=media&token=817ca445-ef40-4a0a-8312-06e293c5b5cb"
                    alt="Pure Maths"
                    width={120}
                    height={120}
                    className="subject-icon"
                  />
                </div>
                <h3 className="subject-title">Pure Maths</h3>
              </Link>

              <div className="subject-card disabled">
                <div className="icon-container">
                  <Image
                    src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fbook_pink.svg?alt=media&token=eca318d2-2785-4ffe-b806-e15381734a28"
                    alt="Statistics"
                    width={120}
                    height={120}
                    className="subject-icon"
                  />
                </div>
                <h3 className="subject-title">Statistics</h3>
              </div>

              <div className="subject-card disabled">
                <div className="icon-container">
                  <Image
                    src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fbook_purple.svg?alt=media&token=362b7fc3-8bce-44fa-b862-2d39958c241b"
                    alt="Mechanics"
                    width={120}
                    height={120}
                    className="subject-icon"
                  />
                </div>
                <h3 className="subject-title">Mechanics</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
