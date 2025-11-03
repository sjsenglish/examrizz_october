import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Usage limits per tier (in USD)
export const USAGE_LIMITS = {
  free: 2.00,
  plus: 6.00,
  max: 12.00
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

// Get user's subscription tier
export async function getUserSubscriptionTier(userId: string): Promise<'free' | 'plus' | 'max'> {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('subscription_tier, subscription_status')
    .eq('user_id', userId)
    .single()

  if (error || !data) {
    return 'free'
  }

  // Only active/trialing subscriptions get their tier benefits
  if (data.subscription_status === 'active' || data.subscription_status === 'trialing') {
    return data.subscription_tier as 'free' | 'plus' | 'max'
  }

  return 'free'
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
    return {
      total_cost: 0,
      total_tokens: 0,
      limit,
      remaining: limit,
      percentage_used: 0
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

  if (projectedCost > usage.limit) {
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

  const { data, error } = await supabase
    .from('feature_usage_tracking')
    .select('id')
    .eq('user_id', userId)
    .eq('feature', feature)
    .eq(filterField, filterValue)

  if (error) {
    console.error('Error checking feature usage:', error)
    return {
      allowed: false,
      remaining: 0,
      limit,
      period
    }
  }

  const usageCount = data?.length || 0
  const remaining = Math.max(0, limit - usageCount)
  const allowed = usageCount < limit

  return {
    allowed,
    remaining,
    limit,
    period
  }
}

// Get feature usage summary for user
export async function getFeatureUsageSummary(userId: string) {
  const submitAnswerUsage = await canUseFeature(userId, 'submit_answer')
  const videoSolutionUsage = await canUseFeature(userId, 'video_solution')
  const tier = await getUserSubscriptionTier(userId)

  return {
    tier,
    submit_answer: submitAnswerUsage,
    video_solution: videoSolutionUsage
  }
}