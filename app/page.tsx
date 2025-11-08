'use client';

import React from 'react';
import { LandingHub } from '@/components/landing/LandingHub';
import Navbar from '@/components/Navbar';
import './home.css';

export default function Home() {
  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#FFFFFF',
      paddingTop: '60px'
    }}>
      <Navbar />
      
      {/* Island Hub - now the main page content */}
      <LandingHub />
    </div>
  );
}