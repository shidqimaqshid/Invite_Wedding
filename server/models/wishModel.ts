import pool from '../config/db';
import { RowDataPacket } from 'mysql2';

export const getWishesBySlug = async (slug: string) => {
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM wishes WHERE invitation_slug = ? ORDER BY created_at DESC', [slug]);
  return rows;
};

export const createWish = async (slug: string, name: string, message: string, attendance: string) => {
  await pool.execute(
    'INSERT INTO wishes (invitation_slug, name, message, attendance) VALUES (?, ?, ?, ?)',
    [slug, name, message, attendance]
  );
};
