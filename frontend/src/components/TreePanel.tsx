import React from 'react';
import { TreeNode } from '../types';
import clsx from 'clsx';

export type TreePanelProps = {
  nodes: TreeNode[];
  collapsed: Set<number>;
  onToggle: (id: number) => void;
  onSelect: (node: TreeNode) => void;
  selectedNodeId: number | null;
  highlightColor: string;
  onAddChild: (node: TreeNode) => void;
  onEdit: (node: TreeNode) => void;
  onDelete: (node: TreeNode) => void;
  canWrite: boolean;
  canDelete: boolean;
};

const levelLabel: Record<TreeNode['level'], string> = {
  project: '프로젝트',
  major: '대분류',
  medium: '중분류',
  task: '작업',
};

const indentPx: Record<TreeNode['level'], number> = {
  project: 0,
  major: 16,
  medium: 32,
  task: 48,
};

const TreePanel: React.FC<TreePanelProps> = ({
  nodes,
  collapsed,
  onToggle,
  onSelect,
  selectedNodeId,
  highlightColor,
  onAddChild,
  onEdit,
  onDelete,
  canWrite,
  canDelete,
}) => {
  const renderNode = (node: TreeNode) => {
    const isCollapsed = collapsed.has(node.id);
    const hasChildren = !!node.children?.length;
    const isSelected = node.id === selectedNodeId;
    const assigneeNames = node.assignees.map((a) => a.alias).join(', ');

    return (
      <div key={node.id}>
        <div
          className={clsx(
            'flex cursor-pointer items-center justify-between rounded px-3 py-2 text-sm transition',
            isSelected ? 'bg-sky-50' : 'hover:bg-slate-100'
          )}
          style={{
            border: isSelected ? `2px solid ${highlightColor}` : '1px solid transparent',
            marginLeft: indentPx[node.level],
          }}
          onClick={() => onSelect(node)}
        >
          <div className="flex flex-1 items-center gap-2">
            {hasChildren && (
              <button
                type="button"
                className="text-xs font-semibold text-slate-500"
                onClick={(event) => {
                  event.stopPropagation();
                  onToggle(node.id);
                }}
              >
                {isCollapsed ? '▶' : '▼'}
              </button>
            )}
            {!hasChildren && <span className="w-3" />}
            <div className="flex flex-col">
              <span className="font-medium text-slate-800">{node.name}</span>
              <span className="text-xs text-slate-500">
                {levelLabel[node.level]}
                {node.status_name ? ` · ${node.status_name}` : ''}
                {assigneeNames ? ` · 담당: ${assigneeNames}` : ''}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            {node.start_date && node.end_date && (
              <span className="rounded bg-slate-100 px-2 py-1 text-slate-600">
                {node.start_date} ~ {node.end_date}
              </span>
            )}
            {canWrite && (
              <button
                type="button"
                className="rounded border border-slate-300 px-2 py-1 text-slate-600 hover:bg-slate-200"
                onClick={(event) => {
                  event.stopPropagation();
                  onAddChild(node);
                }}
              >
                추가
              </button>
            )}
            {canWrite && (
              <button
                type="button"
                className="rounded border border-slate-300 px-2 py-1 text-slate-600 hover:bg-slate-200"
                onClick={(event) => {
                  event.stopPropagation();
                  onEdit(node);
                }}
              >
                수정
              </button>
            )}
            {canDelete && (
              <button
                type="button"
                className="rounded border border-red-200 px-2 py-1 text-red-600 hover:bg-red-50"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(node);
                }}
              >
                삭제
              </button>
            )}
          </div>
        </div>
        {!isCollapsed && node.children?.map((child) => renderNode(child))}
      </div>
    );
  };

  return (
    <div className="space-y-1 overflow-y-auto pr-2">{nodes.map((node) => renderNode(node))}</div>
  );
};

export default TreePanel;
