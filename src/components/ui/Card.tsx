import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ 
  children, 
  className = '', 
  hover = false 
}: CardProps) {
  if (hover) {
    return (
      <motion.div 
        className={`p-6 glass-card-hover ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{ y: -4 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={`p-6 glass-card ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}
