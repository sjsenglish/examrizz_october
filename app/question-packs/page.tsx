'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { TabIcon } from '@/components/icons/TabIcon';
import '../../styles/globals.css';
import '../../components/ExamSearch/ExamSearch.css';
import '../practice/practice.css';

export default function QuestionPacksPage() {
  const [activeTab, setActiveTab] = useState('Admissions');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showALevelDropdown, setShowALevelDropdown] = useState(false);

  // Mock question packs data
  const questionPacks = [
    { id: 1, title: 'Algebra Foundations', subject: 'Maths', completed: true },
    { id: 2, title: 'Calculus Basics', subject: 'Physics', completed: false },
    { id: 3, title: 'Organic Chemistry', subject: 'Chemistry', completed: true },
    { id: 4, title: 'Quadratic Equations', subject: 'Maths', completed: false },
    { id: 5, title: 'Thermodynamics', subject: 'Physics', completed: true },
    { id: 6, title: 'Molecular Structure', subject: 'Chemistry', completed: false }
  ];

  const admissionPacks = [
    { id: 7, title: 'LNAT Critical Thinking', category: 'Law', completed: true },
    { id: 8, title: 'UCAT Verbal Reasoning', category: 'Medicine', completed: false },
    { id: 9, title: 'Oxford Interview Prep', category: 'General', completed: true },
    { id: 10, title: 'Cambridge Mathematics', category: 'Engineering', completed: false }
  ];

  const savedPacks = [
    { id: 11, title: 'Physics Mechanics Review', category: 'A Level', completed: true },
    { id: 12, title: 'Essay Writing Techniques', category: 'General', completed: false },
    { id: 13, title: 'Statistics Fundamentals', category: 'A Level', completed: true }
  ];

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
            fontFamily: "'Madimi One', cursive",
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
        
        {/* Your Question Packs Header */}
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
              fontFamily: "'Madimi One', cursive",
              fontSize: '28px',
              fontWeight: '400',
              color: '#000000',
              margin: '0 0 20px 0'
            }}>
              Your Question Packs
            </h2>
          </div>
        </div>

        {/* Teacher Icon - Bottom Left */}
        <div style={{
          position: 'fixed',
          left: '80px',
          bottom: '80px',
          zIndex: 50
        }}>
          <Image 
            src="/icons/teacher.svg"
            alt="TEACHER"
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
            borderRadius: '0px',
            padding: '12px 20px',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '16px',
            fontFamily: "'Figtree', sans-serif",
            fontWeight: '500',
            color: '#000000',
            letterSpacing: '0.04em'
          }}
          onClick={() => window.location.href = '/create-question-pack'}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translate(-1px, -1px)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translate(0px, 0px)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
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
            placeholder="Search for question packs by name ..."
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
          zIndex: 5
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
                  border: '2px solid #000000',
                  borderRadius: '0px',
                  cursor: 'pointer',
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#000000',
                  letterSpacing: '0.04em',
                  boxShadow: activeTab === 'A Level' ? '2px 2px 0 #000000' : '2px 2px 0 #CCCCCC'
                }}
                onClick={() => setActiveTab('A Level')}
                aria-label="A Level tab"
              >
                <TabIcon isActive={activeTab === 'A Level'} />
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
                  zIndex: 1000
                }}>
                  {['Maths', 'Physics', 'Economics', 'Biology', 'Chemistry'].map((subject) => (
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
                        e.currentTarget.style.backgroundColor = '#F0F0F0';
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
            
            {/* Admissions Tab */}
            <button 
              style={{
                flex: '1',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backgroundColor: activeTab === 'Admissions' ? '#B3F0F2' : '#FFFFFF',
                border: '2px solid #000000',
                borderRadius: '0px',
                cursor: 'pointer',
                fontFamily: "'Figtree', sans-serif",
                fontSize: '14px',
                fontWeight: '500',
                color: '#000000',
                letterSpacing: '0.04em',
                boxShadow: activeTab === 'Admissions' ? '2px 2px 0 #000000' : '2px 2px 0 #CCCCCC'
              }}
              onClick={() => setActiveTab('Admissions')}
              aria-label="Admissions tab"
            >
              <TabIcon isActive={activeTab === 'Admissions'} />
              <span>Admissions</span>
            </button>
            
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
                border: '2px solid #000000',
                borderRadius: '0px',
                cursor: 'pointer',
                fontFamily: "'Figtree', sans-serif",
                fontSize: '14px',
                fontWeight: '500',
                color: '#000000',
                letterSpacing: '0.04em',
                boxShadow: activeTab === 'Saved' ? '2px 2px 0 #000000' : '2px 2px 0 #CCCCCC'
              }}
              onClick={() => setActiveTab('Saved')}
              aria-label="Saved tab"
            >
              <TabIcon isActive={activeTab === 'Saved'} />
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
            {questionPacks.filter(pack => pack.subject === selectedSubject).map((pack) => (
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
                    alignItems: 'center',
                    justifyContent: 'flex-start'
                  }}>
                    <div style={{
                      fontFamily: "'Madimi One', sans-serif",
                      fontSize: '16px',
                      color: '#000000'
                    }}>
                      {pack.title}
                      {pack.completed && (
                        <div style={{
                          display: 'inline-block',
                          marginLeft: '10px',
                          backgroundColor: '#00CED1',
                          color: '#FFFFFF',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}>
                          Completed
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}

          {/* Admissions Content */}
          {activeTab === 'Admissions' && (
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{
                fontFamily: "'Madimi One', sans-serif",
                fontSize: '18px',
                fontWeight: '400',
                color: '#000000',
                marginBottom: '15px',
                letterSpacing: '0.04em'
              }}>
                Admissions Question Packs
              </h3>
            
            {/* Admission Packs List */}
            {admissionPacks.map((pack) => (
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
                    alignItems: 'center',
                    justifyContent: 'flex-start'
                  }}>
                    <div style={{
                      fontFamily: "'Madimi One', sans-serif",
                      fontSize: '16px',
                      color: '#000000'
                    }}>
                      {pack.title}
                      <div style={{
                        fontSize: '12px',
                        color: '#666',
                        marginTop: '4px'
                      }}>
                        {pack.category}
                      </div>
                      {pack.completed && (
                        <div style={{
                          display: 'inline-block',
                          marginLeft: '10px',
                          backgroundColor: '#00CED1',
                          color: '#FFFFFF',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}>
                          Completed
                        </div>
                      )}
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
                Saved Question Packs
              </h3>
              
              {/* Saved Packs List */}
              {savedPacks.map((pack) => (
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
                      alignItems: 'center',
                      justifyContent: 'flex-start'
                    }}>
                      <div style={{
                        fontFamily: "'Madimi One', sans-serif",
                        fontSize: '16px',
                        color: '#000000'
                      }}>
                        {pack.title}
                        <div style={{
                          fontSize: '12px',
                          color: '#666',
                          marginTop: '4px'
                        }}>
                          {pack.category}
                        </div>
                        {pack.completed && (
                          <div style={{
                            display: 'inline-block',
                            marginLeft: '10px',
                            backgroundColor: '#00CED1',
                            color: '#FFFFFF',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px'
                          }}>
                            Completed
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Default message when no tab is selected */}
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
          
        </div>
        </div>
      </div>
      
    </div>
  );
}