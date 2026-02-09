"use client";

import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import { DotGrid } from "../lib/dotArt";
import { renderDotGrid, downloadCanvasAsPNG, fitDotSize, RenderOptions } from "../lib/canvasRenderer";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

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
    };
    renderDotGrid(exportCanvas, grid, renderOpts);
    downloadCanvasAsPNG(exportCanvas, filename);
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
      {grid && (
        <button
          onClick={handleDownload}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 text-sm font-medium text-white shadow-md hover:bg-indigo-600 transition-colors"
        >
          <Download size={18} />
          PNG 다운로드
        </button>
      )}
    </div>
  );
}
