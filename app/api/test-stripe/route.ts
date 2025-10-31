import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET() {
  try {
    // Test if Stripe is properly configured
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-06-20',
    });

    // Test API call to verify connection
    const prices = await stripe.prices.list({
      limit: 3,
    });

    return NextResponse.json({
      success: true,
      message: 'Stripe configuration is working!',
      environment: {
        hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
        hasPublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
        plusPriceId: process.env.STRIPE_PLUS_MONTHLY_PRICE_ID || 'Not set',
        maxPriceId: process.env.STRIPE_MAX_MONTHLY_PRICE_ID || 'Not set',
        hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
      pricesFound: prices.data.length,
    });

  } catch (error) {
    console.error('Stripe test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: {
        hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
        hasPublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
        plusPriceId: process.env.STRIPE_PLUS_MONTHLY_PRICE_ID || 'Not set',
        maxPriceId: process.env.STRIPE_MAX_MONTHLY_PRICE_ID || 'Not set',
        hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
    }, { status: 500 });
  }
}