import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { usePortfolioStore } from '../../store/portfolioStore';
import { formatINR } from '../../utils/format';
import Card from '../ui/Card';

const SECTOR_COLORS: Record<string, string> = {
  'IT': '#0AC4E0',
  'Banking': '#0992C2',
  'Energy': '#F6E7BC',
  'FMCG': '#0f3a8f',
  'Infrastructure': '#0B2D72',
  'Pharma': '#8b5cf6',
  'Automobile': '#f59e0b',
  'Metals': '#6b7280',
  'Default': '#4a5568'
};

export default function SectorChart() {
  const getSectorDistribution = usePortfolioStore(state => state.getSectorDistribution);
  const allocation = getSectorDistribution();

  if (allocation.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Sector Allocation</h2>
        <p className="text-center text-white/40 py-8">
          Add stocks to see sector allocation
        </p>
      </Card>
    );
  }

  const chartData = allocation.map(item => ({
    name: item.sector,
    value: item.value,
    percentage: item.percentage
  }));

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Sector Allocation</h2>
      
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ percentage }) => `${percentage.toFixed(1)}%`}
          >
            {chartData.map((entry) => (
              <Cell 
                key={`cell-${entry.name}`} 
                fill={SECTOR_COLORS[entry.name] || SECTOR_COLORS.Default} 
              />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(11, 45, 114, 0.9)', 
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: '#fff'
            }}
            formatter={(value: number) => formatINR(value)}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => <span className="text-white/80">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-6 space-y-2">
        {allocation.map(item => (
          <div key={item.sector} className="flex justify-between items-center text-sm hover:bg-white/[0.03] p-2 rounded-lg transition-colors duration-200">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: SECTOR_COLORS[item.sector] || SECTOR_COLORS.Default }}
              />
              <span className="text-white/80">{item.sector}</span>
            </div>
            <div className="text-right">
              <div className="font-medium">{formatINR(item.value)}</div>
              <div className="text-white/40 text-xs">{item.percentage.toFixed(1)}%</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
