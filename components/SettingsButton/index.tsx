'use client';

import React, { useState } from 'react';
import { SettingsModal } from './SettingsModal';
import { GearIcon } from '../icons/GearIcon';
import './SettingsButton.css';

export const SettingsButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        className="settings-button"
        onClick={() => setIsModalOpen(true)}
        aria-label="Settings"
      >
        <GearIcon size={32} color="#333333" />
      </button>
      <SettingsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};