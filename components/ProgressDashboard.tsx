'use client';

import React from 'react';
import Image from 'next/image';
import './ProgressDashboard.css';

interface DashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProgressDashboard({ isOpen, onClose }: DashboardProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="dashboard-overlay" onClick={onClose} />

      {/* Dashboard Modal */}
      <div className="dashboard-modal">
        {/* Close button */}
        <button className="dashboard-close" onClick={onClose}>
          ×
        </button>

        {/* Dashboard Header */}
        <div className="dashboard-header">
          <h2 className="dashboard-title">Your Progress</h2>
          <p className="dashboard-subtitle">Track your learning journey</p>
        </div>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {/* Stats Grid */}
          <div className="stats-grid">
            {/* Total Progress */}
            <div className="stat-card">
              <div className="stat-icon">
                <Image
                  src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2FGroup%202376.svg?alt=media&token=96940cfc-fd51-4c0c-a40b-eca32f113b46"
                  alt="Progress"
                  width={40}
                  height={40}
                />
              </div>
              <div className="stat-info">
                <div className="stat-label">Lessons Completed</div>
                <div className="stat-value">12 / 89</div>
              </div>
            </div>

            {/* Time Spent */}
            <div className="stat-card">
              <div className="stat-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#7C3AED" strokeWidth="2"/>
                  <path d="M12 6V12L16 14" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-label">Time Spent</div>
                <div className="stat-value">14.2 hrs</div>
              </div>
            </div>

            {/* Questions Answered */}
            <div className="stat-card">
              <div className="stat-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M9 11L12 14L22 4" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H16" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-label">Questions Correct</div>
                <div className="stat-value">87 / 120</div>
              </div>
            </div>

            {/* Current Streak */}
            <div className="stat-card">
              <div className="stat-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#F59E0B" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-label">Current Streak</div>
                <div className="stat-value">7 days</div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-section">
            <div className="progress-header">
              <span className="progress-label">Overall Course Progress</span>
              <span className="progress-percentage">13%</span>
            </div>
            <div className="progress-bar-wrapper">
              <div className="progress-bar-fill-dashboard" style={{ width: '13%' }} />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="recent-activity">
            <h3 className="section-title">Recent Activity</h3>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-dot" />
                <div className="activity-details">
                  <div className="activity-title">Completed 7.2 Differentiating Functions</div>
                  <div className="activity-time">2 hours ago</div>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-dot" />
                <div className="activity-details">
                  <div className="activity-title">Answered 8 questions correctly</div>
                  <div className="activity-time">5 hours ago</div>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-dot" />
                <div className="activity-details">
                  <div className="activity-title">Watched video: Intro to Differentiation</div>
                  <div className="activity-time">1 day ago</div>
                </div>
              </div>
            </div>
          </div>

          {/* Chapter Progress */}
          <div className="chapter-progress">
            <h3 className="section-title">Progress by Chapter</h3>
            <div className="chapter-list">
              <div className="chapter-item">
                <div className="chapter-header">
                  <span className="chapter-name">Chapter 1: Proofs</span>
                  <span className="chapter-percent">100%</span>
                </div>
                <div className="chapter-bar">
                  <div className="chapter-fill" style={{ width: '100%', backgroundColor: '#7C3AED' }} />
                </div>
              </div>
              <div className="chapter-item">
                <div className="chapter-header">
                  <span className="chapter-name">Chapter 2: Algebra</span>
                  <span className="chapter-percent">45%</span>
                </div>
                <div className="chapter-bar">
                  <div className="chapter-fill" style={{ width: '45%', backgroundColor: '#3B82F6' }} />
                </div>
              </div>
              <div className="chapter-item">
                <div className="chapter-header">
                  <span className="chapter-name">Chapter 3: Coordinate Geometry</span>
                  <span className="chapter-percent">0%</span>
                </div>
                <div className="chapter-bar">
                  <div className="chapter-fill" style={{ width: '0%', backgroundColor: '#7C3AED' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
