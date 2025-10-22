'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { searchSubjectQuestions, getIndexForSubject } from '../../lib/algolia';
import { getAllSubjects, getSubjectConfig } from '../../lib/subjectConfig';
import { QuestionFilters } from '../../components/QuestionFilters/QuestionFilters';
import './create-practice-pack.css';

export default function CreatePracticePackPage() {
  const router = useRouter();
  
  const [packName, setPackName] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  
  // Slider states
  const [numberOfQuestions, setNumberOfQuestions] = useState(1);
  const [fontSize, setFontSize] = useState(12);
  
  // Filter states - now managed by the new filter component
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  
  // Memoized callback for filter changes to prevent unnecessary re-renders
  const handleFiltersChange = useCallback((filters: Record<string, string[]>) => {
    setSelectedFilters(filters);
  }, []);
  
  // Order questions state
  const [orderMode, setOrderMode] = useState('automatic'); // 'automatic' or 'custom'
  
  // Available question count state
  const [availableQuestions, setAvailableQuestions] = useState(0);
  const [isLoadingCount, setIsLoadingCount] = useState(false);

  const subjects = getAllSubjects();

  // Calculate available questions based on filters
  const calculateAvailableQuestions = async () => {
    if (!selectedSubject) {
      setAvailableQuestions(0);
      return;
    }

    setIsLoadingCount(true);
    try {
      const subjectConfig = getSubjectConfig(selectedSubject);
      
      if (!subjectConfig || !subjectConfig.available) {
        // Subject index not available yet
        setAvailableQuestions(0);
        setIsLoadingCount(false);
        return;
      }

      // Build search filters from selected filter values
      let filters = '';
      
      if (subjectConfig.filters) {
        const filterClauses: string[] = [];
        
        for (const filterConfig of subjectConfig.filters) {
          const selectedValues = selectedFilters[filterConfig.id] || [];
          if (selectedValues.length > 0) {
            const clause = selectedValues
              .map(value => `${filterConfig.field}:"${value}"`)
              .join(' OR ');
            filterClauses.push(`(${clause})`);
          }
        }
        
        filters = filterClauses.join(' AND ');
      }
      
      // Search with filters to get count
      const searchResults = await searchSubjectQuestions(
        selectedSubject,
        filters,
        { hitsPerPage: 0 } // We only want the count
      );

      const totalHits = ('nbHits' in searchResults) ? searchResults.nbHits : 0;
      setAvailableQuestions(totalHits);
    } catch (error) {
      console.error('Error calculating available questions:', error);
      setAvailableQuestions(0);
    } finally {
      setIsLoadingCount(false);
    }
  };

  // Update available questions when filters change
  useEffect(() => {
    calculateAvailableQuestions();
  }, [selectedSubject, selectedFilters]);

  // Ensure numberOfQuestions doesn't exceed availableQuestions
  useEffect(() => {
    if (availableQuestions > 0 && numberOfQuestions > availableQuestions) {
      setNumberOfQuestions(availableQuestions);
    }
  }, [availableQuestions, numberOfQuestions]);

  const handleSelectQuestions = () => {
    // Store pack data in sessionStorage to pass to next step
    const packData = {
      packName,
      subject: selectedSubject,
      numberOfQuestions,
      fontSize,
      filters: selectedFilters,
      orderMode
    };
    
    sessionStorage.setItem('packData', JSON.stringify(packData));
    router.push('/select-practice-questions');
  };

  const handleQuestionSliderChange = (e) => {
    const value = parseInt(e.target.value);
    setNumberOfQuestions(value);
  };

  const handleFontSizeSliderChange = (e) => {
    const value = parseInt(e.target.value);
    setFontSize(value);
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

      {/* Main Content */}
      <div className="main-content">
        {/* Modal */}
        <div className="modal-container">
          {/* Close Button */}
          <Link href="/practice" className="close-button">
            ×
          </Link>

          {/* Header */}
          <h1 className="header-title">
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

                {/* Question Filters - New Component */}
                {selectedSubject && (() => {
                  const subjectConfig = getSubjectConfig(selectedSubject);
                  const indexName = getIndexForSubject(selectedSubject);
                  
                  if (!subjectConfig || !subjectConfig.filters || !indexName) {
                    return (
                      <div style={{ marginBottom: '30px' }}>
                        <h3 className="card-title" style={{ margin: '0 0 15px 0' }}>
                          Question Filters
                        </h3>
                        <p style={{ color: '#999', fontSize: '14px' }}>
                          No filters available for {selectedSubject}
                        </p>
                      </div>
                    );
                  }
                  
                  return (
                    <QuestionFilters
                      filters={subjectConfig.filters}
                      indexName={indexName}
                      onFiltersChange={handleFiltersChange}
                    />
                  );
                })()}
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
                      <input
                        type="range"
                        min="1"
                        max={availableQuestions || 1}
                        value={numberOfQuestions}
                        onChange={handleQuestionSliderChange}
                        style={{
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          cursor: 'pointer',
                          position: 'absolute'
                        }}
                      />
                      <Image 
                        src="/icons/speech-bubble-ghost.svg" 
                        alt="Question counter" 
                        width={40} 
                        height={40}
                        style={{
                          position: 'absolute',
                          left: `${(numberOfQuestions / (availableQuestions || 1)) * 100}%`,
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          cursor: 'pointer',
                          pointerEvents: 'none'
                        }}
                      />
                    </div>
                    <input
                      type="text"
                      value={availableQuestions || 0}
                      readOnly
                      className="slider-input"
                    />
                  </div>
                  <p className="availability-text">
                    {numberOfQuestions} questions selected - {isLoadingCount ? 'Loading...' : `${availableQuestions} questions available with current filters`}
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
                    <div className="font-slider-track">
                      <input
                        type="range"
                        min="10"
                        max="16"
                        value={fontSize}
                        onChange={handleFontSizeSliderChange}
                        style={{
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          cursor: 'pointer',
                          position: 'absolute'
                        }}
                      />
                      <Image 
                        src="/icons/speech-bubble-ghost.svg" 
                        alt="Font size slider" 
                        width={40} 
                        height={40}
                        style={{
                          position: 'absolute',
                          left: `${((fontSize - 10) / 6) * 100}%`,
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          cursor: 'pointer',
                          pointerEvents: 'none'
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

                  {/* Ordering info for Automatic mode */}
                  {orderMode === 'automatic' && (
                    <div style={{ marginTop: '20px' }}>
                      <p style={{ fontSize: '14px', color: '#666' }}>
                        Questions will be automatically ordered based on the filters you selected
                      </p>
                    </div>
                  )}
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
    </div>
  );
}