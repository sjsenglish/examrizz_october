import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET: Retrieve user's current subscription
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const { data: subscription, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching subscription:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch subscription' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      subscription
    });

  } catch (error) {
    console.error('Error in GET /api/subscriptions/manage:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Manage subscription (cancel, update, etc.)
export async function POST(request: NextRequest) {
  try {
    const { action, userId, ...params } = await request.json();

    if (!action || !userId) {
      return NextResponse.json(
        { success: false, error: 'Action and userId are required' },
        { status: 400 }
      );
    }

    // Get user's subscription
    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (subError || !subscription) {
      return NextResponse.json(
        { success: false, error: 'Subscription not found' },
        { status: 404 }
      );
    }

    switch (action) {
      case 'cancel': {
        if (!subscription.stripe_subscription_id) {
          return NextResponse.json(
            { success: false, error: 'No active subscription to cancel' },
            { status: 400 }
          );
        }

        // Cancel at period end to allow user to continue using until expiration
        const canceledSubscription = await stripe.subscriptions.update(
          subscription.stripe_subscription_id,
          {
            cancel_at_period_end: true,
          }
        );

        // Update local database
        await supabase
          .from('user_subscriptions')
          .update({
            cancel_at_period_end: true,
          })
          .eq('user_id', userId);

        return NextResponse.json({
          success: true,
          message: 'Subscription will be canceled at the end of the current period',
          subscription: canceledSubscription
        });
      }

      case 'reactivate': {
        if (!subscription.stripe_subscription_id) {
          return NextResponse.json(
            { success: false, error: 'No subscription to reactivate' },
            { status: 400 }
          );
        }

        // Remove cancellation
        const reactivatedSubscription = await stripe.subscriptions.update(
          subscription.stripe_subscription_id,
          {
            cancel_at_period_end: false,
          }
        );

        // Update local database
        await supabase
          .from('user_subscriptions')
          .update({
            cancel_at_period_end: false,
            canceled_at: null,
          })
          .eq('user_id', userId);

        return NextResponse.json({
          success: true,
          message: 'Subscription reactivated successfully',
          subscription: reactivatedSubscription
        });
      }

      case 'create_portal_session': {
        if (!subscription.stripe_customer_id) {
          return NextResponse.json(
            { success: false, error: 'No customer ID found' },
            { status: 400 }
          );
        }

        const { returnUrl } = params;
        
        // Create billing portal session
        const portalSession = await stripe.billingPortal.sessions.create({
          customer: subscription.stripe_customer_id,
          return_url: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment`,
        });

        return NextResponse.json({
          success: true,
          url: portalSession.url
        });
      }

      case 'update_payment_method': {
        if (!subscription.stripe_customer_id) {
          return NextResponse.json(
            { success: false, error: 'No customer ID found' },
            { status: 400 }
          );
        }

        // Create setup intent for updating payment method
        const setupIntent = await stripe.setupIntents.create({
          customer: subscription.stripe_customer_id,
          usage: 'off_session',
        });

        return NextResponse.json({
          success: true,
          client_secret: setupIntent.client_secret
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error in POST /api/subscriptions/manage:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}