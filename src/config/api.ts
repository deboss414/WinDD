import { MockService } from '../services/MockService';

// API Configuration
export const API_CONFIG = {
  // Development API URL (update this with your local backend URL)
  DEV_API_URL: 'http://10.43.90.116:3000/api', // Using your computer's IP address
  // DEV_API_URL: 'http://10.0.2.2:3000/api', // For Android Emulator
  // DEV_API_URL: 'http://localhost:3000/api', // For iOS Simulator
  
  // Production API URL (update this with your production backend URL)
  PROD_API_URL: 'https://your-production-api.com/api',
  
  // Current environment
  ENV: process.env.NODE_ENV || 'development',
  
  // Get the current API URL based on environment
  getApiUrl: () => {
    return API_CONFIG.ENV === 'production' 
      ? API_CONFIG.PROD_API_URL 
      : API_CONFIG.DEV_API_URL;
  },
  
  // API Headers
  getHeaders: (token?: string) => ({
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }),

  // Use mock service in development
  useMock: true,
  
  // Get the appropriate service based on environment
  getService: () => {
    return API_CONFIG.useMock ? MockService : null;
  },
}; 