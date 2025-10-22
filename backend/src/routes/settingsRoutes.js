import { Router } from 'express';
import { getSettings, updateSettings } from '../services/settingsService.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const settings = await getSettings();
  res.json(settings);
});

router.put('/', requireAuth, requireAdmin, async (req, res) => {
  const allowedKeys = ['session_timeout_minutes', 'highlight_color', 'memo_font_size', 'attachment_root'];
  const updates = {};
  Object.keys(req.body || {}).forEach((key) => {
    if (allowedKeys.includes(key)) {
      updates[key] = req.body[key];
    }
  });
  const settings = await updateSettings(updates);
  res.json(settings);
});

export default router;
