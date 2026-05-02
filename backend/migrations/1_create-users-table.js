/**
 * Migration: Create users table
 * 
 * Creates the users table with role-based access control.
 * Stores user information from Microsoft Entra ID authentication.
 */

export async function up(pgm) {
  // Create users table
  pgm.createTable('users', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    email: {
      type: 'varchar(255)',
      notNull: true,
      unique: true,
    },
    password: {
      type: 'varchar(255)',
      notNull: true,
    },
    name: {
      type: 'varchar(255)',
      notNull: true,
    },
    role: {
      type: 'varchar(20)',
      notNull: true,
      check: "role IN ('admin', 'employee')",
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
  pgm.createIndex('users', 'email', { name: 'idx_users_email' });
  pgm.createIndex('users', 'role', { name: 'idx_users_role' });
}

export async function down(pgm) {
  pgm.dropTable('users');
}
