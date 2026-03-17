import { Request, Response } from 'express';
import * as wishModel from '../models/wishModel';

export const getWishes = async (req: Request, res: Response): Promise<void> => {
  try {
    const wishes = await wishModel.getWishesBySlug(req.params.slug);
    res.json({ wishes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
};

export const addWish = async (req: Request, res: Response): Promise<void> => {
  const { name, message, attendance } = req.body;
  try {
    await wishModel.createWish(req.params.slug, name, message, attendance);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
};
