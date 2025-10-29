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
  const [siteMode, setSiteMode] = useState<'Light' | 'Ambient' | 'Dark'>('Light');

  if (!isOpen) return null;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Settings</h2>
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