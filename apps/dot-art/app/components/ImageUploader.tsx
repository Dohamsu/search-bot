"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import type { DitherMode } from "../lib/dotArt";

interface ImageUploaderProps {
  gridSize: number;
  palette: string[];
  dither?: DitherMode;
  edgeEnhance?: boolean;
  outline?: boolean;
  onConvert: (grid: import("../lib/dotArt").DotGrid) => void;
  onError: (msg: string) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export default function ImageUploader({ gridSize, palette, dither = "none", edgeEnhance = false, outline = false, onConvert, onError }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        onError("지원하지 않는 파일 형식입니다. (PNG, JPG, WebP, GIF)");
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        onError("파일 크기가 5MB를 초과합니다.");
        return;
      }

      const reader = new FileReader();
      reader.onerror = () => {
        onError("파일을 읽는 중 오류가 발생했습니다.");
      };
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setPreview(dataUrl);

        const img = new Image();
        img.onerror = () => {
          onError("이미지를 불러올 수 없습니다. 다른 파일을 시도해주세요.");
        };
        img.onload = () => {
          import("../lib/dotArt").then(({ imageToDotGrid }) => {
            const grid = imageToDotGrid(img, { gridSize, palette, dither, edgeEnhance, outline });
            onConvert(grid);
          }).catch(() => {
            onError("도트 아트 변환 중 오류가 발생했습니다.");
          });
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    },
    [gridSize, palette, dither, edgeEnhance, outline, onConvert, onError]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const clearPreview = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 cursor-pointer transition-colors ${
          isDragging
            ? "border-indigo-500 bg-indigo-50"
            : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100"
        }`}
      >
        {preview ? (
          <div className="relative">
            <img src={preview} alt="업로드 미리보기" className="max-h-32 rounded-lg" />
            <button
              onClick={(e) => { e.stopPropagation(); clearPreview(); }}
              className="absolute -top-2 -right-2 p-1 rounded-full bg-gray-800 text-white hover:bg-gray-700"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            <Upload size={32} className="text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 font-medium">이미지를 드래그하거나 클릭하여 업로드</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP, GIF · 최대 5MB</p>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
