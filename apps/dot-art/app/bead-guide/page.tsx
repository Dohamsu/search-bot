"use client";

import { useState, useEffect, useMemo } from "react";
import { Printer, ArrowLeft, Grid3x3 } from "lucide-react";
import { gridToBeadGuide, gridToBeadGrid, getTotalBeadCount } from "../lib/beadMapping";
import { HistoryItem } from "../lib/history";

function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}

export default function BeadGuidePage() {
  const [grid, setGrid] = useState<(string | null)[][] | null>(null);
  const [label, setLabel] = useState("도트 아트");
  const [showCodes, setShowCodes] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("dot-art-history");
      if (raw) {
        const items: HistoryItem[] = JSON.parse(raw);
        if (items.length > 0) {
          setGrid(items[0].grid);
          setLabel(items[0].label);
        }
      }
    } catch { /* empty */ }
  }, []);

  const beadGuide = useMemo(() => (grid ? gridToBeadGuide(grid) : []), [grid]);
  const beadGrid = useMemo(() => (grid ? gridToBeadGrid(grid) : []), [grid]);
  const totalCount = useMemo(() => (grid ? getTotalBeadCount(grid) : 0), [grid]);

  if (!grid) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔮</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">도트 아트가 없습니다</h1>
          <p className="text-gray-500 mb-6">먼저 도트 아트를 생성해주세요</p>
          <a href="/" className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-600">
            <ArrowLeft size={18} />
            도트 아트 만들기
          </a>
        </div>
      </main>
    );
  }

  const gridSize = grid.length;
  // 셀 크기 계산 (인쇄 시 적절한 크기)
  const cellSize = Math.min(32, Math.floor(600 / gridSize));

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header — 인쇄 시 숨김 */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm print:hidden">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors">
              <ArrowLeft size={20} />
            </a>
            <div>
              <h1 className="text-lg font-bold text-gray-900">비즈공예 도안</h1>
              <p className="text-xs text-gray-400">&ldquo;{label}&rdquo; 비즈 도안</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={showCodes}
                onChange={(e) => setShowCodes(e.target.checked)}
                className="rounded border-gray-300 text-indigo-500"
              />
              번호 표시
            </label>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white shadow-md hover:bg-indigo-600 transition-colors"
            >
              <Printer size={18} />
              인쇄 / PDF
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 print:px-0 print:py-0">
        {/* 인쇄용 제목 */}
        <div className="hidden print:block mb-4">
          <h1 className="text-xl font-bold">비즈공예 도안 — &ldquo;{label}&rdquo;</h1>
          <p className="text-sm text-gray-500">{gridSize}&times;{gridSize} &middot; 총 {totalCount}개 비즈</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:grid-cols-1">
          {/* 비즈 도안 격자 */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 print:shadow-none print:border-0 print:p-0">
              <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2 print:hidden">
                <Grid3x3 size={18} className="text-indigo-500" />
                비즈 도안
              </h2>
              <div className="overflow-auto">
                <table className="border-collapse" style={{ borderSpacing: 0 }}>
                  <tbody>
                    {beadGrid.map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        {row.map((bead, colIdx) => (
                          <td
                            key={colIdx}
                            style={{
                              width: cellSize,
                              height: cellSize,
                              minWidth: cellSize,
                              minHeight: cellSize,
                              backgroundColor: bead ? bead.hex : "#f9fafb",
                              border: "1px solid #e5e7eb",
                              textAlign: "center",
                              verticalAlign: "middle",
                              fontSize: Math.max(8, cellSize * 0.3),
                              lineHeight: 1,
                              padding: 0,
                              color: bead ? (isLightColor(bead.hex) ? "#333" : "#fff") : "#ddd",
                              fontWeight: 600,
                            }}
                          >
                            {showCodes && bead ? bead.code : ""}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 재료표 */}
          <div>
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 print:shadow-none print:border print:border-gray-300">
              <h2 className="text-base font-semibold text-gray-900 mb-4">재료표</h2>
              <div className="mb-3 p-3 rounded-xl bg-indigo-50 text-center">
                <p className="text-2xl font-bold text-indigo-600">{totalCount}</p>
                <p className="text-xs text-indigo-400">총 비즈 수</p>
              </div>
              <div className="space-y-1.5 max-h-96 overflow-auto print:max-h-none">
                {beadGuide.map((item) => (
                  <div key={item.code} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 print:hover:bg-transparent">
                    <div
                      className="w-6 h-6 rounded-md border border-gray-200 flex-shrink-0"
                      style={{ backgroundColor: item.hex }}
                    />
                    <span className="text-xs font-mono font-semibold text-gray-700 w-10">{item.code}</span>
                    <span className="text-xs text-gray-500 flex-1">{item.name}</span>
                    <span className="text-sm font-bold text-gray-900">{item.count}개</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 사용 팁 */}
            <div className="mt-4 rounded-2xl bg-white p-6 shadow-sm border border-gray-100 print:shadow-none print:border print:border-gray-300">
              <h2 className="text-base font-semibold text-gray-900 mb-3">사용 팁</h2>
              <ul className="text-xs text-gray-500 space-y-2">
                <li>• 아이로비즈 또는 펄러비즈 미니 사용 권장</li>
                <li>• 도안 위에 비즈를 올려 배치하세요</li>
                <li>• 다리미로 중간 열로 5~10초 눌러주세요</li>
                <li>• 완전히 식힌 후 떼어내세요</li>
                <li>• 인쇄 시 &ldquo;실제 크기&rdquo;로 설정하세요</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles — 인쇄 시 배경색 강제 출력 */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      ` }} />
    </main>
  );
}
