import { Router } from 'express';
import {
  loginUser,
  registerUser,
  getUserById,
  getAuthLogs,
} from '../services/authService.js';
import { getSettings } from '../services/settingsService.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/register', async (req, res) => {
  const { email, password, alias } = req.body;
  if (!email || !password || !alias) {
    return res.status(400).json({ message: '이메일, 비밀번호, 별칭은 필수입니다.' });
  }
  try {
    const result = await registerUser({ email, password, alias, ip: req.ip });
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: '이메일과 비밀번호를 입력하세요.' });
  }
  try {
    const { token, expiresIn, user } = await loginUser({ email, password, ip: req.ip });
    res.cookie('token', token, {
      maxAge: expiresIn * 1000,
      httpOnly: true,
      sameSite: 'lax',
    });
    return res.json({
      token,
      expiresIn,
      user,
      settings: await getSettings(),
    });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: '로그아웃되었습니다.' });
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await getUserById(req.user.id);
  const settings = await getSettings();
  res.json({ user, settings });
});

router.get('/logs', requireAuth, requireAdmin, async (req, res) => {
  const logs = await getAuthLogs();
  res.json(logs);
});

export default router;
