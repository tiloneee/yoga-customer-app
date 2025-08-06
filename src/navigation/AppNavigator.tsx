import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { LoginScreen, RegisterScreen, ForgotPasswordScreen } from '../screens/authScreen';
import HomeScreen from '../screens/homeScreen/HomeScreen';
import ProfileScreen from '../screens/profileScreen/ProfileScreen';
import AboutScreen from '../screens/aboutScreen/AboutScreen';
import CourseListScreen from '../screens/courseScreen/CourseListScreen';
import CourseDetailScreen from '../screens/courseScreen/CourseDetailScreen';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

// Navigation type definitions
export type RootStackParamList = {
  MainTabs: { screen?: string } | undefined;
  CourseDetail: { courseId: string };
  CourseList: undefined;
  Home: undefined;
};

const AuthStack = createNativeStackNavigator();
const MainTab = createBottomTabNavigator();
const MainStack = createNativeStackNavigator();

function AuthStackNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
}

function MainTabNavigator() {
  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap = 'home';
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Courses') iconName = 'yoga';
          else if (route.name === 'Profile') iconName = 'account';
          else if (route.name === 'About') iconName = 'information';
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4a7c59',
        tabBarInactiveTintColor: '#999',
        tabBarShowLabel: true,
        tabBarStyle: { 
          height: 80,
          backgroundColor: '#fefefe',
          borderTopColor: '#e0e0e0',
          borderTopWidth: 1,
          // Safe area handling
          paddingBottom: 2,
          paddingVertical: 10,
        },
        tabBarHideOnKeyboard: true,
        tabBarActiveBackgroundColor: 'rgba(74, 124, 89, 0.1)',
        // Safe area insets
        tabBarSafeAreaInsets: {
          bottom: 0,
          top: 0,
          left: 0,
          right: 0,
        },
      })}
    >
      <MainTab.Screen name="Home" component={HomeScreen} />
      <MainTab.Screen name="Courses" component={CourseListScreen} />
      <MainTab.Screen name="Profile" component={ProfileScreen} />
      <MainTab.Screen name="About" component={AboutScreen} />
    </MainTab.Navigator>
  );
}

function MainStackNavigator() {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="MainTabs" component={MainTabNavigator} />
      <MainStack.Screen name="CourseDetail" component={CourseDetailScreen} />
    </MainStack.Navigator>
  );
}

export const AppNavigator: React.FC = () => {
  const { user } = useAuth();
  const colorScheme = useColorScheme();

  return (
    <NavigationContainer
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      {user ? <MainStackNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
};