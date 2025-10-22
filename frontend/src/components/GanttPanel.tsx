import React, { useEffect, useMemo, useRef } from 'react';
import { differenceInCalendarDays, eachDayOfInterval, format, parseISO } from 'date-fns';
import { TreeNode } from '../types';
import clsx from 'clsx';

export type GanttPanelProps = {
  nodes: TreeNode[];
  selectedNodeId: number | null;
  dayWidth: number;
  onScrollSync?: (scrollLeft: number) => void;
  externalScrollLeft?: number;
};

const getDateRange = (nodes: TreeNode[]) => {
  const dates = nodes
    .filter((node) => node.start_date && node.end_date)
    .map((node) => ({ start: parseISO(node.start_date!), end: parseISO(node.end_date!) }));
  if (!dates.length) {
    const today = new Date();
    const start = new Date(today);
    start.setDate(start.getDate() - 7);
    const end = new Date(today);
    end.setDate(end.getDate() + 7);
    return { start, end };
  }
  const start = dates.reduce((min, current) => (current.start < min ? current.start : min), dates[0].start);
  const end = dates.reduce((max, current) => (current.end > max ? current.end : max), dates[0].end);
  return { start, end };
};

const GanttPanel: React.FC<GanttPanelProps> = ({ nodes, selectedNodeId, dayWidth, onScrollSync, externalScrollLeft }) => {
  const { start, end } = useMemo(() => getDateRange(nodes), [nodes]);
  const days = useMemo(() => eachDayOfInterval({ start, end }), [start, end]);
  const today = new Date();
  const bodyRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current && typeof externalScrollLeft === 'number') {
      bodyRef.current.scrollLeft = externalScrollLeft;
    }
    if (headerRef.current && typeof externalScrollLeft === 'number') {
      headerRef.current.scrollLeft = externalScrollLeft;
    }
  }, [externalScrollLeft]);

  const totalWidth = Math.max(days.length * dayWidth, 600);
  const rangeStart = start;

  const renderRow = (node: TreeNode) => {
    let content: React.ReactNode = null;
    if (node.start_date && node.end_date) {
      const startDate = parseISO(node.start_date);
      const endDate = parseISO(node.end_date);
      const offset = Math.max(0, differenceInCalendarDays(startDate, rangeStart));
      const duration = differenceInCalendarDays(endDate, startDate) + 1;
      const left = offset * dayWidth;
      const width = Math.max(dayWidth, duration * dayWidth);
      const isSelected = node.id === selectedNodeId;
      const percent = Math.min(
        100,
        Math.max(
          0,
          (differenceInCalendarDays(today, startDate) / Math.max(1, differenceInCalendarDays(endDate, startDate))) * 100
        )
      );
      const todayOffset = differenceInCalendarDays(today, startDate);
      const showToday = today >= startDate && today <= endDate;

      content = (
        <div
          className={clsx('absolute top-4 h-8 rounded-md border px-2 py-1 text-xs text-white', {
            'border-2 border-slate-800 shadow-lg': isSelected,
          })}
          style={{
            left,
            width,
            backgroundColor: node.status_color || '#64748b',
          }}
        >
          <div className="flex justify-between text-[11px] font-semibold">
            <span>{node.start_date}</span>
            <span>{node.end_date}</span>
          </div>
          {showToday && (
            <div
              className="absolute bottom-0 top-0 border-l-2 border-dashed border-white"
              style={{ left: Math.max(0, Math.min(width, todayOffset * dayWidth)) }}
            >
              <span className="absolute -left-6 -top-5 rounded bg-white px-2 text-[10px] font-bold text-slate-700">
                {percent.toFixed(0)}%
              </span>
            </div>
          )}
        </div>
      );
    }

    return (
      <div key={node.id} className="relative" style={{ height: 44 }}>
        {content}
      </div>
    );
  };

  const renderHeader = () => {
    const months: { key: string; label: string; width: number }[] = [];
    let currentMonth = '';
    let currentWidth = 0;

    days.forEach((day) => {
      const key = format(day, 'yyyy-MM');
      if (currentMonth && key !== currentMonth) {
        months.push({ key: currentMonth, label: format(parseISO(`${currentMonth}-01`), 'yyyy년 MM월'), width: currentWidth });
        currentWidth = 0;
      }
      currentMonth = key;
      currentWidth += dayWidth;
    });
    if (currentMonth) {
      months.push({ key: currentMonth, label: format(parseISO(`${currentMonth}-01`), 'yyyy년 MM월'), width: currentWidth });
    }

    return (
      <div className="sticky top-0 z-10 bg-white">
        <div ref={headerRef} className="overflow-x-auto">
          <div style={{ width: totalWidth }}>
            <div className="flex border-b border-slate-200">
              {months.map((month) => (
                <div key={month.key} style={{ width: month.width }} className="border-r border-slate-200 px-2 py-1 text-xs">
                  {month.label}
                </div>
              ))}
            </div>
            <div className="flex text-[11px]">
              {days.map((day) => (
                <div
                  key={day.toISOString()}
                  style={{ width: dayWidth }}
                  className="border-r border-slate-100 px-1 py-1 text-center text-slate-500"
                >
                  <div>{format(day, 'dd')}</div>
                  <div className="text-[10px] text-slate-400">{format(day, 'EEE')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col">
      {renderHeader()}
      <div
        ref={bodyRef}
        className="h-full overflow-auto"
        onScroll={(event) => {
          const scrollLeft = (event.target as HTMLDivElement).scrollLeft;
          if (headerRef.current) {
            headerRef.current.scrollLeft = scrollLeft;
          }
          onScrollSync?.(scrollLeft);
        }}
      >
        <div style={{ width: totalWidth }}>
          {nodes.map((node) => renderRow(node))}
        </div>
      </div>
    </div>
  );
};

export default GanttPanel;
