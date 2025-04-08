import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.string().datetime("Invalid date format"),
  project: z.string().min(1, "Project ID is required"),
  priority: z.enum(['Low', 'Medium', 'High']),
  status: z.enum(['in-progress', 'completed', 'expired']).optional(),
  assignedTo: z.array(z.string()).optional()
}); 