import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Card from './Card';
import { useCountUp } from '../../hooks/useCountUp';

interface MetricCardProps {
  label: string;
  value: string | ReactNode;
  subtitle?: string | ReactNode;
  icon?: ReactNode;
  trend?: 'positive' | 'negative' | 'neutral';
  className?: string;
}

export default function MetricCard({ 
  label, 
  value, 
  subtitle, 
  icon,
  trend,
  className = '' 
}: MetricCardProps) {
  const getTrendColor = () => {
    if (trend === 'positive') return 'text-accent-green';
    if (trend === 'negative') return 'text-accent-red';
    return 'text-cyan';
  };

  const getGlow = () => {
    if (trend === 'positive') return 'shadow-accent-green/20';
    if (trend === 'negative') return 'shadow-accent-red/20';
    return 'shadow-cyan/20';
  };

  const numericValue = typeof value === 'string' ? parseFloat(String(value).replace(/[^0-9.-]/g, '')) : 0;
  const animatedValue = useCountUp(isNaN(numericValue) ? 0 : numericValue);
  
  const displayValue = typeof value === 'string' && String(value).includes('₹') 
    ? `₹${animatedValue.toLocaleString('en-IN')}`
    : typeof value === 'string' && String(value).includes('%')
    ? `${animatedValue.toFixed(2)}%`
    : isNaN(numericValue)
    ? value
    : animatedValue;

  return (
    <Card 
      className={`${getGlow()} ${className}`}
      hover
    >
      <div className="flex items-start justify-between mb-4">
        <p className="metric-label">{label}</p>
        {icon && (
          <motion.div 
            className="text-white/40"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {icon}
          </motion.div>
        )}
      </div>
      
      <motion.div 
        className={`metric-number mb-2 ${trend ? getTrendColor() : 'text-white'}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {displayValue}
      </motion.div>
      
      {subtitle && (
        <motion.div 
          className={`text-sm ${trend ? getTrendColor() : 'text-white/50'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {subtitle}
        </motion.div>
      )}
    </Card>
  );
}
