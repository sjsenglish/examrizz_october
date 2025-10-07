'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface AssignQuestionPackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssignQuestionPackModal: React.FC<AssignQuestionPackModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [assignToClass, setAssignToClass] = useState(true);
  const [selectedClasses, setSelectedClasses] = useState<number[]>([0]);
  const [hasTimeLimit, setHasTimeLimit] = useState(true);
  const [timeLimit, setTimeLimit] = useState('60');
  const [randomizeQuestions, setRandomizeQuestions] = useState(true);
  const [instructions, setInstructions] = useState('This covers topics from Week 3. Attempt all questions and flag any you find confusing.');
  const [sendEmail, setSendEmail] = useState(true);
  const [showInDashboard, setShowInDashboard] = useState(true);

  if (!isOpen) return null;

  const classes = [
    'Year 12 Maths A Level Edexcel Set 1 (28 students)',
    'Year 12 Maths A Level Edexcel Set 1 (28 students)',
    'Year 12 Maths A Level Edexcel Set 1 (28 students)',
    'Year 12 Maths A Level Edexcel Set 1 (28 students)'
  ];

  const toggleClass = (index: number) => {
    if (selectedClasses.includes(index)) {
      setSelectedClasses(selectedClasses.filter(i => i !== index));
    } else {
      setSelectedClasses([...selectedClasses, index]);
    }
  };

  const clearSelection = () => {
    setSelectedClasses([]);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        width: '90%',
        maxWidth: '900px',
        maxHeight: '85vh',
        overflow: 'hidden',
        border: '3px solid #000000',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          padding: '30px 40px 20px',
          borderBottom: '1px solid #E0E0E0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{
            fontFamily: "'Madimi One', sans-serif",
            fontSize: '32px',
            fontWeight: '400',
            color: '#000000',
            margin: 0,
            letterSpacing: '0.02em'
          }}>
            ASSIGN QUESTION PACK
          </h1>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            <span style={{
              fontFamily: "'Madimi One', sans-serif",
              fontSize: '16px',
              color: '#666666'
            }}>
              Page {currentPage} of 2
            </span>
            <button 
              onClick={onClose}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '28px',
                cursor: 'pointer',
                color: '#000000',
                padding: '0',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        {currentPage === 1 ? (
          <div style={{
            padding: '40px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '60px',
            height: 'calc(100% - 200px)',
            overflow: 'auto'
          }}>
            
            {/* Left Column */}
            <div>
            {/* Question Pack Card */}
            <div style={{
              border: '2px solid #000000',
              borderRadius: '12px',
              padding: '20px',
              backgroundColor: '#F8F8F8',
              marginBottom: '40px',
              display: 'flex',
              alignItems: 'center',
              gap: '20px'
            }}>
              <div>
                <h2 style={{
                  fontFamily: "'Madimi One', sans-serif",
                  fontSize: '20px',
                  fontWeight: '400',
                  color: '#000000',
                  margin: '0 0 10px 0'
                }}>
                  Calculus Basics Homework
                </h2>
                <div style={{
                  display: 'flex',
                  gap: '20px',
                  fontFamily: "'Madimi One', sans-serif",
                  fontSize: '14px',
                  color: '#666666'
                }}>
                  <span>28 Questions</span>
                  <span>50 marks</span>
                </div>
              </div>
              <div style={{
                marginLeft: 'auto',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="5" r="3" fill="#666666"/>
                  <path d="M12 8C8 8 5 11 5 15V20H19V15C19 11 16 8 12 8Z" fill="#666666"/>
                  <circle cx="7" cy="18" r="2" fill="#666666"/>
                  <circle cx="17" cy="18" r="2" fill="#666666"/>
                </svg>
              </div>
            </div>

            {/* Step 1 */}
            <div>
              <h3 style={{
                fontFamily: "'Madimi One', sans-serif",
                fontSize: '18px',
                fontWeight: '400',
                color: '#000000',
                margin: '0 0 20px 0',
                paddingBottom: '10px',
                borderBottom: '2px solid #000000'
              }}>
                STEP 1   Who should receive this pack?
              </h3>
              
              <div style={{ marginTop: '20px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '15px',
                  cursor: 'pointer'
                }}>
                  <input 
                    type="checkbox" 
                    checked={assignToClass}
                    onChange={() => setAssignToClass(!assignToClass)}
                    style={{
                      width: '20px',
                      height: '20px',
                      accentColor: '#00D4AA'
                    }}
                  />
                  <span style={{
                    fontFamily: "'Madimi One', sans-serif",
                    fontSize: '16px',
                    color: '#000000'
                  }}>
                    Assign to entire class
                  </span>
                </label>
                
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer'
                }}>
                  <input 
                    type="checkbox" 
                    checked={!assignToClass}
                    onChange={() => setAssignToClass(!assignToClass)}
                    style={{
                      width: '20px',
                      height: '20px',
                      accentColor: '#00D4AA'
                    }}
                  />
                  <span style={{
                    fontFamily: "'Madimi One', sans-serif",
                    fontSize: '16px',
                    color: '#000000'
                  }}>
                    Assign to specific students
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* Step 2 */}
            <h3 style={{
              fontFamily: "'Madimi One', sans-serif",
              fontSize: '18px',
              fontWeight: '400',
              color: '#000000',
              margin: '0 0 20px 0',
              paddingBottom: '10px',
              borderBottom: '2px solid #000000'
            }}>
              STEP 2   Who should receive this pack?
            </h3>
            
            {/* Classes List */}
            <div style={{
              border: '2px solid #000000',
              borderRadius: '8px',
              maxHeight: '300px',
              overflow: 'auto',
              backgroundColor: '#FFFFFF'
            }}>
              {classes.map((className, index) => (
                <div 
                  key={index}
                  style={{
                    padding: '12px 15px',
                    borderBottom: index < classes.length - 1 ? '1px solid #E0E0E0' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: selectedClasses.includes(index) ? '#EBE9FF' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onClick={() => toggleClass(index)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {selectedClasses.includes(index) && (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8L6 11L13 4" stroke="#000000" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    )}
                    <span style={{
                      fontFamily: "'Figtree', sans-serif",
                      fontSize: '14px',
                      letterSpacing: '0.04em',
                      color: '#000000',
                      fontWeight: selectedClasses.includes(index) ? 'bold' : 'normal'
                    }}>
                      {className}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Selection Info */}
            <div style={{
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{
                fontFamily: "'Madimi One', sans-serif",
                fontSize: '14px',
                color: '#666666'
              }}>
                Selected - {selectedClasses.length} class, 28 students
              </span>
              <button
                onClick={clearSelection}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontFamily: "'Madimi One', sans-serif",
                  fontSize: '14px',
                  color: '#0066CC',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                clear selection
              </button>
            </div>
          </div>
        </div>
        ) : (
          // Page 2 Content
          <div style={{
            padding: '40px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '60px',
            height: 'calc(100% - 200px)',
            overflow: 'auto'
          }}>
            
            {/* Left Column - Step 3 */}
            <div>
              <h3 style={{
                fontFamily: "'Madimi One', sans-serif",
                fontSize: '18px',
                fontWeight: '400',
                color: '#000000',
                margin: '0 0 30px 0',
                paddingBottom: '10px',
                borderBottom: '2px solid #000000'
              }}>
                STEP 3  Assignment details
              </h3>
              
              {/* Due Date */}
              <div style={{ marginBottom: '25px' }}>
                <label style={{
                  fontFamily: "'Madimi One', sans-serif",
                  fontSize: '14px',
                  color: '#000000',
                  display: 'block',
                  marginBottom: '10px'
                }}>
                  Due Date
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{
                    backgroundColor: '#E8F8F8',
                    border: '2px solid #000000',
                    borderRadius: '8px',
                    padding: '10px 15px',
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}>
                    <input 
                      type="text"
                      placeholder="DD/MM/YYYY"
                      defaultValue="15/10/2025"
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        outline: 'none',
                        fontFamily: "'Madimi One', sans-serif",
                        fontSize: '14px',
                        color: '#000000',
                        width: '100%'
                      }}
                    />
                    <span style={{ fontSize: '18px' }}>›</span>
                  </div>
                  <div style={{
                    backgroundColor: '#E8F8F8',
                    border: '2px solid #000000',
                    borderRadius: '8px',
                    padding: '10px 15px',
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}>
                    <input 
                      type="text"
                      placeholder="HH:MM"
                      defaultValue="23:59"
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        outline: 'none',
                        fontFamily: "'Madimi One', sans-serif",
                        fontSize: '14px',
                        color: '#000000',
                        width: '100%'
                      }}
                    />
                    <span style={{ fontSize: '18px' }}>›</span>
                  </div>
                </div>
              </div>

              {/* Time Limit */}
              <div style={{ marginBottom: '25px' }}>
                <label style={{
                  fontFamily: "'Madimi One', sans-serif",
                  fontSize: '14px',
                  color: '#000000',
                  display: 'block',
                  marginBottom: '10px'
                }}>
                  Time Limit <span style={{ fontSize: '12px', color: '#666666' }}>(optional)</span>
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer'
                  }}>
                    <input 
                      type="checkbox" 
                      checked={hasTimeLimit}
                      onChange={() => setHasTimeLimit(!hasTimeLimit)}
                      style={{
                        width: '20px',
                        height: '20px',
                        accentColor: '#00D4AA'
                      }}
                    />
                    <span style={{
                      fontFamily: "'Madimi One', sans-serif",
                      fontSize: '14px',
                      color: '#000000'
                    }}>
                      Set time limit
                    </span>
                  </label>
                  <input 
                    type="text"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(e.target.value)}
                    disabled={!hasTimeLimit}
                    style={{
                      backgroundColor: hasTimeLimit ? '#FFFFFF' : '#F0F0F0',
                      border: '2px solid #000000',
                      borderRadius: '6px',
                      padding: '5px 10px',
                      width: '60px',
                      fontFamily: "'Madimi One', sans-serif",
                      fontSize: '14px',
                      color: hasTimeLimit ? '#000000' : '#999999',
                      outline: 'none'
                    }}
                  />
                  <span style={{
                    fontFamily: "'Madimi One', sans-serif",
                    fontSize: '14px',
                    color: '#000000'
                  }}>
                    minutes
                  </span>
                </div>
              </div>

              {/* Randomize question order */}
              <div style={{ marginBottom: '25px' }}>
                <label style={{
                  fontFamily: "'Madimi One', sans-serif",
                  fontSize: '14px',
                  color: '#000000',
                  display: 'block',
                  marginBottom: '10px'
                }}>
                  Randomize question order
                </label>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer'
                  }}>
                    <input 
                      type="checkbox" 
                      checked={randomizeQuestions}
                      onChange={() => setRandomizeQuestions(!randomizeQuestions)}
                      style={{
                        width: '20px',
                        height: '20px',
                        accentColor: '#00D4AA'
                      }}
                    />
                    <span style={{
                      fontFamily: "'Madimi One', sans-serif",
                      fontSize: '14px',
                      color: '#000000'
                    }}>
                      Yes
                    </span>
                  </label>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer'
                  }}>
                    <input 
                      type="checkbox" 
                      checked={!randomizeQuestions}
                      onChange={() => setRandomizeQuestions(!randomizeQuestions)}
                      style={{
                        width: '20px',
                        height: '20px',
                        accentColor: '#00D4AA'
                      }}
                    />
                    <span style={{
                      fontFamily: "'Madimi One', sans-serif",
                      fontSize: '14px',
                      color: '#000000'
                    }}>
                      No
                    </span>
                  </label>
                </div>
              </div>

              {/* Instructions for students */}
              <div style={{ marginBottom: '25px' }}>
                <label style={{
                  fontFamily: "'Madimi One', sans-serif",
                  fontSize: '14px',
                  color: '#000000',
                  display: 'block',
                  marginBottom: '10px'
                }}>
                  Instructions for students <span style={{ fontSize: '12px', color: '#666666' }}>(optional)</span>
                </label>
                <textarea 
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #000000',
                    borderRadius: '8px',
                    padding: '10px',
                    fontFamily: "'Madimi One', sans-serif",
                    fontSize: '14px',
                    color: '#000000',
                    resize: 'vertical',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Notify students */}
              <div>
                <label style={{
                  fontFamily: "'Madimi One', sans-serif",
                  fontSize: '14px',
                  color: '#000000',
                  display: 'block',
                  marginBottom: '10px'
                }}>
                  Notify students
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer'
                  }}>
                    <input 
                      type="checkbox" 
                      checked={sendEmail}
                      onChange={() => setSendEmail(!sendEmail)}
                      style={{
                        width: '20px',
                        height: '20px',
                        accentColor: '#00D4AA'
                      }}
                    />
                    <span style={{
                      fontFamily: "'Madimi One', sans-serif",
                      fontSize: '14px',
                      color: '#000000'
                    }}>
                      Send email notification
                    </span>
                  </label>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer'
                  }}>
                    <input 
                      type="checkbox" 
                      checked={showInDashboard}
                      onChange={() => setShowInDashboard(!showInDashboard)}
                      style={{
                        width: '20px',
                        height: '20px',
                        accentColor: '#00D4AA'
                      }}
                    />
                    <span style={{
                      fontFamily: "'Madimi One', sans-serif",
                      fontSize: '14px',
                      color: '#000000'
                    }}>
                      Show in their dashboard
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column - Step 4 */}
            <div>
              <h3 style={{
                fontFamily: "'Madimi One', sans-serif",
                fontSize: '18px',
                fontWeight: '400',
                color: '#000000',
                margin: '0 0 30px 0',
                paddingBottom: '10px',
                borderBottom: '2px solid #000000'
              }}>
                STEP 4  Review and confirm
              </h3>
              
              <div style={{
                backgroundColor: '#F8F8F8',
                border: '2px solid #000000',
                borderRadius: '12px',
                padding: '25px'
              }}>
                <div style={{ marginBottom: '15px' }}>
                  <span style={{
                    fontFamily: "'Madimi One', sans-serif",
                    fontSize: '14px',
                    color: '#666666'
                  }}>
                    Pack: 
                  </span>
                  <span style={{
                    fontFamily: "'Madimi One', sans-serif",
                    fontSize: '14px',
                    color: '#000000',
                    marginLeft: '5px'
                  }}>
                    Calculus Basics Homework
                  </span>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <span style={{
                    fontFamily: "'Madimi One', sans-serif",
                    fontSize: '14px',
                    color: '#666666'
                  }}>
                    Assigning to: 
                  </span>
                  <span style={{
                    fontFamily: "'Madimi One', sans-serif",
                    fontSize: '14px',
                    color: '#000000',
                    marginLeft: '5px'
                  }}>
                    Year 12 Maths Set 1 (28 students)
                  </span>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <span style={{
                    fontFamily: "'Madimi One', sans-serif",
                    fontSize: '14px',
                    color: '#666666'
                  }}>
                    Due: 
                  </span>
                  <span style={{
                    fontFamily: "'Madimi One', sans-serif",
                    fontSize: '14px',
                    color: '#000000',
                    marginLeft: '5px'
                  }}>
                    15/10/2025 at 23:59
                  </span>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <span style={{
                    fontFamily: "'Madimi One', sans-serif",
                    fontSize: '14px',
                    color: '#666666'
                  }}>
                    Time limit: 
                  </span>
                  <span style={{
                    fontFamily: "'Madimi One', sans-serif",
                    fontSize: '14px',
                    color: '#000000',
                    marginLeft: '5px'
                  }}>
                    {hasTimeLimit ? `${timeLimit} minutes` : 'None'}
                  </span>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <span style={{
                    fontFamily: "'Madimi One', sans-serif",
                    fontSize: '14px',
                    color: '#666666'
                  }}>
                    Questions randomized: 
                  </span>
                  <span style={{
                    fontFamily: "'Madimi One', sans-serif",
                    fontSize: '14px',
                    color: '#000000',
                    marginLeft: '5px'
                  }}>
                    {randomizeQuestions ? 'Yes' : 'No'}
                  </span>
                </div>

                <div>
                  <span style={{
                    fontFamily: "'Madimi One', sans-serif",
                    fontSize: '14px',
                    color: '#666666'
                  }}>
                    Notifications: 
                  </span>
                  <span style={{
                    fontFamily: "'Madimi One', sans-serif",
                    fontSize: '14px',
                    color: '#000000',
                    marginLeft: '5px'
                  }}>
                    {sendEmail && showInDashboard ? 'Email + Dashboard' : 
                     sendEmail ? 'Email' : 
                     showInDashboard ? 'Dashboard' : 'None'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          padding: '20px 40px',
          borderTop: '1px solid #E0E0E0',
          display: 'flex',
          justifyContent: currentPage === 2 ? 'flex-end' : 'flex-end',
          gap: '15px'
        }}>
          {currentPage === 2 && (
            <>
              <button 
                onClick={() => setCurrentPage(1)}
                style={{
                  backgroundColor: '#D4D0FF',
                  border: '2px solid #000000',
                  borderRadius: '8px',
                  padding: '12px 30px',
                  fontFamily: "'Madimi One', sans-serif",
                  fontSize: '16px',
                  color: '#000000',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 3px 0 #000000'
                }}
              >
                <span style={{ fontSize: '18px' }}>←</span>
                Back
              </button>
              <button 
                onClick={onClose}
                style={{
                  backgroundColor: '#5DD4DC',
                  border: '2px solid #000000',
                  borderRadius: '8px',
                  padding: '12px 30px',
                  fontFamily: "'Madimi One', sans-serif",
                  fontSize: '16px',
                  color: '#000000',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 3px 0 #000000'
                }}
              >
                <span style={{ fontSize: '20px' }}>✓</span>
                Assign
              </button>
            </>
          )}
          {currentPage === 1 && (
            <button 
              onClick={() => setCurrentPage(2)}
              style={{
                backgroundColor: '#5DD4DC',
                border: '2px solid #000000',
                borderRadius: '8px',
                padding: '12px 30px',
                fontFamily: "'Madimi One', sans-serif",
                fontSize: '16px',
                color: '#000000',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 3px 0 #000000'
              }}
            >
              Next Step
              <span style={{ fontSize: '18px' }}>→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};