'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SettingsButton } from '../SettingsButton';
import { TabIcon } from '../icons/TabIcon';
import { Button } from '../ui/Button';
import { QuestionCard } from './QuestionCard';
import { FilterBox } from './FilterBox';
import '../../styles/globals.css';
import '../../styles/pages/exam-search.css';
import './ExamSearch.css';

const ExamSearch: React.FC = () => {
  const [activeTab, setActiveTab] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showALevelDropdown, setShowALevelDropdown] = useState(false);

  const aLevelSubjects = ['Maths', 'Physics', 'Economics', 'Biology', 'Chemistry'];


  return (
    <div className="exam-search-wrapper">
      <div className="exam-search-container">
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
          <input 
            type="text" 
            className="search-bar" 
            placeholder="Search for past exam questions..."
            aria-label="Search questions"
          />
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
              className={`tab ${activeTab === 'A Level' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('A Level')}
              aria-label="A Level tab"
            >
              <TabIcon isActive={activeTab === 'A Level'} />
              <span className="tab-text">A Level</span>
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
          
          {/* Admissions Tab */}
          <button 
            className={`tab ${activeTab === 'Admissions' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('Admissions')}
            aria-label="Admissions tab"
          >
            <TabIcon isActive={activeTab === 'Admissions'} />
            <span className="tab-text">Admissions</span>
          </button>
        </nav>

        {/* Admissions Filter Box */}
        {activeTab === 'Admissions' && <FilterBox />}

        {/* Results Section */}
        <section className="results-section">
          <div className="results-header">
            <span className="results-count">346 results found</span>
            <Button variant="ghost" size="sm">show filters</Button>
          </div>

          <QuestionCard />
        </section>
      </div>
    </div>
  );
};

export default ExamSearch;