// Main App Context for global state management

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import {
  AppState,
  AppContextType,
  DeviceInfo,
  PermissionState,
  AppSettings,
  CacheState,
  AnalyticsEvent
} from '../types';

// Initial state
const initialState: AppState = {
  isInitialized: false,
  isOnline: true,
  appVersion: '1.0.0',
  buildNumber: '1',
  deviceInfo: {
    platform: 'web',
    version: '1.0.0',
    model: 'Unknown',
    brand: 'Unknown',
    screenWidth: 0,
    screenHeight: 0,
    scale: 1,
    fontScale: 1,
    isEmulator: false,
    isTablet: false
  },
  permissions: {
    camera: 'undetermined',
    photoLibrary: 'undetermined',
    location: 'undetermined',
    notifications: 'undetermined',
    microphone: 'undetermined'
  },
  settings: {
    autoLogin: true,
    biometricAuth: false,
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    dataUsage: 'medium',
    cacheSize: 50,
    analyticsEnabled: true,
    crashReportingEnabled: true,
    debugMode: false
  },
  cache: {
    courses: [],
    classInstances: [],
    user: null,
    totalSize: 0,
    maxSize: 100
  },
  analytics: {
    sessionId: '',
    userId: null,
    events: [],
    isEnabled: true
  }
};

// Action types
type AppAction =
  | { type: 'SET_INITIALIZED'; payload: boolean }
  | { type: 'SET_ONLINE_STATUS'; payload: boolean }
  | { type: 'SET_DEVICE_INFO'; payload: DeviceInfo }
  | { type: 'SET_PERMISSIONS'; payload: PermissionState }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'UPDATE_CACHE'; payload: Partial<CacheState> }
  | { type: 'ADD_ANALYTICS_EVENT'; payload: AnalyticsEvent }
  | { type: 'SET_ANALYTICS_ENABLED'; payload: boolean }
  | { type: 'SET_USER_ID'; payload: string | null }
  | { type: 'RESET_APP_STATE' };

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_INITIALIZED':
      return {
        ...state,
        isInitialized: action.payload
      };

    case 'SET_ONLINE_STATUS':
      return {
        ...state,
        isOnline: action.payload
      };

    case 'SET_DEVICE_INFO':
      return {
        ...state,
        deviceInfo: action.payload
      };

    case 'SET_PERMISSIONS':
      return {
        ...state,
        permissions: action.payload
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload
        }
      };

    case 'UPDATE_CACHE':
      return {
        ...state,
        cache: {
          ...state.cache,
          ...action.payload
        }
      };

    case 'ADD_ANALYTICS_EVENT':
      return {
        ...state,
        analytics: {
          ...state.analytics,
          events: [...state.analytics.events, action.payload]
        }
      };

    case 'SET_ANALYTICS_ENABLED':
      return {
        ...state,
        analytics: {
          ...state.analytics,
          isEnabled: action.payload
        }
      };

    case 'SET_USER_ID':
      return {
        ...state,
        analytics: {
          ...state.analytics,
          userId: action.payload
        }
      };

    case 'RESET_APP_STATE':
      return initialState;

    default:
      return state;
  }
};

// Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize app
  const initialize = async () => {
    try {
      // Set device info - this would be determined by platform detection
      const deviceInfo: DeviceInfo = {
        platform: 'web', // This would be determined by platform detection
        version: '1.0.0',
        model: 'Unknown',
        brand: 'Unknown',
        screenWidth: 375, // Default mobile width
        screenHeight: 667, // Default mobile height
        scale: 1,
        fontScale: 1,
        isEmulator: false,
        isTablet: false
      };

      dispatch({ type: 'SET_DEVICE_INFO', payload: deviceInfo });

      // Generate session ID
      const sessionId = generateSessionId();
      
      // Set analytics session
      dispatch({
        type: 'ADD_ANALYTICS_EVENT',
        payload: {
          id: generateId(),
          name: 'app_initialized',
          properties: { sessionId },
          timestamp: new Date().toISOString(),
          sessionId
        }
      });

      // Load settings from storage
      const savedSettings = await loadSettings();
      if (savedSettings) {
        dispatch({ type: 'UPDATE_SETTINGS', payload: savedSettings });
      }

      // Check network status
      const networkStatus = await checkNetworkStatus();
      dispatch({ type: 'SET_ONLINE_STATUS', payload: networkStatus });

      // Check permissions
      await checkPermissions();

      dispatch({ type: 'SET_INITIALIZED', payload: true });
    } catch (error) {
      console.error('Failed to initialize app:', error);
      dispatch({ type: 'SET_INITIALIZED', payload: true }); // Still mark as initialized
    }
  };

  // Check permissions
  const checkPermissions = async (): Promise<void> => {
    // This would integrate with actual permission APIs
    const permissions: PermissionState = {
      camera: 'undetermined',
      photoLibrary: 'undetermined',
      location: 'undetermined',
      notifications: 'undetermined',
      microphone: 'undetermined'
    };
    dispatch({ type: 'SET_PERMISSIONS', payload: permissions });
  };

  // Request permission
  const requestPermission = async (permission: keyof PermissionState): Promise<void> => {
    try {
      // This would integrate with actual permission APIs
      const newPermissions = { ...state.permissions };
      newPermissions[permission] = 'granted'; // This would be the actual result
      
      dispatch({ type: 'SET_PERMISSIONS', payload: newPermissions });
    } catch (error) {
      console.error(`Failed to request permission ${permission}:`, error);
    }
  };

  // Update settings
  const updateSettings = async (settings: Partial<AppSettings>): Promise<void> => {
    try {
      dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
      await saveSettings({ ...state.settings, ...settings });
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  // Clear cache
  const clearCache = async (): Promise<void> => {
    try {
      dispatch({ type: 'UPDATE_CACHE', payload: { totalSize: 0 } });
      // Additional cache clearing logic would go here
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  };

  // Track analytics event
  const trackEvent = (event: Omit<AnalyticsEvent, 'id' | 'timestamp' | 'sessionId'>): void => {
    if (!state.analytics.isEnabled) return;

    const analyticsEvent: AnalyticsEvent = {
      id: generateId(),
      ...event,
      timestamp: new Date().toISOString(),
      sessionId: state.analytics.sessionId || generateSessionId()
    };

    dispatch({ type: 'ADD_ANALYTICS_EVENT', payload: analyticsEvent });
  };

  // Check network status
  const checkNetworkStatus = async (): Promise<boolean> => {
    // Simple online check - in React Native this would use NetInfo
    return true; // Assume online for now
  };

  // Load settings from storage
  const loadSettings = async (): Promise<Partial<AppSettings> | null> => {
    // In React Native, this would use AsyncStorage
    return null; // For now, return null
  };

  // Save settings to storage
  const saveSettings = async (settings: AppSettings): Promise<void> => {
    try {
      // In React Native, this would use AsyncStorage
      console.log('Settings saved:', settings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  // Utility functions
  const generateId = (): string => {
    return Math.random().toString(36).substr(2, 9);
  };

  const generateSessionId = (): string => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Initialize app on mount
  useEffect(() => {
    initialize();
  }, []);

  const contextValue: AppContextType = {
    state,
    initialize,
    checkPermissions,
    requestPermission,
    updateSettings,
    clearCache,
    trackEvent
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Hook to use app context
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 