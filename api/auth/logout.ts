import { VercelRequest, VercelResponse } from '@vercel/node';
import { AuthService } from '../_lib/auth.service';
import { withAuth, AuthRequest, cors } from '../_lib/middleware';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return withAuth(req as AuthRequest, res, async (authReq) => {
    try {
      const authHeader = authReq.headers['authorization'] as string;
      const token = authHeader && authHeader.split(' ')[1];

      if (token) {
        await AuthService.logout(token);
      }

      return res.json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
}
