# Project Structure Refactor

## Overview
The project structure has been successfully refactored to follow a more organized and scalable architecture pattern.

## New Structure

```
yoga-customer-app/
├── src/
│   ├── api/                          # API layer and external services
│   │   ├── authService.ts            # Authentication service
│   │   ├── firebase.ts              # Firebase configuration
│   │   └── firestoreService.ts      # Firestore data operations
│   ├── assets/                       # Static assets
│   │   ├── fonts/                    # Custom font files
│   │   └── images/                   # App images and icons
│   ├── components/                   # Reusable UI components
│   │   ├── common/                   # Common/shared components
│   │   │   ├── Button.tsx           # Reusable button component
│   │   │   └── index.ts             # Export file
│   │   └── presentation/             # Presentation components
│   │       ├── Card.tsx             # Card component
│   │       └── index.ts             # Export file
│   ├── constants/                    # App constants and configuration
│   ├── hooks/                        # Custom React hooks
│   ├── navigation/                   # Navigation configuration
│   ├── redux/                        # Redux state management
│   │   ├── actions/                  # Redux actions
│   │   │   └── authActions.ts       # Authentication actions
│   │   ├── constants/                # Redux constants
│   │   │   └── actionTypes.ts       # Action type definitions
│   │   └── reducers/                 # Redux reducers
│   │       ├── authReducer.ts       # Authentication reducer
│   │       └── index.ts             # Root reducer
│   ├── screens/                      # Screen components
│   │   ├── homeScreen/               # Home screen components
│   │   │   └── HomeScreen.tsx       # Main home screen
│   │   └── aboutScreen/              # About screen components
│   │       └── AboutScreen.tsx      # About screen
│   ├── styles/                       # Global styles and themes
│   │   ├── theme.ts                  # Theme configuration
│   │   └── index.ts                  # Export file
│   ├── types/                        # TypeScript type definitions
│   ├── utility/                      # Utility functions and helpers
│   │   ├── firebaseConfig.ts         # Firebase configuration utilities
│   │   ├── firebaseTest.ts           # Firebase testing utilities
│   │   ├── helpers.ts                # General utility functions
│   │   └── index.ts                  # Export file
│   └── App.tsx                       # Main app component
```

## Key Changes Made

### 1. **API Layer Reorganization**
- Moved `services/` to `api/` for better semantic clarity
- All external service integrations now centralized in `api/`

### 2. **Component Organization**
- **`components/common/`**: Shared components used across multiple screens
  - `Button.tsx`: Reusable button component with variants
- **`components/presentation/`**: Presentation-specific components
  - `Card.tsx`: Card component for content display

### 3. **Redux State Management**
- Complete Redux architecture implementation
- **`redux/actions/`**: Action creators for different features
- **`redux/constants/`**: Action type definitions
- **`redux/reducers/`**: State management logic
- Removed `contexts/` directory (using Redux instead)

### 4. **Screen Organization**
- **`screens/homeScreen/`**: Home screen and related components
- **`screens/aboutScreen/`**: About screen and related components
- Each screen has its own directory for better organization

### 5. **Asset Management**
- **`assets/fonts/`**: Custom font files
- **`assets/images/`**: App images and icons
- Organized assets by type for better management

### 6. **Styling System**
- **`styles/theme.ts`**: Centralized theme configuration
- Consistent design tokens and spacing
- Reusable color palette and typography

### 7. **Utility Functions**
- **`utility/helpers.ts`**: General utility functions
- Date/time formatting, validation, array operations
- Currency and percentage formatting

## Benefits of New Structure

### 1. **Better Separation of Concerns**
- API layer separate from UI components
- Clear distinction between common and presentation components
- Organized state management with Redux

### 2. **Improved Scalability**
- Feature-based screen organization
- Modular component architecture
- Centralized styling system

### 3. **Enhanced Maintainability**
- Clear file organization
- Consistent naming conventions
- Type-safe development with TypeScript

### 4. **Developer Experience**
- Easy to find and modify components
- Clear import/export patterns
- Consistent coding standards

## Usage Guidelines

### Importing Components
```typescript
// Common components
import { Button } from '../components/common';

// Presentation components
import { Card } from '../components/presentation';
```

### Using Redux
```typescript
// Actions
import { loginRequest, loginSuccess } from '../redux/actions/authActions';

// Reducers
import { RootState } from '../redux/reducers';
```

### Using Styles
```typescript
// Theme
import { colors, spacing, typography } from '../styles';
```

### Using Utilities
```typescript
// Helpers
import { formatDate, isValidEmail } from '../utility';
```

## Next Steps

1. **Add More Components**: Create additional common and presentation components
2. **Implement More Screens**: Add booking, profile, and course screens
3. **Expand Redux**: Add more actions and reducers for different features
4. **Add Tests**: Implement unit tests for components and utilities
5. **Documentation**: Add JSDoc comments for better code documentation

This refactored structure provides a solid foundation for building a scalable and maintainable React Native application. 