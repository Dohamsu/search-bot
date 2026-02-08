'use client';

import { Download, Share2 } from 'lucide-react';

interface QRPreviewProps {
  qrDataUrl: string | null;
  inputValue: string;
  onToast?: (msg: string) => void;
}

export default function QRPreview({ qrDataUrl, inputValue, onToast }: QRPreviewProps) {
  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = `qr-${Date.now()}.png`;
    link.href = qrDataUrl;
    link.click();
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

        {/* QR Image Area */}
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

        {/* Action Buttons */}
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
