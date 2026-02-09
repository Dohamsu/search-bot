"use client";

import { useState } from "react";
import { Sparkles, Loader2, Info } from "lucide-react";
import { DotGrid } from "../lib/dotArt";
import { generateWithDalle } from "../lib/proMode";

const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";

interface ProModePanelProps {
  gridSize: number;
  palette: string[];
  onGenerate: (grid: DotGrid) => void;
  onError: (message: string) => void;
}

export default function ProModePanel({ gridSize, palette, onGenerate, onError }: ProModePanelProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!API_KEY) {
      onError("OpenAI API 키가 설정되지 않았습니다 (.env의 NEXT_PUBLIC_OPENAI_API_KEY)");
      return;
    }
    if (!prompt.trim()) {
      onError("프롬프트를 입력해주세요");
      return;
    }

    setLoading(true);
    try {
      const grid = await generateWithDalle(prompt, API_KEY, {
        gridSize,
        palette,
      });
      onGenerate(grid);
    } catch (err) {
      onError(err instanceof Error ? err.message : "생성 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-5">
      <div className="flex items-center gap-2">
        <Sparkles size={20} className="text-indigo-500" />
        <h2 className="text-base font-semibold text-gray-900">Pro 모드 (AI 생성)</h2>
      </div>

      <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-4 text-sm text-indigo-800 flex gap-3">
        <Info size={18} className="flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">DALL-E 3 기반 AI 픽셀 아트 생성</p>
          <p className="mt-1 text-xs text-indigo-600">
            프롬프트를 입력하면 AI가 이미지를 생성하고, 자동으로 도트 아트로 변환합니다. 회당 약 $0.04 비용이 발생합니다.
          </p>
        </div>
      </div>

      {/* Prompt */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">프롬프트</label>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && handleGenerate()}
          placeholder="예: a cute dragon, a knight with a sword"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <p className="mt-1.5 text-xs text-gray-400">
          영어로 입력하면 더 좋은 결과를 얻을 수 있습니다
        </p>
      </div>

      {/* Generate */}
      <button
        onClick={handleGenerate}
        disabled={loading || !API_KEY}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-3 text-sm font-medium text-white shadow-md hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            AI 생성 중...
          </>
        ) : (
          <>
            <Sparkles size={18} />
            AI 도트 아트 생성
          </>
        )}
      </button>

      {!API_KEY && (
        <p className="text-xs text-red-400 text-center">
          .env 파일에 NEXT_PUBLIC_OPENAI_API_KEY를 설정해주세요
        </p>
      )}
    </div>
  );
}
