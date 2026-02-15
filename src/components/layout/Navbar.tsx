import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { BarChart3, PieChart, AlertTriangle, Brain, Shuffle, LogOut, Crown, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const getUserPlan = useAuthStore((state) => state.getUserPlan);
  const userPlan = getUserPlan();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/portfolio', label: 'Portfolio', icon: PieChart },
    { path: '/risk', label: 'Risk', icon: AlertTriangle },
    { path: '/behavior', label: 'Behavior', icon: Brain },
    { path: '/simulation', label: 'Simulation', icon: Shuffle },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:block fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[rgba(15,25,60,0.75)] backdrop-blur-xl border border-white/8 shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className="relative"
              >
                <motion.div
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                    transition-all duration-200
                    ${isActive
                      ? 'text-cyan'
                      : 'text-white/60 hover:text-white'
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </motion.div>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-cyan/15 rounded-full -z-10"
                    style={{ boxShadow: '0 0 20px rgba(10,196,224,0.2)' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          <div className="ml-2 pl-2 border-l border-white/10 flex items-center gap-2">
            {userPlan === 'free' ? (
              <Link to="/upgrade">
                <motion.button
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan to-blue text-white text-sm font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Sparkles size={16} />
                  Upgrade
                </motion.button>
              </Link>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan/20 to-blue/20 border border-cyan/30">
                <Crown size={14} className="text-cyan" />
                <span className="text-xs font-semibold text-cyan">Pro</span>
              </div>
            )}
            
            <motion.button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Logout"
            >
              <LogOut size={16} />
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="md:hidden fixed top-4 left-4 right-4 z-50">
        <div 
          className="px-4 py-3 rounded-2xl"
          style={{
            background: 'rgba(15, 25, 60, 0.75)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-dark to-cyan flex items-center justify-center">
                <span className="text-white font-bold text-sm">RL</span>
              </div>
              <span className="font-bold text-lg gradient-text">RiskLens</span>
              {userPlan === 'pro' && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan/20 border border-cyan/30">
                  <Crown size={12} className="text-cyan" />
                  <span className="text-xs font-semibold text-cyan">Pro</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {isMobileMenuOpen && (
            <motion.div
              className="mt-4 pt-4 border-t border-white/10 space-y-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {navItems.map(({ path, label, icon: Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-white bg-cyan/15'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </Link>
                );
              })}
              
              {userPlan === 'free' && (
                <Link
                  to="/upgrade"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-cyan/20 to-blue/20 border border-cyan/30 text-cyan"
                >
                  <Sparkles size={16} />
                  <span>Upgrade to Pro</span>
                </Link>
              )}
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </motion.div>
          )}
        </div>
      </nav>
    </>
  );
}