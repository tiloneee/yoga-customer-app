import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  UserCredential,
} from 'firebase/auth';
import { auth } from './firebase';
import { User as AppUser } from '../types/user';

export interface AuthError {
  code: string;
  message: string;
}

export const authService = {
  // Register new user
  async register(email: string, password: string, displayName?: string): Promise<UserCredential> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with display name if provided
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }
    
    return userCredential;
  },

  // Sign in existing user
  async signIn(email: string, password: string): Promise<UserCredential> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  },

  // Sign out user
  async signOut(): Promise<void> {
    await signOut(auth);
  },

  // Reset password
  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  },

  // Update user profile
  async updateProfile(user: User, data: Partial<AppUser>): Promise<void> {
    const updateData: { displayName?: string; photoURL?: string } = {};
    
    if (data.fullName) {
      updateData.displayName = data.fullName;
    }
    
    if (data.profileImageUrl) {
      updateData.photoURL = data.profileImageUrl;
    }
    
    await updateProfile(user, updateData);
  },

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  },

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: User | null) => void) {
    return auth.onAuthStateChanged(callback);
  },
}; 