import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Dimensions,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  ActivityIndicator,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { RegistrationData } from '../../types/user';

const { width, height } = Dimensions.get('window');

interface RegisterScreenProps {
  navigation: any;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { register, isLoading, error, clearError } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Clear error when component mounts or when error changes
  useEffect(() => {
    if (error) {
      Alert.alert('Registration Error', error);
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

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePhoneNumber = (phone: string): boolean => {
    // Basic phone number validation - allows digits, spaces, dashes, and parentheses
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phone.trim()) {
      setPhoneNumberError('Phone number is required');
      return false;
    }
    // Remove all non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setPhoneNumberError('Please enter a valid phone number');
      return false;
    }
    setPhoneNumberError('');
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (confirmPassword: string): boolean => {
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    }
    if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handleRegister = async () => {
    const trimmedFullName = fullName.trim();
    const trimmedPhoneNumber = phoneNumber.trim();
    
    const isFullNameValid = validateFullName(trimmedFullName);
    const isEmailValid = validateEmail(email);
    const isPhoneNumberValid = validatePhoneNumber(trimmedPhoneNumber);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (isFullNameValid && isEmailValid && isPhoneNumberValid && isPasswordValid && isConfirmPasswordValid) {
      try {
        const registrationData: RegistrationData = {
          email: email.trim(),
          password,
          fullName: trimmedFullName,
          phoneNumber: trimmedPhoneNumber,
        };
        await register(registrationData);
      } catch (err) {
        // Error is handled by the auth context
        console.error('Registration failed:', err);
      }
    }
  };

  const handleFullNameChange = (text: string) => {
    setFullName(text);
    if (fullNameError) {
      validateFullName(text);
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) {
      validateEmail(text);
    }
  };

  const handlePhoneNumberChange = (text: string) => {
    setPhoneNumber(text);
    if (phoneNumberError) {
      validatePhoneNumber(text);
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) {
      validatePassword(text);
    }
    // Re-validate confirm password if it has a value
    if (confirmPassword && confirmPasswordError) {
      validateConfirmPassword(confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (confirmPasswordError) {
      validateConfirmPassword(text);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#1b5e3a', '#2f7d5c', '#546945']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.5, 1]}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Avatar Icon */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarCircle}>
              <MaterialCommunityIcons name="account-plus" size={40} color="#4a7c59" />
            </View>
          </View>

          {/* Welcome Text */}
          <Text style={styles.welcomeTitle}>Create Account</Text>
          <Text style={styles.welcomeSubtitle}>Join our yoga community</Text>

          {/* Register Form */}
          <View style={styles.formContainer}>
            {/* Full Name Input */}
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="account-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Full Name"
                placeholderTextColor="#999"
                value={fullName}
                onChangeText={handleFullNameChange}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
            {fullNameError ? <Text style={styles.errorText}>{fullNameError}</Text> : null}

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="email-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Email Address"
                placeholderTextColor="#999"
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

            {/* Phone Number Input */}
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="phone-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Phone Number"
                placeholderTextColor="#999"
                value={phoneNumber}
                onChangeText={handlePhoneNumberChange}
                keyboardType="phone-pad"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {phoneNumberError ? <Text style={styles.errorText}>{phoneNumberError}</Text> : null}

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="lock-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <MaterialCommunityIcons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#999"
                />
              </TouchableOpacity>
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="lock-check-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Confirm Password"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <MaterialCommunityIcons
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#999"
                />
              </TouchableOpacity>
            </View>
            {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

            {/* Create Account Button */}
            <TouchableOpacity style={styles.signInButton} onPress={handleRegister} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.signInButtonText}>CREATE ACCOUNT</Text>
              )}
            </TouchableOpacity>

            {/* Sign In Link */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.signUpLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 40,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    marginHorizontal: 20,
    marginBottom: 60,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 25,
    paddingBottom: 10,
  },
  inputIcon: {
    marginRight: 15,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 5,
  },
  errorText: {
    color: '#DC3545',
    fontSize: 12,
    marginTop: -20,
    marginBottom: 5,
  },
  signInButton: {
    backgroundColor: '#4a7c59',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  signInButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    color: '#666',
    fontSize: 14,
  },
  signUpLink: {
    color: '#4a7c59',
    fontSize: 14,
    fontWeight: '600',
  },
}); 