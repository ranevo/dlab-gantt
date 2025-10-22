import { query } from '../db.js';

export const getMemo = async (nodeId) => {
  const rows = await query('SELECT content FROM memos WHERE node_id = :nodeId', { nodeId });
  return rows.length ? rows[0].content : '';
};

export const upsertMemo = async (nodeId, content) => {
  await query(
    'INSERT INTO memos (node_id, content) VALUES (:nodeId, :content) ON DUPLICATE KEY UPDATE content = VALUES(content)',
    { nodeId, content }
  );
  return getMemo(nodeId);
};
