import { usePortfolioStore } from '../../store/portfolioStore';
import Card from '../ui/Card';

export default function RiskPanel() {
  const getRiskBreakdown = usePortfolioStore(state => state.getRiskBreakdown);
  const breakdown = getRiskBreakdown();

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'Moderate': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'High': return 'text-orange-400 bg-orange-400/20 border-orange-400/30';
      case 'Very High': return 'text-red-400 bg-red-400/20 border-red-400/30';
      default: return 'text-white/60 bg-white/10 border-white/20';
    }
  };

  const getRiskMessage = (level: string) => {
    switch (level) {
      case 'Low': return 'Your portfolio shows balanced diversification and healthy risk metrics.';
      case 'Moderate': return 'Portfolio risk is within acceptable range. Monitor concentration levels.';
      case 'High': return 'Consider rebalancing to reduce concentration and sector exposure.';
      case 'Very High': return 'Immediate attention recommended. High concentration or valuation risk detected.';
      default: return '';
    }
  };

  const getBarColor = (value: number) => {
    if (value >= 8) return 'bg-red-400';
    if (value >= 6) return 'bg-orange-400';
    if (value >= 4) return 'bg-yellow-400';
    return 'bg-green-400';
  };

  const riskMetrics = [
    { label: 'Concentration', value: breakdown.concentrationRisk, weight: '30%' },
    { label: 'Sector', value: breakdown.sectorRisk, weight: '20%' },
    { label: 'Debt', value: breakdown.debtRisk, weight: '20%' },
    { label: 'Valuation', value: breakdown.valuationRisk, weight: '15%' },
    { label: 'Behavioral', value: breakdown.behavioralRisk, weight: '15%' }
  ];

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Risk Intelligence Panel</h2>

      <div className="flex items-center justify-between mb-6 p-6 bg-white/[0.03] rounded-xl border border-white/5">
        <div>
          <p className="text-sm text-white/60 mb-2">Portfolio Risk Score</p>
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-bold">{breakdown.finalScore.toFixed(1)}</span>
            <span className="text-2xl text-white/40">/10</span>
          </div>
        </div>
        <div>
          <span className={`px-4 py-2 rounded-xl text-sm font-semibold border ${getRiskLevelColor(breakdown.riskLevel)}`}>
            {breakdown.riskLevel}
          </span>
        </div>
      </div>

      <div className="mb-6 p-4 bg-white/[0.03] rounded-xl border border-white/5">
        <p className="text-sm text-white/70 leading-relaxed">
          {getRiskMessage(breakdown.riskLevel)}
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-white/60 mb-3">Risk Breakdown</h3>
        
        {riskMetrics.map(metric => (
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
