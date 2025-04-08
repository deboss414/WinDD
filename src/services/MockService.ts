import { mockUser, mockTasks, mockProjects, MOCK_TOKEN } from '../mocks/mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Safe AsyncStorage operations
const safeAsyncStorage = {
  setItem: async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.warn('AsyncStorage setItem failed:', error);
    }
  },
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.warn('AsyncStorage removeItem failed:', error);
    }
  }
};

export const MockService = {
  login: async (email: string, password: string) => {
    await delay(500);
    if (email === mockUser.email && password === 'password') {
      await safeAsyncStorage.setItem('userToken', MOCK_TOKEN);
      return {
        data: {
          user: mockUser,
          token: MOCK_TOKEN,
        },
      };
    }
    return {
      data: {
        success: false,
        error: 'Invalid credentials',
      },
      status: 401,
    };
  },

  register: async (userData: any) => {
    await delay(500);
    await safeAsyncStorage.setItem('userToken', MOCK_TOKEN);
    return {
      data: {
        user: { ...mockUser, ...userData },
        token: MOCK_TOKEN,
      },
    };
  },

  logout: async () => {
    await delay(300);
    await safeAsyncStorage.removeItem('userToken');
    return { data: { message: 'Logged out successfully' } };
  },

  getCurrentUser: async () => {
    await delay(300);
    return {
      data: {
        user: mockUser,
        token: MOCK_TOKEN,
      },
    };
  },

  getTasks: async () => {
    await delay(500);
    return { data: mockTasks };
  },

  getProjects: async () => {
    await delay(500);
    return { data: mockProjects };
  },

  createTask: async (taskData: any) => {
    await delay(500);
    const newTask = {
      id: String(mockTasks.length + 1),
      ...taskData,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      participants: [],
      subtasks: [],
    };
    return { data: newTask };
  },

  updateTask: async (taskId: string, taskData: any) => {
    await delay(500);
    const task = mockTasks.find(t => t.id === taskId);
    if (!task) throw new Error('Task not found');
    return { data: { ...task, ...taskData, lastUpdated: new Date().toISOString() } };
  },

  deleteTask: async (taskId: string) => {
    await delay(500);
    return { data: { message: 'Task deleted successfully' } };
  },
}; 