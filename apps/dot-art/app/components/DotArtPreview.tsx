"use client";

import { useEffect, useRef } from "react";
import { Download } from "lucide-react";
import { DotGrid } from "../lib/dotArt";
import { renderDotGrid, downloadCanvasAsPNG, getPreviewDotSize, RenderOptions } from "../lib/canvasRenderer";

interface DotArtPreviewProps {
  grid: DotGrid | null;
  options: {
    gap: number;
    dotShape: "square" | "circle";
    bgColor: string;
  };
  filename?: string;
}

export default function DotArtPreview({ grid, options, filename = "dot-art" }: DotArtPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!grid || !canvasRef.current) return;
    const gridSize = grid.length;
    const dotSize = getPreviewDotSize(gridSize, 512);
    const renderOpts: RenderOptions = {
      dotSize,
      gap: options.gap,
      dotShape: options.dotShape,
      bgColor: options.bgColor,
    };
    renderDotGrid(canvasRef.current, grid, renderOpts);
  }, [grid, options]);

  const handleDownload = () => {
    if (!grid || !canvasRef.current) return;
    // 고해상도 다운로드용 Canvas
    const exportCanvas = document.createElement("canvas");
    const gridSize = grid.length;
    const exportDotSize = Math.max(16, Math.floor(1024 / gridSize));
    const renderOpts: RenderOptions = {
      dotSize: exportDotSize,
      gap: options.gap,
      dotShape: options.dotShape,
      bgColor: options.bgColor,
    };
    renderDotGrid(exportCanvas, grid, renderOpts);
    downloadCanvasAsPNG(exportCanvas, filename);
  };

  if (!grid) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
        <div className="text-4xl mb-3">🎨</div>
        <p className="text-gray-400 text-sm">
          텍스트를 입력하고 생성 버튼을 눌러보세요
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center rounded-2xl bg-gray-50 p-6 border border-gray-100">
        <canvas
          ref={canvasRef}
          className="max-w-full"
          style={{ imageRendering: "pixelated" }}
        />
      </div>
      <button
        onClick={handleDownload}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 text-sm font-medium text-white shadow-md hover:bg-indigo-600 transition-colors"
      >
        <Download size={18} />
        PNG 다운로드
      </button>
    </div>
  );
}
