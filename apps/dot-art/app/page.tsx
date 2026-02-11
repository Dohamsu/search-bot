"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Image as ImageIcon } from "lucide-react";
import DotArtCustomizer, { CustomizeOptions } from "./components/DotArtCustomizer";
import DotArtPreview from "./components/DotArtPreview";
import ProModePanel from "./components/ProModePanel";
import HistoryPanel from "./components/HistoryPanel";
import Toast from "./components/Toast";
import ImageUploader from "./components/ImageUploader";
import { DotGrid, imageToDotGridPro } from "./lib/dotArt";
import { PALETTES, remapGridToPalette } from "./lib/palettes";
import { HistoryItem, loadHistory, addHistoryItem } from "./lib/history";

export default function Home() {
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
    paletteId: "color",
    bgColor: "#FFFFFF",
    gap: 1,
    dotShape: "square",
    dither: "none",
    edgeEnhance: false,
    outline: false,
  });

  // 현재 팔레트 결정
  const currentPalette = PALETTES.find((p) => p.id === customizeOpts.paletteId)?.colors ?? PALETTES[0].colors;

  // 팔레트 변경 시 기존 그리드 색상 리매핑
  const prevPaletteRef = useRef(customizeOpts.paletteId);
  useEffect(() => {
    if (prevPaletteRef.current !== customizeOpts.paletteId && grid) {
      setGrid(remapGridToPalette(grid, currentPalette));
    }
    prevPaletteRef.current = customizeOpts.paletteId;
  }, [customizeOpts.paletteId, currentPalette]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleImageConvert = useCallback((convertedGrid: DotGrid) => {
    setGrid(convertedGrid);
    setRawProImageUrl(null);
    setHistory(addHistoryItem(historyRef.current, convertedGrid, "auto", "사진 변환"));
    setToast({ message: "사진이 도트 아트로 변환되었습니다!", type: "success" });
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

  // gridSize/palette 변경 시 캐싱된 AI 이미지로 자동 재변환
  useEffect(() => {
    if (!rawProImageUrl) return;
    const img = new Image();
    img.onload = () => {
      const newGrid = imageToDotGridPro(img, customizeOpts.gridSize, currentPalette);
      setGrid(newGrid);
    };
    img.src = rawProImageUrl;
  }, [customizeOpts.gridSize, rawProImageUrl, currentPalette]);

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
        <div className="flex gap-6">
          {/* 왼쪽: 입력 & 옵션 */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* AI 생성 */}
            <ProModePanel
              gridSize={customizeOpts.gridSize}
              onGenerate={handleProGenerate}
              onError={(msg) => setToast({ message: msg, type: "error" })}
            />

            {/* 사진 → 도트 아트 */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <h2 className="text-base font-semibold text-gray-900 mb-4">
                <span className="flex items-center gap-2">
                  <ImageIcon size={18} className="text-indigo-500" />
                  사진 → 도트 아트
                </span>
              </h2>
              <ImageUploader
                gridSize={customizeOpts.gridSize}
                palette={currentPalette}
                dither={customizeOpts.dither}
                edgeEnhance={customizeOpts.edgeEnhance}
                outline={customizeOpts.outline}
                onConvert={handleImageConvert}
                onError={(msg) => setToast({ message: msg, type: "error" })}
              />
            </div>

            {/* 커스터마이징 */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <h2 className="text-base font-semibold text-gray-900 mb-4">커스터마이징</h2>
              <DotArtCustomizer
                options={customizeOpts}
                onChange={setCustomizeOpts}
              />
            </div>
          </div>

          {/* 가운데: 미리보기 */}
          <div className="hidden lg:block lg:sticky lg:top-8 lg:self-start w-[340px] shrink-0">
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <h2 className="text-base font-semibold text-gray-900 mb-4">미리보기</h2>
              <DotArtPreview
                grid={grid}
                options={{
                  gap: customizeOpts.gap,
                  dotShape: customizeOpts.dotShape,
                  bgColor: customizeOpts.bgColor,
                }}
                onError={(msg) => setToast({ message: msg, type: "error" })}
              />
            </div>
          </div>

          {/* 오른쪽: 히스토리 사이드바 */}
          <div className="hidden lg:block lg:sticky lg:top-8 lg:self-start w-[88px] shrink-0" style={{ maxHeight: "calc(100vh - 120px)" }}>
            <HistoryPanel
              history={history}
              onLoad={handleHistoryLoad}
              onHistoryChange={setHistory}
            />
          </div>
        </div>

        {/* 모바일: 미리보기 + 히스토리 (하단) */}
        <div className="lg:hidden mt-6 space-y-4">
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

        {/* Footer */}
        <footer className="mt-16 border-t border-gray-100 pt-8 pb-12 text-center text-xs text-gray-400">
          <p>Dot Art Studio - 무료 도트 아트 생성기</p>
          <div className="mt-2 flex justify-center gap-4">
            <a href="/privacy" className="hover:text-gray-600 transition-colors">개인정보처리방침</a>
            <a href="/terms" className="hover:text-gray-600 transition-colors">이용약관</a>
          </div>
        </footer>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </main>
  );
}
