"use client";

import { useState, useCallback, useRef } from "react";
import { Pencil, Eraser, PaintBucket, Pipette, FlipHorizontal, FlipVertical, Trash2, Undo2, Redo2 } from "lucide-react";
import { DotGrid } from "../lib/dotArt";
import { Tool, setCell, floodFill, mirrorHorizontal, mirrorVertical, clearGrid } from "../lib/gridUtils";
import ColorPalette from "./ColorPalette";

interface GridEditorProps {
  grid: DotGrid;
  palette: string[];
  onGridUpdate: (grid: DotGrid) => void;
}

const TOOLS: { id: Tool; label: string; icon: typeof Pencil }[] = [
  { id: "pencil", label: "연필", icon: Pencil },
  { id: "eraser", label: "지우개", icon: Eraser },
  { id: "bucket", label: "페인트통", icon: PaintBucket },
  { id: "eyedropper", label: "스포이드", icon: Pipette },
];

export default function GridEditor({ grid, palette, onGridUpdate }: GridEditorProps) {
  const [tool, setTool] = useState<Tool>("pencil");
  const [color, setColor] = useState(palette[0] || "#000000");
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<DotGrid[]>([]);
  const [future, setFuture] = useState<DotGrid[]>([]);
  const lastCellRef = useRef<string | null>(null);

  const gridSize = grid.length;
  const cellSize = Math.max(8, Math.min(24, Math.floor(480 / gridSize)));

  const pushHistory = useCallback((prevGrid: DotGrid) => {
    setHistory((h) => [...h.slice(-50), prevGrid]);
    setFuture([]);
  }, []);

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setFuture((f) => [...f, grid]);
    setHistory((h) => h.slice(0, -1));
    onGridUpdate(prev);
  }, [history, grid, onGridUpdate]);

  const handleRedo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[future.length - 1];
    setHistory((h) => [...h, grid]);
    setFuture((f) => f.slice(0, -1));
    onGridUpdate(next);
  }, [future, grid, onGridUpdate]);

  const applyCellAction = useCallback(
    (row: number, col: number) => {
      const cellKey = `${row}-${col}`;
      if (tool === "pencil" || tool === "eraser") {
        if (lastCellRef.current === cellKey) return;
        lastCellRef.current = cellKey;
      }

      switch (tool) {
        case "pencil": {
          const newGrid = setCell(grid, row, col, color);
          onGridUpdate(newGrid);
          break;
        }
        case "eraser": {
          const newGrid = setCell(grid, row, col, null);
          onGridUpdate(newGrid);
          break;
        }
        case "bucket": {
          pushHistory(grid);
          const newGrid = floodFill(grid, row, col, color);
          onGridUpdate(newGrid);
          break;
        }
        case "eyedropper": {
          const cellColor = grid[row]?.[col];
          if (cellColor) {
            setColor(cellColor);
            setTool("pencil");
          }
          break;
        }
      }
    },
    [tool, color, grid, onGridUpdate, pushHistory]
  );

  const handleMouseDown = useCallback(
    (row: number, col: number) => {
      if (tool === "pencil" || tool === "eraser") {
        pushHistory(grid);
      }
      setIsDrawing(true);
      lastCellRef.current = null;
      applyCellAction(row, col);
    },
    [tool, grid, pushHistory, applyCellAction]
  );

  const handleMouseEnter = useCallback(
    (row: number, col: number) => {
      if (!isDrawing) return;
      applyCellAction(row, col);
    },
    [isDrawing, applyCellAction]
  );

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
    lastCellRef.current = null;
  }, []);

  return (
    <div className="space-y-4">
      {/* 도구 바 */}
      <div className="flex items-center gap-2 flex-wrap">
        {TOOLS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                tool === t.id
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              title={t.label}
            >
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}

        <div className="w-px h-6 bg-gray-200 mx-1" />

        <button onClick={handleUndo} disabled={history.length === 0}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-30" title="실행 취소">
          <Undo2 size={14} />
        </button>
        <button onClick={handleRedo} disabled={future.length === 0}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-30" title="다시 실행">
          <Redo2 size={14} />
        </button>

        <div className="w-px h-6 bg-gray-200 mx-1" />

        <button
          onClick={() => { pushHistory(grid); onGridUpdate(mirrorHorizontal(grid)); }}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100" title="좌우 반전"
        >
          <FlipHorizontal size={14} />
        </button>
        <button
          onClick={() => { pushHistory(grid); onGridUpdate(mirrorVertical(grid)); }}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100" title="상하 반전"
        >
          <FlipVertical size={14} />
        </button>
        <button
          onClick={() => { pushHistory(grid); onGridUpdate(clearGrid(grid)); }}
          className="rounded-lg p-2 text-red-400 hover:bg-red-50" title="전체 지우기"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* 현재 색상 */}
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg border-2 border-gray-300"
          style={{ backgroundColor: color }}
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-8 h-8 cursor-pointer"
        />
        <span className="text-xs font-mono text-gray-400">{color}</span>
      </div>

      {/* 팔레트 */}
      <ColorPalette colors={palette} selectedColor={color} onColorSelect={setColor} />

      {/* 그리드 */}
      <div
        className="inline-block border border-gray-200 rounded-lg overflow-hidden select-none"
        style={{ cursor: tool === "eyedropper" ? "crosshair" : tool === "bucket" ? "crosshair" : "pointer" }}
        onMouseLeave={handleMouseUp}
        onMouseUp={handleMouseUp}
      >
        {grid.map((row, r) => (
          <div key={r} className="flex">
            {row.map((cell, c) => (
              <div
                key={c}
                style={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: cell ?? "transparent",
                  backgroundImage: cell ? undefined : "linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%), linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%)",
                  backgroundSize: `${cellSize / 2}px ${cellSize / 2}px`,
                  backgroundPosition: cell ? undefined : `0 0, ${cellSize / 4}px ${cellSize / 4}px`,
                }}
                className="border-r border-b border-gray-100 last:border-r-0"
                onMouseDown={() => handleMouseDown(r, c)}
                onMouseEnter={() => handleMouseEnter(r, c)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
