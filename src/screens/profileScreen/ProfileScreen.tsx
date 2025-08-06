import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  StatusBar,
  TextInput,
} from 'react-native';
import {
  Text,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { User } from '../../types/user';
import { colors } from '../../styles/theme';


interface ProfileScreenProps {
  _navigation?: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ _navigation }) => {
  const { appUser, updateProfile, logout, isLoading, error, clearError } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');

  useEffect(() => {
    if (appUser) {
      setFullName(appUser.fullName || '');
      setPhoneNumber(appUser.phoneNumber || '');
      
    }
  }, [appUser]);



  useEffect(() => {
    if (error) {
      Alert.alert('Profile Update Error', error);
      clearError();
    }
  }, [error, clearError]);

  const validateFullName = (name: string): boolean => {
    if (!name.trim()) {
      setFullNameError('Full name is required');
      return false;
    }
    if (name.trim().length < 2) {
      setFullNameError('Full name must be at least 2 characters');
      return false;
    }
    setFullNameError('');
    return true;
  };

  const validatePhoneNumber = (phone: string): boolean => {
    if (!phone || phone.trim() === '') {
      setPhoneNumberError('');
      return true; // Phone number is optional
    }
    
    const cleanedPhone = phone.replace(/\s/g, '');
    if (!/^0\d{9}$/.test(cleanedPhone)) {
      setPhoneNumberError('Phone number must be 10 digits starting with 0');
      return false;
    }
    setPhoneNumberError('');
    return true;
  };

  const handleSave = async () => {
    const isFullNameValid = validateFullName(fullName);
    const isPhoneNumberValid = validatePhoneNumber(phoneNumber);
    if (isFullNameValid && isPhoneNumberValid) {
      try {
        const updateData: Partial<User> = {
          fullName: fullName.trim(),
        };
        
        // Only update phone number if it has changed from the original
        const originalPhone = appUser?.phoneNumber || '';
        const newPhone = phoneNumber.trim();
        
        if (newPhone !== originalPhone) {
          updateData.phoneNumber = newPhone || undefined;
        }
        
        await updateProfile(updateData);
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully!');
      } catch (err) {
        // Error handled by context
      }
    }
  };

  const handleCancel = () => {
    if (appUser) {
      setFullName(appUser.fullName || '');
      setPhoneNumber(appUser.phoneNumber || '');
    }
    setIsEditing(false);
    setFullNameError('');
    setPhoneNumberError('');
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: async () => { await logout(); } },
      ]
    );
  };

  const handleChangePassword = () => {
    Alert.alert(
      'Change Password',
      'Password change functionality will be implemented in a future update.',
      [{ text: 'OK' }]
    );
  };

  const ActionButton = ({ title, color, icon, onPress }: {
    title: string;
    color: string;
    icon: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity style={[styles.actionButton, { backgroundColor: color }]} onPress={onPress}>
      <MaterialCommunityIcons name={icon as any} size={20} color="white" style={styles.buttonIcon} />
      <Text style={styles.actionButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  if (!appUser) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
        <View style={styles.loadingContainer}>
          <MaterialCommunityIcons name="loading" size={40} color={colors.green400} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Information Card */}
        <View style={styles.userCard}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarBackground}>
              <MaterialCommunityIcons name="account" size={40} color="#4a7c59" />
            </View>
          </View>

          {/* User Info Title */}
          <Text style={styles.cardTitle}>User Information</Text>

          {/* User Details */}
          {!isEditing ? (
            <View style={styles.userDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Full Name</Text>
                <Text style={styles.detailValue}>{appUser.fullName}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Email</Text>
                <Text style={styles.detailValue}>{appUser.email}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Role</Text>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleBadgeText}>
                    {appUser.role}
                  </Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Phone Number</Text>
                <Text style={styles.detailValue}>{appUser.phoneNumber || 'Not provided'}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Member Since</Text>
                <Text style={styles.detailValue}>
                  {new Date(appUser.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.editForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={[styles.textInput, fullNameError ? styles.inputError : null]}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter your full name"
                  placeholderTextColor="#999"
                />
                {fullNameError ? <Text style={styles.errorText}>{fullNameError}</Text> : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={[styles.textInput, phoneNumberError ? styles.inputError : null]}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="Enter 10-digit number (e.g., 0123456789)"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                  maxLength={10}
                />
                {phoneNumberError ? <Text style={styles.errorText}>{phoneNumberError}</Text> : null}
              </View>

              <View style={styles.editButtons}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>



        {/* Action Buttons */}
        {!isEditing && (
          <View style={styles.actionsContainer}>
            <ActionButton
              title="EDIT PROFILE"
              color="#8bc4a0"
              icon="pencil"
              onPress={() => setIsEditing(true)}
            />
            
            <ActionButton
              title="CHANGE PASSWORD"
              color="#8bc4a0"
              icon="lock"
              onPress={handleChangePassword}
            />
            
            <ActionButton
              title="LOGOUT"
              color="#e74c3c"
              icon="logout"
              onPress={handleLogout}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fefefe',
  },
  loadingText: {
    marginTop: 16,
    color: '#84807C',
  },
  userCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#023E15',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarBackground: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#a8d4b8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4a7c59',
    textAlign: 'center',
    marginBottom: 25,
  },
  userDetails: {
    gap: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  roleBadge: {
    backgroundColor: '#a8d4b8',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleBadgeText: {
    fontSize: 12,
    color: '#4a7c59',
    fontWeight: '600',
  },
  actionsContainer: {
    gap: 15,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  buttonIcon: {
    marginRight: 10,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  statsLoading: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  statsLoadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    gap: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
  },
  noStats: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noStatsText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  editForm: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    backgroundColor: 'white',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    fontSize: 12,
    color: '#e74c3c',
    marginTop: 4,
  },
  editButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4a7c59',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProfileScreen; 