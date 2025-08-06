import { firestoreService, FirestoreResponse, FirestoreListResponse, QueryConstraints } from './firestoreService';
import { Booking, CreateBookingData, UpdateBookingData, BookingWithDetails } from '../types/booking';
import { ClassInstance } from '../types/classInstance';
import { Course } from '../types/course';

// Utility functions for time-based logic
const getInstanceDateTime = (date: string, time: string): Date => {
  return new Date(`${date} ${time}`);
};

const isInstancePast = (date: string, time: string): boolean => {
  const instanceDateTime = getInstanceDateTime(date, time);
  const now = new Date();
  return instanceDateTime < now;
};

const isInstanceWithin2Hours = (date: string, time: string): boolean => {
  const instanceDateTime = getInstanceDateTime(date, time);
  const now = new Date();
  const twoHoursLater = new Date(instanceDateTime.getTime() + 2 * 60 * 60 * 1000);
  return now > twoHoursLater;
};

const isInstanceWithin30Minutes = (date: string, time: string): boolean => {
  const instanceDateTime = getInstanceDateTime(date, time);
  const now = new Date();
  const thirtyMinutesBefore = new Date(instanceDateTime.getTime() - 30 * 60 * 1000);
  return now > thirtyMinutesBefore;
};

const shouldMarkAsAttended = (date: string, time: string): boolean => {
  const instanceDateTime = getInstanceDateTime(date, time);
  const now = new Date();
  return instanceDateTime < now;
};

// Booking Collection Service
export const bookingService = {
  // Get booking by Firebase ID
  async getBookingByFirebaseId(firebaseId: string): Promise<FirestoreResponse<Booking>> {
    return firestoreService.getDocument<Booking>('bookings', firebaseId);
  },

  // Get booking by numeric ID
  async getBookingById(id: number): Promise<FirestoreResponse<Booking>> {
    const result = await firestoreService.getDocuments<Booking>('bookings', {
      where: [{ field: 'id', operator: '==', value: id }]
    });
    
    if (result.error) {
      return { data: null, error: result.error };
    }
    
    return { data: result.data[0] || null, error: null };
  },

  // Get bookings by user ID
  async getBookingsByUserId(userId: string): Promise<FirestoreListResponse<Booking>> {
    return firestoreService.getDocuments<Booking>('bookings', {
      where: [{ field: 'userId', operator: '==', value: userId }],
      orderBy: [{ field: 'createdAt', direction: 'desc' }]
    });
  },

  // Get bookings by instance ID
  async getBookingsByInstanceId(instancesId: number): Promise<FirestoreListResponse<Booking>> {
    return firestoreService.getDocuments<Booking>('bookings', {
      where: [{ field: 'instancesId', operator: '==', value: instancesId }]
    });
  },

  // Get all bookings
  async getAllBookings(constraints?: QueryConstraints): Promise<FirestoreListResponse<Booking>> {
    return firestoreService.getDocuments<Booking>('bookings', constraints);
  },

  // Create new booking
  async createBooking(data: CreateBookingData): Promise<FirestoreResponse<Booking>> {
    // First, check if the instance exists and has capacity
    const instanceResult = await firestoreService.getDocuments<ClassInstance>('instances', {
      where: [{ field: 'id', operator: '==', value: data.instancesId }]
    });

    if (instanceResult.error || !instanceResult.data[0]) {
      return { 
        data: null, 
        error: { 
          code: 'INSTANCE_NOT_FOUND', 
          message: 'Class instance not found' 
        } 
      };
    }

    const instance = instanceResult.data[0];
    
    // Get the course to check capacity
    const courseResult = await firestoreService.getDocuments<Course>('courses', {
      where: [{ field: 'id', operator: '==', value: instance.courseId }]
    });

    if (courseResult.error || !courseResult.data[0]) {
      return { 
        data: null, 
        error: { 
          code: 'COURSE_NOT_FOUND', 
          message: 'Course not found' 
        } 
      };
    }

    const course = courseResult.data[0];

    // Check if instance is at capacity
    if (instance.currentBookings >= course.capacity) {
      return { 
        data: null, 
        error: { 
          code: 'INSTANCE_FULL', 
          message: 'This class is at full capacity' 
        } 
      };
    }

    // Check if user already has an active booking for this instance (not cancelled)
    const existingBookingResult = await firestoreService.getDocuments<Booking>('bookings', {
      where: [
        { field: 'userId', operator: '==', value: data.userId },
        { field: 'instancesId', operator: '==', value: data.instancesId },
        { field: 'status', operator: 'in', value: ['confirmed', 'pending'] }
      ]
    });

    if (existingBookingResult.data.length > 0) {
      return { 
        data: null, 
        error: { 
          code: 'DUPLICATE_BOOKING', 
          message: 'You already have an active booking for this class' 
        } 
      };
    }

    // Create the booking and update instance currentBookings in a batch
    const bookingData = {
      ...data,
      status: data.status || 'pending'
    };

    const batchOperations = [
      {
        type: 'add' as const,
        collection: 'bookings',
        data: bookingData
      },
      {
        type: 'update' as const,
        collection: 'instances',
        docId: instance.firebaseId,
        data: { currentBookings: instance.currentBookings + 1 }
      }
    ];

    const batchResult = await firestoreService.batchWrite(batchOperations);
    
    if (batchResult.error) {
      return { data: null, error: batchResult.error };
    }

    // Fetch the created booking to return complete data
    const result = await firestoreService.getDocuments<Booking>('bookings', {
      where: [
        { field: 'userId', operator: '==', value: data.userId },
        { field: 'instancesId', operator: '==', value: data.instancesId }
      ]
    });

    if (result.error || !result.data[0]) {
      return { 
        data: null, 
        error: { 
          code: 'BOOKING_CREATION_ERROR', 
          message: 'Failed to create booking' 
        } 
      };
    }

    return { data: result.data[0], error: null };
  },

  // Update booking
  async updateBooking(firebaseId: string, data: UpdateBookingData): Promise<FirestoreResponse<void>> {
    return firestoreService.updateDocument('bookings', firebaseId, data);
  },

  // Cancel booking
  async cancelBooking(firebaseId: string): Promise<FirestoreResponse<void>> {
    // Get the booking first
    const bookingResult = await this.getBookingByFirebaseId(firebaseId);
    if (bookingResult.error || !bookingResult.data) {
      return { data: null, error: bookingResult.error };
    }

    const booking = bookingResult.data;

    // Get the instance to update currentBookings
    const instanceResult = await firestoreService.getDocuments<ClassInstance>('instances', {
      where: [{ field: 'id', operator: '==', value: booking.instancesId }]
    });

    if (instanceResult.error || !instanceResult.data[0]) {
      return { 
        data: null, 
        error: { 
          code: 'INSTANCE_NOT_FOUND', 
          message: 'Class instance not found' 
        } 
      };
    }

    const instance = instanceResult.data[0];

    // Check if within 30 minutes of class start time
    if (isInstanceWithin30Minutes(instance.date, instance.time)) {
      return { 
        data: null, 
        error: { 
          code: 'CANCELLATION_TOO_LATE', 
          message: 'Cannot cancel booking within 30 minutes of class start time' 
        } 
      };
    }

    // Update booking status and decrease instance currentBookings in a batch
    const batchOperations = [
      {
        type: 'update' as const,
        collection: 'bookings',
        docId: firebaseId,
        data: { status: 'cancelled' }
      },
      {
        type: 'update' as const,
        collection: 'instances',
        docId: instance.firebaseId,
        data: { currentBookings: Math.max(0, instance.currentBookings - 1) }
      }
    ];

    return firestoreService.batchWrite(batchOperations);
  },

  // Mark bookings as attended for past instances
  async markPastBookingsAsAttended(): Promise<FirestoreResponse<void>> {
    const allBookingsResult = await this.getAllBookings();
    if (allBookingsResult.error) {
      return { data: null, error: allBookingsResult.error };
    }

    const batchOperations = [];

    for (const booking of allBookingsResult.data) {
      // Get instance details
      const instanceResult = await firestoreService.getDocuments<ClassInstance>('instances', {
        where: [{ field: 'id', operator: '==', value: booking.instancesId }]
      });

      if (instanceResult.data[0] && shouldMarkAsAttended(instanceResult.data[0].date, instanceResult.data[0].time)) {
        if (booking.status === 'confirmed') {
          batchOperations.push({
            type: 'update' as const,
            collection: 'bookings',
            docId: booking.firebaseId,
            data: { status: 'attended' }
          });
        }
      }
    }

    if (batchOperations.length > 0) {
      return firestoreService.batchWrite(batchOperations);
    }

    return { data: null, error: null };
  },

  // Delete booking
  async deleteBooking(firebaseId: string): Promise<FirestoreResponse<void>> {
    return firestoreService.deleteDocument('bookings', firebaseId);
  },

  // Get booking with details (instance and course info)
  async getBookingWithDetails(firebaseId: string): Promise<FirestoreResponse<BookingWithDetails>> {
    const bookingResult = await this.getBookingByFirebaseId(firebaseId);
    if (bookingResult.error || !bookingResult.data) {
      return { data: null, error: bookingResult.error };
    }

    const booking = bookingResult.data;

    // Get instance details
    const instanceResult = await firestoreService.getDocuments<ClassInstance>('instances', {
      where: [{ field: 'id', operator: '==', value: booking.instancesId }]
    });

    if (instanceResult.error || !instanceResult.data[0]) {
      return { data: null, error: instanceResult.error };
    }

    const instance = instanceResult.data[0];

    // Get course details
    const courseResult = await firestoreService.getDocuments<Course>('courses', {
      where: [{ field: 'id', operator: '==', value: instance.courseId }]
    });

    if (courseResult.error || !courseResult.data[0]) {
      return { data: null, error: courseResult.error };
    }

    const course = courseResult.data[0];

    const bookingWithDetails: BookingWithDetails = {
      ...booking,
      instance: {
        id: instance.id,
        courseId: instance.courseId,
        instructor: instance.instructor,
        date: instance.date,
        time: instance.time,
        currentBookings: instance.currentBookings,
        status: instance.status
      },
      course: {
        id: course.id,
        courseName: course.courseName,
        courseType: course.courseType,
        durationMinutes: course.durationMinutes,
        capacity: course.capacity,
        pricePerClass: course.pricePerClass,
        instructor: course.instructor,
        studioRoom: course.studioRoom
      }
    };

    return { data: bookingWithDetails, error: null };
  },

  // Get user bookings with details (optimized)
  async getUserBookingsWithDetails(userId: string): Promise<FirestoreListResponse<BookingWithDetails>> {
    const bookingsResult = await this.getBookingsByUserId(userId);
    if (bookingsResult.error) {
      return { data: [], error: bookingsResult.error, totalCount: 0 };
    }

    if (bookingsResult.data.length === 0) {
      return { data: [], error: null, totalCount: 0 };
    }

    // Get all unique instance IDs and course IDs
    const instanceIds = [...new Set(bookingsResult.data.map(booking => booking.instancesId))];
    
    // Get all instances in one query
    const instancesResult = await firestoreService.getDocuments<ClassInstance>('instances', {
      where: [{ field: 'id', operator: 'in', value: instanceIds }]
    });

    if (instancesResult.error) {
      return { data: [], error: instancesResult.error, totalCount: 0 };
    }

    // Get all unique course IDs from instances
    const courseIds = [...new Set(instancesResult.data.map(instance => instance.courseId))];
    
    // Get all courses in one query
    const coursesResult = await firestoreService.getDocuments<Course>('courses', {
      where: [{ field: 'id', operator: 'in', value: courseIds }]
    });

    if (coursesResult.error) {
      return { data: [], error: coursesResult.error, totalCount: 0 };
    }

    // Create lookup maps for fast access
    const instancesMap = new Map(instancesResult.data.map(instance => [instance.id, instance]));
    const coursesMap = new Map(coursesResult.data.map(course => [course.id, course]));

    // Build bookings with details
    const bookingsWithDetails: BookingWithDetails[] = [];

    for (const booking of bookingsResult.data) {
      const instance = instancesMap.get(booking.instancesId);
      const course = instance ? coursesMap.get(instance.courseId) : null;

      if (instance && course) {
        const bookingWithDetails: BookingWithDetails = {
          ...booking,
          instance: {
            id: instance.id,
            courseId: instance.courseId,
            instructor: instance.instructor,
            date: instance.date,
            time: instance.time,
            currentBookings: instance.currentBookings,
            status: instance.status
          },
          course: {
            id: course.id,
            courseName: course.courseName,
            courseType: course.courseType,
            durationMinutes: course.durationMinutes,
            capacity: course.capacity,
            pricePerClass: course.pricePerClass,
            instructor: course.instructor,
            studioRoom: course.studioRoom
          }
        };
        bookingsWithDetails.push(bookingWithDetails);
      }
    }

    return { 
      data: bookingsWithDetails, 
      error: null, 
      totalCount: bookingsWithDetails.length 
    };
  },

  // Real-time listeners
  onBookingSnapshot(firebaseId: string, callback: (booking: Booking | null, error: any) => void) {
    return firestoreService.onDocumentSnapshot<Booking>('bookings', firebaseId, callback);
  },

  onUserBookingsSnapshot(userId: string, callback: (bookings: Booking[], error: any) => void) {
    return firestoreService.onCollectionSnapshot<Booking>('bookings', callback, {
      where: [{ field: 'userId', operator: '==', value: userId }],
      orderBy: [{ field: 'createdAt', direction: 'desc' }]
    });
  }
}; 