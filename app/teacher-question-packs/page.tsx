'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function TeacherQuestionPacksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('A Level');

  return (
    <div style={{ backgroundColor: '#F8F8F5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        padding: '30px 60px',
        backgroundColor: '#F8F8F5'
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <h1 style={{
            fontFamily: "'Madimi One', sans-serif",
            fontSize: '32px',
            fontWeight: '400',
            color: '#000000',
            margin: '0',
            cursor: 'pointer'
          }}>
            examrizzsearch
          </h1>
        </Link>
      </div>

      {/* Main Content */}
      <div style={{ 
        padding: '60px',
        position: 'relative',
        paddingBottom: '200px'
      }}>
        
        {/* Your Question Packs Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <h2 style={{
            fontFamily: "'Madimi One', sans-serif",
            fontSize: '28px',
            fontWeight: '400',
            color: '#000000',
            margin: '0 0 20px 0'
          }}>
            Your Question Packs
          </h2>
          
          {/* Search Bar */}
          <div style={{
            maxWidth: '600px',
            margin: '0 auto 30px',
            position: 'relative'
          }}>
            <input
              type="text"
              placeholder="Search for question packs by name ..."
              style={{
                width: '100%',
                padding: '15px 50px 15px 20px',
                fontSize: '16px',
                fontFamily: "'Madimi One', sans-serif",
                border: '2px solid #000000',
                borderRadius: '8px',
                outline: 'none',
                backgroundColor: '#FFFFFF'
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
                <path d="m21 21-4.35-4.35" stroke="#000000" strokeWidth="2"/>
              </svg>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="tabs-container" style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '40px'
          }}>
            <button 
              className={`tab ${activeTab === 'A Level' ? 'tab-active' : 'tab-inactive'} tab-wide`}
              onClick={() => setActiveTab('A Level')}
              style={{
                position: 'relative',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Madimi One', sans-serif",
                fontSize: '16px',
                color: '#000000'
              }}
            >
              <svg width="286" height="70" viewBox="0 0 286 70" xmlns="http://www.w3.org/2000/svg">
                <polygon points="3,13 263,13 263,57 3,57" fill="#B3F0F2"/>
                <polygon points="3,13 15,3 275,3 263,13" fill="#B3F0F2"/>
                <polygon points="263,13 275,3 275,45 263,57" fill="#B3F0F2"/>
                <path d="M 3,57 L 3,13 L 15,3 L 275,3 L 275,45 L 263,57 Z" 
                      fill="none" stroke="#000000" strokeWidth="2"/>
                <line x1="3" y1="13" x2="263" y2="13" stroke="#000000" strokeWidth="2"/>
                <line x1="263" y1="13" x2="263" y2="57" stroke="#000000" strokeWidth="2"/>
                <line x1="263" y1="13" x2="275" y2="3" stroke="#000000" strokeWidth="2"/>
              </svg>
              <span style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}>
                A Level
              </span>
            </button>
            
            <button 
              className={`tab ${activeTab === 'Admissions' ? 'tab-active' : 'tab-inactive'} tab-wide`}
              onClick={() => setActiveTab('Admissions')}
              style={{
                position: 'relative',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Madimi One', sans-serif",
                fontSize: '16px',
                color: '#000000'
              }}
            >
              <svg width="286" height="70" viewBox="0 0 286 70" xmlns="http://www.w3.org/2000/svg">
                <polygon points="3,13 263,13 263,57 3,57" fill="#B3F0F2"/>
                <polygon points="3,13 15,3 275,3 263,13" fill="#B3F0F2"/>
                <polygon points="263,13 275,3 275,45 263,57" fill="#B3F0F2"/>
                <path d="M 3,57 L 3,13 L 15,3 L 275,3 L 275,45 L 263,57 Z" 
                      fill="none" stroke="#000000" strokeWidth="2"/>
                <line x1="3" y1="13" x2="263" y2="13" stroke="#000000" strokeWidth="2"/>
                <line x1="263" y1="13" x2="263" y2="57" stroke="#000000" strokeWidth="2"/>
                <line x1="263" y1="13" x2="275" y2="3" stroke="#000000" strokeWidth="2"/>
              </svg>
              <span style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}>
                Admissions
              </span>
            </button>
            
            <button 
              className={`tab ${activeTab === 'Saved' ? 'tab-active' : 'tab-inactive'} tab-saved`}
              onClick={() => setActiveTab('Saved')}
              style={{
                position: 'relative',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Madimi One', sans-serif",
                fontSize: '16px',
                color: '#000000'
              }}
            >
              <svg width="220" height="70" viewBox="0 0 220 70" xmlns="http://www.w3.org/2000/svg">
                <polygon points="3,13 197,13 197,57 3,57" fill="#B3F0F2"/>
                <polygon points="3,13 15,3 209,3 197,13" fill="#B3F0F2"/>
                <polygon points="197,13 209,3 209,45 197,57" fill="#B3F0F2"/>
                <path d="M 3,57 L 3,13 L 15,3 L 209,3 L 209,45 L 197,57 Z" 
                      fill="none" stroke="#000000" strokeWidth="2"/>
                <line x1="3" y1="13" x2="197" y2="13" stroke="#000000" strokeWidth="2"/>
                <line x1="197" y1="13" x2="197" y2="57" stroke="#000000" strokeWidth="2"/>
                <line x1="197" y1="13" x2="209" y2="3" stroke="#000000" strokeWidth="2"/>
              </svg>
              <span style={{
                position: 'absolute',
                top: '50%',
                left: '40%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                Saved
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* Teacher Icon - Bottom Left */}
        <div style={{
          position: 'fixed',
          left: '80px',
          bottom: '80px',
          zIndex: 50
        }}>
          <div style={{
            width: '92px',
            height: '92px',
            backgroundColor: '#B3F0F2',
            border: '2px solid #000000',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontFamily: "'Madimi One', sans-serif",
            color: '#000000',
            textAlign: 'center'
          }}>
            TEACHER
          </div>
        </div>

        {/* New Pack Button - Right Side */}
        <div style={{
          position: 'fixed',
          right: '80px',
          bottom: '80px',
          zIndex: 100
        }}>
          <button 
            onClick={() => setIsModalOpen(true)}
            style={{
              backgroundColor: '#5DD4DC',
              border: '2px solid #000000',
              borderRadius: '12px',
              padding: '12px 20px',
              fontFamily: "'Madimi One', sans-serif",
              fontSize: '16px',
              color: '#000000',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 0 #000000',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 0 #000000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0px)';
              e.currentTarget.style.boxShadow = '0 4px 0 #000000';
            }}
          >
            <span style={{ fontSize: '20px' }}>+</span>
            New Pack
          </button>
        </div>

        {/* Cloud Decorations */}
        <div style={{
          position: 'absolute',
          left: '5%',
          top: '10%',
          zIndex: 1
        }}>
          <svg width="80" height="50" viewBox="0 0 80 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 35C15 35 10 30 10 25C10 20 15 15 20 15C25 15 30 20 30 25C30 30 25 35 20 35Z" fill="#E0E0E0" opacity="0.3"/>
            <path d="M45 35C40 35 35 30 35 25C35 20 40 15 45 15C50 15 55 20 55 25C55 30 50 35 45 35Z" fill="#E0E0E0" opacity="0.3"/>
            <path d="M65 30C60 30 55 25 55 20C55 15 60 10 65 10C70 10 75 15 75 20C75 25 70 30 65 30Z" fill="#E0E0E0" opacity="0.3"/>
          </svg>
        </div>
        
        <div style={{
          position: 'absolute',
          right: '5%',
          top: '15%',
          zIndex: 1
        }}>
          <svg width="80" height="50" viewBox="0 0 80 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 35C15 35 10 30 10 25C10 20 15 15 20 15C25 15 30 20 30 25C30 30 25 35 20 35Z" fill="#E0E0E0" opacity="0.3"/>
            <path d="M45 35C40 35 35 30 35 25C35 20 40 15 45 15C50 15 55 20 55 25C55 30 50 35 45 35Z" fill="#E0E0E0" opacity="0.3"/>
            <path d="M65 30C60 30 55 25 55 20C55 15 60 10 65 10C70 10 75 15 75 20C75 25 70 30 65 30Z" fill="#E0E0E0" opacity="0.3"/>
          </svg>
        </div>

        {/* Main Content Area */}
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 5
        }}>
          
          {/* A Level Chemistry AQA Section */}
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{
              fontFamily: "'Madimi One', sans-serif",
              fontSize: '18px',
              fontWeight: '400',
              color: '#000000',
              marginBottom: '15px',
              letterSpacing: '0.04em'
            }}>
              A Level Chemistry AQA
            </h3>
            
            <div style={{
              position: 'relative',
              marginBottom: '20px',
              maxWidth: '852px',
              margin: '0 auto 20px'
            }}>
              <div style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #000000',
                borderRadius: '12px',
                padding: '20px',
                position: 'relative'
              }}>
                {/* Pack Content */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}>
                  <div>
                    <h4 style={{
                      fontFamily: "'Madimi One', sans-serif",
                      fontSize: '16px',
                      fontWeight: '400',
                      color: '#000000',
                      margin: '0 0 8px 0'
                    }}>
                      Pack Name
                    </h4>
                    <div style={{
                      display: 'flex',
                      gap: '15px',
                      marginBottom: '8px'
                    }}>
                      <span style={{
                        fontFamily: "'Madimi One', sans-serif",
                        fontSize: '14px',
                        color: '#666666'
                      }}>
                        28 questions
                      </span>
                      <span style={{
                        fontFamily: "'Madimi One', sans-serif",
                        fontSize: '14px',
                        color: '#666666'
                      }}>
                        50 marks
                      </span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="5" r="3" fill="#666666"/>
                        <path d="M12 8C8 8 5 11 5 15V20H19V15C19 11 16 8 12 8Z" fill="#666666"/>
                      </svg>
                      <span style={{
                        fontFamily: "'Madimi One', sans-serif",
                        fontSize: '14px',
                        color: '#666666'
                      }}>
                        X times assigned
                      </span>
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    alignItems: 'flex-end'
                  }}>
                    <button style={{
                      backgroundColor: '#5DD4DC',
                      border: '2px solid #000000',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      fontFamily: "'Madimi One', sans-serif",
                      fontSize: '14px',
                      color: '#000000',
                      cursor: 'pointer',
                      boxShadow: '0 2px 0 #000000'
                    }}>
                      Assign pack
                    </button>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px'
                      }}>
                        <span style={{
                          fontFamily: "'Madimi One', sans-serif",
                          fontSize: '12px',
                          color: '#0066CC',
                          textDecoration: 'underline'
                        }}>
                          view all history →
                        </span>
                      </button>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px'
                      }}>
                        <span style={{
                          fontFamily: "'Madimi One', sans-serif",
                          fontSize: '12px',
                          color: '#5DD4DC'
                        }}>
                          Share question pack
                        </span>
                      </button>
                      <button style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px'
                      }}>
                        <span style={{
                          fontFamily: "'Madimi One', sans-serif",
                          fontSize: '12px',
                          color: '#5DD4DC'
                        }}>
                          Send pack to a friend
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* A Level Biology AQA Section */}
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{
              fontFamily: "'Madimi One', sans-serif",
              fontSize: '18px',
              fontWeight: '400',
              color: '#000000',
              marginBottom: '15px',
              letterSpacing: '0.04em'
            }}>
              A Level Biology AQA
            </h3>
            
            <div style={{
              position: 'relative',
              marginBottom: '20px',
              maxWidth: '852px',
              margin: '0 auto'
            }}>
              <div style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #000000',
                borderRadius: '12px',
                padding: '40px',
                minHeight: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#999999',
                fontSize: '16px',
                fontFamily: "'Madimi One', sans-serif"
              }}>
                No question packs yet
              </div>
            </div>
          </div>
          
        </div>
      </div>
      
    </div>
  );
}