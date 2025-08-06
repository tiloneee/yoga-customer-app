import React from 'react';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { AuthProvider } from './context/AuthContext';
import { AppNavigator } from './navigation/AppNavigator';
import { colors, borderRadius } from './styles/theme';

const theme = {
  ...DefaultTheme,
  roundness: borderRadius.all,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.green400, // #2E7D5C
    accent: colors.green200,  // #6BBF8A
    background: colors.background.primary, // #F2E4DE
    surface: colors.background.card,       // #FFFFFF
    text: colors.text.primary,             // #1B5E3A
    placeholder: colors.taupe,             // #84807C
    disabled: colors.mist,                 // #BDCAC5
    notification: colors.success,          // #6BBF8A
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </PaperProvider>
  );
}
