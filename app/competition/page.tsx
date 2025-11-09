'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import './competition.css';

export default function CompetitionPage() {
  return (
    <div className="page-background">
      <Navbar />
      
      <div className="main-content">
        <div className="content-container">
          <h1 className="main-title">100% A*AA or better. 100%<br />Oxbridge/Russell Group.</h1>
          
          <p className="subtitle">
            Our proven school curriculum delivered perfect results for 100+ students with zero A-level background.
          </p>
          
          <p className="description">
            Complete one subject in 190 hours or less (90 hours teaching + 100 hours practice).
          </p>
          
          <p className="tagline">
            No endless revision loops. No guessing what to study. We tell you exactly what to do next.
          </p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="icon-container">
                <Image 
                  src="/icons/cowboy-guitar.svg" 
                  alt="Ask Joe" 
                  width={120} 
                  height={120}
                  className="feature-icon"
                />
              </div>
              <h3 className="feature-title">Ask Joe</h3>
              <p className="feature-description">
                Let Joe guide you through each spec point - watch a video, read the notes, do the practice pack, and review.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="icon-container">
                <Image 
                  src="/icons/ghost-karaoke.svg" 
                  alt="Skip to spec points" 
                  width={120} 
                  height={120}
                  className="feature-icon"
                />
              </div>
              <h3 className="feature-title">Skip to spec points</h3>
              <p className="feature-description">
                Go straight to practice packs levelled by difficulty from grade B to A**
              </p>
            </div>
            
            <div className="feature-card">
              <div className="icon-container">
                <Image 
                  src="/icons/biking.svg" 
                  alt="Real Joe support" 
                  width={120} 
                  height={120}
                  className="feature-icon"
                />
              </div>
              <h3 className="feature-title">Real Joe support</h3>
              <p className="feature-description">
                If you still can't figure it out, open a ticket and get help from the real Joe!
              </p>
            </div>
          </div>
          
          <button className="demo-button">Maths Edexcel A Level Demo</button>
        </div>
      </div>
    </div>
  );
}