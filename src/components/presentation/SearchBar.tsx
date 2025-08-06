import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CourseSearchFilters } from '../../types/course';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: CourseSearchFilters) => void;
  courseTypes: string[];
  instructors: string[];
  filters: CourseSearchFilters;
  style?: any;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  onFilterChange, 
  courseTypes, 
  instructors, 
  filters,
  style
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<CourseSearchFilters>(filters);

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleFilterApply = () => {
    onFilterChange(localFilters);
    setShowFilters(false);
  };

  const handleFilterReset = () => {
    const resetFilters: CourseSearchFilters = {};
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
    setShowFilters(false);
  };

  const toggleFilter = (type: 'courseType' | 'instructor', value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [type]: prev[type] === value ? undefined : value,
    }));
  };

  return (
    <View style={[styles.container, style]}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search courses..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(true)}>
          <MaterialCommunityIcons name="filter-variant" size={20} color="#4a7c59" />
        </TouchableOpacity>
      </View>

      {/* Active Filters Display */}
      {(filters.courseType || filters.instructor) && (
        <View style={styles.activeFilters}>
          <Text style={styles.activeFiltersLabel}>Active filters:</Text>
          {filters.courseType && (
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>{filters.courseType}</Text>
              <TouchableOpacity onPress={() => toggleFilter('courseType', filters.courseType!)}>
                <MaterialCommunityIcons name="close" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          )}
          {filters.instructor && (
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>{filters.instructor}</Text>
              <TouchableOpacity onPress={() => toggleFilter('instructor', filters.instructor!)}>
                <MaterialCommunityIcons name="close" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Course Type Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Course Type</Text>
                <View style={styles.filterOptions}>
                  {courseTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.filterOption,
                        localFilters.courseType === type && styles.filterOptionActive
                      ]}
                      onPress={() => toggleFilter('courseType', type)}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        localFilters.courseType === type && styles.filterOptionTextActive
                      ]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Instructor Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Instructor</Text>
                <View style={styles.filterOptions}>
                  {instructors.map((instructor) => (
                    <TouchableOpacity
                      key={instructor}
                      style={[
                        styles.filterOption,
                        localFilters.instructor === instructor && styles.filterOptionActive
                      ]}
                      onPress={() => toggleFilter('instructor', instructor)}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        localFilters.instructor === instructor && styles.filterOptionTextActive
                      ]}>
                        {instructor}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.resetButton} onPress={handleFilterReset}>
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={handleFilterApply}>
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    padding: 8,
  },
  activeFilters: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    flexWrap: 'wrap',
  },
  activeFiltersLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a7c59',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 4,
  },
  filterChipText: {
    color: 'white',
    fontSize: 12,
    marginRight: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  modalBody: {
    padding: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  filterOptionActive: {
    backgroundColor: '#4a7c59',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#666',
  },
  filterOptionTextActive: {
    color: 'white',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#4a7c59',
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#4a7c59',
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 25,
    backgroundColor: '#4a7c59',
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SearchBar; 