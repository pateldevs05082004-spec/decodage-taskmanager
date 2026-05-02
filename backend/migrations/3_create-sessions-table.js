/**
 * Migration: Create sessions table
 * 
 * Creates the sessions table for storing user authentication sessions.
 * Stores access tokens and refresh tokens from Microsoft Entra ID.
 */

export async function up(pgm) {
  // Create sessions table
  pgm.createTable('sessions', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    user_id: {
      type: 'uuid',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    token: {
      type: 'text',
      notNull: true,
      unique: true,
    },
    expires_at: {
      type: 'timestamp',
      notNull: true,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
  });

  // Create indexes for performance
  pgm.createIndex('sessions', 'user_id', { name: 'idx_sessions_user_id' });
  pgm.createIndex('sessions', 'token', { name: 'idx_sessions_token' });
  pgm.createIndex('sessions', 'expires_at', { name: 'idx_sessions_expires_at' });
}

export async function down(pgm) {
  pgm.dropTable('sessions');
}
