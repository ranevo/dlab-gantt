import fs from 'fs';
import path from 'path';
import { query } from '../db.js';
import { getSetting } from './settingsService.js';
import { listFlatNodes } from './nodeService.js';

const ensureDirectory = async (dirPath) => {
  await fs.promises.mkdir(dirPath, { recursive: true });
};

export const resolveStoragePath = async () => {
  const root = await getSetting('attachment_root');
  return root || 'C:/dlab-gantt/attachments';
};

export const getMulterStoragePath = async (nodeId) => {
  const root = await resolveStoragePath();
  const nodes = await listFlatNodes();
  const node = nodes.find((n) => n.id === Number(nodeId));
  const segments = [];
  if (node) {
    let current = node;
    while (current) {
      segments.unshift(current.name);
      current = nodes.find((n) => n.id === current.parent_id);
    }
  }
  const directory = path.join(root, ...segments);
  await ensureDirectory(directory);
  return directory;
};

export const recordFile = async ({ nodeId, originalName, filePath, size, mimeType }) => {
  await query(
    `INSERT INTO files (node_id, original_name, storage_path, file_size, mime_type)
     VALUES (:nodeId, :originalName, :filePath, :size, :mimeType)`,
    { nodeId, originalName, filePath, size, mimeType }
  );
};

export const listFilesByNode = async (nodeId) => {
  return query(
    'SELECT id, node_id, original_name, storage_path, file_size, mime_type, uploaded_at FROM files WHERE node_id = :nodeId ORDER BY uploaded_at DESC',
    { nodeId }
  );
};

export const listAllFiles = async () => {
  return query(
    `SELECT f.id, f.node_id, f.original_name, f.storage_path, f.file_size, f.mime_type, f.uploaded_at,
            n.name AS node_name, n.parent_id, n.level
       FROM files f
       LEFT JOIN tree_nodes n ON n.id = f.node_id
       ORDER BY f.uploaded_at DESC`
  );
};

export const deleteFile = async (fileId) => {
  const rows = await query('SELECT id, storage_path FROM files WHERE id = :id', { id: fileId });
  if (!rows.length) return;
  const file = rows[0];
  await query('DELETE FROM files WHERE id = :id', { id: fileId });
  if (file.storage_path) {
    try {
      await fs.promises.unlink(file.storage_path);
    } catch (error) {
      // ignore missing file errors
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }
};
