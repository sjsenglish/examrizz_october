'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import './payment.css';

export default function PaymentPage() {

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
        <div className="payment-container">
          {/* Header */}
          <div className="payment-header">
            <h1 className="payment-title">Choose Your Plan</h1>
            <p className="payment-subtitle">Unlock unlimited access to all practice questions and video solutions</p>
          </div>

          {/* Pricing Cards */}
          <div className="pricing-grid">
            {/* Monthly Plan */}
            <div className="pricing-card">
              <div className="card-header">
                <h3 className="plan-name">Monthly</h3>
                <div className="price-display">
                  <span className="currency">£</span>
                  <span className="price">9.99</span>
                  <span className="period">/month</span>
                </div>
              </div>
              <ul className="features-list">
                <li>✓ Unlimited practice questions</li>
                <li>✓ Video solutions for all questions</li>
                <li>✓ Progress tracking</li>
                <li>✓ Mobile app access</li>
                <li>✓ Cancel anytime</li>
              </ul>
              <button className="plan-button monthly">
                Start Monthly Plan
              </button>
            </div>

            {/* Annual Plan - Most Popular */}
            <div className="pricing-card featured">
              <div className="popular-badge">Most Popular</div>
              <div className="card-header">
                <h3 className="plan-name">Annual</h3>
                <div className="price-display">
                  <span className="currency">£</span>
                  <span className="price">79.99</span>
                  <span className="period">/year</span>
                </div>
                <div className="savings">Save £40 per year</div>
              </div>
              <ul className="features-list">
                <li>✓ Everything in Monthly</li>
                <li>✓ Priority support</li>
                <li>✓ Early access to new content</li>
                <li>✓ Downloadable resources</li>
                <li>✓ Study guides included</li>
              </ul>
              <button className="plan-button annual">
                Start Annual Plan
              </button>
            </div>

            {/* Free Trial */}
            <div className="pricing-card">
              <div className="card-header">
                <h3 className="plan-name">Free Trial</h3>
                <div className="price-display">
                  <span className="currency">£</span>
                  <span className="price">0</span>
                  <span className="period">/7 days</span>
                </div>
              </div>
              <ul className="features-list">
                <li>✓ 50 practice questions</li>
                <li>✓ 10 video solutions</li>
                <li>✓ Basic progress tracking</li>
                <li>✓ No credit card required</li>
                <li>✓ Upgrade anytime</li>
              </ul>
              <button className="plan-button trial">
                Start Free Trial
              </button>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="payment-methods">
            <h3 className="methods-title">Secure Payment Methods</h3>
            <div className="methods-grid">
              <div className="method-card">💳 Credit Card</div>
              <div className="method-card">🏦 Bank Transfer</div>
              <div className="method-card">📱 Apple Pay</div>
              <div className="method-card">🔒 PayPal</div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="security-notice">
            <div className="notice-content">
              <div className="security-icon">🔒</div>
              <div className="notice-text">
                <h4>Secure & Encrypted</h4>
                <p>Your payment information is protected with bank-level security. We never store your card details.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}