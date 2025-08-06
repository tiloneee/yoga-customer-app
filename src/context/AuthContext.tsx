import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { authService, AuthError } from '../api/authService';
import { firestoreService } from '../api/firestoreService';
import { User as AppUser, UserSession, LoginCredentials, RegistrationData } from '../types/user';

interface AuthContextType {
  user: User | null;
  appUser: AppUser | null;
  session: UserSession;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegistrationData) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
  updateProfile: (data: Partial<AppUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const session: UserSession = {
    user: appUser!,
    authUser: user ? {
      uid: user.uid,
      email: user.email || '',
      emailVerified: user.emailVerified,
      displayName: user.displayName || undefined,
      photoURL: user.photoURL || undefined,
      phoneNumber: user.phoneNumber || undefined,
    } : null!,
    isAuthenticated: !!user,
    isLoading,
    error: error || undefined,
  };

  // Fetch user data from Firestore
  const fetchUserData = async (firebaseUser: User) => {
    try {
      const userData = await firestoreService.getDocument<AppUser>('users', firebaseUser.uid);
      
      if (userData) {
        setAppUser(userData.data);
      } else {
        // If user doesn't exist in Firestore, create a default user
        const defaultUserData: AppUser = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          fullName: firebaseUser.displayName || '',
          phoneNumber: firebaseUser.phoneNumber || undefined,
          profileImageUrl: firebaseUser.photoURL || undefined,
          role: 'customer', // Default role
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setAppUser(defaultUserData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Fallback to default user data
      const defaultUserData: AppUser = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        fullName: firebaseUser.displayName || '',
        phoneNumber: firebaseUser.phoneNumber || undefined,
        profileImageUrl: firebaseUser.photoURL || undefined,
        role: 'customer',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setAppUser(defaultUserData);
    }
  };

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Fetch user data from Firestore
        await fetchUserData(firebaseUser);
      } else {
        setAppUser(null);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.signIn(credentials.email, credentials.password);
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegistrationData): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const userCredential = await authService.register(data.email, data.password, data.fullName);
      
      // Create user document in Firestore
      const userData: AppUser = {
        id: userCredential.user.uid,
        email: data.email,
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        profileImageUrl: userCredential.user.photoURL || undefined,
        role: 'customer', // Default role for new users
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await firestoreService.addDocument('users', userData);
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.signOut();
      setUser(null);
      setAppUser(null);
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.resetPassword(email);
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<AppUser>): Promise<void> => {
    if (!user || !appUser) {
      throw new Error('No user logged in');
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Update Firebase Auth profile
      await authService.updateProfile(user, data);
      
      // Update Firestore user document
      await firestoreService.updateDocument('users', user.uid, data);
      
      // Update local state
      setAppUser(prev => prev ? { ...prev, ...data, updatedAt: new Date().toISOString() } : null);
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  const contextValue: AuthContextType = {
    user,
    appUser,
    session,
    isLoading,
    error,
    login,
    register,
    logout,
    resetPassword,
    clearError,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 