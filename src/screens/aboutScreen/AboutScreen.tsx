import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Card } from '../../components/presentation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type AboutScreenProps = NativeStackScreenProps<any, any>;

const AboutScreen: React.FC<AboutScreenProps> = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'About',
      headerTitleAlign: 'center',
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>About Our Studio</Text>
        </View>

        <Card title="Our Mission">
          <Text style={styles.description}>
            We are dedicated to providing a welcoming and inclusive environment where 
            everyone can explore the transformative power of yoga. Our experienced 
            instructors guide students of all levels through mindful practice, helping 
            them discover strength, flexibility, and inner peace.
          </Text>
        </Card>

        <Card title="What We Offer">
          <Text style={styles.description}>
            • Various yoga styles for all levels{'\n'}
            • Experienced certified instructors{'\n'}
            • Flexible class schedules{'\n'}
            • Modern, clean facilities{'\n'}
            • Community-focused environment
          </Text>
        </Card>

        <Card title="Contact Information">
          <Text style={styles.description}>
            📍 123 Yoga Street, Wellness City{'\n'}
            📞 (555) 123-4567{'\n'}
            📧 info@yogastudio.com{'\n'}
            🌐 www.yogastudio.com
          </Text>
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
    textAlign: 'left',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default AboutScreen; 