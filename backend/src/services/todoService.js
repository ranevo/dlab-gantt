import { query } from '../db.js';

export const listTodosByNode = async (nodeId) => {
  return query(
    `SELECT id, node_id, title, accomplished, created_at, expected_end_date, status
       FROM todos WHERE node_id = :nodeId ORDER BY created_at DESC`,
    { nodeId }
  );
};

export const listAllTodos = async () => {
  return query(
    `SELECT t.id, t.node_id, t.title, t.accomplished, t.created_at, t.expected_end_date, t.status,
            n.name AS node_name, n.level
       FROM todos t
       LEFT JOIN tree_nodes n ON n.id = t.node_id
       ORDER BY t.created_at DESC`
  );
};

export const createTodo = async ({ nodeId, title, accomplished, expectedEndDate, status }) => {
  const result = await query(
    `INSERT INTO todos (node_id, title, accomplished, expected_end_date, status)
     VALUES (:nodeId, :title, :accomplished, :expectedEndDate, :status)`,
    { nodeId, title, accomplished, expectedEndDate, status }
  );
  return { id: result.insertId, nodeId, title, accomplished, expectedEndDate, status };
};

export const updateTodo = async (id, { title, accomplished, expectedEndDate, status }) => {
  await query(
    `UPDATE todos SET title = :title, accomplished = :accomplished, expected_end_date = :expectedEndDate, status = :status
      WHERE id = :id`,
    { id, title, accomplished, expectedEndDate, status }
  );
  return { id, title, accomplished, expectedEndDate, status };
};

export const deleteTodo = async (id) => {
  await query('DELETE FROM todos WHERE id = :id', { id });
};
