import bcrypt from 'bcryptjs';
import { query } from '../db.js';

const defaultStatuses = [
  { name: '진행', color: '#3182ce' },
  { name: '완료', color: '#38a169' },
  { name: '예정', color: '#805ad5' },
  { name: '중단', color: '#e53e3e' },
  { name: '위험', color: '#dd6b20' },
  { name: '문제', color: '#d69e2e' },
];

export const ensureBootstrapData = async () => {
  for (const status of defaultStatuses) {
    await query(
      'INSERT INTO statuses (name, color) VALUES (:name, :color) ON DUPLICATE KEY UPDATE color = VALUES(color)',
      status
    );
  }

  await query(
    `INSERT INTO settings (\`key\`, \`value\`) VALUES
      ('session_timeout_minutes', '10'),
      ('highlight_color', '#3182ce'),
      ('memo_font_size', '14'),
      ('attachment_root', 'C:/dlab-gantt/attachments')
    ON DUPLICATE KEY UPDATE \`value\` = VALUES(\`value\`)`
  );

  const adminEmail = 'qltthfl@gmail.com';
  const adminAlias = '관리자';
  const adminPassword = '하이테크';
  const hash = await bcrypt.hash(adminPassword, 10);

  const users = await query('SELECT id FROM users WHERE email = :email', { email: adminEmail });
  let adminId;
  if (users.length) {
    adminId = users[0].id;
    await query(
      "UPDATE users SET password_hash = :hash, alias = :alias, is_admin = 1, status = 'active' WHERE id = :id",
      { hash, alias: adminAlias, id: adminId }
    );
  } else {
    const result = await query(
      "INSERT INTO users (email, password_hash, alias, is_admin, status) VALUES (:email, :hash, :alias, 1, 'active')",
      { email: adminEmail, hash, alias: adminAlias }
    );
    adminId = result.insertId;
  }

  await query(
    'INSERT INTO user_permissions (user_id, can_read, can_write, can_delete) VALUES (:userId, 1, 1, 1) ON DUPLICATE KEY UPDATE can_read = 1, can_write = 1, can_delete = 1',
    { userId: adminId }
  );
};
