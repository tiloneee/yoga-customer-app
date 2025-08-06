import { coursesService, instancesService } from './firestoreService';
import { Course, CourseSearchParams, CourseSearchResults, CourseSearchFilters } from '../types/course';
import { ClassInstance } from '../types/classInstance';

export interface CourseError {
  code: string;
  message: string;
}

export const courseService = {
  // Get all courses
  async getAllCourses(): Promise<Course[]> {
    try {
      const result = await coursesService.getAllCourses({
        where: [{ field: 'valid', operator: '==', value: true }]
      });
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      return result.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw new Error('Failed to fetch courses');
    }
  },

  // Get course by ID
  async getCourseById(courseId: number): Promise<Course[]> {
    try {
      const result = await coursesService.getCourseById(courseId);
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      return result.data ? [result.data] : [];
    } catch (error) {
      console.error('Error fetching course:', error);
      throw new Error('Failed to fetch course');
    }
  },

  // Get course by Firebase ID
  async getCourseByFirebaseId(firebaseId: string): Promise<Course | null> {
    try {
      const result = await coursesService.getCourseByFirebaseId(firebaseId);
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      return result.data;
    } catch (error) {
      console.error('Error fetching course:', error);
      throw new Error('Failed to fetch course');
    }
  },

  // Search courses with filters
  async searchCourses(params: CourseSearchParams): Promise<CourseSearchResults> {
    try {
      let courses = await this.getAllCourses();
      
      // Apply search query
      if (params.query) {
        const query = params.query.toLowerCase();
        courses = courses.filter(course => 
          (course.courseName?.toLowerCase() || '').includes(query) ||
          (course.description?.toLowerCase() || '').includes(query) ||
          (course.instructor?.toLowerCase() || '').includes(query) ||
          (course.courseType?.toLowerCase() || '').includes(query)
        );
      }

      // Apply filters
      if (params.filters) {
        courses = this.applyFilters(courses, params.filters);
      }

      // Apply sorting
      if (params.sortBy) {
        courses = this.sortCourses(courses, params.sortBy, params.sortOrder || 'asc');
      }

      // Apply pagination
      const page = params.page || 1;
      const limit = params.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedCourses = courses.slice(startIndex, endIndex);

      return {
        courses: paginatedCourses,
        totalCount: courses.length,
        page,
        totalPages: Math.ceil(courses.length / limit),
        hasNextPage: endIndex < courses.length,
        hasPreviousPage: page > 1,
      };
    } catch (error) {
      console.error('Error searching courses:', error);
      throw new Error('Failed to search courses');
    }
  },

  // Apply filters to courses
  applyFilters(courses: Course[], filters: CourseSearchFilters): Course[] {
    return courses.filter(course => {
      // Course type filter
      if (filters.courseType && course.courseType !== filters.courseType) {
        return false;
      }

      // Instructor filter
      if (filters.instructor && course.instructor !== filters.instructor) {
        return false;
      }

      // Price range filter
      if (filters.priceRange && course.pricePerClass !== undefined) {
        if (course.pricePerClass < filters.priceRange.min || course.pricePerClass > filters.priceRange.max) {
          return false;
        }
      }

      // Duration filter
      if (filters.duration && course.durationMinutes !== undefined) {
        if (course.durationMinutes < filters.duration.min || course.durationMinutes > filters.duration.max) {
          return false;
        }
      }

      // Valid filter
      if (filters.valid !== undefined && course.valid !== filters.valid) {
        return false;
      }

      return true;
    });
  },

  // Sort courses
  sortCourses(courses: Course[], sortBy: string, sortOrder: 'asc' | 'desc'): Course[] {
    return courses.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'courseName':
          aValue = a.courseName?.toLowerCase() || '';
          bValue = b.courseName?.toLowerCase() || '';
          break;
        case 'pricePerClass':
          aValue = a.pricePerClass || 0;
          bValue = b.pricePerClass || 0;
          break;
        case 'durationMinutes':
          aValue = a.durationMinutes || 0;
          bValue = b.durationMinutes || 0;
          break;
        case 'capacity':
          aValue = a.capacity || 0;
          bValue = b.capacity || 0;
          break;
        default:
          aValue = a.courseName?.toLowerCase() || '';
          bValue = b.courseName?.toLowerCase() || '';
      }

      if (sortOrder === 'desc') {
        return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }
    });
  },

  // Get unique course types
  async getCourseTypes(): Promise<string[]> {
    try {
      const courses = await this.getAllCourses();
      const types = courses.map(course => course.courseType).filter(Boolean);
      return [...new Set(types)];
    } catch (error) {
      console.error('Error fetching course types:', error);
      throw new Error('Failed to fetch course types');
    }
  },

  // Get unique instructors
  async getInstructors(): Promise<string[]> {
    try {
      const courses = await this.getAllCourses();
      const instructors = courses.map(course => course.instructor).filter(Boolean);
      return [...new Set(instructors)];
    } catch (error) {
      console.error('Error fetching instructors:', error);
      throw new Error('Failed to fetch instructors');
    }
  },

  // Real-time listeners
  onCoursesSnapshot(callback: (courses: Course[]) => void) {
    return coursesService.onCoursesSnapshot((courses, error) => {
      if (error) {
        console.error('Error in courses snapshot:', error);
        callback([]);
      } else {
        callback(courses.filter(course => course.valid === true));
      }
    }, {
      where: [{ field: 'valid', operator: '==', value: true }]
    });
  },

  onCourseSnapshot(courseId: string, callback: (course: Course | null) => void) {
    return coursesService.onCourseSnapshot(courseId, (course, error) => {
      if (error) {
        console.error('Error in course snapshot:', error);
        callback(null);
      } else {
        callback(course);
      }
    });
  },

  // Get class instances for a course
  async getClassInstancesForCourse(courseId: number): Promise<ClassInstance[]> {
    try {
      const result = await instancesService.getInstancesByCourseId(courseId);
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      return result.data.filter(instance => instance.valid === true);
    } catch (error) {
      console.error('Error fetching class instances:', error);
      throw new Error('Failed to fetch class instances');
    }
  },

  // Get class instance by ID
  async getClassInstanceById(classInstanceId: number): Promise<ClassInstance[]> {
    try {
      const result = await instancesService.getInstanceById(classInstanceId);
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      return result.data ? [result.data] : [];
    } catch (error) {
      console.error('Error fetching class instance:', error);
      throw new Error('Failed to fetch class instance');
    }
  },

  // Get all class instances
  async getAllClassInstanceById(courseId: number): Promise<ClassInstance[]> {
    try {
      const result = await instancesService.getInstancesByCourseId(courseId);
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      return result.data.filter(instance => instance.valid === true);
    } catch (error) {
      console.error('Error fetching class instances:', error);
      throw new Error('Failed to fetch class instances');
    }
  }
}; 