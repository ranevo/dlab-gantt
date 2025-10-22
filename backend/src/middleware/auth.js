import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { getUserById } from '../services/authService.js';

const extractToken = (req) => {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    return header.substring(7);
  }
  if (req.cookies?.token) {
    return req.cookies.token;
  }
  return null;
};

export const authenticate = async (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    return next();
  }
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    const user = await getUserById(payload.id);
    if (user) {
      req.user = user;
    }
  } catch (error) {
    res.clearCookie('token');
  }
  return next();
};

export const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }
  return next();
};

export const requireAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: '관리자 권한이 필요합니다.' });
  }
  return next();
};

const hasPermission = (req, key) => {
  if (req.user?.isAdmin) return true;
  return Boolean(req.user?.permissions?.[key]);
};

export const requirePermission = (key) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }
  if (!hasPermission(req, key)) {
    return res.status(403).json({ message: '해당 작업에 대한 권한이 없습니다.' });
  }
  return next();
};
