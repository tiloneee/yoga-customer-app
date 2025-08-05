import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from '../../components/presentation';

const AboutScreen: React.FC = () => {
  return (
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
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default AboutScreen; 