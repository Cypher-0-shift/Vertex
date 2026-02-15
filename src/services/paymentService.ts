import { UserPlan } from '../utils/featureAccess';

export interface UpgradeResult {
  success: boolean;
  message: string;
}

// Mock mode - no Stripe required
const MOCK_MODE = true;

export const paymentService = {
  // Placeholder for Stripe integration
  async createCheckoutSession(userId: string, plan: UserPlan): Promise<string> {
    if (MOCK_MODE) {
      console.log('Mock: Creating checkout session for user:', userId, 'plan:', plan);
      return 'mock-checkout-session-id';
    }

    // TODO: Implement Stripe checkout session creation
    throw new Error('Stripe integration not yet implemented');
  },

  // Mock upgrade for development
  async mockUpgradeToPro(userId: string): Promise<UpgradeResult> {
    try {
      if (MOCK_MODE) {
        // Update localStorage
        const profileKey = `user_${userId}`;
        const stored = localStorage.getItem(profileKey);
        
        if (stored) {
          const profile = JSON.parse(stored);
          profile.plan = 'pro';
          profile.subscriptionStatus = 'active';
          profile.upgradedAt = new Date();
          localStorage.setItem(profileKey, JSON.stringify(profile));
        }

        return {
          success: true,
          message: 'Successfully upgraded to Pro plan!',
        };
      }

      // Real Firebase update would go here
      return {
        success: false,
        message: 'Firebase not configured',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Upgrade failed',
      };
    }
  },

  // Placeholder for webhook handler
  async handleStripeWebhook(event: any): Promise<void> {
    if (MOCK_MODE) {
      console.log('Mock: Stripe webhook event:', event);
      return;
    }

    // TODO: Handle Stripe webhook events
    console.log('Stripe webhook event:', event);
  },

  // Placeholder for subscription management
  async cancelSubscription(userId: string): Promise<UpgradeResult> {
    if (MOCK_MODE) {
      console.log('Mock: Canceling subscription for user:', userId);
      return {
        success: true,
        message: 'Subscription cancelled',
      };
    }

    // TODO: Cancel Stripe subscription
    throw new Error('Stripe integration not yet implemented');
  },

  async updatePaymentMethod(userId: string): Promise<void> {
    if (MOCK_MODE) {
      console.log('Mock: Updating payment method for user:', userId);
      return;
    }

    // TODO: Update payment method in Stripe
    throw new Error('Stripe integration not yet implemented');
  },
};
