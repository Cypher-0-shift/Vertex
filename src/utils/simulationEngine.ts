import { PortfolioItem, PortfolioHistoryEntry } from '../store/portfolioStore';
import { calculatePortfolioRisk, RiskBreakdown } from './riskEngine';
import { calculateCurrentValue } from './calculations';

export interface SimulationResult {
  newRiskScore: number;
  newRiskLevel: string;
  delta: number;
  improved: boolean;
  newRiskBreakdown: RiskBreakdown;
}

export interface RebalanceSuggestion {
  id: string;
  title: string;
  description: string;
  simulatedRiskScore: number;
  delta: number;
  improved: boolean;
  action: 'reduce' | 'add' | 'remove';
  targetSymbol?: string;
  targetAllocation?: number;
}

export const simulatePortfolioAdjustment = (
  originalItems: PortfolioItem[],
  simulatedItems: PortfolioItem[],
  history: PortfolioHistoryEntry[]
): SimulationResult => {
  // Calculate original risk
  const originalRisk = calculatePortfolioRisk(originalItems, history);
  
  // Calculate simulated risk
  const newRiskBreakdown = calculatePortfolioRisk(simulatedItems, history);
  
  const delta = originalRisk.finalScore - newRiskBreakdown.finalScore;
  const improved = delta > 0;

  return {
    newRiskScore: newRiskBreakdown.finalScore,
    newRiskLevel: newRiskBreakdown.riskLevel,
    delta: Math.abs(delta),
    improved,
    newRiskBreakdown
  };
};

export const generateQuickRebalanceOptions = (
  portfolioItems: PortfolioItem[],
  history: PortfolioHistoryEntry[]
): RebalanceSuggestion[] => {
  const suggestions: RebalanceSuggestion[] = [];
  
  if (portfolioItems.length === 0) return suggestions;

  const totalValue = portfolioItems.reduce((sum, item) => sum + calculateCurrentValue(item), 0);
  const currentRisk = calculatePortfolioRisk(portfolioItems, history);

  // Suggestion 1: Reduce top holding to 30%
  const topHolding = portfolioItems.reduce((max, item) => 
    calculateCurrentValue(item) > calculateCurrentValue(max) ? item : max
  );
  const topHoldingValue = calculateCurrentValue(topHolding);
  const topHoldingAllocation = (topHoldingValue / totalValue) * 100;

  if (topHoldingAllocation > 30) {
    const targetValue = totalValue * 0.30;
    const targetQuantity = Math.floor(targetValue / topHolding.currentPrice);
    
    const simulatedItems = portfolioItems.map(item => 
      item.id === topHolding.id 
        ? { ...item, quantity: targetQuantity }
        : item
    );

    const simulation = simulatePortfolioAdjustment(portfolioItems, simulatedItems, history);

    suggestions.push({
      id: 'reduce-top-holding',
      title: `Reduce ${topHolding.name} Allocation`,
      description: `Currently at ${topHoldingAllocation.toFixed(1)}%. Reducing to 30% would lower concentration risk and improve portfolio balance.`,
      simulatedRiskScore: simulation.newRiskScore,
      delta: simulation.delta,
      improved: simulation.improved,
      action: 'reduce',
      targetSymbol: topHolding.symbol,
      targetAllocation: 30
    });
  }

  // Suggestion 2: Remove highest debt stock
  const highDebtStocks = portfolioItems
    .filter(item => item.debtEquity > 1.0)
    .sort((a, b) => b.debtEquity - a.debtEquity);

  if (highDebtStocks.length > 0) {
    const highDebtStock = highDebtStocks[0];
    const simulatedItems = portfolioItems.filter(item => item.id !== highDebtStock.id);

    if (simulatedItems.length > 0) {
      const simulation = simulatePortfolioAdjustment(portfolioItems, simulatedItems, history);

      suggestions.push({
        id: 'remove-high-debt',
        title: `Remove High Debt Stock`,
        description: `${highDebtStock.name} has a debt-to-equity ratio of ${highDebtStock.debtEquity.toFixed(2)}. Removing it would reduce portfolio debt exposure.`,
        simulatedRiskScore: simulation.newRiskScore,
        delta: simulation.delta,
        improved: simulation.improved,
        action: 'remove',
        targetSymbol: highDebtStock.symbol
      });
    }
  }

  // Suggestion 3: Reduce overvalued holdings
  const overvaluedStocks = portfolioItems
    .filter(item => item.peRatio > 40)
    .sort((a, b) => b.peRatio - a.peRatio);

  if (overvaluedStocks.length > 0) {
    const overvaluedStock = overvaluedStocks[0];
    const currentValue = calculateCurrentValue(overvaluedStock);
    const targetValue = currentValue * 0.5; // Reduce by 50%
    const targetQuantity = Math.floor(targetValue / overvaluedStock.currentPrice);

    const simulatedItems = portfolioItems.map(item =>
      item.id === overvaluedStock.id
        ? { ...item, quantity: Math.max(1, targetQuantity) }
        : item
    );

    const simulation = simulatePortfolioAdjustment(portfolioItems, simulatedItems, history);

    suggestions.push({
      id: 'reduce-overvalued',
      title: `Reduce Overvalued Position`,
      description: `${overvaluedStock.name} has a P/E ratio of ${overvaluedStock.peRatio.toFixed(1)}. Reducing exposure would lower valuation risk.`,
      simulatedRiskScore: simulation.newRiskScore,
      delta: simulation.delta,
      improved: simulation.improved,
      action: 'reduce',
      targetSymbol: overvaluedStock.symbol
    });
  }

  // Suggestion 4: Balance sector allocation
  const sectorMap = new Map<string, number>();
  portfolioItems.forEach(item => {
    const value = calculateCurrentValue(item);
    sectorMap.set(item.sector, (sectorMap.get(item.sector) || 0) + value);
  });

  const maxSector = Array.from(sectorMap.entries()).reduce((max, entry) =>
    entry[1] > max[1] ? entry : max
  );
  const maxSectorAllocation = (maxSector[1] / totalValue) * 100;

  if (maxSectorAllocation > 50) {
    const sectorStocks = portfolioItems.filter(item => item.sector === maxSector[0]);
    const largestInSector = sectorStocks.reduce((max, item) =>
      calculateCurrentValue(item) > calculateCurrentValue(max) ? item : max
    );

    const targetValue = calculateCurrentValue(largestInSector) * 0.7;
    const targetQuantity = Math.floor(targetValue / largestInSector.currentPrice);

    const simulatedItems = portfolioItems.map(item =>
      item.id === largestInSector.id
        ? { ...item, quantity: Math.max(1, targetQuantity) }
        : item
    );

    const simulation = simulatePortfolioAdjustment(portfolioItems, simulatedItems, history);

    suggestions.push({
      id: 'balance-sector',
      title: `Reduce ${maxSector[0]} Sector Exposure`,
      description: `${maxSector[0]} sector represents ${maxSectorAllocation.toFixed(1)}% of portfolio. Reducing concentration would improve diversification.`,
      simulatedRiskScore: simulation.newRiskScore,
      delta: simulation.delta,
      improved: simulation.improved,
      action: 'reduce',
      targetSymbol: largestInSector.symbol
    });
  }

  // Sort by improvement (highest delta first)
  return suggestions
    .filter(s => s.improved)
    .sort((a, b) => b.delta - a.delta)
    .slice(0, 3);
};
