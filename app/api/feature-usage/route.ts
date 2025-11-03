import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { canUseFeature, recordFeatureUsage, getFeatureUsageSummary } from '../../../lib/usage-tracking';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const feature = searchParams.get('feature') as 'submit_answer' | 'video_solution';

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Verify user exists
    const { data: user, error: userError } = await supabase.auth.admin.getUserById(userId);
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid user' }, { status: 401 });
    }

    if (feature) {
      // Check specific feature usage
      const usage = await canUseFeature(userId, feature);
      return NextResponse.json({ 
        feature,
        usage,
        timestamp: new Date().toISOString()
      });
    } else {
      // Get summary of all feature usage
      const summary = await getFeatureUsageSummary(userId);
      return NextResponse.json({
        summary,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('Feature Usage API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, feature } = await request.json();

    if (!userId || !feature) {
      return NextResponse.json({ error: 'userId and feature are required' }, { status: 400 });
    }

    if (!['submit_answer', 'video_solution'].includes(feature)) {
      return NextResponse.json({ error: 'Invalid feature type' }, { status: 400 });
    }

    // Verify user exists
    const { data: user, error: userError } = await supabase.auth.admin.getUserById(userId);
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid user' }, { status: 401 });
    }

    // Check if user can use the feature before recording
    const canUse = await canUseFeature(userId, feature);
    
    if (!canUse.allowed) {
      return NextResponse.json({ 
        error: `Feature limit exceeded. ${canUse.remaining} of ${canUse.limit} ${canUse.period}ly uses remaining.`,
        usage: canUse
      }, { status: 402 }); // Payment Required
    }

    // Record the usage
    await recordFeatureUsage(userId, feature);

    // Get updated usage info
    const updatedUsage = await canUseFeature(userId, feature);

    return NextResponse.json({
      success: true,
      feature,
      usage: updatedUsage,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Feature Usage Recording Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}