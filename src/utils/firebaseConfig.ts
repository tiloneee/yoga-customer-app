/**
 * Firebase Configuration Helper
 * 
 * To set up Firebase:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a new project or select existing one
 * 3. Go to Project Settings > General
 * 4. Scroll down to "Your apps" section
 * 5. Click "Add app" > "Web app"
 * 6. Register your app and copy the config
 * 7. Update your .env file with the values below
 */

export const getFirebaseConfig = () => {
  // Check if environment variables are set
  const config = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  };

  // Validate configuration
  const missingKeys = Object.entries(config)
    .filter(([_key, value]) => !value || value === 'your_api_key_here')
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    console.warn('⚠️ Firebase configuration incomplete. Missing or default values for:', missingKeys);
    console.log('📝 Please update your .env file with your Firebase configuration.');
    console.log('🔗 Get your config from: https://console.firebase.google.com/');
  }

  return config;
};

export const validateFirebaseConfig = () => {
  const config = getFirebaseConfig();
  const isValid = Object.values(config).every(value => 
    value && value !== 'your_api_key_here' && value !== 'your_project_id'
  );
  
  if (!isValid) {
    console.error('❌ Firebase configuration is invalid or incomplete');
    console.log('📋 Required environment variables:');
    console.log('  EXPO_PUBLIC_FIREBASE_API_KEY');
    console.log('  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN');
    console.log('  EXPO_PUBLIC_FIREBASE_PROJECT_ID');
    console.log('  EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET');
    console.log('  EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID');
    console.log('  EXPO_PUBLIC_FIREBASE_APP_ID');
  }
  
  return isValid;
}; 