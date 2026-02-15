import { usePortfolioStore } from '../../store/portfolioStore';
import { useAuthStore } from '../../store/authStore';
import { formatINR, formatPercent } from '../../utils/format';
import { calculateInvestedValue, calculateCurrentValue, calculateGainLoss, calculateGainLossPercent } from '../../utils/calculations';
import Card from '../ui/Card';
import PremiumButton from '../ui/PremiumButton';

export default function PortfolioTable() {
  const portfolioItems = usePortfolioStore(state => state.portfolioItems);
  const removeStock = usePortfolioStore(state => state.removeStock);
  const user = useAuthStore(state => state.user);

  if (portfolioItems.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center text-white/40 py-8">
          No stocks in portfolio. Add your first stock to get started.
        </p>
      </Card>
    );
  }

  const handleRemove = async (id: string) => {
    if (!user) return;
    try {
      await removeStock(user.uid, id);
    } catch (error) {
      console.error('Error removing stock:', error);
    }
  };

  const getGainLossColor = (value: number) => {
    if (value > 0) return 'text-cyan';
    if (value < 0) return 'text-red-400';
    return 'text-cream';
  };

  return (
    <Card className="p-6 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-6">Portfolio Holdings</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-2 text-sm font-medium text-white/60">Stock</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-white/60">Sector</th>
              <th className="text-right py-3 px-2 text-sm font-medium text-white/60">Qty</th>
              <th className="text-right py-3 px-2 text-sm font-medium text-white/60">Avg Buy</th>
              <th className="text-right py-3 px-2 text-sm font-medium text-white/60">Current</th>
              <th className="text-right py-3 px-2 text-sm font-medium text-white/60">Invested</th>
              <th className="text-right py-3 px-2 text-sm font-medium text-white/60">Current Value</th>
              <th className="text-right py-3 px-2 text-sm font-medium text-white/60">Gain/Loss</th>
              <th className="text-right py-3 px-2 text-sm font-medium text-white/60"></th>
            </tr>
          </thead>
          <tbody>
            {portfolioItems.map(item => {
              const invested = calculateInvestedValue(item);
              const current = calculateCurrentValue(item);
              const gainLoss = calculateGainLoss(item);
              const gainLossPercent = calculateGainLossPercent(item);

              return (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors duration-200">
                  <td className="py-4 px-2 font-medium">{item.symbol}</td>
                  <td className="py-4 px-2 text-white/60 text-sm">{item.sector}</td>
                  <td className="py-4 px-2 text-right">{item.quantity}</td>
                  <td className="py-4 px-2 text-right">{formatINR(item.buyPrice)}</td>
                  <td className="py-4 px-2 text-right">{formatINR(item.currentPrice)}</td>
                  <td className="py-4 px-2 text-right">{formatINR(invested)}</td>
                  <td className="py-4 px-2 text-right font-medium">{formatINR(current)}</td>
                  <td className={`py-4 px-2 text-right font-medium ${getGainLossColor(gainLoss)}`}>
                    <div>{formatINR(gainLoss)}</div>
                    <div className="text-xs">{formatPercent(gainLossPercent)}</div>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <PremiumButton
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove
                    </PremiumButton>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
