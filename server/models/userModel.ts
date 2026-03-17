import pool from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export const createUser = async (name: string, email: string, passwordHash: string) => {
  const [result] = await pool.execute<ResultSetHeader>(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, passwordHash]
  );
  return result.insertId;
};

export const getUserByEmail = async (email: string) => {
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

export const getUserById = async (id: number) => {
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT id, name, email FROM users WHERE id = ?', [id]);
  return rows[0];
};
