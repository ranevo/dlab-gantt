import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { Status } from '../types';

type StatusManagerModalProps = {
  open: boolean;
  statuses: Status[];
  onClose: () => void;
  onCreate: (status: { name: string; color: string }) => void;
  onUpdate: (id: number, status: { name: string; color: string }) => void;
  onDelete: (id: number) => void;
};

const StatusManagerModal: React.FC<StatusManagerModalProps> = ({
  open,
  statuses,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
}) => {
  const [newStatus, setNewStatus] = useState({ name: '', color: '#3182ce' });
  const [drafts, setDrafts] = useState<Record<number, { name: string; color: string }>>({});

  useEffect(() => {
    const map: Record<number, { name: string; color: string }> = {};
    statuses.forEach((status) => {
      map[status.id] = { name: status.name, color: status.color };
    });
    setDrafts(map);
  }, [statuses, open]);

  return (
    <Modal open={open} onClose={onClose} title="진행상태 관리" widthClass="max-w-3xl">
      <div className="space-y-4">
        <form
          className="flex flex-wrap items-end gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            onCreate(newStatus);
            setNewStatus({ name: '', color: '#3182ce' });
          }}
        >
          <div className="flex flex-col">
            <label className="mb-1 text-xs font-semibold text-slate-600">상태명</label>
            <input
              className="rounded border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
              value={newStatus.name}
              required
              onChange={(event) => setNewStatus((prev) => ({ ...prev, name: event.target.value }))}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-xs font-semibold text-slate-600">색상</label>
            <input
              type="color"
              className="h-10 w-20 cursor-pointer rounded border border-slate-300"
              value={newStatus.color}
              onChange={(event) => setNewStatus((prev) => ({ ...prev, color: event.target.value }))}
            />
          </div>
          <button
            type="submit"
            className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
          >
            추가
          </button>
        </form>

        <div className="space-y-2">
          {statuses.map((status) => {
            const draft = drafts[status.id] || { name: status.name, color: status.color };
            return (
              <div key={status.id} className="flex items-center justify-between rounded border border-slate-200 px-3 py-2">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    className="rounded border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
                    value={draft.name}
                    onChange={(event) =>
                      setDrafts((prev) => ({
                        ...prev,
                        [status.id]: { ...draft, name: event.target.value },
                      }))
                    }
                  />
                  <input
                    type="color"
                    className="h-10 w-20 cursor-pointer rounded border border-slate-300"
                    value={draft.color}
                    onChange={(event) =>
                      setDrafts((prev) => ({
                        ...prev,
                        [status.id]: { ...draft, color: event.target.value },
                      }))
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="rounded border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                    onClick={() => onUpdate(status.id, draft)}
                  >
                    저장
                  </button>
                  <button
                    className="rounded border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                    onClick={() => onDelete(status.id)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            );
          })}
          {!statuses.length && <p className="text-sm text-slate-500">등록된 진행상태가 없습니다.</p>}
        </div>
      </div>
    </Modal>
  );
};

export default StatusManagerModal;
