import React from 'react';
import Modal from './Modal';
import { AdminUser } from '../types';

type AdminSettingsModalProps = {
  open: boolean;
  users: AdminUser[];
  onClose: () => void;
  onUpdateStatus: (id: number, status: AdminUser['status']) => void;
  onUpdatePermissions: (id: number, permissions: { read: boolean; write: boolean; delete: boolean }) => void;
};

const statusOptions: AdminUser['status'][] = ['pending', 'active', 'disabled'];

const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({
  open,
  users,
  onClose,
  onUpdateStatus,
  onUpdatePermissions,
}) => {
  return (
    <Modal open={open} onClose={onClose} title="관리자 설정" widthClass="max-w-4xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="bg-slate-100 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2 text-left">이메일</th>
              <th className="px-3 py-2 text-left">별칭</th>
              <th className="px-3 py-2 text-left">상태</th>
              <th className="px-3 py-2 text-center">읽기</th>
              <th className="px-3 py-2 text-center">쓰기</th>
              <th className="px-3 py-2 text-center">삭제</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-slate-200">
                <td className="px-3 py-2">
                  <div className="font-semibold text-slate-700">{user.email}</div>
                  {user.is_admin ? <div className="text-xs text-sky-600">관리자</div> : null}
                </td>
                <td className="px-3 py-2">{user.alias}</td>
                <td className="px-3 py-2">
                  <select
                    value={user.status}
                    onChange={(event) => onUpdateStatus(user.id, event.target.value as AdminUser['status'])}
                    className="w-full rounded border border-slate-300 px-2 py-1 text-sm focus:border-sky-500 focus:outline-none"
                    disabled={Boolean(user.is_admin)}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={Boolean(user.can_read)}
                    disabled={Boolean(user.is_admin)}
                    onChange={(event) =>
                      onUpdatePermissions(user.id, {
                        read: event.target.checked,
                        write: Boolean(user.can_write),
                        delete: Boolean(user.can_delete),
                      })
                    }
                  />
                </td>
                <td className="px-3 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={Boolean(user.can_write)}
                    disabled={Boolean(user.is_admin)}
                    onChange={(event) =>
                      onUpdatePermissions(user.id, {
                        read: Boolean(user.can_read),
                        write: event.target.checked,
                        delete: Boolean(user.can_delete),
                      })
                    }
                  />
                </td>
                <td className="px-3 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={Boolean(user.can_delete)}
                    disabled={Boolean(user.is_admin)}
                    onChange={(event) =>
                      onUpdatePermissions(user.id, {
                        read: Boolean(user.can_read),
                        write: Boolean(user.can_write),
                        delete: event.target.checked,
                      })
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!users.length && <p className="py-4 text-sm text-slate-500">등록된 사용자가 없습니다.</p>}
      </div>
    </Modal>
  );
};

export default AdminSettingsModal;
