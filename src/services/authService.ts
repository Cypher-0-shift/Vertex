import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const googleProvider = new GoogleAuthProvider();

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  plan: 'free' | 'pro';
  subscriptionStatus: 'active' | 'inactive';
  createdAt: Date;
  upgradedAt?: Date;
}

// Mock mode - no Firebase required
const MOCK_MODE = true;

export const authService = {
  async signupWithEmail(name: string, email: string, password: string): Promise<User> {
    if (MOCK_MODE) {
      // Mock user creation
      const mockUser = {
        uid: `mock-${Date.now()}`,
        email,
        displayName: name,
      } as User;

      const userProfile: UserProfile = {
        uid: mockUser.uid,
        email: email,
        displayName: name,
        plan: 'free',
        subscriptionStatus: 'inactive',
        createdAt: new Date(),
      };

      localStorage.setItem(`user_${mockUser.uid}`, JSON.stringify(userProfile));
      localStorage.setItem('current_user', JSON.stringify(mockUser));

      return mockUser;
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: name });

    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName: name,
      plan: 'free',
      subscriptionStatus: 'inactive',
      createdAt: new Date(),
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);

    return user;
  },

  async loginWithEmail(email: string, password: string): Promise<User> {
    if (MOCK_MODE) {
      // Mock login - just return a mock user
      const mockUser = {
        uid: `mock-${email}`,
        email,
        displayName: email.split('@')[0],
      } as User;

      localStorage.setItem('current_user', JSON.stringify(mockUser));

      // Create profile if doesn't exist
      const profileKey = `user_${mockUser.uid}`;
      if (!localStorage.getItem(profileKey)) {
        const userProfile: UserProfile = {
          uid: mockUser.uid,
          email: email,
          displayName: email.split('@')[0],
          plan: 'free',
          subscriptionStatus: 'inactive',
          createdAt: new Date(),
        };
        localStorage.setItem(profileKey, JSON.stringify(userProfile));
      }

      return mockUser;
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  async loginWithGoogle(): Promise<User> {
    if (MOCK_MODE) {
      // Mock Google login
      const mockUser = {
        uid: `mock-google-${Date.now()}`,
        email: 'user@gmail.com',
        displayName: 'Google User',
      } as User;

      localStorage.setItem('current_user', JSON.stringify(mockUser));

      const userProfile: UserProfile = {
        uid: mockUser.uid,
        email: mockUser.email!,
        displayName: mockUser.displayName!,
        plan: 'free',
        subscriptionStatus: 'inactive',
        createdAt: new Date(),
      };

      localStorage.setItem(`user_${mockUser.uid}`, JSON.stringify(userProfile));

      return mockUser;
    }

    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || 'User',
        plan: 'free',
        subscriptionStatus: 'inactive',
        createdAt: new Date(),
      };
      await setDoc(doc(db, 'users', user.uid), userProfile);
    }

    return user;
  },

  async logout(): Promise<void> {
    if (MOCK_MODE) {
      localStorage.removeItem('current_user');
      return;
    }

    await signOut(auth);
  },

  getCurrentUser(): User | null {
    if (MOCK_MODE) {
      const stored = localStorage.getItem('current_user');
      return stored ? JSON.parse(stored) : null;
    }

    return auth.currentUser;
  },

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    if (MOCK_MODE) {
      const stored = localStorage.getItem(`user_${userId}`);
      return stored ? JSON.parse(stored) : null;
    }

    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  },
};
