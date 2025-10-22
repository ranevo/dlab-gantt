import { Router } from 'express';
import { requireAuth, requirePermission } from '../middleware/auth.js';
import { getMemo, upsertMemo } from '../services/memoService.js';

const router = Router({ mergeParams: true });

router.get('/', requireAuth, async (req, res) => {
  const memo = await getMemo(Number(req.params.id));
  res.json({ content: memo });
});

router.put('/', requireAuth, requirePermission('write'), async (req, res) => {
  const { content } = req.body;
  const memo = await upsertMemo(Number(req.params.id), content || '');
  res.json({ content: memo });
});

export default router;
