import { SelectHTMLAttributes, ReactNode } from 'react';

interface PremiumSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: ReactNode;
}

export default function PremiumSelect({ 
  label, 
  error, 
  children,
  className = '', 
  ...props 
}: PremiumSelectProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-white/70">
          {label}
        </label>
      )}
      <select
        className={`
          w-full px-4 py-3 
          bg-white/[0.06] backdrop-blur-sm
          border border-white/10 rounded-xl
          text-white
          focus:outline-none focus:border-cyan/50 focus:ring-2 focus:ring-cyan/20
          transition-all duration-200
          appearance-none
          cursor-pointer
          ${error ? 'border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20' : ''}
          ${className}
        `}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.4)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '1.5em 1.5em',
          paddingRight: '2.5rem'
        }}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-xs text-red-400 mt-1.5">{error}</p>
      )}
    </div>
  );
}
