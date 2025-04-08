export type TaskStatus = 'completed' | 'expired' | 'closed' | 'In Progress';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string[];
  createdBy: string;
  projectId: string;
  subtasks?: SubTask[];
  comments?: Comment[];
}

export interface Comment {
  id: string;
  text: string;
  createdAt: string;
  authorId: string;
  authorName: string; // Or use a User object
  isEdited: boolean;
  parentCommentId?: string;
  replies?: Comment[];
  subtaskId: string; // Link back to subtask
  updatedAt?: string;
}

export interface SubTask {
  id: string;
  title: string;
  description?: string;
  assignee?: string[]; // Made optional as per TaskFormScreen usage
  progress: number;
  dueDate?: string; // Made optional as per TaskFormScreen usage
  createdBy: string;
  createdAt: string;
  lastUpdated: string;
  comments?: Comment[]; // Use specific Comment type
}

export interface Participant {
  email: string;
  displayName: string;
}

export type TaskPriority = 'low' | 'medium' | 'high'; 