import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getMonthlyUsage, getUsageStats } from '../../../lib/usage-tracking';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Verify user exists and get their auth status
    const { data: user, error: userError } = await supabase.auth.admin.getUserById(userId);
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid user' }, { status: 401 });
    }

    // Get current monthly usage and stats
    const [monthlyUsage, usageStats] = await Promise.all([
      getMonthlyUsage(userId),
      getUsageStats(userId)
    ]);

    return NextResponse.json({
      monthlyUsage,
      usageStats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Usage API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}