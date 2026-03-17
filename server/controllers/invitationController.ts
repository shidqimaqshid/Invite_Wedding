import { Request, Response } from 'express';
import * as invitationModel from '../models/invitationModel';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getInvitation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const invitation = await invitationModel.getInvitationByUserId(req.user.id);
    if (invitation) {
      res.json({ data: JSON.parse(invitation.data), slug: invitation.slug });
    } else {
      res.json({ data: null });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
};

export const saveInvitation = async (req: AuthRequest, res: Response): Promise<void> => {
  const { data } = req.body;
  const slug = `${data.bride.nickname.toLowerCase()}-${data.groom.nickname.toLowerCase()}-${req.user.id}`;
  
  try {
    await invitationModel.upsertInvitation(req.user.id, slug, JSON.stringify(data));
    res.json({ success: true, slug });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
};

export const getPublicInvitation = async (req: Request, res: Response): Promise<void> => {
  try {
    const invitation = await invitationModel.getInvitationBySlug(req.params.slug);
    if (invitation) {
      res.json({ data: JSON.parse(invitation.data) });
    } else {
      res.status(404).json({ error: 'Invitation not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
};
