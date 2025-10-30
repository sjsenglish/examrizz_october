'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import './learn.css';

export default function LearnPage() {

  return (
    <div className="page-background" style={{ paddingTop: '60px' }}>
      <Navbar />

      {/* Main Content */}
      <div className="main-content">
        {/* Back Button */}
        <Link href="/" className="back-button">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </Link>

        {/* Content Layout */}
        <div className="content-layout">
          {/* Main Learning Section */}
          <div className="main-learning-section">
            {/* Page Title */}
            <h1 className="page-title">Learn Hub</h1>

            {/* Continue Learning Section */}
            <div className="continue-learning-section">
              <div className="continue-learning-container">
                <h2 className="section-title">CONTINUE LEARNING</h2>
                <div className="learning-cards-wrapper">
                  <div className="learning-card">
                    <div className="card-content">
                      <h3 className="card-title">Maths Taster Course</h3>
                      <p className="card-subtitle">with Joe</p>
                    </div>
                    <div className="card-icon">
                      <Image 
                        src="/icons/learn-hub-book.svg"
                        alt="Maths Taster Course"
                        width={40}
                        height={40}
                      />
                    </div>
                    <Link href="/learn-lesson" className="continue-button">
                      START
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                  </div>

                </div>
              </div>
            </div>

            {/* My Learning Paths Section */}
            <div className="learning-paths-section">
              <div className="section-header">
                <h2 className="section-title">MY LEARNING PATHS</h2>
              </div>

              <div className="learning-paths-grid">
                {/* Maths Path */}
                <div className="path-card">
                  <div className="path-header">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  <div className="path-content">
                    <h3 className="path-title">A LEVEL</h3>
                    <h4 className="path-subject">Edexcel Maths</h4>
                    <p className="path-week">Week 3/24</p>
                    <p className="path-level">BEGINNER</p>
                  </div>
                  <button className="path-button">
                    Coming Soon
                  </button>
                </div>

                {/* English Path */}
                <div className="path-card">
                  <div className="path-header">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                  <div className="path-content">
                    <h3 className="path-title">A LEVEL</h3>
                    <h4 className="path-subject">Edexcel English</h4>
                    <p className="path-week">Week 5/24</p>
                    <p className="path-level">INTERMEDIATE</p>
                  </div>
                  <button className="path-button">
                    Coming Soon
                  </button>
                </div>

                {/* Chemistry Path */}
                <div className="path-card">
                  <div className="path-header">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                  <div className="path-content">
                    <h3 className="path-title">A LEVEL</h3>
                    <h4 className="path-subject">AQA Chemistry</h4>
                    <p className="path-week">Not started</p>
                    <p className="path-level"></p>
                  </div>
                  <button className="path-button">
                    Coming Soon
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Fixed Learn Icon */}
        <div className="fixed-learn-icon">
          <Image 
            src="/icons/learn.svg"
            alt="LEARN"
            width={120}
            height={120}
            className="learn-icon-image"
          />
          <span className="learn-text">LEARN</span>
        </div>
      </div>
    </div>
  );
}