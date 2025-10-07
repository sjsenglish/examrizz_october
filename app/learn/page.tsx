'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './learn.css';

export default function LearnPage() {
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
                      <h3 className="card-title">Maths - Week 3 - Chain Rule Video (10 mins)</h3>
                      <p className="card-subtitle">Almost done - 4 mins left</p>
                    </div>
                    <div className="card-icon">
                      {/* Ghost icon placeholder */}
                      <div className="icon-placeholder">👻</div>
                    </div>
                    <button className="continue-button">
                      CONTINUE LESSON
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>

                  <div className="learning-card">
                    <div className="card-content">
                      <h3 className="card-title">Study Diary</h3>
                      <p className="card-subtitle">Last entry - Insights on book X</p>
                      <p className="card-time">2 hours ago</p>
                    </div>
                    <div className="card-icon">
                      {/* Diary icon placeholder */}
                      <div className="icon-placeholder">📖</div>
                    </div>
                    <button className="continue-button">
                      OPEN BOOK
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
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
                    Continue
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
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
                    Continue
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
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
                  <button className="path-button start-button">
                    Start
                  </button>
                </div>
              </div>

              {/* Add Path Button */}
              <button className="add-path-button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                ADD PATH
              </button>
            </div>
          </div>

          {/* Progress Sidebar */}
          <div className="progress-sidebar">
            <div className="streak-header">
              <div className="streak-icon">🔥</div>
              <span className="streak-text">5 DAY STREAK</span>
            </div>

            <div className="progress-container">
              <div className="progress-section">
                <h3 className="progress-title">Your Progress</h3>
                <div className="level-info">
                  <span className="level-text">Level 4</span>
                  <div className="level-details">
                    <span className="points">847 pts</span>
                    <span className="badges">12/20 badges</span>
                  </div>
                </div>
              </div>

              <div className="achievement-section">
                <h4 className="achievement-title">NEXT ACHIEVEMENT</h4>
                <p className="achievement-desc">✓ Complete 50 Questions</p>
                <div className="achievement-progress">
                  <div className="achievement-bar">
                    <div className="achievement-fill" style={{ width: '80%' }}></div>
                  </div>
                  <span className="achievement-count">4/20</span>
                </div>
                <p className="achievement-remaining">Just 3 more to unlock!</p>
              </div>

              <div className="recent-section">
                <h4 className="recent-title">RECENTLY UNLOCKED</h4>
                <div className="recent-item">
                  <span className="checkmark">✓</span>
                  <div className="recent-details">
                    <p className="recent-name">7-Day Streak Badge</p>
                    <p className="recent-points">+ 50 points</p>
                    <p className="recent-time">2 days ago</p>
                  </div>
                </div>
              </div>

              <div className="week-section">
                <h4 className="week-title">THIS WEEK</h4>
                <p className="week-stat">3 videos watched</p>
                <p className="week-stat">4h 23m learning time</p>
                <p className="week-stat">2 diary entries</p>
              </div>

              <button className="view-all-button">
                View all achievements
              </button>
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