'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useSubscription } from '@/hooks/useSubscription';
import { SUBSCRIPTION_PLANS, formatSubscriptionPrice } from '@/types/subscription';
import './payment.css';

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { subscription, loading, upgrade, manageBilling, cancel, reactivate, refresh } = useSubscription();
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');

  // Handle URL parameters for success/cancel redirects
  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    
    if (success === 'true') {
      setMessage('Payment successful! Your subscription has been activated.');
      // Force refresh subscription data after successful payment
      setTimeout(() => {
        refresh();
      }, 1000); // Small delay to allow webhook processing
    } else if (canceled === 'true') {
      setMessage('Payment was canceled. You can try again anytime.');
    }
  }, [searchParams, refresh]);

  const handleUpgrade = async (tier: 'plus' | 'max') => {
    try {
      setUpgrading(tier);
      const priceId = SUBSCRIPTION_PLANS[tier].stripePriceIds.monthly;
      await upgrade(priceId, tier);
    } catch (error) {
      console.error('Upgrade failed:', error);
      
      if (error instanceof Error && error.message === 'SIGN_IN_REQUIRED') {
        setMessage('Please sign in to your account first to upgrade your plan. Click here to go to the login page.');
      } else {
        setMessage('Failed to start upgrade process. Please try again.');
      }
      
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
    const endDate = subscription?.current_period_end 
      ? new Date(subscription.current_period_end).toLocaleDateString()
      : 'the end of your billing period';
      
    if (!confirm(`Are you sure you want to cancel your subscription?\n\nYou will continue to have full access until ${endDate}. After that, your account will be downgraded to the free tier.`)) {
      return;
    }
    
    try {
      await cancel();
      setMessage(`✅ Your subscription has been canceled. You'll continue to have access until ${endDate}.`);
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      setMessage('❌ Failed to cancel subscription. Please try again or contact support.');
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      await reactivate();
      setMessage('✅ Your subscription has been reactivated successfully! Your billing will continue as normal.');
    } catch (error) {
      console.error('Failed to reactivate subscription:', error);
      setMessage('❌ Failed to reactivate subscription. Please try again or contact support.');
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
          {/* Manual Refresh Button for After Payment */}
          {searchParams.get('success') === 'true' && (
            <div style={{
              padding: '16px 20px',
              marginBottom: '24px',
              backgroundColor: '#F0F9FF',
              border: '1px solid #0EA5E9',
              borderLeft: '4px solid #0EA5E9',
              borderRadius: '8px',
              textAlign: 'center',
              fontFamily: "'Figtree', sans-serif",
              fontSize: '14px',
              color: '#0C4A6E',
              fontWeight: '500',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ marginBottom: '12px' }}>
                🎉 Payment successful! Your subscription is being activated...
              </div>
              <button
                onClick={() => {
                  refresh();
                  setMessage('Refreshing subscription status...');
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#0EA5E9',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0284C7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#0EA5E9';
                }}
              >
                🔄 Refresh Status
              </button>
            </div>
          )}

          {/* Message Display */}
          {message && (
            <div className="message-banner" style={{
              padding: '16px 20px',
              marginBottom: '24px',
              backgroundColor: message.includes('sign in') ? '#F0F9FF' : 
                              message.includes('Failed') || message.includes('canceled') ? '#FEF2F2' : '#F0FDF4',
              border: `1px solid ${message.includes('sign in') ? '#0EA5E9' : 
                                  message.includes('Failed') || message.includes('canceled') ? '#F87171' : '#22C55E'}`,
              borderLeft: `4px solid ${message.includes('sign in') ? '#0EA5E9' : 
                                      message.includes('Failed') || message.includes('canceled') ? '#EF4444' : '#16A34A'}`,
              borderRadius: '8px',
              textAlign: 'center',
              fontFamily: "'Figtree', sans-serif",
              fontSize: '14px',
              color: message.includes('sign in') ? '#0C4A6E' : 
                     message.includes('Failed') || message.includes('canceled') ? '#B91C1C' : '#15803D',
              fontWeight: '500',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}>
              {message.includes('sign in') && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>🔐</span>
                    <span>Please sign in to your account first to upgrade your plan.</span>
                  </div>
                  <Link 
                    href="/login"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      backgroundColor: '#0EA5E9',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '600',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#0284C7';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#0EA5E9';
                    }}
                  >
                    <span>👤</span>
                    Sign In Now
                  </Link>
                </div>
              )}
              {!message.includes('sign in') && message}
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
              <p style={{ 
                margin: '0 0 16px 0', 
                color: willCancelAtPeriodEnd ? '#dc3545' : '#666',
                fontWeight: willCancelAtPeriodEnd ? '600' : 'normal'
              }}>
                Status: {isActive ? 'Active' : subscription.subscription_status}
                {willCancelAtPeriodEnd && (
                  <span style={{ 
                    backgroundColor: '#fff3cd', 
                    color: '#856404',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    marginLeft: '8px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    ⚠️ Cancels at period end
                  </span>
                )}
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
                      padding: '10px 20px',
                      backgroundColor: '#DBF7F9',
                      color: '#000000',
                      border: '1px solid #B3F0F2',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontFamily: "'Figtree', sans-serif",
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 4px rgba(179, 240, 242, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#B3F0F2';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(179, 240, 242, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#DBF7F9';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(179, 240, 242, 0.3)';
                    }}
                  >
                    💳 Manage Billing
                  </button>
                )}
                
                {currentTier !== 'free' && isActive && !willCancelAtPeriodEnd && (
                  <button
                    onClick={handleCancelSubscription}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#FADEE8',
                      color: '#000000',
                      border: '1px solid #F5C5D6',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontFamily: "'Figtree', sans-serif",
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 4px rgba(245, 197, 214, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#F5C5D6';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(245, 197, 214, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#FADEE8';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(245, 197, 214, 0.3)';
                    }}
                  >
                    ❌ Cancel Subscription
                  </button>
                )}
                
                {willCancelAtPeriodEnd && (
                  <button
                    onClick={handleReactivateSubscription}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: '1px solid #1e7e34',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontFamily: "'Figtree', sans-serif",
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 4px rgba(40, 167, 69, 0.2)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#1e7e34';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(40, 167, 69, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#28a745';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(40, 167, 69, 0.2)';
                    }}
                  >
                    ✅ Reactivate Subscription
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Header */}
          <div className="payment-header">
            <h1 className="payment-title">Choose Your Plan</h1>
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
                style={{ 
                  opacity: currentTier === 'free' ? 0.8 : 1,
                  cursor: currentTier === 'free' ? 'not-allowed' : 'pointer',
                  backgroundColor: currentTier === 'free' ? '#16A34A' : undefined,
                  color: currentTier === 'free' ? 'white' : undefined
                }}
              >
                {currentTier === 'free' ? '✓ Current Plan' : 'Downgrade to Free'}
              </button>
            </div>

            {/* Plus Plan */}
            <div className={`pricing-card ${currentTier === 'plus' ? 'current-plan' : ''}`}>
              <div className="card-header">
                <h3 className="plan-name">Plus</h3>
                <div className="price-display">
                  <span className="currency">£</span>
                  <span className="price">10</span>
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
                onClick={() => currentTier !== 'plus' && !upgrading && handleUpgrade('plus')}
                disabled={currentTier === 'plus' || upgrading === 'plus'}
                style={{ 
                  opacity: currentTier === 'plus' ? 0.8 : 1,
                  cursor: currentTier === 'plus' || upgrading === 'plus' ? 'not-allowed' : 'pointer',
                  backgroundColor: currentTier === 'plus' ? '#16A34A' : undefined,
                  color: currentTier === 'plus' ? 'white' : undefined
                }}
              >
                {upgrading === 'plus' ? 'Processing...' : 
                 currentTier === 'plus' ? '✓ Current Plan' : 
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
                  <span className="price">20</span>
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
                onClick={() => currentTier !== 'max' && !upgrading && handleUpgrade('max')}
                disabled={currentTier === 'max' || upgrading === 'max'}
                style={{ 
                  opacity: currentTier === 'max' ? 0.8 : 1,
                  cursor: currentTier === 'max' || upgrading === 'max' ? 'not-allowed' : 'pointer',
                  backgroundColor: currentTier === 'max' ? '#16A34A' : undefined,
                  color: currentTier === 'max' ? 'white' : undefined
                }}
              >
                {upgrading === 'max' ? 'Processing...' : 
                 currentTier === 'max' ? '✓ Current Plan' : 
                 'Upgrade to Max'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="page-background" style={{ paddingTop: '60px' }}>
        <Navbar />
        <div className="main-content">
          <div className="payment-container">
            <div className="loading-state">
              <h2>Loading...</h2>
            </div>
          </div>
        </div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}