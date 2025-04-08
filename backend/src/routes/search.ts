import express from 'express';
import { auth } from '../middleware/auth';
import Project from '../models/Project';
import Task from '../models/Task';

const router = express.Router();

router.get('/projects', auth, async (req, res) => {
  try {
    const { query, status, priority, startDate, endDate } = req.query;
    
    const filter: any = {
      $or: [
        { owner: req.user.userId },
        { participants: req.user.userId }
      ]
    };

    if (query) {
      filter.$or.push(
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      );
    }

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (startDate || endDate) {
      filter.dueDate = {};
      if (startDate) filter.dueDate.$gte = new Date(startDate as string);
      if (endDate) filter.dueDate.$lte = new Date(endDate as string);
    }

    const projects = await Project.find(filter)
      .populate('participants', 'name avatar');

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 