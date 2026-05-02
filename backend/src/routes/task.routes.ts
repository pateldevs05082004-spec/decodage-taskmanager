import { Router } from 'express';
import { TaskService } from '../services/task.service';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

/**
 * GET /api/tasks
 * Get all tasks (admin) or user's tasks (employee - both assigned to them and created by them)
 */
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = req.user!;

    let tasks;
    if (user.role === 'admin') {
      // Admin sees all tasks
      tasks = await TaskService.getAllTasks();
    } else {
      // Employee sees tasks assigned to them OR created by them
      tasks = await TaskService.getTasksByUserOrCreator(user.id);
    }

    res.json({ tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/tasks/stats
 * Get task statistics
 */
router.get('/stats', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = req.user!;

    let stats;
    if (user.role === 'admin') {
      // Admin sees all stats
      stats = await TaskService.getTaskStats();
    } else {
      // Employee sees only their stats
      stats = await TaskService.getTaskStats(user.id);
    }

    res.json(stats);
  } catch (error) {
    console.error('Get task stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/tasks/:id
 * Get a single task
 */
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const user = req.user!;

    const task = await TaskService.getTaskById(id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Employees can only see their own tasks
    if (user.role !== 'admin' && task.assigned_to !== user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/tasks
 * Create a new task
 * - Employees: Can assign to themselves or others (like admins for verification)
 * - Admins: Can assign to anyone
 */
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { description, start_time, deadline, assigned_to } = req.body;
    const user = req.user!;

    if (!description || !start_time || !deadline) {
      return res.status(400).json({ error: 'Description, start time, and deadline are required' });
    }

    const task = await TaskService.createTask({
      description,
      start_time: new Date(start_time),
      deadline: new Date(deadline),
      // If no assigned_to specified, assign to creator
      assigned_to: assigned_to || user.id,
      created_by: user.id,
    });

    res.status(201).json({ task });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/tasks/:id
 * Update a task
 * - Employees: Can update tasks they created OR only status on tasks assigned to them
 * - Admins: Can update everything
 */
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { description, start_time, deadline, assigned_to, status } = req.body;
    const user = req.user!;

    const existingTask = await TaskService.getTaskById(id);

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Employees can fully edit tasks they created
    if (user.role === 'employee' && existingTask.created_by === user.id) {
      const updateData: any = {};
      if (description !== undefined) updateData.description = description;
      if (start_time !== undefined) updateData.start_time = start_time ? new Date(start_time) : null;
      if (deadline !== undefined) updateData.deadline = deadline ? new Date(deadline) : null;
      if (assigned_to !== undefined) updateData.assigned_to = assigned_to;
      if (status !== undefined) updateData.status = status;

      const task = await TaskService.updateTask(id, updateData);
      return res.json({ task });
    }

    // Employees can only update status on tasks assigned to them (but not created by them)
    if (user.role === 'employee' && existingTask.assigned_to === user.id) {
      if (description || start_time || deadline || assigned_to !== undefined) {
        return res.status(403).json({ error: 'You can only update task status' });
      }
      
      const updateData: any = {};
      if (status !== undefined) updateData.status = status;

      const task = await TaskService.updateTask(id, updateData);
      return res.json({ task });
    }

    // Admins can update everything
    if (user.role === 'admin') {
      const updateData: any = {};
      if (description !== undefined) updateData.description = description;
      if (start_time !== undefined) updateData.start_time = start_time ? new Date(start_time) : null;
      if (deadline !== undefined) updateData.deadline = deadline ? new Date(deadline) : null;
      if (assigned_to !== undefined) updateData.assigned_to = assigned_to;
      if (status !== undefined) updateData.status = status;

      const task = await TaskService.updateTask(id, updateData);
      return res.json({ task });
    }

    res.status(403).json({ error: 'Access denied' });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/tasks/:id
 * Delete a task
 * - Admins: Can delete any task
 * - Employees: Can delete tasks they created
 */
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const user = req.user!;

    const existingTask = await TaskService.getTaskById(id);

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Employees can only delete tasks they created
    if (user.role === 'employee' && existingTask.created_by !== user.id) {
      return res.status(403).json({ error: 'You can only delete tasks you created' });
    }

    const success = await TaskService.deleteTask(id);

    if (success) {
      res.json({ message: 'Task deleted successfully' });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
