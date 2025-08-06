// Course-related TypeScript interfaces and types

export interface Course {
  id: number;
  firebaseId: string;
  courseName: string;
  courseType: string;
  description: string;
  durationMinutes: number;
  capacity: number;
  pricePerClass: number;
  instructor: string;
  studioRoom: string;
  imageUrl?: string;
  valid: boolean;
  createdAt: string;
  updatedAt: string;
}

// Course search and filtering types
export interface CourseSearchFilters {
  courseType?: string;
  instructor?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  duration?: {
    min: number;
    max: number;
  };
  valid?: boolean;
}

export interface CourseSearchParams {
  query?: string;
  filters?: CourseSearchFilters;
  sortBy?: 'courseName' | 'pricePerClass' | 'durationMinutes' | 'capacity';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CourseSearchResults {
  courses: Course[];
  totalCount: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Course validation types
export interface CourseValidationErrors {
  courseName?: string;
  description?: string;
  courseType?: string;
  durationMinutes?: string;
  capacity?: string;
  pricePerClass?: string;
  instructor?: string;
  studioRoom?: string;
}

// Course action types
export interface CreateCourseData {
  courseName: string;
  courseType: string;
  description: string;
  durationMinutes: number;
  capacity: number;
  pricePerClass: number;
  instructor: string;
  studioRoom: string;
  imageUrl?: string;
}

export interface UpdateCourseData {
  courseName?: string;
  courseType?: string;
  description?: string;
  durationMinutes?: number;
  capacity?: number;
  pricePerClass?: number;
  instructor?: string;
  studioRoom?: string;
  imageUrl?: string;
  valid?: boolean;
} 