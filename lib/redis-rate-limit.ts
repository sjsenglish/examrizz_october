import { Redis } from '@upstash/redis';
import { NextRequest } from 'next/server';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export type SubscriptionTier = 'free' | 'plus' | 'max';

// Rate limit configurations by tier and feature
export const RATE_LIMITS = {
  // Chat/Bo requests per hour
  chat: {
    free: { requests: 10, windowMs: 60 * 60 * 1000 }, // 10 per hour
    plus: { requests: 50, windowMs: 60 * 60 * 1000 }, // 50 per hour  
    max: { requests: 200, windowMs: 60 * 60 * 1000 }, // 200 per hour
  },
  // File uploads per day
  upload: {
    free: { requests: 3, windowMs: 24 * 60 * 60 * 1000 }, // 3 per day
    plus: { requests: 20, windowMs: 24 * 60 * 60 * 1000 }, // 20 per day
    max: { requests: 100, windowMs: 24 * 60 * 60 * 1000 }, // 100 per day
  },
  // API requests per minute (general)
  api: {
    free: { requests: 30, windowMs: 60 * 1000 }, // 30 per minute
    plus: { requests: 100, windowMs: 60 * 1000 }, // 100 per minute
    max: { requests: 300, windowMs: 60 * 1000 }, // 300 per minute
  },
  // Feature usage requests per hour
  features: {
    free: { requests: 20, windowMs: 60 * 60 * 1000 }, // 20 per hour
    plus: { requests: 100, windowMs: 60 * 60 * 1000 }, // 100 per hour
    max: { requests: 500, windowMs: 60 * 60 * 1000 }, // 500 per hour
  }
} as const;

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  tier: SubscriptionTier;
}

interface RateLimitOptions {
  identifier: string; // user ID or IP
  tier: SubscriptionTier;
  feature: keyof typeof RATE_LIMITS;
  request?: NextRequest; // For IP fallback
}

export async function checkRateLimit(options: RateLimitOptions): Promise<RateLimitResult> {
  const { identifier, tier, feature, request } = options;
  const config = RATE_LIMITS[feature][tier];
  
  // Use identifier (user ID) if available, otherwise fall back to IP
  let key = identifier;
  if (!key || key === 'anonymous') {
    // Get IP from request headers for anonymous users
    key = request?.headers.get('x-forwarded-for') || 
          request?.headers.get('x-real-ip') || 
          request?.headers.get('cf-connecting-ip') ||
          'unknown-ip';
  }
  
  const redisKey = `ratelimit:${feature}:${tier}:${key}`;
  const now = Date.now();
  const window = Math.floor(now / config.windowMs);
  const windowKey = `${redisKey}:${window}`;
  
  try {
    // Use Redis pipeline for atomic operations
    const pipeline = redis.pipeline();
    pipeline.incr(windowKey);
    pipeline.expire(windowKey, Math.ceil(config.windowMs / 1000));
    
    const results = await pipeline.exec();
    const count = results[0] as number;
    
    const remaining = Math.max(0, config.requests - count);
    const resetTime = (window + 1) * config.windowMs;
    
    return {
      success: count <= config.requests,
      limit: config.requests,
      remaining,
      resetTime,
      tier,
    };
  } catch (error) {
    console.error('Redis rate limit error:', error);
    // Fallback to allow request if Redis is down
    return {
      success: true,
      limit: config.requests,
      remaining: config.requests - 1,
      resetTime: now + config.windowMs,
      tier,
    };
  }
}

// Helper function to get user's subscription tier from database
export async function getUserTier(userId: string): Promise<SubscriptionTier> {
  try {
    // Import Supabase client
    const { createClient } = await import('@supabase/supabase-js');
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('tier')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();
    
    return (subscription?.tier as SubscriptionTier) || 'free';
  } catch (error) {
    console.error('Error fetching user tier:', error);
    return 'free'; // Default to free tier on error
  }
}

// Main rate limiting function for API routes
export async function rateLimitApiRequest(
  userId: string | null,
  feature: keyof typeof RATE_LIMITS,
  request: NextRequest
): Promise<RateLimitResult> {
  const tier = userId ? await getUserTier(userId) : 'free';
  const identifier = userId || 'anonymous';
  
  return checkRateLimit({
    identifier,
    tier,
    feature,
    request,
  });
}