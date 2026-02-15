import { usePortfolioStore } from '../../store/portfolioStore';
import { generateQuickRebalanceOptions } from '../../utils/simulationEngine';
import Card from '../ui/Card';
import RebalanceSuggestionCard from './RebalanceSuggestionCard';

export default function SimulationPanel() {
  const portfolioItems = usePortfolioStore(state => state.portfolioItems);
  const portfolioHistory = usePortfolioStore(state => state.portfolioHistory);
  const getRiskBreakdown = usePortfolioStore(state => state.getRiskBreakdown);

  const currentRisk = getRiskBreakdown();
  const suggestions = generateQuickRebalanceOptions(portfolioItems, portfolioHistory);

  if (portfolioItems.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Portfolio Simulation</h2>
        <p className="text-sm text-white/40 text-center py-8">
          Add stocks to your portfolio to access simulation and rebalancing suggestions.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 gradient-text">Portfolio Simulation</h2>
        <p className="text-sm text-white/60">
          AI-powered rebalancing suggestions to optimize your risk profile
        </p>
      </div>

      <div className="mb-6 p-5 bg-gradient-to-r from-purple/10 to-blue/10 rounded-xl border border-purple/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/60 mb-1">Current Risk Score</p>
            <p className="text-3xl font-bold text-white">{currentRisk.finalScore.toFixed(1)}</p>
          </div>
          <div className={`px-4 py-2 rounded-xl text-sm font-semibold border ${
            currentRisk.riskLevel === 'Low' ? 'bg-accent-green/20 text-accent-green border-accent-green/30' :
            currentRisk.riskLevel === 'Moderate' ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30' :
            currentRisk.riskLevel === 'High' ? 'bg-orange-400/20 text-orange-400 border-orange-400/30' :
            'bg-red-400/20 text-red-400 border-red-400/30'
          }`}>
            {currentRisk.riskLevel}
          </div>
        </div>
      </div>

      {suggestions.length > 0 ? (
        <div>
          <h3 className="text-sm font-medium text-white/70 mb-4">Smart Rebalancing Suggestions</h3>
          <div className="space-y-3">
            {suggestions.map((suggestion) => (
              <RebalanceSuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                currentRiskScore={currentRisk.finalScore}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="p-6 bg-accent-green/5 rounded-xl border border-accent-green/20">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✓</span>
            <div>
              <h3 className="font-semibold text-accent-green mb-1">Well-Optimized Portfolio</h3>
              <p className="text-sm text-white/70">
                Your portfolio is well-balanced. No immediate rebalancing suggestions at this time.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-white/[0.02] rounded-xl border border-white/5">
        <p className="text-xs text-white/50 leading-relaxed">
          Simulations are based on mathematical models and do not guarantee future results. 
          These suggestions are educational and should be evaluated based on your investment goals and risk tolerance.
        </p>
      </div>
    </Card>
  );
}
