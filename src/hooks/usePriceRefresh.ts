import { useEffect } from 'react';
import { usePortfolioStore } from '../store/portfolioStore';
import { updatePortfolioPrices } from '../services/stockApi';

const REFRESH_INTERVAL = parseInt(import.meta.env.VITE_PRICE_REFRESH_INTERVAL || '60000');

export const usePriceRefresh = () => {
  const portfolioItems = usePortfolioStore(state => state.portfolioItems);
  const updatePrices = usePortfolioStore(state => state.updatePrices);

  useEffect(() => {
    if (portfolioItems.length === 0) return;

    const refreshPrices = async () => {
      try {
        const symbols = portfolioItems.map(item => item.symbol);
        const priceMap = await updatePortfolioPrices(symbols);
        
        if (priceMap.size > 0) {
          updatePrices(priceMap);
        }
      } catch (error) {
        console.error('Price refresh error:', error);
      }
    };

    // Initial refresh
    refreshPrices();

    // Set up interval
    const interval = setInterval(refreshPrices, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [portfolioItems.length, updatePrices]);
};
