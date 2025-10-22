import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config.js';
import { authenticate } from './middleware/auth.js';
import authRoutes from './routes/authRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import statusRoutes from './routes/statusRoutes.js';
import nodeRoutes from './routes/nodeRoutes.js';
import memoRoutes from './routes/memoRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { refreshSettingsCache } from './services/settingsService.js';
import { ensureBootstrapData } from './services/bootstrapService.js';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(authenticate);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/statuses', statusRoutes);
app.use('/api/nodes', nodeRoutes);
app.use('/api/nodes/:id/memo', memoRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: '서버 오류가 발생했습니다.', detail: err.message });
});

const start = async () => {
  await ensureBootstrapData();
  await refreshSettingsCache();
  app.listen(config.port, () => {
    console.log(`API server listening on port ${config.port}`);
  });
};

start();
