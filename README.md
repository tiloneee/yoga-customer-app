# Yoga Customer App

A React Native application for yoga studio customers to browse classes, book sessions, and manage their profile with real-time Firebase integration.

## 🚀 Features

- **Class Browsing**: Browse available yoga classes with real-time updates
- **Booking System**: Book classes with real-time capacity checking
- **User Profile**: Manage personal information and booking history
- **Authentication**: Secure user registration and login
- **Real-time Updates**: Live synchronization with admin app changes
- **Material Design**: Beautiful UI with React Native Paper

## 🛠 Technology Stack

- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **UI Library**: React Native Paper (Material Design)
- **Navigation**: React Navigation
- **State Management**: React Context

## 📱 Screenshots

The app features a modern Material Design interface with:
- Firebase connection status display
- Real-time booking capabilities
- User-friendly navigation
- Responsive design for all screen sizes

## 🏗 Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/        # Screen components
├── navigation/     # Navigation configuration
├── services/       # API and Firebase services
├── utils/          # Utility functions
├── types/          # TypeScript type definitions
├── contexts/       # React Context providers
├── hooks/          # Custom React hooks
└── constants/      # App constants and configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/tiloneee/yoga-customer-app.git
   cd yoga-customer-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Firebase** (see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)):
   ```bash
   cp env.example .env
   # Update .env with your Firebase configuration
   ```

4. **Start the development server**:
   ```bash
   npm start
   ```

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Start the app on Android
- `npm run ios` - Start the app on iOS
- `npm run web` - Start the app on web
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 🔥 Firebase Setup

This app requires Firebase configuration. Follow the detailed guide in [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) to:

1. Create a Firebase project
2. Enable Authentication and Firestore
3. Configure environment variables
4. Test the connection

## 📋 Implementation Progress

### ✅ Section 1: Project Setup & Configuration - COMPLETED
- [x] React Native project with TypeScript
- [x] Firebase integration and configuration
- [x] ESLint and Prettier setup
- [x] Material Design UI framework
- [x] Development environment optimization

### 🚧 Section 2: Data Models & Types - IN PROGRESS
- [ ] Define User interface
- [ ] Define Course interface
- [ ] Define ClassInstance interface
- [ ] Define Booking interface
- [ ] Set up TypeScript types

### 📝 Upcoming Sections
- Section 3: Authentication System
- Section 4: Navigation & App Structure
- Section 5: Course Browsing & Search
- Section 6: Full Booking System
- And more...

## 🧪 Testing

```bash
# Run linting
npm run lint

# Format code
npm run format

# Check for issues
npm run lint:fix
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React Native](https://reactnative.dev/) for the amazing framework
- [Expo](https://expo.dev/) for the development platform
- [Firebase](https://firebase.google.com/) for backend services
- [React Native Paper](https://callstack.github.io/react-native-paper/) for Material Design components

## 📞 Support

If you have any questions or need help with the setup, please:

1. Check the [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) guide
2. Look at the console logs for detailed error information
3. Open an issue on GitHub

---

**Happy coding! 🧘‍♀️✨**