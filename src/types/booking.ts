// Booking-related TypeScript interfaces and types

export interface Booking {
  id: number;
  firebaseId: string;
  instancesId: number; // References the id of instances collection
  createdAt: string | number | { toDate: () => Date };
  userId: string; // References the id of users collection
  status: BookingStatus;
}

export type BookingStatus = 
  | 'confirmed' 
  | 'pending' 
  | 'cancelled' 
  | 'completed' 
  | 'no-show'
  | 'attended';

// Booking search and filtering types
export interface BookingSearchFilters {
  userId?: string;
  instancesId?: number;
  status?: BookingStatus[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface BookingSearchParams {
  query?: string;
  filters?: BookingSearchFilters;
  sortBy?: 'createdAt' | 'status';
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
  instancesId?: string;
  userId?: string;
  status?: string;
}

// Booking action types
export interface CreateBookingData {
  instancesId: number;
  userId: string;
  status?: BookingStatus;
}

export interface UpdateBookingData {
  status?: BookingStatus;
}

// Extended booking with instance and course details
export interface BookingWithDetails extends Booking {
  instance?: {
    id: number;
    courseId: number;
    instructor: string;
    date: string;
    time: string;
    currentBookings: number;
    status: string;
  };
  course?: {
    id: number;
    courseName: string;
    courseType: string;
    durationMinutes: number;
    capacity: number;
    pricePerClass: number;
    instructor: string;
    studioRoom: string;
  };
} 