import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Brain, Target, Shuffle, TrendingUp, BarChart3 } from 'lucide-react';
import AnimatedBackground from '../components/layout/AnimatedBackground';
import { useAuthStore } from '../store/authStore';

export default function LandingPage() {
  const navigate = useNavigate();
  const loginAsDemo = useAuthStore((state) => state.loginAsDemo);

  const handleDemoAccess = () => {
    loginAsDemo();
    navigate('/dashboard');
  };
  const features = [
    {
      icon: Shield,
      title: 'Risk Intelligence Engine',
      description: 'Multi-factor risk analysis across concentration, sector, debt, valuation, and behavioral patterns.'
    },
    {
      icon: Brain,
      title: 'Behavioral Analysis',
      description: 'Understand your trading patterns and identify emotional decision-making triggers.'
    },
    {
      icon: Target,
      title: 'Diversification Suggestions',
      description: 'Get actionable recommendations to optimize your portfolio allocation.'
    },
    {
      icon: Shuffle,
      title: 'What-If Simulation',
      description: 'Test portfolio adjustments and predict risk score changes before making moves.'
    }
  ];

  const steps = [
    { number: '01', title: 'Add Your Portfolio', description: 'Import your Indian equity holdings with live market data' },
    { number: '02', title: 'Analyze Risk', description: 'Get comprehensive risk breakdown across multiple dimensions' },
    { number: '03', title: 'Improve Allocation', description: 'Follow intelligent suggestions to optimize your portfolio' }
  ];

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      {/* Navbar */}
      <nav className="fixed top-6 left-0 right-0 z-50 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 rounded-full bg-[rgba(15,25,60,0.75)] backdrop-blur-xl border border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan to-blue flex items-center justify-center">
              <BarChart3 size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">RiskLens</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <motion.button 
                className="px-6 py-2 rounded-full text-sm font-medium text-white/80 hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login
              </motion.button>
            </Link>
            <Link to="/signup">
              <motion.button 
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1 
            className="text-6xl md:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="gradient-text">Intelligent Portfolio</span>
            <br />
            <span className="text-white">Risk Monitoring</span>
            <br />
            <span className="text-white/80 text-5xl">for Indian Investors</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-white/60 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Understand your risk. Improve your allocation. Invest with clarity.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link to="/signup">
              <motion.button 
                className="btn-primary text-lg px-10 py-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </Link>
            <motion.button 
              onClick={handleDemoAccess}
              className="px-10 py-4 rounded-xl text-lg font-semibold text-white/80 hover:text-white border border-white/10 hover:border-white/20 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Demo
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold gradient-text mb-4">Powerful Features</h2>
            <p className="text-white/60 text-lg">Everything you need to manage portfolio risk intelligently</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="p-6 glass-card-hover"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div className="w-12 h-12 rounded-xl bg-cyan/10 flex items-center justify-center mb-4">
                  <feature.icon className="text-cyan" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold gradient-text mb-4">How It Works</h2>
            <p className="text-white/60 text-lg">Get started in three simple steps</p>
          </motion.div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className="flex items-start gap-6 p-8 glass-card"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <div className="text-6xl font-bold text-cyan/20">{step.number}</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-white/60 text-lg">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold gradient-text mb-6">Start Managing Risk Smarter</h2>
            <p className="text-xl text-white/60 mb-10">Join Indian investors who trust RiskLens for portfolio intelligence</p>
            <Link to="/signup">
              <motion.button 
                className="btn-primary text-lg px-12 py-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started Free
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/40 text-sm">© 2026 RiskLens. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
