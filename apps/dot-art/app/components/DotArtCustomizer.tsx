"use client";

import { PALETTES } from "../lib/palettes";
import type { DitherMode } from "../lib/dotArt";
import { useTranslation } from "../i18n";

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

export default function DotArtCustomizer({ options, onChange }: DotArtCustomizerProps) {
  const { t } = useTranslation();

  const DITHER_OPTIONS: { value: DitherMode; label: string }[] = [
    { value: "none", label: t("customizer.ditherNone") },
    { value: "floyd-steinberg", label: t("customizer.ditherDiffusion") },
    { value: "ordered", label: t("customizer.ditherPattern") },
  ];

  const paletteNameMap: Record<string, string> = {
    mono: t("palette.mono"),
    color: t("palette.color"),
  };

  return (
    <div className="space-y-4">
      {/* Grid Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t("customizer.gridSize")}</label>
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

      {/* Color Palette */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t("customizer.colorPalette")}</label>
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
                {paletteNameMap[p.id] ?? p.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Background Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t("customizer.bgColor")}</label>
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

      {/* Dot Gap & Shape */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">{t("customizer.dotGap")}</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">{t("customizer.dotShape")}</label>
          <div className="flex gap-2">
            <button
              onClick={() => onChange({ ...options, dotShape: "square" })}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                options.dotShape === "square"
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              ■ {t("customizer.square")}
            </button>
            <button
              onClick={() => onChange({ ...options, dotShape: "circle" })}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                options.dotShape === "circle"
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              ● {t("customizer.circle")}
            </button>
          </div>
        </div>
      </div>

      {/* Dithering */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t("customizer.dithering")}</label>
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
            ? t("customizer.ditherDescDiffusion")
            : options.dither === "ordered"
              ? t("customizer.ditherDescPattern")
              : t("customizer.ditherDescNone")}
        </p>
      </div>

      {/* Edge Enhancement */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t("customizer.edgeEnhance")}</label>
        <div className="flex gap-2">
          <button
            onClick={() => onChange({ ...options, edgeEnhance: !options.edgeEnhance })}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              options.edgeEnhance
                ? "bg-indigo-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {options.edgeEnhance ? t("customizer.edgeOn") : t("customizer.edgeOff")}
          </button>
          <button
            onClick={() => onChange({ ...options, outline: !options.outline })}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              options.outline
                ? "bg-indigo-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {options.outline ? t("customizer.outlineOn") : t("customizer.outlineOff")}
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-400">
          {options.edgeEnhance && options.outline
            ? t("customizer.edgeBothDesc")
            : options.edgeEnhance
              ? t("customizer.edgeOnlyDesc")
              : options.outline
                ? t("customizer.outlineOnlyDesc")
                : t("customizer.edgeNoneDesc")}
        </p>
      </div>
    </div>
  );
}
