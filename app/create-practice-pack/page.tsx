'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { getSubjectConfig, getAvailableSubjects } from '../../lib/subjectConfig';
import { getTotalQuestionCount, getSubjectFacets, getFilteredQuestionCount, FacetValue } from '../../lib/algoliaFacets';
import './create-practice-pack.css';

interface ActiveFilters {
  [field: string]: string[];
}

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export default function CreatePracticePackPage() {
  const router = useRouter();
  
  const [packName, setPackName] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  
  // Dynamic filter states
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(new Set());
  const [availableFilterOptions, setAvailableFilterOptions] = useState<Record<string, FilterOption[]>>({});
  
  // Question count states
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [availableQuestions, setAvailableQuestions] = useState(0);
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  
  // Mouse drag states for sliders
  const [isDraggingQuestions, setIsDraggingQuestions] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const subjects = getAvailableSubjects();

  // Fetch total questions when subject changes
  useEffect(() => {
    const fetchTotalQuestions = async () => {
      if (!selectedSubject) {
        setTotalQuestions(0);
        setAvailableQuestions(0);
        return;
      }

      const total = await getTotalQuestionCount(selectedSubject);
      setTotalQuestions(total);
      setAvailableQuestions(total);
      
      // Reset number of questions to 10 or max available
      setNumberOfQuestions(Math.min(10, total));
    };

    fetchTotalQuestions();
    // Reset filters when subject changes
    setActiveFilters({});
    setExpandedFilters(new Set());
    setAvailableFilterOptions({});
  }, [selectedSubject]);

  // Fetch facets and update available questions when filters change
  useEffect(() => {
    const fetchFacetsAndCount = async () => {
      if (!selectedSubject) return;

      const config = getSubjectConfig(selectedSubject);
      if (!config?.filters) return;

      // Build filter string for Algolia
      const filterStrings: string[] = [];
      for (const [field, values] of Object.entries(activeFilters)) {
        if (values && values.length > 0) {
          if (field === 'sub_types') {
            const subTypeFilters = values.map((v: any) => `sub_types:"${v}"`).join(' OR ');
            if (subTypeFilters) filterStrings.push(`(${subTypeFilters})`);
          } else {
            const fieldFilters = values.map((v: any) => `${field}:"${v}"`).join(' OR ');
            if (fieldFilters) filterStrings.push(`(${fieldFilters})`);
          }
        }
      }

      // Fetch facets for filters that need dynamic options
      const facetsToFetch = config.filters
        .filter((f: any) => f.fetchFromIndex)
        .map((f: any) => f.field);

      if (facetsToFetch.length > 0) {
        const facetResults = await getSubjectFacets(
          selectedSubject,
          facetsToFetch,
          filterStrings.join(' AND ')
        );

        // Update available filter options
        const newOptions: Record<string, FilterOption[]> = {};
        for (const filter of config.filters) {
          if (filter.fetchFromIndex && facetResults[filter.field]) {
            newOptions[filter.field] = facetResults[filter.field].map((fv: FacetValue) => ({
              value: fv.value,
              label: fv.value,
              count: fv.count
            }));
          } else if (filter.options) {
            newOptions[filter.field] = filter.options;
          }
        }
        setAvailableFilterOptions(newOptions);
      }

      // Get filtered question count
      const count = await getFilteredQuestionCount(selectedSubject, activeFilters);
      setAvailableQuestions(count);
      
      // Adjust numberOfQuestions if it exceeds available
      if (numberOfQuestions > count) {
        setNumberOfQuestions(Math.max(1, Math.min(10, count)));
      }
    };

    fetchFacetsAndCount();
  }, [selectedSubject, activeFilters, numberOfQuestions]);

  const handleClearFilters = () => {
    setActiveFilters({});
    setExpandedFilters(new Set());
  };

  const toggleFilter = (field: string) => {
    const newExpanded = new Set(expandedFilters);
    if (newExpanded.has(field)) {
      newExpanded.delete(field);
    } else {
      newExpanded.add(field);
    }
    setExpandedFilters(newExpanded);
  };

  const toggleFilterOption = (field: string, value: string) => {
    const currentValues = activeFilters[field] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v: any) => v !== value)
      : [...currentValues, value];
    
    setActiveFilters({
      ...activeFilters,
      [field]: newValues.length > 0 ? newValues : []
    });
  };

  // Handle question slider with better precision
  const handleQuestionSliderMove = useCallback((clientX: number) => {
    if (!isDraggingQuestions || !sliderRef.current || availableQuestions === 0) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const value = Math.max(1, Math.min(availableQuestions, Math.round(1 + percentage * (availableQuestions - 1))));
    setNumberOfQuestions(value);
  }, [isDraggingQuestions, availableQuestions]);


  // Mouse event handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      handleQuestionSliderMove(e.clientX);
    };

    const handleMouseUp = () => {
      setIsDraggingQuestions(false);
    };

    if (isDraggingQuestions) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDraggingQuestions, handleQuestionSliderMove]);

  const handleSelectQuestions = () => {
    // Store pack data in sessionStorage to pass to next step
    const packData = {
      packName,
      subject: selectedSubject,
      numberOfQuestions,
      filters: activeFilters,
      availableQuestions
    };
    
    sessionStorage.setItem('packData', JSON.stringify(packData));
    router.push('/select-practice-questions');
  };

  const subjectConfig = selectedSubject ? getSubjectConfig(selectedSubject) : null;

  return (
    <div className="page-background" style={{ paddingTop: '60px' }}>
      <Navbar />

      {/* Main Content */}
      <div className="main-content">
        {/* Back Button */}
        <Link 
          href="/practice" 
          style={{
            position: 'absolute',
            top: '80px',
            left: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            backgroundColor: '#FFFFFF',
            borderRadius: '6px',
            textDecoration: 'none',
            color: '#333333',
            fontFamily: "'Madimi One', cursive",
            fontSize: '12px',
            border: '1px solid #ddd',
            transition: 'all 0.3s ease',
            zIndex: 20
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </Link>

        {/* Header */}
        <h1 style={{
          fontFamily: "'Madimi One', cursive",
          fontSize: '24px',
          fontWeight: '400',
          color: '#000000',
          margin: '40px 0 10px 0',
          textAlign: 'left'
        }}>
          Create Your Practice Pack
        </h1>

        {/* Step indicator */}
        <div style={{
          fontFamily: "'Madimi One', cursive",
          fontSize: '14px',
          color: '#666666',
          marginBottom: '15px',
          textAlign: 'left'
        }}>
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
                      {subjects.map((subject) => {
                        const isEnabled = subject === 'TSA';
                        return (
                          <button
                            key={subject}
                            onClick={() => {
                              if (isEnabled) {
                                setSelectedSubject(subject);
                                setShowSubjectDropdown(false);
                              }
                            }}
                            className="dropdown-item"
                            style={{
                              opacity: isEnabled ? 1 : 0.4,
                              cursor: isEnabled ? 'pointer' : 'not-allowed',
                              color: isEnabled ? '#000000' : '#999999'
                            }}
                            disabled={!isEnabled}
                          >
                            {subject}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Question Filters */}
              {selectedSubject && subjectConfig?.filters && (
                <div style={{ marginBottom: '30px' }}>
                  <h3 className="card-title" style={{ margin: '0 0 15px 0' }}>
                    Question Filters
                  </h3>
                  
                  <div className="filter-sections">
                    {subjectConfig.filters.map((filter) => (
                      <div key={filter.id} className="filter-section">
                        <button
                          className={`filter-header ${expandedFilters.has(filter.field) ? 'expanded' : ''}`}
                          onClick={() => toggleFilter(filter.field)}
                        >
                          <span>{filter.label}</span>
                          <span className="filter-arrow">
                            {expandedFilters.has(filter.field) ? '▼' : '▶'}
                          </span>
                        </button>
                        
                        {expandedFilters.has(filter.field) && (
                          <div className="filter-options">
                            {(availableFilterOptions[filter.field] || filter.options || []).map((option) => (
                              <label key={option.value} className="filter-option">
                                <input
                                  type="checkbox"
                                  checked={(activeFilters[filter.field] || []).includes(option.value)}
                                  onChange={() => toggleFilterOption(filter.field, option.value)}
                                  className="filter-checkbox"
                                />
                                <span className="filter-option-label">
                                  {option.label}
                                  {option.count !== undefined && (
                                    <span className="filter-count"> ({option.count})</span>
                                  )}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Clear filters button */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '15px'
                  }}>
                    <button 
                      className="clear-filters-button"
                      onClick={handleClearFilters}
                    >
                      clear filters
                    </button>
                  </div>
                </div>
              )}
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
                    ref={sliderRef}
                    className="slider-track"
                    style={{ height: '20px' }}
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                      const value = Math.max(1, Math.min(availableQuestions, Math.round(1 + percentage * (availableQuestions - 1))));
                      setNumberOfQuestions(value);
                    }}
                  >
                    <Image 
                      src="/icons/speech-bubble-ghost.svg" 
                      alt="Question counter" 
                      width={40} 
                      height={40}
                      style={{
                        position: 'absolute',
                        left: availableQuestions > 1 
                          ? `${((numberOfQuestions - 1) / (availableQuestions - 1)) * 100}%`
                          : '0%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        cursor: 'grab'
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setIsDraggingQuestions(true);
                      }}
                      draggable={false}
                    />
                  </div>
                  <input
                    type="text"
                    value={availableQuestions || '0'}
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
                  {availableQuestions} questions available with current filters
                  {selectedSubject && totalQuestions > 0 && (
                    <span style={{ display: 'block', fontSize: '12px', marginTop: '5px', color: '#666' }}>
                      (Total {totalQuestions} questions in {selectedSubject})
                    </span>
                  )}
                </p>
              </div>

            </div>
            
            {/* Select Questions Button - Bottom Right */}
            <button 
              onClick={handleSelectQuestions}
              className="select-questions-button"
              disabled={!packName || !selectedSubject || availableQuestions === 0}
              style={{ 
                opacity: (!packName || !selectedSubject || availableQuestions === 0) ? 0.5 : 1,
                cursor: (!packName || !selectedSubject || availableQuestions === 0) ? 'not-allowed' : 'pointer'
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