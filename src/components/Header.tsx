import { usePortfolioStore } from '../store/portfolioStore';
import { formatINR } from '../utils/format';
import Card from './ui/Card';

export default function Header() {
  const getTotalCurrentValue = usePortfolioStore(state => state.getTotalCurrentValue);
  const getRiskBreakdown = usePortfolioStore(state => state.getRiskBreakdown);
  
  const totalValue = getTotalCurrentValue();
  const riskBreakdown = getRiskBreakdown();

  return (
    <header className="mb-12 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        <div>
          <h1 className="text-6xl font-bold tracking-tight mb-3 gradient-text">
            RiskLens
          </h1>
          <p className="text-white/60 text-lg font-medium">Portfolio Intelligence Engine</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          <Card 
            className="flex-1 sm:min-w-[240px] p-6"
            hover
          >
            <p className="metric-label mb-3">Portfolio Value</p>
            <p className="metric-number text-cyan">
              {formatINR(totalValue)}
            </p>
          </Card>

          <Card 
            className="flex-1 sm:min-w-[240px] p-6"
            hover
          >
            <p className="metric-label mb-3">Risk Score</p>
            <div className="flex items-baseline gap-3">
              <p className="metric-number">{riskBreakdown.finalScore.toFixed(1)}</p>
              <span className="text-2xl text-white/40">/10</span>
            </div>
            <div className="mt-3">
              <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
                riskBreakdown.riskLevel === 'Low' ? 'bg-accent-green/20 text-accent-green' :
                riskBreakdown.riskLevel === 'Moderate' ? 'bg-yellow-400/20 text-yellow-400' :
                riskBreakdown.riskLevel === 'High' ? 'bg-orange-400/20 text-orange-400' :
                'bg-accent-red/20 text-accent-red'
              }`}>
                {riskBreakdown.riskLevel}
              </span>
            </div>
          </Card>
        </div>
      </div>
    </header>
  );
}
