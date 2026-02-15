export type UserPlan = 'free' | 'pro';
export type FeatureName = 
  | 'behaviorAnalysis' 
  | 'simulationEngine' 
  | 'advancedInsights' 
  | 'unlimitedPortfolio';

export interface PlanLimits {
  maxPortfolioItems: number;
  features: FeatureName[];
}

export const PLAN_LIMITS: Record<UserPlan, PlanLimits> = {
  free: {
    maxPortfolioItems: 5,
    features: [],
  },
  pro: {
    maxPortfolioItems: Infinity,
    features: ['behaviorAnalysis', 'simulationEngine', 'advancedInsights', 'unlimitedPortfolio'],
  },
};

export function canAccessFeature(userPlan: UserPlan, featureName: FeatureName): boolean {
  return PLAN_LIMITS[userPlan].features.includes(featureName);
}

export function getMaxPortfolioItems(userPlan: UserPlan): number {
  return PLAN_LIMITS[userPlan].maxPortfolioItems;
}

export function canAddMoreStocks(userPlan: UserPlan, currentCount: number): boolean {
  const maxItems = getMaxPortfolioItems(userPlan);
  return currentCount < maxItems;
}

export function getPlanFeatures(plan: UserPlan): string[] {
  if (plan === 'pro') {
    return [
      'Full Risk Intelligence Engine',
      'Behavioral Pattern Analysis',
      'Portfolio Simulation',
      'Advanced Insights & Recommendations',
      'Unlimited Portfolio Items',
      'Priority Support',
    ];
  }
  return [
    'Basic Risk Analysis',
    'Up to 5 Portfolio Items',
    'Sector Distribution',
    'Portfolio Metrics',
  ];
}
