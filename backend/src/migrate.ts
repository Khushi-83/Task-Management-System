import { pool } from './app/config/db';
import fs from 'fs';
import path from 'path';

const runMigrations = async () => {
  try {
    console.log("Dropping existing public schema context...");
    await pool.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO public;');

    const sqlPath = path.resolve(__dirname, '../migrations/001_initial_schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log("Applying structural migrations...");
    await pool.query(sql);

    console.log("Migrations applied successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

runMigrations();
