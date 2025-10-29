'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import './learn-lesson.css';

export default function LearnLesson() {
  // NOTE: This is the LEARN-LESSON page with embedded lesson practice
  // This is DIFFERENT from the main /practice page which manages question packs
  // Lesson practice = practice questions within a specific lesson/topic
  // Main practice = standalone practice sessions with custom question packs
  
  const [activeTab, setActiveTab] = useState('lesson');
  const [expandedTopics, setExpandedTopics] = useState<{[key: string]: boolean}>({
    'proof': true
  });
  const [workedSolutions, setWorkedSolutions] = useState<{[key: string]: boolean}>({});
  // Lesson practice state - for practice questions embedded in lessons
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

  // Timer for lesson practice tab (different from main practice page timer)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTab === 'lesson-practice') {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTab]);

  return (
    <div className="learn-lesson-wrapper">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-left">
          <Link href="/" className="navbar-logo">examrizzsearch</Link>
        </div>
        <div className="nav-center">
        </div>
        <div className="nav-right">
          <button className="navbar-menu">
            <div className="navbar-menu-line"></div>
            <div className="navbar-menu-line"></div>
            <div className="navbar-menu-line"></div>
          </button>
        </div>
      </nav>

      {/* Back Button */}
      <Link 
        href="/learn" 
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

      {/* Page Content */}
      <div className="page-content">
        {/* Left Section Container */}
        <div className="left-section-container">
          {/* Search Bar */}
          <div className="search-bar-container">
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

          {/* Subject Dropdown Container */}
          <div className="subject-dropdown-container">
            <div className="subject-selector">
              <span className="subject-label">Edexcel A Level Maths</span>
              <select className="subject-dropdown">
                <option>Pure Mathematics ▼</option>
              </select>
            </div>
          </div>

          {/* Topics Navigation */}
          <div className="topics-container">
            <div className="topic-navigation">
              <div className="topic-item">
                <div 
                  className="topic-header"
                  onClick={() => toggleTopic('proof')}
                >
                  <span className="topic-number">1</span>
                  <span className="topic-title">Proof</span>
                  <span className="topic-grade">A*</span>
                  <span className={`topic-arrow ${expandedTopics.proof ? 'expanded' : ''}`}>▼</span>
                </div>
                {expandedTopics.proof && (
                  <div className="subtopic-list">
                    <div className="subtopic-item">
                      <span className="subtopic-number">1.1</span>
                      <span className="subtopic-title">Mathematical Proof</span>
                    </div>
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
                    <span className="topic-title">Spec topic</span>
                    <span className="topic-grade">A*</span>
                    <span className="topic-arrow">▼</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          {/* Stats Dashboard */}
          <div className="dashboard-header">
        <div className="dashboard-cards">
          <div className="dashboard-card working-grade">
            <div className="card-header">
              <div className="grade-icon">📊</div>
              <span className="card-title">WORKING GRADE</span>
            </div>
            <div className="grade-display">
              <span className="current-grade">A</span>
              <div className="grade-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '85%'}}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-card predicted-grade">
            <div className="card-header">
              <span className="card-title">PREDICTED GRADE</span>
            </div>
            <div className="grade-display">
              <span className="predicted-grades">A/ A*</span>
              <div className="grade-details">
                <span>Based on</span>
                <span>current work</span>
              </div>
            </div>
          </div>

          <div className="dashboard-card learning-streak">
            <div className="card-header">
              <div className="streak-icon">🔥</div>
              <span className="card-title">LEARNING STREAK</span>
            </div>
            <div className="streak-display">
              <span className="streak-number">5</span>
              <span className="streak-unit">days</span>
              <div className="streak-details">
                <span>Keep</span>
                <span>going!</span>
              </div>
            </div>
          </div>

          <div className="dashboard-card exam-readiness">
            <div className="card-header">
              <span className="card-title">EXAM READINESS</span>
            </div>
            <div className="readiness-display">
              <span className="readiness-percent">74/100</span>
              <div className="readiness-details">
                <span>• Exam pace on track</span>
              </div>
            </div>
          </div>

          <div className="dashboard-card grade-shift">
            <div className="card-header">
              <span className="card-title">GRADE SHIFT BY TOPIC</span>
            </div>
            <div className="grade-shift-chart">
              <div className="pie-chart">
                <svg width="50" height="50" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="35" fill="#E3F2FD" stroke="#1976D2" strokeWidth="10" strokeDasharray="110 220" strokeDashoffset="0"/>
                  <circle cx="40" cy="40" r="35" fill="none" stroke="#4CAF50" strokeWidth="10" strokeDasharray="55 275" strokeDashoffset="-110"/>
                  <circle cx="40" cy="40" r="35" fill="none" stroke="#FF9800" strokeWidth="10" strokeDasharray="55 275" strokeDashoffset="-165"/>
                </svg>
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color blue"></span>
                  <span>A*</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color green"></span>
                  <span>A</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color orange"></span>
                  <span>B</span>
                </div>
              </div>
            </div>
          </div>
        </div>

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
      </div>

          {/* Main Lesson Content - No container, just white background */}
          <div className="lesson-content">
          {/* Lesson Tabs */}
          <div className="lesson-tabs">
            <button 
              className={`tab ${activeTab === 'lesson' ? 'active' : ''}`}
              onClick={() => setActiveTab('lesson')}
            >
              LESSON
            </button>
            <button 
              className={`tab ${activeTab === 'lesson-practice' ? 'active' : ''}`}
              onClick={() => setActiveTab('lesson-practice')}
            >
              LESSON PRACTICE
            </button>
            <button 
              className={`tab ${activeTab === 'test' ? 'active' : ''}`}
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

          {/* Lesson Content */}
          {activeTab === 'lesson' && (
            <div className="lesson-tab-content">
              {/* Video Lesson */}
              <div className="video-section">
                <h2 className="section-title">Video Lesson</h2>
                <div className="video-container">
                  <div className="video-placeholder">
                    <div className="video-icon">▶</div>
                    <span>VIDEO</span>
                    <span>embedded in page</span>
                  </div>
                  <button className="bookmark-btn">🔖</button>
                </div>
                <p className="video-description">
                  Proof by deduction e.g. using completion of the square, prove that x² - 6x + 10 is positive for all values of x, for example. differentiation from first principles for nax^n and positive integer powers. Q4 of proving results for arithmetic and geometric series. This is the most commonly used method of proof throughout this specification
                </p>
              </div>

              {/* Examples Section */}
              <div className="examples-section">
                <h2 className="section-title">Examples</h2>
                
                <div className="example-item">
                  <div className="example-header">
                    <h3>Example 1</h3>
                  </div>
                  <p className="example-question">Simplify the following: \\(x+Mx\\)</p>
                  <div className="example-buttons">
                    <button 
                      className={`example-btn worked ${workedSolutions.example1 ? 'active' : ''}`}
                      onClick={() => toggleWorkedSolution('example1')}
                    >
                      Worked Solution
                    </button>
                    <button className="example-btn walkthrough">Question Walkthrough</button>
                  </div>
                </div>

                <div className="example-item">
                  <div className="example-header">
                    <h3>Example 2</h3>
                  </div>
                  <p className="example-question">Simplify the following: \\(x+Mx\\)</p>
                  <div className="example-buttons">
                    <button 
                      className={`example-btn worked ${workedSolutions.example2 ? 'active' : ''}`}
                      onClick={() => toggleWorkedSolution('example2')}
                    >
                      Worked Solution
                    </button>
                    <button className="example-btn walkthrough">Question Walkthrough</button>
                  </div>

                  {/* Worked Solution Content */}
                  {workedSolutions.example2 && (
                  <div className="solution-content">
                    <h4>Simplify</h4>
                    <p>Proof by deduction e.g. using completion of the square, prove that x² - 6x + 10 is positive for all</p>
                    
                    <div className="solution-steps">
                      <h4>Apply the idea</h4>
                      <div className="math-steps">
                        <div className="step">
                          <span className="step-math">3x - 4y = 1y - 1x</span>
                          <span className="step-desc">Multiply the numerator</span>
                        </div>
                        <div className="step">
                          <span className="step-math">= 5 - 9</span>
                          <span className="step-desc">Multiply the numerator</span>
                        </div>
                        <div className="step">
                          <span className="step-math">= 13²</span>
                          <span className="step-desc">Multiply the numerator</span>
                        </div>
                        <div className="step">
                          <span className="step-math">12 ÷ 3² = 4²</span>
                          <span className="step-desc">Multiply the numerator</span>
                        </div>
                        <div className="step">
                          <span className="step-math">= x²/6</span>
                          <span className="step-desc">Multiply the numerator</span>
                        </div>
                      </div>
                    </div>

                    <div className="solution-steps">
                      <h4>Simplify</h4>
                      <p>Proof by deduction e.g. using completion of the square, prove that x² - 6x + 10 is positive for all Proof by deduction e.g. using completion of the square, prove that x² - 6x + 10 is positive for all Proof by deduction e.g. using completion of the square, prove that x² - 6x + 10.</p>
                    </div>
                  </div>
                  )}
                </div>

                <div className="example-item">
                  <div className="example-header">
                    <h3>Example 3</h3>
                  </div>
                  <p className="example-question">Simplify the following: \\(x+Mx\\)</p>
                  <div className="example-buttons">
                    <button className="example-btn worked">Worked Solution</button>
                    <button className="example-btn walkthrough">Question Walkthrough</button>
                  </div>
                  
                  {/* Video Walkthrough */}
                  <div className="walkthrough-video">
                    <div className="video-placeholder">
                      <div className="video-icon">▶</div>
                      <span>VIDEO</span>
                      <span>appears below question</span>
                      <span>walkthrough button when</span>
                      <span>clicked</span>
                      <span>(like a toggle effect)</span>
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
                    <span className="formula">1/(B - C) = A - D/(B - C)</span>
                  </div>
                </div>
              </div>

              {/* Practice Button */}
              <div className="practice-section">
                <Link href="/practice" className="practice-btn">
                  PRACTICE →
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'lesson-practice' && (
            <div className="lesson-practice-tab-content">
              {/* Practice Header */}
              <div className="practice-header">
                <div className="practice-info">
                  <h1>1.1 Mathematical Proof Practice</h1>
                  <p>How to proof by exhaustion</p>
                </div>
                <div className="practice-stats">
                  <div className="stat-item">
                    <span className="stat-value">3</span>
                    <span className="stat-label">Questions</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">67%</span>
                    <span className="stat-label">Accuracy</span>
                  </div>
                  <div className="timer">
                    {formatTime(elapsedTime)}
                  </div>
                </div>
              </div>

              {/* Question 1 */}
              <div className="question-container">
                <div className="question-header">
                  <h3 className="question-title">Question 1</h3>
                  <span className="question-difficulty">A*</span>
                </div>
                
                <div className="practice-question-content">
                  <div className="practice-question-text">
                    Simplify the following: {String.raw`\(x \div Mx\)`}
                  </div>
                  <div className="practice-math-expression">
                    {String.raw`\(\frac{3x}{y} - \frac{4y}{3} - \frac{3x}{y}\)`}
                  </div>
                  
                  <div className="practice-answer-options">
                    <div 
                      className={`practice-answer-option ${getAnswerStyle('q1', 'A')}`}
                      onClick={() => handleAnswerSelect('q1', 'A')}
                    >
                      <span className="practice-answer-letter">A</span>
                      <span className="practice-answer-text">{String.raw`\(\frac{3}{2}\)`}</span>
                    </div>
                    <div 
                      className={`practice-answer-option ${getAnswerStyle('q1', 'B')}`}
                      onClick={() => handleAnswerSelect('q1', 'B')}
                    >
                      <span className="practice-answer-letter">B</span>
                      <span className="practice-answer-text">{String.raw`\(\frac{1}{2}\)`}</span>
                    </div>
                    <div 
                      className={`practice-answer-option ${getAnswerStyle('q1', 'C')}`}
                      onClick={() => handleAnswerSelect('q1', 'C')}
                    >
                      <span className="practice-answer-letter">C</span>
                      <span className="practice-answer-text">{String.raw`\(\frac{4}{3}\)`}</span>
                    </div>
                    <div 
                      className={`practice-answer-option ${getAnswerStyle('q1', 'D')}`}
                      onClick={() => handleAnswerSelect('q1', 'D')}
                    >
                      <span className="practice-answer-letter">D</span>
                      <span className="practice-answer-text">{String.raw`\(\frac{3}{2}\)`}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Question 2 */}
              <div className="question-container">
                <div className="question-header">
                  <h3 className="question-title">Question 2</h3>
                  <span className="question-difficulty">A*</span>
                </div>
                
                <div className="practice-question-content">
                  <div className="practice-question-text">
                    Simplify the following: {String.raw`\(x \div Mx\)`}
                  </div>
                  <div className="practice-math-expression">
                    {String.raw`\(\frac{3x}{y} - \frac{4y}{3} - \frac{3x}{y}\)`}
                  </div>
                  
                  <div className="practice-answer-options">
                    <div 
                      className={`practice-answer-option ${getAnswerStyle('q2', 'A')}`}
                      onClick={() => handleAnswerSelect('q2', 'A')}
                    >
                      <span className="practice-answer-letter">A</span>
                      <span className="practice-answer-text">{String.raw`\(\frac{3}{2}\)`}</span>
                    </div>
                    <div 
                      className={`practice-answer-option ${getAnswerStyle('q2', 'B')}`}
                      onClick={() => handleAnswerSelect('q2', 'B')}
                    >
                      <span className="practice-answer-letter">B</span>
                      <span className="practice-answer-text">{String.raw`\(\frac{1}{2}\)`}</span>
                    </div>
                    <div 
                      className={`practice-answer-option ${getAnswerStyle('q2', 'C')}`}
                      onClick={() => handleAnswerSelect('q2', 'C')}
                    >
                      <span className="practice-answer-letter">C</span>
                      <span className="practice-answer-text">{String.raw`\(\frac{4}{3}\)`}</span>
                    </div>
                    <div 
                      className={`practice-answer-option ${getAnswerStyle('q2', 'D')}`}
                      onClick={() => handleAnswerSelect('q2', 'D')}
                    >
                      <span className="practice-answer-letter">D</span>
                      <span className="practice-answer-text">{String.raw`\(\frac{3}{2}\)`}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Question 3 with Video Modal */}
              <div className="question-container">
                <div className="question-header">
                  <h3 className="question-title">Question 3</h3>
                  <span className="question-difficulty">A*</span>
                </div>
                
                <div className="practice-question-content">
                  <div className="practice-question-text">
                    Simplify the following:
                  </div>
                  
                  <div className="practice-answer-options">
                    <div 
                      className={`practice-answer-option ${getAnswerStyle('q3', 'A')}`}
                      onClick={() => handleAnswerSelect('q3', 'A')}
                    >
                      <span className="practice-answer-letter">A</span>
                      <span className="practice-answer-text">{String.raw`\(\frac{1}{2}\)`}</span>
                    </div>
                    <div 
                      className={`practice-answer-option ${getAnswerStyle('q3', 'B')}`}
                      onClick={() => handleAnswerSelect('q3', 'B')}
                    >
                      <span className="practice-answer-letter">B</span>
                      <span className="practice-answer-text">See video explanation</span>
                    </div>
                    <div 
                      className={`practice-answer-option ${getAnswerStyle('q3', 'C')}`}
                      onClick={() => handleAnswerSelect('q3', 'C')}
                    >
                      <span className="practice-answer-letter">C</span>
                      <span className="practice-answer-text">{String.raw`\(\frac{3}{2}\)`}</span>
                    </div>
                  </div>
                  
                  <button 
                    className="video-explanation-btn"
                    onClick={() => setShowVideoModal(true)}
                  >
                    📹 Video Explanation
                  </button>
                </div>
              </div>

              {/* End of Topic Test Button */}
              <div className="end-topic-test">
                <button className="end-topic-test-btn">
                  END OF TOPIC TEST
                </button>
              </div>

              {/* Video Modal */}
              {showVideoModal && (
                <div className="video-modal" onClick={() => setShowVideoModal(false)}>
                  <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="video-modal-header">
                      <h3 className="video-modal-title">Question 3 Video Explanation</h3>
                      <button 
                        className="video-modal-close"
                        onClick={() => setShowVideoModal(false)}
                      >
                        ×
                      </button>
                    </div>
                    <div className="video-placeholder">
                      <div className="video-icon">▶</div>
                      <p>VIDEO embedded in page</p>
                      <p>walkthrough button when clicked</p>
                      <p>(like a toggle effect)</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'test' && (
            <div className="tab-content">
              <p>End of topic test content coming soon...</p>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}