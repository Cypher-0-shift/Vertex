import { usePortfolioStore } from '../../store/portfolioStore';
import { formatINR } from '../../utils/format';
import Card from '../ui/Card';

export default function ActivityOverview() {
  const getActivitySummary = usePortfolioStore(state => state.getActivitySummary);
  const getAverageHoldingDuration = usePortfolioStore(state => state.getAverageHoldingDuration);
  
  const summary = getActivitySummary();
  const avgHoldingDays = getAverageHoldingDuration();

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Activity Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-white/[0.03] rounded-xl border border-white/5">
          <p className="text-sm text-white/60 mb-1">Transactions (30d)</p>
          <p className="text-2xl font-semibold text-cyan">{summary.totalTransactions}</p>
        </div>

        <div className="p-4 bg-white/[0.03] rounded-xl border border-white/5">
          <p className="text-sm text-white/60 mb-1">Avg Holding Period</p>
          <p className="text-2xl font-semibold text-cream">
            {avgHoldingDays > 0 ? `${avgHoldingDays.toFixed(0)}d` : '—'}
          </p>
        </div>
      </div>

      {summary.frequentStocks.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-white/60 mb-3">Most Traded</h3>
          <div className="space-y-2">
            {summary.frequentStocks.map(stock => (
              <div 
                key={stock.symbol} 
                className="flex items-center justify-between p-3 bg-white/[0.03] rounded-lg border border-white/5 hover:bg-white/[0.05] transition-colors duration-200"
              >
                <span className="font-medium">{stock.symbol}</span>
                <span className="text-sm text-white/60">{stock.count} transactions</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {summary.recentActivities.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-white/60 mb-3">Recent Activity</h3>
          <div className="space-y-2">
            {summary.recentActivities.map(activity => (
              <div 
                key={activity.id} 
                className="flex items-center justify-between p-3 bg-white/[0.03] rounded-lg border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <span className={`
                    px-2 py-1 text-xs font-medium rounded-md
                    ${activity.action === 'ADD' 
                      ? 'bg-cyan/20 text-cyan border border-cyan/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }
                  `}>
                    {activity.action}
                  </span>
                  <div>
                    <p className="font-medium text-sm">{activity.symbol}</p>
                    <p className="text-xs text-white/40">
                      {activity.quantity} @ {formatINR(activity.price)}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-white/40">
                  {formatTimestamp(activity.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {summary.recentActivities.length === 0 && (
        <p className="text-center text-white/40 py-6 text-sm">
          No recent activity
        </p>
      )}
    </Card>
  );
}
