import { PortfolioItem, PortfolioHistoryEntry } from '../store/portfolioStore';

export interface BehaviorBreakdown {
  overtradingScore: number;
  shortHoldingScore: number;
  lossSellingScore: number;
  timingRiskScore: number;
  finalBehaviorScore: number;
  behaviorLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
}

interface StockTrade {
  symbol: string;
  addTimestamp: number;
  removeTimestamp?: number;
  addPrice: number;
  removePrice?: number;
}

const getLast30DaysHistory = (history: PortfolioHistoryEntry[]): PortfolioHistoryEntry[] => {
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  return history.filter(entry => entry.timestamp >= thirtyDaysAgo);
};

const calculateOvertradingScore = (history: PortfolioHistoryEntry[]): number => {
  const recentHistory = getLast30DaysHistory(history);
  const transactionCount = recentHistory.length;

  if (transactionCount > 10) return 10;
  if (transactionCount > 6) return 7;
  return 3;
};

const calculateShortHoldingScore = (history: PortfolioHistoryEntry[]): number => {
  const recentHistory = getLast30DaysHistory(history);
  
  // Build trade pairs (ADD -> REMOVE)
  const trades: StockTrade[] = [];
  const addMap = new Map<string, { timestamp: number; price: number }[]>();

  recentHistory.forEach(entry => {
    if (entry.action === 'ADD') {
      if (!addMap.has(entry.symbol)) {
        addMap.set(entry.symbol, []);
      }
      addMap.get(entry.symbol)!.push({
        timestamp: entry.timestamp,
        price: entry.price
      });
    } else if (entry.action === 'REMOVE') {
      const adds = addMap.get(entry.symbol);
      if (adds && adds.length > 0) {
        const add = adds.shift()!;
        trades.push({
          symbol: entry.symbol,
          addTimestamp: add.timestamp,
          removeTimestamp: entry.timestamp,
          addPrice: add.price,
          removePrice: entry.price
        });
      }
    }
  });

  if (trades.length === 0) return 3;

  // Calculate average holding duration in days
  const totalDuration = trades.reduce((sum, trade) => {
    if (trade.removeTimestamp) {
      return sum + (trade.removeTimestamp - trade.addTimestamp);
    }
    return sum;
  }, 0);

  const avgDurationMs = totalDuration / trades.length;
  const avgDurationDays = avgDurationMs / (24 * 60 * 60 * 1000);

  if (avgDurationDays < 7) return 10;
  if (avgDurationDays < 15) return 7;
  return 3;
};

const calculateLossSellingScore = (history: PortfolioHistoryEntry[]): number => {
  const recentHistory = getLast30DaysHistory(history);
  
  // Build trade pairs
  const trades: StockTrade[] = [];
  const addMap = new Map<string, { timestamp: number; price: number }[]>();

  recentHistory.forEach(entry => {
    if (entry.action === 'ADD') {
      if (!addMap.has(entry.symbol)) {
        addMap.set(entry.symbol, []);
      }
      addMap.get(entry.symbol)!.push({
        timestamp: entry.timestamp,
        price: entry.price
      });
    } else if (entry.action === 'REMOVE') {
      const adds = addMap.get(entry.symbol);
      if (adds && adds.length > 0) {
        const add = adds.shift()!;
        trades.push({
          symbol: entry.symbol,
          addTimestamp: add.timestamp,
          removeTimestamp: entry.timestamp,
          addPrice: add.price,
          removePrice: entry.price
        });
      }
    }
  });

  if (trades.length === 0) return 3;

  // Count sells at loss
  const sellsAtLoss = trades.filter(trade => {
    if (trade.removePrice && trade.addPrice) {
      return trade.removePrice < trade.addPrice;
    }
    return false;
  }).length;

  const lossPercentage = (sellsAtLoss / trades.length) * 100;

  if (lossPercentage > 50) return 10;
  if (lossPercentage > 30) return 7;
  return 3;
};

const calculateTimingRiskScore = (history: PortfolioHistoryEntry[]): number => {
  const recentHistory = getLast30DaysHistory(history);
  
  // Track sell-then-buy patterns
  const sellMap = new Map<string, number[]>();
  const repeatTradeCount = new Map<string, number>();

  recentHistory.forEach(entry => {
    if (entry.action === 'REMOVE') {
      if (!sellMap.has(entry.symbol)) {
        sellMap.set(entry.symbol, []);
      }
      sellMap.get(entry.symbol)!.push(entry.timestamp);
    } else if (entry.action === 'ADD') {
      const sells = sellMap.get(entry.symbol);
      if (sells && sells.length > 0) {
        // Check if bought within 5 days of selling
        const recentSells = sells.filter(sellTime => {
          const daysDiff = (entry.timestamp - sellTime) / (24 * 60 * 60 * 1000);
          return daysDiff >= 0 && daysDiff <= 5;
        });

        if (recentSells.length > 0) {
          repeatTradeCount.set(
            entry.symbol,
            (repeatTradeCount.get(entry.symbol) || 0) + 1
          );
        }
      }
    }
  });

  const totalRepeatTrades = Array.from(repeatTradeCount.values()).reduce((sum, count) => sum + count, 0);

  if (totalRepeatTrades >= 3) return 10;
  if (totalRepeatTrades >= 1) return 7;
  return 3;
};

export const analyzeBehavior = (
  portfolioItems: PortfolioItem[],
  history: PortfolioHistoryEntry[]
): BehaviorBreakdown => {
  const overtradingScore = calculateOvertradingScore(history);
  const shortHoldingScore = calculateShortHoldingScore(history);
  const lossSellingScore = calculateLossSellingScore(history);
  const timingRiskScore = calculateTimingRiskScore(history);

  const finalBehaviorScore =
    overtradingScore * 0.4 +
    shortHoldingScore * 0.3 +
    lossSellingScore * 0.2 +
    timingRiskScore * 0.1;

  const roundedScore = Math.round(finalBehaviorScore * 10) / 10;

  let behaviorLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
  if (roundedScore < 3) behaviorLevel = 'Low';
  else if (roundedScore < 6) behaviorLevel = 'Moderate';
  else if (roundedScore < 8) behaviorLevel = 'High';
  else behaviorLevel = 'Very High';

  return {
    overtradingScore,
    shortHoldingScore,
    lossSellingScore,
    timingRiskScore,
    finalBehaviorScore: roundedScore,
    behaviorLevel
  };
};
