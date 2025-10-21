import { Router } from 'express';
import { updateTodoCompletion } from '../services/todoService.js';

const router = Router();

router.patch('/:id', async (req, res, next) => {
  const todoId = Number(req.params.id);
  if (!Number.isInteger(todoId)) {
    return res.status(400).json({ message: '유효한 TODO ID가 필요합니다.' });
  }

  const { completed } = req.body;
  if (typeof completed !== 'boolean') {
    return res
      .status(400)
      .json({ message: 'completed 필드는 boolean 값이어야 합니다.' });
  }

  try {
    const updatedTodo = await updateTodoCompletion(todoId, completed);
    res.json(updatedTodo);
  } catch (error) {
    next(error);
  }
});

export default router;
