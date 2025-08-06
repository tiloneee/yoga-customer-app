import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Alert 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { courseService } from '../../api/courseService';
import { Course } from '../../types/course';

interface CourseDetailScreenProps {
  navigation?: any;
  route?: {
    params?: {
      courseId?: number;
      firebaseId?: string;
    };
  };
}

const CourseDetailScreen: React.FC<CourseDetailScreenProps> = ({ navigation, route }) => {
  const courseId = route?.params?.courseId;
  const firebaseId = route?.params?.firebaseId;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (courseId) {
      loadCourse();
    } else {
      setError('No course ID provided');
      setLoading(false);
    }
  }, [courseId]);

  const loadCourse = async () => {
    if (!courseId || !firebaseId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const courseData = await courseService.getCourseById(courseId);
      if (courseData) {
        setCourse(courseData[0]);
      } else {
        setError('Course not found');
      }
    } catch (err) {
      console.error('Error loading course:', err);
      setError('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
  };

  const handleBookClass = async () => {
    Alert.alert(
      'Booking Feature',
      'Booking functionality has been removed from this version of the app.',
      [{ text: 'OK' }]
    );
  };

  const handleBackPress = () => {
    navigation?.goBack();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a7c59" />
          <Text style={styles.loadingText}>Loading course details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !course) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle" size={64} color="#e74c3c" />
          <Text style={styles.errorTitle}>Oops!</Text>
          <Text style={styles.errorText}>{error || 'Course not found'}</Text>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#4a7c59" />
          </TouchableOpacity>
        </View>

        {/* Course Image */}
        <View style={styles.imageContainer}>
          {course.imageUrl ? (
            <Image source={{ uri: course.imageUrl }} style={styles.image} />
          ) : (
            <View style={styles.placeholderImage}>
              <MaterialCommunityIcons name="yoga" size={80} color="#4a7c59" />
            </View>
          )}
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{course.courseType}</Text>
          </View>
        </View>

        {/* Course Info */}
        <View style={styles.content}>
          <Text style={styles.title}>{course.courseName}</Text>
          
          <Text style={styles.description}>{course.description}</Text>

          {/* Course Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="clock-outline" size={20} color="#4a7c59" />
              <Text style={styles.statLabel}>Duration</Text>
              <Text style={styles.statValue}>{formatDuration(course.durationMinutes)}</Text>
            </View>
            
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="account-group" size={20} color="#4a7c59" />
              <Text style={styles.statLabel}>Capacity</Text>
              <Text style={styles.statValue}>{course.capacity} spots</Text>
            </View>
            
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="currency-usd" size={20} color="#4a7c59" />
              <Text style={styles.statLabel}>Price</Text>
              <Text style={styles.statValue}>{formatPrice(course.pricePerClass)}</Text>
            </View>
          </View>

          {/* Instructor Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructor</Text>
            <View style={styles.instructorCard}>
              <View style={styles.instructorAvatar}>
                <MaterialCommunityIcons name="account" size={32} color="#4a7c59" />
              </View>
              <View style={styles.instructorInfo}>
                <Text style={styles.instructorName}>{course.instructor}</Text>
                <Text style={styles.instructorRole}>Yoga Instructor</Text>
              </View>
            </View>
          </View>

          {/* Studio Room */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.locationCard}>
              <MaterialCommunityIcons name="map-marker" size={20} color="#4a7c59" />
              <Text style={styles.locationText}>{course.studioRoom}</Text>
            </View>
          </View>

          {/* Course Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Course Details</Text>
            <View style={styles.detailsCard}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Course Type</Text>
                <Text style={styles.detailValue}>{course.courseType}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Duration</Text>
                <Text style={styles.detailValue}>{formatDuration(course.durationMinutes)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Capacity</Text>
                <Text style={styles.detailValue}>{course.capacity} students</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Price per Class</Text>
                <Text style={styles.detailValue}>{formatPrice(course.pricePerClass)}</Text>
              </View>
            </View>
          </View>

          {/* Book Button */}
          <TouchableOpacity style={styles.bookButton} onPress={handleBookClass}>
            <MaterialCommunityIcons name="calendar-plus" size={20} color="white" />
            <Text style={styles.bookButtonText}>Book This Class</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  imageContainer: {
    position: 'relative',
    height: 250,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#4a7c59',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  typeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  instructorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  instructorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  instructorInfo: {
    flex: 1,
  },
  instructorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  instructorRole: {
    fontSize: 14,
    color: '#666',
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  locationText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  detailsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4a7c59',
    paddingVertical: 16,
    borderRadius: 25,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButtonText: {
    color: '#4a7c59',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CourseDetailScreen; 