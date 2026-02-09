'use client';

import { useState } from 'react';
import { Download, Share2 } from 'lucide-react';
import { generateQRSvg, type QROptions } from '../lib/qr';

interface QRPreviewProps {
  qrDataUrl: string | null;
  inputValue: string;
  qrContent?: string;
  qrOptions?: QROptions;
  onToast?: (msg: string) => void;
}

export default function QRPreview({ qrDataUrl, inputValue, qrContent, qrOptions, onToast }: QRPreviewProps) {
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'svg'>('png');

  const handleDownload = async () => {
    if (!qrDataUrl) return;

    if (downloadFormat === 'svg' && qrContent) {
      try {
        const svgString = await generateQRSvg(qrContent, qrOptions);
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `qr-${Date.now()}.svg`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      } catch {
        onToast?.('SVG 다운로드에 실패했습니다');
      }
    } else {
      const link = document.createElement('a');
      link.download = `qr-${Date.now()}.png`;
      link.href = qrDataUrl;
      link.click();
    }
  };

  const handleShare = async () => {
    if (!qrDataUrl) return;

    if (navigator.share) {
      try {
        const blob = await (await fetch(qrDataUrl)).blob();
        const file = new File([blob], `qr-${Date.now()}.png`, {
          type: 'image/png',
        });
        await navigator.share({
          title: 'QR Code',
          text: inputValue,
          files: [file],
        });
      } catch {
        await copyToClipboard();
      }
    } else {
      await copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inputValue);
      onToast?.('URL이 클립보드에 복사되었습니다');
    } catch {
      onToast?.('복사에 실패했습니다');
    }
  };

  return (
    <div className="w-full lg:w-80 shrink-0">
      <div className="bg-white rounded-xl border border-zinc-200 p-6 flex flex-col items-center gap-5">
        <h3 className="text-sm font-semibold text-zinc-700 self-start">
          QR 미리보기
        </h3>

        <div className="w-[200px] h-[200px] rounded-lg border border-zinc-100 flex items-center justify-center bg-zinc-50">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="Generated QR Code"
              width={200}
              height={200}
              className="rounded"
            />
          ) : (
            <div className="text-zinc-300 text-sm text-center px-4">
              QR코드가 여기에 표시됩니다
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 self-start">
          <span className="text-xs text-zinc-500">다운로드 형식:</span>
          <button
            onClick={() => setDownloadFormat('png')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              downloadFormat === 'png'
                ? 'bg-[var(--qr-primary)] text-white'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            PNG
          </button>
          <button
            onClick={() => setDownloadFormat('svg')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              downloadFormat === 'svg'
                ? 'bg-[var(--qr-primary)] text-white'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            SVG
          </button>
        </div>

        <div className="flex gap-3 w-full">
          <button
            onClick={handleDownload}
            disabled={!qrDataUrl}
            className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg bg-[var(--qr-primary)] text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Download className="w-4 h-4" />
            다운로드
          </button>
          <button
            onClick={handleShare}
            disabled={!qrDataUrl}
            className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg border border-zinc-200 text-zinc-700 text-sm font-medium hover:bg-zinc-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            공유
          </button>
        </div>
      </div>
    </div>
  );
}
