'use client';

import React, { useState } from 'react';
import './SettingsModal.css';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [landingPage, setLandingPage] = useState<'Island' | 'Search'>('Island');
  const [siteMode, setSiteMode] = useState<'Light' | 'Ambient' | 'Dark'>('Light');

  if (!isOpen) return null;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Landing Page</h2>
        </div>
        
        <div className="landing-page-section">
          <div className="toggle-container">
            <span className={`toggle-label ${landingPage === 'Island' ? 'active' : ''}`}>
              Island
            </span>
            <div className="toggle-switch" onClick={() => setLandingPage(landingPage === 'Island' ? 'Search' : 'Island')}>
              <div className={`toggle-slider ${landingPage === 'Search' ? 'toggled' : ''}`}>
                <div className="toggle-circle"></div>
              </div>
            </div>
            <span className={`toggle-label ${landingPage === 'Search' ? 'active' : ''}`}>
              Search
            </span>
          </div>
        </div>

        <div className="site-mode-section">
          <h3>Site Mode</h3>
          <div className="mode-buttons">
            {(['Light', 'Ambient', 'Dark'] as const).map((mode) => (
              <button
                key={mode}
                className={`mode-btn ${siteMode === mode ? 'active' : ''}`}
                onClick={() => setSiteMode(mode)}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};