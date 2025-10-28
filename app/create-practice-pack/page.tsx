'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { searchSubjectQuestions, getIndexForSubject } from '../../lib/algolia';
import { getAllSubjects, getSubjectConfig } from '../../lib/subjectConfig';
import { QuestionFilters } from '../../components/QuestionFilters/QuestionFilters';
import './create-practice-pack.css';

function QuestionFiltersSection({ 
  selectedSubject, 
  onFiltersChange 
}: { 
  selectedSubject: string; 
  onFiltersChange: (filters: Record<string, string[]>) => void; 
}) {
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
      onFiltersChange={onFiltersChange}
    />
  );
}

export default function CreatePracticePackPage() {
  const router = useRouter();
  
  const [packName, setPackName] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  
  const [numberOfQuestions, setNumberOfQuestions] = useState(1);
  const [fontSize, setFontSize] = useState(12);
  
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  
  const handleFiltersChange = useCallback((filters: Record<string, string[]>) => {
    setSelectedFilters(filters);
  }, []);
  
  const [orderMode, setOrderMode] = useState('automatic');
  
  const [availableQuestions, setAvailableQuestions] = useState(0);
  const [isLoadingCount, setIsLoadingCount] = useState(false);

  const subjects = getAllSubjects();

  const calculateAvailableQuestions = async () => {
    if (!selectedSubject) {
      setAvailableQuestions(0);
      return;
    }

    setIsLoadingCount(true);
    try {
      const subjectConfig = getSubjectConfig(selectedSubject);
      
      if (!subjectConfig || !subjectConfig.available) {
        setAvailableQuestions(0);
        setIsLoadingCount(false);
        return;
      }

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
      
      const searchResults = await searchSubjectQuestions(
        selectedSubject,
        filters,
        { hitsPerPage: 0 }
      );

      const totalHits = ('nbHits' in searchResults) ? (searchResults.nbHits || 0) : 0;
      setAvailableQuestions(totalHits);
    } catch (error) {
      console.error('Error calculating available questions:', error);
      setAvailableQuestions(0);
    } finally {
      setIsLoadingCount(false);
    }
  };

  useEffect(() => {
    calculateAvailableQuestions();
  }, [selectedSubject, selectedFilters]);

  useEffect(() => {
    if (availableQuestions > 0 && numberOfQuestions > availableQuestions) {
      setNumberOfQuestions(availableQuestions);
    }
  }, [availableQuestions, numberOfQuestions]);

  const handleSelectQuestions = () => {
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

  const handleQuestionSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setNumberOfQuestions(value);
  };

  const handleFontSizeSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setFontSize(value);
  };

  const questionSliderPosition = ((numberOfQuestions / (availableQuestions || 1)) * 100);
  const fontSliderPosition = (((fontSize - 10) / 6) * 100);

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

      <Link href="/practice" className="close-button">
        ×
      </Link>

      <div className="main-content">
        <h1 className="header-title">
          Create Your Practice Pack
        </h1>

        <div className="step-indicator">
          Step 1 of 2
        </div>

        <div className="cards-container">
          <article className="card">
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
              <input
                type="text"
                placeholder="Type your pack name"
                value={packName}
                onChange={(e) => setPackName(e.target.value)}
                className="pack-name-input"
              />

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

              {selectedSubject && (
                <QuestionFiltersSection
                  selectedSubject={selectedSubject}
                  onFiltersChange={handleFiltersChange}
                />
              )}
            </div>
          </article>

          <article className="card">
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
                        left: `${questionSliderPosition}%`,
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
                        left: `${fontSliderPosition}%`,
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
                    You will arrange questions manually in the next step
                  </p>
                )}

                {orderMode === 'automatic' && (
                  <div style={{ marginTop: '20px' }}>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                      Questions will be automatically ordered based on the filters you selected
                    </p>
                  </div>
                )}
              </div>

            </div>
            
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