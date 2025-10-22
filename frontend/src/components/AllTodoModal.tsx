import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { Todo } from '../types';

const todoStatuses = ['예정', '진행', '중단', '처리', '완료'];

type AllTodoModalProps = {
  open: boolean;
  todos: Todo[];
  onClose: () => void;
  canWrite: boolean;
  canDelete: boolean;
  onUpdate: (todo: Todo) => void;
  onDelete: (id: number) => void;
};

const AllTodoModal: React.FC<AllTodoModalProps> = ({ open, todos, onClose, canWrite, canDelete, onUpdate, onDelete }) => {
  const [drafts, setDrafts] = useState<Record<number, Todo>>({});

  useEffect(() => {
    const map: Record<number, Todo> = {};
    todos.forEach((todo) => {
      map[todo.id] = { ...todo };
    });
    setDrafts(map);
  }, [todos]);

  const handleChange = (id: number, field: keyof Todo, value: string) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  return (
    <Modal open={open} onClose={onClose} title="전체 TODO" widthClass="max-w-5xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="bg-slate-100 text-left text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">항목</th>
              <th className="px-3 py-2">해야할 일</th>
              <th className="px-3 py-2">수행한 일</th>
              <th className="px-3 py-2">등록일</th>
              <th className="px-3 py-2">예상 종료일</th>
              <th className="px-3 py-2">상태</th>
              <th className="px-3 py-2 text-right">관리</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo) => {
              const draft = drafts[todo.id] || todo;
              return (
                <tr key={todo.id} className="border-b border-slate-200">
                  <td className="px-3 py-2">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-700">{todo.node_name}</span>
                      <span className="text-xs text-slate-400">{todo.level}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      className="w-full rounded border border-slate-300 px-2 py-1 text-sm focus:border-sky-500 focus:outline-none"
                      value={draft.title}
                      disabled={!canWrite}
                      onChange={(event) => handleChange(todo.id, 'title', event.target.value)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      className="w-full rounded border border-slate-300 px-2 py-1 text-sm focus:border-sky-500 focus:outline-none"
                      value={draft.accomplished ?? ''}
                      disabled={!canWrite}
                      onChange={(event) => handleChange(todo.id, 'accomplished', event.target.value)}
                    />
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-500">
                    {new Date(todo.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="date"
                      className="w-full rounded border border-slate-300 px-2 py-1 text-sm focus:border-sky-500 focus:outline-none"
                      value={draft.expected_end_date ?? ''}
                      disabled={!canWrite}
                      onChange={(event) => handleChange(todo.id, 'expected_end_date', event.target.value)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <select
                      className="w-full rounded border border-slate-300 px-2 py-1 text-sm focus:border-sky-500 focus:outline-none"
                      value={draft.status}
                      disabled={!canWrite}
                      onChange={(event) => handleChange(todo.id, 'status', event.target.value)}
                    >
                      {todoStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      {canWrite && (
                        <button
                          className="rounded border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                          onClick={() => onUpdate({ ...draft, expected_end_date: draft.expected_end_date ?? null })}
                        >
                          저장
                        </button>
                      )}
                      {canDelete && (
                        <button
                          className="rounded border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                          onClick={() => onDelete(todo.id)}
                        >
                          삭제
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!todos.length && <p className="py-4 text-sm text-slate-500">등록된 TODO가 없습니다.</p>}
      </div>
    </Modal>
  );
};

export default AllTodoModal;
