import { Router } from 'express';
import { AuthService } from '../services/auth.service';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

/**
 * POST /api/auth/login
 * Login with email and password
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await AuthService.login(email, password);

    if (!result) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json(result);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/logout
 * Logout and invalidate token
 */
router.post('/logout', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      await AuthService.logout(token);
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/auth/me
 * Get current user info
 */
router.get('/me', authenticateToken, (req: AuthRequest, res) => {
  res.json({ user: req.user });
});

/**
 * POST /api/auth/users
 * Create a new user (admin only)
 */
router.post('/users', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (role !== 'admin' && role !== 'employee') {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await AuthService.createUser(email, password, name, role);
    res.status(201).json({ user });
  } catch (error: any) {
    console.error('Create user error:', error);
    if (error.message === 'User with this email already exists') {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/auth/users
 * Get all users (accessible to all authenticated users for task assignment)
 */
router.get('/users', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const users = await AuthService.getAllUsers();
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/auth/users/:id
 * Delete a user (admin only)
 */
router.delete('/users/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (id === req.user?.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const success = await AuthService.deleteUser(id);
    if (success) {
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
