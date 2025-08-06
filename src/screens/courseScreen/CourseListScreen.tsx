import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  RefreshControl, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar,
  ActivityIndicator 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { courseService } from '../../api/courseService';
import { Course, CourseSearchFilters } from '../../types/course';
import CourseCard from '../../components/presentation/CourseCard';
import SearchBar from '../../components/presentation/SearchBar';

interface CourseListScreenProps {
  navigation: any;
}

const CourseListScreen: React.FC<CourseListScreenProps> = ({ navigation }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<CourseSearchFilters>({});
  const [courseTypes, setCourseTypes] = useState<string[]>([]);
  const [instructors, setInstructors] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load courses and filter data
  const loadCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [coursesData, typesData, instructorsData] = await Promise.all([
        courseService.getAllCourses(),
        courseService.getCourseTypes(),
        courseService.getInstructors(),
      ]);
      setCourses(coursesData);
      setFilteredCourses(coursesData);
      setCourseTypes(typesData);
      setInstructors(instructorsData);
    } catch (err) {
      console.error('Error loading courses:', err);
      setError('Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Apply search and filters
  const applySearchAndFilters = useCallback(() => {
    let filtered = [...courses];

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(course =>
        (course.courseName?.toLowerCase() || '').includes(query) ||
        (course.description?.toLowerCase() || '').includes(query) ||
        (course.instructor?.toLowerCase() || '').includes(query) ||
        (course.courseType?.toLowerCase() || '').includes(query)
      );
    }

    // Apply filters
    if (filters.courseType) {
      filtered = filtered.filter(course => course.courseType === filters.courseType);
    }

    if (filters.instructor) {
      filtered = filtered.filter(course => course.instructor === filters.instructor);
    }

    if (filters.priceRange) {
      filtered = filtered.filter(course =>
        course.pricePerClass !== undefined &&
        course.pricePerClass >= filters.priceRange!.min &&
        course.pricePerClass <= filters.priceRange!.max
      );
    }

    if (filters.duration) {
      filtered = filtered.filter(course =>
        course.durationMinutes !== undefined &&
        course.durationMinutes >= filters.duration!.min &&
        course.durationMinutes <= filters.duration!.max
      );
    }

    setFilteredCourses(filtered);
  }, [courses, searchQuery, filters]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: CourseSearchFilters) => {
    setFilters(newFilters);
  };

  // Handle course selection
  const handleCoursePress = (course: Course) => {
    navigation.navigate('CourseDetail', { courseId: course.id, firebaseId: course.firebaseId });
  };

  // Handle booking
  const handleBookPress = (course: Course) => {
    navigation.navigate('Booking', { course });
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCourses();
    setRefreshing(false);
  };

  // Load data on mount
  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  // Apply search and filters when they change
  useEffect(() => {
    applySearchAndFilters();
  }, [applySearchAndFilters]);

  // Set up real-time updates
  useEffect(() => {
    const unsubscribe = courseService.onCoursesSnapshot((updatedCourses) => {
      setCourses(updatedCourses);
    });

    return () => unsubscribe();
  }, []);

  // Render course item
  const renderCourseItem = ({ item }: { item: Course }) => (
    <CourseCard 
      course={item} 
      onPress={handleCoursePress} 
      onBookPress={handleBookPress}
    />
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons name="yoga" size={64} color="#ccc" />
      <Text style={styles.emptyStateTitle}>
        {searchQuery || Object.keys(filters).length > 0 
          ? 'No courses found' 
          : 'No courses available'
        }
      </Text>
      <Text style={styles.emptyStateSubtitle}>
        {searchQuery || Object.keys(filters).length > 0
          ? 'Try adjusting your search or filters'
          : 'Check back later for new courses'
        }
      </Text>
    </View>
  );

  // Render loading state
  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a7c59" />
          <Text style={styles.loadingText}>Loading courses...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Courses</Text>
        <Text style={styles.subtitle}>Discover your perfect yoga class</Text>
      </View>

      {/* Search and Filters */}
      <SearchBar
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        courseTypes={courseTypes}
        instructors={instructors}
        filters={filters}
        style={styles.searchBar}
      />

      {/* Error State */}
      {error && (
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle" size={24} color="#e74c3c" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Course List */}
      <FlatList
        data={filteredCourses}
        renderItem={renderCourseItem}
        keyExtractor={(item) => item.firebaseId}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
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
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fdf2f2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  errorText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#e74c3c',
    flex: 1,
  },
  searchBar: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
});

export default CourseListScreen; 