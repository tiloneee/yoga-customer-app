# Yoga Customer App - Complete Functions and Features Documentation

## 🔐 **Authentication System**

### **AuthService Functions:**
- `register(email, password, displayName)` - User registration
- `signIn(email, password)` - User login
- `signOut()` - User logout
- `resetPassword(email)` - Password reset
- `updateProfile(user, data)` - Update user profile
- `getCurrentUser()` - Get current authenticated user
- `onAuthStateChanged(callback)` - Listen to auth state changes

### **AuthContext Features:**
- User session management
- Login/Register functionality
- Profile updates
- Error handling
- Loading states
- Automatic user data synchronization with Firestore

## 📚 **Course Management System**

### **CourseService Functions:**
- `getAllCourses()` - Fetch all available courses
- `getCourseById(courseId)` - Get specific course by ID
- `getCourseByFirebaseId(firebaseId)` - Get course by Firebase ID
- `searchCourses(params)` - Search courses with filters
- `applyFilters(courses, filters)` - Apply search filters
- `sortCourses(courses, sortBy, sortOrder)` - Sort courses
- `getCourseTypes()` - Get unique course types
- `getInstructors()` - Get unique instructors
- `getClassInstancesForCourse(courseId)` - Get class instances for a course
- `getClassInstanceById(classInstanceId)` - Get specific class instance
- `getAllClassInstanceById(courseId)` - Get all instances for a course

### **Course Features:**
- Course browsing and search
- Filter by course type, instructor, price range, duration
- Sort by name, price, duration, capacity
- Real-time course updates
- Course details with instructor info, pricing, capacity

## 🗓️ **Booking System**

### **BookingService Functions:**
- `getBookingByFirebaseId(firebaseId)` - Get booking by Firebase ID
- `getBookingById(id)` - Get booking by numeric ID
- `getBookingsByUserId(userId)` - Get user's bookings
- `getBookingsByInstanceId(instancesId)` - Get bookings for specific instance
- `getAllBookings(constraints)` - Get all bookings with filters
- `createBooking(data)` - Create new booking
- `updateBooking(firebaseId, data)` - Update booking status
- `cancelBooking(firebaseId)` - Cancel booking
- `deleteBooking(firebaseId)` - Delete booking
- `getBookingWithDetails(firebaseId)` - Get booking with course/instance details
- `getUserBookingsWithDetails(userId)` - Get user bookings with full details
- `markPastBookingsAsAttended()` - Auto-mark past bookings as attended
- `recalculateAllInstanceBookings()` - Recalculate booking counts
- `recalculateInstanceBookings(instanceId)` - Recalculate for specific instance

### **Booking Features:**
- Class booking with capacity checking
- Booking cancellation (with 30-minute restriction)
- Booking status management (pending, confirmed, cancelled, attended)
- Real-time booking updates
- Automatic attendance marking for past classes
- Booking history with detailed information

## 🔥 **Firebase/Firestore Integration**

### **FirestoreService Functions:**
- `getDocument(collectionName, docId)` - Get single document
- `getDocuments(collectionName, constraints)` - Get multiple documents
- `addDocument(collectionName, data)` - Add new document
- `addDocumentWithId(collectionName, docId, data)` - Add document with custom ID
- `updateDocument(collectionName, docId, data)` - Update document
- `deleteDocument(collectionName, docId)` - Delete document
- `batchWrite(operations)` - Batch write operations
- `onDocumentSnapshot()` - Real-time document listener
- `onCollectionSnapshot()` - Real-time collection listener

### **Specialized Collections:**
- **Courses Collection:** Course management with CRUD operations
- **Instances Collection:** Class instance management
- **Bookings Collection:** Booking management with status tracking
- **Users Collection:** User profile management

## 📱 **User Interface Screens**

### **Authentication Screens:**
- **LoginScreen:** Email/password login with validation
- **RegisterScreen:** User registration with form validation
- **ForgotPasswordScreen:** Password reset functionality

### **Main App Screens:**
- **HomeScreen:** Welcome screen with quick actions
- **CourseListScreen:** Browse and search courses with filters
- **CourseDetailScreen:** Detailed course information
- **BookingScreen:** Book specific class instances
- **MyBookingsScreen:** View and manage user bookings
- **ProfileScreen:** User profile management
- **AboutScreen:** App information

## 🎨 **UI Components**

### **Common Components:**
- **Button:** Reusable button component with variants
- **Card:** Content container component
- **SearchBar:** Search functionality component

### **Presentation Components:**
- **CourseCard:** Course display card
- **SearchBar:** Advanced search with filters

## 🧭 **Navigation System**

### **Navigation Structure:**
- **AuthStack:** Authentication flow (Login, Register, ForgotPassword)
- **MainTabNavigator:** Bottom tab navigation
- **MainStackNavigator:** Stack navigation for detailed screens

### **Navigation Features:**
- Tab-based navigation (Home, Courses, MyBookings, Profile, About)
- Stack navigation for detailed views
- Automatic authentication-based routing
- Screen transitions and animations

## 🔧 **Utility Functions**

### **Time-based Logic:**
- `getInstanceDateTime(date, time)` - Convert date/time to Date object
- `isInstancePast(date, time)` - Check if instance is in the past
- `isInstanceWithin2Hours(date, time)` - Check if within 2 hours
- `isInstanceWithin30Minutes(date, time)` - Check if within 30 minutes
- `shouldMarkAsAttended(date, time)` - Determine if should mark as attended

### **Validation Functions:**
- Email validation
- Password validation
- Phone number validation
- Form field validation

## 📊 **Data Management**

### **TypeScript Types:**
- User, Course, ClassInstance, Booking interfaces
- API response types
- State management types
- Firebase integration types

### **State Management:**
- React Context for authentication
- Local state management
- Real-time data synchronization

## 🔒 **Security & Validation**

### **Security Features:**
- Firebase Authentication integration
- Email/password authentication
- Password reset functionality
- User session management
- Input validation and sanitization

### **Business Logic:**
- Capacity checking for class bookings
- Booking cancellation time restrictions
- Automatic status updates
- Duplicate booking prevention

## 📱 **Mobile App Features**

### **React Native Features:**
- Cross-platform mobile development
- Native UI components
- Responsive design
- Touch interactions
- Status bar management
- Safe area handling

### **Expo Features:**
- Linear gradient backgrounds
- Vector icons (MaterialCommunityIcons)
- Status bar management
- Safe area context

## 🔄 **Real-time Features**

### **Live Updates:**
- Real-time course updates
- Live booking status changes
- Instant user profile updates
- Real-time authentication state

### **Data Synchronization:**
- Automatic Firestore synchronization
- Offline data handling
- Conflict resolution
- Batch operations for data integrity

## 📋 **Technical Specifications**

### **Dependencies:**
- React Native 0.79.5
- Expo SDK 53
- Firebase 12.0.0
- React Navigation 7.x
- React Native Paper 5.14.5
- TypeScript 5.8.3

### **Architecture:**
- Component-based architecture
- Service layer pattern
- Context API for state management
- TypeScript for type safety
- Firebase as backend service

### **File Structure:**
```
src/
├── api/           # API services
├── components/    # Reusable components
├── context/       # React Context providers
├── navigation/    # Navigation configuration
├── screens/       # Screen components
├── styles/        # Styling and themes
├── types/         # TypeScript type definitions
└── utility/       # Utility functions
```

## 🎯 **Key Features Summary**

1. **User Authentication:** Complete login/register system with Firebase Auth
2. **Course Management:** Browse, search, and filter yoga courses
3. **Booking System:** Book classes with capacity management and cancellation
4. **Profile Management:** Update user information and preferences
5. **Real-time Updates:** Live synchronization with Firestore database
6. **Mobile-First Design:** Optimized for mobile devices with responsive UI
7. **Type Safety:** Full TypeScript implementation for better code quality
8. **Error Handling:** Comprehensive error handling and user feedback
9. **Data Validation:** Input validation and business logic enforcement
10. **Offline Support:** Graceful handling of network connectivity issues

---

*This documentation covers all functions and features implemented in the Yoga Customer App, providing a comprehensive overview for development reports and technical documentation.* 