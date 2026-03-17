import pool from '../config/db';
import { RowDataPacket } from 'mysql2';

export const getInvitationByUserId = async (userId: number) => {
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT data, slug FROM invitations WHERE user_id = ?', [userId]);
  return rows[0];
};

export const upsertInvitation = async (userId: number, slug: string, data: string) => {
  await pool.execute(
    'INSERT INTO invitations (user_id, slug, data) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE data = VALUES(data), slug = VALUES(slug)',
    [userId, slug, data]
  );
};

export const getInvitationBySlug = async (slug: string) => {
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT data FROM invitations WHERE slug = ?', [slug]);
  return rows[0];
};
