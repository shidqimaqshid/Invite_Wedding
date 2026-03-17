import { Router } from 'express';
import { getWishes, addWish } from '../controllers/wishController';

const router = Router();

router.get('/:slug', getWishes);
router.post('/:slug', addWish);

export default router;
