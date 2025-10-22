import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { Settings } from '../types';

type SettingsModalProps = {
  open: boolean;
  settings: Settings | null;
  onClose: () => void;
  onSave: (settings: Settings) => void;
};

const SettingsModal: React.FC<SettingsModalProps> = ({ open, settings, onClose, onSave }) => {
  const [form, setForm] = useState<Settings>({
    session_timeout_minutes: '10',
    highlight_color: '#3182ce',
    memo_font_size: '14',
    attachment_root: 'C:/dlab-gantt/attachments',
  });

  useEffect(() => {
    if (settings) {
      setForm(settings);
    }
  }, [settings]);

  return (
    <Modal open={open} onClose={onClose} title="시스템 설정" widthClass="max-w-xl">
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          onSave(form);
        }}
      >
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-600">세션 유지 시간(분)</label>
          <input
            type="number"
            min={1}
            className="w-full rounded border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none"
            value={form.session_timeout_minutes}
            onChange={(event) => setForm((prev) => ({ ...prev, session_timeout_minutes: event.target.value }))}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-600">하이라이트 색상</label>
          <input
            type="color"
            className="h-10 w-20 cursor-pointer rounded border border-slate-300"
            value={form.highlight_color}
            onChange={(event) => setForm((prev) => ({ ...prev, highlight_color: event.target.value }))}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-600">메모 폰트 크기</label>
          <input
            type="number"
            min={10}
            className="w-full rounded border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none"
            value={form.memo_font_size}
            onChange={(event) => setForm((prev) => ({ ...prev, memo_font_size: event.target.value }))}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-600">첨부파일 저장 경로</label>
          <input
            className="w-full rounded border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none"
            value={form.attachment_root}
            onChange={(event) => setForm((prev) => ({ ...prev, attachment_root: event.target.value }))}
          />
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
            저장
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SettingsModal;
