# Yoga Customer App

A React Native application for yoga studio customers to browse classes, book sessions, and manage their profile.

## Features

- **Class Browsing**: Browse available yoga classes with real-time updates
- **Booking System**: Book classes with real-time capacity checking
- **User Profile**: Manage personal information and booking history
- **Authentication**: Secure user registration and login
- **Real-time Updates**: Live synchronization with admin app changes

## Technology Stack

- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **UI Library**: React Native Paper (Material Design)
- **Navigation**: React Navigation

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd yoga-customer-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
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

## Project Structure

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

## Development

### Code Style

This project uses ESLint and Prettier for code quality and formatting. Run the following commands to maintain code quality:

```bash
npm run lint        # Check for linting issues
npm run lint:fix    # Fix linting issues automatically
npm run format      # Format code with Prettier
```

### TypeScript

The project is built with TypeScript for better type safety and developer experience. All new code should be written in TypeScript.

## Firebase Configuration

The app uses Firebase for:
- Authentication (Firebase Auth)
- Database (Firestore)
- Real-time data synchronization

Make sure to configure your Firebase project and add the necessary configuration files.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License. 