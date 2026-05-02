import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from './db';

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
  static async login(email: string, password: string): Promise<AuthResponse | null> {
    try {
      const result = await query(
        'SELECT id, email, name, role, password FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const user = result.rows[0];

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return null;
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

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

  static async verifyToken(token: string): Promise<User | null> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;

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

  static async logout(token: string): Promise<boolean> {
    try {
      await query('DELETE FROM sessions WHERE token = $1', [token]);
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  }

  static async createUser(
    email: string,
    password: string,
    name: string,
    role: 'admin' | 'employee'
  ): Promise<User | null> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await query(
        'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role',
        [email, hashedPassword, name, role]
      );

      return result.rows[0];
    } catch (error: any) {
      if (error.code === '23505') {
        throw new Error('User with this email already exists');
      }
      console.error('Create user error:', error);
      throw error;
    }
  }

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
