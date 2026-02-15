import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Card from '../ui/Card';
import PremiumSelect from '../ui/PremiumSelect';

interface PriceData {
  date: string;
  price: number;
}

interface StockPriceChartProps {
  stocks: Array<{ symbol: string; name: string; currentPrice: number }>;
}

export default function StockPriceChart({ stocks }: StockPriceChartProps) {
  const [selectedStock, setSelectedStock] = useState(stocks[0]?.symbol || '');
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceChange, setPriceChange] = useState({ value: 0, percent: 0 });

  useEffect(() => {
    if (!selectedStock) return;

    const fetchHistoricalData = async () => {
      setLoading(true);
      
      // Mock data for now - replace with real API call
      const mockData = generateMockData(stocks.find(s => s.symbol === selectedStock)?.currentPrice || 100);
      
      setPriceData(mockData);
      
      // Calculate price change
      if (mockData.length > 1) {
        const firstPrice = mockData[0].price;
        const lastPrice = mockData[mockData.length - 1].price;
        const change = lastPrice - firstPrice;
        const changePercent = (change / firstPrice) * 100;
        setPriceChange({ value: change, percent: changePercent });
      }
      
      setLoading(false);
    };

    fetchHistoricalData();
  }, [selectedStock, stocks]);

  const generateMockData = (currentPrice: number): PriceData[] => {
    const data: PriceData[] = [];
    const days = 30;
    let price = currentPrice * 0.9;
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      
      price = price + (Math.random() - 0.45) * (currentPrice * 0.02);
      
      data.push({
        date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        price: parseFloat(price.toFixed(2))
      });
    }
    
    return data;
  };

  const currentStock = stocks.find(s => s.symbol === selectedStock);
  const isPositive = priceChange.value >= 0;

  if (stocks.length === 0) {
    return null;
  }

  return (
    <Card className="p-8">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-2">Price Overview</h2>
          <div className="flex items-center gap-3">
            <div className="text-3xl font-bold gradient-text">
              ₹{currentStock?.currentPrice.toLocaleString('en-IN')}
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{isPositive ? '+' : ''}{priceChange.percent.toFixed(2)}%</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-accent-green/10">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
              <span className="text-xs font-semibold text-accent-green">Live</span>
            </div>
          </div>
        </div>
        
        <div className="w-48">
          <PremiumSelect
            value={selectedStock}
            onChange={(e) => setSelectedStock(e.target.value)}
            options={stocks.map(s => ({ value: s.symbol, label: s.symbol }))}
          />
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-cyan/20 border-t-cyan rounded-full animate-spin" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="h-64"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0AC4E0" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0AC4E0" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                stroke="rgba(255,255,255,0.2)"
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                tickLine={false}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.2)"
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                tickLine={false}
                domain={['auto', 'auto']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 25, 60, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '12px',
                }}
                labelStyle={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}
                itemStyle={{ color: '#0AC4E0', fontSize: '14px', fontWeight: 600 }}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#0AC4E0" 
                strokeWidth={2}
                dot={false}
                fill="url(#colorPrice)"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </Card>
  );
}
