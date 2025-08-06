import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Card } from '../../components/presentation';
import { Button } from '../../components/common';
import { NativeStackScreenProps } from '@react-navigation/native-stack';


// Define the type for navigation props
export type HomeScreenProps = NativeStackScreenProps<any, any>;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Home',
      headerTitleAlign: 'center',
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
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
              navigation.navigate('Courses');
            }}
            style={styles.button}
          />
        </Card>

        <Card title="Quick Actions">
          <View style={styles.quickActions}>
            <Button
              title="Profile"
              onPress={() => {
                navigation.navigate('Profile');
              }}
              variant="outline"
              style={styles.actionButton}
            />
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fefefe',
  },
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
  },
  header: {
    padding: 20,
    backgroundColor: '#fefefe',
    marginBottom: 16,
  },
  title: {  
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4a7c59',
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