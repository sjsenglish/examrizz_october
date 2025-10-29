'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import './terms.css';

export default function TermsAndConditionsPage() {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="page-background">
      {/* Navbar */}
      <nav className="navbar">
        <Link href="/" style={{ textDecoration: 'none' }}>
          <h1>examrizzsearch</h1>
        </Link>
        <div style={{ position: 'relative' }}>
          <button 
            className="hamburger-button"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
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
              zIndex: 1000,
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
                  transition: 'background-color 0.2s ease',
                  backgroundColor: '#F8F8F5'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F8F8F5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F8F8F5';
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
        <div className="terms-container">
          <h1 className="terms-title">Terms & Conditions</h1>
          <p className="last-updated">Last updated: October 29, 2025</p>

          <div className="terms-content">
            <section className="terms-section">
              <h2>1. Acceptance of Terms</h2>
              <p>By accessing and using ExamRizz, you accept and agree to be bound by the terms and provision of this agreement.</p>
            </section>

            <section className="terms-section">
              <h2>2. Service Description</h2>
              <p>ExamRizz provides online educational content including practice questions, video solutions, and study materials for A-level subjects and university admissions tests.</p>
            </section>

            <section className="terms-section">
              <h2>3. User Accounts</h2>
              <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
            </section>

            <section className="terms-section">
              <h2>4. Payment Terms</h2>
              <ul>
                <li>Monthly and annual subscription plans are available</li>
                <li>Payments are processed securely through our payment partners</li>
                <li>Refunds are available within 14 days of purchase</li>
                <li>Subscriptions automatically renew unless cancelled</li>
              </ul>
            </section>

            <section className="terms-section">
              <h2>5. Content Usage</h2>
              <p>All content provided by ExamRizz is for personal educational use only. Redistribution, sharing, or commercial use of our content is strictly prohibited.</p>
            </section>

            <section className="terms-section">
              <h2>6. Intellectual Property</h2>
              <p>All content, including questions, solutions, videos, and study materials, are owned by ExamRizz and protected by copyright law.</p>
            </section>

            <section className="terms-section">
              <h2>7. Privacy Policy</h2>
              <p>Your privacy is important to us. We collect and use personal information in accordance with our Privacy Policy, which forms part of these Terms.</p>
            </section>

            <section className="terms-section">
              <h2>8. Limitation of Liability</h2>
              <p>ExamRizz shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our service.</p>
            </section>

            <section className="terms-section">
              <h2>9. Termination</h2>
              <p>We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms.</p>
            </section>

            <section className="terms-section">
              <h2>10. Contact Information</h2>
              <p>If you have any questions about these Terms & Conditions, please contact us at:</p>
              <div className="contact-info">
                <p><strong>Email:</strong> support@examrizz.com</p>
                <p><strong>Address:</strong> ExamRizz Ltd, London, United Kingdom</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}