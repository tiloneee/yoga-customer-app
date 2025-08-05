// Common utility TypeScript interfaces and types

// Generic utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Nullable<T> = T | null;

export type Undefinable<T> = T | undefined;

export type NonNullable<T> = T extends null | undefined ? never : T;

// Date and time types
export type ISODateString = string; // ISO 8601 format

export type TimeString = string; // HH:MM format

export type DateRange = {
  start: ISODateString;
  end: ISODateString;
};

export type TimeRange = {
  start: TimeString;
  end: TimeString;
};

// ID types
export type UUID = string;

export type FirebaseDocumentId = string;

export type ExternalId = string;

// Status types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export type AsyncState<T> = {
  data: T | null;
  loading: LoadingState;
  error: string | null;
};

// Validation types
export type ValidationResult = {
  isValid: boolean;
  errors: Record<string, string>;
};

export type ValidationRule<T> = (value: T) => string | null;

export type ValidationSchema<T> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};

// Form types
export type FormField<T = any> = {
  value: T;
  error: string | null;
  touched: boolean;
  isValid: boolean;
};

export type FormState<T = Record<string, any>> = {
  values: T;
  errors: Record<keyof T, string>;
  touched: Record<keyof T, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
};

// Navigation types
export type NavigationParams = Record<string, any>;

export type RouteName = string;

export type NavigationState = {
  index: number;
  routes: Array<{
    key: string;
    name: RouteName;
    params?: NavigationParams;
  }>;
};

// Event types
export type EventHandler<T = any> = (event: T) => void;

export type AsyncEventHandler<T = any> = (event: T) => Promise<void>;

export type CallbackFunction<T = any, R = void> = (arg: T) => R;

export type AsyncCallbackFunction<T = any, R = any> = (arg: T) => Promise<R>;

// Error types
export type AppError = {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  stack?: string;
};

export type NetworkError = AppError & {
  statusCode?: number;
  url?: string;
  method?: string;
};

export type ValidationError = AppError & {
  field: string;
  value: any;
};

// Result types
export type Result<T, E = AppError> = {
  success: true;
  data: T;
} | {
  success: false;
  error: E;
};

export type AsyncResult<T, E = AppError> = Promise<Result<T, E>>;

// Pagination types
export type PaginationParams = {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

// Search types
export type SearchParams = {
  query?: string;
  filters?: Record<string, any>;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
};

export type SearchResult<T> = {
  items: T[];
  totalCount: number;
  query: string;
  filters: Record<string, any>;
  pagination: PaginationParams;
};

// File types
export type FileInfo = {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
};

export type ImageInfo = FileInfo & {
  width: number;
  height: number;
  altText?: string;
  thumbnailUrl?: string;
};

// Location types
export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type Address = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: Coordinates;
};

// Contact types
export type ContactInfo = {
  email?: string;
  phone?: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
};

// Currency types
export type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD';

export type Money = {
  amount: number;
  currency: Currency;
};

// Time types
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // Sunday = 0

export type TimeSlot = {
  startTime: TimeString;
  endTime: TimeString;
  dayOfWeek?: DayOfWeek;
};

export type Schedule = {
  id: string;
  name: string;
  timeSlots: TimeSlot[];
  timezone: string;
  isActive: boolean;
};

// Notification types
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export type Notification = {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
  scheduledFor?: string;
  expiresAt?: string;
};

// Permission types
export type Permission = 'camera' | 'photoLibrary' | 'location' | 'notifications' | 'microphone';

export type PermissionStatus = 'granted' | 'denied' | 'undetermined' | 'restricted';

export type PermissionState = Record<Permission, PermissionStatus>;

// Device types
export type Platform = 'ios' | 'android' | 'web';

export type DeviceType = 'phone' | 'tablet' | 'desktop';

export type DeviceInfo = {
  platform: Platform;
  version: string;
  model: string;
  brand: string;
  deviceType: DeviceType;
  screenWidth: number;
  screenHeight: number;
  scale: number;
  fontScale: number;
  isEmulator: boolean;
  isTablet: boolean;
};

// Theme types
export type ColorScheme = 'light' | 'dark' | 'system';

export type ThemeColors = {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  info: string;
};

export type Theme = {
  mode: ColorScheme;
  colors: ThemeColors;
  spacing: Record<string, number>;
  borderRadius: Record<string, number>;
  typography: Record<string, any>;
};

// Cache types
export type CacheEntry<T = any> = {
  key: string;
  data: T;
  timestamp: number;
  ttl: number;
  size: number;
};

export type CacheConfig = {
  maxSize: number;
  defaultTtl: number;
  cleanupInterval: number;
};

// Analytics types
export type AnalyticsEvent = {
  name: string;
  properties: Record<string, any>;
  timestamp: string;
  userId?: string;
  sessionId: string;
};

export type AnalyticsConfig = {
  enabled: boolean;
  trackingId: string;
  sessionTimeout: number;
  batchSize: number;
  flushInterval: number;
};

// Logger types
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type LogEntry = {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: Error;
};

export type LoggerConfig = {
  level: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  maxEntries: number;
};

// Storage types
export type StorageKey = string;

export type StorageValue = string | number | boolean | object | null;

export type StorageConfig = {
  prefix: string;
  encryption: boolean;
  compression: boolean;
  maxSize: number;
};

// Network types
export type NetworkStatus = 'online' | 'offline' | 'connecting';

export type NetworkConfig = {
  timeout: number;
  retryCount: number;
  retryDelay: number;
  baseURL: string;
  headers: Record<string, string>;
};

// Security types
export type SecurityConfig = {
  enableBiometrics: boolean;
  enableEncryption: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
  };
};

// Accessibility types
export type AccessibilityConfig = {
  enableScreenReader: boolean;
  enableHighContrast: boolean;
  enableReducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large';
  enableVoiceOver: boolean;
};

// Performance types
export type PerformanceMetric = {
  name: string;
  value: number;
  unit: string;
  timestamp: string;
  context?: Record<string, any>;
};

export type PerformanceConfig = {
  enableMonitoring: boolean;
  sampleRate: number;
  maxMetrics: number;
  thresholds: Record<string, number>;
}; 