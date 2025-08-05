# Database Structure Alignment

This document outlines the updated Firestore database structure and how it aligns with the TypeScript type definitions in the app.

## Current Firestore Collections

### 1. `users` Collection
**Database Fields:**
- `createdAt` (timestamp)
- `email` (string)
- `fullName` (string)
- `id` (string)
- `isActive` (boolean)
- `phoneNumber` (string, optional)
- `profileImageUrl` (string, optional)
- `role` (string)
- `updatedAt` (timestamp)

**TypeScript Interface:**
```typescript
interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### 2. `courses` Collection
**Database Fields:**
- `capacity` (number)
- `courseName` (string)
- `courseType` (string)
- `createdAt` (timestamp)
- `description` (string)
- `durationMinutes` (number)
- `firebaseId` (string)
- `id` (string)
- `imageUrl` (string, optional)
- `instructor` (string)
- `pricePerClass` (number)
- `studioRoom` (string)
- `updatedAt` (timestamp)
- `valid` (boolean)

**TypeScript Interface:**
```typescript
interface Course {
  id: string;
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
```

### 3. `instances` Collection
**Database Fields:**
- `active` (boolean)
- `courseId` (string)
- `createdAt` (timestamp)
- `currentBookings` (number)
- `date` (string, YYYY-MM-DD format)
- `dateTime` (string, combined date and time)
- `firebaseId` (string)
- `id` (string)
- `instructor` (string)
- `notes` (string, optional)
- `status` (string)
- `time` (string, HH:MM format)
- `updatedAt` (timestamp)
- `valid` (boolean)

**TypeScript Interface:**
```typescript
interface ClassInstance {
  id: string;
  firebaseId: string;
  courseId: string;
  course?: Course; // Optional, populated when needed
  instructor: string;
  date: string; // YYYY-MM-DD format
  time: string; // HH:MM format
  dateTime: string; // Combined date and time
  currentBookings: number;
  status: ClassStatus;
  active: boolean;
  notes?: string;
  valid: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### 4. `bookings` Collection (NEW)
**Database Fields:**
- `id` (string)
- `userId` (string)
- `classInstanceId` (string)
- `courseId` (string)
- `instructor` (string)
- `bookingStatus` (string)
- `bookingType` (string)
- `paymentStatus` (string)
- `amount` (number)
- `bookingDate` (timestamp)
- `classDate` (string, YYYY-MM-DD format)
- `classTime` (string, HH:MM format)
- `cancellationDate` (timestamp, optional)
- `cancellationReason` (string, optional)
- `refundAmount` (number, optional)
- `notes` (string, optional)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

**TypeScript Interface:**
```typescript
interface Booking {
  id: string;
  userId: string;
  user?: User; // Optional, populated when needed
  classInstanceId: string;
  classInstance?: ClassInstance; // Optional, populated when needed
  courseId: string;
  course?: Course; // Optional, populated when needed
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
```

## Type Enums

### BookingStatus
```typescript
type BookingStatus = 
  | 'confirmed' 
  | 'waitlisted' 
  | 'cancelled' 
  | 'completed' 
  | 'no-show' 
  | 'refunded';
```

### BookingType
```typescript
type BookingType = 
  | 'regular' 
  | 'waitlist' 
  | 'recurring' 
  | 'package' 
  | 'promotional';
```

### PaymentStatus
```typescript
type PaymentStatus = 
  | 'pending' 
  | 'paid' 
  | 'refunded' 
  | 'failed' 
  | 'cancelled';
```

### ClassStatus
```typescript
type ClassStatus = 
  | 'scheduled' 
  | 'in-progress' 
  | 'completed' 
  | 'cancelled' 
  | 'full' 
  | 'waitlist';
```

## Key Changes Made

1. **Simplified Data Models**: Removed complex nested objects and arrays to match the flat database structure
2. **Added Firebase ID Fields**: All interfaces now include `firebaseId` field for consistency
3. **Updated Field Names**: Changed field names to match database conventions (e.g., `courseName` instead of `name`)
4. **Removed Unused Types**: Eliminated types that don't exist in the database (locations, recurring patterns, etc.)
5. **Added New Booking Collection**: Created comprehensive booking types for the new collection

## Database Relationships

- **Users** → **Bookings** (one-to-many)
- **Courses** → **Instances** (one-to-many)
- **Courses** → **Bookings** (one-to-many)
- **Instances** → **Bookings** (one-to-many)

## Next Steps

1. **Update Firebase Service Layer**: Modify the Firebase service functions to work with the new type definitions
2. **Update Components**: Ensure all React components use the updated interfaces
3. **Add Data Validation**: Implement validation for the new booking collection
4. **Test Data Flow**: Verify that data flows correctly between the app and database

## Migration Notes

- The app now uses simplified data structures that match the actual database
- Optional fields (marked with `?`) can be populated when needed for UI display
- All timestamps are stored as strings in ISO 8601 format
- The booking collection provides a complete booking management system 