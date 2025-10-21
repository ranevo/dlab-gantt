const API_BASE = '/api';

const STATUS_LABELS = {
  planned: '계획',
  'in-progress': '진행 중',
  done: '완료',
};

const state = {
  tree: [],
  expanded: new Set(),
  selectedSlug: null,
};

const elements = {
  tree: document.getElementById('project-tree'),
  todoTitle: document.getElementById('todo-title'),
  todoList: document.getElementById('todo-list'),
  todoProgress: document.getElementById('todo-progress'),
  todoFeedback: document.getElementById('todo-feedback'),
  gantt: document.getElementById('gantt-chart'),
  downloadButton: document.getElementById('download-data'),
};

let feedbackTimeoutId = null;

init();

async function init() {
  setupDownloadButton();
  setTreeStatus('프로젝트를 불러오는 중입니다...');
  try {
    await loadProjects();
  } catch (error) {
    console.error(error);
    const message =
      error instanceof Error
        ? error.message
        : '프로젝트 데이터를 불러오지 못했습니다.';
    setTreeStatus(message, 'error');
    setContainerStatus(elements.gantt, 'Gantt 데이터를 불러오지 못했습니다.', 'error');
    showFeedback(message, 'error', true);
  }
}

function setupDownloadButton() {
  if (!elements.downloadButton) {
    return;
  }
  elements.downloadButton.addEventListener('click', handleDownloadClick);
}

async function loadProjects() {
  let response;
  try {
    response = await fetch(`${API_BASE}/projects`);
  } catch (networkError) {
    throw new Error('서버와 통신할 수 없습니다. 네트워크 상태를 확인해주세요.');
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch (parseError) {
    // ignore JSON parse error; payload stays null
  }

  if (!response.ok) {
    const message = payload?.message || '프로젝트 데이터를 불러오지 못했습니다.';
    throw new Error(message);
  }

  const tree = Array.isArray(payload) ? payload : [];
  state.tree = tree;
  state.expanded = initializeExpanded(tree, 2);
  state.selectedSlug = tree.length > 0 ? tree[0].slug : null;

  renderProjectTree();
  renderTodoPanel();
  renderGantt();
}

async function handleDownloadClick() {
  const button = elements.downloadButton;
  if (!button) {
    return;
  }

  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = '다운로드 준비 중...';

  try {
    const response = await fetch(`${API_BASE}/projects/export`, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      let message = '프로젝트 데이터를 다운로드하지 못했습니다.';
      try {
        const payload = await response.json();
        if (payload?.message) {
          message = payload.message;
        }
      } catch (parseError) {
        // ignore response parsing error
      }
      throw new Error(message);
    }

    const blob = await response.blob();
    const filename = createDownloadFilename();
    triggerFileDownload(blob, filename);
    showFeedback('프로젝트 데이터를 다운로드했습니다.', 'success');
  } catch (error) {
    console.error(error);
    const message =
      error instanceof Error
        ? error.message
        : '프로젝트 데이터를 다운로드하지 못했습니다.';
    showFeedback(message, 'error', true);
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
}

function initializeExpanded(nodes, depthLimit) {
  const expanded = new Set();

  const walk = (project, depth) => {
    if (depth >= depthLimit) {
      return;
    }
    if (Array.isArray(project.children) && project.children.length > 0) {
      expanded.add(project.slug);
      project.children.forEach((child) => walk(child, depth + 1));
    }
  };

  nodes.forEach((project) => walk(project, 0));
  return expanded;
}

function renderProjectTree() {
  if (!state.tree.length) {
    setTreeStatus('등록된 프로젝트가 없습니다.');
    return;
  }

  elements.tree.innerHTML = '';
  const list = document.createElement('ul');
  const roots = sortProjects(state.tree);
  roots.forEach((project) => {
    list.appendChild(createTreeItem(project));
  });
  elements.tree.appendChild(list);
}

function createTreeItem(project) {
  const li = document.createElement('li');
  const row = document.createElement('div');
  row.className = 'tree-node';
  row.dataset.slug = project.slug;

  if (state.selectedSlug === project.slug) {
    row.classList.add('active');
  }

  const hasChildren = Array.isArray(project.children) && project.children.length > 0;
  if (hasChildren) {
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'tree-toggle';
    const expanded = state.expanded.has(project.slug);
    toggle.textContent = expanded ? '−' : '+';
    toggle.setAttribute(
      'aria-label',
      expanded
        ? `${project.name} 하위 프로젝트 접기`
        : `${project.name} 하위 프로젝트 펼치기`
    );
    toggle.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleBranch(project.slug);
    });
    row.appendChild(toggle);
  } else {
    const spacer = document.createElement('span');
    spacer.className = 'tree-toggle tree-toggle-spacer';
    spacer.setAttribute('aria-hidden', 'true');
    row.appendChild(spacer);
  }

  const label = document.createElement('div');
  label.className = 'tree-node-label';

  const name = document.createElement('span');
  name.textContent = project.name;
  label.appendChild(name);

  if (project.status) {
    const pill = document.createElement('span');
    const statusKey = project.status in STATUS_LABELS ? project.status : 'planned';
    pill.className = `status-pill ${statusKey}`;
    pill.textContent = STATUS_LABELS[statusKey] || project.status;
    label.appendChild(pill);
  }

  row.appendChild(label);

  if (project.start && project.end) {
    const dates = document.createElement('span');
    dates.className = 'tree-node-dates';
    dates.textContent = formatRange(project.start, project.end);
    row.appendChild(dates);
  }

  row.addEventListener('click', () => {
    selectProject(project.slug);
  });

  li.appendChild(row);

  if (hasChildren && state.expanded.has(project.slug)) {
    const childrenList = document.createElement('ul');
    childrenList.className = 'tree-children';
    const sortedChildren = sortProjects(project.children);
    sortedChildren.forEach((child) => {
      childrenList.appendChild(createTreeItem(child));
    });
    li.appendChild(childrenList);
  }

  return li;
}

function sortProjects(nodes) {
  return [...nodes].sort((a, b) => {
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
  });
}

function toggleBranch(slug) {
  if (state.expanded.has(slug)) {
    state.expanded.delete(slug);
  } else {
    state.expanded.add(slug);
  }
  renderProjectTree();
}

function selectProject(slug) {
  if (state.selectedSlug === slug) {
    return;
  }
  state.selectedSlug = slug;
  renderProjectTree();
  renderTodoPanel();
}

function renderTodoPanel() {
  elements.todoList.innerHTML = '';
  showFeedback('');

  const project = findProjectBySlug(state.selectedSlug);
  if (!project) {
    elements.todoTitle.textContent = 'TODO';
    elements.todoProgress.textContent = '';
    const empty = document.createElement('li');
    empty.className = 'todo-item';
    empty.innerHTML = '<em>프로젝트를 선택해주세요.</em>';
    elements.todoList.appendChild(empty);
    return;
  }

  elements.todoTitle.textContent = `${project.name} TODO`;
  const todos = Array.isArray(project.todos) ? project.todos : [];

  if (todos.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'todo-item';
    empty.innerHTML = '<em>등록된 TODO가 없습니다.</em>';
    elements.todoList.appendChild(empty);
    elements.todoProgress.textContent = '0 / 0 완료';
    return;
  }

  todos.forEach((todo) => {
    elements.todoList.appendChild(createTodoItem(project, todo));
  });

  updateTodoProgress(project);
}

function createTodoItem(project, todo) {
  const item = document.createElement('li');
  item.className = 'todo-item';
  if (todo.completed) {
    item.classList.add('completed');
  }

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = Boolean(todo.completed);

  checkbox.addEventListener('change', async () => {
    const desired = checkbox.checked;
    checkbox.disabled = true;
    try {
      const updated = await persistTodoCompletion(todo.id, desired);
      todo.completed = Boolean(updated.completed);
      item.classList.toggle('completed', todo.completed);
      updateTodoProgress(project);
      showFeedback('TODO 상태가 업데이트되었습니다.', 'success');
    } catch (error) {
      checkbox.checked = !desired;
      const message =
        error instanceof Error
          ? error.message
          : 'TODO 상태를 변경할 수 없습니다.';
      showFeedback(message, 'error', true);
    } finally {
      checkbox.disabled = false;
    }
  });

  const content = document.createElement('div');
  content.className = 'todo-content';

  const title = document.createElement('strong');
  title.textContent = todo.title;
  content.appendChild(title);

  if (todo.description) {
    const description = document.createElement('p');
    description.textContent = todo.description;
    description.style.margin = '0';
    description.style.color = 'var(--color-muted)';
    description.style.fontSize = '0.85rem';
    description.style.lineHeight = '1.5';
    content.appendChild(description);
  }

  const meta = document.createElement('div');
  meta.className = 'todo-meta';

  if (todo.due) {
    const due = document.createElement('span');
    due.innerHTML = `📅 ${formatFullDate(todo.due)}`;
    meta.appendChild(due);
  }

  if (todo.priority) {
    const priority = document.createElement('span');
    priority.innerHTML = `⭐ 우선순위 <span class="todo-badge">${todo.priority}</span>`;
    meta.appendChild(priority);
  }

  if (meta.children.length > 0) {
    content.appendChild(meta);
  }

  item.appendChild(checkbox);
  item.appendChild(content);

  return item;
}

function updateTodoProgress(project) {
  const todos = Array.isArray(project.todos) ? project.todos : [];
  const completed = todos.filter((todo) => todo.completed).length;
  elements.todoProgress.textContent = `${completed} / ${todos.length} 완료`;
}

async function persistTodoCompletion(todoId, completed) {
  let response;
  try {
    response = await fetch(`${API_BASE}/todos/${todoId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed }),
    });
  } catch (networkError) {
    throw new Error('TODO 상태를 저장하지 못했습니다. 네트워크를 확인해주세요.');
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch (parseError) {
    // ignore JSON parse issues
  }

  if (!response.ok) {
    const message = payload?.message || 'TODO 상태를 업데이트하지 못했습니다.';
    throw new Error(message);
  }

  return payload || { completed };
}

function renderGantt() {
  elements.gantt.innerHTML = '';

  const tasks = flattenProjects(state.tree);
  if (!tasks.length) {
    setContainerStatus(elements.gantt, '표시할 프로젝트가 없습니다.');
    return;
  }

  const bounds = getTimelineBounds(tasks);
  if (!bounds) {
    setContainerStatus(elements.gantt, '일정 정보가 등록되지 않았습니다.');
    return;
  }

  const { minStart, maxEnd } = bounds;
  const weeks = generateTimeline(minStart, maxEnd);

  const grid = document.createElement('div');
  grid.className = 'gantt-grid';
  const columns = ['220px', ...weeks.map(() => 'minmax(70px, 1fr)')];
  grid.style.gridTemplateColumns = columns.join(' ');

  const headerRow = document.createElement('div');
  headerRow.className = 'gantt-row';
  const taskHeader = document.createElement('div');
  taskHeader.className = 'gantt-cell header';
  taskHeader.textContent = '작업';
  headerRow.appendChild(taskHeader);

  weeks.forEach((week) => {
    const cell = document.createElement('div');
    cell.className = 'gantt-cell header';
    cell.textContent = formatDate(week);
    headerRow.appendChild(cell);
  });

  grid.appendChild(headerRow);

  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const MS_PER_WEEK = MS_PER_DAY * 7;

  tasks.forEach(({ project, depth }) => {
    const row = document.createElement('div');
    row.className = 'gantt-row';

    const labelCell = document.createElement('div');
    labelCell.className = 'gantt-cell';
    labelCell.style.paddingLeft = `${depth * 12}px`;

    const label = document.createElement('div');
    label.className = 'gantt-label';

    const depthIndicator = document.createElement('span');
    depthIndicator.className = `depth-indicator depth-${Math.min(depth, 3)}`;
    label.appendChild(depthIndicator);

    const name = document.createElement('span');
    name.textContent = project.name;
    label.appendChild(name);

    labelCell.appendChild(label);
    row.appendChild(labelCell);

    const timelineCell = document.createElement('div');
    timelineCell.className = 'gantt-cell timeline-cell';

    const timelineGrid = document.createElement('div');
    timelineGrid.className = 'timeline-grid';
    timelineGrid.style.setProperty('--weeks', weeks.length);
    timelineGrid.style.gridTemplateColumns = `repeat(${weeks.length}, minmax(70px, 1fr))`;

    if (project.start && project.end) {
      const startDate = parseISODate(project.start);
      const endDate = parseISODate(project.end);
      const startOffset = Math.max(
        0,
        Math.floor((startDate - minStart) / MS_PER_WEEK)
      );
      const durationWeeks = Math.max(
        1,
        Math.ceil((endDate - startDate + MS_PER_DAY) / MS_PER_WEEK)
      );
      const bar = document.createElement('div');
      const statusKey = project.status || 'planned';
      bar.className = `gantt-bar ${statusKey}`;
      bar.style.gridColumn = `${startOffset + 1} / span ${durationWeeks}`;
      bar.textContent = project.name;
      timelineGrid.appendChild(bar);
    }

    timelineCell.appendChild(timelineGrid);
    row.appendChild(timelineCell);

    grid.appendChild(row);
  });

  elements.gantt.appendChild(grid);

  const footer = document.createElement('div');
  footer.className = 'timeline-footer';
  footer.innerHTML = `
    <span>전체 일정: <strong>${formatFullDate(minStart)}</strong> ~ <strong>${formatFullDate(
    maxEnd
  )}</strong></span>
    <span>총 ${weeks.length}주</span>
  `;
  elements.gantt.appendChild(footer);
}

function flattenProjects(nodes, depth = 0, acc = []) {
  nodes.forEach((project) => {
    acc.push({ project, depth });
    if (Array.isArray(project.children) && project.children.length > 0) {
      flattenProjects(project.children, depth + 1, acc);
    }
  });
  return acc;
}

function getTimelineBounds(tasks) {
  const valid = tasks
    .map((task) => task.project)
    .filter((project) => project.start && project.end);

  if (valid.length === 0) {
    return null;
  }

  const startTimes = valid.map((project) => parseISODate(project.start).getTime());
  const endTimes = valid.map((project) => parseISODate(project.end).getTime());

  const minStart = new Date(Math.min(...startTimes));
  const maxEnd = new Date(Math.max(...endTimes));
  return { minStart, maxEnd };
}

function generateTimeline(minStart, maxEnd) {
  const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;
  const duration = Math.max(0, maxEnd - minStart);
  const totalWeeks = Math.max(1, Math.ceil(duration / MS_PER_WEEK) + 1);
  return Array.from({ length: totalWeeks }, (_, index) => {
    return new Date(minStart.getTime() + index * MS_PER_WEEK);
  });
}

function findProjectBySlug(slug, nodes = state.tree) {
  if (!slug) {
    return null;
  }
  for (const project of nodes) {
    if (project.slug === slug) {
      return project;
    }
    if (Array.isArray(project.children) && project.children.length > 0) {
      const match = findProjectBySlug(slug, project.children);
      if (match) {
        return match;
      }
    }
  }
  return null;
}

function formatRange(start, end) {
  return `${formatDate(start)} ~ ${formatDate(end)}`;
}

function formatDate(dateLike) {
  const date = dateLike instanceof Date ? dateLike : parseISODate(dateLike);
  return date.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
  });
}

function formatFullDate(dateLike) {
  const date = dateLike instanceof Date ? dateLike : parseISODate(dateLike);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function parseISODate(value) {
  return new Date(`${value}T00:00:00`);
}

function createDownloadFilename() {
  const now = new Date();
  const stamp = now
    .toISOString()
    .replace(/[:]/g, '-')
    .replace(/\..+/, '');
  return `dlab-projects-${stamp}.json`;
}

function triggerFileDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function setTreeStatus(message, variant = 'info') {
  setContainerStatus(elements.tree, message, variant);
}

function setContainerStatus(container, message, variant = 'info') {
  container.innerHTML = '';
  if (!message) {
    return;
  }
  const wrapper = document.createElement('div');
  wrapper.className = `empty-state${variant === 'error' ? ' error' : ''}`;
  wrapper.textContent = message;
  container.appendChild(wrapper);
}

function showFeedback(message, variant = 'info', persist = false) {
  if (feedbackTimeoutId) {
    clearTimeout(feedbackTimeoutId);
    feedbackTimeoutId = null;
  }

  if (!message) {
    elements.todoFeedback.textContent = '';
    elements.todoFeedback.className = 'todo-feedback';
    return;
  }

  const variantClass =
    variant === 'error' || variant === 'success' ? ` ${variant}` : '';
  elements.todoFeedback.className = `todo-feedback${variantClass}`;
  elements.todoFeedback.textContent = message;

  if (!persist) {
    feedbackTimeoutId = window.setTimeout(() => {
      elements.todoFeedback.textContent = '';
      elements.todoFeedback.className = 'todo-feedback';
      feedbackTimeoutId = null;
    }, 4000);
  }
}
