import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * POST /api/referrals/process-rewards
 * Manually process pending referral rewards for a specific user or all users
 * Requires authentication
 */
export async function POST(request: Request) {
  try {
    // Get user ID from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { processAll = false } = body;

    if (processAll) {
      // Process all pending rewards (admin function)
      const { data, error } = await supabase.rpc('process_all_pending_referral_rewards');

      if (error) {
        console.error('Error processing all rewards:', error);
        return NextResponse.json({ error: 'Failed to process rewards' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: 'Processed all pending rewards',
        results: data,
      });
    } else {
      // Process rewards for current user's referrals only
      const { data: referrals, error: fetchError } = await supabase
        .from('referrals')
        .select('id, referred_email, status, reward_granted, discord_verified')
        .eq('referrer_id', user.id)
        .eq('status', 'completed')
        .eq('reward_granted', false);

      if (fetchError) {
        console.error('Error fetching referrals:', fetchError);
        return NextResponse.json({ error: 'Failed to fetch referrals' }, { status: 500 });
      }

      const results = [];
      for (const referral of referrals || []) {
        const { data, error } = await supabase.rpc('process_referral_reward', {
          referral_id_param: referral.id,
        });

        results.push({
          referral_id: referral.id,
          referred_email: referral.referred_email,
          success: !error && data,
          message: error ? error.message : (data ? 'Reward granted' : 'No Discord verification'),
        });
      }

      return NextResponse.json({
        success: true,
        message: `Processed ${results.length} referral(s)`,
        results,
      });
    }
  } catch (error) {
    console.error('Error in process-rewards API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/referrals/process-rewards
 * Get pending rewards status for current user
 */
export async function GET(request: Request) {
  try {
    // Get user ID from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get pending referrals (completed but reward not granted)
    const { data: pendingReferrals, error: pendingError } = await supabase
      .from('referrals')
      .select('id, referred_email, discord_verified, created_at')
      .eq('referrer_id', user.id)
      .eq('status', 'completed')
      .eq('reward_granted', false);

    if (pendingError) {
      console.error('Error fetching pending referrals:', pendingError);
      return NextResponse.json({ error: 'Failed to fetch pending referrals' }, { status: 500 });
    }

    // Get granted rewards
    const { data: grantedReferrals, error: grantedError } = await supabase
      .from('referrals')
      .select('id, referred_email, reward_granted_at, reward_type')
      .eq('referrer_id', user.id)
      .eq('reward_granted', true);

    if (grantedError) {
      console.error('Error fetching granted referrals:', grantedError);
      return NextResponse.json({ error: 'Failed to fetch granted referrals' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      pending: pendingReferrals || [],
      granted: grantedReferrals || [],
      pendingCount: (pendingReferrals || []).length,
      grantedCount: (grantedReferrals || []).length,
    });
  } catch (error) {
    console.error('Error in process-rewards GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
