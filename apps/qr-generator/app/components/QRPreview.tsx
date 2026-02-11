'use client';

import { useState, useEffect } from 'react';
import { Download, MessageCircle, Link2 } from 'lucide-react';
import { generateQRSvg, type QROptions } from '../lib/qr';
import { initKakao, shareViaKakao } from '../lib/kakaoShare';

interface QRPreviewProps {
  qrDataUrl: string | null;
  inputValue: string;
  qrContent?: string;
  qrOptions?: QROptions;
  onToast?: (msg: string) => void;
}

export default function QRPreview({ qrDataUrl, inputValue, qrContent, qrOptions, onToast }: QRPreviewProps) {
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'svg'>('png');

  useEffect(() => {
    initKakao();
  }, []);

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

  const handleKakaoShare = async () => {
    if (!qrDataUrl) return;

    const result = await shareViaKakao({
      qrTypeName: getQrTypeName(),
      inputSummary: inputValue ? truncate(inputValue, 40) : undefined,
    });

    if (result.success) {
      if (result.method === 'clipboard') {
        onToast?.('카카오톡 공유를 사용할 수 없어 링크가 클립보드에 복사되었습니다');
      } else if (result.method === 'kakao') {
        // 카카오톡 공유 성공 - 별도 토스트 불필요
      } else if (result.method === 'webshare') {
        // Web Share API 성공 - 별도 토스트 불필요
      }
    } else {
      onToast?.('공유에 실패했습니다');
    }
  };

  const handleCopyLink = async () => {
    try {
      const siteUrl = "https://qr.onekit.co.kr";
      await navigator.clipboard.writeText(siteUrl);
      onToast?.('링크가 클립보드에 복사되었습니다');
    } catch {
      onToast?.('복사에 실패했습니다');
    }
  };

  /** QR 콘텐츠에서 QR 유형 이름 추론 */
  const getQrTypeName = (): string => {
    if (!qrContent) return 'QR코드';
    if (qrContent.startsWith('WIFI:')) return 'Wi-Fi';
    if (qrContent.startsWith('BEGIN:VCARD')) return '연락처';
    if (qrContent.startsWith('mailto:')) return '이메일';
    if (qrContent.startsWith('smsto:') || qrContent.startsWith('sms:')) return 'SMS';
    if (qrContent.startsWith('geo:')) return '위치';
    if (qrContent.startsWith('BEGIN:VEVENT')) return '캘린더';
    if (qrContent.startsWith('http://') || qrContent.startsWith('https://')) return 'URL';
    return 'QR코드';
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

        <div className="flex flex-col gap-2 w-full">
          <button
            onClick={handleDownload}
            disabled={!qrDataUrl}
            className="w-full flex items-center justify-center gap-2 h-10 rounded-lg bg-[var(--qr-primary)] text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Download className="w-4 h-4" />
            다운로드
          </button>
          <div className="flex gap-2 w-full">
            <button
              onClick={handleKakaoShare}
              disabled={!qrDataUrl}
              className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg bg-[#FEE500] text-[#3C1E1E] text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              카카오톡 공유
            </button>
            <button
              onClick={handleCopyLink}
              disabled={!qrDataUrl}
              className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-zinc-200 text-zinc-700 text-sm font-medium hover:bg-zinc-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Link2 className="w-4 h-4" />
              링크 복사
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 문자열을 maxLen 이하로 잘라서 반환 */
function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 3) + '...';
}
