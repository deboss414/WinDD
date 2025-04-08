import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import UserService from '../services/UserService';
import axios from 'axios';

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const handleLogin = async (email: string, password: string) => {
    try {
      const userService = UserService.getInstance();
      const response = await userService.login({
        email,
        password
      });
      context.setUser(response.data.user ?? null);
      context.setToken(response.data.token ?? null);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Preserve the axios error response
        throw error;
      } else {
        // For non-axios errors, wrap them in a similar format
        throw {
          response: {
            status: 500,
            data: {
              success: false,
              error: error instanceof Error ? error.message : 'An unexpected error occurred'
            }
          }
        };
      }
    }
  };

  const handleSignup = async (
    email: string,
    firstName: string,
    lastName: string,
    password: string
  ) => {
    try {
      const userService = UserService.getInstance();
      const response = await userService.register({ 
        email, 
        password, 
        firstName, 
        lastName 
      });
      context.setUser(response.data.user ?? null);
      context.setToken(response.data.token ?? null);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Preserve the axios error response
        throw error;
      } else {
        // For non-axios errors, wrap them in a similar format
        throw {
          response: {
            status: 500,
            data: {
              success: false,
              error: error instanceof Error ? error.message : 'An unexpected error occurred'
            }
          }
        };
      }
    }
  };

  return {
    user: context.user,
    token: context.token,
    isAuthenticated: !!context.user,
    isLoading: context.isLoading,
    login: handleLogin,
    signup: handleSignup,
    logout: context.logout,
  };
}; 