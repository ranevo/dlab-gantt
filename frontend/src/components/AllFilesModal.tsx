import React, { useMemo, useState } from 'react';
import Modal from './Modal';
import { FileAttachment } from '../types';

type AllFilesModalProps = {
  open: boolean;
  files: (FileAttachment & { path: string })[];
  onClose: () => void;
};

const AllFilesModal: React.FC<AllFilesModalProps> = ({ open, files, onClose }) => {
  const [filter, setFilter] = useState('전체');

  const options = useMemo(() => {
    const set = new Set<string>();
    files.forEach((file) => {
      set.add(file.path || '미지정');
    });
    return ['전체', ...Array.from(set)];
  }, [files]);

  const filtered = useMemo(() => {
    if (filter === '전체') return files;
    return files.filter((file) => file.path === filter);
  }, [files, filter]);

  return (
    <Modal open={open} onClose={onClose} title="전체 첨부파일" widthClass="max-w-4xl">
      <div className="mb-4 flex items-center justify-between">
        <label className="text-sm text-slate-600">
          경로 필터
          <select
            className="ml-2 rounded border border-slate-300 px-3 py-1 text-sm focus:border-sky-500 focus:outline-none"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="space-y-2">
        {filtered.map((file) => (
          <div key={file.id} className="rounded border border-slate-200 p-3 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-700">{file.original_name}</div>
                <div className="text-xs text-slate-500">{file.path}</div>
              </div>
              <div className="text-xs text-slate-400">{new Date(file.uploaded_at).toLocaleString()}</div>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              경로: {file.storage_path}
            </div>
          </div>
        ))}
        {!filtered.length && <p className="text-sm text-slate-500">해당 조건에 맞는 첨부파일이 없습니다.</p>}
      </div>
    </Modal>
  );
};

export default AllFilesModal;
