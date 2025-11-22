import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { CreateCheckoutSessionRequest, CreateCheckoutSessionResponse } from '@/types/subscription';

// Stripe will be initialized in function to avoid build issues

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Initialize Stripe here to avoid build issues
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-10-29.clover',
    });
    
    const {
      priceId,
      successUrl,
      cancelUrl,
      userId,
      subscriptionTier
    }: CreateCheckoutSessionRequest = await request.json();

    // Validate required fields
    if (!priceId || !successUrl || !cancelUrl || !userId || !subscriptionTier) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get or create Stripe customer
    let customerId: string;
    
    // Check if user already has a Stripe customer ID
    const { data: existingSubscription } = await (supabase as any)
      .from('user_subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    if (existingSubscription?.stripe_customer_id) {
      customerId = existingSubscription.stripe_customer_id;
    } else {
      // Get user email from Supabase auth
      const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(userId);
      
      if (userError || !user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }

      // Create Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          user_id: userId,
        },
      });

      customerId = customer.id;

      // Update user subscription with customer ID
      await (supabase as any)
        .from('user_subscriptions')
        .update({ stripe_customer_id: customerId })
        .eq('user_id', userId);
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        user_id: userId,
        subscription_tier: subscriptionTier,
      },
      subscription_data: {
        metadata: {
          user_id: userId,
          subscription_tier: subscriptionTier,
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });

    const response: CreateCheckoutSessionResponse = {
      success: true,
      sessionId: session.id,
      url: session.url || undefined,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    const response: CreateCheckoutSessionResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };

    return NextResponse.json(response, { status: 500 });
  }
}