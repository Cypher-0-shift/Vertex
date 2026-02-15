import { usePortfolioStore } from '../../store/portfolioStore';
import Card from '../ui/Card';

export default function BehaviorPanel() {
  const getBehaviorBreakdown = usePortfolioStore(state => state.getBehaviorBreakdown);
  const breakdown = getBehaviorBreakdown();

  const getBehaviorLevelColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'Moderate': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'High': return 'text-orange-400 bg-orange-400/20 border-orange-400/30';
      case 'Very High': return 'text-red-400 bg-red-400/20 border-red-400/30';
      default: return 'text-white/60 bg-white/10 border-white/20';
    }
  };

  const getBehaviorMessage = (level: string) => {
    switch (level) {
      case 'Low': return 'Your trading behavior demonstrates patience and discipline.';
      case 'Moderate': return 'Trading patterns are reasonable but could be optimized for better outcomes.';
      case 'High': return 'Consider reviewing your trading approach to improve long-term results.';
      case 'Very High': return 'Trading patterns suggest emotional decision-making. A structured approach is recommended.';
      default: return '';
    }
  };

  const getBarColor = (value: number) => {
    if (value >= 8) return 'bg-red-400';
    if (value >= 6) return 'bg-orange-400';
    if (value >= 4) return 'bg-yellow-400';
    return 'bg-green-400';
  };

  const behaviorMetrics = [
    { label: 'Overtrading', value: breakdown.overtradingScore, weight: '40%' },
    { label: 'Short Holding', value: breakdown.shortHoldingScore, weight: '30%' },
    { label: 'Loss Selling', value: breakdown.lossSellingScore, weight: '20%' },
    { label: 'Timing Risk', value: breakdown.timingRiskScore, weight: '10%' }
  ];

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Behavioral Intelligence</h2>

      <div className="flex items-center justify-between mb-6 p-6 bg-white/[0.03] rounded-xl border border-white/5">
        <div>
          <p className="text-sm text-white/60 mb-2">Behavior Score</p>
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-bold">{breakdown.finalBehaviorScore.toFixed(1)}</span>
            <span className="text-2xl text-white/40">/10</span>
          </div>
        </div>
        <div>
          <span className={`px-4 py-2 rounded-xl text-sm font-semibold border ${getBehaviorLevelColor(breakdown.behaviorLevel)}`}>
            {breakdown.behaviorLevel}
          </span>
        </div>
      </div>

      <div className="mb-6 p-4 bg-white/[0.03] rounded-xl border border-white/5">
        <p className="text-sm text-white/70 leading-relaxed">
          {getBehaviorMessage(breakdown.behaviorLevel)}
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-white/60 mb-3">Behavior Breakdown</h3>
        
        {behaviorMetrics.map(metric => (
          <div key={metric.label} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-white/80">{metric.label}</span>
                <span className="text-white/40 text-xs">({metric.weight})</span>
              </div>
              <span className="font-medium">{metric.value.toFixed(1)}/10</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${getBarColor(metric.value)}`}
                style={{ width: `${(metric.value / 10) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
