"use client";

import { useState, useRef, useEffect } from "react";
import { DotGrid } from "../lib/dotArt";
import { PRESETS } from "../lib/presets";
import { renderDotGrid } from "../lib/canvasRenderer";

interface PresetGalleryProps {
  onSelect: (grid: DotGrid) => void;
}

const CATEGORIES = ["전체", "동물", "자연", "사물", "표정", "기호", "음식"];

function PresetThumbnail({ grid, name, onClick }: { grid: DotGrid; name: string; onClick: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    renderDotGrid(canvasRef.current, grid, {
      dotSize: 4,
      gap: 0,
      dotShape: "square",
      bgColor: "#F9FAFB",
    });
  }, [grid]);

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-100 bg-gray-50 p-3 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
    >
      <canvas
        ref={canvasRef}
        className="w-16 h-16"
        style={{ imageRendering: "pixelated" }}
      />
      <span className="text-xs text-gray-500">{name}</span>
    </button>
  );
}

export default function PresetGallery({ onSelect }: PresetGalleryProps) {
  const [category, setCategory] = useState("전체");

  const filtered = category === "전체"
    ? PRESETS
    : PRESETS.filter((p) => p.category === category);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              category === cat
                ? "bg-indigo-500 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-80 overflow-y-auto">
        {filtered.map((preset) => (
          <PresetThumbnail
            key={preset.id}
            grid={preset.grid}
            name={preset.name}
            onClick={() => onSelect(preset.grid)}
          />
        ))}
      </div>
    </div>
  );
}
