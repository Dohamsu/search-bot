"use client";

import { useState } from "react";
import { Link2, Link2Off, RotateCcw } from "lucide-react";

interface ConvertOptionsProps {
  quality: number;
  maxWidth: number | undefined;
  maxHeight: number | undefined;
  maintainAspectRatio: boolean;
  onQualityChange: (quality: number) => void;
  onMaxWidthChange: (width: number | undefined) => void;
  onMaxHeightChange: (height: number | undefined) => void;
  onMaintainAspectRatioChange: (maintain: boolean) => void;
  showQuality: boolean;
}

export default function ConvertOptions({
  quality,
  maxWidth,
  maxHeight,
  maintainAspectRatio,
  onQualityChange,
  onMaxWidthChange,
  onMaxHeightChange,
  onMaintainAspectRatioChange,
  showQuality,
}: ConvertOptionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleResetResize = () => {
    onMaxWidthChange(undefined);
    onMaxHeightChange(undefined);
  };

  const hasResizeValues = maxWidth !== undefined || maxHeight !== undefined;

  return (
    <div className="rounded-lg border border-[#E7E5E4] bg-white overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-[var(--file-text)] hover:bg-[#FAFAF9] transition-colors"
      >
        <span>변환 옵션</span>
        <svg
          className={`h-4 w-4 text-[#A8A29E] transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="border-t border-[#E7E5E4] px-4 py-4 flex flex-col gap-5">
          {showQuality && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-[#78716C]">
                  품질
                </label>
                <span className="text-xs font-semibold text-[var(--file-primary)]">
                  {Math.round(quality * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                value={Math.round(quality * 100)}
                onChange={(e) => onQualityChange(Number(e.target.value) / 100)}
                className="w-full h-1.5 rounded-full appearance-none bg-[#E7E5E4] accent-[var(--file-primary)] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#A8A29E]">
                <span>작은 파일</span>
                <span>최고 품질</span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[#78716C]">
                리사이즈
              </label>
              {hasResizeValues && (
                <button
                  onClick={handleResetResize}
                  className="flex items-center gap-1 text-xs text-[var(--file-primary)] hover:underline"
                >
                  <RotateCcw size={10} />
                  원본 크기
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-1 flex-col gap-1">
                <span className="text-[10px] text-[#A8A29E]">너비 (px)</span>
                <input
                  type="number"
                  min={1}
                  placeholder="자동"
                  value={maxWidth ?? ""}
                  onChange={(e) =>
                    onMaxWidthChange(e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="w-full rounded-md border border-[#E7E5E4] px-3 py-2 text-sm text-[var(--file-text)] outline-none focus:border-[var(--file-primary)] placeholder:text-[#D6D3D1]"
                />
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <span className="text-[10px] text-[#A8A29E]">높이 (px)</span>
                <input
                  type="number"
                  min={1}
                  placeholder="자동"
                  value={maxHeight ?? ""}
                  onChange={(e) =>
                    onMaxHeightChange(e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="w-full rounded-md border border-[#E7E5E4] px-3 py-2 text-sm text-[var(--file-text)] outline-none focus:border-[var(--file-primary)] placeholder:text-[#D6D3D1]"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <button
                onClick={() => onMaintainAspectRatioChange(!maintainAspectRatio)}
                className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                  maintainAspectRatio
                    ? "border-[var(--file-primary)] bg-[var(--file-primary)]"
                    : "border-[#D6D3D1] bg-white"
                }`}
              >
                {maintainAspectRatio && (
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <span className="flex items-center gap-1.5 text-xs text-[#78716C]">
                {maintainAspectRatio ? (
                  <Link2 size={12} className="text-[var(--file-primary)]" />
                ) : (
                  <Link2Off size={12} className="text-[#A8A29E]" />
                )}
                비율 유지
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
