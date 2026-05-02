/**
 * Database Connection Module Tests
 * 
 * Tests for the database connection pooling and query execution.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { query, getClient, testConnection, closePool } from './connection';

describe('Database Connection', () => {
  afterAll(async () => {
    await closePool();
  });

  it('should establish a connection to the database', async () => {
    const isConnected = await testConnection();
    expect(isConnected).toBe(true);
  });

  it('should execute a simple query', async () => {
    const result = await query('SELECT 1 as value');
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].value).toBe(1);
  });

  it('should execute a parameterized query', async () => {
    const result = await query('SELECT $1::text as message', ['Hello']);
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].message).toBe('Hello');
  });

  it('should get a client from the pool', async () => {
    const client = await getClient();
    expect(client).toBeDefined();
    
    const result = await client.query('SELECT 1 as value');
    expect(result.rows[0].value).toBe(1);
    
    client.release();
  });

  it('should handle transactions with client', async () => {
    const client = await getClient();
    
    try {
      await client.query('BEGIN');
      const result = await client.query('SELECT 1 as value');
      expect(result.rows[0].value).toBe(1);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  });
});
