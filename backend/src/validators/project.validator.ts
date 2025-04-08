import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.string().datetime(),
  priority: z.enum(['Low', 'Medium', 'High']),
  participants: z.array(z.string()).optional()
}); 