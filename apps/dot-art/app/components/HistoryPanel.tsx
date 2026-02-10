"use client";

import { useRef, useEffect, useState } from "react";
import { DotGrid } from "../lib/dotArt";
import { HistoryItem, deleteHistoryItem, clearHistory } from "../lib/history";
import { renderDotGrid } from "../lib/canvasRenderer";

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

  const modeLabel = item.mode === "pro" ? "Pro" : item.mode === "editor" ? "Edit" : "Auto";

  return (
    <div className="group relative">
      <button
        onClick={onLoad}
        className="w-full flex flex-col items-center gap-1 rounded-xl border border-gray-100 bg-gray-50 p-2 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
      >
        <canvas
          ref={canvasRef}
          className="w-14 h-14"
          style={{ imageRendering: "pixelated" }}
        />
        <span className="text-[10px] text-gray-600 truncate w-full text-center">
          {item.label}
        </span>
        <span className="text-[9px] text-gray-400">
          {isDefault ? `${modeLabel} · 예시` : `${modeLabel} · ${item.gridSize}px`}
        </span>
      </button>
      {!isDefault && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute -top-1.5 -right-1.5 hidden group-hover:flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs shadow-md hover:bg-red-600 transition-colors"
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
    <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">
          {isAllDefault ? "AI 예시 갤러리" : `히스토리 (${history.length})`}
        </h3>
        {hasUserItems && (
          <button
            onClick={handleClear}
            className="text-[11px] text-gray-400 hover:text-red-500 transition-colors"
          >
            {clearClickCount === 1 ? "한번 더 클릭하여 확인" : "전체 삭제"}
          </button>
        )}
      </div>
      <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto">
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
    </div>
  );
}
