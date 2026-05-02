import { query } from './db';

export interface Task {
  id: string;
  description: string;
  start_time: Date | null;
  deadline: Date | null;
  assigned_to: string | null;
  assigned_to_name?: string;
  assigned_to_email?: string;
  created_by: string;
  created_by_name?: string;
  status: 'incomplete' | 'complete';
  completed_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTaskInput {
  description: string;
  start_time?: Date | null;
  deadline?: Date | null;
  assigned_to: string | null;
  created_by: string;
}

export interface UpdateTaskInput {
  description?: string;
  start_time?: Date | null;
  deadline?: Date | null;
  assigned_to?: string | null;
  status?: 'incomplete' | 'complete';
}

export class TaskService {
  static async createTask(input: CreateTaskInput): Promise<Task> {
    try {
      const result = await query(
        `INSERT INTO tasks (description, start_time, deadline, assigned_to, created_by, status)
         VALUES ($1, $2, $3, $4, $5, 'incomplete')
         RETURNING *`,
        [input.description, input.start_time || null, input.deadline || null, input.assigned_to, input.created_by]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Create task error:', error);
      throw error;
    }
  }

  static async getAllTasks(): Promise<Task[]> {
    try {
      const result = await query(
        `SELECT 
          t.*,
          u1.name as assigned_to_name,
          u1.email as assigned_to_email,
          u2.name as created_by_name
         FROM tasks t
         LEFT JOIN users u1 ON t.assigned_to = u1.id
         LEFT JOIN users u2 ON t.created_by = u2.id
         ORDER BY t.created_at DESC`
      );

      return result.rows;
    } catch (error) {
      console.error('Get all tasks error:', error);
      throw error;
    }
  }

  static async getTasksByUser(userId: string): Promise<Task[]> {
    try {
      const result = await query(
        `SELECT 
          t.*,
          u1.name as assigned_to_name,
          u1.email as assigned_to_email,
          u2.name as created_by_name
         FROM tasks t
         LEFT JOIN users u1 ON t.assigned_to = u1.id
         LEFT JOIN users u2 ON t.created_by = u2.id
         WHERE t.assigned_to = $1
         ORDER BY t.deadline ASC`,
        [userId]
      );

      return result.rows;
    } catch (error) {
      console.error('Get tasks by user error:', error);
      throw error;
    }
  }

  static async getTasksByUserOrCreator(userId: string): Promise<Task[]> {
    try {
      const result = await query(
        `SELECT 
          t.*,
          u1.name as assigned_to_name,
          u1.email as assigned_to_email,
          u2.name as created_by_name
         FROM tasks t
         LEFT JOIN users u1 ON t.assigned_to = u1.id
         LEFT JOIN users u2 ON t.created_by = u2.id
         WHERE t.assigned_to = $1 OR t.created_by = $1
         ORDER BY t.deadline ASC`,
        [userId]
      );

      return result.rows;
    } catch (error) {
      console.error('Get tasks by user or creator error:', error);
      throw error;
    }
  }

  static async getTaskById(taskId: string): Promise<Task | null> {
    try {
      const result = await query(
        `SELECT 
          t.*,
          u1.name as assigned_to_name,
          u1.email as assigned_to_email,
          u2.name as created_by_name
         FROM tasks t
         LEFT JOIN users u1 ON t.assigned_to = u1.id
         LEFT JOIN users u2 ON t.created_by = u2.id
         WHERE t.id = $1`,
        [taskId]
      );

      return result.rows[0] || null;
    } catch (error) {
      console.error('Get task by ID error:', error);
      throw error;
    }
  }

  static async updateTask(taskId: string, input: UpdateTaskInput): Promise<Task | null> {
    try {
      const updates: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      if (input.description !== undefined) {
        updates.push(`description = $${paramCount++}`);
        values.push(input.description);
      }

      if (input.start_time !== undefined) {
        updates.push(`start_time = $${paramCount++}`);
        values.push(input.start_time);
      }

      if (input.deadline !== undefined) {
        updates.push(`deadline = $${paramCount++}`);
        values.push(input.deadline);
      }

      if (input.assigned_to !== undefined) {
        updates.push(`assigned_to = $${paramCount++}`);
        values.push(input.assigned_to);
      }

      if (input.status !== undefined) {
        updates.push(`status = $${paramCount++}`);
        values.push(input.status);

        if (input.status === 'complete') {
          updates.push(`completed_at = CURRENT_TIMESTAMP`);
        } else {
          updates.push(`completed_at = NULL`);
        }
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(taskId);

      const result = await query(
        `UPDATE tasks 
         SET ${updates.join(', ')}
         WHERE id = $${paramCount}
         RETURNING *`,
        values
      );

      return result.rows[0] || null;
    } catch (error) {
      console.error('Update task error:', error);
      throw error;
    }
  }

  static async deleteTask(taskId: string): Promise<boolean> {
    try {
      const result = await query('DELETE FROM tasks WHERE id = $1', [taskId]);
      return (result.rowCount || 0) > 0;
    } catch (error) {
      console.error('Delete task error:', error);
      throw error;
    }
  }

  static async getTaskStats(userId?: string): Promise<{
    total: number;
    completed: number;
    incomplete: number;
    overdue: number;
  }> {
    try {
      const whereClause = userId ? 'WHERE assigned_to = $1' : '';
      const params = userId ? [userId] : [];

      const result = await query(
        `SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'complete' THEN 1 END) as completed,
          COUNT(CASE WHEN status = 'incomplete' THEN 1 END) as incomplete,
          COUNT(CASE WHEN status = 'incomplete' AND deadline < CURRENT_TIMESTAMP THEN 1 END) as overdue
         FROM tasks
         ${whereClause}`,
        params
      );

      return {
        total: parseInt(result.rows[0].total),
        completed: parseInt(result.rows[0].completed),
        incomplete: parseInt(result.rows[0].incomplete),
        overdue: parseInt(result.rows[0].overdue),
      };
    } catch (error) {
      console.error('Get task stats error:', error);
      throw error;
    }
  }
}
