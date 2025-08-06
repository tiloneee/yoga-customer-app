// Yoga App Custom Theme

export const colors = {
  // Green palette
  green100: '#A8D5BA', // lightest
  green200: '#6BBF8A',
  green300: '#4B9B6E',
  green400: '#2E7D5C',
  green500: '#1B5E3A', // darkest

  // Neutral palette
  olive:    '#556945',
  mist:     '#BDCAC5',
  blush:    '#F2E4DE',
  stone:    '#C6C3BD',
  taupe:    '#84807C',

  // Additional colors for UI
  lightGray: '#BDCAC5', // same as mist
  darkGray: '#84807C',  // same as taupe
  border: '#BDCAC5',     // same as mist
  error: '#DC3545',      // same as danger

  // Utility
  white:    '#FFFFFF',
  black:    '#000000',

  // Text
  text: {
    primary: '#1B5E3A', // dark green
    secondary: '#556945',
    light: '#84807C',
  },
  // Backgrounds
  background: {
    primary: '#F2E4DE', // blush
    card:    '#FFFFFF',
    muted:   '#BDCAC5', // mist
  },
  // Status
  success: '#6BBF8A',
  warning: '#FFC107',
  danger:  '#DC3545',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// Global border radius for all cards, buttons, etc.
export const borderRadius = {
  all: 14,
} as const;

export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

// Custom shadow using #023E15
export const shadows = {
  card: {
    shadowColor: '#023E15',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
  },
  button: {
    shadowColor: '#023E15',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
} as const; 