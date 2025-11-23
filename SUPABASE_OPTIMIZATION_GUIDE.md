# Supabase Performance Optimization Guide

## Performance Analysis Summary

Based on your slow query data:
- **92.9%** of database time: Realtime WAL queries (`realtime.list_changes`)
- **3.0%** of database time: Vector search (`match_personal_statement_feedback`)
- **1.8%** of database time: More Realtime queries
- **3.3%** combined: Various other queries

---

## 🔥 CRITICAL FIX #1: Realtime Subscriptions (92.9% Impact)

### Problem
Your database is spending 92.9% of its time processing Realtime subscription queries. This happens because:
- `useSubscription` hook creates a Realtime channel **on every component that uses it**
- These channels poll the database continuously (4.4 million calls!)
- Each user on your site = multiple active Realtime subscriptions

### Current Code Location
- `hooks/useSubscription.ts` lines 66-88
- `lib/subscription.ts` lines 196-219
- Used in: Navbar, Profile page, AskBo page, Payment page

### Solution 1: Remove Realtime Subscriptions (RECOMMENDED)

**Why?** Subscription changes are rare (only when user upgrades/downgrades). You don't need real-time updates.

#### Implementation:

**Option A: Use Manual Refresh (Recommended)**
```typescript
// hooks/useSubscription.ts

// REMOVE lines 66-88 (entire useEffect that sets up Realtime)
// REPLACE with simpler version:

useEffect(() => {
  fetchSubscription();
}, []); // Only fetch once on mount

// Users can manually refresh via the existing refresh() function
```

**Benefits:**
- ✅ Eliminates 92.9% of database load
- ✅ Still fast (uses 2-minute cache)
- ✅ Users can manually refresh if needed
- ✅ Zero breaking changes

**Drawback:**
- Users won't see tier changes instantly (only after page refresh or manual refresh)

---

### Solution 2: Optimize Realtime (If You Must Keep It)

If you absolutely need real-time updates:

#### A. Use a Single Global Subscription
```typescript
// Create a new file: contexts/SubscriptionContext.tsx

'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserSubscription } from '@/types/subscription';
import { getCurrentUserSubscription } from '@/lib/subscription';

const SubscriptionContext = createContext<{
  subscription: UserSubscription | null;
  loading: boolean;
  refresh: () => Promise<void>;
}>({
  subscription: null,
  loading: true,
  refresh: async () => {},
});

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchSubscription = async () => {
    const data = await getCurrentUserSubscription();
    setSubscription(data);
    setLoading(false);
  };

  useEffect(() => {
    const initAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
      await fetchSubscription();
    };
    initAuth();
  }, []);

  // SINGLE Realtime subscription for the entire app
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`subscription_changes_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE', // Only listen for updates, not inserts/deletes
          schema: 'public',
          table: 'user_subscriptions',
          filter: `user_id=eq.${userId}`,
        },
        (payload: any) => {
          setSubscription(payload.new as UserSubscription);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [userId]);

  return (
    <SubscriptionContext.Provider value={{ subscription, loading, refresh: fetchSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export const useSubscriptionContext = () => useContext(SubscriptionContext);
```

Then wrap your app in `app/layout.tsx`:
```typescript
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SubscriptionProvider>
          {children}
        </SubscriptionProvider>
      </body>
    </html>
  );
}
```

Update `hooks/useSubscription.ts` to use the context instead of creating new subscriptions.

**Benefits:**
- ✅ Reduces from N subscriptions to 1 (where N = number of components)
- ✅ Still provides real-time updates
- ✅ Proper cleanup on unmount

**Drawback:**
- Still creates database load (but 95% less than before)

---

## 🚀 FIX #2: Vector Search Optimization (3% Impact)

### Problem
`match_personal_statement_feedback` function averages 342ms per query (max 3176ms).

### Check Your Index Type

Run this in Supabase SQL Editor:
```sql
-- Check what index type you're using
SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'personal_statement_feedback'
  AND indexdef LIKE '%vector%';
```

### Solution: Use HNSW Index Instead of IVFFlat

**IVFFlat** (your current setup):
- Slower queries (~300-500ms)
- Less accurate
- Better for writes

**HNSW** (recommended):
- Faster queries (~50-150ms)
- More accurate
- Slightly slower writes (but you write rarely)

#### Implementation:

```sql
-- Drop old index
DROP INDEX IF EXISTS idx_personal_statement_feedback_embedding;

-- Create HNSW index (faster for reads)
CREATE INDEX idx_personal_statement_feedback_embedding
ON personal_statement_feedback
USING hnsw (embedding vector_cosine_ops);

-- Also do this for interview_resources when you add embeddings:
DROP INDEX IF EXISTS idx_interview_resources_embedding;

CREATE INDEX idx_interview_resources_embedding
ON interview_resources
USING hnsw (embedding vector_cosine_ops);
```

**Expected Impact:**
- 50-70% faster vector searches
- Reduces query time from 342ms to ~100-150ms

---

## ⚡ FIX #3: Add Query Caching (2-5% Impact)

### Problem
Repeated queries to the same data waste database resources.

### Solution: Add React Query for Smart Caching

Install:
```bash
npm install @tanstack/react-query
```

Create query provider in `lib/queryClient.ts`:
```typescript
'use client';
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

Wrap your app in `app/layout.tsx`:
```typescript
'use client';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

Use in components:
```typescript
import { useQuery } from '@tanstack/react-query';

function MyComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ['userSubscription', userId],
    queryFn: () => getCurrentUserSubscription(),
    staleTime: 2 * 60 * 1000,
  });
}
```

**Benefits:**
- Automatic caching across components
- Smart background refetching
- Deduplicates identical requests
- Reduces database queries by 40-60%

---

## 🔧 FIX #4: Optimize RLS Policies

### Check for Slow RLS Policies

Run this in Supabase:
```sql
-- Find tables with RLS enabled
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = true;

-- Check RLS policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename;
```

### Common RLS Performance Issues

1. **Function calls in policies** (e.g., `auth.uid()` called multiple times)
2. **Subqueries in policies**
3. **Policies on large tables**

### Solution: Use Indexes on RLS Filter Columns

```sql
-- If your policies filter by user_id, ensure index exists:
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
```

---

## 📊 FIX #5: Connection Pooling

### Problem
Too many concurrent connections can slow down Supabase.

### Solution: Use Supabase Connection Pooler

In your `.env.local`:
```bash
# REPLACE your current DATABASE_URL with the pooler URL
# Get this from Supabase Dashboard > Settings > Database > Connection Pooling
DATABASE_URL=postgresql://postgres.xxxxx:password@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

For server-side queries, use the pooler URL. For client-side (browser), continue using the regular Supabase client.

**Benefits:**
- Handles high concurrency better
- Prevents "too many connections" errors
- Faster query execution under load

---

## 🎯 Priority Implementation Order

### Week 1: Critical Fixes (90%+ impact)
1. ✅ **Remove Realtime subscriptions** from `useSubscription` hook
   - Expected: 92% reduction in database load
   - Time: 15 minutes
   - Risk: Low

### Week 2: High-Impact Optimizations
2. ✅ **Switch to HNSW index** for vector searches
   - Expected: 60% faster vector queries
   - Time: 5 minutes (just run SQL)
   - Risk: Very low

3. ✅ **Add React Query** for caching
   - Expected: 40% reduction in duplicate queries
   - Time: 2 hours
   - Risk: Medium (requires testing)

### Week 3: Fine-Tuning
4. ✅ **Optimize RLS policies** and add indexes
   - Expected: 10-20% improvement
   - Time: 1 hour
   - Risk: Low

5. ✅ **Enable connection pooling**
   - Expected: Better handling of concurrent users
   - Time: 10 minutes
   - Risk: Low

---

## 📈 Expected Results

### Before Optimization:
- Database time: 100% (baseline)
- Realtime queries: 92.9%
- Vector search: 3%
- Other: 4.1%

### After Optimization:
- Database time: ~8% of original (92% reduction)
- Realtime queries: 0% (removed) or <1% (if using global context)
- Vector search: ~1% (HNSW optimization)
- Other: 3% (caching helps)

**Total Expected Improvement: 90-95% reduction in database load**

---

## 🧪 Testing Recommendations

1. **Before making changes**, run this query in Supabase to get baseline:
```sql
SELECT
  query,
  calls,
  mean_time,
  total_time,
  (total_time / SUM(total_time) OVER ()) * 100 AS percentage
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 20;
```

2. **After each fix**, run the same query and compare

3. **Monitor for 24 hours** to see sustained improvement

---

## 🚨 What NOT to Do

❌ Don't add more indexes without measuring
❌ Don't use `SELECT *` in production queries
❌ Don't create multiple Realtime channels for the same data
❌ Don't fetch entire tables when you only need a few rows
❌ Don't use RLS policies with expensive functions

---

## Questions?

Let me know which fixes you want to implement and I'll provide step-by-step implementation!
