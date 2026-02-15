import { PortfolioHistoryEntry } from '../store/portfolioStore';
import { BehaviorBreakdown } from './behaviorEngine';

export interface BehaviorInsight {
  title: string;
  description: string;
  severity: 'Low' | 'Moderate' | 'High';
}

const getLast30DaysHistory = (history: PortfolioHistoryEntry[]): PortfolioHistoryEntry[] => {
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  return history.filter(entry => entry.timestamp >= thirtyDaysAgo);
};

export const generateBehaviorInsights = (
  history: PortfolioHistoryEntry[],
  behaviorBreakdown: BehaviorBreakdown
): BehaviorInsight[] => {
  const insights: BehaviorInsight[] = [];
  const recentHistory = getLast30DaysHistory(history);

  // Overtrading Insight
  if (behaviorBreakdown.overtradingScore >= 7) {
    const transactionCount = recentHistory.length;
    insights.push({
      title: 'Frequent Trading Detected',
      description: `You executed ${transactionCount} transactions in the last 30 days. Frequent trading can reduce long-term compounding due to timing inefficiencies and transaction costs. Research shows that long-term investors typically outperform active traders.`,
      severity: behaviorBreakdown.overtradingScore >= 8 ? 'High' : 'Moderate'
    });
  }

  // Short Holding Duration Insight
  if (behaviorBreakdown.shortHoldingScore >= 7) {
    insights.push({
      title: 'Short Holding Periods',
      description: 'Your average holding duration is less than 2 weeks. Quality stocks typically need 6-12 months to demonstrate their fundamental value. Short-term trading often captures noise rather than genuine business performance.',
      severity: behaviorBreakdown.shortHoldingScore >= 8 ? 'High' : 'Moderate'
    });
  }

  // Loss Selling Pattern Insight
  if (behaviorBreakdown.lossSellingScore >= 7) {
    insights.push({
      title: 'Selling at Loss Pattern',
      description: 'A significant portion of your recent sells were at a loss. This may indicate emotional decision-making or insufficient research before buying. Consider setting clear exit criteria before entering positions.',
      severity: behaviorBreakdown.lossSellingScore >= 8 ? 'High' : 'Moderate'
    });
  }

  // Timing Risk Insight
  if (behaviorBreakdown.timingRiskScore >= 7) {
    insights.push({
      title: 'Repeat Trading Pattern',
      description: 'You have bought back stocks shortly after selling them. This pattern suggests uncertainty in decision-making and can lead to unnecessary transaction costs. Develop a clear investment thesis before trading.',
      severity: behaviorBreakdown.timingRiskScore >= 8 ? 'High' : 'Moderate'
    });
  }

  // Positive insights for good behavior
  if (behaviorBreakdown.finalBehaviorScore < 3) {
    insights.push({
      title: 'Disciplined Investment Approach',
      description: 'Your trading patterns demonstrate patience and discipline. You maintain reasonable holding periods and avoid excessive trading. This approach aligns with long-term wealth creation principles.',
      severity: 'Low'
    });
  }

  return insights;
};

export const generateBehaviorSuggestions = (
  behaviorBreakdown: BehaviorBreakdown
): string[] => {
  const suggestions: string[] = [];

  // Overtrading suggestions
  if (behaviorBreakdown.overtradingScore >= 7) {
    suggestions.push('Limit portfolio reviews to once per week to reduce impulsive trading decisions');
    suggestions.push('Set a maximum of 2-3 trades per month unless there are fundamental changes');
  }

  // Short holding suggestions
  if (behaviorBreakdown.shortHoldingScore >= 7) {
    suggestions.push('Adopt a minimum holding period of 6 months for new positions');
    suggestions.push('Focus on business fundamentals rather than short-term price movements');
  }

  // Loss selling suggestions
  if (behaviorBreakdown.lossSellingScore >= 7) {
    suggestions.push('Define clear stop-loss levels (e.g., 15-20%) before buying to avoid emotional decisions');
    suggestions.push('Conduct thorough research before buying to increase conviction during volatility');
  }

  // Timing risk suggestions
  if (behaviorBreakdown.timingRiskScore >= 7) {
    suggestions.push('Wait at least 30 days before re-entering a position you recently exited');
    suggestions.push('Document your investment thesis and exit reasons to avoid repeat mistakes');
  }

  // General behavioral suggestions
  if (behaviorBreakdown.finalBehaviorScore >= 6) {
    suggestions.push('Consider systematic investment plans (SIP) to reduce timing-related decisions');
    suggestions.push('Maintain an investment journal to track decision-making patterns');
    suggestions.push('Review portfolio quarterly instead of daily to reduce emotional reactions');
  }

  // Positive reinforcement
  if (behaviorBreakdown.finalBehaviorScore < 3 && suggestions.length === 0) {
    suggestions.push('Continue your disciplined approach with regular quarterly reviews');
    suggestions.push('Consider gradually increasing position sizes in high-conviction ideas');
  }

  return suggestions;
};
