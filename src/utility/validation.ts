// Validation utilities and type guards for data safety

import {
  User,
  Course,
  ClassInstance,
  Instructor,
  CourseCategory,
  ClassLocation,
  ValidationResult,
  ValidationSchema,
  AppError,
  ValidationError
} from '../types';

// Type Guards
export const isUser = (obj: any): obj is User => {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.firstName === 'string' &&
    typeof obj.lastName === 'string' &&
    typeof obj.isActive === 'boolean' &&
    typeof obj.createdAt === 'string' &&
    typeof obj.updatedAt === 'string'
  );
};

export const isCourse = (obj: any): obj is Course => {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.description === 'string' &&
    typeof obj.duration === 'number' &&
    typeof obj.maxCapacity === 'number' &&
    typeof obj.price === 'number' &&
    typeof obj.currency === 'string' &&
    typeof obj.isActive === 'boolean' &&
    typeof obj.createdAt === 'string' &&
    typeof obj.updatedAt === 'string'
  );
};

export const isClassInstance = (obj: any): obj is ClassInstance => {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.courseId === 'number' &&
    typeof obj.instructor === 'string' &&
    typeof obj.date === 'string' &&
    typeof obj.time === 'string' &&
    typeof obj.dateTime === 'string' &&
    typeof obj.currentBookings === 'number' &&
    typeof obj.status === 'string' &&
    typeof obj.active === 'boolean' &&
    typeof obj.valid === 'boolean' &&
    typeof obj.createdAt === 'string' &&
    typeof obj.updatedAt === 'string'
  );
};



export const isInstructor = (obj: any): obj is Instructor => {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.bio === 'string' &&
    Array.isArray(obj.specialties) &&
    Array.isArray(obj.certifications) &&
    typeof obj.experience === 'number' &&
    typeof obj.rating === 'number' &&
    typeof obj.totalReviews === 'number' &&
    typeof obj.totalClasses === 'number' &&
    typeof obj.isActive === 'boolean'
  );
};

export const isCourseCategory = (obj: any): obj is CourseCategory => {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.description === 'string' &&
    typeof obj.icon === 'string' &&
    typeof obj.color === 'string' &&
    typeof obj.isActive === 'boolean'
  );
};

export const isClassLocation = (obj: any): obj is ClassLocation => {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.address === 'string' &&
    typeof obj.city === 'string' &&
    typeof obj.state === 'string' &&
    typeof obj.zipCode === 'string' &&
    typeof obj.country === 'string' &&
    typeof obj.capacity === 'number' &&
    Array.isArray(obj.facilities) &&
    typeof obj.isAccessible === 'boolean'
  );
};



// Validation Rules
export const validationRules = {
  // String validation
  required: (value: any): string | null => {
    return value !== null && value !== undefined && value !== '' ? null : 'This field is required';
  },

  minLength: (min: number) => (value: string): string | null => {
    return value && value.length >= min ? null : `Minimum length is ${min} characters`;
  },

  maxLength: (max: number) => (value: string): string | null => {
    return value && value.length <= max ? null : `Maximum length is ${max} characters`;
  },

  email: (value: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return value && emailRegex.test(value) ? null : 'Please enter a valid email address';
  },

  phone: (value: string): string | null => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return value && phoneRegex.test(value.replace(/\s/g, '')) ? null : 'Please enter a valid phone number';
  },

  // Number validation
  min: (min: number) => (value: number): string | null => {
    return value >= min ? null : `Minimum value is ${min}`;
  },

  max: (max: number) => (value: number): string | null => {
    return value <= max ? null : `Maximum value is ${max}`;
  },

  positive: (value: number): string | null => {
    return value > 0 ? null : 'Value must be positive';
  },

  // Date validation
  futureDate: (value: string): string | null => {
    const date = new Date(value);
    const now = new Date();
    return date > now ? null : 'Date must be in the future';
  },

  pastDate: (value: string): string | null => {
    const date = new Date(value);
    const now = new Date();
    return date < now ? null : 'Date must be in the past';
  },

  // Array validation
  minArrayLength: (min: number) => (value: any[]): string | null => {
    return value && value.length >= min ? null : `Minimum ${min} items required`;
  },

  maxArrayLength: (max: number) => (value: any[]): string | null => {
    return value && value.length <= max ? null : `Maximum ${max} items allowed`;
  },

  // Custom validation
  url: (value: string): string | null => {
    try {
      // Simple URL validation without using URL constructor
      const urlRegex = /^https?:\/\/.+/;
      return urlRegex.test(value) ? null : 'Please enter a valid URL';
    } catch {
      return 'Please enter a valid URL';
    }
  },

  password: (value: string): string | null => {
    const hasMinLength = value.length >= 8;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumbers = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    if (!hasMinLength) return 'Password must be at least 8 characters long';
    if (!hasUpperCase) return 'Password must contain at least one uppercase letter';
    if (!hasLowerCase) return 'Password must contain at least one lowercase letter';
    if (!hasNumbers) return 'Password must contain at least one number';
    if (!hasSpecialChar) return 'Password must contain at least one special character';

    return null;
  },

  // Business logic validation
  bookingCapacity: (maxCapacity: number, currentBookings: number) => (value: number): string | null => {
    const availableSpots = maxCapacity - currentBookings;
    return value <= availableSpots ? null : `Only ${availableSpots} spots available`;
  },

  bookingTimeLimit: (hoursBeforeClass: number) => (bookingDate: string, classDate: string): string | null => {
    const bookingTime = new Date(bookingDate);
    const classTime = new Date(classDate);
    const timeDiff = classTime.getTime() - bookingTime.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    return hoursDiff >= hoursBeforeClass ? null : `Booking must be made at least ${hoursBeforeClass} hours before class`;
  },

  cancellationTimeLimit: (hoursBeforeClass: number) => (cancellationDate: string, classDate: string): string | null => {
    const cancellationTime = new Date(cancellationDate);
    const classTime = new Date(classDate);
    const timeDiff = classTime.getTime() - cancellationTime.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    return hoursDiff >= hoursBeforeClass ? null : `Cancellation must be made at least ${hoursBeforeClass} hours before class`;
  }
};

// Validation Schemas
export const userValidationSchema: ValidationSchema<User> = {
  email: [validationRules.required, validationRules.email],
  firstName: [validationRules.required, validationRules.minLength(2), validationRules.maxLength(50)],
  lastName: [validationRules.required, validationRules.minLength(2), validationRules.maxLength(50)],
  phoneNumber: [validationRules.phone],
  dateOfBirth: [validationRules.pastDate]
};

export const courseValidationSchema: ValidationSchema<Course> = {
  name: [validationRules.required, validationRules.minLength(3), validationRules.maxLength(100)],
  description: [validationRules.required, validationRules.minLength(10), validationRules.maxLength(1000)],
  duration: [validationRules.required, validationRules.positive, validationRules.max(480)], // max 8 hours
  maxCapacity: [validationRules.required, validationRules.positive, validationRules.max(100)],
  price: [validationRules.required, validationRules.positive, validationRules.max(1000)]
};

export const classInstanceValidationSchema: ValidationSchema<ClassInstance> = {
  courseId: [validationRules.required],
  instructor: [validationRules.required],
  date: [validationRules.required],
  time: [validationRules.required],
  dateTime: [validationRules.required],
  currentBookings: [validationRules.required],
  status: [validationRules.required],
  active: [validationRules.required],
  valid: [validationRules.required]
};



// Validation Functions
export const validateObject = <T>(
  obj: any,
  schema: ValidationSchema<T>,
  isPartial: boolean = false
): ValidationResult => {
  const errors: Record<string, string> = {};
  let isValid = true;

  for (const [field, rules] of Object.entries(schema)) {
    const value = obj[field];
    
    // Skip validation for optional fields if value is undefined/null and this is a partial validation
    if (isPartial && (value === undefined || value === null)) {
      continue;
    }

    for (const rule of rules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        isValid = false;
        break; // Stop at first error for this field
      }
    }
  }

  return { isValid, errors };
};

export const validateUser = (user: any, isPartial: boolean = false): ValidationResult => {
  return validateObject(user, userValidationSchema, isPartial);
};

export const validateCourse = (course: any, isPartial: boolean = false): ValidationResult => {
  return validateObject(course, courseValidationSchema, isPartial);
};

export const validateClassInstance = (classInstance: any, isPartial: boolean = false): ValidationResult => {
  return validateObject(classInstance, classInstanceValidationSchema, isPartial);
};



// Data Transformation Functions
export const transformFirebaseData = <T>(data: any, typeGuard: (obj: any) => obj is T): T | null => {
  if (!typeGuard(data)) {
    console.warn('Data validation failed for Firebase document');
    return null;
  }
  return data;
};

export const transformUserData = (data: any): User | null => {
  return transformFirebaseData(data, isUser);
};

export const transformCourseData = (data: any): Course | null => {
  return transformFirebaseData(data, isCourse);
};

export const transformClassInstanceData = (data: any): ClassInstance | null => {
  return transformFirebaseData(data, isClassInstance);
};



// Error Handling
export const createValidationError = (field: string, message: string, value?: any): ValidationError => {
  return {
    code: 'VALIDATION_ERROR',
    message,
    field,
    value,
    timestamp: new Date().toISOString()
  };
};

export const createAppError = (code: string, message: string, details?: any): AppError => {
  return {
    code,
    message,
    details,
    timestamp: new Date().toISOString()
  };
};

// Data Sanitization
export const sanitizeString = (value: string): string => {
  return value.trim().replace(/[<>]/g, '');
};

export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

export const sanitizePhone = (phone: string): string => {
  return phone.replace(/\s/g, '').replace(/[^\d+]/g, '');
};

export const sanitizeUserData = (userData: any): Partial<User> => {
  return {
    ...userData,
    email: userData.email ? sanitizeEmail(userData.email) : userData.email,
    firstName: userData.firstName ? sanitizeString(userData.firstName) : userData.firstName,
    lastName: userData.lastName ? sanitizeString(userData.lastName) : userData.lastName,
    phoneNumber: userData.phoneNumber ? sanitizePhone(userData.phoneNumber) : userData.phoneNumber
  };
};

// Data Validation Helpers
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const isValidISODate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

export const isValidTimeString = (timeString: string): boolean => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(timeString);
};

export const isValidCurrency = (currency: string): boolean => {
  const validCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
  return validCurrencies.includes(currency);
};

// Array Validation
export const validateArray = <T>(
  array: any[],
  itemValidator: (item: any) => item is T
): { isValid: boolean; validItems: T[]; invalidIndices: number[] } => {
  const validItems: T[] = [];
  const invalidIndices: number[] = [];

  array.forEach((item, index) => {
    if (itemValidator(item)) {
      validItems.push(item);
    } else {
      invalidIndices.push(index);
    }
  });

  return {
    isValid: invalidIndices.length === 0,
    validItems,
    invalidIndices
  };
}; 