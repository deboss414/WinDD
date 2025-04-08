import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import UserService from '../services/UserService';

export const TestConnection = () => {
  const [status, setStatus] = useState<string>('Testing connection...');
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    try {
      const userService = UserService.getInstance();
      
      // Test login
      const loginResult = await userService.login({
        email: 'test@example.com',
        password: 'password123'
      });
      
      // Test getting current user
      const user = await userService.getCurrentUser();
      
      setStatus('Connection successful!');
      console.log('User data:', user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStatus('Connection failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.status}>{status}</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <Button title="Test Connection" onPress={testConnection} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  status: {
    fontSize: 16,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
}); 