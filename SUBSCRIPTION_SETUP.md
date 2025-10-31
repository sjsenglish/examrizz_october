# Subscription System Setup Guide

## Overview
This guide will help you set up the subscription system for your educational platform with Supabase and Stripe integration.

## Files Created

### Database Schema
- `supabase/migrations/20241031_create_subscriptions.sql` - Complete database migration with tables, RLS policies, and triggers

### TypeScript Types
- `types/subscription.ts` - All subscription-related TypeScript types and utilities

### API Routes
- `app/api/webhooks/stripe/route.ts` - Stripe webhook handler for subscription events
- `app/api/subscriptions/create-checkout/route.ts` - Create Stripe checkout sessions
- `app/api/subscriptions/manage/route.ts` - Manage subscriptions (cancel, reactivate, billing portal)

### Utilities and Hooks
- `lib/subscription.ts` - Helper functions for subscription management
- `hooks/useSubscription.ts` - React hook for subscription state management

## Environment Variables Required

Add these to your `.env.local` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

# Stripe Price IDs for Plus tier
STRIPE_PLUS_MONTHLY_PRICE_ID=price_plus_monthly_id
STRIPE_PLUS_YEARLY_PRICE_ID=price_plus_yearly_id
NEXT_PUBLIC_STRIPE_PLUS_MONTHLY_PRICE_ID=price_plus_monthly_id
NEXT_PUBLIC_STRIPE_PLUS_YEARLY_PRICE_ID=price_plus_yearly_id

# Stripe Price IDs for Max tier
STRIPE_MAX_MONTHLY_PRICE_ID=price_max_monthly_id
STRIPE_MAX_YEARLY_PRICE_ID=price_max_yearly_id
NEXT_PUBLIC_STRIPE_MAX_MONTHLY_PRICE_ID=price_max_monthly_id
NEXT_PUBLIC_STRIPE_MAX_YEARLY_PRICE_ID=price_max_yearly_id

# Supabase Service Role Key (for webhooks)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3005
```

## Setup Steps

### 1. Run the Database Migration
```bash
# In your Supabase dashboard, go to SQL Editor and run the contents of:
# supabase/migrations/20241031_create_subscriptions.sql
```

### 2. Set up Stripe Products and Prices
1. Create products in Stripe Dashboard:
   - "Plus Plan" - $9.99/month, $99.99/year
   - "Max Plan" - $19.99/month, $199.99/year

2. Copy the price IDs to your environment variables

### 3. Configure Stripe Webhook
1. In Stripe Dashboard, create a webhook endpoint pointing to:
   `https://yourdomain.com/api/webhooks/stripe`

2. Subscribe to these events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

3. Copy the webhook signing secret to your environment variables

### 4. Test the Integration

Use the subscription hook in your components:

```tsx
import { useSubscription } from '@/hooks/useSubscription';

function MyComponent() {
  const { 
    subscription, 
    loading, 
    tier, 
    hasAccess, 
    upgrade 
  } = useSubscription();

  // Check if user has access to premium features
  const canAccessVideos = hasAccess('plus');
  
  // Upgrade user to plus plan
  const handleUpgrade = () => {
    upgrade('price_plus_monthly_id', 'plus');
  };

  return (
    <div>
      <p>Current tier: {tier}</p>
      {canAccessVideos ? (
        <p>You have access to videos!</p>
      ) : (
        <button onClick={handleUpgrade}>
          Upgrade to Plus
        </button>
      )}
    </div>
  );
}
```

## Subscription Tiers

### Free Tier
- 5 questions per day
- Basic practice tests
- Community support

### Plus Tier ($9.99/month)
- Unlimited questions
- Video solutions
- Advanced practice tests
- Study materials
- Email support

### Max Tier ($19.99/month)
- Everything in Plus
- Personalized AI feedback
- Priority support
- Offline access
- Advanced analytics
- Early access to new features

## Key Features

### Automatic Free Tier Enrollment
- New users automatically get a free tier subscription
- Handled by database trigger on user signup

### Row Level Security
- Users can only access their own subscription data
- Service role has full access for webhooks
- Secure by default

### Real-time Updates
- Subscription changes are reflected immediately
- Uses Supabase real-time subscriptions

### Stripe Integration
- Secure checkout sessions
- Automatic subscription management
- Billing portal for self-service

### Feature Access Control
- Easy-to-use helper functions
- Tier-based access control
- Graceful fallbacks

## Testing

1. Test user signup creates free tier subscription
2. Test upgrade flow from free to plus/max
3. Test cancellation and reactivation
4. Test webhook handling with Stripe CLI
5. Test feature access controls

## Production Considerations

1. Use production Stripe keys and webhook secrets
2. Set up proper error monitoring
3. Configure email notifications for payment failures
4. Set up analytics for subscription metrics
5. Test all webhook scenarios thoroughly