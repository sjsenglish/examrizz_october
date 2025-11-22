'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { getUserPracticePacks } from '../../lib/supabaseQuestionPacks';
import { createClient } from '@supabase/supabase-js';
import './spec-topic.css';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SpecTopicPage() {
  const [activeTab, setActiveTab] = useState('Question Packs');
  const [questionPacks, setQuestionPacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedPackIds, setSavedPackIds] = useState<Set<string>>(new Set());
  const [savingPack, setSavingPack] = useState<string | null>(null);

  // Load saved packs for current user
  const loadSavedPacks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: savedPacks, error } = await (supabase as any)
        .from('saved_question_packs')
        .select('pack_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading saved packs:', error);
        return;
      }

      const savedIds = new Set(savedPacks.map((sp: any) => sp.pack_id));
      setSavedPackIds(savedIds);
    } catch (error) {
      console.error('Error loading saved packs:', error);
    }
  };

  // Toggle save state for a pack
  const toggleSavePack = async (packId: string) => {
    try {
      setSavingPack(packId);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('User not logged in - skipping pack save');
        return;
      }

      const isSaved = savedPackIds.has(packId);

      if (isSaved) {
        const { error } = await (supabase as any)
          .from('saved_question_packs')
          .delete()
          .eq('user_id', user.id)
          .eq('pack_id', packId);

        if (error) {
          console.error('Error unsaving pack:', error);
          alert('Failed to unsave pack');
          return;
        }

        const newSavedIds = new Set(savedPackIds);
        newSavedIds.delete(packId);
        setSavedPackIds(newSavedIds);
      } else {
        const { error } = await (supabase as any)
          .from('saved_question_packs')
          .insert({
            user_id: user.id,
            pack_id: packId
          });

        if (error) {
          console.error('Error saving pack:', error);
          alert('Failed to save pack');
          return;
        }

        const newSavedIds = new Set(savedPackIds);
        newSavedIds.add(packId);
        setSavedPackIds(newSavedIds);
      }
    } catch (error) {
      console.error('Error toggling save state:', error);
      alert('An error occurred');
    } finally {
      setSavingPack(null);
    }
  };

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

        await loadSavedPacks();
      } catch (error) {
        console.error('Error fetching packs:', error);
        setQuestionPacks([] as any[]);
      } finally {
        setLoading(false);
      }
    };

    fetchPacks();
  }, []);

  // Mock question packs for this spec topic (you can replace with real data)
  const mockQuestionPacks = [
    { id: '1', name: 'Differentiating Polynomials', subject: 'Maths', created_at: new Date().toISOString() },
    { id: '2', name: 'Chain Rule Practice', subject: 'Maths', created_at: new Date().toISOString() },
    { id: '3', name: 'Product & Quotient Rules', subject: 'Maths', created_at: new Date().toISOString() },
    { id: '4', name: 'Implicit Differentiation', subject: 'Maths', created_at: new Date().toISOString() },
    { id: '5', name: 'Applications of Differentiation', subject: 'Maths', created_at: new Date().toISOString() }
  ];

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', paddingTop: '60px' }}>
      <Navbar />

      {/* Back Button */}
      <Link
        href="/maths-demo"
        style={{
          position: 'absolute',
          top: '90px',
          left: '45px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '9px 18px',
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          textDecoration: 'none',
          color: '#333333',
          fontFamily: "'Madimi One', cursive",
          fontSize: '13px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          zIndex: 20
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back
      </Link>

      {/* Content */}
      <div>
        {/* Main Content */}
        <div style={{
          padding: '60px',
          position: 'relative',
          paddingBottom: '200px'
        }}>

        {/* Title */}
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
              7.2 Differentiating Functions
            </h2>
          </div>
        </div>

        {/* Cloud Decorations */}
        <div style={{
          position: 'absolute',
          left: '5%',
          top: '3%',
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
          top: '5%',
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
            placeholder="Search for resources ..."
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
            {/* Video Content Tab */}
            <button
              style={{
                flex: '1',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backgroundColor: activeTab === 'Video Content' ? '#B3F0F2' : '#FFFFFF',
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
              onClick={() => setActiveTab('Video Content')}
              aria-label="Video Content tab"
            >
              <span>Video Content</span>
            </button>

            {/* Question Packs Tab */}
            <button
              style={{
                flex: '1',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backgroundColor: activeTab === 'Question Packs' ? '#B3F0F2' : '#FFFFFF',
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
              onClick={() => setActiveTab('Question Packs')}
              aria-label="Question Packs tab"
            >
              <span>Question Packs</span>
            </button>

            {/* Notes Tab */}
            <button
              style={{
                flex: '1',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backgroundColor: activeTab === 'Notes' ? '#B3F0F2' : '#FFFFFF',
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
              onClick={() => setActiveTab('Notes')}
              aria-label="Notes tab"
            >
              <span>Notes</span>
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

          {/* Video Content Tab */}
          {activeTab === 'Video Content' && (
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{
                fontFamily: "'Madimi One', sans-serif",
                fontSize: '18px',
                fontWeight: '400',
                color: '#000000',
                marginBottom: '20px',
                letterSpacing: '0.04em'
              }}>
                Video Lessons
              </h3>

              {/* 3 Video Containers */}
              {[1, 2, 3].map((num) => (
                <div key={num} style={{
                  marginBottom: '30px',
                  border: '2px solid #000000',
                  borderRadius: '8px',
                  padding: '20px',
                  backgroundColor: '#F8F8F8',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{
                    fontFamily: "'Madimi One', sans-serif",
                    fontSize: '16px',
                    color: '#000000',
                    marginBottom: '12px'
                  }}>
                    Video {num}: Lesson Content
                  </div>
                  <div style={{
                    width: '100%',
                    height: '300px',
                    backgroundColor: '#E0E0E0',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'Figtree', sans-serif",
                    color: '#666666'
                  }}>
                    Video player will be embedded here
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Question Packs Tab */}
          {activeTab === 'Question Packs' && (
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{
                fontFamily: "'Madimi One', sans-serif",
                fontSize: '18px',
                fontWeight: '400',
                color: '#000000',
                marginBottom: '15px',
                letterSpacing: '0.04em'
              }}>
                Practice Question Packs
              </h3>

            {/* 5 Question Packs */}
            {mockQuestionPacks.map((pack) => (
              <div key={pack.id} style={{
                position: 'relative',
                marginBottom: '60px'
              }}>
                {/* Share, Send, and Save options above each pack */}
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
                  {/* Bookmark/Save icon */}
                  <div
                    onClick={() => toggleSavePack(pack.id)}
                    style={{
                      cursor: savingPack === pack.id ? 'not-allowed' : 'pointer',
                      transition: 'transform 0.2s',
                      opacity: savingPack === pack.id ? 0.6 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (savingPack !== pack.id) {
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {savedPackIds.has(pack.id) ? (
                      <span style={{ fontSize: '20px', color: '#FFA500' }}>🔖</span>
                    ) : (
                      <span style={{ fontSize: '20px', color: '#CCCCCC' }}>🔖</span>
                    )}
                  </div>
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
                    <div style={{
                      position: 'relative',
                      left: '10px',
                      top: '-5px'
                    }}>
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
                      gap: '8px',
                      alignItems: 'center',
                      position: 'relative',
                      top: '25%',
                      left: '-5%'
                    }}>
                      <Link
                        href={`/view-pack/${pack.id}`}
                        style={{
                          backgroundColor: '#D3F6F7',
                          color: '#000000',
                          border: '1px solid #000000',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          fontSize: '12px',
                          fontFamily: "'Figtree', sans-serif",
                          fontWeight: '500',
                          letterSpacing: '0.04em',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#C1E8EA';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#D3F6F7';
                        }}
                      >
                        View Pack
                      </Link>

                      <Link
                        href={`/practice-session/${pack.id}`}
                        style={{
                          backgroundColor: '#D3F6F7',
                          color: '#000000',
                          border: '1px solid #000000',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          fontSize: '12px',
                          fontFamily: "'Figtree', sans-serif",
                          fontWeight: '500',
                          letterSpacing: '0.04em',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#C1E8EA';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#D3F6F7';
                        }}
                      >
                        Practice
                      </Link>

                      <Link
                        href={`/review/${pack.id}`}
                        style={{
                          backgroundColor: '#D3F6F7',
                          color: '#000000',
                          border: '1px solid #000000',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          fontSize: '12px',
                          fontFamily: "'Figtree', sans-serif",
                          fontWeight: '500',
                          letterSpacing: '0.04em',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#C1E8EA';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#D3F6F7';
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

          {/* Notes Tab */}
          {activeTab === 'Notes' && (
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{
                fontFamily: "'Madimi One', sans-serif",
                fontSize: '18px',
                fontWeight: '400',
                color: '#000000',
                marginBottom: '20px',
                letterSpacing: '0.04em'
              }}>
                Study Notes & PDFs
              </h3>

              {/* 3 PDF Containers */}
              {[1, 2, 3].map((num) => (
                <div key={num} style={{
                  marginBottom: '30px',
                  border: '2px solid #000000',
                  borderRadius: '8px',
                  padding: '20px',
                  backgroundColor: '#FFFEF7',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      fontFamily: "'Madimi One', sans-serif",
                      fontSize: '16px',
                      color: '#000000'
                    }}>
                      Note {num}: Topic Summary
                    </div>
                    <button style={{
                      padding: '6px 12px',
                      backgroundColor: '#B3F0F2',
                      border: '1px solid #000000',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontFamily: "'Figtree', sans-serif",
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      Upload PDF
                    </button>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '200px',
                    backgroundColor: '#F5F5F5',
                    borderRadius: '4px',
                    border: '1px dashed #CCCCCC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'Figtree', sans-serif",
                    color: '#999999',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#999999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14 2V8H20" stroke="#999999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 18V12" stroke="#999999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 15L12 12L15 15" stroke="#999999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div>PDF document will appear here</div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
        </div>
      </div>

    </div>
  );
}
