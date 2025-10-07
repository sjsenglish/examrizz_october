'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './create-practice-pack.css';

export default function CreatePracticePackPage() {
  const [packName, setPackName] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedExamBoard, setSelectedExamBoard] = useState('');
  const [selectedQuestionType, setSelectedQuestionType] = useState('');
  const [selectedSubType, setSelectedSubType] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [orderMode, setOrderMode] = useState('automatic');
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  const [fontSize, setFontSize] = useState(14);

  return (
    <div className="page-background">
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

      <div className="main-content">
        <div className="modal-container">
          <Link href="/practice" className="close-button">
            ×
          </Link>

          <h1 className="header-title">
            Create Your Practice Pack
          </h1>

          <div className="step-indicator">
            Step 1 of 2
          </div>

          <div className="inner-container">
            <div className="form-section">
              <h2 className="section-title">Pack Details</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Type your pack name</label>
                  <input
                    type="text"
                    value={packName}
                    onChange={(e) => setPackName(e.target.value)}
                    className="form-input"
                    placeholder="Enter pack name"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Select subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Choose subject</option>
                    <option value="maths">Maths</option>
                    <option value="physics">Physics</option>
                    <option value="chemistry">Chemistry</option>
                    <option value="biology">Biology</option>
                    <option value="economics">Economics</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Exam board</label>
                  <select
                    value={selectedExamBoard}
                    onChange={(e) => setSelectedExamBoard(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Choose exam board</option>
                    <option value="aqa">AQA</option>
                    <option value="edexcel">Edexcel</option>
                    <option value="ocr">OCR</option>
                    <option value="wjec">WJEC</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Question type</label>
                  <select
                    value={selectedQuestionType}
                    onChange={(e) => setSelectedQuestionType(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Choose question type</option>
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="short-answer">Short Answer</option>
                    <option value="essay">Essay</option>
                    <option value="calculation">Calculation</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Sub type</label>
                  <select
                    value={selectedSubType}
                    onChange={(e) => setSelectedSubType(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Choose sub type</option>
                    <option value="basic">Basic</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Choose year</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Level</label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Choose level</option>
                    <option value="a-level">A Level</option>
                    <option value="gcse">GCSE</option>
                    <option value="undergraduate">Undergraduate</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="availability-section">
              <p className="availability-text">
                123 questions available for your selection
              </p>
            </div>

            <div className="order-section">
              <h2 className="section-title">Order Questions</h2>
              
              <div className="order-buttons">
                <button 
                  className={`order-button ${orderMode === 'automatic' ? 'active' : 'inactive'}`}
                  onClick={() => setOrderMode('automatic')}
                >
                  <Image 
                    src="/icons/ghost-icon.svg"
                    alt="Ghost"
                    width={40}
                    height={40}
                  />
                  Automatic
                </button>

                <button 
                  className={`order-button ${orderMode === 'custom' ? 'active' : 'inactive'}`}
                  onClick={() => setOrderMode('custom')}
                >
                  <Image 
                    src="/icons/ghost-icon.svg"
                    alt="Ghost"
                    width={40}
                    height={40}
                  />
                  Custom
                </button>
              </div>

              {orderMode === 'automatic' && (
                <div className="filter-section">
                  <div className="filter-grid">
                    <div className="filter-item">
                      <input type="checkbox" id="difficulty" />
                      <label htmlFor="difficulty">Difficulty</label>
                    </div>
                    <div className="filter-item">
                      <input type="checkbox" id="topic" />
                      <label htmlFor="topic">Topic</label>
                    </div>
                    <div className="filter-item">
                      <input type="checkbox" id="year" />
                      <label htmlFor="year">Year</label>
                    </div>
                    <div className="filter-item">
                      <input type="checkbox" id="question-type" />
                      <label htmlFor="question-type">Question Type</label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="settings-section">
              <div className="settings-row">
                <div className="setting-group">
                  <label className="setting-label">Number of Questions</label>
                  <div className="slider-container">
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={numberOfQuestions}
                      onChange={(e) => setNumberOfQuestions(parseInt(e.target.value))}
                      className="slider"
                    />
                    <span className="slider-value">{numberOfQuestions}</span>
                    <Image 
                      src="/icons/ghost-icon.svg"
                      alt="Ghost"
                      width={40}
                      height={40}
                      className="slider-ghost"
                    />
                  </div>
                </div>

                <div className="setting-group">
                  <label className="setting-label">Font Size</label>
                  <div className="slider-container">
                    <input
                      type="range"
                      min="10"
                      max="24"
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      className="slider"
                    />
                    <span className="slider-value">{fontSize}px</span>
                    <Image 
                      src="/icons/ghost-icon.svg"
                      alt="Ghost"
                      width={40}
                      height={40}
                      className="slider-ghost"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="next-button-section">
              <Link href="/select-practice-questions">
                <button className="next-button">
                  Next
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}