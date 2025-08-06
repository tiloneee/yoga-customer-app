import React from 'react';
import { LoginScreen, RegisterScreen, ForgotPasswordScreen } from './index';

interface AuthNavigatorProps {
  initialScreen?: 'login' | 'register' | 'forgotPassword';
  onAuthSuccess?: () => void;
}

export const AuthNavigator: React.FC<AuthNavigatorProps> = ({ 
  initialScreen = 'login',
  onAuthSuccess 
}) => {
  const [currentScreen, setCurrentScreen] = React.useState(initialScreen);

  const navigation = {
    navigate: (screen: string) => {
      setCurrentScreen(screen as any);
    },
    goBack: () => {
      // Simple back navigation logic
      if (currentScreen === 'register' || currentScreen === 'forgotPassword') {
        setCurrentScreen('login');
      }
    },
  };

  switch (currentScreen) {
    case 'login':
      return <LoginScreen navigation={navigation} />;
    case 'register':
      return <RegisterScreen navigation={navigation} />;
    case 'forgotPassword':
      return <ForgotPasswordScreen navigation={navigation} />;
    default:
      return <LoginScreen navigation={navigation} />;
  }
}; 