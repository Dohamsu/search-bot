"use client";

import { useState, useEffect, useCallback } from "react";
import { Sparkles, Loader2, Info, Timer, Zap, Crown, Rocket } from "lucide-react";
import { DotGrid } from "../lib/dotArt";
import { generateWithDalle, MODEL_OPTIONS, ModelOption, COOLDOWN_MS } from "../lib/proMode";

const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";
const COOLDOWN_STORAGE_KEY = "dot-art-pro-last-gen";

const MODEL_ICONS: Record<string, typeof Zap> = {
  "d2-256": Zap,
  "d2-512": Rocket,
  "d3-1024": Crown,
};

interface ProModePanelProps {
  gridSize: number;
  onGenerate: (result: { grid: DotGrid; imageDataUrl: string }) => void;
  onError: (message: string) => void;
}

function getRemainingCooldown(): number {
  if (typeof window === "undefined") return 0;
  const last = localStorage.getItem(COOLDOWN_STORAGE_KEY);
  if (!last) return 0;
  const elapsed = Date.now() - parseInt(last, 10);
  return Math.max(0, COOLDOWN_MS - elapsed);
}

function formatTime(ms: number): string {
  const totalSec = Math.ceil(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

export default function ProModePanel({ gridSize, onGenerate, onError }: ProModePanelProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelOption>(MODEL_OPTIONS[0]);
  const [cooldown, setCooldown] = useState(0);

  // 쿨다운 타이머
  useEffect(() => {
    setCooldown(getRemainingCooldown());
    const interval = setInterval(() => {
      const remaining = getRemainingCooldown();
      setCooldown(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const startCooldown = useCallback(() => {
    localStorage.setItem(COOLDOWN_STORAGE_KEY, Date.now().toString());
    setCooldown(COOLDOWN_MS);
    const interval = setInterval(() => {
      const remaining = getRemainingCooldown();
      setCooldown(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 1000);
  }, []);

  const isCoolingDown = cooldown > 0;

  const handleGenerate = async () => {
    if (!API_KEY) {
      onError("OpenAI API 키가 설정되지 않았습니다");
      return;
    }
    if (!prompt.trim()) {
      onError("프롬프트를 입력해주세요");
      return;
    }
    if (isCoolingDown) {
      onError(`${formatTime(cooldown)} 후에 다시 시도해주세요`);
      return;
    }

    // TODO: 광고 시청 체크 로직 (현재는 무료)
    // if (!hasWatchedAd) { showAdModal(); return; }

    setLoading(true);
    try {
      const result = await generateWithDalle(prompt, API_KEY, { gridSize }, selectedModel);
      onGenerate(result);
      startCooldown();
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
          <p className="font-medium">AI가 이미지를 생성하고 자동으로 도트 아트로 변환합니다</p>
          <p className="mt-1 text-xs text-indigo-600">
            생성 후 5분간 재요청이 제한됩니다.
          </p>
        </div>
      </div>

      {/* 모델 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">AI 모델 선택</label>
        <div className="grid grid-cols-3 gap-2">
          {MODEL_OPTIONS.map((opt) => {
            const Icon = MODEL_ICONS[opt.id] || Zap;
            const active = selectedModel.id === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSelectedModel(opt)}
                className={`relative flex flex-col items-center gap-1.5 rounded-xl p-3 text-xs transition-all border-2 ${
                  active
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                }`}
              >
                <Icon size={18} />
                <span className="font-semibold">{opt.label}</span>
                <span className={`text-[10px] ${active ? "text-indigo-500" : "text-gray-400"}`}>
                  {opt.price}/회
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-1.5 text-xs text-gray-400">{selectedModel.description}</p>
      </div>

      {/* 프롬프트 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">프롬프트</label>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && !isCoolingDown && handleGenerate()}
          placeholder="예: 귀여운 고양이, a cute dragon"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <p className="mt-1.5 text-xs text-gray-400">
          한국어·영어 모두 입력 가능합니다 (한국어는 자동 번역)
        </p>
      </div>

      {/* 광고 슬롯 (추후 활성화) */}
      {/* <div id="dot-art-pro-ad-slot" className="min-h-[100px] bg-gray-50 rounded-xl flex items-center justify-center text-xs text-gray-300">광고 영역</div> */}

      {/* 생성 버튼 */}
      <button
        onClick={handleGenerate}
        disabled={loading || !API_KEY || isCoolingDown}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-3 text-sm font-medium text-white shadow-md hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            AI 생성 중... ({selectedModel.label})
          </>
        ) : isCoolingDown ? (
          <>
            <Timer size={18} />
            {formatTime(cooldown)} 후 생성 가능
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
