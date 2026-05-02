import { VercelRequest, VercelResponse } from '@vercel/node';
import { AuthService, User } from './auth.service';

export interface AuthRequest extends VercelRequest {
  user?: User;
}

export async function withAuth(
  req: AuthRequest,
  res: VercelResponse,
  handler: (req: AuthRequest, res: VercelResponse) => Promise<void>
) {
  try {
    const authHeader = req.headers['authorization'] as string;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const user = await AuthService.verifyToken(token);

    if (!user) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    req.user = user;
    return handler(req, res);
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(403).json({ error: 'Invalid token' });
  }
}

export async function withAdmin(
  req: AuthRequest,
  res: VercelResponse,
  handler: (req: AuthRequest, res: VercelResponse) => Promise<void>
) {
  return withAuth(req, res, async (authReq, authRes) => {
    if (authReq.user?.role !== 'admin') {
      return authRes.status(403).json({ error: 'Admin access required' });
    }
    return handler(authReq, authRes);
  });
}

export function cors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
}
