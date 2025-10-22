import { query, withTransaction } from '../db.js';

const levelOrder = {
  project: 0,
  major: 1,
  medium: 2,
  task: 3,
};

const sortRows = (rows) =>
  rows.sort((a, b) => {
    if (a.parent_id === b.parent_id) {
      return (a.sort_order ?? a.id) - (b.sort_order ?? b.id);
    }
    if (a.level === b.level) {
      return (a.sort_order ?? a.id) - (b.sort_order ?? b.id);
    }
    return levelOrder[a.level] - levelOrder[b.level];
  });

const mapAssignees = (assignees) => {
  const map = new Map();
  assignees.forEach((row) => {
    if (!map.has(row.node_id)) {
      map.set(row.node_id, []);
    }
    map.get(row.node_id).push({ id: row.user_id, alias: row.alias });
  });
  return map;
};

export const buildTree = (nodes, assigneeMap) => {
  const nodeMap = new Map();
  nodes.forEach((node) => {
    node.children = [];
    node.assignees = assigneeMap.get(node.id) || [];
    nodeMap.set(node.id, node);
  });
  const rootNodes = [];
  nodes.forEach((node) => {
    if (node.parent_id) {
      const parent = nodeMap.get(node.parent_id);
      if (parent) {
        parent.children.push(node);
      }
    } else {
      rootNodes.push(node);
    }
  });
  return rootNodes;
};

export const listTreeNodes = async () => {
  const rows = await query(
    `SELECT n.id, n.parent_id, n.level, n.name, n.status_id, n.start_date, n.end_date, n.sort_order,
            s.name AS status_name, s.color AS status_color
       FROM tree_nodes n
       LEFT JOIN statuses s ON s.id = n.status_id
       ORDER BY n.parent_id IS NULL DESC, COALESCE(n.sort_order, n.id)`
  );
  const assignees = await query(
    `SELECT na.node_id, u.id AS user_id, u.alias
       FROM node_assignees na
       JOIN users u ON u.id = na.user_id`
  );
  return buildTree(sortRows(rows), mapAssignees(assignees));
};

export const listFlatNodes = async () => {
  const rows = await query(
    `SELECT n.id, n.parent_id, n.level, n.name, n.status_id, n.start_date, n.end_date, n.sort_order,
            s.name AS status_name, s.color AS status_color
       FROM tree_nodes n
       LEFT JOIN statuses s ON s.id = n.status_id
       ORDER BY COALESCE(n.sort_order, n.id)`
  );
  const assignees = await query(
    `SELECT na.node_id, u.id AS user_id, u.alias
       FROM node_assignees na
       JOIN users u ON u.id = na.user_id`
  );
  const assigneeMap = mapAssignees(assignees);
  return rows.map((row) => ({ ...row, assignees: assigneeMap.get(row.id) || [] }));
};

export const createNode = async ({
  parentId,
  level,
  name,
  statusId,
  startDate,
  endDate,
  sortOrder,
  assigneeIds,
}) => {
  return withTransaction(async (conn) => {
    const [result] = await conn.execute(
      'INSERT INTO tree_nodes (parent_id, level, name, status_id, start_date, end_date, sort_order) VALUES (:parentId, :level, :name, :statusId, :startDate, :endDate, :sortOrder)',
      {
        parentId: parentId || null,
        level,
        name,
        statusId: statusId || null,
        startDate: startDate || null,
        endDate: endDate || null,
        sortOrder: sortOrder || null,
      }
    );
    const nodeId = result.insertId;
    if (assigneeIds?.length) {
      const values = assigneeIds.map((userId) => [nodeId, userId]);
      await conn.query(
        'INSERT INTO node_assignees (node_id, user_id) VALUES ' +
          values.map(() => '(?, ?)').join(', '),
        values.flat()
      );
    }
    return nodeId;
  });
};

export const updateNode = async (id, {
  name,
  statusId,
  startDate,
  endDate,
  sortOrder,
  assigneeIds,
}) => {
  await withTransaction(async (conn) => {
    await conn.execute(
      'UPDATE tree_nodes SET name = :name, status_id = :statusId, start_date = :startDate, end_date = :endDate, sort_order = :sortOrder WHERE id = :id',
      {
        id,
        name,
        statusId: statusId || null,
        startDate: startDate || null,
        endDate: endDate || null,
        sortOrder: sortOrder || null,
      }
    );
    await conn.execute('DELETE FROM node_assignees WHERE node_id = :id', { id });
    if (assigneeIds?.length) {
      const values = assigneeIds.map((userId) => [id, userId]);
      await conn.query(
        'INSERT INTO node_assignees (node_id, user_id) VALUES ' +
          values.map(() => '(?, ?)').join(', '),
        values.flat()
      );
    }
  });
  return listFlatNodes();
};

export const deleteNode = async (id) => {
  await withTransaction(async (conn) => {
    const [descendantRows] = await conn.query(
      'WITH RECURSIVE cte AS (SELECT id FROM tree_nodes WHERE id = :id UNION ALL SELECT t.id FROM tree_nodes t JOIN cte ON t.parent_id = cte.id) SELECT id FROM cte',
      { id }
    );
    const ids = descendantRows.map((row) => row.id);
    if (!ids.length) return;
    const placeholders = ids.map(() => '?').join(',');
    await conn.query(`DELETE FROM files WHERE node_id IN (${placeholders})`, ids);
    await conn.query(`DELETE FROM memos WHERE node_id IN (${placeholders})`, ids);
    await conn.query(`DELETE FROM todos WHERE node_id IN (${placeholders})`, ids);
    await conn.query(`DELETE FROM node_assignees WHERE node_id IN (${placeholders})`, ids);
    await conn.query(`DELETE FROM tree_nodes WHERE id IN (${placeholders})`, ids);
  });
};

export const getNodePath = async (nodeId) => {
  const rows = await query(
    `WITH RECURSIVE ancestors AS (
      SELECT id, parent_id, name, level FROM tree_nodes WHERE id = :id
      UNION ALL
      SELECT t.id, t.parent_id, t.name, t.level FROM tree_nodes t JOIN ancestors a ON t.id = a.parent_id
    )
    SELECT id, name, level FROM ancestors`,
    { id: nodeId }
  );
  return rows;
};
