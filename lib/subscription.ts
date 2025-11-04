import { createClient } from '@supabase/supabase-js';
import { 
  UserSubscription, 
  SubscriptionTier, 
  SubscriptionStatus,
  hasFeatureAccess,
  FeatureAccess 
} from '@/types/subscription';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Get the current user's subscription
 */
export async function getCurrentUserSubscription(): Promise<UserSubscription | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('No authenticated user');
    }

    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user subscription:', error);
      return null;
    }

    return data;
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