'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getUserPracticePacks } from '../../lib/supabaseQuestionPacks';
import { getAllSubjects, getAvailableSubjects } from '../../lib/subjectConfig';

export default function PracticePage() {
  const [activeTab, setActiveTab] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedAdmissionSubject, setSelectedAdmissionSubject] = useState('');
  const [showALevelDropdown, setShowALevelDropdown] = useState(false);
  const [showAdmissionDropdown, setShowAdmissionDropdown] = useState(false);
  const [questionPacks, setQuestionPacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const availableSubjects = getAvailableSubjects();
  const allSubjects = getAllSubjects();

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const result = await getUserPracticePacks() as { success: boolean; packs?: any[]; error?: string };
        if (result.success) {
          setQuestionPacks(result.packs || []);
        } else {
          console.error('Failed to fetch packs:', result.error);
          setQuestionPacks([]);
        }
      } catch (error) {
        console.error('Error fetching packs:', error);
        setQuestionPacks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPacks();
  }, []);

  const getPacksByCategory = (category: string, subject?: string) => {
    return questionPacks.filter(pack => {
      if (category === 'A Level') {
        return subject ? pack.subject === subject : false;
      } else if (category === 'Admissions') {
        return availableSubjects.includes(pack.subject || '');
      } else if (category === 'Saved') {
        return true;
      }
      return false;
    });
  };

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
        
        {/* Your Practice Packs Header */}
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
            Your Practice Packs
          </h2>
          
          {/* Search Bar */}
          <div style={{
            maxWidth: '600px',
            margin: '0 auto 30px',
            position: 'relative'
          }}>
            <input
              type="text"
              placeholder="Search for practice packs by name ..."
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
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '40px'
          }}>
            <button 
              onClick={() => setActiveTab('A Level')}
              style={{
                position: 'relative',
                backgroundColor: activeTab === 'A Level' ? '#B3F0F2' : 'transparent',
                border: '2px solid #000000',
                borderRadius: '8px',
                padding: '12px 24px',
                fontFamily: "'Madimi One', sans-serif",
                fontSize: '16px',
                color: '#000000',
                cursor: 'pointer'
              }}
            >
              A Level
            </button>
            <button 
              onClick={() => setActiveTab('Admissions')}
              style={{
                position: 'relative',
                backgroundColor: activeTab === 'Admissions' ? '#B3F0F2' : 'transparent',
                border: '2px solid #000000',
                borderRadius: '8px',
                padding: '12px 24px',
                fontFamily: "'Madimi One', sans-serif",
                fontSize: '16px',
                color: '#000000',
                cursor: 'pointer'
              }}
            >
              Admissions
            </button>
            <button 
              onClick={() => setActiveTab('Saved')}
              style={{
                position: 'relative',
                backgroundColor: activeTab === 'Saved' ? '#B3F0F2' : 'transparent',
                border: '2px solid #000000',
                borderRadius: '8px',
                padding: '12px 24px',
                fontFamily: "'Madimi One', sans-serif",
                fontSize: '16px',
                color: '#000000',
                cursor: 'pointer'
              }}
            >
              Saved
            </button>
          </div>
        </div>

        {/* Practice Icon - Bottom Left */}
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
            PRACTICE
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
            onClick={() => window.location.href = '/create-practice-pack'}
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
          
          {/* Practice Packs Content */}
          {questionPacks.length > 0 && (
            <div style={{ marginBottom: '40px' }}>
              {questionPacks.map((pack) => (
                <div key={pack.id} style={{
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
                          {pack.name}
                        </h4>
                        <div style={{
                          fontSize: '12px',
                          color: '#666',
                          marginBottom: '12px'
                        }}>
                          {pack.subject} • Created {new Date(pack.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center'
                      }}>
                        <Link 
                          href={`/view-pack/${pack.id}`}
                          style={{
                            backgroundColor: '#D3F6F7',
                            color: '#000000',
                            border: '1px solid #5A51B8',
                            padding: '12px 20px',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontFamily: "'Figtree', sans-serif",
                            fontWeight: '400',
                            letterSpacing: '0.04em',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          View Pack
                        </Link>
                        
                        <Link 
                          href={`/practice-session/${pack.id}`}
                          style={{
                            backgroundColor: '#D3F6F7',
                            color: '#000000',
                            border: '1px solid #5A51B8',
                            padding: '12px 20px',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontFamily: "'Figtree', sans-serif",
                            fontWeight: '400',
                            letterSpacing: '0.04em',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          Practice
                        </Link>
                        
                        <Link 
                          href={`/review/${pack.id}`}
                          style={{
                            backgroundColor: '#D3F6F7',
                            color: '#000000',
                            border: '1px solid #5A51B8',
                            padding: '12px 20px',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontFamily: "'Figtree', sans-serif",
                            fontWeight: '400',
                            letterSpacing: '0.04em',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          Review
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No packs message */}
          {questionPacks.length === 0 && !loading && (
            <div style={{
              textAlign: 'center',
              padding: '60px',
              color: '#999999',
              fontSize: '18px',
              fontFamily: "'Madimi One', sans-serif"
            }}>
              No practice packs yet. Create your first pack!
            </div>
          )}

          {/* Loading message */}
          {loading && (
            <div style={{
              textAlign: 'center',
              padding: '60px',
              color: '#999999',
              fontSize: '18px',
              fontFamily: "'Madimi One', sans-serif"
            }}>
              Loading your practice packs...
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}