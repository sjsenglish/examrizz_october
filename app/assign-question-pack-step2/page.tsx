'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import '../../styles/globals.css';

export default function AssignQuestionPackStep2Page() {
  const [timeLimit, setTimeLimit] = useState(false);
  const [timeLimitValue, setTimeLimitValue] = useState(60);
  const [randomizeQuestions, setRandomizeQuestions] = useState(true);
  const [emailNotification, setEmailNotification] = useState(true);
  const [showInDashboard, setShowInDashboard] = useState(true);
  const [instructions, setInstructions] = useState("This covers topics from Week 3. Attempt all questions and flag any you find confusing.");

  return (
    <div style={{ 
      backgroundColor: 'rgba(0, 0, 0, 0.5)', 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '20px',
      paddingTop: '10vh'
    }}>
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

      {/* Modal */}
      <div style={{
        backgroundColor: '#F8F9FD',
        border: '1px solid #000000',
        borderRadius: '8px',
        padding: '30px',
        maxWidth: '1440px',
        width: '96%',
        height: '85vh',
        position: 'relative',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
      }}>
        {/* Close Button */}
        <Link href="/teacher" style={{
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
          ASSIGN QUESTION PACK
        </h1>

        {/* Page indicator */}
        <div style={{
          position: 'absolute',
          top: '30px',
          right: '60px',
          fontFamily: "'Figtree', sans-serif",
          fontSize: '14px',
          color: '#666666'
        }}>
          Page 2 of 2
        </div>

        {/* Main Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          height: 'calc(100% - 100px)'
        }}>
          
          {/* Left Column - Assignment Details */}
          <div>
            <h3 style={{
              fontFamily: "'Madimi One', sans-serif",
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#000000',
              margin: '0 0 15px 0',
              paddingBottom: '8px',
              borderBottom: '2px solid #000000'
            }}>
              STEP 3 <span style={{
                fontFamily: "'Figtree', sans-serif",
                fontWeight: 'normal',
                letterSpacing: '0.04em'
              }}>Assignment details</span>
            </h3>

            {/* Step 3 White Container */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #000000',
              borderRadius: '0px',
              padding: '15px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
            }}>

            {/* Due Date */}
            <div style={{ marginBottom: '25px' }}>
              <h4 style={{
                fontFamily: "'Figtree', sans-serif",
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#000000',
                margin: '0 0 8px 0',
                letterSpacing: '0.04em'
              }}>
                Due Date
              </h4>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{
                  backgroundColor: '#D3F6F7',
                  border: '1px solid #000000',
                  borderRadius: '0px',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '120px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                  <span style={{
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '14px',
                    color: '#999999',
                    letterSpacing: '0.04em'
                  }}>
                    DD/MM/YYYY
                  </span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18L15 12L9 6" stroke="#00CED1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div style={{
                  backgroundColor: '#D3F6F7',
                  border: '1px solid #000000',
                  borderRadius: '0px',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                  <span style={{
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '14px',
                    color: '#999999',
                    letterSpacing: '0.04em'
                  }}>
                    HH:MM
                  </span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18L15 12L9 6" stroke="#00CED1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Time Limit */}
            <div style={{ marginBottom: '25px' }}>
              <h4 style={{
                fontFamily: "'Figtree', sans-serif",
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#000000',
                margin: '0 0 8px 0',
                letterSpacing: '0.04em'
              }}>
                Time Limit <span style={{ fontWeight: 'normal', color: '#666666', letterSpacing: '0.04em' }}>(optional)</span>
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '14px',
                  color: '#000000',
                  letterSpacing: '0.04em'
                }}>
                  <input
                    type="checkbox"
                    checked={timeLimit}
                    onChange={(e) => setTimeLimit(e.target.checked)}
                    style={{
                      width: '18px',
                      height: '18px',
                      accentColor: '#89F3FF'
                    }}
                  />
                  Set time limit
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input
                    type="number"
                    value={timeLimitValue}
                    onChange={(e) => setTimeLimitValue(parseInt(e.target.value))}
                    style={{
                      border: '1px solid #000000',
                      backgroundColor: '#FFFFFF',
                      width: '40px',
                      height: '30px',
                      fontFamily: "'Figtree', sans-serif",
                      fontSize: '14px',
                      letterSpacing: '0.04em',
                      textAlign: 'center',
                      borderRadius: '6px',
                      boxShadow: '0 2px 0 rgba(0, 0, 0, 0.3)'
                    }}
                  />
                  <span style={{
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '14px',
                    color: '#000000',
                    letterSpacing: '0.04em'
                  }}>
                    minutes
                  </span>
                </div>
              </div>
            </div>

            {/* Randomize Questions */}
            <div style={{ marginBottom: '25px' }}>
              <h4 style={{
                fontFamily: "'Figtree', sans-serif",
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#000000',
                margin: '0 0 8px 0',
                letterSpacing: '0.04em'
              }}>
                Randomize question order
              </h4>
              <div style={{ display: 'flex', gap: '20px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '14px',
                  color: '#000000',
                  letterSpacing: '0.04em'
                }}>
                  <input
                    type="checkbox"
                    checked={randomizeQuestions}
                    onChange={(e) => setRandomizeQuestions(e.target.checked)}
                    style={{
                      width: '18px',
                      height: '18px',
                      accentColor: '#89F3FF'
                    }}
                  />
                  Yes
                </label>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '14px',
                  color: '#000000',
                  letterSpacing: '0.04em'
                }}>
                  <input
                    type="checkbox"
                    checked={!randomizeQuestions}
                    onChange={(e) => setRandomizeQuestions(!e.target.checked)}
                    style={{
                      width: '18px',
                      height: '18px',
                      accentColor: '#89F3FF'
                    }}
                  />
                  No
                </label>
              </div>
            </div>

            {/* Instructions */}
            <div style={{ marginBottom: '25px' }}>
              <h4 style={{
                fontFamily: "'Figtree', sans-serif",
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#000000',
                margin: '0 0 8px 0',
                letterSpacing: '0.04em'
              }}>
                Instructions for students <span style={{ fontWeight: 'normal', color: '#666666', letterSpacing: '0.04em' }}>(optional)</span>
              </h4>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                style={{
                  width: '100%',
                  height: '50px',
                  backgroundColor: '#E5FAFA',
                  border: 'none',
                  borderRadius: '0px',
                  padding: '8px',
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '14px',
                  letterSpacing: '0.04em',
                  resize: 'none'
                }}
              />
            </div>

            {/* Notify Students */}
            <div style={{ marginBottom: '25px' }}>
              <h4 style={{
                fontFamily: "'Figtree', sans-serif",
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#000000',
                margin: '0 0 15px 0',
                letterSpacing: '0.04em'
              }}>
                Notify students
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '14px',
                  color: '#000000',
                  letterSpacing: '0.04em'
                }}>
                  <input
                    type="checkbox"
                    checked={emailNotification}
                    onChange={(e) => setEmailNotification(e.target.checked)}
                    style={{
                      width: '18px',
                      height: '18px',
                      accentColor: '#89F3FF'
                    }}
                  />
                  Send email notification
                </label>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '14px',
                  color: '#000000',
                  letterSpacing: '0.04em'
                }}>
                  <input
                    type="checkbox"
                    checked={showInDashboard}
                    onChange={(e) => setShowInDashboard(e.target.checked)}
                    style={{
                      width: '18px',
                      height: '18px',
                      accentColor: '#89F3FF'
                    }}
                  />
                  Show in their dashboard
                </label>
              </div>
            </div>
            </div>
          </div>

          {/* Right Column - Review and Confirm */}
          <div>
            <h3 style={{
              fontFamily: "'Madimi One', sans-serif",
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#000000',
              margin: '0 0 15px 0',
              paddingBottom: '8px',
              borderBottom: '2px solid #000000'
            }}>
              STEP 4 <span style={{
                fontFamily: "'Figtree', sans-serif",
                fontWeight: 'normal',
                letterSpacing: '0.04em'
              }}>Review and confirm</span>
            </h3>

            {/* Review Card */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #000000',
              borderRadius: '0px',
              padding: '25px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              marginBottom: '30px'
            }}>
              <div style={{
                fontFamily: "'Figtree', sans-serif",
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#000000',
                marginBottom: '15px',
                letterSpacing: '0.04em'
              }}>
                Pack: Calculus Basics Homework
              </div>
              
              <div style={{
                fontFamily: "'Figtree', sans-serif",
                fontSize: '14px',
                color: '#000000',
                marginBottom: '8px',
                letterSpacing: '0.04em'
              }}>
                Assigning to: Year 12 Maths Set 1 (28 students)
              </div>
              
              <div style={{
                fontFamily: "'Figtree', sans-serif",
                fontSize: '14px',
                color: '#000000',
                marginBottom: '8px',
                letterSpacing: '0.04em'
              }}>
                Due: 15/10/2025 at 23:59
              </div>
              
              <div style={{
                fontFamily: "'Figtree', sans-serif",
                fontSize: '14px',
                color: '#000000',
                marginBottom: '8px',
                letterSpacing: '0.04em'
              }}>
                Time limit: {timeLimit ? `${timeLimitValue} minutes` : 'None'}
              </div>
              
              <div style={{
                fontFamily: "'Figtree', sans-serif",
                fontSize: '14px',
                color: '#000000',
                marginBottom: '8px',
                letterSpacing: '0.04em'
              }}>
                Questions randomized: {randomizeQuestions ? 'Yes' : 'No'}
              </div>
              
              <div style={{
                fontFamily: "'Figtree', sans-serif",
                fontSize: '14px',
                color: '#000000',
                letterSpacing: '0.04em'
              }}>
                Notifications: {[
                  emailNotification && 'Email',
                  showInDashboard && 'Dashboard'
                ].filter(Boolean).join(' + ') || 'None'}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ 
              position: 'absolute',
              bottom: '30px',
              right: '30px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              alignItems: 'flex-end'
            }}>
              <Link href="/assign-question-pack" style={{ textDecoration: 'none' }}>
                <button style={{
                  backgroundColor: '#D4D0FF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '108px',
                  justifyContent: 'center'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Back
                </button>
              </Link>

              <Link href="/teacher" style={{ textDecoration: 'none' }}>
                <button style={{
                  backgroundColor: '#00CED1',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '108px',
                  justifyContent: 'center'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Assign
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}