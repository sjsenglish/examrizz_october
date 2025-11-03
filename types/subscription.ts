// Subscription types for the educational platform

export type SubscriptionTier = 'free' | 'plus' | 'max';

export type SubscriptionStatus = 
  | 'active'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'past_due'
  | 'trialing'
  | 'unpaid'
  | 'paused';

// Main subscription interface matching the database table
export interface UserSubscription {
  id: string;
  user_id: string;
  subscription_tier: SubscriptionTier;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  subscription_status: SubscriptionStatus;
  current_period_start?: string; // ISO date string
  current_period_end?: string; // ISO date string
  cancel_at_period_end: boolean;
  canceled_at?: string; // ISO date string
  trial_start?: string; // ISO date string
  trial_end?: string; // ISO date string
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

// Extended subscription with user email for admin views
export interface UserSubscriptionWithEmail extends UserSubscription {
  email: string;
  email_confirmed_at?: string;
  user_created_at: string;
}

// Subscription features for each tier
export interface SubscriptionFeatures {
  name: string;
  displayName: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  limits: {
    questionsPerDay?: number;
    videoAccess: boolean;
    practiceTests: boolean;
    studyMaterials: boolean;
    personalizedFeedback: boolean;
    prioritySupport: boolean;
    offlineAccess: boolean;
    advancedAnalytics: boolean;
  };
  stripePriceIds: {
    monthly: string;
    yearly: string;
  };
}

// Subscription plan configuration
export const SUBSCRIPTION_PLANS: Record<SubscriptionTier, SubscriptionFeatures> = {
  free: {
    name: 'free',
    displayName: 'Free',
    price: {
      monthly: 0,
      yearly: 0
    },
    features: [
      'Unlimited access to A level and admissions materials, including past paper and original questions',
      'University interview questions by course',
      'Entry-level access to personal statement advisor',
      'Community access and support (discord)'
    ],
    limits: {
      questionsPerDay: 5,
      videoAccess: false,
      practiceTests: true,
      studyMaterials: false,
      personalizedFeedback: false,
      prioritySupport: false,
      offlineAccess: false,
      advancedAnalytics: false
    },
    stripePriceIds: {
      monthly: '',
      yearly: ''
    }
  },
  plus: {
    name: 'plus',
    displayName: 'Plus',
    price: {
      monthly: 9.99,
      yearly: 0 // No yearly option for now
    },
    features: [
      'Premium access to personal statement advisor, with additional usage and features each month',
      'Ask questions with real teachers (limited per month)',
      'Premium discord features',
      'Everything in Free'
    ],
    limits: {
      videoAccess: true,
      practiceTests: true,
      studyMaterials: true,
      personalizedFeedback: false,
      prioritySupport: false,
      offlineAccess: false,
      advancedAnalytics: false
    },
    stripePriceIds: {
      monthly: 'price_1SOIx7RslRN77kT8F5nCPTkg',
      yearly: ''
    }
  },
  max: {
    name: 'max',
    displayName: 'Max',
    price: {
      monthly: 19.99,
      yearly: 0 // No yearly option for now
    },
    features: [
      'Ultimate personal statement advisor guidance and attention',
      'University interview guidance and support from real teachers',
      'Early access to new features',
      'Priority support',
      'Everything in Plus'
    ],
    limits: {
      videoAccess: true,
      practiceTests: true,
      studyMaterials: true,
      personalizedFeedback: true,
      prioritySupport: true,
      offlineAccess: true,
      advancedAnalytics: true
    },
    stripePriceIds: {
      monthly: 'price_1Rby0mRslRN77kT8vhRtwZJZ',
      yearly: ''
    }
  }
};

// Billing interval type
export type BillingInterval = 'monthly' | 'yearly';

// Stripe-related types
export interface StripeSubscriptionData {
  subscription_id: string;
  customer_id: string;
  status: SubscriptionStatus;
  current_period_start: number; // Unix timestamp
  current_period_end: number; // Unix timestamp
  cancel_at_period_end: boolean;
  canceled_at?: number; // Unix timestamp
  trial_start?: number; // Unix timestamp
  trial_end?: number; // Unix timestamp
}

// API response types
export interface SubscriptionAPIResponse {
  success: boolean;
  subscription?: UserSubscription;
  error?: string;
}

export interface CreateCheckoutSessionRequest {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  userId: string;
  subscriptionTier: SubscriptionTier;
}

export interface CreateCheckoutSessionResponse {
  success: boolean;
  sessionId?: string;
  url?: string;
  error?: string;
}

// Subscription management types
export interface SubscriptionUpdate {
  subscription_tier?: SubscriptionTier;
  subscription_status?: SubscriptionStatus;
  current_period_start?: string;
  current_period_end?: string;
  cancel_at_period_end?: boolean;
  canceled_at?: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
}

// Feature access utility type
export interface FeatureAccess {
  hasAccess: boolean;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  reason?: string;
}

// Subscription analytics types
export interface SubscriptionAnalytics {
  totalSubscribers: number;
  subscribersByTier: Record<SubscriptionTier, number>;
  revenue: {
    monthly: number;
    yearly: number;
    total: number;
  };
  churnRate: number;
  growthRate: number;
}

// Helper functions
export function isSubscriptionActive(status: SubscriptionStatus): boolean {
  return status === 'active' || status === 'trialing';
}

export function getSubscriptionDisplayName(tier: SubscriptionTier): string {
  return SUBSCRIPTION_PLANS[tier].displayName;
}

export function hasFeatureAccess(
  userTier: SubscriptionTier,
  userStatus: SubscriptionStatus,
  requiredTier: SubscriptionTier
): FeatureAccess {
  if (!isSubscriptionActive(userStatus)) {
    return {
      hasAccess: false,
      tier: userTier,
      status: userStatus,
      reason: 'Subscription is not active'
    };
  }

  const tierHierarchy: Record<SubscriptionTier, number> = {
    free: 0,
    plus: 1,
    max: 2
  };

  const hasAccess = tierHierarchy[userTier] >= tierHierarchy[requiredTier];

  return {
    hasAccess,
    tier: userTier,
    status: userStatus,
    reason: hasAccess ? undefined : `Requires ${getSubscriptionDisplayName(requiredTier)} tier or higher`
  };
}

export function formatSubscriptionPrice(
  tier: SubscriptionTier,
  interval: BillingInterval
): string {
  const plan = SUBSCRIPTION_PLANS[tier];
  const price = plan.price[interval];
  
  if (price === 0) {
    return 'Free';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(price);
}

// Database function return types
export interface GetUserSubscriptionResult {
  subscription_tier: SubscriptionTier;
  subscription_status: SubscriptionStatus;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export interface CheckSubscriptionAccessResult {
  hasAccess: boolean;
}