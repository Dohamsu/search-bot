"use client";

import { useState, useCallback, useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import NavBar from "./components/NavBar";
import DropZone from "./components/DropZone";
import FormatSelector from "./components/FormatSelector";
import FileList from "./components/FileList";
import PopularCard from "./components/PopularCard";
import BottomTabBar from "./components/BottomTabBar";
import { generateId, getFileExtension } from "./lib/fileUtils";
import { convertImage, isImageConversion } from "./lib/converter";
import type { FileItem } from "./lib/fileUtils";

const popularConversions = [
  { from: "PDF", to: "DOCX", variant: "red" as const },
  { from: "PNG", to: "JPG", variant: "blue" as const },
  { from: "HEIC", to: "PNG", variant: "green" as const },
];

export default function Home() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [fromFormat, setFromFormat] = useState("PDF");
  const [toFormat, setToFormat] = useState("DOCX");
  const [isConverting, setIsConverting] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Cleanup object URLs on unmount to prevent memory leaks
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
    async (file: FileItem, from: string, to: string) => {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id ? { ...f, status: "converting", progress: 0, errorMessage: undefined } : f
        )
      );

      if (isImageConversion(from, to)) {
        try {
          const result = await convertImage(file.file, to);
          if (result) {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === file.id
                  ? { ...f, status: "done", progress: 100, outputUrl: result.url, convertedExt: to.toLowerCase() }
                  : f
              )
            );
          } else {
            // convertImage returned null -- source file is not a supported image
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
        // Non-image conversion: not supported in the browser -- show error after brief simulated progress
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

    for (const file of pendingFiles) {
      await convertSingleFile(file, fromFormat, toFormat);
    }

    setIsConverting(false);
  }, [files, fromFormat, toFormat, convertSingleFile]);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--file-bg)]">
      {/* Desktop NavBar */}
      <NavBar />

      {/* Mobile AppBar */}
      <div className="flex md:hidden h-14 items-center justify-center border-b border-[#E7E5E4] bg-white">
        <span className="text-lg font-bold text-[var(--file-primary)]">
          FileFlow
        </span>
      </div>

      {/* Mobile Tabs */}
      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content */}
      <div className="flex flex-1 flex-col md:flex-row gap-8 p-4 md:p-10">
        {/* Main Column */}
        <div className="flex flex-1 flex-col gap-6">
          <DropZone onFilesAdded={handleFilesAdded} />

          <FormatSelector
            fromFormat={fromFormat}
            toFormat={toFormat}
            onFromChange={setFromFormat}
            onToChange={setToFormat}
            onConvert={handleConvert}
            isConverting={isConverting}
          />

          <FileList
            files={files}
            onDelete={handleDeleteFile}
            onRetry={handleRetryFile}
          />

          {/* Mobile privacy badge */}
          <div className="flex md:hidden items-center justify-center gap-2 rounded-lg bg-[#F5F5F4] px-4 py-3">
            <ShieldCheck size={16} className="text-[var(--file-primary)]" />
            <span className="text-xs text-[#78716C]">
              모든 파일은 1시간 후 자동 삭제됩니다
            </span>
          </div>
        </div>

        {/* Side Panel - Desktop only */}
        <div className="hidden md:flex w-[280px] shrink-0 flex-col gap-4">
          <h3 className="text-sm font-semibold text-[var(--file-text)]">
            인기 변환
          </h3>
          {popularConversions.map((conv) => (
            <PopularCard
              key={`${conv.from}-${conv.to}`}
              from={conv.from}
              to={conv.to}
              variant={conv.variant}
              onClick={handlePopularCardClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
