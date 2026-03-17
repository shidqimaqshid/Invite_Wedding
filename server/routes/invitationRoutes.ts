import { Router } from 'express';
import { getInvitation, saveInvitation, getPublicInvitation } from '../controllers/invitationController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', authenticateToken, getInvitation);
router.post('/', authenticateToken, saveInvitation);
router.get('/:slug', getPublicInvitation);

export default router;
