import { usePortfolioStore } from '../../store/portfolioStore';
import { generateBehaviorInsights, generateBehaviorSuggestions } from '../../utils/behaviorInsights';
import Card from '../ui/Card';
import InsightCard from '../risk/InsightCard';

export default function BehaviorInsightsPanel() {
  const portfolioHistory = usePortfolioStore(state => state.portfolioHistory);
  const getBehaviorBreakdown = usePortfolioStore(state => state.getBehaviorBreakdown);

  const behaviorBreakdown = getBehaviorBreakdown();
  const insights = generateBehaviorInsights(portfolioHistory, behaviorBreakdown);
  const suggestions = generateBehaviorSuggestions(behaviorBreakdown);

  if (portfolioHistory.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Behavioral Insights</h2>
        <p className="text-sm text-white/40 text-center py-8">
          Start trading to receive behavioral pattern analysis and personalized suggestions.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Behavioral Insights</h2>
        <p className="text-sm text-white/60">
          Analysis of your trading patterns over the last 30 days with actionable recommendations
        </p>
      </div>

      {insights.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-medium text-white/70 mb-4">Pattern Analysis</h3>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <InsightCard key={index} insight={insight} />
            ))}
          </div>
        </div>
      )}

      {suggestions.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-white/70 mb-4">Behavioral Recommendations</h3>
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-4 bg-blue/5 rounded-xl border border-blue/20 hover:bg-blue/10 transition-colors duration-200"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue/20 flex items-center justify-center text-blue text-xs font-bold mt-0.5">
                  {index + 1}
                </div>
                <p className="text-sm text-white/80 leading-relaxed flex-1">
                  {suggestion}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-white/[0.02] rounded-xl border border-white/5">
        <p className="text-xs text-white/50 leading-relaxed">
          Behavioral analysis is based on your transaction history and common investment psychology patterns. 
          These insights are educational and aim to help you develop a more disciplined investment approach.
        </p>
      </div>
    </Card>
  );
}
