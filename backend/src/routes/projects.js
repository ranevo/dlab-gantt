import { Router } from 'express';
import { getProjectBySlug, getProjectTree } from '../services/projectService.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const tree = await getProjectTree();
    res.json(tree);
  } catch (error) {
    next(error);
  }
});

router.get('/export', async (req, res, next) => {
  try {
    const tree = await getProjectTree();
    const payload = {
      generatedAt: new Date().toISOString(),
      projects: tree,
    };
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="dlab-projects.json"');
    res.send(`${JSON.stringify(payload, null, 2)}\n`);
  } catch (error) {
    next(error);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const project = await getProjectBySlug(req.params.slug);
    res.json(project);
  } catch (error) {
    next(error);
  }
});

export default router;
