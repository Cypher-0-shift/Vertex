import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { getPlanFeatures } from '../../utils/featureAccess';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  feature?: string;
}

export default function UpgradeModal({ isOpen, onClose, onUpgrade, feature }: UpgradeModalProps) {
  const freeFeatures = getPlanFeatures('free');
  const proFeatures = getPlanFeatures('pro');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              className="glass-card p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold gradient-text mb-2">Upgrade to Pro</h2>
                  {feature && (
                    <p className="text-white/60">
                      Unlock {feature} and all premium features
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <X size={24} className="text-white/60" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Free Plan */}
                <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-white mb-2">Free</h3>
                    <div className="text-3xl font-bold text-white/60">₹0</div>
                  </div>
                  <ul className="space-y-3">
                    {freeFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 text-white/60">
                        <Check size={20} className="text-white/40 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pro Plan */}
                <div className="p-6 rounded-2xl border-2 border-cyan/30 bg-cyan/5 relative overflow-hidden">
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-full bg-cyan/20 text-cyan text-xs font-semibold">
                      RECOMMENDED
                    </span>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-white mb-2">Pro</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold gradient-text">₹999</span>
                      <span className="text-white/60">/month</span>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {proFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 text-white">
                        <Check size={20} className="text-cyan mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    onClick={onUpgrade}
                    className="btn-primary w-full"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Upgrade Now
                  </motion.button>
                </div>
              </div>

              <div className="text-center text-sm text-white/40">
                <p>Cancel anytime. No hidden fees.</p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
