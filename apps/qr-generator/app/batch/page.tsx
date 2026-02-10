'use client';

import { useState, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  Layers,
  Download,
  Trash2,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { generateQR } from '../lib/qr';

const MAX_ITEMS = 50;
const SIZE_OPTIONS = [
  { label: '200px', value: 200 },
  { label: '400px', value: 400 },
];

interface QRItem {
  index: number;
  text: string;
  dataUrl: string;
}

function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(',');
  const mime = parts[0].match(/:(.*?);/)?.[1] ?? 'image/png';
  const bstr = atob(parts[1]);
  const u8arr = new Uint8Array(bstr.length);
  for (let i = 0; i < bstr.length; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }
  return new Blob([u8arr], { type: mime });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function padNumber(num: number, length: number): string {
  return String(num).padStart(length, '0');
}

export default function BatchPage() {
  const [inputText, setInputText] = useState('');
  const [qrSize, setQrSize] = useState(200);
  const [generatedItems, setGeneratedItems] = useState<QRItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const abortRef = useRef(false);

  const lines = inputText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  const lineCount = lines.length;

  const handleGenerate = useCallback(async () => {
    if (lineCount === 0 || isGenerating) return;

    const items = lines.slice(0, MAX_ITEMS);
    setIsGenerating(true);
    setGeneratedItems([]);
    setProgress({ current: 0, total: items.length });
    abortRef.current = false;

    const results: QRItem[] = [];

    for (let i = 0; i < items.length; i++) {
      if (abortRef.current) break;

      try {
        const dataUrl = await generateQR(items[i], {
          width: qrSize,
          darkColor: '#111827',
          lightColor: '#FFFFFF',
          errorCorrectionLevel: 'M',
        });
        results.push({ index: i + 1, text: items[i], dataUrl });
      } catch {
        // Skip failed items
      }

      setProgress({ current: i + 1, total: items.length });
      setGeneratedItems([...results]);
    }

    setIsGenerating(false);
  }, [inputText, qrSize, lineCount, isGenerating, lines]);

  const handleDownloadSingle = (item: QRItem) => {
    const blob = dataUrlToBlob(item.dataUrl);
    const padLen = String(generatedItems.length).length;
    downloadBlob(blob, `qr-${padNumber(item.index, padLen)}.png`);
  };

  const handleDownloadAll = async () => {
    if (generatedItems.length === 0) return;

    const padLen = String(generatedItems.length).length;

    for (let i = 0; i < generatedItems.length; i++) {
      const item = generatedItems[i];
      const blob = dataUrlToBlob(item.dataUrl);
      downloadBlob(blob, `qr-${padNumber(item.index, padLen)}.png`);
      // Small delay between downloads to prevent browser blocking
      if (i < generatedItems.length - 1) {
        await new Promise((r) => setTimeout(r, 200));
      }
    }
  };

  const handleDownloadMerged = () => {
    if (generatedItems.length === 0) return;

    const cols = Math.min(generatedItems.length, 4);
    const rows = Math.ceil(generatedItems.length / cols);
    const padding = 16;
    const labelHeight = 24;
    const cellSize = qrSize + padding;
    const canvasWidth = cols * cellSize + padding;
    const canvasHeight = rows * (cellSize + labelHeight) + padding;

    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    let loaded = 0;
    const images: HTMLImageElement[] = [];

    generatedItems.forEach((item, idx) => {
      const img = new window.Image();
      img.onload = () => {
        loaded++;
        images[idx] = img;
        if (loaded === generatedItems.length) {
          // Draw all images
          images.forEach((loadedImg, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = padding + col * cellSize;
            const y = padding + row * (cellSize + labelHeight);

            ctx.drawImage(loadedImg, x, y, qrSize, qrSize);

            // Draw label
            ctx.fillStyle = '#6B7280';
            ctx.font = '11px sans-serif';
            ctx.textAlign = 'center';
            const labelText =
              generatedItems[i].text.length > 30
                ? generatedItems[i].text.slice(0, 27) + '...'
                : generatedItems[i].text;
            ctx.fillText(
              labelText,
              x + qrSize / 2,
              y + qrSize + labelHeight - 6
            );
          });

          canvas.toBlob((blob) => {
            if (blob) {
              const timestamp = new Date()
                .toISOString()
                .replace(/[-:T]/g, '')
                .slice(0, 14);
              downloadBlob(blob, `qr-batch-${timestamp}.png`);
            }
          }, 'image/png');
        }
      };
      img.src = item.dataUrl;
    });
  };

  const handleReset = () => {
    abortRef.current = true;
    setInputText('');
    setGeneratedItems([]);
    setProgress({ current: 0, total: 0 });
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-14 gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">QR 생성기로 돌아가기</span>
              <span className="sm:hidden">돌아가기</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Title */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--qr-primary)] text-white">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900">
              QR코드 대량 생성
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5">
              여러 URL/텍스트를 한 번에 QR코드로 변환
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Input Section */}
          <div className="flex-1 flex flex-col gap-5">
            {/* Textarea */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="batch-input"
                  className="text-sm font-semibold text-zinc-700"
                >
                  URL / 텍스트 입력
                </label>
                <span
                  className={`text-xs font-medium ${
                    lineCount > MAX_ITEMS
                      ? 'text-red-500'
                      : 'text-zinc-400'
                  }`}
                >
                  {lineCount} / {MAX_ITEMS}개
                </span>
              </div>
              <textarea
                id="batch-input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  'URL 또는 텍스트를 한 줄에 하나씩 입력하세요\nhttps://example.com\nhttps://google.com'
                }
                rows={8}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--qr-primary)] focus:border-transparent transition resize-none font-mono leading-relaxed"
              />
              {lineCount > MAX_ITEMS && (
                <p className="text-xs text-red-500">
                  최대 {MAX_ITEMS}개까지만 생성됩니다. 처음 {MAX_ITEMS}개만
                  처리됩니다.
                </p>
              )}
            </div>

            {/* Options */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-zinc-700">
                QR 옵션
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-sm text-zinc-500 w-16 shrink-0">
                  크기
                </span>
                <div className="flex gap-2">
                  {SIZE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setQrSize(opt.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        qrSize === opt.value
                          ? 'bg-[var(--qr-primary)] text-white'
                          : 'bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-zinc-500 w-16 shrink-0">
                  색상
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded border border-zinc-200 bg-[#111827]" />
                  <span className="text-xs text-zinc-400">전경 #111827</span>
                  <div className="w-6 h-6 rounded border border-zinc-200 bg-white ml-2" />
                  <span className="text-xs text-zinc-400">배경 #FFFFFF</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-zinc-500 w-16 shrink-0">
                  보정
                </span>
                <span className="text-sm text-zinc-600">M (15%)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleGenerate}
                disabled={lineCount === 0 || isGenerating}
                className="flex-1 h-12 rounded-xl bg-[var(--qr-primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>
                      {progress.current} / {progress.total} 생성 중...
                    </span>
                  </>
                ) : (
                  <>
                    <Layers className="w-4 h-4" />
                    <span>일괄 생성</span>
                  </>
                )}
              </button>
              <button
                onClick={handleReset}
                className="h-12 px-4 rounded-xl border border-zinc-200 bg-white text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors cursor-pointer flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">초기화</span>
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="flex-1 flex flex-col gap-4">
            {generatedItems.length > 0 && (
              <>
                {/* Download Controls */}
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-zinc-700">
                    생성 결과 ({generatedItems.length}개)
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDownloadMerged}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-medium text-zinc-600 hover:bg-zinc-50 transition-colors cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      한 장에 모아보기
                    </button>
                    <button
                      onClick={handleDownloadAll}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--qr-primary)] text-xs font-medium text-white hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      전체 다운로드
                    </button>
                  </div>
                </div>

                {/* QR Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {generatedItems.map((item) => (
                    <div
                      key={item.index}
                      className="flex flex-col items-center bg-white rounded-xl border border-zinc-200 p-3 gap-2"
                    >
                      <img
                        src={item.dataUrl}
                        alt={`QR-${item.index}`}
                        className="w-full aspect-square object-contain"
                      />
                      <p
                        className="text-[11px] text-zinc-500 text-center w-full truncate px-1"
                        title={item.text}
                      >
                        {item.text}
                      </p>
                      <button
                        onClick={() => handleDownloadSingle(item)}
                        className="w-full flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-medium text-zinc-500 hover:text-[var(--qr-primary)] hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        다운로드
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {generatedItems.length === 0 && !isGenerating && (
              <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
                <Layers className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm">
                  왼쪽에 URL/텍스트를 입력하고
                </p>
                <p className="text-sm">&quot;일괄 생성&quot; 버튼을 눌러주세요</p>
              </div>
            )}

            {isGenerating && generatedItems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
                <Loader2 className="w-10 h-10 animate-spin mb-3 text-[var(--qr-primary)]" />
                <p className="text-sm">QR코드 생성 중...</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
