import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// dotenv checks CWD by default but let's be explicit
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle pg client', err);
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
