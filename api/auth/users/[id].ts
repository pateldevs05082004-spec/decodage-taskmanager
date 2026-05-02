import { VercelRequest, VercelResponse } from '@vercel/node';
import { AuthService } from '../../_lib/auth.service';
import { withAdmin, AuthRequest, cors } from '../../_lib/middleware';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return withAdmin(req as AuthRequest, res, async (authReq) => {
    try {
      const { id } = authReq.query;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid user ID' });
      }

      // Prevent admin from deleting themselves
      if (id === authReq.user?.id) {
        return res.status(400).json({ error: 'Cannot delete your own account' });
      }

      const success = await AuthService.deleteUser(id);
      if (success) {
        return res.json({ message: 'User deleted successfully' });
      } else {
        return res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Delete user error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
}
