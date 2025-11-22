import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

    const userId = user.id;

    // Get user's referral code
    const { data: referralCodeData, error: codeError } = await (supabase as any)
      .from('referral_codes')
      .select('referral_code')
      .eq('user_id', userId)
      .single();

    if (codeError) {
      console.error('Error fetching referral code:', codeError);
      return NextResponse.json({ error: 'Failed to fetch referral code' }, { status: 500 });
    }

    // Get list of referrals with user details and reward status
    const { data: referralsData, error: referralsError } = await (supabase as any)
      .from('referrals')
      .select(`
        id,
        referred_email,
        status,
        created_at,
        completed_at,
        reward_status,
        referrer_rewarded_at,
        referred_rewarded_at
      `)
      .eq('referrer_id', userId)
      .order('created_at', { ascending: false });

    if (referralsError) {
      console.error('Error fetching referrals:', referralsError);
      return NextResponse.json({ error: 'Failed to fetch referrals' }, { status: 500 });
    }

    // Calculate stats
    const totalReferrals = referralsData?.length || 0;
    const completedReferrals = referralsData?.filter((r: any) => r.status === 'completed').length || 0;
    const pendingReferrals = referralsData?.filter((r: any) => r.status === 'pending').length || 0;

    return NextResponse.json({
      success: true,
      referralCode: referralCodeData?.referral_code,
      stats: {
        total: totalReferrals,
        completed: completedReferrals,
        pending: pendingReferrals,
      },
      referrals: referralsData || [],
    });
  } catch (error) {
    console.error('Error in referrals API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
