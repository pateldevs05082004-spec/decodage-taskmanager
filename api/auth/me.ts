import { VercelRequest, VercelResponse } from '@vercel/node';
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
    return res.json({ user: authReq.user });
  });
}
