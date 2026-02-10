"use client";

import { useRef, useEffect, useState } from "react";
import { DotGrid } from "../lib/dotArt";
import { HistoryItem, deleteHistoryItem, clearHistory } from "../lib/history";
import { renderDotGrid } from "../lib/canvasRenderer";
import { Trash2 } from "lucide-react";

interface HistoryPanelProps {
  history: HistoryItem[];
  onLoad: (item: HistoryItem) => void;
  onHistoryChange: (items: HistoryItem[]) => void;
}

function HistoryThumbnail({
  item,
  onLoad,
  onDelete,
  isDefault,
}: {
  item: HistoryItem;
  onLoad: () => void;
  onDelete: () => void;
  isDefault: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    renderDotGrid(canvasRef.current, item.grid, {
      dotSize: 4,
      gap: 0,
      dotShape: "square",
      bgColor: "#F9FAFB",
    });
  }, [item.grid]);

  return (
    <div className="group relative shrink-0">
      <button
        onClick={onLoad}
        className="flex flex-col items-center gap-1 rounded-xl border border-gray-100 bg-gray-50 p-1.5 hover:border-indigo-300 hover:bg-indigo-50 transition-all w-[72px]"
      >
        <canvas
          ref={canvasRef}
          className="w-14 h-14"
          style={{ imageRendering: "pixelated" }}
        />
        <span className="text-[9px] text-gray-500 truncate w-full text-center leading-tight">
          {item.label}
        </span>
      </button>
      {!isDefault && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute -top-1 -right-1 hidden group-hover:flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[10px] shadow-md hover:bg-red-600 transition-colors"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default function HistoryPanel({
  history,
  onLoad,
  onHistoryChange,
}: HistoryPanelProps) {
  const [clearClickCount, setClearClickCount] = useState(0);

  if (history.length === 0) return null;

  const isAllDefault = history.every((item) => item.id.startsWith("default-"));
  const hasUserItems = history.some((item) => !item.id.startsWith("default-"));

  const handleDelete = (id: string) => {
    onHistoryChange(deleteHistoryItem(history, id));
  };

  const handleClear = () => {
    if (clearClickCount === 0) {
      setClearClickCount(1);
      setTimeout(() => setClearClickCount(0), 2000);
    } else {
      onHistoryChange(clearHistory());
      setClearClickCount(0);
    }
  };

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-gray-100 flex flex-col h-full">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-100 shrink-0">
        <h3 className="text-xs font-semibold text-gray-700">
          {isAllDefault ? "예시" : `히스토리`}
        </h3>
        {hasUserItems && (
          <button
            onClick={handleClear}
            className="text-gray-300 hover:text-red-500 transition-colors"
            title={clearClickCount === 1 ? "한번 더 클릭하여 확인" : "전체 삭제"}
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {/* 썸네일 리스트 (세로 스크롤) */}
      <div className="flex flex-col items-center gap-2 p-2 overflow-y-auto flex-1 min-h-0">
        {history.map((item) => (
          <HistoryThumbnail
            key={item.id}
            item={item}
            isDefault={item.id.startsWith("default-")}
            onLoad={() => onLoad(item)}
            onDelete={() => handleDelete(item.id)}
          />
        ))}
      </div>

      {/* 개수 표시 */}
      <div className="px-3 py-1.5 border-t border-gray-100 shrink-0">
        <span className="text-[10px] text-gray-400 block text-center">{history.length}개</span>
      </div>
    </div>
  );
}
