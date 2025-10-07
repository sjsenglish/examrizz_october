'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './select-practice-questions.css';

export default function SelectPracticeQuestionsPage() {
  const [selectedQuestions, setSelectedQuestions] = useState(111);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="page-background">
      {/* Navbar */}
      <nav className="navbar">
        <Link href="/" style={{ textDecoration: 'none' }}>
          <h1>examrizzsearch</h1>
        </Link>
        <button className="hamburger-button">
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
        </button>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        {/* Modal */}
        <div className="modal-container">
          {/* Close Button */}
          <Link href="/practice" className="close-button">
            ×
          </Link>

          {/* Header */}
          <h1 className="header-title">
            Create Your Practice Pack
          </h1>

          {/* Step indicator */}
          <div className="step-indicator">
            Step 2 of 2
          </div>

          {/* Inner Container - matches create-question-pack styling */}
          <div className="inner-container">
            {/* Select Questions Section */}
            <div className="select-questions-section">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '15px' }}>
                <div>
                  <h2 className="section-title">Select Questions</h2>
                  <p className="section-description">
                    Choose 123 questions from 260 available results below.
                  </p>
                </div>
              </div>

              {/* Questions Selected Badge - positioned above and to right of search bar within 75% width */}
              <div style={{ width: '75%', display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                <div className="questions-selected-badge">
                  {selectedQuestions} questions selected
                </div>
              </div>

              {/* Search Bar */}
              <div className="search-container" style={{ marginBottom: '15px' }}>
                <input
                  type="text"
                  placeholder="Search for questions by year, question number, content, ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button className="search-button">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
              </div>

              {/* Questions Container with Side Controls */}
              <div className="questions-and-controls-section">
                <div className="questions-container">
                  {/* First Question - Selected */}
                  <div className="question-card selected">
                    <div className="question-header">
                      <div className="question-checkbox-container">
                        <input type="checkbox" checked className="question-checkbox" />
                        <span className="question-number">1</span>
                      </div>
                    </div>
                    <div className="question-content">
                      {/* Question content area - empty as shown in image */}
                    </div>
                  </div>

                  {/* Second Question - Unselected */}
                  <div className="question-card">
                    <div className="question-header">
                      <div className="question-checkbox-container">
                        <input type="checkbox" className="question-checkbox" />
                      </div>
                    </div>
                    <div className="question-content">
                      {/* Question content area - empty as shown in image */}
                    </div>
                  </div>
                </div>

                {/* Side Controls - now to the right of questions container */}
                <div className="side-controls-right">
                  <button className="control-button shuffle-button">
                    <span>Shuffle</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  <button className="control-button fullscreen-button">
                    <span>Full Screen</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M16 21h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  <button className="clear-selection-link">
                    clear selection
                  </button>
                </div>
              </div>

              {/* Navigation Buttons - moved up to fit in smaller container */}
              <div className="navigation-buttons-compact">
                <Link href="/create-practice-pack" className="back-button">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Back
                </Link>
                
                <button className="create-pack-button">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Create Pack
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}