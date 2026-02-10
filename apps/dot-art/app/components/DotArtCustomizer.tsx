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
  hasImage?: boolean; // 이미지가 업로드된 상태인지 (자동 팔레트 활성화용)
}

const GRID_SIZES = [8, 16, 32, 64];

const AUTO_PALETTE_OPTIONS = [
  { id: "auto-8", name: "자동 8색", colors: 8 },
  { id: "auto-12", name: "자동 12색", colors: 12 },
  { id: "auto-16", name: "자동 16색", colors: 16 },
  { id: "auto-24", name: "자동 24색", colors: 24 },
];

const DITHER_OPTIONS: { value: DitherMode; label: string }[] = [
  { value: "none", label: "없음" },
  { value: "floyd-steinberg", label: "확산" },
  { value: "ordered", label: "패턴" },
];

export default function DotArtCustomizer({ options, onChange, hasImage }: DotArtCustomizerProps) {
  const isAutoPalette = options.paletteId.startsWith("auto-");

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

        {/* 자동 추출 팔레트 */}
        <div className="mt-2">
          <p className="text-xs text-gray-500 mb-1.5">자동 추출 (이미지 전용)</p>
          <div className="flex gap-2">
            {AUTO_PALETTE_OPTIONS.map((ap) => {
              const active = options.paletteId === ap.id;
              const disabled = !hasImage;
              return (
                <button
                  key={ap.id}
                  disabled={disabled}
                  onClick={() => onChange({ ...options, paletteId: ap.id })}
                  className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-all ${
                    disabled
                      ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                      : active
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {ap.name}
                </button>
              );
            })}
          </div>
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

      {/* 도트 간격 & 모양 & 디더링 */}
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
          {isAutoPalette || options.dither !== "none"
            ? options.dither === "floyd-steinberg"
              ? "사진의 그라데이션을 자연스럽게 표현합니다"
              : options.dither === "ordered"
                ? "레트로 크로스해치 패턴 효과를 적용합니다"
                : "디더링 없이 가장 가까운 색상으로 매핑합니다"
            : "사진 변환 시 확산 디더링을 추천합니다"}
        </p>
      </div>

      {/* 엣지 강조 (이미지 전용) */}
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
