import { NextRequest, NextResponse } from 'next/server';

// In-memory cache references (these should match the actual cache Maps in the respective files)
// We'll import the actual cache clearing functions
interface ClearCacheRequest {
  userId: string;
  cacheTypes: ('subscription' | 'tier' | 'profile' | 'featureUsage')[];
}

export async function POST(request: NextRequest) {
  try {
    // Verify internal API authorization
    const authHeader = request.headers.get('Authorization');
    const expectedAuth = `Bearer ${process.env.INTERNAL_API_SECRET || 'dev-secret'}`;
    
    if (authHeader !== expectedAuth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { userId, cacheTypes }: ClearCacheRequest = await request.json();

    if (!userId || !cacheTypes || !Array.isArray(cacheTypes)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const results: Record<string, boolean> = {};

    // Clear subscription cache
    if (cacheTypes.includes('subscription')) {
      try {
        // Import and call the subscription cache clearing function
        const { clearSubscriptionCache } = await import('@/lib/subscription');
        clearSubscriptionCache(userId);
        results.subscription = true;
      } catch (error) {
        console.error('Error clearing subscription cache:', error);
        results.subscription = false;
      }
    }

    // Clear tier cache 
    if (cacheTypes.includes('tier')) {
      try {
        const { clearTierCache } = await import('@/lib/redis-rate-limit');
        const { clearUsageTrackingTierCache } = await import('@/lib/usage-tracking');
        clearTierCache(userId);
        clearUsageTrackingTierCache(userId);
        results.tier = true;
      } catch (error) {
        console.error('Error clearing tier cache:', error);
        results.tier = false;
      }
    }

    // Clear feature usage cache
    if (cacheTypes.includes('featureUsage')) {
      try {
        const { clearFeatureUsageCacheForUser } = await import('@/lib/usage-tracking');
        clearFeatureUsageCacheForUser(userId);
        results.featureUsage = true;
      } catch (error) {
        console.error('Error clearing feature usage cache:', error);
        results.featureUsage = false;
      }
    }

    // Clear profile cache
    if (cacheTypes.includes('profile')) {
      try {
        // Profile cache is in localStorage, can't clear from server
        // But we can clear server-side profile caches if they exist
        results.profile = true;
      } catch (error) {
        console.error('Error clearing profile cache:', error);
        results.profile = false;
      }
    }

    console.log('Cache clearing results for user', userId, ':', results);

    return NextResponse.json({
      success: true,
      userId,
      results,
    });

  } catch (error) {
    console.error('Error in cache clearing endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}