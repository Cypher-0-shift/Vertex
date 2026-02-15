import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import AnimatedBackground from './components/layout/AnimatedBackground';
import PageTransition from './components/layout/PageTransition';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import PortfolioPage from './pages/PortfolioPage';
import RiskPage from './pages/RiskPage';
import BehaviorPage from './pages/BehaviorPage';
import SimulationPage from './pages/SimulationPage';
import UpgradePage from './pages/UpgradePage';
import { usePriceRefresh } from './hooks/usePriceRefresh';
import { useAuthStore } from './store/authStore';
import { usePortfolioStore } from './store/portfolioStore';

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  usePriceRefresh();
  const location = useLocation();
  const initAuth = useAuthStore((state) => state.initAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const loadPortfolio = usePortfolioStore((state) => state.loadPortfolio);
  const clearPortfolio = usePortfolioStore((state) => state.clearPortfolio);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadPortfolio(user.uid);
    } else {
      clearPortfolio();
    }
  }, [isAuthenticated, user, loadPortfolio, clearPortfolio]);

  const isAuthPage = ['/login', '/signup', '/'].includes(location.pathname);

  return (
    <>
      {!isAuthPage && <AnimatedBackground />}
      {!isAuthPage && isAuthenticated && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <PageTransition><DashboardPage /></PageTransition>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/portfolio" 
            element={
              <ProtectedRoute>
                <PageTransition><PortfolioPage /></PageTransition>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/risk" 
            element={
              <ProtectedRoute>
                <PageTransition><RiskPage /></PageTransition>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/behavior" 
            element={
              <ProtectedRoute>
                <PageTransition><BehaviorPage /></PageTransition>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/simulation" 
            element={
              <ProtectedRoute>
                <PageTransition><SimulationPage /></PageTransition>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/upgrade" 
            element={
              <ProtectedRoute>
                <PageTransition><UpgradePage /></PageTransition>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
