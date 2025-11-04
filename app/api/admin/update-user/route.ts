import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { userId, tier } = await request.json();

    if (!userId || !tier) {
      return NextResponse.json({ 
        error: 'Missing required fields: userId and tier' 
      }, { status: 400 });
    }

    if (!['free', 'plus', 'max'].includes(tier)) {
      return NextResponse.json({ 
        error: 'Invalid tier. Must be free, plus, or max' 
      }, { status: 400 });
    }

    // Check if user exists
    const { data: userProfile, error: userError } = await supabase
      .from('user_profiles')
      .select('id, email')
      .eq('id', userId)
      .single();

    if (userError || !userProfile) {
      return NextResponse.json({ 
        error: 'User not found' 
      }, { status: 404 });
    }

    // Check if user has existing subscription record
    const { data: existingSubscription, error: subError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (tier === 'free') {
      // Remove premium status
      if (existingSubscription) {
        const { error: deleteError } = await supabase
          .from('user_subscriptions')
          .delete()
          .eq('user_id', userId);

        if (deleteError) {
          console.error('Error removing subscription:', deleteError);
          return NextResponse.json({ 
            error: 'Failed to remove premium status' 
          }, { status: 500 });
        }
      }
    } else {
      // Set premium status
      const subscriptionData = {
        user_id: userId,
        subscription_tier: tier,
        subscription_status: 'active', // Manual admin activation
        stripe_customer_id: null, // Admin-granted, no Stripe
        stripe_subscription_id: null,
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
        cancel_at_period_end: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (existingSubscription) {
        // Update existing subscription
        const { error: updateError } = await supabase
          .from('user_subscriptions')
          .update({
            subscription_tier: tier,
            subscription_status: 'active',
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);

        if (updateError) {
          console.error('Error updating subscription:', updateError);
          return NextResponse.json({ 
            error: 'Failed to update subscription' 
          }, { status: 500 });
        }
      } else {
        // Create new subscription
        const { error: insertError } = await supabase
          .from('user_subscriptions')
          .insert([subscriptionData]);

        if (insertError) {
          console.error('Error creating subscription:', insertError);
          return NextResponse.json({ 
            error: 'Failed to create subscription' 
          }, { status: 500 });
        }
      }
    }

    return NextResponse.json({ 
      success: true,
      message: `User ${userProfile.email} updated to ${tier} tier successfully`
    });

  } catch (error) {
    console.error('Admin update user API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}