#!/usr/bin/env npx ts-node

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

// Load environment variables from .env.local
config({ path: path.join(__dirname, '..', '.env.local') });

// Use service role key to test database
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

async function testDatabase() {
  console.log('🔍 Testing user_subscriptions table...\n');

  try {
    // Test 1: Check if table exists
    console.log('Test 1: Checking if table exists...');
    const { data: tableCheck, error: tableError } = await (supabase as any)
      .from('user_subscriptions')
      .select('count', { count: 'exact', head: true });

    if (tableError) {
      console.log('❌ Table check failed:', tableError.message);
      console.log('💡 The user_subscriptions table likely does not exist.');
      console.log('📝 Please run the SQL script in database/create_user_subscriptions_table.sql in your Supabase SQL editor.\n');
      return false;
    }

    console.log('✅ Table exists\n');

    // Test 2: Try to query the table
    console.log('Test 2: Querying table...');
    const { data: queryData, error: queryError, count } = await (supabase as any)
      .from('user_subscriptions')
      .select('*', { count: 'exact' })
      .limit(5);

    if (queryError) {
      console.log('❌ Query failed:', queryError.message);
      console.log('💡 This might be a permissions (RLS) issue.\n');
      return false;
    }

    console.log(`✅ Query successful. Found ${count || 0} subscription records.`);
    if (queryData && queryData.length > 0) {
      console.log('📊 Sample data:', queryData[0]);
    }
    console.log('');

    // Test 3: Try to query with user authentication (simulated)
    console.log('Test 3: Testing user-based query...');
    
    // Get a real user ID from auth.users if available
    const { data: users, error: usersError } = await (supabase as any)
      .from('auth.users')
      .select('id')
      .limit(1);

    if (usersError || !users || users.length === 0) {
      console.log('⚠️  No users found in auth.users table');
      console.log('💡 This is normal if no users have signed up yet.\n');
    } else {
      const testUserId = users[0].id;
      console.log(`Testing with user ID: ${testUserId}`);

      const { data: userSubData, error: userSubError } = await (supabase as any)
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', testUserId)
        .single();

      if (userSubError && userSubError.code !== 'PGRST116') {
        console.log('❌ User subscription query failed:', userSubError.message);
        return false;
      }

      if (userSubError && userSubError.code === 'PGRST116') {
        console.log('📝 User has no subscription record (this is normal for new users)');
      } else {
        console.log('✅ User subscription query successful');
        console.log('📊 User subscription data:', userSubData);
      }
    }

    console.log('\n🎉 All database tests passed!');
    return true;

  } catch (error) {
    console.error('💥 Unexpected error:', error);
    return false;
  }
}

// Check environment variables
function checkEnvVars() {
  const required = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
  const missing = required.filter((key: any) => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing environment variables:', missing.join(', '));
    console.error('💡 Make sure you have a .env.local file with these variables.');
    return false;
  }
  
  return true;
}

// Main execution
async function main() {
  console.log('🚀 Starting database test...\n');
  
  if (!checkEnvVars()) {
    process.exit(1);
  }

  const success = await testDatabase();
  
  if (success) {
    console.log('\n✅ Database is properly configured!');
    process.exit(0);
  } else {
    console.log('\n❌ Database configuration issues found.');
    console.log('📖 Check the logs above for specific issues and solutions.');
    process.exit(1);
  }
}

main().catch(console.error);