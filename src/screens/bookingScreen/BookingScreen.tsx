import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { instancesService } from '../../api/firestoreService';
import { bookingService } from '../../api/bookingService';
import { useAuth } from '../../context/AuthContext';
import { ClassInstance } from '../../types/classInstance';
import { Course } from '../../types/course';

interface RouteParams {
  course: Course;
}

const BookingScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { appUser } = useAuth();
  const { course } = route.params as RouteParams;

  const [instances, setInstances] = useState<ClassInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);

  useEffect(() => {
    loadInstances();
  }, [course.id]);

  const loadInstances = async () => {
    try {
      setLoading(true);
      const result = await instancesService.getInstancesByCourseId(course.id);
      
      if (result.error) {
        Alert.alert('Error', 'Failed to load class instances');
        return;
      }

      // Filter active instances and sort by date and time
      const activeInstances = result.data
        .filter(instance => instance.active && instance.valid)
        .sort((a, b) => {
          const dateA = new Date(`${a.date} ${a.time}`);
          const dateB = new Date(`${b.date} ${b.time}`);
          return dateA.getTime() - dateB.getTime();
        });

      setInstances(activeInstances);
    } catch (error) {
      Alert.alert('Error', 'Failed to load class instances');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInstances();
    setRefreshing(false);
  };

    const handleBackPress = () => {
    navigation?.goBack();
  };

  const handleBooking = async (instance: ClassInstance) => {
    if (!appUser) {
      Alert.alert('Error', 'Please log in to book a class');
      return;
    }

    // Check if instance is at capacity
    if (instance.currentBookings >= course.capacity) {
      Alert.alert('Class Full', 'This class is at full capacity');
      return;
    }

    Alert.alert(
      'Confirm Booking',
      `Are you sure you want to book ${course.courseName} on ${instance.date} at ${instance.time}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Book',
          onPress: async () => {
            try {
              setBookingLoading(instance.firebaseId);
                             const result = await bookingService.createBooking({
                 instancesId: instance.id,
                 userId: appUser.id,
                 status: 'pending'
               });

              if (result.error) {
                Alert.alert('Booking Error', result.error.message);
                return;
              }

                             Alert.alert(
                 'Booking Confirmed!',
                 `You have successfully booked ${course.courseName} on ${instance.date} at ${instance.time}`,
                 [
                   {
                     text: 'View My Bookings',
                     onPress: () => (navigation as any).navigate('MainTabs', { screen: 'MyBookings' })
                   },
                   { text: 'OK' }
                 ]
               );

              // Refresh instances to update capacity
              loadInstances();
            } catch (error) {
              Alert.alert('Error', 'Failed to create booking');
            } finally {
              setBookingLoading(null);
            }
          }
        }
      ]
    );
  };

  const renderInstance = ({ item }: { item: ClassInstance }) => {
    const isFull = item.currentBookings >= course.capacity;
    const isBooking = bookingLoading === item.firebaseId;
    const availableSpots = course.capacity - item.currentBookings;
    
    // Time-based logic
    const instanceDateTime = new Date(`${item.date} ${item.time}`);
    const now = new Date();
    const isPast = instanceDateTime < now;
    const isWithin2Hours = now > new Date(instanceDateTime.getTime() + 2 * 60 * 60 * 1000);
    const isDisabled = isFull || isBooking || isPast || isWithin2Hours;

    return (
      <View style={styles.instanceCard}>
        <View style={styles.instanceHeader}>
          <Text style={styles.instanceDate}>{item.date}</Text>
          <Text style={styles.instanceTime}>{item.time}</Text>
        </View>
        
        <View style={styles.instanceDetails}>
          <Text style={styles.instructor}>Instructor: {item.instructor}</Text>
          <Text style={styles.capacity}>
            {item.currentBookings}/{course.capacity} booked
          </Text>
          <Text style={styles.availableSpots}>
            {availableSpots} spots available
          </Text>
          {isPast && (
            <Text style={styles.pastInstance}>This class has already started</Text>
          )}
          {isWithin2Hours && !isPast && (
            <Text style={styles.pastInstance}>This class is no longer available</Text>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.bookButton,
            isDisabled && styles.bookButtonDisabled
          ]}
          onPress={() => handleBooking(item)}
          disabled={isDisabled}
        >
          {isBooking ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <MaterialCommunityIcons 
                name={isDisabled ? "close-circle" : "calendar-check"} 
                size={20} 
                color="#fff" 
              />
              <Text style={styles.bookButtonText}>
                {isPast ? 'Past' : isWithin2Hours ? 'Unavailable' : isFull ? 'Full' : 'Book Now'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons name="calendar-blank" size={64} color="#ccc" />
      <Text style={styles.emptyStateTitle}>No available classes</Text>
      <Text style={styles.emptyStateSubtitle}>
        Check back later for new class schedules
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a7c59" />
          <Text style={styles.loadingText}>Loading class instances...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#4a7c59" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{course.courseName}</Text>
          <Text style={styles.subtitle}>Select a class to book</Text>
        </View>
      </View>

      {/* Instance List */}
      <FlatList
        data={instances}
        renderItem={renderInstance}
        keyExtractor={(item) => item.firebaseId}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4a7c59']}
            tintColor="#4a7c59"
          />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#4a7c59',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
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
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 16,
  },
  instanceCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#023E15',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
  },
  instanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  instanceDate: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  instanceTime: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4a7c59',
  },
  instanceDetails: {
    marginBottom: 16,
  },
  instructor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  capacity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  availableSpots: {
    fontSize: 14,
    color: '#4a7c59',
    fontWeight: '500',
  },
  pastInstance: {
    fontSize: 12,
    color: '#e74c3c',
    fontStyle: 'italic',
    marginTop: 4,
  },
  bookButton: {
    backgroundColor: '#4a7c59',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonDisabled: {
    backgroundColor: '#ccc',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default BookingScreen; 