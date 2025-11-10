'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import './maths-demo.css';

export default function MathsDemoPage() {
  const [showProgressBox, setShowProgressBox] = useState(true);

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

        <div className="demo-container">
          {/* Main level map area */}
          <div className="level-map">
            {/* Title badge */}
            <div className="title-badge">
              Maths A Level - 90 hours
            </div>

            {/* Ghost character */}
            <div className="ghost-character">
              <Link href="/spec-point-session" className="ghost-link">
                <Image
                  src="/icons/pixel-ghost-w-sword-yellow.svg"
                  alt="Ghost Character"
                  width={160}
                  height={160}
                  className="ghost-icon"
                />
              </Link>
              <div className="speech-bubble">
                Jump to your topic or click me to carry on where you left off
              </div>
            </div>

            {/* Loveletter ghost */}
            <div className="loveletter-ghost">
              <div className="loveletter-speech-bubble">
                Click on a toast to start learning!
              </div>
              <Image
                src="/icons/love-letter.svg"
                alt="Love Letter"
                width={80}
                height={80}
                className="loveletter-icon"
              />
            </div>

            {/* Treasure box at center top */}
            <div className="treasure-box center-top">
              <Image
                src="/icons/treasure-box-blue.svg"
                alt="Treasure Box"
                width={150}
                height={150}
              />
            </div>

            {/* Purple toasts (completed levels) */}
            <div className="toast purple toast-1">
              <Image src="/icons/toast-purple.svg" alt="Completed Level" width={60} height={60} />
              {/* Pulsing arrow pointing at this toast */}
              <div className="pulse-arrow">
                <svg width="60" height="80" viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Arrow tail (line) */}
                  <line x1="30" y1="5" x2="30" y2="50" stroke="#000000" strokeWidth="3" strokeLinecap="round"/>
                  {/* Arrow head */}
                  <path d="M15 40L30 55L45 40" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="toast purple toast-2">
              <Image src="/icons/toast-purple.svg" alt="Completed Level" width={60} height={60} />
            </div>
            <div className="toast purple toast-3">
              <Image src="/icons/toast-purple.svg" alt="Completed Level" width={60} height={60} />
            </div>
            <div className="toast purple toast-4">
              <Image src="/icons/toast-purple.svg" alt="Completed Level" width={60} height={60} />
            </div>
            <div className="toast purple toast-5">
              <Image src="/icons/toast-purple.svg" alt="Completed Level" width={60} height={60} />
            </div>
            <div className="toast purple toast-6">
              <Image src="/icons/toast-purple.svg" alt="Completed Level" width={60} height={60} />
            </div>
            <div className="toast purple toast-7">
              <Image src="/icons/toast-purple.svg" alt="Completed Level" width={60} height={60} />
            </div>
            <div className="toast purple toast-8">
              <Image src="/icons/toast-purple.svg" alt="Completed Level" width={60} height={60} />
            </div>
            <div className="toast purple toast-9">
              <Image src="/icons/toast-purple.svg" alt="Completed Level" width={60} height={60} />
            </div>
            <div className="toast purple toast-10">
              <Image src="/icons/toast-purple.svg" alt="Completed Level" width={60} height={60} />
            </div>

            {/* Blue toasts (available levels) */}
            <div className="toast blue toast-11">
              <Image src="/icons/toast-blue.svg" alt="Available Level" width={60} height={60} />
            </div>
            <div className="toast blue toast-12">
              <Image src="/icons/toast-blue.svg" alt="Available Level" width={60} height={60} />
            </div>
            <div className="toast blue toast-13">
              <Image src="/icons/toast-blue.svg" alt="Available Level" width={60} height={60} />
            </div>
            <div className="toast blue toast-14">
              <Image src="/icons/toast-blue.svg" alt="Available Level" width={60} height={60} />
            </div>
            <div className="toast blue toast-15">
              <Image src="/icons/toast-blue.svg" alt="Available Level" width={60} height={60} />
            </div>
            <div className="toast blue toast-16">
              <Image src="/icons/toast-blue.svg" alt="Available Level" width={60} height={60} />
            </div>
            <div className="toast blue toast-17">
              <Image src="/icons/toast-blue.svg" alt="Available Level" width={60} height={60} />
            </div>
            <div className="toast blue toast-18">
              <Image src="/icons/toast-blue.svg" alt="Available Level" width={60} height={60} />
            </div>
            <div className="toast blue toast-19">
              <Image src="/icons/toast-blue.svg" alt="Available Level" width={60} height={60} />
            </div>
            <div className="toast blue toast-20">
              <Image src="/icons/toast-blue.svg" alt="Available Level" width={60} height={60} />
            </div>

            {/* Decorative clouds */}
            <div className="cloud cloud-1">
              <Image src="/icons/cloud.svg" alt="Cloud" width={100} height={60} />
            </div>
            <div className="cloud cloud-2">
              <Image src="/icons/cloud.svg" alt="Cloud" width={80} height={48} />
            </div>
            <div className="cloud cloud-3">
              <Image src="/icons/cloud.svg" alt="Cloud" width={90} height={54} />
            </div>
            <div className="cloud cloud-4">
              <Image src="/icons/cloud.svg" alt="Cloud" width={70} height={42} />
            </div>

            {/* Grass pattern at bottom */}
            <div className="grass-pattern">
              <Image 
                src="/icons/grass-pattern.svg" 
                alt="Grass" 
                fill
                className="grass-image"
              />
            </div>
          </div>

          {/* Progress floating box */}
          {showProgressBox && (
            <div className="progress-floating-box">
              <button
                className="close-btn"
                onClick={() => setShowProgressBox(false)}
              >
                ×
              </button>
            
            <div className="progress-content">
              <div className="progress-item">
                <span className="label">Subject:</span>
                <span className="value">A Level</span>
              </div>
              <div className="progress-item">
                <span className="label">Current grade:</span>
                <span className="value">A</span>
              </div>
              <div className="progress-item">
                <span className="label">Weak spec points:</span>
                <span className="value">2.1, 3.6, 7.2</span>
              </div>
              <div className="progress-item">
                <span className="label">Last worked on:</span>
                <span className="value">6.4</span>
              </div>
              <div className="progress-item">
                <span className="label">Upcoming:</span>
                <span className="value">6.5</span>
              </div>
              <div className="progress-item">
                <span className="label">Target grade:</span>
                <span className="value">A*</span>
              </div>
            </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}