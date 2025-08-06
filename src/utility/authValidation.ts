// Authentication validation utilities

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const authValidation = {
  // Email validation
  validateEmail: (email: string): ValidationResult => {
    if (!email) {
      return { isValid: false, error: 'Email is required' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }
    
    return { isValid: true };
  },

  // Password validation
  validatePassword: (password: string): ValidationResult => {
    if (!password) {
      return { isValid: false, error: 'Password is required' };
    }
    
    if (password.length < 6) {
      return { isValid: false, error: 'Password must be at least 6 characters' };
    }
    
    return { isValid: true };
  },

  // Confirm password validation
  validateConfirmPassword: (password: string, confirmPassword: string): ValidationResult => {
    if (!confirmPassword) {
      return { isValid: false, error: 'Please confirm your password' };
    }
    
    if (confirmPassword !== password) {
      return { isValid: false, error: 'Passwords do not match' };
    }
    
    return { isValid: true };
  },

  // Full name validation
  validateFullName: (name: string): ValidationResult => {
    if (!name.trim()) {
      return { isValid: false, error: 'Full name is required' };
    }
    
    if (name.trim().length < 2) {
      return { isValid: false, error: 'Full name must be at least 2 characters' };
    }
    
    return { isValid: true };
  },

  // Phone number validation
  validatePhoneNumber: (phone: string): ValidationResult => {
    if (!phone) {
      return { isValid: true }; // Phone is optional
    }
    
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return { isValid: false, error: 'Please enter a valid phone number' };
    }
    
    return { isValid: true };
  },

  // Registration form validation
  validateRegistrationForm: (data: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};
    
    const fullNameResult = authValidation.validateFullName(data.fullName);
    if (!fullNameResult.isValid) {
      errors.fullName = fullNameResult.error!;
    }
    
    const emailResult = authValidation.validateEmail(data.email);
    if (!emailResult.isValid) {
      errors.email = emailResult.error!;
    }
    
    const passwordResult = authValidation.validatePassword(data.password);
    if (!passwordResult.isValid) {
      errors.password = passwordResult.error!;
    }
    
    const confirmPasswordResult = authValidation.validateConfirmPassword(data.password, data.confirmPassword);
    if (!confirmPasswordResult.isValid) {
      errors.confirmPassword = confirmPasswordResult.error!;
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  // Login form validation
  validateLoginForm: (data: {
    email: string;
    password: string;
  }): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};
    
    const emailResult = authValidation.validateEmail(data.email);
    if (!emailResult.isValid) {
      errors.email = emailResult.error!;
    }
    
    const passwordResult = authValidation.validatePassword(data.password);
    if (!passwordResult.isValid) {
      errors.password = passwordResult.error!;
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
}; 