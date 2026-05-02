import { VercelRequest, VercelResponse } from '@vercel/node';
import { TaskService } from '../_lib/task.service';
import { withAuth, AuthRequest, cors } from '../_lib/middleware';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return withAuth(req as AuthRequest, res, async (authReq) => {
    try {
      const user = authReq.user!;

      let stats;
      if (user.role === 'admin') {
        stats = await TaskService.getTaskStats();
      } else {
        stats = await TaskService.getTaskStats(user.id);
      }

      return res.json(stats);
    } catch (error) {
      console.error('Get task stats error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
}
