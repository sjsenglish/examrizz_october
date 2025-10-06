'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import '../../styles/globals.css';

export default function QuestionPacksPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const questionPacks = [
    {
      name: "A Level Chemistry AQA",
      questions: 28,
      marks: 50,
      timesAssigned: "x times assigned",
      category: "A Level",
      subject: "Chemistry"
    },
    {
      name: "A Level Biology AQA", 
      questions: 35,
      marks: 65,
      timesAssigned: "x times assigned",
      category: "A Level", 
      subject: "Biology"
    },
    {
      name: "GCSE Mathematics Higher",
      questions: 42,
      marks: 80,
      timesAssigned: "x times assigned",
      category: "GCSE",
      subject: "Mathematics"
    }
  ];

  const filteredPacks = questionPacks.filter(pack => 
    pack.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pack.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            href="/teacher" 
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

        {/* Main Content */}
        <div style={{
          maxWidth: '1400px',
          padding: '40px 60px 60px',
          margin: '0 auto',
          position: 'relative'
        }}>
          
          {/* Header and Search */}
          <div style={{
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            <h1 style={{
              fontFamily: "'Madimi One', sans-serif",
              fontSize: '36px',
              fontWeight: '400',
              fontStyle: 'normal',
              letterSpacing: '0.04em',
              color: '#000000',
              margin: '0 0 30px 0'
            }}>
              Your Question Packs
            </h1>
            
            {/* Search Bar */}
            <div style={{
              position: 'relative',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              <input
                type="text"
                placeholder="Search for question packs by name ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '15px 50px 15px 20px',
                  border: '2px solid #000000',
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '16px',
                  letterSpacing: '0.04em',
                  outline: 'none'
                }}
              />
              <div style={{
                position: 'absolute',
                right: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="8" stroke="#000000" strokeWidth="2"/>
                  <path d="21 21l-4.35-4.35" stroke="#000000" strokeWidth="2"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            marginBottom: '40px'
          }}>
            <div style={{
              backgroundColor: '#B3F0F2',
              border: '2px solid #000000',
              borderRadius: '0px',
              padding: '15px 30px',
              fontFamily: "'Madimi One', sans-serif",
              fontSize: '18px',
              fontWeight: '400',
              color: '#000000',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              boxShadow: '4px 4px 0 #000000',
              transform: 'perspective(500px) rotateX(10deg)'
            }}>
              A Level
            </div>
            <div style={{
              backgroundColor: '#B3F0F2',
              border: '2px solid #000000',
              borderRadius: '0px',
              padding: '15px 30px',
              fontFamily: "'Madimi One', sans-serif",
              fontSize: '18px',
              fontWeight: '400',
              color: '#000000',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              boxShadow: '4px 4px 0 #000000',
              transform: 'perspective(500px) rotateX(10deg)'
            }}>
              Admissions
            </div>
            <div style={{
              backgroundColor: '#B3F0F2',
              border: '2px solid #000000',
              borderRadius: '0px',
              padding: '15px 30px',
              fontFamily: "'Madimi One', sans-serif",
              fontSize: '18px',
              fontWeight: '400',
              color: '#000000',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              boxShadow: '4px 4px 0 #000000',
              transform: 'perspective(500px) rotateX(10deg)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 14C19 18.4 14 22 12 22C10 22 5 18.4 5 14C5 10 9 6 12 6C15 6 19 10 19 14Z" stroke="#000000" strokeWidth="2"/>
                <path d="M12 6V2" stroke="#000000" strokeWidth="2"/>
                <path d="M8 8L6 6" stroke="#000000" strokeWidth="2"/>
                <path d="M16 8L18 6" stroke="#000000" strokeWidth="2"/>
              </svg>
              Saved
            </div>
          </div>

          {/* Question Pack Cards */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '30px',
            marginBottom: '60px'
          }}>
            {filteredPacks.map((pack, index) => (
              <div key={index} style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #000000',
                borderRadius: '0px',
                padding: '0',
                boxShadow: '6px 6px 0 #000000',
                transform: 'perspective(800px) rotateX(5deg)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Pack Header with Category Label */}
                <div style={{
                  backgroundColor: '#E5FAFA',
                  padding: '15px 25px',
                  borderBottom: '2px solid #000000',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <h3 style={{
                    fontFamily: "'Madimi One', sans-serif",
                    fontSize: '20px',
                    fontWeight: '400',
                    color: '#000000',
                    margin: '0',
                    letterSpacing: '0.04em'
                  }}>
                    {pack.name}
                  </h3>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px'
                  }}>
                    <button style={{
                      backgroundColor: '#D4D0FF',
                      border: '1px solid #000000',
                      borderRadius: '4px',
                      padding: '8px 16px',
                      fontFamily: "'Figtree', sans-serif",
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#000000',
                      cursor: 'pointer',
                      letterSpacing: '0.04em'
                    }}>
                      Assign pack
                    </button>
                    <Link 
                      href="#"
                      style={{
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: '14px',
                        color: '#0066CC',
                        textDecoration: 'underline',
                        letterSpacing: '0.04em'
                      }}
                    >
                      view all history →
                    </Link>
                    
                    {/* Share dropdown */}
                    <div style={{ position: 'relative' }}>
                      <button style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '5px'
                      }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="#000000"/>
                        </svg>
                      </button>
                      
                      {/* Share menu (shown on hover/click) */}
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: '0',
                        backgroundColor: '#B3F0F2',
                        border: '1px solid #000000',
                        borderRadius: '4px',
                        padding: '10px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        zIndex: 10,
                        minWidth: '180px',
                        display: 'none' // Hidden by default, would show on interaction
                      }}>
                        <div style={{
                          fontFamily: "'Figtree', sans-serif",
                          fontSize: '14px',
                          color: '#0066CC',
                          cursor: 'pointer',
                          padding: '5px 0',
                          letterSpacing: '0.04em'
                        }}>
                          Share question pack
                        </div>
                        <div style={{
                          fontFamily: "'Figtree', sans-serif",
                          fontSize: '14px',
                          color: '#0066CC',
                          cursor: 'pointer',
                          padding: '5px 0',
                          letterSpacing: '0.04em'
                        }}>
                          Send pack to a friend
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pack Content */}
                <div style={{
                  padding: '25px',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '20px',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{
                      display: 'flex',
                      gap: '30px',
                      marginBottom: '15px'
                    }}>
                      <span style={{
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: '16px',
                        color: '#000000',
                        letterSpacing: '0.04em'
                      }}>
                        {pack.questions} questions
                      </span>
                      <span style={{
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: '16px',
                        color: '#000000',
                        letterSpacing: '0.04em'
                      }}>
                        {pack.marks} marks
                      </span>
                    </div>
                    <div style={{
                      fontFamily: "'Figtree', sans-serif",
                      fontSize: '14px',
                      color: '#666666',
                      letterSpacing: '0.04em'
                    }}>
                      {pack.timesAssigned}
                    </div>
                  </div>
                  
                  {/* Subject icon area - empty for now */}
                  <div style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: '#F0F0F0',
                    border: '1px solid #CCCCCC',
                    borderRadius: '4px'
                  }}>
                    {/* Subject-specific icon would go here */}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* New Pack Button */}
          <div style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px'
          }}>
            <button style={{
              backgroundColor: '#B3F0F2',
              border: '2px solid #000000',
              borderRadius: '8px',
              padding: '15px 25px',
              fontFamily: "'Madimi One', sans-serif",
              fontSize: '16px',
              fontWeight: '400',
              color: '#000000',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              letterSpacing: '0.04em',
              boxShadow: '4px 4px 0 #000000'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              New Pack
            </button>
          </div>

          {/* Teacher Icon */}
          <div style={{
            position: 'absolute',
            bottom: '100px',
            left: '50px'
          }}>
            <Image 
              src="/icons/teacher.svg" 
              alt="Teacher" 
              width={120} 
              height={120}
            />
          </div>

          {/* Decorative Clouds */}
          <div style={{
            position: 'absolute',
            top: '50px',
            left: '0px'
          }}>
            <svg width="100" height="60" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 40C20 35 24 30 30 30C32 25 38 20 45 25C50 20 60 25 60 35C65 35 70 40 70 45C70 50 65 55 60 55H25C20 55 15 50 20 40Z" fill="#F0F0F0" stroke="#CCCCCC" strokeWidth="1"/>
            </svg>
          </div>
          
          <div style={{
            position: 'absolute',
            top: '80px',
            right: '50px'
          }}>
            <svg width="120" height="70" viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M25 50C25 45 29 40 35 40C37 35 43 30 50 35C55 30 65 35 65 45C70 45 75 50 75 55C75 60 70 65 65 65H30C25 65 20 60 25 50Z" fill="#F0F0F0" stroke="#CCCCCC" strokeWidth="1"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}