import { PortfolioItem } from '../store/portfolioStore';

export const calculateInvestedValue = (item: PortfolioItem): number => {
  return item.quantity * item.buyPrice;
};

export const calculateCurrentValue = (item: PortfolioItem): number => {
  return item.quantity * item.currentPrice;
};

export const calculateGainLoss = (item: PortfolioItem): number => {
  return calculateCurrentValue(item) - calculateInvestedValue(item);
};

export const calculateGainLossPercent = (item: PortfolioItem): number => {
  const invested = calculateInvestedValue(item);
  if (invested === 0) return 0;
  return (calculateGainLoss(item) / invested) * 100;
};

export const calculateTotalInvested = (items: PortfolioItem[]): number => {
  return items.reduce((sum, item) => sum + calculateInvestedValue(item), 0);
};

export const calculateTotalCurrent = (items: PortfolioItem[]): number => {
  return items.reduce((sum, item) => sum + calculateCurrentValue(item), 0);
};

export const calculateTotalGainLoss = (items: PortfolioItem[]): number => {
  return calculateTotalCurrent(items) - calculateTotalInvested(items);
};

export const calculatePortfolioReturn = (items: PortfolioItem[]): number => {
  const invested = calculateTotalInvested(items);
  if (invested === 0) return 0;
  return (calculateTotalGainLoss(items) / invested) * 100;
};
