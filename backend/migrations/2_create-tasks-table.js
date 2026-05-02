/**
 * Migration: Create tasks table
 * 
 * Creates the tasks table with foreign keys to users table.
 * Stores task information including assignments and completion status.
 */

export async function up(pgm) {
  // Create tasks table
  pgm.createTable('tasks', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    description: {
      type: 'varchar(500)',
      notNull: true,
    },
    deadline: {
      type: 'timestamp',
      notNull: true,
    },
    assigned_to: {
      type: 'uuid',
      references: 'users(id)',
      onDelete: 'SET NULL',
    },
    created_by: {
      type: 'uuid',
      notNull: true,
      references: 'users(id)',
    },
    status: {
      type: 'varchar(20)',
      notNull: true,
      default: "'incomplete'",
      check: "status IN ('incomplete', 'complete')",
    },
    completed_at: {
      type: 'timestamp',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
  });

  // Create indexes for performance
  pgm.createIndex('tasks', 'assigned_to', { name: 'idx_tasks_assigned_to' });
  pgm.createIndex('tasks', 'status', { name: 'idx_tasks_status' });
  pgm.createIndex('tasks', 'deadline', { name: 'idx_tasks_deadline' });
  pgm.createIndex('tasks', 'created_by', { name: 'idx_tasks_created_by' });
}

export async function down(pgm) {
  pgm.dropTable('tasks');
}
