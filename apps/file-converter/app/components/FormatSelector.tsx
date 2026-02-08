"use client";

import { ArrowRight } from "lucide-react";
import { FORMAT_OPTIONS } from "../lib/fileUtils";

interface FormatSelectorProps {
  fromFormat: string;
  toFormat: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onConvert: () => void;
  isConverting: boolean;
}

export default function FormatSelector({
  fromFormat,
  toFormat,
  onFromChange,
  onToChange,
  onConvert,
  isConverting,
}: FormatSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end gap-3 md:gap-4">
        <div className="flex flex-1 md:flex-initial flex-col gap-1">
          <span className="text-xs font-medium text-[#78716C]">FROM</span>
          <select
            value={fromFormat}
            onChange={(e) => onFromChange(e.target.value)}
            className="w-full md:w-auto rounded-lg border border-[#E7E5E4] bg-white px-3 md:px-4 py-2.5 text-sm font-medium text-[var(--file-text)] outline-none focus:border-[var(--file-primary)]"
          >
            {FORMAT_OPTIONS.from.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
        <ArrowRight className="mb-2.5 shrink-0 text-[#A8A29E]" size={20} />
        <div className="flex flex-1 md:flex-initial flex-col gap-1">
          <span className="text-xs font-medium text-[#78716C]">TO</span>
          <select
            value={toFormat}
            onChange={(e) => onToChange(e.target.value)}
            className="w-full md:w-auto rounded-lg border border-[#E7E5E4] bg-white px-3 md:px-4 py-2.5 text-sm font-medium text-[var(--file-text)] outline-none focus:border-[var(--file-primary)]"
          >
            {FORMAT_OPTIONS.to.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={onConvert}
          disabled={isConverting}
          className="hidden md:block rounded-lg bg-[var(--file-primary)] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0A5A5A] disabled:opacity-50"
        >
          {isConverting ? "변환 중..." : "변환하기"}
        </button>
      </div>
      <button
        onClick={onConvert}
        disabled={isConverting}
        className="md:hidden w-full rounded-lg bg-[var(--file-primary)] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0A5A5A] disabled:opacity-50"
      >
        {isConverting ? "변환 중..." : "변환하기"}
      </button>
    </div>
  );
}
