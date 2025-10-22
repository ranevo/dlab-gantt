import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import {
  getMulterStoragePath,
  recordFile,
  listFilesByNode,
  listAllFiles,
  deleteFile,
} from '../services/fileService.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    getMulterStoragePath(req.params.id)
      .then((dest) => cb(null, dest))
      .catch((error) => cb(error, null));
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${timestamp}_${sanitized}`);
  },
});

const upload = multer({ storage });

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const files = await listAllFiles();
  res.json(files);
});

router.get('/node/:id', requireAuth, async (req, res) => {
  const files = await listFilesByNode(Number(req.params.id));
  res.json(files);
});

router.post('/node/:id', requireAuth, requirePermission('write'), upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: '파일을 업로드해야 합니다.' });
  }
  const fullPath = path.join(file.destination, file.filename);
  await recordFile({
    nodeId: Number(req.params.id),
    originalName: file.originalname,
    filePath: fullPath,
    size: file.size,
    mimeType: file.mimetype,
  });
  const files = await listFilesByNode(Number(req.params.id));
  res.status(201).json(files);
});

router.delete('/:fileId', requireAuth, requirePermission('delete'), async (req, res) => {
  await deleteFile(Number(req.params.fileId));
  res.status(204).end();
});

export default router;
