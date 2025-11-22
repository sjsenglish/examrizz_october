import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Get users with their profiles and subscription info
    const { data: users, error } = await (supabase as any)
      .from('user_profiles')
      .select(`
        id,
        email,
        full_name,
        discord_id,
        discord_username,
        created_at,
        user_subscriptions (
          subscription_tier,
          subscription_status,
          created_at
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    // Transform the data to include subscription info at the top level
    const transformedUsers = users?.map((user: any) => ({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      discord_id: user.discord_id,
      discord_username: user.discord_username,
      created_at: user.created_at,
      subscription_tier: user.user_subscriptions?.[0]?.subscription_tier || 'free',
      subscription_status: user.user_subscriptions?.[0]?.subscription_status || 'inactive'
    })) || [];

    return NextResponse.json({ 
      users: transformedUsers,
      total: transformedUsers.length 
    });

  } catch (error) {
    console.error('Admin users API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}