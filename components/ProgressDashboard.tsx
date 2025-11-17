'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase-client';
import './ProgressDashboard-v2.css';

interface DashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProgressDashboard({ isOpen, onClose }: DashboardProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="progress-overlay-v2" onClick={onClose} />

      {/* Dashboard Modal */}
      <div className="progress-modal-v2">
        {/* Close button */}
        <button className="progress-close-v2" onClick={onClose}>
          ×
        </button>

        {/* Dashboard Content */}
        {loading ? (
          <div className="progress-loading-v2">
            Loading your progress...
          </div>
        ) : (
          <div className="progress-main-grid-v2">
            {/* Top Section - 4 boxes */}
            <div className="progress-top-section-v2">
              {/* Working Grade */}
              <div className="progress-metric-card-v2">
                <div className="progress-card-title-v2">Working Grade</div>
                <div className="progress-grade-display-v2">A*</div>
                <div className="progress-bar-outer-v2">
                  <div className="progress-bar-inner-v2" style={{ width: '85%' }} />
                </div>
              </div>

              {/* Predicted Grade */}
              <div className="progress-metric-card-v2">
                <div className="progress-card-title-v2">Predicted Grade</div>
                <div className="progress-grade-display-v2">A**</div>
              </div>

              {/* Learning Streak */}
              <div className="progress-metric-card-v2">
                <div className="progress-card-title-v2">Learning Streak</div>
                <div className="progress-streak-content-v2">
                  <Image
                    src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fflame-streak.svg?alt=media&token=20cbf1c7-06f6-4ea4-b960-94172c49bff3"
                    alt="Streak"
                    width={40}
                    height={40}
                    className="progress-streak-icon-v2"
                  />
                  <div className="progress-number-display-v2">7</div>
                </div>
                <div className="progress-subtitle-v2">days logged in</div>
              </div>

              {/* Exam Readiness */}
              <div className="progress-metric-card-v2">
                <div className="progress-card-title-v2">Exam Readiness</div>
                <div className="progress-readiness-text-v2">
                  <span className="progress-number-display-v2">12</span>
                  <span className="progress-subtitle-v2"> / 30 topics</span>
                </div>
                <div className="progress-bar-outer-v2">
                  <div className="progress-bar-inner-v2" style={{ width: '40%' }} />
                </div>
              </div>
            </div>

            {/* Bottom Left Section - 2 boxes */}
            <div className="progress-bottom-left-v2">
              {/* This Week */}
              <div className="progress-metric-card-v2">
                <div className="progress-card-title-v2">This Week</div>
                <div className="progress-week-stats-v2">
                  <div className="progress-stat-mini-v2">
                    <div className="progress-stat-label-v2">Questions Answered</div>
                    <div className="progress-number-display-v2">42</div>
                  </div>
                  <div className="progress-stat-mini-v2">
                    <div className="progress-stat-label-v2">Accuracy</div>
                    <div className="progress-number-display-v2">85%</div>
                  </div>
                  <div className="progress-stat-mini-v2">
                    <div className="progress-stat-label-v2">Study Time</div>
                    <div className="progress-number-display-v2">3.5h</div>
                  </div>
                </div>
              </div>

              {/* Grade Trajectory */}
              <div className="progress-metric-card-v2">
                <div className="progress-card-title-v2">Grade Trajectory</div>
                <div className="progress-trajectory-chart-v2">
                  <svg width="100%" height="120" viewBox="0 0 300 120" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <line x1="0" y1="20" x2="300" y2="20" stroke="#E5E7EB" strokeWidth="1" />
                    <line x1="0" y1="40" x2="300" y2="40" stroke="#E5E7EB" strokeWidth="1" />
                    <line x1="0" y1="60" x2="300" y2="60" stroke="#E5E7EB" strokeWidth="1" />
                    <line x1="0" y1="80" x2="300" y2="80" stroke="#E5E7EB" strokeWidth="1" />
                    <line x1="0" y1="100" x2="300" y2="100" stroke="#E5E7EB" strokeWidth="1" />

                    {/* Line graph */}
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
                  <div className="progress-trajectory-labels-v2">
                    <span>W1</span>
                    <span>W2</span>
                    <span>W3</span>
                    <span>W4</span>
                    <span>W5</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Grade Split by Topic (spans both rows) */}
            <div className="progress-right-section-v2">
              <div className="progress-metric-card-v2" style={{ height: '100%' }}>
                <div className="progress-card-title-v2">Grade Split by Topic</div>
                <div className="progress-pie-container-v2">
                  <svg width="160" height="160" viewBox="0 0 160 160">
                    {/* A** (6CE5E8) - 20% */}
                    <path
                      d="M 80 80 L 80 20 A 60 60 0 0 1 122.4 41.6 Z"
                      fill="#6CE5E8"
                      stroke="#000"
                      strokeWidth="1"
                    />
                    {/* A* (white) - 25% */}
                    <path
                      d="M 80 80 L 122.4 41.6 A 60 60 0 0 1 122.4 118.4 Z"
                      fill="#FFFFFF"
                      stroke="#000"
                      strokeWidth="1"
                    />
                    {/* A (C8F4F6) - 30% */}
                    <path
                      d="M 80 80 L 122.4 118.4 A 60 60 0 0 1 20 80 Z"
                      fill="#C8F4F6"
                      stroke="#000"
                      strokeWidth="1"
                    />
                    {/* B (E7E6FF) - 15% */}
                    <path
                      d="M 80 80 L 20 80 A 60 60 0 0 1 54.6 30.4 Z"
                      fill="#E7E6FF"
                      stroke="#000"
                      strokeWidth="1"
                    />
                    {/* C (0AB2B4) - 10% */}
                    <path
                      d="M 80 80 L 54.6 30.4 A 60 60 0 0 1 80 20 Z"
                      fill="#0AB2B4"
                      stroke="#000"
                      strokeWidth="1"
                    />
                  </svg>
                  <div className="progress-pie-legend-v2">
                    <div className="progress-legend-item-v2">
                      <div className="progress-legend-color-v2" style={{ backgroundColor: '#6CE5E8' }} />
                      <span className="progress-legend-text-v2">A** (6)</span>
                    </div>
                    <div className="progress-legend-item-v2">
                      <div className="progress-legend-color-v2" style={{ backgroundColor: '#FFFFFF', border: '1px solid #000' }} />
                      <span className="progress-legend-text-v2">A* (8)</span>
                    </div>
                    <div className="progress-legend-item-v2">
                      <div className="progress-legend-color-v2" style={{ backgroundColor: '#C8F4F6' }} />
                      <span className="progress-legend-text-v2">A (9)</span>
                    </div>
                    <div className="progress-legend-item-v2">
                      <div className="progress-legend-color-v2" style={{ backgroundColor: '#E7E6FF' }} />
                      <span className="progress-legend-text-v2">B (5)</span>
                    </div>
                    <div className="progress-legend-item-v2">
                      <div className="progress-legend-color-v2" style={{ backgroundColor: '#0AB2B4' }} />
                      <span className="progress-legend-text-v2">C (2)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
