import { Router } from 'express';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { listUsers, updateUserPermissions, updateUserStatus } from '../services/authService.js';

const router = Router();

router.get('/users', requireAuth, requireAdmin, async (req, res) => {
  const users = await listUsers();
  res.json(users);
});

router.patch('/users/:id/status', requireAuth, requireAdmin, async (req, res) => {
  const user = await updateUserStatus({ id: Number(req.params.id), status: req.body.status });
  res.json(user);
});

router.put('/users/:id/permissions', requireAuth, requireAdmin, async (req, res) => {
  const { read, write, del } = req.body;
  const user = await updateUserPermissions({
    userId: Number(req.params.id),
    read,
    write,
    del,
  });
  res.json(user);
});

export default router;
