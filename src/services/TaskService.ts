import axios from 'axios';
import { API_CONFIG } from '../config/api';
import { Task, SubTask, TaskPriority, TaskStatus } from '../types/task'; // Assuming types are defined here

interface TasksResponse {
  tasks: Task[];
}

interface TaskResponse {
  task: Task;
}

class TaskService {
  private static instance: TaskService;

  private constructor() {}

  public static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.message;
      return new Error(message);
    }
    return error instanceof Error ? error : new Error('An unexpected error occurred');
  }

  // --- Task Methods ---

  async getTasks(): Promise<TasksResponse> {
    try {
      if (API_CONFIG.useMock) {
        const mockService = API_CONFIG.getService();
        if (mockService) {
          // Assuming MockService.getTasks() returns { data: Task[] }
          const response = await mockService.getTasks();
          return { tasks: response.data };
        }
      }
      // TODO: Implement real API call
      // const response = await axios.get(`${API_CONFIG.getApiUrl()}/tasks`);
      // return response.data;
      throw new Error("Real API call not implemented for getTasks");
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTask(taskId: string): Promise<TaskResponse> {
    try {
       if (API_CONFIG.useMock) {
         const mockService = API_CONFIG.getService();
         if (mockService && mockService.getTasks) { // Assuming getTasks exists and returns { data: Task[] }
           const { data: tasks } = await mockService.getTasks();
           const task = tasks.find(t => t.id === taskId);
           if (!task) throw new Error('Mock task not found');
           return { task };
         }
       }
       // TODO: Implement real API call
       // const response = await axios.get(`${API_CONFIG.getApiUrl()}/tasks/${taskId}`);
       // return response.data;
       throw new Error(`Real API call not implemented for getTask(${taskId})`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'lastUpdated' | 'subtasks' | 'participants'>): Promise<TaskResponse> {
    try {
      if (API_CONFIG.useMock) {
        const mockService = API_CONFIG.getService();
        if (mockService && mockService.createTask) {
          // Assuming MockService.createTask handles creation and returns { data: Task }
           const response = await mockService.createTask(taskData);
           return { task: response.data };
        }
      }
      // TODO: Implement real API call
      // const response = await axios.post(`${API_CONFIG.getApiUrl()}/tasks`, taskData);
      // return response.data;
      throw new Error("Real API call not implemented for createTask");
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<TaskResponse> {
     try {
       if (API_CONFIG.useMock) {
         const mockService = API_CONFIG.getService();
         if (mockService && mockService.updateTask) {
           // Assuming MockService.updateTask handles update and returns { data: Task }
            const response = await mockService.updateTask(taskId, updates);
            return { task: response.data };
         }
       }
       // TODO: Implement real API call
       // const response = await axios.put(`${API_CONFIG.getApiUrl()}/tasks/${taskId}`, updates);
       // return response.data;
       throw new Error(`Real API call not implemented for updateTask(${taskId})`);
     } catch (error) {
       throw this.handleError(error);
     }
  }

   async deleteTask(taskId: string): Promise<{ message: string }> {
     try {
       if (API_CONFIG.useMock) {
         const mockService = API_CONFIG.getService();
         if (mockService && mockService.deleteTask) {
           // Assuming MockService.deleteTask returns { data: { message: string } }
           const response = await mockService.deleteTask(taskId);
           return response.data;
         }
       }
       // TODO: Implement real API call
       // await axios.delete(`${API_CONFIG.getApiUrl()}/tasks/${taskId}`);
       // return { message: 'Task deleted successfully' };
        throw new Error(`Real API call not implemented for deleteTask(${taskId})`);
     } catch (error) {
       throw this.handleError(error);
     }
   }

  // --- Subtask Methods (Requires adding to MockService and mockData) ---
  // async addSubtask(...) { ... }
  // async updateSubtask(...) { ... }
  // async deleteSubtask(...) { ... }
  // async updateSubtaskProgress(...) { ... }

  // --- Comment Methods (Requires adding to MockService and mockData) ---
  // async addComment(...) { ... }
  // async editComment(...) { ... }
  // async deleteComment(...) { ... }
}

export default TaskService; 