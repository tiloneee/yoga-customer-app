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
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { bookingService } from '../../api/bookingService';
import { useAuth } from '../../context/AuthContext';
import { BookingWithDetails } from '../../types/booking';

const MyBookingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { appUser } = useAuth();

  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cancellingBooking, setCancellingBooking] = useState<string | null>(null);

  useEffect(() => {
    if (appUser) {
      loadBookings();
    }
  }, [appUser]);

  // Refresh bookings every time the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (appUser) {
        // Small delay to prevent loading flash for fast loads
        const timer = setTimeout(() => {
          loadBookings();
        }, 100);
        
        return () => clearTimeout(timer);
      }
    }, [appUser])
  );

  const loadBookings = async () => {
    if (!appUser) {
      Alert.alert('Error', 'Please log in to view your bookings');
      return;
    }

    if (!appUser.id) {
      Alert.alert('Error', 'User ID is missing. Please log in again.');
      return;
    }

    try {
      setLoading(true);
      
      // Mark past bookings as attended first
      await bookingService.markPastBookingsAsAttended();
      
      const result = await bookingService.getUserBookingsWithDetails(appUser.id);
      
      if (result.error) {
        Alert.alert('Error', result.error.message || 'Failed to load bookings');
        return;
      }

      setBookings(result.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  };

  const handleCancelBooking = async (booking: BookingWithDetails) => {
    Alert.alert(
      'Cancel Booking',
      `Are you sure you want to cancel your booking for ${booking.course?.courseName} on ${booking.instance?.date} at ${booking.instance?.time}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              setCancellingBooking(booking.firebaseId);
              const result = await bookingService.cancelBooking(booking.firebaseId);

              if (result.error) {
                Alert.alert('Error', result.error.message);
                return;
              }

              Alert.alert('Booking Cancelled', 'Your booking has been cancelled successfully');
              loadBookings(); // Refresh the list
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel booking');
            } finally {
              setCancellingBooking(null);
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '#4a7c59';
      case 'pending':
        return '#f39c12';
      case 'cancelled':
        return '#e74c3c';
      case 'completed':
        return '#27ae60';
      case 'no-show':
        return '#95a5a6';
      case 'attended':
        return '#27ae60';
      default:
        return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'pending':
        return 'Pending';
      case 'cancelled':
        return 'Cancelled';
      case 'completed':
        return 'Completed';
      case 'no-show':
        return 'No Show';
      case 'attended':
        return 'Attended';
      default:
        return status;
    }
  };

  const renderBooking = ({ item }: { item: BookingWithDetails }) => {
    const isCancelling = cancellingBooking === item.firebaseId;
    const canCancel = item.status === 'confirmed' || item.status === 'pending';
    
    // Check if within 30 minutes of class start time
    const instanceDateTime = new Date(`${item.instance?.date} ${item.instance?.time}`);
    const now = new Date();
    const thirtyMinutesBefore = new Date(instanceDateTime.getTime() - 30 * 60 * 1000);
    const isWithin30Minutes = now > thirtyMinutesBefore;
    const canCancelNow = canCancel && !isWithin30Minutes;

    return (
      <View style={styles.bookingCard}>
        <View style={styles.bookingHeader}>
          <Text style={styles.courseName}>{item.course?.courseName}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>

        <View style={styles.bookingDetails}>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="calendar" size={16} color="#666" />
            <Text style={styles.detailText}>{item.instance?.date}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="clock" size={16} color="#666" />
            <Text style={styles.detailText}>{item.instance?.time}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="account" size={16} color="#666" />
            <Text style={styles.detailText}>{item.instance?.instructor}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="map-marker" size={16} color="#666" />
            <Text style={styles.detailText}>{item.course?.studioRoom}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="currency-usd" size={16} color="#666" />
            <Text style={styles.detailText}>${item.course?.pricePerClass}</Text>
          </View>
          
          {isWithin30Minutes && canCancel && (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="alert-circle" size={16} color="#f39c12" />
              <Text style={styles.warningText}>Cancellation not available within 30 minutes of class</Text>
            </View>
          )}
        </View>

        <View style={styles.bookingFooter}>
          <Text style={styles.bookingDate}>
            Booked on: {(() => {
              try {
                // Handle Firestore timestamp or string date
                let date: Date;
                if (typeof item.createdAt === 'string') {
                  date = new Date(item.createdAt);
                } else if (item.createdAt && typeof item.createdAt === 'object' && 'toDate' in item.createdAt) {
                  // Firestore timestamp object
                  date = (item.createdAt as any).toDate();
                } else if (typeof item.createdAt === 'number') {
                  // Unix timestamp
                  date = new Date(item.createdAt);
                } else {
                  date = new Date();
                }
                
                if (isNaN(date.getTime())) {
                  return 'Invalid date';
                }
                
                                 return date.toLocaleString('en-GB', {
                   hour: '2-digit',
                   minute: '2-digit',
                   day: '2-digit',
                   month: '2-digit',
                   year: 'numeric'
                 }).replace(',', ' -');
              } catch (error) {
                return 'Invalid date';
              }
            })()}
          </Text>
          
          {canCancelNow && (
            <TouchableOpacity
              style={[styles.cancelButton, isCancelling && styles.cancelButtonDisabled]}
              onPress={() => handleCancelBooking(item)}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <ActivityIndicator size="small" color="#e74c3c" />
              ) : (
                <>
                  <MaterialCommunityIcons name="close-circle" size={16} color="#e74c3c" />
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons name="calendar-blank" size={64} color="#ccc" />
      <Text style={styles.emptyStateTitle}>No bookings yet</Text>
      <Text style={styles.emptyStateSubtitle}>
        Book your first yoga class to see it here
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => navigation.navigate('Courses' as never)}
      >
        <Text style={styles.browseButtonText}>Browse Classes</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a7c59" />
          <Text style={styles.loadingText}>Loading your bookings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      {/* Header with Back Button */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>My Bookings</Text>
          <Text style={styles.subtitle}>
            {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}
          </Text>
        </View>
      </View>

      {/* Bookings List */}
      <FlatList
        data={bookings}
        renderItem={renderBooking}
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
  bookingCard: {
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
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  courseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  bookingDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  warningText: {
    fontSize: 12,
    color: '#f39c12',
    fontStyle: 'italic',
    marginLeft: 8,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  bookingDate: {
    fontSize: 12,
    color: '#999',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  cancelButtonDisabled: {
    opacity: 0.5,
  },
  cancelButtonText: {
    color: '#e74c3c',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
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
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#4a7c59',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MyBookingsScreen; 