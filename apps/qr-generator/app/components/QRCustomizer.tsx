'use client';

import { useRef } from 'react';
import { Upload, X, Palette } from 'lucide-react';
import type { QROptions } from '../lib/qr';

interface QRCustomizerProps {
  qrOptions: QROptions;
  onOptionsChange: (options: QROptions) => void;
  logoFile: File | null;
  onLogoChange: (file: File | null) => void;
}

const colorPresets = [
  { label: '기본', dark: '#111827', light: '#FFFFFF' },
  { label: '네이비', dark: '#1E3A5F', light: '#F0F4FF' },
  { label: '포레스트', dark: '#14532D', light: '#F0FDF4' },
  { label: '와인', dark: '#7F1D1D', light: '#FFF1F2' },
  { label: '퍼플', dark: '#581C87', light: '#FAF5FF' },
];

const sizeOptions = [
  { value: 200, label: '200px (기본)' },
  { value: 400, label: '400px' },
  { value: 600, label: '600px' },
  { value: 1000, label: '1000px (고해상도)' },
];

const errorLevels: { value: 'L' | 'M' | 'Q' | 'H'; label: string; desc: string }[] = [
  { value: 'L', label: 'L', desc: '7% 복원' },
  { value: 'M', label: 'M', desc: '15% 복원' },
  { value: 'Q', label: 'Q', desc: '25% 복원' },
  { value: 'H', label: 'H', desc: '30% 복원' },
];

export default function QRCustomizer({
  qrOptions,
  onOptionsChange,
  logoFile,
  onLogoChange,
}: QRCustomizerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = (partial: Partial<QROptions>) => {
    onOptionsChange({ ...qrOptions, ...partial });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onLogoChange(file);
      update({ errorCorrectionLevel: 'H' });
    }
  };

  const removeLogo = () => {
    onLogoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const logoPreviewUrl = logoFile ? URL.createObjectURL(logoFile) : null;

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-5 flex flex-col gap-5">
      <h3 className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
        <Palette className="w-4 h-4" />
        QR 커스터마이징
      </h3>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-zinc-500">색상</span>
          <div className="flex gap-2 flex-wrap">
            {colorPresets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => update({ darkColor: preset.dark, lightColor: preset.light })}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                  qrOptions.darkColor === preset.dark && qrOptions.lightColor === preset.light
                    ? 'border-[var(--qr-primary)] bg-blue-50 text-[var(--qr-primary)]'
                    : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full border border-zinc-300"
                  style={{ backgroundColor: preset.dark }}
                />
                {preset.label}
              </button>
            ))}
          </div>
          <div className="flex gap-4 mt-1">
            <label className="flex items-center gap-2 text-xs text-zinc-600">
              전경색
              <input
                type="color"
                value={qrOptions.darkColor ?? '#111827'}
                onChange={(e) => update({ darkColor: e.target.value })}
                className="w-7 h-7 rounded border border-zinc-200 cursor-pointer p-0.5"
              />
            </label>
            <label className="flex items-center gap-2 text-xs text-zinc-600">
              배경색
              <input
                type="color"
                value={qrOptions.lightColor ?? '#FFFFFF'}
                onChange={(e) => update({ lightColor: e.target.value })}
                className="w-7 h-7 rounded border border-zinc-200 cursor-pointer p-0.5"
              />
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-zinc-500">크기</span>
          <select
            value={qrOptions.width ?? 200}
            onChange={(e) => update({ width: Number(e.target.value) })}
            className="w-full h-9 px-3 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-[var(--qr-primary)] focus:border-transparent transition appearance-none cursor-pointer"
          >
            {sizeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-zinc-500">오류 복원 수준</span>
          <div className="flex gap-2">
            {errorLevels.map((level) => (
              <button
                key={level.value}
                onClick={() => update({ errorCorrectionLevel: level.value })}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                  (qrOptions.errorCorrectionLevel ?? 'M') === level.value
                    ? 'border-[var(--qr-primary)] bg-blue-50 text-[var(--qr-primary)]'
                    : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'
                }`}
              >
                <span className="font-semibold">{level.label}</span>
                <span className="text-[10px] text-zinc-400">{level.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-zinc-500">로고 삽입</span>
          {logoPreviewUrl ? (
            <div className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 bg-zinc-50">
              <img
                src={logoPreviewUrl}
                alt="Logo preview"
                className="w-10 h-10 rounded object-contain"
              />
              <span className="flex-1 text-xs text-zinc-600 truncate">
                {logoFile?.name}
              </span>
              <button
                onClick={removeLogo}
                className="p-1 rounded hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-zinc-500" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 h-10 rounded-lg border border-dashed border-zinc-300 text-xs text-zinc-500 hover:border-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              이미지 업로드 (PNG, JPG, SVG)
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml"
            onChange={handleLogoUpload}
            className="hidden"
          />
          {logoFile && (
            <p className="text-[10px] text-zinc-400">
              로고 사용 시 오류 복원 수준이 H로 설정됩니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
