import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { SubscriptionTier, SubscriptionStatus, StripeSubscriptionData } from '@/types/subscription';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

// Initialize Supabase with service role key for webhook operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Service role key for webhook operations
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Map Stripe price IDs to subscription tiers
const PRICE_ID_TO_TIER: Record<string, SubscriptionTier> = {
  'price_1SOIx7RslRN77kT8F5nCPTkg': 'plus', // Plus monthly
  'price_1Rby0mRslRN77kT8vhRtwZJZ': 'max',  // Max monthly
};

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  console.log('Handling subscription update:', subscription.id);
  
  try {
    // Get the price ID to determine the tier
    const priceId = subscription.items.data[0]?.price.id;
    const subscriptionTier = PRICE_ID_TO_TIER[priceId] || 'free';
    
    // Map Stripe status to our status enum
    const subscriptionStatus = subscription.status as SubscriptionStatus;
    
    // Prepare subscription data
    const subscriptionData: StripeSubscriptionData = {
      subscription_id: subscription.id,
      customer_id: subscription.customer as string,
      status: subscriptionStatus,
      current_period_start: subscription.current_period_start,
      current_period_end: subscription.current_period_end,
      cancel_at_period_end: subscription.cancel_at_period_end,
      canceled_at: subscription.canceled_at,
      trial_start: subscription.trial_start,
      trial_end: subscription.trial_end,
    };

    // Find user by Stripe customer ID
    const { data: existingSubscription, error: findError } = await supabase
      .from('user_subscriptions')
      .select('user_id, id')
      .eq('stripe_customer_id', subscriptionData.customer_id)
      .single();

    if (findError && findError.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error finding subscription:', findError);
      throw findError;
    }

    if (existingSubscription) {
      // Update existing subscription
      const { error: updateError } = await supabase
        .from('user_subscriptions')
        .update({
          subscription_tier: subscriptionTier,
          stripe_subscription_id: subscriptionData.subscription_id,
          subscription_status: subscriptionData.status,
          current_period_start: new Date(subscriptionData.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscriptionData.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscriptionData.cancel_at_period_end,
          canceled_at: subscriptionData.canceled_at 
            ? new Date(subscriptionData.canceled_at * 1000).toISOString() 
            : null,
          trial_start: subscriptionData.trial_start 
            ? new Date(subscriptionData.trial_start * 1000).toISOString() 
            : null,
          trial_end: subscriptionData.trial_end 
            ? new Date(subscriptionData.trial_end * 1000).toISOString() 
            : null,
        })
        .eq('id', existingSubscription.id);

      if (updateError) {
        console.error('Error updating subscription:', updateError);
        throw updateError;
      }

      console.log('Successfully updated subscription for user:', existingSubscription.user_id);
    } else {
      console.log('No existing subscription found for customer:', subscriptionData.customer_id);
      // This case should be rare since we create customer records during checkout
    }

  } catch (error) {
    console.error('Error in handleSubscriptionUpdate:', error);
    throw error;
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Handling subscription deletion:', subscription.id);
  
  try {
    // Update subscription to canceled status and downgrade to free tier
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        subscription_tier: 'free',
        subscription_status: 'canceled',
        canceled_at: new Date().toISOString(),
        current_period_end: new Date().toISOString(), // End immediately
      })
      .eq('stripe_subscription_id', subscription.id);

    if (error) {
      console.error('Error handling subscription deletion:', error);
      throw error;
    }

    console.log('Successfully handled subscription deletion');
  } catch (error) {
    console.error('Error in handleSubscriptionDeleted:', error);
    throw error;
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('Handling checkout completion:', session.id);
  
  try {
    const { customer, subscription, metadata } = session;
    
    if (!customer || !subscription) {
      console.error('Missing customer or subscription in checkout session');
      return;
    }

    const customerId = typeof customer === 'string' ? customer : customer.id;
    const subscriptionId = typeof subscription === 'string' ? subscription : subscription.id;
    const userId = metadata?.user_id;

    if (!userId) {
      console.error('Missing user_id in session metadata');
      return;
    }

    // Update the user's subscription with Stripe IDs
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating subscription after checkout:', error);
      throw error;
    }

    // Now fetch the full subscription details to update the tier and status
    const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
    await handleSubscriptionUpdate(stripeSubscription);

    console.log('Successfully handled checkout completion for user:', userId);
  } catch (error) {
    console.error('Error in handleCheckoutCompleted:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('Missing Stripe signature');
      return NextResponse.json(
        { error: 'Missing Stripe signature' },
        { status: 400 }
      );
    }

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    console.log('Received Stripe webhook event:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'invoice.payment_succeeded':
        // Handle successful payment (optional: send confirmation email)
        console.log('Payment succeeded for subscription');
        break;

      case 'invoice.payment_failed':
        // Handle failed payment (optional: send notification)
        console.log('Payment failed for subscription');
        break;

      default:
        console.log('Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}