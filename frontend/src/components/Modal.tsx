import React from 'react';

interface ModalProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  widthClass?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, title, onClose, widthClass = 'max-w-3xl', children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className={`w-full ${widthClass} overflow-hidden rounded-xl bg-white shadow-xl`}>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          <button onClick={onClose} className="text-slate-500 transition hover:text-slate-700">
            ✕
          </button>
        </div>
        <div className="max-h-[80vh] overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
