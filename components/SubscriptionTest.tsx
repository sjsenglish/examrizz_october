'use client';

import { useSubscription } from '@/hooks/useSubscription';
import { SUBSCRIPTION_PLANS } from '@/types/subscription';

export function SubscriptionTest() {
  const { 
    subscription, 
    loading, 
    error, 
    tier, 
    isActive, 
    hasAccess,
    upgrade 
  } = useSubscription();

  if (loading) return <div>Loading subscription...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleTestUpgrade = async () => {
    try {
      const priceId = SUBSCRIPTION_PLANS.plus.stripePriceIds.monthly;
      await upgrade(priceId, 'plus');
    } catch (err) {
      console.error('Test upgrade failed:', err);
      if (err instanceof Error && err.message === 'SIGN_IN_REQUIRED') {
        alert('Please sign in to your account first to upgrade your plan.');
      } else {
        alert('Upgrade failed. Please try again.');
      }
    }
  };

  return (
    <div style={{
      padding: '20px',
      margin: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>Subscription Test Component</h3>
      
      <div style={{ marginBottom: '16px' }}>
        <strong>Current Tier:</strong> {tier}
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <strong>Status:</strong> {subscription?.subscription_status || 'Unknown'}
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <strong>Is Active:</strong> {isActive ? 'Yes' : 'No'}
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <strong>Access Tests:</strong>
        <ul>
          <li>Free features: {hasAccess('free') ? '✅' : '❌'}</li>
          <li>Plus features: {hasAccess('plus') ? '✅' : '❌'}</li>
          <li>Max features: {hasAccess('max') ? '✅' : '❌'}</li>
        </ul>
      </div>

      {tier === 'free' && (
        <button 
          onClick={handleTestUpgrade}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Upgrade to Plus
        </button>
      )}

      <details style={{ marginTop: '16px' }}>
        <summary>Raw Subscription Data</summary>
        <pre style={{ 
          backgroundColor: '#f0f0f0', 
          padding: '12px', 
          overflow: 'auto',
          fontSize: '12px'
        }}>
          {JSON.stringify(subscription, null, 2)}
        </pre>
      </details>
    </div>
  );
}