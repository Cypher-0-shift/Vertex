import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { ReactNode } from 'react';

interface FeatureLockProps {
  isLocked: boolean;
  children: ReactNode;
  onUpgradeClick: () => void;
  featureName: string;
}

export default function FeatureLock({ isLocked, children, onUpgradeClick, featureName }: FeatureLockProps) {
  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="blur-sm pointer-events-none select-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-2xl">
        <motion.div
          className="text-center p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 rounded-full bg-cyan/10 flex items-center justify-center mx-auto mb-4">
            <Lock size={32} className="text-cyan" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {featureName} is a Pro Feature
          </h3>
          <p className="text-white/60 mb-4 max-w-sm">
            Upgrade to Pro to unlock advanced analytics and insights
          </p>
          <motion.button
            onClick={onUpgradeClick}
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Upgrade to Pro
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
