import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key for database setup
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(request: NextRequest) {
  try {
    // Check authorization (only allow in development or with admin access)
    const isDevelopment = process.env.NODE_ENV === 'development';
    const authHeader = request.headers.get('Authorization');
    const isAuthorized = isDevelopment || authHeader === `Bearer ${process.env.ADMIN_SECRET_KEY}`;
    
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🔍 Checking user_subscriptions table...');

    // Check if table exists by trying to query it
    const { error: checkError } = await (supabase as any)
      .from('user_subscriptions')
      .select('count', { count: 'exact', head: true });

    if (checkError) {
      console.log('❌ user_subscriptions table does not exist or has issues:', checkError.message);
      
      // If table doesn't exist, we need to create it manually in Supabase SQL editor
      return NextResponse.json({
        success: false,
        error: 'user_subscriptions table does not exist',
        message: 'Please create the user_subscriptions table using the SQL script in /database/create_user_subscriptions_table.sql',
        checkError: checkError.message
      });
    }

    console.log('✅ user_subscriptions table exists');

    // Test if we can query it with a real user
    const { data: testQuery, error: testError } = await (supabase as any)
      .from('user_subscriptions')
      .select('*')
      .limit(1);

    if (testError) {
      console.error('❌ Error querying user_subscriptions:', testError);
      return NextResponse.json({
        success: false,
        error: 'Cannot query user_subscriptions table',
        details: testError.message
      });
    }

    console.log('✅ user_subscriptions table is queryable');

    // Check table structure (simplified)
    let tableStructure = 'Table structure check not implemented';
    try {
      // Try to get column information from information_schema
      const { data: columnInfo, error: columnError } = await (supabase as any)
        .from('information_schema.columns')
        .select('column_name, data_type')
        .eq('table_name', 'user_subscriptions')
        .eq('table_schema', 'public');
      
      if (!columnError && columnInfo) {
        tableStructure = `Found ${columnInfo.length} columns: ${columnInfo.map((c: any) => c.column_name).join(', ')}`;
      }
    } catch (err) {
      tableStructure = 'Unable to fetch table structure';
    }

    return NextResponse.json({
      success: true,
      message: 'Database setup check completed',
      results: {
        tableExists: true,
        tableQueryable: true,
        sampleRowCount: testQuery?.length || 0,
        tableStructure
      }
    });

  } catch (error) {
    console.error('💥 Database setup check failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database setup check failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Same as POST but for easy testing
  return POST(request);
}