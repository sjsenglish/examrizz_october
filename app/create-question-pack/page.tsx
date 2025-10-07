'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import '../../styles/globals.css';

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
            fontWeight: 400,
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
          padding: '34.2px',
          maxWidth: '1197px',
          width: '81.225%',
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
            fontWeight: 400,
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

          {/* Two Cards Side by Side */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '34px',
            marginBottom: '34px'
          }}>
            
            {/* Left Card */}
            <article style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '3px solid #000000',
              padding: '25.5px',
              boxShadow: '6px 0 0 0 #00CED1, 0 6px 0 0 #00CED1, 6px 6px 0 0 #00CED1, 8px 8px 16px rgba(0, 206, 209, 0.2)',
              position: 'relative'
            }}>
              {/* Left Card Header */}
              <header style={{
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
                    fontSize: '22px',
                    color: '#000000',
                    fontWeight: 400
                  }}>
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
                  style={{
                    width: '100%',
                    padding: '15px 20px',
                    border: '1px solid #000000',
                    borderRadius: '0px',
                    backgroundColor: '#D3F6F7',
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '15px',
                    letterSpacing: '0.04em',
                    color: '#000000',
                    marginBottom: '25px',
                    fontWeight: 'bold',
                    boxSizing: 'border-box'
                  }}
                />

                {/* Subject */}
                <div style={{ marginBottom: '25px' }}>
                  <h3 style={{
                    fontFamily: "'Madimi One', sans-serif",
                    fontSize: '16px',
                    fontWeight: 400,
                    color: '#000000',
                    margin: '0 0 15px 0'
                  }}>
                    Subject
                  </h3>
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
                      style={{
                        width: '100%',
                        padding: '15px',
                        border: '1px solid #000000',
                        borderRadius: '0px',
                        backgroundColor: '#D3F6F7',
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: '15px',
                        letterSpacing: '0.04em',
                        color: '#000000',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontWeight: 'bold',
                        boxSizing: 'border-box'
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
                        border: '1px solid #000000',
                        borderRadius: '0px',
                        zIndex: 9999,
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
                              fontSize: '15px',
                              letterSpacing: '0.04em',
                              color: '#333333',
                              fontWeight: 'bold'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#B3F0F2';
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
                </div>

                {/* Question Filters */}
                <div style={{ marginBottom: '30px' }}>
                  <h3 style={{
                    fontFamily: "'Madimi One', sans-serif",
                    fontSize: '16px',
                    fontWeight: 400,
                    color: '#000000',
                    margin: '0 0 15px 0'
                  }}>
                    Question Filters
                  </h3>
                  
                  {/* Filter checkboxes in grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    marginBottom: '20px'
                  }}>
                    <div style={{
                      backgroundColor: '#89F3FF',
                      padding: '12px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <input type="checkbox" checked={questionType} onChange={(e) => setQuestionType(e.target.checked)} style={{ accentColor: '#00CED1' }} />
                      <span style={{
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: '#000000',
                        letterSpacing: '0.04em'
                      }}>
                        Question Type
                      </span>
                    </div>
                    
                    <div style={{
                      backgroundColor: '#89F3FF',
                      padding: '12px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <input type="checkbox" checked={subType} onChange={(e) => setSubType(e.target.checked)} style={{ accentColor: '#00CED1' }} />
                      <span style={{
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: '#000000',
                        letterSpacing: '0.04em'
                      }}>
                        Sub Type
                      </span>
                    </div>
                    
                    <div style={{
                      backgroundColor: '#89F3FF',
                      padding: '12px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <input type="checkbox" checked={year} onChange={(e) => setYear(e.target.checked)} style={{ accentColor: '#00CED1' }} />
                      <span style={{
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: '#000000',
                        letterSpacing: '0.04em'
                      }}>
                        Year
                      </span>
                    </div>
                    
                    <div style={{
                      backgroundColor: '#89F3FF',
                      padding: '12px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <input type="checkbox" checked={difficulty} onChange={(e) => setDifficulty(e.target.checked)} style={{ accentColor: '#00CED1' }} />
                      <span style={{
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: '#000000',
                        letterSpacing: '0.04em'
                      }}>
                        Difficulty
                      </span>
                    </div>
                    
                    <div style={{
                      backgroundColor: '#89F3FF',
                      padding: '12px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <input type="checkbox" checked={examSession} onChange={(e) => setExamSession(e.target.checked)} style={{ accentColor: '#00CED1' }} />
                      <span style={{
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: '#000000',
                        letterSpacing: '0.04em'
                      }}>
                        Exam Session
                      </span>
                    </div>
                    
                    <div style={{
                      backgroundColor: '#89F3FF',
                      padding: '12px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <input type="checkbox" checked={filter6} onChange={(e) => setFilter6(e.target.checked)} style={{ accentColor: '#00CED1' }} />
                      <span style={{
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: '#000000',
                        letterSpacing: '0.04em'
                      }}>
                        Filter 6
                      </span>
                    </div>
                  </div>

                  {/* Critical Thinking / Problem Solving section */}
                  <div style={{
                    backgroundColor: '#B3F0F2',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '20px'
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '20px',
                      flexWrap: 'wrap'
                    }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={criticalThinking} 
                          onChange={(e) => setCriticalThinking(e.target.checked)} 
                          style={{ accentColor: '#00CED1' }}
                        />
                        <span style={{
                          fontFamily: "'Figtree', sans-serif",
                          fontSize: '14px',
                          fontWeight: 'bold',
                          color: '#000000',
                          letterSpacing: '0.04em'
                        }}>
                          Critical Thinking
                        </span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={problemSolving} 
                          onChange={(e) => setProblemSolving(e.target.checked)} 
                          style={{ accentColor: '#00CED1' }}
                        />
                        <span style={{
                          fontFamily: "'Figtree', sans-serif",
                          fontSize: '14px',
                          fontWeight: 'bold',
                          color: '#000000',
                          letterSpacing: '0.04em'
                        }}>
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
                    <button style={{
                      background: 'none',
                      border: 'none',
                      fontFamily: "'Figtree', sans-serif",
                      fontSize: '14px',
                      color: '#666666',
                      textDecoration: 'underline',
                      cursor: 'pointer'
                    }}>
                      clear filters
                    </button>
                  </div>
                </div>
              </div>
            </article>

            {/* Right Card */}
            <article style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '3px solid #000000',
              padding: '25.5px',
              boxShadow: '6px 0 0 0 #00CED1, 0 6px 0 0 #00CED1, 6px 6px 0 0 #00CED1, 8px 8px 16px rgba(0, 206, 209, 0.2)',
              position: 'relative'
            }}>
              {/* Right Card Header */}
              <header style={{
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
                    fontSize: '22px',
                    color: '#000000',
                    fontWeight: 400
                  }}>
                    Number of Questions
                  </span>
                  <span style={{
                    backgroundColor: '#40E0D0',
                    color: '#000000',
                    padding: '4px 12px',
                    fontFamily: "'Madimi One', sans-serif",
                    fontSize: '16px',
                    fontWeight: 400,
                    boxShadow: '2px 2px 0 #000000'
                  }}>
                    Step 1
                  </span>
                </div>
              </header>

              <div style={{ color: '#333333' }}>
                {/* Number of Questions Slider */}
                <div style={{
                  marginBottom: '25px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                    <input
                      type="text"
                      value="1"
                      readOnly
                      style={{
                        width: '40px',
                        padding: '8px',
                        border: '2px solid #000000',
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
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#E0B4FF',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 'bold'
                      }}>
                        <Image 
                          src="/icons/speech-bubble-ghost.svg" 
                          alt="Question counter" 
                          width={24} 
                          height={24}
                        />
                      </div>
                    </div>
                    <input
                      type="text"
                      value="168"
                      readOnly
                      style={{
                        width: '40px',
                        padding: '8px',
                        border: '2px solid #000000',
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
                    color: '#E0B4FF',
                    backgroundColor: '#E0E4FF',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    margin: '0'
                  }}>
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
                    <Image 
                      src="/icons/speech-bubble-ghost.svg" 
                      alt="Font size" 
                      width={24} 
                      height={24}
                    />
                    <span style={{
                      fontFamily: "'Madimi One', sans-serif",
                      fontSize: '18px',
                      fontWeight: 400,
                      color: '#000000'
                    }}>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
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
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#E0B4FF',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 'bold'
                      }}>
                        <Image 
                          src="/icons/speech-bubble-ghost.svg" 
                          alt="Font size" 
                          width={24} 
                          height={24}
                        />
                      </div>
                    </div>
                    <span style={{ fontSize: '12px', fontFamily: "'Figtree', sans-serif" }}>large</span>
                  </div>
                </div>

                {/* Order Questions By Section */}
                <div style={{ marginBottom: '25px' }}>
                  <h3 style={{
                    fontFamily: "'Madimi One', sans-serif",
                    fontSize: '18px',
                    fontWeight: 400,
                    color: '#000000',
                    margin: '0 0 15px 0'
                  }}>
                    Order questions by
                  </h3>
                  <div style={{
                    backgroundColor: '#00CED1',
                    borderRadius: '20px',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '240px'
                  }}>
                    <span style={{
                      fontFamily: "'Figtree', sans-serif",
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#000000',
                      padding: '8px 16px'
                    }}>
                      Automatic
                    </span>
                    <div style={{
                      width: '30px',
                      height: '30px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '50%',
                        border: '2px solid #CCCCCC'
                      }}></div>
                    </div>
                    <span style={{
                      fontFamily: "'Figtree', sans-serif",
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#000000',
                      padding: '8px 16px'
                    }}>
                      Custom
                    </span>
                  </div>
                  <p style={{
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '12px',
                    color: '#666666',
                    margin: '10px 0 0 0'
                  }}>
                    You'll arrange questions manually in the next step
                  </p>
                </div>

                {/* Action Buttons */}
                <div style={{
                  display: 'flex',
                  gap: '20px',
                  justifyContent: 'flex-end'
                }}>
                  <button style={{
                    backgroundColor: '#00CED1',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 20px',
                    cursor: 'pointer',
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    Select
                    <br />Questions
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}