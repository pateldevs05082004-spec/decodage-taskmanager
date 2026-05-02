import { VercelRequest, VercelResponse } from '@vercel/node';
import { TaskService } from '../_lib/task.service';
import { withAuth, AuthRequest, cors } from '../_lib/middleware';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return withAuth(req as AuthRequest, res, async (authReq) => {
    try {
      const { id } = authReq.query;
      const user = authReq.user!;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid task ID' });
      }

      // GET /api/tasks/:id - Get single task
      if (req.method === 'GET') {
        const task = await TaskService.getTaskById(id);

        if (!task) {
          return res.status(404).json({ error: 'Task not found' });
        }

        if (user.role !== 'admin' && task.assigned_to !== user.id) {
          return res.status(403).json({ error: 'Access denied' });
        }

        return res.json({ task });
      }

      // PUT /api/tasks/:id - Update task
      if (req.method === 'PUT') {
        const { description, start_time, deadline, assigned_to, status } = req.body;

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

        // Employees can only update status on tasks assigned to them
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

        return res.status(403).json({ error: 'Access denied' });
      }

      // DELETE /api/tasks/:id - Delete task
      if (req.method === 'DELETE') {
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
          return res.json({ message: 'Task deleted successfully' });
        } else {
          return res.status(404).json({ error: 'Task not found' });
        }
      }

      return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
      console.error('Task operation error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
}
