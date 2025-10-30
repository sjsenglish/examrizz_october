'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import './create-question-pack.css';

export default function CreateQuestionPackPage() {
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
  
  // Order questions state
  const [orderMode, setOrderMode] = useState('automatic'); // 'automatic' or 'custom'

  const subjects = ['Maths', 'Physics', 'Chemistry', 'Biology', 'Economics'];

  return (
    <div className="page-background" style={{ paddingTop: '60px' }}>
      <Navbar />

      {/* Back Button */}
      <Link 
        href="/teacher" 
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

      {/* Main Content */}
      <div className="main-content">
        {/* Modal */}
        <div className="modal-container">
          {/* Close Button */}
          <Link href="/question-packs" className="close-button">
            ×
          </Link>

          {/* Header */}
          <h1 className="header-title">
            Create Your Question Pack
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
                    <button className="clear-filters-button">
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
                    <div className="slider-track">
                      <Image 
                        src="/icons/speech-bubble-ghost.svg" 
                        alt="Question counter" 
                        width={40} 
                        height={40}
                        style={{
                          position: 'absolute',
                          left: '30%',
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          cursor: 'pointer'
                        }}
                      />
                    </div>
                    <input
                      type="text"
                      value="168"
                      readOnly
                      className="slider-input"
                    />
                  </div>
                  <p className="availability-text">
                    360 questions available with current filters
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
                      12pt
                    </span>
                  </div>
                  <div className="font-size-controls">
                    <span className="font-size-text">small</span>
                    <div className="font-slider-track">
                      <Image 
                        src="/icons/speech-bubble-ghost.svg" 
                        alt="Font size slider" 
                        width={40} 
                        height={40}
                        style={{
                          position: 'absolute',
                          left: '30%',
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          cursor: 'pointer'
                        }}
                      />
                    </div>
                    <span className="font-size-text">large</span>
                  </div>
                </div>

                {/* Order Questions By Section */}
                <div style={{ marginBottom: '25px' }}>
                  <h3 className="card-title" style={{ margin: '0 0 15px 0' }}>
                    Order questions by
                  </h3>
                  <div className="order-buttons">
                    <div 
                      className={orderMode === 'automatic' ? 'order-button-active' : 'order-button-inactive'}
                      onClick={() => setOrderMode('automatic')}
                      style={{ cursor: 'pointer' }}
                    >
                      <span className="order-button-text">
                        Automatic
                      </span>
                    </div>
                    <div 
                      className={orderMode === 'custom' ? 'order-button-active' : 'order-button-inactive'}
                      onClick={() => setOrderMode('custom')}
                      style={{ cursor: 'pointer' }}
                    >
                      <span className="order-button-text">
                        Custom
                      </span>
                    </div>
                  </div>
                  {orderMode === 'custom' && (
                    <p className="order-description">
                      You'll arrange questions manually in the next step
                    </p>
                  )}

                  {/* Conditional Filters - Show when Automatic is selected */}
                  {orderMode === 'automatic' && (
                    <div style={{ marginTop: '20px' }}>
                      {/* Filter checkboxes in grid - same as left panel */}
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
                    </div>
                  )}
                </div>

              </div>
              
              {/* Select Questions Button - Bottom Right */}
              <Link href="/select-questions" className="select-questions-button">
                Select Questions
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}