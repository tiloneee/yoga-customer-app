# Firebase Setup Guide

## 🔥 How to Connect Firebase to Your Yoga Customer App

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select an existing project
3. Enter your project name (e.g., "yoga-studio-app")
4. Follow the setup wizard (you can disable Google Analytics for now)

### Step 2: Add a Web App to Your Firebase Project

1. In your Firebase project console, click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to the "Your apps" section
4. Click "Add app" and select the web icon (</>) 
5. Register your app with a nickname (e.g., "yoga-customer-app")
6. **Copy the Firebase configuration object** - it looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC-your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### Step 3: Update Your Environment File

1. Open the `.env` file in your project root
2. Replace the placeholder values with your actual Firebase config:

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyC-your-actual-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# App Configuration
EXPO_PUBLIC_APP_NAME=Yoga Customer App
EXPO_PUBLIC_APP_VERSION=1.0.0
```

### Step 4: Enable Authentication

1. In Firebase Console, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Click "Save"

### Step 5: Set Up Firestore Database

1. In Firebase Console, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development (we'll add security rules later)
4. Select a location close to your users
5. Click "Done"

### Step 6: Test Your Connection

1. Restart your Expo development server:
   ```bash
   npm start
   ```

2. Open the app and check the Firebase status
3. If you see ✅ for all services, you're connected!

### Troubleshooting

#### ❌ "Invalid API Key" Error
- Make sure you copied the API key correctly from Firebase Console
- Check that your `.env` file is in the project root
- Restart the development server after updating `.env`

#### ❌ "Project not found" Error
- Verify your project ID is correct
- Make sure you're using the right Firebase project

#### ❌ "Permission denied" Error
- Check that Firestore is enabled in your Firebase project
- Verify authentication is enabled

### Security Rules (Optional for Development)

For development, you can use test mode. For production, you'll want to set up proper security rules in the `firestore.rules` file.

### Next Steps

Once Firebase is connected:
1. ✅ Section 1 is complete
2. 🚀 Ready for Section 2: Data Models & Types
3. 📱 Your app will show real-time Firebase status

### Need Help?

- Check the Firebase Console for any error messages
- Look at the app's console logs for detailed error information
- Make sure all environment variables are set correctly

Your Firebase configuration should look like this when complete:
```
🔥 Firebase Configuration Status:
  Auth Service: ✅
  Firestore Service: ✅
  Configuration: ✅
``` 