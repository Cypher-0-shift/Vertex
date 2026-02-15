import { create } from 'zustand';
import { StockDetails } from '../services/stockApi';
import { portfolioService } from '../services/portfolioService';
import {
  calculateTotalInvested,
  calculateTotalCurrent,
  calculateTotalGainLoss,
  calculatePortfolioReturn,
  calculateCurrentValue,
  calculateGainLoss
} from '../utils/calculations';
import { calculatePortfolioRisk, RiskBreakdown } from '../utils/riskEngine';
import { analyzeBehavior, BehaviorBreakdown } from '../utils/behaviorEngine';

export type IndianSector = 
  | 'IT' 
  | 'Banking' 
  | 'Energy' 
  | 'FMCG' 
  | 'Infrastructure' 
  | 'Pharma' 
  | 'Automobile' 
  | 'Metals';

export interface PortfolioStock {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  sector: IndianSector;
  addedAt: number;
  peRatio: number;
  debtEquity: number;
  roe: number;
  beta: number;
}

export interface PortfolioItem extends PortfolioStock {}

export interface PortfolioHistoryEntry {
  id: string;
  action: 'ADD' | 'REMOVE';
  symbol: string;
  quantity: number;
  price: number;
  timestamp: number;
}

export interface SectorAllocation {
  sector: string;
  value: number;
  percentage: number;
}

export interface HoldingInfo {
  symbol: string;
  value: number;
  gainLoss: number;
  gainLossPercent: number;
}

export interface ActivitySummary {
  totalTransactions: number;
  frequentStocks: { symbol: string; count: number }[];
  recentActivities: PortfolioHistoryEntry[];
}

interface PortfolioState {
  portfolioItems: PortfolioItem[];
  portfolioHistory: PortfolioHistoryEntry[];
  loading: boolean;
  error: string | null;
  
  loadPortfolio: (userId: string) => Promise<void>;
  addStock: (userId: string, symbol: string, name: string, quantity: number, buyPrice: number, stockDetails: StockDetails) => Promise<void>;
  removeStock: (userId: string, id: string) => Promise<void>;
  updatePrices: (priceMap: Map<string, number>) => void;
  clearPortfolio: () => void;
  canAddStock: (userPlan: 'free' | 'pro') => { allowed: boolean; reason?: string };
  
  getTotalInvestedValue: () => number;
  getTotalCurrentValue: () => number;
  getTotalGainLoss: () => number;
  getPortfolioReturnPercent: () => number;
  getSectorDistribution: () => SectorAllocation[];
  getTopHolding: () => HoldingInfo | null;
  getLargestLoss: () => HoldingInfo | null;
  getLargestGain: () => HoldingInfo | null;
  getRiskBreakdown: () => RiskBreakdown;
  getBehaviorBreakdown: () => BehaviorBreakdown;
  getLast30DaysActivity: () => PortfolioHistoryEntry[];
  getTotalTransactionsLast30Days: () => number;
  getFrequentBuySellStocks: () => { symbol: string; count: number }[];
  getAverageHoldingDuration: () => number;
  getActivitySummary: () => ActivitySummary;
}

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  portfolioItems: [],
  portfolioHistory: [],
  loading: false,
  error: null,

  loadPortfolio: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      
      // Skip Firestore for demo mode
      if (userId === 'demo-user') {
        const demoData = localStorage.getItem('risklens_demo_portfolio');
        if (demoData) {
          set({ portfolioItems: JSON.parse(demoData), loading: false });
        } else {
          set({ portfolioItems: [], loading: false });
        }
        return;
      }
      
      const stocks = await portfolioService.fetchPortfolio(userId);
      set({ portfolioItems: stocks, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  addStock: async (userId: string, symbol: string, name: string, quantity: number, buyPrice: number, stockDetails: StockDetails) => {
    try {
      set({ loading: true, error: null });
      
      const timestamp = Date.now();
      const newStock: Omit<PortfolioStock, 'id'> = {
        symbol,
        name,
        quantity,
        buyPrice,
        currentPrice: stockDetails.currentPrice,
        sector: stockDetails.sector,
        addedAt: timestamp,
        peRatio: stockDetails.peRatio,
        debtEquity: stockDetails.debtEquity,
        roe: stockDetails.roe,
        beta: stockDetails.beta
      };

      let stockId: string;
      
      // Demo mode: use localStorage
      if (userId === 'demo-user') {
        stockId = `demo-${timestamp}`;
        const stockWithId = { ...newStock, id: stockId };
        const currentItems = get().portfolioItems;
        const updatedItems = [...currentItems, stockWithId];
        localStorage.setItem('risklens_demo_portfolio', JSON.stringify(updatedItems));
      } else {
        stockId = await portfolioService.addStock(userId, newStock);
      }

      const historyEntry: PortfolioHistoryEntry = {
        id: `hist-${timestamp}`,
        action: 'ADD',
        symbol,
        quantity,
        price: buyPrice,
        timestamp
      };

      set(state => ({
        portfolioItems: [...state.portfolioItems, { ...newStock, id: stockId }],
        portfolioHistory: [...state.portfolioHistory, historyEntry],
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  canAddStock: (userPlan: 'free' | 'pro'): { allowed: boolean; reason?: string } => {
    const currentCount = get().portfolioItems.length;
    const maxItems = userPlan === 'free' ? 5 : Infinity;
    
    if (currentCount >= maxItems) {
      return {
        allowed: false,
        reason: `Free plan limited to ${maxItems} stocks. Upgrade to Pro for unlimited stocks.`
      };
    }
    
    return { allowed: true };
  },

  removeStock: async (userId: string, id: string) => {
    try {
      set({ loading: true, error: null });
      
      const item = get().portfolioItems.find(i => i.id === id);
      if (!item) {
        set({ loading: false });
        return;
      }

      // Demo mode: use localStorage
      if (userId === 'demo-user') {
        const updatedItems = get().portfolioItems.filter(i => i.id !== id);
        localStorage.setItem('risklens_demo_portfolio', JSON.stringify(updatedItems));
      } else {
        await portfolioService.removeStock(userId, id);
      }

      const timestamp = Date.now();
      const historyEntry: PortfolioHistoryEntry = {
        id: `hist-${timestamp}`,
        action: 'REMOVE',
        symbol: item.symbol,
        quantity: item.quantity,
        price: item.currentPrice,
        timestamp
      };

      set(state => ({
        portfolioItems: state.portfolioItems.filter(i => i.id !== id),
        portfolioHistory: [...state.portfolioHistory, historyEntry],
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updatePrices: (priceMap: Map<string, number>) => {
    set(state => ({
      portfolioItems: state.portfolioItems.map(item => {
        const newPrice = priceMap.get(item.symbol);
        return newPrice ? { ...item, currentPrice: newPrice } : item;
      })
    }));
  },

  clearPortfolio: () => {
    localStorage.removeItem('risklens_demo_portfolio');
    set({ portfolioItems: [], portfolioHistory: [], loading: false, error: null });
  },

  getTotalInvestedValue: () => {
    return calculateTotalInvested(get().portfolioItems);
  },

  getTotalCurrentValue: () => {
    return calculateTotalCurrent(get().portfolioItems);
  },

  getTotalGainLoss: () => {
    return calculateTotalGainLoss(get().portfolioItems);
  },

  getPortfolioReturnPercent: () => {
    return calculatePortfolioReturn(get().portfolioItems);
  },

  getSectorDistribution: () => {
    const items = get().portfolioItems;
    const sectorMap = new Map<string, number>();

    items.forEach(item => {
      const value = calculateCurrentValue(item);
      sectorMap.set(
        item.sector,
        (sectorMap.get(item.sector) || 0) + value
      );
    });

    const total = Array.from(sectorMap.values()).reduce((sum, val) => sum + val, 0);

    return Array.from(sectorMap.entries()).map(([sector, value]) => ({
      sector,
      value,
      percentage: total > 0 ? (value / total) * 100 : 0
    }));
  },

  getTopHolding: () => {
    const items = get().portfolioItems;
    if (items.length === 0) return null;

    const holdings = items.map(item => {
      const value = calculateCurrentValue(item);
      const gainLoss = calculateGainLoss(item);
      const invested = item.quantity * item.buyPrice;
      return {
        symbol: item.symbol,
        value,
        gainLoss,
        gainLossPercent: invested > 0 ? (gainLoss / invested) * 100 : 0
      };
    });

    return holdings.reduce((max, holding) => 
      holding.value > max.value ? holding : max
    );
  },

  getLargestLoss: () => {
    const items = get().portfolioItems;
    if (items.length === 0) return null;

    const holdings = items.map(item => {
      const value = calculateCurrentValue(item);
      const gainLoss = calculateGainLoss(item);
      const invested = item.quantity * item.buyPrice;
      return {
        symbol: item.symbol,
        value,
        gainLoss,
        gainLossPercent: invested > 0 ? (gainLoss / invested) * 100 : 0
      };
    });

    const losses = holdings.filter(h => h.gainLoss < 0);
    if (losses.length === 0) return null;

    return losses.reduce((min, holding) => 
      holding.gainLoss < min.gainLoss ? holding : min
    );
  },

  getLargestGain: () => {
    const items = get().portfolioItems;
    if (items.length === 0) return null;

    const holdings = items.map(item => {
      const value = calculateCurrentValue(item);
      const gainLoss = calculateGainLoss(item);
      const invested = item.quantity * item.buyPrice;
      return {
        symbol: item.symbol,
        value,
        gainLoss,
        gainLossPercent: invested > 0 ? (gainLoss / invested) * 100 : 0
      };
    });

    const gains = holdings.filter(h => h.gainLoss > 0);
    if (gains.length === 0) return null;

    return gains.reduce((max, holding) => 
      holding.gainLoss > max.gainLoss ? holding : max
    );
  },

  getRiskBreakdown: () => {
    return calculatePortfolioRisk(get().portfolioItems, get().portfolioHistory);
  },

  getBehaviorBreakdown: () => {
    return analyzeBehavior(get().portfolioItems, get().portfolioHistory);
  },

  getLast30DaysActivity: () => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return get().portfolioHistory.filter(entry => entry.timestamp >= thirtyDaysAgo);
  },

  getTotalTransactionsLast30Days: () => {
    return get().getLast30DaysActivity().length;
  },

  getFrequentBuySellStocks: () => {
    const activities = get().getLast30DaysActivity();
    const stockCount = new Map<string, number>();

    activities.forEach(entry => {
      stockCount.set(entry.symbol, (stockCount.get(entry.symbol) || 0) + 1);
    });

    return Array.from(stockCount.entries())
      .map(([symbol, count]) => ({ symbol, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  },

  getAverageHoldingDuration: () => {
    const items = get().portfolioItems;
    if (items.length === 0) return 0;

    const now = Date.now();
    const totalDuration = items.reduce((sum, item) => {
      return sum + (now - item.addedAt);
    }, 0);

    return totalDuration / items.length / (24 * 60 * 60 * 1000);
  },

  getActivitySummary: () => {
    const activities = get().getLast30DaysActivity();
    return {
      totalTransactions: activities.length,
      frequentStocks: get().getFrequentBuySellStocks(),
      recentActivities: activities.slice(-5).reverse()
    };
  }
}));
