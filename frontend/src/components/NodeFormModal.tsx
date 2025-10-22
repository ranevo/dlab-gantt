import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { Status, TreeNode } from '../types';

type NodeFormModalProps = {
  open: boolean;
  mode: 'create' | 'edit';
  parent?: TreeNode | null;
  initial?: Partial<TreeNode>;
  statuses: Status[];
  users: { id: number; alias: string }[];
  level: TreeNode['level'];
  onClose: () => void;
  onSubmit: (payload: {
    parentId?: number | null;
    level: TreeNode['level'];
    name: string;
    statusId?: number | null;
    startDate?: string | null;
    endDate?: string | null;
    sortOrder?: number | null;
    assigneeIds: number[];
  }) => void;
};

const NodeFormModal: React.FC<NodeFormModalProps> = ({
  open,
  mode,
  parent,
  initial,
  statuses,
  users,
  level,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState({
    name: '',
    statusId: '' as string,
    startDate: '',
    endDate: '',
    sortOrder: '',
    assigneeIds: [] as number[],
  });

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name ?? '',
        statusId: initial.status_id ? String(initial.status_id) : '',
        startDate: initial.start_date ?? '',
        endDate: initial.end_date ?? '',
        sortOrder: initial.sort_order ? String(initial.sort_order) : '',
        assigneeIds: initial.assignees?.map((a) => a.id) ?? [],
      });
    } else {
      setForm({
        name: '',
        statusId: '',
        startDate: '',
        endDate: '',
        sortOrder: '',
        assigneeIds: [],
      });
    }
  }, [initial, open]);

  return (
    <Modal open={open} onClose={onClose} title={mode === 'create' ? '항목 추가' : '항목 수정'} widthClass="max-w-xl">
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit({
            parentId: parent?.id ?? null,
            level,
            name: form.name,
            statusId: form.statusId ? Number(form.statusId) : undefined,
            startDate: form.startDate || null,
            endDate: form.endDate || null,
            sortOrder: form.sortOrder ? Number(form.sortOrder) : undefined,
            assigneeIds: form.assigneeIds,
          });
        }}
      >
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-600">상위 항목</label>
          <input
            value={parent ? `${parent.name} (${parent.level})` : '최상위'}
            disabled
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-600">레벨</label>
          <input value={level} disabled className="w-full rounded border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-600">항목 이름</label>
          <input
            className="w-full rounded border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-600">진행 상태</label>
          <select
            className="w-full rounded border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none"
            value={form.statusId}
            onChange={(event) => setForm((prev) => ({ ...prev, statusId: event.target.value }))}
          >
            <option value="">선택 안함</option>
            {statuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-600">시작일</label>
            <input
              type="date"
              className="w-full rounded border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none"
              value={form.startDate}
              onChange={(event) => setForm((prev) => ({ ...prev, startDate: event.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-600">종료일</label>
            <input
              type="date"
              className="w-full rounded border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none"
              value={form.endDate}
              onChange={(event) => setForm((prev) => ({ ...prev, endDate: event.target.value }))}
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-600">정렬 순서</label>
          <input
            type="number"
            className="w-full rounded border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none"
            value={form.sortOrder}
            onChange={(event) => setForm((prev) => ({ ...prev, sortOrder: event.target.value }))}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-600">담당자</label>
          <select
            multiple
            className="h-32 w-full rounded border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none"
            value={form.assigneeIds.map(String)}
            onChange={(event) => {
              const selected = Array.from(event.target.selectedOptions).map((option) => Number(option.value));
              setForm((prev) => ({ ...prev, assigneeIds: selected }));
            }}
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.alias}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="rounded border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
            onClick={onClose}
          >
            취소
          </button>
          <button
            type="submit"
            className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
          >
            {mode === 'create' ? '추가' : '수정'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default NodeFormModal;
