"use client";

import { CloudUpload, AlertCircle } from "lucide-react";
import { useCallback, useState } from "react";
import { SUPPORTED_FORMATS } from "../lib/fileUtils";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

interface DropZoneProps {
  onFilesAdded: (files: File[]) => void;
}

export default function DropZone({ onFilesAdded }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => {
    setError(null);
  };

  const validateAndAddFiles = useCallback(
    (files: File[]) => {
      setError(null);
      const validFiles: File[] = [];
      const errors: string[] = [];

      for (const file of files) {
        const ext = file.name.split(".").pop()?.toUpperCase() || "";

        if (!SUPPORTED_FORMATS.includes(ext)) {
          errors.push(`"${file.name}" - 지원하지 않는 형식입니다 (${ext})`);
          continue;
        }

        if (file.size > MAX_FILE_SIZE) {
          errors.push(`"${file.name}" - 100MB를 초과합니다`);
          continue;
        }

        validFiles.push(file);
      }

      if (errors.length > 0) {
        setError(errors.join("\n"));
        setTimeout(() => setError(null), 4000);
      }

      if (validFiles.length > 0) {
        onFilesAdded(validFiles);
      }
    },
    [onFilesAdded]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        validateAndAddFiles(files);
      }
    },
    [validateAndAddFiles]
  );

  const handleFileSelect = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = ".png,.jpg,.jpeg,.heic,.webp,.gif";
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        validateAndAddFiles(Array.from(target.files));
      }
    };
    input.click();
  }, [validateAndAddFiles]);

  return (
    <div className="flex flex-col gap-2">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`h-40 md:h-[340px] flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-colors ${
          isDragOver
            ? "border-[var(--file-accent)] bg-[#F973160D]"
            : "border-[var(--file-primary)] bg-[#0D6E6E08]"
        }`}
      >
        <CloudUpload
          className="h-10 w-10 md:h-14 md:w-14 text-[var(--file-primary)]"
          strokeWidth={1.5}
        />
        <p className="hidden md:block text-lg text-[var(--file-text)]">
          파일을 여기에 끌어놓거나
        </p>
        <button
          onClick={handleFileSelect}
          className="rounded-lg bg-[var(--file-accent)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#EA6C0E]"
        >
          파일 선택
        </button>
        <p className="text-[13px] text-[#A8A29E]">
          최대 100MB &middot; PNG, JPG, HEIC, WEBP, GIF
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div
          onClick={clearError}
          className="flex items-start gap-2 rounded-lg bg-[#FEF2F2] border border-[#FECACA] px-4 py-3 cursor-pointer"
        >
          <AlertCircle size={16} className="shrink-0 mt-0.5 text-[#DC2626]" />
          <div className="flex flex-col gap-0.5">
            {error.split("\n").map((line, i) => (
              <span key={i} className="text-sm text-[#DC2626]">
                {line}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
