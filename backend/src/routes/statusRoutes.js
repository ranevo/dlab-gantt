import { Router } from 'express';
import { listStatuses, createStatus, updateStatus, deleteStatus } from '../services/statusService.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const statuses = await listStatuses();
  res.json(statuses);
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const { name, color } = req.body;
  const status = await createStatus({ name, color });
  res.status(201).json(status);
});

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const status = await updateStatus(Number(req.params.id), req.body);
  res.json(status);
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  await deleteStatus(Number(req.params.id));
  res.status(204).end();
});

export default router;
