'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  UserSubscription,
  SubscriptionTier,
  FeatureAccess,
  hasFeatureAccess,
  isSubscriptionActive
} from '@/types/subscription';
import {
  getCurrentUserSubscription,
  createCheckoutSession,
  cancelSubscription,
  reactivateSubscription,
  createBillingPortalSession
} from '@/lib/subscription';

interface UseSubscriptionReturn {
  subscription: UserSubscription | null;
  loading: boolean;
  error: string | null;
  isActive: boolean;
  tier: SubscriptionTier;
  
  // Feature access
  checkAccess: (requiredTier: SubscriptionTier) => FeatureAccess;
  hasAccess: (requiredTier: SubscriptionTier) => boolean;
  
  // Subscription actions
  upgrade: (priceId: string, tier: SubscriptionTier) => Promise<void>;
  cancel: () => Promise<void>;
  reactivate: () => Promise<void>;
  manageBilling: () => Promise<void>;
  
  // Refresh data
  refresh: () => Promise<void>;
}

export function useSubscription(): UseSubscriptionReturn {
  const router = useRouter();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch subscription data
  const fetchSubscription = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getCurrentUserSubscription();
      setSubscription(data);
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch subscription');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize subscription data (Realtime removed for performance)
  useEffect(() => {
    fetchSubscription();
  }, []); // Fetch once on mount, uses 2-minute cache for subsequent calls

  // Computed values
  const isActive = subscription ? isSubscriptionActive(subscription.subscription_status) : false;
  const tier = subscription?.subscription_tier || 'free';

  // Feature access functions
  const checkAccess = useCallback((requiredTier: SubscriptionTier): FeatureAccess => {
    if (!subscription) {
      return {
        hasAccess: requiredTier === 'free',
        tier: 'free',
        status: 'active',
        reason: requiredTier === 'free' ? undefined : 'No subscription found'
      };
    }

    return hasFeatureAccess(
      subscription.subscription_tier,
      subscription.subscription_status,
      requiredTier
    );
  }, [subscription]);

  const hasAccess = useCallback((requiredTier: SubscriptionTier): boolean => {
    return checkAccess(requiredTier).hasAccess;
  }, [checkAccess]);

  // Subscription actions
  const upgrade = useCallback(async (priceId: string, newTier: SubscriptionTier) => {
    try {
      setError(null);
      
      const { url } = await createCheckoutSession(priceId, newTier);
      
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      console.error('Error upgrading subscription:', err);
      setError(err instanceof Error ? err.message : 'Failed to upgrade subscription');
      throw err;
    }
  }, []);

  const cancel = useCallback(async () => {
    try {
      setError(null);
      await cancelSubscription();
      await fetchSubscription(); // Refresh data
    } catch (err) {
      console.error('Error canceling subscription:', err);
      setError(err instanceof Error ? err.message : 'Failed to cancel subscription');
      throw err;
    }
  }, [fetchSubscription]);

  const reactivate = useCallback(async () => {
    try {
      setError(null);
      await reactivateSubscription();
      await fetchSubscription(); // Refresh data
    } catch (err) {
      console.error('Error reactivating subscription:', err);
      setError(err instanceof Error ? err.message : 'Failed to reactivate subscription');
      throw err;
    }
  }, [fetchSubscription]);

  const manageBilling = useCallback(async () => {
    try {
      setError(null);
      const url = await createBillingPortalSession();
      
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No billing portal URL received');
      }
    } catch (err) {
      console.error('Error accessing billing portal:', err);
      setError(err instanceof Error ? err.message : 'Failed to access billing portal');
      throw err;
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchSubscription();
  }, [fetchSubscription]);

  return {
    subscription,
    loading,
    error,
    isActive,
    tier,
    
    // Feature access
    checkAccess,
    hasAccess,
    
    // Actions
    upgrade,
    cancel,
    reactivate,
    manageBilling,
    refresh,
  };
}

// Hook for checking specific feature access
export function useFeatureAccess(requiredTier: SubscriptionTier) {
  const { checkAccess } = useSubscription();
  return checkAccess(requiredTier);
}

// Hook for simple access checking
export function useHasAccess(requiredTier: SubscriptionTier) {
  const { hasAccess } = useSubscription();
  return hasAccess(requiredTier);
}