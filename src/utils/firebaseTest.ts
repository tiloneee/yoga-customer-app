import { auth, db } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';

/**
 * Test Firebase connection and configuration
 * This utility helps verify that Firebase is properly configured
 */
export const firebaseTest = {
  /**
   * Test Firebase initialization
   */
  async testConnection(): Promise<boolean> {
    try {
      console.log('Testing Firebase connection...');
      
      // Test Auth service
      console.log('Auth service:', auth ? '✅ Initialized' : '❌ Not initialized');
      
      // Test Firestore service
      console.log('Firestore service:', db ? '✅ Initialized' : '❌ Not initialized');
      
      // Try to read from a test collection (will fail gracefully if no data)
      try {
        const testCollection = collection(db, 'test');
        await getDocs(testCollection);
        console.log('Firestore connection: ✅ Working');
      } catch (error) {
        console.log('Firestore connection: ⚠️ Config needed or network issue');
        console.log('Error:', error);
      }
      
      return true;
    } catch (error) {
      console.error('Firebase connection test failed:', error);
      return false;
    }
  },
  
  /**
   * Get Firebase configuration status
   */
  getConfigStatus(): { auth: boolean; firestore: boolean; config: boolean } {
    return {
      auth: !!auth,
      firestore: !!db,
      config: !!(process.env.EXPO_PUBLIC_FIREBASE_API_KEY && 
                process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID),
    };
  },
  
  /**
   * Log current Firebase configuration (without sensitive data)
   */
  logConfigStatus(): void {
    const status = this.getConfigStatus();
    console.log('🔥 Firebase Configuration Status:');
    console.log('  Auth Service:', status.auth ? '✅' : '❌');
    console.log('  Firestore Service:', status.firestore ? '✅' : '❌');
    console.log('  Environment Config:', status.config ? '✅' : '❌ Missing env vars');
    
    if (!status.config) {
      console.log('  📝 Please copy env.example to .env and configure your Firebase settings');
    }
  }
};