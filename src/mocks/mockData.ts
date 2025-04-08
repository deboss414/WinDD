import { Task, TaskStatus, TaskPriority } from '../types/task';
import { User } from '../types/user';

export const MOCK_TOKEN = 'mock-token-123';

export const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: undefined,
  createdAt: new Date().toISOString(),
  lastUpdated: new Date().toISOString(),
};

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project documentation',
    description: 'Write comprehensive documentation for the project',
    status: 'In Progress' as TaskStatus,
    priority: 'high' as TaskPriority,
    dueDate: '2024-03-20',
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    createdBy: 'User1',
    participants: [
      { email: 'user1@example.com', displayName: 'User 1' },
      { email: 'user2@example.com', displayName: 'User 2' },
    ],
    subtasks: [],
  },
  {
    id: '2',
    title: 'Fix UI bugs',
    description: 'Address reported UI issues in the dashboard',
    status: 'In Progress' as TaskStatus,
    priority: 'medium' as TaskPriority,
    dueDate: '2024-03-22',
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    createdBy: 'User2',
    participants: [
      { email: 'user1@example.com', displayName: 'User 1' },
    ],
    subtasks: [],
  },
  {
    id: '3',
    title: 'Add new features',
    description: 'Implement new features as per requirements',
    status: 'pending' as TaskStatus,
    priority: 'low' as TaskPriority,
    dueDate: '2024-03-25',
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    createdBy: 'User1',
    participants: [
      { email: 'user1@example.com', displayName: 'User 1' },
      { email: 'user2@example.com', displayName: 'User 2' },
    ],
    subtasks: [],
  },
];

export const mockProjects = [
  {
    id: '1',
    name: 'Project Alpha',
    description: 'Main project for Q1',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
  },
  {
    id: '2',
    name: 'Project Beta',
    description: 'Secondary project for Q1',
    status: 'active',
    startDate: '2024-02-01',
    endDate: '2024-04-30',
  },
]; 