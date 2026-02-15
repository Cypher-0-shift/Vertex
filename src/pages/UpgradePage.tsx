import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, Crown } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { paymentService } from '../services/paymentService';
import { getPlanFeatures } from '../utils/featureAccess';
import { useState } from 'react';

export default function UpgradePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const loadUserProfile = useAuthStore((state) => state.loadUserProfile);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const freeFeatures = getPlanFeatures('free');
  const proFeatures = getPlanFeatures('pro');

  const handleUpgrade = async () => {
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const result = await paymentService.mockUpgradeToPro(user.uid);
      if (result.success) {
        await loadUserProfile(user.uid);
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.message || 'Upgrade failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold gradient-text mb-4">Upgrade to Pro</h1>
          <p className="text-xl text-white/60">
            Unlock the full power of RiskLens portfolio intelligence
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Free Plan */}
          <motion.div
            className="glass-card p-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Free</h2>
              <div className="text-4xl font-bold text-white/60 mb-4">₹0</div>
              <p className="text-white/60">Perfect for getting started</p>
            </div>
            <ul className="space-y-4 mb-8">
              {freeFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check size={20} className="text-white/40 mt-1 flex-shrink-0" />
                  <span className="text-white/60">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            className="glass-card p-8 border-2 border-cyan/30 bg-cyan/5 relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="absolute top-6 right-6">
              <Crown size={32} className="text-cyan" />
            </div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold gradient-text mb-2">Pro</h2>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold gradient-text">₹999</span>
                <span className="text-white/60">/month</span>
              </div>
              <p className="text-white/80">Complete portfolio intelligence</p>
            </div>
            <ul className="space-y-4 mb-8">
              {proFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check size={20} className="text-cyan mt-1 flex-shrink-0" />
                  <span className="text-white">{feature}</span>
                </li>
              ))}
            </ul>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <motion.button
              onClick={handleUpgrade}
              disabled={loading}
              className="btn-primary w-full text-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Processing...' : 'Upgrade to Pro'}
            </motion.button>
          </motion.div>
        </div>

        <div className="text-center text-white/40 text-sm">
          <p>Cancel anytime. No hidden fees. 30-day money-back guarantee.</p>
        </div>
      </div>
    </div>
  );
}
