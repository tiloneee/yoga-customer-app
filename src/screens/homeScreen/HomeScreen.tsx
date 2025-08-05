import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from '../../components/presentation';
import { Button } from '../../components/common';

const HomeScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Yoga Studio</Text>
        <Text style={styles.subtitle}>Find your perfect class</Text>
      </View>

      <Card title="Featured Classes">
        <Text style={styles.description}>
          Discover our most popular yoga classes and start your wellness journey today.
        </Text>
        <Button
          title="Browse Classes"
          onPress={() => {
            // Navigate to classes screen
          }}
          style={styles.button}
        />
      </Card>

      <Card title="Quick Actions">
        <View style={styles.quickActions}>
          <Button
            title="My Bookings"
            onPress={() => {
              // Navigate to bookings screen
            }}
            variant="outline"
            style={styles.actionButton}
          />
          <Button
            title="Profile"
            onPress={() => {
              // Navigate to profile screen
            }}
            variant="outline"
            style={styles.actionButton}
          />
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default HomeScreen; 