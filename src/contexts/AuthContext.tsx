import React, { createContext, useState, useCallback, useEffect } from 'react';
import { User } from '../types/user';
import UserService from '../services/UserService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface AuthContextType {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const verifyToken = useCallback(async () => {
    try {
      const storedToken = await AsyncStorage.getItem('userToken');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }
      
      // Get the UserService instance
      const userService = UserService.getInstance();
      
      // Set token immediately
      // We need to ensure the token is set for the subsequent API call
      // Directly calling setToken might not update immediately for the next line
      // So, manually set the header for this call
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      
      // Fetch user data using the stored token
      const response = await userService.getCurrentUser();
      
      // Update state with token and user
      setToken(storedToken);
      setUser(response.data.user ?? null); // Use null if user is undefined

    } catch (error) {
      console.error('Error verifying token or fetching user:', error);
      setUser(null);
      setToken(null);
      try {
        await AsyncStorage.removeItem('userToken');
        delete axios.defaults.headers.common['Authorization']; // Also clear header on error
      } catch (e) {
        console.error('Error removing token:', e);
      }
    } finally {
        // Always ensure loading is set to false
        setIsLoading(false); 
    }
  }, []);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  const logout = useCallback(async () => {
    try {
      const userService = UserService.getInstance();
      await userService.logout();
      setUser(null);
      setToken(null);
      try {
        await AsyncStorage.removeItem('userToken');
      } catch (e) {
        console.error('Error removing token:', e);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        setUser,
        setToken,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 