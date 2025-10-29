'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { InstantSearch, useSearchBox, Hits, useStats, Configure } from 'react-instantsearch';
import { searchClient, INDEX_NAME } from '../../lib/algolia';
import { SettingsButton } from '../SettingsButton';
import { TabIcon } from '../icons/TabIcon';
import { Button } from '../ui/Button';
import { QuestionCard } from './QuestionCard';
import { FilterBox } from './FilterBox';
import '../../styles/globals.css';
import '../../styles/pages/exam-search.css';
import './ExamSearch.css';

const SearchBar: React.FC = () => {
  const { query, refine } = useSearchBox();
  
  return (
    <input 
      type="text" 
      className="search-bar" 
      placeholder="Search for past exam questions..."
      aria-label="Search questions"
      value={query}
      onChange={(e) => refine(e.target.value)}
    />
  );
};

const ResultsCount: React.FC = () => {
  const { nbHits } = useStats();
  return <span className="results-count">{nbHits.toLocaleString()} results found</span>;
};

const ExamSearch: React.FC = () => {
  const [activeTab, setActiveTab] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedAdmissionsTest, setSelectedAdmissionsTest] = useState('');
  const [showALevelDropdown, setShowALevelDropdown] = useState(false);
  const [showAdmissionsDropdown, setShowAdmissionsDropdown] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  const aLevelSubjects = ['Maths', 'Physics', 'English Lit', 'Biology', 'Chemistry'];
  const admissionsTests = ['BMAT', 'TSA', 'Interview'];

  const showTSAResults = activeTab === 'Admissions' && selectedAdmissionsTest === 'TSA';

  return (
    <InstantSearch 
      searchClient={searchClient} 
      indexName={INDEX_NAME}
      future={{ preserveSharedStateOnUnmount: true }}
    >
      <Configure hitsPerPage={20} />
      <div className="exam-search-wrapper">
        {/* Navbar */}
        <nav className="navbar" style={{
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
              fontSize: '24px', /* Original size - same as island page navbar */
              fontWeight: '400',
              color: '#000000',
              margin: 0,
              cursor: 'pointer'
            }}>examrizzsearch</h1>
          </Link>
          <div style={{ position: 'relative' }}>
            <button 
              className="hamburger-button" 
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <div style={{ width: '20px', height: '2px', backgroundColor: '#000', borderRadius: '1px' }}></div>
              <div style={{ width: '20px', height: '2px', backgroundColor: '#000', borderRadius: '1px' }}></div>
              <div style={{ width: '20px', height: '2px', backgroundColor: '#000', borderRadius: '1px' }}></div>
            </button>
            
            {showDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: '0',
                marginTop: '8px',
                backgroundColor: '#FFFFFF',
                border: '2px solid #000000',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                zIndex: 10000,
                minWidth: '160px',
                padding: '8px 0'
              }}>
                <Link 
                  href="/terms-and-conditions"
                  style={{
                    display: 'block',
                    padding: '12px 20px',
                    color: '#000000',
                    textDecoration: 'none',
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '14px',
                    fontWeight: '500',
                    letterSpacing: '0.04em',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F8F8F5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  onClick={() => setShowDropdown(false)}
                >
                  Terms & Conditions
                </Link>
                <Link 
                  href="/payment"
                  style={{
                    display: 'block',
                    padding: '12px 20px',
                    color: '#000000',
                    textDecoration: 'none',
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '14px',
                    fontWeight: '500',
                    letterSpacing: '0.04em',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F8F8F5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  onClick={() => setShowDropdown(false)}
                >
                  Payment
                </Link>
                <Link 
                  href="/help"
                  style={{
                    display: 'block',
                    padding: '12px 20px',
                    color: '#000000',
                    textDecoration: 'none',
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '14px',
                    fontWeight: '500',
                    letterSpacing: '0.04em',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F8F8F5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  onClick={() => setShowDropdown(false)}
                >
                  Help
                </Link>
              </div>
            )}
          </div>
        </nav>

        <div className="exam-search-container" style={{ 
          paddingTop: '60px', /* 15% less: 80px -> 68px, rounded to 60px for better UX */
          minHeight: '100vh', /* Ensure page takes full height */
          overflow: showTSAResults ? 'auto' : 'hidden' /* Prevent scroll until questions load */
        }}>
        <SettingsButton />
        
        {/* Cloud Icons */}
        <div className="cloud-icons-container">
          <img src="/svg/island-cloud-big.svg" alt="Cloud" className="cloud-icon cloud-left" />
          <img src="/svg/island-cloud-big.svg" alt="Cloud" className="cloud-icon cloud-center" />
          <img src="/svg/island-cloud-big.svg" alt="Cloud" className="cloud-icon cloud-right" />
        </div>
        
        {/* Page Title */}
        <header className="page-title-section">
          <h1 className="page-main-title">examrizzsearch</h1>
        </header>
        
        {/* Search Bar */}
        <section className="search-section">
          <SearchBar />
        </section>

        {/* Tabs */}
        <nav className="tabs-container">
          {/* A Level Tab with Dropdown */}
          <div 
            className="tab-wrapper"
            onMouseEnter={() => setShowALevelDropdown(true)}
            onMouseLeave={() => setShowALevelDropdown(false)}
          >
            <button 
              className={`tab svg-tab ${activeTab === 'A Level' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('A Level')}
              aria-label="A Level tab"
            >
              <Image 
                src="/a-level-box-white.svg" 
                alt="A Level" 
                width={249} 
                height={45}
                className="svg-icon"
              />
            </button>
            
            {/* A Level Dropdown */}
            {showALevelDropdown && (
              <div className="dropdown-menu">
                {aLevelSubjects.map((subject) => (
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
          
          {/* Admissions Tab with Dropdown */}
          <div 
            className="tab-wrapper"
            onMouseEnter={() => setShowAdmissionsDropdown(true)}
            onMouseLeave={() => setShowAdmissionsDropdown(false)}
          >
            <button 
              className={`tab svg-tab ${activeTab === 'Admissions' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('Admissions')}
              aria-label="Admissions tab"
            >
              <Image 
                src="/admissions-box-white.svg" 
                alt="Admissions" 
                width={249} 
                height={45}
                className="svg-icon"
              />
            </button>
            
            {/* Admissions Dropdown */}
            {showAdmissionsDropdown && (
              <div className="dropdown-menu">
                {admissionsTests.map((test) => (
                  <button
                    key={test}
                    className="dropdown-item"
                    onClick={() => {
                      setSelectedAdmissionsTest(test);
                      setActiveTab('Admissions');
                      setShowAdmissionsDropdown(false);
                    }}
                  >
                    {test}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Admissions Filter Box */}
        {showTSAResults && showFilters && (
          <FilterBox onHideFilters={() => setShowFilters(false)} />
        )}

        {/* Results Section */}
        {showTSAResults && (
          <section className="results-section">
            <div className="results-header">
              <ResultsCount />
              {!showFilters && (
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(true)}>
                  show filters
                </Button>
              )}
            </div>

            <Hits hitComponent={({ hit }) => <QuestionCard hit={hit as any} />} />
          </section>
        )}
        </div>
      </div>
    </InstantSearch>
  );
};

export default ExamSearch;