// Firebase-specific TypeScript interfaces and types

import { 
  User, 
  Course, 
  ClassInstance, 
  Booking, 
  Instructor,
  CourseCategory,
  ClassLocation,
  BookingPackage,
  WaitlistEntry,
  BookingNotification
} from './index';

// Firebase Document Types
export interface FirebaseDocument<T = any> {
  id: string;
  data: T;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

// Firestore Collection Names
export const COLLECTIONS = {
  USERS: 'users',
  COURSES: 'courses',
  CLASS_INSTANCES: 'classInstances',
  BOOKINGS: 'bookings',
  INSTRUCTORS: 'instructors',
  COURSE_CATEGORIES: 'courseCategories',
  LOCATIONS: 'locations',
  PACKAGES: 'packages',
  WAITLIST: 'waitlist',
  NOTIFICATIONS: 'notifications',
  REVIEWS: 'reviews',
  PAYMENTS: 'payments',
  ANALYTICS: 'analytics',
  SETTINGS: 'settings',
} as const;

export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];

// Firebase Document Mappings
export interface FirebaseUser extends FirebaseDocument<User> {
  collection: typeof COLLECTIONS.USERS;
}

export interface FirebaseCourse extends FirebaseDocument<Course> {
  collection: typeof COLLECTIONS.COURSES;
}

export interface FirebaseClassInstance extends FirebaseDocument<ClassInstance> {
  collection: typeof COLLECTIONS.CLASS_INSTANCES;
}

export interface FirebaseBooking extends FirebaseDocument<Booking> {
  collection: typeof COLLECTIONS.BOOKINGS;
}

export interface FirebaseInstructor extends FirebaseDocument<Instructor> {
  collection: typeof COLLECTIONS.INSTRUCTORS;
}

export interface FirebaseCourseCategory extends FirebaseDocument<CourseCategory> {
  collection: typeof COLLECTIONS.COURSE_CATEGORIES;
}

export interface FirebaseLocation extends FirebaseDocument<ClassLocation> {
  collection: typeof COLLECTIONS.LOCATIONS;
}

export interface FirebasePackage extends FirebaseDocument<BookingPackage> {
  collection: typeof COLLECTIONS.PACKAGES;
}

export interface FirebaseWaitlistEntry extends FirebaseDocument<WaitlistEntry> {
  collection: typeof COLLECTIONS.WAITLIST;
}

export interface FirebaseNotification extends FirebaseDocument<BookingNotification> {
  collection: typeof COLLECTIONS.NOTIFICATIONS;
}

// Firebase Query Types
export interface FirebaseQuery {
  collection: CollectionName;
  where?: FirebaseWhereClause[];
  orderBy?: FirebaseOrderByClause[];
  limit?: number;
  startAfter?: any;
  endBefore?: any;
}

export interface FirebaseWhereClause {
  field: string;
  operator: FirebaseWhereOperator;
  value: any;
}

export type FirebaseWhereOperator = 
  | '==' 
  | '!=' 
  | '<' 
  | '<=' 
  | '>' 
  | '>=' 
  | 'array-contains' 
  | 'array-contains-any' 
  | 'in' 
  | 'not-in';

export interface FirebaseOrderByClause {
  field: string;
  direction: 'asc' | 'desc';
}

// Firebase Real-time Listener Types
export interface FirebaseListener {
  id: string;
  query: FirebaseQuery;
  onNext: (snapshot: FirebaseSnapshot) => void;
  onError: (error: FirebaseError) => void;
  unsubscribe: () => void;
}

export interface FirebaseSnapshot {
  docs: FirebaseDocumentSnapshot[];
  empty: boolean;
  size: number;
  metadata: FirebaseSnapshotMetadata;
}

export interface FirebaseDocumentSnapshot {
  id: string;
  data: () => any;
  exists: boolean;
  metadata: FirebaseSnapshotMetadata;
  ref: FirebaseDocumentReference;
}

export interface FirebaseSnapshotMetadata {
  hasPendingWrites: boolean;
  fromCache: boolean;
}

export interface FirebaseDocumentReference {
  id: string;
  path: string;
  parent: FirebaseCollectionReference | null;
}

export interface FirebaseCollectionReference {
  id: string;
  path: string;
  parent: FirebaseDocumentReference | null;
}

// Firebase Error Types
export interface FirebaseError {
  code: string;
  message: string;
  details?: any;
  stack?: string;
}

export type FirebaseErrorCode = 
  | 'permission-denied'
  | 'unavailable'
  | 'not-found'
  | 'already-exists'
  | 'resource-exhausted'
  | 'failed-precondition'
  | 'aborted'
  | 'out-of-range'
  | 'unimplemented'
  | 'internal'
  | 'data-loss'
  | 'unauthenticated';

// Firebase Transaction Types
export interface FirebaseTransaction {
  get: (ref: FirebaseDocumentReference) => Promise<FirebaseDocumentSnapshot>;
  set: (ref: FirebaseDocumentReference, data: any) => FirebaseTransaction;
  update: (ref: FirebaseDocumentReference, data: any) => FirebaseTransaction;
  delete: (ref: FirebaseDocumentReference) => FirebaseTransaction;
}

// Firebase Batch Types
export interface FirebaseBatch {
  set: (ref: FirebaseDocumentReference, data: any) => FirebaseBatch;
  update: (ref: FirebaseDocumentReference, data: any) => FirebaseBatch;
  delete: (ref: FirebaseDocumentReference) => FirebaseBatch;
  commit: () => Promise<void>;
}

// Firebase Security Rules Types
export interface FirebaseSecurityRule {
  match: string;
  allow: 'read' | 'write' | 'read, write';
  if?: string;
}

export interface FirebaseSecurityRules {
  rules_version: string;
  service: string;
  match: FirebaseSecurityRule[];
}

// Firebase Index Types
export interface FirebaseIndex {
  collectionGroup: string;
  queryScope: 'COLLECTION' | 'COLLECTION_GROUP';
  fields: FirebaseIndexField[];
}

export interface FirebaseIndexField {
  fieldPath: string;
  order: 'ASCENDING' | 'DESCENDING';
  arrayConfig?: 'CONTAINS';
}

// Firebase Data Validation Types
export interface FirebaseValidationRule {
  field: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'timestamp';
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  enum?: any[];
  custom?: (value: any) => boolean;
}

export interface FirebaseValidationSchema {
  [collection: string]: FirebaseValidationRule[];
}

// Firebase Cache Types
export interface FirebaseCacheConfig {
  enabled: boolean;
  sizeBytes: number;
  timeToLive: number;
}

export interface FirebaseCacheEntry {
  key: string;
  data: any;
  timestamp: number;
  ttl: number;
}

// Firebase Analytics Types
export interface FirebaseAnalyticsEvent {
  name: string;
  parameters?: Record<string, any>;
  timestamp: string;
  userId?: string;
}

export interface FirebaseAnalyticsConfig {
  enabled: boolean;
  sessionTimeout: number;
  maxEvents: number;
}

// Firebase Performance Types
export interface FirebasePerformanceTrace {
  name: string;
  startTime: number;
  endTime?: number;
  attributes: Record<string, string>;
}

export interface FirebasePerformanceConfig {
  enabled: boolean;
  sampleRate: number;
  maxTraces: number;
}

// Firebase Functions Types
export interface FirebaseFunctionCall {
  name: string;
  data: any;
  timeout?: number;
}

export interface FirebaseFunctionResponse {
  data: any;
  error?: FirebaseError;
}

// Firebase Storage Types
export interface FirebaseStorageFile {
  name: string;
  bucket: string;
  fullPath: string;
  size: number;
  contentType: string;
  timeCreated: string;
  updated: string;
  metadata?: Record<string, string>;
}

export interface FirebaseStorageConfig {
  bucket: string;
  maxFileSize: number;
  allowedTypes: string[];
  cacheControl: string;
}

// Firebase Authentication Types
export interface FirebaseAuthUser {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  providerData: FirebaseUserInfo[];
  metadata: FirebaseUserMetadata;
  providerId: string;
  isAnonymous: boolean;
  refreshToken: string;
  tenantId: string | null;
  delete: () => Promise<void>;
  getIdToken: (forceRefresh?: boolean) => Promise<string>;
  getIdTokenResult: (forceRefresh?: boolean) => Promise<FirebaseIdTokenResult>;
  reload: () => Promise<void>;
  toJSON: () => object;
}

export interface FirebaseUserInfo {
  uid: string | null;
  displayName: string | null;
  photoURL: string | null;
  email: string | null;
  phoneNumber: string | null;
  providerId: string;
}

export interface FirebaseUserMetadata {
  creationTime?: string;
  lastSignInTime?: string;
  lastRefreshTime?: string;
}

export interface FirebaseIdTokenResult {
  token: string;
  authTime: string;
  issuedAtTime: string;
  expirationTime: string;
  signInProvider: string | null;
  claims: Record<string, any>;
}

// Firebase Configuration Types
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export interface FirebaseAppConfig {
  name?: string;
  automaticDataCollectionEnabled?: boolean;
}

// Firebase Error Handling Types
export interface FirebaseErrorHandler {
  handleError: (error: FirebaseError) => void;
  isRetryable: (error: FirebaseError) => boolean;
  getRetryDelay: (error: FirebaseError, attempt: number) => number;
  shouldRetry: (error: FirebaseError, attempt: number) => boolean;
}

// Firebase Connection Types
export interface FirebaseConnectionState {
  isConnected: boolean;
  lastConnected: string | null;
  connectionAttempts: number;
  lastError: FirebaseError | null;
}

// Firebase Migration Types
export interface FirebaseMigration {
  version: number;
  description: string;
  up: (db: any) => Promise<void>;
  down: (db: any) => Promise<void>;
}

export interface FirebaseMigrationState {
  currentVersion: number;
  migrations: FirebaseMigration[];
  isRunning: boolean;
  lastMigration?: number;
} 