import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Usage limits per tier (in USD)
// NOTE: For Plus and Max tiers, limits are combined for ALL services (askbo, interview, etc.) per user per month
// NOTE: For Free tier, message-based limits apply instead (see MESSAGE_LIMITS below)
export const USAGE_LIMITS = {
  free: 1.00, // Not used for free tier - see MESSAGE_LIMITS instead
  plus: 6.00,
  max: 12.00
} as const

// Message limits per tier per service (Free tier only)
// NOTE: Free users have separate message limits for each service
export const MESSAGE_LIMITS = {
  askbo: {
    free: 5,    // 5 messages per month
    plus: -1,   // unlimited (cost-based limits apply)
    max: -1     // unlimited (cost-based limits apply)
  },
  interview: {
    free: 5,    // 5 messages per month
    plus: -1,   // unlimited (cost-based limits apply)
    max: -1     // unlimited (cost-based limits apply)
  }
} as const

// Feature usage limits per tier
export const FEATURE_LIMITS = {
  submit_answer: {
    free: 1,    // 1 per month
    plus: 10,   // 10 per month
    max: -1     // unlimited (-1 means no limit)
  },
  video_solution: {
    free: 1,    // 1 per day
    plus: -1,   // unlimited
    max: -1     // unlimited
  }
} as const

// Estimated cost per token (rough estimate for OpenAI/Anthropic)
export const COST_PER_1K_TOKENS = {
  input: 0.003,  // $0.003 per 1K input tokens
  output: 0.015  // $0.015 per 1K output tokens
} as const

export interface UsageRecord {
  id: string
  user_id: string
  service: 'askbo' | 'other'
  tokens_used: number
  cost_usd: number
  created_at: string
  month_year: string // Format: 'YYYY-MM'
}

export interface MessageUsageRecord {
  id: string
  user_id: string
  service: 'askbo' | 'interview'
  created_at: string
  month_year: string // Format: 'YYYY-MM'
}

export interface FeatureUsageRecord {
  id: string
  user_id: string
  feature: 'submit_answer' | 'video_solution'
  created_at: string
  month_year: string // Format: 'YYYY-MM'
  day_date: string // Format: 'YYYY-MM-DD'
}

export interface MonthlyUsage {
  total_cost: number
  total_tokens: number
  limit: number
  remaining: number
  percentage_used: number
}

// In-memory cache for subscription tiers (5 minute TTL)
const tierCache = new Map<string, { tier: 'free' | 'plus' | 'max', timestamp: number }>()
const TIER_CACHE_TTL = 5 * 60 * 1000 // 5 minutes

// In-memory cache for feature usage (1 minute TTL)
const featureUsageCache = new Map<string, { count: number, timestamp: number }>()
const FEATURE_USAGE_CACHE_TTL = 60 * 1000 // 1 minute

// Get user's subscription tier (with caching)
export async function getUserSubscriptionTier(userId: string): Promise<'free' | 'plus' | 'max'> {
  // Check cache first
  const cached = tierCache.get(userId)
  const now = Date.now()
  
  if (cached && (now - cached.timestamp) < TIER_CACHE_TTL) {
    return cached.tier
  }

  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('subscription_tier, subscription_status')
    .eq('user_id', userId)
    .single()

  let tier: 'free' | 'plus' | 'max' = 'free'

  if (data && !error) {
    // Only active/trialing subscriptions get their tier benefits
    if (data.subscription_status === 'active' || data.subscription_status === 'trialing') {
      tier = data.subscription_tier as 'free' | 'plus' | 'max'
    }
  }

  // Cache the result
  tierCache.set(userId, { tier, timestamp: now })
  
  // Cleanup old cache entries periodically
  if (tierCache.size > 1000) { // Prevent memory bloat
    const cutoff = now - TIER_CACHE_TTL
    for (const [key, value] of tierCache.entries()) {
      if (value.timestamp < cutoff) {
        tierCache.delete(key)
      }
    }
  }

  return tier
}

// Get cached feature usage count (with caching)
async function getCachedFeatureUsageCount(
  userId: string, 
  feature: 'submit_answer' | 'video_solution',
  filterField: string,
  filterValue: string
): Promise<number> {
  const cacheKey = `${userId}:${feature}:${filterValue}`
  const cached = featureUsageCache.get(cacheKey)
  const now = Date.now()

  if (cached && (now - cached.timestamp) < FEATURE_USAGE_CACHE_TTL) {
    return cached.count
  }

  const { data, error } = await supabase
    .from('feature_usage_tracking')
    .select('id')
    .eq('user_id', userId)
    .eq('feature', feature)
    .eq(filterField, filterValue)

  if (error) {
    console.error('Error checking feature usage:', error)
    return 0
  }

  const count = data?.length || 0
  
  // Cache the result
  featureUsageCache.set(cacheKey, { count, timestamp: now })
  
  // Cleanup old cache entries periodically
  if (featureUsageCache.size > 1000) {
    const cutoff = now - FEATURE_USAGE_CACHE_TTL
    for (const [key, value] of featureUsageCache.entries()) {
      if (value.timestamp < cutoff) {
        featureUsageCache.delete(key)
      }
    }
  }

  return count
}

// Invalidate feature usage cache for a user/feature combination
function invalidateFeatureUsageCache(userId: string, feature: 'submit_answer' | 'video_solution') {
  const now = new Date()
  const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const dayDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  
  // Invalidate both monthly and daily cache entries for this user/feature
  featureUsageCache.delete(`${userId}:${feature}:${monthYear}`)
  featureUsageCache.delete(`${userId}:${feature}:${dayDate}`)
}

// Record usage for a user
export async function recordUsage(
  userId: string,
  service: 'askbo' | 'other',
  inputTokens: number,
  outputTokens: number
): Promise<void> {
  const inputCost = (inputTokens / 1000) * COST_PER_1K_TOKENS.input
  const outputCost = (outputTokens / 1000) * COST_PER_1K_TOKENS.output
  const totalCost = inputCost + outputCost
  const totalTokens = inputTokens + outputTokens

  const now = new Date()
  const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const { error } = await supabase
    .from('usage_tracking')
    .insert({
      user_id: userId,
      service,
      tokens_used: totalTokens,
      cost_usd: totalCost,
      month_year: monthYear
    })

  if (error) {
    console.error('Error recording usage:', error)
    throw new Error('Failed to record usage')
  }
}

// Verify usage after recording to catch race conditions
// This should be called AFTER recording usage to check if concurrent requests caused limit breach
export async function verifyUsageWithinLimit(userId: string): Promise<{
  withinLimit: boolean;
  usage: MonthlyUsage;
  overage?: number;
}> {
  const usage = await getMonthlyUsage(userId)
  const withinLimit = usage.total_cost < usage.limit

  if (!withinLimit) {
    const overage = usage.total_cost - usage.limit
    console.warn(`User ${userId} exceeded monthly limit. Total: $${usage.total_cost.toFixed(4)}, Limit: $${usage.limit.toFixed(2)}, Overage: $${overage.toFixed(4)}`)

    return {
      withinLimit: false,
      usage,
      overage
    }
  }

  return {
    withinLimit: true,
    usage
  }
}

// Get user's monthly usage
export async function getMonthlyUsage(userId: string): Promise<MonthlyUsage> {
  const now = new Date()
  const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  // Get user's subscription tier
  const tier = await getUserSubscriptionTier(userId)
  const limit = USAGE_LIMITS[tier]

  // Get total usage for this month
  const { data, error } = await supabase
    .from('usage_tracking')
    .select('cost_usd, tokens_used')
    .eq('user_id', userId)
    .eq('month_year', monthYear)

  if (error) {
    console.error('Error getting monthly usage:', error)
    // SECURITY: On database errors, assume limit is reached to prevent abuse
    // This is more conservative than returning 0 cost which would allow unlimited usage
    return {
      total_cost: limit,
      total_tokens: 0,
      limit,
      remaining: 0,
      percentage_used: 100
    }
  }

  const totalCost = data?.reduce((sum, record) => sum + record.cost_usd, 0) || 0
  const totalTokens = data?.reduce((sum, record) => sum + record.tokens_used, 0) || 0
  const remaining = Math.max(0, limit - totalCost)
  const percentageUsed = (totalCost / limit) * 100

  return {
    total_cost: totalCost,
    total_tokens: totalTokens,
    limit,
    remaining,
    percentage_used: Math.min(100, percentageUsed)
  }
}

// Check if user has exceeded their usage limit
export async function hasExceededLimit(userId: string): Promise<boolean> {
  const usage = await getMonthlyUsage(userId)
  return usage.total_cost >= usage.limit
}

// Check if user can make a request (with estimated cost)
export async function canMakeRequest(
  userId: string, 
  estimatedInputTokens: number, 
  estimatedOutputTokens: number
): Promise<{ allowed: boolean; reason?: string; usage: MonthlyUsage }> {
  const usage = await getMonthlyUsage(userId)
  
  const estimatedInputCost = (estimatedInputTokens / 1000) * COST_PER_1K_TOKENS.input
  const estimatedOutputCost = (estimatedOutputTokens / 1000) * COST_PER_1K_TOKENS.output
  const estimatedTotalCost = estimatedInputCost + estimatedOutputCost

  const projectedCost = usage.total_cost + estimatedTotalCost

  // Use >= for consistency with hasExceededLimit() function
  if (projectedCost >= usage.limit) {
    return {
      allowed: false,
      reason: `This request would exceed your monthly limit of $${usage.limit.toFixed(2)}. Current usage: $${usage.total_cost.toFixed(2)}`,
      usage
    }
  }

  return {
    allowed: true,
    usage
  }
}

// Get usage statistics for admin/user dashboard
export async function getUsageStats(userId: string) {
  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  
  // Get last 6 months of usage
  const months = []
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`)
  }

  const { data, error } = await supabase
    .from('usage_tracking')
    .select('month_year, cost_usd, tokens_used, service, created_at')
    .eq('user_id', userId)
    .in('month_year', months)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error getting usage stats:', error)
    return null
  }

  return {
    currentMonth: await getMonthlyUsage(userId),
    historicalData: data,
    tier: await getUserSubscriptionTier(userId)
  }
}

// Record feature usage (submit_answer or video_solution)
export async function recordFeatureUsage(
  userId: string,
  feature: 'submit_answer' | 'video_solution'
): Promise<void> {
  const now = new Date()
  const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const dayDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

  const { error } = await supabase
    .from('feature_usage_tracking')
    .insert({
      user_id: userId,
      feature,
      month_year: monthYear,
      day_date: dayDate
    })

  if (error) {
    console.error('Error recording feature usage:', error)
    throw new Error('Failed to record feature usage')
  }

  // Invalidate cache since usage count has changed
  invalidateFeatureUsageCache(userId, feature)
}

// Check if user can use a feature
export async function canUseFeature(
  userId: string,
  feature: 'submit_answer' | 'video_solution'
): Promise<{ allowed: boolean; remaining: number; limit: number; period: 'month' | 'day' }> {
  const tier = await getUserSubscriptionTier(userId)
  const limit = FEATURE_LIMITS[feature][tier]
  
  // If limit is -1, it means unlimited
  if (limit === -1) {
    return {
      allowed: true,
      remaining: -1,
      limit: -1,
      period: feature === 'submit_answer' ? 'month' : 'day'
    }
  }

  const now = new Date()
  let filterField: string
  let filterValue: string
  let period: 'month' | 'day'

  if (feature === 'submit_answer') {
    // Check monthly usage
    filterField = 'month_year'
    filterValue = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    period = 'month'
  } else {
    // Check daily usage for video solutions
    filterField = 'day_date'
    filterValue = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    period = 'day'
  }

  const usageCount = await getCachedFeatureUsageCount(userId, feature, filterField, filterValue)
  const remaining = Math.max(0, limit - usageCount)
  const allowed = usageCount < limit

  return {
    allowed,
    remaining,
    limit,
    period
  }
}

// Get feature usage summary for user (optimized version)
export async function getFeatureUsageSummary(userId: string) {
  // Get subscription tier once
  const tier = await getUserSubscriptionTier(userId)
  
  // Prepare date filters
  const now = new Date()
  const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const dayDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  
  // Get cached usage counts in parallel
  const [submitAnswerCount, videoSolutionCount] = await Promise.all([
    getCachedFeatureUsageCount(userId, 'submit_answer', 'month_year', monthYear),
    getCachedFeatureUsageCount(userId, 'video_solution', 'day_date', dayDate)
  ])

  // Calculate submit_answer usage
  const submitAnswerLimit = FEATURE_LIMITS.submit_answer[tier]
  const submitAnswerRemaining = submitAnswerLimit === -1 ? -1 : Math.max(0, submitAnswerLimit - submitAnswerCount)
  const submitAnswerAllowed = submitAnswerLimit === -1 || submitAnswerCount < submitAnswerLimit

  // Calculate video_solution usage
  const videoSolutionLimit = FEATURE_LIMITS.video_solution[tier]
  const videoSolutionRemaining = videoSolutionLimit === -1 ? -1 : Math.max(0, videoSolutionLimit - videoSolutionCount)
  const videoSolutionAllowed = videoSolutionLimit === -1 || videoSolutionCount < videoSolutionLimit

  return {
    tier,
    submit_answer: {
      allowed: submitAnswerAllowed,
      remaining: submitAnswerRemaining,
      limit: submitAnswerLimit,
      period: 'month' as const
    },
    video_solution: {
      allowed: videoSolutionAllowed,
      remaining: videoSolutionRemaining,
      limit: videoSolutionLimit,
      period: 'day' as const
    }
  }
}

/**
 * Clear all feature usage cache entries for a specific user
 */
export function clearFeatureUsageCacheForUser(userId: string) {
  let clearedCount = 0;
  for (const [key, value] of featureUsageCache.entries()) {
    if (key.startsWith(`${userId}:`)) {
      featureUsageCache.delete(key);
      clearedCount++;
    }
  }
  console.log(`Cleared ${clearedCount} feature usage cache entries for user:`, userId);
}

/**
 * Clear tier cache for a specific user (also clear usage tracking tier cache)
 */
export function clearUsageTrackingTierCache(userId: string) {
  tierCache.delete(userId);
  console.log('Cleared usage tracking tier cache for user:', userId);
}

/**
 * Get user's monthly message count for a specific service
 */
export async function getMonthlyMessageCount(
  userId: string,
  service: 'askbo' | 'interview'
): Promise<number> {
  const now = new Date()
  const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const { data, error } = await supabase
    .from('message_usage_tracking')
    .select('id')
    .eq('user_id', userId)
    .eq('service', service)
    .eq('month_year', monthYear)

  if (error) {
    console.error('Error getting monthly message count:', error)
    // On error, assume limit reached (conservative approach)
    return 999999
  }

  return data?.length || 0
}

/**
 * Check if user can send a message for a specific service
 * Free users: message-based limits per service
 * Plus/Max users: cost-based limits (checked separately)
 */
export async function canSendMessage(
  userId: string,
  service: 'askbo' | 'interview'
): Promise<{ allowed: boolean; reason?: string; remaining: number; limit: number }> {
  const tier = await getUserSubscriptionTier(userId)

  // Plus and Max users use cost-based limits, not message limits
  if (tier !== 'free') {
    return {
      allowed: true,
      remaining: -1, // unlimited messages (cost-based limits apply separately)
      limit: -1
    }
  }

  // Free users: check message limits
  const limit = MESSAGE_LIMITS[service].free
  const currentCount = await getMonthlyMessageCount(userId, service)
  const remaining = Math.max(0, limit - currentCount)

  if (currentCount >= limit) {
    return {
      allowed: false,
      reason: `You've reached your monthly limit of ${limit} messages for ${service === 'askbo' ? 'Bo Chat' : 'Interview Chat'}. Upgrade to Plus for unlimited messages.`,
      remaining: 0,
      limit
    }
  }

  return {
    allowed: true,
    remaining,
    limit
  }
}

/**
 * Record a message usage for a specific service
 */
export async function recordMessageUsage(
  userId: string,
  service: 'askbo' | 'interview'
): Promise<void> {
  const now = new Date()
  const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const { error } = await supabase
    .from('message_usage_tracking')
    .insert({
      user_id: userId,
      service,
      month_year: monthYear
    })

  if (error) {
    console.error('Error recording message usage:', error)
    throw new Error('Failed to record message usage')
  }
}