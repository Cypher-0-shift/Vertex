import { usePortfolioStore } from '../store/portfolioStore';
import { formatINR, formatPercent } from '../utils/format';
import MetricCard from './ui/MetricCard';

export default function MetricsGrid() {
  const getTotalInvestedValue = usePortfolioStore(state => state.getTotalInvestedValue);
  const getTotalCurrentValue = usePortfolioStore(state => state.getTotalCurrentValue);
  const getTotalGainLoss = usePortfolioStore(state => state.getTotalGainLoss);
  const getPortfolioReturnPercent = usePortfolioStore(state => state.getPortfolioReturnPercent);
  const getTopHolding = usePortfolioStore(state => state.getTopHolding);
  const getLargestGain = usePortfolioStore(state => state.getLargestGain);
  const getLargestLoss = usePortfolioStore(state => state.getLargestLoss);
  const calculateBehaviorScore = usePortfolioStore(state => state.getBehaviorBreakdown);

  const totalInvested = getTotalInvestedValue();
  const totalCurrent = getTotalCurrentValue();
  const totalGainLoss = getTotalGainLoss();
  const portfolioReturn = getPortfolioReturnPercent();
  const topHolding = getTopHolding();
  const largestGain = getLargestGain();
  const largestLoss = getLargestLoss();
  const behaviorScore = calculateBehaviorScore().finalBehaviorScore;

  const getTrend = (value: number) => {
    if (value > 0) return 'positive';
    if (value < 0) return 'negative';
    return 'neutral';
  };

  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-white/80">Portfolio Metrics</h2>
        <p className="text-xs text-white/40">All values in INR</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Invested"
          value={formatINR(totalInvested)}
        />

        <MetricCard
          label="Current Value"
          value={formatINR(totalCurrent)}
        />

        <MetricCard
          label="Total Gain/Loss"
          value={formatINR(totalGainLoss)}
          subtitle={formatPercent(portfolioReturn)}
          trend={getTrend(totalGainLoss)}
        />

        <MetricCard
          label="Portfolio Return"
          value={formatPercent(portfolioReturn)}
          trend={getTrend(portfolioReturn)}
        />

        <MetricCard
          label="Top Holding"
          value={topHolding ? topHolding.symbol : '—'}
          subtitle={topHolding ? formatINR(topHolding.value) : undefined}
        />

        <MetricCard
          label="Largest Gainer"
          value={largestGain ? largestGain.symbol : '—'}
          subtitle={largestGain ? `${formatINR(largestGain.gainLoss)} (${formatPercent(largestGain.gainLossPercent)})` : undefined}
          trend={largestGain ? 'positive' : undefined}
        />

        <MetricCard
          label="Largest Loser"
          value={largestLoss ? largestLoss.symbol : '—'}
          subtitle={largestLoss ? `${formatINR(largestLoss.gainLoss)} (${formatPercent(largestLoss.gainLossPercent)})` : undefined}
          trend={largestLoss ? 'negative' : undefined}
        />

        <MetricCard
          label="Behavior Score"
          value={`${behaviorScore.toFixed(1)}/10`}
          subtitle="Trading discipline"
          trend={behaviorScore < 3 ? 'positive' : behaviorScore < 6 ? undefined : 'negative'}
        />
      </div>
    </div>
  );
}
