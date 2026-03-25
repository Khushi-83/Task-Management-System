import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from root of backend
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('Unexpected pg error on idle pool client:', err);
  process.exit(-1);
});

// Helper for single queries
export const query = (text: string, params?: any[]) => pool.query(text, params);
