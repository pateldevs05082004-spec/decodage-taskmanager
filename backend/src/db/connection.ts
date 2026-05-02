/**
 * Database Connection Module
 * 
 * Provides PostgreSQL connection pooling and database utilities.
 * Uses pg Pool for efficient connection management.
 */

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Database configuration from environment variables
const dbConfig = {
  host: 'localhost',
  port: 5433,
  database: 'decode_age_task_manager',
  user: 'postgres',
  password: 'postgres',
  // Connection pool settings
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return error after 2 seconds if connection cannot be established
};

console.log('Connecting to database:', {
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  user: dbConfig.user
});

// Create connection pool
const pool = new Pool(dbConfig);

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

/**
 * Execute a query with automatic connection management
 * @param text SQL query string
 * @param params Query parameters
 * @returns Query result
 */
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('Database query error', { text, error });
    throw error;
  }
}

/**
 * Get a client from the pool for transaction management
 * @returns Database client
 */
export async function getClient() {
  const client = await pool.connect();
  return client;
}

/**
 * Test database connection
 * @returns true if connection successful, false otherwise
 */
export async function testConnection(): Promise<boolean> {
  try {
    const result = await query('SELECT NOW()');
    console.log('Database connection successful', result.rows[0]);
    return true;
  } catch (error) {
    console.error('Database connection failed', error);
    return false;
  }
}

/**
 * Close all connections in the pool
 * Should be called when shutting down the application
 */
export async function closePool() {
  await pool.end();
  console.log('Database pool closed');
}

export default pool;
