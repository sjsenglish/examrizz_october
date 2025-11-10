'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import './spec-point-session.css';

type ContentType = 'video' | 'questions' | 'pdf';

// Sample question data
const sampleQuestions = [
  {
    id: '1',
    question_text: 'What is the derivative of x²?',
    options: {
      A: '2x',
      B: 'x',
      C: '2',
      D: 'x²'
    },
    answer_letter: 'A'
  },
  {
    id: '2', 
    question_text: 'What is the integral of 2x dx?',
    options: {
      A: '2',
      B: 'x² + C',
      C: '2x + C',
      D: 'x + C'
    },
    answer_letter: 'B'
  }
];

export default function SpecPointSessionPage() {
  const [currentContent, setCurrentContent] = useState<ContentType>('video');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const renderVideoContent = () => (
    <div className="content-container">
      <h3 className="content-title">Video Walkthrough</h3>
      <div className="video-player">
        <div className="video-placeholder">
          <p>Sample video content would appear here</p>
          <p>explaining the spec point concepts</p>
        </div>
      </div>
    </div>
  );

  const renderQuestionsContent = () => {
    const currentQuestion = sampleQuestions[currentQuestionIndex];
    
    return (
      <div className="content-container">
        <div className="question-header">
          <h3 className="content-title">Practice Questions</h3>
          <div className="question-navigation">
            <button 
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
              className="nav-button"
            >
              Previous
            </button>
            <span className="question-counter">
              {currentQuestionIndex + 1} of {sampleQuestions.length}
            </span>
            <button 
              onClick={() => setCurrentQuestionIndex(Math.min(sampleQuestions.length - 1, currentQuestionIndex + 1))}
              disabled={currentQuestionIndex === sampleQuestions.length - 1}
              className="nav-button"
            >
              Next
            </button>
          </div>
        </div>
        
        <div className="question-content">
          <div className="question-text">
            {currentQuestion.question_text}
          </div>
          
          <div className="options-list">
            {Object.entries(currentQuestion.options).map(([letter, text]) => {
              const isSelected = selectedAnswers[currentQuestion.id] === letter;
              
              return (
                <div
                  key={letter}
                  className={`option-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelect(currentQuestion.id, letter)}
                >
                  <span className="option-letter">{letter}</span>
                  <span className="option-text">{text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderPdfContent = () => (
    <div className="content-container">
      <h3 className="content-title">Study Notes (PDF)</h3>
      <div className="pdf-viewer">
        <div className="pdf-placeholder">
          <div className="pdf-icon">📄</div>
          <p>PDF content would be displayed here</p>
          <p>Spec point notes and documentation</p>
          <button className="download-button">Download PDF</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="spec-point-session-page">
      <div className="page-background">
        {/* Navbar */}
        <nav className="navbar">
          <Link href="/" className="logo">
            examrizzsearch
          </Link>
          <button className="menu-button">
            <div className="menu-line"></div>
            <div className="menu-line"></div>
            <div className="menu-line"></div>
          </button>
        </nav>

        {/* Back Button */}
        <Link 
          href="/maths-demo"
          className="back-button"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </Link>

        {/* Header */}
        <div className="header-container">
          <div className="header-content">
            <h1 className="page-title">Spec Point 6.4 - Differentiation</h1>
            <p className="page-subtitle">Learn, practice, and master this topic</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content-container">
          {/* Left Container - Empty for now */}
          <div className="left-container">
            {/* Empty as requested */}
          </div>

          {/* Right Container - Content Types */}
          <div className="right-container">
            {/* Content Type Selector */}
            <div className="content-selector">
              <button
                className={`selector-button ${currentContent === 'video' ? 'active' : ''}`}
                onClick={() => setCurrentContent('video')}
              >
                Video
              </button>
              <button
                className={`selector-button ${currentContent === 'questions' ? 'active' : ''}`}
                onClick={() => setCurrentContent('questions')}
              >
                Questions
              </button>
              <button
                className={`selector-button ${currentContent === 'pdf' ? 'active' : ''}`}
                onClick={() => setCurrentContent('pdf')}
              >
                PDF Notes
              </button>
            </div>

            {/* Content Display */}
            {currentContent === 'video' && renderVideoContent()}
            {currentContent === 'questions' && renderQuestionsContent()}
            {currentContent === 'pdf' && renderPdfContent()}
          </div>
        </div>
      </div>
    </div>
  );
}