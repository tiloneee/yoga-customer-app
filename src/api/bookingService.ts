import { firestoreService, FirestoreResponse, FirestoreListResponse, QueryConstraints } from './firestoreService';
import { Booking, CreateBookingData, UpdateBookingData, BookingWithDetails } from '../types/booking';
import { ClassInstance, UpdateClassInstanceData } from '../types/classInstance';
import { Course } from '../types/course';

type BookingBatchOperation =
  | { type: 'add'; collection: 'bookings'; data: CreateBookingData & { createdAt: string } }
  | { type: 'update'; collection: 'instances'; docId: string; data: UpdateClassInstanceData }
  | { type: 'update'; collection: 'bookings'; docId: string; data: { status: string } };

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
    // Validate userId
    if (!userId) {
      return { 
        data: [], 
        error: { 
          code: 'USER_ID_MISSING', 
          message: 'User ID is required to load bookings' 
        }, 
        totalCount: 0 
      };
    }

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
    // Validate required fields
    if (!data.userId) {
      return { 
        data: null, 
        error: { 
          code: 'USER_ID_MISSING', 
          message: 'User ID is required to create a booking' 
        } 
      };
    }

    if (!data.instancesId) {
      return { 
        data: null, 
        error: { 
          code: 'INSTANCE_ID_MISSING', 
          message: 'Instance ID is required to create a booking' 
        } 
      };
    }

    // First, check if the instance exists
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
    const bookingStatus = data.status || 'pending';
    const bookingData = {
      instancesId: data.instancesId,
      userId: data.userId,
      status: bookingStatus,
      createdAt: new Date().toISOString()
    };

    const batchOperations: BookingBatchOperation[] = [
      {
        type: 'add',
        collection: 'bookings',
        data: bookingData
      }
    ];

    // Only increment if status is 'pending' or 'confirmed'
    if (bookingStatus === 'pending' || bookingStatus === 'confirmed') {
      batchOperations.push({
        type: 'update',
        collection: 'instances',
        docId: instance.firebaseId,
        data: { currentBookings: instance.currentBookings + 1 }
      });
    }

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
    // Get the current booking to understand the status change
    const bookingResult = await this.getBookingByFirebaseId(firebaseId);
    if (bookingResult.error || !bookingResult.data) {
      return { data: null, error: bookingResult.error };
    }

    const currentBooking = bookingResult.data;
    const newStatus = data.status;

    // If no status change, just update the booking
    if (!newStatus || newStatus === currentBooking.status) {
      return firestoreService.updateDocument('bookings', firebaseId, data);
    }

    // Get the instance to update currentBookings
    const instanceResult = await firestoreService.getDocuments<ClassInstance>('instances', {
      where: [{ field: 'id', operator: '==', value: currentBooking.instancesId }]
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
    const batchOperations: BookingBatchOperation[] = [];

    // Define which statuses count towards currentBookings
    const countingStatuses = ['pending', 'confirmed'];
    const oldStatusCounts = countingStatuses.includes(currentBooking.status);
    const newStatusCounts = countingStatuses.includes(newStatus);

    // Update the booking status
    batchOperations.push({
      type: 'update',
      collection: 'bookings',
      docId: firebaseId,
      data: { status: newStatus }
    });

    // Handle currentBookings count changes
    if (oldStatusCounts && !newStatusCounts) {
      // Status changed from counting to non-counting (e.g., confirmed -> cancelled)
      // Decrease currentBookings
      batchOperations.push({
        type: 'update',
        collection: 'instances',
        docId: instance.firebaseId,
        data: { currentBookings: Math.max(0, instance.currentBookings - 1) }
      });
    } else if (!oldStatusCounts && newStatusCounts) {
      // Status changed from non-counting to counting (e.g., cancelled -> confirmed)
      // Increase currentBookings
      batchOperations.push({
        type: 'update',
        collection: 'instances',
        docId: instance.firebaseId,
        data: { currentBookings: instance.currentBookings + 1 }
      });
    }
    // If both old and new status count (e.g., pending -> confirmed), no change needed

    if (batchOperations.length === 1) {
      // Only booking update, no instance update needed
      return firestoreService.updateDocument('bookings', firebaseId, data);
    } else {
      // Batch update needed
      return firestoreService.batchWrite(batchOperations);
    }
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
    const batchOperations: BookingBatchOperation[] = [
      {
        type: 'update',
        collection: 'bookings',
        docId: firebaseId,
        data: { status: 'cancelled' }
      }
    ];

    // Only decrement if booking was 'pending' or 'confirmed'
    if (booking.status === 'pending' || booking.status === 'confirmed') {
      batchOperations.push({
        type: 'update',
        collection: 'instances',
        docId: instance.firebaseId,
        data: { currentBookings: Math.max(0, instance.currentBookings - 1) }
      });
    }

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
    // Validate userId
    if (!userId) {
      return { 
        data: [], 
        error: { 
          code: 'USER_ID_MISSING', 
          message: 'User ID is required to load bookings' 
        }, 
        totalCount: 0 
      };
    }

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

  // Recalculate currentBookings for all instances
  async recalculateAllInstanceBookings(): Promise<FirestoreResponse<void>> {
    // Get all instances
    const instancesResult = await firestoreService.getDocuments<ClassInstance>('instances', {});
    
    if (instancesResult.error) {
      return { data: null, error: instancesResult.error };
    }

    const batchOperations: BookingBatchOperation[] = [];

    for (const instance of instancesResult.data) {
      // Get all active bookings for this instance
      const bookingsResult = await firestoreService.getDocuments<Booking>('bookings', {
        where: [
          { field: 'instancesId', operator: '==', value: instance.id },
          { field: 'status', operator: 'in', value: ['pending', 'confirmed'] }
        ]
      });

      if (!bookingsResult.error) {
        const actualBookingsCount = bookingsResult.data.length;
        
        // Only update if the count is different
        if (actualBookingsCount !== instance.currentBookings) {
          batchOperations.push({
            type: 'update',
            collection: 'instances',
            docId: instance.firebaseId,
            data: { currentBookings: actualBookingsCount }
          });
        }
      }
    }

    if (batchOperations.length === 0) {
      return { data: null, error: null };
    }

    return firestoreService.batchWrite(batchOperations);
  },

  // Recalculate currentBookings for an instance
  async recalculateInstanceBookings(instanceId: number): Promise<FirestoreResponse<void>> {
    // Get all active bookings for this instance
    const bookingsResult = await firestoreService.getDocuments<Booking>('bookings', {
      where: [
        { field: 'instancesId', operator: '==', value: instanceId },
        { field: 'status', operator: 'in', value: ['pending', 'confirmed'] }
      ]
    });

    if (bookingsResult.error) {
      return { data: null, error: bookingsResult.error };
    }

    // Get the instance
    const instanceResult = await firestoreService.getDocuments<ClassInstance>('instances', {
      where: [{ field: 'id', operator: '==', value: instanceId }]
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
    const actualBookingsCount = bookingsResult.data.length;

    // Update the instance with the correct count
    return firestoreService.updateDocument('instances', instance.firebaseId, {
      currentBookings: actualBookingsCount
    });
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