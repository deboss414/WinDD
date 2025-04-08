import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/user';
import { API_CONFIG } from '../config/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface AuthResponse {
  data: {
    user?: User;
    token?: string;
    success?: boolean;
    error?: string;
  };
  status?: number;
}

interface UserResponse {
  success: boolean;
  data: {
    user: User;
  };
}

interface UsersResponse {
  success: boolean;
  data: {
    users: User[];
  };
}

class UserService {
  private static instance: UserService;
  private token: string | null = null;

  private constructor() {
    this.initializeToken();
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  private async initializeToken() {
    try {
      this.token = await AsyncStorage.getItem('userToken');
      if (this.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
      }
    } catch (error) {
      console.error('Error initializing token:', error);
    }
  }

  private async setToken(token: string | null) {
    this.token = token;
    if (token) {
      await AsyncStorage.setItem('userToken', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      await AsyncStorage.removeItem('userToken');
      delete axios.defaults.headers.common['Authorization'];
    }
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.message;
      return new Error(message);
    }
    return error instanceof Error ? error : new Error('An unexpected error occurred');
  }

  // Authentication Methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      if (API_CONFIG.useMock) {
        const mockService = API_CONFIG.getService();
        if (mockService) {
          const response = await mockService.login(credentials.email, credentials.password);
          if (response.status === 401) {
            throw {
              response: {
                status: 401,
                data: response.data
              }
            };
          }
          if (response.data?.token) {
            await this.setToken(response.data.token);
          }
          return response;
        }
      }

      const apiUrl = `${API_CONFIG.getApiUrl()}/users/login`;
      const response = await axios.post(
        apiUrl,
        {
          email: credentials.email,
          password: credentials.password
        },
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      if (response.data?.data?.token) {
        await this.setToken(response.data.data.token);
      }
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      if (API_CONFIG.useMock) {
        const mockService = API_CONFIG.getService();
        if (mockService) {
          const response = await mockService.register(data);
          if (response.data?.token) {
            await this.setToken(response.data.token);
          }
          return response;
        }
      }

      const response = await axios.post(
        `${API_CONFIG.getApiUrl()}/users/register`,
        {
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: ''
        }
      );
      await this.setToken(response.data.data.token);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      if (API_CONFIG.useMock) {
        const mockService = API_CONFIG.getService();
        if (mockService) {
          await mockService.logout();
          await this.setToken(null);
          return;
        }
      }

      await axios.post(`${API_CONFIG.getApiUrl()}/users/logout`);
      await this.setToken(null);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCurrentUser(): Promise<AuthResponse> {
    try {
      if (API_CONFIG.useMock) {
        const mockService = API_CONFIG.getService();
        if (mockService) {
          return await mockService.getCurrentUser();
        }
      }

      const response = await axios.get(`${API_CONFIG.getApiUrl()}/users/me`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Remove or comment out other methods that don't exist in backend yet
  // async getUser(userId: string): Promise<User> { ... }
  // async getUsers(): Promise<User[]> { ... }
  // async updateProfile(data: Partial<User>): Promise<User> { ... }
  // async resetPassword(email: string): Promise<void> { ... }
  // async updatePassword(currentPassword: string, newPassword: string): Promise<void> { ... }
  // async deleteAccount(password: string): Promise<void> { ... }
}

export default UserService; 