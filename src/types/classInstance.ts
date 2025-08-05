// Class Instance-related TypeScript interfaces and types

import { Course } from './course';

export interface ClassInstance {
  id: string;
  firebaseId: string;
  courseId: string;
  course?: Course; // Optional, can be populated when needed
  instructor: string;
  date: string; // Date in YYYY-MM-DD format
  time: string; // Time in HH:MM format
  dateTime: string; // Combined date and time
  currentBookings: number;
  status: ClassStatus;
  active: boolean;
  notes?: string;
  valid: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ClassStatus = 
  | 'scheduled' 
  | 'in-progress' 
  | 'completed' 
  | 'cancelled' 
  | 'full' 
  | 'waitlist';

// Class instance search and filtering types
export interface ClassInstanceSearchFilters {
  courseId?: string;
  instructor?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  timeRange?: {
    start: string;
    end: string;
  };
  status?: ClassStatus[];
  active?: boolean;
  valid?: boolean;
}

export interface ClassInstanceSearchParams {
  query?: string;
  filters?: ClassInstanceSearchFilters;
  sortBy?: 'date' | 'time' | 'status' | 'currentBookings';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ClassInstanceSearchResults {
  classInstances: ClassInstance[];
  totalCount: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Class instance validation types
export interface ClassInstanceValidationErrors {
  courseId?: string;
  instructor?: string;
  date?: string;
  time?: string;
  status?: string;
}

// Class instance action types
export interface CreateClassInstanceData {
  courseId: string;
  instructor: string;
  date: string;
  time: string;
  notes?: string;
}

export interface UpdateClassInstanceData {
  instructor?: string;
  date?: string;
  time?: string;
  status?: ClassStatus;
  notes?: string;
  active?: boolean;
  valid?: boolean;
} 