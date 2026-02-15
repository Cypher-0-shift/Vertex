import { usePortfolioStore } from '../../store/portfolioStore';
import { generateRiskInsights, generateDiversificationSuggestions } from '../../utils/riskInsights';
import Card from '../ui/Card';
import InsightCard from './InsightCard';

export default function RiskInsightsPanel() {
  const portfolioItems = usePortfolioStore(state => state.portfolioItems);
  const getRiskBreakdown = usePortfolioStore(state => state.getRiskBreakdown);

  const riskBreakdown = getRiskBreakdown();
  const insights = generateRiskInsights(portfolioItems, riskBreakdown);
  const suggestions = generateDiversificationSuggestions(portfolioItems, riskBreakdown);

  if (portfolioItems.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Risk Insights & Suggestions</h2>
        <p className="text-sm text-white/40 text-center py-8">
          Add stocks to your portfolio to receive personalized risk insights and diversification suggestions.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Risk Insights & Suggestions</h2>
        <p className="text-sm text-white/60">
          AI-powered analysis of your portfolio's risk profile with actionable recommendations
        </p>
      </div>

      {insights.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-medium text-white/70 mb-4">Key Insights</h3>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <InsightCard key={index} insight={insight} />
            ))}
          </div>
        </div>
      )}

      {suggestions.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-white/70 mb-4">Diversification Suggestions</h3>
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-4 bg-cyan/5 rounded-xl border border-cyan/20 hover:bg-cyan/10 transition-colors duration-200"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan/20 flex items-center justify-center text-cyan text-xs font-bold mt-0.5">
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
          These insights are generated based on quantitative analysis of your portfolio composition. 
          They are educational in nature and should not be considered as financial advice. 
          Please consult with a qualified financial advisor for personalized investment guidance.
        </p>
      </div>
    </Card>
  );
}
