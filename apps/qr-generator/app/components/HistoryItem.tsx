'use client';

import { QrCode } from 'lucide-react';
import type { HistoryEntry } from '../lib/history';

interface HistoryItemProps {
  entry: HistoryEntry;
  onClick: (content: string) => void;
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

export default function HistoryItem({ entry, onClick }: HistoryItemProps) {
  return (
    <button
      onClick={() => onClick(entry.content)}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-100 transition-colors text-left cursor-pointer"
    >
      <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center shrink-0">
        <QrCode className="w-4 h-4 text-[var(--qr-primary)]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-zinc-800 truncate">{entry.content}</p>
        <p className="text-xs text-zinc-400">{timeAgo(entry.createdAt)}</p>
      </div>
    </button>
  );
}
