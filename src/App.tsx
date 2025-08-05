import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Provider as PaperProvider, DefaultTheme, Text, Card, Button } from 'react-native-paper';
import { firebaseTest } from './utils/firebaseTest';
import { validateFirebaseConfig } from './utils/firebaseConfig';

// Custom theme for the app
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ea',
    accent: '#03dac4',
  },
};

export default function App() {
  const [firebaseStatus, setFirebaseStatus] = useState<{
    auth: boolean;
    firestore: boolean;
    config: boolean;
  } | null>(null);
  const [connectionTested, setConnectionTested] = useState(false);

  useEffect(() => {
    // Check Firebase configuration on app start
    const status = firebaseTest.getConfigStatus();
    setFirebaseStatus(status);
    firebaseTest.logConfigStatus();
    
    // Validate Firebase config
    const isConfigValid = validateFirebaseConfig();
    if (!isConfigValid) {
      console.log('⚠️ Please configure your Firebase settings in .env file');
    }
  }, []);

  const testConnection = async () => {
    setConnectionTested(false);
    const result = await firebaseTest.testConnection();
    setConnectionTested(true);
    console.log('Connection test result:', result, 'Tested:', connectionTested);
  };

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Title title="Yoga Customer App" subtitle="Setup Complete!" />
          <Card.Content>
            <Text variant="bodyMedium" style={styles.welcomeText}>
              🎉 Section 1 - Project Setup & Configuration is complete!
            </Text>
            
            {firebaseStatus && (
              <>
                <Text variant="titleMedium" style={styles.statusTitle}>
                  Firebase Status:
                </Text>
                <Text style={styles.statusItem}>
                  Auth Service: {firebaseStatus.auth ? '✅' : '❌'}
                </Text>
                <Text style={styles.statusItem}>
                  Firestore Service: {firebaseStatus.firestore ? '✅' : '❌'}
                </Text>
                <Text style={styles.statusItem}>
                  Configuration: {firebaseStatus.config ? '✅' : '❌ (Needs .env setup)'}
                </Text>
              </>
            )}

            {!firebaseStatus?.config && (
              <Text variant="bodySmall" style={styles.note}>
                📝 To complete setup: Update your .env file with your Firebase configuration
              </Text>
            )}
            
            {firebaseStatus?.config && !firebaseStatus?.auth && (
              <Text variant="bodySmall" style={styles.note}>
                ⚠️ Firebase config found but connection failed. Check your API key and project settings.
              </Text>
            )}
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={testConnection}>
              Test Firebase Connection
            </Button>
          </Card.Actions>
        </Card>

        <StatusBar style="auto" />
      </View>
    </PaperProvider>
  );
}

// Theme colors
const colors = {
  background: '#f5f5f5',
  noteText: '#666',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 400,
  },
  welcomeText: {
    marginBottom: 16,
    textAlign: 'center',
  },
  statusTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  statusItem: {
    marginLeft: 8,
    marginBottom: 4,
  },
  note: {
    marginTop: 16,
    fontStyle: 'italic',
    color: colors.noteText,
  },
});
