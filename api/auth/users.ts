import { VercelRequest, VercelResponse } from '@vercel/node';
import { AuthService } from '../_lib/auth.service';
import { withAuth, withAdmin, AuthRequest, cors } from '../_lib/middleware';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET /api/auth/users - Get all users (authenticated users)
  if (req.method === 'GET') {
    return withAuth(req as AuthRequest, res, async () => {
      try {
        const users = await AuthService.getAllUsers();
        return res.json({ users });
      } catch (error) {
        console.error('Get users error:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    });
  }

  // POST /api/auth/users - Create user (admin only)
  if (req.method === 'POST') {
    return withAdmin(req as AuthRequest, res, async () => {
      try {
        const { email, password, name, role } = req.body;

        if (!email || !password || !name || !role) {
          return res.status(400).json({ error: 'All fields are required' });
        }

        if (role !== 'admin' && role !== 'employee') {
          return res.status(400).json({ error: 'Invalid role' });
        }

        const user = await AuthService.createUser(email, password, name, role);
        return res.status(201).json({ user });
      } catch (error: any) {
        console.error('Create user error:', error);
        if (error.message === 'User with this email already exists') {
          return res.status(409).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Internal server error' });
      }
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
