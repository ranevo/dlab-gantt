const TASK_DATA = [
  {
    id: "PRJ-001",
    name: "신규 서비스 런칭",
    type: "project",
    status: "in-progress",
    start: "2024-07-01",
    end: "2024-08-15",
    children: [
      {
        id: "PRJ-001-PLN",
        name: "기획",
        type: "phase",
        status: "done",
        start: "2024-07-01",
        end: "2024-07-07",
        children: [
          {
            id: "PRJ-001-PLN-REQ",
            name: "요구사항 정의",
            type: "task",
            status: "done",
            start: "2024-07-01",
            end: "2024-07-03",
          },
          {
            id: "PRJ-001-PLN-APR",
            name: "이해관계자 승인",
            type: "task",
            status: "done",
            start: "2024-07-04",
            end: "2024-07-07",
          },
        ],
      },
      {
        id: "PRJ-001-DSN",
        name: "설계",
        type: "phase",
        status: "in-progress",
        start: "2024-07-08",
        end: "2024-07-20",
        children: [
          {
            id: "PRJ-001-DSN-WFR",
            name: "와이어프레임",
            type: "task",
            status: "done",
            start: "2024-07-08",
            end: "2024-07-12",
          },
          {
            id: "PRJ-001-DSN-UI",
            name: "UI 프로토타입",
            type: "task",
            status: "in-progress",
            start: "2024-07-13",
            end: "2024-07-18",
          },
          {
            id: "PRJ-001-DSN-UX",
            name: "UX 피드백 반영",
            type: "task",
            status: "not-started",
            start: "2024-07-19",
            end: "2024-07-20",
          },
        ],
      },
      {
        id: "PRJ-001-DEV",
        name: "개발",
        type: "phase",
        status: "in-progress",
        start: "2024-07-21",
        end: "2024-08-10",
        children: [
          {
            id: "PRJ-001-DEV-SPR1",
            name: "스프린트 1",
            type: "phase",
            status: "in-progress",
            start: "2024-07-21",
            end: "2024-07-30",
            children: [
              {
                id: "PRJ-001-DEV-API",
                name: "백엔드 API 구축",
                type: "task",
                status: "in-progress",
                start: "2024-07-21",
                end: "2024-07-26",
              },
              {
                id: "PRJ-001-DEV-FE",
                name: "프런트엔드 레이아웃",
                type: "task",
                status: "in-progress",
                start: "2024-07-25",
                end: "2024-07-30",
              },
            ],
          },
          {
            id: "PRJ-001-DEV-SPR2",
            name: "스프린트 2",
            type: "phase",
            status: "not-started",
            start: "2024-07-31",
            end: "2024-08-10",
            children: [
              {
                id: "PRJ-001-DEV-INT",
                name: "통합 테스트",
                type: "task",
                status: "not-started",
                start: "2024-07-31",
                end: "2024-08-06",
              },
              {
                id: "PRJ-001-DEV-QA",
                name: "QA 준비",
                type: "task",
                status: "not-started",
                start: "2024-08-07",
                end: "2024-08-10",
              },
            ],
          },
        ],
      },
      {
        id: "PRJ-001-LCH",
        name: "런칭",
        type: "phase",
        status: "not-started",
        start: "2024-08-11",
        end: "2024-08-15",
        children: [
          {
            id: "PRJ-001-LCH-UAT",
            name: "UAT",
            type: "task",
            status: "not-started",
            start: "2024-08-11",
            end: "2024-08-13",
          },
          {
            id: "PRJ-001-LCH-RLS",
            name: "릴리즈 준비",
            type: "task",
            status: "not-started",
            start: "2024-08-14",
            end: "2024-08-15",
          },
        ],
      },
    ],
  },
  {
    id: "PRJ-002",
    name: "내부 시스템 개선",
    type: "project",
    status: "in-progress",
    start: "2024-07-10",
    end: "2024-08-25",
    children: [
      {
        id: "PRJ-002-AUD",
        name: "현재 상태 진단",
        type: "phase",
        status: "done",
        start: "2024-07-10",
        end: "2024-07-15",
        children: [
          {
            id: "PRJ-002-AUD-LOG",
            name: "로그 분석",
            type: "task",
            status: "done",
            start: "2024-07-10",
            end: "2024-07-12",
          },
          {
            id: "PRJ-002-AUD-INT",
            name: "내부 인터뷰",
            type: "task",
            status: "done",
            start: "2024-07-13",
            end: "2024-07-15",
          },
        ],
      },
      {
        id: "PRJ-002-AUT",
        name: "자동화 도입",
        type: "phase",
        status: "in-progress",
        start: "2024-07-16",
        end: "2024-08-05",
        children: [
          {
            id: "PRJ-002-AUT-PIPE",
            name: "배포 파이프라인 개선",
            type: "task",
            status: "in-progress",
            start: "2024-07-16",
            end: "2024-07-24",
          },
          {
            id: "PRJ-002-AUT-MON",
            name: "모니터링 대시보드",
            type: "task",
            status: "in-progress",
            start: "2024-07-25",
            end: "2024-08-05",
          },
        ],
      },
      {
        id: "PRJ-002-TRN",
        name: "교육 및 전파",
        type: "phase",
        status: "not-started",
        start: "2024-08-06",
        end: "2024-08-25",
        children: [
          {
            id: "PRJ-002-TRN-DOC",
            name: "가이드 문서 작성",
            type: "task",
            status: "not-started",
            start: "2024-08-06",
            end: "2024-08-12",
          },
          {
            id: "PRJ-002-TRN-WS",
            name: "워크샵 진행",
            type: "task",
            status: "not-started",
            start: "2024-08-13",
            end: "2024-08-20",
          },
          {
            id: "PRJ-002-TRN-SUP",
            name: "지원 체계 정비",
            type: "task",
            status: "not-started",
            start: "2024-08-21",
            end: "2024-08-25",
          },
        ],
      },
    ],
  },
];

const TODO_PRESETS = [
  { id: "todo-1", label: "디자인 검토 회의 준비", done: false },
  { id: "todo-2", label: "자동화 파이프라인 공유", done: true },
  { id: "todo-3", label: "QA 범위 확정", done: false },
];

const DAY_WIDTH_FALLBACK = 64;

const flatTasks = flattenTasks(TASK_DATA);
const tasksById = new Map(flatTasks.map((task) => [task.id, task]));
const elementRefs = new Map(flatTasks.map((task) => [task.id, { tree: null, gantt: null, toggle: null }]));
const collapsedNodes = new Set();

let selectedTaskId = null;
let timelineStart;
let timelineEnd;
let timelineRange = [];
let currentDayWidth = getDayWidth();

initialize();

function initialize() {
  const treeRoot = document.getElementById("projectTree");
  treeRoot.innerHTML = "";
  treeRoot.appendChild(createTreeList(TASK_DATA));

  const timeline = buildTimeline(flatTasks);
  timelineStart = timeline.timelineStart;
  timelineEnd = timeline.timelineEnd;
  timelineRange = timeline.dateRange;

  renderGantt(flatTasks, timelineRange, timelineStart, timelineEnd);
  updateVisibility();
  setupBulkActions();
  setupTodoList();
  setupScrollSync();
  setupDepthToggle();
  updateInsightCounters();
  autoSelectFirstLeaf();
  setupResizeObserver();
}

function setupResizeObserver() {
  let resizeTimer;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      currentDayWidth = getDayWidth();
      renderGantt(flatTasks, timelineRange, timelineStart, timelineEnd);
      updateVisibility();
      if (selectedTaskId) {
        selectTask(selectedTaskId, { silent: true });
      }
    }, 180);
  });
}

function setupScrollSync() {
  const headerContainer = document.getElementById("ganttHeaderContainer");
  const bodyContainer = document.getElementById("ganttBodyContainer");
  const treeContainer = document.getElementById("projectTree");
  if (!headerContainer || !bodyContainer || !treeContainer) {
    return;
  }

  let isSyncingTreeScroll = false;
  let isSyncingGanttScroll = false;

  bodyContainer.addEventListener("scroll", () => {
    headerContainer.scrollLeft = bodyContainer.scrollLeft;
    if (isSyncingTreeScroll) {
      return;
    }
    isSyncingGanttScroll = true;
    treeContainer.scrollTop = bodyContainer.scrollTop;
    window.requestAnimationFrame(() => {
      isSyncingGanttScroll = false;
    });
  });

  treeContainer.addEventListener("scroll", () => {
    if (isSyncingGanttScroll) {
      return;
    }
    isSyncingTreeScroll = true;
    bodyContainer.scrollTop = treeContainer.scrollTop;
    window.requestAnimationFrame(() => {
      isSyncingTreeScroll = false;
    });
  });
}

function setupDepthToggle() {
  const depthCheckbox = document.getElementById("showDependencies");
  if (!depthCheckbox) return;
  depthCheckbox.addEventListener("change", (event) => {
    document.body.classList.toggle("depth-off", !event.target.checked);
  });
}

function setupBulkActions() {
  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      if (action === "expand-all") {
        collapsedNodes.clear();
        refreshToggleStates();
        updateVisibility();
      }
      if (action === "collapse-all") {
        collapsedNodes.clear();
        flatTasks
          .filter((task) => task.hasChildren)
          .forEach((task) => collapsedNodes.add(task.id));
        refreshToggleStates();
        updateVisibility();
      }
    });
  });
}

function refreshToggleStates() {
  flatTasks.forEach((task) => {
    if (task.hasChildren) {
      updateToggleState(task.id);
    }
  });
}

function setupTodoList() {
  const todoList = document.getElementById("todoList");
  const todoForm = document.getElementById("todoForm");
  const todoInput = document.getElementById("todoInput");
  if (!todoList || !todoForm || !todoInput) return;

  TODO_PRESETS.forEach((item) => {
    todoList.appendChild(createTodoItem(item));
  });

  todoForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = todoInput.value.trim();
    if (!value) return;
    const todoItem = createTodoItem({ label: value, done: false });
    todoList.prepend(todoItem);
    todoInput.value = "";
  });
}

function createTodoItem({ id, label, done }) {
  const itemId = id || `todo-${Date.now()}`;
  const listItem = document.createElement("li");
  listItem.className = "todo-item";
  if (done) {
    listItem.classList.add("completed");
  }

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = itemId;
  checkbox.checked = Boolean(done);

  const labelElement = document.createElement("label");
  labelElement.htmlFor = itemId;
  labelElement.textContent = label;

  checkbox.addEventListener("change", () => {
    listItem.classList.toggle("completed", checkbox.checked);
  });

  listItem.append(checkbox, labelElement);
  return listItem;
}

function autoSelectFirstLeaf() {
  const firstLeaf = flatTasks.find((task) => !task.hasChildren);
  if (firstLeaf) {
    selectTask(firstLeaf.id, { silent: true });
  }
}

function renderGantt(tasks, dateRange, startDate, endDate) {
  const header = document.getElementById("ganttHeader");
  const body = document.getElementById("ganttBody");
  if (!header || !body) return;

  const dateFormatter = new Intl.DateTimeFormat("ko-KR", { month: "short", day: "numeric" });
  const weekdayFormatter = new Intl.DateTimeFormat("ko-KR", { weekday: "short" });

  currentDayWidth = getDayWidth();

  header.style.gridTemplateColumns = `repeat(${dateRange.length}, ${currentDayWidth}px)`;
  header.innerHTML = "";
  dateRange.forEach((date) => {
    const cell = document.createElement("div");
    cell.className = "gantt-header-cell";
    cell.innerHTML = `
      <span>${dateFormatter.format(date)}</span>
      <span>${weekdayFormatter.format(date)}</span>
    `;
    header.appendChild(cell);
  });

  body.innerHTML = "";
  body.style.width = `${dateRange.length * currentDayWidth}px`;

  const todayMarker = body.querySelector(".today-marker");
  if (todayMarker) {
    todayMarker.remove();
  }

  tasks.forEach((task) => {
    const row = document.createElement("div");
    row.className = "gantt-row";
    row.dataset.taskId = task.id;
    row.tabIndex = 0;

    const start = parseDate(task.start);
    const end = parseDate(task.end);
    const offset = Math.max(0, differenceInDays(start, startDate));
    const duration = Math.max(1, differenceInDays(end, start) + 1);

    const bar = document.createElement("div");
    bar.className = `gantt-task-bar ${task.type}`;
    bar.style.left = `${offset * currentDayWidth}px`;
    bar.style.width = `${duration * currentDayWidth}px`;
    bar.dataset.duration = `${duration}일`;
    bar.title = `${task.name} | ${formatLongRange(start, end)}`;

    const label = document.createElement("span");
    label.className = "bar-label";
    label.textContent = task.name;

    bar.appendChild(label);
    row.appendChild(bar);

    row.addEventListener("mouseenter", () => highlightTask(task.id, true));
    row.addEventListener("mouseleave", () => highlightTask(task.id, false));
    row.addEventListener("click", () => {
      selectTask(task.id);
    });
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectTask(task.id);
      }
    });

    body.appendChild(row);
    const refs = elementRefs.get(task.id);
    if (refs) {
      refs.gantt = row;
    }
  });

  const today = startOfDay(new Date());
  if (today >= startDate && today <= endDate) {
    const offset = differenceInDays(today, startDate);
    const marker = document.createElement("div");
    marker.className = "today-marker";
    marker.style.left = `${offset * currentDayWidth}px`;
    body.appendChild(marker);
  }
}

function createTreeList(nodes, depth = 0) {
  const list = document.createElement("ul");
  list.className = "tree-level";

  nodes.forEach((node) => {
    const { children = [] } = node;
    const hasChildren = children.length > 0;
    const taskDetails = tasksById.get(node.id);

    const listItem = document.createElement("li");
    listItem.dataset.taskId = node.id;
    listItem.style.setProperty("--depth", depth.toString());
    listItem.tabIndex = 0;
    listItem.setAttribute("aria-expanded", hasChildren ? "true" : "false");
    if (hasChildren) {
      listItem.classList.add("has-children");
    }

    if (hasChildren) {
      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "tree-toggle";
      toggle.dataset.taskId = node.id;
      toggle.setAttribute("aria-expanded", "true");
      toggle.textContent = "▾";
      toggle.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleNode(node.id);
      });
      listItem.appendChild(toggle);
      const refs = elementRefs.get(node.id);
      if (refs) {
        refs.toggle = toggle;
      }
    } else {
      const spacer = document.createElement("span");
      spacer.className = "tree-spacer";
      listItem.appendChild(spacer);
    }

    const labelWrapper = document.createElement("div");
    labelWrapper.className = "tree-node-label";

    const title = document.createElement("span");
    title.className = "tree-node-title";
    title.textContent = node.name;

    const meta = document.createElement("div");
    meta.className = "tree-node-meta";

    if (taskDetails) {
      const chip = document.createElement("span");
      chip.className = `tree-node-chip ${taskDetails.type}`;
      chip.textContent = chipLabel(taskDetails.type);
      meta.appendChild(chip);

      const range = document.createElement("span");
      range.textContent = formatRange(parseDate(taskDetails.start), parseDate(taskDetails.end));
      meta.appendChild(range);

      if (taskDetails.status) {
        const status = document.createElement("span");
        status.className = `tree-node-status ${taskDetails.status}`;
        status.textContent = statusLabel(taskDetails.status);
        meta.appendChild(status);
      }
    }

    labelWrapper.append(title, meta);
    listItem.appendChild(labelWrapper);

    listItem.addEventListener("mouseenter", () => highlightTask(node.id, true));
    listItem.addEventListener("mouseleave", () => highlightTask(node.id, false));
    listItem.addEventListener("click", () => {
      selectTask(node.id);
    });
    listItem.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectTask(node.id);
      }
      if (event.key === "ArrowRight" && hasChildren && collapsedNodes.has(node.id)) {
        event.preventDefault();
        toggleNode(node.id);
      }
      if (event.key === "ArrowLeft") {
        if (hasChildren && !collapsedNodes.has(node.id)) {
          event.preventDefault();
          toggleNode(node.id);
        } else {
          const parentId = tasksById.get(node.id)?.parentId;
          if (parentId) {
            event.preventDefault();
            selectTask(parentId);
          }
        }
      }
    });

    const refs = elementRefs.get(node.id);
    if (refs) {
      refs.tree = listItem;
    }

    if (hasChildren) {
      const childList = createTreeList(children, depth + 1);
      listItem.appendChild(childList);
    }

    list.appendChild(listItem);
  });

  return list;
}

function toggleNode(taskId) {
  if (collapsedNodes.has(taskId)) {
    collapsedNodes.delete(taskId);
  } else {
    collapsedNodes.add(taskId);
  }
  updateToggleState(taskId);
  updateVisibility();
}

function updateToggleState(taskId) {
  const refs = elementRefs.get(taskId);
  if (!refs || !refs.toggle) return;
  const isCollapsed = collapsedNodes.has(taskId);
  refs.toggle.setAttribute("aria-expanded", String(!isCollapsed));
  refs.toggle.textContent = isCollapsed ? "▸" : "▾";
  if (refs.tree) {
    refs.tree.dataset.collapsed = isCollapsed ? "true" : "false";
    if (tasksById.get(taskId)?.hasChildren) {
      refs.tree.setAttribute("aria-expanded", String(!isCollapsed));
    }
  }
}

function updateVisibility() {
  flatTasks.forEach((task) => {
    const refs = elementRefs.get(task.id);
    if (!refs) return;
    const hidden = isHidden(task.id);
    if (refs.tree) {
      refs.tree.classList.toggle("is-hidden", hidden);
      refs.tree.setAttribute("aria-hidden", hidden ? "true" : "false");
    }
    if (refs.gantt) {
      refs.gantt.classList.toggle("is-hidden", hidden);
      refs.gantt.setAttribute("aria-hidden", hidden ? "true" : "false");
    }
  });
}

function isHidden(taskId) {
  let parentId = tasksById.get(taskId)?.parentId;
  while (parentId) {
    if (collapsedNodes.has(parentId)) {
      return true;
    }
    parentId = tasksById.get(parentId)?.parentId;
  }
  return false;
}

function highlightTask(taskId, active) {
  const refs = elementRefs.get(taskId);
  if (!refs) return;
  if (refs.tree) {
    refs.tree.classList.toggle("is-highlighted", active);
  }
  if (refs.gantt) {
    refs.gantt.classList.toggle("is-highlighted", active);
  }
}

function selectTask(taskId, options = {}) {
  const { silent = false } = options;
  if (selectedTaskId && elementRefs.has(selectedTaskId)) {
    const prevRefs = elementRefs.get(selectedTaskId);
    prevRefs.tree?.classList.remove("is-selected");
    prevRefs.gantt?.classList.remove("is-selected");
  }
  selectedTaskId = taskId;
  const refs = elementRefs.get(taskId);
  if (!refs) return;
  refs.tree?.classList.add("is-selected");
  refs.gantt?.classList.add("is-selected");
  if (!silent) {
    refs.tree?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    if (refs.gantt) {
      const container = document.getElementById("ganttBodyContainer");
      const rowRect = refs.gantt.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      if (rowRect.top < containerRect.top || rowRect.bottom > containerRect.bottom) {
        refs.gantt.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }
}

function chipLabel(type) {
  switch (type) {
    case "project":
      return "PROJECT";
    case "phase":
      return "PHASE";
    default:
      return "TASK";
  }
}

function statusLabel(status) {
  switch (status) {
    case "done":
      return "완료";
    case "in-progress":
      return "진행중";
    case "not-started":
      return "예정";
    default:
      return status;
  }
}

function flattenTasks(nodes, parentId = null, depth = 0, acc = []) {
  nodes.forEach((node) => {
    const { children = [], ...rest } = node;
    const hasChildren = Array.isArray(children) && children.length > 0;
    const item = {
      ...rest,
      parentId,
      depth,
      hasChildren,
    };
    acc.push(item);
    if (hasChildren) {
      flattenTasks(children, node.id, depth + 1, acc);
    }
  });
  return acc;
}

function buildTimeline(tasks) {
  if (tasks.length === 0) {
    const today = startOfDay(new Date());
    return { timelineStart: today, timelineEnd: today, dateRange: [today] };
  }
  let minDate = parseDate(tasks[0].start);
  let maxDate = parseDate(tasks[0].end);
  tasks.forEach((task) => {
    const start = parseDate(task.start);
    const end = parseDate(task.end);
    if (start < minDate) minDate = start;
    if (end > maxDate) maxDate = end;
  });
  const start = startOfDay(minDate);
  const end = startOfDay(maxDate);
  const totalDays = differenceInDays(end, start) + 1;
  const dateRange = Array.from({ length: totalDays }, (_, index) => addDays(start, index));
  return { timelineStart: start, timelineEnd: end, dateRange };
}

function parseDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(date, amount) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + amount);
  return copy;
}

function differenceInDays(later, earlier) {
  const diff = startOfDay(later).getTime() - startOfDay(earlier).getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatRange(start, end) {
  return `${formatShort(start)} – ${formatShort(end)}`;
}

function formatShort(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}.${day}`;
}

function formatLongRange(start, end) {
  const formatter = new Intl.DateTimeFormat("ko-KR", { month: "long", day: "numeric" });
  return `${formatter.format(start)} - ${formatter.format(end)}`;
}

function getDayWidth() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--day-width");
  const numeric = Number.parseFloat(raw);
  if (Number.isFinite(numeric)) {
    return numeric;
  }
  return DAY_WIDTH_FALLBACK;
}

function isCompleted(task) {
  return task.status === "done";
}

function updateInsightCounters() {
  const today = startOfDay(new Date());
  const dueSoon = flatTasks.filter((task) => {
    if (task.type !== "task" || isCompleted(task)) return false;
    const end = parseDate(task.end);
    const days = differenceInDays(end, today);
    return days >= 0 && days <= 7;
  }).length;

  const atRisk = flatTasks.filter((task) => {
    if (task.type !== "task" || isCompleted(task)) return false;
    const end = parseDate(task.end);
    return end < today;
  }).length;

  const completed = flatTasks.filter((task) => task.type === "task" && isCompleted(task)).length;

  const dueSoonElement = document.getElementById("insightDueSoon");
  const atRiskElement = document.getElementById("insightAtRisk");
  const completedElement = document.getElementById("insightCompleted");

  if (dueSoonElement) dueSoonElement.textContent = `${dueSoon}건`;
  if (atRiskElement) atRiskElement.textContent = `${atRisk}건`;
  if (completedElement) completedElement.textContent = `${completed}건`;
}
