import { RiskInsight } from '../../utils/riskInsights';

interface InsightCardProps {
  insight: RiskInsight;
}

export default function InsightCard({ insight }: InsightCardProps) {
  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'High':
        return {
          badge: 'bg-red-400/20 text-red-400 border-red-400/30',
          border: 'border-red-400/20',
          icon: '⚠️'
        };
      case 'Moderate':
        return {
          badge: 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30',
          border: 'border-yellow-400/20',
          icon: '⚡'
        };
      case 'Low':
        return {
          badge: 'bg-green-400/20 text-green-400 border-green-400/30',
          border: 'border-green-400/20',
          icon: '✓'
        };
      default:
        return {
          badge: 'bg-white/10 text-white/60 border-white/20',
          border: 'border-white/10',
          icon: 'ℹ️'
        };
    }
  };

  const styles = getSeverityStyles(insight.severity);

  return (
    <div className={`p-5 bg-white/[0.03] rounded-xl border ${styles.border} hover:bg-white/[0.05] transition-all duration-200`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{styles.icon}</span>
          <h3 className="font-semibold text-white">{insight.title}</h3>
        </div>
        <span className={`px-2.5 py-1 text-xs font-medium rounded-lg border ${styles.badge}`}>
          {insight.severity}
        </span>
      </div>
      <p className="text-sm text-white/70 leading-relaxed">
        {insight.description}
      </p>
    </div>
  );
}
