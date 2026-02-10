"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Wand2 } from "lucide-react";
import ModeSelector, { Mode } from "./components/ModeSelector";
import DotArtCustomizer, { CustomizeOptions } from "./components/DotArtCustomizer";
import DotArtPreview from "./components/DotArtPreview";
import PresetGallery from "./components/PresetGallery";
import GridEditor from "./components/GridEditor";
import ProModePanel from "./components/ProModePanel";
import HistoryPanel from "./components/HistoryPanel";
import Toast from "./components/Toast";
import { DotGrid, generateDotArt, createEmptyGrid, imageToDotGridPro } from "./lib/dotArt";
import { PALETTES } from "./lib/palettes";
import { PRESETS } from "./lib/presets";
import { HistoryItem, loadHistory, addHistoryItem } from "./lib/history";

export default function Home() {
  const [mode, setMode] = useState<Mode>("auto");
  const [inputText, setInputText] = useState("");
  const [grid, setGrid] = useState<DotGrid | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [rawProImageUrl, setRawProImageUrl] = useState<string | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const historyRef = useRef<HistoryItem[]>([]);
  historyRef.current = history;

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const [customizeOpts, setCustomizeOpts] = useState<CustomizeOptions>({
    gridSize: 16,
    paletteId: "default",
    bgColor: "#FFFFFF",
    gap: 1,
    dotShape: "square",
  });

  const currentPalette = PALETTES.find((p) => p.id === customizeOpts.paletteId)?.colors ?? PALETTES[0].colors;

  const handleGenerate = useCallback(() => {
    if (!inputText.trim()) {
      setToast({ message: "텍스트를 입력해주세요", type: "error" });
      return;
    }

    // 프리셋 매칭 체크
    const lower = inputText.toLowerCase().trim();
    const preset = PRESETS.find((p) =>
      p.keywords.some((kw) => kw === lower)
    );
    if (preset) {
      setGrid(preset.grid);
      setHistory(addHistoryItem(historyRef.current, preset.grid, "auto", preset.name));
      setToast({ message: `프리셋 "${preset.name}" 적용됨`, type: "success" });
      return;
    }

    const result = generateDotArt(inputText, {
      gridSize: customizeOpts.gridSize,
      palette: currentPalette,
    });
    setGrid(result);
    setHistory(addHistoryItem(historyRef.current, result, "auto", inputText.slice(0, 20)));
    setToast({ message: "도트 아트가 생성되었습니다!", type: "success" });
  }, [inputText, customizeOpts.gridSize, currentPalette]);

  const handlePresetSelect = useCallback((presetGrid: DotGrid, name: string) => {
    setGrid(presetGrid);
    setHistory(addHistoryItem(historyRef.current, presetGrid, "auto", name));
    setToast({ message: "프리셋이 적용되었습니다!", type: "success" });
  }, []);

  const handleModeChange = useCallback((newMode: Mode) => {
    setMode(newMode);
    if (newMode === "editor" && !grid) {
      setGrid(createEmptyGrid(customizeOpts.gridSize));
    }
  }, [grid, customizeOpts.gridSize]);

  const handleGridUpdate = useCallback((newGrid: DotGrid) => {
    setGrid(newGrid);
  }, []);

  const handleProGenerate = useCallback(
    (result: { grid: DotGrid; imageDataUrl: string }) => {
      setGrid(result.grid);
      setRawProImageUrl(result.imageDataUrl);
      setHistory(addHistoryItem(historyRef.current, result.grid, "pro", "AI 생성"));
      setToast({ message: "AI 도트 아트가 생성되었습니다!", type: "success" });
    },
    []
  );

  const handleHistoryLoad = useCallback((item: HistoryItem) => {
    setGrid(item.grid);
    setRawProImageUrl(null);
    setToast({ message: "히스토리에서 불러왔습니다", type: "success" });
  }, []);

  // Pro 모드: gridSize 변경 시 캐싱된 이미지로 자동 재변환
  useEffect(() => {
    if (!rawProImageUrl || mode !== "pro") return;
    const img = new Image();
    img.onload = () => {
      const newGrid = imageToDotGridPro(img, customizeOpts.gridSize);
      setGrid(newGrid);
    };
    img.src = rawProImageUrl;
  }, [customizeOpts.gridSize, rawProImageUrl, mode]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500 shadow-md">
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-2 h-2 bg-yellow-300 rounded-sm" />
                <div className="w-2 h-2 bg-green-300 rounded-sm" />
                <div className="w-2 h-2 bg-red-300 rounded-sm" />
                <div className="w-2 h-2 bg-blue-300 rounded-sm" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 font-[family-name:var(--font-space-grotesk)]">
                Dot Art Studio
              </h1>
              <p className="text-xs text-gray-400">무료 도트 아트 생성기</p>
            </div>
          </div>
          <nav className="flex gap-4 text-sm text-gray-500">
            <a href="/privacy" className="hover:text-gray-700 transition-colors">개인정보</a>
            <a href="/terms" className="hover:text-gray-700 transition-colors">이용약관</a>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* 모드 선택 */}
        <div className="mb-6">
          <ModeSelector mode={mode} onModeChange={handleModeChange} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 왼쪽: 입력 & 옵션 */}
          <div className="space-y-6">
            {/* 자동 생성 모드 */}
            {mode === "auto" && (
              <>
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                  <h2 className="text-base font-semibold text-gray-900 mb-4">텍스트 입력</h2>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                      placeholder="예: 고양이, 하트, 별, 🐱"
                      className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      onClick={handleGenerate}
                      className="flex items-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 text-sm font-medium text-white shadow-md hover:bg-indigo-600 transition-colors"
                    >
                      <Wand2 size={18} />
                      생성
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-400">
                    동물, 음식, 자연, 이모지 등 키워드를 입력하세요
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                  <h2 className="text-base font-semibold text-gray-900 mb-4">커스터마이징</h2>
                  <DotArtCustomizer options={customizeOpts} onChange={setCustomizeOpts} />
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                  <h2 className="text-base font-semibold text-gray-900 mb-4">프리셋 갤러리</h2>
                  <PresetGallery onSelect={handlePresetSelect} />
                </div>
              </>
            )}

            {/* 에디터 모드 */}
            {mode === "editor" && (
              <>
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                  <h2 className="text-base font-semibold text-gray-900 mb-4">커스터마이징</h2>
                  <DotArtCustomizer options={customizeOpts} onChange={(opts) => {
                    if (opts.gridSize !== customizeOpts.gridSize) {
                      setGrid(createEmptyGrid(opts.gridSize));
                    }
                    setCustomizeOpts(opts);
                  }} />
                </div>
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                  <h2 className="text-base font-semibold text-gray-900 mb-4">그리드 에디터</h2>
                  <GridEditor
                    grid={grid ?? createEmptyGrid(customizeOpts.gridSize)}
                    palette={currentPalette}
                    onGridUpdate={handleGridUpdate}
                  />
                </div>
              </>
            )}

            {/* Pro 모드 */}
            {mode === "pro" && (
              <>
                <ProModePanel
                  gridSize={customizeOpts.gridSize}
                  onGenerate={handleProGenerate}
                  onError={(msg) => setToast({ message: msg, type: "error" })}
                />
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                  <h2 className="text-base font-semibold text-gray-900 mb-4">커스터마이징</h2>
                  <DotArtCustomizer options={customizeOpts} onChange={setCustomizeOpts} />
                </div>
              </>
            )}
          </div>

          {/* 오른쪽: 미리보기 + 히스토리 */}
          <div className="lg:sticky lg:top-8 lg:self-start space-y-4">
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <h2 className="text-base font-semibold text-gray-900 mb-4">미리보기</h2>
              <DotArtPreview
                grid={grid}
                options={{
                  gap: customizeOpts.gap,
                  dotShape: customizeOpts.dotShape,
                  bgColor: customizeOpts.bgColor,
                }}
              />
            </div>
            <HistoryPanel
              history={history}
              onLoad={handleHistoryLoad}
              onHistoryChange={setHistory}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-gray-100 pt-8 pb-12 text-center text-xs text-gray-400">
          <p>Dot Art Studio - 무료 도트 아트 생성기</p>
          <div className="mt-2 flex justify-center gap-4">
            <a href="/privacy" className="hover:text-gray-600 transition-colors">개인정보처리방침</a>
            <a href="/terms" className="hover:text-gray-600 transition-colors">이용약관</a>
          </div>
          <div className="mt-4 flex justify-center flex-wrap gap-3 text-gray-300">
            {process.env.NEXT_PUBLIC_SALARY_URL && (
              <a href={process.env.NEXT_PUBLIC_SALARY_URL} className="hover:text-gray-500">연봉 계산기</a>
            )}
            {process.env.NEXT_PUBLIC_MBTI_URL && (
              <a href={process.env.NEXT_PUBLIC_MBTI_URL} className="hover:text-gray-500">MBTI 테스트</a>
            )}
            {process.env.NEXT_PUBLIC_QR_URL && (
              <a href={process.env.NEXT_PUBLIC_QR_URL} className="hover:text-gray-500">QR 생성기</a>
            )}
            {process.env.NEXT_PUBLIC_FILE_URL && (
              <a href={process.env.NEXT_PUBLIC_FILE_URL} className="hover:text-gray-500">파일 변환기</a>
            )}
          </div>
        </footer>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </main>
  );
}
