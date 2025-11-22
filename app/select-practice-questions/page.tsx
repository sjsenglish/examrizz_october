'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { InstantSearch, SearchBox, Hits, Configure } from 'react-instantsearch';
import { searchClient, getIndexForSubject } from '../../lib/algolia';
import { getSubjectConfig } from '../../lib/subjectConfig';
import { createPracticePack } from '../../lib/supabaseQuestionPacks.js';
import { useRouter } from 'next/navigation';
import { QuestionPreview } from '../../components/QuestionPreview/QuestionPreview';
import { QuestionModal } from '../../components/QuestionModal/QuestionModal';
import Navbar from '@/components/Navbar';
import './select-practice-questions.css';

interface PackData {
  packName: string;
  subject: string;
  numberOfQuestions: number;
  fontSize: number;
  filters: Record<string, string[]>;
  orderMode: string;
}


// QuestionHit component - now uses QuestionPreview
const QuestionHit: React.FC<{ hit: any; isSelected: boolean; onToggle: () => void; onViewFull: () => void; subject: string }> = ({ hit, isSelected, onToggle, onViewFull, subject }) => {
  return (
    <QuestionPreview
      hit={hit}
      isSelected={isSelected}
      onToggle={onToggle}
      onViewFull={onViewFull}
      subject={subject}
    />
  );
};

export default function SelectPracticeQuestionsPage() {
  const router = useRouter();
  const [packData, setPackData] = useState<PackData | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingPack, setIsCreatingPack] = useState(false);
  const [modalQuestion, setModalQuestion] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showOverview, setShowOverview] = useState(true);

  useEffect(() => {
    // Load pack data from session storage
    const storedPackData = sessionStorage.getItem('packData');
    if (storedPackData) {
      const parsedData = JSON.parse(storedPackData);
      setPackData(parsedData);
    } else {
      // Redirect back if no pack data
      router.push('/create-practice-pack');
    }
  }, [router]);

  const handleQuestionToggle = (question: any) => {
    const isSelected = selectedQuestions.some(q => q.objectID === question.objectID);
    if (isSelected) {
      setSelectedQuestions(selectedQuestions.filter((q: any) => q.objectID !== question.objectID));
    } else {
      setSelectedQuestions([...selectedQuestions, question]);
    }
  };

  const handleViewFullQuestion = (question: any) => {
    setModalQuestion(question);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalQuestion(null);
  };

  const handleModalToggleSelection = () => {
    if (modalQuestion) {
      handleQuestionToggle(modalQuestion);
    }
  };

  const handleCreatePack = async () => {
    if (!packData || selectedQuestions.length === 0) return;
    
    setIsCreatingPack(true);
    try {
      const result = await createPracticePack({
        name: packData.packName,
        subject: packData.subject,
        questionIds: selectedQuestions.map((q: any) => q.objectID),
        settings: {
          fontSize: packData.fontSize,
          orderMode: packData.orderMode,
          filters: packData.filters
        }
      });

      if ((result as { success: boolean; error?: string }).success) {
        // Clear session storage and redirect
        sessionStorage.removeItem('packData');
        router.push('/practice');
      } else {
        console.error('Failed to create pack:', (result as { success: boolean; error?: string }).error);
        alert('Failed to create practice pack. Please try again.');
      }
    } catch (error) {
      console.error('Error creating pack:', error);
      alert('Failed to create practice pack. Please try again.');
    } finally {
      setIsCreatingPack(false);
    }
  };

  // Build search filters based on pack data
  const getSearchFilters = () => {
    if (!packData) return '';
    
    const subjectConfig = getSubjectConfig(packData.subject);
    
    if (!subjectConfig || !subjectConfig.available) {
      // Subject not available, return filter that matches nothing
      return 'objectID:"none"';
    }
    
    // Build filters from the new filter structure
    const filterClauses: string[] = [];
    
    if (subjectConfig.filters && packData.filters) {
      for (const filterConfig of subjectConfig.filters) {
        // Check both the field name and the id for backward compatibility
        const selectedValues = packData.filters[filterConfig.field] || packData.filters[filterConfig.id] || [];
        if (selectedValues.length > 0) {
          // Handle array fields differently
          if (filterConfig.field === 'sub_types') {
            // For array fields, we need to use OR logic
            const subTypeFilters = selectedValues.map((v: any) => `sub_types:"${v}"`).join(' OR ');
            if (subTypeFilters) {
              filterClauses.push(`(${subTypeFilters})`);
            }
          } else {
            // For non-array fields, use OR logic
            const clause = selectedValues
              .map((value: any) => `${filterConfig.field}:"${value}"`)
              .join(' OR ');
            filterClauses.push(`(${clause})`);
          }
        }
      }
    }
    
    return filterClauses.join(' AND ');
  };

  // Get the appropriate index name for the subject
  const getIndexName = () => {
    if (!packData) return null;
    return getIndexForSubject(packData.subject) || 'copy_tsa_questions'; // Fallback for compatibility
  };

  if (!packData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page-background" style={{ paddingTop: '60px' }}>
      <Navbar />

      {/* Main Content */}
      <div className="main-content">
        <InstantSearch searchClient={searchClient} indexName={getIndexName() || 'copy_tsa_questions'}>
          <Configure filters={getSearchFilters()} hitsPerPage={20} />
          
          {/* Modal */}
          <div className="modal-container">


            {/* Inner Container */}
            <div className="inner-container">
              {/* Select Questions Section */}
              <div className="select-questions-section">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <div>
                    <h2 className="section-title">Select Questions</h2>
                    <p className="section-description">
                      Choose up to {packData.numberOfQuestions} questions from the available results below.
                    </p>
                  </div>
                </div>

                {/* Question Overview Section */}
                {showOverview && selectedQuestions.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ 
                      fontFamily: "'Madimi One', sans-serif",
                      fontSize: '18px',
                      fontWeight: '400',
                      color: '#000000',
                      margin: '0 0 15px 0'
                    }}>
                      Question Overview
                    </h3>
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '10px', 
                      marginBottom: '15px' 
                    }}>
                      {selectedQuestions.map((question, index) => (
                        <button
                          key={question.objectID}
                          onClick={() => handleViewFullQuestion(question)}
                          style={{
                            fontFamily: "'Madimi One', sans-serif",
                            fontSize: '16px',
                            fontWeight: '400',
                            padding: '12px 20px',
                            backgroundColor: 'white',
                            border: '1px solid black',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            minWidth: '50px',
                            textAlign: 'center',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f0f0f0';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                          }}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                    <button 
                      onClick={() => setShowOverview(false)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: '14px',
                        color: '#666666',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        padding: '0',
                        marginBottom: '15px'
                      }}
                    >
                      hide overview
                    </button>
                  </div>
                )}

                {!showOverview && selectedQuestions.length > 0 && (
                  <button 
                    onClick={() => setShowOverview(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontFamily: "'Figtree', sans-serif",
                      fontSize: '14px',
                      color: '#666666',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      padding: '0',
                      marginBottom: '15px'
                    }}
                  >
                    pin overview
                  </button>
                )}

                {/* Questions Selected Badge */}
                <div style={{ width: '75%', display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                  <div className="questions-selected-badge">
                    {selectedQuestions.length} questions selected
                  </div>
                </div>

                {/* Search Bar using Algolia SearchBox */}
                <div className="search-container" style={{ marginBottom: '15px' }}>
                  <SearchBox
                    placeholder="Search for questions by year, question number, content, ..."
                    classNames={{
                      root: 'search-box-root',
                      form: 'search-box-form',
                      input: 'search-input',
                      submit: 'search-button',
                      reset: 'search-reset'
                    }}
                  />
                </div>

                {/* Questions Container with Side Controls */}
                <div className="questions-and-controls-section">
                  <div className="questions-container">
                    <Hits 
                      hitComponent={({ hit }) => (
                        <QuestionHit
                          hit={hit}
                          isSelected={selectedQuestions.some(q => q.objectID === hit.objectID)}
                          onToggle={() => handleQuestionToggle(hit)}
                          onViewFull={() => handleViewFullQuestion(hit)}
                          subject={packData?.subject || ''}
                        />
                      )}
                      classNames={{
                        root: 'hits-root',
                        list: 'hits-list',
                        item: 'hits-item'
                      }}
                    />
                  </div>

                  {/* Side Controls */}
                  <div className="side-controls-right">
                    <button 
                      className="clear-selection-link"
                      onClick={() => setSelectedQuestions([])}
                    >
                      clear selection
                    </button>
                    
                    {/* Navigation Buttons */}
                    <div className="navigation-buttons-compact" style={{ marginTop: '20px' }}>
                      <Link href="/create-practice-pack" className="back-button">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Back
                      </Link>
                      
                      <button 
                        className="create-pack-button"
                        onClick={handleCreatePack}
                        disabled={selectedQuestions.length === 0 || isCreatingPack}
                        style={{ 
                          opacity: selectedQuestions.length === 0 || isCreatingPack ? 0.5 : 1,
                          cursor: selectedQuestions.length === 0 || isCreatingPack ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {isCreatingPack ? 'Creating...' : 'Create Pack'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </InstantSearch>
        
        {/* Question Modal */}
        <QuestionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          hit={modalQuestion}
          isSelected={modalQuestion ? selectedQuestions.some(q => q.objectID === modalQuestion.objectID) : false}
          onToggleSelection={handleModalToggleSelection}
        />
      </div>
    </div>
  );
}