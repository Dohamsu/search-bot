"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Minimize2, Copy, Film, Check } from "lucide-react";
import { DotGrid } from "../lib/dotArt";
import { renderDotGrid, downloadCanvasAsPNG, copyCanvasToClipboard, fitDotSize, RenderOptions } from "../lib/canvasRenderer";
import { exportDotArtGif, GIF_EFFECTS, GifEffect } from "../lib/gifExporter";

const THUMB_SCALES = [1, 2, 3] as const;

interface DotArtPreviewProps {
  grid: DotGrid | null;
  options: {
    gap: number;
    dotShape: "square" | "circle";
    bgColor: string;
  };
  filename?: string;
  onError?: (message: string) => void;
}

export default function DotArtPreview({ grid, options, filename = "dot-art", onError }: DotArtPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const thumbCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [thumbScale, setThumbScale] = useState<number>(2);
  const [transparentBg, setTransparentBg] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [gifExporting, setGifExporting] = useState(false);
  const [selectedEffect, setSelectedEffect] = useState<GifEffect>("blink");

  // 컨테이너 실제 너비 측정 (항상 같은 div에 ref가 붙으므로 안정적)
  useEffect(() => {
    if (!containerRef.current) return;
    const measure = () => {
      const w = containerRef.current!.clientWidth - 48; // p-6 패딩 제외
      setContainerWidth(w);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 컨테이너 크기에 딱 맞게 렌더링
  useEffect(() => {
    if (!grid || !canvasRef.current || containerWidth <= 0) return;
    const gridSize = grid.length;
    const dotSize = fitDotSize(gridSize, options.gap, containerWidth);
    const renderOpts: RenderOptions = {
      dotSize,
      gap: options.gap,
      dotShape: options.dotShape,
      bgColor: options.bgColor,
    };
    renderDotGrid(canvasRef.current, grid, renderOpts);
  }, [grid, options, containerWidth]);

  // 축소 미리보기 렌더링
  useEffect(() => {
    if (!grid || !thumbCanvasRef.current) return;
    const renderOpts: RenderOptions = {
      dotSize: thumbScale,
      gap: 0,
      dotShape: options.dotShape,
      bgColor: options.bgColor,
    };
    renderDotGrid(thumbCanvasRef.current, grid, renderOpts);
  }, [grid, options.dotShape, options.bgColor, thumbScale]);

  const handleDownload = () => {
    if (!grid) return;
    const exportCanvas = document.createElement("canvas");
    const gridSize = grid.length;
    const exportDotSize = Math.max(16, Math.floor(1024 / gridSize));
    const renderOpts: RenderOptions = {
      dotSize: exportDotSize,
      gap: options.gap,
      dotShape: options.dotShape,
      bgColor: options.bgColor,
      transparentBg,
    };
    renderDotGrid(exportCanvas, grid, renderOpts);
    downloadCanvasAsPNG(exportCanvas, filename);
  };

  const handleCopy = async () => {
    if (!grid) return;
    try {
      const exportCanvas = document.createElement("canvas");
      const gridSize = grid.length;
      const exportDotSize = Math.max(16, Math.floor(1024 / gridSize));
      const renderOpts: RenderOptions = {
        dotSize: exportDotSize,
        gap: options.gap,
        dotShape: options.dotShape,
        bgColor: options.bgColor,
        transparentBg,
      };
      renderDotGrid(exportCanvas, grid, renderOpts);
      await copyCanvasToClipboard(exportCanvas);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      onError?.("클립보드 복사에 실패했습니다. 브라우저 권한을 확인해주세요.");
    }
  };

  const handleGifExport = async () => {
    if (!grid || gifExporting) return;
    setGifExporting(true);
    try {
      const gridSize = grid.length;
      const exportDotSize = Math.max(8, Math.floor(512 / gridSize));
      const renderOpts: RenderOptions = {
        dotSize: exportDotSize,
        gap: options.gap,
        dotShape: options.dotShape,
        bgColor: options.bgColor,
      };
      const blob = await exportDotArtGif(grid, selectedEffect, renderOpts);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `${filename}.gif`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      onError?.("GIF 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setGifExporting(false);
    }
  };

  return (
    <div className="space-y-4" ref={containerRef}>
      <div className="flex items-center justify-center rounded-2xl bg-gray-50 p-6 border border-gray-100 min-h-[200px]">
        {grid ? (
          <canvas ref={canvasRef} />
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="text-4xl mb-3">🎨</div>
            <p className="text-gray-400 text-sm">
              텍스트를 입력하고 생성 버튼을 눌러보세요
            </p>
          </div>
        )}
      </div>

      {/* 축소 미리보기 */}
      {grid && (
        <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-3">
          <div className="flex items-center justify-center rounded-lg bg-white border border-gray-200 p-2">
            <canvas
              ref={thumbCanvasRef}
              style={{ imageRendering: "pixelated" }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1.5">
              <Minimize2 size={12} />
              축소 미리보기
            </div>
            <div className="flex gap-1">
              {THUMB_SCALES.map((s) => (
                <button
                  key={s}
                  onClick={() => setThumbScale(s)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    thumbScale === s
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
            <p className="mt-1 text-[10px] text-gray-400">
              {grid.length}×{grid.length}px · 실제 픽셀 크기
            </p>
          </div>
        </div>
      )}

      {grid && (
        <div className="space-y-3">
          {/* 투명 배경 토글 */}
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={transparentBg}
              onChange={(e) => setTransparentBg(e.target.checked)}
              className="rounded border-gray-300 text-indigo-500 focus:ring-indigo-500"
            />
            투명 배경으로 내보내기
          </label>

          {/* 메인 버튼 그룹 */}
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 text-sm font-medium text-white shadow-md hover:bg-indigo-600 transition-colors"
            >
              <Download size={18} />
              PNG
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            >
              {copySuccess ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
              {copySuccess ? "복사됨" : "복사"}
            </button>
          </div>

          {/* GIF 내보내기 */}
          <div className="flex gap-2">
            <select
              value={selectedEffect}
              onChange={(e) => setSelectedEffect(e.target.value as GifEffect)}
              className="flex-1 rounded-xl border border-gray-200 px-3 py-3 text-sm bg-white focus:border-indigo-500 focus:outline-none"
            >
              {GIF_EFFECTS.map((effect) => (
                <option key={effect.id} value={effect.id}>
                  {effect.emoji} {effect.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleGifExport}
              disabled={gifExporting}
              className="flex items-center justify-center gap-2 rounded-xl bg-purple-500 px-6 py-3 text-sm font-medium text-white shadow-md hover:bg-purple-600 transition-colors disabled:opacity-50"
            >
              <Film size={18} />
              {gifExporting ? "생성 중..." : "GIF"}
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
