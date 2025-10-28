'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getUserPracticePacks } from '../../lib/supabaseQuestionPacks';
import { getAllSubjects, getAvailableSubjects } from '../../lib/subjectConfig';
import './practice.css';

/**
 * MAIN PRACTICE PAGE - Question Pack Management
 * 
 * This is the STANDALONE practice page (/practice) that handles:
 * - Managing user's custom question packs
 * - Browsing practice packs by subject (TSA, A Level subjects)
 * - Launching practice sessions (/practice-session/[packId])
 * - Launching review sessions (/review/[packId]) 
 * - Creating new practice packs (/create-practice-pack)
 * 
 * This is DIFFERENT from the "Lesson Practice" tab in /learn-lesson:
 * - /learn-lesson practice tab = practice questions embedded within lessons
 * - /practice page = standalone practice sessions with custom question packs
 */
export default function PracticePage() {
  const [activeTab, setActiveTab] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedAdmissionSubject, setSelectedAdmissionSubject] = useState('');
  const [showALevelDropdown, setShowALevelDropdown] = useState(false);
  const [showAdmissionDropdown, setShowAdmissionDropdown] = useState(false);
  const [questionPacks, setQuestionPacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Available subjects for admissions dropdown
  const availableSubjects = getAvailableSubjects(); // This will include TSA
  const allSubjects = getAllSubjects(); // For A Level dropdown

  // Fetch question packs from Supabase
  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const result = await getUserPracticePacks() as { success: boolean; packs?: any[]; error?: string };
        if (result.success) {
          setQuestionPacks(result.packs || [] as any[]);
        } else {
          console.error('Failed to fetch packs:', result.error);
          setQuestionPacks([] as any[]);
        }
      } catch (error) {
        console.error('Error fetching packs:', error);
        setQuestionPacks([] as any[]);
      } finally {
        setLoading(false);
      }
    };

    fetchPacks();
  }, []);

  // Filter packs by category
  const getPacksByCategory = (category: string, subject?: string) => {
    return questionPacks.filter(pack => {
      if (category === 'A Level') {
        return subject ? pack.subject === subject : false;
      } else if (category === 'Admissions') {
        return availableSubjects.includes(pack.subject || '');
      } else if (category === 'Saved') {
        // For now, show all packs as saved - this can be enhanced with favorites functionality
        return true;
      }
      return false;
    });
  };

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
        {/* Main Content */}
        <div style={{ 
          padding: '60px',
          position: 'relative',
          paddingBottom: '200px'
        }}>
        
        {/* Your Practice Packs Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <div style={{
            display: 'inline-block',
            textAlign: 'left',
            position: 'relative'
          }}>
            <h2 style={{
              fontFamily: "'Madimi One', sans-serif",
              fontSize: '28px',
              fontWeight: '400',
              color: '#000000',
              margin: '0 0 20px 0'
            }}>
              Your Practice Packs
            </h2>
          </div>
        </div>

        {/* Practice Icon - Bottom Left */}
        <div style={{
          position: 'fixed',
          left: '80px',
          bottom: '80px',
          zIndex: 50
        }}>
          <Image 
            src="/icons/practice.svg"
            alt="PRACTICE"
            width={138}
            height={138}
          />
        </div>

        {/* New Pack Button - Right Side */}
        <div style={{
          position: 'fixed',
          right: '80px',
          bottom: '80px',
          zIndex: 100
        }}>
          <button style={{
            backgroundColor: '#B3F0F2',
            border: '1px solid #000000',
            borderRadius: '4px',
            padding: '12px 20px',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.25)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '16px',
            fontFamily: "'Madimi One', sans-serif",
            fontWeight: '400',
            color: '#000000',
            letterSpacing: '0.04em'
          }}
          onClick={() => window.location.href = '/create-practice-pack'}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0px)';
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.4)';
          }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>+</span>
            New Pack
          </button>
        </div>

        {/* Cloud Decorations */}
        <div style={{
          position: 'absolute',
          left: '5%',
          top: '10%',
          zIndex: 10,
          opacity: 0.7
        }}>
          <Image 
            src="/svg/island-cloud-medium.svg"
            alt="Cloud"
            width={120}
            height={80}
          />
        </div>
        
        <div style={{
          position: 'absolute',
          right: '5%',
          top: '15%',
          zIndex: 10,
          opacity: 0.7
        }}>
          <Image 
            src="/svg/island-cloud-medium.svg"
            alt="Cloud"
            width={120}
            height={80}
          />
        </div>

        {/* Search Bar */}
        <div style={{
          maxWidth: '852px',
          margin: '0 auto 20px auto',
          position: 'relative',
          zIndex: 5
        }}>
          <input
            type="text"
            placeholder="Search for practice packs by name ..."
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #000000',
              borderRadius: '0px',
              backgroundColor: '#FFFFFF',
              fontSize: '14px',
              fontFamily: "'Figtree', sans-serif",
              letterSpacing: '0.04em',
              color: '#000000',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.currentTarget.style.border = '2px solid #000000';
            }}
            onBlur={(e) => {
              e.currentTarget.style.border = '1px solid #000000';
            }}
          />
        </div>

        {/* Tabs */}
        <div style={{
          maxWidth: '852px',
          margin: '0 auto 40px auto',
          position: 'relative',
          zIndex: 1000
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '10px',
            width: '100%'
          }}>
            {/* A Level Tab with Dropdown */}
            <div 
              style={{
                position: 'relative',
                flex: '1'
              }}
              onMouseEnter={() => setShowALevelDropdown(true)}
              onMouseLeave={() => setShowALevelDropdown(false)}
            >
              <button 
                style={{
                  width: '100%',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: activeTab === 'A Level' ? '#B3F0F2' : '#FFFFFF',
                  border: '1px solid #000000',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontFamily: "'Madimi One', sans-serif",
                  fontSize: '14px',
                  fontWeight: '400',
                  color: '#000000',
                  letterSpacing: '0.04em',
                  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.4)',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.4)';
                }}
                onClick={() => setActiveTab('A Level')}
                aria-label="A Level tab"
              >
                <span>A Level</span>
              </button>
              
              {/* A Level Dropdown */}
              {showALevelDropdown && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% - 5px)',
                  left: '0',
                  right: '0',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #000000',
                  borderRadius: '0px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  zIndex: 9999
                }}>
                  {['Maths', 'Physics', 'English Lit', 'Biology', 'Chemistry'].map((subject) => (
                    <button
                      key={subject}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '8px 12px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: '14px',
                        color: '#000000',
                        letterSpacing: '0.04em'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#B3F0F2';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      onClick={() => {
                        setSelectedSubject(subject);
                        setActiveTab('A Level');
                        setShowALevelDropdown(false);
                      }}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Admissions Tab with Dropdown */}
            <div 
              style={{
                position: 'relative',
                flex: '1'
              }}
              onMouseEnter={() => setShowAdmissionDropdown(true)}
              onMouseLeave={() => setShowAdmissionDropdown(false)}
            >
              <button 
                style={{
                  width: '100%',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: activeTab === 'Admissions' ? '#B3F0F2' : '#FFFFFF',
                  border: '1px solid #000000',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontFamily: "'Madimi One', sans-serif",
                  fontSize: '14px',
                  fontWeight: '400',
                  color: '#000000',
                  letterSpacing: '0.04em',
                  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.4)',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.4)';
                }}
                onClick={() => setActiveTab('Admissions')}
                aria-label="Admissions tab"
              >
                <span>Admissions</span>
              </button>
              
              {/* Admissions Dropdown */}
              {showAdmissionDropdown && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% - 5px)',
                  left: '0',
                  right: '0',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #000000',
                  borderRadius: '0px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  zIndex: 9999
                }}>
                  {availableSubjects.map((subject) => (
                    <button
                      key={subject}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '8px 12px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: '14px',
                        color: '#000000',
                        letterSpacing: '0.04em'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#B3F0F2';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      onClick={() => {
                        setSelectedAdmissionSubject(subject);
                        setActiveTab('Admissions');
                        setShowAdmissionDropdown(false);
                      }}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Saved Tab */}
            <button 
              style={{
                flex: '1',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backgroundColor: activeTab === 'Saved' ? '#B3F0F2' : '#FFFFFF',
                border: '1px solid #000000',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: "'Figtree', sans-serif",
                fontSize: '14px',
                fontWeight: '500',
                color: '#000000',
                letterSpacing: '0.04em',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.25)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.25)';
              }}
              onClick={() => setActiveTab('Saved')}
              aria-label="Saved tab"
            >
              <span>Saved</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 5
        }}>
          

          {/* Dynamic Content Based on Selected Tab and Subject */}
          {activeTab === 'A Level' && selectedSubject && (
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{
                fontFamily: "'Madimi One', sans-serif",
                fontSize: '18px',
                fontWeight: '400',
                color: '#000000',
                marginBottom: '15px',
                letterSpacing: '0.04em'
              }}>
                A Level {selectedSubject} AQA
              </h3>
            
            {/* Question Packs List */}
            {getPacksByCategory('A Level', selectedSubject).map((pack) => (
              <div key={pack.id} style={{
                position: 'relative',
                marginBottom: '60px'
              }}>
                {/* Share and Send options above each pack */}
                <div style={{
                  position: 'absolute',
                  top: '-40px',
                  right: '15px',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '10px',
                  alignItems: 'center',
                  zIndex: 10
                }}>
                  <Image 
                    src="/icons/share-question-pack.svg"
                    alt="Share question pack"
                    width={20}
                    height={20}
                    style={{
                      cursor: 'pointer',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                  <Image 
                    src="/icons/send-pack-to-friend.svg"
                    alt="Send pack to a friend"
                    width={20}
                    height={20}
                    style={{
                      cursor: 'pointer',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                </div>

                {/* Question Pack Rectangle */}
                <div style={{
                  position: 'relative',
                  height: '207px',
                  maxWidth: '852px',
                  margin: '0 auto'
                }}>
                  <svg width="852" height="207" viewBox="0 0 852 207" xmlns="http://www.w3.org/2000/svg" style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}>
                    {/* Fill shapes without strokes */}
                    <polygon points="3,13 829,13 829,194 3,194" fill="#FFFFFF"/>
                    <polygon points="3,13 15,3 841,3 829,13" fill="#FFFFFF"/>
                    <polygon points="829,13 841,3 841,182 829,194" fill="#FFFFFF"/>
                    
                    {/* Clean outline strokes */}
                    {/* Outer perimeter */}
                    <path d="M 3,194 L 3,13 L 15,3 L 841,3 L 841,182 L 829,194 Z" 
                          fill="none" stroke="#000000" strokeWidth="2"/>
                    {/* Internal division lines */}
                    <line x1="3" y1="13" x2="829" y2="13" stroke="#000000" strokeWidth="2"/>
                    <line x1="829" y1="13" x2="829" y2="194" stroke="#000000" strokeWidth="2"/>
                    <line x1="829" y1="13" x2="841" y2="3" stroke="#000000" strokeWidth="2"/>
                  </svg>
                  <div style={{
                    position: 'relative',
                    zIndex: 2,
                    height: '100%',
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{
                        fontFamily: "'Madimi One', sans-serif",
                        fontSize: '16px',
                        color: '#000000',
                        marginBottom: '8px'
                      }}>
                        {pack.name}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#666',
                        marginBottom: '12px'
                      }}>
                        {pack.subject} • Created {new Date(pack.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    {/* Practice/Review Mode Buttons */}
                    <div style={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center'
                    }}>
                      <Link 
                        href={`/view-pack/${pack.id}`}
                        style={{
                          backgroundColor: '#4CAF50',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          textDecoration: 'none',
                          fontSize: '12px',
                          fontWeight: '600',
                          transition: 'background-color 0.3s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#45a049';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#4CAF50';
                        }}
                      >
                        📖 VIEW
                      </Link>
                      
                      <Link 
                        href={`/practice-session/${pack.id}`}
                        style={{
                          backgroundColor: '#2196F3',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          textDecoration: 'none',
                          fontSize: '12px',
                          fontWeight: '600',
                          transition: 'background-color 0.3s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#1976D2';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#2196F3';
                        }}
                      >
                        🎯 PRACTICE
                      </Link>
                      
                      <Link 
                        href={`/review/${pack.id}`}
                        style={{
                          backgroundColor: '#9C27B0',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          textDecoration: 'none',
                          fontSize: '12px',
                          fontWeight: '600',
                          transition: 'background-color 0.3s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#7B1FA2';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#9C27B0';
                        }}
                      >
                        📝 REVIEW
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}

          {/* Admissions Content */}
          {activeTab === 'Admissions' && selectedAdmissionSubject && (
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{
                fontFamily: "'Madimi One', sans-serif",
                fontSize: '18px',
                fontWeight: '400',
                color: '#000000',
                marginBottom: '15px',
                letterSpacing: '0.04em'
              }}>
                {selectedAdmissionSubject} Practice Packs
              </h3>
            
            {/* Real Question Packs List */}
            {getPacksByCategory('Admissions').filter(pack => pack.subject === selectedAdmissionSubject).map((pack) => (
              <div key={pack.id} style={{
                position: 'relative',
                marginBottom: '60px'
              }}>
                {/* Share and Send options above each pack */}
                <div style={{
                  position: 'absolute',
                  top: '-40px',
                  right: '15px',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '10px',
                  alignItems: 'center',
                  zIndex: 10
                }}>
                  <Image 
                    src="/icons/share-question-pack.svg"
                    alt="Share question pack"
                    width={20}
                    height={20}
                    style={{
                      cursor: 'pointer',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                  <Image 
                    src="/icons/send-pack-to-friend.svg"
                    alt="Send pack to a friend"
                    width={20}
                    height={20}
                    style={{
                      cursor: 'pointer',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                </div>

                {/* Question Pack Rectangle */}
                <div style={{
                  position: 'relative',
                  height: '207px',
                  maxWidth: '852px',
                  margin: '0 auto'
                }}>
                  <svg width="852" height="207" viewBox="0 0 852 207" xmlns="http://www.w3.org/2000/svg" style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}>
                    {/* Fill shapes without strokes */}
                    <polygon points="3,13 829,13 829,194 3,194" fill="#FFFFFF"/>
                    <polygon points="3,13 15,3 841,3 829,13" fill="#FFFFFF"/>
                    <polygon points="829,13 841,3 841,182 829,194" fill="#FFFFFF"/>
                    
                    {/* Clean outline strokes */}
                    {/* Outer perimeter */}
                    <path d="M 3,194 L 3,13 L 15,3 L 841,3 L 841,182 L 829,194 Z" 
                          fill="none" stroke="#000000" strokeWidth="2"/>
                    {/* Internal division lines */}
                    <line x1="3" y1="13" x2="829" y2="13" stroke="#000000" strokeWidth="2"/>
                    <line x1="829" y1="13" x2="829" y2="194" stroke="#000000" strokeWidth="2"/>
                    <line x1="829" y1="13" x2="841" y2="3" stroke="#000000" strokeWidth="2"/>
                  </svg>
                  <div style={{
                    position: 'relative',
                    zIndex: 2,
                    height: '100%',
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{
                        fontFamily: "'Madimi One', sans-serif",
                        fontSize: '16px',
                        color: '#000000',
                        marginBottom: '8px'
                      }}>
                        {pack.name}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#666',
                        marginBottom: '12px'
                      }}>
                        {pack.subject} • Created {new Date(pack.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    {/* Practice/Review Mode Buttons */}
                    <div style={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center'
                    }}>
                      <Link 
                        href={`/view-pack/${pack.id}`}
                        style={{
                          backgroundColor: '#4CAF50',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          textDecoration: 'none',
                          fontSize: '12px',
                          fontWeight: '600',
                          transition: 'background-color 0.3s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#45a049';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#4CAF50';
                        }}
                      >
                        📖 VIEW
                      </Link>
                      
                      <Link 
                        href={`/practice-session/${pack.id}`}
                        style={{
                          backgroundColor: '#2196F3',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          textDecoration: 'none',
                          fontSize: '12px',
                          fontWeight: '600',
                          transition: 'background-color 0.3s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#1976D2';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#2196F3';
                        }}
                      >
                        🎯 PRACTICE
                      </Link>
                      
                      <Link 
                        href={`/review/${pack.id}`}
                        style={{
                          backgroundColor: '#9C27B0',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          textDecoration: 'none',
                          fontSize: '12px',
                          fontWeight: '600',
                          transition: 'background-color 0.3s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#7B1FA2';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#9C27B0';
                        }}
                      >
                        📝 REVIEW
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}

          {/* Saved Content */}
          {activeTab === 'Saved' && (
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{
                fontFamily: "'Madimi One', sans-serif",
                fontSize: '18px',
                fontWeight: '400',
                color: '#000000',
                marginBottom: '15px',
                letterSpacing: '0.04em'
              }}>
                All Practice Packs
              </h3>
              
              {/* Loading State */}
              {loading ? (
                <div style={{
                  textAlign: 'center',
                  padding: '60px',
                  color: '#666',
                  fontSize: '16px'
                }}>
                  Loading your practice packs...
                </div>
              ) : (
                <>
                  {/* All Packs List */}
                  {questionPacks.map((pack) => (
                <div key={pack.id} style={{
                  position: 'relative',
                  marginBottom: '60px'
                }}>
                  {/* Share and Send options above each pack */}
                  <div style={{
                    position: 'absolute',
                    top: '-40px',
                    right: '15px',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '10px',
                    alignItems: 'center',
                    zIndex: 10
                  }}>
                    <Image 
                      src="/icons/share-question-pack.svg"
                      alt="Share question pack"
                      width={20}
                      height={20}
                      style={{
                        cursor: 'pointer',
                        transition: 'transform 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />
                    <Image 
                      src="/icons/send-pack-to-friend.svg"
                      alt="Send pack to a friend"
                      width={20}
                      height={20}
                      style={{
                        cursor: 'pointer',
                        transition: 'transform 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />
                  </div>

                  {/* Question Pack Rectangle */}
                  <div style={{
                    position: 'relative',
                    height: '207px',
                    maxWidth: '852px',
                    margin: '0 auto'
                  }}>
                    <svg width="852" height="207" viewBox="0 0 852 207" xmlns="http://www.w3.org/2000/svg" style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}>
                      {/* Fill shapes without strokes */}
                      <polygon points="3,13 829,13 829,194 3,194" fill="#FFFFFF"/>
                      <polygon points="3,13 15,3 841,3 829,13" fill="#FFFFFF"/>
                      <polygon points="829,13 841,3 841,182 829,194" fill="#FFFFFF"/>
                      
                      {/* Clean outline strokes */}
                      {/* Outer perimeter */}
                      <path d="M 3,194 L 3,13 L 15,3 L 841,3 L 841,182 L 829,194 Z" 
                            fill="none" stroke="#000000" strokeWidth="2"/>
                      {/* Internal division lines */}
                      <line x1="3" y1="13" x2="829" y2="13" stroke="#000000" strokeWidth="2"/>
                      <line x1="829" y1="13" x2="829" y2="194" stroke="#000000" strokeWidth="2"/>
                      <line x1="829" y1="13" x2="841" y2="3" stroke="#000000" strokeWidth="2"/>
                    </svg>
                    <div style={{
                      position: 'relative',
                      zIndex: 2,
                      height: '100%',
                      padding: '20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{
                          fontFamily: "'Madimi One', sans-serif",
                          fontSize: '16px',
                          color: '#000000',
                          marginBottom: '8px'
                        }}>
                          {pack.name}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#666',
                          marginBottom: '12px'
                        }}>
                          {pack.subject} • Created {new Date(pack.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      
                      {/* Practice/Review Mode Buttons */}
                      <div style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'center'
                      }}>
                        <Link 
                          href={`/view-pack/${pack.id}`}
                          style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            fontSize: '12px',
                            fontWeight: '600',
                            transition: 'background-color 0.3s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#45a049';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#4CAF50';
                          }}
                        >
                          📖 VIEW
                        </Link>
                        
                        <Link 
                          href={`/practice-session/${pack.id}`}
                          style={{
                            backgroundColor: '#2196F3',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            fontSize: '12px',
                            fontWeight: '600',
                            transition: 'background-color 0.3s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#1976D2';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#2196F3';
                          }}
                        >
                          🎯 PRACTICE
                        </Link>
                        
                        <Link 
                          href={`/review/${pack.id}`}
                          style={{
                            backgroundColor: '#9C27B0',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            fontSize: '12px',
                            fontWeight: '600',
                            transition: 'background-color 0.3s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#7B1FA2';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#9C27B0';
                          }}
                        >
                          📝 REVIEW
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
                </>
              )}
            </div>
          )}

          {/* Default messages when no subject is selected */}
          {activeTab === 'A Level' && !selectedSubject && (
            <div style={{
              textAlign: 'center',
              padding: '60px',
              color: '#999999',
              fontSize: '18px',
              fontFamily: "'Madimi One', sans-serif"
            }}>
              Hover over A Level to select a subject
            </div>
          )}
          
          {activeTab === 'Admissions' && !selectedAdmissionSubject && (
            <div style={{
              textAlign: 'center',
              padding: '60px',
              color: '#999999',
              fontSize: '18px',
              fontFamily: "'Madimi One', sans-serif"
            }}>
              Hover over Admissions to select a subject (TSA available)
            </div>
          )}
          
        </div>
        </div>
      </div>
      
    </div>
  );
}