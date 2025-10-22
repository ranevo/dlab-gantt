import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query, withTransaction } from '../db.js';
import { config } from '../config.js';
import { getSetting } from './settingsService.js';

const SALT_ROUNDS = 10;

const logAuthAttempt = async ({ email, action, success, message, ip }) => {
  await query(
    'INSERT INTO auth_logs (user_email, action, success, message, ip_address) VALUES (:email, :action, :success, :message, :ip)',
    { email, action, success: success ? 1 : 0, message, ip }
  );
};

export const registerUser = async ({ email, password, alias, ip }) => {
  const existing = await query('SELECT id FROM users WHERE email = :email', { email });
  if (existing.length) {
    await logAuthAttempt({
      email,
      action: 'register',
      success: false,
      message: '이미 등록된 이메일입니다.',
      ip,
    });
    throw new Error('이미 등록된 이메일입니다.');
  }

  const hash = await bcrypt.hash(password, SALT_ROUNDS);

  await withTransaction(async (conn) => {
    const [result] = await conn.execute(
      'INSERT INTO users (email, password_hash, alias, status) VALUES (:email, :hash, :alias, :status)',
      { email, hash, alias, status: 'pending' }
    );
    const userId = result.insertId;
    await conn.execute(
      'INSERT INTO user_permissions (user_id, can_read, can_write, can_delete) VALUES (:userId, 1, 0, 0)',
      { userId }
    );
  });

  await logAuthAttempt({
    email,
    action: 'register',
    success: true,
    message: '회원가입 신청이 접수되었습니다.',
    ip,
  });
  return {
    message: '회원가입 신청이 접수되었습니다. 관리자 승인 후 이용 가능합니다.',
  };
};

const buildTokenPayload = (user) => ({
  id: user.id,
  email: user.email,
  alias: user.alias,
  isAdmin: Boolean(user.is_admin),
});

export const loginUser = async ({ email, password, ip }) => {
  const users = await query(
    'SELECT u.*, p.can_read, p.can_write, p.can_delete FROM users u LEFT JOIN user_permissions p ON p.user_id = u.id WHERE email = :email',
    { email }
  );
  if (!users.length) {
    const message = '등록되지 않은 이메일입니다.';
    await logAuthAttempt({ email, action: 'login', success: false, message, ip });
    throw new Error(message);
  }
  const user = users[0];
  if (user.status !== 'active') {
    const message =
      user.status === 'pending'
        ? '관리자 승인 대기 상태입니다.'
        : '비활성화된 계정입니다.';
    await logAuthAttempt({ email, action: 'login', success: false, message, ip });
    throw new Error(message);
  }
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    const message = '비밀번호가 올바르지 않습니다.';
    await logAuthAttempt({ email, action: 'login', success: false, message, ip });
    throw new Error(message);
  }
  const payload = buildTokenPayload(user);
  const sessionTimeout = Number(await getSetting('session_timeout_minutes')) || 10;
  const expiresIn = sessionTimeout * 60; // seconds
  const token = jwt.sign(payload, config.jwtSecret, { expiresIn });
  await logAuthAttempt({
    email,
    action: 'login',
    success: true,
    message: '로그인 성공',
    ip,
  });
  return {
    token,
    expiresIn,
    user: {
      id: user.id,
      email: user.email,
      alias: user.alias,
      isAdmin: Boolean(user.is_admin),
      permissions: {
        read: Boolean(user.can_read),
        write: Boolean(user.can_write),
        delete: Boolean(user.can_delete),
      },
    },
  };
};

export const getUserById = async (id) => {
  const rows = await query(
    'SELECT u.id, u.email, u.alias, u.is_admin, p.can_read, p.can_write, p.can_delete FROM users u LEFT JOIN user_permissions p ON p.user_id = u.id WHERE u.id = :id',
    { id }
  );
  if (!rows.length) {
    return null;
  }
  const user = rows[0];
  return {
    id: user.id,
    email: user.email,
    alias: user.alias,
    isAdmin: Boolean(user.is_admin),
    permissions: {
      read: Boolean(user.can_read),
      write: Boolean(user.can_write),
      delete: Boolean(user.can_delete),
    },
  };
};

export const validatePassword = async (id, password) => {
  const rows = await query('SELECT password_hash FROM users WHERE id = :id', { id });
  if (!rows.length) return false;
  return bcrypt.compare(password, rows[0].password_hash);
};

export const listUsers = async () => {
  return query(
    'SELECT u.id, u.email, u.alias, u.status, u.is_admin, p.can_read, p.can_write, p.can_delete FROM users u LEFT JOIN user_permissions p ON p.user_id = u.id ORDER BY u.created_at DESC'
  );
};

export const listActiveUserAliases = async () => {
  return query(
    "SELECT id, alias FROM users WHERE status = 'active' ORDER BY alias"
  );
};

export const updateUserStatus = async ({ id, status }) => {
  await query('UPDATE users SET status = :status WHERE id = :id', { id, status });
  return getUserById(id);
};

export const updateUserPermissions = async ({
  userId,
  read,
  write,
  del,
}) => {
  await query(
    'INSERT INTO user_permissions (user_id, can_read, can_write, can_delete) VALUES (:userId, :read, :write, :del) ON DUPLICATE KEY UPDATE can_read = VALUES(can_read), can_write = VALUES(can_write), can_delete = VALUES(can_delete)',
    { userId, read: read ? 1 : 0, write: write ? 1 : 0, del: del ? 1 : 0 }
  );
  return getUserById(userId);
};

export const getAuthLogs = async () => {
  return query(
    'SELECT id, user_email, action, success, message, ip_address, created_at FROM auth_logs ORDER BY created_at DESC LIMIT 100'
  );
};
