import {
  findTodoById,
  updateTodoCompletion as persistTodoCompletion,
} from '../repositories/todoRepository.js';
import { createHttpError } from '../utils/httpError.js';

export async function updateTodoCompletion(id, completed) {
  const todo = await findTodoById(id);
  if (!todo) {
    throw createHttpError(404, '요청한 TODO 항목을 찾을 수 없습니다.');
  }

  await persistTodoCompletion(id, completed);

  return {
    ...todo,
    completed,
  };
}
