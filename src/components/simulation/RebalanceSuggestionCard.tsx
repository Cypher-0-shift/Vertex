import { RebalanceSuggestion } from '../../utils/simulationEngine';

interface RebalanceSuggestionCardProps {
  suggestion: RebalanceSuggestion;
  currentRiskScore: number;
}

export default function RebalanceSuggestionCard({ 
  suggestion, 
  currentRiskScore 
}: RebalanceSuggestionCardProps) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'reduce': return '↓';
      case 'add': return '+';
      case 'remove': return '×';
      default: return '→';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'reduce': return 'bg-blue/20 text-blue-light border-blue/30';
      case 'add': return 'bg-accent-green/20 text-accent-green border-accent-green/30';
      case 'remove': return 'bg-orange-400/20 text-orange-400 border-orange-400/30';
      default: return 'bg-purple/20 text-purple-light border-purple/30';
    }
  };

  return (
    <div className="p-5 bg-white/[0.03] rounded-xl border border-white/10 hover:bg-white/[0.05] hover:border-purple/30 transition-all duration-300 group">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${getActionColor(suggestion.action)} flex items-center justify-center text-lg font-bold border`}>
            {getActionIcon(suggestion.action)}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-1 group-hover:text-purple-light transition-colors">
              {suggestion.title}
            </h3>
            <p className="text-sm text-white/70 leading-relaxed">
              {suggestion.description}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-xs text-white/50 mb-0.5">Current Risk</p>
            <p className="text-lg font-semibold text-white">{currentRiskScore.toFixed(1)}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>

          <div>
            <p className="text-xs text-white/50 mb-0.5">Simulated Risk</p>
            <p className="text-lg font-semibold text-accent-green">{suggestion.simulatedRiskScore.toFixed(1)}</p>
          </div>
        </div>

        <div className="text-right">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent-green/10 rounded-lg border border-accent-green/30">
            <svg className="w-4 h-4 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-sm font-semibold text-accent-green">
              -{suggestion.delta.toFixed(1)} pts
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full flex">
            <div 
              className="bg-gradient-to-r from-red-400 to-orange-400 transition-all duration-500"
              style={{ width: `${(currentRiskScore / 10) * 100}%` }}
            />
          </div>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden mt-2">
          <div className="h-full flex">
            <div 
              className="bg-gradient-to-r from-accent-green to-blue-light transition-all duration-500"
              style={{ width: `${(suggestion.simulatedRiskScore / 10) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
