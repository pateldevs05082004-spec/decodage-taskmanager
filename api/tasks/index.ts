import { VercelRequest, VercelResponse } from '@vercel/node';
import { TaskService } from '../_lib/task.service';
import { withAuth, AuthRequest, cors } from '../_lib/middleware';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET /api/tasks - Get all tasks
  if (req.method === 'GET') {
    return withAuth(req as AuthRequest, res, async (authReq) => {
      try {
        const user = authReq.user!;

        let tasks;
        if (user.role === 'admin') {
          tasks = await TaskService.getAllTasks();
        } else {
          tasks = await TaskService.getTasksByUserOrCreator(user.id);
        }

        return res.json({ tasks });
      } catch (error) {
        console.error('Get tasks error:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    });
  }

  // POST /api/tasks - Create task
  if (req.method === 'POST') {
    return withAuth(req as AuthRequest, res, async (authReq) => {
      try {
        const { description, start_time, deadline, assigned_to } = req.body;
        const user = authReq.user!;

        if (!description || !start_time || !deadline) {
          return res.status(400).json({ error: 'Description, start time, and deadline are required' });
        }

        const task = await TaskService.createTask({
          description,
          start_time: new Date(start_time),
          deadline: new Date(deadline),
          assigned_to: assigned_to || user.id,
          created_by: user.id,
        });

        return res.status(201).json({ task });
      } catch (error) {
        console.error('Create task error:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
