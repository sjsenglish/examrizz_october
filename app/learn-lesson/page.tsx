'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import './learn-lesson.css';

export default function LearnLesson() {
  const [activeTab, setActiveTab] = useState('lesson');
  const [expandedTopics, setExpandedTopics] = useState<{[key: string]: boolean}>({
    'proof': true
  });
  const [workedSolutions, setWorkedSolutions] = useState<{[key: string]: boolean}>({});
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: string]: string}>({});
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  const toggleWorkedSolution = (exampleId: string) => {
    setWorkedSolutions(prev => ({
      ...prev,
      [exampleId]: !prev[exampleId]
    }));
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const getAnswerStyle = (questionId: string, answer: string) => {
    const selected = selectedAnswers[questionId];
    if (!selected) return '';
    
    if (selected === answer) {
      // Show correct answer as green, incorrect as red
      if (answer === 'A') return 'correct';
      return 'selected';
    }
    
    // Show correct answer when another is selected
    if (answer === 'A' && selected && selected !== 'A') return 'correct';
    if (selected !== answer) return '';
    
    return 'incorrect';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer for practice tab
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTab === 'practice') {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTab]);

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
            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <div key={num} className="topic-item">
                <div className="topic-header">
                  <span className="topic-number">{num}</span>
                  <span className="topic-title">Algebra and functions</span>
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
            <div className="stat-card working-grade">
              <div className="stat-header">
                <span className="stat-icon">📊</span>
                <span className="stat-title">WORKING GRADE</span>
              </div>
              <div className="stat-content">
                <span className="grade-letter">A</span>
                <div className="grade-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '73%'}}></div>
                  </div>
                  <span className="progress-text">73% accuracy</span>
                </div>
              </div>
            </div>

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

            <div className="stat-card grade-shift">
              <div className="stat-header">
                <span className="stat-title">GRADE SHIFT BY TOPIC</span>
              </div>
              <div className="chart-container">
                <div className="pie-chart">
                  <svg width="50" height="50" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="35" fill="#E3F2FD" stroke="#1976D2" strokeWidth="10" strokeDasharray="110 220" strokeDashoffset="0"/>
                    <circle cx="40" cy="40" r="35" fill="none" stroke="#4CAF50" strokeWidth="10" strokeDasharray="55 275" strokeDashoffset="-110"/>
                    <circle cx="40" cy="40" r="35" fill="none" stroke="#FF9800" strokeWidth="10" strokeDasharray="55 275" strokeDashoffset="-165"/>
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
                    Proof by deduction e.g. using completion of the square, prove that x² - 6x + 10 is positive for all values of x, for example. differentiation from first principles for nax^n and positive integer powers. Q4 of proving results for arithmetic and geometric series. This is the most commonly used method of proof throughout this specification.
                  </p>
                </div>

                {/* Examples */}
                <div className="examples-section">
                  <h2 className="section-title">Examples</h2>
                  
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

                  <div className="example-item">
                    <div className="example-header">
                      <h3>Example 2</h3>
                    </div>
                    <p className="example-question">Simplify the following: 3x/y</p>
                    <div className="example-buttons">
                      <button className="btn-worked-solution">Worked Solution</button>
                      <button className="btn-question-walkthrough">Question Walkthrough</button>
                    </div>
                  </div>

                  <div className="example-item">
                    <div className="example-header">
                      <h3>Example 3</h3>
                    </div>
                    <p className="example-question">Simplify the following: 3x/y</p>
                    <div className="example-buttons">
                      <button className="btn-worked-solution">Worked Solution</button>
                      <button className="btn-question-walkthrough">Question Walkthrough</button>
                    </div>
                    
                    {/* Video appears below when walkthrough clicked */}
                    <div className="walkthrough-video">
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
                      <span>1/(B - C) = A - D/(B - C)</span>
                    </div>
                  </div>
                  
                  <button className="practice-button">
                    PRACTICE →
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'practice' && (
              <div className="practice-tab-content">
                {/* Practice Header */}
                <div className="practice-header">
                  <div className="practice-info">
                    <h1 className="practice-title">1.1 Mathematical Proof</h1>
                    <p className="practice-subtitle">How to proof by exhaustion</p>
                  </div>
                  <div className="practice-stats">
                    <div className="practice-stat">
                      <span className="stat-label">Best time</span>
                      <span className="stat-value">47%</span>
                    </div>
                    <div className="practice-stat">
                      <span className="stat-label">Usual time</span>
                      <span className="stat-value">47%</span>
                    </div>
                    <div className="practice-timer">
                      <span className="timer-icon">⏱</span>
                      <span className="timer-value">{formatTime(elapsedTime)}</span>
                    </div>
                    <div className="practice-controls">
                      <button className="btn-hint">💡 HINT HELP</button>
                      <button className="btn-solution">✓ GET SOLUTION</button>
                    </div>
                  </div>
                </div>

                {/* Practice Questions */}
                <div className="practice-questions">
                  {/* Question 1 */}
                  <div className="practice-question">
                    <div className="question-header">
                      <h3>Question 1</h3>
                      <button className="bookmark-question">📑</button>
                    </div>
                    
                    <div className="question-content">
                      <div className="question-text">
                        <p>Simplify the following: 3x/y</p>
                        <div className="math-expression">
                          3x/y - 4y/3 = 3x/y
                        </div>
                      </div>
                      
                      <div className="answer-options">
                        <div 
                          className={`answer-option ${getAnswerStyle('q1', 'A')}`}
                          onClick={() => handleAnswerSelect('q1', 'A')}
                        >
                          <span className="answer-letter">A</span>
                          <span className="answer-text">3/2</span>
                        </div>
                        <div 
                          className={`answer-option ${getAnswerStyle('q1', 'B')}`}
                          onClick={() => handleAnswerSelect('q1', 'B')}
                        >
                          <span className="answer-letter">B</span>
                          <span className="answer-text">1/2</span>
                        </div>
                        <div 
                          className={`answer-option ${getAnswerStyle('q1', 'C')}`}
                          onClick={() => handleAnswerSelect('q1', 'C')}
                        >
                          <span className="answer-letter">C</span>
                          <span className="answer-text">4/3</span>
                        </div>
                        <div 
                          className={`answer-option ${getAnswerStyle('q1', 'D')}`}
                          onClick={() => handleAnswerSelect('q1', 'D')}
                        >
                          <span className="answer-letter">D</span>
                          <span className="answer-text">3/2</span>
                        </div>
                      </div>
                      
                      <div className="question-actions">
                        <button className="btn-correct-answer">Correct Answer</button>
                        <button className="btn-video-walkthrough">Video Walkthrough</button>
                      </div>
                    </div>
                  </div>

                  {/* Question 2 */}
                  <div className="practice-question">
                    <div className="question-header">
                      <h3>Question 2</h3>
                      <button className="bookmark-question">📑</button>
                    </div>
                    
                    <div className="question-content">
                      <div className="question-text">
                        <p>Simplify the following: 3x/y</p>
                        <div className="math-expression">
                          3x/y - 4y/3 = 3x/y
                        </div>
                      </div>
                      
                      <div className="answer-options">
                        <div 
                          className={`answer-option ${getAnswerStyle('q2', 'A')}`}
                          onClick={() => handleAnswerSelect('q2', 'A')}
                        >
                          <span className="answer-letter">A</span>
                          <span className="answer-text">3/2</span>
                        </div>
                        <div 
                          className={`answer-option correct ${getAnswerStyle('q2', 'B')}`}
                          onClick={() => handleAnswerSelect('q2', 'B')}
                        >
                          <span className="answer-letter">B</span>
                          <span className="answer-text">1/2</span>
                        </div>
                        <div 
                          className={`answer-option selected ${getAnswerStyle('q2', 'C')}`}
                          onClick={() => handleAnswerSelect('q2', 'C')}
                        >
                          <span className="answer-letter">C</span>
                          <span className="answer-text">4/3</span>
                        </div>
                        <div 
                          className={`answer-option ${getAnswerStyle('q2', 'D')}`}
                          onClick={() => handleAnswerSelect('q2', 'D')}
                        >
                          <span className="answer-letter">D</span>
                          <span className="answer-text">3/2</span>
                        </div>
                      </div>
                      
                      <div className="question-actions">
                        <button className="btn-correct-answer active">Correct Answer</button>
                        <button className="btn-video-walkthrough">Video Walkthrough</button>
                      </div>
                      
                      {/* Show answer feedback */}
                      <div className="answer-feedback">
                        <div className="feedback-icon">✗</div>
                      </div>
                    </div>
                  </div>

                  {/* Question 3 with Video Modal */}
                  <div className="practice-question">
                    <div className="question-header">
                      <h3>Question 3</h3>
                      <button className="question-close">✕</button>
                    </div>
                    
                    {/* Video Modal */}
                    <div className="video-modal-overlay">
                      <div className="video-modal">
                        <div className="video-placeholder large">
                          <div className="video-icon">▶</div>
                          <div className="video-text">
                            <span>VIDEO</span>
                            <span>MODAL</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="question-content">
                      <div className="answer-options">
                        <div className="answer-option">
                          <span className="answer-letter">D</span>
                          <span className="answer-text">3/2</span>
                        </div>
                      </div>
                      
                      <div className="question-actions">
                        <button className="btn-correct-answer">Correct Answer</button>
                        <button className="btn-video-walkthrough">Video Walkthrough</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* End of Topic Test Button */}
                <div className="topic-test-section">
                  <button className="btn-end-topic-test">
                    END OF TOPIC TEST →
                  </button>
                </div>
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