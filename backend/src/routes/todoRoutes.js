import { Router } from 'express';
import { requireAuth, requirePermission } from '../middleware/auth.js';
import {
  listTodosByNode,
  listAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from '../services/todoService.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const todos = await listAllTodos();
  res.json(todos);
});

router.get('/node/:id', requireAuth, async (req, res) => {
  const todos = await listTodosByNode(Number(req.params.id));
  res.json(todos);
});

router.post('/node/:id', requireAuth, requirePermission('write'), async (req, res) => {
  const todo = await createTodo({ nodeId: Number(req.params.id), ...req.body });
  res.status(201).json(todo);
});

router.put('/:todoId', requireAuth, requirePermission('write'), async (req, res) => {
  const todo = await updateTodo(Number(req.params.todoId), req.body);
  res.json(todo);
});

router.delete('/:todoId', requireAuth, requirePermission('delete'), async (req, res) => {
  await deleteTodo(Number(req.params.todoId));
  res.status(204).end();
});

export default router;
