import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../db/index';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'employee';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export class AuthService {
  /**
   * Authenticate user with email and password
   */
  static async login(email: string, password: string): Promise<AuthResponse | null> {
    try {
      // Find user by email
      const result = await query(
        'SELECT id, email, name, role, password FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const user = result.rows[0];

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return null;
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // Store session in database
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

      await query(
        'INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3)',
        [user.id, token, expiresAt]
      );

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Verify JWT token and return user
   */
  static async verifyToken(token: string): Promise<User | null> {
    try {
      // Verify JWT
      const decoded = jwt.verify(token, JWT_SECRET) as any;

      // Check if session exists and is not expired
      const result = await query(
        'SELECT s.*, u.id, u.email, u.name, u.role FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.token = $1 AND s.expires_at > NOW()',
        [token]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const session = result.rows[0];
      return {
        id: session.id,
        email: session.email,
        name: session.name,
        role: session.role,
      };
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  }

  /**
   * Logout user by removing session
   */
  static async logout(token: string): Promise<boolean> {
    try {
      await query('DELETE FROM sessions WHERE token = $1', [token]);
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  }

  /**
   * Create a new user (admin only)
   */
  static async createUser(
    email: string,
    password: string,
    name: string,
    role: 'admin' | 'employee'
  ): Promise<User | null> {
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      const result = await query(
        'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role',
        [email, hashedPassword, name, role]
      );

      return result.rows[0];
    } catch (error: any) {
      if (error.code === '23505') {
        // Unique constraint violation
        throw new Error('User with this email already exists');
      }
      console.error('Create user error:', error);
      throw error;
    }
  }

  /**
   * Get all users (admin only)
   */
  static async getAllUsers(): Promise<User[]> {
    try {
      const result = await query(
        'SELECT id, email, name, role FROM users ORDER BY created_at DESC'
      );
      return result.rows;
    } catch (error) {
      console.error('Get all users error:', error);
      throw error;
    }
  }

  /**
   * Delete user (admin only)
   */
  static async deleteUser(userId: string): Promise<boolean> {
    try {
      await query('DELETE FROM users WHERE id = $1', [userId]);
      return true;
    } catch (error) {
      console.error('Delete user error:', error);
      return false;
    }
  }
}
