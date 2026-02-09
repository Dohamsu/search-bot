"use client";

import { useState, useCallback, useEffect } from "react";
import { ShieldCheck, Lock } from "lucide-react";
import NavBar from "./components/NavBar";
import DropZone from "./components/DropZone";
import FormatSelector from "./components/FormatSelector";
import ConvertOptions from "./components/ConvertOptions";
import FileList from "./components/FileList";
import PopularCard from "./components/PopularCard";
import BottomTabBar from "./components/BottomTabBar";
import { generateId, getFileExtension } from "./lib/fileUtils";
import { convertImage, isImageConversion } from "./lib/converter";
import type { FileItem } from "./lib/fileUtils";
import type { ConvertOptions as ConvertOptionsType } from "./lib/converter";

const popularConversions = [
  { from: "PDF", to: "DOCX", variant: "red" as const },
  { from: "PNG", to: "JPG", variant: "blue" as const },
  { from: "HEIC", to: "PNG", variant: "green" as const },
];

export default function Home() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [fromFormat, setFromFormat] = useState("PNG");
  const [toFormat, setToFormat] = useState("JPG");
  const [isConverting, setIsConverting] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const [quality, setQuality] = useState(0.92);
  const [maxWidth, setMaxWidth] = useState<number | undefined>(undefined);
  const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);

  useEffect(() => {
    return () => {
      files.forEach((f) => {
        if (f.outputUrl) {
          URL.revokeObjectURL(f.outputUrl);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showQualitySlider =
    isImageConversion(fromFormat, toFormat) &&
    (toFormat.toUpperCase() === "JPG" || toFormat.toUpperCase() === "WEBP");

  const showConvertOptions = isImageConversion(fromFormat, toFormat);

  const handleFilesAdded = useCallback((newFiles: File[]) => {
    const items: FileItem[] = newFiles.map((file) => ({
      id: generateId(),
      name: file.name,
      size: file.size,
      type: getFileExtension(file.name),
      status: "pending" as const,
      progress: 0,
      file,
    }));
    setFiles((prev) => [...prev, ...items]);
  }, []);

  const handleDeleteFile = useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.outputUrl) {
        URL.revokeObjectURL(file.outputUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const handleRetryFile = useCallback((id: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, status: "pending" as const, progress: 0, errorMessage: undefined, outputUrl: undefined }
          : f
      )
    );
  }, []);

  const handlePopularCardClick = useCallback((from: string, to: string) => {
    setFromFormat(from);
    setToFormat(to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const convertSingleFile = useCallback(
    async (file: FileItem, from: string, to: string, options?: ConvertOptionsType) => {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id ? { ...f, status: "converting", progress: 0, errorMessage: undefined } : f
        )
      );

      if (isImageConversion(from, to)) {
        try {
          const result = await convertImage(file.file, to, options);
          if (result) {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === file.id
                  ? { ...f, status: "done", progress: 100, outputUrl: result.url, convertedExt: to.toLowerCase() }
                  : f
              )
            );
          } else {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === file.id
                  ? {
                      ...f,
                      status: "error",
                      progress: 0,
                      errorMessage: `${file.type} -> ${to} 이미지 변환을 지원하지 않습니다`,
                    }
                  : f
              )
            );
          }
        } catch {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id
                ? { ...f, status: "error", progress: 0, errorMessage: "변환 중 오류가 발생했습니다" }
                : f
            )
          );
        }
      } else {
        await new Promise<void>((resolve) => {
          let progress = 0;
          const interval = setInterval(() => {
            progress += Math.random() * 25 + 10;
            if (progress >= 60) {
              clearInterval(interval);
              setFiles((prev) =>
                prev.map((f) =>
                  f.id === file.id
                    ? {
                        ...f,
                        status: "error",
                        progress: 0,
                        errorMessage: `${from} -> ${to} 변환은 Pro 기능입니다 (서버 변환 필요)`,
                      }
                    : f
                )
              );
              resolve();
            } else {
              setFiles((prev) =>
                prev.map((f) =>
                  f.id === file.id ? { ...f, progress: Math.round(progress) } : f
                )
              );
            }
          }, 300);
        });
      }
    },
    []
  );

  const handleConvert = useCallback(async () => {
    const pendingFiles = files.filter((f) => f.status === "pending");
    if (pendingFiles.length === 0) return;

    setIsConverting(true);

    const options: ConvertOptionsType = {
      quality,
      maxWidth,
      maxHeight,
      maintainAspectRatio,
    };

    for (const file of pendingFiles) {
      await convertSingleFile(file, fromFormat, toFormat, options);
    }

    setIsConverting(false);
  }, [files, fromFormat, toFormat, quality, maxWidth, maxHeight, maintainAspectRatio, convertSingleFile]);

  return (
    <main className="flex min-h-screen flex-col bg-[var(--file-bg)]">
      <NavBar />

      <div className="flex md:hidden h-14 items-center justify-center border-b border-[#E7E5E4] bg-white">
        <span className="text-lg font-bold text-[var(--file-primary)]">
          FileFlow
        </span>
      </div>

      <h1 className="sr-only">무료 온라인 파일 변환기 - PNG, JPG, WebP, HEIC 이미지 변환</h1>

      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex flex-1 flex-col md:flex-row gap-8 p-4 md:p-10">
        <section className="flex flex-1 flex-col gap-6" aria-label="파일 변환">
          <DropZone onFilesAdded={handleFilesAdded} />

          <FormatSelector
            fromFormat={fromFormat}
            toFormat={toFormat}
            onFromChange={setFromFormat}
            onToChange={setToFormat}
            onConvert={handleConvert}
            isConverting={isConverting}
          />

          {showConvertOptions && (
            <ConvertOptions
              quality={quality}
              maxWidth={maxWidth}
              maxHeight={maxHeight}
              maintainAspectRatio={maintainAspectRatio}
              onQualityChange={setQuality}
              onMaxWidthChange={setMaxWidth}
              onMaxHeightChange={setMaxHeight}
              onMaintainAspectRatioChange={setMaintainAspectRatio}
              showQuality={showQualitySlider}
            />
          )}

          <FileList
            files={files}
            onDelete={handleDeleteFile}
            onRetry={handleRetryFile}
          />

          <div className="flex items-center justify-center gap-2.5 rounded-xl border border-[#D1FAE5] bg-[#ECFDF5] px-4 py-3.5" role="status">
            <div className="relative">
              <ShieldCheck size={20} className="text-[#059669]" aria-hidden="true" />
              <Lock
                size={8}
                className="absolute -bottom-0.5 -right-0.5 text-[#059669] animate-pulse"
                aria-hidden="true"
              />
            </div>
            <span className="text-sm font-medium text-[#065F46]">
              100% 브라우저 처리 - 파일이 서버에 업로드되지 않습니다
            </span>
          </div>
        </section>

        <aside className="hidden md:flex w-[280px] shrink-0 flex-col gap-4" aria-label="인기 변환">
          <h2 className="text-sm font-semibold text-[var(--file-text)]">
            인기 변환
          </h2>
          {popularConversions.map((conv) => (
            <PopularCard
              key={`${conv.from}-${conv.to}`}
              from={conv.from}
              to={conv.to}
              variant={conv.variant}
              onClick={handlePopularCardClick}
            />
          ))}
        </aside>
      </div>

      <footer className="mt-auto border-t border-[#E7E5E4] bg-transparent py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-xs text-[#78716C]">
          <span>© 2025 FileFlow</span>
          <div className="flex items-center gap-4">
            <a
              href="/privacy"
              className="hover:text-[var(--file-primary)] hover:underline transition-colors"
            >
              개인정보처리방침
            </a>
            <a
              href="/terms"
              className="hover:text-[var(--file-primary)] hover:underline transition-colors"
            >
              이용약관
            </a>
            <a
              href="mailto:rlawlsdnjswk@gmail.com"
              className="hover:text-[var(--file-primary)] hover:underline transition-colors"
            >
              문의: rlawlsdnjswk@gmail.com
            </a>
          </div>
        </div>
      </footer>

    </main>
  );
}
