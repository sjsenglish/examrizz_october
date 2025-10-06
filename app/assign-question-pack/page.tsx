'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import '../../styles/globals.css';

export default function AssignQuestionPackPage() {
  const [assignToEntireClass, setAssignToEntireClass] = useState(true);
  const [selectedClasses, setSelectedClasses] = useState([0]); // First class selected by default
  
  const classes = [
    'Year 12 Maths A Level Edexcel Set 1 (28 students)',
    'Year 12 Maths A Level Edexcel Set 1 (28 students)',
    'Year 12 Maths A Level Edexcel Set 1 (28 students)',
    'Year 12 Maths A Level Edexcel Set 1 (28 students)'
  ];

  const handleClassToggle = (index: number) => {
    setSelectedClasses(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const getTotalStudents = () => {
    return selectedClasses.length * 28; // 28 students per class
  };

  return (
    <div style={{ 
      backgroundColor: 'rgba(0, 0, 0, 0.5)', 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
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
        backgroundColor: '#FFFFFF',
        border: '1px solid #000000',
        borderRadius: '8px',
        padding: '30px',
        maxWidth: '1200px',
        width: '100%',
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
          fontSize: '32px',
          fontWeight: '400',
          letterSpacing: '0.04em',
          color: '#000000',
          margin: '0 0 40px 0',
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
          Page 1 of 2
        </div>

        {/* Main Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '60px'
        }}>
          
          {/* Left Column - Question Pack Info */}
          <div>
            {/* Question Pack Card */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #000000',
              borderRadius: '8px',
              padding: '30px',
              marginBottom: '40px',
              position: 'relative'
            }}>
              <h2 style={{
                fontFamily: "'Figtree', sans-serif",
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#000000',
                margin: '0 0 20px 0'
              }}>
                Calculus Basics Homework
              </h2>
              
              <div style={{ 
                display: 'flex',
                gap: '30px',
                marginBottom: '20px'
              }}>
                <div>
                  <span style={{
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#000000'
                  }}>
                    28 Questions
                  </span>
                </div>
                <div>
                  <span style={{
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#000000'
                  }}>
                    50 marks
                  </span>
                </div>
              </div>

              {/* Ghost Icon */}
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px'
              }}>
                <Image 
                  src="/icons/speech-bubble-ghost.svg" 
                  alt="Ghost" 
                  width={60} 
                  height={60}
                />
              </div>
            </div>

            {/* Step 1 */}
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{
                fontFamily: "'Figtree', sans-serif",
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#000000',
                margin: '0 0 20px 0',
                paddingBottom: '10px',
                borderBottom: '2px solid #000000'
              }}>
                <span style={{
                  backgroundColor: '#000000',
                  color: '#FFFFFF',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  marginRight: '12px',
                  fontSize: '14px'
                }}>
                  STEP 1
                </span>
                Who should receive this pack?
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '16px',
                  color: '#000000'
                }}>
                  <input
                    type="checkbox"
                    checked={assignToEntireClass}
                    onChange={(e) => setAssignToEntireClass(e.target.checked)}
                    style={{
                      width: '20px',
                      height: '20px',
                      accentColor: '#00CED1'
                    }}
                  />
                  Assign to entire class
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '16px',
                  color: '#000000'
                }}>
                  <input
                    type="checkbox"
                    checked={!assignToEntireClass}
                    onChange={(e) => setAssignToEntireClass(!e.target.checked)}
                    style={{
                      width: '20px',
                      height: '20px',
                      accentColor: '#00CED1'
                    }}
                  />
                  Assign to specific students
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Class Selection */}
          <div>
            <h3 style={{
              fontFamily: "'Figtree', sans-serif",
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#000000',
              margin: '0 0 20px 0',
              paddingBottom: '10px',
              borderBottom: '2px solid #000000'
            }}>
              <span style={{
                backgroundColor: '#000000',
                color: '#FFFFFF',
                padding: '4px 8px',
                borderRadius: '4px',
                marginRight: '12px',
                fontSize: '14px'
              }}>
                STEP 2
              </span>
              Who should receive this pack?
            </h3>

            {/* Class List */}
            <div style={{
              backgroundColor: '#E5FAFA',
              border: '1px solid #CCCCCC',
              borderRadius: '8px',
              padding: '20px',
              height: '300px',
              overflowY: 'auto',
              marginBottom: '20px'
            }}>
              {classes.map((className, index) => (
                <label key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '14px',
                  color: '#000000',
                  padding: '12px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #CCCCCC',
                  borderRadius: '4px',
                  marginBottom: '8px'
                }}>
                  <input
                    type="checkbox"
                    checked={selectedClasses.includes(index)}
                    onChange={() => handleClassToggle(index)}
                    style={{
                      width: '18px',
                      height: '18px',
                      accentColor: '#00CED1'
                    }}
                  />
                  {className}
                </label>
              ))}
            </div>

            {/* Selection Summary */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '40px'
            }}>
              <span style={{
                fontFamily: "'Figtree', sans-serif",
                fontSize: '14px',
                color: '#000000'
              }}>
                Selected - {selectedClasses.length} class{selectedClasses.length !== 1 ? 'es' : ''}, {getTotalStudents()} students
              </span>
              <button style={{
                background: 'none',
                border: 'none',
                color: '#0066CC',
                fontFamily: "'Figtree', sans-serif",
                fontSize: '14px',
                textDecoration: 'underline',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedClasses([])}
              >
                clear selection
              </button>
            </div>

            {/* Next Step Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
                Next Step
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}