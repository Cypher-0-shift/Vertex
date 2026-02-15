import { ButtonHTMLAttributes, ReactNode } from 'react';

interface PremiumButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'danger' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export default function PremiumButton({ 
  children, 
  variant = 'primary',
  size = 'md',
  className = '', 
  ...props 
}: PremiumButtonProps) {
  const baseStyles = 'font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'btn-primary text-white',
    danger: 'btn-danger',
    secondary: 'bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 rounded-xl'
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg'
  };
  
  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
}
