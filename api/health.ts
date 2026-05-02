import { VercelRequest, VercelResponse } from '@vercel/node';
import { cors } from './_lib/middleware';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.json({ status: 'ok', message: 'Decode Age Task Manager API' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
