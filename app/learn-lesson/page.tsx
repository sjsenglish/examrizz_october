'use client';

import { useState } from 'react';
import Link from 'next/link';
import './learn-lesson.css';

export default function LearnLesson() {
  const [activeTab, setActiveTab] = useState('lesson');
  const [expandedTopics, setExpandedTopics] = useState<{[key: string]: boolean}>({
    'proof': true
  });

  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  return (
    <div className="learn-lesson-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-left">
          <Link href="/" className="navbar-logo">examrizzsearch</Link>
        </div>
        <div className="nav-right">
          <button className="navbar-menu">
            <div className="navbar-menu-line"></div>
            <div className="navbar-menu-line"></div>
            <div className="navbar-menu-line"></div>
          </button>
        </div>
      </nav>

      <div className="page-container">
        {/* Left Sidebar */}
        <div className="left-sidebar">
          {/* Search Bar */}
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Search topics..." 
              className="search-input"
            />
            <button className="search-button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
          </div>

          {/* Subject Selector */}
          <div className="subject-selector">
            <div className="subject-label">Edexcel A Level Maths</div>
            <select className="subject-dropdown">
              <option>Pure Mathematics ▼</option>
            </select>
          </div>

          {/* Topics List */}
          <div className="topics-list">
            <div className="topic-item">
              <div 
                className="topic-header"
                onClick={() => toggleTopic('proof')}
              >
                <span className="topic-number">1</span>
                <span className="topic-title">Mathematical Proof</span>
                <span className="topic-grade">A*</span>
                <span className={`topic-arrow ${expandedTopics.proof ? 'expanded' : ''}`}>▼</span>
              </div>
              {expandedTopics.proof && (
                <div className="subtopic-list">
                  <div className="subtopic-item">
                    <span className="subtopic-bullet">•</span>
                    <span className="subtopic-title">How to proof by exhaustion</span>
                  </div>
                  <div className="subtopic-item">
                    <span className="subtopic-bullet">•</span>
                    <span className="subtopic-title">Disproof by counter example</span>
                  </div>
                  <div className="subtopic-item">
                    <span className="subtopic-bullet">•</span>
                    <span className="subtopic-title">Counter example</span>
                  </div>
                  <div className="subtopic-item current">
                    <span className="subtopic-number">1.1</span>
                    <span className="subtopic-title">Mathematical Proof</span>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Topics */}
            {Array.from({length: 9}, (_, i) => i + 2).map(num => (
              <div key={num} className="topic-item">
                <div className="topic-header">
                  <span className="topic-number">{num}</span>
                  <span className="topic-title">Spec topic</span>
                  <span className="topic-grade">A*</span>
                  <span className="topic-arrow">▼</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Stats Dashboard */}
          <div className="stats-dashboard">
            {/* Working Grade Card */}
            <div className="stat-card working-grade">
              <div className="stat-header">
                <span className="stat-icon">📊</span>
                <span className="stat-title">WORKING GRADE</span>
              </div>
              <div className="stat-content">
                <div className="grade-display">
                  <span className="grade-letter">A</span>
                  <div className="grade-metrics">
                    <div className="grade-numbers">
                      <span className="grade-primary">67</span>
                      <span className="grade-secondary">73%</span>
                      <span className="grade-label">accuracy</span>
                    </div>
                    <div className="grade-time">3h 24m</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Predicted Grade Card */}
            <div className="stat-card predicted-grade">
              <div className="stat-header">
                <span className="stat-title">PREDICTED GRADE</span>
              </div>
              <div className="stat-content">
                <span className="predicted-text">A/ A*</span>
                <div className="predicted-details">
                  <span>Based on</span>
                  <span>current work</span>
                </div>
              </div>
            </div>

            {/* Learning Streak Card */}
            <div className="stat-card learning-streak">
              <div className="stat-header">
                <span className="stat-icon">🔥</span>
                <span className="stat-title">LEARNING STREAK</span>
              </div>
              <div className="stat-content">
                <span className="streak-number">5</span>
                <span className="streak-unit">days</span>
                <div className="streak-details">
                  <span>Keep going!</span>
                </div>
              </div>
            </div>

            {/* Exam Readiness Card */}
            <div className="stat-card exam-readiness">
              <div className="stat-header">
                <span className="stat-title">EXAM READINESS</span>
              </div>
              <div className="stat-content">
                <span className="readiness-score">74/100</span>
                <div className="readiness-details">
                  <span>• Exam pace on track</span>
                </div>
              </div>
            </div>

            {/* Grade Shift Card */}
            <div className="stat-card grade-shift">
              <div className="stat-header">
                <span className="stat-title">GRADE SHIFT BY TOPIC</span>
              </div>
              <div className="chart-container">
                <div className="pie-chart">
                  <svg width="60" height="60" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="35" fill="none" stroke="#1976D2" strokeWidth="8" strokeDasharray="110 220" strokeDashoffset="0"/>
                    <circle cx="40" cy="40" r="35" fill="none" stroke="#4CAF50" strokeWidth="8" strokeDasharray="55 275" strokeDashoffset="-110"/>
                    <circle cx="40" cy="40" r="35" fill="none" stroke="#FF9800" strokeWidth="8" strokeDasharray="55 275" strokeDashoffset="-165"/>
                  </svg>
                </div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-dot blue"></span>
                    <span>A*</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot green"></span>
                    <span>A</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot orange"></span>
                    <span>B</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grade Trajectory */}
          <div className="grade-trajectory">
            <h3 className="trajectory-title">GRADE TRAJECTORY</h3>
            <div className="trajectory-chart">
              <svg width="180" height="60" viewBox="0 0 300 100">
                <polyline 
                  points="20,80 60,70 100,60 140,50 180,45 220,40 260,35" 
                  fill="none" 
                  stroke="#00CED1" 
                  strokeWidth="3"
                />
                <circle cx="260" cy="35" r="4" fill="#00CED1"/>
              </svg>
              <div className="trajectory-labels">
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
                <span>Dec</span>
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
              </div>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="lesson-content">
            {/* Tab Navigation */}
            <div className="lesson-tabs">
              <button 
                className={`lesson-tab ${activeTab === 'lesson' ? 'active' : ''}`}
                onClick={() => setActiveTab('lesson')}
              >
                LESSON
              </button>
              <button 
                className={`lesson-tab ${activeTab === 'practice' ? 'active' : ''}`}
                onClick={() => setActiveTab('practice')}
              >
                PRACTICE
              </button>
              <button 
                className={`lesson-tab ${activeTab === 'test' ? 'active' : ''}`}
                onClick={() => setActiveTab('test')}
              >
                END OF TOPIC TEST
              </button>
            </div>

            {/* Lesson Header */}
            <div className="lesson-header">
              <div className="lesson-info">
                <span className="lesson-number">1 Proof</span>
                <h1 className="lesson-title">1.1 Mathematical Proof</h1>
                <p className="lesson-subtitle">How to proof by exhaustion</p>
              </div>
              <div className="lesson-grade">A*</div>
            </div>

            {/* Tab Content */}
            {activeTab === 'lesson' && (
              <div className="lesson-tab-content">
                {/* Video Lesson */}
                <div className="video-section">
                  <h2 className="section-title">Video Lesson</h2>
                  <div className="video-container">
                    <div className="video-placeholder">
                      <div className="video-icon">▶</div>
                      <div className="video-text">
                        <span>VIDEO</span>
                        <span>embedded in page</span>
                      </div>
                    </div>
                    <button className="bookmark-btn">📑</button>
                  </div>
                  <p className="video-description">
                    Proof by deduction e.g. using completion of the square, prove that x² - 6x + 10 is positive for all values of x, for example. differentiation from first principles for nax^n and positive integer powers of x for completing the square. Using the discriminant. Proof by deduction. e.g. using completion of the square, prove that x² - 6x + 10 is positive for all values of x, for example. differentiation from first principles for nasn results for arithmetic and geometric series.
                  </p>
                </div>

                {/* Examples */}
                <div className="examples-section">
                  <h2 className="section-title">Examples</h2>
                  
                  {/* Example 1 */}
                  <div className="example-item">
                    <div className="example-header">
                      <h3>Example 1</h3>
                    </div>
                    <p className="example-question">Simplify the following: 3x/y</p>
                    <div className="example-buttons">
                      <button className="btn-worked-solution">Worked Solution</button>
                      <button className="btn-question-walkthrough">Question Walkthrough</button>
                    </div>
                  </div>

                  {/* Example 2 - With expanded content */}
                  <div className="example-item">
                    <div className="example-header">
                      <h3>Example 2</h3>
                    </div>
                    <p className="example-question">Simplify the following: 3x/y</p>
                    <div className="example-buttons">
                      <button className="btn-worked-solution">Worked Solution</button>
                      <button className="btn-question-walkthrough">Question Walkthrough</button>
                    </div>
                    
                    {/* Expanded Mathematical Working */}
                    <div className="mathematical-working">
                      <h4>Simplify</h4>
                      <p className="working-text">Proof by deduction e.g. using completion of the square, prove that x² - 6x + 10 is positive for all</p>
                      
                      <h4>Apply the law</h4>
                      <div className="math-steps">
                        <div className="math-step">
                          <span className="step-equation">3x/y = 3 = 3x</span>
                          <span className="step-description">Multiply the numerator</span>
                        </div>
                        <div className="math-step">
                          <span className="step-equation">4y/3 = 3x = 4y</span>
                          <span className="step-description">Multiply the numerator</span>
                        </div>
                        <div className="math-step">
                          <span className="step-equation">1/2 = x = 1/2</span>
                          <span className="step-description">Multiply the numerator</span>
                        </div>
                        <div className="math-step">
                          <span className="step-equation">x = 3x</span>
                          <span className="step-description">Multiply the numerator</span>
                        </div>
                      </div>
                      
                      <h4>Simplify</h4>
                      <p className="working-text">Proof by deduction e.g. using completion of the square, prove that x² - 6x + 10 is positive for all Proof by deduction e.g. using completion of the square, prove that x² - 6x + 10 is positive for all Proof by deduction e.g. using completion of the square, prove that x² - 6x + 10.</p>
                    </div>
                  </div>

                  {/* Example 3 - With video toggle */}
                  <div className="example-item">
                    <div className="example-header">
                      <h3>Example 3</h3>
                    </div>
                    <p className="example-question">Simplify the following: 3x/y</p>
                    <div className="example-buttons">
                      <button className="btn-worked-solution">Worked Solution</button>
                      <button className="btn-question-walkthrough">Question Walkthrough</button>
                    </div>
                    
                    {/* Toggle Video */}
                    <div className="toggle-video">
                      <div className="video-placeholder small">
                        <div className="video-icon">▶</div>
                        <div className="video-text">
                          <span>VIDEO</span>
                          <span>appears below question</span>
                          <span>walkthrough button when</span>
                          <span>clicked</span>
                          <span>(like a toggle effect)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lesson Summary */}
                <div className="lesson-summary">
                  <h2 className="summary-title">LESSON SUMMARY</h2>
                  <div className="summary-content">
                    <p>Proof by deduction e.g. using completion of the square, prove that x² - 6x + 10 is positive for all Proof by deduction e.g. using completion of the square, prove that x² - 6x + 10 is positive for all Proof by deduction e.g. using completion of the square, prove that x² - 6x + 10.</p>
                    
                    <div className="summary-formula">
                      <div className="formula-display">
                        <span className="formula-numerator">1</span>
                        <span className="formula-line">―――</span>
                        <span className="formula-denominator">B - C</span>
                        <span className="formula-equals">=</span>
                        <span className="formula-numerator">A - D</span>
                        <span className="formula-line">―――――</span>
                        <span className="formula-denominator">B - C</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="practice-section">
                    <button className="practice-button">
                      PRACTICE →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'practice' && (
              <div className="practice-tab-content">
                <p>Practice content coming soon...</p>
              </div>
            )}

            {activeTab === 'test' && (
              <div className="test-tab-content">
                <p>End of topic test content coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}