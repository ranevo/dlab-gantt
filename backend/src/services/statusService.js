import { query } from '../db.js';

export const listStatuses = async () => {
  return query('SELECT id, name, color FROM statuses ORDER BY id');
};

export const createStatus = async ({ name, color }) => {
  const result = await query(
    'INSERT INTO statuses (name, color) VALUES (:name, :color)',
    { name, color }
  );
  return { id: result.insertId, name, color };
};

export const updateStatus = async (id, { name, color }) => {
  await query('UPDATE statuses SET name = :name, color = :color WHERE id = :id', {
    id,
    name,
    color,
  });
  return { id, name, color };
};

export const deleteStatus = async (id) => {
  await query('DELETE FROM statuses WHERE id = :id', { id });
};
