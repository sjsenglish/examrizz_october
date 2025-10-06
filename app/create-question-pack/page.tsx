'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import '../../styles/globals.css';

export default function CreateQuestionPackPage() {
  const [packName, setPackName] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [numberOfQuestions, setNumberOfQuestions] = useState(31);
  const [fontSize, setFontSize] = useState(12);
  const [orderBy, setOrderBy] = useState('Automatic');
  
  // Filter states
  const [questionType, setQuestionType] = useState(true);
  const [subType, setSubType] = useState(false);
  const [year, setYear] = useState(false);
  const [difficulty, setDifficulty] = useState(false);
  const [examSession, setExamSession] = useState(false);
  const [filter6, setFilter6] = useState(false);
  
  // Selected question types
  const [criticalThinking, setCriticalThinking] = useState(true);
  const [problemSolving, setProblemSolving] = useState(false);
  
  // Order by filters
  const [orderQuestionType, setOrderQuestionType] = useState(true);
  const [orderSubType, setOrderSubType] = useState(false);
  const [orderYear, setOrderYear] = useState(false);
  const [orderDifficulty, setOrderDifficulty] = useState(false);
  const [orderExamSession, setOrderExamSession] = useState(false);
  const [orderFilter6, setOrderFilter6] = useState(false);

  const subjects = ['Maths', 'Physics', 'Chemistry', 'Biology', 'Economics'];

  return (
    <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: '#F8F8F5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        zIndex: 100,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <h1 style={{
            fontFamily: "'Madimi One', sans-serif",
            fontSize: '24px',
            fontWeight: '400',
            fontStyle: 'normal',
            letterSpacing: '0.04em',
            color: '#000000',
            margin: '0',
            cursor: 'pointer'
          }}>
            examrizzsearch
          </h1>
        </Link>
        <button style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <div style={{
            width: '20px',
            height: '2px',
            backgroundColor: '#000000',
            borderRadius: '1px'
          }}></div>
          <div style={{
            width: '20px',
            height: '2px',
            backgroundColor: '#000000',
            borderRadius: '1px'
          }}></div>
          <div style={{
            width: '20px',
            height: '2px',
            backgroundColor: '#000000',
            borderRadius: '1px'
          }}></div>
        </button>
      </nav>

      {/* Main Content */}
      <div style={{
        paddingTop: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px'
      }}>
        {/* Modal */}
        <div style={{
          backgroundColor: '#F8F9FD',
          border: '1px solid #000000',
          borderRadius: '8px',
          padding: '40px',
          maxWidth: '1400px',
          width: '95%',
          position: 'relative',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
        }}>
          {/* Close Button */}
          <Link href="/question-packs" style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            fontSize: '24px',
            color: '#000000',
            textDecoration: 'none',
            cursor: 'pointer'
          }}>
            ×
          </Link>

          {/* Header */}
          <h1 style={{
            fontFamily: "'Madimi One', sans-serif",
            fontSize: '28px',
            fontWeight: '400',
            letterSpacing: '0.04em',
            color: '#000000',
            margin: '0 0 30px 0',
            textAlign: 'left'
          }}>
            Create Your Question Pack
          </h1>

          {/* Step indicator */}
          <div style={{
            position: 'absolute',
            top: '30px',
            right: '60px',
            fontFamily: "'Figtree', sans-serif",
            fontSize: '14px',
            color: '#666666'
          }}>
            Step 1 of 2
          </div>

          {/* Two Question Cards Side by Side */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            marginBottom: '40px'
          }}>
            
            {/* Left Question Card */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '2px solid #000000',
              padding: '30px',
              boxShadow: '8px 8px 16px rgba(0, 206, 209, 0.2), 0 4px 8px rgba(0, 255, 255, 0.3)',
              position: 'relative'
            }}>
              {/* Question Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '25px',
                flexWrap: 'wrap',
                gap: '15px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px'
                }}>
                  <span style={{
                    fontFamily: "'Madimi One', sans-serif",
                    fontSize: '20px',
                    color: '#000000',
                    fontWeight: '400'
                  }}>
                    Pack Name
                  </span>
                </div>
              </div>

              {/* Pack Name Input */}
              <input
                type="text"
                placeholder="Type your pack name"
                value={packName}
                onChange={(e) => setPackName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '15px',
                  border: '2px solid #000000',
                  borderRadius: '0px',
                  backgroundColor: '#D3F6F7',
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '16px',
                  letterSpacing: '0.04em',
                  color: '#000000',
                  marginBottom: '25px'
                }}
              />

              {/* Subject */}
              <h3 style={{
                fontFamily: "'Madimi One', sans-serif",
                fontSize: '18px',
                fontWeight: '400',
                color: '#000000',
                margin: '0 0 15px 0'
              }}>
                Subject
              </h3>
              <div style={{ position: 'relative', marginBottom: '25px' }}>
                <button
                  onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
                  style={{
                    width: '100%',
                    padding: '15px',
                    border: '2px solid #000000',
                    borderRadius: '0px',
                    backgroundColor: '#D3F6F7',
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '16px',
                    letterSpacing: '0.04em',
                    color: '#000000',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  {selectedSubject || 'Select subject'}
                  <span style={{ transform: showSubjectDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                </button>
                {showSubjectDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #000000',
                    borderRadius: '0px',
                    zIndex: 1000,
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}>
                    {subjects.map((subject) => (
                      <button
                        key={subject}
                        onClick={() => {
                          setSelectedSubject(subject);
                          setShowSubjectDropdown(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '15px',
                          border: 'none',
                          backgroundColor: 'transparent',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontFamily: "'Figtree', sans-serif",
                          fontSize: '16px',
                          letterSpacing: '0.04em',
                          color: '#000000'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#F0F0F0';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        {subject}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Question Filters */}
              <div style={{
                backgroundColor: '#89F3FF',
                border: '2px solid #000000',
                borderRadius: '0px',
                padding: '20px',
                marginBottom: '20px'
              }}>
                <h3 style={{
                  fontFamily: "'Madimi One', sans-serif",
                  fontSize: '16px',
                  fontWeight: '400',
                  color: '#000000',
                  margin: '0 0 15px 0'
                }}>
                  Question Filters
                </h3>
                
                {/* Filter checkboxes */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  marginBottom: '20px'
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontFamily: "'Figtree', sans-serif", letterSpacing: '0.04em' }}>
                    <input type="checkbox" checked={questionType} onChange={(e) => setQuestionType(e.target.checked)} style={{ accentColor: '#00CED1' }} />
                    Question Type
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontFamily: "'Figtree', sans-serif", letterSpacing: '0.04em' }}>
                    <input type="checkbox" checked={subType} onChange={(e) => setSubType(e.target.checked)} style={{ accentColor: '#00CED1' }} />
                    Sub Type
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontFamily: "'Figtree', sans-serif", letterSpacing: '0.04em' }}>
                    <input type="checkbox" checked={year} onChange={(e) => setYear(e.target.checked)} style={{ accentColor: '#00CED1' }} />
                    Year
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontFamily: "'Figtree', sans-serif", letterSpacing: '0.04em' }}>
                    <input type="checkbox" checked={difficulty} onChange={(e) => setDifficulty(e.target.checked)} style={{ accentColor: '#00CED1' }} />
                    Difficulty
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontFamily: "'Figtree', sans-serif", letterSpacing: '0.04em' }}>
                    <input type="checkbox" checked={examSession} onChange={(e) => setExamSession(e.target.checked)} style={{ accentColor: '#00CED1' }} />
                    Exam Session
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontFamily: "'Figtree', sans-serif", letterSpacing: '0.04em' }}>
                    <input type="checkbox" checked={filter6} onChange={(e) => setFilter6(e.target.checked)} style={{ accentColor: '#00CED1' }} />
                    Filter 6
                  </label>
                </div>

                {/* Question type selection area */}
                <div style={{
                  backgroundColor: '#D3F6F7',
                  border: '1px solid #CCCCCC',
                  borderRadius: '4px',
                  padding: '20px',
                  minHeight: '80px',
                  position: 'relative'
                }}>
                  <div style={{
                    display: 'flex',
                    gap: '20px',
                    flexWrap: 'wrap'
                  }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontFamily: "'Figtree', sans-serif", letterSpacing: '0.04em' }}>
                      <input type="checkbox" checked={criticalThinking} onChange={(e) => setCriticalThinking(e.target.checked)} style={{ accentColor: '#00CED1' }} />
                      Critical Thinking
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontFamily: "'Figtree', sans-serif", letterSpacing: '0.04em' }}>
                      <input type="checkbox" checked={problemSolving} onChange={(e) => setProblemSolving(e.target.checked)} style={{ accentColor: '#00CED1' }} />
                      Problem Solving
                    </label>
                  </div>
                  
                  {/* Clear filters button */}
                  <button style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    background: 'none',
                    border: 'none',
                    color: '#0066CC',
                    fontSize: '12px',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    fontFamily: "'Figtree', sans-serif"
                  }}>
                    clear filters
                  </button>
                </div>
              </div>
            </div>

            {/* Right Question Card */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '2px solid #4A90E2',
              padding: '30px',
              boxShadow: '8px 8px 16px rgba(0, 206, 209, 0.2), 0 4px 8px rgba(0, 255, 255, 0.3)',
              position: 'relative'
            }}>
              {/* Number of Questions */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '25px'
              }}>
                <Image 
                  src="/icons/speech-bubble-ghost.svg" 
                  alt="Question counter" 
                  width={24} 
                  height={24}
                />
                <h3 style={{
                  fontFamily: "'Madimi One', sans-serif",
                  fontSize: '18px',
                  fontWeight: '400',
                  color: '#000000',
                  margin: '0'
                }}>
                  Number of Questions
                </h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                <input
                  type="text"
                  value="1"
                  readOnly
                  style={{
                    width: '40px',
                    padding: '8px',
                    border: '1px solid #CCCCCC',
                    borderRadius: '4px',
                    textAlign: 'center',
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '14px'
                  }}
                />
                <div style={{ 
                  flex: 1, 
                  position: 'relative',
                  height: '20px',
                  backgroundColor: '#E0E0E0',
                  borderRadius: '10px'
                }}>
                  <div style={{
                    position: 'absolute',
                    left: '20%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '30px',
                    height: '30px',
                    backgroundColor: '#4A90E2',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: 'bold'
                  }}>
                    31
                  </div>
                </div>
                <input
                  type="text"
                  value="168"
                  readOnly
                  style={{
                    width: '40px',
                    padding: '8px',
                    border: '1px solid #CCCCCC',
                    borderRadius: '4px',
                    textAlign: 'center',
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '14px'
                  }}
                />
              </div>
              <p style={{
                fontFamily: "'Figtree', sans-serif",
                fontSize: '12px',
                color: '#4A90E2',
                margin: '0 0 25px 0'
              }}>
                360 questions available with current filters
              </p>

              {/* Font Size */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '25px'
              }}>
                <Image 
                  src="/icons/speech-bubble-ghost.svg" 
                  alt="Font size" 
                  width={24} 
                  height={24}
                />
                <h3 style={{
                  fontFamily: "'Madimi One', sans-serif",
                  fontSize: '18px',
                  fontWeight: '400',
                  color: '#000000',
                  margin: '0'
                }}>
                  Font Size <span style={{ fontSize: '12px', fontWeight: 'normal' }}>12pt</span>
                </h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                <span style={{ fontSize: '12px', fontFamily: "'Figtree', sans-serif" }}>small</span>
                <div style={{ 
                  flex: 1, 
                  position: 'relative',
                  height: '20px',
                  backgroundColor: '#E0E0E0',
                  borderRadius: '10px'
                }}>
                  <div style={{
                    position: 'absolute',
                    left: '30%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '30px',
                    height: '30px',
                    backgroundColor: '#4A90E2',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: 'bold'
                  }}>
                    12
                  </div>
                </div>
                <span style={{ fontSize: '12px', fontFamily: "'Figtree', sans-serif" }}>large</span>
              </div>

              {/* Order questions by */}
              <h3 style={{
                fontFamily: "'Madimi One', sans-serif",
                fontSize: '18px',
                fontWeight: '400',
                color: '#000000',
                margin: '0 0 15px 0'
              }}>
                Order questions by
              </h3>
              
              {/* Toggle */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px'
              }}>
                <span style={{ 
                  fontSize: '14px', 
                  fontFamily: "'Figtree', sans-serif",
                  backgroundColor: '#00CED1',
                  color: 'white',
                  padding: '5px 10px',
                  borderRadius: '15px'
                }}>
                  Automatic
                </span>
                <div style={{
                  width: '40px',
                  height: '20px',
                  backgroundColor: '#CCCCCC',
                  borderRadius: '10px',
                  position: 'relative',
                  cursor: 'pointer'
                }}>
                  <div style={{
                    position: 'absolute',
                    left: '2px',
                    top: '2px',
                    width: '16px',
                    height: '16px',
                    backgroundColor: 'white',
                    borderRadius: '50%'
                  }}></div>
                </div>
                <span style={{ fontSize: '14px', fontFamily: "'Figtree', sans-serif" }}>Custom</span>
              </div>

              {/* Order by checkboxes */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontFamily: "'Figtree', sans-serif", letterSpacing: '0.04em' }}>
                  <input type="checkbox" checked={orderQuestionType} onChange={(e) => setOrderQuestionType(e.target.checked)} style={{ accentColor: '#00CED1' }} />
                  Question Type
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontFamily: "'Figtree', sans-serif", letterSpacing: '0.04em' }}>
                  <input type="checkbox" checked={orderSubType} onChange={(e) => setOrderSubType(e.target.checked)} style={{ accentColor: '#00CED1' }} />
                  Sub Type
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontFamily: "'Figtree', sans-serif", letterSpacing: '0.04em' }}>
                  <input type="checkbox" checked={orderYear} onChange={(e) => setOrderYear(e.target.checked)} style={{ accentColor: '#00CED1' }} />
                  Year
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontFamily: "'Figtree', sans-serif", letterSpacing: '0.04em' }}>
                  <input type="checkbox" checked={orderDifficulty} onChange={(e) => setOrderDifficulty(e.target.checked)} style={{ accentColor: '#00CED1' }} />
                  Difficulty
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontFamily: "'Figtree', sans-serif", letterSpacing: '0.04em' }}>
                  <input type="checkbox" checked={orderExamSession} onChange={(e) => setOrderExamSession(e.target.checked)} style={{ accentColor: '#00CED1' }} />
                  Exam Session
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontFamily: "'Figtree', sans-serif", letterSpacing: '0.04em' }}>
                  <input type="checkbox" checked={orderFilter6} onChange={(e) => setOrderFilter6(e.target.checked)} style={{ accentColor: '#00CED1' }} />
                  Filter 6
                </label>
              </div>
            </div>
          </div>

          {/* Select Questions Button */}
          <div style={{
            position: 'absolute',
            bottom: '30px',
            right: '30px'
          }}>
            <button style={{
              backgroundColor: '#00CED1',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontFamily: "'Figtree', sans-serif",
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              Select Questions
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}