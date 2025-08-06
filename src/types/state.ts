// State management TypeScript interfaces and types

import React from 'react';
import {
  User,
  AuthUser,
  UserProfile,
  UserStats,
  UserPreferences,
  Course,
  CourseSearchResults,
  CourseSearchFilters,
  CourseCategory,
  Instructor,
  ClassInstance,
  ClassInstanceSearchResults,
  ClassInstanceSearchFilters,
  ClassInstanceAvailability,
  CachedResponse,
  AnalyticsEvent,
  LoginCredentials,
  RegistrationData,
  UpdateUserProfileData,
  UpdateUserPreferencesData,
  CourseSearchParams,
  ClassInstanceSearchParams
} from './index';

// Redux State Types
export interface RootState {
  auth: AuthState;
  user: UserState;
  courses: CoursesState;
  classInstances: ClassInstancesState;

  ui: UIState;
  app: AppState;
}

// Authentication State
export interface AuthState {
  user: User | null;
  authUser: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  refreshToken: string | null;
  expiresAt: string | null;
}

// User State
export interface UserState {
  profile: UserProfile | null;
  stats: UserStats | null;
  preferences: UserPreferences | null;
  isLoading: boolean;
  error: string | null;
  isUpdating: boolean;
}

// Courses State
export interface CoursesState {
  courses: Course[];
  featuredCourses: Course[];
  categories: CourseCategory[];
  instructors: Instructor[];
  currentCourse: Course | null;
  searchResults: CourseSearchResults | null;
  filters: CourseSearchFilters;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
}

// Class Instances State
export interface ClassInstancesState {
  classInstances: ClassInstance[];
  currentClassInstance: ClassInstance | null;
  searchResults: ClassInstanceSearchResults | null;
  filters: ClassInstanceSearchFilters;
  availability: Record<string, ClassInstanceAvailability>;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
}



// UI State
export interface UIState {
  theme: AppTheme;
  language: string;
  isLoading: boolean;
  loadingMessage: string | null;
  error: string | null;
  success: string | null;
  modal: ModalState | null;
  toast: ToastState | null;
  navigation: NavigationState;
  forms: FormState;
}

export interface AppTheme {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  textSecondaryColor: string;
  borderColor: string;
  errorColor: string;
  successColor: string;
  warningColor: string;
  infoColor: string;
}

export interface ModalState {
  id: string;
  type: 'confirmation' | 'form' | 'info' | 'custom';
  title: string;
  message?: string;
  component?: React.ComponentType<any>;
  props?: Record<string, any>;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  isVisible: boolean;
}

export interface ToastState {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration: number;
  isVisible: boolean;
  onPress?: () => void;
}

export interface NavigationState {
  currentRoute: string;
  previousRoute: string | null;
  params: Record<string, any>;
  history: string[];
  isNavigating: boolean;
}

export interface FormState {
  [formId: string]: {
    values: Record<string, any>;
    errors: Record<string, string>;
    touched: Record<string, boolean>;
    isValid: boolean;
    isSubmitting: boolean;
    isDirty: boolean;
  };
}

// App State
export interface AppState {
  isInitialized: boolean;
  isOnline: boolean;
  appVersion: string;
  buildNumber: string;
  deviceInfo: DeviceInfo;
  permissions: PermissionState;
  settings: AppSettings;
  cache: CacheState;
  analytics: AnalyticsState;
}

export interface DeviceInfo {
  platform: 'ios' | 'android' | 'web';
  version: string;
  model: string;
  brand: string;
  screenWidth: number;
  screenHeight: number;
  scale: number;
  fontScale: number;
  isTablet: boolean;
  isEmulator: boolean;
}

export interface PermissionState {
  camera: 'granted' | 'denied' | 'undetermined';
  photoLibrary: 'granted' | 'denied' | 'undetermined';
  location: 'granted' | 'denied' | 'undetermined';
  notifications: 'granted' | 'denied' | 'undetermined';
  microphone: 'granted' | 'denied' | 'undetermined';
}

export interface AppSettings {
  autoLogin: boolean;
  biometricAuth: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  dataUsage: 'low' | 'medium' | 'high';
  cacheSize: number;
  analyticsEnabled: boolean;
  crashReportingEnabled: boolean;
  debugMode: boolean;
}

export interface CacheState {
  courses: CachedResponse<Course[]>[];
  classInstances: CachedResponse<ClassInstance[]>[];
  user: CachedResponse<User> | null;
  totalSize: number;
  maxSize: number;
}

export interface AnalyticsState {
  sessionId: string;
  userId: string | null;
  events: AnalyticsEvent[];
  isEnabled: boolean;
}

export interface AnalyticsEvent {
  id: string;
  name: string;
  properties: Record<string, any>;
  timestamp: string;
  userId?: string;
  sessionId: string;
}

// Action Types
export interface AuthAction {
  type: string;
  payload?: any;
  error?: string;
}

export interface UserAction {
  type: string;
  payload?: any;
  error?: string;
}

export interface CoursesAction {
  type: string;
  payload?: any;
  error?: string;
}

export interface ClassInstancesAction {
  type: string;
  payload?: any;
  error?: string;
}



export interface UIAction {
  type: string;
  payload?: any;
  error?: string;
}

export interface AppAction {
  type: string;
  payload?: any;
  error?: string;
}

// Selector Types
export interface AuthSelectors {
  isAuthenticated: (state: RootState) => boolean;
  currentUser: (state: RootState) => User | null;
  authUser: (state: RootState) => AuthUser | null;
  isLoading: (state: RootState) => boolean;
  error: (state: RootState) => string | null;
  token: (state: RootState) => string | null;
}

export interface UserSelectors {
  profile: (state: RootState) => UserProfile | null;
  stats: (state: RootState) => UserStats | null;
  preferences: (state: RootState) => UserPreferences | null;
  isLoading: (state: RootState) => boolean;
  error: (state: RootState) => string | null;
}

export interface CoursesSelectors {
  courses: (state: RootState) => Course[];
  featuredCourses: (state: RootState) => Course[];
  categories: (state: RootState) => CourseCategory[];
  instructors: (state: RootState) => Instructor[];
  currentCourse: (state: RootState) => Course | null;
  searchResults: (state: RootState) => CourseSearchResults | null;
  isLoading: (state: RootState) => boolean;
  error: (state: RootState) => string | null;
  hasMore: (state: RootState) => boolean;
}

export interface ClassInstancesSelectors {
  classInstances: (state: RootState) => ClassInstance[];
  currentClassInstance: (state: RootState) => ClassInstance | null;
  searchResults: (state: RootState) => ClassInstanceSearchResults | null;
  availability: (state: RootState) => Record<string, ClassInstanceAvailability>;
  isLoading: (state: RootState) => boolean;
  error: (state: RootState) => string | null;
  hasMore: (state: RootState) => boolean;
}



export interface UISelectors {
  theme: (state: RootState) => AppTheme;
  language: (state: RootState) => string;
  isLoading: (state: RootState) => boolean;
  loadingMessage: (state: RootState) => string | null;
  error: (state: RootState) => string | null;
  success: (state: RootState) => string | null;
  modal: (state: RootState) => ModalState | null;
  toast: (state: RootState) => ToastState | null;
}

export interface AppSelectors {
  isInitialized: (state: RootState) => boolean;
  isOnline: (state: RootState) => boolean;
  deviceInfo: (state: RootState) => DeviceInfo;
  permissions: (state: RootState) => PermissionState;
  settings: (state: RootState) => AppSettings;
}

// Context Types
export interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegistrationData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: UpdateUserProfileData) => Promise<void>;
  updatePreferences: (data: UpdateUserPreferencesData) => Promise<void>;
}

export interface UserContextType {
  state: UserState;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: UpdateUserProfileData) => Promise<void>;
  fetchStats: () => Promise<void>;
  updatePreferences: (data: UpdateUserPreferencesData) => Promise<void>;
}

export interface CoursesContextType {
  state: CoursesState;
  fetchCourses: (params?: CourseSearchParams) => Promise<void>;
  fetchCourse: (id: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchInstructors: () => Promise<void>;
  searchCourses: (params: CourseSearchParams) => Promise<void>;
  clearSearch: () => void;
  setFilters: (filters: CourseSearchFilters) => void;
}

export interface ClassInstancesContextType {
  state: ClassInstancesState;
  fetchClassInstances: (params?: ClassInstanceSearchParams) => Promise<void>;
  fetchClassInstance: (id: string) => Promise<void>;
  fetchAvailability: (id: string) => Promise<void>;
  searchClassInstances: (params: ClassInstanceSearchParams) => Promise<void>;
  clearSearch: () => void;
  setFilters: (filters: ClassInstanceSearchFilters) => void;
}



export interface UIContextType {
  state: UIState;
  setTheme: (theme: AppTheme) => void;
  setLanguage: (language: string) => void;
  setLoading: (loading: boolean, message?: string) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
  showModal: (modal: Omit<ModalState, 'isVisible'>) => void;
  hideModal: () => void;
  showToast: (toast: Omit<ToastState, 'isVisible'>) => void;
  hideToast: () => void;
  updateForm: (formId: string, updates: Partial<FormState[string]>) => void;
  resetForm: (formId: string) => void;
}

export interface AppContextType {
  state: AppState;
  initialize: () => Promise<void>;
  checkPermissions: () => Promise<void>;
  requestPermission: (permission: keyof PermissionState) => Promise<void>;
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  clearCache: () => Promise<void>;
  trackEvent: (event: Omit<AnalyticsEvent, 'id' | 'timestamp' | 'sessionId'>) => void;
} 