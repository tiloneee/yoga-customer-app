# Booking System Implementation

## Overview

The booking system allows users to book yoga classes by selecting courses and their available instances. The system includes capacity management, booking status tracking, and a comprehensive booking management interface.

## Features

### Core Functionality
- **Course Selection**: Users can browse courses and select one to book
- **Instance Selection**: After selecting a course, users see available class instances
- **Capacity Management**: System prevents booking when instances are at full capacity
- **Booking Management**: Users can view and cancel their bookings
- **Real-time Updates**: Booking status and capacity updates in real-time

### Data Structure

#### Booking Collection
```typescript
interface Booking {
  id: number;           // Auto-incrementing numeric ID
  firebaseId: string;   // Firebase document ID
  instancesId: number;  // References instances collection ID
  createdAt: string;    // Booking creation timestamp
  userId: string;       // References users collection ID
  status: BookingStatus; // Booking status
}
```

#### Booking Status Types
- `confirmed` - Booking is confirmed
- `pending` - Booking is pending approval
- `cancelled` - Booking has been cancelled
- `completed` - Class has been completed
- `no-show` - User didn't attend

### Capacity Management

Each course has a `capacity` field that determines the maximum number of students per class. The system:

1. **Checks Capacity**: Before allowing a booking, verifies the instance isn't at full capacity
2. **Updates Count**: Automatically increments `currentBookings` when a booking is created
3. **Decrements Count**: Reduces `currentBookings` when a booking is cancelled
4. **Prevents Duplicates**: Ensures users can't book the same class twice

### User Flow

1. **Browse Courses**: User navigates to Courses tab
2. **Select Course**: User taps "Book Now" on a course card or course detail
3. **View Instances**: System shows available class instances for the selected course
4. **Book Instance**: User selects an instance and confirms booking
5. **View Bookings**: User can see all their bookings in "My Bookings" tab
6. **Cancel Booking**: User can cancel confirmed or pending bookings

## Screens

### BookingScreen
- Displays available instances for a selected course
- Shows capacity information and available spots
- Handles booking confirmation and error states
- Real-time capacity updates

### MyBookingsScreen
- Lists all user bookings with detailed information
- Shows booking status with color-coded badges
- Allows booking cancellation
- Displays course and instance details

## API Services

### bookingService
Located in `src/api/bookingService.ts`

#### Key Methods:
- `createBooking()` - Creates a new booking with capacity validation
- `cancelBooking()` - Cancels a booking and updates capacity
- `getUserBookingsWithDetails()` - Gets user bookings with course/instance details
- `getBookingWithDetails()` - Gets single booking with full details

#### Business Logic:
- **Capacity Validation**: Checks if instance is at capacity before booking
- **Duplicate Prevention**: Prevents multiple bookings for same instance
- **Batch Operations**: Uses Firestore batch writes for data consistency
- **Error Handling**: Comprehensive error handling with user-friendly messages

## Navigation Integration

### Tab Navigation
- Added "My Bookings" tab with calendar icon
- Integrated with existing tab navigation structure

### Stack Navigation
- Added `Booking` screen to main stack navigator
- Supports course parameter passing

## Database Schema

### Collections

#### bookings
```
{
  id: number,           // Auto-incrementing ID
  firebaseId: string,   // Firebase document ID
  instancesId: number,  // Reference to instances collection
  createdAt: string,    // ISO timestamp
  userId: string,       // Reference to users collection
  status: string        // Booking status
}
```

#### instances (existing)
```
{
  id: number,
  courseId: number,
  currentBookings: number,  // Updated by booking system
  // ... other fields
}
```

#### courses (existing)
```
{
  id: number,
  capacity: number,     // Used by booking system
  // ... other fields
}
```

## Error Handling

### Common Error Scenarios
1. **Instance Not Found**: When trying to book a non-existent instance
2. **Course Not Found**: When course data is missing
3. **Instance Full**: When trying to book a full class
4. **Duplicate Booking**: When user already has a booking for the instance
5. **Network Errors**: Connection issues during booking operations

### User Feedback
- Clear error messages with actionable information
- Loading states during booking operations
- Success confirmations with next steps
- Real-time validation feedback

## Security Considerations

### Data Validation
- Server-side capacity validation
- User authentication required for bookings
- Duplicate booking prevention
- Input sanitization

### Access Control
- Users can only view their own bookings
- Booking operations require authentication
- Instance data validation before booking

## Future Enhancements

### Potential Features
1. **Waitlist System**: Allow users to join waitlist for full classes
2. **Recurring Bookings**: Book multiple instances at once
3. **Payment Integration**: Add payment processing for bookings
4. **Notifications**: Push notifications for booking confirmations
5. **Booking History**: Detailed booking history and analytics
6. **Class Reminders**: Reminder notifications before class
7. **Instructor Notes**: Allow instructors to add notes to bookings

### Technical Improvements
1. **Offline Support**: Cache bookings for offline viewing
2. **Performance**: Optimize queries for large booking datasets
3. **Analytics**: Track booking patterns and user behavior
4. **Testing**: Comprehensive unit and integration tests

## Testing

### Manual Testing Checklist
- [ ] Browse courses and view course details
- [ ] Book a class successfully
- [ ] Attempt to book a full class (should be prevented)
- [ ] View bookings in My Bookings tab
- [ ] Cancel a booking successfully
- [ ] Verify capacity updates after booking/cancellation
- [ ] Test error scenarios (network issues, invalid data)
- [ ] Test real-time updates

### Automated Testing
- Unit tests for booking service methods
- Integration tests for booking flow
- UI tests for booking screens
- Error handling tests

## Deployment Notes

### Database Setup
1. Ensure `bookings` collection exists in Firestore
2. Set up appropriate security rules for bookings collection
3. Configure indexes for efficient queries
4. Set up backup and monitoring

### App Configuration
1. Update navigation types for new screens
2. Test booking flow in development environment
3. Verify Firebase configuration
4. Test with real user data

## Support

For issues or questions about the booking system:
1. Check the error logs in Firebase Console
2. Verify database connectivity
3. Test booking flow step by step
4. Review capacity management logic
5. Check user authentication status 