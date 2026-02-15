import { useState, FormEvent } from 'react';
import { usePortfolioStore } from '../store/portfolioStore';
import { useAuthStore } from '../store/authStore';
import { getStockDetailsWithCache } from '../services/stockApi';
import { canAddMoreStocks } from '../utils/featureAccess';
import Card from './ui/Card';
import PremiumInput from './ui/PremiumInput';
import PremiumButton from './ui/PremiumButton';
import LiveStockSearch from './ui/LiveStockSearch';
import UpgradeModal from './modals/UpgradeModal';
import { useNavigate } from 'react-router-dom';

export default function AddStockForm() {
  const addStock = usePortfolioStore(state => state.addStock);
  const portfolioItems = usePortfolioStore(state => state.portfolioItems);
  const user = useAuthStore(state => state.user);
  const getUserPlan = useAuthStore(state => state.getUserPlan);
  const navigate = useNavigate();
  
  const [symbol, setSymbol] = useState('');
  const [stockName, setStockName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!symbol) {
      newErrors.symbol = 'Please select a stock';
    }

    const qty = parseFloat(quantity);
    if (!quantity || isNaN(qty) || qty <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }

    const price = parseFloat(buyPrice);
    if (!buyPrice || isNaN(price) || price <= 0) {
      newErrors.buyPrice = 'Buy price must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate() || !user) return;

    // Check portfolio limit
    const userPlan = getUserPlan();
    if (!canAddMoreStocks(userPlan, portfolioItems.length)) {
      setShowUpgradeModal(true);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const stockDetails = await getStockDetailsWithCache(symbol);
      
      if (!stockDetails) {
        setErrors({ symbol: 'Unable to fetch stock details. Please verify the symbol and try again.' });
        setIsLoading(false);
        return;
      }

      if (stockDetails.currentPrice <= 0) {
        setErrors({ symbol: 'Invalid stock data received. Please try a different stock.' });
        setIsLoading(false);
        return;
      }

      await addStock(
        user.uid,
        symbol,
        stockName || stockDetails.name,
        parseFloat(quantity),
        parseFloat(buyPrice),
        stockDetails
      );
      
      setSymbol('');
      setStockName('');
      setQuantity('');
      setBuyPrice('');
      setErrors({});
    } catch (error) {
      console.error('Error adding stock:', error);
      setErrors({ symbol: 'Failed to add stock. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStockSelect = (selectedSymbol: string, name: string) => {
    setSymbol(selectedSymbol);
    setStockName(name);
    setErrors(prev => ({ ...prev, symbol: '' }));
  };

  const handleUpgrade = () => {
    setShowUpgradeModal(false);
    navigate('/upgrade');
  };

  return (
    <>
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Add Stock</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <LiveStockSearch
            label="Stock"
            onSelect={handleStockSelect}
            error={errors.symbol}
          />

          <PremiumInput
            label="Quantity"
            type="number"
            min="0"
            step="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity"
            error={errors.quantity}
          />

          <PremiumInput
            label="Buy Price (₹)"
            type="number"
            min="0"
            step="0.01"
            value={buyPrice}
            onChange={(e) => setBuyPrice(e.target.value)}
            placeholder="Enter buy price"
            error={errors.buyPrice}
          />

          <PremiumButton 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Adding...
              </span>
            ) : (
              'Add to Portfolio'
            )}
          </PremiumButton>
        </form>
      </Card>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={handleUpgrade}
        feature="Unlimited Portfolio Items"
      />
    </>
  );
}
