import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Course } from '../../types/course';
import { shadows } from '../../styles/theme';

interface CourseCardProps {
  course: Course;
  onPress: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onPress }) => {
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

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(course)}>
      {/* Course Image */}
      <View style={styles.imageContainer}>
        {course.imageUrl ? (
          <Image source={{ uri: course.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <MaterialCommunityIcons name="yoga" size={40} color="#4a7c59" />
          </View>
        )}
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{course.courseType}</Text>
        </View>
      </View>

      {/* Course Info */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {course.courseName}
        </Text>
        
        <Text style={styles.description} numberOfLines={2}>
          {course.description}
        </Text>

        {/* Course Details */}
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="account" size={16} color="#666" />
            <Text style={styles.detailText}>{course.instructor}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="clock-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{formatDuration(course.durationMinutes)}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="account-group" size={16} color="#666" />
            <Text style={styles.detailText}>{course.capacity} spots</Text>
          </View>
        </View>

        {/* Price */}
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{formatPrice(course.pricePerClass)}</Text>
          <Text style={styles.priceLabel}>per class</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 16,
    ...shadows.card,
    overflow: 'visible',
  },
  imageContainer: {
    position: 'relative',
    height: 160,
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
    borderRadius: 12,
  },
  typeBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#4a7c59',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  typeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4a7c59',
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
});

export default CourseCard; 