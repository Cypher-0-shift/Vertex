import { InputHTMLAttributes } from 'react';

interface PremiumInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function PremiumInput({ 
  label, 
  error, 
  className = '', 
  ...props 
}: PremiumInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-white/70">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-3 
          bg-white/[0.05] backdrop-blur-sm
          border border-white/10 rounded-xl
          text-white placeholder-white/40
          focus:outline-none focus:border-purple/50 focus:ring-2 focus:ring-purple/20
          transition-all duration-200
          ${error ? 'border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-400 mt-1.5">{error}</p>
      )}
    </div>
  );
}
