'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase-client';
import './ProgressDashboard.css';

interface DashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProgressDashboard({ isOpen, onClose }: DashboardProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // For now, just set loading to false since we're using default data
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="dashboard-overlay" onClick={onClose} />

      {/* Dashboard Modal */}
      <div className="dashboard-modal-new">
        {/* Close button */}
        <button className="dashboard-close-new" onClick={onClose}>
          ×
        </button>

        {/* Dashboard Content */}
        <div className="dashboard-content-new">
          {loading ? (
            <div className="loading-state">
              Loading your progress...
            </div>
          ) : (
            <div className="dashboard-grid">
              {/* Top Row - 4 boxes */}
              <div className="top-row">
                {/* Working Grade */}
                <div className="metric-box">
                  <div className="metric-title">WORKING GRADE</div>
                  <div className="metric-grade-value">A*</div>
                  <div className="progress-bar-container-new">
                    <div className="progress-bar-fill-new" style={{ width: '85%' }} />
                  </div>
                </div>

                {/* Predicted Grade */}
                <div className="metric-box">
                  <div className="metric-title">PREDICTED GRADE</div>
                  <div className="metric-grade-value">A**</div>
                </div>

                {/* Learning Streak */}
                <div className="metric-box">
                  <div className="metric-title">LEARNING STREAK</div>
                  <div className="streak-content">
                    <Image
                      src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fflame-streak.svg?alt=media&token=20cbf1c7-06f6-4ea4-b960-94172c49bff3"
                      alt="Streak"
                      width={40}
                      height={40}
                      className="streak-icon"
                    />
                    <div className="metric-number-value">7</div>
                  </div>
                  <div className="metric-subtitle">days logged in</div>
                </div>

                {/* Exam Readiness */}
                <div className="metric-box">
                  <div className="metric-title">EXAM READINESS</div>
                  <div className="readiness-text">
                    <span className="metric-number-value">12</span>
                    <span className="metric-subtitle"> / 30 topics</span>
                  </div>
                  <div className="progress-bar-container-new">
                    <div className="progress-bar-fill-new" style={{ width: '40%' }} />
                  </div>
                </div>
              </div>

              {/* Bottom Left Section - 2 boxes */}
              <div className="bottom-left-section">
                {/* This Week */}
                <div className="metric-box this-week-box">
                  <div className="metric-title">THIS WEEK</div>
                  <div className="this-week-stats">
                    <div className="stat-mini-box">
                      <div className="stat-mini-label">Questions Answered</div>
                      <div className="metric-number-value">42</div>
                    </div>
                    <div className="stat-mini-box">
                      <div className="stat-mini-label">Accuracy</div>
                      <div className="metric-number-value">85%</div>
                    </div>
                    <div className="stat-mini-box">
                      <div className="stat-mini-label">Study Time</div>
                      <div className="metric-number-value">3.5h</div>
                    </div>
                  </div>
                </div>

                {/* Grade Trajectory */}
                <div className="metric-box trajectory-box">
                  <div className="metric-title">GRADE TRAJECTORY</div>
                  <div className="trajectory-chart">
                    <svg width="100%" height="120" viewBox="0 0 300 120" preserveAspectRatio="none">
                      {/* Grid lines */}
                      <line x1="0" y1="20" x2="300" y2="20" stroke="#E5E7EB" strokeWidth="1" />
                      <line x1="0" y1="40" x2="300" y2="40" stroke="#E5E7EB" strokeWidth="1" />
                      <line x1="0" y1="60" x2="300" y2="60" stroke="#E5E7EB" strokeWidth="1" />
                      <line x1="0" y1="80" x2="300" y2="80" stroke="#E5E7EB" strokeWidth="1" />
                      <line x1="0" y1="100" x2="300" y2="100" stroke="#E5E7EB" strokeWidth="1" />

                      {/* Line graph - simulating grade improvement from C to A* */}
                      <polyline
                        points="30,90 90,70 150,50 210,35 270,25"
                        fill="none"
                        stroke="#00CED1"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Data points */}
                      <circle cx="30" cy="90" r="4" fill="#00CED1" />
                      <circle cx="90" cy="70" r="4" fill="#00CED1" />
                      <circle cx="150" cy="50" r="4" fill="#00CED1" />
                      <circle cx="210" cy="35" r="4" fill="#00CED1" />
                      <circle cx="270" cy="25" r="4" fill="#00CED1" />
                    </svg>
                    <div className="trajectory-labels">
                      <span>W1</span>
                      <span>W2</span>
                      <span>W3</span>
                      <span>W4</span>
                      <span>W5</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grade Split by Topic - Tall box on right spanning both rows */}
              <div className="metric-box grade-split-box">
                <div className="metric-title">GRADE SPLIT BY TOPIC</div>
                <div className="pie-chart-container">
                  <svg width="160" height="160" viewBox="0 0 160 160">
                    {/* Pie chart with 5 segments */}
                    {/* A** (6CE5E8) - 20% - 0 to 72 degrees */}
                    <path
                      d="M 80 80 L 80 20 A 60 60 0 0 1 122.4 41.6 Z"
                      fill="#6CE5E8"
                      stroke="#000"
                      strokeWidth="1"
                    />
                    {/* A* (white) - 25% - 72 to 162 degrees */}
                    <path
                      d="M 80 80 L 122.4 41.6 A 60 60 0 0 1 122.4 118.4 Z"
                      fill="#FFFFFF"
                      stroke="#000"
                      strokeWidth="1"
                    />
                    {/* A (C8F4F6) - 30% - 162 to 270 degrees */}
                    <path
                      d="M 80 80 L 122.4 118.4 A 60 60 0 0 1 20 80 Z"
                      fill="#C8F4F6"
                      stroke="#000"
                      strokeWidth="1"
                    />
                    {/* B (E7E6FF) - 15% - 270 to 324 degrees */}
                    <path
                      d="M 80 80 L 20 80 A 60 60 0 0 1 54.6 30.4 Z"
                      fill="#E7E6FF"
                      stroke="#000"
                      strokeWidth="1"
                    />
                    {/* C (0AB2B4) - 10% - 324 to 360 degrees */}
                    <path
                      d="M 80 80 L 54.6 30.4 A 60 60 0 0 1 80 20 Z"
                      fill="#0AB2B4"
                      stroke="#000"
                      strokeWidth="1"
                    />
                  </svg>
                  <div className="pie-legend">
                    <div className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: '#6CE5E8' }} />
                      <span className="legend-text">A** (6)</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: '#FFFFFF', border: '1px solid #000' }} />
                      <span className="legend-text">A* (8)</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: '#C8F4F6' }} />
                      <span className="legend-text">A (9)</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: '#E7E6FF' }} />
                      <span className="legend-text">B (5)</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: '#0AB2B4' }} />
                      <span className="legend-text">C (2)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
