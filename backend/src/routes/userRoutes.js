import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { listActiveUserAliases } from '../services/authService.js';

const router = Router();

router.get('/aliases', requireAuth, async (req, res) => {
  const users = await listActiveUserAliases();
  res.json(users);
});

export default router;
