import { create } from 'zustand';
import { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { authService, UserProfile } from '../services/authService';
import { UserPlan } from '../utils/featureAccess';

interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  
  signupWithEmail: (name: string, email: string, password: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAsDemo: () => void;
  logout: () => Promise<void>;
  clearError: () => void;
  initAuth: () => void;
  loadUserProfile: (userId: string) => Promise<void>;
  getUserPlan: () => UserPlan;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  userProfile: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  isDemoMode: false,

  initAuth: () => {
    // Check for demo mode
    const demoMode = localStorage.getItem('risklens_demo_mode');
    if (demoMode === 'true') {
      set({ 
        user: { uid: 'demo-user' } as User,
        userProfile: {
          uid: 'demo-user',
          email: 'demo@risklens.app',
          displayName: 'Demo User',
          plan: 'pro',
          subscriptionStatus: 'active',
          createdAt: new Date(),
        },
        isAuthenticated: true,
        isDemoMode: true,
        loading: false 
      });
      return;
    }

    // Check for mock user in localStorage
    const currentUser = localStorage.getItem('current_user');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      const profileKey = `user_${user.uid}`;
      const profileData = localStorage.getItem(profileKey);
      const profile = profileData ? JSON.parse(profileData) : null;

      set({ 
        user,
        userProfile: profile,
        isAuthenticated: true, 
        loading: false 
      });
      return;
    }

    // Try Firebase auth if configured
    try {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const profile = await authService.getUserProfile(user.uid);
          set({ 
            user, 
            userProfile: profile,
            isAuthenticated: true, 
            loading: false 
          });
        } else {
          set({ 
            user: null,
            userProfile: null,
            isAuthenticated: false, 
            loading: false 
          });
        }
      });
    } catch (error) {
      // Firebase not configured, stay in loading: false state
      set({ loading: false });
    }
  },

  loadUserProfile: async (userId: string) => {
    try {
      const profile = await authService.getUserProfile(userId);
      set({ userProfile: profile });
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  },

  getUserPlan: (): UserPlan => {
    const { userProfile, isDemoMode } = get();
    if (isDemoMode) return 'pro';
    return userProfile?.plan || 'free';
  },

  loginAsDemo: () => {
    localStorage.setItem('risklens_demo_mode', 'true');
    set({ 
      user: { uid: 'demo-user' } as User,
      userProfile: {
        uid: 'demo-user',
        email: 'demo@risklens.app',
        displayName: 'Demo User',
        plan: 'pro',
        subscriptionStatus: 'active',
        createdAt: new Date(),
      },
      isAuthenticated: true,
      isDemoMode: true,
      loading: false 
    });
  },

  signupWithEmail: async (name: string, email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const user = await authService.signupWithEmail(name, email, password);
      const profile = await authService.getUserProfile(user.uid);
      set({ user, userProfile: profile, isAuthenticated: true, loading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Signup failed', 
        loading: false 
      });
      throw error;
    }
  },

  loginWithEmail: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const user = await authService.loginWithEmail(email, password);
      const profile = await authService.getUserProfile(user.uid);
      set({ user, userProfile: profile, isAuthenticated: true, loading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Login failed', 
        loading: false 
      });
      throw error;
    }
  },

  loginWithGoogle: async () => {
    try {
      set({ loading: true, error: null });
      const user = await authService.loginWithGoogle();
      const profile = await authService.getUserProfile(user.uid);
      set({ user, userProfile: profile, isAuthenticated: true, loading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Google login failed', 
        loading: false 
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      set({ loading: true, error: null });
      
      // Clear demo mode
      localStorage.removeItem('risklens_demo_mode');
      
      const isDemoMode = useAuthStore.getState().isDemoMode;
      if (!isDemoMode) {
        await authService.logout();
      }
      
      set({ user: null, userProfile: null, isAuthenticated: false, isDemoMode: false, loading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Logout failed', 
        loading: false 
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
