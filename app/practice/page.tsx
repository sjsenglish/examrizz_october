'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './practice.css';

export default function PracticePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('A Level');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showALevelDropdown, setShowALevelDropdown] = useState(false);

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
    <div className="page-background">
      <nav className="navbar">
        <Link href="/" style={{ textDecoration: 'none' }}>
          <h1>examrizzsearch</h1>
        </Link>
        <button className="hamburger-button">
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
        </button>
      </nav>

      <div className="content-with-navbar-padding">
        <div className="main-content">
          <div className="page-header">
            <div className="header-container">
              <h2 className="page-title">Your Question Packs</h2>
            </div>
          </div>

          <div className="practice-icon">
            <Image 
              src="/icons/practice.svg"
              alt="PRACTICE"
              width={92}
              height={92}
            />
          </div>

          <div className="new-pack-button-container">
            <Link href="/create-question-pack">
              <button className="new-pack-button">
                <span className="new-pack-button-text">+</span>
                New Pack
              </button>
            </Link>
          </div>

          <div className="cloud-decoration-left">
            <Image 
              src="/svg/island-cloud-medium.svg"
              alt="Cloud"
              width={120}
              height={80}
            />
          </div>

          <div className="cloud-decoration-right">
            <Image 
              src="/svg/island-cloud-medium.svg"
              alt="Cloud"
              width={120}
              height={80}
            />
          </div>

          <div className="search-bar-container">
            <input
              type="text"
              placeholder="Search for your question packs by subject, level, exam board..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="tabs-container">
            <div className="tabs-flex">
              <div 
                className="tab-with-dropdown"
                onMouseEnter={() => setShowALevelDropdown(true)}
                onMouseLeave={() => setShowALevelDropdown(false)}
              >
                <button 
                  className={`tab-button ${activeTab === 'A Level' ? 'active' : 'inactive'}`}
                  onClick={() => setActiveTab('A Level')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 7L12 12L3 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  A Level
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {showALevelDropdown && (
                  <div className="dropdown-menu">
                    {['Maths', 'Physics', 'Economics', 'Biology', 'Chemistry'].map((subject) => (
                      <button
                        key={subject}
                        className="dropdown-item"
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

              <button 
                className={`tab-button-regular ${activeTab === 'Admissions' ? 'active' : 'inactive'}`}
                onClick={() => setActiveTab('Admissions')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Admissions
              </button>

              <button 
                className={`tab-button-regular ${activeTab === 'Saved' ? 'active' : 'inactive'}`}
                onClick={() => setActiveTab('Saved')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Saved
              </button>
            </div>
          </div>

          <div className="main-content-area">
            {activeTab === 'A Level' && selectedSubject && (
              <div>
                <h3 className="section-title">A Level {selectedSubject} AQA</h3>
                {questionPacks.filter(pack => pack.subject === selectedSubject).map((pack) => (
                  <div key={pack.id} className="pack-item">
                    <div className="pack-actions">
                      <Image 
                        src="/icons/share-question-pack.svg"
                        alt="Share"
                        width={20}
                        height={20}
                        className="pack-action-icon"
                      />
                      <Image 
                        src="/icons/send-pack-to-friend.svg"
                        alt="Send"
                        width={20}
                        height={20}
                        className="pack-action-icon"
                      />
                    </div>

                    <div className="pack-rectangle">
                      <svg className="pack-svg" width="852" height="207" viewBox="0 0 852 207" xmlns="http://www.w3.org/2000/svg">
                        <polygon points="3,13 829,13 829,194 3,194" fill="#FFFFFF"/>
                        <polygon points="3,13 15,3 841,3 829,13" fill="#FFFFFF"/>
                        <polygon points="829,13 841,3 841,182 829,194" fill="#FFFFFF"/>
                        <path d="M 3,194 L 3,13 L 15,3 L 841,3 L 841,182 L 829,194 Z" 
                              fill="none" stroke="#000000" strokeWidth="2"/>
                        <line x1="3" y1="13" x2="829" y2="13" stroke="#000000" strokeWidth="2"/>
                        <line x1="829" y1="13" x2="829" y2="194" stroke="#000000" strokeWidth="2"/>
                        <line x1="829" y1="13" x2="841" y2="3" stroke="#000000" strokeWidth="2"/>
                      </svg>
                      <div className="pack-content">
                        <div className="pack-title">
                          {pack.title}
                          {pack.completed && (
                            <span className="completed-badge">Completed</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Admissions' && (
              <div>
                <h3 className="section-title">Admissions Question Packs</h3>
                {admissionPacks.map((pack) => (
                  <div key={pack.id} className="pack-item">
                    <div className="pack-actions">
                      <Image 
                        src="/icons/share-question-pack.svg"
                        alt="Share"
                        width={20}
                        height={20}
                        className="pack-action-icon"
                      />
                      <Image 
                        src="/icons/send-pack-to-friend.svg"
                        alt="Send"
                        width={20}
                        height={20}
                        className="pack-action-icon"
                      />
                    </div>

                    <div className="pack-rectangle">
                      <svg className="pack-svg" width="852" height="207" viewBox="0 0 852 207" xmlns="http://www.w3.org/2000/svg">
                        <polygon points="3,13 829,13 829,194 3,194" fill="#FFFFFF"/>
                        <polygon points="3,13 15,3 841,3 829,13" fill="#FFFFFF"/>
                        <polygon points="829,13 841,3 841,182 829,194" fill="#FFFFFF"/>
                        <path d="M 3,194 L 3,13 L 15,3 L 841,3 L 841,182 L 829,194 Z" 
                              fill="none" stroke="#000000" strokeWidth="2"/>
                        <line x1="3" y1="13" x2="829" y2="13" stroke="#000000" strokeWidth="2"/>
                        <line x1="829" y1="13" x2="829" y2="194" stroke="#000000" strokeWidth="2"/>
                        <line x1="829" y1="13" x2="841" y2="3" stroke="#000000" strokeWidth="2"/>
                      </svg>
                      <div className="pack-content">
                        <div className="pack-title">
                          {pack.title}
                          <div className="pack-category">{pack.category}</div>
                          {pack.completed && (
                            <span className="completed-badge">Completed</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Saved' && (
              <div>
                <h3 className="section-title">Saved Question Packs</h3>
                {savedPacks.map((pack) => (
                  <div key={pack.id} className="pack-item">
                    <div className="pack-actions">
                      <Image 
                        src="/icons/share-question-pack.svg"
                        alt="Share"
                        width={20}
                        height={20}
                        className="pack-action-icon"
                      />
                      <Image 
                        src="/icons/send-pack-to-friend.svg"
                        alt="Send"
                        width={20}
                        height={20}
                        className="pack-action-icon"
                      />
                    </div>

                    <div className="pack-rectangle">
                      <svg className="pack-svg" width="852" height="207" viewBox="0 0 852 207" xmlns="http://www.w3.org/2000/svg">
                        <polygon points="3,13 829,13 829,194 3,194" fill="#FFFFFF"/>
                        <polygon points="3,13 15,3 841,3 829,13" fill="#FFFFFF"/>
                        <polygon points="829,13 841,3 841,182 829,194" fill="#FFFFFF"/>
                        <path d="M 3,194 L 3,13 L 15,3 L 841,3 L 841,182 L 829,194 Z" 
                              fill="none" stroke="#000000" strokeWidth="2"/>
                        <line x1="3" y1="13" x2="829" y2="13" stroke="#000000" strokeWidth="2"/>
                        <line x1="829" y1="13" x2="829" y2="194" stroke="#000000" strokeWidth="2"/>
                        <line x1="829" y1="13" x2="841" y2="3" stroke="#000000" strokeWidth="2"/>
                      </svg>
                      <div className="pack-content">
                        <div className="pack-title">
                          {pack.title}
                          <div className="pack-category">{pack.category}</div>
                          {pack.completed && (
                            <span className="completed-badge">Completed</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'A Level' && !selectedSubject && (
              <div className="default-message">
                Hover over A Level to select a subject
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}