// Booking-related TypeScript interfaces and types

import {
  User,
  ClassInstance,
  Course
} from './index';

// Main booking interface for the new booking collection
export interface Booking {
  id: string;
  userId: string;
  user?: User; // Optional, can be populated when needed
  classInstanceId: string;
  classInstance?: ClassInstance; // Optional, can be populated when needed
  courseId: string;
  course?: Course; // Optional, can be populated when needed
  instructor: string;
  bookingStatus: BookingStatus;
  bookingType: BookingType;
  paymentStatus: PaymentStatus;
  amount: number;
  bookingDate: string; // ISO 8601 format
  classDate: string; // Date of the class
  classTime: string; // Time of the class
  cancellationDate?: string;
  cancellationReason?: string;
  refundAmount?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 
  | 'confirmed' 
  | 'waitlisted' 
  | 'cancelled' 
  | 'completed' 
  | 'no-show' 
  | 'refunded';

export type BookingType = 
  | 'regular' 
  | 'waitlist' 
  | 'recurring' 
  | 'package' 
  | 'promotional';

export type PaymentStatus = 
  | 'pending' 
  | 'paid' 
  | 'refunded' 
  | 'failed' 
  | 'cancelled';

// Booking search and filtering types
export interface BookingSearchFilters {
  userId?: string;
  classInstanceId?: string;
  courseId?: string;
  instructor?: string;
  status?: BookingStatus[];
  bookingType?: BookingType[];
  paymentStatus?: PaymentStatus[];
  dateRange?: {
    start: string;
    end: string;
  };
  amountRange?: {
    min: number;
    max: number;
  };
}

export interface BookingSearchParams {
  filters?: BookingSearchFilters;
  sortBy?: 'bookingDate' | 'classDate' | 'status' | 'amount' | 'instructor';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface BookingSearchResults {
  bookings: Booking[];
  totalCount: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Booking validation types
export interface BookingValidationErrors {
  userId?: string;
  classInstanceId?: string;
  bookingDate?: string;
  amount?: string;
  bookingType?: string;
}

// Booking action types
export interface CreateBookingData {
  userId: string;
  classInstanceId: string;
  courseId: string;
  instructor: string;
  bookingType: BookingType;
  amount: number;
  bookingDate: string;
  classDate: string;
  classTime: string;
  notes?: string;
}

export interface UpdateBookingData {
  bookingStatus?: BookingStatus;
  paymentStatus?: PaymentStatus;
  notes?: string;
  cancellationReason?: string;
  refundAmount?: number;
}

export interface CancelBookingData {
  bookingId: string;
  reason: string;
  refundAmount?: number;
}

// Booking statistics types
export interface BookingStats {
  totalBookings: number;
  confirmedBookings: number;
  waitlistedBookings: number;
  cancelledBookings: number;
  completedBookings: number;
  noShowBookings: number;
  totalRevenue: number;
  averageBookingValue: number;
  bookingTrends: Array<{
    date: string;
    bookings: number;
    revenue: number;
  }>;
  popularCourses: Array<{
    courseId: string;
    courseName: string;
    bookingCount: number;
  }>;
  popularInstructors: Array<{
    instructor: string;
    bookingCount: number;
  }>;
} 