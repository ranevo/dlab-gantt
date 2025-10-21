import pool from '../db/pool.js';
import { toISODate } from '../utils/date.js';

const projectFields = `
  id,
  slug,
  name,
  status,
  start_date AS startDate,
  end_date AS endDate,
  parent_id AS parentId
`;

const todoFields = `
  id,
  project_id AS projectId,
  title,
  description,
  due_date AS dueDate,
  priority,
  completed
`;

function mapTodoRow(row) {
  return {
    id: row.id,
    projectId: row.projectId,
    title: row.title,
    description: row.description || '',
    due: toISODate(row.dueDate),
    priority: row.priority,
    completed: Boolean(row.completed),
  };
}

function mapProjectRow(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    status: row.status,
    start: toISODate(row.startDate),
    end: toISODate(row.endDate),
    parentId: row.parentId,
    todos: [],
    children: [],
  };
}

function sortByStart(a, b) {
  if (!a.start && !b.start) {
    return a.name.localeCompare(b.name);
  }
  if (!a.start) {
    return 1;
  }
  if (!b.start) {
    return -1;
  }
  if (a.start === b.start) {
    return a.name.localeCompare(b.name);
  }
  return a.start < b.start ? -1 : 1;
}

function sanitizeProject(node) {
  return {
    id: node.id,
    slug: node.slug,
    name: node.name,
    status: node.status,
    start: node.start,
    end: node.end,
    todos: node.todos.map((todo) => ({ ...todo })),
    children: node.children.map(sanitizeProject),
  };
}

export async function fetchProjectTree() {
  const [projectRows] = await pool.query(
    `SELECT ${projectFields}
     FROM projects
     ORDER BY start_date, id`
  );

  if (projectRows.length === 0) {
    return [];
  }

  const [todoRows] = await pool.query(
    `SELECT ${todoFields}
     FROM todos
     ORDER BY due_date, id`
  );

  const projectMap = new Map();
  projectRows.forEach((row) => {
    projectMap.set(row.id, mapProjectRow(row));
  });

  todoRows.forEach((row) => {
    const project = projectMap.get(row.projectId);
    if (project) {
      project.todos.push(mapTodoRow(row));
    }
  });

  projectMap.forEach((project) => {
    project.todos.sort((a, b) => {
      if (!a.due && !b.due) {
        return a.title.localeCompare(b.title);
      }
      if (!a.due) {
        return 1;
      }
      if (!b.due) {
        return -1;
      }
      if (a.due === b.due) {
        return a.title.localeCompare(b.title);
      }
      return a.due < b.due ? -1 : 1;
    });
  });

  const roots = [];
  projectMap.forEach((project) => {
    if (project.parentId) {
      const parent = projectMap.get(project.parentId);
      if (parent) {
        parent.children.push(project);
      } else {
        roots.push(project);
      }
    } else {
      roots.push(project);
    }
  });

  (function sortTree(nodes) {
    nodes.sort(sortByStart);
    nodes.forEach((node) => {
      if (node.children.length > 0) {
        sortTree(node.children);
      }
    });
  })(roots);

  return roots.map(sanitizeProject);
}

export async function fetchProjectBySlug(slug) {
  const tree = await fetchProjectTree();
  const stack = [...tree];

  while (stack.length) {
    const node = stack.pop();
    if (node.slug === slug) {
      return node;
    }
    if (node.children?.length) {
      stack.push(...node.children);
    }
  }

  return null;
}
