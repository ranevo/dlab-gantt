import React, { useState } from 'react';
import { FileAttachment, Todo, TreeNode } from '../types';

const todoStatuses = ['예정', '진행', '중단', '처리', '완료'];

type DetailPanelProps = {
  node: TreeNode | null;
  memo: string;
  onSaveMemo: (content: string) => void;
  memoFontSize: number;
  todos: Todo[];
  onCreateTodo: (todo: { title: string; accomplished: string; expected_end_date: string | null; status: string }) => void;
  onUpdateTodo: (id: number, todo: { title: string; accomplished: string; expected_end_date: string | null; status: string }) => void;
  onDeleteTodo: (id: number) => void;
  files: FileAttachment[];
  onUploadFile: (file: File) => void;
  onDeleteFile: (id: number) => void;
  canWrite: boolean;
  canDelete: boolean;
};

const DetailPanel: React.FC<DetailPanelProps> = ({
  node,
  memo,
  onSaveMemo,
  memoFontSize,
  todos,
  onCreateTodo,
  onUpdateTodo,
  onDeleteTodo,
  files,
  onUploadFile,
  onDeleteFile,
  canWrite,
  canDelete,
}) => {
  const [memoContent, setMemoContent] = useState(memo);
  const [newTodo, setNewTodo] = useState({ title: '', accomplished: '', expected_end_date: '', status: '예정' });
  const [editingTodos, setEditingTodos] = useState<Record<number, Todo>>({});

  React.useEffect(() => {
    setMemoContent(memo);
  }, [memo, node?.id]);

  React.useEffect(() => {
    setEditingTodos({});
  }, [node?.id]);

  const handleTodoChange = (id: number, field: keyof Todo, value: string) => {
    setEditingTodos((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || todos.find((todo) => todo.id === id)!),
        [field]: value,
      },
    }));
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUploadFile(file);
      event.target.value = '';
    }
  };

  if (!node) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-slate-500">
        좌측 트리에서 항목을 선택하면 상세정보가 표시됩니다.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-800">메모</h3>
          {canWrite && (
            <button
              onClick={() => onSaveMemo(memoContent)}
              className="rounded bg-sky-600 px-3 py-1 text-sm font-semibold text-white hover:bg-sky-700"
            >
              메모 저장
            </button>
          )}
        </div>
        <textarea
          value={memoContent}
          onChange={(event) => setMemoContent(event.target.value)}
          disabled={!canWrite}
          style={{ fontSize: memoFontSize }}
          className="h-40 w-full resize-none rounded border border-slate-300 p-3 focus:border-sky-500 focus:outline-none disabled:bg-slate-100"
        />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-800">TODO</h3>
        </div>
        {canWrite && (
          <form
            className="mb-4 grid grid-cols-1 gap-3 text-sm md:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              onCreateTodo({
                title: newTodo.title,
                accomplished: newTodo.accomplished,
                expected_end_date: newTodo.expected_end_date || null,
                status: newTodo.status,
              });
              setNewTodo({ title: '', accomplished: '', expected_end_date: '', status: '예정' });
            }}
          >
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">해야할 일</label>
              <input
                className="w-full rounded border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none"
                value={newTodo.title}
                onChange={(event) => setNewTodo((prev) => ({ ...prev, title: event.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">수행한 일</label>
              <input
                className="w-full rounded border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none"
                value={newTodo.accomplished}
                onChange={(event) => setNewTodo((prev) => ({ ...prev, accomplished: event.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">예상 종료일</label>
              <input
                type="date"
                className="w-full rounded border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none"
                value={newTodo.expected_end_date}
                onChange={(event) => setNewTodo((prev) => ({ ...prev, expected_end_date: event.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">상태</label>
              <select
                className="w-full rounded border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none"
                value={newTodo.status}
                onChange={(event) => setNewTodo((prev) => ({ ...prev, status: event.target.value }))}
              >
                {todoStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full rounded bg-sky-600 py-2 text-sm font-semibold text-white hover:bg-sky-700"
              >
                TODO 추가
              </button>
            </div>
          </form>
        )}
        <div className="space-y-3">
          {todos.map((todo) => {
            const edit = editingTodos[todo.id] || todo;
            return (
              <div key={todo.id} className="rounded border border-slate-200 p-3 text-sm">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500">해야할 일</label>
                    <input
                      className="w-full rounded border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none"
                      value={edit.title}
                      disabled={!canWrite}
                      onChange={(event) => handleTodoChange(todo.id, 'title', event.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500">수행한 일</label>
                    <input
                      className="w-full rounded border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none"
                      value={edit.accomplished ?? ''}
                      disabled={!canWrite}
                      onChange={(event) => handleTodoChange(todo.id, 'accomplished', event.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500">예상 종료일</label>
                    <input
                      type="date"
                      className="w-full rounded border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none"
                      value={edit.expected_end_date ?? ''}
                      disabled={!canWrite}
                      onChange={(event) => handleTodoChange(todo.id, 'expected_end_date', event.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500">상태</label>
                    <select
                      className="w-full rounded border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none"
                      value={edit.status}
                      disabled={!canWrite}
                      onChange={(event) => handleTodoChange(todo.id, 'status', event.target.value)}
                    >
                      {todoStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>등록일: {new Date(todo.created_at).toLocaleDateString()}</span>
                  <div className="flex gap-2">
                    {canWrite && (
                      <button
                        className="rounded border border-slate-300 px-3 py-1 text-slate-600 hover:bg-slate-100"
                        onClick={() =>
                          onUpdateTodo(todo.id, {
                            title: edit.title,
                            accomplished: edit.accomplished ?? '',
                            expected_end_date: edit.expected_end_date ?? null,
                            status: edit.status,
                          })
                        }
                      >
                        저장
                      </button>
                    )}
                    {canDelete && (
                      <button
                        className="rounded border border-red-200 px-3 py-1 text-red-600 hover:bg-red-50"
                        onClick={() => onDeleteTodo(todo.id)}
                      >
                        삭제
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {!todos.length && <p className="text-sm text-slate-500">등록된 TODO가 없습니다.</p>}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-800">첨부파일</h3>
          {canWrite && (
            <label className="cursor-pointer rounded bg-slate-800 px-3 py-1 text-sm font-semibold text-white hover:bg-slate-900">
              파일 업로드
              <input type="file" className="hidden" onChange={handleUpload} />
            </label>
          )}
        </div>
        <div className="space-y-2 text-sm">
          {files.map((file) => (
            <div key={file.id} className="flex items-center justify-between rounded border border-slate-200 px-3 py-2">
              <div className="flex flex-col">
                <span className="font-medium text-slate-700">{file.original_name}</span>
                <span className="text-xs text-slate-500">
                  {Math.round(file.file_size / 1024)} KB · {file.mime_type}
                </span>
                <span className="text-xs text-slate-400">{file.storage_path}</span>
              </div>
              {canDelete && (
                <button
                  className="rounded border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                  onClick={() => onDeleteFile(file.id)}
                >
                  삭제
                </button>
              )}
            </div>
          ))}
          {!files.length && <p className="text-sm text-slate-500">첨부파일이 없습니다.</p>}
        </div>
      </section>
    </div>
  );
};

export default DetailPanel;
