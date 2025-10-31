'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useSubscription } from '@/hooks/useSubscription';
import { SUBSCRIPTION_PLANS, formatSubscriptionPrice } from '@/types/subscription';
import './payment.css';

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { subscription, loading, upgrade, manageBilling, cancel, reactivate } = useSubscription();
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');

  // Handle URL parameters for success/cancel redirects
  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    
    if (success === 'true') {
      setMessage('Payment successful! Your subscription has been activated.');
    } else if (canceled === 'true') {
      setMessage('Payment was canceled. You can try again anytime.');
    }
  }, [searchParams]);

  const handleUpgrade = async (tier: 'plus' | 'max') => {
    try {
      setUpgrading(tier);
      const priceId = SUBSCRIPTION_PLANS[tier].stripePriceIds.monthly;
      await upgrade(priceId, tier);
    } catch (error) {
      console.error('Upgrade failed:', error);
      setMessage('Failed to start upgrade process. Please try again.');
      setUpgrading(null);
    }
  };

  const handleManageBilling = async () => {
    try {
      await manageBilling();
    } catch (error) {
      console.error('Failed to open billing portal:', error);
      setMessage('Failed to open billing portal. Please try again.');
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will continue to have access until the end of your current billing period.')) {
      return;
    }
    
    try {
      await cancel();
      setMessage('Your subscription has been canceled and will end at the current period.');
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      setMessage('Failed to cancel subscription. Please try again.');
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      await reactivate();
      setMessage('Your subscription has been reactivated successfully.');
    } catch (error) {
      console.error('Failed to reactivate subscription:', error);
      setMessage('Failed to reactivate subscription. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="page-background" style={{ paddingTop: '60px' }}>
        <Navbar />
        <div className="main-content">
          <div className="payment-container">
            <div className="loading-state">
              <h2>Loading your subscription...</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentTier = subscription?.subscription_tier || 'free';
  const isActive = subscription?.subscription_status === 'active' || subscription?.subscription_status === 'trialing';
  const willCancelAtPeriodEnd = subscription?.cancel_at_period_end;

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
          {/* Message Display */}
          {message && (
            <div className="message-banner" style={{
              padding: '16px',
              marginBottom: '24px',
              backgroundColor: message.includes('Failed') || message.includes('canceled') ? '#fee' : '#efe',
              border: `1px solid ${message.includes('Failed') || message.includes('canceled') ? '#fcc' : '#cfc'}`,
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              {message}
            </div>
          )}

          {/* Current Subscription Status */}
          {subscription && (
            <div className="current-subscription" style={{
              padding: '24px',
              marginBottom: '32px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '12px'
            }}>
              <h3 style={{ margin: '0 0 16px 0', fontFamily: "'Madimi One', cursive" }}>
                Current Plan: {SUBSCRIPTION_PLANS[currentTier].displayName}
              </h3>
              <p style={{ margin: '0 0 16px 0', color: '#666' }}>
                Status: {isActive ? 'Active' : subscription.subscription_status}
                {willCancelAtPeriodEnd && ' (Will cancel at period end)'}
              </p>
              
              {subscription.current_period_end && (
                <p style={{ margin: '0 0 16px 0', color: '#666' }}>
                  {willCancelAtPeriodEnd ? 'Access ends' : 'Next billing'}: {new Date(subscription.current_period_end).toLocaleDateString()}
                </p>
              )}

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {currentTier !== 'free' && (
                  <button
                    onClick={handleManageBilling}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontFamily: "'Figtree', sans-serif"
                    }}
                  >
                    Manage Billing
                  </button>
                )}
                
                {currentTier !== 'free' && isActive && !willCancelAtPeriodEnd && (
                  <button
                    onClick={handleCancelSubscription}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontFamily: "'Figtree', sans-serif"
                    }}
                  >
                    Cancel Subscription
                  </button>
                )}
                
                {willCancelAtPeriodEnd && (
                  <button
                    onClick={handleReactivateSubscription}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontFamily: "'Figtree', sans-serif"
                    }}
                  >
                    Reactivate Subscription
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Header */}
          <div className="payment-header">
            <h1 className="payment-title">Choose Your Plan</h1>
            <p className="payment-subtitle">Unlock unlimited access to all practice questions and video solutions</p>
          </div>

          {/* Pricing Cards */}
          <div className="pricing-grid">
            {/* Free Plan */}
            <div className={`pricing-card ${currentTier === 'free' ? 'current-plan' : ''}`}>
              <div className="card-header">
                <h3 className="plan-name">Free</h3>
                <div className="price-display">
                  <span className="currency">£</span>
                  <span className="price">0</span>
                  <span className="period">/forever</span>
                </div>
                {currentTier === 'free' && <div className="current-badge">Current Plan</div>}
              </div>
              <ul className="features-list">
                {SUBSCRIPTION_PLANS.free.features.map((feature, index) => (
                  <li key={index}>✓ {feature}</li>
                ))}
              </ul>
              <button 
                className="plan-button trial"
                disabled={currentTier === 'free'}
                style={{ opacity: currentTier === 'free' ? 0.5 : 1 }}
              >
                {currentTier === 'free' ? 'Current Plan' : 'Downgrade to Free'}
              </button>
            </div>

            {/* Plus Plan */}
            <div className={`pricing-card ${currentTier === 'plus' ? 'current-plan' : ''}`}>
              <div className="card-header">
                <h3 className="plan-name">Plus</h3>
                <div className="price-display">
                  <span className="currency">£</span>
                  <span className="price">9.99</span>
                  <span className="period">/month</span>
                </div>
                {currentTier === 'plus' && <div className="current-badge">Current Plan</div>}
              </div>
              <ul className="features-list">
                {SUBSCRIPTION_PLANS.plus.features.map((feature, index) => (
                  <li key={index}>✓ {feature}</li>
                ))}
              </ul>
              <button 
                className="plan-button monthly"
                onClick={() => handleUpgrade('plus')}
                disabled={currentTier === 'plus' || upgrading === 'plus'}
                style={{ opacity: currentTier === 'plus' ? 0.5 : 1 }}
              >
                {upgrading === 'plus' ? 'Processing...' : 
                 currentTier === 'plus' ? 'Current Plan' : 
                 'Upgrade to Plus'}
              </button>
            </div>

            {/* Max Plan - Most Popular */}
            <div className={`pricing-card featured ${currentTier === 'max' ? 'current-plan' : ''}`}>
              <div className="popular-badge">Most Popular</div>
              <div className="card-header">
                <h3 className="plan-name">Max</h3>
                <div className="price-display">
                  <span className="currency">£</span>
                  <span className="price">19.99</span>
                  <span className="period">/month</span>
                </div>
                {currentTier === 'max' && <div className="current-badge">Current Plan</div>}
              </div>
              <ul className="features-list">
                {SUBSCRIPTION_PLANS.max.features.map((feature, index) => (
                  <li key={index}>✓ {feature}</li>
                ))}
              </ul>
              <button 
                className="plan-button annual"
                onClick={() => handleUpgrade('max')}
                disabled={currentTier === 'max' || upgrading === 'max'}
                style={{ opacity: currentTier === 'max' ? 0.5 : 1 }}
              >
                {upgrading === 'max' ? 'Processing...' : 
                 currentTier === 'max' ? 'Current Plan' : 
                 'Upgrade to Max'}
              </button>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="payment-methods">
            <h3 className="methods-title">Secure Payment Methods</h3>
            <div className="methods-grid">
              <div className="method-card">💳 Credit Card</div>
              <div className="method-card">💳 Debit Card</div>
              <div className="method-card">📱 Apple Pay</div>
              <div className="method-card">🔒 Google Pay</div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="security-notice">
            <div className="notice-content">
              <div className="security-icon">🔒</div>
              <div className="notice-text">
                <h4>Secure & Encrypted</h4>
                <p>Your payment information is protected with bank-level security. Powered by Stripe. We never store your card details.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}