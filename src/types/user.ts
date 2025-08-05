// User-related TypeScript interfaces and types

export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Simplified user profile (can be extended later)
export interface UserProfile {
  id: string;
  userId: string;
  bio?: string;
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  favoriteStyles?: string[];
  goals?: string[];
  injuries?: string[];
  restrictions?: string[];
  instructorNotes?: string;
}

// User authentication types
export interface AuthUser {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationData {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
}

export interface PasswordResetRequest {
  email: string;
}

// User session types
export interface UserSession {
  user: User;
  authUser: AuthUser;
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: string;
}

// User validation types
export interface UserValidationErrors {
  email?: string;
  fullName?: string;
  phoneNumber?: string;
}

// User action types
export interface UpdateUserProfileData {
  fullName?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
} 