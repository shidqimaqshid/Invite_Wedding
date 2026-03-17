import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function runMigrations() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  });

  const dbName = process.env.DB_NAME || 'wedding_app';
  console.log(`Creating database ${dbName} if not exists...`);
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  await connection.query(`USE \`${dbName}\``);

  const sqlFilePath = path.join(process.cwd(), 'server', 'migrations', 'init.sql');
  const sql = fs.readFileSync(sqlFilePath, 'utf8');

  const statements = sql.split(';').filter(stmt => stmt.trim() !== '');

  console.log('Running migrations...');
  for (const statement of statements) {
    if (statement.trim()) {
      await connection.query(statement);
    }
  }

  console.log('Migrations completed successfully!');
  await connection.end();
  process.exit(0);
}

runMigrations().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
