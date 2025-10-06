'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import '../../styles/globals.css';

export default function AssignQuestionPackStudentsPage() {
  const [selectedStudents, setSelectedStudents] = useState([0]); // First student selected by default
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('All Classes');
  
  const students = [
    { name: 'Jake T.', class: 'Year 12 Set 1' },
    { name: 'Jake T.', class: 'Year 12 Set 1' },
    { name: 'Jake T.', class: 'Year 12 Set 1' },
    { name: 'Jake T.', class: 'Year 12 Set 1' },
    { name: 'Sarah M.', class: 'Year 12 Set 1' },
    { name: 'Alex K.', class: 'Year 12 Set 1' },
    { name: 'Jamie L.', class: 'Year 12 Set 1' }
  ];

  const handleStudentToggle = (index: number) => {
    setSelectedStudents(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const clearSelection = () => {
    setSelectedStudents([]);
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          Page 1 of 2
        </div>

        {/* Main Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          height: 'calc(100% - 100px)'
        }}>
          
          {/* Left Column - Question Pack Info */}
          <div>
            {/* Question Pack Card */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #000000',
              borderRadius: '0px',
              padding: '30px',
              marginBottom: '40px',
              position: 'relative',
              width: '90%',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{
                fontFamily: "'Figtree', sans-serif",
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#000000',
                margin: '0 0 20px 0',
                letterSpacing: '0.04em'
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
                    fontWeight: 'normal',
                    color: '#000000',
                    letterSpacing: '0.04em'
                  }}>
                    28 Questions
                  </span>
                </div>
                <div>
                  <span style={{
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '16px',
                    fontWeight: 'normal',
                    color: '#000000',
                    letterSpacing: '0.04em'
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

            {/* Step 1 Info */}
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{
                fontFamily: "'Madimi One', sans-serif",
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#000000',
                margin: '0 0 15px 0',
                paddingBottom: '8px',
                borderBottom: '2px solid #000000'
              }}>
                STEP 1 <span style={{
                  fontFamily: "'Figtree', sans-serif",
                  fontWeight: 'normal',
                  letterSpacing: '0.04em'
                }}>Who should receive this pack?</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '16px',
                  color: '#000000',
                  letterSpacing: '0.04em'
                }}>
                  <input
                    type="checkbox"
                    checked={false}
                    disabled
                    style={{
                      width: '20px',
                      height: '20px',
                      accentColor: '#89F3FF'
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
                  color: '#000000',
                  letterSpacing: '0.04em'
                }}>
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    style={{
                      width: '20px',
                      height: '20px',
                      accentColor: '#89F3FF'
                    }}
                  />
                  Assign to specific students
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Student Selection */}
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
              STEP 2 <span style={{
                fontFamily: "'Figtree', sans-serif",
                fontWeight: 'normal',
                letterSpacing: '0.04em'
              }}>Select students</span>
            </h3>

            {/* Filter and Search */}
            <div style={{
              display: 'flex',
              gap: '15px',
              marginBottom: '20px',
              alignItems: 'center'
            }}>
              <div>
                <span style={{
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '14px',
                  color: '#000000',
                  letterSpacing: '0.04em',
                  marginRight: '8px'
                }}>
                  Filter by class
                </span>
                <select 
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  style={{
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '14px',
                    padding: '5px 10px',
                    border: '1px solid #000000',
                    borderRadius: '0px',
                    backgroundColor: '#FFFFFF',
                    letterSpacing: '0.04em'
                  }}
                >
                  <option>All Classes</option>
                  <option>Year 12 Set 1</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '14px',
                  color: '#000000',
                  letterSpacing: '0.04em'
                }}>
                  Search
                </span>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Search by Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      fontFamily: "'Figtree', sans-serif",
                      fontSize: '14px',
                      padding: '5px 30px 5px 10px',
                      border: '1px solid #000000',
                      borderRadius: '0px',
                      backgroundColor: '#FFFFFF',
                      letterSpacing: '0.04em',
                      width: '150px'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="11" cy="11" r="8" stroke="#000000" strokeWidth="2"/>
                      <path d="21 21l-4.35-4.35" stroke="#000000" strokeWidth="2"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Student List */}
            <div style={{
              backgroundColor: '#D3F6F7',
              border: '1px solid #000000',
              borderRadius: '0px',
              padding: '20px',
              height: '300px',
              overflowY: 'auto',
              marginBottom: '20px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              {filteredStudents.map((student, index) => (
                <label key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '14px',
                  color: '#000000',
                  padding: '12px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #000000',
                  borderRadius: '0px',
                  marginBottom: '8px',
                  letterSpacing: '0.04em',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(index)}
                      onChange={() => handleStudentToggle(index)}
                      style={{
                        width: '18px',
                        height: '18px',
                        accentColor: '#89F3FF'
                      }}
                    />
                    <span>{student.name}</span>
                  </div>
                  <span style={{
                    fontSize: '12px',
                    color: '#666666',
                    letterSpacing: '0.04em'
                  }}>
                    {student.class}
                  </span>
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
                color: '#000000',
                letterSpacing: '0.04em'
              }}>
                Selected - {selectedStudents.length} student{selectedStudents.length !== 1 ? 's' : ''}
              </span>
              <button 
                onClick={clearSelection}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0066CC',
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '14px',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  letterSpacing: '0.04em'
                }}
              >
                clear selection
              </button>
            </div>

            {/* Next Step Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Link href="/assign-question-pack-step2" style={{ textDecoration: 'none' }}>
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
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}