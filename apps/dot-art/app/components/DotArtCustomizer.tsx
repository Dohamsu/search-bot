"use client";

import { PALETTES } from "../lib/palettes";

export interface CustomizeOptions {
  gridSize: number;
  paletteId: string;
  bgColor: string;
  gap: number;
  dotShape: "square" | "circle";
}

interface DotArtCustomizerProps {
  options: CustomizeOptions;
  onChange: (options: CustomizeOptions) => void;
}

const GRID_SIZES = [8, 16, 32, 64];

export default function DotArtCustomizer({ options, onChange }: DotArtCustomizerProps) {
  return (
    <div className="space-y-4">
      {/* 그리드 크기 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">그리드 크기</label>
        <div className="flex gap-2">
          {GRID_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => onChange({ ...options, gridSize: size })}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                options.gridSize === size
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {size}x{size}
            </button>
          ))}
        </div>
      </div>

      {/* 색상 팔레트 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">색상 팔레트</label>
        <select
          value={options.paletteId}
          onChange={(e) => onChange({ ...options, paletteId: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {PALETTES.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        {/* 팔레트 미리보기 */}
        <div className="mt-2 flex flex-wrap gap-1">
          {PALETTES.find((p) => p.id === options.paletteId)?.colors.map((color, i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-sm border border-gray-200"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* 배경색 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">배경색</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={options.bgColor}
            onChange={(e) => onChange({ ...options, bgColor: e.target.value })}
            className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={options.bgColor}
            onChange={(e) => onChange({ ...options, bgColor: e.target.value })}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* 도트 간격 & 모양 */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">도트 간격</label>
          <div className="flex gap-2">
            {[0, 1, 2].map((g) => (
              <button
                key={g}
                onClick={() => onChange({ ...options, gap: g })}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  options.gap === g
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {g}px
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">도트 모양</label>
          <div className="flex gap-2">
            <button
              onClick={() => onChange({ ...options, dotShape: "square" })}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                options.dotShape === "square"
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              ■ 사각
            </button>
            <button
              onClick={() => onChange({ ...options, dotShape: "circle" })}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                options.dotShape === "circle"
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              ● 원형
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
