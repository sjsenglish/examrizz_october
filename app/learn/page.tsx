'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import './learn.css';

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState<'lesson' | 'practice' | 'test'>('lesson');
  const [expandedTopics, setExpandedTopics] = useState<{[key: number]: boolean}>({
    1: true, // Proof topic is expanded by default
  });
  const [videoVisible, setVideoVisible] = useState<{[key: string]: boolean}>({});

  const toggleTopic = (topicId: number) => {
    setExpandedTopics(prev => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  const toggleVideo = (exampleId: string) => {
    setVideoVisible(prev => ({ ...prev, [exampleId]: !prev[exampleId] }));
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#FAFAFA',
      paddingTop: '60px'
    }}>
      <Navbar />

      <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
        {/* Left Sidebar */}
        <div style={{
          width: '320px',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E5E7EB',
          overflowY: 'auto',
          padding: '20px'
        }}>
          {/* Search Bar */}
          <div style={{
            marginBottom: '20px'
          }}>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#F3F4F6',
              borderRadius: '8px',
              padding: '10px 16px'
            }}>
              <input
                type="text"
                placeholder="Search topics..."
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '14px'
                }}
              />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          {/* Course Title */}
          <div style={{
            backgroundColor: '#E0F7FA',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              margin: '0 0 4px 0'
            }}>Edexcel A Level Maths</h3>
            <h4 style={{
              fontSize: '18px',
              fontWeight: '700',
              margin: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              Pure Mathematics
              <span style={{ fontSize: '14px' }}>▼</span>
            </h4>
          </div>

          {/* Topics List */}
          <div>
            {/* Topic 1 - Proof */}
            <div style={{ marginBottom: '12px' }}>
              <div
                onClick={() => toggleTopic(1)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  backgroundColor: '#00CED1',
                  color: 'white',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                <span>1 Proof</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    backgroundColor: 'white',
                    color: '#00CED1',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '700'
                  }}>A*</span>
                  <span>{expandedTopics[1] ? '▼' : '▶'}</span>
                </div>
              </div>
              
              {expandedTopics[1] && (
                <div style={{
                  marginLeft: '20px',
                  marginTop: '8px'
                }}>
                  <div style={{
                    padding: '8px 12px',
                    fontSize: '13px',
                    color: '#374151',
                    backgroundColor: '#F9FAFB',
                    borderRadius: '4px',
                    marginBottom: '4px'
                  }}>
                    <strong>1.1 Mathematical Proof</strong>
                    <span style={{ float: 'right' }}>▼</span>
                  </div>
                  <div style={{
                    marginLeft: '20px',
                    fontSize: '12px',
                    color: '#6B7280'
                  }}>
                    <div style={{ padding: '4px 0' }}>• How to proof by exhaustion</div>
                    <div style={{ padding: '4px 0' }}>• Disproof by counter example counter example</div>
                  </div>
                  <div style={{
                    padding: '8px 12px',
                    fontSize: '13px',
                    color: '#6B7280',
                    cursor: 'pointer'
                  }}>
                    1.1 Mathematical Proof
                    <span style={{ float: 'right' }}>▶</span>
                  </div>
                </div>
              )}
            </div>

            {/* Topic 2 - Algebra and functions */}
            <div style={{ marginBottom: '12px' }}>
              <div
                onClick={() => toggleTopic(2)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  backgroundColor: '#F3F4F6',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                <span>2 Algebra and functions</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    backgroundColor: '#3B82F6',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '700'
                  }}>B</span>
                  <span>▶</span>
                </div>
              </div>
            </div>

            {/* Topics 3-10 */}
            {[
              { num: 3, name: 'Spec topic', grade: 'C' },
              { num: 4, name: 'Spec topic', grade: 'A**' },
              { num: 5, name: 'Spec topic', grade: 'A' },
              { num: 6, name: 'Spec topic', grade: 'A*' },
              { num: 7, name: 'Spec topic', grade: 'B' },
              { num: 8, name: 'Spec topic', grade: 'A' },
              { num: 9, name: 'Spec topic', grade: 'C' },
              { num: 10, name: 'Spec topic', grade: 'B' }
            ].map(topic => (
              <div key={topic.num} style={{ marginBottom: '12px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    backgroundColor: '#F3F4F6',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  <span>{topic.num} {topic.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      backgroundColor: topic.grade.includes('A') ? '#10B981' : topic.grade === 'B' ? '#3B82F6' : '#F59E0B',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '700'
                    }}>{topic.grade}</span>
                    <span>▶</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {/* Top Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '16px',
            marginBottom: '24px'
          }}>
            {/* Working Grade */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '8px' }}>WORKING GRADE</div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#00CED1' }}>A</div>
              <div style={{ fontSize: '11px', color: '#6B7280' }}>Current</div>
              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ flex: 1, height: '4px', backgroundColor: '#E5E7EB', borderRadius: '2px' }}>
                  <div style={{ width: '85%', height: '100%', backgroundColor: '#00CED1', borderRadius: '2px' }}></div>
                </div>
              </div>
              <div style={{ fontSize: '10px', color: '#6B7280', marginTop: '4px' }}>85% to A*</div>
            </div>

            {/* Predicted Grade */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '8px' }}>PREDICTED GRADE</div>
              <div style={{ fontSize: '28px', fontWeight: '700' }}>A/ A*</div>
              <div style={{ fontSize: '11px', color: '#00CED1', display: 'flex', alignItems: 'center', gap: '4px' }}>
                ↗ Trending up
              </div>
              <div style={{ fontSize: '10px', color: '#6B7280', marginTop: '8px' }}>
                Based on<br />current<br />trajectory
              </div>
            </div>

            {/* Learning Streak */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '8px' }}>LEARNING STREAK</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '24px' }}>🔥</span>
                <div>
                  <div style={{ fontSize: '32px', fontWeight: '700' }}>5</div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>DAYS</div>
                </div>
                <div style={{ fontSize: '11px', color: '#6B7280' }}>Keep<br />going!</div>
              </div>
            </div>

            {/* Exam Readiness */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '8px' }}>EXAM READINESS</div>
              <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '8px' }}>Topics</div>
              <div style={{ position: 'relative', marginBottom: '8px' }}>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#E5E7EB', borderRadius: '4px' }}>
                  <div style={{ width: '14%', height: '100%', backgroundColor: '#00CED1', borderRadius: '4px' }}></div>
                </div>
                <div style={{ fontSize: '10px', color: '#6B7280', marginTop: '2px', textAlign: 'right' }}>14/20</div>
              </div>
              <div style={{ fontSize: '11px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                ✓ Exam pace on track
              </div>
            </div>

            {/* Grade Split by Topic */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '8px' }}>GRADE SPLIT BY TOPIC</div>
              <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto' }}>
                <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="20" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#00CED1" strokeWidth="20" 
                    strokeDasharray="251.2" strokeDashoffset="50" />
                </svg>
                <div style={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)',
                  fontSize: '10px',
                  lineHeight: '1.2',
                  textAlign: 'center'
                }}>
                  <div>⭘ A**</div>
                  <div>⭘ A*</div>
                  <div>⭘ A</div>
                  <div>⭘ B</div>
                  <div>● C</div>
                </div>
              </div>
            </div>
          </div>

          {/* Grade Trajectory Chart */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>GRADE TRAJECTORY</div>
              <div style={{ fontSize: '11px', color: '#10B981' }}>+1.5 grades ↗</div>
            </div>
            <div style={{ height: '60px', position: 'relative' }}>
              <svg width="100%" height="100%" viewBox="0 0 400 60">
                <line x1="0" y1="30" x2="400" y2="10" stroke="#00CED1" strokeWidth="2" />
                <circle cx="100" cy="24" r="4" fill="#00CED1" />
                <circle cx="200" cy="20" r="4" fill="#00CED1" />
                <circle cx="300" cy="15" r="4" fill="#00CED1" />
                <circle cx="400" cy="10" r="4" fill="#00CED1" />
              </svg>
              <div style={{ 
                position: 'absolute', 
                bottom: '0', 
                left: '0', 
                right: '0',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '10px',
                color: '#6B7280'
              }}>
                <span>W2</span>
                <span>W3</span>
                <span>W4</span>
                <span>W5</span>
              </div>
            </div>
          </div>

          {/* Weekly Stats */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            display: 'flex',
            gap: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>📊</span>
              <div>
                <div style={{ fontSize: '12px', color: '#6B7280' }}>THIS WEEK</div>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700' }}>47</div>
              <div style={{ fontSize: '11px', color: '#6B7280' }}>Questions</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700' }}>73%</div>
              <div style={{ fontSize: '11px', color: '#6B7280' }}>Accuracy</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700' }}>3h 24m</div>
              <div style={{ fontSize: '11px', color: '#6B7280' }}>Study Time</div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            marginBottom: '24px'
          }}>
            <button
              onClick={() => setActiveTab('lesson')}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: activeTab === 'lesson' ? '#00CED1' : '#F3F4F6',
                color: activeTab === 'lesson' ? 'white' : '#6B7280',
                border: 'none',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                borderRadius: activeTab === 'lesson' ? '8px 0 0 8px' : '0'
              }}
            >
              LESSON
            </button>
            <button
              onClick={() => setActiveTab('practice')}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: activeTab === 'practice' ? '#00CED1' : '#F3F4F6',
                color: activeTab === 'practice' ? 'white' : '#6B7280',
                border: 'none',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              PRACTICE
            </button>
            <button
              onClick={() => setActiveTab('test')}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: activeTab === 'test' ? '#00CED1' : '#F3F4F6',
                color: activeTab === 'test' ? 'white' : '#6B7280',
                border: 'none',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                borderRadius: activeTab === 'test' ? '0 8px 8px 0' : '0'
              }}
            >
              END OF TOPIC TEST
            </button>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'lesson' && (
            <>
              {/* Topic Header */}
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '400', color: '#6B7280', margin: '0 0 8px 0' }}>
                  1 Proof
                </h2>
                <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0' }}>
                  1.1 Mathematical Proof
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0' }}>
                    How to proof by exhaustion
                  </h3>
                  <span style={{
                    backgroundColor: '#10B981',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '700'
                  }}>A*</span>
                </div>
              </div>

              {/* Video Lesson */}
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>Video Lesson</h2>
                <div style={{
                  backgroundColor: '#E5E7EB',
                  borderRadius: '12px',
                  height: '400px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: '600',
                  position: 'relative'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    VIDEO<br />
                    embedded in page
                  </div>
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    backgroundColor: '#00CED1',
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: '20px' }}>▶</span>
                  </div>
                </div>
              </div>

              {/* Explanation */}
              <div style={{ marginBottom: '32px' }}>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#374151' }}>
                  Proof by deduction e.g. using completion of the square, prove that n2 - 6n + 10 is positive for all values of n or, for 
                  example, differentiation from first principles for small positive integer powers of x or proving results for arithmetic and 
                  geometric series. This is the most commonly used method of proof throughout this specification
                </p>
              </div>

              {/* Examples */}
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>Examples</h2>

                {/* Example 1 */}
                <div style={{
                  backgroundColor: '#E0F7FA',
                  borderRadius: '8px',
                  padding: '20px',
                  marginBottom: '16px'
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>Example 1</h3>
                  <p style={{ marginBottom: '16px' }}>Simplify the following: b/q+ k/u</p>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{
                      padding: '8px 20px',
                      border: '2px solid #374151',
                      borderRadius: '6px',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      Worked Solution
                    </button>
                    <button 
                      onClick={() => toggleVideo('example1')}
                      style={{
                        padding: '8px 20px',
                        border: '2px solid #374151',
                        borderRadius: '6px',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}
                    >
                      Question Walkthrough
                    </button>
                  </div>
                </div>

                {/* Example 2 */}
                <div style={{
                  backgroundColor: '#E0F7FA',
                  borderRadius: '8px',
                  padding: '20px',
                  marginBottom: '16px'
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>Example 2</h3>
                  <p style={{ marginBottom: '12px' }}>Simplify the following: b/q+ k/u</p>
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Simplify</p>
                    <p style={{ fontSize: '14px', marginBottom: '16px' }}>
                      Proof by deduction e.g. using completion of the square, prove that n2 - 6n + 10 is positive for all.
                    </p>
                    <div style={{ borderTop: '1px solid #9CA3AF', paddingTop: '16px' }}>
                      <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Apply the idea</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ fontSize: '14px', marginRight: '8px' }}>3y/8 × 4y/9 = 3y × 4y/8 × 9</span>
                        </div>
                        <span style={{ fontSize: '13px', color: '#6B7280' }}>Multiply the numerator</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ fontSize: '14px', marginRight: '8px' }}>= 12y²</span>
                        </div>
                        <span style={{ fontSize: '13px', color: '#6B7280' }}>Multiply the numerator</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{
                      padding: '8px 20px',
                      border: '2px solid #374151',
                      borderRadius: '6px',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      Worked Solution
                    </button>
                    <button style={{
                      padding: '8px 20px',
                      border: '2px solid #374151',
                      borderRadius: '6px',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      Question Walkthrough
                    </button>
                  </div>
                </div>

                {/* Example 3 */}
                <div style={{
                  backgroundColor: '#E0F7FA',
                  borderRadius: '8px',
                  padding: '20px',
                  marginBottom: '16px'
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>Example 3</h3>
                  <p style={{ marginBottom: '16px' }}>Simplify the following: b/q+ k/u</p>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <button style={{
                      padding: '8px 20px',
                      border: '2px solid #374151',
                      borderRadius: '6px',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      Worked Solution
                    </button>
                    <button 
                      onClick={() => toggleVideo('example3')}
                      style={{
                        padding: '8px 20px',
                        border: '2px solid #374151',
                        borderRadius: '6px',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}
                    >
                      Question Walkthrough
                    </button>
                  </div>
                  
                  {videoVisible['example3'] && (
                    <div style={{
                      backgroundColor: '#D1D5DB',
                      borderRadius: '8px',
                      height: '300px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: '600',
                      textAlign: 'center',
                      padding: '20px'
                    }}>
                      VIDEO<br />
                      appears below question<br />
                      walkthrough button when<br />
                      clicked<br />
                      (like a toggle effect)
                    </div>
                  )}
                </div>
              </div>

              {/* Lesson Summary */}
              <div style={{
                backgroundColor: 'white',
                border: '2px solid #E5E7EB',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '32px'
              }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>LESSON SUMMARY</h2>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#374151', marginBottom: '16px' }}>
                  Proof by deduction e.g. using completion of the square, prove that n2 - 6n + 10 is positive for all.Proof by 
                  deduction e.g. using completion of the square, prove that n2 - 6n + 10 is positive for all.Proof by deduction 
                  e.g. using completion of the square, prove that n2 - 6n + 10.
                </p>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  fontSize: '20px',
                  color: '#3B82F6',
                  letterSpacing: '4px'
                }}>
                  <span style={{ marginRight: '16px' }}>A/B</span>
                  <span>÷</span>
                  <span style={{ marginLeft: '16px' }}>C/D</span>
                  <span style={{ margin: '0 16px' }}>=</span>
                  <span style={{ marginRight: '16px' }}>A/B</span>
                  <span>×</span>
                  <span style={{ marginLeft: '16px' }}>D/C</span>
                </div>
              </div>

              {/* Practice Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setActiveTab('practice')}
                  style={{
                    padding: '12px 32px',
                    backgroundColor: '#E0F7FA',
                    color: '#00CED1',
                    border: '2px solid #00CED1',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  PRACTICE
                  <span>▶</span>
                </button>
              </div>
            </>
          )}

          {activeTab === 'practice' && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>Practice Section</h2>
              <p style={{ fontSize: '16px', color: '#6B7280' }}>
                Practice questions and exercises will appear here
              </p>
            </div>
          )}

          {activeTab === 'test' && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>End of Topic Test</h2>
              <p style={{ fontSize: '16px', color: '#6B7280' }}>
                Test questions will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}