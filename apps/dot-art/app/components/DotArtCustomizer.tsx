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
        <div className="grid grid-cols-2 gap-2">
          {PALETTES.map((p) => {
            const active = options.paletteId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onChange({ ...options, paletteId: p.id })}
                className={`flex flex-col gap-1.5 rounded-xl p-2.5 text-left transition-all border-2 ${
                  active
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-100 bg-gray-50 hover:border-gray-200"
                }`}
              >
                <span className={`text-xs font-medium ${active ? "text-indigo-700" : "text-gray-600"}`}>
                  {p.name}
                </span>
                <div className="flex flex-wrap gap-0.5">
                  {p.colors.slice(0, 8).map((color, i) => (
                    <div
                      key={i}
                      className="w-3.5 h-3.5 rounded-sm border border-gray-200/50"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  {p.colors.length > 8 && (
                    <span className="text-[9px] text-gray-400 self-end ml-0.5">+{p.colors.length - 8}</span>
                  )}
                </div>
              </button>
            );
          })}
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
