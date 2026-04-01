"use client";

import { useState, useEffect, useCallback } from "react";
import { Sparkles, Loader2, Info, Timer, Zap, Crown, Rocket } from "lucide-react";
import { DotGrid } from "../lib/dotArt";
import { generateWithDalle, MODEL_OPTIONS, ModelOption, COOLDOWN_MS, getRecommendedModel, getMaxModelIndex } from "../lib/proMode";
import { useTranslation } from "../i18n";

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
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelOption>(() => getRecommendedModel(gridSize));
  const [cooldown, setCooldown] = useState(0);
  const maxModelIdx = getMaxModelIndex(gridSize);

  const modelLabelMap: Record<string, string> = {
    "d2-256": t("modelOptions.fast"),
    "d2-512": t("modelOptions.balanced"),
    "d3-1024": t("modelOptions.highQuality"),
  };

  const modelDescMap: Record<string, string> = {
    "d2-256": t("modelOptions.fastDesc"),
    "d2-512": t("modelOptions.balancedDesc"),
    "d3-1024": t("modelOptions.highQualityDesc"),
  };

  useEffect(() => {
    const recommended = getRecommendedModel(gridSize);
    const currentIdx = MODEL_OPTIONS.findIndex(m => m.id === selectedModel.id);
    const maxIdx = getMaxModelIndex(gridSize);
    if (currentIdx > maxIdx) {
      setSelectedModel(recommended);
    }
  }, [gridSize, selectedModel.id]);

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
    if (!prompt.trim()) {
      onError(t("proMode.enterPrompt"));
      return;
    }
    if (isCoolingDown) {
      onError(t("proMode.retryCooldown", { time: formatTime(cooldown) }));
      return;
    }

    setLoading(true);
    try {
      const result = await generateWithDalle(prompt, { gridSize }, selectedModel);
      onGenerate(result);
      startCooldown();
    } catch (err) {
      onError(err instanceof Error ? err.message : t("proMode.generateFail"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-5">
      <div className="flex items-center gap-2">
        <Sparkles size={20} className="text-indigo-500" />
        <h2 className="text-base font-semibold text-gray-900">{t("proMode.title")}</h2>
      </div>

      <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-4 text-sm text-indigo-800 flex gap-3">
        <Info size={18} className="flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">{t("proMode.infoTitle")}</p>
          <p className="mt-1 text-xs text-indigo-600">
            {t("proMode.infoSub")}
          </p>
        </div>
      </div>

      {/* Model Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t("proMode.modelSelect")}</label>
        <div className="grid grid-cols-3 gap-2">
          {MODEL_OPTIONS.map((opt, idx) => {
            const Icon = MODEL_ICONS[opt.id] || Zap;
            const active = selectedModel.id === opt.id;
            const disabled = idx > maxModelIdx;
            return (
              <button
                key={opt.id}
                onClick={() => !disabled && setSelectedModel(opt)}
                disabled={disabled}
                className={`relative flex flex-col items-center gap-1.5 rounded-xl p-3 text-xs transition-all border-2 ${
                  disabled
                    ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed opacity-50"
                    : active
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                }`}
              >
                <Icon size={18} />
                <span className="font-semibold">{modelLabelMap[opt.id] ?? opt.label}</span>
                <span className={`text-[10px] ${disabled ? "text-gray-300" : active ? "text-indigo-500" : "text-gray-400"}`}>
                  {opt.price}{t("proMode.perUse")}
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-1.5 text-xs text-gray-400">{modelDescMap[selectedModel.id] ?? selectedModel.description}</p>
        {maxModelIdx < 2 && (
          <p className="text-xs text-amber-600">
            {t("proMode.gridLowResHint", { size: gridSize })}
          </p>
        )}
      </div>

      {/* Prompt */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t("proMode.prompt")}</label>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && !isCoolingDown && handleGenerate()}
          placeholder={t("proMode.promptPlaceholder")}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <p className="mt-1.5 text-xs text-gray-400">
          {t("proMode.promptHint")}
        </p>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={loading || isCoolingDown}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-3 text-sm font-medium text-white shadow-md hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            {t("proMode.generating", { model: modelLabelMap[selectedModel.id] ?? selectedModel.label })}
          </>
        ) : isCoolingDown ? (
          <>
            <Timer size={18} />
            {t("proMode.cooldown", { time: formatTime(cooldown) })}
          </>
        ) : (
          <>
            <Sparkles size={18} />
            {t("proMode.generate")}
          </>
        )}
      </button>

    </div>
  );
}
