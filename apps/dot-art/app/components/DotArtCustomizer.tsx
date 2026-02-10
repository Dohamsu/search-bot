"use client";

import { PALETTES } from "../lib/palettes";
import type { DitherMode } from "../lib/dotArt";

export interface CustomizeOptions {
  gridSize: number;
  paletteId: string;
  bgColor: string;
  gap: number;
  dotShape: "square" | "circle";
  dither: DitherMode;
  edgeEnhance: boolean;
  outline: boolean;
}

interface DotArtCustomizerProps {
  options: CustomizeOptions;
  onChange: (options: CustomizeOptions) => void;
}

const GRID_SIZES = [8, 16, 32, 64];

const DITHER_OPTIONS: { value: DitherMode; label: string }[] = [
  { value: "none", label: "없음" },
  { value: "floyd-steinberg", label: "확산" },
  { value: "ordered", label: "패턴" },
];

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

      {/* 색상 팔레트 — 흑백 / 컬러 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">색상 팔레트</label>
        <div className="flex gap-2">
          {PALETTES.map((p) => {
            const active = options.paletteId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onChange({ ...options, paletteId: p.id })}
                className={`flex-1 flex items-center justify-center gap-2 rounded-xl p-3 text-sm font-medium transition-all border-2 ${
                  active
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200"
                }`}
              >
                <div className="flex gap-0.5">
                  {p.colors.slice(0, 4).map((color, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-sm border border-gray-200/50"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                {p.name}
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

      {/* 디더링 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">디더링</label>
        <div className="flex gap-2">
          {DITHER_OPTIONS.map((d) => (
            <button
              key={d.value}
              onClick={() => onChange({ ...options, dither: d.value })}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                options.dither === d.value
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
        <p className="mt-1 text-xs text-gray-400">
          {options.dither === "floyd-steinberg"
            ? "사진의 그라데이션을 자연스럽게 표현합니다"
            : options.dither === "ordered"
              ? "레트로 크로스해치 패턴 효과를 적용합니다"
              : "사진 변환 시 확산 디더링을 추천합니다"}
        </p>
      </div>

      {/* 엣지 강조 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">엣지 강조</label>
        <div className="flex gap-2">
          <button
            onClick={() => onChange({ ...options, edgeEnhance: !options.edgeEnhance })}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              options.edgeEnhance
                ? "bg-indigo-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {options.edgeEnhance ? "엣지 감지 ON" : "엣지 감지 OFF"}
          </button>
          <button
            onClick={() => onChange({ ...options, outline: !options.outline })}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              options.outline
                ? "bg-indigo-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {options.outline ? "아웃라인 ON" : "아웃라인 OFF"}
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-400">
          {options.edgeEnhance && options.outline
            ? "Sobel 엣지 가중 샘플링 + 스프라이트 아웃라인 적용"
            : options.edgeEnhance
              ? "Sobel 엣지 감지로 경계를 선명하게 보존합니다"
              : options.outline
                ? "변환 후 색상 경계에 어두운 아웃라인을 추가합니다"
                : "사진 변환 시 엣지 감지를 켜면 선명도가 향상됩니다"}
        </p>
      </div>
    </div>
  );
}
