import { supabase } from '@/lib/supabase-client';
import { UserSubscription } from '@/types/subscription';

/**
 * Ensures a user has a subscription record, creating a default 'free' one if none exists
 */
export async function ensureUserSubscription(userId: string): Promise<UserSubscription | null> {
  try {
    // First try to get existing subscription
    const { data: existingSubscription, error: fetchError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    // If subscription exists, return it
    if (existingSubscription && !fetchError) {
      return existingSubscription;
    }

    // If error is not "not found", something else is wrong
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching subscription:', fetchError);
      return null;
    }

    // No subscription exists, create a default 'free' one
    console.log('Creating default free subscription for user:', userId);
    
    const defaultSubscription = {
      user_id: userId,
      subscription_tier: 'free' as const,
      subscription_status: 'active' as const,
      cancel_at_period_end: false,
    };

    const { data: newSubscription, error: createError } = await supabase
      .from('user_subscriptions')
      .insert(defaultSubscription)
      .select()
      .single();

    if (createError) {
      console.error('Error creating default subscription:', createError);
      return null;
    }

    console.log('Successfully created default subscription:', newSubscription);
    return newSubscription;

  } catch (error) {
    console.error('Unexpected error in ensureUserSubscription:', error);
    return null;
  }
}

/**
 * Check if user exists and has proper authentication
 */
export async function getCurrentUserWithSubscription(): Promise<{
  user: any;
  subscription: UserSubscription | null;
  error?: string;
}> {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return {
        user: null,
        subscription: null,
        error: 'Not authenticated'
      };
    }

    // Ensure user has subscription record
    const subscription = await ensureUserSubscription(user.id);

    return {
      user,
      subscription,
      error: subscription ? undefined : 'Failed to create subscription record'
    };

  } catch (error) {
    console.error('Error in getCurrentUserWithSubscription:', error);
    return {
      user: null,
      subscription: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}