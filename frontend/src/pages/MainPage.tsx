import React, { useEffect, useMemo, useState } from 'react';
import api from '../utils/api';
import {
  AdminUser,
  FileAttachment,
  FlatNode,
  Settings,
  Status,
  Todo,
  TreeNode,
} from '../types';
import { useAuth } from '../context/AuthContext';
import TreePanel from '../components/TreePanel';
import GanttPanel from '../components/GanttPanel';
import DetailPanel from '../components/DetailPanel';
import ConfirmDialog from '../components/ConfirmDialog';
import SettingsModal from '../components/SettingsModal';
import AllTodoModal from '../components/AllTodoModal';
import AllFilesModal from '../components/AllFilesModal';
import AdminSettingsModal from '../components/AdminSettingsModal';
import NodeFormModal from '../components/NodeFormModal';
import StatusManagerModal from '../components/StatusManagerModal';

const levelFlow: Record<TreeNode['level'], TreeNode['level'] | null> = {
  project: 'major',
  major: 'medium',
  medium: 'task',
  task: null,
};

const MainPage: React.FC = () => {
  const { user, settings, logout, refresh } = useAuth();
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [flatNodes, setFlatNodes] = useState<FlatNode[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const [memo, setMemo] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [files, setFiles] = useState<FileAttachment[]>([]);
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [allFiles, setAllFiles] = useState<(FileAttachment & { path: string })[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [availableUsers, setAvailableUsers] = useState<{ id: number; alias: string }[]>([]);
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set());
  const [dayWidth, setDayWidth] = useState(40);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [confirmState, setConfirmState] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [todoModalOpen, setTodoModalOpen] = useState(false);
  const [filesModalOpen, setFilesModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [nodeModal, setNodeModal] = useState<
    | null
    | {
        mode: 'create' | 'edit';
        parent?: TreeNode | null;
        level: TreeNode['level'];
        node?: TreeNode;
      }
  >(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const canWrite = Boolean(user?.permissions.write || user?.isAdmin);
  const canDelete = Boolean(user?.permissions.delete || user?.isAdmin);

  const highlightColor = settings?.highlight_color || '#3182ce';
  const memoFontSize = settings?.memo_font_size ? Number(settings.memo_font_size) : 14;

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleError = (error: any, fallback: string) => {
    const message = error?.response?.data?.message || error.message || fallback;
    showAlert('error', message);
  };

  const fetchNodes = async () => {
    try {
      const { data } = await api.get<{ tree: TreeNode[]; flat: FlatNode[] }>('/api/nodes');
      setTree(data.tree);
      setFlatNodes(data.flat);
      if (!selectedNodeId && data.flat.length) {
        setSelectedNodeId(data.flat[0].id);
      }
    } catch (error) {
      handleError(error, '프로젝트 트리를 불러오는데 실패했습니다.');
    }
  };

  const fetchStatuses = async () => {
    try {
      const { data } = await api.get<Status[]>('/api/statuses');
      setStatuses(data);
    } catch (error) {
      handleError(error, '진행 상태 목록을 불러오는데 실패했습니다.');
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      const { data } = await api.get<{ id: number; alias: string }[]>('/api/users/aliases');
      setAvailableUsers(data);
    } catch (error) {
      handleError(error, '사용자 목록을 불러오는데 실패했습니다.');
    }
  };

  const fetchMemo = async (nodeId: number) => {
    try {
      const { data } = await api.get<{ content: string }>(`/api/nodes/${nodeId}/memo`);
      setMemo(data.content || '');
    } catch (error) {
      handleError(error, '메모를 불러오는데 실패했습니다.');
      setMemo('');
    }
  };

  const fetchTodos = async (nodeId: number) => {
    try {
      const { data } = await api.get<Todo[]>(`/api/todos/node/${nodeId}`);
      setTodos(data);
    } catch (error) {
      handleError(error, 'TODO를 불러오는데 실패했습니다.');
      setTodos([]);
    }
  };

  const fetchFiles = async (nodeId: number) => {
    try {
      const { data } = await api.get<FileAttachment[]>(`/api/files/node/${nodeId}`);
      setFiles(data);
    } catch (error) {
      handleError(error, '첨부파일을 불러오는데 실패했습니다.');
      setFiles([]);
    }
  };

  const fetchAllTodos = async () => {
    try {
      const { data } = await api.get<Todo[]>('/api/todos');
      setAllTodos(data);
    } catch (error) {
      handleError(error, '전체 TODO 목록을 불러오는데 실패했습니다.');
    }
  };

  const fetchAllFiles = async () => {
    try {
      const { data } = await api.get<FileAttachment[]>('/api/files');
      const map = new Map<number, string>();
      flatNodes.forEach((node) => {
        const path = buildNodePath(node.id);
        map.set(node.id, path);
      });
      const enriched = data.map((file) => ({
        ...file,
        path: map.get(file.node_id) || '미지정',
      }));
      setAllFiles(enriched);
    } catch (error) {
      handleError(error, '전체 첨부파일 목록을 불러오는데 실패했습니다.');
    }
  };

  const fetchAdminUsers = async () => {
    if (!user?.isAdmin) return;
    try {
      const { data } = await api.get<AdminUser[]>('/api/admin/users');
      setAdminUsers(data);
    } catch (error) {
      handleError(error, '사용자 목록을 불러오는데 실패했습니다.');
    }
  };

  useEffect(() => {
    fetchNodes();
    fetchStatuses();
    fetchAvailableUsers();
  }, []);

  useEffect(() => {
    if (selectedNodeId) {
      fetchMemo(selectedNodeId);
      fetchTodos(selectedNodeId);
      fetchFiles(selectedNodeId);
    }
  }, [selectedNodeId]);

  const visibleNodes = useMemo(() => {
    const list: TreeNode[] = [];
    const walk = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        list.push(node);
        if (!collapsed.has(node.id) && node.children?.length) {
          walk(node.children);
        }
      });
    };
    walk(tree);
    return list;
  }, [tree, collapsed]);

  const buildNodePath = (nodeId: number): string => {
    const nodesMap = new Map(flatNodes.map((node) => [node.id, node]));
    const parts: string[] = [];
    let current = nodesMap.get(nodeId);
    while (current) {
      parts.unshift(current.name);
      current = current.parent_id ? nodesMap.get(current.parent_id) : undefined;
    }
    return parts.join(' / ');
  };

  const selectedNode = useMemo(() => visibleNodes.find((node) => node.id === selectedNodeId) || null, [
    visibleNodes,
    selectedNodeId,
  ]);

  const toggleCollapse = (id: number) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const requestConfirm = (title: string, message: string, action: () => Promise<void> | void) => {
    setConfirmState({
      title,
      message,
      onConfirm: () => {
        setConfirmState(null);
        Promise.resolve(action()).catch((error) => handleError(error, '작업을 수행하는 중 오류가 발생했습니다.'));
      },
    });
  };

  const handleCreateNode = (payload: {
    parentId?: number | null;
    level: TreeNode['level'];
    name: string;
    statusId?: number | null;
    startDate?: string | null;
    endDate?: string | null;
    sortOrder?: number | null;
    assigneeIds: number[];
  }) => {
    requestConfirm('항목 추가', '새 항목을 추가하시겠습니까?', async () => {
      const { data } = await api.post<{ id: number }>('/api/nodes', payload);
      await fetchNodes();
      showAlert('success', '항목이 추가되었습니다.');
      setSelectedNodeId(data.id);
    });
  };

  const handleUpdateNode = (id: number, payload: {
    name: string;
    statusId?: number | null;
    startDate?: string | null;
    endDate?: string | null;
    sortOrder?: number | null;
    assigneeIds: number[];
  }) => {
    requestConfirm('항목 수정', '선택한 항목을 수정하시겠습니까?', async () => {
      await api.put(`/api/nodes/${id}`, payload);
      await fetchNodes();
      showAlert('success', '항목이 수정되었습니다.');
    });
  };

  const handleDeleteNode = (id: number) => {
    requestConfirm('항목 삭제', '관리자 비밀번호를 입력해야 삭제됩니다. 계속하시겠습니까?', async () => {
      const password = window.prompt('관리자 비밀번호를 입력하세요');
      if (!password) return;
      await api.delete(`/api/nodes/${id}`, { data: { password } });
      await fetchNodes();
      showAlert('success', '항목이 삭제되었습니다.');
      setSelectedNodeId(null);
    });
  };

  const handleMemoSave = (content: string) => {
    if (!selectedNodeId) return;
    requestConfirm('메모 저장', '메모를 저장하시겠습니까?', async () => {
      await api.put(`/api/nodes/${selectedNodeId}/memo`, { content });
      showAlert('success', '메모가 저장되었습니다.');
      setMemo(content);
    });
  };

  const handleTodoCreate = (payload: {
    title: string;
    accomplished: string;
    expected_end_date: string | null;
    status: string;
  }) => {
    if (!selectedNodeId) return;
    requestConfirm('TODO 추가', '새 TODO를 추가하시겠습니까?', async () => {
      await api.post(`/api/todos/node/${selectedNodeId}`, payload);
      await fetchTodos(selectedNodeId);
      if (todoModalOpen) {
        await fetchAllTodos();
      }
      showAlert('success', 'TODO가 추가되었습니다.');
    });
  };

  const handleTodoUpdate = (id: number, payload: {
    title: string;
    accomplished: string;
    expected_end_date: string | null;
    status: string;
  }) => {
    requestConfirm('TODO 수정', '선택한 TODO를 저장하시겠습니까?', async () => {
      await api.put(`/api/todos/${id}`, payload);
      if (selectedNodeId) {
        await fetchTodos(selectedNodeId);
      }
      if (todoModalOpen) {
        await fetchAllTodos();
      }
      showAlert('success', 'TODO가 수정되었습니다.');
    });
  };

  const handleTodoDelete = (id: number) => {
    requestConfirm('TODO 삭제', '선택한 TODO를 삭제하시겠습니까?', async () => {
      await api.delete(`/api/todos/${id}`);
      if (selectedNodeId) {
        await fetchTodos(selectedNodeId);
      }
      if (todoModalOpen) {
        await fetchAllTodos();
      }
      showAlert('success', 'TODO가 삭제되었습니다.');
    });
  };

  const handleFileUpload = (file: File) => {
    if (!selectedNodeId) return;
    requestConfirm('파일 업로드', '선택한 파일을 업로드하시겠습니까?', async () => {
      const formData = new FormData();
      formData.append('file', file);
      await api.post(`/api/files/node/${selectedNodeId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await fetchFiles(selectedNodeId);
      if (filesModalOpen) {
        await fetchAllFiles();
      }
      showAlert('success', '파일이 업로드되었습니다.');
    });
  };

  const handleFileDelete = (fileId: number) => {
    requestConfirm('파일 삭제', '선택한 첨부파일을 삭제하시겠습니까?', async () => {
      await api.delete(`/api/files/${fileId}`);
      if (selectedNodeId) {
        await fetchFiles(selectedNodeId);
      }
      if (filesModalOpen) {
        await fetchAllFiles();
      }
      showAlert('success', '첨부파일이 삭제되었습니다.');
    });
  };

  const handleSettingsSave = (newSettings: Settings) => {
    requestConfirm('설정 저장', '시스템 설정을 저장하시겠습니까?', async () => {
      await api.put('/api/settings', newSettings);
      await refresh();
      showAlert('success', '설정이 저장되었습니다.');
      setSettingsOpen(false);
    });
  };

  const handleStatusCreate = (status: { name: string; color: string }) => {
    requestConfirm('상태 추가', '새 진행상태를 추가하시겠습니까?', async () => {
      await api.post('/api/statuses', status);
      await fetchStatuses();
      showAlert('success', '진행상태가 추가되었습니다.');
    });
  };

  const handleStatusUpdate = (id: number, status: { name: string; color: string }) => {
    requestConfirm('상태 수정', '선택한 진행상태를 저장하시겠습니까?', async () => {
      await api.put(`/api/statuses/${id}`, status);
      await fetchStatuses();
      showAlert('success', '진행상태가 수정되었습니다.');
    });
  };

  const handleStatusDelete = (id: number) => {
    requestConfirm('상태 삭제', '선택한 진행상태를 삭제하시겠습니까?', async () => {
      await api.delete(`/api/statuses/${id}`);
      await fetchStatuses();
      showAlert('success', '진행상태가 삭제되었습니다.');
    });
  };

  const handleAdminStatus = (id: number, status: AdminUser['status']) => {
    requestConfirm('사용자 상태 변경', '선택한 사용자의 상태를 변경하시겠습니까?', async () => {
      await api.patch(`/api/admin/users/${id}/status`, { status });
      await fetchAdminUsers();
      await fetchAvailableUsers();
      showAlert('success', '사용자 상태가 변경되었습니다.');
    });
  };

  const handleAdminPermissions = (id: number, permissions: { read: boolean; write: boolean; delete: boolean }) => {
    requestConfirm('사용자 권한 변경', '선택한 사용자의 권한을 변경하시겠습니까?', async () => {
      await api.put(`/api/admin/users/${id}/permissions`, {
        read: permissions.read,
        write: permissions.write,
        del: permissions.delete,
      });
      await fetchAdminUsers();
      await fetchAvailableUsers();
      showAlert('success', '사용자 권한이 변경되었습니다.');
    });
  };

  const handleLogout = async () => {
    await logout();
  };

  const openNodeCreate = (parent: TreeNode | null, level: TreeNode['level']) => {
    setNodeModal({ mode: 'create', parent: parent ?? undefined, level });
  };

  const openNodeEdit = (node: TreeNode) => {
    setNodeModal({ mode: 'edit', parent: flatNodes.find((n) => n.id === node.parent_id) || null, level: node.level, node });
  };

  const uniqueUsers = useMemo(() => {
    const map = new Map<number, string>();
    if (user) {
      map.set(user.id, user.alias);
    }
    availableUsers.forEach((alias) => {
      if (!map.has(alias.id)) {
        map.set(alias.id, alias.alias);
      }
    });
    flatNodes.forEach((node) => {
      node.assignees.forEach((assignee) => {
        if (!map.has(assignee.id)) {
          map.set(assignee.id, assignee.alias);
        }
      });
    });
    adminUsers.forEach((admin) => {
      if (!map.has(admin.id)) {
        map.set(admin.id, admin.alias);
      }
    });
    return Array.from(map.entries()).map(([id, alias]) => ({ id, alias }));
  }, [flatNodes, adminUsers, user, availableUsers]);

  const headerButtons = [
    {
      label: '프로젝트 추가',
      onClick: () => openNodeCreate(null, 'project'),
      disabled: !canWrite,
    },
    {
      label: '아이템 추가',
      onClick: () => {
        if (!selectedNode) {
          showAlert('error', '추가할 위치를 먼저 선택하세요.');
          return;
        }
        const nextLevel = levelFlow[selectedNode.level];
        if (!nextLevel) {
          showAlert('error', '더 이상 하위 항목을 추가할 수 없습니다.');
          return;
        }
        openNodeCreate(selectedNode, nextLevel);
      },
      disabled: !canWrite,
    },
    {
      label: '설정',
      onClick: () => setStatusModalOpen(true),
      disabled: !canWrite,
    },
    {
      label: 'TODO 전체보기',
      onClick: () => {
        fetchAllTodos();
        setTodoModalOpen(true);
      },
    },
    {
      label: '첨부파일 전체보기',
      onClick: () => {
        fetchAllFiles();
        setFilesModalOpen(true);
      },
    },
    {
      label: '관리자 설정',
      onClick: () => {
        fetchAdminUsers();
        setAdminModalOpen(true);
      },
      disabled: !user?.isAdmin,
    },
    {
      label: '시스템 설정',
      onClick: () => setSettingsOpen(true),
      disabled: !user?.isAdmin,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <header className="flex items-center justify-between bg-white px-6 py-4 shadow">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">DLab Gantt</h1>
          <p className="text-sm text-slate-500">안녕하세요, {user?.alias}님</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            {headerButtons.map((button) => (
              <button
                key={button.label}
                className="rounded bg-slate-800 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-900 disabled:cursor-not-allowed disabled:bg-slate-400"
                onClick={button.onClick}
                disabled={button.disabled}
              >
                {button.label}
              </button>
            ))}
          </div>
          <button
            onClick={handleLogout}
            className="rounded border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
          >
            로그아웃
          </button>
        </div>
      </header>
      {alert && (
        <div
          className={`mx-6 mt-4 rounded border px-4 py-3 text-sm ${
            alert.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {alert.message}
        </div>
      )}
      <div className="mx-6 my-4 flex flex-1 gap-4">
        <aside className="w-1/4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <TreePanel
            nodes={tree}
            collapsed={collapsed}
            onToggle={toggleCollapse}
            onSelect={(node) => setSelectedNodeId(node.id)}
            selectedNodeId={selectedNodeId}
            highlightColor={highlightColor}
            onAddChild={(node) => {
              const nextLevel = levelFlow[node.level];
              if (!nextLevel) {
                showAlert('error', '더 이상 하위 항목을 추가할 수 없습니다.');
                return;
              }
              openNodeCreate(node, nextLevel);
            }}
            onEdit={(node) => openNodeEdit(node)}
            onDelete={(node) => handleDeleteNode(node.id)}
            canWrite={canWrite}
            canDelete={canDelete}
          />
        </aside>
        <section className="flex w-1/2 flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2 text-sm text-slate-600">
            <span>간트 차트</span>
            <label className="flex items-center gap-2">
              헤더 폭
              <input
                type="range"
                min={20}
                max={80}
                value={dayWidth}
                onChange={(event) => setDayWidth(Number(event.target.value))}
              />
            </label>
          </div>
          <div className="flex-1">
            <GanttPanel
              nodes={visibleNodes}
              selectedNodeId={selectedNodeId}
              dayWidth={dayWidth}
              externalScrollLeft={scrollLeft}
              onScrollSync={(value) => setScrollLeft(value)}
            />
          </div>
        </section>
        <aside className="w-1/4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <DetailPanel
            node={selectedNode}
            memo={memo}
            memoFontSize={memoFontSize}
            onSaveMemo={handleMemoSave}
            todos={todos}
            onCreateTodo={handleTodoCreate}
            onUpdateTodo={handleTodoUpdate}
            onDeleteTodo={handleTodoDelete}
            files={files}
            onUploadFile={handleFileUpload}
            onDeleteFile={handleFileDelete}
            canWrite={canWrite}
            canDelete={canDelete}
          />
        </aside>
      </div>

      {confirmState && (
        <ConfirmDialog
          open
          title={confirmState.title}
          message={confirmState.message}
          onConfirm={confirmState.onConfirm}
          onCancel={() => setConfirmState(null)}
        />
      )}

      <SettingsModal
        open={settingsOpen}
        settings={settings}
        onClose={() => setSettingsOpen(false)}
        onSave={handleSettingsSave}
      />
      <AllTodoModal
        open={todoModalOpen}
        todos={allTodos}
        onClose={() => setTodoModalOpen(false)}
        canWrite={canWrite}
        canDelete={canDelete}
        onUpdate={(todo) =>
          handleTodoUpdate(todo.id, {
            title: todo.title,
            accomplished: todo.accomplished ?? '',
            expected_end_date: todo.expected_end_date ?? null,
            status: todo.status,
          })
        }
        onDelete={(id) => handleTodoDelete(id)}
      />
      <AllFilesModal open={filesModalOpen} files={allFiles} onClose={() => setFilesModalOpen(false)} />
      <AdminSettingsModal
        open={adminModalOpen}
        users={adminUsers}
        onClose={() => setAdminModalOpen(false)}
        onUpdateStatus={handleAdminStatus}
        onUpdatePermissions={handleAdminPermissions}
      />
      <StatusManagerModal
        open={statusModalOpen}
        statuses={statuses}
        onClose={() => setStatusModalOpen(false)}
        onCreate={handleStatusCreate}
        onUpdate={handleStatusUpdate}
        onDelete={handleStatusDelete}
      />
      {nodeModal && (
        <NodeFormModal
          open
          mode={nodeModal.mode}
          parent={nodeModal.parent || null}
          level={nodeModal.level}
          initial={nodeModal.node}
          statuses={statuses}
          users={uniqueUsers}
          onClose={() => setNodeModal(null)}
          onSubmit={(payload) => {
            if (nodeModal.mode === 'create') {
              handleCreateNode(payload);
            } else if (nodeModal.node) {
              handleUpdateNode(nodeModal.node.id, payload);
            }
            setNodeModal(null);
          }}
        />
      )}
    </div>
  );
};

export default MainPage;
