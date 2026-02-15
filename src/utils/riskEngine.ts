import { PortfolioItem, PortfolioHistoryEntry } from '../store/portfolioStore';
import { calculateCurrentValue } from './calculations';

export interface RiskBreakdown {
  concentrationRisk: number;
  sectorRisk: number;
  debtRisk: number;
  valuationRisk: number;
  behavioralRisk: number;
  finalScore: number;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
}

const SECTOR_AVG_PE: Record<string, number> = {
  'IT': 28.0,
  'Banking': 18.0,
  'Energy': 20.0,
  'FMCG': 45.0,
  'Infrastructure': 30.0,
  'Pharma': 32.0,
  'Automobile': 22.0,
  'Metals': 15.0
};

const calculateConcentrationRisk = (items: PortfolioItem[]): number => {
  if (items.length === 0) return 0;

  const totalValue = items.reduce((sum, item) => sum + calculateCurrentValue(item), 0);
  if (totalValue === 0) return 0;

  const maxAllocation = Math.max(
    ...items.map(item => (calculateCurrentValue(item) / totalValue) * 100)
  );

  if (maxAllocation > 40) return 10;
  if (maxAllocation > 30) return 7;
  return 3;
};

const calculateSectorRisk = (items: PortfolioItem[]): number => {
  if (items.length === 0) return 0;

  const sectorMap = new Map<string, number>();
  let totalValue = 0;

  items.forEach(item => {
    const value = calculateCurrentValue(item);
    totalValue += value;
    sectorMap.set(item.sector, (sectorMap.get(item.sector) || 0) + value);
  });

  if (totalValue === 0) return 0;

  const maxSectorAllocation = Math.max(
    ...Array.from(sectorMap.values()).map(value => (value / totalValue) * 100)
  );

  if (maxSectorAllocation > 60) return 10;
  if (maxSectorAllocation > 45) return 7;
  return 3;
};

const calculateDebtRisk = (items: PortfolioItem[]): number => {
  if (items.length === 0) return 0;

  let totalValue = 0;
  let weightedDebt = 0;

  items.forEach(item => {
    const value = calculateCurrentValue(item);
    totalValue += value;
    weightedDebt += item.debtEquity * value;
  });

  if (totalValue === 0) return 0;

  const avgDebtEquity = weightedDebt / totalValue;

  if (avgDebtEquity > 1.5) return 10;
  if (avgDebtEquity > 1.0) return 7;
  return 3;
};

const calculateValuationRisk = (items: PortfolioItem[]): number => {
  if (items.length === 0) return 0;

  let totalValue = 0;
  let weightedPE = 0;
  let weightedSectorPE = 0;

  items.forEach(item => {
    const value = calculateCurrentValue(item);
    totalValue += value;
    weightedPE += item.peRatio * value;
    weightedSectorPE += (SECTOR_AVG_PE[item.sector] || 25) * value;
  });

  if (totalValue === 0) return 0;

  const avgPE = weightedPE / totalValue;
  const avgSectorPE = weightedSectorPE / totalValue;

  const deviation = ((avgPE - avgSectorPE) / avgSectorPE) * 100;

  if (deviation > 30) return 10;
  if (deviation > 15) return 7;
  return 3;
};

const calculateBehavioralRisk = (history: PortfolioHistoryEntry[]): number => {
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const recentTransactions = history.filter(entry => entry.timestamp >= thirtyDaysAgo);

  const count = recentTransactions.length;

  if (count > 8) return 10;
  if (count > 5) return 7;
  return 3;
};

export const calculatePortfolioRisk = (
  items: PortfolioItem[],
  history: PortfolioHistoryEntry[]
): RiskBreakdown => {
  const concentrationRisk = calculateConcentrationRisk(items);
  const sectorRisk = calculateSectorRisk(items);
  const debtRisk = calculateDebtRisk(items);
  const valuationRisk = calculateValuationRisk(items);
  const behavioralRisk = calculateBehavioralRisk(history);

  const finalScore = 
    concentrationRisk * 0.30 +
    sectorRisk * 0.20 +
    debtRisk * 0.20 +
    valuationRisk * 0.15 +
    behavioralRisk * 0.15;

  const roundedScore = Math.round(finalScore * 10) / 10;

  let riskLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
  if (roundedScore < 3) riskLevel = 'Low';
  else if (roundedScore < 6) riskLevel = 'Moderate';
  else if (roundedScore < 8) riskLevel = 'High';
  else riskLevel = 'Very High';

  return {
    concentrationRisk,
    sectorRisk,
    debtRisk,
    valuationRisk,
    behavioralRisk,
    finalScore: roundedScore,
    riskLevel
  };
};
