import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFirebaseConfig, validateFirebaseConfig } from '../utils/firebaseConfig';

// Get Firebase configuration
const firebaseConfig = getFirebaseConfig();

// Validate configuration before initializing
if (!validateFirebaseConfig()) {
  console.error('❌ Firebase configuration is invalid. Please check your .env file.');
  throw new Error('Firebase configuration is invalid. Please check your .env file.');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app; 