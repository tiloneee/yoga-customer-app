// API-related TypeScript interfaces and types

import {
  User,
  AuthUser,
  UserProfile,
  UserStats,
  Course,
  CourseSearchResults,
  CourseReview,
  CourseStats,
  CourseCategory,
  Instructor,
  ClassInstance,
  ClassInstanceSearchResults,
  ClassInstanceAvailability,
  ClassInstanceReview,
  ClassInstanceStats,
  ClassLocation,
  Booking,
  BookingSearchResults,
  BookingReceipt,
  BookingHistory,
  BookingStats,
  WaitlistEntry,
  BookingPackage,
  PackageBooking,
  BookingNotification,
  BookingAnalytics,
  CourseAnalytics,
  ClassInstanceAnalytics,
  PaymentStatus
} from './index';

// Generic API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  pagination?: PaginationInfo;
  timestamp: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Authentication API types
export interface AuthResponse {
  user: User;
  authUser: AuthUser;
  token: string;
  refreshToken: string;
  expiresAt: string;
}

export interface LoginResponse extends ApiResponse<AuthResponse> {}

export interface RegisterResponse extends ApiResponse<AuthResponse> {}

export interface PasswordResetResponse extends ApiResponse<{ email: string }> {}

export interface RefreshTokenResponse extends ApiResponse<{
  token: string;
  refreshToken: string;
  expiresAt: string;
}> {}

// User API types
export interface GetUserResponse extends ApiResponse<User> {}

export interface UpdateUserResponse extends ApiResponse<User> {}

export interface GetUserProfileResponse extends ApiResponse<UserProfile> {}

export interface UpdateUserProfileResponse extends ApiResponse<UserProfile> {}

export interface GetUserStatsResponse extends ApiResponse<UserStats> {}

// Course API types
export interface GetCoursesResponse extends ApiResponse<CourseSearchResults> {}

export interface GetCourseResponse extends ApiResponse<Course> {}

export interface GetCourseReviewsResponse extends ApiResponse<{
  reviews: CourseReview[];
  pagination: PaginationInfo;
}> {}

export interface GetCourseStatsResponse extends ApiResponse<CourseStats> {}

export interface GetCourseCategoriesResponse extends ApiResponse<CourseCategory[]> {}

export interface GetInstructorsResponse extends ApiResponse<Instructor[]> {}

export interface GetInstructorResponse extends ApiResponse<Instructor> {}

// Class Instance API types
export interface GetClassInstancesResponse extends ApiResponse<ClassInstanceSearchResults> {}

export interface GetClassInstanceResponse extends ApiResponse<ClassInstance> {}

export interface GetClassInstanceAvailabilityResponse extends ApiResponse<ClassInstanceAvailability> {}

export interface GetClassInstanceReviewsResponse extends ApiResponse<{
  reviews: ClassInstanceReview[];
  pagination: PaginationInfo;
}> {}

export interface GetClassInstanceStatsResponse extends ApiResponse<ClassInstanceStats> {}

export interface GetLocationsResponse extends ApiResponse<ClassLocation[]> {}

// Booking API types
export interface CreateBookingResponse extends ApiResponse<Booking> {}

export interface GetBookingsResponse extends ApiResponse<BookingSearchResults> {}

export interface GetBookingResponse extends ApiResponse<Booking> {}

export interface UpdateBookingResponse extends ApiResponse<Booking> {}

export interface CancelBookingResponse extends ApiResponse<{
  booking: Booking;
  refundAmount?: number;
  refundReason?: string;
}> {}

export interface GetBookingReceiptResponse extends ApiResponse<BookingReceipt> {}

export interface GetBookingHistoryResponse extends ApiResponse<{
  history: BookingHistory[];
  pagination: PaginationInfo;
}> {}

export interface GetBookingStatsResponse extends ApiResponse<BookingStats> {}

export interface GetWaitlistResponse extends ApiResponse<{
  entries: WaitlistEntry[];
  pagination: PaginationInfo;
}> {}

export interface JoinWaitlistResponse extends ApiResponse<WaitlistEntry> {}

export interface LeaveWaitlistResponse extends ApiResponse<{ success: boolean }> {}

// Package API types
export interface GetPackagesResponse extends ApiResponse<BookingPackage[]> {}

export interface GetPackageResponse extends ApiResponse<BookingPackage> {}

export interface PurchasePackageResponse extends ApiResponse<PackageBooking> {}

export interface GetPackageBookingsResponse extends ApiResponse<{
  packageBookings: PackageBooking[];
  pagination: PaginationInfo;
}> {}

// Notification API types
export interface GetNotificationsResponse extends ApiResponse<{
  notifications: BookingNotification[];
  pagination: PaginationInfo;
}> {}

export interface MarkNotificationReadResponse extends ApiResponse<{ success: boolean }> {}

export interface DeleteNotificationResponse extends ApiResponse<{ success: boolean }> {}

// Search API types
export interface SearchCoursesResponse extends ApiResponse<CourseSearchResults> {}

export interface SearchClassInstancesResponse extends ApiResponse<ClassInstanceSearchResults> {}

export interface SearchBookingsResponse extends ApiResponse<BookingSearchResults> {}

// Analytics API types
export interface GetBookingAnalyticsResponse extends ApiResponse<BookingAnalytics> {}

export interface GetCourseAnalyticsResponse extends ApiResponse<CourseAnalytics> {}

export interface GetClassInstanceAnalyticsResponse extends ApiResponse<ClassInstanceAnalytics> {}

// File upload API types
export interface UploadImageResponse extends ApiResponse<{
  url: string;
  id: string;
  filename: string;
  size: number;
  mimeType: string;
}> {}

export interface UploadProfileImageResponse extends ApiResponse<{
  profileImageUrl: string;
}> {}

// Payment API types
export interface CreatePaymentIntentResponse extends ApiResponse<{
  clientSecret: string;
  paymentIntentId: string;
}> {}

export interface ConfirmPaymentResponse extends ApiResponse<{
  success: boolean;
  transactionId: string;
  amount: number;
  currency: string;
}> {}

export interface ProcessRefundResponse extends ApiResponse<{
  success: boolean;
  refundId: string;
  amount: number;
  reason: string;
}> {}

// Webhook types
export interface WebhookPayload {
  event: string;
  data: any;
  timestamp: string;
  signature: string;
}

export interface PaymentWebhookPayload {
  event: 'payment.succeeded' | 'payment.failed' | 'refund.processed';
  data: {
    bookingId: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    transactionId?: string;
  };
}

// Real-time update types
export interface RealtimeUpdate {
  type: 'booking' | 'class_instance' | 'course' | 'user';
  action: 'created' | 'updated' | 'deleted';
  data: any;
  timestamp: string;
}

export interface BookingUpdate extends RealtimeUpdate {
  type: 'booking';
  data: Booking;
}

export interface ClassInstanceUpdate extends RealtimeUpdate {
  type: 'class_instance';
  data: ClassInstance;
}

// Error response types
export interface ValidationErrorResponse extends ApiResponse {
  success: false;
  errors: Record<string, string[]>;
}

export interface NotFoundErrorResponse extends ApiResponse {
  success: false;
  error: 'NOT_FOUND';
  message: string;
}

export interface UnauthorizedErrorResponse extends ApiResponse {
  success: false;
  error: 'UNAUTHORIZED';
  message: string;
}

export interface ForbiddenErrorResponse extends ApiResponse {
  success: false;
  error: 'FORBIDDEN';
  message: string;
}

export interface ServerErrorResponse extends ApiResponse {
  success: false;
  error: 'INTERNAL_SERVER_ERROR';
  message: string;
}

// API request types
export interface ApiRequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
  retry?: boolean;
  retryCount?: number;
}

export interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  retryCount: number;
  retryDelay: number;
  headers: Record<string, string>;
}

// API middleware types
export interface ApiMiddleware {
  name: string;
  handler: (config: ApiRequestConfig) => ApiRequestConfig | Promise<ApiRequestConfig>;
}

export interface ApiResponseMiddleware {
  name: string;
  handler: (response: ApiResponse) => ApiResponse | Promise<ApiResponse>;
}

// API cache types
export interface ApiCacheConfig {
  enabled: boolean;
  ttl: number; // time to live in seconds
  maxSize: number;
  strategy: 'memory' | 'storage';
}

export interface CachedResponse<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
}

// API rate limiting types
export interface RateLimitConfig {
  enabled: boolean;
  maxRequests: number;
  windowMs: number;
  skipSuccessfulRequests: boolean;
  skipFailedRequests: boolean;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
} 