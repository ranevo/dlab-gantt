import { Router } from 'express';
import {
  createNode,
  deleteNode,
  listTreeNodes,
  listFlatNodes,
  updateNode,
} from '../services/nodeService.js';
import { requireAdmin, requireAuth, requirePermission } from '../middleware/auth.js';
import { validatePassword } from '../services/authService.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const [tree, flat] = await Promise.all([listTreeNodes(), listFlatNodes()]);
  res.json({ tree, flat });
});

router.post('/', requireAuth, requirePermission('write'), async (req, res) => {
  const nodeId = await createNode(req.body);
  const [tree, flat] = await Promise.all([listTreeNodes(), listFlatNodes()]);
  res.status(201).json({ id: nodeId, tree, flat });
});

router.put('/:id', requireAuth, requirePermission('write'), async (req, res) => {
  await updateNode(Number(req.params.id), req.body);
  const [tree, flat] = await Promise.all([listTreeNodes(), listFlatNodes()]);
  res.json({ tree, flat });
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { password } = req.body || {};
  const isValid = await validatePassword(req.user.id, password || '');
  if (!isValid) {
    return res.status(403).json({ message: '관리자 비밀번호가 올바르지 않습니다.' });
  }
  await deleteNode(Number(req.params.id));
  const [tree, flat] = await Promise.all([listTreeNodes(), listFlatNodes()]);
  res.json({ tree, flat });
});

export default router;
