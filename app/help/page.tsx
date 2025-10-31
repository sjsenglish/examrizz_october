'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import './help.css';

export default function HelpPage() {

  return (
    <div className="page-background" style={{ paddingTop: '60px' }}>
      <Navbar />

      {/* Back Button */}
      <Link 
        href="/" 
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

      {/* Main Content */}
      <div className="main-content">
        <div className="help-container">
          <h1 className="help-title">Discord Support Guide</h1>
          <p className="help-subtitle">Follow these steps to get help through our Discord server</p>

          <div className="help-content">
            {/* Ticket Guide Steps */}
            <section className="help-section">
              <h2>How to Create a Support Ticket</h2>
              <div className="ticket-guide">
                <div className="step-card">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h3>Preparation</h3>
                    <p><strong>Requirements:</strong></p>
                    <ul className="step-list">
                      <li>You must first have a Discord account</li>
                      <li>Join our official server</li>
                      <li>Accept the server rules</li>
                    </ul>
                    <div className="tip-box">
                      <span className="tip-icon">💡</span>
                      <p><strong>Tip for New Users:</strong> If you haven't done this, you won't be able to see the full list of channels.</p>
                    </div>
                  </div>
                </div>

                <div className="step-card">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h3>Locate the Help Channel</h3>
                    <p>On the left-hand side of the Discord application, you will see a list of text channels. Scroll near the top and click on the channel named <strong className="channel-highlight">#help-centre</strong></p>
                    <div className="tip-box">
                      <span className="tip-icon">📍</span>
                      <p><strong>This channel is dedicated solely to starting the support process.</strong></p>
                    </div>
                  </div>
                </div>

                <div className="step-card">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h3>Select Your Category</h3>
                    <p>In the help centre channel, you will see a message with a list of 5 categories for your tickets. Read the descriptions of each option:</p>
                    <div className="categories-grid">
                      <div className="category-item">
                        <span className="category-icon">🎫</span>
                        <strong>Premium Verification</strong>
                      </div>
                      <div className="category-item">
                        <span className="category-icon">📝</span>
                        <strong>Personal Statement Application</strong>
                      </div>
                      <div className="category-item">
                        <span className="category-icon">❓</span>
                        <strong>General Inquiries / Feedbacks</strong>
                      </div>
                      <div className="category-item">
                        <span className="category-icon">🧠</span>
                        <strong>Thinking Skills Assessment (TSA)</strong>
                      </div>
                      <div className="category-item">
                        <span className="category-icon">📚</span>
                        <strong>Study Buddy (Website Support)</strong>
                      </div>
                    </div>
                    <div className="warning-box">
                      <span className="warning-icon">⚠️</span>
                      <p><strong>Important:</strong> Do not type a message yet. Just click the button to select your issue.</p>
                    </div>
                  </div>
                </div>

                <div className="step-card">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h3>State Your Issue Clearly</h3>
                    <p>After you click on an option, a new private ticket channel will instantly appear. In this new channel, a staff member will join the private ticket channel with you.</p>
                    <div className="guidelines-box">
                      <h4>📋 Guidelines:</h4>
                      <ul className="guidelines-list">
                        <li>Be specific: Include screenshots, error messages, or links if applicable to help the staff member understand your situation</li>
                        <li>Describe your problem in detail</li>
                        <li>The channel is visible only to you and staff members</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="step-card">
                  <div className="step-number">5</div>
                  <div className="step-content">
                    <h3>Wait for Staff</h3>
                    <p>A member of our team will join the private ticket as you quickly as possible.</p>
                    <div className="tip-box">
                      <span className="tip-icon">⏰</span>
                      <p><strong>Please be patient, especially during busy times. Do not open multiple tickets for the same issue.</strong></p>
                    </div>
                  </div>
                </div>

                <div className="step-card">
                  <div className="step-number">6</div>
                  <div className="step-content">
                    <h3>Ticket Closure</h3>
                    <p>Once your issue is fully resolved and you have been provided with the support, remember of the staff will close the private ticket channel for you.</p>
                    <div className="info-box">
                      <span className="info-icon">ℹ️</span>
                      <p><strong>Note:</strong> You do not need to do anything to close the ticket.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Email Contact */}
            <div className="email-contact">
              <p>Still confused? Email us at <a href="mailto:team@examrizz.com" className="email-link">team@examrizz.com</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}