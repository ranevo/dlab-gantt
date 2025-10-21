import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import projectsRouter from './routes/projects.js';
import todosRouter from './routes/todos.js';

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/api/projects', projectsRouter);
app.use('/api/todos', todosRouter);

app.use('/api', (req, res) => {
  res.status(404).json({ message: '요청한 API를 찾을 수 없습니다.' });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, '../..', 'frontend');

app.use(express.static(frontendDir));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(frontendDir, 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  const message = err.message || '서버 내부 오류가 발생했습니다.';

  if (req.path.startsWith('/api/')) {
    res.status(status).json({ message });
  } else {
    res.status(status).send(message);
  }
});

export default app;
