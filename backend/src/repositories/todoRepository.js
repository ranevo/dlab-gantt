import pool from '../db/pool.js';
import { toISODate } from '../utils/date.js';

const todoFields = `
  id,
  project_id AS projectId,
  title,
  description,
  due_date AS dueDate,
  priority,
  completed
`;

function mapTodoRow(row) {
  return {
    id: row.id,
    projectId: row.projectId,
    title: row.title,
    description: row.description || '',
    due: toISODate(row.dueDate),
    priority: row.priority,
    completed: Boolean(row.completed),
  };
}

export async function findTodoById(id) {
  const [rows] = await pool.query(
    `SELECT ${todoFields}
     FROM todos
     WHERE id = ?
     LIMIT 1`,
    [id]
  );

  if (rows.length === 0) {
    return null;
  }

  return mapTodoRow(rows[0]);
}

export async function updateTodoCompletion(id, completed) {
  const [result] = await pool.query(
    'UPDATE todos SET completed = ? WHERE id = ?',
    [completed ? 1 : 0, id]
  );

  return result.affectedRows;
}
