'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import '../../styles/globals.css';

export default function TeacherPage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
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

      {/* Content with navbar padding */}
      <div style={{ paddingTop: '60px' }}>
        
        {/* Back Button */}
        <div style={{ 
          padding: '20px 60px 0',
          backgroundColor: '#FFFFFF'
        }}>
          <Link 
            href="/" 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#333333',
              fontFamily: "'Madimi One', sans-serif",
              fontSize: '13px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              width: 'fit-content',
              border: '1px solid #000000'
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </Link>
        </div>

        {/* Header */}
        <div style={{
          padding: '20px 60px',
          marginBottom: '20px',
          transform: 'translateX(15%)'
        }}>
          
          <h1 style={{
            fontFamily: "'Madimi One', sans-serif",
            fontSize: '36px',
            fontWeight: '400',
            fontStyle: 'normal',
            letterSpacing: '0.04em',
            color: '#000000',
            margin: '0'
          }}>
            Teacher Dashboard
          </h1>
        </div>

        {/* Main Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '40px',
          maxWidth: '1400px',
          padding: '0 60px 60px',
          margin: '0 auto',
          transform: 'translateX(15%)'
        }}>
          
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            
            {/* Quick Actions */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #000000',
              borderRadius: '4px',
              padding: '20px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                backgroundColor: '#B3F0F2',
                padding: '12px',
                textAlign: 'center',
                marginBottom: '20px',
                borderRadius: '0px',
                border: '1px solid #000000',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}>
                <h2 style={{
                  fontFamily: "'Madimi One', sans-serif",
                  fontSize: '18px',
                  fontWeight: '400',
                  fontStyle: 'normal',
                  letterSpacing: '0.04em',
                  color: '#000000',
                  margin: '0'
                }}>
                  QUICK ACTIONS
                </h2>
              </div>
              
              <div style={{
                backgroundColor: '#E5FAFA',
                padding: '15px',
                borderRadius: '0px'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '15px'
                }}>
                  <button style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #000000',
                    borderRadius: '0px',
                    padding: '20px 39px',
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '16px',
                    letterSpacing: '0.04em',
                    color: '#000000',
                    cursor: 'pointer',
                    textAlign: 'center',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}>
                    Create Pack
                  </button>
                  <Link href="/assign-question-pack" style={{ textDecoration: 'none' }}>
                    <button style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #000000',
                      borderRadius: '0px',
                      padding: '20px 39px',
                      fontFamily: "'Figtree', sans-serif",
                      fontSize: '16px',
                      letterSpacing: '0.04em',
                      color: '#000000',
                      cursor: 'pointer',
                      textAlign: 'center',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      width: '100%'
                    }}>
                      Assign Existing Pack
                    </button>
                  </Link>
                  <button style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #000000',
                    borderRadius: '0px',
                    padding: '20px 39px',
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '16px',
                    letterSpacing: '0.04em',
                    color: '#000000',
                    cursor: 'pointer',
                    textAlign: 'center',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}>
                    Add Student to Class
                  </button>
                </div>
              </div>
            </div>

            {/* My Classes */}
            <div>
              <h2 style={{
                fontFamily: "'Madimi One', sans-serif",
                fontSize: '24px',
                fontWeight: '400',
                fontStyle: 'normal',
                letterSpacing: '0.04em',
                color: '#000000',
                marginBottom: '20px'
              }}>
                MY CLASSES
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '20px'
              }}>
                {/* Class Cards */}
                {[1, 2, 3].map((i) => (
                  <div key={i} style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #000000',
                    borderRadius: '4px',
                    padding: '20px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}>
                    <h3 style={{
                      fontFamily: "'Madimi One', sans-serif",
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#000000',
                      margin: '0 0 8px 0'
                    }}>
                      Y12 Set
                    </h3>
                    <p style={{
                      fontFamily: "'Madimi One', sans-serif",
                      fontSize: '14px',
                      color: '#000000',
                      fontWeight: 'bold',
                      margin: '0 0 8px 0'
                    }}>
                      28 students
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#00CED1',
                        borderRadius: '50%'
                      }}></div>
                      <span style={{
                        fontFamily: "'Madimi One', sans-serif",
                        fontSize: '14px',
                        color: '#000000'
                      }}>
                        3 active
                      </span>
                    </div>
                    <button style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      fontFamily: "'Madimi One', sans-serif",
                      fontSize: '14px',
                      color: '#0066CC',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      float: 'right'
                    }}>
                      View →
                    </button>
                  </div>
                ))}
                
                {/* Add Class Card */}
                <div style={{
                  backgroundColor: '#E5FAFA',
                  border: '1px solid #000000',
                  borderRadius: '4px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  minHeight: '140px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{
                    fontSize: '24px',
                    marginBottom: '8px',
                    fontWeight: 'bold'
                  }}>+</div>
                  <span style={{
                    fontFamily: "'Madimi One', sans-serif",
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#000000',
                    letterSpacing: '0.04em'
                  }}>
                    ADD CLASS
                  </span>
                </div>
              </div>
            </div>

            {/* Teacher Icon close to left edge */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              margin: '0px 0',
              paddingLeft: '20px',
              transform: 'translateX(-30%)'
            }}>
              <Image 
                src="/icons/teacher.svg" 
                alt="Teacher" 
                width={120} 
                height={120}
              />
            </div>

            {/* Ongoing Packs */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #000000',
              borderRadius: '4px',
              padding: '20px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                backgroundColor: '#B3F0F2',
                padding: '12px',
                textAlign: 'center',
                marginBottom: '20px',
                borderRadius: '0px',
                border: '1px solid #000000',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}>
                <h2 style={{
                  fontFamily: "'Madimi One', sans-serif",
                  fontSize: '18px',
                  fontWeight: '400',
                  fontStyle: 'normal',
                  letterSpacing: '0.04em',
                  color: '#000000',
                  margin: '0'
                }}>
                  ONGOING PACKS
                </h2>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {/* Pack 1 */}
                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #000000',
                  borderRadius: '0px',
                  padding: '20px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#000000',
                        margin: '0 0 8px 0',
                        letterSpacing: '0.04em'
                      }}>
                        Maths A Level Integrals Basics
                      </h3>
                      <p style={{
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: '14px',
                        color: '#666666',
                        margin: '0 0 4px 0',
                        letterSpacing: '0.04em'
                      }}>
                        847 questions completed
                      </p>
                      <p style={{
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: '14px',
                        color: '#666666',
                        margin: '0 0 8px 0',
                        letterSpacing: '0.04em'
                      }}>
                        15/28 done
                      </p>
                      <p style={{
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: '14px',
                        color: '#000000',
                        margin: '0',
                        letterSpacing: '0.04em'
                      }}>
                        6 students need support
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                      <span style={{
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: '14px',
                        color: '#666666',
                        letterSpacing: '0.04em'
                      }}>
                        Due tomorrow
                      </span>
                      <button style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: '14px',
                        color: '#0066CC',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        letterSpacing: '0.04em'
                      }}>
                        View →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Pack 2 */}
                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #000000',
                  borderRadius: '0px',
                  padding: '20px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#000000',
                        margin: '0 0 8px 0',
                        letterSpacing: '0.04em'
                      }}>
                        Maths A Level Integrals Basics
                      </h3>
                      <p style={{
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: '14px',
                        color: '#666666',
                        margin: '0 0 4px 0',
                        letterSpacing: '0.04em'
                      }}>
                        847 questions completed
                      </p>
                      <p style={{
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: '14px',
                        color: '#666666',
                        margin: '0 0 8px 0',
                        letterSpacing: '0.04em'
                      }}>
                        26/28 done
                      </p>
                      <p style={{
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: '14px',
                        color: '#000000',
                        margin: '0',
                        letterSpacing: '0.04em'
                      }}>
                        2 students need support
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                      <span style={{
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: '14px',
                        color: '#000000',
                        fontWeight: 'bold',
                        letterSpacing: '0.04em'
                      }}>
                        Overdue
                      </span>
                      <button style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: '14px',
                        color: '#0066CC',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        letterSpacing: '0.04em'
                      }}>
                        View →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {/* Right column content can be added here */}
          </div>
        </div>
      </div>
    </div>
  );
}