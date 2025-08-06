import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  HelperText,
  ActivityIndicator,
} from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';

interface ForgotPasswordScreenProps {
  navigation: any;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const { resetPassword, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Clear error when component mounts or when error changes
  useEffect(() => {
    if (error) {
      Alert.alert('Password Reset Error', error);
      clearError();
    }
  }, [error, clearError]);

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

  const handleResetPassword = async () => {
    const isEmailValid = validateEmail(email);

    if (isEmailValid) {
      try {
        await resetPassword(email.trim());
        setIsSuccess(true);
      } catch (err) {
        // Error is handled by the auth context
        console.error('Password reset failed:', err);
      }
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) {
      validateEmail(text);
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  if (isSuccess) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.title}>Check Your Email</Title>
              <Paragraph style={styles.subtitle}>
                We've sent a password reset link to:
              </Paragraph>
              <Text style={styles.emailText}>{email}</Text>
              <Paragraph style={styles.instructions}>
                Please check your email and follow the instructions to reset your password.
              </Paragraph>
              
              <Button
                mode="contained"
                onPress={handleBackToLogin}
                style={styles.backButton}
              >
                Back to Sign In
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Reset Password</Title>
            <Paragraph style={styles.subtitle}>
              Enter your email address and we'll send you a link to reset your password.
            </Paragraph>

            <TextInput
              label="Email"
              value={email}
              onChangeText={handleEmailChange}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              error={!!emailError}
              disabled={isLoading}
            />
            <HelperText type="error" visible={!!emailError}>
              {emailError}
            </HelperText>

            <Button
              mode="contained"
              onPress={handleResetPassword}
              style={styles.resetButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                'Send Reset Link'
              )}
            </Button>

            <View style={styles.backContainer}>
              <Button
                mode="text"
                onPress={handleBackToLogin}
                disabled={isLoading}
                style={styles.linkButton}
              >
                Back to Sign In
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    elevation: 4,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 28,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  input: {
    marginBottom: 8,
  },
  resetButton: {
    marginTop: 16,
    marginBottom: 24,
    paddingVertical: 8,
  },
  backContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  linkButton: {
    marginVertical: 4,
  },
  emailText: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: 16,
    color: '#6200ea',
  },
  instructions: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  backButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
}); 