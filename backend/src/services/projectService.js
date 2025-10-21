import { fetchProjectBySlug, fetchProjectTree } from '../repositories/projectRepository.js';
import { createHttpError } from '../utils/httpError.js';

export async function getProjectTree() {
  return fetchProjectTree();
}

export async function getProjectBySlug(slug) {
  const project = await fetchProjectBySlug(slug);
  if (!project) {
    throw createHttpError(404, '요청한 프로젝트를 찾을 수 없습니다.');
  }
  return project;
}
