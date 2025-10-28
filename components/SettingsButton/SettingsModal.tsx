'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './SettingsModal.css';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [landingPage, setLandingPage] = useState<'Island' | 'Search'>('Search');
  const [siteMode, setSiteMode] = useState<'Light' | 'Ambient' | 'Dark'>('Light');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load user preferences when modal opens
  useEffect(() => {
    if (isOpen) {
      loadUserPreferences();
    }
  }, [isOpen]);

  const loadUserPreferences = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/user-preferences', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        const preferences = await response.json();
        setLandingPage(preferences.landing_page === 'island' ? 'Island' : 'Search');
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async (newLandingPage?: string) => {
    setIsSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const updateData: any = {};
      if (newLandingPage !== undefined) {
        updateData.landing_page = newLandingPage.toLowerCase();
      }

      const response = await fetch('/api/user-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }

      // If landing page changed, reload the page to apply the change
      if (newLandingPage !== undefined) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLandingPageChange = (newPage: 'Island' | 'Search') => {
    setLandingPage(newPage);
    savePreferences(newPage);
  };

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
            <div 
              className="toggle-switch" 
              onClick={() => !isSaving && handleLandingPageChange(landingPage === 'Island' ? 'Search' : 'Island')}
              style={{ opacity: isSaving ? 0.6 : 1, cursor: isSaving ? 'not-allowed' : 'pointer' }}
            >
              <div className={`toggle-slider ${landingPage === 'Search' ? 'toggled' : ''}`}>
                <div className="toggle-circle"></div>
              </div>
            </div>
            <span className={`toggle-label ${landingPage === 'Search' ? 'active' : ''}`}>
              Search
            </span>
          </div>
          {isSaving && <div className="saving-indicator">Saving...</div>}
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