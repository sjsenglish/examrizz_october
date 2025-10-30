import './learn-lesson.css';

export default function LearnLesson() {
  return (
    <div className="learn-lesson-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
        </div>
        
        <div className="subject-selector">
          <div className="subject-header">Edexcel A Level Maths</div>
          <div className="subject-title">Pure Mathematics ▼</div>
        </div>

        <div className="topics-list">
          <div className="topic-section">
            <div className="topic-header">
              <span className="topic-number">1</span>
              <span className="topic-title">Proof</span>
              <span className="topic-grade">A*</span>
            </div>
            
            <div className="subtopic active">
              <span className="subtopic-number">1.1</span>
              <span className="subtopic-title">Mathematical Proof</span>
              <span className="expand-icon">▼</span>
            </div>
            
            <div className="subtopic-details">
              <div className="subtopic-item">• How to proof by exhaustion</div>
              <div className="subtopic-item">• Disproof by counter example counter example</div>
            </div>
            
            <div className="subtopic">
              <span className="subtopic-number">1.1</span>
              <span className="subtopic-title">Mathematical Proof</span>
              <span className="expand-icon">▶</span>
            </div>
          </div>

          <div className="topic-section">
            <div className="topic-header">
              <span className="topic-number">2</span>
              <span className="topic-title">Algebra and functions</span>
              <span className="topic-grade">B</span>
              <span className="expand-icon">▶</span>
            </div>
          </div>

          <div className="topic-section">
            <div className="topic-header">
              <span className="topic-number">3</span>
              <span className="topic-title">Spec topic</span>
              <span className="topic-grade">C</span>
              <span className="expand-icon">▶</span>
            </div>
          </div>

          <div className="topic-section">
            <div className="topic-header">
              <span className="topic-number">4</span>
              <span className="topic-title">Spec topic</span>
              <span className="topic-grade">A**</span>
              <span className="expand-icon">▶</span>
            </div>
          </div>

          <div className="topic-section">
            <div className="topic-header">
              <span className="topic-number">5</span>
              <span className="topic-title">Spec topic</span>
              <span className="topic-grade">A</span>
              <span className="expand-icon">▶</span>
            </div>
          </div>

          <div className="topic-section">
            <div className="topic-header">
              <span className="topic-number">6</span>
              <span className="topic-title">Spec topic</span>
              <span className="topic-grade">A*</span>
              <span className="expand-icon">▶</span>
            </div>
          </div>

          <div className="topic-section">
            <div className="topic-header">
              <span className="topic-number">7</span>
              <span className="topic-title">Spec topic</span>
              <span className="topic-grade">B</span>
              <span className="expand-icon">▶</span>
            </div>
          </div>

          <div className="topic-section">
            <div className="topic-header">
              <span className="topic-number">8</span>
              <span className="topic-title">Spec topic</span>
              <span className="topic-grade">A</span>
              <span className="expand-icon">▶</span>
            </div>
          </div>

          <div className="topic-section">
            <div className="topic-header">
              <span className="topic-number">9</span>
              <span className="topic-title">Spec topic</span>
              <span className="topic-grade">C</span>
              <span className="expand-icon">▶</span>
            </div>
          </div>

          <div className="topic-section">
            <div className="topic-header">
              <span className="topic-number">10</span>
              <span className="topic-title">Spec topic</span>
              <span className="topic-grade">B</span>
              <span className="expand-icon">▶</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Stats Dashboard */}
        <div className="stats-dashboard">
          <div className="stat-card working-grade">
            <div className="stat-label">WORKING GRADE</div>
            <div className="grade-display">
              <span className="grade-letter">A</span>
              <span className="grade-text">Current</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: '85%'}}></div>
            </div>
            <div className="progress-text">85% to A*</div>
          </div>

          <div className="stat-card predicted-grade">
            <div className="stat-label">PREDICTED GRADE</div>
            <div className="grade-display">
              <span className="grade-letters">A/ A*</span>
              <div className="grade-details">
                <div className="trend">↗ Trending up</div>
                <div className="basis">Based on current trajectory</div>
              </div>
            </div>
          </div>

          <div className="stat-card learning-streak">
            <div className="stat-label">LEARNING STREAK</div>
            <div className="streak-display">
              <div className="streak-icon">💧</div>
              <div className="streak-info">
                <span className="streak-number">5</span>
                <span className="streak-unit">DAYS</span>
              </div>
              <div className="streak-encouragement">Keep going!</div>
            </div>
          </div>

          <div className="stat-card exam-readiness">
            <div className="stat-label">EXAM READINESS</div>
            <div className="readiness-content">
              <div className="topics-progress">
                <span>Topics</span>
                <span>14/20</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '70%'}}></div>
              </div>
              <div className="exam-status">✓ Exam pace on track</div>
            </div>
          </div>

          <div className="stat-card grade-split">
            <div className="stat-label">GRADE SPLIT BY TOPIC</div>
            <div className="pie-chart">
              <svg viewBox="0 0 100 100" className="pie">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#E0E0E0" strokeWidth="20"/>
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#00CED1" strokeWidth="20" 
                        strokeDasharray="50 251" strokeDashoffset="0" transform="rotate(-90 50 50)"/>
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#B3F0F2" strokeWidth="20" 
                        strokeDasharray="40 251" strokeDashoffset="-50" transform="rotate(-90 50 50)"/>
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#89F3FF" strokeWidth="20" 
                        strokeDasharray="30 251" strokeDashoffset="-90" transform="rotate(-90 50 50)"/>
              </svg>
              <div className="legend">
                <div className="legend-item"><span className="color-dot a-star-star"></span>A**</div>
                <div className="legend-item"><span className="color-dot a-star"></span>A*</div>
                <div className="legend-item"><span className="color-dot a-grade"></span>A</div>
                <div className="legend-item"><span className="color-dot b-grade"></span>B</div>
                <div className="legend-item"><span className="color-dot c-grade"></span>C</div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Stats */}
        <div className="weekly-stats">
          <div className="stat-item">
            <div className="stat-icon">📊</div>
            <div className="stat-value">47</div>
            <div className="stat-desc">Questions</div>
            <div className="stat-period">THIS WEEK</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">73%</div>
            <div className="stat-desc">Accuracy</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">3h 24m</div>
            <div className="stat-desc">Study Time</div>
          </div>
        </div>

        {/* Grade Trajectory */}
        <div className="grade-trajectory">
          <div className="trajectory-header">
            <span>GRADE TRAJECTORY</span>
            <span className="trajectory-trend">+1.5 grades ↗</span>
          </div>
          <div className="trajectory-chart">
            <svg viewBox="0 0 300 100" className="chart">
              <polyline points="0,80 75,70 150,60 225,45 300,30" 
                        stroke="#00CED1" strokeWidth="3" fill="none"/>
              <circle cx="0" cy="80" r="4" fill="#00CED1"/>
              <circle cx="75" cy="70" r="4" fill="#00CED1"/>
              <circle cx="150" cy="60" r="4" fill="#00CED1"/>
              <circle cx="225" cy="45" r="4" fill="#00CED1"/>
              <circle cx="300" cy="30" r="4" fill="#00CED1"/>
            </svg>
            <div className="week-labels">
              <span>W2</span>
              <span>W3</span>
              <span>W4</span>
              <span>W5</span>
            </div>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="lesson-content">
          <div className="lesson-header">
            <div className="breadcrumb">1 Proof</div>
            <div className="lesson-title">1.1 Mathematical Proof</div>
            <div className="lesson-subtitle">How to proof by exhaustion</div>
            <div className="lesson-grade">A*</div>
          </div>

          <div className="video-section">
            <h3>Video Lesson</h3>
            <div className="video-placeholder">
              <div className="video-text">VIDEO<br/>embedded in page</div>
              <div className="bookmark-icon">🔖</div>
            </div>
            <p className="video-description">
              Proof by deduction e.g. using completion of the square, prove that n2 – 6n + 10 is positive for all values of n or, for 
              example, differentiation from first principles for small positive integer powers of x or proving results for arithmetic and 
              geometric series. This is the most commonly used method of proof throughout this specification
            </p>
          </div>

          <div className="examples-section">
            <h3>Examples</h3>
            
            <div className="example-card">
              <div className="example-header">Example 1</div>
              <div className="example-question">Simplify the following: b/q+ k/u</div>
              <div className="example-buttons">
                <button className="btn-worked">Worked Solution</button>
                <button className="btn-walkthrough">Question Walkthrough</button>
              </div>
            </div>

            <div className="example-card">
              <div className="example-header">Example 2</div>
              <div className="example-question">Simplify the following: b/q+ k/u</div>
              <div className="example-buttons">
                <button className="btn-worked">Worked Solution</button>
                <button className="btn-walkthrough">Question Walkthrough</button>
              </div>
            </div>

            <div className="working-section">
              <div className="working-header">Simplify</div>
              <div className="working-text">Proof by deduction e.g. using completion of the square, prove that n2 – 6n + 10 is positive for all</div>
              
              <div className="working-steps">
                <div className="step-header">Apply the idea</div>
                <div className="math-steps">
                  <div className="math-line">
                    <span className="fraction">3y/8</span>
                    <span className="operator">-</span>
                    <span className="fraction">4y/9</span>
                    <span className="equals">=</span>
                    <span className="fraction">3y × 9/8 × 9</span>
                    <span className="description">Multiply the numerator</span>
                  </div>
                  <div className="math-line">
                    <span className="equals">=</span>
                    <span className="fraction">12y²/72</span>
                    <span className="description">Multiply the numerator</span>
                  </div>
                  <div className="math-line">
                    <span className="equals">=</span>
                    <span className="fraction">12 × y²/12 × 6</span>
                    <span className="description">Multiply the numerator</span>
                  </div>
                  <div className="math-line">
                    <span className="equals">=</span>
                    <span className="fraction">y²/6</span>
                    <span className="description">Multiply the numerator</span>
                  </div>
                </div>
              </div>

              <div className="simplify-section">
                <div className="simplify-header">Simplify</div>
                <div className="simplify-text">
                  Proof by deduction e.g. using completion of the square, prove that n2 – 6n + 10 is positive for all Proof by 
                  deduction e.g. using completion of the square, prove that n2 – 6n + 10 is positive for all Proof by deduction 
                  e.g. using completion of the square, prove that n2 – 6n + 10.
                </div>
              </div>
            </div>

            <div className="example-card">
              <div className="example-header">Example 3</div>
              <div className="example-question">Simplify the following: b/q+ k/u</div>
              <div className="example-buttons">
                <button className="btn-worked">Worked Solution</button>
                <button className="btn-walkthrough">Question Walkthrough</button>
              </div>
              
              <div className="video-placeholder small">
                <div className="video-text">
                  VIDEO<br/>
                  appears below question<br/>
                  walkthrough button when<br/>
                  clicked<br/>
                  (like a toggle effect)
                </div>
              </div>
            </div>
          </div>

          <div className="lesson-summary">
            <div className="summary-header">LESSON SUMMARY</div>
            <div className="summary-text">
              Proof by deduction e.g. using completion of the square, prove that n2 – 6n + 10 is positive for all Proof by 
              deduction e.g. using completion of the square, prove that n2 – 6n + 10 is positive for all Proof by deduction 
              e.g. using completion of the square, prove that n2 – 6n + 10.
            </div>
            <div className="formula-display">
              <span className="formula">A/B</span>
              <span className="operator">:</span>
              <span className="formula">C/D</span>
              <span className="equals">=</span>
              <span className="formula">A/B</span>
              <span className="operator">×</span>
              <span className="formula">D/C</span>
            </div>
          </div>

          <div className="practice-button-container">
            <button className="practice-button">PRACTICE ▶</button>
          </div>
        </div>
      </div>
    </div>
  );
}