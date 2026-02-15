import { PortfolioItem } from '../store/portfolioStore';
import { RiskBreakdown } from './riskEngine';
import { calculateCurrentValue } from './calculations';
import { IndianSector } from '../data/stocks';

export interface RiskInsight {
  title: string;
  description: string;
  severity: 'Low' | 'Moderate' | 'High';
}

export const generateRiskInsights = (
  portfolioItems: PortfolioItem[],
  riskBreakdown: RiskBreakdown
): RiskInsight[] => {
  const insights: RiskInsight[] = [];

  // Concentration Risk Insight
  if (riskBreakdown.concentrationRisk >= 7) {
    const totalValue = portfolioItems.reduce((sum, item) => sum + calculateCurrentValue(item), 0);
    const maxAllocation = Math.max(
      ...portfolioItems.map(item => (calculateCurrentValue(item) / totalValue) * 100)
    );
    const topStock = portfolioItems.reduce((max, item) => 
      calculateCurrentValue(item) > calculateCurrentValue(max) ? item : max
    );

    insights.push({
      title: 'High Stock Concentration',
      description: `${maxAllocation.toFixed(1)}% of your portfolio is allocated to ${topStock.name}. This increases volatility risk if the stock declines. Consider rebalancing to reduce single-stock exposure below 30%.`,
      severity: riskBreakdown.concentrationRisk >= 8 ? 'High' : 'Moderate'
    });
  }

  // Sector Risk Insight
  if (riskBreakdown.sectorRisk >= 7) {
    const sectorMap = new Map<string, number>();
    let totalValue = 0;

    portfolioItems.forEach(item => {
      const value = calculateCurrentValue(item);
      totalValue += value;
      sectorMap.set(item.sector, (sectorMap.get(item.sector) || 0) + value);
    });

    const maxSector = Array.from(sectorMap.entries()).reduce((max, entry) => 
      entry[1] > max[1] ? entry : max
    );
    const sectorAllocation = (maxSector[1] / totalValue) * 100;

    insights.push({
      title: `Overexposure to ${maxSector[0]} Sector`,
      description: `${sectorAllocation.toFixed(1)}% of your portfolio is concentrated in the ${maxSector[0]} sector. Sector-specific downturns could significantly impact your returns. Diversifying across multiple sectors reduces this risk.`,
      severity: riskBreakdown.sectorRisk >= 8 ? 'High' : 'Moderate'
    });
  }

  // Debt Risk Insight
  if (riskBreakdown.debtRisk >= 7) {
    let totalValue = 0;
    let weightedDebt = 0;

    portfolioItems.forEach(item => {
      const value = calculateCurrentValue(item);
      totalValue += value;
      weightedDebt += item.debtEquity * value;
    });

    const avgDebtEquity = weightedDebt / totalValue;

    insights.push({
      title: 'High Debt Exposure',
      description: `Your portfolio has an average debt-to-equity ratio of ${avgDebtEquity.toFixed(2)}. Companies with high leverage are more vulnerable during economic downturns or rising interest rates. Consider balancing with low-debt companies.`,
      severity: riskBreakdown.debtRisk >= 8 ? 'High' : 'Moderate'
    });
  }

  // Valuation Risk Insight
  if (riskBreakdown.valuationRisk >= 7) {
    let totalValue = 0;
    let weightedPE = 0;

    portfolioItems.forEach(item => {
      const value = calculateCurrentValue(item);
      totalValue += value;
      weightedPE += item.peRatio * value;
    });

    const avgPE = weightedPE / totalValue;

    insights.push({
      title: 'Elevated Valuation Levels',
      description: `Your portfolio's average P/E ratio of ${avgPE.toFixed(1)} is significantly above sector averages. High valuations may limit upside potential and increase downside risk during market corrections. Consider adding value stocks.`,
      severity: riskBreakdown.valuationRisk >= 8 ? 'High' : 'Moderate'
    });
  }

  // Behavioral Risk Insight
  if (riskBreakdown.behavioralRisk >= 7) {
    insights.push({
      title: 'Frequent Trading Activity',
      description: 'Your portfolio shows high transaction frequency over the past 30 days. Frequent trading can erode returns through transaction costs and may indicate emotional decision-making. Long-term holding typically yields better wealth creation.',
      severity: riskBreakdown.behavioralRisk >= 8 ? 'High' : 'Moderate'
    });
  }

  // Positive insights for low risk
  if (riskBreakdown.finalScore < 3) {
    insights.push({
      title: 'Well-Diversified Portfolio',
      description: 'Your portfolio demonstrates balanced diversification across stocks and sectors. This positioning helps manage volatility and provides stable long-term growth potential.',
      severity: 'Low'
    });
  }

  return insights;
};

export const generateDiversificationSuggestions = (
  portfolioItems: PortfolioItem[],
  riskBreakdown: RiskBreakdown
): string[] => {
  const suggestions: string[] = [];

  // Analyze current sector allocation
  const sectorMap = new Map<string, number>();
  let totalValue = 0;

  portfolioItems.forEach(item => {
    const value = calculateCurrentValue(item);
    totalValue += value;
    sectorMap.set(item.sector, (sectorMap.get(item.sector) || 0) + value);
  });

  const allSectors: IndianSector[] = ['IT', 'Banking', 'Energy', 'FMCG', 'Infrastructure', 'Pharma', 'Automobile', 'Metals'];
  const underrepresentedSectors = allSectors.filter(sector => {
    const allocation = ((sectorMap.get(sector) || 0) / totalValue) * 100;
    return allocation < 10;
  });

  // Stock concentration suggestions
  if (riskBreakdown.concentrationRisk >= 7) {
    const maxAllocation = Math.max(
      ...portfolioItems.map(item => (calculateCurrentValue(item) / totalValue) * 100)
    );
    const topStock = portfolioItems.reduce((max, item) => 
      calculateCurrentValue(item) > calculateCurrentValue(max) ? item : max
    );

    suggestions.push(`Reduce ${topStock.name} allocation from ${maxAllocation.toFixed(1)}% to below 30% by rebalancing into other quality stocks`);
  }

  // Sector diversification suggestions
  if (riskBreakdown.sectorRisk >= 7 && underrepresentedSectors.length > 0) {
    const topSectors = underrepresentedSectors.slice(0, 3).join(', ');
    suggestions.push(`Consider adding exposure to underrepresented sectors: ${topSectors}`);
  }

  // Debt exposure suggestions
  if (riskBreakdown.debtRisk >= 7) {
    suggestions.push('Balance high-leverage stocks with companies having strong balance sheets (debt-to-equity < 0.5)');
  }

  // Valuation suggestions
  if (riskBreakdown.valuationRisk >= 7) {
    suggestions.push('Mix growth stocks with value stocks (P/E < 20) to reduce valuation risk');
    suggestions.push('Consider defensive sectors like FMCG or Pharma with stable earnings');
  }

  // Behavioral suggestions
  if (riskBreakdown.behavioralRisk >= 7) {
    suggestions.push('Adopt a long-term investment horizon (3-5 years) to reduce transaction frequency');
    suggestions.push('Set clear investment criteria before making buy/sell decisions');
  }

  // General diversification
  if (portfolioItems.length < 8) {
    suggestions.push('Gradually build a portfolio of 8-12 quality stocks across different sectors');
  }

  // If portfolio is well-balanced
  if (riskBreakdown.finalScore < 3 && suggestions.length === 0) {
    suggestions.push('Maintain current diversification strategy and review quarterly');
    suggestions.push('Consider systematic investment to build positions during market corrections');
  }

  return suggestions;
};
