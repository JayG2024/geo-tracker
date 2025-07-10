import { supabase } from '../lib/supabase';

export interface SubscriptionLimits {
  dailyScans: number;
  projectLimit: number;
  reportRetention: number; // days
  apiAccess: boolean;
  teamMembers: number;
  customBranding: boolean;
}

export const SUBSCRIPTION_TIERS = {
  free: {
    name: 'Free',
    price: 0,
    limits: {
      dailyScans: 3,
      projectLimit: 3,
      reportRetention: 7,
      apiAccess: false,
      teamMembers: 1,
      customBranding: false
    }
  },
  pro: {
    name: 'Professional',
    price: 49,
    limits: {
      dailyScans: 50,
      projectLimit: 25,
      reportRetention: 90,
      apiAccess: true,
      teamMembers: 5,
      customBranding: false
    }
  },
  enterprise: {
    name: 'Enterprise',
    price: 299,
    limits: {
      dailyScans: -1, // Unlimited
      projectLimit: -1, // Unlimited
      reportRetention: 365,
      apiAccess: true,
      teamMembers: -1, // Unlimited
      customBranding: true
    }
  }
};

export class SubscriptionService {
  static async checkScanLimit(userId: string): Promise<{ allowed: boolean; remaining: number; limit: number }> {
    if (!supabase || !userId) {
      return { allowed: true, remaining: 999, limit: 999 }; // Allow if no auth
    }

    try {
      // Get user profile
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('subscription_tier, daily_scans_used, daily_scans_reset_at')
        .eq('id', userId)
        .single();

      if (error || !profile) {
        return { allowed: true, remaining: 3, limit: 3 };
      }

      // Check if we need to reset daily count
      const resetTime = new Date(profile.daily_scans_reset_at);
      const now = new Date();
      const hoursSinceReset = (now.getTime() - resetTime.getTime()) / (1000 * 60 * 60);

      if (hoursSinceReset >= 24) {
        // Use atomic update to prevent race conditions
        const { data: updatedProfile, error: updateError } = await supabase
          .from('profiles')
          .update({ 
            daily_scans_used: 0, 
            daily_scans_reset_at: now.toISOString() 
          })
          .eq('id', userId)
          .eq('daily_scans_reset_at', profile.daily_scans_reset_at) // Only update if reset time hasn't changed
          .select('daily_scans_used, daily_scans_reset_at')
          .single();
        
        if (updateError) {
          console.error('Error resetting scan count:', updateError);
        } else if (updatedProfile) {
          // Only update local profile if the update was successful
          profile.daily_scans_used = updatedProfile.daily_scans_used;
          profile.daily_scans_reset_at = updatedProfile.daily_scans_reset_at;
        }
      }

      // Get tier limits
      const tier = SUBSCRIPTION_TIERS[profile.subscription_tier as keyof typeof SUBSCRIPTION_TIERS] || SUBSCRIPTION_TIERS.free;
      const limit = tier.limits.dailyScans;

      // Unlimited for enterprise
      if (limit === -1) {
        return { allowed: true, remaining: -1, limit: -1 };
      }

      const remaining = Math.max(0, limit - profile.daily_scans_used);
      const allowed = remaining > 0;

      return { allowed, remaining, limit };
    } catch (error) {
      console.error('Error checking scan limit:', error);
      return { allowed: true, remaining: 3, limit: 3 };
    }
  }

  static async incrementScanCount(userId: string): Promise<void> {
    if (!supabase || !userId) return;

    try {
      const { error } = await supabase.rpc('increment', {
        table_name: 'profiles',
        column_name: 'daily_scans_used',
        row_id: userId
      });

      // If RPC doesn't exist, do it manually
      if (error) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('daily_scans_used')
          .eq('id', userId)
          .single();

        if (profile) {
          await supabase
            .from('profiles')
            .update({ daily_scans_used: (profile.daily_scans_used || 0) + 1 })
            .eq('id', userId);
        }
      }
    } catch (error) {
      console.error('Error incrementing scan count:', error);
    }
  }

  static async checkProjectLimit(userId: string): Promise<{ allowed: boolean; current: number; limit: number }> {
    if (!supabase || !userId) {
      return { allowed: true, current: 0, limit: 999 };
    }

    try {
      // Get user's tier
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', userId)
        .single();

      const tier = SUBSCRIPTION_TIERS[profile?.subscription_tier as keyof typeof SUBSCRIPTION_TIERS] || SUBSCRIPTION_TIERS.free;
      const limit = tier.limits.projectLimit;

      // Get current project count
      const { count } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      const current = count || 0;

      // Unlimited for enterprise
      if (limit === -1) {
        return { allowed: true, current, limit: -1 };
      }

      return { 
        allowed: current < limit, 
        current, 
        limit 
      };
    } catch (error) {
      console.error('Error checking project limit:', error);
      return { allowed: true, current: 0, limit: 3 };
    }
  }

  static async getUserTier(userId: string): Promise<keyof typeof SUBSCRIPTION_TIERS> {
    if (!supabase || !userId) return 'free';

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', userId)
        .single();

      return (profile?.subscription_tier as keyof typeof SUBSCRIPTION_TIERS) || 'free';
    } catch (error) {
      console.error('Error getting user tier:', error);
      return 'free';
    }
  }

  static getTierLimits(tier: keyof typeof SUBSCRIPTION_TIERS): SubscriptionLimits {
    return SUBSCRIPTION_TIERS[tier]?.limits || SUBSCRIPTION_TIERS.free.limits;
  }
}