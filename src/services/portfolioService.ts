import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { PortfolioStock } from '../store/portfolioStore';

export interface FirestoreStock extends Omit<PortfolioStock, 'id'> {
  createdAt: Timestamp;
}

export const portfolioService = {
  async fetchPortfolio(userId: string): Promise<PortfolioStock[]> {
    const portfolioRef = collection(db, 'users', userId, 'portfolio');
    const q = query(portfolioRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as PortfolioStock[];
  },

  async addStock(userId: string, stock: Omit<PortfolioStock, 'id'>): Promise<string> {
    const portfolioRef = collection(db, 'users', userId, 'portfolio');
    const docRef = await addDoc(portfolioRef, {
      ...stock,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async removeStock(userId: string, stockId: string): Promise<void> {
    const stockRef = doc(db, 'users', userId, 'portfolio', stockId);
    await deleteDoc(stockRef);
  },

  async updateStockPrice(
    _userId: string,
    _stockId: string,
    _currentPrice: number
  ): Promise<void> {
    // Price updates are handled in memory, not persisted to Firestore
    // This keeps the database lean and reduces write operations
  },
};
