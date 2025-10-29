'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import './create-practice-pack.css';

export default function CreatePracticePackPage() {
  const router = useRouter();
  
  const [packName, setPackName] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  
  // Filter states
  const [questionType, setQuestionType] = useState(true);
  const [subType, setSubType] = useState(false);
  const [year, setYear] = useState(false);
  const [difficulty, setDifficulty] = useState(false);
  const [examSession, setExamSession] = useState(false);
  const [filter6, setFilter6] = useState(false);
  
  // Additional filter states for left panel
  const [criticalThinking, setCriticalThinking] = useState(true);
  const [problemSolving, setProblemSolving] = useState(false);
  
  // Number of questions and font size states
  const [numberOfQuestions, setNumberOfQuestions] = useState(1);
  const [fontSize, setFontSize] = useState(12);
  
  // Mouse drag states for sliders
  const [isDraggingQuestions, setIsDraggingQuestions] = useState(false);
  const [isDraggingFont, setIsDraggingFont] = useState(false);

  const subjects = ['Maths', 'Physics', 'Chemistry', 'Biology', 'Economics', 'TSA'];

  const handleClearFilters = () => {
    setQuestionType(false);
    setSubType(false);
    setYear(false);
    setDifficulty(false);
    setExamSession(false);
    setFilter6(false);
    setCriticalThinking(false);
    setProblemSolving(false);
  };

  // Handle question slider drag
  const handleQuestionSliderDrag = (e: React.MouseEvent) => {
    if (!isDraggingQuestions) return;
    
    const slider = e.currentTarget.parentElement;
    if (!slider) return;
    const rect = slider.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const value = Math.round(1 + percentage * 49); // 1 to 50
    setNumberOfQuestions(value);
  };

  // Handle font size slider drag
  const handleFontSliderDrag = (e: React.MouseEvent) => {
    if (!isDraggingFont) return;
    
    const slider = e.currentTarget.parentElement;
    if (!slider) return;
    const rect = slider.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const value = Math.round(8 + percentage * 16); // 8pt to 24pt
    setFontSize(value);
  };

  // Mouse event handlers
  const handleMouseUp = () => {
    setIsDraggingQuestions(false);
    setIsDraggingFont(false);
  };

  React.useEffect(() => {
    if (isDraggingQuestions || isDraggingFont) {
      document.addEventListener('mouseup', handleMouseUp);
      return () => document.removeEventListener('mouseup', handleMouseUp);
    }
  }, [isDraggingQuestions, isDraggingFont]);

  const handleSelectQuestions = () => {
    // Store pack data in sessionStorage to pass to next step
    const packData = {
      packName,
      subject: selectedSubject,
      numberOfQuestions,
      fontSize,
      filters: {
        questionType,
        subType,
        year,
        difficulty,
        examSession,
        filter6,
        criticalThinking,
        problemSolving
      }
    };
    
    sessionStorage.setItem('packData', JSON.stringify(packData));
    router.push('/select-practice-questions');
  };

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

      {/* Close Button */}
      <Link href="/practice" className="close-button">
        ×
      </Link>

      {/* Main Content */}
      <div className="main-content">
        {/* Back Button */}
        <Link href="/practice" style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          border: '2px solid #000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          fontSize: '24px',
          color: '#000000',
          cursor: 'pointer',
          zIndex: 200,
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#F0F0F0';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#FFFFFF';
        }}>
          ←
        </Link>

        {/* Header */}
        <h1 style={{
          fontFamily: "'Madimi One', cursive",
          fontSize: '32px',
          fontWeight: '400',
          color: '#000000',
          margin: '0 0 40px 0',
          textAlign: 'left'
        }}>
          Create Your Practice Pack
        </h1>

        {/* Step indicator */}
        <div className="step-indicator">
          Step 1 of 2
        </div>

        {/* Two Cards Side by Side */}
        <div className="cards-container">
          
          {/* Left Card */}
          <article className="card">
            {/* Left Card Header */}
            <header className="card-header">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                <span className="card-title">
                  Pack Name
                </span>
              </div>
            </header>

            <div style={{ color: '#333333' }}>
              {/* Pack Name Input */}
              <input
                type="text"
                placeholder="Type your pack name"
                value={packName}
                onChange={(e) => setPackName(e.target.value)}
                className="pack-name-input"
              />

              {/* Subject */}
              <div style={{ marginBottom: '25px' }}>
                <h3 className="card-title" style={{ margin: '0 0 15px 0' }}>
                  Subject
                </h3>
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
                    className="subject-dropdown-button"
                  >
                    {selectedSubject || 'Select subject'}
                    <span style={{ transform: showSubjectDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                  </button>
                  {showSubjectDropdown && (
                    <div className="dropdown-menu">
                      {subjects.map((subject) => (
                        <button
                          key={subject}
                          onClick={() => {
                            setSelectedSubject(subject);
                            setShowSubjectDropdown(false);
                          }}
                          className="dropdown-item"
                        >
                          {subject}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Question Filters */}
              <div style={{ marginBottom: '30px' }}>
                <h3 className="card-title" style={{ margin: '0 0 15px 0' }}>
                  Question Filters
                </h3>
                
                {/* Filter checkboxes in grid */}
                <div className="filter-grid">
                  <div className="filter-item">
                    <input type="checkbox" checked={questionType} onChange={(e) => setQuestionType(e.target.checked)} className="filter-checkbox" />
                    <span className="filter-label">Question Type</span>
                  </div>
                  
                  <div className="filter-item">
                    <input type="checkbox" checked={subType} onChange={(e) => setSubType(e.target.checked)} className="filter-checkbox" />
                    <span className="filter-label">Sub Type</span>
                  </div>
                  
                  <div className="filter-item">
                    <input type="checkbox" checked={year} onChange={(e) => setYear(e.target.checked)} className="filter-checkbox" />
                    <span className="filter-label">Year</span>
                  </div>
                  
                  <div className="filter-item">
                    <input type="checkbox" checked={difficulty} onChange={(e) => setDifficulty(e.target.checked)} className="filter-checkbox" />
                    <span className="filter-label">Difficulty</span>
                  </div>
                  
                  <div className="filter-item">
                    <input type="checkbox" checked={examSession} onChange={(e) => setExamSession(e.target.checked)} className="filter-checkbox" />
                    <span className="filter-label">Exam Session</span>
                  </div>
                  
                  <div className="filter-item">
                    <input type="checkbox" checked={filter6} onChange={(e) => setFilter6(e.target.checked)} className="filter-checkbox" />
                    <span className="filter-label">Filter 6</span>
                  </div>
                </div>

                {/* Critical Thinking / Problem Solving section */}
                <div className="critical-thinking-section">
                  <div className="thinking-options">
                    <label className="thinking-label">
                      <input 
                        type="checkbox" 
                        checked={criticalThinking} 
                        onChange={(e) => setCriticalThinking(e.target.checked)} 
                        className="filter-checkbox"
                      />
                      <span className="thinking-text">
                        Critical Thinking
                      </span>
                    </label>
                    <label className="thinking-label">
                      <input 
                        type="checkbox" 
                        checked={problemSolving} 
                        onChange={(e) => setProblemSolving(e.target.checked)} 
                        className="filter-checkbox"
                      />
                      <span className="thinking-text">
                        Problem Solving
                      </span>
                    </label>
                  </div>
                </div>

                {/* Clear filters button */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}>
                  <button 
                    className="clear-filters-button"
                    onClick={handleClearFilters}
                  >
                    clear filters
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* Right Card */}
          <article className="card">
            {/* Right Card Header */}
            <header className="card-header">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                <span className="card-title">
                  Number of Questions
                </span>
              </div>
            </header>

            <div style={{ color: '#333333' }}>
              {/* Number of Questions Slider */}
              <div style={{
                marginBottom: '25px'
              }}>
                <div className="slider-container">
                  <input
                    type="text"
                    value="1"
                    readOnly
                    className="slider-input"
                  />
                  <div 
                    className="slider-track"
                    style={{ height: '20px' }}
                    onMouseMove={handleQuestionSliderDrag}
                  >
                    <Image 
                      src="/icons/speech-bubble-ghost.svg" 
                      alt="Question counter" 
                      width={40} 
                      height={40}
                      style={{
                        position: 'absolute',
                        left: `${((numberOfQuestions - 1) / 49) * 100}%`,
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        cursor: 'grab'
                      }}
                      onMouseDown={() => setIsDraggingQuestions(true)}
                      draggable={false}
                    />
                  </div>
                  <input
                    type="text"
                    value="50"
                    readOnly
                    className="slider-input"
                  />
                </div>
                <div style={{
                  textAlign: 'center',
                  marginTop: '10px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#000000'
                }}>
                  {numberOfQuestions} questions selected
                </div>
                <p className="availability-text">
                  Questions available with current filters
                </p>
              </div>

              {/* Font Size Section */}
              <div style={{ marginBottom: '25px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '15px'
                }}>
                  <span className="card-title">
                    Font Size 
                  </span>
                  <span style={{
                    fontFamily: "'Madimi One', sans-serif",
                    fontSize: '16px',
                    fontWeight: 400,
                    color: '#000000'
                  }}>
                    {fontSize}pt
                  </span>
                </div>
                <div className="font-size-controls">
                  <span className="font-size-text">small</span>
                  <div 
                    className="font-slider-track"
                    style={{ height: '20px' }}
                    onMouseMove={handleFontSliderDrag}
                  >
                    <Image 
                      src="/icons/speech-bubble-ghost.svg" 
                      alt="Font size slider" 
                      width={40} 
                      height={40}
                      style={{
                        position: 'absolute',
                        left: `${((fontSize - 8) / 16) * 100}%`,
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        cursor: 'grab'
                      }}
                      onMouseDown={() => setIsDraggingFont(true)}
                      draggable={false}
                    />
                  </div>
                  <span className="font-size-text">large</span>
                </div>
              </div>


            </div>
            
            {/* Select Questions Button - Bottom Right */}
            <button 
              onClick={handleSelectQuestions}
              className="select-questions-button"
              disabled={!packName || !selectedSubject}
              style={{ 
                opacity: (!packName || !selectedSubject) ? 0.5 : 1,
                cursor: (!packName || !selectedSubject) ? 'not-allowed' : 'pointer'
              }}
            >
              Select Questions
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </article>
        </div>
      </div>
    </div>
  );
}