import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * POST /api/referrals/process-rewards
 *
 * Processes pending referral rewards for a user.
 * This endpoint explicitly triggers reward processing instead of relying on database triggers.
 *
 * Requirements:
 * - User must be authenticated
 * - User must have a Discord username set
 * - User must have a pending referral record
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

    const userId = user.id;

    // Step 1: Check if user has Discord username
    const { data: profile, error: profileError } = await (supabase as any)
      .from('user_profiles')
      .select('discord_username')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return NextResponse.json({
        error: 'Failed to fetch user profile',
        processed: false
      }, { status: 500 });
    }

    if (!profile?.discord_username || profile.discord_username.trim() === '') {
      return NextResponse.json({
        success: false,
        message: 'Discord username required to process referral rewards',
        processed: false
      });
    }

    // Step 2: Find pending referrals where this user is the referred user
    const { data: referrals, error: referralsError } = await (supabase as any)
      .from('referrals')
      .select('id, referrer_id, referred_user_id, status, reward_status')
      .eq('referred_user_id', userId)
      .eq('status', 'pending');

    if (referralsError) {
      console.error('Error fetching referrals:', referralsError);
      return NextResponse.json({
        error: 'Failed to fetch referral records',
        processed: false
      }, { status: 500 });
    }

    if (!referrals || referrals.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No pending referrals to process',
        processed: false
      });
    }

    // Step 3: Process each pending referral
    const results = [];

    for (const referral of referrals) {
      try {
        // Call the database function to process rewards
        const { data: rewardResult, error: rewardError } = await (supabase as any)
          .rpc('process_referral_rewards', { p_referral_id: referral.id });

        if (rewardError) {
          console.error(`Error processing referral ${referral.id}:`, rewardError);
          results.push({
            referralId: referral.id,
            success: false,
            error: rewardError.message
          });
        } else {
          results.push({
            referralId: referral.id,
            success: rewardResult,
            message: rewardResult
              ? 'Rewards processed successfully'
              : 'Reward processing failed (check database logs)'
          });
        }
      } catch (error) {
        console.error(`Unexpected error processing referral ${referral.id}:`, error);
        results.push({
          referralId: referral.id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Check if any rewards were successfully processed
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    return NextResponse.json({
      success: successCount > 0,
      message: `Processed ${successCount} reward(s) successfully${failureCount > 0 ? `, ${failureCount} failed` : ''}`,
      processed: successCount > 0,
      results,
      stats: {
        total: results.length,
        successful: successCount,
        failed: failureCount
      }
    });

  } catch (error) {
    console.error('Error in process-rewards API:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        processed: false,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
