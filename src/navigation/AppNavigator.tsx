import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthStack } from './AuthStack';
import { MainTabs } from './MainTabs';
import { useAuth } from '../hooks/useAuth';
import { View, ActivityIndicator } from 'react-native';
import { getColors } from '../constants/colors';

const RootStack = createStackNavigator();

const NavigationContent = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const colors = getColors('light'); // or use useColorScheme()

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <RootStack.Screen name="Main" component={MainTabs} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthStack} />
      )}
    </RootStack.Navigator>
  );
};

export const AppNavigator = () => {
  return <NavigationContent />;
}; 