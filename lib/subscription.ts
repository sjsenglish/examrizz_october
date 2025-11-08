import { supabase } from '@/lib/supabase-client';
import { 
  UserSubscription, 
  SubscriptionTier, 
  SubscriptionStatus,
  hasFeatureAccess,
  FeatureAccess 
} from '@/types/subscription';
import { ensureUserSubscription } from '@/lib/ensure-user-subscription';

// Cache for subscription data to prevent repeated database calls
const subscriptionCache = new Map<string, { subscription: UserSubscription | null; timestamp: number }>();
const SUBSCRIPTION_CACHE_DURATION = 2 * 60 * 1000; // 2 minutes (shorter than profile cache)

/**
 * Get the current user's subscription (with caching)
 */
export async function getCurrentUserSubscription(): Promise<UserSubscription | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // Return null instead of throwing error for unauthenticated users
      return null;
    }

    // Check cache first
    const cached = subscriptionCache.get(user.id);
    if (cached && Date.now() - cached.timestamp < SUBSCRIPTION_CACHE_DURATION) {
      return cached.subscription;
    }

    // Use ensureUserSubscription to handle cases where user doesn't have a subscription record
    const subscription = await ensureUserSubscription(user.id);

    if (!subscription) {
      console.error('Failed to get or create user subscription');
      // Cache null result for a short time to prevent repeated failed calls
      subscriptionCache.set(user.id, { subscription: null, timestamp: Date.now() });
      return null;
    }

    // Cache the result
    subscriptionCache.set(user.id, { subscription, timestamp: Date.now() });
    return subscription;
  } catch (error) {
    console.error('Error in getCurrentUserSubscription:', error);
    return null;
  }
}

/**
 * Check if the current user has access to a specific feature
 */
export async function checkFeatureAccess(requiredTier: SubscriptionTier): Promise<FeatureAccess> {
  try {
    const subscription = await getCurrentUserSubscription();
    
    if (!subscription) {
      return {
        hasAccess: false,
        tier: 'free',
        status: 'active',
        reason: 'No subscription found'
      };
    }

    return hasFeatureAccess(
      subscription.subscription_tier,
      subscription.subscription_status,
      requiredTier
    );
  } catch (error) {
    console.error('Error checking feature access:', error);
    return {
      hasAccess: false,
      tier: 'free',
      status: 'active',
      reason: 'Error checking access'
    };
  }
}

/**
 * Create a Stripe checkout session
 */
export async function createCheckoutSession(
  priceId: string,
  subscriptionTier: SubscriptionTier,
  successUrl?: string,
  cancelUrl?: string
) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('SIGN_IN_REQUIRED');
    }

    const response = await fetch('/api/subscriptions/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        subscriptionTier,
        userId: user.id,
        successUrl: successUrl || `${window.location.origin}/payment?success=true`,
        cancelUrl: cancelUrl || `${window.location.origin}/payment?canceled=true`,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to create checkout session');
    }

    return data;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

/**
 * Manage subscription (cancel, reactivate, etc.)
 */
export async function manageSubscription(action: string, params?: any) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated');
    }

    const response = await fetch('/api/subscriptions/manage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        userId: user.id,
        ...params,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to manage subscription');
    }

    return data;
  } catch (error) {
    console.error('Error managing subscription:', error);
    throw error;
  }
}

/**
 * Create a billing portal session
 */
export async function createBillingPortalSession(returnUrl?: string) {
  try {
    const data = await manageSubscription('create_portal_session', {
      returnUrl: returnUrl || window.location.href,
    });

    return data.url;
  } catch (error) {
    console.error('Error creating billing portal session:', error);
    throw error;
  }
}

/**
 * Cancel subscription at period end
 */
export async function cancelSubscription() {
  return manageSubscription('cancel');
}

/**
 * Reactivate a canceled subscription
 */
export async function reactivateSubscription() {
  return manageSubscription('reactivate');
}

/**
 * Subscribe to subscription changes for real-time updates
 */
export function subscribeToSubscriptionChanges(
  userId: string,
  callback: (subscription: UserSubscription | null) => void
) {
  const subscription = supabase
    .channel(`subscription_changes_${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_subscriptions',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload.new as UserSubscription || null);
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}

/**
 * Clear subscription cache for a specific user
 */
export function clearSubscriptionCache(userId: string) {
  subscriptionCache.delete(userId);
  console.log('Cleared subscription cache for user:', userId);
}